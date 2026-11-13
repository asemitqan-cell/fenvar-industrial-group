/* Horizon: تقسيم الفئات (منتجات / خدمات / ثقافة ومجتمع) + أقسام جديدة + "رائج في ..." جوه كل قسم + ثقافات بلاد.
   ملف مستقل بيتحمّل بعد quote.js ومابيعدّلش في index.html غير بإضافة سطر التحميل. */
(function(){
'use strict';
const $q=s=>document.querySelector(s);
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sp=s=>s.split(',').map(x=>x.split(':'));

/* ---------- 1) أقسام جديدة ---------- */
const add=o=>{if(!CATALOG.some(c=>c.id===o.id))CATALOG.push(o)};
add({id:'iron',en:'Iron & Metalwork',ar:'حديد وحدادة',e:'🔩',c:['#475569','#0F172A'],list:[['Rebar','حديد تسليح'],['Doors & gates','أبواب وبوابات حديد'],['Stairs & railings','سلالم ودرابزين'],['Hangars & sheds','هناجر وشيدات'],['Beams & sheets','كمرات وصاج']]});
add({id:'bride',en:'Bridal Trousseau',ar:'تجهيز العرائس',e:'💍',c:['#DB2777','#9D174D'],list:[['Furnishings & bedding','مفروشات وبياضات'],['Curtains','ستائر'],['Dinnerware & china','صيني وأطقم سفرة'],['Pots & cookware','حلل وأواني طبخ'],['Small appliances','أجهزة كهربائية صغيرة'],['Carpets & rugs','سجاد ومفارش'],['Gifts & accessories','هدايا وإكسسوارات العروسة']]});
add({id:'travel',en:'Travel & Trips',ar:'سفريات ورحلات',e:'🧳',c:['#0EA5E9','#1D4ED8'],list:[['Umrah','عمرة'],['Hajj','حج'],['Domestic trips','رحلات داخلية'],['Organized trips abroad','رحلات خارجية منظمة'],['Summer resorts','مصايف'],['One-day trips','رحلات اليوم الواحد']]});
add({id:'topup',en:'Recharge & Plans',ar:'شحن وباقات',e:'📶',c:['#F59E0B','#B45309'],list:[['Mobile plans renewal','تجديد باقات الموبايل'],['Credit top-up','شحن رصيد'],['Home internet (Wi-Fi) renewal','تجديد الإنترنت المنزلي (Wi-Fi)'],['Landline top-up','شحن الخط الأرضي'],['Utility bills','فواتير الخدمات']]});
add({id:'countries',en:'World Cultures',ar:'ثقافات بلاد',e:'🌍',c:['#0D9488','#115E59'],list:[]});

/* ---------- 2) فئات رئيسية جديدة ---------- */
const svc=CATALOG.find(c=>c.id==='services');if(svc){svc.ar='تركيب وتصميم';svc.en='Installation & design'}
add({id:'g_products',en:'Products',ar:'منتجات',e:'🛍️',c:['#0F766E','#155E75'],list:[],grp:['finishing','realestate','cars','tech','bride','perfumes','food','livestock','used','offers']});
add({id:'g_services',en:'Services',ar:'خدمات',e:'🛠️',c:['#F59E0B','#B45309'],list:[],grp:['health','sports','travel','topup','events','consulting','translation','services','learning']});
add({id:'g_culture',en:'Culture & community',ar:'ثقافة ومجتمع',e:'🌍',c:['#7C3AED','#4C1D95'],list:[],grp:['religion','countries','news','kids']});
const fin=CATALOG.find(c=>c.id==='finishing');if(fin)fin.grp=['furniture','wood','glass','upvc','iron'];
['autoprop','healthsport','learnx'].forEach(id=>{const i=CATALOG.findIndex(c=>c.id===id);if(i>=0)CATALOG.splice(i,1)});
const TOP=['g_products','g_services','g_culture'];
CATALOG.forEach(c=>{if(TOP.includes(c.id))delete c.sub;else c.sub=1});
CATALOG.sort((a,b)=>{const x=TOP.indexOf(a.id),y=TOP.indexOf(b.id);return(x<0?99:x)-(y<0?99:y)});
Object.assign(IC,{
 g_products:'<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
 g_services:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
 g_culture:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 countries:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 iron:'<path d="M4 20 20 4M7 20h13V7"/>',
 bride:'<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
 travel:'<path d="M10.5 13.5 3 11l1-2 8 1 5-5a2 2 0 0 1 3 3l-5 5 1 8-2 1-2.5-7.5z"/>',
 topup:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'});
/* كلمات الـAI بتوجّه للأقسام الجديدة */
try{Object.assign(RT,{travel:'عمرة حج رحلة رحلات سفر مصيف مصايف umrah hajj trip',bride:'عروسة عرائس جهاز العروسة مفروشات ستائر ستاير صيني حلل',topup:'شحن رصيد باقة باقات واي فاي wifi خط ارضي فاتورة',countries:'ثقافة ثقافات كوريا فرنسا اليابان تركيا المانيا اسبانيا الصين اوروبا',iron:'حديد حدادة درابزين بوابة هنجر'})}catch(_){}
/* إمكانية النشر في الأقسام الجديدة */
try{
 CAT_FOR.product.push('bride','iron','electronics','appliances');
 CAT_FOR.service.push('travel','topup','sports');
 FORMS.product=FORMS.product||{};FORMS.service=FORMS.service||{};
 FORMS.product.bride=[['kind','Type','النوع','s',sp('Furnishings:مفروشات,Curtains:ستائر,Dinnerware:صيني وأطقم سفرة,Cookware:حلل وأواني,Appliances:أجهزة,Other:أخرى')],['cond','Condition','الحالة','s',CND]];
 FORMS.product.iron=[['kind','Type','النوع','s',sp('Rebar:حديد تسليح,Doors & gates:أبواب وبوابات,Stairs & railings:سلالم ودرابزين,Sheds:هناجر وشيدات,Other:أخرى')],['size','Size','المقاس','t'],['cond','Condition','الحالة','s',CND]];
 FORMS.service.travel=[['kind','Trip type','نوع الرحلة','s',sp('Umrah:عمرة,Hajj:حج,Domestic:رحلة داخلية,Abroad:رحلة خارجية,Summer resort:مصيف,One day:رحلة يوم واحد')],['dest','Destination','الوجهة','t'],['days','Days','عدد الأيام','t']];
 FORMS.service.topup=[['kind','Service','الخدمة','s',sp('Mobile plan:باقة موبايل,Credit:شحن رصيد,Home internet:إنترنت منزلي,Landline:خط أرضي,Bills:فواتير')],['op','Operator','الشركة','t']];
}catch(_){}
try{renderChips();render()}catch(_){}

/* ---------- 3) ثقافات بلاد ---------- */
const CT_DATA=[
{id:'kr',f:'🇰🇷',ar:'كوريا الجنوبية',tag:'تقاليد عريقة وتكنولوجيا وموسيقى K-pop',cap:'سول',lang:'الكورية',cur:'الوون',best:'الربيع (أبريل-مايو) والخريف (سبتمبر-نوفمبر)',
 food:['كيمتشي: مخلل الملفوف الحار وبيكون على كل سفرة','بيبيمباب: أرز بالخضار واللحم والبيض','بولجوجي: لحم مشوي متبّل','توكبوكي: كعك الأرز بالصوص الحار','جيمباب: لفائف أرز بالطحالب','رامن كوري ودجاج مقرمش كوري'],
 sights:['قصر جيونجبوكجونج في سول','برج N سول','قرية بوكتشون هانوك التقليدية','جزيرة جيجو','مدينة بوسان وقرية جامتشون الملوّنة','معبد بولغوكسا في مدينة جيونجو'],
 culture:['احترام الكبار أساس التعامل، وبتقدّم أو تاخد الحاجة بإيدين الاتنين','خلع الحذاء قبل دخول البيوت وبعض المطاعم','الهانبوك هو الزي التقليدي','موسيقى K-pop والدراما الكورية من أهم صادراتها الثقافية','الأكل بيتشارك على السفرة'],
 tips:['المترو ممتاز في سول وبطاقة T-money بتسهّل المواصلات','الإنترنت سريع جدًا','حوالين المسجد المركزي في إيتايون في مطاعم حلال']},
{id:'fr',f:'🇫🇷',ar:'فرنسا',tag:'الفن والموضة والمطبخ الفرنسي',cap:'باريس',lang:'الفرنسية',cur:'اليورو',best:'الربيع والخريف (أبريل-يونيو وسبتمبر-أكتوبر)',
 food:['كرواسون وباجيت للفطار','كريب حلو ومالح','راتاتوي: خضار مطبوخة','كوك أو فان: دجاج بصلصة النبيذ','جبن بأنواع كتير جدًا','ماكرون وإكلير'],
 sights:['برج إيفل','متحف اللوفر','قصر فرساي','مون سان ميشيل','الريفييرا الفرنسية: نيس وكان','وادي اللوار وقصوره'],
 culture:['"بونجور" عند دخول أي محل جزء من الذوق العام','الوجبات طويلة وبتتاخد على مهل','الفن والموضة والعطور جزء من الهوية','الخبز والجبن أساسيين على السفرة'],
 tips:['احجز تذاكر المتاحف الكبيرة أونلاين','خد بالك من النشل في الأماكن المزدحمة','الأكل الحلال متوفر في أحياء كتير']},
{id:'it',f:'🇮🇹',ar:'إيطاليا',tag:'آثار وفن وأكل مشهور عالميًا',cap:'روما',lang:'الإيطالية',cur:'اليورو',best:'أبريل-يونيو وسبتمبر-أكتوبر',
 food:['بيتزا نابولي','باستا: كاربونارا وأرابياتا','لازانيا','ريزوتو','جيلاتو (آيس كريم إيطالي)','تيراميسو وإسبريسو'],
 sights:['الكولوسيوم والمنتدى الروماني','الفاتيكان','البندقية وقنواتها','فلورنسا','برج بيزا المائل','ساحل أمالفي','بحيرة كومو'],
 culture:['القهوة بتتشرب واقف على البار','الغدا والعشا لمّة عيلة','الفن والموسيقى الكلاسيك والموضة','كرة القدم شغف قومي'],
 tips:['القطارات السريعة بين المدن مريحة','الأماكن الدينية بتطلب لبس محتشم','تجنّب المطاعم القريبة جدًا من أشهر المعالم، أسعارها أعلى']},
{id:'jp',f:'🇯🇵',ar:'اليابان',tag:'النظام والنظافة والتقاليد مع تكنولوجيا متقدمة',cap:'طوكيو',lang:'اليابانية',cur:'الين',best:'الربيع (أزهار الكرز) والخريف',
 food:['سوشي وساشيمي','رامن','تمبورا: مقليات خفيفة','أوكونوميياكي وتاكوياكي','أونيجيري: كرات أرز','شاي ماتشا وحلوياته'],
 sights:['جبل فوجي','معابد كيوتو وحي جيون','شيبويا وأساكوسا في طوكيو','قلعة أوساكا','مدينة نارا وغزلانها','هيروشيما وجزيرة ميازيما'],
 culture:['الانحناء للتحية','الالتزام بالمواعيد والنظافة','الهدوء في المواصلات العامة','خلع الحذاء في البيوت والمطاعم التقليدية'],
 tips:['بطاقات المواصلات زي Suica بتسهّل التنقل','الدفع كاش لسه منتشر في أماكن كتير','الإكرامية مش معتادة']},
{id:'tr',f:'🇹🇷',ar:'تركيا',tag:'تاريخ وطبيعة وأكل قريب لذوقنا',cap:'أنقرة (وإسطنبول أكبر مدنها)',lang:'التركية',cur:'الليرة التركية',best:'أبريل-يونيو وسبتمبر-أكتوبر',
 food:['كباب بأنواعه','بقلاوة وكنافة','سيميت: كعك بالسمسم','مانتي: معجنات محشية باللحم','لحم بعجين','منمن: بيض بالطماطم','شاي وقهوة تركي'],
 sights:['آيا صوفيا والمسجد الأزرق','قصر توبكابي','مضيق البسفور','كابادوكيا ورحلات البالون','باموكالي','أنطاليا','مدينة أفسس الأثرية'],
 culture:['كرم الضيافة وتقديم الشاي','الأسواق التقليدية والمساومة في البازار','الحمّام التركي','الحياة الاجتماعية حوالين السفرة'],
 tips:['قارن الأسعار قبل الشراء في الأسواق السياحية','المواصلات في إسطنبول بتستخدم بطاقة Istanbulkart','الأكل الحلال متوفر بسهولة']},
{id:'de',f:'🇩🇪',ar:'ألمانيا',tag:'دقة وصناعة وتاريخ وقلاع',cap:'برلين',lang:'الألمانية',cur:'اليورو',best:'مايو-سبتمبر، وأسواق الكريسماس في ديسمبر',
 food:['بريتزل: خبز مجدول','شنيتزل','سجق براتفورست','كعكة الغابة السوداء','كرنب مخلل (ساوركراوت)','خبز الجاودار'],
 sights:['بوابة براندنبورغ في برلين','قلعة نويشفانشتاين','كاتدرائية كولونيا','الغابة السوداء','ميونخ وأوكتوبرفست','ميناء هامبورغ'],
 culture:['الالتزام بالمواعيد','فصل النفايات وإعادة التدوير بجدية','الصراحة في الكلام','الأحد إجازة ومعظم المحلات مقفولة'],
 tips:['الأحد المحلات مقفولة، جهّز مشترياتك قبلها','القطارات بين المدن متاحة وبتحتاج حجز مبكر للأسعار الأحسن','الدفع كاش لسه مهم في أماكن']},
{id:'es',f:'🇪🇸',ar:'إسبانيا',tag:'شمس وفلامنكو وإرث أندلسي',cap:'مدريد',lang:'الإسبانية',cur:'اليورو',best:'الربيع والخريف (الصيف حر جدًا في الجنوب)',
 food:['باييا','تورتيّا بالبطاطس','تاباس','خامون إيبيريكو','تشوروس بالشوكولاتة','جازباتشو: شوربة طماطم باردة'],
 sights:['ساجرادا فاميليا وبارك جويل في برشلونة','قصر الحمراء في غرناطة','مسجد-كاتدرائية قرطبة','إشبيلية','متحف البرادو في مدريد','جزر الكناري'],
 culture:['العشا متأخر، حوالي التاسعة أو العاشرة','الفلامنكو والمهرجانات','الحياة الاجتماعية في الشارع والساحات','الإرث الإسلامي في الأندلس واضح في المعمار'],
 tips:['مواعيد المحلات ممكن تقفل وقت الظهر في مدن كتير','احجز قصر الحمراء قبلها بوقت طويل','القطارات السريعة بتربط المدن الكبيرة']},
{id:'cn',f:'🇨🇳',ar:'الصين',tag:'حضارة قديمة ومدن عملاقة',cap:'بكين',lang:'الصينية (الماندرين)',cur:'اليوان',best:'الربيع والخريف',
 food:['بط بكين','دامبلينج','هوت بوت','دجاج كونج باو','ديم سم','نودلز مسحوبة باليد'],
 sights:['سور الصين العظيم','المدينة المحرمة في بكين','جيش الطين في شيان','واجهة البوند في شنغهاي','جبال تشانغجياجيه'],
 culture:['الشاي جزء أساسي من الضيافة','رأس السنة الصينية أهم الأعياد','الأكل بالعيدان والمائدة الدوّارة المشتركة','الاحترام والهدايا في التعامل'],
 tips:['الدفع بتطبيقات زي Alipay وWeChat Pay منتشر جدًا','بعض التطبيقات المعروفة (جوجل وواتساب مثلًا) مش بتشتغل عادي هناك','حمّل تطبيق ترجمة قبل السفر']},
{id:'eu',f:'🇪🇺',ar:'أوروبا (نظرة عامة)',tag:'دول كتير وثقافات متنوعة في قارة واحدة',cap:'—',lang:'لغات متعددة',cur:'اليورو في معظم دول الاتحاد (مش كلها)',best:'مايو-سبتمبر، وأسواق الكريسماس في ديسمبر',
 food:['إيطاليا: بيتزا وباستا','إسبانيا: باييا وتاباس','ألمانيا: سجق وبريتزل','فرنسا: خبز وجبن','هولندا: ستروب وافل وجبنة','المجر: جولاش'],
 sights:['باريس','روما','برشلونة','أمستردام','براغ','فيينا','سانتوريني في اليونان'],
 culture:['كل دولة ليها طابعها ولغتها وعاداتها','القطارات بتربط معظم الدول الكبيرة','تأشيرة شنغن بتغطي دول كتير، لكن الشروط بتتغيّر'],
 tips:['اتأكد من شروط التأشيرة من القنصلية أو الجهة الرسمية قبل ما تحجز','قارن بين القطارات والطيران الاقتصادي','احجز الأماكن الشهيرة بدري']}
];
const CT={v:null};
function ctList(){return `<div class="ct-root" style="grid-column:1/-1"><div class="ct-grid">${CT_DATA.map(c=>`<button type="button" class="ct-c" data-ct="${c.id}"><span class="ct-f">${c.f}</span><b>${E(c.ar)}</b><small>${E(c.tag)}</small></button>`).join('')}</div></div>`}
function ctDet(c){const sec=(t,a)=>`<div class="ct-s"><h4>${t}</h4><ul>${a.map(x=>`<li>${E(x)}</li>`).join('')}</ul></div>`;
 return `<div class="ct-root" style="grid-column:1/-1"><button type="button" class="pill" data-ctback>${lang==='ar'?'› ':'‹ '}${T('Back','رجوع')}</button>
 <h3 style="margin:10px 0 2px">${c.f} ${E(c.ar)}</h3><p class="ct-t">${E(c.tag)}</p>
 <div class="ct-facts"><span><small>العاصمة</small><b>${E(c.cap)}</b></span><span><small>اللغة</small><b>${E(c.lang)}</b></span><span><small>العملة</small><b>${E(c.cur)}</b></span><span><small>أنسب وقت للزيارة</small><b>${E(c.best)}</b></span></div>
 ${sec('🍽️ الأكل والأطباق المشهورة',c.food)}${sec('🏛️ معالم سياحية',c.sights)}${sec('🎎 ثقافة وعادات',c.culture)}${sec('💡 نصايح للزائر',c.tips)}
 <button type="button" class="btn" data-ctask="${c.id}">✦ ${T('Ask the assistant about','اسأل المساعد عن')} ${E(c.ar)}</button><p class="ct-n">المعلومات عامة ومختصرة، وشروط السفر والأسعار بتتغيّر؛ اتأكد منها من مصادر رسمية.</p></div>`}
function ctDraw(){const g=$q('#grid');if(!g)return;const c=CT_DATA.find(x=>x.id===CT.v);g.innerHTML=c?ctDet(c):ctList();const em=$q('#empty');if(em)em.hidden=true}

/* ---------- 4) رائج في القسم ---------- */
function topOf(id){let cur=id,n=0;while(n++<5){const p=CATALOG.find(x=>x.grp&&x.grp.includes(cur));if(!p)break;cur=p.id}return cur}
function slidesFor(c){
 const sl=(attrs,bg,inner,label,title)=>`<div class="sl${bg?' hasm':''}" ${attrs} style="background:${grad(c.c)}">${bg?`<div class="bgm">${bg}</div>`:''}${inner}<small>${label}</small><b>${title}</b></div>`;
 const lab=T('Trending in','رائج في')+' '+N(c);
 if(c.id==='countries')return CT_DATA.map(x=>sl(`data-ct="${x.id}"`,'',`<span style="font-size:42px;position:absolute;top:14px;inset-inline-end:16px;z-index:2">${x.f}</span>`,lab,E(x.ar)));
 if(c.grp)return c.grp.map(i=>CATALOG.find(x=>x.id===i)).filter(Boolean).map(x=>sl(`data-c="${x.id}"`,'',ico(x.id),lab,E(N(x))));
 const ids=[c.id];
 const ls=(typeof UL!=='undefined'?UL:[]).filter(l=>ids.includes(l.cat)&&(l.photos||[])[0]).slice(0,8);
 if(ls.length)return ls.map(l=>sl(`data-msg="${E(l.id)}"`,mediaEl(l.photos[0]),'',lab,E(l.title)));
 const out=[];
 (c.types||[]).forEach(ty=>{const p=(ty.photos||[])[0];out.push(sl(`data-qs2="${E(N(ty))}"`,p&&p.src?mediaEl(p.src):'',ico(c.id),lab,E(N(ty))))});
 (c.list||[]).forEach(x=>out.push(sl(`data-qs2="${E(T(x[0],x[1]))}"`,'',ico(c.id),lab,E(T(x[0],x[1])))));
 return out.slice(0,10)}
function post(){
 const q=($q('#q')||{}).value||'';const old=$q('#secTrend');
 const bad=!q.trim()&&typeof cat!=='undefined'&&cat!=='all'&&cat!=='fav'&&cat!=='religion'&&cat!=='kids';
 if(!bad||q.trim()){if(old)old.remove();return}
 const c=CATALOG.find(x=>x.id===cat);if(!c){if(old)old.remove();return}
 if(cat==='countries'){const g=$q('#grid');if(g&&!g.querySelector('.ct-root'))ctDraw()}
 const key=cat+'|'+(typeof UL!=='undefined'?UL.length:0)+'|'+lang;
 if(old&&old.dataset.k===key)return;if(old)old.remove();
 const s=slidesFor(c);if(!s.length)return;
 const h=document.createElement('section');h.className='trend';h.id='secTrend';h.dataset.k=key;
 h.innerHTML=`<h2>${T('Trending in','رائج في')} ${E(N(c))}</h2><div class="slides">${s.join('')}</div>`;
 const anchor=$q('#hzCb')||$q('#crumb');
 if(anchor&&anchor.nextSibling!==undefined&&anchor.parentNode===$q('#grid').parentNode)anchor.after(h);else $q('#grid').before(h)}
function chipsOn(){const top=typeof cat!=='undefined'?topOf(cat):'all';document.querySelectorAll('#chips .tile').forEach(b=>b.classList.toggle('on',b.dataset.c===top||(top==='all'&&b.dataset.c==='all'&&cat==='all')))}
function boot(){const g=$q('#grid');if(!g){setTimeout(boot,300);return}
 new MutationObserver(()=>{try{post();chipsOn()}catch(e){console.error(e)}}).observe(g,{childList:true});post();chipsOn()}
boot();

/* ---------- 5) تفاعل ---------- */
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-ct]');if(a){CT.v=a.dataset.ct;if(typeof cat!=='undefined'&&cat!=='countries'){goCat('countries');setTimeout(ctDraw,0)}else ctDraw();window.scrollTo({top:($q('#chips')||document.body).offsetTop-60,behavior:'smooth'});return}
 if(e.target.closest('[data-ctback]')){CT.v=null;ctDraw();return}
 const k=e.target.closest('[data-ctask]');if(k){const c=CT_DATA.find(x=>x.id===k.dataset.ctask);if(c&&typeof ask==='function')ask('احكيلي أكتر عن ثقافة '+c.ar+' والأكل والأماكن السياحية');return}
 const s=e.target.closest('[data-qs2]');if(s){const i=$q('#q');if(i){i.value=s.dataset.qs2;render()}}});
/* حركة الشرايح تلقائي في "رائج في القسم" */
let hold=0;['touchstart','mousedown','wheel','pointerdown'].forEach(ev=>document.addEventListener(ev,x=>{if(x.target.closest&&x.target.closest('#secTrend'))hold=Date.now()+7000},{passive:true}));
setInterval(()=>{if(Date.now()<hold||document.hidden)return;const el=document.querySelector('#secTrend .slides');if(!el)return;const s=el.querySelector('.sl');if(!s)return;
 const w=s.offsetWidth+10,max=el.scrollWidth-el.clientWidth;if(max<=8)return;const rtl=getComputedStyle(el).direction==='rtl',pos=Math.abs(el.scrollLeft);
 if(pos>=max-4)el.scrollTo({left:0,behavior:'smooth'});else el.scrollBy({left:(rtl?-1:1)*w,behavior:'smooth'})},3800);
const st=document.createElement('style');st.textContent=`
#secTrend{margin:6px 0 10px}
.ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ct-c{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:14px;text-align:start;display:grid;gap:4px;cursor:pointer;color:inherit}
.ct-c .ct-f{font-size:34px}.ct-c small{color:var(--mut);font-size:12px}
.ct-t{margin:0 0 10px;color:var(--mut)}
.ct-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.ct-facts span{border:1px solid var(--line);background:var(--card);border-radius:12px;padding:8px 10px;display:grid;gap:2px}.ct-facts small{color:var(--mut);font-size:11px}.ct-facts b{font-size:13px}
.ct-s{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:10px 14px;margin:8px 0}.ct-s h4{margin:0 0 6px}.ct-s ul{margin:0;padding-inline-start:18px;display:grid;gap:4px}
.ct-n{font-size:12px;color:var(--mut)}`;document.head.appendChild(st);
})();

