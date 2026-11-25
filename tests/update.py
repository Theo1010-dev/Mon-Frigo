"""Test de mise à jour : l'ancienne version en ligne (dossier plat, ex. la branche main) -> la nouvelle (dist/).
Vérifie que toutes les données sont gardées, que l'ancien cache est supprimé et que l'app marche hors ligne.
Lancer : python3 tests/update.py <dossier de l'ancienne version>"""
import sys, os, shutil, json, tempfile
import serve
from playwright.sync_api import sync_playwright

OLD = os.path.abspath(sys.argv[1]); NEW = serve.DIST
NEW_V = json.load(open(os.path.join(NEW, 'version.json')))['version']
OLD_V = json.load(open(os.path.join(OLD, 'version.json')))['version']
ROOT = tempfile.mkdtemp(prefix='frigo-maj-'); REPO = os.path.join(ROOT, 'Mon-Frigo')
shutil.copytree(OLD, REPO, ignore=shutil.ignore_patterns('.git', '*.md'))
URL = serve.start(ROOT) + 'Mon-Frigo/'
problems = []
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 390, 'height': 844}); ctx.set_default_timeout(15000); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_function('!!window.__monFrigo'); pg.get_by_role('button', name='Commencer').click(); pg.wait_for_timeout(300)
    pg.click('#tabbar [data-tab=stock]'); pg.wait_for_timeout(300)
    pg.get_by_role('button', name='Ajout rapide').first.click(); s = pg.locator('.sheet.open').last
    for n in ['🥚 Œufs', '🍝 Pâtes', '🥓 Lardons', '🥛 Lait']: s.get_by_role('button', name=n, exact=True).click()
    s.locator('.sheet-foot .btn').click(); pg.wait_for_timeout(800)
    pg.evaluate("""() => new Promise(res => { const r = indexedDB.open('mon-frigo', 1); r.onsuccess = () => { const db = r.result, tx = db.transaction('kv', 'readwrite'), st = tx.objectStore('kv');
      st.put([{ id: 'sh1', ing: 'pain', name: 'Pain de campagne', qty: 1, unit: 'pièce', cat: 'Boulangerie', done: false, src: 'manual', price: 1.2 }], 'shop');
      st.put({ '2030-01-01': { dinner: { rid: 'pates-carbonara', serv: 2, done: false }, lunch: { note: 'Restaurant', serv: 2, done: false } } }, 'plan');
      st.put([{ id: 'h1', rid: 'pates-carbonara', title: 'Pâtes carbonara', date: '2026-10-01', serv: 2, rating: 5 }], 'history');
      st.put(['pates-carbonara'], 'fav');
      st.put([{ id: 'perso-x', t: 'Gratin de mamie', c: 'Mes recettes', d: 'Facile', m: 45, s: 4, e: [], g: [], k: '', mt: ['Dîner'], i: [['pomme-de-terre', 800, 'g']], p: ['Cuire'], o: 'perso', custom: true }], 'custom');
      tx.oncomplete = () => res(true); }; })""")
    pg.evaluate("""() => new Promise(res => { const r = indexedDB.open('mon-frigo', 1); r.onsuccess = () => { const db = r.result, tx = db.transaction('kv', 'readwrite'), st = tx.objectStore('kv'); const g = st.get('prefs'); g.onsuccess = () => { st.put({ ...g.result, theme: 'cottage', pantry: ['sel', 'poivre', 'huile-olive', 'moutarde'], equip: ['four', 'mixeur'] }, 'prefs'); }; tx.oncomplete = () => res(true); }; })""")
    snap = lambda: pg.evaluate("JSON.stringify(['stock','shop','plan','history','fav','custom'].map(k => window.__monFrigo.S.data[k]))")
    pg.reload(); pg.wait_for_function('!!window.__monFrigo'); pg.wait_for_timeout(500); before = snap(); prefs0 = pg.evaluate("JSON.stringify(window.__monFrigo.S.data.prefs)")
    for f in os.listdir(NEW): shutil.copy(os.path.join(NEW, f), os.path.join(REPO, f))   # « mise en ligne » de la nouvelle version
    pg.goto(URL)
    for i in range(30):
        pg.wait_for_timeout(500)
        try:
            if pg.evaluate("window.__monFrigo && window.__monFrigo.VERSION") == NEW_V: break
        except Exception: pass
    def retry(fn):
        for _ in range(20):
            try: return fn()
            except Exception: pg.wait_for_timeout(500)
        return fn()
    pg.wait_for_timeout(2500); retry(lambda: pg.wait_for_function('!!window.__monFrigo')); after = retry(snap); v = retry(lambda: pg.evaluate('window.__monFrigo.VERSION'))
    names = ['stock', 'courses', 'semaine', 'historique', 'favoris', 'recettes perso']; bl, al = json.loads(before), json.loads(after)
    diffs = [n for n, x, y in zip(names, bl, al) if json.dumps(x, sort_keys=True) != json.dumps(y, sort_keys=True)]
    p1 = json.loads(pg.evaluate("JSON.stringify(window.__monFrigo.S.data.prefs)")); p0 = json.loads(prefs0)
    lost = [k for k in p0 if json.dumps(p0[k]) != json.dumps(p1.get(k)) and not (k == 'equip' and p1[k] == ['plaques'] + p0[k])]
    # avant la 1.13.2, les plaques ne comptaient pas : la mise à jour les coche une fois ; ensuite l'équipement ne bouge plus
    want = ['plaques', 'four', 'mixeur'] if tuple(map(int, OLD_V.split('.'))) < (1, 13, 2) else ['four', 'mixeur']
    if p1.get('equip') != want: problems.append('équipement ' + str(p1.get('equip')))
    print(f'v{OLD_V} -> v{v} :', 'toutes les données identiques ✓' if not diffs else 'DIFFÉRENCES ' + str(diffs), '| préférences modifiées :', lost or 'aucune', '| équipement :', p1.get('equip'))
    if lost: problems.append('préférences ' + str(lost))
    if v != NEW_V: problems.append('version ' + str(v))
    if diffs: problems.append('données ' + str(diffs))
    if pg.evaluate('document.documentElement.dataset.amb') != 'cottage': problems.append('ambiance perdue')
    for k in range(20):
        pg.wait_for_timeout(500); ck = pg.evaluate('caches.keys()')
        if ck == ['mon-frigo-' + NEW_V]: break
    print('caches :', ck)
    if ck != ['mon-frigo-' + NEW_V]: problems.append('caches ' + str(ck))
    ctx.set_offline(True); pg.reload(); pg.wait_for_function('!!window.__monFrigo', timeout=15000)
    off = (pg.evaluate('window.__monFrigo.VERSION'), pg.evaluate('window.__monFrigo.S.cat.list.length')); ctx.set_offline(False)
    print('hors ligne : version', off[0], '| recettes', off[1], '| erreurs JS :', errs or 'aucune')
    if off[0] != NEW_V or off[1] < 100: problems.append('hors ligne')
    if errs: problems.append('erreurs JS')
    b.close()
shutil.rmtree(ROOT, ignore_errors=True)
print('MISE À JOUR OK' if not problems else 'PROBLÈMES : ' + ', '.join(problems)); sys.exit(1 if problems else 0)
