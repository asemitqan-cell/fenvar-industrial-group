/* Horizon: "طلب عرض سعر" - ملف مستقل بيتحمّل بعد prices.js.
   1) أي طلب عرض سعر في بحث الـAI بيتحوّل مباشرة لنموذج الأسئلة بتاع القسم.
   2) جوه كل قسم (UPVC / زجاج / خشب) بيظهر كارت "طلب عرض سعر".
   3) العرض بيتحسب من أسعار الموردين الموثّقين (hz_price_items) وبيترشّح المورد الأنسب. */
(function(){
'use strict';
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $q=s=>document.querySelector(s);
const MAP={upvc:'upvc',glass:'upvc',wood:'wood',furniture:'wood',health:'nursing',iron:'iron',paints:'paints'};
const INTENT=/(عرض\s*(ال)?سعر|عروض\s*(ال)?[اأ]سعار|كوتيشن|تسعير|quotation|\bquote\b|price\s*quote|\bangebot\b)/i;
const PRICEW=/(بكام|بكم|كام\s*سعر|سعر|اسعار|أسعار|تكلفة|تكلف|price|cost|how much|preis)/i;
const SEC_WORDS=[['installment',/(قسط|تقسيط|بالقسط|installment)/i],['nursing',/(تمريض|ممرض|حقن|كانيولا|رعاية مسنين|nursing)/i],['accessories',/(مفصلة|كالون|ترباس|مقبض|عين سحرية|اكسسوار|إكسسوار)/i],['upvc',/(upvc|يو\s*بي\s*في\s*سي|قطاع|قطاعات|شباك|شبابيك|شتر|بلكونة|دبل جلاس|سيكوريت|زجاج)/i],['wood',/(خشب|أبلكاش|ابلكاش|mdf|مطبخ|دولاب|موبيليا)/i],['paints',/(بويات|بويه|بوية|دهان|دهانات|نقاش)/i],['iron',/(حديد|حدادة|درابزين|بوابة|سلم)/i]];
const OR={belgian:['بلجيكي','الخامات عالية الجودة'],turkish:['تركي','عالي - متوسط'],egyptian:['مصري','متوسط - أقل']};
const Q={sec:null,origin:'',stats:{},sent:0,lines:[],custom:'',budget:'',city:'',prices:null,res:null,busy:0,msg:''};
let AVAIL={};

function ensureModal(){if($q('#qtModal'))return;
 const st=document.createElement('style');st.textContent=`
#qtModal .qt-l{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:10px;margin:8px 0;display:grid;gap:6px}
#qtModal .qt-l select,#qtModal .qt-l input,#qtModal .qt-b select,#qtModal .qt-b input,#qtModal .qt-b textarea{border:1px solid var(--line);border-radius:10px;padding:9px 10px;background:var(--bg);width:100%}
#qtModal .qt-2{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#qtModal .qt-x{justify-self:end;border:1px solid var(--line);background:var(--card);border-radius:10px;padding:2px 10px;cursor:pointer}
#qtModal .qt-r{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:12px;margin:8px 0}
#qtModal .qt-r.best{border:2px solid var(--p)}
#qtModal .qt-tag{display:inline-block;background:var(--p);color:#fff;border-radius:999px;padding:2px 10px;font-size:12px;margin-inline-start:6px}
#qtModal .qt-s{font-size:12px;color:var(--mut)}#qtModal .qt-t{font-size:20px;font-weight:800}
#qtModal table{width:100%;border-collapse:collapse;font-size:13px;margin-top:6px}#qtModal td{padding:3px 0;border-bottom:1px dashed var(--line)}
#qtModal .qt-o label{display:flex;gap:10px;align-items:center;border:1px solid var(--line);background:var(--card);border-radius:12px;padding:10px;margin:6px 0;cursor:pointer}
#qtModal .qt-b .qt-o input{width:auto;margin:0}
.qt-card{cursor:pointer}`;document.head.appendChild(st);
 document.body.insertAdjacentHTML('beforeend','<div class="modal" id="qtModal" hidden><div class="sheet st"><button type="button" class="x" data-qclose>×</button><div id="qtBody"></div></div></div>')}

function show(){ensureModal();$q('#qtModal').hidden=false}
function hide(){const m=$q('#qtModal');if(m)m.hidden=true}
const FB=(function(){const U={m2:'متر مربع',m:'متر طولي',piece:'قطعة',set:'طقم',kg:'كجم',ton:'طن',service:'خدمة',visit:'زيارة',hour:'ساعة',shift:'شيفت 12 ساعة',day:'يوم',month:'شهر'};
const COL=['color','اللون','t'],BR=['brand','الماركة','t'],SZ=['size','المقاسات','t'],TH=['thick','السُمك (مم)','n'],MT=['mat','الخامة','t'];
const INST=[['m2','piece'],['تركيب','فك وتركيب','تركيب وتشطيب']];
const S=[
{id:'upvc',ico:'🪟',ar:'UPVC',groups:[
 {k:'sector',ar:'القطاعات',u:['m2','piece'],pre:['شباك مفصلي','شباك سحاب','باب بلكونة','باب مفصلي','فيكس','قلاب'],f:[BR,COL,SZ]},
 {k:'glass',ar:'الزجاج',u:['m2'],pre:['زجاج مفرد','دبل جلاس','سيكوريت','عاكس','ملون'],f:[TH,COL]},
 {k:'acc',ar:'الإكسسوارات',u:['piece','set'],pre:['مقبض','قفل','سلك حشرات'],f:[BR,COL]},
 {k:'install',ar:'التركيب',u:['m2','piece'],pre:INST[1],f:[]}]},
{id:'wood',ico:'🪵',ar:'الخشب',groups:[
 {k:'raw',ar:'الخامات',u:['m2','piece','m'],pre:['زان','موسكي','سويد','أبلكاش','MDF','HDF','قشرة / فينير'],f:[TH,SZ,['origin','المصدر',['محلي','مستورد']]]},
 {k:'work',ar:'التصنيع',u:['m','m2','piece'],pre:['مطبخ خشب','دولاب','باب خشب','دريسنج','سرير','تفصيل حسب الطلب'],f:[MT,['finish','التشطيب',['دوكو','بويه','لاكيه','قشرة','طبيعي']]]},
 {k:'install',ar:'التركيب',u:['m2','piece','m'],pre:INST[1],f:[]}]},
{id:'iron',ico:'🔩',ar:'الحديد',groups:[
 {k:'raw',ar:'الخامات',u:['ton','kg','m','piece'],pre:['حديد تسليح','كمرة','زاوية','ماسورة','صاج','شبك'],f:[SZ,TH,['grade','الدرجة','t']]},
 {k:'work',ar:'أعمال الحدادة',u:['m2','m','piece','ton'],pre:['باب حديد','شباك حديد','سلم','درابزين','بوابة','مظلة','هنجر / شيد'],f:[TH,['paint','الدهان',['زيت','بويه فرن','جلفنة','بدون']]]},
 {k:'install',ar:'التركيب',u:['m2','m','piece'],pre:INST[1],f:[]}]},
{id:'accessories',ico:'🧰',ar:'الإكسسوارات',groups:[
 {k:'doors',ar:'الأبواب',u:['piece','set'],pre:['مفصلة','كالون','مقبض','قفل','ترباس','عين سحرية'],f:[BR,['finish','اللون / التشطيب','t'],MT]},
 {k:'kitchen',ar:'المطبخ والدواليب',u:['piece','set','m'],pre:['مفصلة هيدروليك','سكة درج','مقبض مطبخ','رجل','سلة'],f:[BR,['finish','اللون / التشطيب','t'],MT]},
 {k:'other',ar:'أخرى',u:['piece','set','m','m2'],pre:[],f:[BR,COL,SZ]}]},
{id:'installment',ico:'💳',ar:'البيع بالقسط',groups:[
 {k:'plan',ar:'منتجات وخطط',u:['piece','set'],pre:[],inst:1,f:[['down','المقدم %','n'],['months','عدد الشهور','n'],['rate','الفايدة السنوية %','n'],['fee','مصاريف إدارية','n'],['docs','المستندات المطلوبة','t']]}]},
{id:'nursing',ico:'🩺',ar:'التمريض',groups:[
 {k:'service',ar:'الخدمات',u:['visit','hour','shift','day','month'],pre:['حقن عضل / وريد','تغيير على جرح','قياس سكر وضغط','تركيب كانيولا / محلول','قسطرة','رعاية مسنين','رعاية بعد عملية','سحب عينات منزلي'],f:[['area','المناطق','t'],['incl','المستلزمات',['تشمل','لا تشمل']]]},
 {k:'extra',ar:'إضافات',u:['piece','visit','day'],pre:['زيادة ليلي','زيادة إجازة','مواصلات'],f:[]}]}
];
return {S:S,U:U}})();
function sections(){return window.HZ_SECTIONS||FB.S}
function sec(id){return sections().find(s=>s.id===id)}
function instM(it,sub){const sp=it.specs||{},m=+sp.months;if(!m)return '';const fin=sub*(1-(+sp.down||0)/100),tot=fin*(1+(+sp.rate||0)/100*m/12)+(+sp.fee||0);return ` <span class="qt-s">(${T('monthly','القسط الشهري')} ≈ ${Math.round(tot/m).toLocaleString()} × ${m})</span>`}
function unit(u){return (window.HZ_UNITS||FB.U||{})[u]||u||''}
function guess(q){for(const [id,re] of SEC_WORDS)if(re.test(q))return id;return null}

async function loadPrices(secId){
 Q.prices=null;if(!sb)return[];
 try{
  const r=await sb.from('hz_price_items').select('*').eq('section',secId).eq('active',true).limit(2000);
  if(r.error)throw r.error;
  const items=r.data||[];const ids=[...new Set(items.map(x=>x.provider_id))];
  let provs=[],profs=[];
  if(ids.length){
   const a=await sb.from('hz_providers').select('*').in('user_id',ids);provs=a.data||[];
   const b=await sb.from('hz_profiles').select('*').in('id',ids);profs=b.data||[]}
  const ok=new Set(provs.filter(p=>p.verified).map(p=>p.user_id));
  const nm={};ids.forEach(id=>{const p=profs.find(x=>x.id===id)||{},v=provs.find(x=>x.user_id===id)||{};nm[id]=p.business_name||p.brand||v.business_name||v.name||p.full_name||T('Supplier','مورد')});
  Q.prices=items.filter(x=>ok.has(x.provider_id)&&x.price!=null).map(x=>Object.assign({},x,{pname:nm[x.provider_id]}));
 }catch(e){Q.prices=[];Q.msg=(e&&e.message)||''}
 AVAIL={};(Q.prices||[]).forEach(x=>{(AVAIL[x.group_key]=AVAIL[x.group_key]||new Set()).add(x.name)});
 return Q.prices}

const orgNote=()=>Q.sec==='upvc'&&OR[Q.origin]?'القطاعات المطلوبة: '+OR[Q.origin][0]+' ('+OR[Q.origin][1]+')':'';
function originHTML(){if(Q.sec!=='upvc')return '';
 return `<div class="qt-o" style="margin-top:10px"><b style="display:block;margin-bottom:4px">${T('Our profile (section) types','القطاعات بتاعتنا (اختار نوع القطاعات)')}</b>${Object.keys(OR).map((k,i)=>`<label><input type="radio" name="qorigin" data-qf="origin" value="${k}"${Q.origin===k?' checked':''}><span>${i+1}- ${OR[k][0]} (${OR[k][1]})</span></label>`).join('')}</div>`}
function newLine(){const s=sec(Q.sec);const g=s.groups.find(g=>g.k!=='install')||s.groups[0];return{g:g.k,name:'',qty:1,note:''}}
function names(gk){const s=sec(Q.sec),g=s.groups.find(x=>x.k===gk);if(!g)return[];
 const av=AVAIL[gk]?[...AVAIL[gk]]:[];return [...new Set(g.pre.filter(n=>av.includes(n)).concat(av))]}

function formHTML(){const s=sec(Q.sec);
 const lines=Q.lines.map((l,i)=>{const g=s.groups.find(x=>x.k===l.g)||s.groups[0],nn=names(g.k);
  return `<div class="qt-l"><button type="button" class="qt-x" data-q="del:${i}">×</button>
  <select data-qi="${i}" data-f="g">${s.groups.map(x=>`<option value="${x.k}"${x.k===l.g?' selected':''}>${x.ar}</option>`).join('')}</select>
  ${nn.length?`<select data-qi="${i}" data-f="name"><option value="">${T('Choose','اختار')}…</option>${nn.map(n=>`<option${n===l.name?' selected':''}>${E(n)}</option>`).join('')}</select>`
   :`<input data-qi="${i}" data-f="name" value="${E(l.name)}" placeholder="${T('Type what you need','اكتب اللي محتاجه')}">`}
  <div class="qt-2"><input type="number" min="0" step="any" inputmode="decimal" data-qi="${i}" data-f="qty" value="${E(l.qty)}" placeholder="${T('Quantity','الكمية')}"><input data-qi="${i}" data-f="note" value="${E(l.note)}" placeholder="${T('Size / color (optional)','المقاس / اللون (اختياري)')}"></div></div>`}).join('');
 return `<div class="qt-b"><div style="display:flex;gap:8px;align-items:center;justify-content:space-between"><h3 style="margin:0">${s.ico} ${T('Request a quote','طلب عرض سعر')} · ${s.ar}</h3></div>
 <p class="qt-s">${T('Tell us what you need. We build the quote from our suppliers\' own prices.','قولنا محتاج إيه، وإحنا بنحسب العرض من أسعار الموردين نفسهم.')}</p>
 ${Q.prices&&!Q.prices.length?`<p class="msg">${T('No supplier prices yet for this section. You can still send a custom request.','لسه مفيش أسعار موردين في القسم ده. تقدر تبعت طلب خاص.')}</p>`:''}
 ${lines}<button type="button" class="pill" data-q="add">+ ${T('Add another item','ضيف بند تاني')}</button>
 <label style="display:block;margin-top:10px"><span>${T('Special request (optional)','طلب خاص (اختياري)')}</span><textarea data-qf="custom" rows="3" placeholder="${T('Anything not in the list','أي حاجة مش موجودة في الاختيارات')}">${E(Q.custom)}</textarea></label>
 ${originHTML()}
 <div class="qt-2" style="margin-top:10px"><label><span>${T('Budget (optional)','ميزانيتك كام (اختياري)')}</span><input type="number" min="0" inputmode="decimal" data-qf="budget" value="${E(Q.budget)}"></label><label><span>${T('City','المدينة')}</span><input data-qf="city" value="${E(Q.city)}"></label></div>
 ${simBtns(0)}<p class="msg">${E(Q.msg)}</p><button type="button" class="btn" data-q="calc"${Q.busy?' disabled':''}>${T('Show my quotes','اعرض عروض الأسعار')}</button></div>`}

async function qStats(){try{const ids=(Q.res?Q.res.res:[]).map(x=>x.id);if(!ids.length)return;const r=await sb.rpc('hzq_provider_stats',{p_ids:ids});if(!r.error&&r.data){Q.stats=r.data;if(Q.res)draw()}}catch(_){}}
const statLine=id=>{const s=(Q.stats||{})[id];return !s||!(+s.closed||+s.n)?'<span class="qt-s"> · مورد جديد على Horizon</span>':`<span class="qt-s"> · ${+s.n?'★ '+Number(s.avg).toFixed(1)+' ('+s.n+' تقييم) · ':''}${+s.closed} صفقة اتقفلت</span>`};
function calc(){
 const lines=Q.lines.filter(l=>l.name.trim()&&+l.qty>0);
 const by={};(Q.prices||[]).forEach(x=>{(by[x.provider_id]=by[x.provider_id]||{name:x.pname,items:[]}).items.push(x)});
 const res=Object.keys(by).map(id=>{const sp=by[id];let total=0,hit=0;
  const rows=lines.map(l=>{const it=sp.items.find(x=>x.group_key===l.g&&x.name===l.name.trim());
   if(!it)return{l,miss:1};const sub=Number(it.price)*Number(l.qty);total+=sub;hit++;return{l,it,sub}});
  return{id,name:sp.name,rows,total,hit,full:hit===lines.length&&lines.length>0}}).filter(r=>r.hit>0);
 res.sort((a,b)=>(b.full-a.full)||(a.full&&b.full?a.total-b.total:b.hit-a.hit||a.total-b.total));
 Q.res={res,lines};return Q.res}

function resultHTML(){const {res,lines}=Q.res,bud=+Q.budget||0,s=sec(Q.sec);
 const fm=n=>Math.round(n).toLocaleString();
 const best=res.find(r=>r.full);
 const head=!lines.length?`<p class="msg">${T('Add at least one item.','ضيف بند واحد على الأقل.')}</p>`
  :!res.length?`<p class="hs-box">${T('No supplier has these exact items priced yet. Your request was saved as a custom request and we will source it for you.','مفيش مورد مسعّر البنود دي بالظبط لسه. طلبك اتسجّل كطلب خاص وهنجيبهولك.')}</p>`
  :best?`<p class="hs-box"><b>${T('Recommended','ترشيحنا')}: ${E(best.name)}</b><br>${T('Lowest total for everything you asked','أقل إجمالي لكل اللي طلبته')}: <b>${fm(best.total)}</b>${bud?(best.total<=bud?' · '+T('within your budget','داخل ميزانيتك'):' · '+T('above your budget','أعلى من ميزانيتك')):''}${res.filter(r=>r.full).length>1?`<br><span class="qt-s">${T('Next best is','التاني بعده')} ${fm(res.filter(r=>r.full)[1].total)}</span>`:''}</p>`
  :`<p class="hs-box">${T('No single supplier covers everything. Closest options are below.','مفيش مورد واحد بيغطي كل حاجة. دي أقرب العروض.')}</p>`;
 const cards=res.map(r=>`<div class="qt-r${best&&r.id===best.id?' best':''}"><b>${E(r.name)}</b>${best&&r.id===best.id?`<span class="qt-tag">${T('Best','الأنسب')}</span>`:''}${r.full?'':`<span class="qt-s"> · ${r.hit}/${lines.length}</span>`}${statLine(r.id)}
  <div class="qt-t">${fm(r.total)}</div>
  <table>${r.rows.map(x=>x.miss?`<tr><td>${E(x.l.name)}</td><td class="qt-s" style="text-align:end">${T('not offered','مش متوفر عنده')}</td></tr>`
   :`<tr><td>${E(x.l.name)} × ${E(x.l.qty)} ${unit(x.it.unit)}${sec(Q.sec).groups[0].inst?instM(x.it,x.sub):''}</td><td style="text-align:end">${fm(x.sub)}</td></tr>`).join('')}</table>
  <button type="button" class="btn" style="margin-top:8px" data-q="send:${r.id}">${T('Send my request to this supplier','ابعت طلبي للمورد ده')}</button></div>`).join('');
 return `<div class="qt-b"><button type="button" class="pill" data-q="edit">${lang==='ar'?'› ':'‹ '}${T('Edit','تعديل')}</button><h3 style="margin:10px 0">${s.ico} ${T('Your quotes','عروض الأسعار')}</h3>${orgNote()?`<p class="qt-s">${E(orgNote())}</p>`:''}${head}${simBtns(1)}${res.length?`<p class="qt-s">🔒 بيانات تواصلك بتفضل مخفية عن المورد لحد ما تقبل عرضه. بعدها بتتابعوا التنفيذ والتقييم من Horizon.</p><button type="button" class="btn" data-q="sendall" style="margin:8px 0">📢 ابعت طلبي لكل الموردين المناسبين وخلّيهم يقدّموا عروضهم</button>`:''}${cards}<p class="msg${Q.ok?' ok':''}">${E(Q.msg)}</p>${Q.ok&&Q.sent?'<button type="button" class="btn" data-q="mine">🧾 تابع طلباتي وعروضك</button>':''}
  <p class="qt-s">${T('Prices come from suppliers and may change at confirmation.','الأسعار من الموردين وممكن تتغير وقت التأكيد.')}</p></div>`}

/* ---- عينة 3D لطلب العميل (بتشتغل من taxonomy.js: window.hzSim) ---- */
const SC=[[/أنثراسيت|انثراسيت/,'anth'],[/أسود|اسود/,'black'],[/بلوط|دهبي|ذهبي|خشبي/,'oak'],[/بني/,'brown'],[/رمادي|جراي/,'gray'],[/أبيض|ابيض/,'white']];
const SW=[[/جوز/,'walnut'],[/بلوط|زان|موسكي/,'oak'],[/ونجي/,'wenge'],[/رمادي/,'gray'],[/أبيض|ابيض/,'white']];
function simSize(t){const m=String(t||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).match(/(\d+(?:[.,]\d+)?)\s*(?:[x×*✕]|في)\s*(\d+(?:[.,]\d+)?)/i);if(!m)return null;let a=parseFloat(m[1].replace(',','.')),b=parseFloat(m[2].replace(',','.'));if(a<10&&b<10){a*=100;b*=100}return a>=30&&b>=30&&a<=400&&b<=400?[Math.round(a),Math.round(b)]:null}
function pickC(list,t,d){for(const [re,c] of list)if(re.test(t))return c;return d}
function simSpecs(){const id=Q.sec,lines=(Q.res?Q.res.lines:Q.lines).filter(l=>l.name&&String(l.name).trim());
 const all=lines.map(l=>l.name+' '+(l.note||'')).join(' '),tint=/عاكس/.test(all)?'mirror':/ملون|برونز/.test(all)?'bronze':/أخضر|اخضر/.test(all)?'green':/رمادي.*زجاج|زجاج.*رمادي/.test(all)?'gray':'clear',mesh=/سلك/.test(all)?1:0;
 const out=[],seen={};
 lines.forEach(l=>{const n=String(l.name).trim(),nt=String(l.note||''),t=n+' '+nt,sz=simSize(nt);let sp=null;
  if(id==='upvc'){
   if(/شباك سحاب|سحاب/.test(n))sp={kind:'window',type:'sliding',mesh};
   else if(/شباك مفصلي/.test(n))sp={kind:'window',type:/ضلفتين|ضلفتان/.test(nt)?'casement2':'casement1'};
   else if(/فيكس/.test(n))sp={kind:'window',type:'fixed'};
   else if(/قلاب/.test(n))sp={kind:'window',type:'tilt'};
   else if(/باب بلكونة/.test(n))sp={kind:'door',type:/سحاب|جرار/.test(nt)?'sliding':'hinged',w:90,h:215};
   else if(/باب مفصلي/.test(n))sp={kind:'door',type:'hinged'};
   else if(/زجاج|سيكوريت|دبل|عاكس|ملون/.test(n)){sp={kind:'glass',type:'fixed',tint:/عاكس/.test(n)?'mirror':/ملون/.test(n)?'bronze':tint};const th=(nt.match(/(\d+)\s*(?:مم|mm)?/)||[])[1];if(th&&[6,8,10,12].includes(+th))sp.thick=+th}
   if(sp){sp.color=pickC(SC,t,'white');if(sp.kind!=='glass'||!sp.tint)sp.tint=sp.tint||tint}
  }else if(id==='wood'){
   if(/دولاب/.test(n))sp={kind:'wardrobe',type:/جرار|سحاب/.test(nt)?'sliding':'hinged'};
   else if(/دريسنج/.test(n))sp={kind:'wardrobe',type:'drawers',w:240};
   else if(/مطبخ/.test(n))sp={kind:'kitchen',type:'hinged',w:240,h:90,d:60};
   else if(/باب خشب/.test(n))sp={kind:'door',type:'hinged',glass:0,tint};
   if(sp)sp.color=sp.kind==='door'?pickC(SC,t,'brown'):pickC(SW,t,'walnut');
  }else if(id==='iron'){
   if(/باب حديد/.test(n))sp={kind:'door',type:'hinged',glass:0,color:'black',prof:60};
   else if(/شباك حديد/.test(n))sp={kind:'window',type:'casement1',color:'black',prof:60,tint};
   else if(/بوابة/.test(n))sp={kind:'door',type:'french',glass:0,color:'black',prof:60,w:300,h:200};
   if(sp)sp.color=pickC(SC,t,'black')}
  if(sp&&!seen[n]){seen[n]=1;if(sz&&sp.kind!=='kitchen'){sp.w=sz[0];sp.h=sz[1]}else if(sz&&sp.kind==='kitchen')sp.w=sz[0];out.push({label:n,spec:sp})}});
 return out}
function simBtns(multi){const a=simSpecs();if(!multi)return `<button type="button" class="pill" style="width:100%;margin:8px 0" data-q="sim:0">🧊 ${T('Preview your order in 3D','شاهد عينة لطلبك 3D')}</button>`;
 if(!a.length)return '';return `<div style="display:grid;gap:6px;margin:10px 0">${a.map((x,i)=>`<button type="button" class="btn" data-q="sim:${i}">🧊 ${T('Preview your order','شاهد عينة لطلبك')}: ${E(x.label)}</button>`).join('')}</div>`}
function openSim(i){const a=simSpecs(),x=a[+i||0];if(!x){if(typeof toast==='function')toast(T('Pick an item like a window, door or wardrobe first.','اختار بند زي شباك أو باب أو دولاب الأول.'));return}if(window.hzSim)hzSim.open(x.spec);else if(typeof toast==='function')toast(T('3D preview is not loaded yet.','العينة 3D لسه ما اتحمّلتش.'))}

function draw(){ensureModal();$q('#qtBody').innerHTML=Q.res?resultHTML():formHTML()}

async function openQuote(secId,seed){
 const id=MAP[secId]||secId;if(!sec(id)){return false}
 if(id!=='upvc'&&id!=='wood'){if(typeof toast==='function')toast(T('Coming soon. We are focusing on UPVC and furniture for now.','قريبًا. دلوقتي بنركّز على UPVC والموبيليا.'));return true}
 if(!user){Q.pend=[secId,seed];if(typeof toast==='function')toast(T('Sign in first to request a quote.','سجّل دخول الأول عشان تطلب عرض سعر.'));if(typeof needLogin==='function')needLogin();return true}
 Q.sec=id;Q.res=null;Q.msg='';Q.ok=0;Q.lines=[];Q.custom=seed||'';Q.budget='';Q.origin='';Q.sent=0;Q.stats={};
 show();$q('#qtBody').innerHTML='<p class="hs-box">…</p>';
 await loadPrices(id);Q.lines=[newLine()];draw();return true}

async function save(chosen){
 const r=Q.res;if(!r)return;Q.msg='…';Q.ok=0;draw();
 const body={user_id:user.id,section:Q.sec,lines:r.lines,custom:[Q.custom,orgNote()].filter(Boolean).join('\n')||null,budget:Q.budget?+Q.budget:null,city:Q.city||null,
  chosen_provider:chosen||null,quote:r.res.map(x=>({provider_id:x.id,total:x.total,covered:x.hit,full:x.full})),status:'new'};
 try{const x=await sb.from('hz_quote_requests').insert(body);if(x.error)throw x.error;Q.ok=1;Q.sent=1;Q.msg='✓ '+(chosen?T('Request sent. The supplier will reply with an offer.','الطلب اتبعت. المورد هيرد بعرضه، وهتوصلك إشعار.'):T('Request sent to all matching suppliers. You will get a notification with each offer.','الطلب اتبعت لكل الموردين المناسبين. هيوصلك إشعار مع كل عرض.'))}
 catch(e){Q.msg=(typeof hzErr==='function'?hzErr(e):(e.message||String(e)))}
 draw()}

document.addEventListener('click',e=>{
 if(e.target.closest('[data-qclose]')){hide();return}
 const c=e.target.closest('.qt-card');if(c){openQuote(c.dataset.qs);return}
 const a=e.target.closest('[data-q]');if(!a||!$q('#qtModal')||!$q('#qtModal').contains(a))return;
 const [k,v]=a.dataset.q.split(':');
 if(k==='add'){Q.lines.push(newLine());draw()}
 else if(k==='del'){Q.lines.splice(+v,1);if(!Q.lines.length)Q.lines.push(newLine());draw()}
 else if(k==='calc'){calc();draw();qStats();if(Q.res&&(!Q.res.lines.length||!Q.res.res.length))save(null)}
 else if(k==='edit'){Q.res=null;Q.msg='';draw()}
 else if(k==='sim')openSim(v)
 else if(k==='send')save(v)
 else if(k==='sendall')save(null)
 else if(k==='mine'){hide();if(window.hzQuotes)hzQuotes('mine')}});
document.addEventListener('change',e=>{const t=e.target;if(!t.closest||!t.closest('#qtModal'))return;
 if(t.dataset.qi!=null){const l=Q.lines[+t.dataset.qi];l[t.dataset.f]=t.value;if(t.dataset.f==='g'){l.name='';draw()}}
 else if(t.dataset.qf)Q[t.dataset.qf]=t.value});
document.addEventListener('input',e=>{const t=e.target;if(!t.closest||!t.closest('#qtModal'))return;
 if(t.dataset.qi!=null&&t.tagName==='INPUT')Q.lines[+t.dataset.qi][t.dataset.f]=t.value;
 else if(t.dataset.qf)Q[t.dataset.qf]=t.value});

/* تحويل طلبات عرض السعر من بحث الـAI (قبل ما توصل لدالة askAI) */
function intercept(getEl,e){const el=getEl();if(!el)return;const q=(el.value||'').trim();
 if(!q)return;const g0=guess(q);
 if(!(INTENT.test(q)||(PRICEW.test(q)&&g0)))return;
 const id=g0||(MAP[cat]?MAP[cat]:null);
 if(!id){e.stopImmediatePropagation();e.preventDefault();el.value='';const ch0=$q('#chat');if(ch0)ch0.hidden=true;picker(q);return}
 if(!sec(MAP[id]||id))return;
 e.stopImmediatePropagation();e.preventDefault();el.value='';
 const ch=$q('#chat');if(ch)ch.hidden=true;const ai=$q('#ai');if(ai)ai.hidden=true;
 try{openQuote(id,q)}catch(err){if(typeof toast==='function')toast(String(err&&err.message||err))}}
document.addEventListener('click',e=>{if(e.target.closest('#aiGo'))intercept(()=>$q('#q'),e);else if(e.target.closest('#cGo'))intercept(()=>$q('#cIn'),e)},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;if(e.target&&e.target.id==='q')intercept(()=>$q('#q'),e);else if(e.target&&e.target.id==='cIn')intercept(()=>$q('#cIn'),e)},true);

/* كارت "طلب عرض سعر" في أول صفحة القسم */
function inject(){const g=$q('#grid');if(!g||typeof cat==='undefined')return;
 const id=MAP[cat];if(!id||!sec(id))return;
 if(g.querySelector('.qt-card'))return;
 g.insertAdjacentHTML('afterbegin',`<article class="card qt-card" data-qs="${cat}"><div class="thumb"><div class="ph" style="background:linear-gradient(135deg,#0F766E,#155E75);font-size:54px">🧾</div></div><div class="cb"><h3>${T('Request a quote','طلب عرض سعر')}</h3><small>${T('Answer a few questions, get prices from suppliers','جاوب كام سؤال وخد أسعار من الموردين')}</small><button class="btn" type="button">${T('Start','ابدأ')}</button></div></article>`)}
function boot(){const g=$q('#grid');if(!g){setTimeout(boot,300);return}
 new MutationObserver(()=>{if(!g.querySelector('.qt-card'))inject()}).observe(g,{childList:true});inject()}
boot();
function picker(seed){ensureModal();show();Q.res=null;
 $q('#qtBody').innerHTML=`<div class="qt-b"><h3>🧾 ${T('Request a quote','طلب عرض سعر')}</h3><p class="qt-s">${T('Pick a section','اختار القسم')}</p><div class="hs-g">${sections().map(s=>`<button type="button" class="hs-r" data-qpick="${s.id}"><span class="hs-i" style="--c:#0F766E">${s.ico}</span><span class="hs-t">${s.ar}</span></button>`).join('')}</div></div>`;
 Q.seed=seed||''}
document.addEventListener('click',e=>{const b=e.target.closest('[data-qpick]');if(b&&$q('#qtModal')&&$q('#qtModal').contains(b))openQuote(b.dataset.qpick,Q.seed)});

window.hzQuote=openQuote;
})();
