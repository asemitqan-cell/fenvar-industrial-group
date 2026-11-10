const FENVAR_CONTACT={whatsapp:'',email:'',facebook:'',linkedin:''};
const langToggle=document.getElementById('langToggle');const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');let language='en';function setLanguage(next){language=next;document.documentElement.lang=next;document.body.classList.toggle('ar',next==='ar');document.querySelectorAll('[data-en][data-ar]').forEach(el=>{el.innerHTML=el.dataset[next]});document.querySelectorAll('[data-placeholder-en]').forEach(el=>{el.placeholder=el.dataset[next==='en'?'placeholderEn':'placeholderAr']});document.querySelectorAll('option[data-en][data-ar]').forEach(el=>{el.textContent=el.dataset[next]});langToggle.textContent=next==='en'?'عربي':'English';if(typeof renderDirectContacts==='function')renderDirectContacts()}langToggle.addEventListener('click',()=>setLanguage(language==='en'?'ar':'en'));menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));document.getElementById('year').textContent=new Date().getFullYear();
const form=document.getElementById('quoteForm');const formMessage=document.getElementById('formMessage');form.addEventListener('submit',async e=>{e.preventDefault();const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent=language==='en'?'Sending…':'جارٍ الإرسال…';formMessage.textContent='';const data=Object.fromEntries(new FormData(form).entries());try{const response=await fetch('https://zxeykzxoxylfsdnaimwk.supabase.co/functions/v1/fenvar-website-inquiry',{method:'POST',headers:{'Content-Type':'application/json','apikey':'sb_publishable_5i-jel2xo4kqyHz707aWsA_RTaJuZzx'},body:JSON.stringify(data)});const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.error||(language==='en'?'Could not send your inquiry.':'تعذر إرسال طلبك.'));formMessage.textContent=language==='en'?'Thank you. Your inquiry has been received.':'شكرًا لك. تم استلام طلبك بنجاح.';form.reset()}catch(err){formMessage.textContent=err.message|| (language==='en'?'Connection error. Please try again.':'حدث خطأ في الاتصال. حاول مرة أخرى.')}finally{button.disabled=false;button.textContent=language==='en'?'Send Inquiry ↗':'إرسال الطلب ↗'}});
function renderDirectContacts(){
 const links=document.getElementById('directContactLinks');
 const socials=document.getElementById('footerSocials');
 if(!links||!socials)return;
 const items=[];
 const phone=String(FENVAR_CONTACT.whatsapp||'').replace(/[^0-9]/g,'');
 if(phone)items.push({label:'WhatsApp',href:'https://wa.me/'+phone,icon:'◉'});
 if(FENVAR_CONTACT.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(FENVAR_CONTACT.email))items.push({label:'Email',href:'mailto:'+FENVAR_CONTACT.email,icon:'✉'});
 links.innerHTML=items.length?items.map(x=>'<a href="'+x.href+'" '+(x.label==='WhatsApp'?'target="_blank" rel="noopener noreferrer"':'')+'><span>'+x.icon+'</span>'+x.label+'</a>').join(''):'<span class="contact-pending">'+(language==='en'?'WhatsApp and email details will be published here.':'ستظهر بيانات واتساب والبريد الإلكتروني هنا بعد تأكيدها.')+'</span>';
 const social=[];
 if(FENVAR_CONTACT.facebook)social.push(['Facebook',FENVAR_CONTACT.facebook]);
 if(FENVAR_CONTACT.linkedin)social.push(['LinkedIn',FENVAR_CONTACT.linkedin]);
 socials.innerHTML=social.map(x=>'<a href="'+x[1]+'" target="_blank" rel="noopener noreferrer">'+x[0]+' ↗</a>').join('');
}
renderDirectContacts();
