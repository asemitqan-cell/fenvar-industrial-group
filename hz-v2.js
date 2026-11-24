/* Horizon V2 layer: حالات "مفيش بيانات" محترمة، روابط الثقة والقانون، تركيز وحركة آمنة، ترجمة ألماني. من غير بيانات وهمية. */
(function(){'use strict';
const T=(en,ar,de)=>typeof L==='function'?L(en,ar,de):ar;
const LG=()=>typeof lang!=='undefined'?lang:'';
try{if(typeof DE==='object')Object.assign(DE,{'Consulting':'Beratung','Products':'Produkte','Culture & community':'Kultur & Community','Available now':'Jetzt verfügbar'})}catch(_){}
const s=document.createElement('style');s.textContent=`
:focus-visible{outline:2px solid var(--p);outline-offset:2px;border-radius:8px}
button,.btn{min-height:40px}
.empty{display:block;text-align:center;padding:26px 18px;margin:12px 0;border:1px dashed var(--line);border-radius:18px;color:var(--mut);line-height:1.8}
.empty[hidden]{display:none}
.empty::before{content:'✦';display:block;font-size:26px;color:var(--p);margin-bottom:4px}
.v2s{grid-column:1/-1;text-align:center;margin-bottom:12px}
.empty[hidden]+.v2s{display:none}
.v2s button{padding:10px 20px;border:0;border-radius:999px;background:var(--p);color:#fff;font:inherit;font-weight:700;cursor:pointer;transition:transform .15s,opacity .15s}
.v2s button:active{transform:scale(.97)}.v2s button:disabled{opacity:.5}
#hzFt{padding:22px 16px calc(96px + env(safe-area-inset-bottom));text-align:center;font-size:13px;color:var(--mut)}
#hzFt button{background:none;border:0;color:var(--mut);font:inherit;padding:8px 10px;text-decoration:underline;cursor:pointer}
#hzFt p{margin:8px 0 0}
#v2o{position:fixed;inset:0;z-index:9999;display:grid;place-items:end center;background:rgba(0,0,0,.45);animation:v2f .18s ease}
#v2o>div{width:100%;max-width:560px;max-height:85vh;overflow:auto;background:var(--card);color:var(--ink);border-radius:22px 22px 0 0;padding:20px 20px calc(24px + env(safe-area-inset-bottom));animation:v2u .22s ease;line-height:1.8}
#v2o h3{margin:0 0 10px}#v2o ul{padding-inline-start:20px;margin:8px 0}
#v2o .x{float:inline-end;background:none;border:0;font-size:22px;color:var(--mut);cursor:pointer}
.v2n{padding:10px 12px;border:1px dashed var(--line);border-radius:12px;color:var(--mut);font-size:14px}
@keyframes v2f{from{opacity:0}}@keyframes v2u{from{transform:translateY(24px);opacity:0}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}`;
document.head.appendChild(s);
const K=[['terms','Terms & Conditions','الشروط والأحكام','Nutzungsbedingungen'],['privacy','Privacy Policy','سياسة الخصوصية','Datenschutz'],['contact','Contact','تواصل معانا','Kontakt'],['trust','Verification & trust','التوثيق والثقة','Verifizierung & Vertrauen']];
const NC=()=>T('This content is not set up yet. It must be completed with the business\u2019s real legal details before launch.','المحتوى ده لسه ماتضافش. لازم يتكمّل ببيانات الشركة القانونية الحقيقية قبل الإطلاق.','Dieser Inhalt ist noch nicht eingerichtet. Er muss vor dem Start mit den echten rechtlichen Angaben ergänzt werden.');
function body(k){if(k!=='trust')return`<p class="v2n">${NC()}</p>`;
 const st=[['Not verified','لسه ماتوثّقش','Nicht verifiziert'],['Verification pending','التوثيق قيد المراجعة','Prüfung läuft'],['Identity verified','الهوية موثّقة','Identität verifiziert'],['Business verified','النشاط التجاري موثّق','Unternehmen verifiziert'],['Professional license verified','الترخيص المهني موثّق','Berufslizenz verifiziert']];
 return`<ul>${st.map(x=>`<li>${T(x[0],x[1],x[2])}</li>`).join('')}</ul><p>${T('A verified badge appears only after the matching review is actually completed.','علامة التوثيق بتظهر بس بعد ما المراجعة المناسبة تتم فعلاً.','Ein Verifizierungs-Badge erscheint erst, wenn die jeweilige Prüfung wirklich abgeschlossen ist.')}</p>`}
function sheet(k){const m=K.find(x=>x[0]===k);if(!m)return;shut();const o=document.createElement('div');o.id='v2o';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 o.innerHTML=`<div><button type="button" class="x" aria-label="Close">×</button><h3>${T(m[1],m[2],m[3])}</h3>${body(k)}</div>`;document.body.appendChild(o);o.querySelector('.x').focus()}
function shut(){const o=document.getElementById('v2o');if(o)o.remove()}
function ft(){const c=document.querySelector('.cta');if(!c)return;let f=document.getElementById('hzFt');if(!f){f=document.createElement('footer');f.id='hzFt';c.after(f)}
 if(f.dataset.l===LG())return;f.dataset.l=LG();f.innerHTML=K.map(k=>`<button type="button" data-v2="${k[0]}">${T(k[1],k[2],k[3])}</button>`).join('')+'<p>Horizon · On the horizon.. No limits</p>'}
function emp(){const e=document.getElementById('empty');if(!e)return;let n=e.nextElementSibling;
 if(!n||!n.classList.contains('v2s')){n=document.createElement('div');n.className='v2s';n.innerHTML='<button type="button" data-item="Custom request"></button>';e.after(n)}
 n.firstChild.textContent=T('Send a custom request','ابعت طلب خاص','Individuelle Anfrage senden')}
let raf=0;const run=()=>{raf=0;try{ft();emp()}catch(_){}};
const q=()=>{if(!raf)raf=requestAnimationFrame(run)};
new MutationObserver(q).observe(document.body,{childList:true,subtree:true});
new MutationObserver(q).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.addEventListener('click',e=>{const b=e.target.closest('[data-v2]');if(b){sheet(b.dataset.v2);return}
 if(e.target.id==='v2o'||e.target.closest('#v2o .x'))shut()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
q();
})();
