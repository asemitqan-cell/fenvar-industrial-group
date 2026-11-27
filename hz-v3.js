/* Horizon v3 layer (hz-v36)
   1) الطلبات: شاشة واحدة (تتبع طلبي + طلباتي + طلبات العملاء) بتتفتح من القايمة الجانبية ومن الإعدادات.
      وأي زرار تاني لـ"طلباتي / طلبات العملاء" ظاهر في الإعدادات أو البروفايل بيتدمج فيها.
   2) حركة أيقونات الأقسام الفرعية (تشطيبات وأثاث ...) بقت دخول هادي بدل الدوران.
   3) الرجوع: أي شاشة بتتفتح من البروفايل (إعدادات / إشعارات / دردشات / منشور جديد) زرار × بتاعها بيرجّعك للبروفايل.
   بيتحمّل آخر ملف بعد hz-v2.js. */
(function(){'use strict';
if(window.__hzV3)return;window.__hzV3=1;
const $q=s=>document.querySelector(s);
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const U=()=>typeof user!=='undefined'?user:null;
const SBC=()=>typeof sb!=='undefined'?sb:null;
const say=m=>{try{toast(m)}catch(_){}};
const chev=()=>(typeof lang!=='undefined'&&lang==='ar')?'‹':'›';

/* ---------- CSS ---------- */
const st=document.createElement('style');st.textContent=`
/* أيقونات الأقسام الفرعية: دخول هادي (طلوع بسيط + ظهور) بدل الدوران من أماكن مختلفة */
@keyframes hzBloom{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}
.hz-gt{animation-duration:.5s!important;animation-timing-function:cubic-bezier(.22,.8,.3,1)!important;animation-delay:calc(var(--i)*45ms)!important}
.hz-gi{transition:transform .25s cubic-bezier(.22,.8,.3,1),background .2s,color .2s}
@media (hover:hover){.hz-gt:hover .hz-gi{transform:translateY(-3px)}}
.hz-gt:active .hz-gi{transform:scale(.94)}
/* شاشة الطلبات */
.od-h{margin:2px 0 2px;font-size:21px}
.od-p{margin:0 0 4px;color:var(--mut);font-size:13px;line-height:1.6}
.od-sec{margin:18px 2px 8px;font-size:13px;font-weight:800;color:var(--mut)}
.od-r{display:flex;align-items:center;gap:12px;width:100%;text-align:start;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:18px;padding:14px;margin:0 0 8px;font:inherit;cursor:pointer}
.od-r:active{background:color-mix(in srgb,var(--p) 7%,var(--card))}
.od-r i{font-style:normal;font-size:24px;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:none;background:color-mix(in srgb,var(--p) 11%,var(--card))}
.od-r span{display:grid;gap:2px;flex:1;min-width:0}.od-r b{font-size:15px}.od-r small{color:var(--mut);font-size:12px;line-height:1.5}
.od-r em{font-style:normal;font-size:22px;line-height:1;color:var(--mut)}
.od-tk{border:1px solid var(--line);background:var(--card);border-radius:18px;padding:14px;display:grid;gap:10px;margin:0 0 10px}
.od-tk>b{font-size:14.5px}.od-tk small{color:var(--mut);line-height:1.6}
.od-s{display:flex;gap:4px}.od-s span{flex:1;text-align:center;font-size:11px;color:var(--mut)}
.od-s i{display:grid;place-items:center;width:26px;height:26px;margin:0 auto 4px;border-radius:50%;background:var(--line);font-style:normal;font-weight:700;color:var(--mut)}
.od-s .ok i{background:#d1fae5;color:#065f46}.od-s .on i{background:var(--p);color:#fff}.od-s .on{color:var(--p);font-weight:700}
.od-e{text-align:center;color:var(--mut);padding:18px 12px;border:1px dashed var(--line);border-radius:16px;line-height:1.8;font-size:13.5px}
.od-e .btn{margin-top:8px}
/* لوحة المالك + الفحص السريع */
.ow-h{margin:2px 0 4px;font-size:21px}
.ow-g{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:10px 0}
.ow-k{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px}
.ow-k[data-owd],.ow-card[data-owd]{cursor:pointer}.ow-k[data-owd]::after,.ow-card[data-owd]::after{content:'اضغط للتفاصيل ›';display:block;margin-top:6px;font-size:11px;color:var(--p)}
.ow-k b{display:block;font-size:22px;line-height:1.2}.ow-k small{color:var(--mut);font-size:12px}
.ow-s{margin:18px 2px 8px;font-size:13px;font-weight:800;color:var(--mut)}
.ow-pb{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:6px 0 2px}.ow-pb i{display:block;height:100%;background:var(--p);border-radius:99px}
.ow-card{border:1px solid var(--line);background:var(--card);border-radius:16px;padding:12px;margin:0 0 8px;display:grid;gap:6px}
.ow-card>b{font-size:15px}.ow-row{display:flex;justify-content:space-between;gap:8px;font-size:13px}.ow-row span:first-child{color:var(--mut)}
.ow-bars{display:flex;align-items:flex-end;gap:4px;height:70px;padding:6px 2px}.ow-bars i{flex:1;min-width:6px;background:var(--p);border-radius:5px 5px 0 0;opacity:.85}
.ow-ck{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;line-height:1.6;padding:6px 2px;border-bottom:1px solid var(--line)}
.ow-ck i{font-style:normal;flex:none}
/* أيقونات SVG حقيقية بدل الإيموجي */
.hzi{width:1.2em;height:1.2em;vertical-align:-.22em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.hzi.f{fill:currentColor;stroke:none}
#hzDock .dk-b .hzi{width:24px;height:24px;stroke-width:1.7}
.od-r i .hzi,.hb-r i .hzi{width:22px;height:22px}
#chat .ch>span .hzi{width:18px;height:18px;stroke:#fff}
#chat .hzc-hello i .hzi{width:30px;height:30px;stroke:#fff}
/* عنوان القسم: أيقونة ثابتة بدون حركة */
#hzTitle,#hzTitle *{animation:none!important}
/* عينة 3D: لو الهَب ظاهر، الزرار القديم بيتخفي (كان مكرر) */
body.hzhub #hzSimBtn{display:none!important}
/* بحث الطلبات */
.od-q{display:flex;align-items:center;gap:8px;border:1.5px solid var(--line);background:var(--card);border-radius:16px;padding:0 12px;margin:0 0 10px}
.od-q:focus-within{border-color:var(--p)}
.od-q input{flex:1;min-width:0;border:0!important;background:none!important;outline:none;padding:12px 2px;font:inherit;font-size:15px;color:var(--ink)}
.od-no{display:inline-block;font-weight:800;color:var(--p);margin-inline-end:6px}
.od-qt{border:1px solid var(--line);background:var(--card);border-radius:18px;padding:12px;margin:0 0 10px;display:grid;gap:6px}
.od-qt b{font-size:14px}.od-qt small{color:var(--mut);line-height:1.6}
.od-qt .ow-pb{margin:2px 0}
.ow-pl{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
@media (prefers-reduced-motion:reduce){.hz-gt{animation:none!important}}
#hsBody [data-qxrow]{display:none!important}
/* زر ✦ القديم جوه البحث: مخفي دايماً (بيظهر بس وقت التسجيل الصوتي) */
.sb:not(.rec) #aiGo{display:none!important}
/* البار السفلي: لون أغمق بدرجة + ظل خفيف عشان ما يتداخلش مع الصفحة */
.bar{background:color-mix(in srgb,var(--bg) 84%,var(--ink) 9%)!important;-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);border-top:1px solid color-mix(in srgb,var(--ink) 11%,transparent)!important;box-shadow:0 -12px 30px -16px rgba(11,42,46,.4)}
[data-theme=dark] .bar{background:color-mix(in srgb,var(--bg) 78%,#000 22%)!important}
/* مساعد Horizon: شكل شبه Claude (شاشة كاملة على الموبايل، رسائل نظيفة، مربع كتابة دائري) */
#chat{top:var(--vt,0px)!important;bottom:auto!important;inset-inline:0!important;max-width:none!important;margin:0!important;height:var(--vh,100dvh)!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:var(--bg)!important}
#chat.min{top:auto!important;bottom:calc(10px + env(safe-area-inset-bottom))!important;inset-inline:10px!important;height:54px!important;border:1px solid var(--line)!important;border-radius:20px!important;box-shadow:0 14px 34px -14px rgba(0,0,0,.4)!important}
@media (min-width:760px){#chat:not(.min){top:4vh!important;bottom:4vh!important;height:auto!important;max-width:760px!important;margin-inline:auto!important;border:1px solid var(--line)!important;border-radius:26px!important;box-shadow:0 30px 80px rgba(0,0,0,.3)!important}}
#chat .ch{background:none!important;color:var(--ink)!important;gap:10px;padding:calc(8px + env(safe-area-inset-top)) 14px 8px;min-height:56px;border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent)}
#chat.min .ch{padding-top:8px;border-bottom:0}
#chat .ch>span{width:32px;height:32px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#0F766E,#6D5BD0);color:#fff;font-size:16px;flex:none}
#chat .ch b{font-size:16.5px;font-weight:800;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#chat .ch .wa[href]:not([hidden]){font-size:0!important;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--p) 13%,transparent);flex:none}
#chat .ch .wa[href]:not([hidden])::before{content:'💬';font-size:16px}
#chat .ch button{background:color-mix(in srgb,var(--ink) 7%,transparent)!important;color:var(--ink)!important;width:34px;height:34px;border-radius:50%;font-size:17px;line-height:1}
#chat .cb{width:100%;max-width:720px;margin-inline:auto;padding:20px 16px 12px;gap:20px;box-sizing:border-box}
#chat .m{max-width:100%;padding:0;border-radius:0;font-size:15.5px;line-height:1.95;background:none}
#chat .m.u{align-self:flex-end;max-width:85%;padding:11px 17px;border-radius:22px 22px 6px 22px;background:color-mix(in srgb,var(--ink) 7%,var(--bg));color:var(--ink);font-size:15px;line-height:1.8}
html[dir=rtl] #chat .m.u{align-self:flex-start}
#chat .m.a{align-self:stretch;color:var(--ink)}
#chat .m.a::before{content:'✦';display:grid;place-items:center;width:24px;height:24px;margin-bottom:8px;border-radius:8px;background:linear-gradient(135deg,#0F766E,#6D5BD0);color:#fff;font-size:12px}
#chat .m .btn{margin:10px 6px 0 0;padding:9px 16px;font-size:13.5px;border-radius:999px}
#chat .hzc-hello{margin:auto;text-align:center;padding:10px 20px;display:grid;gap:8px;justify-items:center}
#chat .hzc-hello i{width:58px;height:58px;border-radius:20px;display:grid;place-items:center;font-style:normal;font-size:28px;color:#fff;background:linear-gradient(135deg,#0F766E,#6D5BD0);box-shadow:0 16px 30px -16px #6D5BD0}
#chat .hzc-hello b{font-size:22px}#chat .hzc-hello small{color:var(--mut);font-size:14px;line-height:1.7;max-width:280px}
#chat #v2ch{flex-wrap:wrap;overflow:visible;gap:8px;padding:4px 16px 10px;width:100%;max-width:720px;margin-inline:auto;box-sizing:border-box}
#chat #v2ch button{padding:9px 15px;font-size:13.5px;border-radius:999px}
#chat #cAtt{width:100%;max-width:720px;margin-inline:auto;box-sizing:border-box}
#chat .cf{width:calc(100% - 24px);max-width:720px;margin:0 auto calc(12px + env(safe-area-inset-bottom));box-sizing:border-box;padding:6px;gap:6px;align-items:center;border:1px solid color-mix(in srgb,var(--ink) 14%,transparent)!important;border-radius:28px;background:var(--card);box-shadow:0 10px 28px -16px rgba(11,42,46,.45)}
#chat .cf:focus-within{border-color:var(--p)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--p) 16%,transparent),0 10px 28px -16px rgba(11,42,46,.45)}
#chat .cf input{border:0!important;background:none!important;padding:10px 6px;font-size:16px;border-radius:0;outline:none}
#chat #cPlus{width:40px;height:40px;border-radius:50%!important;font-size:22px}
#chat #cGo{width:40px;height:40px;padding:0;border-radius:50%;background:var(--p);font-size:0;display:grid;place-items:center;transition:opacity .2s,transform .15s}
#chat #cGo::before{content:'↑';font-size:21px;font-weight:700;line-height:1;color:#fff}
#chat #cGo:active{transform:scale(.92)}
#chat #cIn:placeholder-shown~#cGo{opacity:.38}
#chat.min .hzc-hello{display:none}`;
document.head.appendChild(st);

/* ---------- فتح شاشة فوق الحالية (ونفتكر الحالية عشان زرار الرجوع) ---------- */
function showModal(id){const el=$q(id);if(!el)return;
 const cur=[...document.querySelectorAll('.modal')].filter(m=>!m.hidden&&('#'+m.id)!==id).pop();
 try{if(cur&&MS[MS.length-1]!=='#'+cur.id)MS.push('#'+cur.id)}catch(_){}
 el.hidden=false;try{hzBk(el)}catch(_){}}

/* ---------- مشاركة التطبيق ---------- */
window.hzShare=function(){const u=location.href.split('#')[0];
 if(navigator.share){navigator.share({title:'Horizon',text:T('Join me on Horizon','انضم معايا على أفق'),url:u}).catch(()=>{})}
 else if(navigator.clipboard){navigator.clipboard.writeText(u).then(()=>say(T('Link copied','اللينك اتنسخ'))).catch(()=>{})}
 else say(u)};

/* ---------- الطلبات ---------- */
const SECN={upvc:'UPVC',furniture:'موبيليا',wood:'خشب',iron:'حديد',paints:'دهانات'};
const STG=['استلام','مراجعة','تنفيذ','تسليم'];
const DMAP={accepted:2,in_progress:2,delivered:3,closed:4};
function ensure(){if($q('#ordModal'))return;
 document.body.insertAdjacentHTML('beforeend','<div class="modal" id="ordModal" hidden><div class="sheet st"><button type="button" class="x" data-close>×</button><div id="ordBody"></div></div></div>')}
function draw(){const b=$q('#ordBody');if(!b)return;
 b.innerHTML=`<h3 class="od-h">📦 ${T('Orders','الطلبات')}</h3><p class="od-p">${T('Everything about your orders in one place.','كل حاجة تخص طلباتك في مكان واحد.')}</p>
 <div class="od-sec">${T('Track my order','تتبع طلبي')}</div>
 <label class="od-q"><svg class="hzi" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input id="odQ" type="search" inputmode="search" autocomplete="off" placeholder="${T('Type your request number or name','اكتب رقم طلبك أو اسم الطلب')}"></label>
 <div id="odTrack"><p class="od-e">…</p></div>
 <div class="od-sec">${T('Manage','إدارة الطلبات')}</div>
 <button type="button" class="od-r" data-od="mine"><i>🧾</i><span><b>${T('My requests','طلباتي')}</b><small>${T('Your requests, the offers you received and your deals','طلباتك والعروض اللي وصلتلك وصفقاتك وتقييم الموردين')}</small></span><em>${chev()}</em></button>
 <button type="button" class="od-r" data-od="prov"><i>📥</i><span><b>${T('Customer requests','طلبات العملاء')}</b><small>${T('For suppliers: requests sent to you, send your offer','للموردين: الطلبات اللي جاية ليك وقدّم عرضك')}</small></span><em>${chev()}</em></button>`}
let ORD=[],ORDX={deals:[],offs:[]};
function ordCard(q){const dl=ORDX.deals.find(x=>x.request_id===q.id&&x.stage!=='cancelled'),no=ORDX.offs.filter(x=>x.request_id===q.id&&x.status==='sent').length;
 const i=dl?(DMAP[dl.stage]!=null?DMAP[dl.stage]:2):(q.status==='offered'||no>0?1:0);
 const tx=dl?({accepted:'العرض اتقبل، المورد هيبدأ التنفيذ',in_progress:'الطلب قيد التنفيذ',delivered:'الطلب اتسلّم، أكّد استلامك من طلباتي',closed:'الطلب اتقفل ✓'}[dl.stage]||'الصفقة شغالة'):(no>0?'وصلت '+no+' عروض، راجعها واقبل الأنسب':'الطلب اتبعت للموردين وبنستنى عروضهم');
 const ln=(q.lines&&q.lines[0]&&q.lines[0].name)||'',sn=SECN[q.section]||'';
 return `<div class="od-tk"><b><span class="od-no">#${q.req_no||''}</span>${E([sn,ln].filter(Boolean).join(' · ')||T('Request','طلب'))}</b><div class="od-s">${STG.map((x,k)=>`<span class="${k<i?'ok':k===i?'on':''}"><i>${k<i?'✓':k+1}</i>${x}</span>`).join('')}</div><small>${tx}</small><button type="button" class="pill" data-od="mine">${T('Details','التفاصيل')}</button></div>`}
const nz=t=>String(t||'').toLowerCase().replace(/[\u064B-\u065F]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).trim();
function ordShow(){const box=$q('#odTrack');if(!box)return;const inp=$q('#odQ'),q=nz(inp&&inp.value).replace(/^#/,'');
 let list=ORD;
 if(q){const num=/^\d+$/.test(q)?+q:null;
  list=ORD.filter(r=>{if(num!=null&&(String(r.req_no)===String(num)||String(r.req_no).includes(q)))return true;
   const hay=nz([SECN[r.section],r.section,r.custom,r.city,...(r.lines||[]).map(l=>l&&l.name)].join(' '));return hay.includes(q)||String(r.id).startsWith(q)})}
 else list=ORD.slice(0,5);
 const hint=`<p class="od-p">${q?T('Results','النتايج')+': '+list.length:T('Your latest requests. Type a request number or name to find another one.','آخر طلباتك. اكتب رقم الطلب أو اسمه عشان تلاقي طلب تاني.')}</p>`;
 box.innerHTML=hint+(list.length?list.map(ordCard).join(''):`<div class="od-e">${T('No request matches. Try the number from your confirmation, or a word from the item name.','مفيش طلب بالاسم أو الرقم ده. جرّب رقم الطلب أو كلمة من اسم الصنف.')}</div>`)}
async function track(){const box=$q('#odTrack');if(!box)return;const u=U(),s=SBC();
 if(!u||!s){box.innerHTML=`<div class="od-e">${T('Sign in to see your orders.','سجّل دخول عشان تتابع طلباتك.')}<br><button type="button" class="btn" data-od="login">${T('Sign in','دخول')}</button></div>`;return}
 try{const r=await s.from('hz_quote_requests').select('id,req_no,status,created_at,lines,section,custom,city').eq('user_id',u.id).neq('status','cancelled').order('created_at',{ascending:false}).limit(60);
  if(r.error)throw r.error;ORD=r.data||[];
  if(!ORD.length){box.innerHTML=`<div class="od-e">${T('No orders yet. Request a quote from UPVC or Furniture and track it here.','لسه مفيش طلبات. اطلب عرض سعر من UPVC أو الموبيليا وتابعه من هنا.')}</div>`;return}
  const ids=ORD.map(x=>x.id),d=await s.from('hzq_deals').select('request_id,stage').in('request_id',ids),o=await s.from('hzq_offers').select('request_id,status').in('request_id',ids);
  ORDX={deals:d.data||[],offs:o.data||[]};ordShow()
 }catch(_){box.innerHTML=`<div class="od-e">${T('Could not load your orders. Check your connection and try again.','مقدرناش نحمّل طلباتك. اتأكد من النت وجرّب تاني.')}</div>`}}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='odQ')ordShow()});
