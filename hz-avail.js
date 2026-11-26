/* FENVAR / Horizon: جدول الإتاحة الموحّد (مصدر واحد للحقيقة).
   القاعدة: القسم أو الوظيفة بتتفتح لو شغالة بمعلومات عامة أو أداة مستقلة أو AI من غير موردين ولا بيانات تشغيلية.
   وبتتقفل ("قريبًا") لو محتاجة مورد / مقدم خدمة معتمد / كتالوج / أسعار / عروض / حجز.
   الاستثناءان الوحيدان في مسار المنتجات: UPVC والموبيليا (دورة الطلب والتسعير والعروض كاملة).
   الملف ده بيتحمّل قبل prices.js و quote.js. التنفيذ (منع الدخول من أي مدخل) في hz-focus.js.
   لفتح قسم جديد بعدين: ضيف رقمه (id) في القايمة المناسبة تحت. أي id مش مكتوب هنا = مقفول (الأمان أولًا). */
(function(){'use strict';
/* 1) دورة تجارية كاملة: طلب عرض سعر + أسعار الموردين + عروض + نشر إعلانات + بدء شات صفقة */
const TRADE=['upvc','furniture'];
/* الزجاج مش سوق مستقل: بند جوه طلب UPVC بس (quote.js بيحوّل glass لـ upvc جوه الطلب). والخشب الخام مقفول ومش بيتخلط مع الموبيليا */
/* 2) أقسام مفتوحة بالكامل (معلومات عامة / أدوات / AI / محتوى بدون موردين) */
const FULL=['all','fav','finishing','sports','kids','religion','countries','tools','kitchen','aid','preachers','library','itlearn'];
/* 3) حاويات تنقّل: بتتفتح عشان توصّل لأولادها، وكل ابن بيتحكم فيه لوحده */
const CONTAINERS=['g_products','g_services','g_culture','itx'];
/* 4) أقسام مختلطة: الصفحة مفتوحة (معلومات/أدوات عامة جواها) وأزرار الحجز/الطلب/الشراء "قريبًا" */
const MIXED=['health','food'];
const T=(en,ar)=>typeof L==='function'?L(en,ar):ar;
/* toast الصفحة الأصلي مش متاح برّه الملف بتاعه، فعندنا نسخة بنفس العنصر (#toastHz) */
const toast=(m)=>{try{let e=document.getElementById('toastHz');if(!e){e=document.createElement('div');e.id='toastHz';document.body.append(e)}e.textContent=m;e.className='on';clearTimeout(e._t);e._t=setTimeout(()=>{e.className=''},3400)}catch(_){}};
const A={
 trade:id=>TRADE.indexOf(id)>-1,
 tradeList:()=>TRADE.slice(),
 isFull:id=>FULL.indexOf(id)>-1,
 isContainer:id=>CONTAINERS.indexOf(id)>-1,
 isMixed:id=>MIXED.indexOf(id)>-1,
 /* هل الصفحة نفسها تتفتح؟ (id فاضي = مسموح) */
 open:id=>!id||TRADE.indexOf(id)>-1||FULL.indexOf(id)>-1||CONTAINERS.indexOf(id)>-1||MIXED.indexOf(id)>-1,
 /* هل ينفع نبعت طلب/سعر/عرض/إعلان في القسم ده؟ */
 canTrade:id=>!id||A.trade(id),
 say:()=>{try{toast(T('Coming soon. This needs registered suppliers or service providers. Available now: UPVC, furniture and all the general tools.','قريبًا. الوظيفة دي محتاجة موردين ومقدمي خدمة معتمدين. المتاح دلوقتي: UPVC والموبيليا وكل الأدوات والمعلومات العامة.'))}catch(_){}}
};
A.toast=toast;
window.HZ_AVAIL=A;
})();
