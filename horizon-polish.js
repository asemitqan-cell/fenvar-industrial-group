/* Keep marketplace discovery secondary to a prominent, usable search field. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function arrange(){
 const root=$('#hmp-root');if(!root)return;
 const tools=root.querySelector('.hmp-tools'),track=$('#hmp-trend');
 if(tools&&track&&tools.nextElementSibling!==track)tools.insertAdjacentElement('afterend',track);
 const tab=document.querySelector('.hmp-tab');if(tab){tab.setAttribute('aria-label','السوق');tab.title='السوق';}
}
function carousel(){
 const root=$('#hmp-root'),track=$('#hmp-trend-track'),grid=$('#hmp-grid'),cats=$('#hmp-cats');
 if(!root||!track||!grid)return;
 const cards=[...grid.querySelectorAll('.hmp-card')];
 if(cards.length){
  const sig=cards.map(x=>x.querySelector('h3')?.textContent||'').join('|');
  if(track.dataset.sig===sig)return;
  track.dataset.sig=sig;track.replaceChildren();
  cards.slice(0,8).forEach((card,i)=>{
   const slide=document.createElement('button');slide.type='button';slide.className='hmp-trend-card';
   const img=card.querySelector('.hmp-photo img');
   if(img){const im=document.createElement('img');im.src=img.src;im.alt='';slide.append(im);}
   const copy=document.createElement('span');copy.className='hmp-trend-copy';
   const small=document.createElement('small');small.textContent=i===0?'اختيار مميز':'رائج على Horizon';
   const title=document.createElement('b');title.textContent=card.querySelector('h3')?.textContent||'منتج مميز';
   const meta=document.createElement('span');meta.textContent=card.querySelector('.hmp-price')?.textContent||'اطلب عرض سعر';
   copy.append(small,title,meta);slide.append(copy);
   slide.addEventListener('click',()=>card.scrollIntoView({behavior:'smooth',block:'center'}));
   track.append(slide);
  });
 }else{
  const catButtons=cats?[...cats.querySelectorAll('button[data-cat]')]:[];
  const sig='empty:'+catButtons.map(x=>x.textContent).join('|');
  if(track.dataset.sig===sig)return;
  track.dataset.sig=sig;track.replaceChildren();
  const e=document.createElement('div');e.className='hmp-trend-empty';
  e.textContent='قريبًا ستظهر المنتجات والعروض الرائجة هنا بعد نشر الموردين لمنتجاتهم.';
  track.append(e);
 }
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-hmp-scroll]');
 if(b){const t=$('#hmp-trend-track');if(t)t.scrollBy({left:Number(b.dataset.hmpScroll)*300,behavior:'smooth'});}
});
const root=$('#hmp-root');
if(root){
 arrange();carousel();
 const mo=new MutationObserver(()=>{arrange();carousel();});
 ['#hmp-grid','#hmp-cats'].forEach(s=>{const el=$(s);if(el)mo.observe(el,{childList:true,subtree:true});});
}
})();
