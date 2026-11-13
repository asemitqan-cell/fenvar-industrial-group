/* Horizon: لودر الأقسام الجديدة (بيحمّل ملف القسم لما تدخله بس) + إصلاح عدّاد الأذكار */
(function(){'use strict';
const $q=s=>document.querySelector(s),V='3',done={};
window.HZS=window.HZS||{};const HZB=window.HZB={};let depth=0,lastCat=null;
window.hzDeeper=()=>{try{history.pushState({hz:1},'')}catch(_){}depth++};
window.hzUp=()=>{if(depth>0)history.back();else{if(HZB[cat])HZB[cat]();render()}};
addEventListener('popstate',()=>{if(window.hz3dOpen)return;if(depth>0){depth--;if(HZB[cat]){HZB[cat]();render()}}});
window.hzLoad=n=>done[n]||(done[n]=new Promise((ok,no)=>{const s=document.createElement('script');s.src=n+'.js?v='+V;s.onload=ok;s.onerror=()=>{delete done[n];no()};document.head.appendChild(s)}));
const SECS={
 preachers:{file:'sec-preachers',en:'Preachers',ar:'الخطباء',e:'🎙️',c:['#047857','#064E3B'],grp:'g_culture',ic:'<path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>'},
 library:{file:'sec-library',en:'Comprehensive Library',ar:'المكتبة الشاملة',e:'📚',c:['#0F766E','#134E4A'],grp:'g_culture',ic:'<path d="M4 4h5v16H4zM10 4h5v16h-5z"/><path d="m17 5 3.5 1-4 14.5L13 19.500"/>'},
 priceguide:{file:'sec-market',en:'Price Guide',ar:'دليل الأسعار',e:'📊',c:['#0EA5E9','#0369A1'],grp:'g_products',ic:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'},
 neighbors:{file:'sec-market',en:'Ask the Neighbors',ar:'اسأل أهل المنطقة',e:'🏘️',c:['#16A34A','#14532D'],grp:'g_culture',ic:'<path d="M3 11 12 3l9 8M5 10v10h14V10M10 20v-6h4v6"/>'},
 jobs:{file:'sec-jobs',en:'Jobs',ar:'وظائف',e:'💼',c:['#2563EB','#1E3A8A'],grp:'g_services',ic:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'}};
const PRE={learning:'sec-learn'}; /* أساسيات بتتضاف فوق قسم الكتب والتعلم */
try{
 Object.keys(SECS).forEach(id=>{const s=SECS[id];if(!CATALOG.some(c=>c.id===id))CATALOG.push({id,en:s.en,ar:s.ar,e:s.e,c:s.c,list:[],sub:1});
  const g=CATALOG.find(c=>c.id===s.grp);if(g&&g.grp&&!g.grp.includes(id))g.grp.push(id);IC[id]=s.ic;if(typeof GEN!=='undefined'&&!GEN.includes(id))GEN.push(id)});
}catch(e){console.warn('hz-core',e)}
const R=window.render;
window.render=function(){
 if(cat!==lastCat){depth=0;lastCat=cat}
 const q=$q('#q'),t=q&&q.value.trim(),g=$q('#grid');
 const s=SECS[cat];
 if(s&&!t&&g){const c=cat;$q('#crumb').hidden=true;
  if(HZS[c]){g.innerHTML=HZS[c]();$q('#empty').hidden=true;return}
  g.innerHTML='<p class="empty" style="grid-column:1/-1">جاري التحميل…</p>';
  hzLoad(s.file).then(()=>{if(cat===c)render()}).catch(()=>{g.innerHTML='<p class="msg" style="grid-column:1/-1">محتاج إنترنت. جرّب تاني.</p>'});return}
 const r=R.apply(this,arguments),p=PRE[cat];
 if(p&&!t&&g){const c=cat;const put=()=>{if(cat===c&&HZS[c]&&!g.querySelector('.hzx-pre'))g.insertAdjacentHTML('afterbegin','<div class="hzx-pre">'+HZS[c]()+'</div>')};
  HZS[c]?put():hzLoad(p).then(()=>{if(cat===c){HZS[c]&&put()}}).catch(()=>{})}
 return r};

/* ===== زرار "معاينة 3D" جوه كارت المنتج بس (مش بره). بيتحمّل ملف sec-3d لما تدوس عليه ===== */
const K3={'Mobiles':'phone','Laptops':'laptop','Computers':'pc','Refrigerators':'fridge','Washing machines':'washer','Pots & cookware':'pot','Dinnerware & china':'plates','TVs & screens':'tv','Microwaves':'microwave','Earbuds / AirPods':'earbuds','Pharmacy & drug reference':'pharmacy'};
function k3(card){const b=card.querySelector('[data-item][data-cat]');if(!b)return null;if(b.dataset.cat==='perfumes')return'perfume';return K3[b.dataset.item]||null}
function add3d(){const g=$q('#grid');if(!g)return;g.querySelectorAll('.card').forEach(c=>{if(c.querySelector('.hz3b'))return;const k=k3(c),cb=c.querySelector('.cb');if(!k||!cb)return;
 cb.insertAdjacentHTML('beforeend','<button type="button" class="pill hz3b" data-hz3k="'+k+'" style="margin-top:6px;width:100%">🧊 معاينة 3D</button>')})}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.hz3b');if(!b)return;e.preventDefault();e.stopPropagation();const k=b.dataset.hz3k;
 hzLoad('sec-3d').then(()=>window.hz3d.open(k)).catch(()=>{if(typeof toast==='function')toast('محتاج إنترنت عشان المعاينة تتحمّل.')})},true);
{const g=$q('#grid');if(g){new MutationObserver(()=>{try{add3d()}catch(_){}}).observe(g,{childList:true});try{add3d()}catch(_){}}}
/* ===== إصلاح عدّاد الأذكار: capture + منع تكرار الـhandlers القديمة ===== */
document.addEventListener('click',e=>{const z=e.target.closest&&e.target.closest('.zk2,.zk');if(!z)return;
 e.stopImmediatePropagation();
 const two=z.classList.contains('zk2'),b=z.querySelector(two?'.zc2 b':'.zc');if(!b)return;
 if(!z.dataset.t)z.dataset.t=z.dataset.n;
 let n=Math.max(0,(parseInt(z.dataset.n,10)||0)-1);if((parseInt(z.dataset.n,10)||0)<=0)return;
 z.dataset.n=n;b.textContent=n?n:'✓';z.classList.toggle('done',n===0);
 if(two){const t=+z.dataset.t||1;z.style.setProperty('--pc',(t-n)/t*100)}
 try{navigator.vibrate&&navigator.vibrate(n?10:35)}catch(_){}
 const all=document.querySelectorAll('.zk2').length,d=document.querySelectorAll('.zk2.done').length,pb=$q('#zpB'),pt=$q('#zpT');
 if(all){if(pb)pb.style.width=(d/all*100)+'%';if(pt)pt.textContent=d+' / '+all+(d===all?' ✓ تقبّل الله':'')}},true);
const st=document.createElement('style');st.textContent=`.hzx-w{grid-column:1/-1;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:16px}.hzx-w h3{margin:0 0 10px}.hzx-g{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.hzx-t{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:14px 8px;text-align:center;cursor:pointer;font-weight:700}.hzx-t span{display:block;font-size:26px;margin-bottom:4px}.hzx-t small{display:block;font-weight:500;color:var(--mut)}.hzx-b{border:1px solid var(--line);border-radius:14px;padding:12px;margin:0 0 8px;background:var(--bg)}.hzx-b b{display:block}.hzx-b small{color:var(--mut)}.hzx-b ul{margin:6px 0 0;padding-inline-start:20px}.hzx-n{font-size:12.5px;color:var(--mut);margin:10px 0 0}.hzx-in{width:100%;border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--card);margin:0 0 8px}.hzx-out{white-space:pre-wrap;line-height:2;font-size:15.5px;border:1px solid var(--line);border-radius:14px;padding:14px;background:var(--bg);margin-top:10px}.hzx-ch{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.hzx-pre{grid-column:1/-1;margin:0 0 6px}.hzx-pgs{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;-webkit-overflow-scrolling:touch}.hzx-pg{flex:0 0 100%;scroll-snap-align:center;min-height:230px;border:1px solid var(--line);border-radius:16px;padding:18px;background:var(--bg);box-sizing:border-box}.hzx-nav{display:flex;justify-content:space-between;align-items:center;margin-top:10px}`;document.head.appendChild(st);

/* ===== تطبيق إعدادات المالك (ترتيب/إخفاء/أسماء/صور) + دعم وبلاغات ===== */
window.HZ_LAYOUT=null;let ALL=null;
window.hzApplyLayout=function(){const Lo=window.HZ_LAYOUT;if(!Lo)return;if(!ALL)ALL=CATALOG.map(c=>({...c,grp:c.grp&&c.grp.slice()}));
 const o=Lo.order||[],ix=id=>{const i=o.indexOf(id);return i<0?999:i},hid=Lo.hidden||[];
 const keep=ALL.filter(c=>!hid.includes(c.id)||c.id===cat).map(c=>{const live=CATALOG.find(x=>x.id===c.id)||c,n=Lo.names&&Lo.names[c.id];if(n&&n.ar)live.ar=n.ar;if(c.grp)live.grp=c.grp.filter(x=>!hid.includes(x)).sort((a,b)=>ix(a)-ix(b));return live});
 keep.sort((a,b)=>ix(a.id)-ix(b.id));CATALOG.length=0;keep.forEach(c=>CATALOG.push(c));try{renderChips();render()}catch(_){}};
function ovr(){const Lo=window.HZ_LAYOUT;if(!Lo||!Lo.img)return;document.querySelectorAll('#grid .card').forEach(cd=>{const bt=cd.querySelector('[data-item]'),k=cd.dataset.c?'c:'+cd.dataset.c:bt?'i:'+bt.dataset.cat+':'+bt.dataset.item:null,u=k&&Lo.img[k],th=cd.querySelector('.thumb');if(u&&th&&!th.querySelector('img[data-hz]'))th.innerHTML='<img data-hz src="'+u+'" style="width:100%;height:100%;object-fit:cover" loading="lazy">'})}
const R3=window.render;window.render=function(){const r=R3.apply(this,arguments);try{ovr()}catch(_){}return r};
(async function boot(){try{const c=localStorage.getItem('hz_layout');if(c){window.HZ_LAYOUT=JSON.parse(c);window.hzApplyLayout()}}catch(_){}
 try{const r=await sb.from('hz_settings').select('value').eq('key','layout').maybeSingle();if(r.data&&r.data.value){window.HZ_LAYOUT=r.data.value;try{localStorage.setItem('hz_layout',JSON.stringify(r.data.value))}catch(_){}window.hzApplyLayout()}}catch(_){}})();
/* دعم العملاء / بلاغ */
window.hzSupport=()=>{let m=$q('#hzSup');if(!m){m=document.createElement('div');m.id='hzSup';m.style.cssText='position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.45);display:grid;place-items:end center';m.innerHTML='<div class="hzx-w" style="width:100%;max-width:520px;border-radius:20px 20px 0 0"><h3>💬 الدعم</h3><select class="hzx-in" id="hsK"><option>مشكلة في التطبيق</option><option>بلاغ عن إعلان مشبوه أو نصب</option><option>اقتراح</option></select><textarea class="hzx-in" id="hsM" rows="4" placeholder="اكتب التفاصيل (ولو بلاغ عن إعلان اكتب اسمه أو رابطه)"></textarea><input class="hzx-in" id="hsC" placeholder="رقم موبايل أو إيميل للرد (اختياري)"><button class="btn" id="hsS">إرسال</button><button class="pill" id="hsX" style="margin-top:8px">إلغاء</button><p class="msg" id="hsR"></p></div>';document.body.appendChild(m);
  $q('#hsX').onclick=()=>m.remove();$q('#hsS').onclick=async()=>{const t=$q('#hsM').value.trim();if(t.length<5){$q('#hsR').textContent='اكتب التفاصيل الأول';return}try{const r=await sb.from('hz_reports').insert({kind:$q('#hsK').value,message:t,contact:$q('#hsC').value.trim()||null});if(r.error)throw r.error;$q('#hsR').textContent='وصلتنا، شكرًا ✓';setTimeout(()=>m.remove(),1200)}catch(_){$q('#hsR').textContent='معرفتش أبعت دلوقتي. جرّب تاني.'}}}};

/* ===== نجوم التقييم (من تقييمات مربوطة بمحادثة فعلية) على كروت الإعلانات ===== */
window.HZ_RATE=null;
(async function(){try{const r=await sb.from('hz_ratings').select('provider_id,stars').limit(3000);if(r.error)return;const m={};(r.data||[]).forEach(x=>{(m[x.provider_id]=m[x.provider_id]||[]).push(+x.stars)});window.HZ_RATE=m;try{render()}catch(_){}}catch(_){}})();
const uM=window.ulMeta;if(uM)window.ulMeta=function(l){const h=uM.apply(this,arguments),a=window.HZ_RATE&&window.HZ_RATE[l.owner];if(!a||!a.length)return h;const avg=a.reduce((x,y)=>x+y,0)/a.length;return h+'<small class="um">⭐ '+avg.toFixed(1)+' ('+a.length+') · تقييم من تجربة فعلية</small>'};

/* ===== الدعم والتعديل جوه الإعدادات (مش على الشاشة الرئيسية) ===== */
const dS=window.drawSet;
if(dS)window.drawSet=function(){const r=dS.apply(this,arguments);try{const b=$q('#hsBody');
 if(sv==='fb'&&b&&!$q('#hzSupB'))b.insertAdjacentHTML('beforeend','<div class="hs-box"><b>💬 الدعم الفني</b><p style="margin:6px 0;color:var(--mut);font-size:13px">عندك مشكلة في التطبيق أو عايز تبلّغ عن إعلان مشبوه؟</p><button type="button" class="btn" id="hzSupB">تواصل مع الدعم</button></div>');
 if(sv==='home'&&b&&isOwner()&&!$q('#hzEd')){const v=b.querySelector('.hs-v'),h='<div class="hs-g"><button type="button" class="hs-r" id="hzEd"><span class="hs-i" style="--c:#0F766E">✏️</span><span class="hs-t">تعديل التطبيق</span></button></div>';v?v.insertAdjacentHTML('beforebegin',h):b.insertAdjacentHTML('beforeend',h)}}catch(_){}return r};
document.addEventListener('click',e=>{if(e.target.closest('#hzSupB'))hzSupport();else if(e.target.closest('#hzEd')){const m=[...document.querySelectorAll('.modal')].find(x=>!x.hidden);if(m)m.hidden=true;hzLoad('sec-admin').then(()=>hzOpenAdmin())}});
})();
