// Horizon service worker: network-first بدون كاش المتصفح، علشان أي رفع جديد على GitHub يظهر من أول فتحة.
const V='hz-v16';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
  e.respondWith(
    fetch(r.url,{cache:'no-store',credentials:'same-origin'})
      .then(res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{})}return res})
      .catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  );
});
