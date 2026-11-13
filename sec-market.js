/* Horizon: دليل الأسعار + اسأل أهل المنطقة */
(function(){'use strict';
const E=s=>esc(String(s==null?'':s)),$q=s=>document.querySelector(s);
const CATS=[['realestate','🏢','عقارات'],['cars','🚗','سيارات'],['furniture','🛋️','أثاث'],['upvc','🪟','UPVC'],['glass','🔲','زجاج'],['wood','🪵','خشب'],['used','📦','مستعمل']];
const P={cat:'realestate',rows:null,busy:0},Q={city:'',list:null,open:null,ans:{},msg:''};
const n=x=>Math.round(+x).toLocaleString('ar-EG');
async function loadP(){P.busy=1;try{const r=await sb.from('hz_price_stats').select('*').eq('cat',P.cat).order('n',{ascending:false}).limit(40);P.rows=r.error?null:r.data;P.err=!!r.error}catch(_){P.rows=null;P.err=true}P.busy=0;render()}
HZS.priceguide=()=>{if(P.rows===null&&!P.busy&&!P.err){loadP()}
 return `<div class="hzx-w"><h3>📊 دليل الأسعار</h3><div class="hzx-ch">${CATS.map(c=>`<button type="button" class="pill ${P.cat===c[0]?'dark':''}" data-mk="c:${c[0]}">${c[1]} ${c[2]}</button>`).join('')}</div>`+
 (P.busy||(P.rows===null&&!P.err)?'<p class="empty">جاري التحميل…</p>':P.err?'<p class="msg">محتاج تشغّل ملف hz-market.sql في Supabase.</p>':!P.rows.length?'<p class="empty">لسه مفيش إعلانات كفاية لحساب متوسط (محتاج إعلانين مقبولين على الأقل في نفس المدينة).</p>':
 P.rows.map(r=>`<div class="hzx-b"><b>${E(r.city)} ${r.purpose?'· '+E(r.purpose==='For sale'?'للبيع':r.purpose==='For rent'?'للإيجار':r.purpose):''}</b><small>${r.n} إعلان · ${E(r.currency||'')}</small><ul><li>المتوسط (الوسيط): ${n(r.pmed)}</li><li>من ${n(r.pmin)} إلى ${n(r.pmax)}</li>${r.sqm?`<li>سعر المتر تقريبًا: ${n(r.sqm)}</li>`:''}</ul></div>`).join(''))+
 `<p class="hzx-n">الأرقام محسوبة من إعلانات التطبيق المقبولة فقط، ومش سعر سوق رسمي.</p></div>`};
document.addEventListener('click',e=>{const b=e.target.closest('[data-mk]');if(!b)return;const [k,v]=b.dataset.mk.split(':');if(k==='c'){P.cat=v;P.rows=null;P.err=false;render()}});
async function loadQ(){try{const r=await sb.from('hz_area_q').select('*').order('created_at',{ascending:false}).limit(40);Q.list=r.error?[]:r.data;Q.err=!!r.error}catch(_){Q.list=[];Q.err=true}render()}
async function loadA(id){const r=await sb.from('hz_area_a').select('*').eq('q_id',id).order('created_at').limit(30);Q.ans[id]=r.data||[];render()}
HZS.neighbors=()=>{if(Q.list===null){loadQ();return '<div class="hzx-w"><p class="empty">جاري التحميل…</p></div>'}
 const L2=Q.list.filter(x=>!Q.city||(x.city||'').includes(Q.city));
 return `<div class="hzx-w"><h3>🏘️ اسأل أهل المنطقة</h3>${Q.err?'<p class="msg">محتاج تشغّل ملف hz-market.sql في Supabase.</p>':''}
 <input class="hzx-in" id="nbCity" placeholder="المدينة أو المنطقة (فلتر / للسؤال)" value="${E(Q.city)}">
 <textarea class="hzx-in" id="nbQ" rows="2" placeholder="سؤالك عن المنطقة: الأمان؟ المواصلات؟ المدارس؟"></textarea>
 <button type="button" class="btn" data-nb="ask">اسأل</button><p class="msg">${E(Q.msg)}</p></div>`+
 (L2.length?L2.map(q=>`<div class="hzx-w"><b>${E(q.city)}${q.area?' · '+E(q.area):''}</b><p>${E(q.question)}</p>${Q.open===q.id?`${(Q.ans[q.id]||[]).map(a=>`<div class="hzx-b">${E(a.answer)}</div>`).join('')||'<p class="empty">مفيش إجابات لسه.</p>'}<textarea class="hzx-in" id="nbA" rows="2" placeholder="إجابتك"></textarea><button type="button" class="btn" data-nb="ans:${q.id}">أجاوب</button>`:`<button type="button" class="pill" data-nb="open:${q.id}">الإجابات</button>`}</div>`).join(''):'<div class="hzx-w"><p class="empty">مفيش أسئلة لسه. كن أول واحد.</p></div>')};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-nb]');if(!b)return;const [k,v]=b.dataset.nb.split(':');
 const city=$q('#nbCity');if(city)Q.city=city.value.trim();
 if(k==='open'){Q.open=+v;await loadA(+v);return}
 if(!user){Q.msg='سجّل دخول الأول';render();return}
 if(k==='ask'){const t=($q('#nbQ')||{}).value.trim();if(!Q.city||t.length<5){Q.msg='اكتب المنطقة وسؤال واضح';render();return}
  const r=await sb.from('hz_area_q').insert({city:Q.city,question:t});Q.msg=r.error?'معرفتش أبعت. جرّب تاني.':'اتسجّل ✓';Q.list=null;render()}
 else if(k==='ans'){const t=($q('#nbA')||{}).value.trim();if(t.length<2)return;const r=await sb.from('hz_area_a').insert({q_id:+v,answer:t});if(!r.error)await loadA(+v)}});
})();
