// Service worker : l'app fonctionne entièrement hors ligne après la première ouverture.
// Ne supprime que ses propres caches (le domaine github.io est partagé avec tes autres apps).
const VERSION = '1.1.0';
const CACHE = 'mon-frigo-' + VERSION;
const CORE = ['./', 'index.html', 'styles.css', 'manifest.webmanifest',
  'js/app.js', 'js/state.js', 'js/db.js', 'js/ui.js', 'js/icons.js', 'js/nav.js', 'js/util.js', 'js/units.js', 'js/kb.js', 'js/stock.js', 'js/recipes.js', 'js/plan.js', 'js/actions.js', 'js/backup.js', 'js/views.js', 'js/sheets1.js', 'js/sheets2.js', 'js/migrate.js',
  'data/ingredients.json', 'data/recipes.json', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/maskable-192.png', 'assets/maskable-512.png', 'assets/favicon.png', 'assets/apple-touch-icon.png', 'assets/fonts/bricolage.woff2', 'assets/fonts/instrument-sans.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && (k.startsWith('mon-frigo-') || /^frigo-v\d+$/.test(k))).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return; // ex. Open Food Facts : réseau direct
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; }).catch(() => caches.match('index.html', { ignoreSearch: true })));
    return;
  }
  // fichiers de l'app : depuis le cache de la version installée (cohérence garantie), sinon réseau
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
});
