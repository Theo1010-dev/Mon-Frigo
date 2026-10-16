// Service worker de Mon Frigo (version et liste de fichiers injectées par tools/build.mjs).
// Règle d'or : la page vient d'internet en priorité, le cache ne sert que hors ligne ou si le réseau est très lent.
// Il ne touche qu'à ses propres caches : le domaine github.io est partagé avec tes autres applis.
const VERSION = '1.2.0';
const CACHE = 'mon-frigo-' + VERSION;
const CORE = ["./","index.html","app.js?v=1.2.0","styles.css?v=1.2.0","manifest.webmanifest","data/ingredients.json?v=1.2.0","data/recipes.json?v=1.2.0","assets/apple-touch-icon.png","assets/favicon.png","assets/fonts/bricolage.woff2","assets/fonts/instrument-sans.woff2","assets/icon-192.png","assets/icon-512.png","assets/maskable-192.png","assets/maskable-512.png"];
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
  e.respondWith((async () => {
    const hit = await caches.match(req); if (hit) return hit;
    const r = await fetch(req);
    if (r.ok && url.searchParams.has('v')) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })());
});
