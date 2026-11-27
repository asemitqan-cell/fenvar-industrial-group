/* Horizon: وضع تعديل المالك (ترتيب بالسحب، إخفاء، إعادة تسمية، صور، بلاغات). بيتحمّل للمالك بس. */
(function(){'use strict';
const $q=s=>document.querySelector(s),E=s=>esc(String(s==null?'':s));
let panel=null,tab='order';
const S=()=>window.HZ_LAYOUT=window.HZ_LAYOUT||{order:[],hidden:[],img:{},names:{}};
async function save(){try{const r=await sb.from('hz_settings').upsert({key:'layout',value:S(),updated_at:new Date().toISOString()});if(r.error)throw r.error;try{localStorage.setItem('hz_layout',JSON.stringify(S()))}catch(_){}toast&&toast(L('Saved','اتحفظ'))}catch(e){alert('مش قادر أحفظ: '+(e.message||e)+'\nتأكد إنك شغّلت ملف hz-admin.sql وإنك داخل بإيميل المالك.')}}
function order(){const o=S().order.slice();CATALOG.forEach(c=>{if(!o.includes(c.id))o.push(c.id)});return o.filter(id=>CATALOG.some(c=>c.id===id||(window.HZ_ALL||[]).includes(id)))}
function draw(){if(!panel){panel=document.createElement('div');panel.id='hzAdm';panel.style.cssText='position:fixed;inset:0;z-index:99;background:var(--bg);overflow:auto;padding:calc(12px + env(safe-area-inset-top)) 14px 90px';document.body.appendChild(panel)}
 const o=order(),nm=id=>{const c=CATALOG.find(x=>x.id===id)||{};return (S().names[id]&&S().names[id].ar)||c.ar||id};
 let h=`<div style="display:flex;gap:8px;margin-bottom:12px"><button class="pill ${tab==='order'?'dark':''}" data-ad="tab:order">الأقسام</button><button class="pill ${tab==='slides'?'dark':''}" data-ad="tab:slides">الشرائح</button><button class="pill ${tab==='icons'?'dark':''}" data-ad="tab:icons">الأيقونات</button><button class="pill ${tab==='stats'?'dark':''}" data-ad="tab:stats">الأرقام</button><button class="pill ${tab==='rep'?'dark':''}" data-ad="tab:rep">البلاغات</button><button class="pill ${tab==='fin'?'dark':''}" data-ad="tab:fin">العمولات والشكاوى</button><button class="pill" data-ad="close" style="margin-inline-start:auto">إغلاق ✕</button></div>`;
 if(tab==='order'){h+=`<p class="hzx-n">اسحب ⠿ لترتيب الأقسام (أو استخدم ▲▼)، 👁 للإخفاء، ✏️ للاسم، 🖼️ لصورة القسم. تقدر كمان تضغط على أي صورة جوه الأقسام وهي في وضع التعديل لتغييرها.</p><div id="adList">`+o.map((id,i)=>{const c=CATALOG.find(x=>x.id===id);if(!c)return'';const hid=S().hidden.includes(id);return `<div class="hzx-b" data-id="${id}" style="display:flex;align-items:center;gap:6px;${hid?'opacity:.45':''}"><span class="adH" style="cursor:grab;touch-action:none;font-size:20px;padding:4px 8px">⠿</span><span style="flex:1"><b>${c.e||''} ${E(nm(id))}</b>${c.sub?'<small>قسم فرعي</small>':''}</span><button class="pill" data-ad="up:${id}">▲</button><button class="pill" data-ad="dn:${id}">▼</button><button class="pill" data-ad="hd:${id}">👁</button><button class="pill" data-ad="rn:${id}">✏️</button><button class="pill" data-ad="im:c:${id}">🖼️</button><button class="pill" data-ad="im:ic:${id}">🎨</button></div>`}).join('')+`</div><button class="btn" data-ad="save" style="margin-top:12px">حفظ التغييرات</button><button class="pill" data-ad="reset" style="margin-top:8px">رجوع للترتيب الأصلي</button>`}
 else if(tab==='slides')h+=slidesHTML();else if(tab==='icons')h+=iconsHTML();else if(tab==='stats')h+=`<div id="adStats"><p class="empty">جاري التحميل…</p></div>`;else if(tab==='fin')h+=`<div id="adFin"><p class="empty">جاري التحميل…</p></div>`;else h+=`<div id="adRep"><p class="empty">جاري التحميل…</p></div>`;
 panel.innerHTML=h;if(tab==='rep')reps();if(tab==='stats')stats();if(tab==='fin')fin()}
/* ---- لوحة الأرقام (اللي المستثمر هيسأل عنها) ---- */
const FOC=[['upvc','🪟 UPVC'],['wood','🛋️ موبيليا / خشب']],NMS={upvc:'UPVC',wood:'موبيليا / خشب',nursing:'تمريض',iron:'حدايد',paints:'بويات',accessories:'إكسسوارات',installment:'بيع بالقسط'};
const TG={sup:10,req:50,deal:10},fmn=n=>Math.round(+n||0).toLocaleString('ar-EG'),pc=(a,b)=>+a?Math.round(100*(+b||0)/+a)+'%':'—';
const bar=(v,t)=>`<div style="height:8px;background:var(--line);border-radius:4px;overflow:hidden;margin:3px 0 8px"><div style="height:100%;width:${Math.min(100,Math.round(100*(+v||0)/t))}%;background:var(--p)"></div></div>`;
function summary(d){const S=d.sections||[],g=k=>S.find(x=>x.section===k)||{},tot=f=>S.reduce((a,x)=>a+(+x[f]||0),0);
 const L=['ملخص أرقام Horizon ('+new Date().toLocaleDateString('ar-EG')+')',
  'الموردين: '+((d.providers||{}).verified||0)+' موثّق من '+((d.providers||{}).registered||0)+' مسجّل | عملاء طلبوا عروض: '+(d.customers_requesting||0)+' (رجع منهم '+(d.repeat_customers||0)+')',
  'إجمالي: '+tot('requests')+' طلب، '+tot('answered')+' اتردّ عليه، '+tot('deals')+' صفقة، '+tot('closed')+' اتقفلت، قيمة الصفقات المقفولة '+fmn(tot('gmv'))+' جنيه، العمولة '+fmn(tot('commission'))+' جنيه (نسبة '+Math.round(100*(+d.commission_rate||0))+'%)'];
 FOC.forEach(f=>{const x=g(f[0]);L.push(f[1]+': '+(x.providers_verified||0)+' مورد موثّق بأسعار، '+(x.requests||0)+' طلب، رد على '+pc(x.requests,x.answered)+'، '+(x.closed||0)+' صفقة مقفولة'+(x.avg_first_offer_min!=null?'، أول عرض في '+x.avg_first_offer_min+' دقيقة':'')+(x.avg_rating?'، تقييم '+x.avg_rating:''))});
 return L.join('\n')}
async function stats(){const b=$q('#adStats');if(!b)return;const r=await sb.rpc('hzq_stats');
 if(r.error){b.innerHTML='<p class="msg">'+E(/function|schema|does not exist|Could not find/i.test(r.error.message||'')?'شغّل ملف hz-invest.sql في Supabase الأول.':r.error.message)+'</p>';return}
 const d=r.data||{},S=d.sections||[],g=k=>S.find(x=>x.section===k)||{},tot=f=>S.reduce((a,x)=>a+(+x[f]||0),0),pv=d.providers||{};window.HZ_STATS=d;
 const kp=(t,v)=>`<div class="hzx-b" style="flex:1;min-width:46%;text-align:center"><div style="font-size:22px;font-weight:800">${v}</div><small>${t}</small></div>`;
 let h=`<div style="display:flex;flex-wrap:wrap;gap:8px">${kp('موردين موثّقين',(pv.verified||0)+' / '+(pv.registered||0))}${kp('عملاء طلبوا عروض',(d.customers_requesting||0)+' (رجع '+(d.repeat_customers||0)+')')}${kp('إجمالي الطلبات',fmn(tot('requests')))}${kp('صفقات اتقفلت',fmn(tot('closed')))}${kp('قيمة الصفقات المقفولة',fmn(tot('gmv')))}${kp('العمولة المتوقعة',fmn(tot('commission')))}</div>`;
 h+=FOC.map(f=>{const x=g(f[0]);return `<div class="hzx-b"><b>${f[1]}</b>
  <small>موردين موثّقين بأسعار: ${x.providers_verified||0} (هدف ${TG.sup}) · بنود مسعّرة: ${x.price_items||0}</small>${bar(x.providers_verified,TG.sup)}
  <small>طلبات: ${x.requests||0} (آخر 7 أيام: ${x.requests_7d||0}) · هدف ${TG.req}</small>${bar(x.requests,TG.req)}
  <small>صفقات مقفولة: ${x.closed||0} · هدف ${TG.deal}</small>${bar(x.closed,TG.deal)}
  <small>المسار: طلبات ${x.requests||0} ← اتردّ عليها ${x.answered||0} (${pc(x.requests,x.answered)}) ← صفقات ${x.deals||0} (${pc(x.requests,x.deals)}) ← اتقفلت ${x.closed||0} (${pc(x.requests,x.closed)})</small>
  <small style="display:block;margin-top:4px">أول عرض بعد: ${x.avg_first_offer_min==null?'—':fmn(x.avg_first_offer_min)+' دقيقة'} · قيمة مقفولة: ${fmn(x.gmv)} · عمولة: ${fmn(x.commission)} · تقييم: ${x.avg_rating==null?'—':x.avg_rating}</small></div>`}).join('');
 const oth=S.filter(x=>!FOC.some(f=>f[0]===x.section)&&(+x.requests||+x.price_items));
 if(oth.length)h+=`<div class="hzx-b"><b>أقسام تانية</b>${oth.map(x=>`<small style="display:block">${E(NMS[x.section]||x.section)}: ${x.requests||0} طلب · ${x.providers_verified||0} مورد · ${x.closed||0} صفقة مقفولة</small>`).join('')}</div>`;
 if((d.cities||[]).length)h+=`<div class="hzx-b"><b>المدن</b>${d.cities.map(c=>`<small style="display:block">${E(c.city)}: ${c.n}</small>`).join('')}</div>`;
 if((d.daily||[]).length){const mx=Math.max(...d.daily.map(x=>+x.n));h+=`<div class="hzx-b"><b>الطلبات آخر 14 يوم</b><div style="display:flex;align-items:flex-end;gap:3px;height:60px;margin-top:6px">${d.daily.map(x=>`<div title="${E(x.d)}: ${x.n}" style="flex:1;background:var(--p);border-radius:3px 3px 0 0;height:${Math.max(6,Math.round(100*x.n/mx))}%"></div>`).join('')}</div></div>`}
 h+=`<div class="hzx-b"><b>نسبة العمولة (فرضية)</b><div style="display:flex;gap:8px;margin-top:6px"><input id="adCm" class="hzx-in" type="number" step="0.1" min="0" max="30" value="${Math.round(1000*(+d.commission_rate||0))/10}" style="flex:1"><button class="pill" data-ad="comm">حفظ %</button></div><small>بتتحسب على قيمة كل صفقة بتتقفل من الاستلام. التغيير بيسري على الصفقات الجديدة بس.</small></div>
 <button class="btn" data-ad="cp" style="margin-top:8px">📋 انسخ ملخص للمستثمر</button><button class="pill" data-ad="rf" style="margin-top:8px">تحديث</button>`;
 b.innerHTML=h}

/* ---- العمولات والشكاوى ---- */
async function fin(){const b=$q('#adFin');if(!b)return;
 const [rv,ds]=await Promise.all([sb.rpc('hzq_revenue'),sb.from('hzq_disputes').select('*').order('created_at',{ascending:false}).limit(30)]);
 if(rv.error){b.innerHTML='<p class="msg">'+E(rv.error.message)+'</p>';return}
 const d=rv.data||{},U=d.unpaid||[],dd=ds.data||[];let inv={};
 if(dd.length){const x=await sb.from('hzq_deals').select('id,invoice_no,total,section').in('id',dd.map(y=>y.deal_id));(x.data||[]).forEach(y=>inv[y.id]=y)}
 const kp=(t,v)=>`<div class="hzx-b" style="flex:1;min-width:46%;text-align:center"><div style="font-size:22px;font-weight:800">${v}</div><small>${t}</small></div>`;
 let h=`<div style="display:flex;flex-wrap:wrap;gap:8px">${kp('عمولات مستحقة',fmn(d.due))}${kp('عمولات اتسدّدت',fmn(d.paid))}${kp('شكاوى مفتوحة',d.open_disputes||0)}</div>`;
 h+=`<div class="hzx-b"><b>عمولات مستحقة السداد (${U.length})</b>`+(U.length?U.map(u=>`<div style="display:flex;gap:6px;align-items:center;margin-top:6px"><span style="flex:1"><b>${E(u.name)}</b><br><small>HZ-${String(u.inv).padStart(6,'0')} · ${E(NMS[u.section]||u.section)} · صفقة ${fmn(u.total)} · عمولة ${fmn(u.commission)}</small></span><button class="pill" data-ad="paid:${u.deal}">اتسدّدت ✓</button></div>`).join(''):'<small style="display:block">مفيش عمولات متأخرة.</small>')+'</div>';
 h+=`<div class="hzx-b"><b>الشكاوى (${dd.length})</b>`+(dd.length?dd.map(x=>{const i=inv[x.deal_id]||{};return `<div style="margin-top:8px;border-top:1px dashed var(--line);padding-top:6px"><small>${i.invoice_no?'HZ-'+String(i.invoice_no).padStart(6,'0')+' · ':''}${new Date(x.created_at).toLocaleDateString('ar-EG')} · <b>${x.status==='open'?'مفتوحة':x.status==='resolved'?'اتحلّت':'اتقفلت'}</b></small><p style="margin:4px 0">${E(x.reason)}</p>${x.admin_note?`<small>ملاحظتك: ${E(x.admin_note)}</small>`:''}${x.status==='open'?`<div style="display:flex;gap:6px;margin-top:4px"><button class="pill" data-ad="dres:${x.id}:resolved">تم الحل</button><button class="pill" data-ad="dres:${x.id}:dismissed">إغلاق بدون إجراء</button></div>`:''}</div>`}).join(''):'<small style="display:block">مفيش شكاوى.</small>')+'</div><button class="pill" data-ad="finrf" style="margin-top:8px">تحديث</button>';
 b.innerHTML=h}
async function reps(){const r=await sb.from('hz_reports').select('*').order('created_at',{ascending:false}).limit(40);const b=$q('#adRep');if(!b)return;b.innerHTML=r.error?'<p class="msg">مش قادر أقرأ البلاغات (شغّل ملف SQL)</p>':(r.data.length?r.data.map(x=>`<div class="hzx-b"><b>${E(x.kind)}</b><small>${E(x.contact||'')} · ${new Date(x.created_at).toLocaleString('ar-EG')}</small><p>${E(x.message)}</p></div>`).join(''):'<p class="empty">مفيش بلاغات.</p>')}
const DEFSL=['furniture','livestock','glass','upvc','wood','translation','offers'];
const slides=()=>(S().slides&&S().slides.length?S().slides:DEFSL).slice();
const nmOf=id=>{const c=CATALOG.find(x=>x.id===id)||{};return (S().names[id]&&S().names[id].ar)||c.ar||id};
function slidesHTML(){const a=slides(),rest=CATALOG.filter(c=>!a.includes(c.id));return `<p class="hzx-n">الشرائح اللي بتظهر في "رائج الآن". رتّبها بالأسهم، أضف/احذف شريحة، وغيّر صورتها (🖼️) أو اسم القسم من تبويب الأقسام.</p>`+a.map(id=>{const u=S().img['sl:'+id];return `<div class="hzx-b" style="display:flex;align-items:center;gap:6px"><span style="flex:1"><b>${E(nmOf(id))}</b>${u?`<br><img src="${u}" style="height:44px;border-radius:8px;margin-top:4px">`:''}</span><button class="pill" data-ad="sl_up:${id}">▲</button><button class="pill" data-ad="sl_dn:${id}">▼</button><button class="pill" data-ad="im:sl:${id}">🖼️</button>${u?`<button class="pill" data-ad="slx:${id}">↺</button>`:''}<button class="pill" data-ad="sl_del:${id}">✕</button></div>`}).join('')+`<div style="display:flex;gap:8px;margin-top:10px"><select id="adSlSel" class="hzx-in" style="flex:1"><option value="">إضافة شريحة…</option>${rest.map(c=>`<option value="${c.id}">${E(nmOf(c.id))}</option>`).join('')}</select><button class="pill" data-ad="sl_add">➕</button></div><button class="btn" data-ad="save" style="margin-top:12px">حفظ التغييرات</button>`}
function iconsHTML(){return `<p class="hzx-n">صورة بتحل محل الأيقونة في شريط الأقسام وفي الشرائح. دوس 🎨 لاختيار صورة (مربعة أحسن)، ↺ للرجوع للأيقونة الأصلية.</p>`+order().map(id=>{const c=CATALOG.find(x=>x.id===id);if(!c)return'';const u=S().img['ic:'+id];return `<div class="hzx-b" style="display:flex;align-items:center;gap:8px"><span style="width:40px;height:40px;border-radius:12px;overflow:hidden;background:#e5e7eb;display:grid;place-items:center">${u?`<img src="${u}" style="width:100%;height:100%;object-fit:cover">`:(c.e||'•')}</span><span style="flex:1"><b>${E(nmOf(id))}</b></span><button class="pill" data-ad="im:ic:${id}">🎨</button>${u?`<button class="pill" data-ad="icx:${id}">↺</button>`:''}</div>`}).join('')+`<button class="btn" data-ad="save" style="margin-top:12px">حفظ التغييرات</button>`}
function move(id,d){const o=order(),i=o.indexOf(id),j=i+d;if(j<0||j>=o.length)return;o.splice(j,0,o.splice(i,1)[0]);S().order=o;apply();draw()}
function pick(key){const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=async()=>{const file=f.files[0];if(!file)return;try{const bl=await shrinkImg(file),p='ui/'+Date.now()+'.jpg',u=await sb.storage.from('hz-media').upload(p,bl,{contentType:'image/jpeg'});if(u.error)throw u.error;S().img[key]=sb.storage.from('hz-media').getPublicUrl(p).data.publicUrl;await save();apply();render()}catch(e){alert('فشل رفع الصورة: '+(e.message||e))}};f.click()}
function shrinkImg(file){return new Promise((ok,no)=>{const im=new Image();im.onload=()=>{const k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no('canvas'),'image/jpeg',.82)};im.onerror=()=>no('bad image');im.src=URL.createObjectURL(file)})}
function apply(){if(window.hzApplyLayout)window.hzApplyLayout();try{window.renderTrend&&renderTrend()}catch(_){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ad]');if(b){const [k,...r]=b.dataset.ad.split(':'),v=r.join(':');
 if(k==='tab'){tab=v;draw()}else if(k==='close'){panel.remove();panel=null;render();edBar(true)}
 else if(k==='up')move(v,-1);else if(k==='dn')move(v,1);
 else if(k==='hd'){const h=S().hidden,i=h.indexOf(v);i<0?h.push(v):h.splice(i,1);apply();draw()}
 else if(k==='rn'){const c=CATALOG.find(x=>x.id===v),n=prompt('الاسم الجديد',(S().names[v]&&S().names[v].ar)||c.ar);if(n){S().names[v]={ar:n};apply();draw()}}
 else if(k==='sl_up'||k==='sl_dn'){const x=slides(),i=x.indexOf(v),j=i+(k==='sl_up'?-1:1);if(i>=0&&j>=0&&j<x.length){x.splice(j,0,x.splice(i,1)[0]);S().slides=x;apply();draw()}}
 else if(k==='sl_del'){S().slides=slides().filter(y=>y!==v);apply();draw()}
 else if(k==='sl_add'){const sel=document.getElementById('adSlSel');if(sel&&sel.value){S().slides=slides().concat(sel.value);apply();draw()}}
 else if(k==='icx'){delete S().img['ic:'+v];apply();draw();render()}else if(k==='slx'){delete S().img['sl:'+v];apply();draw()}
 else if(k==='im')pick(v);else if(k==='save')save();
 else if(k==='rf')stats();
 else if(k==='finrf')fin();
 else if(k==='paid'){if(!confirm('تأكيد إن العمولة دي اتسدّدت؟'))return;sb.rpc('hzq_mark_commission',{p_deal:v,p_paid:true}).then(r=>{if(r.error)alert(r.error.message);else{toast&&toast('اتسجّل');fin()}})}
 else if(k==='dres'){const [id,st]=v.split(':'),n=prompt('ملاحظة للطرفين (اختياري)')||'';sb.rpc('hzq_resolve_dispute',{p_id:id,p_status:st,p_note:n}).then(r=>{if(r.error)alert(r.error.message);else{toast&&toast('اتحفظ');fin()}})}
 else if(k==='cp'){if(window.HZ_STATS){const t=summary(window.HZ_STATS);try{navigator.clipboard.writeText(t);toast&&toast('اتنسخ')}catch(_){prompt('انسخ الملخص',t)}}}
 else if(k==='comm'){const v=parseFloat(($q('#adCm')||{}).value);if(!(v>=0&&v<=30)){alert('اكتب نسبة من 0 لـ 30');return}sb.from('hz_settings').upsert({key:'commission',value:{rate:Math.round(v*10)/1000},updated_at:new Date().toISOString()}).then(r=>{if(r.error)alert('مش قادر أحفظ: '+r.error.message);else{toast&&toast('اتحفظ');stats()}})}
 else if(k==='reset'&&confirm('ترجع للترتيب والأسماء الأصلية؟')){window.HZ_LAYOUT={order:[],hidden:[],img:S().img,names:{}};save().then(()=>location.reload())}
 return}
 if(window.HZ_EDIT&&!panel){const t=e.target.closest('#grid .thumb');if(t){const cd=t.closest('.card'),bt=cd&&cd.querySelector('[data-item]'),k=cd&&cd.dataset.c?'c:'+cd.dataset.c:bt?'i:'+bt.dataset.cat+':'+bt.dataset.item:null;if(k){e.preventDefault();e.stopPropagation();pick(k)}}}},true);
