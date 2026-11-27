// Horizon service worker v22: network-first بدون كاش المتصفح علشان أي رفع جديد يظهر من أول فتحة.
// جديد: مكتبات الـCDN (supabase / three.js / الخطوط) بتتخزن بعد أول تحميل ناجح، فالتطبيق يفتح حتى لو الشبكة ضعيفة.
const V='hz-v40',CDN='hz-cdn-v1';
const CDN_HOSTS=['cdn.jsdelivr.net','cdnjs.cloudflare.com','unpkg.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==CDN).map(x=>caches.delete(x)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===self.location.origin){
    e.respondWith(
      fetch(r.url,{cache:'no-store',credentials:'same-origin'})
        .then(res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{})}return res})
        .catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
    );
    return;
  }
  if(CDN_HOSTS.includes(u.hostname)){
    e.respondWith(caches.open(CDN).then(c=>c.match(r).then(m=>{
      const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone()).catch(()=>{});return res}).catch(()=>m);
      return m||net;
    })));
  }
});
