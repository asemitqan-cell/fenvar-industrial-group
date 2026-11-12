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