/* سحب وإفلات بالـpointer (شغال على الموبايل) */
let drag=null;document.addEventListener('pointerdown',e=>{const h=e.target.closest('.adH');if(!h)return;drag=h.closest('[data-id]');drag.style.outline='2px solid var(--p)';e.preventDefault()});
document.addEventListener('pointermove',e=>{if(!drag)return;const el=document.elementFromPoint(e.clientX,e.clientY),row=el&&el.closest&&el.closest('#adList [data-id]');if(row&&row!==drag){const r=row.getBoundingClientRect();row.parentNode.insertBefore(drag,e.clientY<r.top+r.height/2?row:row.nextSibling)}});
document.addEventListener('pointerup',()=>{if(!drag)return;drag.style.outline='';S().order=[...document.querySelectorAll('#adList [data-id]')].map(x=>x.dataset.id);drag=null;apply()});
/* ---- تعديل على التطبيق نفسه: ✏️ على الأيقونات + ضغطة طويلة وسحب للترتيب ---- */
let eb=null,mo=null,mt=null,dg=null,tm=null,sx=0,sy=0,nc=0;
const edSel='#slides .sl[data-c],#chips .tile[data-c],.hz-gt[data-c]',inCat=id=>CATALOG.some(c=>c.id===id);
function badges(){if(!window.HZ_EDIT||panel)return;document.querySelectorAll(edSel).forEach(el=>{if(!inCat(el.dataset.c)||el.querySelector(':scope>.hzeb-b'))return;const b=document.createElement('span');b.className='hzeb-b';b.textContent='✏️';b.setAttribute('role','button');el.appendChild(b)})}
function edBar(on){if(!on){if(eb){eb.remove();eb=null}document.body.classList.remove('hzedit');if(mo){mo.disconnect();mo=null}document.querySelectorAll('.hzeb-b').forEach(x=>x.remove());return}
 if(eb)return;document.body.classList.add('hzedit');
 if(!$q('#hzebCss')){const st=document.createElement('style');st.id='hzebCss';st.textContent='.hzedit [data-c]{position:relative}.hzeb-b{position:absolute;top:2px;inset-inline-start:2px;z-index:5;background:#fff;border:1px solid var(--line);border-radius:50%;width:26px;height:26px;display:grid;place-items:center;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,.25)}.hzeb-d{outline:3px solid var(--p);transform:scale(1.06);opacity:.9;z-index:6}#hzEB{position:fixed;top:calc(env(safe-area-inset-top) + 8px);left:50%;transform:translateX(-50%);z-index:98;background:#0f172a;color:#fff;border-radius:999px;padding:6px 8px;display:flex;gap:6px;align-items:center;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.3)}#hzEB button{border:0;border-radius:999px;padding:7px 12px;font:inherit;cursor:pointer}#hzEB .ok{background:var(--p);color:#fff}#hzEB .pn{background:#fff;color:#0f172a}#hzES{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.45);display:flex;align-items:flex-end}#hzES>div{background:var(--card);width:100%;border-radius:22px 22px 0 0;padding:14px 14px calc(14px + env(safe-area-inset-bottom));display:grid;gap:8px}#hzES button{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:14px;padding:13px;font:inherit;font-size:15px;text-align:start}';document.head.appendChild(st)}
 eb=document.createElement('div');eb.id='hzEB';eb.innerHTML='<span>🛠 اضغط ✏️ أو امسك أيقونة وحرّكها</span><button class="pn" data-eb="panel">اللوحة</button><button class="ok" data-eb="done">تم ✓</button>';document.body.appendChild(eb);
 mo=new MutationObserver(()=>{if(!mt)mt=setTimeout(()=>{mt=null;badges()},150)});mo.observe(document.body,{childList:true,subtree:true});badges();}
