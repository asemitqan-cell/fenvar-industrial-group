/* Horizon Atelier: enrich the existing presentation with real category reference photography.
   It never creates listings, prices, ratings, sellers or marketplace records. */
(function(){
 'use strict';
 const photos={
  home:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88',
  products:'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85',
  furniture:'https://images.unsplash.com/photo-1721134111286-b3c4a5772ea9?auto=format&fit=crop&w=1200&q=85',
  wood:'https://www.tartakiskra.pl/images/design/box-debowa.webp',
  glass:'https://www.newspacehospitality.com/pic/big/Flexible-layout-bathroom-glass-partition-1642_0.jpg',
  upvc:'https://www.help2buyscheme.co.uk/assets/images/guides/style-casement-white.webp',
  services:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  consulting:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85'
 };
 function image(url,alt){const im=document.createElement('img');im.src=url;im.alt=alt||'';im.loading='lazy';im.decoding='async';return im}
 function enrich(){
  const hero=document.querySelector('.hero');
  if(hero){hero.dataset.hzAtelier='1';hero.style.setProperty('--hz-hero-photo','url("'+photos.home+'")')}
  document.querySelectorAll('.card .thumb').forEach(t=>{
   if(t.querySelector('img'))return;
   const card=t.closest('.card');if(!card)return;
   const s=(card.innerText||'').toLowerCase();
   let url='';
   if(/upvc|شباك|شبابيك|قطاع|باب|شتر/.test(s))url=photos.upvc;
   else if(/زجاج|glass|سيكوريت/.test(s))url=photos.glass;
   else if(/أثاث|موبيليا|كنب|سفرة|دولاب|مطبخ|furniture/.test(s))url=photos.furniture;
   else if(/خشب|wood|نجارة/.test(s))url=photos.wood;
   else if(/استشارة|consult|مكتب|خدمة|service/.test(s))url=photos.services;
   else if(/منتج|product|إلكترونيات|جهاز/.test(s))url=photos.products;
   if(!url)return;
   t.replaceChildren(image(url,'صورة مرجعية توضيحية للفئة'));
   t.dataset.hzReferencePhoto='1';
  });
 }
 let scheduled=false;
 function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;try{enrich()}catch(e){}})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
 const mo=new MutationObserver(queue);mo.observe(document.body,{childList:true,subtree:true});
 window.addEventListener('load',queue,{once:true});
})();
