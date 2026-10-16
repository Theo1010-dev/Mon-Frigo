"""Vérifie la récupération automatique des données de l'ancienne version (v0.9)."""
import os, sys, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 8840), functools.partial(Q, directory=ROOT)); threading.Thread(target=srv.serve_forever, daemon=True).start()
OLD = """() => new Promise((res, rej) => { const r = indexedDB.open('mon-frigo-local', 4);
  r.onupgradeneeded = () => { const db = r.result; ['stock','shopping','history','waste','meta'].forEach(s => db.createObjectStore(s, { keyPath: 'id' })); };
  r.onsuccess = () => { const db = r.result, tx = db.transaction(['stock','shopping','waste','meta'], 'readwrite');
    tx.objectStore('stock').put({ id: 'food1', name: 'Lait demi-écrémé', qty: 2, unit: 'l', zone: 'frigo', expiry: '2026-10-20', purchasedAt: '2026-10-10' });
    tx.objectStore('stock').put({ id: 'food2', name: 'Courgettes', qty: '3', unit: 'pièces', zone: 'frigo', expiry: '' });
    tx.objectStore('stock').put({ id: 'food3', name: 'Truc bizarre', qty: 1, unit: 'pièce', zone: 'cave', expiry: 'pas une date' });
    tx.objectStore('shopping').put({ id: 'shop1', name: 'Pain', qty: '1', unit: 'pièce', price: 0, category: 'Boulangerie', done: false });
    tx.objectStore('waste').put({ id: 'w1', name: 'Salade', qty: 1, unit: 'pièce', reason: 'Périmé', date: '2026-10-01' });
    tx.objectStore('meta').put({ id: 'prefs', value: { defaultServings: 4, budget: 80, dislikes: ['champignons'] } });
    tx.oncomplete = () => { db.close(); res(true); }; tx.onerror = () => rej(tx.error); }; r.onerror = () => rej(r.error); })"""
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 390, 'height': 844}); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://127.0.0.1:8840/manifest.webmanifest'); pg.evaluate(OLD)
    pg.goto('http://127.0.0.1:8840/index.html'); pg.wait_for_selector('.view'); pg.wait_for_timeout(1200)
    d = pg.evaluate('JSON.parse(JSON.stringify(window.__monFrigo.S.data))')
    st = {x['name']: x for x in d['stock']}
    checks = [
        ('3 produits récupérés', len(d['stock']) == 3),
        ('lait reconnu et unité conservée', st['Lait demi-écrémé']['ing'] == 'lait' and st['Lait demi-écrémé']['unit'] == 'l' and st['Lait demi-écrémé']['expiry'] == '2026-10-20'),
        ('quantité texte convertie, unité normalisée', st['Courgettes']['qty'] == 3 and st['Courgettes']['unit'] == 'pièce' and st['Courgettes']['ing'] == 'courgette' and st['Courgettes']['expiry'] is None),
        ('zone/date invalides corrigées', st['Truc bizarre']['zone'] == 'frigo' and st['Truc bizarre']['expiry'] is None),
        ('courses récupérées', len(d['shop']) == 1 and d['shop'][0]['ing'] == 'pain' and d['shop'][0]['cat'] == 'Boulangerie'),
        ('journal anti-gaspi récupéré', len(d['waste']) == 1 and d['waste'][0]['reason'] == 'Périmé'),
        ('préférences récupérées', d['prefs']['people'] == 4 and d['prefs']['budget'] == 80 and d['prefs']['dislikes'] == ['champignons']),
        ('migration marquée faite', bool(d['meta'].get('migrated'))),
    ]
    pg.reload(); pg.wait_for_selector('.view'); pg.wait_for_timeout(800)
    checks.append(('pas de double import au rechargement', len(pg.evaluate('window.__monFrigo.S.data.stock')) == 3))
    checks.append(('aucune erreur', not errs))
    b.close()
for n, ok in checks: print(('✓ ' if ok else '✗ ') + n)
sys.exit(0 if all(ok for _, ok in checks) else 1)