function edSheet(id){const c=CATALOG.find(x=>x.id===id)||{},hid=S().hidden.includes(id),nm=(S().names[id]&&S().names[id].ar)||c.ar||id,w=document.createElement('div');w.id='hzES';
 w.innerHTML='<div><b style="font-size:16px">'+E(nm)+'</b><button data-e="rn">✏️ تغيير الاسم</button><button data-e="im">🖼️ تغيير صورة القسم</button><button data-e="ic">🎨 تغيير الأيقونة</button><button data-e="hd">'+(hid?'👁 إظهار القسم':'🙈 إخفاء القسم (مش بيتمسح، ترجّعه وقت ما تحب)')+'</button><button data-e="x">إلغاء</button></div>';
 w.onclick=ev=>{const k=ev.target.dataset&&ev.target.dataset.e;if(ev.target===w||k==='x'){w.remove();return}if(!k)return;w.remove();
  if(k==='rn'){const n=prompt('الاسم الجديد',nm);if(n){S().names[id]={ar:n};save();apply()}}
  else if(k==='im')pick('c:'+id);else if(k==='ic')pick('ic:'+id);
  else if(k==='hd'){const h=S().hidden,i=h.indexOf(id);i<0?h.push(id):h.splice(i,1);save();apply()}};
 document.body.appendChild(w)}
