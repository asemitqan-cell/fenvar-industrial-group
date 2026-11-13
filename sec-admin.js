/* Horizon: وضع تعديل المالك (ترتيب بالسحب، إخفاء، إعادة تسمية، صور، بلاغات). بيتحمّل للمالك بس. */
(function(){'use strict';
const $q=s=>document.querySelector(s),E=s=>esc(String(s==null?'':s));
let panel=null,tab='order';
const S=()=>window.HZ_LAYOUT=window.HZ_LAYOUT||{order:[],hidden:[],img:{},names:{}};
async function save(){try{const r=await sb.from('hz_settings').upsert({key:'layout',value:S(),updated_at:new Date().toISOString()});if(r.error)throw r.error;try{localStorage.setItem('hz_layout',JSON.stringify(S()))}catch(_){}toast&&toast(L('Saved','اتحفظ'))}catch(e){alert('مش قادر أحفظ: '+(e.message||e)+'\nتأكد إنك شغّلت ملف hz-admin.sql وإنك داخل بإيميل المالك.')}}
function order(){const o=S().order.slice();CATALOG.forEach(c=>{if(!o.includes(c.id))o.push(c.id)});return o.filter(id=>CATALOG.some(c=>c.id===id||(window.HZ_ALL||[]).includes(id)))}
function draw(){if(!panel){panel=document.createElement('div');panel.id='hzAdm';panel.style.cssText='position:fixed;inset:0;z-index:99;background:var(--bg);overflow:auto;padding:calc(12px + env(safe-area-inset-top)) 14px 90px';document.body.appendChild(panel)}
 const o=order(),nm=id=>{const c=CATALOG.find(x=>x.id===id)||{};return (S().names[id]&&S().names[id].ar)||c.ar||id};
 let h=`<div style="display:flex;gap:8px;margin-bottom:12px"><button class="pill ${tab==='order'?'dark':''}" data-ad="tab:order">الأقسام</button><button class="pill ${tab==='rep'?'dark':''}" data-ad="tab:rep">البلاغات</button><button class="pill" data-ad="close" style="margin-inline-start:auto">إغلاق ✕</button></div>`;
 if(tab==='order'){h+=`<p class="hzx-n">اسحب ⠿ لترتيب الأقسام (أو استخدم ▲▼)، 👁 للإخفاء، ✏️ للاسم، 🖼️ لصورة القسم. تقدر كمان تضغط على أي صورة جوه الأقسام وهي في وضع التعديل لتغييرها.</p><div id="adList">`+o.map((id,i)=>{const c=CATALOG.find(x=>x.id===id);if(!c)return'';const hid=S().hidden.includes(id);return `<div class="hzx-b" data-id="${id}" style="display:flex;align-items:center;gap:6px;${hid?'opacity:.45':''}"><span class="adH" style="cursor:grab;touch-action:none;font-size:20px;padding:4px 8px">⠿</span><span style="flex:1"><b>${c.e||''} ${E(nm(id))}</b>${c.sub?'<small>قسم فرعي</small>':''}</span><button class="pill" data-ad="up:${id}">▲</button><button class="pill" data-ad="dn:${id}">▼</button><button class="pill" data-ad="hd:${id}">👁</button><button class="pill" data-ad="rn:${id}">✏️</button><button class="pill" data-ad="im:c:${id}">🖼️</button></div>`}).join('')+`</div><button class="btn" data-ad="save" style="margin-top:12px">حفظ التغييرات</button><button class="pill" data-ad="reset" style="margin-top:8px">رجوع للترتيب الأصلي</button>`}
 else h+=`<div id="adRep"><p class="empty">جاري التحميل…</p></div>`;
 panel.innerHTML=h;if(tab==='rep')reps()}
async function reps(){const r=await sb.from('hz_reports').select('*').order('created_at',{ascending:false}).limit(40);const b=$q('#adRep');if(!b)return;b.innerHTML=r.error?'<p class="msg">مش قادر أقرأ البلاغات (شغّل ملف SQL)</p>':(r.data.length?r.data.map(x=>`<div class="hzx-b"><b>${E(x.kind)}</b><small>${E(x.contact||'')} · ${new Date(x.created_at).toLocaleString('ar-EG')}</small><p>${E(x.message)}</p></div>`).join(''):'<p class="empty">مفيش بلاغات.</p>')}
function move(id,d){const o=order(),i=o.indexOf(id),j=i+d;if(j<0||j>=o.length)return;o.splice(j,0,o.splice(i,1)[0]);S().order=o;apply();draw()}
function pick(key){const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=async()=>{const file=f.files[0];if(!file)return;try{const bl=await shrinkImg(file),p='ui/'+Date.now()+'.jpg',u=await sb.storage.from('hz-media').upload(p,bl,{contentType:'image/jpeg'});if(u.error)throw u.error;S().img[key]=sb.storage.from('hz-media').getPublicUrl(p).data.publicUrl;await save();apply();render()}catch(e){alert('فشل رفع الصورة: '+(e.message||e))}};f.click()}
function shrinkImg(file){return new Promise((ok,no)=>{const im=new Image();im.onload=()=>{const k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no('canvas'),'image/jpeg',.82)};im.onerror=()=>no('bad image');im.src=URL.createObjectURL(file)})}
function apply(){if(window.hzApplyLayout)window.hzApplyLayout()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ad]');if(b){const [k,...r]=b.dataset.ad.split(':'),v=r.join(':');
 if(k==='tab'){tab=v;draw()}else if(k==='close'){panel.remove();panel=null;window.HZ_EDIT=0;render()}
 else if(k==='up')move(v,-1);else if(k==='dn')move(v,1);
 else if(k==='hd'){const h=S().hidden,i=h.indexOf(v);i<0?h.push(v):h.splice(i,1);apply();draw()}
 else if(k==='rn'){const c=CATALOG.find(x=>x.id===v),n=prompt('الاسم الجديد',(S().names[v]&&S().names[v].ar)||c.ar);if(n){S().names[v]={ar:n};apply();draw()}}
 else if(k==='im')pick(v);else if(k==='save')save();
 else if(k==='reset'&&confirm('ترجع للترتيب والأسماء الأصلية؟')){window.HZ_LAYOUT={order:[],hidden:[],img:S().img,names:{}};save().then(()=>location.reload())}
 return}
 if(window.HZ_EDIT&&!panel){const t=e.target.closest('#grid .thumb');if(t){const cd=t.closest('.card'),bt=cd&&cd.querySelector('[data-item]'),k=cd&&cd.dataset.c?'c:'+cd.dataset.c:bt?'i:'+bt.dataset.cat+':'+bt.dataset.item:null;if(k){e.preventDefault();e.stopPropagation();pick(k)}}}},true);
/* سحب وإفلات بالـpointer (شغال على الموبايل) */
let drag=null;document.addEventListener('pointerdown',e=>{const h=e.target.closest('.adH');if(!h)return;drag=h.closest('[data-id]');drag.style.outline='2px solid var(--p)';e.preventDefault()});
document.addEventListener('pointermove',e=>{if(!drag)return;const el=document.elementFromPoint(e.clientX,e.clientY),row=el&&el.closest&&el.closest('#adList [data-id]');if(row&&row!==drag){const r=row.getBoundingClientRect();row.parentNode.insertBefore(drag,e.clientY<r.top+r.height/2?row:row.nextSibling)}});
document.addEventListener('pointerup',()=>{if(!drag)return;drag.style.outline='';S().order=[...document.querySelectorAll('#adList [data-id]')].map(x=>x.dataset.id);drag=null;apply()});
window.hzOpenAdmin=()=>{window.HZ_EDIT=1;tab='order';draw()};
})();
