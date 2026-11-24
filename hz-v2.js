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
#v2o input,#v2o select,#v2o textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit;margin:4px 0 8px}
#v2o .v2sub{width:100%;padding:11px;border:0;border-radius:999px;background:var(--p);color:#fff;font:inherit;font-weight:700;cursor:pointer}#v2o .v2sub:disabled{opacity:.5}
.v2m{min-height:1.5em;color:var(--mut);font-size:14px;margin:0 0 8px}
.v2c{padding:12px;border:1px dashed var(--line);border-radius:12px;margin:8px 0;color:var(--mut);font-size:14px}.v2c b{display:block;color:var(--ink)}
#cIn{font-size:16px}
#v2ch{display:flex;gap:6px;overflow-x:auto;padding:6px 10px;scrollbar-width:none}
#v2ch button{flex:none;white-space:nowrap;padding:7px 13px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--ink);font:inherit;font-size:13px;cursor:pointer;transition:background .15s,transform .15s}
#v2ch button:hover{background:var(--bg)}#v2ch button:active{transform:scale(.97)}
.v2rp{flex:none;background:none;border:0;color:var(--mut);cursor:pointer;min-width:36px;min-height:36px;font-size:16px;border-radius:8px}.v2rp:hover{background:var(--bg)}
@keyframes v2f{from{opacity:0}}@keyframes v2u{from{transform:translateY(24px);opacity:0}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
#hzV2{padding:8px 16px 4px;max-width:960px;margin:0 auto}
#hzV2[hidden]{display:none}
#hzV2 .h{text-align:center;padding:14px 0 6px}
#hzV2 h2{margin:0 0 6px;font-size:clamp(22px,5.5vw,32px);line-height:1.3}
#hzV2 .h p{margin:0 auto 12px;max-width:520px;color:var(--mut)}
#hzV2 .two{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
#hzV2 .two button{min-width:170px;padding:11px 18px;border-radius:999px;border:1.5px solid var(--p);background:transparent;color:var(--p);font:inherit;font-weight:700;cursor:pointer;transition:background .15s,color .15s,transform .15s}
#hzV2 .two button:hover{background:var(--p);color:#fff}#hzV2 .two button:active{transform:scale(.97)}
#hzV2 .d{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}
#hzV2 .d button{display:flex;flex-direction:column;gap:4px;align-items:flex-start;text-align:start;padding:14px;border:1px solid var(--line);border-radius:16px;background:var(--card);color:var(--ink);font:inherit;cursor:pointer;transition:transform .15s,box-shadow .15s}
#hzV2 .d button:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.08)}
#hzV2 .d b{font-size:15px}#hzV2 .d small{color:var(--mut);line-height:1.5}#hzV2 .d i{font-style:normal;font-size:22px}
#hzV2 .e{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
#hzV2 .e div{padding:14px;border:1px dashed var(--line);border-radius:16px;color:var(--mut);font-size:14px;line-height:1.6}
#hzV2 .e b{display:block;color:var(--ink);margin-bottom:2px}
@media(max-width:560px){#hzV2 .d{grid-template-columns:1fr}#hzV2 .e{grid-template-columns:1fr}#hzV2 .d button{flex-direction:row;align-items:center;gap:10px}#hzV2 .d button span{display:flex;flex-direction:column}}
`;
document.head.appendChild(s);
const K=[['terms','Terms & Conditions','الشروط والأحكام','Nutzungsbedingungen'],['privacy','Privacy Policy','سياسة الخصوصية','Datenschutz'],['contact','Contact','تواصل معانا','Kontakt'],['trust','Verification & trust','التوثيق والثقة','Verifizierung & Vertrauen'],['activity','My activity','نشاطي','Meine Aktivität'],['report','Report a problem','بلّغ عن مشكلة','Problem melden']];
const NC=()=>T('This content is not set up yet. It must be completed with the business\u2019s real legal details before launch.','المحتوى ده لسه ماتضافش. لازم يتكمّل ببيانات الشركة القانونية الحقيقية قبل الإطلاق.','Dieser Inhalt ist noch nicht eingerichtet. Er muss vor dem Start mit den echten rechtlichen Angaben ergänzt werden.');
function body(k){
 if(k==='report')return`<form id="v2r"><label>${T('What are you reporting?','بتبلّغ عن إيه؟','Was meldest du?')}<select name="t"><option value="listing">${T('A listing','إعلان','Ein Angebot')}</option><option value="provider">${T('A provider or user','مقدم خدمة أو مستخدم','Anbieter oder Nutzer')}</option><option value="other">${T('Something else','حاجة تانية','Etwas anderes')}</option></select></label><label>${T('Listing title or provider name','عنوان الإعلان أو اسم مقدم الخدمة','Titel des Angebots oder Name des Anbieters')}<input name="r" maxlength="120"></label><label>${T('What happened?','إيه اللي حصل؟','Was ist passiert?')}<textarea name="d" rows="4" maxlength="800" required></textarea></label><p class="v2m" role="status"></p><button class="v2sub">${T('Send report','ابعت البلاغ','Meldung senden')}</button></form>`;
 if(k==='activity'){const a=[['Orders','الطلبات','Bestellungen','Your orders will appear here once you start making requests.','طلباتك هتظهر هنا أول ما تبدأ تبعت طلبات.','Deine Bestellungen erscheinen hier, sobald du Anfragen stellst.'],['Saved items','المحفوظات','Gespeichert','Save the things you love and find them here.','احفظ اللي عجبك وهتلاقيه هنا.','Speichere, was dir gefällt, und finde es hier.'],['Recently viewed','شوهد مؤخراً','Zuletzt angesehen','Items you open will appear here.','اللي بتفتحه هيظهر هنا.','Angesehene Artikel erscheinen hier.'],['Request history','سجل الطلبات','Anfrageverlauf','Your custom requests will appear here.','طلباتك الخاصة هتظهر هنا.','Deine individuellen Anfragen erscheinen hier.']];
  return a.map(x=>`<div class="v2c"><b>${T(x[0],x[1],x[2])}</b>${T(x[3],x[4],x[5])}</div>`).join('')+`<p class="v2n">${T('Messages and notifications are in your profile. These lists need account activity to fill them; nothing is shown until it is real.','الرسائل والإشعارات في بروفايلك. القوايم دي بتتملي من نشاط حسابك، ومفيش حاجة بتظهر غير لما تبقى حقيقية.','Nachrichten und Benachrichtigungen findest du in deinem Profil. Diese Listen füllen sich erst mit echter Aktivität.')}</p>`}
 if(k!=='trust')return`<p class="v2n">${NC()}</p>`;
 const st=[['Not verified','لسه ماتوثّقش','Nicht verifiziert'],['Verification pending','التوثيق قيد المراجعة','Prüfung läuft'],['Identity verified','الهوية موثّقة','Identität verifiziert'],['Business verified','النشاط التجاري موثّق','Unternehmen verifiziert'],['Professional license verified','الترخيص المهني موثّق','Berufslizenz verifiziert']];
 const ro=[['Individual seller','بائع فرد','Privatverkäufer'],['Business / store','نشاط تجاري / محل','Unternehmen / Shop'],['Professional service provider','مقدم خدمة محترف','Professioneller Dienstleister']];
 return`<h4>${T('Account types','أنواع الحسابات','Kontotypen')}</h4><ul>${ro.map(x=>`<li>${T(x[0],x[1],x[2])}</li>`).join('')}</ul><h4>${T('Verification states','حالات التوثيق','Verifizierungsstatus')}</h4><ul>${st.map(x=>`<li>${T(x[0],x[1],x[2])}</li>`).join('')}</ul><p>${T('A verified badge appears only after the matching review is actually completed.','علامة التوثيق بتظهر بس بعد ما المراجعة المناسبة تتم فعلاً.','Ein Verifizierungs-Badge erscheint erst, wenn die jeweilige Prüfung wirklich abgeschlossen ist.')}</p>`}
function sheet(k,pre){const m=K.find(x=>x[0]===k);if(!m)return;shut();const o=document.createElement('div');o.id='v2o';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 o.innerHTML=`<div><button type="button" class="x" aria-label="Close">×</button><h3>${T(m[1],m[2],m[3])}</h3>${body(k)}</div>`;document.body.appendChild(o);if(pre){const f=o.querySelector('#v2r');if(f){f.t.value='listing';f.r.value=pre}}o.querySelector('.x').focus()}
function shut(){const o=document.getElementById('v2o');if(o)o.remove()}
function ft(){const c=document.querySelector('.cta');if(!c)return;let f=document.getElementById('hzFt');if(!f){f=document.createElement('footer');f.id='hzFt';c.after(f)}
 if(f.dataset.l===LG())return;f.dataset.l=LG();f.innerHTML=K.map(k=>`<button type="button" data-v2="${k[0]}">${T(k[1],k[2],k[3])}</button>`).join('')+'<p>Horizon · On the horizon.. No limits</p>'}
function emp(){const e=document.getElementById('empty');if(!e)return;let n=e.nextElementSibling;
 if(!n||!n.classList.contains('v2s')){n=document.createElement('div');n.className='v2s';n.innerHTML='<button type="button" data-item="Custom request"></button>';e.after(n)}
 n.firstChild.textContent=T('Send a custom request','ابعت طلب خاص','Individuelle Anfrage senden')}

let CNT=null;
async function load(){if(CNT)return;CNT={l:null,p:null};
 try{const a=await sb.from('hz_listings').select('id',{count:'exact',head:true}).eq('status','approved');if(!a.error)CNT.l=a.count}catch(_){}
 try{const b=await sb.from('hz_providers').select('user_id',{count:'exact',head:true});if(!b.error)CNT.p=b.count}catch(_){}
 q()}
const DST=[['products','📦','Products','منتجات','Produkte','Furniture, UPVC, glass and more','موبيليا وUPVC وزجاج وغيرهم','Möbel, UPVC, Glas und mehr'],['services','🛠️','Services','خدمات','Services','Skilled professionals for the job','فنيين ومحترفين للشغلانة','Fachleute für jede Aufgabe'],['consulting','💡','Consulting','استشارات','Beratung','Expert advice before you decide','رأي خبير قبل ما تقرر','Expertenrat vor der Entscheidung']];
const EM=[['l','🔥','Trending now','رائج الآن','Im Trend','Discover something new. Trending items will appear here as our marketplace grows.','اكتشف حاجة جديدة. الرائج هيظهر هنا مع نمو السوق.','Entdecke Neues. Trends erscheinen hier, sobald der Markt wächst.'],['l','🆕','Recently added','أُضيف حديثاً','Neu hinzugefügt','New listings will appear here as soon as they are published.','الإعلانات الجديدة هتظهر هنا أول ما تتنشر.','Neue Angebote erscheinen hier, sobald sie veröffentlicht sind.'],['p','🤝','Featured providers','مقدمو خدمة مميزون','Ausgewählte Anbieter','Verified providers will be featured here as they join.','مقدمي الخدمة الموثّقين هيظهروا هنا لما ينضموا.','Verifizierte Anbieter werden hier vorgestellt, sobald sie beitreten.'],['l','✨','Recommended for you','مقترح ليك','Empfohlen für dich','Recommendations will appear here once there is activity to base them on.','الاقتراحات هتظهر هنا لما يبقى فيه نشاط نبني عليه.','Empfehlungen erscheinen hier, sobald es Aktivität gibt.']];
const PR=[['I need a UPVC window','عايز شباك UPVC','Ich brauche ein UPVC-Fenster'],['Show me bedroom sets','وريني غرف نوم','Zeig mir Schlafzimmer'],['I need a consultation','محتاج استشارة','Ich brauche eine Beratung']];
function chips(){const c=document.getElementById('cB'),i=document.getElementById('cIn');if(!c||!i)return;const fm=i.closest('form');if(!fm)return;let h=document.getElementById('v2ch');
 if(!h){h=document.createElement('div');h.id='v2ch';fm.before(h)}
 const st=c.querySelector('.m')?'1':'0',k=LG()+st;if(h.dataset.k===k)return;h.dataset.k=k;
 h.innerHTML=(st==='0'?PR.map((x,n)=>`<button type="button" data-v2p="${n}">${T(x[0],x[1],x[2])}</button>`).join(''):'')+`<button type="button" data-item="Custom request">${T('Send a custom request','ابعت طلب خاص','Individuelle Anfrage senden')}</button>`}
function rps(){document.querySelectorAll('article.post:not([data-v2])').forEach(a=>{a.dataset.v2=1;const m=a.querySelector('[data-msg]'),pb=a.querySelector('.pb');if(!m||!pb)return;const b=document.createElement('button');b.type='button';b.className='v2rp';b.dataset.v2rl=m.dataset.msg;b.dataset.t=((a.querySelector('h3')||{}).textContent||'').slice(0,80);b.textContent='\u2691';pb.append(b)});
 document.querySelectorAll('.v2rp').forEach(b=>{const t=T('Report this listing','بلّغ عن الإعلان ده','Dieses Angebot melden');b.title=t;b.setAttribute('aria-label',t)})}
function ask(){const f=document.getElementById('fab');try{if(f)f.click()}catch(_){}setTimeout(()=>{const a=document.getElementById('ai');if(!a||a.hidden){const i=document.getElementById('q');if(i)i.focus()}},200)}
function hero(){const home=(typeof cat==='undefined'||cat==='all')&&!document.body.classList.contains('hzo');let h=document.getElementById('hzV2');
 if(!h){const a=document.getElementById('trendw')||document.getElementById('grid');if(!a)return;h=document.createElement('section');h.id='hzV2';a.before(h)}
 h.hidden=!home;if(!home)return;if(!CNT)load();
 const k=LG()+'|'+(CNT?CNT.l+'|'+CNT.p:'');if(h.dataset.k===k)return;h.dataset.k=k;
 const em=CNT?EM.filter(x=>CNT[x[0]]===0):[];
 h.innerHTML=`<div class="h"><h2>${T('Everything you need. One global marketplace.','كل اللي محتاجه. في سوق عالمي واحد.','Alles, was du brauchst. Ein globaler Markt.')}</h2><p>${T('Browse the marketplace yourself, or just tell Horizon AI what you are looking for.','اتصفح السوق بنفسك، أو قول لمساعد Horizon عايز إيه.','Stöbere selbst im Markt oder sag Horizon AI, was du suchst.')}</p><div class="two"><button type="button" data-v2h="x">${T('Explore the marketplace','تصفح السوق','Markt erkunden')}</button><button type="button" data-v2h="a">${T('Ask Horizon AI','اسأل مساعد Horizon','Horizon AI fragen')}</button></div></div>`
 +`<div class="d">${DST.map(d=>`<button type="button" data-v2t="${d[0]}"><i>${d[1]}</i><span><b>${T(d[2],d[3],d[4])}</b><small>${T(d[5],d[6],d[7])}</small></span></button>`).join('')}</div>`
 +(em.length?`<div class="e">${em.map(x=>`<div><b>${x[1]} ${T(x[2],x[3],x[4])}</b>${T(x[5],x[6],x[7])}</div>`).join('')}</div>`:'')}
let raf=0;const run=()=>{raf=0;try{ft();emp();hero();chips();rps()}catch(_){}};
const q=()=>{if(!raf)raf=requestAnimationFrame(run)};
new MutationObserver(q).observe(document.body,{childList:true,subtree:true});
new MutationObserver(q).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.addEventListener('click',e=>{const rl=e.target.closest('[data-v2rl]');if(rl){sheet('report',rl.dataset.t+' (#'+rl.dataset.v2rl+')');return}
 const pp=e.target.closest('[data-v2p]');if(pp){const x=PR[+pp.dataset.v2p],i=document.getElementById('cIn');if(i&&typeof askAI==='function'){i.value=T(x[0],x[1],x[2]);askAI(null,true)}return}
 const t=e.target.closest('[data-v2t]');if(t){const b=document.querySelector('[data-tb="'+t.dataset.v2t+'"]');if(b)b.click();return}const h=e.target.closest('[data-v2h]');if(h){if(h.dataset.v2h==='a')ask();else{const b=document.querySelector('[data-tb="products"]');if(b)b.click()}return}
 const b=e.target.closest('[data-v2]');if(b){sheet(b.dataset.v2);return}
 if(e.target.id==='v2o'||e.target.closest('#v2o .x'))shut()});
document.addEventListener('submit',async e=>{const f=e.target;if(f.id!=='v2r')return;e.preventDefault();const m=f.querySelector('.v2m'),b=f.querySelector('.v2sub');
 if(typeof user==='undefined'||!user){m.textContent=T('Please sign in first to send a report.','سجّل دخول الأول عشان تبعت بلاغ.','Bitte melde dich zuerst an.');return}
 b.disabled=true;m.textContent=T('Sending…','بيتبعت…','Wird gesendet…');
 try{const nm=(typeof PROF!=='undefined'&&PROF&&PROF.full_name)||user.email||'';const x=await sb.from('hz_feedback').insert({user_id:user.id,user_email:user.email||user.phone,user_name:nm,kind:'complaint',body:'[REPORT:'+f.t.value+'] '+f.r.value+' — '+f.d.value});if(x.error)throw x.error;
  m.textContent=T('Thank you. Your report was received and will be reviewed.','شكراً. البلاغ وصلنا وهيتراجع.','Danke. Deine Meldung ist eingegangen und wird geprüft.');f.reset()}
 catch(_){m.textContent=T('Could not send. Please try again.','ماتبعتش. جرّب تاني.','Senden fehlgeschlagen. Bitte erneut versuchen.')}
 b.disabled=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
q();
})();
