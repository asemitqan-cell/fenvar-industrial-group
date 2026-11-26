/* Horizon premium experience interactions. UI only; preserves existing Supabase flows. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function polishMarket(){
 const root=$('#hmp-root'),main=document.querySelector('main'),tab=document.querySelector('.hmp-tab');
 if(!root||!main)return;
 if(tab){tab.innerHTML='';tab.title='السوق';tab.setAttribute('aria-label','السوق');tab.setAttribute('aria-label','افتح السوق');}
 const head=root.querySelector('.hmp-head');
 if(head&&!$('#hmp-trend')){const section=document.createElement('section');section.className='hmp-trend';section.id='hmp-trend';section.innerHTML='<div class="hmp-trend-head"><div><h3>رائج الآن</h3><p>منتجات وعروض مميزة من الموردين على Horizon</p></div><div class="hmp-trend-controls"><button type="button" data-hmp-scroll="-1" aria-label="السابق">‹</button><button type="button" data-hmp-scroll="1" aria-label="التالي">›</button></div></div><div class="hmp-trend-track" id="hmp-trend-track"></div>';head.insertAdjacentElement('afterend',section);}
 const track=$('#hmp-trend-track'),grid=$('#hmp-grid'),cats=$('#hmp-cats');if(!track||!grid)return;
 const products=[...grid.querySelectorAll('.hmp-card')];
 if(products.length){
  const sig=products.map(x=>x.querySelector('h3')?.textContent||'').join('|');
  if(track.dataset.sig!==sig){track.dataset.sig=sig;track.innerHTML='';
   products.slice(0,8).forEach((card,i)=>{const slide=document.createElement('button');slide.type='button';slide.className='hmp-trend-card';const img=card.querySelector('.hmp-photo img');if(img){const im=document.createElement('img');im.src=img.src;im.alt='';slide.append(im)}const copy=document.createElement('span');copy.className='hmp-trend-copy';const small=document.createElement('small');small.textContent=i===0?'مختار لك':'رائج على Horizon';const b=document.createElement('b');b.textContent=card.querySelector('h3')?.textContent||'منتج مميز';const meta=document.createElement('span');meta.textContent=card.querySelector('.hmp-price')?.textContent||'اكتشف التفاصيل واطلب عرض سعر';copy.append(small,b,meta);slide.append(copy);slide.addEventListener('click',()=>{const btn=products[i]?.querySelector('[data-hmp-q]');if(btn)btn.click()});track.append(slide)});
  }
 }else if(cats&&cats.querySelectorAll('button[data-cat]').length){
  const sig='cats:'+ [...cats.querySelectorAll('button[data-cat]')].map(x=>x.textContent).join('|');
  if(track.dataset.sig!==sig){track.dataset.sig=sig;track.innerHTML='';[...cats.querySelectorAll('button[data-cat]')].filter(x=>x.dataset.cat!=='all').slice(0,8).forEach((c,i)=>{const slide=document.createElement('button');slide.type='button';slide.className='hmp-trend-card';const copy=document.createElement('span');copy.className='hmp-trend-copy';const small=document.createElement('small');small.textContent='اكتشف السوق';const b=document.createElement('b');b.textContent=c.textContent;const meta=document.createElement('span');meta.textContent='استكشف المنتجات والموردين في هذا القسم';copy.append(small,b,meta);slide.append(copy);slide.addEventListener('click',()=>c.click());track.append(slide)})}
 }else if(!track.children.length){const e=document.createElement('div');e.className='hmp-trend-empty';e.textContent='قريبًا ستظهر هنا المنتجات والعروض الرائجة بمجرد نشر الموردين لمنتجاتهم.';track.append(e)}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-hmp-scroll]');if(b){const t=$('#hmp-trend-track');if(t)t.scrollBy({left:Number(b.dataset.hmpScroll)*320,behavior:'smooth'})}});
const root=$('#hmp-root');if(root){const mo=new MutationObserver(()=>polishMarket());['#hmp-grid','#hmp-cats'].forEach(s=>{const el=$(s);if(el)mo.observe(el,{childList:true,subtree:true})});polishMarket();}
function welcome(){
 const chat=$('#chat'),body=$('#cB');if(!chat||!body||chat.hidden||body.children.length)return;
 const box=document.createElement('div');box.className='hz-ai-welcome';box.innerHTML='<strong>أهلاً بيك في مساعد Horizon ✦</strong><p>قولّي بتدور على إيه، وأنا أساعدك توصل للقسم أو المنتج أو الخدمة المناسبة.</p><div class="hz-ai-prompts"><button type="button">عايز أشتري منتج</button><button type="button">بدور على مورد موثوق</button><button type="button">عايز أقارن عروض أسعار</button><button type="button">عايز أضيف منتج أو خدمة</button></div>';body.append(box);
 box.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{const input=$('#cIn');if(input){input.value=btn.textContent;$('#cGo')?.click()}}));
}
const chat=$('#chat'),body=$('#cB');if(chat&&body){new MutationObserver(()=>{if(!chat.hidden)welcome()}).observe(chat,{attributes:true,attributeFilter:['hidden','class']});}
})();
