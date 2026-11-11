// Service worker de Mon Frigo (version et liste de fichiers injectées par tools/build.mjs).
// Règle d'or : la page vient d'internet en priorité, le cache ne sert que hors ligne ou si le réseau est très lent.
// Il ne touche qu'à ses propres caches : le domaine github.io est partagé avec tes autres applis.
const VERSION = '1.6.1';
const CACHE = 'mon-frigo-' + VERSION;
const CORE = ["./","app.js?v=1.6.1","apple-touch-icon.png","bricolage.woff2","favicon.png","icon-192.png","icon-512.png","index.html","ingredients.json?v=1.6.1","instrument-sans.woff2","manifest.webmanifest","maskable-192.png","maskable-512.png","recipes.json?v=1.6.1","styles.css?v=1.6.1"];
const isOld = k => k !== CACHE && (k.startsWith('mon-frigo-') || /^frigo-v\d+$/.test(k));

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // un fichier manquant ne bloque plus toute la mise à jour
    await Promise.allSettled(CORE.map(async u => { const r = await fetch(new Request(u, { cache: 'reload' })); if (r.ok) await c.put(u, r); }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  const done = (async () => {
    const old = (await caches.keys()).filter(isOld);
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    return old.length;
  })();
  e.waitUntil(done);
  // Après une mise à jour, on recharge les pages ouvertes (y compris une ancienne version bloquée).
  // Surtout PAS dans waitUntil : le rechargement attendrait la fin de l'activation, qui l'attendrait -> blocage.
  done.then(async n => { if (!n) return; for (const w of await self.clients.matchAll({ type: 'window' })) w.navigate(w.url).catch(() => {}); });
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('lent')), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const r = await withTimeout(fetch(req), 6000);
        if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; }
        return (await caches.match('index.html')) || r;
      } catch (err) { return (await caches.match('index.html')) || (await caches.match('./')) || Response.error(); }
    })());
    return;
  }
  const ocr = /\/(ocr-[a-z-]+\.js|tesseract-core[a-z-]*\.wasm\.js|fra\.traineddata\.gz)$/.test(url.pathname); // lecteur de tickets : gardé après le 1er usage
  e.respondWith((async () => {
    const hit = await caches.match(req, ocr ? { ignoreSearch: true } : undefined); if (hit) return hit;
    const r = await fetch(req);
    if (r.ok && (ocr || url.searchParams.has('v'))) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })());
});

// ---------- alertes de péremption en arrière-plan (Chrome Android, app installée) ----------
const idb = () => new Promise((res, rej) => { const r = indexedDB.open('mon-frigo', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const kvGet = (db, k) => new Promise(res => { const q = db.transaction('kv', 'readonly').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(undefined); });
const kvPut = (db, k, v) => new Promise(res => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = tx.onerror = () => res(); });
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayDiff = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 86400000);
async function backgroundCheck() {
  const db = await idb(); const today = iso(new Date());
  const prefs = (await kvGet(db, 'prefs')) || {}; if (!prefs.notify || (await kvGet(db, 'notifyDay')) === today) return;
  const stock = (await kvGet(db, 'stock')) || []; const t = [], tm = [];
  for (const it of stock) { if (!it.expiry) continue; const d = dayDiff(today, it.expiry); if (d === 0) t.push(it.name); else if (d === 1) tm.push(it.name); }
  if (!t.length && !tm.length) return;
  const n = t.length + tm.length, parts = []; if (t.length) parts.push(`Aujourd'hui : ${t.join(', ')}`); if (tm.length) parts.push(`Demain : ${tm.join(', ')}`);
  await self.registration.showNotification(`${n} produit${n > 1 ? 's' : ''} à consommer vite`, { body: parts.join('\n') + '\nTouche pour voir des idées de recettes.', icon: 'icon-192.png', badge: 'favicon.png', tag: 'peremption', data: { url: './#/home' } });
  await kvPut(db, 'notifyDay', today);
}
self.addEventListener('periodicsync', e => { if (e.tag === 'peremption') e.waitUntil(backgroundCheck().catch(() => {})); });
self.addEventListener('notificationclick', e => {
  e.notification.close(); const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil((async () => { const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); for (const w of wins) { if (w.url.startsWith(self.registration.scope)) { await w.focus(); try { await w.navigate(url); } catch (err) {} return; } } await self.clients.openWindow(url); })());
});

