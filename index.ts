// Supabase Edge Function: fenvar-ai
// Keep deployed with --no-verify-jwt while the public assistant is available to guests.
// Required secrets: GEMINI_API_KEY. Supabase runtime must provide SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY for the persistent rate-limit RPC in hz-ai-security.sql.

const DEFAULT_ORIGINS = ["https://asemitqan-cell.github.io"];
const CATS = [
  "furniture", "wood", "glass", "upvc", "realestate", "cars", "food", "health",
  "learning", "events", "perfumes", "news", "services", "consulting", "offers",
  "livestock", "used", "religion", "translation",
];
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_MEDIA_BYTES = 2.5 * 1024 * 1024;

const SYS = `You are Horizon's assistant. Horizon is an all-in-one marketplace and services app.
Sections (category ids): furniture (bedrooms & furniture), wood, glass, upvc (UPVC windows, doors, shutters and their accessories), realestate, cars, food, health, learning, events, perfumes, news, services (measurement, installation, repair, technicians), consulting, offers, livestock, used (used & scrap), religion (Quran, adhkar, prayer times, qibla, mosques), translation.

RULES
1. Answer ANY question the user asks, whether or not it relates to Horizon: general knowledge, advice, how-to, math, writing, anything. Never refuse just because it is outside the app. Be brief, friendly and useful.
2. Reply in the user's language: Egyptian Arabic if lang=ar, German if lang=de, otherwise English.
3. If the need matches a section, set "category" to that id and mention in the answer that it is available in that section. If it is a product or service that is NOT in Horizon, still help, then tell the user they can send a request (the "Can't find it? Send a request" button) and Horizon will find it for them. Otherwise category is null.
4. Understand Egyptian colloquial and trade words and think about what the user most likely means in a marketplace. Examples: كالون/كالونه = door lock or latch (category upvc for door hardware, or services if they want it installed or repaired); سيكوريت = tempered glass (glass); شباك/شيش/شتر = window/shutter (upvc); ألوميتال/UPVC = window profiles (upvc); نجار/تركيب/معاينة = services; عفش/أوضة نوم/دولاب = furniture; فيلا/شقة/أرض = realestate; عربية/موتوسيكل = cars; كانتين/أكل بيت = food; ترجمة = translation.
5. Never route to health unless the request is clearly medical (a doctor, medicine, a nurse, a pharmacy). A building or hardware word is never a medical word. If a word is truly ambiguous, pick the marketplace meaning and, in one short sentence, ask what they meant.
6. If audio is attached, listen and answer what is asked in it. If an image is attached, describe what you see and how Horizon can help.
Return ONLY JSON: {"answer": string, "category": string|null}`;

function allowedOrigins(): Set<string> {
  const configured = Deno.env.get("HORIZON_ALLOWED_ORIGINS");
  const values = configured
    ? configured.split(",").map((v) => v.trim()).filter(Boolean)
    : DEFAULT_ORIGINS;
  return new Set(values);
}

function corsFor(req: Request): { headers: Record<string, string>; allowed: boolean } {
  const origin = req.headers.get("origin");
  const allowed = !origin || allowedOrigins().has(origin);
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
  if (origin && allowed) headers["Access-Control-Allow-Origin"] = origin;
  return { headers, allowed };
}

function reply(
  req: Request,
  status: number,
  payload: Record<string, unknown>,
): Response {
  const { headers } = corsFor(req);
  return new Response(JSON.stringify(payload), { status, headers });
}

function clientAddress(req: Request): string | null {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  const real = req.headers.get("x-real-ip")?.trim();
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = cf || real || forwarded || "";
  if (!ip || ip.length > 64 || ip.includes(String.fromCharCode(10)) || ip.includes(String.fromCharCode(13))) return null;
  return ip;
}

