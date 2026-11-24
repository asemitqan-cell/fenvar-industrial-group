/* Horizon: شاشة قسم UPVC وقسم الموبيليا (الهَب).
   - كل الخيارات جوه القسم نفسه، مفيش حاجة منها في الرئيسية.
   - UPVC: عرض سعر بخطوات (الأنظمة والقطاعات والمنشأ جوه خطوات عرض السعر نفسها) + مصمم الشبابيك + عينة 3D + موردين.
   - الطلبات وتتبع الطلب بقوا في القايمة الجانبية (الطلبات)، مش جوه القسم.
   - الموبيليا: 3 أنواع (عمولة / متشطبة جاهزة / نجارة أبيض) لكل نوع موردينه، وعرض السعر للموبيليا نفسها مش للخشب.
   بيتحمّل بعد quote.js و taxonomy.js وقبل سكريبت زرار الرجوع. */
(function(){
'use strict';
const $q=s=>document.querySelector(s);
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const HUB={upvc:{ico:'🪟',ar:'UPVC',sub:'شبابيك وأبواب وزجاج وإكسسوارات'},furniture:{ico:'🛋️',ar:'موبيليا',sub:'عمولة · متشطبة جاهزة · نجارة أبيض'}};
const FTK=['commission','finished','white'];
const H={sec:null,grp:'',q:'',city:'',data:null,err:'',loading:0,stats:{}};
let css0=0;

function css(){if(css0)return;css0=1;const s=document.createElement('style');s.textContent=`
.hb{grid-column:1/-1;display:grid;gap:14px;margin-bottom:6px}
.hb-top{display:flex;align-items:center;gap:14px;padding:16px;border-radius:22px;background:linear-gradient(135deg,#0F766E,#155E75);color:#fff}
.hb-top i{width:54px;height:54px;border-radius:17px;background:rgba(255,255,255,.16);display:grid;place-items:center;font-style:normal;font-size:28px;flex:none}
.hb-top b{display:block;font-size:18px}.hb-top small{opacity:.88;font-size:12.5px;line-height:1.5}
.hb-go{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:20px;padding:16px 18px;background:var(--p);color:#fff;font:inherit;text-align:start;cursor:pointer;box-shadow:0 14px 26px -16px var(--p)}
.hb-go span{flex:1}.hb-go b{display:block;font-size:16.5px}.hb-go small{display:block;font-weight:500;opacity:.92;font-size:12.5px;margin-top:2px}.hb-go em{font-style:normal;font-size:26px;line-height:1}
.hb-lst{border:1px solid var(--line);background:var(--card);border-radius:20px;overflow:hidden}
.hb-r{display:flex;align-items:center;gap:12px;width:100%;border:0;background:none;color:var(--ink);padding:13px 14px;font:inherit;text-align:start;cursor:pointer}
.hb-r+.hb-r{border-top:1px solid var(--line)}.hb-r:active{background:color-mix(in srgb,var(--p) 7%,var(--card))}
.hb-r i{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-style:normal;font-size:21px;flex:none;background:color-mix(in srgb,var(--p) 11%,var(--card))}
.hb-r span{flex:1;display:grid;gap:1px;min-width:0}.hb-r b{font-size:14.5px}.hb-r small{color:var(--mut);font-size:12px;line-height:1.5}
.hb-r em{font-style:normal;color:var(--mut);font-size:22px;line-height:1}
.hb-sep{grid-column:1/-1;margin:6px 2px 0;font-size:14px;font-weight:800}
#hubModal .hp{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px;margin:8px 0}
#hubModal .hp b{font-size:15px}#hubModal .hp small{color:var(--mut)}#hubModal .tg{display:inline-block;background:color-mix(in srgb,var(--p) 14%,transparent);color:var(--p);border-radius:999px;padding:2px 9px;font-size:11.5px;margin:4px 4px 0 0}
#hubModal .hs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:8px 0}#hubModal .hs button{flex:none;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 14px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}#hubModal .hs button.on{background:var(--p);color:#fff;border-color:var(--p)}
#hubModal .hn{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin:8px 0}#hubModal .hn div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px}#hubModal .hn b{display:block;font-size:18px}#hubModal .hn small{color:var(--mut);font-size:11.5px}
#hubModal input.q{width:100%;border:1px solid var(--line);border-radius:12px;padding:10px;background:var(--bg)}`;document.head.appendChild(s)}

const chev=()=>(typeof lang!=='undefined'&&lang==='ar')?'‹':'›';
function hubHTML(id){const m=HUB[id],u=id==='upvc';
 const row=(k,ic,t,d)=>`<button type="button" class="hb-r" data-hub="${k}"><i>${ic}</i><span><b>${t}</b><small>${d}</small></span><em>${chev()}</em></button>`;
 const rows=(u?row('design','🪟',T('Window designer','مصمم الشبابيك'),T('Draw your window with real sizes and openings','ارسم شباكك بالمقاسات وأنواع الفتح')):'')
  +row('sim','🧊',T('3D preview','عينة 3D'),u?T('See a window before you order','شوف الشباك قبل ما تطلب'):T('See a piece in 3D','شوف القطعة 3D'))
  +row('prov','📍',u?T('Find a supplier','ابحث عن مورد'):T('Suppliers & showrooms','الموردين والمعارض'),T('Verified suppliers with prices','موردين موثّقين بأسعارهم'));
 return `<div class="hb" id="hubBox"><div class="hb-top"><i>${m.ico}</i><div><b>${m.ar}</b><small>${m.sub}</small></div></div>
 <button type="button" class="hb-go" data-hub="quote"><span><b>🧾 ${T('Request a quote','اطلب عرض سعر')}</b><small>${u?T('Pick a system, list what you need, get supplier offers','اختار النظام والمنشأ، وحدد طلبك، وتوصلك عروض الموردين'):T('Pick a furniture type, list what you need, get offers','اختار نوع الموبيليا، وحدد طلبك، وتوصلك عروض الموردين')}</small></span><em>${chev()}</em></button>
 <div class="hb-lst">${rows}</div>
 <div class="hb-sep">${T('Designs gallery','معرض التصاميم')}</div></div>`}

function inject(){const g=$q('#grid');if(!g||typeof cat==='undefined'||!HUB[cat])return;
 const q=(($q('#q')||{}).value||'').trim();if(q||(typeof typ!=='undefined'&&typ!==null)){const o=$q('#hubBox');if(o)o.remove();return}
 css();const old=$q('#hubBox');if(old)old.remove();const qc=g.querySelector('.qt-card');if(qc)qc.remove();
 g.insertAdjacentHTML('afterbegin',hubHTML(cat))}

/* ---- كل ما القسم يترسم ---- */
const _r=render;render=function(){const r=_r.apply(this,arguments);try{inject()}catch(e){}return r};

/* ---- موردين القسم ---- */
function modal(){css();if($q('#hubModal'))return;document.body.insertAdjacentHTML('beforeend','<div class="modal" id="hubModal" hidden><div class="sheet st"><button type="button" class="x" data-hubclose>×</button><div id="hubBody"></div></div></div>')}
const secOf=id=>(window.HZ_SECTIONS||[]).find(s=>s.id===id);
async function loadProv(id){H.loading=1;H.err='';H.data=null;drawProv();
 try{if(typeof sb==='undefined'||!sb)throw new Error('offline');
  const r=await sb.from('hz_price_items').select('provider_id,group_key,name,price,valid_until').eq('section',id).eq('active',true).limit(2000);
  if(r.error)throw r.error;
  const items=(r.data||[]).filter(x=>x.price!=null&&!(x.valid_until&&new Date(x.valid_until)<Date.now())),ids=[...new Set(items.map(x=>x.provider_id))];
  let provs=[],profs=[];
  if(ids.length){provs=(await sb.from('hz_providers').select('*').in('user_id',ids)).data||[];profs=(await sb.from('hz_profiles').select('*').in('id',ids)).data||[]}
  const ok=new Set(provs.filter(p=>p.verified).map(p=>p.user_id)),by={};
  items.filter(x=>ok.has(x.provider_id)).forEach(x=>{const p=profs.find(y=>y.id===x.provider_id)||{},v=provs.find(y=>y.user_id===x.provider_id)||{};
   const o=by[x.provider_id]=by[x.provider_id]||{id:x.provider_id,name:p.business_name||p.brand||v.business_name||v.name||p.full_name||T('Supplier','مورد'),city:String(p.city||v.city||v.governorate||'').trim(),groups:new Set(),n:0};o.groups.add(x.group_key);o.n++});
  H.data=Object.values(by);
  try{const st=await sb.rpc('hzq_provider_stats',{p_ids:Object.keys(by)});if(!st.error&&st.data)H.stats=st.data}catch(_){}
 }catch(e){H.err=T('Could not load suppliers. Check your connection and try again.','مقدرناش نحمّل الموردين. اتأكد من النت وجرّب تاني.');H.data=[]}
 H.loading=0;drawProv()}
function drawProv(){const b=$q('#hubBody');if(!b||!H.sec)return;const s=secOf(H.sec),F=window.HZ_FTYPES||{};
 if(H.loading){b.innerHTML='<p class="hs-box">…</p>';return}
 const all=H.data||[],cities=[...new Set(all.map(p=>p.city).filter(Boolean))].sort();
 const q=H.q.trim().toLowerCase(),list=all.filter(p=>(!H.grp||p.groups.has(H.grp))&&(!H.city||p.city===H.city)&&(!q||(p.name+' '+p.city).toLowerCase().includes(q)));
 const gname=k=>(s.groups.find(g=>g.k===k)||{}).ar||k;
 b.innerHTML=`<h3 style="margin:0 0 6px">${s.ico} ${s.ar} · ${T('Suppliers','الموردين')}</h3>
 <div class="hn"><div><b>${all.length}</b><small>${T('suppliers','مورد موثّق')}</small></div><div><b>${all.reduce((a,p)=>a+p.n,0)}</b><small>${T('priced items','بند مسعّر')}</small></div><div><b>${cities.length||'—'}</b><small>${T('cities','مدينة')}</small></div></div>
 <input class="q" data-hubq placeholder="${T('Search by name or city…','ابحث بالاسم أو المدينة…')}" value="${E(H.q)}">
 <div class="hs"><button type="button" data-hubg="" class="${!H.grp?'on':''}">${T('All','الكل')}</button>${s.groups.map(g=>`<button type="button" data-hubg="${g.k}" class="${H.grp===g.k?'on':''}">${H.sec==='furniture'&&F[g.k]?F[g.k].n:g.ar}</button>`).join('')}</div>
 ${cities.length?`<div class="hs"><button type="button" data-hubc="" class="${!H.city?'on':''}">${T('All cities','كل المدن')}</button>${cities.map(c=>`<button type="button" data-hubc="${E(c)}" class="${H.city===c?'on':''}">${E(c)}</button>`).join('')}</div>`:''}
 ${H.err?`<p class="msg">${E(H.err)}</p>`:''}
 ${list.length?list.map(p=>{const st=H.stats[p.id];return `<div class="hp"><b>${E(p.name)}</b>${p.city?` <small>· ${E(p.city)}</small>`:''}${st&&+st.n?` <small>· ★ ${Number(st.avg).toFixed(1)} (${st.n})</small>`:''}<div>${[...p.groups].map(k=>`<span class="tg">${E(H.sec==='furniture'&&F[k]?F[k].n:gname(k))}</span>`).join('')}</div><small>${p.n} ${T('priced items','بند مسعّر')}</small></div>`}).join(''):(H.err?'':`<p class="empty">${T('No suppliers match yet.','مفيش موردين مطابقين لسه.')}</p>`)}
 <button type="button" class="btn" data-hub="quote" style="margin-top:10px">🧾 ${T('Request a quote','اطلب عرض سعر')}</button>`}
function openProv(id,grp){modal();H.sec=id;H.grp=grp||'';H.q='';H.city='';$q('#hubModal').hidden=false;loadProv(id)}
const closeM=()=>{const m=$q('#hubModal');if(m)m.hidden=true};

/* ---- الأزرار ---- */
function needIn(){if(typeof user!=='undefined'&&user)return false;if(typeof toast==='function')toast(T('Sign in first.','سجّل دخول الأول.'));if(typeof needLogin==='function')needLogin();return true}
document.addEventListener('click',async e=>{
 if(e.target.closest('[data-hubclose]')){closeM();return}
 const g=e.target.closest('[data-hubg]');if(g&&$q('#hubModal')&&$q('#hubModal').contains(g)){H.grp=g.dataset.hubg;drawProv();return}
 const c=e.target.closest('[data-hubc]');if(c&&$q('#hubModal')&&$q('#hubModal').contains(c)){H.city=c.dataset.hubc;drawProv();return}
 const a=e.target.closest('[data-hub]');if(!a)return;e.preventDefault();e.stopPropagation();
 const [k,...r]=a.dataset.hub.split(':'),v=r.join(':'),id=H.sec&&$q('#hubModal')&&!$q('#hubModal').hidden?H.sec:cat;
 if(k==='quote'){closeM();window.hzQuote&&hzQuote(id)}
 else if(k==='design'){if(window.hzDesigner)hzDesigner.open({sys:''})}
 else if(k==='sim'){const sp=cat==='furniture'?{kind:'wardrobe',type:'hinged',color:'walnut'}:{kind:'window',type:'casement2',color:'white'};
  if(window.hzSim)hzSim.open(sp);else if(typeof toast==='function')toast(T('3D preview is not loaded yet.','العينة 3D لسه ما اتحمّلتش.'))}
 else if(k==='prov')openProv(cat,'')
},true);
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.hubq!=null){H.q=t.value;const p=t.selectionStart;drawProv();const n=$q('#hubBody [data-hubq]');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(_){}}}});
})();