window.hzOrders=function(){ensure();draw();showModal('#ordModal');track()};

document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-od]');if(!b)return;
 const k=b.dataset.od;
 if(k==='login'){if(typeof needLogin==='function')needLogin();return}
 if(!U()){say(T('Sign in first.','سجّل دخول الأول.'));if(typeof needLogin==='function')needLogin();return}
 if(!window.hzQuotes){say(T('Orders are not available right now. Refresh and try again.','الطلبات مش متاحة دلوقتي. حدّث الصفحة وجرّب تاني.'));return}
 const m=$q('#ordModal');try{if(MS[MS.length-1]!=='#ordModal')MS.push('#ordModal')}catch(_){}
 if(m)m.hidden=true;
 try{window.hzQuotes(k)}catch(_){if(m)m.hidden=false}});

/* ---------- × في شاشة متابعة العروض: يرجّعك للطلبات لو اتفتحت منها ---------- */
document.addEventListener('click',e=>{if(!(e.target.closest&&e.target.closest('[data-qx="close"]')))return;
 let top;try{top=MS[MS.length-1]}catch(_){return}if(top!=='#ordModal')return;
 setTimeout(()=>{try{MS.pop()}catch(_){}const q=$q('#qxModal'),o=$q('#ordModal');if(q)q.hidden=true;if(o){o.hidden=false;track()}},0)},true);