/* ---------- 6) ديني: الأذكار وأقسام المعلومات كأيقونات + قصص الأنبياء ---------- */
(function(){
'use strict';
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const W=c=>`<div class="rl">${c}</div>`;
const back=t=>`<button type="button" class="pill" data-rel="${t}" style="margin-bottom:12px">${L('← Back','← رجوع')}</button>`;
const tile=(v,ic,t,sub,a,b,i,cls)=>`<button type="button" class="rt-t ${cls||''}" data-rel="${v}" style="--a:${a};--b:${b};--i:${i}"><span class="rt-i">${ic}</span><span class="rt-x"><b>${E(t)}</b>${sub?`<small>${E(sub)}</small>`:''}</span></button>`;
const head=(ic,t,a,b,sub)=>`<div class="rt-hd" style="--a:${a};--b:${b}"><span class="rt-i">${ic}</span><div><h3>${E(t)}</h3>${sub?`<small id="zpT">${E(sub)}</small>`:''}</div></div>`;

/* ===== الأذكار ===== */
const dayset=m=>{const w=m?'أَصْبَحْنَا وَأَصْبَحَ':'أَمْسَيْنَا وَأَمْسَى';return[
 ['آية الكرسي',AZ[0][1],1],['سورة الإخلاص',AZ[1][1],3],['سورة الفلق',AZ[2][1],3],['سورة الناس',AZ[3][1],3],
 [m?'أصبحنا':'أمسينا',w+' الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',1],
 ['اللهم بك',m?'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ':'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',1],
 ['سيد الاستغفار','اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',1],
 ['الرضا','رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ نَبِيًّا',3],
 ['العافية','اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',3],
 AZ[4],AZ[5],['العفو والعافية','اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',1],
 AZ[6],AZ[9]]};
const SETS=[
 {id:'m',ic:'🌅',t:'أذكار الصباح',a:'#F59E0B',b:'#B45309',items:dayset(true),n:'يُقال بعد الفجر إلى ما قبل الشروق، ويجوز في أي وقت بعدها.'},
 {id:'e',ic:'🌇',t:'أذكار المساء',a:'#8B5CF6',b:'#4C1D95',items:dayset(false),n:'يُقال بعد العصر إلى المغرب، ويجوز بعده.'},
 {id:'p',ic:'🕌',t:'بعد الصلاة',a:'#059669',b:'#064E3B',items:[
  ['الاستغفار','أَسْتَغْفِرُ اللَّهَ',3],['السلام','اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',1],['آية الكرسي',AZ[0][1],1],AZ[10],AZ[11],AZ[12],
  ['التهليل بعد المئة','لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',1]]},
 {id:'s',ic:'🌙',t:'أذكار النوم',a:'#4F46E5',b:'#1E1B4B',n:'يُستحب أن تجمع كفّيك وتنفث فيهما وتقرأ الإخلاص والمعوذتين، ثم تمسح بهما ما استطعت من جسدك، ثلاث مرات.',items:[
  ['آية الكرسي',AZ[0][1],1],AZ[1],AZ[2],AZ[3],['قبل النوم','بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',1],['الوقاية','اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',3],['سبحان الله','سُبْحَانَ اللَّهِ',33],['الحمد لله','الْحَمْدُ لِلَّهِ',33],['الله أكبر','اللَّهُ أَكْبَرُ',34]]},
 {id:'w',ic:'☀️',t:'الاستيقاظ',a:'#F97316',b:'#C2410C',items:[
  ['عند الاستيقاظ','الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',1],AZ[7]]},
 {id:'f',ic:'🍽️',t:'الطعام',a:'#16A34A',b:'#14532D',items:[
  ['قبل الأكل','بِسْمِ اللَّهِ',1],['بعد الأكل','الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',1]]},
 {id:'h',ic:'🏠',t:'البيت والمسجد',a:'#0891B2',b:'#164E63',items:[
  ['الخروج من البيت','بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',1],
  ['دخول البيت','بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',1],
  ['دخول المسجد','اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',1],['الخروج من المسجد','اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',1]]},
 {id:'t',ic:'🧳',t:'السفر',a:'#0EA5E9',b:'#1D4ED8',items:[
  ['ركوب الدابة أو السيارة','اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',1]]},
 {id:'d',ic:'🤲',t:'الكرب والدعاء',a:'#DB2777',b:'#831843',items:[
  ['دعاء ذي النون','لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',1],
  ['الاستغاثة','يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',1],
  ['حسبنا الله','حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',1],
  ['من الهم والحزن','اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',1]]},
 {id:'c',ic:'📿',t:'تسابيح',a:'#0D9488',b:'#115E59',items:[AZ[6],AZ[7],AZ[8],AZ[9]]}
];
const zcard=z=>{const n=+z[2]||1;return `<div class="zk2" data-zk2 data-n="${n}" data-t="${n}" style="--pc:0"><div class="zt2"><small>${E(z[0])}</small>${E(z[1])}</div><div class="zc2"><b>${n}</b></div></div>`};
function azHome(){return W(back('')+`<h3 class="rt-h">📿 الأذكار</h3><div class="rt-grid">${SETS.map((s,i)=>tile('az:'+s.id,s.ic,s.t,s.items.length+' أذكار',s.a,s.b,i)).join('')}</div>`)}
function azSet(id){const s=SETS.find(x=>x.id===id);if(!s)return azHome();
 return W(back('azkar')+head(s.ic,s.t,s.a,s.b,'0 / '+s.items.length)+`<div class="zp"><i id="zpB"></i></div>`+(s.n?`<p class="um" style="margin:0 0 12px">${E(s.n)}</p>`:'')+s.items.map(zcard).join('')+`<p class="um">${L('Tap an item to count it down.','اضغط على الذكر عشان يعدّ لك.')}</p>`)}

/* ===== المعلومات الدينية ===== */
const S=(h,i,o)=>({h,i,o});
const INFO=[
 {id:'pillars',ic:'🕋',t:'أركان الإسلام',a:'#047857',b:'#064E3B',s:[
  S('الأركان الخمسة',['الشهادتان: أن تشهد أن لا إله إلا الله وأن محمدًا رسول الله','إقام الصلاة: خمس صلوات في اليوم والليلة','إيتاء الزكاة: حق مالي للفقراء ومستحقيها','صوم رمضان: الإمساك عن المفطرات من الفجر إلى المغرب','حج البيت لمن استطاع إليه سبيلًا'],1),
  S('مراتب الدين',['الإسلام: الأعمال الظاهرة','الإيمان: ما استقر في القلب وصدّقه العمل','الإحسان: أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك'])]},
 {id:'iman',ic:'💎',t:'أركان الإيمان',a:'#7C3AED',b:'#4C1D95',s:[
  S('الأركان الستة',['الإيمان بالله','الإيمان بملائكته','الإيمان بكتبه: القرآن والتوراة والإنجيل والزبور وصحف إبراهيم وموسى','الإيمان برسله: أولهم نوح وآخرهم محمد ﷺ','الإيمان باليوم الآخر: البعث والحساب والجنة والنار','الإيمان بالقدر خيره وشره'],1)]},
 {id:'salat',ic:'🕌',t:'الصلاة',a:'#0891B2',b:'#164E63',s:[
  S('ركعات الفرائض',['الفجر: 2','الظهر: 4','العصر: 4','المغرب: 3','العشاء: 4']),
  S('السنن الرواتب (12 ركعة)',['ركعتان قبل الفجر','أربع ركعات قبل الظهر وركعتان بعدها','ركعتان بعد المغرب','ركعتان بعد العشاء']),
  S('صلوات أخرى',['الوتر: من ركعة إلى إحدى عشرة بعد العشاء حتى الفجر','الضحى: ركعتان فأكثر بعد ارتفاع الشمس','التراويح: في ليالي رمضان','الجمعة: ركعتان بعد خطبتين','العيدان: ركعتان في كل عيد']),
  S('أوقات الصلاة',['الفجر: من طلوع الفجر الصادق إلى الشروق','الظهر: من زوال الشمس','العصر: من حين يصير ظل كل شيء مثله تقريبًا إلى الغروب','المغرب: من الغروب إلى مغيب الشفق','العشاء: من مغيب الشفق إلى منتصف الليل تقريبًا'])]},
 {id:'wudu',ic:'💧',t:'الوضوء والغسل',a:'#0EA5E9',b:'#1D4ED8',s:[
  S('خطوات الوضوء',['النية والتسمية','غسل الكفين ثلاثًا','المضمضة والاستنشاق ثلاثًا','غسل الوجه ثلاثًا','غسل اليدين إلى المرفقين ثلاثًا','مسح الرأس والأذنين مرة','غسل الرجلين إلى الكعبين ثلاثًا'],1),
  S('نواقض الوضوء',['ما خرج من السبيلين','النوم الثقيل','زوال العقل بالإغماء أو الجنون']),
  S('موجبات الغسل',['خروج المني بشهوة','الجماع','انقطاع الحيض والنفاس']),
  S('طريقة الغسل',['النية','غسل اليدين ثم موضع النجاسة','الوضوء كوضوء الصلاة','صبّ الماء على الرأس ثلاثًا','تعميم بقية الجسد بالماء'],1)]},
 {id:'siyam',ic:'🌙',t:'الصيام',a:'#F59E0B',b:'#B45309',s:[
  S('مفسدات الصوم',['الأكل والشرب عمدًا','الجماع في نهار رمضان','القيء عمدًا','الحيض والنفاس']),
  S('سنن الصائم',['السحور فإن فيه بركة','تعجيل الفطر عند غروب الشمس','الدعاء عند الفطر','الإكثار من القرآن والذكر']),
  S('أيام يُستحب صيامها',['الإثنين والخميس','الأيام البيض: 13 و14 و15 من كل شهر هجري','يوم عرفة لغير الحاج','عاشوراء مع التاسع من المحرم','ست من شوال']),
  S('يحرم صيامه',['يوم عيد الفطر','يوم عيد الأضحى'])]},
 {id:'zakat',ic:'💰',t:'الزكاة',a:'#16A34A',b:'#14532D',s:[
  S('أساسيات',['المقدار في النقود والذهب: 2.5% (ربع العشر)','نصاب الذهب: 85 جرامًا عيار 24 تقريبًا','يشترط مرور سنة هجرية كاملة على النصاب','زكاة الفطر: صاع من طعام البلد عن كل فرد قبل صلاة العيد']),
  S('مصارف الزكاة الثمانية',['الفقراء','المساكين','العاملون عليها','المؤلفة قلوبهم','في الرقاب','الغارمون','في سبيل الله','ابن السبيل'],1)]},
 {id:'months',ic:'📅',t:'الأشهر الهجرية',a:'#6366F1',b:'#312E81',s:[
  S('الأشهر بالترتيب',['المحرم: أول السنة وهو من الأشهر الحرم، وفيه عاشوراء','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب: من الأشهر الحرم','شعبان','رمضان: شهر الصيام وفيه نزل القرآن','شوال: أوله عيد الفطر','ذو القعدة: من الأشهر الحرم','ذو الحجة: فيه الحج ويوم عرفة وعيد الأضحى، ومن الأشهر الحرم'],1)]},
 {id:'adab',ic:'🤝',t:'آداب يومية',a:'#DB2777',b:'#831843',s:[
  S('آداب الطعام',['التسمية في أوله والحمد في آخره','الأكل باليمين','الأكل مما يليك','عدم الإسراف']),
  S('آداب النوم',['الوضوء قبل النوم','النوم على الشق الأيمن','أذكار النوم']),
  S('آداب المسجد',['التبكير والسكينة','الدخول بالرجل اليمنى والخروج باليسرى','صلاة ركعتين تحية المسجد']),
  S('آداب السلام والزيارة',['إفشاء السلام','الاستئذان ثلاثًا','الرجوع إذا لم يؤذن لك'])]}
];
const sec=s=>`<div class="rt-sc"><h4>${E(s.h)}</h4><${s.o?'ol':'ul'}>${s.i.map(x=>`<li>${E(x)}</li>`).join('')}</${s.o?'ol':'ul'}></div>`;
function infoHome(){return W(back('')+`<h3 class="rt-h">📚 معلومات دينية</h3><div class="rt-grid">`+tile('prophets','📜','قصص الأنبياء','25 نبيًّا من القرآن','#B45309','#78350F',0,'wide')+INFO.map((x,i)=>tile('inf:'+x.id,x.ic,x.t,'',x.a,x.b,i+1)).join('')+`</div>`)}
function infoView(id){const x=INFO.find(y=>y.id===id);if(!x)return infoHome();
 return W(back('info')+head(x.ic,x.t,x.a,x.b)+x.s.map(sec).join('')+`<p class="um" style="margin-top:14px">للفتوى في المسائل الخاصة ارجع لدار الإفتاء أو عالم موثوق.</p>`)}

/* ===== قصص الأنبياء ===== */
const PR=[
['adam','آدم','🌿','أول البشر. خلقه الله من طين وأسجد له الملائكة فسجدوا إلا إبليس استكبارًا.|أسكنه الله وزوجه الجنة وأباح لهما كل شيء إلا شجرة واحدة، فوسوس لهما الشيطان فأكلا منها، ثم تابا فتاب الله عليهما وأنزلهما إلى الأرض.','البقرة، الأعراف، طه'],
['idris','إدريس','✍️','وصفه القرآن بأنه كان صدّيقًا نبيًّا، ورفعه الله مكانًا عليًّا.|لم يذكر القرآن تفاصيل أكثر عن قصته.','مريم، الأنبياء'],
['nuh','نوح','🚢','دعا قومه إلى عبادة الله وحده ألف سنة إلا خمسين عامًا، فلم يؤمن معه إلا قليل.|أمره الله ببناء السفينة، وجاء الطوفان فنجا المؤمنون ومن حُمل معهم من كل زوجين اثنين، وغرق المكذبون ومنهم ابنه الذي أبى أن يركب.','هود، نوح، المؤمنون'],
['hud','هود','🌪️','أُرسل إلى قوم عاد، وكانوا أصحاب قوة وبنيان عظيم ثم تكبّروا.|كذّبوه فأهلكهم الله بريح صرصر عاتية سبع ليالٍ وثمانية أيام، ونجّى هودًا والذين آمنوا معه.','الأعراف، هود، الأحقاف، الحاقة'],
['salih','صالح','🐪','أُرسل إلى قوم ثمود الذين نحتوا الجبال بيوتًا.|طلبوا آية، فأخرج الله لهم ناقة وجعل لها شِرب يوم ولهم شِرب يوم، فعقروها فأخذتهم الصيحة فأصبحوا في ديارهم جاثمين.','الأعراف، هود، الشعراء'],
['ibrahim','إبراهيم','🔥','خليل الله، أنكر عبادة الأصنام وحطّمها، فألقاه قومه في النار فجعلها الله بردًا وسلامًا عليه.|رزقه الله إسماعيل ثم إسحاق، وابتلاه بذبح ابنه فصدق وأسلم فداه الله بذبح عظيم. ورفع مع إسماعيل قواعد البيت.','البقرة، الأنبياء، الصافات، إبراهيم'],
['lut','لوط','🏜️','آمن بإبراهيم وأُرسل إلى قوم يأتون فاحشة لم يسبقهم بها أحد من العالمين.|نهاهم فأصرّوا، فنجّاه الله وأهله إلا امرأته، وأمطر القوم حجارة من سجّيل.','الأعراف، هود، الحجر'],
['ismail','إسماعيل','🕋','ابن إبراهيم، وصفه القرآن بأنه صادق الوعد وكان يأمر أهله بالصلاة والزكاة.|أُسكن مع أمه هاجر في وادٍ غير ذي زرع عند البيت الحرام، فنبع لهما ماء زمزم، وساعد أباه في رفع قواعد الكعبة.','مريم، البقرة، إبراهيم'],
['ishaq','إسحاق','⭐','بشّرت الملائكة به إبراهيم وزوجته سارة بعد أن كبرا، وبشّرتها من ورائه بيعقوب.|ذكره القرآن نبيًّا من الصالحين.','هود، الحجر، الصافات'],
['yaqub','يعقوب','🌟','ابن إسحاق وهو إسرائيل. أوصى بنيه عند وفاته بعبادة الله وحده.|صبر صبرًا جميلًا على فقد ابنه يوسف حتى ابيضّت عيناه من الحزن، ثم ردّ الله إليه بصره وجمع شمله بيوسف.','البقرة، يوسف'],
['yusuf','يوسف','🌕','رأى في منامه أحد عشر كوكبًا والشمس والقمر له ساجدين. كاد له إخوته وألقوه في البئر فالتقطته قافلة وبيع في مصر.|راودته امرأة العزيز فاعتصم بالله، ثم سُجن ظلمًا، ففسّر رؤيا الملك فصار على خزائن الأرض.|وجمع الله شمله بأبيه وإخوته، وعفا عنهم.','سورة يوسف كاملة'],
['ayyub','أيوب','💚','ابتُلي في جسده وماله وأهله فصبر، ونادى ربه: أني مسّني الضرّ وأنت أرحم الراحمين.|فاستجاب الله له وكشف ضره وآتاه أهله ومثلهم معهم رحمة منه.','الأنبياء، ص'],
['shuayb','شعيب','⚖️','أُرسل إلى أهل مدين، ودعاهم إلى عبادة الله وإيفاء الكيل والميزان وعدم الإفساد في الأرض.|كذّبوه فأهلكهم الله، ونجّى شعيبًا والذين آمنوا معه.','الأعراف، هود، الشعراء'],
['musa','موسى','🌊','أكثر الأنبياء ذكرًا في القرآن. وُلد في زمن فرعون الذي كان يذبّح الأبناء، فألقته أمه في اليمّ بوحي من الله، فالتقطه آل فرعون وتربّى في قصره.|خرج إلى مدين، ثم عاد بعد سنين، وكلّمه الله عند الطور وأرسله إلى فرعون بآيات منها العصا واليد.|خرج ببني إسرائيل فانفلق لهم البحر، فنجوا وغرق فرعون وجنوده.','البقرة، الأعراف، طه، القصص، الشعراء'],
['harun','هارون','🗣️','أخو موسى. سأل موسى ربه أن يجعله وزيرًا له، فأرسله الله معه، وكان فصيح اللسان.|ولما ذهب موسى لميقات ربه نهى هارون قومه عن عبادة العجل.','طه، الأعراف، الفرقان'],
['dawud','داود','🎵','آتاه الله الملك والحكمة، وقتل جالوت في جيش طالوت.|ألان الله له الحديد فصنع منه الدروع، وسخّر معه الجبال والطير تسبّح، وآتاه الزبور.','البقرة، ص، سبأ، الأنبياء'],
['sulayman','سليمان','🐜','ورث عن أبيه داود الملك والنبوة، وسخّر الله له الريح والجن وعلّمه منطق الطير.|ومن قصصه: النملة التي حذّرت قومها، والهدهد الذي جاءه بخبر ملكة سبأ، فأسلمت مع سليمان لله رب العالمين.','النمل، ص، سبأ، الأنبياء'],
['ilyas','إلياس','🌾','أُرسل إلى قوم كانوا يعبدون صنمًا اسمه بعل، فدعاهم إلى عبادة الله.|ذكره القرآن في سورة الصافات وسلّم عليه: سلام على إل ياسين.','الأنعام، الصافات'],
['alyasa','اليسع','🌱','ذكره القرآن ضمن الأخيار والمصطفين من الأنبياء، ولم يفصّل قصته.','الأنعام، ص'],
['yunus','يونس','🐋','ذو النون. ذهب مغاضبًا قبل أن يُؤذن له، فركب السفينة والتقمه الحوت.|فنادى في الظلمات: لا إله إلا أنت سبحانك إني كنت من الظالمين، فنجّاه الله من الغمّ. وآمن قومه فمتّعهم الله إلى حين.','الأنبياء، الصافات، يونس'],
['dhulkifl','ذو الكفل','🤍','ذكره القرآن ضمن الصابرين والأخيار.|لم يذكر القرآن تفاصيل أكثر عن قصته.','الأنبياء، ص'],
['zakariyya','زكريا','🤲','كبر سنه وكانت امرأته عاقرًا، فدعا ربه سرًّا أن يرزقه ولدًا.|فبشّرته الملائكة بيحيى، وجعل الله آيته ألا يكلّم الناس ثلاث ليالٍ سويًّا.','مريم، آل عمران، الأنبياء'],
['yahya','يحيى','🕊️','آتاه الله الحكم صبيًّا، وكان حنانًا من لدنه وزكاة وتقيًّا بارًّا بوالديه.|لم يكن جبّارًا عصيًّا، وسلام عليه يوم وُلد ويوم يموت ويوم يُبعث حيًّا.','مريم، آل عمران'],
['isa','عيسى','✨','وُلد لمريم بلا أب بأمر الله، وتكلّم في المهد.|أرسله الله إلى بني إسرائيل وآتاه الإنجيل، وأيّده بمعجزات بإذن الله: إبراء الأكمه والأبرص وإحياء الموتى.|وأخبر القرآن أنهم ما قتلوه وما صلبوه، بل رفعه الله إليه.','آل عمران، مريم، المائدة'],
['muhammad','محمد ﷺ','🌙','خاتم الأنبياء والمرسلين، وُلد في مكة عام الفيل. نزل عليه الوحي في غار حراء وهو في الأربعين.|دعا إلى التوحيد وصبر على أذى قريش، ثم هاجر إلى المدينة وأقام فيها المجتمع المسلم.|بلّغ الرسالة وتوفي في المدينة سنة 11 هـ.','محمد، الفتح، الأحزاب']
];
function prHome(){return W(back('info')+`<h3 class="rt-h">📜 قصص الأنبياء</h3><div class="rt-grid g3">${PR.map((p,i)=>tile('pr:'+p[0],p[2],p[1],'','#B45309','#78350F',i,'sm')).join('')}</div><p class="um">القصص ملخّصة من القرآن الكريم، ولمزيد من التفصيل ارجع لكتب التفسير وقصص الأنبياء.</p>`)}
function prView(id){const i=PR.findIndex(x=>x[0]===id);if(i<0)return prHome();const p=PR[i],pv=PR[(i+PR.length-1)%PR.length],nx=PR[(i+1)%PR.length];
 return W(back('prophets')+head(p[2],'نبي الله '+p[1],'#B45309','#78350F')+`<div class="rt-sc">${p[3].split('|').map(x=>`<p class="rt-p">${E(x)}</p>`).join('')}<p class="rt-ref">📖 ذُكر في: ${E(p[4])}</p></div><div class="rt-nav"><button type="button" class="pill" data-rel="pr:${pv[0]}">السابق: ${E(pv[1])}</button><button type="button" class="pill" data-rel="pr:${nx[0]}">التالي: ${E(nx[1])}</button></div>`)}

/* ===== ربط مع index.html من غير تعديل الدوال الأصلية ===== */
const oldUI=window.relUI;
window.relUI=function(){
 if(relV==='azkar')return azHome();
 if(typeof relV==='string'){
  if(relV.startsWith('az:'))return azSet(relV.slice(3));
  if(relV==='info')return infoHome();
  if(relV.startsWith('inf:'))return infoView(relV.slice(4));
  if(relV==='prophets')return prHome();
  if(relV.startsWith('pr:'))return prView(relV.slice(3));
 }
 return oldUI.apply(this,arguments)};
const oldGo=window.relGo;
window.relGo=function(v){const r=oldGo.apply(this,arguments);
 try{if(/^(az|inf|pr)/.test(v)){const g=document.getElementById('grid');if(g)setTimeout(()=>window.scrollTo({top:Math.max(0,g.getBoundingClientRect().top+window.scrollY-110),behavior:'smooth'}),40)}}catch(_){}
 return r};
document.addEventListener('click',e=>{const z=e.target.closest('[data-zk2]');if(!z)return;
 let n=+z.dataset.n;if(n<=0)return;n--;z.dataset.n=n;const t=+z.dataset.t;
 z.style.setProperty('--pc',(t-n)/t*100);z.querySelector('.zc2 b').textContent=n?n:'✓';z.classList.toggle('done',n===0);
 try{if(navigator.vibrate)navigator.vibrate(n?10:35)}catch(_){}
 const all=document.querySelectorAll('.zk2').length,d=document.querySelectorAll('.zk2.done').length;
 const b=document.getElementById('zpB'),tt=document.getElementById('zpT');
 if(b)b.style.width=(d/all*100)+'%';if(tt)tt.textContent=d+' / '+all+(d===all?' ✓ تقبّل الله':'')});
const st2=document.createElement('style');st2.textContent=`
.rt-h{margin:0 0 12px;font-size:19px}
.rt-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.rt-grid.g3{grid-template-columns:repeat(3,1fr);gap:8px}
.rt-t{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:16px 8px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:18px;cursor:pointer;font:inherit;animation:rtIn .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*60ms);transition:transform .15s,box-shadow .2s}
.rt-t:active{transform:scale(.95)}
.rt-i{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:27px;background:linear-gradient(135deg,var(--a),var(--b));box-shadow:0 6px 14px -6px var(--b);flex:none}
.rt-x{display:grid;gap:2px}.rt-x b{font-size:14px}.rt-x small{color:var(--mut);font-size:11px}
.rt-t.wide{grid-column:1/-1;flex-direction:row;justify-content:flex-start;text-align:start;padding:14px 16px;gap:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--a) 14%,var(--card)),var(--card))}
.rt-t.sm{padding:12px 4px;gap:6px;border-radius:16px}.rt-t.sm .rt-i{width:42px;height:42px;border-radius:13px;font-size:22px}.rt-t.sm .rt-x b{font-size:13px}
.rt-hd{display:flex;align-items:center;gap:12px;margin:0 0 12px}.rt-hd h3{margin:0;font-size:19px}.rt-hd small{color:var(--mut)}
.rt-sc{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px 16px;margin:0 0 10px}.rt-sc h4{margin:0 0 6px;color:var(--p)}
.rt-sc ul,.rt-sc ol{margin:0;padding-inline-start:20px;line-height:2;font-size:15px}
.rt-p{margin:0 0 10px;line-height:2.1;font-size:16px}.rt-ref{margin:6px 0 0;color:var(--mut);font-size:13px}
.rt-nav{display:flex;justify-content:space-between;gap:8px;margin-top:6px}
.zp{height:6px;border-radius:99px;background:var(--line);overflow:hidden;margin:0 0 12px}.zp i{display:block;height:100%;width:0;background:var(--p);border-radius:99px;transition:width .35s}
.zk2{display:flex;gap:14px;align-items:center;direction:rtl;border:1px solid var(--line);background:var(--card);border-radius:18px;padding:14px;margin:0 0 10px;cursor:pointer;user-select:none;transition:transform .12s,opacity .3s}
.zk2:active{transform:scale(.98)}.zk2.done{opacity:.55}
.zt2{flex:1;line-height:2.1;font-size:19px;font-family:Amiri,Cairo,serif}.zt2 small{display:block;color:var(--p);font:700 12px Cairo,sans-serif;margin-bottom:2px}
.zc2{flex:none;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--p) calc(var(--pc,0)*1%),var(--line) 0)}
.zc2 b{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--card);font-size:17px}.zk2.done .zc2 b{background:var(--p);color:#fff}
@keyframes rtIn{from{opacity:0;transform:translateY(16px) scale(.92)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.rt-t{animation:none}}`;
document.head.appendChild(st2);
})();

