/* Horizon v3 layer (hz-v36)
   1) الطلبات: شاشة واحدة (تتبع طلبي + طلباتي + طلبات العملاء) بتتفتح من القايمة الجانبية ومن الإعدادات.
      وأي زرار تاني لـ"طلباتي / طلبات العملاء" ظاهر في الإعدادات أو البروفايل بيتدمج فيها.
   2) حركة أيقونات الأقسام الفرعية (تشطيبات وأثاث ...) بقت دخول هادي بدل الدوران.
   3) الرجوع: أي شاشة بتتفتح من البروفايل (إعدادات / إشعارات / دردشات / منشور جديد) زرار × بتاعها بيرجّعك للبروفايل.
   بيتحمّل آخر ملف بعد hz-v2.js. */
(function(){'use strict';
if(window.__hzV3)return;window.__hzV3=1;
const $q=s=>document.querySelector(s);
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const U=()=>typeof user!=='undefined'?user:null;
const SBC=()=>typeof sb!=='undefined'?sb:null;
const say=m=>{try{toast(m)}catch(_){}};
const chev=()=>(typeof lang!=='undefined'&&lang==='ar')?'‹':'›';

/* ---------- CSS ---------- */
const st=document.createElement('style');st.textContent=`
/* أيقونات الأقسام الفرعية: دخول هادي (طلوع بسيط + ظهور) بدل الدوران من أماكن مختلفة */
@keyframes hzBloom{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}
.hz-gt{animation-duration:.5s!important;animation-timing-function:cubic-bezier(.22,.8,.3,1)!important;animation-delay:calc(var(--i)*45ms)!important}
.hz-gi{transition:transform .25s cubic-bezier(.22,.8,.3,1),background .2s,color .2s}
@media (hover:hover){.hz-gt:hover .hz-gi{transform:translateY(-3px)}}
.hz-gt:active .hz-gi{transform:scale(.94)}
/* شاشة الطلبات */
.od-h{margin:2px 0 2px;font-size:21px}
.od-p{margin:0 0 4px;color:var(--mut);font-size:13px;line-height:1.6}
.od-sec{margin:18px 2px 8px;font-size:13px;font-weight:800;color:var(--mut)}
.od-r{display:flex;align-items:center;gap:12px;width:100%;text-align:start;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:18px;padding:14px;margin:0 0 8px;font:inherit;cursor:pointer}
.od-r:active{background:color-mix(in srgb,var(--p) 7%,var(--card))}
.od-r i{font-style:normal;font-size:24px;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none;background:color-mix(in srgb,var(--p) 11%,var(--card))}
.od-r span{display:grid;gap:2px;flex:1;min-width:0}.od-r b{font-size:15px}.od-r small{color:var(--mut);font-size:12px;line-height:1.5}
.od-r em{font-style:normal;font-size:22px;line-height:1;color:var(--mut)}
.od-tk{border:1px solid var(--line);background:var(--card);border-radius:18px;padding:14px;display:grid;gap:10px;margin:0 0 10px}
.od-tk>b{font-size:14.5px}.od-tk small{color:var(--mut);line-height:1.6}
.od-s{display:flex;gap:4px}.od-s span{flex:1;text-align:center;font-size:11px;color:var(--mut)}
.od-s i{display:grid;place-items:center;width:26px;height:26px;margin:0 auto 4px;border-radius:50%;background:var(--line);font-style:normal;font-weight:700;color:var(--mut)}
.od-s .ok i{background:#d1fae5;color:#065f46}.od-s .on i{background:var(--p);color:#fff}.od-s .on{color:var(--p);font-weight:700}
.od-e{text-align:center;color:var(--mut);padding:18px 12px;border:1px dashed var(--line);border-radius:16px;line-height:1.8;font-size:13.5px}
.od-e .btn{margin-top:8px}
/* لوحة المالك + الفحص السريع */
.ow-h{margin:2px 0 4px;font-size:21px}
.ow-g{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:10px 0}
.ow-k{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px}
.ow-k b{display:block;font-size:22px;line-height:1.2}.ow-k small{color:var(--mut);font-size:12px}
.ow-s{margin:18px 2px 8px;font-size:13px;font-weight:800;color:var(--mut)}
.ow-pb{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:6px 0 2px}.ow-pb i{display:block;height:100%;background:var(--p);border-radius:99px}
.ow-card{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px;margin:0 0 8px;display:grid;gap:6px}
.ow-card>b{font-size:15px}.ow-row{display:flex;justify-content:space-between;gap:8px;font-size:13px}.ow-row span:first-child{color:var(--mut)}
.ow-bars{display:flex;align-items:flex-end;gap:4px;height:70px;padding:6px 2px}.ow-bars i{flex:1;min-width:6px;background:var(--p);border-radius:5px 5px 0 0;opacity:.85}
.ow-ck{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;line-height:1.6;padding:6px 2px;border-bottom:1px solid var(--line)}
.ow-ck i{font-style:normal;flex:none}
@media (prefers-reduced-motion:reduce){.hz-gt{animation:none!important}}
#hsBody [data-qxrow]{display:none!important}
/* زر ✦ القديم جوه البحث: مخفي دايماً (بيظهر بس وقت التسجيل الصوتي) */
.sb:not(.rec) #aiGo{display:none!important}
/* البار السفلي: لون أغمق بدرجة + ظل خفيف عشان ما يتداخلش مع الصفحة */
.bar{background:color-mix(in srgb,var(--bg) 84%,var(--ink) 9%)!important;-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);border-top:1px solid color-mix(in srgb,var(--ink) 11%,transparent)!important;box-shadow:0 -12px 30px -16px rgba(11,42,46,.4)}
[data-theme=dark] .bar{background:color-mix(in srgb,var(--bg) 78%,#000 22%)!important}
/* مساعد Horizon: شكل شبه Claude (شاشة كاملة على الموبايل، رسائل نظيفة، مربع كتابة دائري) */
#chat{top:var(--vt,0px)!important;bottom:auto!important;inset-inline:0!important;max-width:none!important;margin:0!important;height:var(--vh,100dvh)!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:var(--bg)!important}
#chat.min{top:auto!important;bottom:calc(10px + env(safe-area-inset-bottom))!important;inset-inline:10px!important;height:54px!important;border:1px solid var(--line)!important;border-radius:20px!important;box-shadow:0 14px 34px -14px rgba(0,0,0,.4)!important}
@media (min-width:760px){#chat:not(.min){top:4vh!important;bottom:4vh!important;height:auto!important;max-width:760px!important;margin-inline:auto!important;border:1px solid var(--line)!important;border-radius:26px!important;box-shadow:0 30px 80px rgba(0,0,0,.3)!important}}
#chat .ch{background:none!important;color:var(--ink)!important;gap:10px;padding:calc(8px + env(safe-area-inset-top)) 14px 8px;min-height:56px;border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent)}
#chat.min .ch{padding-top:8px;border-bottom:0}
#chat .ch>span{width:32px;height:32px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#0F766E,#6D5BD0);color:#fff;font-size:16px;flex:none}
#chat .ch b{font-size:16.5px;font-weight:800;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#chat .ch .wa[href]:not([hidden]){font-size:0!important;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--p) 13%,transparent);flex:none}
#chat .ch .wa[href]:not([hidden])::before{content:'💬';font-size:16px}
#chat .ch button{background:color-mix(in srgb,var(--ink) 7%,transparent)!important;color:var(--ink)!important;width:34px;height:34px;border-radius:50%;font-size:17px;line-height:1}
#chat .cb{width:100%;max-width:720px;margin-inline:auto;padding:20px 16px 12px;gap:20px;box-sizing:border-box}
#chat .m{max-width:100%;padding:0;border-radius:0;font-size:15.5px;line-height:1.95;background:none}
#chat .m.u{align-self:flex-end;max-width:85%;padding:11px 17px;border-radius:22px 22px 6px 22px;background:color-mix(in srgb,var(--ink) 7%,var(--bg));color:var(--ink);font-size:15px;line-height:1.8}
html[dir=rtl] #chat .m.u{align-self:flex-start}
#chat .m.a{align-self:stretch;color:var(--ink)}
#chat .m.a::before{content:'✦';display:grid;place-items:center;width:24px;height:24px;margin-bottom:8px;border-radius:8px;background:linear-gradient(135deg,#0F766E,#6D5BD0);color:#fff;font-size:12px}
#chat .m .btn{margin:10px 6px 0 0;padding:9px 16px;font-size:13.5px;border-radius:999px}
#chat .hzc-hello{margin:auto;text-align:center;padding:10px 20px;display:grid;gap:8px;justify-items:center}
#chat .hzc-hello i{width:58px;height:58px;border-radius:20px;display:grid;place-items:center;font-style:normal;font-size:28px;color:#fff;background:linear-gradient(135deg,#0F766E,#6D5BD0);box-shadow:0 16px 30px -16px #6D5BD0}
#chat .hzc-hello b{font-size:22px}#chat .hzc-hello small{color:var(--mut);font-size:14px;line-height:1.7;max-width:280px}
#chat #v2ch{flex-wrap:wrap;overflow:visible;gap:8px;padding:4px 16px 10px;width:100%;max-width:720px;margin-inline:auto;box-sizing:border-box}
#chat #v2ch button{padding:9px 15px;font-size:13.5px;border-radius:999px}
#chat #cAtt{width:100%;max-width:720px;margin-inline:auto;box-sizing:border-box}
#chat .cf{width:calc(100% - 24px);max-width:720px;margin:0 auto calc(12px + env(safe-area-inset-bottom));box-sizing:border-box;padding:6px;gap:6px;align-items:center;border:1px solid color-mix(in srgb,var(--ink) 14%,transparent)!important;border-radius:28px;background:var(--card);box-shadow:0 10px 28px -16px rgba(11,42,46,.45)}
#chat .cf:focus-within{border-color:var(--p)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--p) 16%,transparent),0 10px 28px -16px rgba(11,42,46,.45)}
#chat .cf input{border:0!important;background:none!important;padding:10px 6px;font-size:16px;border-radius:0;outline:none}
#chat #cPlus{width:40px;height:40px;border-radius:50%!important;font-size:22px}
#chat #cGo{width:40px;height:40px;padding:0;border-radius:50%;background:var(--p);font-size:0;display:grid;place-items:center;transition:opacity .2s,transform .15s}
#chat #cGo::before{content:'↑';font-size:21px;font-weight:700;line-height:1;color:#fff}
#chat #cGo:active{transform:scale(.92)}
#chat #cIn:placeholder-shown~#cGo{opacity:.38}
#chat.min .hzc-hello{display:none}`;
document.head.appendChild(st);

/* ---------- فتح شاشة فوق الحالية (ونفتكر الحالية عشان زرار الرجوع) ---------- */
function showModal(id){const el=$q(id);if(!el)return;
 const cur=[...document.querySelectorAll('.modal')].filter(m=>!m.hidden&&('#'+m.id)!==id).pop();
 try{if(cur&&MS[MS.length-1]!=='#'+cur.id)MS.push('#'+cur.id)}catch(_){}
 el.hidden=false;try{hzBk(el)}catch(_){}}

/* ---------- مشاركة التطبيق ---------- */
window.hzShare=function(){const u=location.href.split('#')[0];
 if(navigator.share){navigator.share({title:'Horizon',text:T('Join me on Horizon','انضم معايا على Horizon'),url:u}).catch(()=>{})}
 else if(navigator.clipboard){navigator.clipboard.writeText(u).then(()=>say(T('Link copied','اللينك اتنسخ'))).catch(()=>{})}
 else say(u)};

/* ---------- الطلبات ---------- */
const SECN={upvc:'UPVC',furniture:'موبيليا',wood:'خشب',iron:'حديد',paints:'دهانات'};
const STG=['استلام','مراجعة','تنفيذ','تسليم'];
const DMAP={accepted:2,in_progress:2,delivered:3,closed:4};
function ensure(){if($q('#ordModal'))return;
 document.body.insertAdjacentHTML('beforeend','<div class="modal" id="ordModal" hidden><div class="sheet st"><button type="button" class="x" data-close>×</button><div id="ordBody"></div></div></div>')}
function draw(){const b=$q('#ordBody');if(!b)return;
 b.innerHTML=`<h3 class="od-h">📦 ${T('Orders','الطلبات')}</h3><p class="od-p">${T('Everything about your orders in one place.','كل حاجة تخص طلباتك في مكان واحد.')}</p>
 <div class="od-sec">${T('Track my order','تتبع طلبي')}</div><div id="odTrack"><p class="od-e">…</p></div>
 <div class="od-sec">${T('Manage','إدارة الطلبات')}</div>
 <button type="button" class="od-r" data-od="mine"><i>🧾</i><span><b>${T('My requests','طلباتي')}</b><small>${T('Your requests, the offers you received and your deals','طلباتك والعروض اللي وصلتلك وصفقاتك وتقييم الموردين')}</small></span><em>${chev()}</em></button>
 <button type="button" class="od-r" data-od="prov"><i>📥</i><span><b>${T('Customer requests','طلبات العملاء')}</b><small>${T('For suppliers: requests sent to you, send your offer','للموردين: الطلبات اللي جاية ليك وقدّم عرضك')}</small></span><em>${chev()}</em></button>`}
async function track(){const box=$q('#odTrack');if(!box)return;const u=U(),s=SBC();
 if(!u||!s){box.innerHTML=`<div class="od-e">${T('Sign in to see your orders.','سجّل دخول عشان تشوف طلباتك.')}<br><button type="button" class="btn" data-od="login">${T('Sign in','دخول')}</button></div>`;return}
 try{const r=await s.from('hz_quote_requests').select('id,status,created_at,lines,section').eq('user_id',u.id).neq('status','cancelled').order('created_at',{ascending:false}).limit(5);
  if(r.error)throw r.error;
  if(!r.data||!r.data.length){box.innerHTML=`<div class="od-e">${T('No orders yet. Request a quote from UPVC or Furniture and track it here.','لسه مفيش طلبات. اطلب عرض سعر من UPVC أو الموبيليا وتابعه من هنا.')}</div>`;return}
  const ids=r.data.map(x=>x.id),d=await s.from('hzq_deals').select('request_id,stage').in('request_id',ids),o=await s.from('hzq_offers').select('request_id,status').in('request_id',ids);
  const deals=d.data||[],offs=o.data||[];
  box.innerHTML=r.data.map(q=>{const dl=deals.find(x=>x.request_id===q.id&&x.stage!=='cancelled'),no=offs.filter(x=>x.request_id===q.id&&x.status==='sent').length;
   const i=dl?(DMAP[dl.stage]!=null?DMAP[dl.stage]:2):(q.status==='offered'||no>0?1:0);
   const tx=dl?({accepted:'العرض اتقبل، المورد هيبدأ التنفيذ',in_progress:'الطلب قيد التنفيذ',delivered:'الطلب اتسلّم، أكّد استلامك من طلباتي',closed:'الطلب اتقفل ✓'}[dl.stage]||'الصفقة شغالة'):(no>0?'وصلت '+no+' عروض، راجعها واقبل الأنسب':'الطلب اتبعت للموردين وبنستنى عروضهم');
   const ln=(q.lines&&q.lines[0]&&q.lines[0].name)||'',sn=SECN[q.section]||'';
   return `<div class="od-tk"><b>${E([sn,ln].filter(Boolean).join(' · ')||T('Request','طلب'))}</b><div class="od-s">${STG.map((x,k)=>`<span class="${k<i?'ok':k===i?'on':''}"><i>${k<i?'✓':k+1}</i>${x}</span>`).join('')}</div><small>${tx}</small><button type="button" class="pill" data-od="mine">${T('Details','التفاصيل')}</button></div>`}).join('')
 }catch(_){box.innerHTML=`<div class="od-e">${T('Could not load your orders. Check your connection and try again.','مقدرناش نحمّل طلباتك. اتأكد من النت وجرّب تاني.')}</div>`}}
window.hzOrders=function(){ensure();draw();showModal('#ordModal');track()};

document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-od]');if(!b)return;
 const k=b.dataset.od;
 if(k==='login'){if(typeof needLogin==='function')needLogin();return}
 if(!U()){say(T('Sign in first.','سجّل دخول الأول.'));if(typeof needLogin==='function')needLogin();return}
 if(!window.hzQuotes){say(T('Orders are not available right now. Refresh and try again.','الطلبات مش متاحة دلوقتي. حدّث الصفحة وجرّب تاني.'));return}
 const m=$q('#ordModal');try{if(MS[MS.length-1]!=='#ordModal')MS.push('#ordModal')}catch(_){}
 if(m)m.hidden=true;
 try{window.hzQuotes(k)}catch(_){if(m)m.hidden=false}});