/* ---------- دمج أي تكرار لـ"طلباتي / طلبات العملاء" في الإعدادات والبروفايل ---------- */
const RX=/(طلباتي|طلبات العملاء|My requests|Customer requests|Meine Anfragen|Kundenanfragen)/;
function retitle(x){const w=document.createTreeWalker(x,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){if(RX.test(n.nodeValue)){n.nodeValue=T('Orders','الطلبات');return}}}
function merge(){['#hsBody','#pfBody'].forEach(sel=>{const root=$q(sel);if(!root)return;
 const items=[...root.querySelectorAll('button,a')].filter(x=>!x.dataset.odDone&&!x.matches('[data-hs="ord"],[data-od],[data-odopen]')&&(x.textContent||'').length<90&&RX.test(x.textContent||''));
 if(!items.length)return;
 const official=!!root.querySelector('[data-hs="ord"]');
 items.forEach((x,i)=>{x.dataset.odDone='1';
  if(!official&&i===0){x.dataset.odopen='1';retitle(x)}else x.style.display='none'})})}
document.addEventListener('click',e=>{const x=e.target.closest&&e.target.closest('[data-odopen]');if(!x)return;
 e.preventDefault();e.stopImmediatePropagation();const sm=$q('#setModal');if(sm&&!sm.hidden)sm.hidden=true;window.hzOrders()},true);
