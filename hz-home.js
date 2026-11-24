/* Horizon: الرئيسية الإرشادية + حركة سلسة + زر مساعدة واحد هادي.
   - الرئيسية بتبدأ بسؤال واحد: "محتاج إيه؟" وتلات كروت كبيرة، وبعدها تتبّع الطلب وخطوات الاستخدام.
   - زرّين الـ AI وواتساب العايمين اتدمجوا في زرار صغير واحد بيفتح الاتنين.
   - حركة دخول ناعمة لما تنقل بين الأقسام (وبتحترم تقليل الحركة في الجهاز). */
(function(){
'use strict';
const $q=s=>document.querySelector(s);
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
let last='',styled=0;

function style(){if(styled)return;styled=1;const s=document.createElement('style');s.textContent=`
html{scroll-behavior:smooth;-webkit-tap-highlight-color:transparent}
body.hzg #hero,body.hzg #hzHomeW{display:none!important}
#hzGuide,#gdAll{display:none}body.hzg #hzGuide{display:block}body.hzg #gdAll{display:block}
html body #fab,html body #fab[hidden],html body #fabWa{display:none!important}
@keyframes hzIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.hz-in{animation:hzIn .32s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){.hz-in{animation:none}html{scroll-behavior:auto}}
button,.card,.tile,.gd-c{transition:transform .15s ease,box-shadow .2s ease,background-color .2s ease}
button:active,.card:active,.tile:active,.gd-c:active{transform:scale(.97)}

#hzGuide{padding:6px 16px 4px}
.gd-app[hidden]{display:none!important}
.gd-hi{margin:6px 4px 14px}.gd-hi h1{margin:0;font-size:24px;line-height:1.35;font-weight:800}.gd-hi p{margin:4px 0 0;color:var(--mut);font-size:14px}
.gd-main{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.gd-c{position:relative;overflow:hidden;display:grid;align-content:space-between;gap:10px;min-height:156px;text-align:start;border:0;border-radius:24px;padding:16px;color:#fff;font:inherit;cursor:pointer;box-shadow:0 10px 26px -14px rgba(15,23,42,.55)}
.gd-c i{font-style:normal;font-size:44px;line-height:1;filter:drop-shadow(0 6px 8px rgba(0,0,0,.25))}
.gd-c b{display:block;font-size:19px;font-weight:800}.gd-c small{display:block;opacity:.9;font-size:12.5px;margin-top:2px;line-height:1.5}
.gd-c::after{content:'';position:absolute;inset-inline-end:-28px;top:-28px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.12)}
.gd-u{background:linear-gradient(145deg,#0F766E,#155E75)}.gd-f{background:linear-gradient(145deg,#B45309,#92400E)}
.gd-q{grid-column:1/-1;min-height:0;display:flex;align-items:center;gap:14px;background:var(--card);color:var(--ink);border:1.5px solid color-mix(in srgb,var(--p) 40%,var(--line));box-shadow:0 8px 22px -16px rgba(15,23,42,.5)}
.gd-q::after{display:none}.gd-q i{font-size:32px;filter:none}.gd-q b{font-size:16px}.gd-q small{color:var(--mut)}.gd-q em{margin-inline-start:auto;font-style:normal;font-size:22px;color:var(--p)}
.gd-h{margin:20px 4px 8px;font-size:16px;font-weight:800}
.gd-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 4px}
.gd-steps div{text-align:center;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:10px 4px}
.gd-steps i{display:grid;place-items:center;width:26px;height:26px;margin:0 auto 4px;border-radius:50%;background:color-mix(in srgb,var(--p) 14%,transparent);color:var(--p);font-style:normal;font-weight:800;font-size:13px}
.gd-steps b{display:block;font-size:12.5px}.gd-steps small{color:var(--mut);font-size:11px}
.gd-tk{margin-top:12px;border:1px solid var(--line);background:var(--card);border-radius:20px;padding:14px;display:grid;gap:8px}
.gd-tk b{font-size:14px}.gd-tk small{color:var(--mut)}
.gd-sp{display:flex;gap:4px}.gd-sp span{flex:1;text-align:center;font-size:11px;color:var(--mut)}.gd-sp i{display:grid;place-items:center;width:24px;height:24px;margin:0 auto 3px;border-radius:50%;background:var(--line);font-style:normal;font-weight:700}
.gd-sp .ok i{background:#d1fae5;color:#065f46}.gd-sp .on i{background:var(--p);color:#fff}.gd-sp .on{color:var(--p);font-weight:700}
.gd-app{display:block;margin:14px auto 0;background:none;border:0;color:var(--mut);font:inherit;font-size:12.5px;text-decoration:underline;cursor:pointer}
#gdAll{margin:16px 20px 6px;font-size:16px;font-weight:800}

#hzDock{position:fixed;inset-inline-start:14px;bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:34;display:grid;gap:8px;justify-items:start;transition:opacity .25s,transform .25s}
#hzDock.off{opacity:0;transform:translateY(12px);pointer-events:none}
#hzDock .dk-b{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--p);box-shadow:0 6px 16px -8px rgba(15,23,42,.45);font-size:20px;cursor:pointer;opacity:.92}
#hzDock .dk-m{display:grid;gap:6px}#hzDock .dk-m[hidden]{display:none}
#hzDock .dk-m button{display:flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:9px 14px;font:inherit;font-size:13px;font-weight:700;box-shadow:0 6px 16px -10px rgba(15,23,42,.5);cursor:pointer;animation:hzIn .2s both}
#aiGo{background:color-mix(in srgb,var(--p) 14%,var(--card))!important;color:var(--p)!important;box-shadow:none!important}`;
 document.head.appendChild(s)}

function guideHTML(){return `<div class="gd-hi"><h1>${T('Hi 👋 what do you need today?','أهلاً 👋 محتاج إيه النهاردة؟')}</h1><p>${T('Pick one and we will guide you step by step.','اختار وإحنا نمشّيك خطوة بخطوة.')}</p></div>
 <div class="gd-main">
  <button type="button" class="gd-c gd-u" data-gd="go:upvc"><i>🪟</i><span><b>UPVC</b><small>${T('Windows, doors and glass','شبابيك وأبواب وزجاج')}</small></span></button>
  <button type="button" class="gd-c gd-f" data-gd="go:furniture"><i>🛋️</i><span><b>${T('Furniture','موبيليا')}</b><small>${T('Commission, ready or white wood','عمولة · جاهزة · نجارة أبيض')}</small></span></button>
  <button type="button" class="gd-c gd-q" data-gd="quote"><i>🧾</i><span><b>${T('Request a quote','اطلب عرض سعر')}</b><small>${T('Compare offers from suppliers','قارن عروض الموردين في مكان واحد')}</small></span><em>${(typeof lang!=='undefined'&&lang==='ar')?'‹':'›'}</em></button>
 </div>
 <div id="gdTrack"></div>
 <div class="gd-steps"><div><i>1</i><b>${T('Choose','اختار')}</b><small>${T('your section','القسم')}</small></div><div><i>2</i><b>${T('Describe','حدّد')}</b><small>${T('what you need','طلبك')}</small></div><div><i>3</i><b>${T('Compare','قارن')}</b><small>${T('and decide','واتفق')}</small></div></div>
 <button type="button" class="gd-app" data-gd="app" hidden>📲 ${T('Install the app','نزّل التطبيق على موبايلك')}</button>`}

/* ---- تتبّع آخر طلب (كل الأقسام) ---- */
const STG=['استلام','مراجعة','تنفيذ','تسليم'];
const IDX={accepted:2,in_progress:2,delivered:3,closed:4};
async function track(){const box=$q('#gdTrack');if(!box)return;
 if(typeof user==='undefined'||!user||typeof sb==='undefined'||!sb){box.innerHTML='';return}
 try{const r=await sb.from('hz_quote_requests').select('id,status,lines,section').eq('user_id',user.id).neq('status','cancelled').order('created_at',{ascending:false}).limit(1);
  if(r.error||!r.data||!r.data.length){box.innerHTML='';return}
  const q=r.data[0],d=await sb.from('hzq_deals').select('request_id,stage').eq('request_id',q.id),o=await sb.from('hzq_offers').select('request_id,status').eq('request_id',q.id);
  const dl=(d.data||[]).find(x=>x.stage!=='cancelled'),no=(o.data||[]).filter(x=>x.status==='sent').length,i=dl?(IDX[dl.stage]!=null?IDX[dl.stage]:2):(q.status==='offered'||no>0?1:0);
  const tx=dl?({accepted:'العرض اتقبل، المورد هيبدأ التنفيذ',in_progress:'الطلب قيد التنفيذ',delivered:'الطلب اتسلّم، أكّد استلامك',closed:'الطلب اتقفل ✓'}[dl.stage]||'الصفقة شغالة'):(no?'وصلت '+no+' عروض، راجعها واقبل الأنسب':'الطلب اتبعت للموردين وبنستنى عروضهم');
  const ln=(q.lines&&q.lines[0]&&q.lines[0].name)||'';
  box.innerHTML=`<div class="gd-tk"><b>📦 ${T('Track your order','تتبّع طلبك')}${ln?' · '+E(ln):''}</b><div class="gd-sp">${STG.map((x,k)=>`<span class="${k<i?'ok':k===i?'on':''}"><i>${k<i?'✓':k+1}</i>${x}</span>`).join('')}</div><small>${tx}</small></div>`
 }catch(_){box.innerHTML=''}}

function home(){style();const on=typeof cat!=='undefined'&&cat==='all'&&!(typeof typ!=='undefined'&&typ)&&!(($q('#q')||{}).value||'').trim();
 document.body.classList.toggle('hzg',on);
 if(!on)return;
 let g=$q('#hzGuide');
 if(!g){g=document.createElement('section');g.id='hzGuide';const sb2=$q('.searchbar');if(sb2&&sb2.parentNode)sb2.parentNode.insertBefore(g,sb2.nextSibling);else document.body.prepend(g);
  g.innerHTML=guideHTML();const ch=$q('#chips');if(ch&&!$q('#gdAll')){const h=document.createElement('div');h.id='gdAll';h.textContent=T('All sections','كل الأقسام');ch.parentNode.insertBefore(h,ch)}}
 const ib=$q('#installBtn'),ab=g.querySelector('[data-gd=app]');if(ab)ab.hidden=!ib||ib.hidden;
 track()}

/* ---- زر المساعدة الواحد ---- */
function dock(){if($q('#hzDock'))return;style();
 document.body.insertAdjacentHTML('beforeend',`<div id="hzDock"><div class="dk-m" hidden><button type="button" data-dk="ai">✦ ${T('Ask the assistant','اسأل المساعد')}</button><button type="button" data-dk="wa">💬 ${T('WhatsApp support','واتساب خدمة العملاء')}</button></div><button type="button" class="dk-b" data-dk="tg" aria-label="${T('Help','مساعدة')}">💬</button></div>`);
 let y=scrollY;addEventListener('scroll',()=>{const d=$q('#hzDock');if(!d)return;const n=scrollY,dn=n>y+6&&n>200;if(Math.abs(n-y)>6){d.classList.toggle('off',dn);if(dn)d.querySelector('.dk-m').hidden=true;y=n}},{passive:true})}

document.addEventListener('click',e=>{
 const g=e.target.closest('[data-gd]');
 if(g){const [k,v]=g.dataset.gd.split(':');
  if(k==='go'&&typeof goCat==='function'){goCat(v);scrollTo({top:0,behavior:'smooth'})}
  else if(k==='quote'&&window.hzQuote)window.hzQuote();
  else if(k==='app'){const ib=$q('#installBtn');if(ib)ib.click()}
  return}
 const d=e.target.closest('[data-dk]');const m=$q('#hzDock .dk-m');
 if(d){const k=d.dataset.dk;
  if(k==='tg'&&m)m.hidden=!m.hidden;
  else if(k==='ai'){if(m)m.hidden=true;const f=$q('#fab');if(f)f.click();else{const a=$q('#aiGo');if(a)a.click()}}
  else if(k==='wa'){if(m)m.hidden=true;const w=$q('#fabWa');if(w&&w.href)window.open(w.href,'_blank','noopener')}
  return}
 if(m&&!m.hidden&&!e.target.closest('#hzDock'))m.hidden=true});

/* ---- حركة دخول ناعمة لما القسم يتغير ---- */
const _r=render;render=function(){const r=_r.apply(this,arguments);
 try{const key=(typeof cat!=='undefined'?cat:'')+'|'+(typeof typ!=='undefined'?typ:'');
  home();dock();
  if(key!==last){last=key;['grid','home','hzGuide'].forEach(id=>{const e=$q('#'+id);if(e&&e.offsetParent!==null){e.classList.remove('hz-in');void e.offsetWidth;e.classList.add('hz-in')}})}}catch(e){}
 return r};
const init=()=>{try{home();dock()}catch(e){}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
addEventListener('load',()=>{init();setTimeout(init,600)});
})();
