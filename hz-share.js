/* Horizon: لينك مباشر لطلب عرض السعر + زرار "شارك مع عملائي" (واتساب / نسخ / QR للطباعة)
   اللينك بالشكل ده: الموقع?req=upvc  أو  ?req=wood  وبيفتح نموذج الطلب على طول (ويطلب تسجيل دخول لو لازم). */
(function(){'use strict';
const SECS=[['upvc','🪟','UPVC','شبابيك وأبواب وزجاج UPVC'],['wood','🛋️','موبيليا','موبيليا وخشب ومطابخ ودواليب'],['','🏠','الرئيسية','']];
const base=()=>location.origin+location.pathname;
const link=s=>s?base()+'?req='+s:base();
const msg=s=>{const x=SECS.find(a=>a[0]===s);return s?'عايز سعر '+x[3]+'؟ اطلب عرض سعر من أكتر من مورد في دقيقتين، وقارن وتختار: '+link(s):'سوق هورايزن: اطلب عرض سعر من أكتر من مورد (UPVC وموبيليا): '+link('')};
const tt=t=>{try{toast(t)}catch(_){}};
/* ---- 1) اللينك المباشر ---- */
const K='hz_req';
try{const p=new URLSearchParams(location.search).get('req');
 if(p&&/^(upvc|wood)$/.test(p)){localStorage.setItem(K,p);const u=new URL(location.href);u.searchParams.delete('req');history.replaceState(null,'',u.pathname+(u.search||'')+u.hash)}}catch(_){}
let tries=0,asked=0;
const iv=setInterval(()=>{let s=null;try{s=localStorage.getItem(K)}catch(_){}
 if(!s||++tries>150){clearInterval(iv);return}
 if(typeof window.hzQuote!=='function')return;
 let loggedIn=false;try{loggedIn=!!user}catch(_){}
 if(loggedIn){clearInterval(iv);try{localStorage.removeItem(K)}catch(_){}window.hzQuote(s)}
 else if(!asked){asked=1;window.hzQuote(s)}   /* بيطلب تسجيل دخول، وبعد الدخول بيفتح النموذج لوحده */
},700);
/* ---- 2) نافذة المشاركة ---- */
let cur='upvc',qrLib=null;
function css(){const s=document.createElement('style');s.textContent='#hzShare{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center}#hzShare[hidden]{display:none}#hzShare .sh{background:var(--card,#fff);color:var(--ink,#111);width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:16px;max-height:90vh;overflow:auto}#hzShare .row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}#hzShare input{width:100%;border:1px solid var(--line,#ddd);border-radius:10px;padding:9px;background:var(--bg,#fff)}#hzShare #hzQr{display:flex;justify-content:center;margin:10px 0}';document.head.appendChild(s)}
function modal(){let m=document.getElementById('hzShare');if(!m){m=document.createElement('div');m.id='hzShare';m.hidden=true;document.body.appendChild(m);
 m.addEventListener('click',onClick)}return m}
function draw(){const m=modal();
 m.innerHTML=`<div class="sh"><div style="display:flex;justify-content:space-between;align-items:center"><b>📤 شارك الرابط مع عملائك</b><button type="button" class="pill" data-sh="x">×</button></div>
 <div class="row">${SECS.map(a=>`<button type="button" class="pill ${a[0]===cur?'dark':''}" data-sh="s:${a[0]}">${a[1]} ${a[2]}</button>`).join('')}</div>
 <input readonly id="hzShL" value="${link(cur)}">
 <div class="row"><button type="button" class="btn" data-sh="wa">واتساب</button><button type="button" class="pill" data-sh="cp">📋 نسخ الرابط</button><button type="button" class="pill" data-sh="nat">مشاركة…</button></div>
 <div id="hzQr"><small>جاري عمل الـQR…</small></div>
 <div class="row"><button type="button" class="pill" data-sh="dl">⬇️ حمّل الـQR</button><button type="button" class="pill" data-sh="pr">🖨️ اطبع</button></div></div>`;
 m.hidden=false;qr()}
function loadLib(){return qrLib||(qrLib=new Promise((ok,no)=>{if(window.QRCode)return ok();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.onload=ok;s.onerror=()=>{qrLib=null;no()};document.head.appendChild(s)}))}
function qr(){const box=document.getElementById('hzQr');if(!box)return;
 loadLib().then(()=>{box.innerHTML='';new QRCode(box,{text:link(cur),width:220,height:220,correctLevel:QRCode.CorrectLevel.M})}).catch(()=>{box.innerHTML='<small>محتاج إنترنت عشان الـQR يتعمل.</small>'})}
function img(){const c=document.querySelector('#hzQr canvas'),i=document.querySelector('#hzQr img');return c?c.toDataURL('image/png'):(i&&i.src)||null}
function onClick(e){const b=e.target.closest('[data-sh]');if(!b){if(e.target.id==='hzShare')modal().hidden=true;return}
 const v=b.dataset.sh;
 if(v==='x')modal().hidden=true;
 else if(v.startsWith('s:')){cur=v.slice(2);draw()}
 else if(v==='wa')window.open('https://wa.me/?text='+encodeURIComponent(msg(cur)),'_blank','noopener');
 else if(v==='cp'){try{navigator.clipboard.writeText(link(cur));tt('اتنسخ الرابط',1)}catch(_){const i=document.getElementById('hzShL');i&&i.select()}}
 else if(v==='nat'){if(navigator.share)navigator.share({text:msg(cur)}).catch(()=>{});else tt('الجهاز مش بيدعم المشاركة، استخدم واتساب أو النسخ')}
 else if(v==='dl'){const d=img();if(!d)return tt('استنى الـQR يتعمل');const a=document.createElement('a');a.href=d;a.download='horizon-qr-'+(cur||'home')+'.png';a.click()}
 else if(v==='pr'){const d=img();if(!d)return tt('استنى الـQR يتعمل');const x=SECS.find(a=>a[0]===cur),w=window.open('','_blank');if(!w)return tt('اسمح بالنوافذ المنبثقة');
  w.document.write('<html dir="rtl"><body style="font-family:sans-serif;text-align:center;padding:30px"><h1>اطلب عرض سعر '+(x[2]==='الرئيسية'?'':x[2])+'</h1><p>امسح الكود وقارن أسعار أكتر من مورد</p><img src="'+d+'" style="width:300px;height:300px"><p style="direction:ltr">'+link(cur)+'</p><script>onload=()=>print()<\/script></body></html>');w.document.close()}}
document.addEventListener('click',e=>{if(e.target.closest('[data-hzshare]')){cur=cur||'upvc';draw()}});
/* ---- 3) الزرار في شريط الرئيسية ---- */
function put(){const m=document.querySelector('#qxFocus .qx-m');if(m&&!m.querySelector('[data-hzshare]'))m.insertAdjacentHTML('beforeend','<button type="button" class="pill" data-hzshare="1">📤 شارك مع عملائي</button>')}
new MutationObserver(()=>put()).observe(document.body,{childList:true,subtree:true});
css();put();
})();