let raf=0;new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;try{merge()}catch(_){}})}).observe(document.body,{childList:true,subtree:true});
try{merge()}catch(_){}

/* ---------- زرار × / الضغط بره: لو الشاشة اتفتحت من البروفايل يرجّعك للبروفايل ---------- */
document.addEventListener('click',e=>{const t=e.target;if(!t||!t.matches)return;
 if(!(t.matches('[data-close]')||t.classList.contains('modal')))return;
 let top;try{top=MS[MS.length-1]}catch(_){return}
 if(top!=='#profModal')return;
 const cur=[...document.querySelectorAll('.modal')].filter(m=>!m.hidden).pop(),pm=$q('#profModal');
 if(!cur||!pm||cur===pm)return;
 e.stopImmediatePropagation();e.preventDefault();
 try{MS.pop()}catch(_){}
 cur.hidden=true;pm.hidden=false;
 try{if(typeof setBar==='function')setBar('barProf')}catch(_){}},true);

/* ---------- لوحة المالك (أرقام من السيرفر: hzq_stats + hzq_revenue، والسيرفر هو اللي بيتأكد إنك المالك) ---------- */
const SECA={upvc:'UPVC',furniture:'موبيليا',wood:'خشب',iron:'حديد',paints:'دهانات',nursing:'تمريض'};
const ltr=t=>'<bdi dir="ltr">'+t+'</bdi>';
const fmn=n=>Number(n||0).toLocaleString('en-US',{maximumFractionDigits:0});
const mins=m=>m==null?'—':(m<60?m+' د':m<1440?Math.round(m/60)+' س':Math.round(m/1440)+' يوم');
function ownEnsure(){if($q('#ownModal'))return;document.body.insertAdjacentHTML('beforeend','<div class="modal" id="ownModal" hidden><div class="sheet st"><button type="button" class="x" data-close>×</button><div id="ownBody"></div></div></div>')}
function goal(label,v,t,k){const p=Math.max(0,Math.min(100,Math.round(v/t*100)));return `<div class="ow-k"${k?` data-owd="${k}"`:''}><small>${label}</small><b>${ltr(fmn(v)+' / '+t)}</b><div class="ow-pb"><i style="width:${p}%"></i></div></div>`}
async function ownDraw(){const b=$q('#ownBody');if(!b)return;const s=SBC();
 b.innerHTML=`<h3 class="ow-h">📊 ${T('Owner dashboard','لوحة المالك')}</h3><p class="od-e">…</p>`;
 if(!s){b.innerHTML+='<p class="od-e">مفيش اتصال بالسيرفر.</p>';return}
 try{const [a,r,pp]=await Promise.all([s.rpc('hzq_stats'),s.rpc('hzq_revenue'),s.rpc('hzq_provider_plans')]);
  if(a.error)throw a.error;if(r.error)throw r.error;const plans=pp&&!pp.error&&Array.isArray(pp.data)?pp.data:[];
  const st=a.data||{},rv=r.data||{},secs=(st.sections||[]).filter(x=>x.section==='upvc'||x.section==='furniture'||x.requests||x.price_items||x.deals);
  const core=secs.filter(x=>x.section==='upvc'||x.section==='furniture'),sum=k=>core.reduce((n,x)=>n+(+x[k]||0),0);
  const pv=st.providers||{};
  const goals=`<div class="ow-s">هدف الـ30 يوم (UPVC + موبيليا)</div><div class="ow-g">${goal('موردين موثّقين بأسعار',sum('providers_verified'),5,'prov')}${goal('طلبات حقيقية',sum('requests'),20,'req')}${goal('صفقات متقفلة',sum('closed'),3,'deals')}${goal('عملاء طلبوا',st.customers_requesting||0,10,'cust')}</div>`;
  const kpi=`<div class="ow-g"><div class="ow-k" data-owd="prov"><b>${ltr(fmn(pv.verified)+' / '+fmn(pv.registered))}</b><small>موردين موثّقين / مسجّلين${pv.pending?' · '+pv.pending+' منتظر مراجعة':''}</small></div><div class="ow-k" data-owd="cust"><b>${fmn(st.repeat_customers)}</b><small>عملاء كرّروا الطلب</small></div><div class="ow-k" data-owd="comm"><b>${fmn(rv.due)}</b><small>عمولة مستحقة (جنيه)</small></div><div class="ow-k" data-owd="comm"><b>${fmn(rv.paid)}</b><small>عمولة اتسدّدت (جنيه)</small></div></div>${rv.open_disputes?`<p class="od-e">⚠️ ${rv.open_disputes} شكوى مفتوحة محتاجة مراجعة</p>`:''}`;
  const cards=secs.map(x=>{const ans=x.requests?Math.round((x.answered||0)/x.requests*100):0;return `<div class="ow-card" data-owd="req:${E(x.section)}"><b>${SECN[x.section]||SECA[x.section]||E(x.section)}</b>
   <div class="ow-row"><span>طلبات (آخر 7 أيام)</span><span>${ltr(fmn(x.requests)+' ('+fmn(x.requests_7d)+')')}</span></div>
   <div class="ow-row"><span>اتردّ عليها</span><span>${ans}% · ${fmn(x.offers)} عرض</span></div>
   <div class="ow-row"><span>أول عرض بعد</span><span>${mins(x.avg_first_offer_min)}</span></div>
   <div class="ow-row"><span>صفقات / متقفلة</span><span>${ltr(fmn(x.deals)+' / '+fmn(x.closed))}</span></div>
   <div class="ow-row"><span>قيمة الصفقات / العمولة</span><span>${ltr(fmn(x.gmv)+' / '+fmn(x.commission))}</span></div>
   <div class="ow-row"><span>موردين موثّقين بأسعار</span><span>${fmn(x.providers_verified)} من ${fmn(x.providers_priced)} · ${fmn(x.price_items)} بند</span></div>
   <div class="ow-row"><span>التقييم</span><span>${x.avg_rating!=null?x.avg_rating+' / 5':'—'}</span></div></div>`}).join('');
  const d=st.daily||[],mx=Math.max(1,...d.map(z=>+z.n||0));
  const daily=d.length?`<div class="ow-s">الطلبات في آخر 14 يوم</div><div class="ow-bars">${d.map(z=>`<i title="${E(z.d)}: ${z.n}" style="height:${Math.max(8,Math.round((+z.n||0)/mx*100))}%"></i>`).join('')}</div>`:'';
  const cities=(st.cities||[]).length?`<div class="ow-s">أكتر المدن طلباً</div><div class="ow-card">${st.cities.map(c=>`<div class="ow-row"><span>${E(c.city)}</span><span>${fmn(c.n)}</span></div>`).join('')}</div>`:'';
  const un=(rv.unpaid||[]).length?`<div class="ow-s">عمولات مستحقة</div>${rv.unpaid.map(u=>`<div class="ow-card"><b>${E(u.name)} · ${SECN[u.section]||E(u.section)}</b><div class="ow-row"><span>قيمة الصفقة / العمولة</span><span>${ltr(fmn(u.total)+' / '+fmn(u.commission))}</span></div><button type="button" class="pill" data-owpay="${E(u.deal)}">تم السداد</button></div>`).join('')}`:'';
  b.innerHTML=`<h3 class="ow-h">📊 ${T('Owner dashboard','لوحة المالك')}</h3><p class="od-p">أرقام حقيقية من قاعدة البيانات.</p>${goals}${kpi}<div class="ow-s">الأقسام</div>${cards||'<p class="od-e">لسه مفيش نشاط.</p>'}${daily}${cities}${un}${plans.length?`<div class="ow-s">اشتراكات الموردين (الحد المجاني ${plans[0].free_limit} صفقات)</div>${plans.map(x=>`<div class="ow-card"><b>${E(x.name)}</b><div class="ow-row"><span>صفقات من تاريخ البدء</span><span>${ltr(fmn(x.used)+' / '+fmn(x.free_limit))}</span></div><div class="ow-row"><span>الحالة</span><span>${x.paid?'اشتراك ساري لحد '+E(x.paid_until):(x.used>=x.free_limit?'محتاج اشتراك':'مجاني')}</span></div><div class="ow-pl"><button type="button" class="pill" data-owplan="${E(x.user_id)}:30">تفعيل 30 يوم</button><button type="button" class="pill" data-owplan="${E(x.user_id)}:0">إيقاف</button></div></div>`).join('')}`:''}<div class="ow-s">فحص التطبيق</div><button type="button" class="od-r" data-owtest="1"><i>🧪</i><span><b>فحص سريع</b><small>يتأكد إن الملفات والوظايف الأساسية شغالة بعد أي رفع</small></span><em>${chev()}</em></button>`;
 }catch(e){b.innerHTML=`<h3 class="ow-h">📊 ${T('Owner dashboard','لوحة المالك')}</h3><p class="od-e">مقدرناش نحمّل الأرقام. ${E((e&&e.message)||'')}</p>`}}
