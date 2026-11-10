const SB_URL='https://zxeykzxoxylfsdnaimwk.supabase.co',SB_KEY='sb_publishable_5i-jel2xo4kqyHz707aWsA_RTaJuZzx';
const sb=window.supabase?window.supabase.createClient(SB_URL,SB_KEY):null;
const CATS=[['all','All','الكل'],['furniture','Furniture','موبيليا'],['upvc','UPVC','UPVC'],['glass','Glass','زجاج'],['services','Services','خدمات'],['consulting','Consulting','استشارات']];
const ITEMS=[['furniture','Bedrooms','أوض نوم','Product','منتج','🛏️','#6366F1'],['furniture','Dining rooms','أوض سفرة','Product','منتج','🍽️','#8B5CF6'],['furniture','Living rooms','أوض معيشة','Product','منتج','🛋️','#0EA5E9'],['upvc','UPVC windows','شبابيك UPVC','Product','منتج','🪟','#4338CA'],['upvc','UPVC doors','أبواب UPVC','Product','منتج','🚪','#7C3AED'],['upvc','Shutters','شتر','Product','منتج','▤','#0891B2'],['upvc','UPVC profiles','قطاعات UPVC','Product','منتج','▦','#4F46E5'],['glass','Tempered glass','زجاج سيكوريت','Product','منتج','◫','#10B981'],['services','Measurement & installation','معاينة وتركيب','Service','خدمة','📐','#F59E0B'],['services','Interior design','تصميم داخلي','Service','خدمة','✏️','#EC4899'],['consulting','Project consulting','استشارة مشروع','Consulting','استشارة','💡','#14B8A6'],['consulting','Material selection','اختيار الخامات','Consulting','استشارة','🧭','#06B6D4']];
let lang=(navigator.language||'en').startsWith('ar')?'ar':'en',cat='all',user=null,authMode='in',pending=null;
const $=s=>document.querySelector(s),L=(en,ar)=>lang==='ar'?ar:en;
function applyLang(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.body.classList.toggle('ar',lang==='ar');$('#langBtn').textContent=lang==='ar'?'English':'عربي';
document.querySelectorAll('[data-en]').forEach(e=>e.textContent=e.dataset[lang]);$('#q').placeholder=$('#q').dataset['ph'+(lang==='ar'?'Ar':'En')]||$('#q').placeholder;$('#q').placeholder=lang==='ar'?$('#q').getAttribute('data-ph-ar'):$('#q').getAttribute('data-ph-en');renderChips();render();authUI();authTexts()}
function renderChips(){$('#chips').innerHTML=CATS.map(c=>`<button class="${c[0]===cat?'on':''}" data-c="${c[0]}">${L(c[1],c[2])}</button>`).join('')}
function render(){const t=$('#q').value.trim().toLowerCase();const list=ITEMS.filter(i=>(cat==='all'||i[0]===cat)&&(!t||(i[1]+i[2]+i[3]+i[4]).toLowerCase().includes(t)));
$('#grid').innerHTML=list.map(i=>`<article class="card"><div class="thumb" style="background:linear-gradient(135deg,${i[6]},#0E1530aa)">${i[5]}</div><div class="cb"><span class="kind">${L(i[3],i[4])}</span><h3>${L(i[1],i[2])}</h3><button class="btn" data-item="${i[1]}">${L('Request','اطلب')}</button></div></article>`).join('');$('#empty').hidden=list.length>0}
function authUI(){const b=$('#authBtn');b.textContent=user?L('Sign out','خروج'):L('Sign in','دخول');$('#barAuth').textContent=user?L('Sign out','خروج'):L('Account','حسابي')}
function authTexts(){const up=authMode==='up';$('#authTitle').textContent=up?L('Create account','إنشاء حساب'):L('Sign in','تسجيل الدخول');$('#authSubmit').textContent=up?L('Sign up','سجّل'):L('Sign in','دخول');$('#authSwitch').textContent=up?L('Have an account? Sign in','عندك حساب؟ ادخل'):L('New here? Create an account','جديد؟ اعمل حساب')}
const open=id=>{$(id).hidden=false},close=()=>document.querySelectorAll('.modal').forEach(m=>m.hidden=true);
function requestItem(name){if(!user){pending=name;authMode='up';authTexts();$('#authMsg').textContent=L('Please sign up or sign in first to send a request.','سجّل أو ادخل الأول عشان تبعت طلب.');open('#authModal');return}
$('#reqItem').textContent=name;$('#reqForm').dataset.item=name;$('#reqMsg').textContent='';open('#reqModal')}
document.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){cat=c.dataset.c;renderChips();render();return}
const r=e.target.closest('[data-item]');if(r){requestItem(r.dataset.item);return}
if(e.target.matches('[data-close]')||e.target.classList.contains('modal'))close()});
$('#q').addEventListener('input',render);$('#langBtn').onclick=()=>{lang=lang==='ar'?'en':'ar';applyLang()};
$('#barSearch').onclick=()=>{window.scrollTo({top:0,behavior:'smooth'});$('#q').focus()};
async function authBtn(){if(user){await sb.auth.signOut();return}authMode='in';authTexts();$('#authMsg').textContent='';open('#authModal')}
$('#authBtn').onclick=authBtn;$('#barAuth').onclick=authBtn;$('#authSwitch').onclick=()=>{authMode=authMode==='in'?'up':'in';authTexts();$('#authMsg').textContent=''};
$('#authForm').addEventListener('submit',async e=>{e.preventDefault();const m=$('#authMsg');m.className='msg';m.textContent='…';if(!sb){m.textContent=L('Connection error','مشكلة في الاتصال');return}
const f=new FormData(e.target),email=f.get('email'),password=f.get('password');
const r=authMode==='up'?await sb.auth.signUp({email,password}):await sb.auth.signInWithPassword({email,password});
if(r.error){m.textContent=r.error.message;return}
if(authMode==='up'&&!r.data.session){m.className='msg ok';m.textContent=L('Check your email to confirm your account, then sign in.','افتح إيميلك وأكّد الحساب، وبعدين ادخل.');return}
close();e.target.reset()});
$('#reqForm').addEventListener('submit',async e=>{e.preventDefault();const m=$('#reqMsg');m.className='msg';m.textContent='…';const d=Object.fromEntries(new FormData(e.target).entries());
d.email=user.email;d.interest=e.target.dataset.item;
try{const r=await fetch(SB_URL+'/functions/v1/fenvar-website-inquiry',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY},body:JSON.stringify(d)});if(!r.ok)throw 0;m.className='msg ok';m.textContent=L('Sent. We will contact you soon.','اتبعت. هنكلمك قريب.');e.target.reset();setTimeout(close,1600)}catch(_){m.textContent=L('Could not send. Try again.','مقدرناش نبعت. جرّب تاني.')}});
if(sb){sb.auth.getSession().then(({data})=>{user=data.session?.user||null;authUI()});sb.auth.onAuthStateChange((_,s)=>{const was=user;user=s?.user||null;authUI();if(user&&!was&&pending){const p=pending;pending=null;setTimeout(()=>requestItem(p),300)}})}
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#installBtn').hidden=false});
$('#installBtn').onclick=async()=>{if(dp){dp.prompt();dp=null;$('#installBtn').hidden=true}};
if(/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone){$('#installBtn').hidden=false;$('#installBtn').onclick=()=>alert(L('Tap Share, then Add to Home Screen.','دوس على Share وبعدين Add to Home Screen.'))}
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
applyLang();
