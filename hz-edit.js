/* Horizon: تعديل التطبيق من جوه (للمالك بس).
   - المالك يفتح الإعدادات > تعديل التطبيق، يدوس على أي نص أو صورة ويغيّرها.
   - التعديلات بتتخزن في جدول hz_site_edits (الكل يقرا، المالك بس يكتب) وبتظهر لكل المستخدمين.
   - النص بيتغيّر بالمطابقة مع النص الأصلي، فأي مكان فيه نفس النص بيتغيّر معاه.
   - الصور: <img> وصور الخلفية اللي مكتوبة inline. صور الخلفية من ملف CSS مش مدعومة. */
(function(){
'use strict';
if(window.__hzEdit)return;window.__hzEdit=1;
const SB=()=>{try{return typeof sb!=='undefined'?sb:null}catch(_){return null}};
const USER=()=>{try{return typeof user!=='undefined'?user:null}catch(_){return null}};
const isOwner=()=>{try{const u=USER();return !!(u&&typeof OWNER_EMAILS!=='undefined'&&OWNER_EMAILS.includes((u.email||'').toLowerCase()))}catch(_){return false}};
const Tt=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const TXT=new Map(),IMG=new Map();let editing=false,loaded=false;
const SKIP='script,style,textarea,input,select,noscript,#hzEdBar,#hzEdDlg,svg,code';

/* ---------- تحميل التعديلات وتطبيقها ---------- */
async function load(){const s=SB();if(!s)return;
 try{const r=await s.from('hz_site_edits').select('key,kind,orig,value').limit(2000);if(r.error||!r.data)return;
  TXT.clear();IMG.clear();r.data.forEach(x=>(x.kind==='img'?IMG:TXT).set(x.orig,x.value));loaded=true;applyAll()}catch(_){}}
function applyText(root){
 if(!TXT.size)return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest(SKIP))return NodeFilter.FILTER_REJECT;return n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
 const list=[];while(w.nextNode())list.push(w.currentNode);
 list.forEach(n=>{const raw=n.nodeValue,tr=raw.trim(),o=n.__hzo!=null?n.__hzo:tr;
  if(TXT.has(o)){const v=TXT.get(o);if(tr!==v){n.__hzo=o;n.nodeValue=raw.replace(tr,v)}}
  else if(n.__hzo!=null&&tr!==n.__hzo&&!TXT.has(n.__hzo)){n.nodeValue=raw.replace(tr,n.__hzo);n.__hzo=null}})}
function applyImg(root){
 if(!IMG.size)return;
 root.querySelectorAll('img').forEach(im=>{const cur=im.getAttribute('src')||'',o=im.__hzo!=null?im.__hzo:cur;
  if(IMG.has(o)){const v=IMG.get(o);if(cur!==v){im.__hzo=o;im.setAttribute('src',v);im.removeAttribute('srcset')}}});
 root.querySelectorAll('[style*="url("]').forEach(el=>{const st=el.getAttribute('style')||'';
  IMG.forEach((v,o)=>{if(st.includes(o)&&!st.includes(v)){el.__hzbg=o;el.setAttribute('style',st.split(o).join(v))}})})}
let tm=0;function applyAll(){clearTimeout(tm);tm=setTimeout(()=>{try{mo.disconnect();applyText(document.body);applyImg(document.body)}finally{mo.observe(document.body,{childList:true,subtree:true,characterData:true})}},60)}
const mo=new MutationObserver(()=>{if(!dlgOpen)applyAll()});

/* ---------- نافذة التعديل ---------- */
let dlgOpen=false;
function css(){if(document.getElementById('hzEdCss'))return;const s=document.createElement('style');s.id='hzEdCss';s.textContent=`
#hzEdBar{position:fixed;top:0;left:0;right:0;z-index:99998;display:flex;align-items:center;gap:10px;padding:calc(8px + env(safe-area-inset-top)) 12px 8px;background:#7C3AED;color:#fff;font:600 13px/1.4 inherit}
#hzEdBar span{flex:1}#hzEdBar button{border:0;border-radius:999px;padding:7px 14px;font:inherit;font-weight:800;background:#fff;color:#5B21B6;cursor:pointer}
body.hzedit{padding-top:52px}
body.hzedit *{cursor:cell}
body.hzedit .hzed-hl{outline:2px dashed #7C3AED!important;outline-offset:2px}
#hzEdDlg{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}
#hzEdDlg .bx{width:100%;max-width:460px;background:var(--card,#fff);color:var(--ink,#111);border-radius:22px 22px 0 0;padding:18px;max-height:90vh;overflow:auto;box-sizing:border-box}
#hzEdDlg h4{margin:0 0 10px;font-size:16px}
#hzEdDlg textarea{width:100%;min-height:110px;box-sizing:border-box;border:1px solid var(--line,#ccc);border-radius:12px;padding:10px;font:inherit;background:var(--bg,#fff);color:inherit}
#hzEdDlg img.pv{max-width:100%;max-height:200px;border-radius:12px;display:block;margin:8px auto}
#hzEdDlg .rw{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
#hzEdDlg .rw button{flex:1;min-width:90px;border:1px solid var(--line,#ccc);border-radius:12px;padding:11px;font:inherit;font-weight:700;background:var(--card,#fff);color:inherit;cursor:pointer}
#hzEdDlg .rw button.p{background:#7C3AED;border-color:#7C3AED;color:#fff}
#hzEdDlg .em{min-height:18px;margin-top:8px;font-size:13px;color:#B42318}#hzEdDlg .em.ok{color:#067647}
#hzEdDlg small{color:var(--mut,#666);display:block;margin-top:6px;line-height:1.6}`;document.head.appendChild(s)}
function dlg(html){css();closeDlg();dlgOpen=true;const d=document.createElement('div');d.id='hzEdDlg';d.innerHTML='<div class="bx">'+html+'</div>';
 d.addEventListener('click',e=>{if(e.target===d)closeDlg()});document.body.appendChild(d);return d}
function closeDlg(){const d=document.getElementById('hzEdDlg');if(d)d.remove();dlgOpen=false;applyAll()}
const esc2=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function save(kind,orig,value){const s=SB();if(!s)throw new Error('offline');
 const r=await s.from('hz_site_edits').upsert({key:(kind==='img'?'i:':'t:')+orig.slice(0,400),kind,orig,value,updated_at:new Date().toISOString()},{onConflict:'key'});
 if(r.error)throw r.error;(kind==='img'?IMG:TXT).set(orig,value)}
async function reset(kind,orig){const s=SB();if(!s)throw new Error('offline');
 const r=await s.from('hz_site_edits').delete().eq('key',(kind==='img'?'i:':'t:')+orig.slice(0,400));if(r.error)throw r.error;(kind==='img'?IMG:TXT).delete(orig)}

function editText(node){const raw=node.nodeValue,tr=raw.trim(),orig=node.__hzo!=null?node.__hzo:tr,changed=TXT.has(orig);
 const d=dlg(`<h4>✏️ ${Tt('Edit text','تعديل النص')}</h4><textarea id="hzEdT">${esc2(tr)}</textarea><small>${Tt('Every place that shows this same text will change.','أي مكان فيه نفس النص هيتغيّر معاه.')}</small><div class="em" id="hzEdM"></div><div class="rw"><button class="p" id="hzEdS">${Tt('Save','حفظ')}</button>${changed?`<button id="hzEdR">${Tt('Restore original','رجّع الأصلي')}</button>`:''}<button id="hzEdC">${Tt('Cancel','إلغاء')}</button></div>`);
 const m=d.querySelector('#hzEdM');d.querySelector('#hzEdC').onclick=closeDlg;
 d.querySelector('#hzEdS').onclick=async()=>{const v=d.querySelector('#hzEdT').value.trim();if(!v){m.textContent=Tt('Text cannot be empty.','النص مينفعش يبقى فاضي.');return}
  if(v===orig){try{if(changed)await reset('text',orig)}catch(_){}closeDlg();return}
  m.className='em';m.textContent='…';try{await save('text',orig,v);closeDlg()}catch(e){m.className='em';m.textContent=Tt('Could not save: ','مقدرتش أحفظ: ')+((e&&e.message)||'')}};
 const rb=d.querySelector('#hzEdR');if(rb)rb.onclick=async()=>{try{await reset('text',orig);document.querySelectorAll('*').length;closeDlg();location.reload()}catch(e){m.textContent=(e&&e.message)||''}}}

function shrink(f){return new Promise((ok,no)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{try{const k=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>{URL.revokeObjectURL(u);b?ok(b):no(new Error('blob'))},'image/jpeg',.85)}catch(e){no(e)}};im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('img'))};im.src=u})}
function editImg(el,orig,isBg){const changed=IMG.has(orig),cur=IMG.get(orig)||orig;
 const d=dlg(`<h4>🖼️ ${Tt('Replace image','تغيير الصورة')}</h4>${isBg?'':`<img class="pv" src="${esc2(cur)}" alt="">`}<input type="file" id="hzEdF" accept="image/*" style="margin-top:10px;width:100%"><small>${Tt('Pick a new image. It replaces this image everywhere it appears.','اختار صورة جديدة. هتحل مكان الصورة دي في كل مكان بتظهر فيه.')}</small><div class="em" id="hzEdM"></div><div class="rw"><button class="p" id="hzEdS">${Tt('Upload & save','ارفع واحفظ')}</button>${changed?`<button id="hzEdR">${Tt('Restore original','رجّع الأصلية')}</button>`:''}<button id="hzEdC">${Tt('Cancel','إلغاء')}</button></div>`);
 const m=d.querySelector('#hzEdM');d.querySelector('#hzEdC').onclick=closeDlg;
 d.querySelector('#hzEdS').onclick=async()=>{const f=d.querySelector('#hzEdF').files[0];if(!f){m.textContent=Tt('Choose an image first.','اختار صورة الأول.');return}
  const s=SB(),u=USER();if(!s||!u){m.textContent=Tt('Sign in first.','سجّل دخول الأول.');return}
  m.className='em';m.textContent='…';
  try{const b=await shrink(f),p=`${u.id}/site_${Date.now()}.jpg`,up=await s.storage.from('listings').upload(p,b,{contentType:'image/jpeg'});if(up.error)throw up.error;
   const url=s.storage.from('listings').getPublicUrl(p).data.publicUrl;await save('img',orig,url);closeDlg()}
  catch(e){m.className='em';m.textContent=Tt('Could not upload: ','مقدرتش أرفع: ')+((e&&e.message)||'')}};
 const rb=d.querySelector('#hzEdR');if(rb)rb.onclick=async()=>{try{await reset('img',orig);closeDlg();location.reload()}catch(e){m.textContent=(e&&e.message)||''}}}