async function owDetail(kind){const b=$q('#ownBody'),s=SBC();if(!b||!s)return;
 const back='<button type="button" class="pill" data-owd="back">› رجوع للوحة</button>';b.innerHTML=back+'<p class="od-e">…</p>';
 const dt=d=>d?new Date(d).toLocaleDateString('ar-EG'):'—',wa=p=>{p=String(p||'').replace(/\D/g,'');return p?'<a class="pill" href="https://wa.me/'+p.replace(/^0/,'20')+'" target="_blank" rel="noopener">واتساب</a><a class="pill" href="tel:'+p+'">اتصال</a>':''};
 const row=(a,c)=>'<div class="ow-row"><span>'+a+'</span><span>'+c+'</span></div>',sn=z=>SECN[z]||SECA[z]||E(z);
 try{const [k,arg]=String(kind).split(':');let h='';
  if(k==='prov'){const [pv,pf,it]=await Promise.all([s.from('hz_providers').select('user_id,business_name,full_name,field,verified,status,whatsapp,created_at').order('created_at',{ascending:false}),s.from('hz_profiles').select('id,phone,email'),s.from('hz_price_items').select('provider_id,section').eq('active',true)]);
   if(pv.error)throw pv.error;const P={},C={};(pf.data||[]).forEach(x=>P[x.id]=x);(it.data||[]).forEach(x=>{const c=C[x.provider_id]=C[x.provider_id]||{};c[x.section]=(c[x.section]||0)+1});
   h='<h3 class="ow-h">الموردين ('+(pv.data||[]).length+')</h3>'+((pv.data||[]).map(p=>{const q=P[p.user_id]||{},c=C[p.user_id]||{},ks=Object.keys(c);return '<div class="ow-card"><b>'+E(p.business_name||p.full_name||'—')+'</b> <small>'+(p.verified?'✅ موثّق':'⏳ '+E(p.status||'قيد المراجعة'))+'</small>'+row('الاسم',E(p.full_name||'—'))+row('بنود مسعّرة',ks.length?ks.map(z=>sn(z)+' '+c[z]).join(' · '):'لسه ما ضافش أسعار')+row('إيميل',ltr(E(q.email||'—')))+row('سجّل في',dt(p.created_at))+'<div class="ow-pl">'+wa(p.whatsapp||q.phone)+'</div></div>'}).join('')||'<p class="od-e">مفيش موردين.</p>')}
  else if(k==='req'||k==='cust'){let q=s.from('hz_quote_requests').select('id,req_no,user_id,section,contact_name,contact_phone,city,status,created_at,lines').order('created_at',{ascending:false}).limit(150);if(k==='req'&&arg)q=q.eq('section',arg);const r=await q;if(r.error)throw r.error;const rs=r.data||[];
   if(k==='cust'){const M={};rs.forEach(x=>{const key=x.user_id||x.contact_phone||x.id,m=M[key]=M[key]||{n:x.contact_name,p:x.contact_phone,c:0,last:x.created_at,s:new Set()};m.c++;m.s.add(x.section)});const L=Object.values(M);
    h='<h3 class="ow-h">العملاء اللي طلبوا عروض ('+L.length+')</h3>'+(L.map(m=>'<div class="ow-card"><b>'+E(m.n||'—')+'</b>'+row('عدد الطلبات',m.c+(m.c>1?' (كرّر)':''))+row('الأقسام',[...m.s].map(sn).join(' · '))+row('آخر طلب',dt(m.last))+'<div class="ow-pl">'+wa(m.p)+'</div></div>').join('')||'<p class="od-e">لسه مفيش عملاء.</p>')}
   else h='<h3 class="ow-h">الطلبات'+(arg?' · '+sn(arg):'')+' ('+rs.length+')</h3>'+(rs.map(x=>'<div class="ow-card"><b>#'+E(x.req_no||String(x.id).slice(0,6))+' · '+sn(x.section)+'</b> <small>'+E(x.status||'')+'</small>'+row('العميل',E(x.contact_name||'—'))+row('المدينة',E(x.city||'—'))+row('عدد البنود',(Array.isArray(x.lines)?x.lines.length:'—'))+row('التاريخ',dt(x.created_at))+'<div class="ow-pl">'+wa(x.contact_phone)+'</div></div>').join('')||'<p class="od-e">لسه مفيش طلبات.</p>')}
  else if(k==='deals'||k==='comm'){const [d,pv]=await Promise.all([s.from('hzq_deals').select('id,section,total,stage,commission,commission_paid,invoice_no,provider_id,created_at,closed_at').order('created_at',{ascending:false}).limit(150),s.from('hz_providers').select('user_id,business_name,full_name')]);if(d.error)throw d.error;const N={};(pv.data||[]).forEach(p=>N[p.user_id]=p.business_name||p.full_name);
   h='<h3 class="ow-h">'+(k==='comm'?'العمولات':'الصفقات')+' ('+(d.data||[]).length+')</h3>'+((d.data||[]).map(x=>'<div class="ow-card"><b>'+E(N[x.provider_id]||'مورد')+' · '+sn(x.section)+'</b> <small>'+E(x.stage||'')+'</small>'+row('قيمة الصفقة',ltr(fmn(x.total)))+row('العمولة',ltr(fmn(x.commission))+(x.commission_paid?' · اتسدّدت ✅':' · مستحقة'))+row('التاريخ',dt(x.closed_at||x.created_at))+'</div>').join('')||'<p class="od-e">لسه مفيش صفقات.</p>')}
  b.innerHTML=back+h}catch(e){b.innerHTML=back+'<p class="od-e">مقدرناش نحمّل التفاصيل. '+E((e&&e.message)||'')+'</p>'}}
