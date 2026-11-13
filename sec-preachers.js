(function(){'use strict';
const E=s=>typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P={topic:'',kind:'خطبة جمعة',busy:0,out:'',err:''};
const TOP=['بر الوالدين','الأمانة','الصبر','حسن الخلق','الصدق','التوبة','حق الجار','الإتقان في العمل','صلة الرحم','الشكر'];
HZS.preachers=()=>`<div class="hs-w"><h3>🎙️ تجهيز خطبة</h3>
<input class="hs-in" id="pxT" placeholder="عنوان الخطبة، مثال: بر الوالدين" value="${E(P.topic)}">
<select class="hs-in" id="pxK">${['خطبة جمعة','خطبة عيد','كلمة بعد الصلاة (قصيرة)'].map(k=>`<option ${k===P.kind?'selected':''}>${k}</option>`).join('')}</select>
<div class="hs-ch">${TOP.map(t=>`<button type="button" class="pill" data-px="t:${t}">${t}</button>`).join('')}</div>
<button type="button" class="btn" data-px="go" ${P.busy?'disabled':''}>${P.busy?'جاري التجهيز…':'جهّز الخطبة'}</button>
${P.err?`<p class="msg">${E(P.err)}</p>`:''}${P.out?`<div class="hs-out" dir="rtl">${E(P.out)}</div><button type="button" class="pill" data-px="cp" style="margin-top:8px">📋 نسخ</button>`:''}
<p class="hs-n">الخطبة بتتجهّز بالذكاء الاصطناعي من المراجع المعتمدة ومعاها الدليل. راجع الآيات والأحاديث من المصحف والكتب الأصلية قبل الإلقاء.</p></div>`;
const prompt=()=>`جهّز ${P.kind} بعنوان "${P.topic}" للإلقاء في مدة لا تزيد عن 10 دقائق (حوالي 1000 إلى 1200 كلمة كحد أقصى${P.kind.includes('قصيرة')?'، وللكلمة القصيرة 300 كلمة':''}).
الشروط: 1) كل فكرة يتبعها دليلها من القرآن (اسم السورة ورقم الآية) أو من السنة (نص مختصر + الراوي + المصدر مثل البخاري أو مسلم). 2) اعتمد على المراجع الموثوقة فقط، ولا تذكر حديثًا إلا إذا كنت متأكدًا من صحته. 3) لا تخترع آية ولا حديثًا ولا نسبة لقائل. 4) إن كان هناك خلاف فقهي فاذكره بإيجاز. 5) لغة عربية فصيحة مبسطة. 6) ${P.kind.includes('جمعة')?'اجعلها خطبتين بينهما جلسة، وافتتح بالحمد والشهادتين، واختم بالدعاء':'بداية ونهاية مناسبتان'}. 7) اختم بقسم "المراجع" يسرد الكتب المعتمدة.`;
async function gen(){P.topic=(document.getElementById('pxT')||{}).value||P.topic;P.kind=(document.getElementById('pxK')||{}).value||P.kind;
 if(!P.topic.trim()){P.err='اكتب عنوان الخطبة الأول';render();return}
 P.busy=1;P.err='';P.out='';render();
 try{let r;for(let a=0;a<3;a++){r=await fetch(SB_URL+'/functions/v1/fenvar-ai',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY},body:JSON.stringify({q:prompt(),lang:'ar',history:[]})});if(r.status<500&&r.status!==429)break;await new Promise(z=>setTimeout(z,1500*(a+1)))}
  if(!r.ok)throw 0;const d=await r.json();P.out=d.answer||'';if(!P.out)throw 0}catch(_){P.err='معرفتش أجهّز الخطبة دلوقتي. جرّب تاني.'}
 P.busy=0;render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-px]');if(!b)return;const v=b.dataset.px;
 if(v==='go')gen();else if(v==='cp'){try{navigator.clipboard.writeText(P.out);b.textContent='✓ اتنسخت'}catch(_){}}
 else if(v.startsWith('t:')){P.topic=v.slice(2);P.kind=(document.getElementById('pxK')||{}).value||P.kind;render()}});
})();
