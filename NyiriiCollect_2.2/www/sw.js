const C='nc2-v5',F=['./','index.html','app.js','questions.js','xlsx.full.min.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(hit=>{
  const net=fetch(q).then(r=>{if(r&&r.ok){const c2=r.clone();caches.open(C).then(c=>c.put(q,c2))}return r}).catch(()=>null);
  e.waitUntil(net);
  return hit||net.then(r=>r||caches.match('index.html'))}))});