window.hzOwner=function(){ownEnsure();showModal('#ownModal');ownDraw()};
document.addEventListener('click',async e=>{
 const od=e.target.closest&&e.target.closest('[data-owd]');if(od&&$q('#ownModal')&&$q('#ownModal').contains(od)){const kk=od.dataset.owd;if(kk==='back')ownDraw();else owDetail(kk);return}
 const pay=e.target.closest&&e.target.closest('[data-owpay]');
 if(pay){const s=SBC();if(!s||!confirm('تأكيد إن المورد سدّد العمولة دي؟'))return;const r=await s.rpc('hzq_mark_commission',{p_deal:pay.dataset.owpay,p_paid:true});if(r.error)say(r.error.message);else{say('اتسجّل ✓');ownDraw()}return}
 const pl=e.target.closest&&e.target.closest('[data-owplan]');
 if(pl){const s=SBC();if(!s)return;const [uid,d]=pl.dataset.owplan.split(':');if(!confirm(+d?'تفعيل الاشتراك لمدة '+d+' يوم؟':'إيقاف الاشتراك؟'))return;const r=await s.rpc('hzq_set_plan',{p_user:uid,p_days:+d});if(r.error)say(r.error.message);else{say('اتحدّث ✓');ownDraw()}return}
 if(e.target.closest&&e.target.closest('[data-owtest]')){window.hzSelfTest()}});

/* ---------- فحص سريع (بعد أي رفع): ?selftest=1 أو من لوحة المالك ---------- */
window.hzSelfTest=async function(){ownEnsure();const m=$q('#ownModal');if(m&&m.hidden)showModal('#ownModal');const b=$q('#ownBody');
 b.innerHTML='<h3 class="ow-h">🧪 فحص سريع</h3><p class="od-e">…</p>';const out=[];const ok=(t,v,d)=>out.push([v,t,d||'']);
 const scripts=[...document.querySelectorAll('script[src]')].filter(x=>x.getAttribute('src')&&!/^https?:/.test(x.getAttribute('src')));
 for(const el of scripts){const u=el.getAttribute('src'),opt=el.hasAttribute('onerror');try{const r=await fetch(u,{cache:'no-store'});ok('ملف '+u.split('?')[0],r.ok||opt,r.ok?'':opt?'اختياري، مش موجود وده عادي':'HTTP '+r.status+' (مش مرفوع على GitHub؟)')}catch(_){ok('ملف '+u.split('?')[0],opt,opt?'اختياري':'مش بيتحمّل')}}
 try{const r=await fetch('sw.js',{cache:'no-store'}),t=await r.text(),v=(t.match(/const V='([^']+)'/)||[])[1];ok('إصدار التطبيق (sw.js)',!!v,v||'')}catch(_){ok('إصدار التطبيق (sw.js)',false,'مش متاح')}
 [['hzQuote','عرض السعر'],['hzQuotes','متابعة العروض والطلبات'],['hzOrders','شاشة الطلبات'],['hzSys','أنظمة وقطاعات UPVC'],['hzShare','المشاركة'],['hzDesigner','مصمم الشبابيك'],['hzDesign2','مصممين الأبواب والشتر والموبيليا'],['hzSim','عينة 3D']].forEach(([k,n])=>ok(n,typeof window[k]!=='undefined'));
 [['#grid','الشبكة الرئيسية'],['#q','خانة البحث'],['#hzDock','القايمة الجانبية'],['#chat','المساعد'],['#hzTabs','التابات']].forEach(([s,n])=>ok(n,!!$q(s)));
 const s=SBC();if(s){try{const r=await s.from('hz_settings').select('key').limit(1);ok('الاتصال بقاعدة البيانات',!r.error,r.error?r.error.message:'')}catch(e){ok('الاتصال بقاعدة البيانات',false,String(e&&e.message||e))}}else ok('الاتصال بقاعدة البيانات',false,'مفيش اتصال');
 const bad=out.filter(x=>!x[0]).length;
 b.innerHTML=`<h3 class="ow-h">🧪 فحص سريع</h3><p class="od-p">${bad?'⚠️ في '+bad+' حاجة محتاجة مراجعة.':'✅ كل حاجة تمام.'}</p>`+out.map(x=>`<div class="ow-ck"><i>${x[0]?'✅':'❌'}</i><span>${E(x[1])}${x[2]?' <small style="color:var(--mut)">· '+E(x[2])+'</small>':''}</span></div>`).join('')};
if(/[?&]selftest=1/.test(location.search))setTimeout(()=>window.hzSelfTest(),2500);

/* ---------- رجوع داخل القسم: خطوة واحدة لفوق (نوع مختار / شاشة فرعية) قبل ما نطلع للقسم الأب ---------- */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#hzCb');if(!b)return;let step=false;
 try{if(typeof SP!=='undefined'&&SP&&SP.v&&SP.v!=='home'){step=true;SP.v='home'}
  if(typeof KD!=='undefined'&&KD&&KD.v&&KD.v!=='home'){step=true;KD.v='home';KD.s=null;KD.p=null}
  if(!step&&typeof typ!=='undefined'&&typ!==null){step=true;typ=null}}catch(_){}
 if(step){e.stopImmediatePropagation();e.preventDefault();try{if(typeof renderChips==='function')renderChips()}catch(_){}try{render()}catch(_){}window.scrollTo({top:0,behavior:'smooth'})}},true);

