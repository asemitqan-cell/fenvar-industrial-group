// Supabase Edge Function: fenvar-ai  (deploy with --no-verify-jwt)
// Secret needed: GEMINI_API_KEY
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
const SYS=`You are Horizon's assistant, an all-in-one marketplace and services app (furniture, wood, glass, UPVC windows and doors, services, consulting, offers).
Answer briefly and helpfully in the user's language (Egyptian Arabic if lang=ar, German if lang=de, else English).
If the user's need fits a section, set "category" to one of: furniture, wood, glass, upvc, services, consulting, offers. Otherwise null.
If audio is attached, listen to it and answer what is asked in it. If an image is attached, describe what you see and how Horizon can help.
Return ONLY JSON: {"answer": string, "category": string|null}`;
Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
  try{
    const {q,lang,image,audio}=await req.json();
    const parts:any[]=[{text:`lang=${lang||'ar'}\n${String(q||'').slice(0,2000)}`}];
    for(const d of [image,audio]){const m=/^data:([^;]+)(?:;[^,]*)?;base64,(.+)$/.exec(d||'');if(m)parts.push({inline_data:{mime_type:m[1],data:m[2]}})}
    const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':Deno.env.get('GEMINI_API_KEY')!},body:JSON.stringify({system_instruction:{parts:[{text:SYS}]},contents:[{role:'user',parts}],generationConfig:{responseMimeType:'application/json'}})});
    if(!r.ok)throw new Error('gemini '+r.status);
    const j=await r.json();const t=j.candidates?.[0]?.content?.parts?.[0]?.text||'{}';
    let o:any;try{o=JSON.parse(t)}catch{o={answer:t,category:null}}
    return new Response(JSON.stringify({answer:o.answer||'',category:o.category||null}),{headers:{...CORS,'Content-Type':'application/json'}});
  }catch(e){return new Response(JSON.stringify({error:String(e)}),{status:500,headers:{...CORS,'Content-Type':'application/json'}})}
});
