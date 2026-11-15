/* Horizon: وضع التركيز. الأقسام المفتوحة دلوقتي: UPVC والموبيليا (وخشب وزجاج تحت "تشطيبات وأثاث").
   أي قسم تاني بيظهر باهت وعليه "قريبًا"، ولما حد يدوس عليه بيطلع تنبيه ومابيفتحش.
   لفتح قسم جديد بعدين: ضيف رقمه (id) في مصفوفة OPEN تحت. */
(function(){'use strict';
const OPEN=['all','fav','finishing','furniture','wood','glass','upvc'];
const ok=c=>OPEN.indexOf(c)>-1;
const say=()=>{try{toast('قريبًا. دلوقتي بنركّز على UPVC والموبيليا.')}catch(_){}};
const st=document.createElement('style');
st.textContent='.hzsoon{opacity:.42;filter:grayscale(.9);position:relative}.hzsoon::after{content:"قريبًا";position:absolute;top:6px;inset-inline-start:6px;background:#111827;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;pointer-events:none}.tile.hzsoon::after{top:-4px;font-size:9px;padding:1px 5px}';
document.head.appendChild(st);
/* 1) بوابة مركزية: أي طريق (شريط، شات، بحث، رابط محفوظ) يحاول يفتح قسم مقفول يرجع للرئيسية */
const R=window.render;
window.render=function(){
 try{if(typeof cat!=='undefined'&&!ok(cat)){cat='all';if(typeof typ!=='undefined')typ=null;if(typeof renderChips==='function')renderChips();say()}}catch(_){}
 return R.apply(this,arguments)};
/* 2) نفس الحكاية لو حد داس على زرار قسم مقفول: منع قبل ما يتفتح */
document.addEventListener('click',e=>{
 const s=e.target.closest&&e.target.closest('[data-qxsoon]');if(s){e.preventDefault();e.stopImmediatePropagation();say();return}
 const b=e.target.closest&&e.target.closest('#chips [data-c],#grid [data-c],#slides [data-c],#home [data-c],#needs [data-c]');
 if(b&&b.dataset.c&&!ok(b.dataset.c)){e.preventDefault();e.stopImmediatePropagation();say()}},true);
/* 3) التعتيم البصري */
let pend=0;
function mark(){pend=0;document.querySelectorAll('#chips [data-c],#grid [data-c],#slides [data-c],#home [data-c],#needs [data-c]').forEach(n=>{
 const c=n.dataset.c;if(!c)return;const soon=!ok(c);if(n.classList.contains('hzsoon')!==soon)n.classList.toggle('hzsoon',soon)})}
new MutationObserver(()=>{if(!pend){pend=1;requestAnimationFrame(mark)}}).observe(document.body,{childList:true,subtree:true});
mark();
})();
