/* Horizon: المصحف (صفحات حقيقية 604 صفحة) + بحث + فتح مباشر على الآية من المساعد.
   بيستبدل شاشة المصحف القديمة (قايمة السور + آيات متتالية) من غير ما يغيّر باقي قسم "ديني".
   البيانات: api.alquran.cloud (مسموح في الـCSP). الآخر قراءة والعلامات بتتحفظ على الجهاز. */
(function(){
'use strict';
const API='https://api.alquran.cloud/v1';
const SN=['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'];
const SA=[7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
const SP=[1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,496,499,502,507,511,515,518,520,523,526,528,531,534,537,542,545,549,551,553,554,556,558,560,562,564,566,568,570,572,574,575,577,578,580,582,583,585,586,587,587,589,590,591,591,592,593,594,595,595,596,596,597,597,598,598,599,599,600,600,601,601,601,602,602,602,603,603,603,604,604,604];
const JP=[1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
const BASM='بسم الله الرحمن الرحيم';
const T=(en,ar)=>(typeof L==='function'?L(en,ar):ar);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const norm=t=>String(t==null?'':t).replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g,'').replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).toLowerCase().trim();
const strip=w=>String(w||'').replace(/^ال(?=.)/,'');
const KEYS=SN.map(n=>{const x=norm(n);return x.startsWith('ال ')?x.slice(3):strip(x)});
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(_){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const QR={view:'home',page:1,hl:null,res:null,msg:'',cache:{},tf:{},err:0,loading:0,expect:null,sel:null};
const gv=()=>typeof relV!=='undefined'&&relV==='quran'&&typeof cat!=='undefined'&&cat==='religion';
const redraw=()=>{if(gv()&&typeof render==='function')render()};

/* ---------- فهم النص: اسم سورة / رقم آية / صفحة / جزء ---------- */
function toks(t){return norm(t).split(/[^\p{L}\p{N}]+/u).filter(Boolean)}
function findSurahByName(w){const k=strip(w);if(!k)return 0;const i=KEYS.indexOf(k);return i>=0?i+1:0}
function parseRef(text){
  const t=norm(text);let m=t.match(/(\d{1,3})\s*[:\/]\s*(\d{1,3})/);
  if(m&&+m[1]>=1&&+m[1]<=114)return{s:+m[1],a:clamp(+m[2],1,SA[+m[1]-1])};
  const k=toks(text);let s=0,a=0;
  for(let i=0;i<k.length;i++){
    if(k[i]==='سوره'||k[i]==='surah'||k[i]==='sura'){
      let w=k[i+1];if(w==='ال'&&k[i+2])w=k[i+2];
      if(/^\d+$/.test(w||'')&&+w>=1&&+w<=114){s=+w;break}
      const f=findSurahByName(w);if(f){s=f;break}
    }
  }
  if(!s){for(let i=0;i<k.length;i++){const w=k[i];if(w.length>=4&&w!=='ال'){const f=findSurahByName(w);if(f&&KEYS.filter(x=>x===strip(w)).length===1){s=f;break}}}}
  if(!s)return null;
  for(let i=0;i<k.length;i++){
    if(['ايه','ayah','verse','aya'].includes(strip(k[i]))){let n=k[i+1];if(n==='رقم')n=k[i+2];if(/^\d+$/.test(n||'')&&+n>=1&&+n<=SA[s-1]){a=+n;break}}
  }
  return{s,a:a||0};
}
function quranIntent(q,ans){
  const hint=window.HZ_QURAN_HINT;
  if(hint&&+hint.surah>=1&&+hint.surah<=114){return{s:+hint.surah,a:hint.ayah?clamp(+hint.ayah,1,SA[+hint.surah-1]):0}}
  const nq=norm(q),na=norm(ans);
  const intent=/مصحف|قران|quran|سوره|ايه|اية|ايات|surah|ayah|verse/.test(nq)||/مصحف|quran/.test(na);
  if(!intent)return null;
  const fa=parseRef(String(ans||'').slice(0,700)),fq=parseRef(q);
  const r=fa&&fa.s?fa:fq;if(!r)return null;
  if(fq&&fq.s===r.s&&fq.a&&!r.a)r.a=fq.a;
  return r;
}

/* ---------- جلب الصفحات ---------- */
async function getPage(n){
  if(QR.cache[n])return QR.cache[n];
  const r=await fetch(API+'/page/'+n+'/quran-uthmani');if(!r.ok)throw new Error('p');
  const j=await r.json();if(!j||!j.data||!j.data.ayahs)throw new Error('p');
  QR.cache[n]=j.data;return j.data;
}
async function ayahPage(s,a){
  const r=await fetch(API+'/ayah/'+s+':'+a+'/quran-uthmani');if(!r.ok)throw new Error('a');
  const j=await r.json();if(!j||!j.data||!j.data.page)throw new Error('a');
  return j.data.page;
}
function scrollTop(){const el=document.querySelector('.qpg');if(el){const y=el.getBoundingClientRect().top+window.scrollY-70;window.scrollTo(0,Math.max(0,y))}}
function afterDraw(){
  const h=QR.hl&&document.querySelector('.qa.hl');
  if(h){h.scrollIntoView({block:'center'})}else scrollTop();
}
async function load(){
  const n=QR.page;
  if(!QR.cache[n]){QR.loading=1;QR.err=0;redraw()}
  try{
    const d=await getPage(n);
    if(QR.page!==n)return;
    const ex=QR.expect;QR.expect=null;
    if(ex&&!d.ayahs.some(x=>x.surah&&x.surah.number===ex.s&&x.numberInSurah===(ex.a||1))){
      try{const p=await ayahPage(ex.s,ex.a||1);if(p!==n){QR.page=p;LS.set('hz_q_last',p);return load()}}catch(_){}
    }
    QR.loading=0;QR.err=0;redraw();afterDraw();
    getPage(n+1).catch(()=>{});if(n>1)getPage(n-1).catch(()=>{});
  }catch(_){if(QR.page===n){QR.loading=0;QR.err=1;redraw()}}
}
function show(page,hl,expect){
  closeSheet();
  QR.view='page';QR.page=clamp(+page||1,1,604);QR.hl=hl||null;QR.expect=expect||null;QR.dir=QR.nextDir||0;QR.nextDir=0;
  LS.set('hz_q_last',QR.page);load();
}
function turn(d){if(QR.view!=='page')return;QR.nextDir=d;show(QR.page+d)}
function openSurah(s){s=clamp(+s||1,1,114);show(SP[s-1],null,{s,a:1})}
async function openAyah(s,a){
  s=clamp(+s||1,1,114);a=clamp(+a||1,1,SA[s-1]);
  QR.view='page';QR.page=SP[s-1];QR.hl={s,a};QR.loading=1;QR.err=0;redraw();
  try{const p=await ayahPage(s,a);show(p,{s,a})}
  catch(_){show(SP[s-1],{s,a},{s,a})}
}
function deep(s,a){
  s=+s;if(!(s>=1&&s<=114))return;
  if(typeof relD!=='undefined')relD.err=0;
  relV='quran';
  if(typeof goCat==='function')goCat('religion');
  a?openAyah(s,a):openSurah(s);
}

/* ---------- البحث ---------- */
async function search(text){
  const raw=String(text||'').trim();if(!raw)return;
  const t=norm(raw);QR.msg='';
  let m=t.match(/^(\d{1,3})\s*[:\/]\s*(\d{1,3})$/);
  if(m&&+m[1]>=1&&+m[1]<=114)return openAyah(+m[1],+m[2]);
  m=t.match(/^(?:صفحه|ص|page|p)\s*(\d{1,3})$/);
  if(m){const n=+m[1];if(n>=1&&n<=604)return show(n);QR.msg=T('Page must be 1-604','رقم الصفحة من 1 لـ 604');return redraw()}
  m=t.match(/^(?:جزء|الجزء|juz|j)\s*(\d{1,2})$/);
  if(m){const n=+m[1];if(n>=1&&n<=30)return show(JP[n-1]);QR.msg=T('Juz must be 1-30','رقم الجزء من 1 لـ 30');return redraw()}
  if(/^\d{1,3}$/.test(t)){const n=+t;if(n>=1&&n<=114)return openSurah(n);QR.msg=T('Surah number must be 1-114','رقم السورة من 1 لـ 114');return redraw()}
  const ref=parseRef(raw);
  if(ref&&ref.s&&(ref.a||/سوره|surah/.test(t))){return ref.a?openAyah(ref.s,ref.a):openSurah(ref.s)}
  const q=strip(t.replace(/^سوره\s+/,'').trim()),hits=[];
  if(q.length>=1)KEYS.forEach((k,i)=>{if(k===q)hits.unshift(i+1);else if(q.length>=2&&(k.startsWith(q)||k.includes(q)))hits.push(i+1)});
  if(hits.length===1&&KEYS[hits[0]-1]===q)return openSurah(hits[0]);
  QR.view='res';QR.res={q:raw,items:hits.map(s=>({t:'su',s})),ay:null,loading:1};QR.err=0;redraw();
  if(t.length<2){QR.res.loading=0;return redraw()}
  try{
    const r=await fetch(API+'/search/'+encodeURIComponent(t)+'/all/quran-simple');
    const j=r.ok?await r.json():null;
    const ms=(j&&j.data&&j.data.matches)||[];
    if(QR.res&&QR.res.q===raw){QR.res.ay=ms.slice(0,60).map(x=>({t:'ay',s:x.surah.number,a:x.numberInSurah,text:x.text}));QR.res.total=(j&&j.data&&j.data.count)||ms.length;QR.res.loading=0;redraw()}
  }catch(_){if(QR.res&&QR.res.q===raw){QR.res.loading=0;QR.res.fail=1;redraw()}}
}

/* ---------- العلامات (bookmarks) ---------- */
const bms=()=>LS.get('hz_q_bm',[]);
const hasBm=(s,a)=>bms().some(x=>x.s===s&&x.a===a);
function toggleBm(s,a){let b=bms();if(hasBm(s,a))b=b.filter(x=>!(x.s===s&&x.a===a));else{b.unshift({s,a});b=b.slice(0,30)}LS.set('hz_q_bm',b)}

/* ---------- الرسم ---------- */
function basmalaless(a){
  if(a.numberInSurah!==1||a.surah.number===1||a.surah.number===9)return a.text;
  const w=String(a.text).trim().split(/\s+/);
  if(w.length>4&&norm(w.slice(0,4).join(' '))===BASM)return w.slice(4).join(' ');
  return a.text;
}
function pageHTML(d){
  let out='',para='';
  const flush=()=>{if(para){out+='<p class="qt">'+para+'</p>';para=''}};
  d.ayahs.forEach(a=>{
    const s=a.surah&&a.surah.number;if(!s)return;
    if(a.numberInSurah===1){flush();out+='<div class="qh"><span>'+T('Surah','سورة')+' '+E(SN[s-1])+'</span></div>';if(s!==1&&s!==9)out+='<div class="qb">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>'}
    const h=QR.hl&&QR.hl.s===s&&QR.hl.a===a.numberInSurah;
    para+='<span class="qa'+(h?' hl':'')+'" data-qa="'+s+':'+a.numberInSurah+'">'+E(basmalaless(a))+' <i>﴿'+ar(a.numberInSurah)+'﴾</i></span> ';
  });
  flush();return out;
}
function homeHTML(){
  const last=LS.get('hz_q_last',0),b=bms();
  let h='<div class="qs"><input id="qrS" type="search" enterkeyhint="search" autocomplete="off" placeholder="'+E(T('Search: surah name, number, page, juz or words of a verse','ابحث: اسم سورة، رقمها، صفحة، جزء، أو كلمات من آية'))+'"><button type="button" class="btn" style="width:auto;padding:10px 16px" data-qr="search">'+T('Search','بحث')+'</button></div>';
  h+='<p class="qh2">'+T('Examples: ','أمثلة: ')+'<u data-qr="ex:البقرة">البقرة</u> · <u data-qr="ex:2:255">2:255</u> · <u data-qr="ex:صفحة 50">صفحة 50</u> · <u data-qr="ex:جزء 30">جزء 30</u></p>';
  if(QR.msg)h+='<p class="msg">'+E(QR.msg)+'</p>';
  if(last)h+='<button type="button" class="btn" style="margin:6px 0 10px" data-qr="pg:'+last+'">📖 '+T('Continue reading','كمّل القراءة')+' · '+T('page','صفحة')+' '+ar(last)+'</button>';
  if(b.length)h+='<h4 class="qh3">🔖 '+T('Bookmarks','علاماتي')+'</h4><div class="qchips">'+b.map(x=>'<span class="pill" data-qr="ay:'+x.s+':'+x.a+'">'+E(SN[x.s-1])+' '+ar(x.a)+'</span>').join('')+'</div>';
  h+='<h4 class="qh3">'+T('Juz','الأجزاء')+'</h4><div class="qchips qj">'+JP.map((p,i)=>'<span class="pill" data-qr="pg:'+p+'">'+ar(i+1)+'</span>').join('')+'</div>';
  h+='<h4 class="qh3">'+T('Surahs','السور')+'</h4><div class="qchips">'+SN.map((n,i)=>'<span class="pill" data-qr="su:'+(i+1)+'">'+ar(i+1)+'. '+E(n)+'</span>').join('')+'</div>';
  return h;
}
function resHTML(){
  const r=QR.res||{items:[]};
  let h='<button type="button" class="pill" data-qr="home" style="margin-bottom:10px">'+T('← Mushaf','← المصحف')+'</button><h4 class="qh3">'+T('Results for','نتائج')+': '+E(r.q)+'</h4>';
  if(r.items.length)h+='<div class="qchips">'+r.items.map(x=>'<span class="pill" data-qr="su:'+x.s+'">'+T('Surah','سورة')+' '+E(SN[x.s-1])+'</span>').join('')+'</div>';
  if(r.loading)h+='<p class="empty">'+T('Searching…','جاري البحث…')+'</p>';
  else if(r.fail)h+='<p class="msg">'+T('This needs an internet connection. Try again.','ده محتاج إنترنت. جرّب تاني.')+'</p>';
  else{
    if(r.ay&&r.ay.length){h+='<p class="um">'+T('Verses found','آيات لقيناها')+': '+ar(r.total||r.ay.length)+(r.total>r.ay.length?' ('+T('showing first','معروض أول')+' '+ar(r.ay.length)+')':'')+'</p>'+r.ay.map(x=>'<div class="qr-r" data-qr="ay:'+x.s+':'+x.a+'"><b>'+E(SN[x.s-1])+' · '+ar(x.a)+'</b><span>'+E(x.text)+'</span></div>').join('')}
    else if(!r.items.length)h+='<p class="empty">'+T('Nothing found. Try other words or a surah name.','مفيش نتيجة. جرّب كلمات تانية أو اسم سورة.')+'</p>';
  }
  return h;
}
function pageViewHTML(){
  const d=QR.cache[QR.page],n=QR.page;
  const surs=d?[...new Set(d.ayahs.map(a=>a.surah&&a.surah.number).filter(Boolean))].map(s=>SN[s-1]).join(' · '):'',juz=d&&d.ayahs[0]?d.ayahs[0].juz:'';
  let h='<div class="qbar"><button type="button" class="pill" data-qr="home">'+T('← Index','← الفهرس')+'</button><span class="qti">'+E(surs)+(juz?' · '+T('Juz','جزء')+' '+ar(juz):'')+'</span></div>';
  if(!d){h+=QR.err?'<p class="msg">'+T('This needs an internet connection. Try again.','ده محتاج إنترنت. جرّب تاني.')+'</p><button type="button" class="btn" data-qr="retry" style="width:auto">'+T('Retry','حاول تاني')+'</button>':'<p class="empty">'+T('Loading…','جاري التحميل…')+'</p>'}
  else h+='<div class="qpg'+(QR.dir?(QR.dir>0?' qn':' qp'):'')+'">'+pageHTML(d)+'<div class="qf">'+ar(n)+'</div></div>';
  h+='<div class="qnav"><button type="button" class="btn alt" data-qr="prev"'+(n<=1?' disabled':'')+'>→ '+T('Previous','السابقة')+'</button><span class="qgo"><input id="qrPg" type="number" min="1" max="604" inputmode="numeric" value="'+n+'"><button type="button" class="pill" data-qr="goto">'+T('Go','اذهب')+'</button></span><button type="button" class="btn alt" data-qr="next"'+(n>=604?' disabled':'')+'>'+T('Next','التالية')+' ←</button></div>';
  h+='<p class="um">'+T('Tap a verse for its meaning · swipe to turn the page','اضغط على أي آية تشوف تفسيرها · اسحب يمين/شمال تقلّب الصفحة')+'</p>';
  return h;
}
function ui(){
  const bk='<button type="button" class="pill" data-rel="" style="margin-bottom:12px">'+T('← Back','← رجوع')+'</button>';
  let body=QR.view==='page'?pageViewHTML():QR.view==='res'?resHTML():bk+homeHTML();
  return '<div class="rl qr">'+body+'</div>';
}

/* ---------- ورقة التفسير ---------- */
function closeSheet(){const o=document.getElementById('qrSheet');if(o)o.remove();document.querySelectorAll('.qa.sel').forEach(x=>x.classList.remove('sel'));QR.sel=null}
async function openSheet(s,a,el){
  closeSheet();QR.sel={s,a};if(el)el.classList.add('sel');
  const o=document.createElement('div');o.id='qrSheet';
  const draw=()=>{const k=s+':'+a,tf=QR.tf[k];
    o.innerHTML='<div class="qs-h"><b>'+T('Surah','سورة')+' '+E(SN[s-1])+' · '+T('verse','آية')+' '+ar(a)+'</b><button type="button" data-qr="xs" aria-label="close">✕</button></div><div class="qs-b">'+(tf?E(tf):'<span class="empty">'+T('Loading meaning…','جاري تحميل التفسير…')+'</span>')+'</div><div class="qs-a"><button type="button" class="pill" data-qr="bm:'+s+':'+a+'">'+(hasBm(s,a)?'🔖 '+T('Remove bookmark','شيل العلامة'):'🔖 '+T('Bookmark','علّم هنا'))+'</button><button type="button" class="pill" data-qr="cp:'+s+':'+a+'">📋 '+T('Copy verse','نسخ الآية')+'</button></div>'};
  draw();document.body.appendChild(o);
  if(!QR.tf[s+':'+a]){
    try{const r=await fetch(API+'/ayah/'+s+':'+a+'/ar.muyassar');const j=await r.json();QR.tf[s+':'+a]=(j&&j.data&&j.data.text)||T('Meaning not available.','التفسير مش متاح دلوقتي.')}
    catch(_){QR.tf[s+':'+a]=T('This needs an internet connection.','ده محتاج إنترنت.')}
    if(document.getElementById('qrSheet')===o&&QR.sel&&QR.sel.s===s&&QR.sel.a===a)draw();
  }
}

/* ---------- الأحداث ---------- */
document.addEventListener('click',e=>{
  if(!gv()&&!e.target.closest('#qrSheet'))return;
  const x=e.target.closest('[data-qr]'),q=e.target.closest('[data-qa]');
  if(x){
    const v=x.dataset.qr,p=v.split(':');
    if(v==='home'){QR.view='home';QR.msg='';closeSheet();redraw();window.scrollTo({top:0});return}
    if(v==='search'){const i=document.getElementById('qrS');search(i?i.value:'');return}
    if(p[0]==='ex'){const i=document.getElementById('qrS');if(i)i.value=v.slice(3);search(v.slice(3));return}
    if(p[0]==='su'){openSurah(+p[1]);return}
    if(p[0]==='pg'){show(+p[1]);return}
    if(p[0]==='ay'){openAyah(+p[1],+p[2]);return}
    if(v==='next'){turn(1);return}
    if(v==='prev'){turn(-1);return}
    if(v==='retry'){load();return}
    if(v==='goto'){const i=document.getElementById('qrPg'),n=+(i&&i.value);if(n>=1&&n<=604)show(n);else if(i)i.value=QR.page;return}
    if(v==='xs'){closeSheet();return}
    if(p[0]==='bm'){toggleBm(+p[1],+p[2]);const el=document.getElementById('qrSheet');if(el){const b=el.querySelector('[data-qr^="bm:"]');if(b)b.textContent=hasBm(+p[1],+p[2])?'🔖 '+T('Remove bookmark','شيل العلامة'):'🔖 '+T('Bookmark','علّم هنا')}return}
    if(p[0]==='cp'){const el=document.querySelector('.qa[data-qa="'+p[1]+':'+p[2]+'"]');const t=el?el.textContent:'';try{navigator.clipboard.writeText(t)}catch(_){}if(typeof toast==='function')toast(T('Copied','تم النسخ'));return}
    return;
  }
  if(q&&gv()&&QR.view==='page'){const p=q.dataset.qa.split(':');openSheet(+p[0],+p[1],q)}
});
document.addEventListener('keydown',e=>{
  if(!gv())return;
  if(e.key==='Enter'){const t=e.target;if(t&&t.id==='qrS'){e.preventDefault();search(t.value)}else if(t&&t.id==='qrPg'){e.preventDefault();const n=+t.value;if(n>=1&&n<=604)show(n)}return}
  if(QR.view!=='page'||/INPUT|TEXTAREA/.test((e.target||{}).tagName||''))return;
  if(e.key==='ArrowLeft')turn(1);else if(e.key==='ArrowRight')turn(-1);
});
let tx=null,ty=0,tt=0;
document.addEventListener('touchstart',e=>{const p=e.target.closest&&e.target.closest('.qpg');if(!p||e.touches.length!==1){tx=null;return}tx=e.touches[0].clientX;ty=e.touches[0].clientY;tt=Date.now()},{passive:true});
document.addEventListener('touchend',e=>{if(tx==null)return;const t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;tx=null;if(Math.abs(dx)>70&&Math.abs(dy)<60&&Math.abs(dx)>Math.abs(dy)*1.6&&Date.now()-tt<800){turn(dx>0?1:-1)}},{passive:true});
document.addEventListener('click',e=>{const c=e.target.closest('#chips [data-c]');if(c&&c.dataset.c!=='religion')closeSheet();if(e.target.closest('[data-rel]'))closeSheet()},true);

/* ---------- ربط بالـUI القديم + المساعد ---------- */
const origUI=window.relUI;
window.relUI=function(){if(typeof relV!=='undefined'&&relV==='quran')return ui();return origUI?origUI.apply(this,arguments):''};
const origPick=window.hzPick;
window.hzPick=function(q,ans,srv){
  let r=null;try{r=quranIntent(q,ans)}catch(_){}
  if(r&&typeof CATALOG!=='undefined'&&CATALOG.some(x=>x.id==='religion'))return{id:'religion',sub:'quran',quran:r};
  return origPick?origPick.apply(this,arguments):null;
};
const origLabel=window.hzSecLabel;
window.hzSecLabel=function(pk){
  if(pk&&pk.quran){const r=pk.quran;return T('Open Mushaf','افتح المصحف')+': '+T('Surah','سورة')+' '+SN[r.s-1]+(r.a?' · '+T('verse','آية')+' '+ar(r.a):'')}
  return origLabel?origLabel.apply(this,arguments):'';
};
const origOpen=window.hzOpenSec;
window.hzOpenSec=function(pk){
  if(pk&&pk.quran){deep(pk.quran.s,pk.quran.a);return}
  return origOpen?origOpen.apply(this,arguments):undefined;
};
window.hzQuran={open:deep,page:p=>{relV='quran';if(typeof goCat==='function')goCat('religion');show(p)},parse:parseRef,intent:quranIntent};

/* ---------- ستايل ---------- */
const st=document.createElement('style');st.id='qrCss';
st.textContent=`.qr .qs{display:flex;gap:8px;margin-bottom:8px}.qr .qs input,.qr .qgo input{flex:1;min-width:0;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:12px;padding:11px 12px;font:inherit}
.qr .qh2{font-size:12.5px;color:var(--mut);margin:0 0 8px}.qr .qh2 u{cursor:pointer;color:var(--p);text-decoration:none;border-bottom:1px dashed var(--p)}
.qr .qh3{margin:14px 0 6px;color:var(--p)}.qr .qchips{display:flex;flex-wrap:wrap;gap:8px}.qr .qj .pill{min-width:42px;text-align:center}
.qr .qbar{display:flex;align-items:center;gap:10px;margin-bottom:10px}.qr .qti{font-weight:700;font-size:14px}
.qpg{position:relative;background:linear-gradient(#fffdf6,#f7efd6);color:#1c1a14;border:2px solid #c9a24b;border-radius:14px;padding:16px 12px 8px;direction:rtl;box-shadow:0 8px 22px -14px rgba(0,0,0,.45);touch-action:pan-y}
[data-theme=dark] .qpg{background:linear-gradient(#1d2d30,#162326);color:#f1efe6;border-color:#8a7640}
.qpg .qt{font-family:Amiri,'Scheherazade New',serif;font-size:clamp(21px,5.4vw,27px);line-height:2.3;text-align:justify;margin:0}
.qpg .qh{margin:10px 0 4px;text-align:center}.qpg .qh span{display:inline-block;min-width:60%;padding:5px 18px;border:1.5px solid #c9a24b;border-radius:10px;background:rgba(201,162,75,.16);font-family:Amiri,serif;font-weight:700;font-size:20px}
.qpg .qb{text-align:center;font-family:Amiri,serif;font-size:clamp(21px,5.2vw,26px);margin:2px 0 4px}
.qa{cursor:pointer;border-radius:6px;transition:background .2s}.qa.sel{background:rgba(15,118,110,.25)}.qa.hl{background:rgba(245,158,11,.38);box-shadow:0 0 0 2px rgba(245,158,11,.38)}
.qa i{font-style:normal;color:#b45309;font-size:.68em;margin:0 2px;white-space:nowrap}[data-theme=dark] .qa i{color:#fbbf24}
.qpg .qf{text-align:center;font-size:13px;opacity:.65;padding-top:6px;font-family:Cairo,sans-serif}
.qpg.qn{animation:qrN .28s ease-out}.qpg.qp{animation:qrP .28s ease-out}
@keyframes qrN{from{opacity:.2;transform:translateX(-28px)}}@keyframes qrP{from{opacity:.2;transform:translateX(28px)}}
.qr .qnav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 0 4px}.qr .qnav .btn{width:auto;padding:10px 12px;font-size:13px;flex:none}.qr .qnav .btn[disabled]{opacity:.4}
.qr .qgo{display:flex;align-items:center;gap:6px;flex:1;min-width:0;justify-content:center}.qr .qgo input{max-width:72px;text-align:center;padding:9px 6px}
.qr-r{padding:10px 12px;border:1px solid var(--line);border-radius:12px;margin:8px 0;cursor:pointer;background:var(--bg)}.qr-r b{display:block;color:var(--p);font-size:13px;margin-bottom:4px}.qr-r span{font-family:Amiri,serif;font-size:19px;line-height:2;direction:rtl;display:block}
#qrSheet{position:fixed;left:0;right:0;bottom:0;z-index:80;background:var(--card);color:var(--ink);border-top:1px solid var(--line);border-radius:20px 20px 0 0;box-shadow:0 -12px 34px -12px rgba(0,0,0,.4);padding:14px 16px calc(14px + env(safe-area-inset-bottom));max-height:52vh;overflow:auto;direction:rtl;animation:qrUp .22s ease-out}
@keyframes qrUp{from{transform:translateY(40px);opacity:.3}}
#qrSheet .qs-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}#qrSheet .qs-h button{border:0;background:none;color:inherit;font-size:20px;cursor:pointer}
#qrSheet .qs-b{font-size:16px;line-height:2;margin-bottom:10px}#qrSheet .qs-a{display:flex;gap:8px;flex-wrap:wrap}`;
document.head.appendChild(st);
})();
