/* Horizon home v5: واجهة على طريقة Snaptube.
   - الاسم كبير فوق البحث، وخلفه مربعات خفيفة مائلة بتتبدّل ببطء (من غير أي كلام).
   - التابات نص عادي وتحت المختارة خط. (المتاح الآن · منتجات · خدمات · ثقافة ومجتمع)
   - منتجات/خدمات/ثقافة بتفتح مربعات الأقسام، وتحتها سهم "المنشورات" على حسب اللي اخترته.
   - "اطلب عرض سعر" بيظهر في المنتجات بس. */
(function(){
'use strict';
const $q=s=>document.querySelector(s);
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const CT=()=>typeof CATALOG!=='undefined'?CATALOG:[];
let last='',styled=0,trAt=0,fed=0,obs=0,bgT=null,qb=0;

/* ---- المتاح الآن + التابات ---- */
const NOW=['upvc','furniture'];                       // الأقسام اللي بياناتها جاهزة. زوّد عليها لما تدخل أقسام جديدة
const PRODUCTS=['furniture','wood','glass','upvc','perfumes','realestate','cars','food','learning','used','livestock'];
const MODES=[['now','المتاح الآن','Available now'],['products','منتجات','Products'],['services','خدمات','Services'],['consulting','استشارات','Consulting'],['culture','ثقافة ومجتمع','Culture & community']];
const ROOT={products:'g_products',services:'g_services',consulting:'g_consulting',culture:'g_culture'};
const FB={products:PRODUCTS,services:['services','events','health','news','translation','religion'],culture:['news','religion','countries','kids','sports'],consulting:['consulting']};
const isHome=()=>typeof cat==='undefined'||cat==='all';
function flat(id,seen){seen=seen||{};if(seen[id])return[];seen[id]=1;const c=CT().find(x=>x.id===id);
 if(!c||!c.grp)return[id];return[id].concat(...c.grp.map(g=>flat(g,seen)))}
function tabIds(k){if(k==='now')return NOW;const r=ROOT[k];return CT().some(x=>x.id===r)?flat(r):FB[k]}
function ensureRoot(k){const r=ROOT[k],C=CT();
 if(!C.some(x=>x.id===r)&&C.push){const m=MODES.find(x=>x[0]===k);C.push({id:r,en:m[2],ar:m[1],e:'📁',c:['#0F766E','#155E75'],list:[],sub:true,grp:FB[k].filter(i=>C.some(x=>x.id===i))})}}
const feedIds=()=>isHome()?NOW:flat(cat);
const isProd=()=>feedIds().some(i=>PRODUCTS.includes(i));
function shown(){if(isHome())return'now';if(cat==='consulting'||cat===ROOT.consulting)return'consulting';
 for(const m of MODES.slice(1)){if(cat===ROOT[m[0]]||tabIds(m[0]).includes(cat))return m[0]}return null}

function style(){if(styled)return;styled=1;const s=document.createElement('style');s.textContent=`
html{scroll-behavior:smooth;-webkit-tap-highlight-color:transparent}
body.hzg #hero,body.hzg #hzHomeW{display:none!important}
#hzGuide,#hzTop,#hzMoreC{display:none}body.hzg #hzGuide{display:block}
html body #fab,html body #fab[hidden],html body #fabWa{display:none!important}
@keyframes hzIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes hzBob{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
@keyframes hzFloat{from{transform:rotate(-12deg) scale(1.1) translate3d(-7px,5px,0)}to{transform:rotate(-12deg) scale(1.1) translate3d(7px,-7px,0)}}
.hz-in{animation:hzIn .32s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){.hz-in{animation:none}html{scroll-behavior:auto}.hzm svg,#hzBg .bgg{animation:none!important}}
button,.card,.tile{transition:transform .15s ease,box-shadow .2s ease,background-color .2s ease}
button:active,.card:active,.tile:active{transform:scale(.97)}
html body #chips,html body #hero,html body #hzHomeW{display:none!important}

/* التابات: نص عادي + خط تحت المختارة */
#hzTabs{position:sticky;top:calc(54px + env(safe-area-inset-top));z-index:21;height:46px;box-sizing:border-box;background:color-mix(in srgb,var(--bg) 86%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
body.hzg:not(.hzo) #hzTabs{background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none}
#hzTabs .tb-in{position:relative;display:flex;justify-content:space-evenly;height:46px;max-width:520px;margin:0 auto;overflow-x:auto;scrollbar-width:none}
#hzTabs .tb-in::-webkit-scrollbar{display:none}
#hzTabs button{flex:1 0 auto;display:flex;align-items:center;justify-content:center;padding:0 10px;border:0;background:none;color:var(--ink);font:inherit;font-size:15.5px;font-weight:700;white-space:nowrap;cursor:pointer;opacity:.45;transition:opacity .25s}
#hzTabs button.on{opacity:1;font-weight:800}
#hzTabs.none button{opacity:.85}
#hzTabs .tb-i{position:absolute;bottom:3px;left:0;width:0;height:3px;border-radius:3px;background:#F59E0B;transition:transform .34s cubic-bezier(.2,.8,.2,1),width .34s cubic-bezier(.2,.8,.2,1),opacity .2s;opacity:0;pointer-events:none}
.searchbar{top:calc(100px + env(safe-area-inset-top))!important}

/* الرئيسية */
body.hzg .top{visibility:visible}body.hzg .top .bw{visibility:hidden}
body.hzg:not(.hzo) .top{background:transparent!important;-webkit-backdrop-filter:none;backdrop-filter:none}
body.hzg{min-height:100svh;background:radial-gradient(60% 40% at 12% 8%,color-mix(in srgb,var(--p) 17%,transparent),transparent 70%),radial-gradient(55% 38% at 92% 26%,rgba(124,92,255,.13),transparent 70%),radial-gradient(75% 45% at 50% 100%,rgba(245,166,35,.16),transparent 70%),var(--bg)!important;background-attachment:fixed}
#hzTop{position:relative;overflow-x:clip;height:max(130px,calc((100svh - 340px) / 2.2 + 80px));box-sizing:border-box}
body.hzg #hzTop{display:flex;align-items:flex-end;justify-content:center;padding-bottom:28px}
.hz-name{position:relative;z-index:1;display:flex;align-items:flex-end;font-size:46px;font-weight:800;letter-spacing:-1.2px;line-height:1;color:var(--ink)}
.hz-name i{width:9px;height:9px;margin:0 0 7px 3px;border-radius:50%;background:#F59E0B;box-shadow:0 0 14px rgba(245,158,11,.6)}
#hzBg{position:absolute;left:50%;top:50%;width:100%;max-width:640px;height:340px;transform:translate(-50%,-48%);pointer-events:none;-webkit-mask-image:radial-gradient(closest-side,#000 30%,transparent 100%);mask-image:radial-gradient(closest-side,#000 30%,transparent 100%)}
#hzBg .bgg{position:absolute;inset:0;display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:78px;gap:16px;padding:10px;transform:rotate(-12deg) scale(1.1);animation:hzFloat 18s ease-in-out infinite alternate}
#hzBg .bt{display:grid;place-items:center;border-radius:22px;background:linear-gradient(145deg,var(--a),var(--b));color:#fff;opacity:.11;transform:scale(1);transition:opacity 1.1s ease,transform 1.1s ease}
#hzBg .bt.sw{opacity:0;transform:scale(.9)}
#hzBg .bt .gi{width:38px!important;height:38px!important;opacity:.9;stroke-width:1.5!important;position:static!important}
[data-theme=dark] #hzBg .bt{opacity:.2}
body.hzg .searchbar{position:relative!important;top:auto!important;z-index:1;padding:6px 18px 4px!important;background:none!important}
body.hzg .sb{max-width:560px;margin:0 auto;min-height:60px;border-radius:22px!important;background:color-mix(in srgb,var(--card) 90%,transparent)!important;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid color-mix(in srgb,var(--line) 70%,transparent)!important;box-shadow:0 20px 44px -24px color-mix(in srgb,var(--p) 60%,transparent),0 2px 8px rgba(11,42,46,.05)!important}
body.hzg #q{font-size:16px!important}
body.hzg .sb:not(.rec) #aiGo{display:none!important}
#q::placeholder{opacity:var(--phO,1);transition:opacity .26s}
body.hzg #trendw,body.hzg .hzh,body.hzg #hzhWrap,body.hzg #needs,body.hzg #home>h2.hh,body.hzc #needs,body.hzc #home>h2.hh{display:none!important}

/* سهم المنشورات */
#hzGuide{padding:0 16px;text-align:center}
body.hzc #hzMoreC{display:block;text-align:center;margin-top:6px}
.hzm{display:inline-flex;flex-direction:column;align-items:center;gap:1px;margin:20px auto 0;padding:6px 22px 0;border:0;background:none;color:var(--mut);font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}
.hzm svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;animation:hzBob 2.2s ease-in-out infinite;transition:transform .3s}
.hzm::after{content:'';display:block;height:1px;width:150px;margin-top:5px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--mut) 45%,transparent),transparent)}
body.hzo .hzm svg{transform:rotate(180deg);animation:none}

/* المنشورات */
#hzPT{display:none;max-width:560px;margin:16px auto 0;scroll-margin-top:134px}
body.hzo.hzg #hzPT,body.hzo.hzc #hzPT{display:block;animation:hzIn .35s both}
body.hzg:not(.hzo) #home,body.hzg:not(.hzo) main>.cta,body.hzg:not(.hzo) footer{display:none!important}
body.hzo.hzg #home,body.hzo.hzc #home{animation:hzIn .35s both}
.pt-pills{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -18px;padding:2px 18px 12px}
.pt-pills::-webkit-scrollbar{display:none}
.pt-pills[hidden],.pt-q[hidden],#gdTrack[hidden]{display:none!important}
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
const moreBtn=id=>`<button type="button" class="hzm" id="${id}" data-gd="posts" aria-expanded="false"><span>${T('Posts','المنشورات')}</span>${CHEV}</button>`;
function panelHTML(){const ar=(typeof lang!=='undefined'&&lang==='ar');
 return `<div class="pt-pills" id="hzPills"></div>
 <button type="button" class="pt-q" data-gd="quote"><i>🧾</i><span><b>${T('Request a quote','اطلب عرض سعر')}</b><small>${T('Compare offers from suppliers','قارن عروض الموردين في مكان واحد')}</small></span><em>${ar?'‹':'›'}</em></button>
 <div id="gdTrack"></div>
 <button type="button" class="gd-app" data-gd="app" hidden>📲 ${T('Install the app','نزّل التطبيق على موبايلك')}</button>
 <h2 class="pt-h">${T('Posts','المنشورات')}</h2>`}
const PH=()=>(typeof lang!=='undefined'&&lang==='ar')?['ابحث عن شباك UPVC 2 درفة…','ابحث عن غرفة نوم مودرن…','ابحث عن مورد زجاج سيكوريت…','اطلب عرض سعر باب بلكونة…','ابحث عن نجارة أبيض…','ابحث عن أنظمة FRANKFORT…','قول للمساعد اللي عايزه…']:['Search UPVC windows…','Search a modern bedroom…','Find a tempered glass supplier…','Request a balcony door quote…','Search white carpentry…','Ask the assistant anything…'];

/* ---- التابات فوق ---- */
function tabs(){const oc=$q('#chips');if(oc)oc.style.setProperty('display','none','important');let t=$q('#hzTabs');
 if(!t){t=document.createElement('nav');t.id='hzTabs';
  t.innerHTML=`<div class="tb-in" role="tablist"><i class="tb-i"></i>${MODES.map(x=>`<button type="button" role="tab" data-tb="${x[0]}"><span></span></button>`).join('')}</div>`;
  const sb2=$q('.searchbar');if(sb2&&sb2.parentNode)sb2.parentNode.insertBefore(t,sb2);else document.body.prepend(t)}
 const cur=shown(),ind=t.querySelector('.tb-i');let hit=null;
 t.classList.toggle('none',!cur);
 t.querySelectorAll('[data-tb]').forEach(b=>{const m=MODES.find(x=>x[0]===b.dataset.tb),on=b.dataset.tb===cur;
  b.firstChild.textContent=T(m[2],m[1]);b.classList.toggle('on',on);b.setAttribute('aria-selected',on?'true':'false');if(on)hit=b});
 if(hit){const sp=hit.firstChild,first=!ind.dataset.p;if(first){ind.style.transition='none';ind.dataset.p='1'}
  const tin=t.querySelector('.tb-in'),r1=sp.getBoundingClientRect(),r0=tin.getBoundingClientRect();
  ind.style.opacity=1;ind.style.width=r1.width+'px';ind.style.transform='translateX('+(r1.left-r0.left+tin.scrollLeft)+'px)';
  if(first)requestAnimationFrame(()=>requestAnimationFrame(()=>{ind.style.transition=''}))}
 else ind.style.opacity=0}
function goTab(k){document.body.classList.remove('hzo');const q=$q('#q');if(q&&q.value)q.value='';
 if(typeof goCat==='function'){if(k==='now')goCat('all');else if(k==='consulting'&&CT().some(x=>x.id==='consulting'))goCat('consulting');else{ensureRoot(k);goCat(ROOT[k])}}
 scrollTo({top:0,behavior:'smooth'})}

/* ---- الخلفية: مربعات خفيفة بتتبدّل ببطء ---- */
const nowCats=()=>NOW.map(id=>CT().find(x=>x.id===id)).filter(Boolean);
const bgTile=c=>`<i class="bt" style="--a:${c.c[0]};--b:${c.c[1]}">${typeof ico==='function'?ico(c.id):''}</i>`;
function bgBuild(){const bg=$q('#hzBg');if(!bg||bg.firstChild)return;const cs=nowCats();if(!cs.length)return;
 let h='<div class="bgg">';for(let i=0;i<20;i++)h+=bgTile(cs[(i+((i/5)|0))%cs.length]);bg.innerHTML=h+'</div>';
 if(!bgT&&!matchMedia('(prefers-reduced-motion:reduce)').matches)bgT=setInterval(bgTick,2200)}
function bgTick(){if(document.hidden||!document.body.classList.contains('hzg'))return;
 const bs=document.querySelectorAll('#hzBg .bt'),cs=nowCats();if(!bs.length||!cs.length)return;
 for(let n=0;n<2;n++){const t=bs[Math.floor(Math.random()*bs.length)];if(t.classList.contains('sw'))continue;t.classList.add('sw');
  setTimeout(()=>{const c=cs[Math.floor(Math.random()*cs.length)];t.style.setProperty('--a',c.c[0]);t.style.setProperty('--b',c.c[1]);t.innerHTML=typeof ico==='function'?ico(c.id):'';t.classList.remove('sw')},1150)}}

/* ---- المنشورات حسب الصفحة ---- */
if(typeof feedFilter==='function'){const _ff=feedFilter;feedFilter=function(){const a=_ff.apply(this,arguments),k=feedIds();return a.filter(it=>it.c&&k.includes(it.c.id))}}
function feedRefresh(){try{if(typeof feedMore==='function')feedMore(true)}catch(_){}emptyUI();panelSync()}
function emptyUI(){const f=$q('#feed');if(!f)return;let p=$q('#hzEmpty');
 if(!p){p=document.createElement('p');p.id='hzEmpty';p.textContent=T('Nothing here yet, coming soon','لسه مفيش منشورات هنا، قريبًا');f.insertAdjacentElement('afterend',p);
  if(!obs&&window.MutationObserver){obs=1;new MutationObserver(emptyUI).observe(f,{childList:true})}}
 p.hidden=!!f.children.length}
function syncMore(){const o=document.body.classList.contains('hzo');
 document.querySelectorAll('.hzm').forEach(m=>{m.setAttribute('aria-expanded',o?'true':'false');m.firstChild.textContent=o?T('Hide posts','إخفاء المنشورات'):T('Posts','المنشورات')})}
function panelSync(){const pt=$q('#hzPT');if(!pt)return;const prod=isProd(),home=isHome();
 const q=pt.querySelector('.pt-q'),pl=pt.querySelector('#hzPills'),tk=pt.querySelector('#gdTrack');
 if(q)q.hidden=!prod;if(tk)tk.hidden=!prod;if(pl){pl.hidden=!home;if(home&&!pl.dataset.b){pl.dataset.b='1';pills()}}}
function pills(){const box=$q('#hzPills');if(!box)return;
 box.innerHTML=nowCats().map(c=>`<button type="button" class="pt-p" data-gd="go:${c.id}">${c.e?`<i>${c.e}</i>`:''}${E(typeof N==='function'?N(c):(c.ar||c.en))}</button>`).join('')}
function togglePosts(){const b=document.body;if(!b.classList.contains('hzg')&&!b.classList.contains('hzc'))return;
 const o=!b.classList.contains('hzo');b.classList.toggle('hzo',o);syncMore();
 const h=$q('#home');
 if(o){feedRefresh();if(h&&!b.classList.contains('hzg'))h.hidden=false;
  setTimeout(()=>{const p=$q('#hzPT');if(p)p.scrollIntoView({behavior:'smooth',block:'start'})},80)}
 else{if(h&&!b.classList.contains('hzg'))h.hidden=true;
  if(b.classList.contains('hzg'))scrollTo({top:0,behavior:'smooth'});else{const m=$q('#hzMoreC');if(m)m.scrollIntoView({behavior:'smooth',block:'center'})}}}

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

function ensureUI(){const sb2=$q('.searchbar');
 if(sb2&&sb2.parentNode){
  if(!$q('#hzTop')){const tp=document.createElement('div');tp.id='hzTop';tp.innerHTML='<div id="hzBg" aria-hidden="true"></div><div class="hz-name" dir="ltr">Horizon<i></i></div>';sb2.parentNode.insertBefore(tp,sb2)}
  if(!$q('#hzGuide')){const g=document.createElement('section');g.id='hzGuide';g.innerHTML=moreBtn('hzMore');sb2.parentNode.insertBefore(g,sb2.nextSibling)}}
 const h=$q('#home');
 if(h&&h.parentNode){
  if(!$q('#hzMoreC')){const m=document.createElement('div');m.id='hzMoreC';m.innerHTML=moreBtn('hzMore2');h.parentNode.insertBefore(m,h)}
  if(!$q('#hzPT')){const pt=document.createElement('div');pt.id='hzPT';pt.innerHTML=panelHTML();h.parentNode.insertBefore(pt,h)}}
 bgBuild()}

function home(){style();tabs();phStart();const b=document.body,q=(($q('#q')||{}).value||'').trim(),noTyp=!(typeof typ!=='undefined'&&typ);
 const g=isHome()&&noTyp&&!q,c=!isHome()&&noTyp&&!q&&cat!=='fav';
 b.classList.toggle('hzg',g);b.classList.toggle('hzc',c);
 ensureUI();
 if(!g&&!c)b.classList.remove('hzo');
 const pt=$q('#hzPT');
 if(pt){panelSync();const ib=$q('#installBtn'),ab=pt.querySelector('[data-gd=app]');if(ab)ab.hidden=!ib||ib.hidden;
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
 const tb=e.target.closest('[data-tb]');if(tb){goTab(tb.dataset.tb);return}
 const d=e.target.closest('[data-dk]');const m=$q('#hzDock .dk-m');
 if(d){const k=d.dataset.dk;
  if(k==='tg'&&m)m.hidden=!m.hidden;
  else if(k==='ai'){if(m)m.hidden=true;const f=$q('#fab');if(f)f.click();else{const a=$q('#aiGo');if(a)a.click()}}
  else if(k==='wa'){if(m)m.hidden=true;const w=$q('#fabWa');if(w&&w.href)window.open(w.href,'_blank','noopener')}
  return}
 if(m&&!m.hidden&&!e.target.closest('#hzDock'))m.hidden=true});

/* سحب أفقي بين التابات (من الرئيسية أو من صفحات التابات بس) */
let sx=0,sy=0,st=0;
const hscroll=el=>{for(;el&&el!==document.body;el=el.parentElement){const c=getComputedStyle(el);if((c.overflowX==='auto'||c.overflowX==='scroll')&&el.scrollWidth>el.clientWidth+4)return true;if(c.position==='fixed')return true}return false};
document.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now();window.__hzSwipeOk=!hscroll(e.target)&&!e.target.closest('input,textarea,select,#hubModal,#qtModal,#wdModal,.modal,#chat')},{passive:true});
document.addEventListener('touchend',e=>{if(!window.__hzSwipeOk)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
 if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.8||Date.now()-st>600)return;
 const top=isHome()||Object.values(ROOT).includes(cat);if(!top)return;
 const cur=shown(),i=MODES.findIndex(x=>x[0]===cur);if(i<0)return;
 const rtl=(typeof lang!=='undefined'&&lang==='ar'),n=i+((dx<0)===rtl?-1:1);if(n>=0&&n<MODES.length)goTab(MODES[n][0])},{passive:true});
addEventListener('resize',()=>{try{tabs()}catch(_){}});

/* ---- لما الصفحة تتغير ---- */
const _r=render;render=function(){const r=_r.apply(this,arguments);
 try{const key=(typeof cat!=='undefined'?cat:'')+'|'+(typeof typ!=='undefined'?typ:''),ch=key!==last;
  if(ch)document.body.classList.remove('hzo');
  home();dock();
  if(ch){last=key;feedRefresh();syncMore();
   ['grid','home','hzGuide'].forEach(id=>{const e=$q('#'+id);if(e&&e.offsetParent!==null){e.classList.remove('hz-in');void e.offsetWidth;e.classList.add('hz-in')}})}
  const b=document.body,h=$q('#home');if(h&&b.classList.contains('hzc')&&b.classList.contains('hzo'))h.hidden=false}catch(e){}
 return r};
const init=()=>{try{home();dock();if(!fed&&$q('#feed')){fed=1;feedRefresh()}
 const q=$q('#q');if(q&&!qb){qb=1;q.addEventListener('input',()=>{try{render()}catch(_){}})}}catch(e){}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
addEventListener('load',()=>{init();setTimeout(init,600)});
})();