document.addEventListener('click',e=>{const t=e.target;if(!t.closest)return;
 const eBtn=t.closest('[data-eb]');if(eBtn){e.preventDefault();e.stopPropagation();if(eBtn.dataset.eb==='done'){window.HZ_EDIT=0;edBar(false);render()}else{edBar(false);window.HZ_EDIT=1;tab='order';draw()}return}
 if(Date.now()-nc<500&&t.closest(edSel)){e.preventDefault();e.stopPropagation();return}
 const bd=t.closest('.hzeb-b');if(bd){e.preventDefault();e.stopPropagation();edSheet(bd.parentNode.dataset.c)}},true);
document.addEventListener('pointerdown',e=>{if(!window.HZ_EDIT||panel||!eb)return;const el=e.target.closest&&e.target.closest(edSel);if(!el||e.target.closest('.hzeb-b'))return;sx=e.clientX;sy=e.clientY;clearTimeout(tm);tm=setTimeout(()=>{dg=el;el.classList.add('hzeb-d');if(navigator.vibrate)navigator.vibrate(20)},450)},true);
document.addEventListener('pointermove',e=>{if(!dg){if(tm&&(Math.abs(e.clientX-sx)>8||Math.abs(e.clientY-sy)>8)){clearTimeout(tm);tm=null}return}
 const t=document.elementFromPoint(e.clientX,e.clientY),o=t&&t.closest&&t.closest(edSel);if(!o||o===dg||o.parentNode!==dg.parentNode)return;
 const r=o.getBoundingClientRect(),rtl=getComputedStyle(document.documentElement).direction==='rtl',row=e.clientY>r.top&&e.clientY<r.bottom,mx=r.left+r.width/2,bf=row?(rtl?e.clientX>mx:e.clientX<mx):e.clientY<r.top+r.height/2;o.parentNode.insertBefore(dg,bf?o:o.nextSibling)},true);
document.addEventListener('touchmove',e=>{if(dg&&e.cancelable)e.preventDefault()},{passive:false});
function endDrag(){clearTimeout(tm);tm=null;if(!dg)return;const el=dg,par=el.parentNode;dg=null;nc=Date.now();el.classList.remove('hzeb-d');
 const ids=[...par.querySelectorAll(':scope>[data-c]')].map(x=>x.dataset.c);
 if(par.id==='slides')S().slides=ids;else{const full=order(),ok=ids.filter(i=>full.includes(i)),pos=ok.map(i=>full.indexOf(i)).sort((a,b)=>a-b);if(!pos.length)return;pos.forEach((p,k)=>full[p]=ok[k]);S().order=full}
 save();apply()}
document.addEventListener('pointerup',endDrag,true);document.addEventListener('pointercancel',endDrag,true);
window.hzOpenAdmin=()=>{window.HZ_EDIT=1;tab='order';edBar(false);draw()};
})();
