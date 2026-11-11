// Supabase Edge Function: fenvar-ai  (deploy with --no-verify-jwt)
// Secret needed: GEMINI_API_KEY
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
const CATS=['furniture','wood','glass','upvc','realestate','cars','food','health','learning','events','perfumes','news','services','consulting','offers','livestock','used','religion','translation'];
const MODELS=['gemini-2.5-flash','gemini-2.5-flash-lite','gemini-2.0-flash'];
const SYS=`You are Horizon's assistant. Horizon is an all-in-one marketplace and services app.
Sections (category ids): furniture (bedrooms & furniture), wood, glass, upvc (UPVC windows, doors, shutters and their accessories), realestate, cars, food, health, learning, events, perfumes, news, services (measurement, installation, repair, technicians), consulting, offers, livestock, used (used & scrap), religion (Quran, adhkar, prayer times, qibla, mosques), translation.

RULES
1. Answer ANY question the user asks, whether or not it relates to Horizon: general knowledge, advice, how-to, math, writing, anything. Never refuse just because it is outside the app. Be brief, friendly and useful.
2. Reply in the user's language: Egyptian Arabic if lang=ar, German if lang=de, otherwise English.
3. If the need matches a section, set "category" to that id and mention in the answer that it is available in that section. If it is a product or service that is NOT in Horizon, still help, then tell the user they can send a request (the "Can't find it? Send a request" button) and Horizon will find it for them. Otherwise category is null.
4. Understand Egyptian colloquial and trade words and think about what the user most likely means in a marketplace. Examples: كالون/كالونه = door lock or latch (category upvc for door hardware, or services if they want it installed or repaired); سيكوريت = tempered glass (glass); شباك/شيش/شتر = window/shutter (upvc); ألوميتال/UPVC = window profiles (upvc); نجار/تركيب/معاينة = services; عفش/أوضة نوم/دولاب = furniture; فيلا/شقة/أرض = realestate; عربية/موتوسيكل = cars; كانتين/أكل بيت = food; ترجمة = translation.
5. Never route to health unless the request is clearly medical (a doctor, medicine, a nurse, a pharmacy). A building or hardware word is never a medical word. If a word is truly ambiguous, pick the marketplace meaning and, in one short sentence, ask what they meant.
6. If audio is attached, listen and answer what is asked in it. If an image is attached, describe what you see and how Horizon can help.
Return ONLY JSON: {"answer": string, "category": string|null}`;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function callGemini(body:string){
  const key=Deno.env.get('GEMINI_API_KEY')!;let last='no attempt';
  for(const m of MODELS){
    for(let a=0;a<2;a++){
      const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body});
      if(r.ok)return await r.json();
      last=`${m} ${r.status}`;
      if(r.status!==429&&r.status<500)throw new Error(last);   // 400/401/403: retrying will not help
      await sleep(600*(a+1));
    }
  }
  throw new Error('gemini unavailable ('+last+')');
}
Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
  try{
    const {q,lang,image,audio,file,history}=await req.json();
    const parts:any[]=[{text:`lang=${lang||'ar'}\n${String(q||(file?'(file: '+file+')':'')||'').slice(0,2000)}`}];
    for(const d of [image,audio]){const m=/^data:([^;]+)(?:;[^,]*)?;base64,(.+)$/.exec(d||'');if(m)parts.push({inline_data:{mime_type:m[1],data:m[2]}})}
    const past=(Array.isArray(history)?history:[]).slice(-10).filter((h:any)=>h&&h.text).map((h:any)=>({role:h.role==='model'?'model':'user',parts:[{text:String(h.text).slice(0,1500)}]}));
    const j=await callGemini(JSON.stringify({system_instruction:{parts:[{text:SYS}]},contents:[...past,{role:'user',parts}],generationConfig:{responseMimeType:'application/json',temperature:0.6}}));
    const t=(j.candidates?.[0]?.content?.parts||[]).map((p:any)=>p.text||'').join('')||'{}';
    let o:any;try{o=JSON.parse(t.replace(/^```(?:json)?\s*|\s*```$/g,''))}catch{o={answer:t,category:null}}
    const cat=CATS.includes(o.category)?o.category:null;
    return new Response(JSON.stringify({answer:o.answer||'',category:cat}),{headers:{...CORS,'Content-Type':'application/json'}});
  }catch(e){return new Response(JSON.stringify({error:String(e)}),{status:500,headers:{...CORS,'Content-Type':'application/json'}})}
});