/* ---------- × في شاشة متابعة العروض: يرجّعك للطلبات لو اتفتحت منها ---------- */
document.addEventListener('click',e=>{if(!(e.target.closest&&e.target.closest('[data-qx="close"]')))return;
 let top;try{top=MS[MS.length-1]}catch(_){return}if(top!=='#ordModal')return;
 setTimeout(()=>{try{MS.pop()}catch(_){}const q=$q('#qxModal'),o=$q('#ordModal');if(q)q.hidden=true;if(o){o.hidden=false;track()}},0)},true);

/* ---------- دمج أي تكرار لـ"طلباتي / طلبات العملاء" في الإعدادات والبروفايل ---------- */
const RX=/(طلباتي|طلبات العملاء|My requests|Customer requests|Meine Anfragen|Kundenanfragen)/;
function retitle(x){const w=document.createTreeWalker(x,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){if(RX.test(n.nodeValue)){n.nodeValue=T('Orders','الطلبات');return}}}
function merge(){['#hsBody','#pfBody'].forEach(sel=>{const root=$q(sel);if(!root)return;
 const items=[...root.querySelectorAll('button,a')].filter(x=>!x.dataset.odDone&&!x.matches('[data-hs="ord"],[data-od],[data-odopen]')&&(x.textContent||'').length<90&&RX.test(x.textContent||''));
 if(!items.length)return;
 const official=!!root.querySelector('[data-hs="ord"]');
 items.forEach((x,i)=>{x.dataset.odDone='1';
  if(!official&&i===0){x.dataset.odopen='1';retitle(x)}else x.style.display='none'})})}