/* ---------- زر رجوع الموبايل: يقفل عينة الـ3D بدل ما يطلعك من القسم ---------- */
(function(){let pushed=0;
 function sync(o){if(!o.hidden&&!pushed){pushed=1;try{history.pushState({hzov:'sim'},'')}catch(_){}}else if(o.hidden&&pushed){pushed=0;try{if(history.state&&history.state.hzov==='sim')history.back()}catch(_){}}}
 const watch=()=>{const o=document.getElementById('sim');if(!o||o.__hzw)return;o.__hzw=1;new MutationObserver(()=>sync(o)).observe(o,{attributes:true,attributeFilter:['hidden']});sync(o)};
 new MutationObserver(watch).observe(document.body,{childList:true});watch();
 addEventListener('popstate',()=>{const o=document.getElementById('sim');if(o&&!o.hidden&&pushed){pushed=0;o.hidden=true;document.body.style.overflow='';try{if(window.hzSim)hzSim.close()}catch(_){}}})})();

/* ---------- زرار "عينة 3D" داخل القسم: لازم يطابق اللي المستخدم بيتفرج عليه ---------- */
function simFix(){const b=$q('#hzSimBtn');if(!b)return;
 if($q('#hubBox')){b.hidden=true;return}
 const c=typeof cat!=='undefined'?cat:'';let t='';try{if(typeof typ!=='undefined'&&typ!==null){const cc=CATALOG.find(x=>x.id===c),ty=cc&&cc.types&&cc.types[typ];t=ty?String(ty.en||''):''}}catch(_){}let k=null,spec={},lab='';
 if(c==='upvc'){if(/door/i.test(t)){k='door';lab='باب UPVC'}else if(/window/i.test(t)){k='window';lab='شباك UPVC';if(/anthracite/i.test(t))spec.color='anth'}}
 else if(c==='glass'){k='glass';lab='زجاج سكريت'}
 else if(c==='furniture'&&/bedroom/i.test(t)){k='bed';lab='غرفة نوم'}
 if(!k){b.hidden=true;return}
 b.hidden=false;b.dataset.sim=k==='bed'?'':k;b.dataset.spec=JSON.stringify(spec);b.dataset.hzbed=k==='bed'?'1':'';
 b.innerHTML='<svg class="hzi" viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg> '+T('Try the 3D preview','جرّب العينة 3D')+' — '+lab}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-hzbed="1"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 if(typeof hzLoad==='function')hzLoad('sec-3d').then(()=>{if(window.hz3d)hz3d.open('bed',{title:T('Bedroom','غرفة نوم'),color:'#8B5A2B'})}).catch(()=>say(T('Needs internet to load the preview.','محتاج إنترنت عشان المعاينة تتحمّل.')))},true);
{const r0=window.render;if(typeof r0==='function'){window.render=function(){const r=r0.apply(this,arguments);setTimeout(simFix,0);return r}}}
{const g=$q('#grid');if(g)new MutationObserver(()=>{if(!window.__simFx){window.__simFx=1;setTimeout(()=>{window.__simFx=0;try{simFix()}catch(_){}},60)}}).observe(g.parentNode,{childList:true,subtree:true})}