async function consumeRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Rate limiter is not configured");
  }
  const response = await fetch(
    `${supabaseUrl.endsWith("/") ? supabaseUrl.slice(0, -1) : supabaseUrl}/rest/v1/rpc/hz_ai_consume_rate_limit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        p_key: key,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      }),
      signal: AbortSignal.timeout(5000),
    },
  );
  if (!response.ok) {
    console.error("Rate limiter RPC failed:", response.status);
    throw new Error("Rate limiter unavailable");
  }
  return (await response.json()) === true;
}

function inlineMedia(value: unknown, kind: "image" | "audio"): { inline_data: { mime_type: string; data: string } } | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") throw new Error("Invalid media payload");
  const comma = value.indexOf(",");
  if (!value.startsWith("data:") || comma < 0) throw new Error("Invalid media encoding");
  const header = value.slice(5, comma);
  if (!header.endsWith(";base64")) throw new Error("Invalid media encoding");
  const mime = header.slice(0, -7).toLowerCase();
  const encoded = value.slice(comma + 1);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) throw new Error("Invalid base64 media");
  const allowed = kind === "image"
    ? ["image/jpeg", "image/png", "image/webp", "image/gif"]
    : ["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4", "audio/aac"];
  if (!allowed.includes(mime)) throw new Error("Unsupported media type");
  let bytes: number;
  try {
    bytes = atob(encoded).length;
  } catch {
    throw new Error("Invalid base64 media");
  }
  if (bytes > MAX_MEDIA_BYTES) throw new Error("Media too large");
  return { inline_data: { mime_type: mime, data: encoded } };
}

async function callGemini(body: string): Promise<any> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("AI provider is not configured");
  let last = "no attempt";
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body,
          signal: AbortSignal.timeout(30000),
        },
      );
      if (response.ok) return await response.json();
      last = `${model} ${response.status}`;
      if (response.status !== 429 && response.status < 500) {
        console.error("Gemini rejected request:", last);
        throw new Error("AI provider rejected request");
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  console.error("Gemini unavailable:", last);
  throw new Error("AI provider unavailable");
}

Deno.serve(async (req: Request) => {
  const { headers, allowed } = corsFor(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: allowed ? 204 : 403, headers });
  }
  if (!allowed) return reply(req, 403, { error: "Origin not allowed" });
  if (req.method !== "POST") return reply(req, 405, { error: "Method not allowed" });

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return reply(req, 415, { error: "Content-Type must be application/json" });
  }
  const declaredLength = Number(req.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return reply(req, 413, { error: "Request too large" });
  }

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return reply(req, 413, { error: "Request too large" });
    }

    let input: any;
    try {
      input = JSON.parse(raw);
    } catch {
      return reply(req, 400, { error: "Invalid JSON" });
    }
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return reply(req, 400, { error: "Invalid request" });
    }

    const ip = clientAddress(req);
    if (!ip) return reply(req, 503, { error: "Request protection unavailable" });

    // Persistent per-IP limits; fail closed if the database-backed limiter is unavailable.
    const minuteAllowed = await consumeRateLimit(ip, 12, 60);
    if (!minuteAllowed) return reply(req, 429, { error: "Too many requests. Try again shortly." });
    const hourAllowed = await consumeRateLimit(ip, 80, 3600);
    if (!hourAllowed) return reply(req, 429, { error: "Hourly request limit reached. Try again later." });

    const q = input.q == null ? "" : input.q;
    if (typeof q !== "string" || q.length > 2000) {
      return reply(req, 400, { error: "Question must be text up to 2000 characters" });
    }
    const lang = ["ar", "en", "de"].includes(input.lang) ? input.lang : "ar";
    const file = input.file == null ? "" : input.file;
    if (typeof file !== "string" || file.length > 160) {
      return reply(req, 400, { error: "Invalid file name" });
    }

    const parts: any[] = [{
      text: "lang=" + lang + String.fromCharCode(10) + (q || (file ? "(file: " + file + ")" : "")),
    }];
    const image = inlineMedia(input.image, "image");
    const audio = inlineMedia(input.audio, "audio");
    if (image) parts.push(image);
    if (audio) parts.push(audio);

    const history = input.history == null ? [] : input.history;
    if (!Array.isArray(history) || history.length > 10) {
      return reply(req, 400, { error: "Invalid conversation history" });
    }
    const past = history.map((entry: any) => {
      if (!entry || !["user", "model"].includes(entry.role) || typeof entry.text !== "string") {
        throw new Error("Invalid conversation history entry");
      }
      return { role: entry.role, parts: [{ text: entry.text.slice(0, 1500) }] };
    });

    const result = await callGemini(JSON.stringify({
      system_instruction: { parts: [{ text: SYS }] },
      contents: [...past, { role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.6 },
    }));
    const answerText = (result.candidates?.[0]?.content?.parts || [])
      .map((part: any) => typeof part.text === "string" ? part.text : "")
      .join("") || "{}";

    let output: any;
    try {
      let cleaned = answerText.trim();
      if (cleaned.startsWith("```")) {
        const firstBreak = cleaned.indexOf(String.fromCharCode(10));
        if (firstBreak >= 0) cleaned = cleaned.slice(firstBreak + 1);
        if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
      }
      output = JSON.parse(cleaned.trim());
    } catch {
      output = { answer: answerText, category: null };
    }
    const category = CATS.includes(output.category) ? output.category : null;
    const answer = typeof output.answer === "string" ? output.answer.slice(0, 6000) : "";
    return new Response(JSON.stringify({ answer, category }), { status: 200, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Media too large") return reply(req, 413, { error: "Media file is too large" });
    if (message === "Unsupported media type") return reply(req, 415, { error: "Unsupported media type" });
    if (message.startsWith("Invalid")) return reply(req, 400, { error: "Invalid request payload" });
    console.error("fenvar-ai request failed:", message || "unknown error");
    return reply(req, 503, { error: "The assistant is temporarily unavailable. Please try again." });
  }
});
