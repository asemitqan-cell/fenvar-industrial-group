/* Horizon: "منتجاتي وأسعاري" - لوحة أسعار المورد داخل الإعدادات.
   ملف مستقل: بيتحمّل بعد سكريبت الموقع الأساسي ومابيعدّلش فيه، وبيقرا/يكتب في hz_price_items بس.
   لإضافة قسم جديد: أضف عنصر في مصفوفة S (مجموعات + بنود جاهزة + حقول). */
(function(){
'use strict';
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const U={m2:'متر مربع',m:'متر طولي',piece:'قطعة',set:'طقم',kg:'كجم',ton:'طن',service:'خدمة',visit:'زيارة',hour:'ساعة',shift:'شيفت 12 ساعة',day:'يوم',month:'شهر'};
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
const PR={sec:null,gi:0,rows:null,del:[],msg:'',err:0,busy:0};
const g$=()=>PR.sec.groups[PR.gi];
const mk=(g,n,it,pre)=>({id:it?it.id:null,g:g.k,name:n,pre,unit:it?it.unit:g.u[0],price:it&&it.price!=null?it.price:'',specs:(it&&it.specs)||{},note:(it&&it.note)||'',open:0});

function css(){const s=document.createElement('style');s.textContent=`
.pr-t{display:flex;gap:6px;overflow-x:auto;padding:4px 18px 10px}.pr-c{flex:none;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:7px 14px;font-weight:600;cursor:pointer}.pr-c.on{background:var(--p);color:#fff;border-color:var(--p)}
.pr-r{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:10px;margin:8px 18px}.pr-n{display:flex;gap:6px;align-items:center;justify-content:space-between;margin-bottom:6px}.pr-n input{flex:1}
.pr-p{display:flex;gap:6px}.pr-p input{flex:1;min-width:0}.pr-p select{flex:1.2;min-width:0}
.pr-r input,.pr-r select{border:1px solid var(--line);border-radius:10px;padding:9px 10px;background:var(--bg);width:100%}
.pr-d,.pr-x{border:1px solid var(--line);background:var(--card);border-radius:10px;padding:0 12px;cursor:pointer}
.pr-s{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.pr-s[hidden]{display:none}.pr-s label{font-size:12px;color:var(--mut);display:block}
.pr-m{font-size:12px;color:var(--p);margin-top:6px}.pr-f{padding:6px 18px 18px;display:grid;gap:8px}`;document.head.appendChild(s)}

function inst(r){const p=+r.price,sp=r.specs||{},m=+sp.months;if(!p||!m)return '';
 const fin=p*(1-(+sp.down||0)/100),tot=fin*(1+(+sp.rate||0)/100*m/12)+(+sp.fee||0);
 return `القسط الشهري ≈ ${Math.round(tot/m).toLocaleString()} (إجمالي ${Math.round(tot+p-fin).toLocaleString()})`}

function fld(f,i,r){const v=r.specs[f[0]]==null?'':r.specs[f[0]],a=`data-pi="${i}" data-sk="${f[0]}"`;
 const inp=Array.isArray(f[2])?`<select ${a}><option value=""></option>${f[2].map(o=>`<option${o===v?' selected':''}>${esc(o)}</option>`).join('')}</select>`
  :`<input ${a} ${f[2]==='n'?'type="number" inputmode="decimal"':''} value="${esc(v)}">`;
 return `<label>${f[1]}${inp}</label>`}

function card(r,i,g){return `<div class="pr-r"><div class="pr-n">${r.pre?`<b>${esc(r.name)}</b>`
 :`<input data-pi="${i}" data-k="name" value="${esc(r.name)}" placeholder="${T('Item name','اسم البند')}"><button type="button" class="pr-x" data-pr="x:${i}">×</button>`}</div>
 <div class="pr-p"><input type="number" inputmode="decimal" min="0" data-pi="${i}" data-k="price" value="${esc(r.price)}" placeholder="${T('Price','السعر')}"><select data-pi="${i}" data-k="unit">${g.u.map(u=>`<option value="${u}"${u===r.unit?' selected':''}>${U[u]}</option>`).join('')}</select><button type="button" class="pr-d" data-pr="t:${i}">⋯</button></div>
 <div class="pr-s"${r.open?'':' hidden'}>${g.f.map(f=>fld(f,i,r)).join('')}<label style="grid-column:1/-1">${T('Note','ملاحظة')}<input data-pi="${i}" data-k="note" value="${esc(r.note)}"></label></div>
 ${g.inst?`<div class="pr-m" id="pri${i}">${inst(r)}</div>`:''}</div>`}

let PROV=null;
const bkA=()=>lang==='ar'?'›':'‹',fwA=()=>lang==='ar'?'‹':'›';
const root=h=>`<div class="pr-root">${h}</div>`;
async function getProv(){if(!user||!sb)return null;try{const r=await sb.from('hz_providers').select('*').eq('user_id',user.id).maybeSingle();return r.data||null}catch(_){return null}}

function draw(){const b=document.getElementById('hsBody');if(!b)return;
 if(!PR.sec){
  const gate=!user?T('Sign in first.','سجّل دخول الأول.'):!PROV?T('Register your provider details first (My store > Provider), then add your prices.','سجّل بياناتك كمورد الأول (متجري > مقدّم الخدمة) وبعدها ضيف أسعارك.')
   :(PROV.verified?'':T('Your prices appear in quotes after your account is verified.','أسعارك بتظهر في عروض الأسعار بعد توثيق حسابك.'));
  b.innerHTML=root(`<div class="hs-h"><button type="button" class="hs-b" data-pr="back">${bkA()}</button><h3>${T('My products & prices','منتجاتي وأسعاري')}</h3><span style="width:38px"></span></div>`+(gate?`<p class="hs-box">${gate}</p>`:'')
   +`<div class="hs-g">`+(user&&PROV?S.map(s=>`<button type="button" class="hs-r" data-pr="o:${s.id}"><span class="hs-i" style="--c:#0F766E">${s.ico}</span><span class="hs-t">${s.ar}</span><i class="hs-c">${fwA()}</i></button>`).join(''):'')+`</div>`);return}
 const s=PR.sec,g=g$();
 b.innerHTML=root(`<div class="hs-h"><button type="button" class="hs-b" data-pr="list">${bkA()}</button><h3>${s.ico} ${s.ar}</h3><span style="width:38px"></span></div>`
  +`<p class="hs-box" style="margin-bottom:6px">${T('Fill the price only for what you offer. Leave the rest empty.','اكتب السعر للي بتقدّمه بس، والباقي سيبه فاضي.')}${s.id==='nursing'&&PROV&&PROV.field!=='medical'?'<br><b>'+T('Medical services need a medical provider account with a license.','الخدمات الطبية محتاجة حساب مقدّم خدمة طبي بكارنيه.')+'</b>':''}</p>`
  +`<div class="pr-t">${s.groups.map((x,i)=>`<button type="button" class="pr-c${i===PR.gi?' on':''}" data-pr="g:${i}">${x.ar}</button>`).join('')}</div>`
  +(PR.rows?PR.rows.map((r,i)=>r.g===g.k?card(r,i,g):'').join('')+`<div class="pr-f"><button type="button" class="pr-c" data-pr="add">+ ${T('Add an item','إضافة بند')}</button><p class="msg${PR.err?'':' ok'}">${esc(PR.msg)}</p><button type="button" class="btn" data-pr="save"${PR.busy?' disabled':''}>${T('Save','حفظ')}</button></div>`:'<p class="hs-box">…</p>'))}

async function load(id,keep){PR.sec=S.find(x=>x.id===id);PR.gi=keep?PR.gi:0;PR.rows=null;PR.del=[];if(!keep){PR.msg='';PR.err=0}draw();
 let d=[];try{const r=await sb.from('hz_price_items').select('*').eq('provider_id',user.id).eq('section',id).order('created_at');if(r.error)throw r.error;d=r.data||[]}catch(e){PR.err=1;PR.msg=e.message||String(e)}
 const rows=[];PR.sec.groups.forEach(g=>{g.pre.forEach(n=>rows.push(mk(g,n,d.find(x=>x.group_key===g.k&&x.name===n),1)));
  d.filter(x=>x.group_key===g.k&&!g.pre.includes(x.name)).forEach(x=>rows.push(mk(g,x.name,x,0)))});
 PR.rows=rows;draw()}

async function save(){const s=PR.sec,ins=[],upd=[],del=PR.del.slice();PR.busy=1;PR.err=0;PR.msg='…';draw();
 PR.rows.forEach(r=>{const p=r.price===''?null:Number(r.price),ok=p!=null&&!isNaN(p)&&r.name.trim();
  if(!ok){if(r.id)del.push(r.id);return}
  const sp={};Object.keys(r.specs).forEach(k=>{if(r.specs[k]!=='')sp[k]=r.specs[k]});
  const o={name:r.name.trim(),unit:r.unit,price:p,specs:sp,note:r.note||null};
  r.id?upd.push([r.id,o]):ins.push(Object.assign({provider_id:user.id,section:s.id,group_key:r.g,active:true},o))});
 try{
  if(del.length){const x=await sb.from('hz_price_items').delete().in('id',del).eq('provider_id',user.id);if(x.error)throw x.error}
  for(const [id,o] of upd){const x=await sb.from('hz_price_items').update(o).eq('id',id).eq('provider_id',user.id);if(x.error)throw x.error}
  if(ins.length){const x=await sb.from('hz_price_items').insert(ins);if(x.error)throw x.error}
  PR.busy=0;await load(s.id,1);PR.msg='✓ '+T('Saved','تم الحفظ');draw()
 }catch(e){PR.busy=0;PR.err=1;PR.msg=typeof hzErr==='function'?hzErr(e):(e.message||String(e));draw()}}

document.addEventListener('click',async e=>{const a=e.target.closest('[data-pr]'),hb=document.getElementById('hsBody');if(!a||!hb||!hb.contains(a))return;
 const [k,v]=a.dataset.pr.split(':');
 if(k==='home'){PR.sec=null;PR.rows=null;PROV=await getProv();draw()}
 else if(k==='back'){PR.sec=null;if(typeof syncUI==='function')syncUI();else if(window.syncUI)window.syncUI()}
 else if(k==='list'){PR.sec=null;draw()}
 else if(k==='o'){load(v)}
 else if(k==='g'){PR.gi=+v;draw()}
 else if(k==='t'){const r=PR.rows[+v];r.open=!r.open;a.closest('.pr-r').querySelector('.pr-s').hidden=!r.open}
 else if(k==='x'){const r=PR.rows[+v];if(r.id)PR.del.push(r.id);PR.rows.splice(+v,1);draw()}
 else if(k==='add'){PR.rows.push(mk(g$(),'',null,0));draw()}
 else if(k==='save')save()});

const on=e=>{const t=e.target;if(!t.dataset||t.dataset.pi==null||!PR.rows)return;const r=PR.rows[+t.dataset.pi];if(!r)return;
 if(t.dataset.sk)r.specs[t.dataset.sk]=t.value;else r[t.dataset.k]=t.value;
 if(g$().inst){const el=document.getElementById('pri'+t.dataset.pi);if(el)el.textContent=inst(r)}};
document.addEventListener('input',on);document.addEventListener('change',on);

/* الإعدادات جوه index.html مقفولة فمش بنعدّل فيها: بنراقب #hsBody ونضيف الصف بعد كل رسم للإعدادات */
function inject(){const b=document.getElementById('hsBody');if(!b||!user||b.querySelector('.pr-root')||b.querySelector('[data-pr="home"]'))return;
 const g=b.querySelector('.hs-g');if(!g||!g.querySelector('[data-hs="acc"]'))return;
 g.insertAdjacentHTML('beforeend',`<button type="button" class="hs-r" data-pr="home"><span class="hs-i" style="--c:#0F766E">💲</span><span class="hs-t">${T('My products & prices','منتجاتي وأسعاري')}</span><i class="hs-c">${fwA()}</i></button>`)}
function boot(){const b=document.getElementById('hsBody');if(!b){setTimeout(boot,300);return}new MutationObserver(inject).observe(b,{childList:true});inject()}
boot();
css();
})();