/* ---------- أيقونات SVG بدل الإيموجي (بتتبدّل تلقائي في أي نص ظاهر في التطبيق) ---------- */
const IC={'🧾':'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>','🪟':'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
'💬':'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>','🧊':'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
'📍':'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>','📦':'<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5L12 12l9-4.5M12 12v9"/>',
'📥':'<path d="M4 13l2-8h12l2 8v6H4z"/><path d="M4 13h5l1 2h4l1-2h5"/>','📤':'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
'📢':'<path d="M3 11v2a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/>','🔒':'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
'📊':'<path d="M5 20V11M12 20V4M19 20v-6"/>','🧪':'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7.5 15h9"/>',
'✅':'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>','✓':'<path d="M5 12.5l4.5 4.5L19 7.5"/>','❌':'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
'⚠':'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>','✦':'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>','✨':'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
'⭐':'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>','★':'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
'☆':'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>','🎨':'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.5 1.6-2.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="11" r="1"/>',
'🛠':'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4L15 12l-3-3z"/>','💡':'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
'📚':'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>','📖':'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>',
'📱':'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>','🌙':'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
'☀':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>','🪵':'<ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7"/>',
'❤':'<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>','🤍':'<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>',
'🏠':'<path d="M3 11l9-8 9 8M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>','🛏':'<path d="M3 19V6M3 14h18v5M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.6"/>',
'🛋':'<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v5H3z"/>','📎':'<path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7"/>',
'🔥':'<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z"/>','🏋':'<path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/>',
'🔊':'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>','🎉':'<path d="M4 20l5-14 9 9z"/><path d="M14 4v2M19 8h2M17 3.5l-1 1.5"/>','✕':'<path d="M6 6l12 12M18 6L6 18"/>',
'📷':'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>','🎤':'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
'✏':'<path d="M4 20l1-4L16 5l3 3L8 19z"/>','📞':'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
'🔩':'<path d="M12 3l7 4v6l-7 4-7-4V7z"/><circle cx="12" cy="10" r="2"/>','🧰':'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
'🏷':'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>','🏢':'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4"/>',
'🚗':'<path d="M3 15l2-6h14l2 6v4h-3v-2H6v2H3z"/><path d="M3 15h18"/>','💳':'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
'🛡':'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>','💰':'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.8-1 1.5-2.5 1.7-2.5.6-2.5 1.8 1 1.7 2.5 1.7 2.5-.5 2.5-1.5"/>',
'🤖':'<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 16h6"/>','🧭':'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
'🗑':'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>','🕒':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>','⏳':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
'🔷':'<path d="M12 3l8 9-8 9-8-9z"/>','📲':'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 11l2 2 2-2M12 7v6"/>','🎯':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>','🔇':'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>','🤝':'<path d="M3 12l4-4 4 2 3-2 4 4-5 5-3-1-3 1z"/>'};
const FILLK={'★':1};
const keys=Object.keys(IC).sort((a,b)=>b.length-a.length),RXI=new RegExp('('+keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\uFE0F?','g');
const SKIP='script,style,textarea,input,select,option,svg,.cmt,.cm,[data-ugc],.m.u,.m.a,#odQ';
function iconSvg(k){return '<svg class="hzi'+(FILLK[k]?' f':'')+'" viewBox="0 0 24 24" aria-hidden="true">'+IC[k]+'</svg>'}
function swap(root){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{if(!n.nodeValue||n.nodeValue.length>600)return NodeFilter.FILTER_REJECT;RXI.lastIndex=0;if(!RXI.test(n.nodeValue))return NodeFilter.FILTER_REJECT;const p=n.parentElement;return p&&!p.closest(SKIP)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}}),list=[];let n;while((n=w.nextNode()))list.push(n);
 list.forEach(t=>{const sp=document.createElement('span');sp.className='hzis';RXI.lastIndex=0;sp.innerHTML=E(t.nodeValue).replace(RXI,(m,k)=>iconSvg(k));t.replaceWith(...sp.childNodes)})}
const pend=new Set();let swr=0;
function queueSwap(n){pend.add(n);if(swr)return;swr=requestAnimationFrame(()=>{swr=0;const a=[...pend];pend.clear();a.forEach(x=>{try{swap(x.nodeType===3?x.parentElement:x)}catch(_){}})})}
new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1||n.nodeType===3)queueSwap(n)}))}).observe(document.body,{childList:true,subtree:true});
setTimeout(()=>swap(document.body),400);

/* ---------- بانر الصفقات المجانية للمورد (في تاب طلبات العملاء) ---------- */
let qbT=0;
async function quotaBanner(){const body=$q('#qxBody');if(!body||body.querySelector('#hzQuota'))return;const on=body.querySelector('.qx-c.on');if(!on||!/طلبات العملاء/.test(on.textContent))return;
 const s=SBC(),u=U();if(!s||!u)return;const r=await s.rpc('hzq_quota');if(r.error||!r.data||body.querySelector('#hzQuota'))return;const q=r.data;
 const wa=$q('#fabWa'),href=wa&&wa.href?wa.href:'';
 const msg=q.paid?'اشتراكك ساري لحد '+E(q.paid_until):q.blocked?'خلصت الصفقات المجانية ('+q.free_limit+'). فعّل الاشتراك عشان تكمل ترد على الطلبات.':'متاح ليك '+q.remaining+' من '+q.free_limit+' صفقات مجانية.';
 const pct=Math.min(100,Math.round(q.used/Math.max(1,q.free_limit)*100));
 const d=document.createElement('div');d.id='hzQuota';d.className='od-qt';
 d.innerHTML=`<b>${msg}</b>${q.paid?'':`<div class="ow-pb"><i style="width:${pct}%"></i></div><small>بعد ${q.free_limit} صفقات بتحتاج اشتراك عشان تفضل تستقبل وتردّ على الطلبات.</small>`}${q.blocked&&href?`<a class="btn" target="_blank" rel="noopener" href="${E(href)}">كلّمنا لتفعيل الاشتراك</a>`:''}`;
 on.parentNode.after(d)}
new MutationObserver(()=>{if(qbT)return;qbT=setTimeout(()=>{qbT=0;try{quotaBanner()}catch(_){}},250)}).observe(document.body,{childList:true,subtree:true});

/* ---------- مساعد Horizon: ترحيب + placeholder + مراعاة الكيبورد ---------- */
function chatUI(){const c=$q('#cB');if(!c)return;
 /* رسالة ترحيب واحدة بس (#chatWelcome). أي ترحيب قديم بيتشال، وبتترجع لو الشات فضي */
 c.querySelectorAll('.hzc-hello').forEach(x=>x.remove());
 const has=c.querySelector('.m'),w=c.querySelector('#chatWelcome');
 if(has&&w)w.remove();
 else if(!has&&!w){const d=document.createElement('div');d.id='chatWelcome';d.className='chat-welcome';
  const ic=document.querySelector('#chat .ch-mark svg');
  d.innerHTML='<span class="cw-ico" aria-hidden="true">'+(ic?ic.outerHTML.replace(/chG1/g,'chG2'):'')+'</span>'
    +'<div class="chat-welcome-title" data-en="Hello \uD83D\uDC4B" data-ar="\u0623\u0647\u0644\u0627\u064b \uD83D\uDC4B" data-de="Hallo \uD83D\uDC4B"></div>';
  c.prepend(d);
  const lg=(typeof lang!=='undefined'?lang:'ar');d.querySelectorAll('[data-en]').forEach(e=>{e.textContent=e.dataset[lg]||e.dataset.en})}
 const i=$q('#cIn');if(i&&!i.placeholder)i.placeholder=(typeof L==='function'?L('Ask Horizon anything\u2026','\u0627\u0633\u0623\u0644 \u0623\u0641\u0642 \u0623\u064a \u062d\u0627\u062c\u0629\u2026','Frag Horizon alles\u2026'):'')}
const cb=$q('#cB');if(cb){new MutationObserver(chatUI).observe(cb,{childList:true});chatUI()}
const chat=$q('#chat');if(chat)new MutationObserver(chatUI).observe(chat,{attributes:true,attributeFilter:['hidden','class']});
if(window.visualViewport){const R=document.documentElement,f=()=>{const ch=$q('#chat');
  if(!ch||ch.hidden||ch.classList.contains('min')||innerWidth>=760){R.style.removeProperty('--vh');R.style.removeProperty('--vt');return}
  const v=visualViewport;R.style.setProperty('--vh',v.height+'px');R.style.setProperty('--vt',v.offsetTop+'px')};
 visualViewport.addEventListener('resize',f);visualViewport.addEventListener('scroll',f);
 if(chat)new MutationObserver(f).observe(chat,{attributes:true,attributeFilter:['hidden','class']})}
})();