/* ---------- 7) أقسام: برمجة وتقنية + دروس ومعلّمين ---------- */
(function(){
'use strict';
const sp=s=>s.split(',').map(x=>x.split(':'));
const add=o=>{if(!CATALOG.some(c=>c.id===o.id))CATALOG.push(o)};
const li=s=>s.split(',').map(x=>x.split(':'));
add({id:'dev',en:'Programming & Apps',ar:'برمجة وتطبيقات',e:'💻',c:['#2563EB','#1E3A8A'],sub:1,list:li('Websites:مواقع ويب,Mobile apps:تطبيقات موبايل,Online stores:متاجر إلكترونية,Business systems (ERP/CRM):أنظمة إدارة وشركات,Games:ألعاب,Bots & automation:بوتات وأتمتة,Bug fixing:تصليح أكواد وأخطاء')});
add({id:'itsupport',en:'IT Support & Repair',ar:'دعم فني وصيانة',e:'🛠️',c:['#0891B2','#164E63'],sub:1,list:li('Computer & laptop repair:صيانة كمبيوتر ولابتوب,Windows & software setup:تثبيت ويندوز وبرامج,Networks & Wi-Fi:شبكات وواي فاي,CCTV cameras:كاميرات مراقبة,Data recovery:استرجاع بيانات,Servers & hosting:سيرفرات واستضافة')});
add({id:'itdesign',en:'Design & Video',ar:'تصميم ومونتاج',e:'🎨',c:['#DB2777','#831843'],sub:1,list:li('UI/UX design:تصميم واجهات,Graphic design:جرافيك,Logos & branding:لوجو وهوية,Video editing:مونتاج فيديو,Motion graphics:موشن جرافيك')});
add({id:'itdata',en:'AI, Data & Security',ar:'ذكاء اصطناعي وبيانات',e:'🤖',c:['#7C3AED','#312E81'],sub:1,list:li('AI chatbots:شات بوت ذكاء اصطناعي,Workflow automation (n8n):أتمتة شغل (n8n),Excel & dashboards:إكسل ولوحات بيانات,Data analysis:تحليل بيانات,Cyber security:أمن معلومات,Digital marketing:تسويق رقمي')});
add({id:'itx',en:'Code & IT',ar:'برمجة وتقنية',e:'🖥️',c:['#4F46E5','#1E1B4B'],sub:1,list:[],grp:['dev','itsupport','itdesign','itdata']});
add({id:'edu',en:'Lessons & Tutors',ar:'دروس ومعلّمين',e:'🎓',c:['#7C3AED','#4C1D95'],sub:1,list:li('Math:رياضيات,Arabic:لغة عربية,English:لغة إنجليزية,Science:علوم,Physics:فيزياء,Chemistry:كيمياء,Biology:أحياء,Quran & Tajweed:قرآن وتجويد,French:لغة فرنسية,German:لغة ألمانية,Programming:برمجة,Art & music:رسم وموسيقى,University subjects:مواد جامعية,Kids (KG & primary):أطفال وحضانة')});
const g=CATALOG.find(c=>c.id==='g_services');if(g){['itx','edu'].forEach(i=>{if(!g.grp.includes(i))g.grp.push(i)})}
Object.assign(IC,{
 dev:'<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',itsupport:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 itdesign:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3c0-6-4-11-8-11z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7" r="1"/>',
 itdata:'<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9 21h6"/>',itx:'<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
 edu:'<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>'});
try{Object.assign(RT,{dev:'برمجة مبرمج موقع تطبيق app website code',itsupport:'صيانة كمبيوتر لابتوب شبكة واي فاي كاميرات ويندوز',itdesign:'تصميم جرافيك لوجو مونتاج فيديو',itdata:'ذكاء اصطناعي بيانات اكسل تحليل بوت n8n تسويق',edu:'مدرس معلم درس دروس خصوصي تعليم طالب كورس'})}catch(_){}
try{
 CAT_FOR.service.push('dev','itsupport','itdesign','itdata','edu');
 const m=sp('Online:أونلاين,On site:حضوري,Both:الاتنين'),K=l=>['kind','Service','الخدمة','s',sp(l)];
 FORMS.service=FORMS.service||{};
 FORMS.service.dev=[K('Website:موقع,Mobile app:تطبيق موبايل,Store:متجر إلكتروني,System:نظام إدارة,Bot:بوت,Other:أخرى'),['stack','Tools / languages','اللغات والأدوات','t'],['mode','Format','الطريقة','s',m]];
 FORMS.service.itsupport=[K('Repair:صيانة,Setup:تثبيت وإعداد,Network:شبكات,CCTV:كاميرات,Recovery:استرجاع بيانات,Other:أخرى'),['mode','Format','الطريقة','s',sp('On site:حضوري,Online:عن بعد,Both:الاتنين')]];
 FORMS.service.itdesign=[K('UI/UX:واجهات,Graphic:جرافيك,Logo:لوجو,Video:مونتاج,Motion:موشن,Other:أخرى'),['stack','Tools','البرامج','t'],['mode','Format','الطريقة','s',m]];
 FORMS.service.itdata=[K('AI:ذكاء اصطناعي,Automation:أتمتة,Excel:إكسل,Data:تحليل بيانات,Security:أمن معلومات,Marketing:تسويق رقمي,Other:أخرى'),['mode','Format','الطريقة','s',m]];
 FORMS.service.edu=[['subject','Subject','المادة','s',sp('Math:رياضيات,Arabic:عربي,English:إنجليزي,Science:علوم,Physics:فيزياء,Chemistry:كيمياء,Biology:أحياء,Quran:قرآن وتجويد,French:فرنساوي,German:ألماني,Programming:برمجة,Art:رسم وموسيقى,University:مواد جامعية,Other:أخرى')],['level','Level','المرحلة','s',sp('KG:حضانة,Primary:ابتدائي,Prep:إعدادي,Secondary:ثانوي,University:جامعي,Adults:كبار')],['mode','Format','الطريقة','s',m]];
}catch(_){}
try{renderChips();render()}catch(_){}
})();