/* ---------- وضع التعديل ---------- */
function textNodeAt(x,y,target){let n=null;
 try{if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);if(r&&r.startContainer&&r.startContainer.nodeType===3)n=r.startContainer}
  else if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(p&&p.offsetNode&&p.offsetNode.nodeType===3)n=p.offsetNode}}catch(_){}
 if(n&&target.contains(n)&&n.nodeValue.trim())return n;
 const w=document.createTreeWalker(target,NodeFilter.SHOW_TEXT,{acceptNode:t=>t.nodeValue.trim()&&!(t.parentElement&&t.parentElement.closest(SKIP))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
 return w.nextNode()}
function bgUrl(el){for(let e=el,i=0;e&&e!==document.body&&i<4;e=e.parentElement,i++){const st=e.getAttribute&&e.getAttribute('style')||'';const m=/url\((['"]?)([^'")]+)\1\)/.exec(st);if(m){const cur=m[2];let o=cur;IMG.forEach((v,k)=>{if(v===cur)o=k});return{el:e,orig:o}}}return null}
function onTap(e){if(!editing||dlgOpen)return;const t=e.target;if(!t||t.closest('#hzEdBar,#hzEdDlg'))return;
 e.preventDefault();e.stopImmediatePropagation();
 const im=t.closest('img');
 if(im){const cur=im.getAttribute('src')||'';editImg(im,im.__hzo!=null?im.__hzo:cur,false);return}
 const n=textNodeAt(e.clientX,e.clientY,t);if(n){editText(n);return}
 const b=bgUrl(t);if(b){editImg(b.el,b.orig,true);return}
 if(typeof toast==='function')toast(Tt('Nothing editable here.','مفيش نص أو صورة هنا يتعدّل.'))}
['click','touchend'].forEach(ev=>document.addEventListener(ev,e=>{if(!editing)return;if(ev==='touchend'){const t=e.target;if(t&&t.closest('#hzEdBar,#hzEdDlg'))return;return}onTap(e)},true));
['submit','keydown'].forEach(ev=>document.addEventListener(ev,e=>{if(editing&&!dlgOpen&&ev==='submit')e.preventDefault()},true));
function bar(){css();if(document.getElementById('hzEdBar'))return;const b=document.createElement('div');b.id='hzEdBar';b.innerHTML=`<span>✏️ ${Tt('Edit mode: tap any text or image','وضع التعديل: دوس على أي نص أو صورة')}</span><button type="button" id="hzEdX">${Tt('Done','خلصت')}</button>`;document.body.appendChild(b);b.querySelector('#hzEdX').onclick=()=>window.hzEditMode(false)}
window.hzEditMode=function(on){
 if(on&&!isOwner()){if(typeof toast==='function')toast(Tt('Owner only.','للمالك بس.'));return}
 editing=!!on;document.body.classList.toggle('hzedit',editing);
 if(editing){try{document.querySelectorAll('.modal').forEach(m=>{m.hidden=true});if(typeof MS!=='undefined')MS.length=0}catch(_){}bar();if(!loaded)load()}else{const b=document.getElementById('hzEdBar');if(b)b.remove();closeDlg()}};
window.hzIsOwner=isOwner;

/* ---------- تشغيل ---------- */
function boot(){load();mo.observe(document.body,{childList:true,subtree:true,characterData:true});
 try{const s=SB();if(s&&s.auth&&s.auth.onAuthStateChange)s.auth.onAuthStateChange(()=>{setTimeout(()=>{if(!isOwner()&&editing)window.hzEditMode(false)},50)})}catch(_){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,300));else setTimeout(boot,300);
})();
