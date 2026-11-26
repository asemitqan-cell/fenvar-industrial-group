// Supabase Edge Function: fenvar-ai  (deploy with --no-verify-jwt)
// Secret needed: GEMINI_API_KEY   (optional: GEMINI_MODEL, ALLOWED_ORIGINS=comma separated list)
// v7: size caps, per-IP rate limit (soft, per instance), optional origin allow-list, providers cache, no internal errors in responses.
const DEFAULT_ORIGINS = ["https://asemitqan-cell.github.io"];
const CORS_BASE: Record<string, string> = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "600",
  "Cache-Control": "no-store",
  "Vary": "Origin",
};
const SYS=`You are Horizon's assistant inside Horizon, an all-in-one marketplace and services app (furniture, wood, glass, UPVC windows and doors, livestock, used items, translation, services, consulting, offers).
You work like a normal AI chat: ALWAYS write a complete, helpful answer in "answer" for ANY question on ANY topic, even if it has nothing to do with the app. Never leave "answer" empty and never reply only with a category.
Reply in the user's language (Egyptian Arabic if lang=ar, German if lang=de, else English). Keep it clear and reasonably short; use the conversation history for follow-ups.
Only if the user's need is to BUY a product or get consulting from Horizon, also set "category" to one of: furniture, wood, glass, upvc, realestate, cars, food, health, learning, events, perfumes, news, livestock, used, offers, consulting. For translation, general services or general questions set "category" to null.
PROVIDERS: you may receive a PROVIDERS list (approved Horizon listings, already ordered by priority). When the user asks for a product or service that matches some of them, recommend the best matches by (1) suitability to the request, (2) same country/city as the user if they mention or imply one, (3) the list order, which reflects paid priority. Mention title and city, at most 3. Never invent providers or contact details; if none match, say so and suggest sending a request.
If audio is attached, listen and answer it. If an image is attached, describe it and help.
Return ONLY JSON: {"answer": string, "category": string|null}`;
const MAX_BODY=7_000_000,MAX_ATT=5_000_000,PER_MIN=20,PER_HOUR=120;
function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  const configured = Deno.env.get("ALLOWED_ORIGINS");
  const list = configured
    ? configured.split(",").map((x) => x.trim()).filter(Boolean)
    : DEFAULT_ORIGINS;
  return list.includes(origin);
}
function headersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  const h: Record<string, string> = { ...CORS_BASE, "Content-Type": "application/json; charset=utf-8" };
  if (origin && allowedOrigin(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}
const J=(req: Request,o:any,status=200)=>new Response(JSON.stringify(o),{status,headers:headersFor(req)});
function clientAddress(req: Request): string | null {
  const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  if (!ip || ip.length > 64 || ip.includes(String.fromCharCode(10)) || ip.includes(String.fromCharCode(13))) return null;
  return ip;
}
async function limited(ip: string, limit: number, windowSeconds: number): Promise<boolean> {
  const u = Deno.env.get("SUPABASE_URL");
  const k = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!u || !k) throw new Error("rate_limiter_not_configured");
  const base = u.endsWith("/") ? u.slice(0, -1) : u;
  const r = await fetch(base + "/rest/v1/rpc/hz_ai_consume_rate_limit", {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: k, Authorization: "Bearer " + k },
    body: JSON.stringify({ p_key: ip, p_limit: limit, p_window_seconds: windowSeconds }),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error("rate_limiter_unavailable");
  return (await r.json()) === true;
}
function mediaPart(value: unknown): any | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") throw new Error("invalid_media");
  const m = /^data:([^;]+)(?:;[^,]*)?;base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!m || !OKMIME.test(m[1])) throw new Error("invalid_media");
  let bytes = 0;
  try { bytes = atob(m[2]).length; } catch { throw new Error("invalid_media"); }
  if (bytes > MAX_ATT) throw new Error("attachment_too_large");
  return { inline_data: { mime_type: m[1], data: m[2] } };
}
const OKMIME=/^((image|audio|video)\/[a-z0-9.+-]+|application\/pdf|text\/plain)$/i;
let PV={t:0,v:''};
async function providers(){
  if(Date.now()-PV.t<60_000)return PV.v;
  try{
    const u=Deno.env.get('SUPABASE_URL'),k=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!u||!k)return '';
    const h={apikey:k,Authorization:'Bearer '+k};
    const [a,b]=await Promise.all([
      fetch(u+'/rest/v1/hz_listings?status=eq.approved&select=owner,kind,cat,title,summary,city,price,currency&order=created_at.desc&limit=200',{headers:h}).then(r=>r.json()),
      fetch(u+'/rest/v1/hz_plans?select=user_id,plan,country,paid_until',{headers:h}).then(r=>r.json())]);
    if(!Array.isArray(a))return '';
    const today=new Date().toISOString().slice(0,10),pm:any={};
    for(const p of (Array.isArray(b)?b:[]))pm[p.user_id]=p;
    const rows=a.map((l:any)=>{const p=pm[l.owner]||{};const pro=p.plan==='pro'&&(!p.paid_until||p.paid_until>=today);return {pro,country:p.country||'',l}});
    rows.sort((x:any,y:any)=>Number(y.pro)-Number(x.pro));
    const out=rows.slice(0,40).map((r:any,i:number)=>`${i+1}. [${r.l.kind}/${r.l.cat}] ${r.l.title} - ${r.l.city||''}${r.country?', '+r.country:''}${r.pro?' (PRO)':''}${r.l.summary?' - '+String(r.l.summary).slice(0,80):''}`).join('\n');
    PV={t:Date.now(),v:out};return out;
  }catch(_){return ''}
}
async function gem(model:string,body:any,ms:number){
  const ac=new AbortController();const t=setTimeout(()=>ac.abort(),ms);
  try{
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json','x-goog-api-key':Deno.env.get('GEMINI_API_KEY')!},body:JSON.stringify(body)});
    if(!r.ok)throw new Error('gemini '+r.status+' '+(await r.text()).slice(0,300));
    return await r.json();
  }finally{clearTimeout(t)}
}
Deno.serve(async(req: Request)=>{
  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin");
    return new Response(null, { status: allowedOrigin(origin) ? 204 : 403, headers: headersFor(req) });
  }
  if (!allowedOrigin(req.headers.get("origin"))) return J(req,{error:"origin_not_allowed"},403);
  if (req.method !== "POST") return J(req,{error:"method_not_allowed"},405);
  if (!(req.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return J(req,{error:"content_type_must_be_json"},415);
  }
  if (Number(req.headers.get("content-length") || "0") > MAX_BODY) return J(req,{error:"too_large"},413);

  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY) return J(req,{error:"too_large"},413);
    let inp: any;
    try { inp = JSON.parse(raw); } catch { return J(req,{error:"bad_json"},400); }
    if (!inp || typeof inp !== "object" || Array.isArray(inp)) return J(req,{error:"bad_request"},400);

    const ip = clientAddress(req);
    if (!ip) return J(req,{error:"request_protection_unavailable"},503);
    if (!(await limited(ip,PER_MIN,60))) return J(req,{error:"rate_limited_minute"},429);
    if (!(await limited(ip,PER_HOUR,3600))) return J(req,{error:"rate_limited_hour"},429);

    const q = inp.q == null ? "" : inp.q;
    if (typeof q !== "string" || q.length > 2000) return J(req,{error:"invalid_question"},400);
    const lang = ["ar","en","de"].includes(inp.lang) ? inp.lang : "ar";
    const file = inp.file == null ? "" : inp.file;
    if (typeof file !== "string" || file.length > 160) return J(req,{error:"invalid_file_name"},400);
    const history = inp.history == null ? [] : inp.history;
    if (!Array.isArray(history) || history.length > 10) return J(req,{error:"invalid_history"},400);

    const imagePart = mediaPart(inp.image);
    const audioPart = mediaPart(inp.audio);
    const pv = await providers();
    const prompt = "lang=" + lang + "\n" +
      (pv ? "PROVIDERS:\n" + pv + "\n\n" : "") +
      (q || (file ? "(file: " + file + ")" : ""));
    const parts: any[] = [{ text: prompt }];
    if (imagePart) parts.push(imagePart);
    if (audioPart) parts.push(audioPart);
    const past = history.map((h: any) => {
      if (!h || !["user","model"].includes(h.role) || typeof h.text !== "string") {
        throw new Error("invalid_history_entry");
      }
      return { role: h.role, parts: [{ text: h.text.slice(0,2000) }] };
    });
    const body = {
      system_instruction: { parts: [{ text: SYS }] },
      contents: [...past,{ role:"user",parts }],
      generationConfig: { responseMimeType:"application/json", maxOutputTokens:2048 },
    };
    const models = [Deno.env.get("GEMINI_MODEL") || "gemini-flash-latest","gemini-flash-lite-latest"];
    let j: any = null;
    let err = "";
    for (const model of models) {
      try { j = await gem(model,body,22000); break; }
      catch (e) { err = String(e); }
    }
    if (!j) throw new Error(err || "no_response");
    const t = (j.candidates?.[0]?.content?.parts || []).map((p:any)=>p.text || "").join("") || "{}";
    let o: any;
    try { o = JSON.parse(t); } catch { o = { answer:t,category:null }; }
    const category = typeof o.category === "string" && o.category ? o.category : null;
    const answer = typeof o.answer === "string" ? o.answer.slice(0,6000) : "";
    return J(req,{answer,category});
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "attachment_too_large") return J(req,{error:"attachment_too_large"},413);
    if (msg === "invalid_media" || msg === "invalid_history_entry") return J(req,{error:"invalid_request_payload"},400);
    console.error("fenvar-ai request failed:",msg.slice(0,180));
    return J(req,{error:"ai_unavailable"},503);
  }
});
