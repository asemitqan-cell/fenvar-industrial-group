/* FENVAR / Horizon: تنفيذ الإتاحة. القرار نفسه في hz-avail.js (HZ_AVAIL). هنا بس المنع من كل مدخل + شكل "قريبًا".
   المنع مش بصري بس: أي طريق (شريط، شات، بحث، AI، رابط محفوظ، سهم رجوع، زر طلب) بيعدّي على نفس البوابة. */
(function(){'use strict';
const A=window.HZ_AVAIL;if(!A){try{console.warn('hz-avail.js missing: availability gate not active')}catch(_){}return}
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const say=()=>A.say();
const st=document.createElement('style');
st.textContent='.hzsoon{opacity:.42;filter:grayscale(.9);position:relative}.hzsoon::after{content:"قريبًا";position:absolute;top:6px;inset-inline-start:6px;background:#111827;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;pointer-events:none}.tile.hzsoon::after{top:-4px;font-size:9px;padding:1px 5px}button.hzsoon-b,.btn.hzsoon-b{opacity:.5;filter:grayscale(1)}button.hzsoon-b::after,.btn.hzsoon-b::after{content:none}';
document.head.appendChild(st);
const isCat=id=>{try{return typeof CATALOG!=='undefined'&&CATALOG.some(c=>c.id===id)}catch(_){return false}};
const firstAid=n=>/first aid|إسعاف/i.test(n||'');
/* 1) بوابة الرسم: أي مسار بيغيّر cat لقسم مقفول (رابط محفوظ، رجوع، بحث) يرجع للرئيسية */
const R=window.render;
window.render=function(){
 try{if(typeof cat!=='undefined'&&!A.open(cat)){cat='all';if(typeof typ!=='undefined')typ=null;if(typeof renderChips==='function')renderChips();say()}}catch(_){}
 return R.apply(this,arguments)};
/* 2) بوابة الدخول للقسم: goCat بيتستخدم من الشريط والمساعد AI والرئيسية والبحث */
const G=window.goCat;
if(typeof G==='function')window.goCat=function(k){if(k&&!A.open(k)){say();return}return G.apply(this,arguments)};
/* 3) بوابة الطلبات: أي طلب/شراء/حجز لقسم مش تجاري. (الطلب الخاص بدون قسم بيروح للإدارة مش للموردين، فمفتوح) */
const RI=window.requestItem;
if(typeof RI==='function')window.requestItem=function(name,c){if(c&&c!=='all'&&!A.canTrade(c)){say();return}return RI.apply(this,arguments)};
/* 4) منع قبل ما الضغطة توصل لأي مستمع تاني */
document.addEventListener('click',e=>{
 const tg=e.target;if(!tg||!tg.closest)return;
 const s=tg.closest('[data-qxsoon]');if(s){e.preventDefault();e.stopImmediatePropagation();say();return}
 const b=tg.closest('#chips [data-c],#grid [data-c],#slides [data-c],#home [data-c],#needs [data-c]');
 if(b&&b.dataset.c&&isCat(b.dataset.c)&&!A.open(b.dataset.c)){e.preventDefault();e.stopImmediatePropagation();say();return}
 const it=tg.closest('[data-item]:not(form)');
 if(it){const c=it.dataset.cat;
  if(c&&c!=='all'){
   if(c==='health'&&firstAid(it.dataset.item)&&typeof goCat==='function'){e.preventDefault();e.stopImmediatePropagation();goCat('aid');return}
   if(!A.canTrade(c)){e.preventDefault();e.stopImmediatePropagation();say();return}}}
},true);
/* 5) الشكل: تعتيم + "قريبًا" على الأقسام المقفولة، وأزرار الطلب/الحجز/الشراء جوه الأقسام المختلطة */
let pend=0;
function mark(){pend=0;
 document.querySelectorAll('#chips [data-c],#grid [data-c],#slides [data-c],#home [data-c],#needs [data-c]').forEach(n=>{
  const c=n.dataset.c;if(!c||!isCat(c))return;const soon=!A.open(c);if(n.classList.contains('hzsoon')!==soon)n.classList.toggle('hzsoon',soon)});
 document.querySelectorAll('[data-item][data-cat]').forEach(n=>{
  const c=n.dataset.cat;if(!c||c==='all')return;
  if(c==='health'&&firstAid(n.dataset.item)){if(!n.dataset.hzo){n.dataset.hzo=n.textContent;n.textContent=T('Open','افتح')}return}
  if(!A.canTrade(c)&&n.tagName==='BUTTON'){if(!n.dataset.hzo){n.dataset.hzo=n.textContent}n.classList.add('hzsoon-b');if(n.textContent!==T('Coming soon','قريبًا'))n.textContent=T('Coming soon','قريبًا')}})}
new MutationObserver(()=>{if(!pend){pend=1;requestAnimationFrame(mark)}}).observe(document.body,{childList:true,subtree:true});
mark();
})();
