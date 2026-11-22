/* Horizon: لودر الأقسام الجديدة (بيحمّل ملف القسم لما تدخله بس) + إصلاح عدّاد الأذكار */
(function(){'use strict';
const $q=s=>document.querySelector(s),V='6',done={};
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
/* زرار الرجوع: الأقسام المحمّلة (الخطباء/المكتبة/وظائف...) مابتعديش على رسم الصفحة الأساسي، فكنا بنفضل بزرار الرجوع القديم (للرئيسية). هنا بنظبطه للقسم الأب (ثقافة ومجتمع مثلًا) */
function hzBackBtn(){try{const g=$q('#grid');if(!g)return;let b=$q('#hzCb');if(!b){b=document.createElement('button');b.id='hzCb';b.type='button';b.className='pill';g.before(b)}
 const par=(CATALOG.find(c=>c.grp&&c.grp.includes(cat))||{}).id;b.hidden=cat==='all';b.dataset.to=par||'all';b.textContent=(lang==='ar'?'› ':'‹ ')+L('Back','رجوع')}catch(_){}}
window.render=function(){
 if(cat!==lastCat){depth=0;lastCat=cat}
 const q=$q('#q'),t=q&&q.value.trim(),g=$q('#grid');
 const s=SECS[cat];
 if(s&&!t&&g){const c=cat;$q('#crumb').hidden=true;hzBackBtn();
  if(HZS[c]){g.innerHTML=HZS[c]();$q('#empty').hidden=true;return}
  g.innerHTML='<p class="empty" style="grid-column:1/-1">جاري التحميل…</p>';
  hzLoad(s.file).then(()=>{if(cat===c)render()}).catch(()=>{g.innerHTML='<p class="msg" style="grid-column:1/-1">محتاج إنترنت. جرّب تاني.</p>'});return}
 const r=R.apply(this,arguments),p=PRE[cat];
 if(p&&!t&&g){const c=cat;const put=()=>{if(cat===c&&HZS[c]&&!g.querySelector('.hzx-pre'))g.insertAdjacentHTML('afterbegin','<div class="hzx-pre">'+HZS[c]()+'</div>')};
  HZS[c]?put():hzLoad(p).then(()=>{if(cat===c){HZS[c]&&put()}}).catch(()=>{})}
 return r};

/* ===== زرار "معاينة 3D" جوه كارت المنتج بس (مش بره). بيتحمّل ملف sec-3d لما تدوس عليه ===== */
const K3={'Mobiles':'phone','Laptops':'laptop','Computers':'pc','Refrigerators':'fridge','Washing machines':'washer','Pots & cookware':'pot','Dinnerware & china':'plates','TVs & screens':'tv','Microwaves':'microwave','Earbuds / AirPods':'earbuds','Pharmacy & drug reference':'pharmacy'};
/* v16: ربط كل منتج بمجسم 3D مناسب (بالاسم ثم بالقسم). المجسمات الحقيقية بتيجي من المورد (attrs._3m) */
const A3=s=>String(s||'').toLowerCase().replace(/[\u064B-\u065F]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
const RX=w=>new RegExp('(?:^|[^a-z\\u0600-\\u06ff])(?:ال)?(?:'+w+')','i');
const KW3=[[RX('دولاب|خزانه|wardrobe|closet|armoire'),'wardrobe'],[RX('سرير|غرفه نوم|اوضه نوم|مرتبه|bed(?:room)?s?(?![a-z])|mattress'),'bed'],[RX('شتر|شتارات|shutters?(?![a-z])|roller'),'shutter'],[RX('قطاع|قطاعات|profiles?(?![a-z])'),'profile'],[RX('شباك|شبابيك|نافذ|windows?(?![a-z])'),'window'],[RX('باب|ابواب|doors?(?![a-z])'),'door'],[RX('مطبخ|مطابخ|kitchens?(?![a-z])'),'kitchen'],[RX('ركنه|كنب|انتريه|صالون|sofa|couch|living'),'sofa'],[RX('سفره|ترابيزه|طاوله|dining|tables?(?![a-z])'),'table'],[RX('عربيه|سياره|عربيات|سيارات|cars?(?![a-z])|vehicle'),'car'],[RX('علف|اعلاف|feed'),null],[RX('بقر|جاموس|cattle|buffalo|cow'),'cow'],[RX('خروف|خرفان|غنم|اغنام|ضان|sheep|lamb'),'sheep'],[RX('ماعز|goat'),'goat'],[RX('جمل|جمال|ابل|camel'),'camel'],[RX('حصان|خيل|horse'),'horse'],[RX('دجاج|فراخ|دواجن|poultry|chicken|hen(?![a-z])'),'hen'],[RX('خشب|اوك|زان|جوز|صنوبر|ماهوجني|wood|oak|walnut|pine|mahogany|beech|plywood'),'planks'],[RX('زجاج|سيكوريت|مرايه|glass|mirror|tempered|laminated|frosted'),'glass'],[RX('شقه|فيلا|عقار|شاليه|apartment|villa|property|real estate'),'house']];
const CATK={livestock:'cow',furniture:'bed',wood:'planks',glass:'glass',upvc:'window',cars:'car',realestate:'house'};
function h3p(k,n){const a=A3(n),p={};
 if(k==='window'||k==='door'||k==='shutter'||k==='profile'){if(/رمادي|anthracite|grey|gray/.test(a))p.color='#3f4651';else if(/جوز|walnut/.test(a))p.color='#5a3b22';else if(/اوك|oak|wood|خشب/.test(a))p.color='#b98a52';else if(k!=='door')p.color='#f8fafc'}
 if(k==='bed'){if(/اطفال|kid/.test(a)){p.w=120;p.l=170;p.hb=90;p.color='#f59e0b'}else if(/كلاسيك|classic/.test(a)){p.color='#6b3f1d';p.hb=135}else if(/مودرن|modern/.test(a)){p.color='#9ca3af';p.hb=100}}
 if(k==='planks'){p.color=/جوز|walnut/.test(a)?'#5a3b22':/صنوبر|pine/.test(a)?'#d9b77e':/ماهوجني|mahogany/.test(a)?'#7a2f1c':/زان|beech/.test(a)?'#c28b5a':'#b98a52'}
 if(k==='glass')p.type=/مصنفر|frosted/.test(a)?'frosted':/برونز|bronze/.test(a)?'bronze':/لامينيت|laminated/.test(a)?'laminated':/مرايه|mirror/.test(a)?'mirror':'clear';
 if(k==='sofa'&&/ركنه|corner/.test(a))p.corner='1';
 if(k==='table'&&/دايره|round/.test(a))p.shape='round';
 return p}
function h3k(name,cat){if(cat==='perfumes')return{k:'perfume',p:{}};const n=String(name||'');if(K3[n])return{k:K3[n],p:{}};const a=A3(n);for(const r of KW3)if(r[0].test(a))return r[1]?{k:r[1],p:h3p(r[1],n)}:null;const ck=CATK[cat];return ck?{k:ck,p:h3p(ck,n)}:null}
function h3for(c){
 const m=c.querySelector('[data-msg]');
 if(m){if(typeof UL==='undefined')return null;const l=UL.find(x=>x.id===m.dataset.msg);if(!l)return null;const a=l.attrs||{};
  if(a._3m==='spin'&&Array.isArray(a._3s)&&a._3s.length>=6)return{k:'spin',spin:a._3s,n:l.title,own:1};
  if(a._3m==='param'&&a._3k)return{k:a._3k,p:Object.assign({title:l.title},a._3p||{}),own:1};
  if(l.kind==='product'){const r=h3k(l.title,l.cat);if(r)return{k:r.k,p:Object.assign({},r.p,{title:l.title+' · نموذج توضيحي'})}}
  return null}
 const b=c.querySelector('[data-item][data-cat]');if(!b)return null;
 const r=h3k(b.dataset.item,b.dataset.cat);return r?{k:r.k,p:Object.assign({},r.p)}:null}
function add3d(){[$q('#grid'),$q('#feed')].forEach(root=>{if(!root)return;root.querySelectorAll('.card,.post').forEach(c=>{if(c.querySelector('.hz3b'))return;const r=h3for(c);if(!r)return;const cb=c.querySelector('.cb')||c.querySelector('.pb>div')||c.querySelector('.pb');if(!cb)return;
 cb.insertAdjacentHTML('beforeend','<button type="button" class="pill hz3b" data-hz3k="'+r.k+'" style="margin-top:6px;width:100%'+(r.own?';border-color:#0F766E;color:#0F766E;font-weight:700':'')+'">🧊 '+(r.own?'مجسم 3D من المورد':'معاينة 3D')+'</button>')})})}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.hz3b');if(!b)return;e.preventDefault();e.stopPropagation();const c=b.closest('.card,.post'),r=(c&&h3for(c))||{k:b.dataset.hz3k,p:{}};
 hzLoad('sec-3d').then(()=>r.spin?window.hz3d.openSpin(r.spin,r.n):window.hz3d.open(r.k,r.p)).catch(()=>{if(typeof toast==='function')toast('محتاج إنترنت عشان المعاينة تتحمّل.')})},true);
[$q('#grid'),$q('#feed')].forEach(g=>{if(g){new MutationObserver(()=>{try{add3d()}catch(_){}}).observe(g,{childList:true});try{add3d()}catch(_){}}});
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
function iconImgs(){const Lo=window.HZ_LAYOUT;if(!Lo||!Lo.img)return;document.querySelectorAll('#chips .tile[data-c] .ti,#slides .sl[data-c]').forEach(n=>{const t=n.closest('[data-c]'),u=Lo.img['ic:'+t.dataset.c];if(!u||n.querySelector('img[data-hzi]'))return;const svg=n.querySelector('svg.gi');if(!svg)return;const im=document.createElement('img');im.dataset.hzi=1;im.src=u;im.alt='';im.style.cssText=n.classList.contains('sl')?'width:34px;height:34px;object-fit:cover;border-radius:10px':'width:100%;height:100%;object-fit:cover;border-radius:inherit';svg.replaceWith(im)})}
window.renderTrend=function(){const Lo=window.HZ_LAYOUT||{},el=$q('#slides');if(!el)return;const ids=Lo.slides&&Lo.slides.length?Lo.slides:['furniture','livestock','glass','upvc','wood','translation','offers'];
 const mv=id=>{try{const l=UL.find(x=>x.cat===id&&(x.photos||[])[0]);return l?l.photos[0]:''}catch(_){return''}};
 el.innerHTML=ids.map(i=>CATALOG.find(c=>c.id===i)).filter(Boolean).map(c=>{const m=(Lo.img&&Lo.img['sl:'+c.id])||mv(c.id);return `<div class="sl${m?' hasm':''}" data-c="${c.id}" style="background:${grad(c.c)}">${m?`<div class="bgm">${mediaEl(m)}</div>`:''}${ico(c.id)}<small>${L('Trending','رائج','Im Trend')}</small><b>${N(c)}</b></div>`}).join('')+`<div class="sl more" data-c="offers">${L('More','المزيد','Mehr')} <span>›</span></div>`;iconImgs()};
{const rc=window.renderChips;if(typeof rc==='function')window.renderChips=function(){const r=rc.apply(this,arguments);try{iconImgs()}catch(_){}return r}}
if(/[?&]edit=1/.test(location.search)){let n=0;const iv=setInterval(()=>{n++;let own=false;try{own=!!(user&&OWNER_EMAILS.includes((user.email||'').toLowerCase()))}catch(_){}if(own){clearInterval(iv);hzLoad('sec-admin').then(()=>hzOpenAdmin())}else if(n>50)clearInterval(iv)},400)}
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
