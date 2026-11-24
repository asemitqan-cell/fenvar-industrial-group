/* Horizon home v4: رئيسية بسيطة على طريقة snap.
   - في النص: البحث بس، وتحته سهم صغير "المنشورات" بيفتح المنشورات لما تدوس عليه.
   - فوق: تابات (المتاح الآن · منتجات · خدمات · استشارات). اللي مختارة بتبرز والباقي بيتموّه شوية.
   - "المتاح الآن" = الأقسام اللي دخلنا بياناتها بس (NOW تحت). زوّد عليها لما تدخل أقسام جديدة.
   - زرّين الـ AI وواتساب العايمين مدموجين في زرار صغير واحد. */
(function(){
'use strict';
const $q=s=>document.querySelector(s);
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
let last='',styled=0,mode='now',trAt=0,fed=0,obs=0;

/* ---- التابات وإيه اللي جواها ---- */
const NOW=['upvc','furniture'];                       // المتاح الآن: الأقسام اللي بياناتها جاهزة
const PRODUCTS=['furniture','wood','glass','upvc','perfumes','realestate','cars','food','learning','used','livestock'];
const SERVICES=['services','events','health','news','translation','religion'];
const MODES=[['now','المتاح الآن','Available now'],['products','منتجات','Products'],['services','خدمات','Services'],['consulting','استشارات','Consulting']];
function ids(k){if(k==='now')return NOW;if(k==='consulting')return['consulting'];
 try{const t=TYPES.find(x=>x[0]===k);if(t&&t[3])return t[3]}catch(_){}
 return k==='products'?PRODUCTS:k==='services'?SERVICES:[]}
const isHome=()=>typeof cat==='undefined'||cat==='all';

function style(){if(styled)return;styled=1;const s=document.createElement('style');s.textContent=`
html{scroll-behavior:smooth;-webkit-tap-highlight-color:transparent}
body.hzg #hero,body.hzg #hzHomeW{display:none!important}
#hzGuide{display:none}body.hzg #hzGuide{display:block}
html body #fab,html body #fab[hidden],html body #fabWa{display:none!important}
@keyframes hzIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes hzBob{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
@keyframes hzPing{0%{box-shadow:0 0 0 0 rgba(74,222,128,.7)}80%,100%{box-shadow:0 0 0 7px rgba(74,222,128,0)}}
.hz-in{animation:hzIn .32s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){.hz-in{animation:none}html{scroll-behavior:auto}#hzMore svg,.tb-d{animation:none!important}}
button,.card,.tile{transition:transform .15s ease,box-shadow .2s ease,background-color .2s ease}
button:active,.card:active,.tile:active{transform:scale(.97)}

html body #chips,html body #hero,html body #hzHomeW{display:none!important}

/* التابات */
#hzTabs{position:sticky;top:calc(54px + env(safe-area-inset-top));z-index:21;height:62px;box-sizing:border-box;padding:8px 12px;background:color-mix(in srgb,var(--bg) 78%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
#hzTabs .tb-in{position:relative;display:flex;gap:2px;height:46px;box-sizing:border-box;padding:4px;max-width:520px;margin:0 auto;overflow-x:auto;scrollbar-width:none;border-radius:999px;background:color-mix(in srgb,var(--card) 72%,transparent);border:1px solid var(--line);box-shadow:0 8px 22px -16px rgba(15,23,42,.45)}
#hzTabs .tb-in::-webkit-scrollbar{display:none}
#hzTabs .tb-i{position:absolute;top:4px;bottom:4px;left:0;width:0;border-radius:999px;background:linear-gradient(135deg,var(--p),var(--p2,#155E75));box-shadow:0 8px 18px -8px color-mix(in srgb,var(--p) 80%,transparent);transition:transform .34s cubic-bezier(.2,.8,.2,1),width .34s cubic-bezier(.2,.8,.2,1),opacity .2s;opacity:0;pointer-events:none}
#hzTabs button{position:relative;z-index:1;flex:1 0 auto;display:flex;align-items:center;justify-content:center;gap:6px;height:38px;padding:0 12px;border:0;border-radius:999px;background:none;color:var(--ink);font:inherit;font-size:13.5px;font-weight:700;white-space:nowrap;cursor:pointer;opacity:.5;filter:blur(.7px);transform:scale(.94);transition:opacity .28s,filter .28s,transform .28s,color .28s}
#hzTabs button.on{opacity:1;filter:none;transform:none;color:#fff;font-weight:800}
#hzTabs.none button{opacity:1;filter:none;transform:none}
#hzTabs .tb-d{width:7px;height:7px;border-radius:50%;background:#4ade80;animation:hzPing 1.8s infinite}
.searchbar{top:calc(116px + env(safe-area-inset-top))!important}

/* الرئيسية: خلفية فاتحة + البحث في النص */
body.hzg{min-height:100svh;background:radial-gradient(60% 40% at 12% 8%,color-mix(in srgb,var(--p) 17%,transparent),transparent 70%),radial-gradient(55% 38% at 92% 26%,rgba(124,92,255,.13),transparent 70%),radial-gradient(75% 45% at 50% 100%,rgba(245,166,35,.16),transparent 70%),var(--bg)!important;background-attachment:fixed}
#hzTop{display:none;height:max(24px,calc((100svh - 340px) / 2.2))}body.hzg #hzTop{display:block}
body.hzg .searchbar{position:static!important;padding:6px 18px 4px!important;background:none!important}
body.hzg .sb{max-width:560px;margin:0 auto;min-height:60px;border-radius:22px!important;background:color-mix(in srgb,var(--card) 90%,transparent)!important;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,var(--line) 70%,transparent)!important;box-shadow:0 20px 44px -24px color-mix(in srgb,var(--p) 60%,transparent),0 2px 8px rgba(11,42,46,.05)!important}
body.hzg #q{font-size:16px!important}
body.hzg .sb:not(.rec) #aiGo{display:none!important}
#q::placeholder{opacity:var(--phO,1);transition:opacity .26s}
body.hzg #trendw,body.hzg .hzh,body.hzg #hzhWrap,body.hzg #needs,body.hzg #home>h2.hh{display:none!important}

/* سهم المنشورات */
#hzGuide{padding:0 16px;text-align:center}
#hzMore{display:inline-flex;flex-direction:column;align-items:center;gap:1px;margin:20px auto 0;padding:6px 22px 0;border:0;background:none;color:var(--mut);font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}
#hzMore svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;animation:hzBob 2.2s ease-in-out infinite;transition:transform .3s}
#hzMore::after{content:'';display:block;height:1px;width:150px;margin-top:5px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--mut) 45%,transparent),transparent)}
body.hzo #hzMore svg{transform:rotate(180deg);animation:none}

/* المنشورات (بتظهر بعد الضغط على السهم) */
body.hzg:not(.hzo) #home,body.hzg:not(.hzo) #hzPT,body.hzg:not(.hzo) main>.cta,body.hzg:not(.hzo) footer{display:none!important}
#hzPT{display:none;max-width:560px;margin:16px auto 0;scroll-margin-top:134px}
body.hzg.hzo #hzPT{display:block;animation:hzIn .35s both}
body.hzg.hzo #home{animation:hzIn .35s both}
.pt-pills{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -18px;padding:2px 18px 12px}
.pt-pills::-webkit-scrollbar{display:none}
.pt-p{flex:none;display:flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:8px 14px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
.pt-p i{font-style:normal}
.pt-q{width:100%;display:flex;align-items:center;gap:12px;text-align:start;border:1.5px solid color-mix(in srgb,var(--p) 38%,var(--line));background:var(--card);color:var(--ink);border-radius:20px;padding:12px 14px;font:inherit;cursor:pointer;box-shadow:0 8px 22px -16px rgba(15,23,42,.5)}
.pt-q>i{font-style:normal;font-size:28px}.pt-q b{display:block;font-size:15px}.pt-q small{color:var(--mut);font-size:12px}.pt-q em{margin-inline-start:auto;font-style:normal;font-size:22px;color:var(--p)}
.pt-h{margin:20px 4px 10px;font-size:15px;font-weight:800}
#hzEmpty{text-align:center;color:var(--mut);font-size:14px;padding:26px 10px}

/* تتبّع الطلب */
.gd-tk{margin-top:12px;border:1px solid var(--line);background:var(--card);border-radius:20px;padding:14px;display:grid;gap:8px}
.gd-tk b{font-size:14px}.gd-tk small{color:var(--mut)}
.gd-sp{display:flex;gap:4px}.gd-sp span{flex:1;text-align:center;font-size:11px;color:var(--mut)}.gd-sp i{display:grid;place-items:center;width:24px;height:24px;margin:0 auto 3px;border-radius:50%;background:var(--line);font-style:normal;font-weight:700}
.gd-sp .ok i{background:#d1fae5;color:#065f46}.gd-sp .on i{background:var(--p);color:#fff}.gd-sp .on{color:var(--p);font-weight:700}
.gd-app{display:block;margin:14px auto 0;background:none;border:0;color:var(--mut);font:inherit;font-size:12.5px;text-decoration:underline;cursor:pointer}
.gd-app[hidden]{display:none!important}

/* زر المساعدة الواحد */
#hzDock{position:fixed;inset-inline-start:14px;bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:34;display:grid;gap:8px;justify-items:start;transition:opacity .25s,transform .25s}
#hzDock.off{opacity:0;transform:translateY(12px);pointer-events:none}
#hzDock .dk-b{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--p);box-shadow:0 6px 16px -8px rgba(15,23,42,.45);font-size:20px;cursor:pointer;opacity:.92}
#hzDock .dk-m{display:grid;gap:6px}#hzDock .dk-m[hidden]{display:none}
#hzDock .dk-m button{display:flex;align-items:center;gap:8px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:9px 14px;font:inherit;font-size:13px;font-weight:700;box-shadow:0 6px 16px -10px rgba(15,23,42,.5);cursor:pointer;animation:hzIn .2s both}
#aiGo{background:color-mix(in srgb,var(--p) 14%,var(--card))!important;color:var(--p)!important;box-shadow:none!important}`;
 document.head.appendChild(s)}

const CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
function guideHTML(){return `<button type="button" id="hzMore" data-gd="posts" aria-expanded="false"><span>${T('Posts','المنشورات')}</span>${CHEV}</button>`}
function panelHTML(){const ar=(typeof lang!=='undefined'&&lang==='ar');
 return `<div class="pt-pills" id="hzPills"></div>
 <button type="button" class="pt-q" data-gd="quote"><i>🧾</i><span><b>${T('Request a quote','اطلب عرض سعر')}</b><small>${T('Compare offers from suppliers','قارن عروض الموردين في مكان واحد')}</small></span><em>${ar?'‹':'›'}</em></button>
 <div id="gdTrack"></div>
 <button type="button" class="gd-app" data-gd="app" hidden>📲 ${T('Install the app','نزّل التطبيق على موبايلك')}</button>
 <h2 class="pt-h">${T('Posts','المنشورات')}</h2>`}
const PH=()=>(typeof lang!=='undefined'&&lang==='ar')?['ابحث عن شباك UPVC 2 درفة…','ابحث عن غرفة نوم مودرن…','ابحث عن مورد زجاج سيكوريت…','اطلب عرض سعر باب بلكونة…','ابحث عن نجارة أبيض…','ابحث عن أنظمة FRANKFORT…','قول للمساعد اللي عايزه…']:['Search UPVC windows…','Search a modern bedroom…','Find a tempered glass supplier…','Request a balcony door quote…','Search white carpentry…','Ask the assistant anything…'];

/* ---- التابات فوق ---- */
function shown(){if(isHome())return mode;const m=MODES.find(x=>ids(x[0]).includes(cat));return m?m[0]:null}
function tabs(){const oc=$q('#chips');if(oc)oc.style.setProperty('display','none','important');let t=$q('#hzTabs');
 if(!t){t=document.createElement('nav');t.id='hzTabs';
  t.innerHTML=`<div class="tb-in" role="tablist"><i class="tb-i"></i>${MODES.map(x=>`<button type="button" role="tab" data-tb="${x[0]}">${x[0]==='now'?'<u class="tb-d"></u>':''}<span></span></button>`).join('')}</div>`;
  const sb2=$q('.searchbar');if(sb2&&sb2.parentNode)sb2.parentNode.insertBefore(t,sb2);else document.body.prepend(t)}
 const cur=shown(),ind=t.querySelector('.tb-i');let hit=null;
 t.classList.toggle('none',!cur);
 t.querySelectorAll('[data-tb]').forEach(b=>{const m=MODES.find(x=>x[0]===b.dataset.tb),on=b.dataset.tb===cur;
  b.lastChild.textContent=T(m[2],m[1]);b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false');if(on)hit=b});
 if(hit){const first=!ind.dataset.p;if(first){ind.style.transition='none';ind.dataset.p='1'}
  ind.style.opacity=1;ind.style.width=hit.offsetWidth+'px';ind.style.transform='translateX('+hit.offsetLeft+'px)';
  if(first)requestAnimationFrame(()=>requestAnimationFrame(()=>{ind.style.transition=''}))}
 else ind.style.opacity=0}
function setMode(k){const was=isHome()&&document.body.classList.contains('hzo');mode=k;if(!was)document.body.classList.remove('hzo');
 const q=$q('#q');if(q&&q.value){q.value=''}
 if(!isHome()&&typeof goCat==='function'){goCat('all')}else if(typeof render==='function'){render()}
 tabs();pills();feedRefresh();syncMore();
 if(was){const p=$q('#hzPT');if(p)p.scrollIntoView({behavior:'smooth',block:'start'})}else scrollTo({top:0,behavior:'smooth'})}

/* ---- أزرار الأقسام جوه المنشورات ---- */
function pills(){const box=$q('#hzPills');if(!box)return;const cats=typeof CATALOG!=='undefined'?CATALOG:[];
 box.innerHTML=ids(mode).map(id=>{const c=cats.find(x=>x.id===id);if(!c)return'';
  return `<button type="button" class="pt-p" data-gd="go:${id}">${c.e?`<i>${c.e}</i>`:''}${E(typeof N==='function'?N(c):(c.ar||c.en))}</button>`}).join('')}

/* ---- المنشورات حسب التاب ---- */
if(typeof feedFilter==='function'){const _ff=feedFilter;feedFilter=function(){const a=_ff.apply(this,arguments),k=ids(mode);return k.length?a.filter(it=>it.c&&k.includes(it.c.id)):a}}
function feedRefresh(){try{if(typeof feedMore==='function')feedMore(true)}catch(_){}emptyUI()}
function emptyUI(){const f=$q('#feed');if(!f)return;let p=$q('#hzEmpty');
 if(!p){p=document.createElement('p');p.id='hzEmpty';p.textContent=T('Nothing here yet, coming soon','لسه مفيش منشورات هنا، قريبًا');f.insertAdjacentElement('afterend',p);
  if(!obs&&window.MutationObserver){obs=1;new MutationObserver(emptyUI).observe(f,{childList:true})}}
 p.hidden=!!f.children.length}
function syncMore(){const o=document.body.classList.contains('hzo'),m=$q('#hzMore');
 if(m){m.setAttribute('aria-expanded',o?'true':'false');m.firstChild.textContent=o?T('Hide posts','إخفاء المنشورات'):T('Posts','المنشورات')}}
function togglePosts(){const b=document.body,o=!b.classList.contains('hzo');b.classList.toggle('hzo',o);syncMore();
 if(o){feedRefresh();setTimeout(()=>{const p=$q('#hzPT');if(p)p.scrollIntoView({behavior:'smooth',block:'start'})},80)}
 else scrollTo({top:0,behavior:'smooth'})}

/* ---- الجملة اللي في البحث بتتغير ---- */
let phI=0,phT=null;
function phTick(){const q=$q('#q');if(!q)return;const home=document.body.classList.contains('hzg');
 if(!home||document.activeElement===q||q.value)return;const L2=PH();phI=(phI+1)%L2.length;
 q.style.setProperty('--phO','0');setTimeout(()=>{q.placeholder=L2[phI];q.style.setProperty('--phO','1')},260)}
function phStart(){if(phT)return;const q=$q('#q');if(q){q.placeholder=PH()[0]}phT=setInterval(phTick,2800)}

/* ---- تتبّع آخر طلب ---- */
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

function home(){style();tabs();phStart();const on=isHome()&&!(typeof typ!=='undefined'&&typ)&&!(($q('#q')||{}).value||'').trim();
 document.body.classList.toggle('hzg',on);
 if(!on){document.body.classList.remove('hzo');syncMore();return}
 const sb2=$q('.searchbar');
 let tp=$q('#hzTop');if(!tp){tp=document.createElement('div');tp.id='hzTop';if(sb2&&sb2.parentNode)sb2.parentNode.insertBefore(tp,sb2)}
 let g=$q('#hzGuide');if(!g){g=document.createElement('section');g.id='hzGuide';if(sb2&&sb2.parentNode)sb2.parentNode.insertBefore(g,sb2.nextSibling);else document.body.prepend(g);g.innerHTML=guideHTML()}
 let pt=$q('#hzPT');if(!pt){const h=$q('#home');if(h&&h.parentNode){pt=document.createElement('div');pt.id='hzPT';pt.innerHTML=panelHTML();h.parentNode.insertBefore(pt,h)}}
 if(pt){pills();const ib=$q('#installBtn'),ab=pt.querySelector('[data-gd=app]');if(ab)ab.hidden=!ib||ib.hidden;
  if(Date.now()-trAt>15000){trAt=Date.now();track()}}
 emptyUI();syncMore()}

/* ---- زر المساعدة الواحد ---- */
function dock(){if($q('#hzDock'))return;style();
 document.body.insertAdjacentHTML('beforeend',`<div id="hzDock"><div class="dk-m" hidden><button type="button" data-dk="ai">✦ ${T('Ask the assistant','اسأل المساعد')}</button><button type="button" data-dk="wa">💬 ${T('WhatsApp support','واتساب خدمة العملاء')}</button></div><button type="button" class="dk-b" data-dk="tg" aria-label="${T('Help','مساعدة')}">💬</button></div>`);
 let y=scrollY;addEventListener('scroll',()=>{const d=$q('#hzDock');if(!d)return;const n=scrollY,dn=n>y+6&&n>200;if(Math.abs(n-y)>6){d.classList.toggle('off',dn);if(dn)d.querySelector('.dk-m').hidden=true;y=n}},{passive:true})}

document.addEventListener('click',e=>{
 const g=e.target.closest('[data-gd]');
 if(g){const [k,v]=g.dataset.gd.split(':');
  if(k==='posts')togglePosts();
  else if(k==='go'&&typeof goCat==='function'){document.body.classList.remove('hzo');goCat(v);scrollTo({top:0,behavior:'smooth'})}
  else if(k==='quote'&&window.hzQuote)window.hzQuote();
  else if(k==='app'){const ib=$q('#installBtn');if(ib)ib.click()}
  return}
 const tb=e.target.closest('[data-tb]');if(tb){setMode(tb.dataset.tb);return}
 const d=e.target.closest('[data-dk]');const m=$q('#hzDock .dk-m');
 if(d){const k=d.dataset.dk;
  if(k==='tg'&&m)m.hidden=!m.hidden;
  else if(k==='ai'){if(m)m.hidden=true;const f=$q('#fab');if(f)f.click();else{const a=$q('#aiGo');if(a)a.click()}}
  else if(k==='wa'){if(m)m.hidden=true;const w=$q('#fabWa');if(w&&w.href)window.open(w.href,'_blank','noopener')}
  return}
 if(m&&!m.hidden&&!e.target.closest('#hzDock'))m.hidden=true});

/* سحب أفقي بين التابات (في الرئيسية بس) */
let sx=0,sy=0,st=0;
const hscroll=el=>{for(;el&&el!==document.body;el=el.parentElement){const c=getComputedStyle(el);if((c.overflowX==='auto'||c.overflowX==='scroll')&&el.scrollWidth>el.clientWidth+4)return true;if(c.position==='fixed')return true}return false};
document.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();window.__hzSwipeOk=!hscroll(e.target)&&!e.target.closest('input,textarea,select,#hubModal,#qtModal,#wdModal,.modal,#chat')},{passive:true});
document.addEventListener('touchend',e=>{if(!window.__hzSwipeOk||!document.body.classList.contains('hzg'))return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
 if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.8||Date.now()-st>600)return;
 const i=MODES.findIndex(x=>x[0]===mode);if(i<0)return;
 const rtl=(typeof lang!=='undefined'&&lang==='ar'),n=i+((dx<0)===rtl?-1:1);if(n>=0&&n<MODES.length)setMode(MODES[n][0])},{passive:true});
addEventListener('resize',()=>{try{tabs()}catch(_){}});

/* ---- حركة دخول ناعمة لما القسم يتغير ---- */
const _r=render;render=function(){const r=_r.apply(this,arguments);
 try{const key=(typeof cat!=='undefined'?cat:'')+'|'+(typeof typ!=='undefined'?typ:'');
  home();dock();
  if(key!==last){last=key;['grid','home','hzGuide'].forEach(id=>{const e=$q('#'+id);if(e&&e.offsetParent!==null){e.classList.remove('hz-in');void e.offsetWidth;e.classList.add('hz-in')}})}}catch(e){}
 return r};
let qb=0;
const init=()=>{try{home();dock();if(!fed&&$q('#feed')){fed=1;feedRefresh()}
 const q=$q('#q');if(q&&!qb){qb=1;q.addEventListener('input',()=>{try{render()}catch(_){}})}}catch(e){}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
addEventListener('load',()=>{init();setTimeout(init,600)});
})();