/* ---------- 8) المصحف: صفحات + صوت مشايخ + معنى وتفسير + علامات ---------- */
(function(){
'use strict';
const $=s=>document.querySelector(s),E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const API='https://api.alquran.cloud/v1/',CDN='https://cdn.islamic.network/quran/audio/';
const SN='الفاتحة,البقرة,آل عمران,النساء,المائدة,الأنعام,الأعراف,الأنفال,التوبة,يونس,هود,يوسف,الرعد,إبراهيم,الحجر,النحل,الإسراء,الكهف,مريم,طه,الأنبياء,الحج,المؤمنون,النور,الفرقان,الشعراء,النمل,القصص,العنكبوت,الروم,لقمان,السجدة,الأحزاب,سبأ,فاطر,يس,الصافات,ص,الزمر,غافر,فصلت,الشورى,الزخرف,الدخان,الجاثية,الأحقاف,محمد,الفتح,الحجرات,ق,الذاريات,الطور,النجم,القمر,الرحمن,الواقعة,الحديد,المجادلة,الحشر,الممتحنة,الصف,الجمعة,المنافقون,التغابن,الطلاق,التحريم,الملك,القلم,الحاقة,المعارج,نوح,الجن,المزمل,المدثر,القيامة,الإنسان,المرسلات,النبأ,النازعات,عبس,التكوير,الانفطار,المطففين,الانشقاق,البروج,الطارق,الأعلى,الغاشية,الفجر,البلد,الشمس,الليل,الضحى,الشرح,التين,العلق,القدر,البينة,الزلزلة,العاديات,القارعة,التكاثر,العصر,الهمزة,الفيل,قريش,الماعون,الكوثر,الكافرون,النصر,المسد,الإخلاص,الفلق,الناس'.split(',');
const SP=[1,2,50,77,106,128,151,177,187,208,221,235,249,255,262,267,282,293,305,312,322,332,342,350,359,367,377,385,396,404,411,415,418,428,434,440,446,453,458,467,477,483,489,496,499,502,507,511,515,518,520,523,526,528,531,534,537,542,545,549,551,553,554,556,558,560,562,564,566,568,570,572,574,575,577,578,580,582,583,585,586,587,587,589,590,591,591,592,593,594,595,595,596,596,597,597,598,598,599,599,600,600,601,601,601,602,602,602,603,603,603,604,604,604];
const R=[['ar.alafasy','مشاري العفاسي'],['ar.abdurrahmaansudais','عبدالرحمن السديس'],['ar.saoodshuraym','سعود الشريم'],['ar.mahermuaiqly','ماهر المعيقلي'],['ar.husary','محمود خليل الحصري'],['ar.abdulbasitmurattal','عبدالباسط عبدالصمد'],['ar.minshawi','محمد صديق المنشاوي'],['ar.hudhaify','علي الحذيفي'],['ar.ahmedajamy','أحمد العجمي'],['ar.shaatree','أبو بكر الشاطري']];
const TB=[['ar.muyassar','المعنى (الميسر)'],['ar.jalalayn','تفسير الجلالين'],['ar.qurtubi','تفسير القرطبي'],['en.sahih','English'],['w','كلمة بكلمة'],['m','علامة 🔖']];
const MC=['#FACC15','#4ADE80','#F472B6','#60A5FA'];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(_){return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]),bz=n=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(_){}};
let pg=1,cur=null,M=ld('hz_qm',{}),rc=ld('hz_qr','ar.alafasy'),fs=+ld('hz_qf',26),br=128,qi=0,playing=false,want=false;const P={},X={},au=new Audio();
const strip=a=>{let t=a.text;if(a.numberInSurah==1&&a.surah.number!=1&&a.surah.number!=9){const w=t.split(' ');if(w[0].replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').startsWith('بسم'))t=w.slice(4).join(' ')}return t};
async function load(n){if(P[n])return P[n];const r=await(await fetch(API+'page/'+n+'/quran-uthmani')).json();return P[n]=r.data}
function css(){if($('#qrCss'))return;const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap';document.head.appendChild(l);const s=document.createElement('style');s.id='qrCss';s.textContent=`#qr[hidden]{display:none!important}#qr{position:fixed;inset:0;z-index:9999;background:var(--bg);color:var(--ink);display:flex;flex-direction:column;direction:rtl}#qr button{font:inherit;color:inherit;cursor:pointer}.qh{display:flex;align-items:center;gap:8px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));border-bottom:1px solid var(--line)}.qh b{flex:1;text-align:center;font-size:14px}.qh button,.qf button{border:1px solid var(--line);background:var(--card);border-radius:12px;min-width:40px;height:40px;font-size:18px}#qrB{flex:1;overflow:auto;padding:14px 16px 20px;font-family:'Amiri Quran',Amiri,'Scheherazade New',serif;line-height:2.5;text-align:justify;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}.qa{border-radius:8px;transition:background .2s}.qa i{font-style:normal;color:var(--p);font-size:.7em;margin:0 3px}.qa.hold{background:color-mix(in srgb,var(--p) 25%,transparent)}.qa.cur{background:color-mix(in srgb,var(--p) 35%,transparent)}.qs{text-align:center;margin:14px 0 6px;padding:6px;border:1px solid var(--p);border-radius:12px;color:var(--p);font-size:.85em}.qb{text-align:center;font-size:.9em}.qf{display:flex;gap:8px;align-items:center;justify-content:center;padding:8px 12px;padding-bottom:max(8px,env(safe-area-inset-bottom));border-top:1px solid var(--line)}.qf input{width:64px;text-align:center;height:40px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:inherit;font:inherit}#qrP{display:none;align-items:center;justify-content:center;gap:8px;padding:6px;background:var(--card);border-top:1px solid var(--line);font-size:13px}#qrS{position:fixed;inset:auto 0 0 0;z-index:10000;max-height:68vh;overflow:auto;background:var(--card);color:var(--ink);border-radius:20px 20px 0 0;box-shadow:0 -8px 30px #0006;padding:14px 16px calc(16px + env(safe-area-inset-bottom));direction:rtl;font-family:Cairo,sans-serif}#qrS .t{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}#qrS .t button{border:1px solid var(--line);background:var(--bg);color:inherit;border-radius:99px;padding:6px 12px;font:inherit;font-size:13px}#qrS .t .on{background:var(--p);color:#fff;border-color:var(--p)}#qrS .ay{font-family:'Amiri Quran',Amiri,serif;font-size:21px;line-height:2.2;margin:6px 0}#qrS .bd{line-height:2;font-size:15px}.qw{display:inline-block;margin:3px;padding:4px 8px;border:1px solid var(--line);border-radius:10px;text-align:center}.qw b{display:block;font-family:'Amiri Quran',Amiri,serif;font-size:19px}.qw small{color:var(--mut)}.qr{display:flex;gap:8px;align-items:center;width:100%;padding:12px;margin:5px 0;border:1px solid var(--line);background:var(--bg);color:inherit;border-radius:14px;font:inherit}.qr.on{border-color:var(--p);background:color-mix(in srgb,var(--p) 14%,var(--bg))}.qg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.qg button,.qgi{border:1px solid var(--line);background:var(--card);color:inherit;border-radius:14px;padding:10px 4px;font:inherit;font-size:13px;cursor:pointer}`;document.head.appendChild(s)}
function paint(){const d=cur;let h='',last=0;d.ayahs.forEach(a=>{if(a.numberInSurah==1){h+=`<div class="qs">سورة ${E(SN[a.surah.number-1])}</div>`;if(a.surah.number!=1&&a.surah.number!=9)h+='<div class="qb">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>'}const k=a.surah.number+':'+a.numberInSurah,m=M[k];h+=`<span class="qa" data-n="${a.number}" data-s="${a.surah.number}" data-i="${a.numberInSurah}"${m?` style="background:${MC[m.c]}55"`:''}>${E(strip(a))} <i>﴿${ar(a.numberInSurah)}﴾</i></span> `});
 const b=$('#qrB');b.innerHTML=h;b.style.fontSize=fs+'px';b.scrollTop=0;const a0=d.ayahs[0];$('#qt').textContent='سورة '+SN[a0.surah.number-1]+' · صفحة '+ar(pg)+' · جزء '+ar(a0.juz);$('#qn').value=pg;sv('hz_ql',pg)}
async function go(n,play){n=Math.max(1,Math.min(604,+n||1));pg=n;$('#qrB').innerHTML='<p style="text-align:center;font-family:Cairo">جاري التحميل…</p>';try{cur=await load(n);paint();load(n+1).catch(()=>{});if(play)play_(0)}catch(_){$('#qrB').innerHTML='<p style="text-align:center;font-family:Cairo">محتاج إنترنت. جرّب تاني.</p>'}}
function hl(num){document.querySelectorAll('.qa.cur').forEach(x=>x.classList.remove('cur'));const e=document.querySelector('.qa[data-n="'+num+'"]');if(e){e.classList.add('cur');e.scrollIntoView({block:'center',behavior:'smooth'})}}
function play_(i){if(!cur)return;const a=cur.ayahs[i];if(!a){if(pg<604&&want)go(pg+1,true);else stop();return}qi=i;playing=true;au.src=CDN+br+'/'+rc+'/'+a.number+'.mp3';au.play().catch(()=>{});hl(a.number);bar()}
function stop(){want=false;playing=false;au.pause();document.querySelectorAll('.qa.cur').forEach(x=>x.classList.remove('cur'));bar()}
function bar(){const p=$('#qrP');if(!p)return;p.style.display=want?'flex':'none';p.innerHTML=`<button id="qpv">⏮</button><button id="qpp">${playing?'⏸':'▶️'}</button><button id="qpn">⏭</button><button id="qpx">⏹</button><span>${E((R.find(r=>r[0]==rc)||R[0])[1])}</span>`;p.querySelectorAll('button').forEach(b=>b.style.cssText='border:0;background:none;font-size:20px')}
au.onended=()=>{if(want)play_(qi+1)};au.onerror=()=>{if(!want)return;if(br==128){br=64;play_(qi)}else if(br==64){br=192;play_(qi)}else{br=128;stop()}};
function open(n){css();let o=$('#qr');if(!o){o=document.createElement('div');o.id='qr';o.innerHTML='<div class="qh"><button id="qx" aria-label="إغلاق">✕</button><button id="qs" aria-label="سماعة">🔊</button><b id="qt"></b><button id="qm">A−</button><button id="qp">A+</button></div><div id="qrB"></div><div id="qrP"></div><div class="qf"><button id="qnx">›</button><input id="qn" type="number" min="1" max="604"><button id="qpr">‹</button></div>';document.body.appendChild(o);wire()}o.hidden=false;document.body.style.overflow='hidden';go(n||ld('hz_ql',1))}
function closeQ(){stop();sh(null);const o=$('#qr');if(o)o.hidden=true;document.body.style.overflow=''}
function sh(h){let s=$('#qrS');if(!h){if(s)s.remove();return}if(!s){s=document.createElement('div');s.id='qrS';document.body.appendChild(s)}s.innerHTML=h}
function reciters(){sh(`<b>اختار الشيخ اللي تسمع بصوته</b>${R.map(r=>`<button class="qr ${r[0]==rc?'on':''}" data-rc="${r[0]}">🎙️ ${r[1]}</button>`).join('')}<button class="qr" data-qc>إغلاق</button>`)}
async function tx(ed,n){const k=ed+n;if(X[k])return X[k];const j=await(await fetch(API+'ayah/'+n+'/'+ed)).json();return X[k]=j.data.text}
async function wd(s,i){const k='w'+s+':'+i;if(X[k])return X[k];const j=await(await fetch('https://api.quran.com/api/v4/verses/by_key/'+s+':'+i+'?words=true&word_fields=text_uthmani&language=en')).json();return X[k]=j.verse.words.filter(w=>w.char_type_name=='word')}
async function tab(el,t){const n=+el.dataset.n,s=el.dataset.s,i=el.dataset.i,a=cur.ayahs.find(x=>x.number==n),id=TB[t][0];
 sh(`<b>سورة ${E(SN[s-1])} · آية ${ar(i)}</b><div class="ay">${E(strip(a))}</div><div class="t">${TB.map((x,j)=>`<button data-tb="${j}" class="${j==t?'on':''}">${x[1]}</button>`).join('')}</div><div class="bd" id="qbd">…</div><button class="qr" data-qc>إغلاق</button>`);
 sh.el=el;const b=()=>$('#qbd');
 if(id=='m'){const m=M[s+':'+i];b().innerHTML=`<div style="display:flex;gap:10px;align-items:center">${MC.map((c,j)=>`<button data-mk="${j}" style="width:44px;height:44px;border-radius:50%;border:${m&&m.c==j?'3px solid var(--ink)':'1px solid var(--line)'};background:${c}"></button>`).join('')}${m?'<button class="qr" data-mk="-1" style="width:auto">شيل العلامة</button>':''}</div><p class="um">العلامة بتتحفظ على جهازك، وهتلاقيها في قايمة "علاماتي".</p>`;return}
 try{if(id=='w'){const w=await wd(s,i);b().innerHTML=w.map(x=>`<span class="qw"><b>${E(x.text_uthmani||x.text)}</b><small>${E((x.translation||{}).text||'')}</small></span>`).join('')+'<p class="um">معاني الكلمات بالإنجليزي (من Quran.com).</p>'}else{const r=await tx(id,n);if(b())b().innerHTML=`<p dir="${id[0]=='e'?'ltr':'rtl'}">${E(r)}</p>`}}catch(_){if(b())b().innerHTML='<p class="um">مش متاح دلوقتي. اتأكد من الإنترنت وجرّب تاني.</p>'}}
function wire(){const b=$('#qrB');let T1,T2,st=0,sx=0,sy=0,tg=null,tx0=0,ty0=0;
 b.addEventListener('pointerdown',e=>{tg=e.target.closest('.qa');if(!tg)return;st=0;sx=e.clientX;sy=e.clientY;tg.classList.add('hold');T1=setTimeout(()=>{st=1;bz(15)},550);T2=setTimeout(()=>{st=2;bz(30);if(tg){tg.classList.remove('hold');tab(tg,5)}},1200)});
 const end=up=>{clearTimeout(T1);clearTimeout(T2);if(!tg)return;const t=tg;tg=null;t.classList.remove('hold');if(up&&st<2)tab(t,st?1:0)};
 b.addEventListener('pointerup',()=>end(true));b.addEventListener('pointercancel',()=>end(false));b.addEventListener('pointermove',e=>{if(tg&&(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10))end(false)});
 b.addEventListener('contextmenu',e=>e.preventDefault());
 b.addEventListener('touchstart',e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY},{passive:true});
 b.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-tx0,dy=t.clientY-ty0;if(Math.abs(dx)>90&&Math.abs(dx)>Math.abs(dy)*1.6)go(pg+(dx>0?1:-1))},{passive:true});
 $('#qr').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const id=t.id;
  if(id=='qx')closeQ();else if(id=='qs')reciters();else if(id=='qnx')go(pg+1);else if(id=='qpr')go(pg-1);
  else if(id=='qm'){fs=Math.max(18,fs-2);sv('hz_qf',fs);b.style.fontSize=fs+'px'}else if(id=='qp'){fs=Math.min(44,fs+2);sv('hz_qf',fs);b.style.fontSize=fs+'px'}
  else if(id=='qpp'){if(playing){au.pause();playing=false}else{au.play().catch(()=>{});playing=true}bar()}else if(id=='qpn')play_(qi+1);else if(id=='qpv')play_(Math.max(0,qi-1));else if(id=='qpx')stop()});
 $('#qn').addEventListener('change',e=>go(e.target.value));
 document.addEventListener('click',e=>{const s=$('#qrS');if(!s)return;const c=e.target.closest('[data-rc],[data-qc],[data-tb],[data-mk]');if(!c){if(!e.target.closest('#qrS')&&!e.target.closest('#qs'))sh(null);return}
  if(c.dataset.qc!==undefined)sh(null);
  else if(c.dataset.rc){rc=c.dataset.rc;sv('hz_qr',rc);br=128;sh(null);want=true;play_(0)}
  else if(c.dataset.tb)tab(sh.el,+c.dataset.tb);
  else if(c.dataset.mk!==undefined){const el=sh.el,k=el.dataset.s+':'+el.dataset.i,j=+c.dataset.mk;if(j<0)delete M[k];else M[k]={c:j,p:pg};sv('hz_qm',M);el.style.background=j<0?'':MC[j]+'55';tab(el,5)}},true)}