document.addEventListener('click',e=>{const x=e.target.closest&&e.target.closest('[data-odopen]');if(!x)return;
 e.preventDefault();e.stopImmediatePropagation();const sm=$q('#setModal');if(sm&&!sm.hidden)sm.hidden=true;window.hzOrders()},true);
let raf=0;new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;try{merge()}catch(_){}})}).observe(document.body,{childList:true,subtree:true});
try{merge()}catch(_){}

/* ---------- زرار × / الضغط بره: لو الشاشة اتفتحت من البروفايل يرجّعك للبروفايل ---------- */
document.addEventListener('click',e=>{const t=e.target;if(!t||!t.matches)return;
 if(!(t.matches('[data-close]')||t.classList.contains('modal')))return;
 let top;try{top=MS[MS.length-1]}catch(_){return}
 if(top!=='#profModal')return;
 const cur=[...document.querySelectorAll('.modal')].filter(m=>!m.hidden).pop(),pm=$q('#profModal');
 if(!cur||!pm||cur===pm)return;
 e.stopImmediatePropagation();e.preventDefault();
 try{MS.pop()}catch(_){}
 cur.hidden=true;pm.hidden=false;
 try{if(typeof setBar==='function')setBar('barProf')}catch(_){}},true);

/* ---------- لوحة المالك (أرقام من السيرفر: hzq_stats + hzq_revenue، والسيرفر هو اللي بيتأكد إنك المالك) ---------- */
const SECA={upvc:'UPVC',furniture:'موبيليا',wood:'خشب',iron:'حديد',paints:'دهانات',nursing:'تمريض'};
const ltr=t=>'<bdi dir="ltr">'+t+'</bdi>';
const fmn=n=>Number(n||0).toLocaleString('en-US',{maximumFractionDigits:0});
const mins=m=>m==null?'—':(m<60?m+' د':m<1440?Math.round(m/60)+' س':Math.round(m/1440)+' يوم');
function ownEnsure(){if($q('#ownModal'))return;document.body.insertAdjacentHTML('beforeend','<div class="modal" id="ownModal" hidden><div class="sheet st"><button type="button" class="x" data-close>×</button><div id="ownBody"></div></div></div>')}
function goal(label,v,t){const p=Math.max(0,Math.min(100,Math.round(v/t*100)));return `<div class="ow-k"><small>${label}</small><b>${ltr(fmn(v)+' / '+t)}</b><div class="ow-pb"><i style="width:${p}%"></i></div></div>`}
async function ownDraw(){const b=$q('#ownBody');if(!b)return;const s=SBC();
 b.innerHTML=`<h3 class="ow-h">📊 ${T('Owner dashboard','لوحة المالك')}</h3><p class="od-e">…</p>`;
 if(!s){b.innerHTML+='<p class="od-e">مفيش اتصال بالسيرفر.</p>';return}
 try{const [a,r]=await Promise.all([s.rpc('hzq_stats'),s.rpc('hzq_revenue')]);
  if(a.error)throw a.error;if(r.error)throw r.error;
  const st=a.data||{},rv=r.data||{},secs=(st.sections||[]).filter(x=>x.section==='upvc'||x.section==='furniture'||x.requests||x.price_items||x.deals);
  const core=secs.filter(x=>x.section==='upvc'||x.section==='furniture'),sum=k=>core.reduce((n,x)=>n+(+x[k]||0),0);
  const pv=st.providers||{};
  const goals=`<div class="ow-s">هدف الـ30 يوم (UPVC + موبيليا)</div><div class="ow-g">${goal('موردين موثّقين بأسعار',sum('providers_verified'),5)}${goal('طلبات حقيقية',sum('requests'),20)}${goal('صفقات متقفلة',sum('closed'),3)}${goal('عملاء طلبوا',st.customers_requesting||0,10)}</div>`;
  const kpi=`<div class="ow-g"><div class="ow-k"><b>${ltr(fmn(pv.verified)+' / '+fmn(pv.registered))}</b><small>موردين موثّقين / مسجّلين${pv.pending?' · '+pv.pending+' منتظر مراجعة':''}</small></div><div class="ow-k"><b>${fmn(st.repeat_customers)}</b><small>عملاء كرّروا الطلب</small></div><div class="ow-k"><b>${fmn(rv.due)}</b><small>عمولة مستحقة (جنيه)</small></div><div class="ow-k"><b>${fmn(rv.paid)}</b><small>عمولة اتسدّدت (جنيه)</small></div></div>${rv.open_disputes?`<p class="od-e">⚠️ ${rv.open_disputes} شكوى مفتوحة محتاجة مراجعة</p>`:''}`;
  const cards=secs.map(x=>{const ans=x.requests?Math.round((x.answered||0)/x.requests*100):0;return `<div class="ow-card"><b>${SECN[x.section]||SECA[x.section]||E(x.section)}</b>
   <div class="ow-row"><span>طلبات (آخر 7 أيام)</span><span>${ltr(fmn(x.requests)+' ('+fmn(x.requests_7d)+')')}</span></div>
   <div class="ow-row"><span>اتردّ عليها</span><span>${ans}% · ${fmn(x.offers)} عرض</span></div>
   <div class="ow-row"><span>أول عرض بعد</span><span>${mins(x.avg_first_offer_min)}</span></div>
   <div class="ow-row"><span>صفقات / متقفلة</span><span>${ltr(fmn(x.deals)+' / '+fmn(x.closed))}</span></div>
   <div class="ow-row"><span>قيمة الصفقات / العمولة</span><span>${ltr(fmn(x.gmv)+' / '+fmn(x.commission))}</span></div>
   <div class="ow-row"><span>موردين موثّقين بأسعار</span><span>${fmn(x.providers_verified)} من ${fmn(x.providers_priced)} · ${fmn(x.price_items)} بند</span></div>
   <div class="ow-row"><span>التقييم</span><span>${x.avg_rating!=null?x.avg_rating+' / 5':'—'}</span></div></div>`}).join('');
  const d=st.daily||[],mx=Math.max(1,...d.map(z=>+z.n||0));
  const daily=d.length?`<div class="ow-s">الطلبات في آخر 14 يوم</div><div class="ow-bars">${d.map(z=>`<i title="${E(z.d)}: ${z.n}" style="height:${Math.max(8,Math.round((+z.n||0)/mx*100))}%"></i>`).join('')}</div>`:'';
  const cities=(st.cities||[]).length?`<div class="ow-s">أكتر المدن طلباً</div><div class="ow-card">${st.cities.map(c=>`<div class="ow-row"><span>${E(c.city)}</span><span>${fmn(c.n)}</span></div>`).join('')}</div>`:'';
  const un=(rv.unpaid||[]).length?`<div class="ow-s">عمولات مستحقة</div>${rv.unpaid.map(u=>`<div class="ow-card"><b>${E(u.name)} · ${SECN[u.section]||E(u.section)}</b><div class="ow-row"><span>قيمة الصفقة / العمولة</span><span>${ltr(fmn(u.total)+' / '+fmn(u.commission))}</span></div><button type="button" class="pill" data-owpay="${E(u.deal)}">تم السداد</button></div>`).join('')}`:'';
  b.innerHTML=`<h3 class="ow-h">📊 ${T('Owner dashboard','لوحة المالك')}</h3><p class="od-p">أرقام حقيقية من قاعدة البيانات.</p>${goals}${kpi}<div class="ow-s">الأقسام</div>${cards||'<p class="od-e">لسه مفيش نشاط.</p>'}${daily}${cities}${un}<div class="ow-s">فحص التطبيق</div><button type="button" class="od-r" data-owtest="1"><i>🧪</i><span><b>فحص سريع</b><small>يتأكد إن الملفات والوظايف الأساسية شغالة بعد أي رفع</small></span><em>${chev()}</em></button>`;
 }catch(e){b.innerHTML=`<h3 class="ow-h">📊 ${T('Owner dashboard','لوحة المالك')}</h3><p class="od-e">مقدرناش نحمّل الأرقام. ${E((e&&e.message)||'')}</p>`}}
