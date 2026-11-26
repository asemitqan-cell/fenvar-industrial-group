/* Horizon: متابعة عروض الأسعار والصفقات (طلباتي للعميل + طلبات العملاء للمورد) + شريط التركيز على أقسام UPVC / موبيليا / تمريض.
   كل التعديلات على الحالة بتتم عن طريق دوال قاعدة البيانات (hz-invest.sql). */
(function(){'use strict';
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $q=s=>document.querySelector(s);
const secOf=id=>(window.HZ_SECTIONS||[]).find(x=>x.id===id);
const secName=id=>{const s=secOf(id);return s?s.ico+' '+s.ar:E(id)};
const fm=n=>Math.round(+n||0).toLocaleString('ar-EG');
const ago=d=>{const s=(Date.now()-new Date(d))/1000;return s<60?'دلوقتي':s<3600?'من '+Math.floor(s/60)+' دقيقة':s<86400?'من '+Math.floor(s/3600)+' ساعة':'من '+Math.floor(s/86400)+' يوم'};
const RS={new:['جديد','#64748B'],offered:['وصلت عروض','#0F766E'],accepted:['اتقبل عرض','#2563EB'],closed:['اتقفل ✓','#067647'],cancelled:['ملغي','#B42318']};
const DS={accepted:'اتقبل العرض',in_progress:'قيد التنفيذ',delivered:'تم التسليم',closed:'اتقفلت ✓',cancelled:'اتلغت'};
const STEPS=['accepted','in_progress','delivered','closed'];
const SQLMSG='الميزة دي محتاجة تشغّل ملف hz-invest.sql في Supabase مرة واحدة.';
const X={tab:'mine',loading:0,err:'',msg:'',ok:0,open:null,inv:null,star:{},contacts:{},names:{},stats:{},mine:null,prov:null,pdata:null,disp:{},rate:null};
const errTxt=e=>{const m=(e&&e.message)||String(e||'');return /relation|does not exist|schema cache|function .* not|Could not find/i.test(m)?SQLMSG:m};

function css(){const s=document.createElement('style');s.textContent=`
#qxModal .qx-t{display:flex;gap:6px;overflow-x:auto;margin:10px 0}
#qxModal .qx-c{flex:none;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:7px 14px;font-weight:700;cursor:pointer;color:var(--ink);font:inherit}
#qxModal .qx-c.on{background:var(--p);color:#fff;border-color:var(--p)}
#qxModal .qx-r{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:12px;margin:10px 0}
#qxModal .qx-h{display:flex;justify-content:space-between;gap:8px;align-items:center}
#qxModal .qx-s{font-size:12px;color:var(--mut)}
#qxModal .qx-chip{display:inline-block;border-radius:999px;padding:2px 10px;font-size:12px;color:#fff;white-space:nowrap}
#qxModal .qx-o{border:1px dashed var(--line);border-radius:12px;padding:10px;margin:8px 0}
#qxModal .qx-o.win{border:2px solid var(--p)}
#qxModal input,#qxModal textarea{border:1px solid var(--line);border-radius:10px;padding:9px 10px;background:var(--bg);color:inherit;width:100%;box-sizing:border-box;font:inherit}
#qxModal .qx-2{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0}
#qxModal .qx-tl{display:flex;gap:4px;margin:8px 0}#qxModal .qx-tl i{flex:1;height:6px;border-radius:3px;background:var(--line)}#qxModal .qx-tl i.on{background:var(--p)}
#qxModal .qx-st{font-size:28px;cursor:pointer;color:#F59E0B;background:none;border:0;padding:0 2px}
#qxModal .qx-k{font-size:20px;font-weight:800}
#qxModal .qx-in{background:#fff;color:#111;border-radius:12px;padding:16px;border:1px solid var(--line)}
#qxModal .qx-in table{width:100%;border-collapse:collapse;margin:10px 0}#qxModal .qx-in td{padding:6px 0;border-bottom:1px dashed #ccc}
#qxFocus{margin:8px 14px 4px}#qxFocus h4{margin:0 0 6px;font-size:14px}
#qxFocus .qx-g{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
#qxFocus button{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px 4px;font:inherit;font-weight:700;cursor:pointer;color:var(--ink);display:grid;gap:4px;place-items:center}
#qxFocus button i{font-style:normal;font-size:26px}
#qxFocus .qx-m{display:flex;gap:8px;margin-top:8px}
#qxFocus .qx-m button{flex:1;padding:8px;font-size:13px;display:block}
@media print{body>*:not(#qxModal){display:none!important}#qxModal{position:static!important;background:#fff!important}#qxModal .sheet{position:static!important;box-shadow:none!important;max-height:none!important;overflow:visible!important}#qxModal .qx-np,#qxModal .x{display:none!important}}`;document.head.appendChild(s)}

function ensure(){if($q('#qxModal'))return;
 document.body.insertAdjacentHTML('beforeend','<div class="modal" id="qxModal" hidden><div class="sheet st"><button type="button" class="x" data-qx="close">×</button><div id="qxBody"></div></div></div>')}
const show=()=>{ensure();$q('#qxModal').hidden=false};
const hide=()=>{const m=$q('#qxModal');if(m)m.hidden=true};

const lineTxt=l=>E(l.name||'')+' × '+E(l.qty==null?'':l.qty)+(l.note?' <span class="qx-s">('+E(l.note)+')</span>':'');
const linesHTML=ls=>'<ul style="margin:6px 0;padding-inline-start:18px">'+(Array.isArray(ls)?ls:[]).map(l=>'<li>'+lineTxt(l)+'</li>').join('')+'</ul>';
const chip=(t,c)=>`<span class="qx-chip" style="background:${c}">${E(t)}</span>`;
const tl=stage=>{const i=STEPS.indexOf(stage);return `<div class="qx-tl">${STEPS.map((s,k)=>`<i class="${i>=k?'on':''}"></i>`).join('')}</div><div class="qx-s">${E(DS[stage]||stage)}</div>`};
const starsTxt=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const waLink=p=>{let d=String(p||'').replace(/\D/g,'');if(!d)return '';if(d.startsWith('00'))d=d.slice(2);else if(d.startsWith('0'))d='20'+d.slice(1);return 'https://wa.me/'+d};
const statTxt=pid=>{const s=X.stats[pid];if(!s||!(+s.closed||+s.n))return '<span class="qx-s">مورد جديد على Horizon</span>';
 return `<span class="qx-s">${+s.n?`★ ${Number(s.avg).toFixed(1)} (${s.n} تقييم) · `:''}${+s.closed} صفقة اتقفلت</span>`};

async function loadNames(ids){ids=ids.filter(x=>x&&!X.names[x]);if(!ids.length)return;
 try{const a=await sb.from('hz_public_providers').select('user_id,business_name,full_name').in('user_id',ids);(a.data||[]).forEach(p=>{X.names[p.user_id]=p.business_name||p.full_name||''})}catch(_){}
 try{const b=await sb.from('hz_public_profiles').select('id,full_name,brand').in('id',ids);(b.data||[]).forEach(p=>{if(!X.names[p.id])X.names[p.id]=p.brand||p.full_name||''})}catch(_){}}
const nm=id=>X.names[id]||'—';
const first=id=>String(X.names[id]||'عميل').split(' ')[0];
async function loadStats(ids){ids=[...new Set(ids)].filter(Boolean);if(!ids.length)return;try{const r=await sb.rpc('hzq_provider_stats',{p_ids:ids});if(!r.error&&r.data)Object.assign(X.stats,r.data)}catch(_){}}
async function contact(did){if(X.contacts[did]!==undefined)return;X.contacts[did]=null;try{const r=await sb.rpc('hzq_contact',{p_deal:did});X.contacts[did]=r.data||null}catch(_){}draw()}


/* ---- ضمان Horizon: صلاحية العرض + الشكاوى + العمولة ---- */
const expired=o=>!!(o&&o.valid_until&&new Date(o.valid_until)<new Date());
const adjTxt=o=>o&&o.price_adjust_pct?' · السعر قابل للتعديل لو المادة زادت أكتر من '+o.price_adjust_pct+'%':'';
const valTxt=o=>{if(o&&o.status==='expired')return ' · <b style="color:#B42318">انتهت صلاحيته</b>';if(!o||!o.valid_until||o.status!=='sent')return '';const ms=new Date(o.valid_until)-Date.now();
 if(ms<=0)return ' · <b style="color:#B42318">انتهت صلاحيته</b>';const d=Math.ceil(ms/86400000);return ' · ساري '+(d>1?'لمدة '+d+' أيام':'لحد النهارده')};
const rateTxt=()=>X.rate!=null?(Math.round(X.rate*1000)/10)+'%':'المعلنة';
const GUAR='<p class="qx-s" style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px 10px;margin:8px 0">🛡️ <b>ضمان Horizon</b>: تليفونك مخفي لحد ما تقبل عرض · كل عرض عليه مدة صلاحية واضحة عشان الأسعار ما تبقاش قديمة · لو حصلت مشكلة في التنفيذ تقدر تفتح شكوى وفريقنا بيراجعها.</p>';
async function loadDisp(ids){ids=[...new Set(ids)].filter(Boolean);if(!ids.length)return;
 try{const r=await sb.from('hzq_disputes').select('*').in('deal_id',ids).order('created_at',{ascending:true});(r.data||[]).forEach(x=>{X.disp[x.deal_id]=x})}catch(_){}}
async function loadRate(){if(X.rate!=null)return;try{const r=await sb.from('hz_settings').select('value').eq('key','commission').maybeSingle();const v=r.data&&r.data.value;X.rate=+(v&&typeof v==='object'?v.rate:v)||0}catch(_){}}
function dispHTML(d){const x=X.disp[d.id];
 if(x){return x.status==='open'?'<p class="qx-s" style="color:#B42318">⚠️ فيه شكوى مفتوحة على الصفقة. فريق Horizon بيراجعها.</p>'
   :`<p class="qx-s">الشكوى ${x.status==='resolved'?'اتحلّت ✓':'اتقفلت'}${x.admin_note?' · '+E(x.admin_note):''}</p>`}
 const ok=d.stage==='in_progress'||d.stage==='delivered'||(d.stage==='closed'&&d.closed_at&&(Date.now()-new Date(d.closed_at))<14*86400000);
 return ok?`<button type="button" class="pill" data-qx="dispute:${d.id}" style="margin-top:6px">🚩 فيه مشكلة؟ افتح شكوى</button>`:''}

/* ---------------- العميل: طلباتي ---------------- */
async function loadMine(){X.loading=1;X.err='';draw();
 try{
  const r=await sb.from('hz_quote_requests').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(40);if(r.error)throw r.error;
  const reqs=r.data||[],ids=reqs.map(x=>x.id);let offers=[],deals=[];
  if(ids.length){const o=await sb.from('hzq_offers').select('*').in('request_id',ids);if(o.error)throw o.error;offers=o.data||[];
   const d=await sb.from('hzq_deals').select('*').in('request_id',ids);if(d.error)throw d.error;deals=d.data||[]}
  const pids=[...new Set(offers.map(o=>o.provider_id).concat(deals.map(d=>d.provider_id)))];
  await loadNames(pids);await loadStats(pids);
  await loadDisp(deals.map(d=>d.id));X.mine={reqs,offers,deals};
 }catch(e){X.err=errTxt(e);X.mine=null}
 X.loading=0;draw()}
function mineHTML(){if(X.loading&&!X.mine)return '<p class="empty">جاري التحميل…</p>';
 if(X.err)return `<p class="msg">${E(X.err)}</p>`;const m=X.mine;if(!m)return '';
 if(!m.reqs.length)return '<p class="empty">لسه ما طلبتش عرض سعر. افتح قسم UPVC أو موبيليا أو تمريض واضغط "طلب عرض سعر".</p>';
 return m.reqs.map(r=>{const offs=m.offers.filter(o=>o.request_id===r.id),deal=m.deals.find(d=>d.request_id===r.id&&d.stage!=='cancelled')||m.deals.find(d=>d.request_id===r.id);
  const st=RS[r.status]||RS.new,live=offs.filter(o=>o.status==='sent'),open=X.open===r.id;
  let h=`<div class="qx-r"><div class="qx-h"><b>${secName(r.section)}</b>${chip(st[0]+(live.length&&!deal?' ('+live.length+')':''),st[1])}</div><div class="qx-s">${ago(r.created_at)}${r.city?' · '+E(r.city):''}${r.budget?' · ميزانية '+fm(r.budget):''}</div>
   <button type="button" class="pill" data-qx="open:${r.id}" style="margin-top:6px">${open?'إخفاء التفاصيل':'التفاصيل'}</button>`;
  if(open){h+=linesHTML(r.lines)+(r.custom?`<p class="qx-s">${E(r.custom)}</p>`:'');
   if(deal)h+=dealCust(deal,r);
   else{
    h+=offs.length?offs.map(o=>`<div class="qx-o${o.status==='accepted'?' win':''}"><div class="qx-h"><b>${E(nm(o.provider_id))}</b><span class="qx-k">${fm(o.total)}</span></div>${statTxt(o.provider_id)}
      <div class="qx-s">${o.days!=null?'التنفيذ خلال '+o.days+' يوم · ':''}${ago(o.created_at)}${valTxt(o)}${adjTxt(o)}</div>${o.note?`<p>${E(o.note)}</p>`:''}
      ${o.status==='sent'&&r.status!=='cancelled'&&!expired(o)?`<button type="button" class="btn" data-qx="accept:${o.id}">اقبل العرض ده</button>`:chip(o.status==='sent'||o.status==='expired'?'انتهت صلاحيته':o.status==='rejected'?'اتقفل':o.status==='withdrawn'?'اتسحب':'اتقبل',o.status==='sent'||o.status==='expired'?'#B42318':'#64748B')}</div>`).join('')
     :'<p class="qx-s">لسه مفيش عروض. الموردين المناسبين اتبلّغوا، وهتوصلك إشعار أول ما حد يرد.</p>';
    if(r.status==='new'||r.status==='offered')h+=`<button type="button" class="pill" data-qx="cancelreq:${r.id}">إلغاء الطلب</button>`}}
  return h+'</div>'}).join('')}
function dealCust(d,r){const c=X.contacts[d.id];if(c===undefined)contact(d.id);
 let h=`<div class="qx-o win"><b>الصفقة مع ${E(nm(d.provider_id))}</b> · <span class="qx-k">${fm(d.total)}</span>${tl(d.stage)}`;
 if(d.stage!=='cancelled'){h+=c&&(c.phone||c.name)?`<p>📞 ${E(c.name||'')} ${c.phone?`<a href="tel:${E(c.phone)}">${E(c.phone)}</a> · <a href="${waLink(c.phone)}" target="_blank" rel="noopener">واتساب</a>`:''}</p>`:'<p class="qx-s">بيانات التواصل بتظهر هنا بعد قبول العرض.</p>'}
 if(d.stage==='delivered')h+=`<button type="button" class="btn" data-qx="stage:${d.id}:closed">أكّد إني استلمت الطلب</button>`;
 if(d.stage==='accepted'||d.stage==='in_progress')h+=`<button type="button" class="pill" data-qx="stage:${d.id}:cancelled">إلغاء الصفقة</button>`;
 h+=dispHTML(d);
 if(d.stage==='closed'){if(d.rating)h+=`<p>تقييمك: <span style="color:#F59E0B">${starsTxt(d.rating)}</span>${d.review?' · '+E(d.review):''}</p>`;
  else{const n=X.star[d.id]||0;h+=`<div><b>قيّم المورد</b><div>${[1,2,3,4,5].map(i=>`<button type="button" class="qx-st" data-qx="star:${d.id}:${i}">${i<=n?'★':'☆'}</button>`).join('')}</div><textarea id="qxRv_${d.id}" rows="2" placeholder="رأيك في الشغل (اختياري)"></textarea><button type="button" class="btn" data-qx="rate:${d.id}" style="margin-top:6px">ابعت التقييم</button></div>`}}
 if(d.stage!=='cancelled')h+=`<button type="button" class="pill" data-qx="inv:${d.id}" style="margin-top:6px">🧾 مستند الصفقة</button>`;
 return h+'</div>'}

/* ---------------- المورد: طلبات العملاء ---------------- */
async function loadProv(){X.loading=1;X.err='';draw();
 try{
  const p=await sb.from('hz_providers').select('*').eq('user_id',user.id).maybeSingle();X.prov=p.data||null;
  if(!X.prov||!X.prov.verified){X.pdata={reqs:[],offers:[],deals:[],dreqs:[]};X.loading=0;draw();return}
  const rq=await sb.from('hz_quote_requests').select('*').neq('user_id',user.id).in('status',['new','offered']).order('created_at',{ascending:false}).limit(40);if(rq.error)throw rq.error;
  const of=await sb.from('hzq_offers').select('*').eq('provider_id',user.id).order('created_at',{ascending:false});if(of.error)throw of.error;
  const dl=await sb.from('hzq_deals').select('*').eq('provider_id',user.id).order('created_at',{ascending:false});if(dl.error)throw dl.error;
  const dids=(dl.data||[]).map(d=>d.request_id);let dreqs=[];
  if(dids.length){const x=await sb.from('hz_quote_requests').select('*').in('id',dids);dreqs=x.data||[]}
  const allr=(rq.data||[]).concat(dreqs);
  await loadNames([...new Set(allr.map(r=>r.user_id))]);
  await loadDisp((dl.data||[]).map(d=>d.id));await loadRate();X.pdata={reqs:rq.data||[],offers:of.data||[],deals:dl.data||[],dreqs};
 }catch(e){X.err=errTxt(e);X.pdata=null}
 X.loading=0;draw()}
function offerForm(r,mine){return `<div class="qx-o"><b>${mine?'عدّل عرضك':'قدّم عرضك'}</b><div class="qx-2"><input type="number" min="1" inputmode="decimal" id="qxT_${r.id}" placeholder="الإجمالي بالجنيه" value="${mine?E(mine.total):''}"><input type="number" min="0" inputmode="numeric" id="qxD_${r.id}" placeholder="مدة التنفيذ بالأيام" value="${mine&&mine.days!=null?E(mine.days):''}"></div><textarea id="qxN_${r.id}" rows="2" placeholder="ملاحظات: الخامة، الضمان، التركيب… (اختياري)">${mine?E(mine.note||''):''}</textarea><div class="qx-2"><label class="qx-s">مدة سريان العرض<select id="qxV_${r.id}" style="width:100%;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:inherit">${[[3,'3 أيام'],[7,'أسبوع'],[30,'شهر']].map(x=>`<option value="${x[0]}"${x[0]===((mine&&mine.valid_days)||7)?' selected':''}>${x[1]}</option>`).join('')}</select></label><label class="qx-s">قابل للتعديل لو المادة زادت أكتر من % (اختياري)<input type="number" min="1" max="50" inputmode="decimal" id="qxP_${r.id}" placeholder="مثال: 5" value="${mine&&mine.price_adjust_pct!=null?E(mine.price_adjust_pct):''}"></label></div><p class="qx-s">العرض بيتقفل لوحده بعد المدة دي (تجدّده بالتعديل). بإرسالك العرض بتوافق إن عمولة Horizon ${rateTxt()} تُستحق على أي صفقة بتتم من خلال المنصة.</p><button type="button" class="btn" data-qx="send:${r.id}" style="margin-top:6px">${mine?'حدّث العرض':'ابعت العرض'}</button></div>`}
function provHTML(){if(X.loading&&!X.pdata)return '<p class="empty">جاري التحميل…</p>';
 if(X.err)return `<p class="msg">${E(X.err)}</p>`;
 if(!X.prov)return '<p class="hs-box">سجّل بياناتك كمورد الأول (متجري > مقدّم الخدمة)، وبعدها ضيف أسعارك من الإعدادات > منتجاتي وأسعاري.</p>';
 if(!X.prov.verified)return '<p class="hs-box">حسابك لسه مش موثّق. أول ما يتوثّق هتشوف طلبات العملاء المناسبة لأقسامك وتقدر ترد عليها.</p>';
 const d=X.pdata;if(!d)return '';
 const tabs=`<div class="qx-t"><button type="button" class="qx-c${X.ptab==='open'?' on':''}" data-qx="ptab:open">طلبات مفتوحة</button><button type="button" class="qx-c${X.ptab==='offers'?' on':''}" data-qx="ptab:offers">عروضي</button><button type="button" class="qx-c${X.ptab==='deals'?' on':''}" data-qx="ptab:deals">صفقاتي</button></div>`;
 const myOf=id=>d.offers.find(o=>o.request_id===id);
 if(X.ptab==='open'){const rows=d.reqs.filter(r=>{const o=myOf(r.id);return !o||o.status==='withdrawn'});
  return tabs+(rows.length?rows.map(r=>reqCard(r,null)).join(''):'<p class="empty">مفيش طلبات مفتوحة دلوقتي في أقسامك. تأكد إن أسعارك مكتوبة في الإعدادات > منتجاتي وأسعاري.</p>')}
 if(X.ptab==='offers'){return tabs+(d.offers.length?d.offers.map(o=>{const r=d.reqs.find(x=>x.id===o.request_id)||d.dreqs.find(x=>x.id===o.request_id);
   return `<div class="qx-r"><div class="qx-h"><b>${r?secName(r.section):'طلب'}</b>${chip({sent:'مستني رد العميل',accepted:'اتقبل ✓',rejected:'اتقفل',withdrawn:'اتسحب',expired:'انتهى، جدّده'}[o.status]||o.status,o.status==='accepted'?'#067647':'#64748B')}</div><div class="qx-s">${ago(o.created_at)}${valTxt(o)}</div><div class="qx-k">${fm(o.total)}</div>${r?linesHTML(r.lines):''}
   ${(o.status==='sent'||o.status==='expired')&&r?`<button type="button" class="pill" data-qx="open:${o.request_id}">${o.status==='expired'?'جدّد العرض':'تعديل'}</button> <button type="button" class="pill" data-qx="withdraw:${o.id}">سحب العرض</button>`:''}${X.open===o.request_id&&(o.status==='sent'||o.status==='expired')&&r?offerForm(r,o):''}</div>`}).join(''):'<p class="empty">لسه ما بعتّش عروض.</p>')}
 return tabs+(d.deals.length?d.deals.map(dl=>{const r=d.dreqs.find(x=>x.id===dl.request_id)||{lines:[]},c=X.contacts[dl.id];if(c===undefined)contact(dl.id);
   return `<div class="qx-r"><div class="qx-h"><b>${secName(dl.section)}</b><span class="qx-k">${fm(dl.total)}</span></div><div class="qx-s">العميل: ${E(first(dl.customer_id))} · ${ago(dl.created_at)} · العمولة المتوقعة ${fm(dl.stage==='closed'?dl.commission:dl.total*dl.commission_rate)}${dl.stage==='closed'?(dl.commission_paid?' (اتسدّدت ✓)':' (مستحقة السداد)'):''}</div>${linesHTML(r.lines)}${tl(dl.stage)}
   ${dl.stage!=='cancelled'?(c&&(c.phone||c.name)?`<p>📞 ${E(c.name||'')} ${c.phone?`<a href="tel:${E(c.phone)}">${E(c.phone)}</a> · <a href="${waLink(c.phone)}" target="_blank" rel="noopener">واتساب</a>`:''}</p>`:''):''}
   ${dl.stage==='accepted'?`<button type="button" class="btn" data-qx="stage:${dl.id}:in_progress">بدأت التنفيذ</button>`:''}${dl.stage==='accepted'||dl.stage==='in_progress'?`<button type="button" class="btn" data-qx="stage:${dl.id}:delivered" style="margin-top:6px">تم التسليم</button> <button type="button" class="pill" data-qx="stage:${dl.id}:cancelled">إلغاء</button>`:''}
   ${dl.stage==='delivered'?'<p class="qx-s">مستنيين العميل يأكّد الاستلام.</p>':''}${dl.rating?`<p>تقييم العميل: <span style="color:#F59E0B">${starsTxt(dl.rating)}</span>${dl.review?' · '+E(dl.review):''}</p>`:''}
   ${dispHTML(dl)}
   ${dl.stage!=='cancelled'?`<button type="button" class="pill" data-qx="inv:${dl.id}" style="margin-top:6px">🧾 مستند الصفقة</button>`:''}</div>`}).join(''):'<p class="empty">لسه مفيش صفقات.</p>')}
function reqCard(r){const open=X.open===r.id;return `<div class="qx-r"><div class="qx-h"><b>${secName(r.section)}</b>${r.chosen_provider?chip('موجّه ليك','#2563EB'):chip('مفتوح','#0F766E')}</div>
 <div class="qx-s">${E(first(r.user_id))} · ${ago(r.created_at)}${r.city?' · '+E(r.city):''}${r.budget?' · ميزانية '+fm(r.budget):''}</div>${linesHTML(r.lines)}${r.custom?`<p class="qx-s">${E(r.custom)}</p>`:''}
 ${open?offerForm(r,null):`<button type="button" class="btn" data-qx="open:${r.id}">قدّم عرض</button>`}</div>`}

/* ---------------- مستند الصفقة ---------------- */
async function invHTML(){const id=X.inv;let d=null,r=null;
 if(X.mine){d=X.mine.deals.find(x=>x.id===id);r=d&&X.mine.reqs.find(x=>x.id===d.request_id)}
 if(!d&&X.pdata){d=X.pdata.deals.find(x=>x.id===id);r=d&&X.pdata.dreqs.find(x=>x.id===d.request_id)}
 if(!d)return '<p class="msg">الصفقة مش موجودة.</p>';
 const c=X.contacts[d.id]||{},mineSide=d.customer_id===user.id;
 return `<div class="qx-np"><button type="button" class="pill" data-qx="invclose">› رجوع</button> <button type="button" class="btn" data-qx="print" style="margin-top:8px">طباعة / حفظ PDF</button></div>
 <div class="qx-in" dir="rtl"><h3 style="margin:0">Horizon · مستند تأكيد صفقة</h3><div class="qx-s" style="color:#555">رقم: HZ-${String(d.invoice_no).padStart(6,'0')} · ${new Date(d.created_at).toLocaleDateString('ar-EG')}</div>
 <p><b>القسم:</b> ${secName(d.section)}<br><b>المورد:</b> ${E(nm(d.provider_id))}<br><b>العميل:</b> ${E(mineSide?(X.myname||'أنا'):first(d.customer_id))}${c.phone&&!mineSide?'<br><b>تليفون المورد:</b> '+E(c.phone):''}</p>
 <table>${(r&&Array.isArray(r.lines)?r.lines:[]).map(l=>`<tr><td>${lineTxt(l)}</td></tr>`).join('')}</table>
 <p class="qx-k">الإجمالي المتفق عليه: ${fm(d.total)} جنيه</p>${d.price_date?`<p>سعر المورد اتحدّد بتاريخ <b>${new Date(d.price_date).toLocaleDateString('ar-EG')}</b> واتقبل بتاريخ <b>${new Date(d.created_at).toLocaleDateString('ar-EG')}</b>.</p>`:''}${d.price_adjust_pct?`<p>شرط المورد: السعر قابل للتعديل لو سعر المادة زاد أكتر من <b>${E(d.price_adjust_pct)}%</b>.</p>`:''}<p>الحالة: ${E(DS[d.stage]||d.stage)}</p>
 <p style="font-size:12px;color:#555">ده مستند تأكيد داخلي بين الطرفين على Horizon، وليس فاتورة ضريبية. الدفع والتسليم بين العميل والمورد، وبيتسجّلوا هنا عشان المتابعة والتقييم. لو حصلت مشكلة افتح شكوى من شاشة الصفقة خلال 14 يوم من الاستلام.</p></div>`}

/* ---------------- الرسم ---------------- */
async function draw(){ensure();const b=$q('#qxBody');if(!b)return;
 if(X.inv){b.innerHTML=await invHTML();return}
 const tabs=`<div class="qx-t"><button type="button" class="qx-c${X.tab==='mine'?' on':''}" data-qx="tab:mine">🧾 طلباتي</button><button type="button" class="qx-c${X.tab==='prov'?' on':''}" data-qx="tab:prov">📥 طلبات العملاء (للموردين)</button></div>`;
 b.innerHTML=`<h3 style="margin:0">متابعة عروض الأسعار</h3>${tabs}${X.msg?`<p class="msg${X.ok?' ok':''}">${E(X.msg)}</p>`:''}${X.tab==='mine'?GUAR+mineHTML():provHTML()}`}
function open(tab){if(typeof user==='undefined'||!user){try{typeof toast==='function'&&toast('سجّل دخول الأول');typeof needLogin==='function'&&needLogin()}catch(_){}return}
 X.tab=tab||'mine';X.ptab=X.ptab||'open';X.msg='';X.ok=0;X.inv=null;X.myname=(typeof PROF!=='undefined'&&PROF&&PROF.full_name)||'';show();draw();X.tab==='mine'?loadMine():loadProv()}
window.hzQuotes=open;

async function call(fn,args,okMsg,after){X.msg='…';X.ok=0;draw();
 try{const r=await sb.rpc(fn,args);if(r.error)throw r.error;X.msg=okMsg;X.ok=1;await after()}catch(e){X.msg=errTxt(e);X.ok=0;draw()}}
document.addEventListener('click',async e=>{const a=e.target.closest('[data-qx]');if(!a)return;
 if(a.dataset.qx!=='close'&&!(a.closest('#qxModal')))return;
 const [k,v,w]=a.dataset.qx.split(':');
 if(k==='close'){hide();return}
 if(k==='tab'){X.tab=v;X.msg='';X.open=null;draw();v==='mine'?loadMine():loadProv();return}
 if(k==='ptab'){X.ptab=v;X.open=null;X.msg='';draw();return}
 if(k==='open'){X.open=X.open===v?null:v;draw();return}
 if(k==='star'){X.star[v]=+w;draw();return}
 if(k==='print'){window.print();return}
 if(k==='inv'){X.inv=v;await contact(v);draw();return}
 if(k==='invclose'){X.inv=null;draw();return}
 const re=()=>X.tab==='mine'?loadMine():loadProv();
 if(k==='accept'){if(!confirm('تقبل العرض ده؟ بيانات التواصل مع المورد هتظهرلك بعد القبول، والعروض التانية هتتقفل.'))return;await call('hzq_accept',{p_offer:v},'العرض اتقبل. تابع التنفيذ من هنا.',re);return}
 if(k==='cancelreq'){if(!confirm('تلغي الطلب ده؟'))return;await call('hzq_cancel_request',{p_request:v},'الطلب اتلغى.',re);return}
 if(k==='stage'){if(w==='cancelled'&&!confirm('تلغي الصفقة؟'))return;await call('hzq_stage',{p_deal:v,p_stage:w},'اتحدّثت الحالة.',re);return}
 if(k==='rate'){const n=X.star[v]||0;if(!n){X.msg='اختار عدد النجوم الأول';X.ok=0;draw();return}const t=($q('#qxRv_'+v)||{}).value||'';await call('hzq_rate',{p_deal:v,p_rating:n,p_review:t},'شكراً على تقييمك ⭐',re);return}
 if(k==='send'){const rq0=((X.pdata&&X.pdata.reqs)||[]).find(x=>x.id===v);if(rq0&&window.HZ_AVAIL&&!HZ_AVAIL.canTrade(rq0.section)){X.msg='قريبًا. القسم ده لسه مش مفتوح لإرسال العروض.';X.ok=0;draw();return}
  const t=+($q('#qxT_'+v)||{}).value,dd=($q('#qxD_'+v)||{}).value,nt=($q('#qxN_'+v)||{}).value||'';if(!(t>0)){X.msg='اكتب إجمالي السعر';X.ok=0;draw();return}
  const vd=+(($q('#qxV_'+v)||{}).value)||7,pc=($q('#qxP_'+v)||{}).value;
  await call('hzq_send_offer',{p_request:v,p_total:t,p_days:dd===''?null:Math.round(+dd),p_note:nt,p_valid_days:vd,p_adjust_pct:(pc===''||pc==null)?null:+pc},'العرض اتبعت للعميل ✓',async()=>{X.open=null;X.ptab='offers';await re()});return}
 if(k==='dispute'){const t=prompt('اشرح المشكلة في جملة أو اتنين (فريق Horizon هيراجعها):');if(t===null)return;await call('hzq_open_dispute',{p_deal:v,p_reason:t},'الشكوى اتبعتت لفريق Horizon وهنتواصل معاك.',re);return}
 if(k==='withdraw'){if(!confirm('تسحب العرض ده؟'))return;await call('hzq_withdraw_offer',{p_offer:v},'العرض اتسحب.',re);return}
});

/* إشعارات الجرس بتفتح الشاشة المناسبة */
document.addEventListener('click',e=>{const row=e.target.closest&&e.target.closest('.ntr');if(!row)return;const t=row.textContent||'';
 let tab=null;
 if(/طلب (عرض سعر )?جديد/.test(t)||/العميل (قبل|اختار|أكّد)|قيّمك|عرضك انتهت/.test(t))tab='prov';
 else if(/وصلك عرض سعر|المورد (بدأ|بلّغ)|الصفقة اتلغت/.test(t))tab='mine';
 if(!tab)return;e.stopImmediatePropagation();e.preventDefault();const nt=$q('#ntModal');if(nt)nt.hidden=true;X.ptab=/العميل (قبل|أكّد)|قيّمك/.test(t)?'deals':/اختار|عرضك انتهت/.test(t)?'offers':'open';open(tab)},true);

/* صفوف الإعدادات */
function inject(){const b=document.getElementById('hsBody');if(!b||typeof user==='undefined'||!user||b.querySelector('[data-qxrow]'))return;
 const g=b.querySelector('.hs-g');if(!g||!g.querySelector('[data-hs="acc"]'))return;
 g.insertAdjacentHTML('beforeend',`<button type="button" class="hs-r" data-qxrow="mine"><span class="hs-i" style="--c:#0F766E">🧾</span><span class="hs-t">طلبات عروض الأسعار وصفقاتي</span><i class="hs-c">${(typeof lang!=='undefined'&&lang==='ar')?'‹':'›'}</i></button><button type="button" class="hs-r" data-qxrow="prov"><span class="hs-i" style="--c:#2563EB">📥</span><span class="hs-t">طلبات العملاء (للموردين)</span><i class="hs-c">${(typeof lang!=='undefined'&&lang==='ar')?'‹':'›'}</i></button>`)}
document.addEventListener('click',e=>{const r=e.target.closest('[data-qxrow]');if(!r)return;const m=$q('#setModal');if(m)m.hidden=true;open(r.dataset.qxrow)});
function bootS(){const b=document.getElementById('hsBody');if(!b){setTimeout(bootS,300);return}new MutationObserver(inject).observe(b,{childList:true});inject()}

/* شريط التركيز على الأقسام التلاتة في الرئيسية */
function focusBar(){const w=$q('#qxFocus');if(w)w.remove()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-qxq]');if(!b)return;if(typeof window.hzQuote==='function')window.hzQuote(b.dataset.qxq)});
function bootF(){const g=$q('#grid');if(!g){setTimeout(bootF,300);return}new MutationObserver(()=>{try{focusBar()}catch(_){}}).observe(g,{childList:true});focusBar()}
css();bootS();bootF();
})();