/* واجهة اختيار السورة/الجزء/العلامات داخل قسم الديني */
let qtab='s';
function idx(){const l=ld('hz_ql',0),mk=Object.keys(M);const tabs=[['s','السور'],['j','الأجزاء'],['m','علاماتي ('+mk.length+')']];let body='';
 if(qtab=='s')body=`<div class="qg">${SN.map((n,i)=>`<button data-hzq="${SP[i]}">${i+1}. ${n}</button>`).join('')}</div>`;
 else if(qtab=='j')body=`<div class="qg">${Array.from({length:30},(_,i)=>`<button data-hzq="${i?2+i*20:1}">جزء ${ar(i+1)}</button>`).join('')}</div>`;
 else body=mk.length?mk.map(k=>{const[s,i]=k.split(':');return `<button class="qgi" style="display:block;width:100%;margin:6px 0;text-align:start" data-hzq="${M[k].p}"><span style="color:${MC[M[k].c]}">●</span> سورة ${SN[s-1]} · آية ${ar(i)} · صفحة ${ar(M[k].p)}</button>`}).join(''):'<p class="um">لسه ماعلّمتش على أي آية. اضغط على الآية ضغطة طويلة واختار "علامة".</p>';
 return `<div class="rl"><button type="button" class="pill" data-rel="" style="margin-bottom:12px">← رجوع</button><h3 class="rt-h">📖 المصحف</h3>${l?`<button type="button" class="btn" data-hzq="${l}" style="margin-bottom:10px">كمّل من صفحة ${ar(l)}</button>`:''}<div style="display:flex;gap:6px;margin:8px 0">${tabs.map(t=>`<button type="button" class="pill ${qtab==t[0]?'on':''}" data-hzqt="${t[0]}">${t[1]}</button>`).join('')}</div>${body}<p class="um">اضغط على آية: معناها. ضغطة أطول: التفسير. أطول كمان: خيارات وعلامة. 🎧 فوق: اسمع بصوت شيخ.</p></div>`}