window.hzOwner=function(){ownEnsure();showModal('#ownModal');ownDraw()};
document.addEventListener('click',async e=>{
 const pay=e.target.closest&&e.target.closest('[data-owpay]');
 if(pay){const s=SBC();if(!s||!confirm('تأكيد إن المورد سدّد العمولة دي؟'))return;const r=await s.rpc('hzq_mark_commission',{p_deal:pay.dataset.owpay,p_paid:true});if(r.error)say(r.error.message);else{say('اتسجّل ✓');ownDraw()}return}
 if(e.target.closest&&e.target.closest('[data-owtest]')){window.hzSelfTest()}});

/* ---------- فحص سريع (بعد أي رفع): ?selftest=1 أو من لوحة المالك ---------- */
window.hzSelfTest=async function(){ownEnsure();const m=$q('#ownModal');if(m&&m.hidden)showModal('#ownModal');const b=$q('#ownBody');
 b.innerHTML='<h3 class="ow-h">🧪 فحص سريع</h3><p class="od-e">…</p>';const out=[];const ok=(t,v,d)=>out.push([v,t,d||'']);
 const scripts=[...document.querySelectorAll('script[src]')].filter(x=>x.getAttribute('src')&&!/^https?:/.test(x.getAttribute('src')));
 for(const el of scripts){const u=el.getAttribute('src'),opt=el.hasAttribute('onerror');try{const r=await fetch(u,{cache:'no-store'});ok('ملف '+u.split('?')[0],r.ok||opt,r.ok?'':opt?'اختياري، مش موجود وده عادي':'HTTP '+r.status+' (مش مرفوع على GitHub؟)')}catch(_){ok('ملف '+u.split('?')[0],opt,opt?'اختياري':'مش بيتحمّل')}}
 try{const r=await fetch('sw.js',{cache:'no-store'}),t=await r.text(),v=(t.match(/const V='([^']+)'/)||[])[1];ok('إصدار التطبيق (sw.js)',!!v,v||'')}catch(_){ok('إصدار التطبيق (sw.js)',false,'مش متاح')}
 [['hzQuote','عرض السعر'],['hzQuotes','متابعة العروض والطلبات'],['hzOrders','شاشة الطلبات'],['hzSys','أنظمة وقطاعات UPVC'],['hzShare','المشاركة'],['hzDesigner','مصمم الشبابيك'],['hzSim','عينة 3D']].forEach(([k,n])=>ok(n,typeof window[k]!=='undefined'));
 [['#grid','الشبكة الرئيسية'],['#q','خانة البحث'],['#hzDock','القايمة الجانبية'],['#chat','المساعد'],['#hzTabs','التابات']].forEach(([s,n])=>ok(n,!!$q(s)));
 const s=SBC();if(s){try{const r=await s.from('hz_settings').select('key').limit(1);ok('الاتصال بقاعدة البيانات',!r.error,r.error?r.error.message:'')}catch(e){ok('الاتصال بقاعدة البيانات',false,String(e&&e.message||e))}}else ok('الاتصال بقاعدة البيانات',false,'مفيش اتصال');
 const bad=out.filter(x=>!x[0]).length;
 b.innerHTML=`<h3 class="ow-h">🧪 فحص سريع</h3><p class="od-p">${bad?'⚠️ في '+bad+' حاجة محتاجة مراجعة.':'✅ كل حاجة تمام.'}</p>`+out.map(x=>`<div class="ow-ck"><i>${x[0]?'✅':'❌'}</i><span>${E(x[1])}${x[2]?' <small style="color:var(--mut)">· '+E(x[2])+'</small>':''}</span></div>`).join('')};
if(/[?&]selftest=1/.test(location.search))setTimeout(()=>window.hzSelfTest(),2500);

/* ---------- مساعد Horizon: ترحيب + placeholder + مراعاة الكيبورد ---------- */
function chatUI(){const c=$q('#cB');if(!c)return;const has=c.querySelector('.m'),h=c.querySelector('.hzc-hello');
 if(has&&h)h.remove();
 else if(!has&&!h)c.insertAdjacentHTML('afterbegin',`<div class="hzc-hello"><i>✦</i><b>${T('Hi, I am Horizon AI','أهلاً، أنا مساعد Horizon')}</b><small>${T('Tell me what you need and I will take you to the right place.','قولّي عايز إيه، وأوديك للمكان الصح أو أجاوبك على طول.')}</small></div>`);
 const i=$q('#cIn');if(i&&!i.placeholder)i.placeholder=T('Ask Horizon anything…','اسأل Horizon أي حاجة…')}
const cb=$q('#cB');if(cb){new MutationObserver(chatUI).observe(cb,{childList:true});chatUI()}
const chat=$q('#chat');if(chat)new MutationObserver(chatUI).observe(chat,{attributes:true,attributeFilter:['hidden','class']});
if(window.visualViewport){const R=document.documentElement,f=()=>{const ch=$q('#chat');
  if(!ch||ch.hidden||ch.classList.contains('min')||innerWidth>=760){R.style.removeProperty('--vh');R.style.removeProperty('--vt');return}
  const v=visualViewport;R.style.setProperty('--vh',v.height+'px');R.style.setProperty('--vt',v.offsetTop+'px')};
 visualViewport.addEventListener('resize',f);visualViewport.addEventListener('scroll',f);
 if(chat)new MutationObserver(f).observe(chat,{attributes:true,attributeFilter:['hidden','class']})}
})();