const oUI=window.relUI;window.relUI=function(){if(typeof relV==='string'&&relV==='quran')return idx();return oUI.apply(this,arguments)};
const oGo=window.relGo;window.relGo=function(v){if(v==='quran'){relV='quran';render();return}return oGo.apply(this,arguments)};
document.addEventListener('click',e=>{const t=e.target.closest('[data-hzqt]');if(t){qtab=t.dataset.hzqt;render();return}const q=e.target.closest('[data-hzq]');if(q){open(+q.dataset.hzq)}});
window.hzQuran=open;
})();

/* ---------- 9) أقسام عامة: أدوات وحاسبات / مطبخ / إسعافات / تعلّم تقنية ---------- */
(function(){
'use strict';
const $=s=>document.querySelector(s),E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ul=a=>`<ul>${a.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`,ol=a=>`<ol>${a.map(x=>`<li>${E(x)}</li>`).join('')}</ol>`;
const sec=(h,b)=>`<div class="rt-sc"><h4>${E(h)}</h4>${b}</div>`;
const fld=(l,n,t,x)=>`<label style="display:block;margin:8px 0"><span>${l}</span><input name="${n}" type="${t||'number'}" step="any" ${x||''} style="width:100%;padding:10px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:inherit"></label>`;
const calc=(k,inner)=>`<form class="rt-sc" data-calc="${k}" onsubmit="return false">${inner}<div class="rt-res" style="margin-top:10px;font-weight:700;line-height:1.9"></div></form>`;
const UN={'طول':{'متر':1,'كيلومتر':1000,'سنتيمتر':.01,'ميل':1609.344,'قدم':.3048,'بوصة':.0254},'وزن':{'كيلو':1,'جرام':.001,'طن':1000,'رطل':.45359237,'أوقية':.028349523},'حجم':{'لتر':1,'مللي':.001,'جالون':3.785411784,'كوب':.2365882}};
const unitForm=()=>calc('unit',`<label>النوع <select name="t" style="padding:8px;border-radius:10px">${Object.keys(UN).map(k=>`<option>${k}</option>`).join('')}</select></label>${fld('القيمة','v')}<div style="display:flex;gap:8px"><select name="a" style="flex:1;padding:8px;border-radius:10px"></select><select name="b" style="flex:1;padding:8px;border-radius:10px"></select></div><p class="um">للحرارة: °م = (°ف − 32) × 5/9</p>`);
const CATS=[
{id:'tools',ar:'أدوات وحاسبات',en:'Tools & Calculators',e:'🧮',c:['#0EA5E9','#1E3A8A'],a:'#0EA5E9',b:'#1E3A8A',items:[
 ['zakat','💰','حاسبة الزكاة',calc('zakat',fld('المبلغ اللي معاك (جنيه)','m')+fld('سعر جرام الدهب عيار 24 النهارده','g')+'<p class="um">النصاب = 85 جرام دهب. لو المبلغ وعدّى عليه سنة هجرية بيزكّى بنسبة 2.5%.</p>')],
 ['age','🎂','حاسبة العمر',calc('age',fld('تاريخ الميلاد','d','date'))],
 ['unit','📏','محوّل وحدات',unitForm()],
 ['hijri','🌙','التاريخ الهجري',calc('hijri',fld('التاريخ الميلادي','d','date'))+`<div class="rt-sc"><h4>النهارده</h4><p>${(()=>{try{return new Date().toLocaleDateString('ar-EG-u-ca-islamic',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}catch(_){return ''}})()}</p></div>`],
 ['disc','🏷️','حاسبة الخصم',calc('disc',fld('السعر','p')+fld('نسبة الخصم %','d'))],
 ['loan','🏦','حاسبة القسط',calc('loan',fld('المبلغ','p')+fld('الفايدة السنوية %','r')+fld('المدة بالشهور','n'))]]},
{id:'kitchen',ar:'مطبخ وأكلات',en:'Kitchen',e:'🍲',c:['#F97316','#9A3412'],a:'#F97316',b:'#9A3412',items:[
 ['kosh','🍝','كشري',sec('المكونات',ul(['أرز وعدس أصفر وشعرية ومكرونة','حمص مسلوق','بصل مقلي','صلصة طماطم بالثوم والخل والشطة']))+sec('الطريقة',ol(['اسلق العدس والمكرونة كل واحد لوحده.','اطبخ الأرز مع الشعرية المحمّرة.','اعمل الصلصة: ثوم مقلي وصلصة طماطم وخل وملح وكمون.','رصّ الطبقات وزوّد البصل المقلي والحمص والصلصة.']))],
 ['mol','🥬','ملوخية',sec('المكونات',ul(['ملوخية مفرومة','مرقة فراخ أو لحمة','ثوم وكزبرة ناشفة وسمنة','ملح وكمون وعصرة ليمون (اختياري)']))+sec('الطريقة',ol(['سخّن المرقة لحد ما تغلي.','حمّر الثوم والكزبرة في السمنة (التقلية).','حط الملوخية في المرقة على نار هادية 5 دقايق من غير غليان شديد.','ضيف التقلية وقلّب وقدّمها مع الأرز.']))],
 ['mah','🫑','محشي',sec('المكونات',ul(['كوسة أو باذنجان أو ورق عنب','أرز مصري مغسول','بصل وطماطم وشبت وبقدونس وكزبرة','ملح وفلفل وبهارات وسمنة','صلصة ومرقة']))+sec('الطريقة',ol(['افرم الخضرة والبصل وقلّبهم مع الأرز والبهارات.','فضّي الكوسة أو جهّز الورق.','احشي نص الخضار بس عشان الأرز يتفرد.','رصّه في حلة وغطيه بالمرقة والصلصة وسوّيه على نار هادية ساعة تقريباً.']))],
 ['fat','🍚','فتة',sec('المكونات',ul(['عيش بلدي محمّص','أرز','لحمة مسلوقة ومرقتها','صلصة طماطم بالثوم والخل']))+sec('الطريقة',ol(['حمّص العيش في الفرن.','رشّه بشوية مرقة.','حط طبقة أرز فوقه.','صبّ الصلصة وزيّنه باللحمة.']))],
 ['fol','🫘','فول مدمس',sec('المكونات',ul(['فول مدمس','زيت وليمون وكمون وملح','طماطم وشطة (اختياري)']))+sec('الطريقة',ol(['سخّن الفول بمرقته.','اهرس نصه تقريباً.','ضيف الزيت والليمون والكمون والملح.','قدّمه مع عيش وطعمية.']))],
 ['tam','🧆','طعمية',sec('المكونات',ul(['فول مجروش منقوع','كزبرة وشبت وبقدونس وكرات وبصل وثوم','كمون وملح وشوية بيكربونات','سمسم']))+sec('الطريقة',ol(['افرم الفول والخضرة فرم ناعم.','ضيف البهارات والبيكربونات وقلّب.','شكّلها أقراص وحط سمسم.','اقليها في زيت سخن لحد ما تحمّر.']))]]},
{id:'aid',ar:'إسعافات وصحتك',en:'First Aid',e:'🩹',c:['#DC2626','#7F1D1D'],a:'#DC2626',b:'#7F1D1D',items:[
 ['em','📞','الطوارئ',sec('اتصل فوراً',ul(['الإسعاف في مصر: 123','لو الحالة خطيرة اتصل الأول وبعدين اتصرف','المعلومات هنا إرشاد عام ومش بديل للدكتور']))],
 ['cpr','❤️','إنعاش القلب',sec('لو شخص مش بيتنفس ومش بيرد',ol(['اتصل بالإسعاف 123 أو خلّي حد يتصل.','ضع كف إيدك في نص الصدر والتانية فوقها.','اضغط بقوة وبسرعة: حوالي 100 لـ 120 ضغطة في الدقيقة، وعمق 5 لـ 6 سم.','كمّل لحد ما الإسعاف توصل أو يتحرك.']))],
 ['burn','🔥','الحروق',sec('اعمل',ol(['بعّد المصاب عن مصدر الحرق.','صبّ ماية جارية باردة (مش تلج) 10 لـ 20 دقيقة.','شيل الخواتم والساعات قبل ما ينتفخ.','غطّي بشاش نضيف.']))+sec('ماتعملش',ul(['معجون سنان أو زبدة أو قهوة','فقع الفقاقيع']))+'<p class="um">لو الحرق كبير أو في الوش أو عند طفل: روح الطوارئ.</p>'],
 ['chk','🫁','الاختناق',sec('شخص كبير مش قادر يتنفس أو يتكلم',ol(['اتصل 123.','اضربه 5 ضربات على ضهره بين الكتفين.','لو لسه: 5 ضغطات على البطن من ورا (مناورة هيمليك).','كرر لحد ما الحاجة تطلع أو يفقد الوعي، وابدأ إنعاش.']))+'<p class="um">للرضّع الطريقة مختلفة، اسأل مسعف.</p>'],
 ['nose','🩸','رعاف الأنف',sec('اعمل',ol(['اقعد وميّل راسك لقدام (مش لورا).','اضغط على الجزء اللين من الأنف 10 دقايق من غير ما تسيب.','حط كمادة باردة على الأنف.']))+'<p class="um">لو استمر أكتر من 20 دقيقة روح الطوارئ.</p>'],
 ['bld','🩹','النزيف',sec('اعمل',ol(['اضغط مباشرة على الجرح بشاش أو قماشة نضيفة.','متشيلش القماشة لو اتبلّت، حط فوقها واحدة تانية.','ارفع العضو المصاب لو ممكن.','اتصل 123 لو النزيف شديد.']))],
 ['faint','😵','الإغماء',sec('اعمل',ol(['نيّمه على ضهره.','ارفع رجليه حوالي 30 سم.','فكّ الملابس الضيقة وفتّح الشباك.','لو ماصحيش خلال دقيقة اتصل 123.']))],
 ['fx','🦴','الكسور',sec('اعمل',ol(['ماتحركش العضو المصاب.','ثبّته بحاجة صلبة ولفّه برباط من غير شدّ.','كمادة تلج ملفوفة بقماشة.','روّح الطوارئ.']))],
 ['heat','☀️','ضربة الشمس',sec('اعمل',ol(['انقله لمكان ضل وبارد.','بلّل جسمه بماية فاترة وروّحه بمروحة.','اسقيه ماية لو واعي.','اتصل 123 لأنها حالة طارئة.']))],
 ['seiz','⚡','التشنجات',sec('اعمل',ol(['بعّد الأشياء الخطرة وحط حاجة ناعمة تحت راسه.','ماتحطش حاجة في بقه وماتمسكوش بالقوة.','قيس الوقت، ولو عدّى 5 دقايق اتصل 123.','بعد ما تخلص نيّمه على جنبه.']))]]},
{id:'itlearn',ar:'تعلّم تقنية',en:'Learn Tech',e:'📚',c:['#6366F1','#312E81'],a:'#6366F1',b:'#312E81',items:[
 ['rweb','🌐','خريطة تعلّم الويب',sec('الخطوات',ol(['HTML وCSS','JavaScript','Git وGitHub','React أو Vue','Node.js وقواعد بيانات (SQL)','انشر مشروع حقيقي واعمل بورتفوليو']))],
 ['rmob','📱','خريطة تطبيقات الموبايل',sec('الخطوات',ol(['أساسيات البرمجة (Dart أو Kotlin أو Swift)','Flutter أو React Native','التعامل مع API وقواعد البيانات','نشر على المتجر']))],
 ['rdata','🤖','خريطة البيانات والذكاء الاصطناعي',sec('الخطوات',ol(['Python','Excel وSQL','إحصاء أساسي وتحليل بيانات (pandas)','تعلّم الآلة','مشاريع ونماذج بسيطة']))],
 ['rsec','🛡️','خريطة أمن المعلومات',sec('الخطوات',ol(['الشبكات ونظم التشغيل (Linux)','أساسيات الأمان والتشفير','اختبار الاختراق في بيئات تدريب قانونية','شهادات زي Security+']))],
 ['rit','🛠️','خريطة الدعم الفني',sec('الخطوات',ol(['صيانة الهاردوير','تثبيت وإدارة ويندوز','الشبكات (TCP/IP وراوتر)','شهادات زي A+ وCCNA']))],
 ['gl','📖','مصطلحات تقنية',sec('أهم المصطلحات',ul(['API: طريقة بتخلّي برنامجين يتكلموا مع بعض','Frontend: اللي المستخدم بيشوفه في الموقع','Backend: الجزء اللي شغّال على السيرفر','Database: مكان تخزين البيانات','Git: نظام بيحفظ نسخ الكود','Cloud: سيرفرات بتأجرها بدل ما تشتري','Bug: خطأ في الكود','Framework: أدوات جاهزة بتسرّع الشغل','Firewall: جدار حماية للشبكة','Phishing: رسالة بتخدعك عشان تسرق بياناتك']))],
 ['sf','🔐','نصايح أمان رقمي',sec('اعمل',ul(['باسورد قوي وطويل ومختلف لكل حساب','فعّل التحقق بخطوتين','ماتدوسش على لينكات مجهولة','حدّث الموبايل والبرامج','خد نسخة احتياطية من ملفاتك']))],
 ['tl','🧰','أدوات مفيدة',sec('مجاناً أو ليها نسخة مجانية',ul(['VS Code: محرر كود','GitHub: تخزين ومشاركة الكود','Figma: تصميم واجهات','Canva: تصميم سريع','Postman: تجربة API','freeCodeCamp وMDN: تعلّم مجاني']))]]}];
const add=o=>{if(!CATALOG.some(c=>c.id===o.id))CATALOG.push(o)};
CATS.forEach(c=>add({id:c.id,en:c.en,ar:c.ar,e:c.e,c:c.c,sub:1,list:[]}));
const g=CATALOG.find(c=>c.id==='g_culture');if(g)['tools','kitchen','aid'].forEach(i=>{if(!g.grp.includes(i))g.grp.push(i)});
const it=CATALOG.find(c=>c.id==='itx');if(it&&!it.grp.includes('itlearn'))it.grp.push('itlearn');
Object.assign(IC,{tools:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',kitchen:'<path d="M4 11h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z"/><path d="M9 4v4M13 4v4"/>',aid:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M12 11v5M9.5 13.5h5M9 7V5h6v2"/>',itlearn:IC.learning});
const ST={};
function draw(){if(typeof cat==='undefined')return;const c=CATS.find(x=>x.id===cat);if(!c)return;const gr=$('#grid');if(!gr)return;const v=ST[cat]||'',key=cat+'|'+v;const r=gr.querySelector('.gx-root');if(r&&r.dataset.k===key)return;
 const bk=(t)=>`<button type="button" class="pill" data-gx="${c.id}:" style="margin-bottom:12px">← ${t}</button>`;
 let h;const it=c.items.find(x=>x[0]===v);
 if(it)h=`<div class="rl gx-root" data-k="${key}" style="grid-column:1/-1">${bk(E(c.ar))}<div class="rt-hd" style="--a:${c.a};--b:${c.b}"><span class="rt-i">${it[1]}</span><div><h3>${E(it[2])}</h3></div></div>${it[3]}</div>`;
 else h=`<div class="rl gx-root" data-k="${key}" style="grid-column:1/-1"><h3 class="rt-h">${c.e} ${E(c.ar)}</h3><div class="rt-grid">${c.items.map((x,i)=>`<button type="button" class="rt-t" data-gx="${c.id}:${x[0]}" style="--a:${c.a};--b:${c.b};--i:${i}"><span class="rt-i">${x[1]}</span><span class="rt-x"><b>${E(x[2])}</b></span></button>`).join('')}</div></div>`;
 gr.innerHTML=h;const em=$('#empty');if(em)em.hidden=true}
function boot(){const gr=$('#grid');if(!gr){setTimeout(boot,300);return}new MutationObserver(()=>{try{draw()}catch(e){console.error(e)}}).observe(gr,{childList:true});draw()}
boot();
document.addEventListener('click',e=>{const b=e.target.closest('[data-gx]');if(b){const[k,v]=b.dataset.gx.split(':');ST[k]=v;draw();window.scrollTo({top:Math.max(0,($('#chips')||document.body).offsetTop-60),behavior:'smooth'});return}if(e.target.closest('#chips [data-c],#hzCb'))Object.keys(ST).forEach(k=>ST[k]='')},true);
const f2=n=>Number.isFinite(n)?n.toLocaleString('ar-EG',{maximumFractionDigits:2}):'—';
function run(f){const k=f.dataset.calc,v=n=>parseFloat((f.elements[n]||{}).value),o=f.querySelector('.rt-res');let t='';
 if(k=='zakat'){const m=v('m'),g=v('g');if(m>=0&&g>0){const ns=85*g;t=m>=ns?`النصاب ${f2(ns)} جنيه. زكاتك: ${f2(m*.025)} جنيه`:`النصاب ${f2(ns)} جنيه، وأنت لسه تحته، مفيش زكاة.`}}
 else if(k=='age'){const d=new Date(f.elements.d.value),n=new Date();if(!isNaN(d)&&d<=n){let y=n.getFullYear()-d.getFullYear(),m=n.getMonth()-d.getMonth(),dd=n.getDate()-d.getDate();if(dd<0){m--;dd+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}if(m<0){y--;m+=12}t=`${y} سنة و${m} شهر و${dd} يوم`}}
 else if(k=='unit'){const T=UN[f.elements.t.value],a=f.elements.a,b=f.elements.b;if(!a.options.length||a.dataset.t!==f.elements.t.value){const op=Object.keys(T).map(x=>`<option>${x}</option>`).join('');a.innerHTML=op;b.innerHTML=op;b.selectedIndex=1;a.dataset.t=f.elements.t.value}const x=v('v');if(!isNaN(x))t=`${f2(x*T[a.value]/T[b.value])} ${b.value}`}
 else if(k=='hijri'){const d=new Date(f.elements.d.value+'T12:00:00');if(!isNaN(d)){try{t=d.toLocaleDateString('ar-EG-u-ca-islamic',{day:'numeric',month:'long',year:'numeric'})}catch(_){}}}
 else if(k=='disc'){const p=v('p'),d=v('d');if(p>=0&&d>=0)t=`بعد الخصم: ${f2(p*(1-d/100))}، وفرت ${f2(p*d/100)}`}
 else if(k=='loan'){const p=v('p'),r=v('r')/1200,n=v('n');if(p>0&&n>0&&r>=0){const m=r?p*r/(1-Math.pow(1+r,-n)):p/n;t=`القسط الشهري: ${f2(m)}، وإجمالي المدفوع: ${f2(m*n)}`}}
 o.textContent=t}
['input','change'].forEach(ev=>document.addEventListener(ev,e=>{const f=e.target.closest('form[data-calc]');if(f)run(f)}));
document.addEventListener('click',e=>{const f=e.target.closest('form[data-calc="unit"]');if(f)setTimeout(()=>run(f),0)});
new MutationObserver(()=>{const f=document.querySelector('form[data-calc="unit"]');if(f&&!f.elements.a.options.length)run(f)}).observe(document.body,{childList:true,subtree:true});
try{renderChips();render()}catch(_){}
})();

/* ---------- 10) حرف يدوية + شكل الصفحة الرئيسية (الرئيسية + 3 فئات + أيقونات الأقسام) ---------- */
(function(){
'use strict';
const $=s=>document.querySelector(s),E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const li=s=>s.split(',').map(x=>x.split(':')),sp=li;
const add=o=>{if(!CATALOG.some(c=>c.id===o.id))CATALOG.push(o)};
const CR=[
['embroidery','Embroidery','تطريز','🪡',['#DB2777','#831843'],'Hand embroidery:تطريز يدوي,Machine embroidery:تطريز ماكينة,Names & logos:تطريز أسماء ولوجو,Bridal embroidery:تطريز فساتين وجهاز عروسة,Tarz & traditional:تطريز تراثي وخيامية'],
['tailoring','Tailoring & Sewing','تفصيل وخياطة','✂️',['#7C3AED','#4C1D95'],'Women tailoring:تفصيل حريمي,Men tailoring:تفصيل رجالي,Kids clothes:ملابس أطفال,Alterations & repairs:تعديل وتصليح ملابس,Curtains & bedding:ستائر ومفروشات,Abayas & dresses:عبايات وفساتين'],
['knit','Crochet & Knitting','كروشيه وتريكو','🧶',['#F97316','#9A3412'],'Crochet:كروشيه,Knitting:تريكو,Baby sets:أطقم مواليد,Bags & decor:شنط وديكور,Macrame:مكرمية'],
['handmade','Handmade Accessories','إكسسوارات هاند ميد','💍',['#0EA5E9','#1E3A8A'],'Jewelry:مجوهرات وإكسسوارات,Beads:خرز,Hair accessories:إكسسوارات شعر,Keychains:ميداليات,Resin art:رزن وأعمال يدوية'],
['pottery','Pottery & Glass','فخار وخزف وزجاج','🏺',['#B45309','#78350F'],'Pottery:فخار,Ceramics:خزف,Mosaic & glass:زجاج ومعشّق,Painted items:أشغال مرسومة بالإيد'],
['leather','Leather & Crafts','جلود ومشغولات','👜',['#92400E','#451A03'],'Leather bags:شنط جلد,Wallets & belts:محافظ وأحزمة,Shoes:أحذية يدوية,Repairs:تصليح جلديات'],
['decor','Handmade Decor','ديكور وأرابيسك','🏮',['#0D9488','#134E4A'],'Arabesque:أرابيسك,Mashrabiya:مشربية,Wall art:لوحات وتحف,Candles & soap:شموع وصابون,Fabric & tent art:خيامية'],
['gifts','Gifts & Packaging','هدايا وتغليف','🎁',['#EF4444','#7F1D1D'],'Gift boxes:بوكسات هدايا,Packaging:تغليف,Custom gifts:هدايا بالطلب,Party favors:توزيعات']];
CR.forEach(x=>add({id:x[0],en:x[1],ar:x[2],e:x[3],c:x[4],sub:1,list:li(x[5])}));
add({id:'crafts',en:'Handicrafts',ar:'حرف يدوية',e:'🧵',c:['#E11D48','#881337'],sub:1,list:[],grp:CR.map(x=>x[0])});
const gp=CATALOG.find(c=>c.id==='g_products');if(gp&&!gp.grp.includes('crafts'))gp.grp.push('crafts');
const P={crafts:'<path d="M4 20 18 6"/><circle cx="19" cy="5" r="1.5"/><path d="M6 18c3-1 1-5 5-4"/>',embroidery:'<path d="M4 20 18 6"/><circle cx="19" cy="5" r="1.5"/><path d="M6 18c3-1 1-5 5-4"/>',tailoring:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',knit:'<circle cx="12" cy="12" r="8"/><path d="M5 9c5 3 9 3 14 0M5 15c5-3 9-3 14 0M12 4c-3 5-3 11 0 16"/>',handmade:'<circle cx="12" cy="14" r="6"/><path d="m9 8 3-4 3 4"/>',pottery:'<path d="M8 3h8M9 3c0 3-4 4-4 9a7 7 0 0 0 14 0c0-5-4-6-4-9"/>',leather:'<rect x="4" y="7" width="16" height="12" rx="2"/><path d="M9 7V5h6v2"/>',decor:'<path d="M12 3l3 6 6 1-4.5 4 1.5 6-6-3.5L6 20l1.5-6L3 10l6-1z"/>',gifts:'<rect x="3" y="9" width="18" height="11" rx="1"/><path d="M12 9v11M3 13h18M12 9c-3-6-7-3-4 0M12 9c3-6 7-3 4 0"/>'};
Object.assign(IC,P);
try{Object.assign(RT,{crafts:'حرف يدوية هاند ميد تطريز تفصيل خياطة كروشيه تريكو فخار جلد أرابيسك هدايا',embroidery:'تطريز',tailoring:'تفصيل خياطة ترزي فستان عباية',knit:'كروشيه تريكو'})}catch(_){}
try{
 const ids=CR.map(x=>x[0]);CAT_FOR.product.push(...ids);CAT_FOR.service.push(...ids);
 FORMS.product=FORMS.product||{};FORMS.service=FORMS.service||{};
 ids.forEach(i=>{FORMS.product[i]=[['kind','Type','النوع','t'],['mat','Material','الخامة','t'],['time','Delivery time','مدة التنفيذ','t']];FORMS.service[i]=[['kind','Service','الخدمة','t'],['time','Delivery time','مدة التنفيذ','t'],['mode','Format','الطريقة','s',sp('On site:حضوري,Online:أونلاين,Both:الاتنين')]]});
}catch(_){}
/* ---- أيقونات الأقسام الفرعية: صف مرصوص بحركة تفتّح الوردة ---- */
const sh=(a,b)=>`--a:${a};--b:${b}`;
window.hzGroup=function(id){const p=CATALOG.find(x=>x.id===id);if(!p||!p.grp)return '';const rtl=getComputedStyle(document.documentElement).direction==='rtl'||document.body.classList.contains('ar'),sg=rtl?-1:1;
 const items=p.grp.map(i=>CATALOG.find(c=>c.id===i)).filter(Boolean);
 return `<div class="hz-gw" style="grid-column:1/-1"><div class="hz-gg">${items.map((c,i)=>{const col=i%4,row=Math.floor(i/4);return `<button type="button" class="hz-gt" data-c="${c.id}" style="${sh(c.c[0],c.c[1])};--i:${i};--dx:${sg*(1.5-col)*110}%;--dy:${-row*110}%"><span class="hz-gi"><svg viewBox="0 0 24 24" class="gi">${IC[c.id]||IC.all}</svg></span><b>${E(N(c))}</b></button>`}).join('')}</div></div>`};
/* ---- الرئيسية في مستطيل بيضاوي + 3 فئات متناسقة مع تمييز الفئة الحالية ---- */
const TOPS=['g_products','g_services','g_culture'];
const topOf=id=>{let cur=id,n=0;while(n++<6){const q=CATALOG.find(x=>x.grp&&x.grp.includes(cur));if(!q)break;cur=q.id}return cur};
function restyle(){const ch=$('#chips');if(!ch)return;
 let w=$('#hzHomeW');if(!w){w=document.createElement('div');w.id='hzHomeW';ch.before(w)}
 const home=typeof cat!=='undefined'&&(cat==='all');
 w.innerHTML=`<button type="button" data-c="all" class="${home?'on':''}"><svg viewBox="0 0 24 24" class="gi">${IC.all}</svg>${(typeof L==='function')?L('Home','الرئيسية'):'الرئيسية'}</button>`;
 const top=typeof cat!=='undefined'?topOf(cat):'all',inG=TOPS.includes(top);
 ch.querySelectorAll('button.tile').forEach(b=>{const id=b.dataset.c;if(id==='all'){b.style.display='none';return}const ti=b.querySelector('.ti');if(ti){const st=ti.getAttribute('style')||'';const m=st.match(/--a:([^;]+);--b:([^;]+)/);if(m){b.style.setProperty('--a',m[1]);b.style.setProperty('--b',m[2])}}b.classList.toggle('on',id===top);b.classList.toggle('dim',inG&&id!==top)})}
const oRC=window.renderChips;if(typeof oRC==='function')window.renderChips=function(){const r=oRC.apply(this,arguments);try{restyle()}catch(e){}return r};
const st=document.createElement('style');st.textContent=`
#hzHomeW{display:flex;justify-content:center;margin:10px 14px 6px}
#hzHomeW button{display:flex;align-items:center;gap:8px;padding:9px 30px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 2px 10px rgba(14,21,48,.06);transition:transform .2s,box-shadow .2s}
#hzHomeW button .gi{width:18px;height:18px;color:var(--p)}
#hzHomeW button.on{background:linear-gradient(135deg,#0F766E,#155E75);color:#fff;border-color:transparent;box-shadow:0 8px 18px -8px #0F766E}
#hzHomeW button.on .gi{color:#fff}
#hzHomeW button:active{transform:scale(.96)}
#chips.chips{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:10px!important;overflow:visible!important;padding:6px 14px 10px!important;justify-content:stretch!important}
#chips.chips button.tile{width:auto!important;min-width:0;padding:12px 4px 10px!important;border-radius:20px!important;background:var(--card)!important;border:1.5px solid var(--line)!important;box-shadow:0 3px 12px rgba(14,21,48,.06)!important;gap:7px!important;transition:opacity .35s,transform .35s cubic-bezier(.3,1.5,.5,1),filter .35s,box-shadow .35s,border-color .3s}
#chips.chips .ti{width:54px!important;height:54px!important;border-radius:18px!important}
#chips.chips .gi{width:25px!important;height:25px!important}
#chips.chips .tile b{font-size:12px!important;white-space:normal;text-align:center}
#chips.chips button.tile.on{border-color:var(--a)!important;background:color-mix(in srgb,var(--a) 10%,var(--card))!important;box-shadow:0 0 0 2px var(--a),0 12px 22px -10px var(--a)!important;transform:translateY(-3px) scale(1.04)!important}
#chips.chips button.tile.on b{color:var(--ink)!important}
#chips.chips button.tile.dim{opacity:.42;filter:saturate(.25);transform:scale(.93)!important}
#chips.chips button.tile.dim:hover{opacity:.8}
.hz-gg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 8px;padding:6px 2px 14px}
.hz-gt{display:flex;flex-direction:column;align-items:center;gap:6px;border:0;background:none;color:var(--ink);font:inherit;cursor:pointer;padding:0;animation:hzBloom .75s cubic-bezier(.2,.9,.3,1.15) both;animation-delay:calc(var(--i)*60ms)}
.hz-gi{width:100%;max-width:64px;aspect-ratio:1;border-radius:20px;display:grid;place-items:center;color:var(--a);background:color-mix(in srgb,var(--a) 12%,var(--card));border:1px solid color-mix(in srgb,var(--a) 24%,transparent);transition:transform .2s,background .2s}
.hz-gi .gi{width:46%!important;height:46%!important}
.hz-gt:active .hz-gi{transform:scale(.9);background:linear-gradient(135deg,var(--a),var(--b));color:#fff}
.hz-gt b{font-size:11px;font-weight:600;line-height:1.3;text-align:center;color:var(--ink)}
@keyframes hzBloom{0%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.1) rotate(-100deg)}65%{opacity:1;transform:translate(0,0) scale(1.1) rotate(6deg)}100%{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.hz-gt{animation:none}}`;
document.head.appendChild(st);
function boot(){const g=$('#grid');if(!g){setTimeout(boot,300);return}new MutationObserver(()=>{try{restyle()}catch(e){}}).observe(g,{childList:true});restyle()}
boot();
try{renderChips();render()}catch(_){}
})();

/* ---------- 11) عنوان القسم برمز متحرك + مستطيل الرئيسية أعرض + إخفاء "رائج في" ---------- */
(function(){
'use strict';
const $=s=>document.querySelector(s),E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AN={kids:'bounce',sports:'pump',religion:'glow',travel:'fly',food:'wig',kitchen:'wig',tools:'wig',crafts:'wig',embroidery:'wig',tailoring:'wig',knit:'wig',health:'beat',aid:'beat',healthsport:'beat',news:'pulse',countries:'spin',g_culture:'spin',tech:'pulse',electronics:'pulse',itx:'pulse',dev:'pulse',itdata:'pulse',itlearn:'pulse',edu:'bounce',events:'bounce',gifts:'bounce',cars:'fly',realestate:'float',offers:'beat',perfumes:'glow',bride:'beat',g_products:'bounce',g_services:'wig'};
function title(){const g=$('#grid');if(!g)return;let t=$('#hzTitle');const q=(($('#q')||{}).value||'').trim();const c=typeof cat!=='undefined'?CATALOG.find(x=>x.id===cat):null;
 if(!c||cat==='all'||q){if(t)t.hidden=true;return}
 if(!t){t=document.createElement('div');t.id='hzTitle';const cb=$('#hzCb');if(cb&&cb.parentNode===g.parentNode)cb.after(t);else g.before(t)}
 const key=cat+'|'+(typeof lang!=='undefined'?lang:'');t.hidden=false;
 if(t.dataset.k!==key){t.dataset.k=key;const nm=typeof N==='function'?N(c):c.ar;
  const ic=c.e?`<span class="hz-te">${c.e}</span>`:`<svg viewBox="0 0 24 24" class="gi">${IC[c.id]||IC.all}</svg>`;
  t.style.setProperty('--a',c.c[0]);t.style.setProperty('--b',c.c[1]);
  t.innerHTML=`<span class="hz-tb an-${AN[c.id]||'float'}">${ic}<i class="hz-sh"></i></span><span class="hz-tx"><small>${typeof L==='function'?L('Section','قسم'):'قسم'}</small><b>${E(nm)}</b></span>`}
 const h=g.querySelector(':scope>div>h3');if(h&&typeof N==='function'&&h.textContent.replace(/[^\p{L}\s]/gu,'').trim()===N(c).trim())h.style.display='none'}
function boot(){const g=$('#grid');if(!g){setTimeout(boot,300);return}new MutationObserver(()=>{try{title()}catch(e){}}).observe(g,{childList:true});$('#q')&&$('#q').addEventListener('input',()=>setTimeout(title,0));title()}
boot();
const st=document.createElement('style');st.textContent=`
#secTrend{display:none!important}
#hzHomeW{margin:10px 14px 6px!important}
#hzHomeW button{width:100%;justify-content:center;padding:11px 20px!important;font-size:15px!important}
#hzTitle{display:flex;align-items:center;gap:12px;margin:6px 14px 10px}
#hzTitle[hidden]{display:none}
.hz-tb{position:relative;width:54px;height:54px;border-radius:18px;display:grid;place-items:center;flex:none;overflow:hidden;color:#fff;background:linear-gradient(135deg,var(--a),var(--b));box-shadow:0 10px 20px -8px var(--a)}
.hz-te{font-size:28px;line-height:1;display:block}.hz-tb .gi{width:28px;height:28px}
.hz-sh{position:absolute;top:-20%;left:-60%;width:40%;height:140%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent);transform:skewX(-20deg);animation:hzShine 3s ease-in-out infinite}
.hz-tx{display:grid;line-height:1.2}.hz-tx small{color:var(--mut);font-size:12px}.hz-tx b{font-size:21px}
.hz-te,.hz-tb .gi{animation:hzFloat 2.8s ease-in-out infinite}
.an-bounce .hz-te{animation:hzBounce 1.4s ease-in-out infinite}
.an-pump .hz-te{animation:hzPump 1.1s ease-in-out infinite}
.an-glow .hz-te{animation:hzGlow 2.4s ease-in-out infinite}
.an-fly .hz-te{animation:hzFly 2.6s ease-in-out infinite}
.an-wig .hz-te{animation:hzWig 1.8s ease-in-out infinite}
.an-beat .hz-te{animation:hzBeat 1.3s ease-in-out infinite}
.an-pulse .hz-te{animation:hzPulse 1.8s ease-in-out infinite}
.an-spin .hz-te{animation:hzSpin 5s linear infinite}
@keyframes hzShine{0%,55%{left:-60%}100%{left:130%}}
@keyframes hzFloat{50%{transform:translateY(-3px)}}
@keyframes hzBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px) scale(1.08)}60%{transform:translateY(0) scale(.95)}}
@keyframes hzPump{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.18) rotate(-10deg)}}
@keyframes hzGlow{0%,100%{filter:drop-shadow(0 0 0 #fff);transform:scale(1)}50%{filter:drop-shadow(0 0 8px #fff);transform:scale(1.1)}}
@keyframes hzFly{0%,100%{transform:translate(-4px,2px)}50%{transform:translate(5px,-4px) rotate(6deg)}}
@keyframes hzWig{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
@keyframes hzBeat{0%,100%{transform:scale(1)}20%{transform:scale(1.22)}40%{transform:scale(1)}60%{transform:scale(1.15)}}
@keyframes hzPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:.85}}
@keyframes hzSpin{to{transform:rotateY(360deg)}}
@media (prefers-reduced-motion:reduce){.hz-te,.hz-tb .gi,.hz-sh{animation:none}}`;
document.head.appendChild(st);
try{render()}catch(_){}
})();
