"""Test « singe » : des centaines de touchers au hasard dans l'app (dist/), pour attraper les erreurs JS et les écrans cassés.
Lancer : python3 tests/monkey.py [actions=700] [graine=1] [ambiance]   (ambiance : Classique, Chaumière, Bistrot…)"""
import sys, random, json, time
import serve
from playwright.sync_api import sync_playwright
N = int(sys.argv[1]) if len(sys.argv) > 1 else 700
seed = int(sys.argv[2]) if len(sys.argv) > 2 else 1
th = sys.argv[3] if len(sys.argv) > 3 else ''
random.seed(seed); URL = serve.start()
SKIP = ['Réparer', 'Effacer toutes', 'Installer', 'Prendre le ticket en photo', 'Choisir une photo', 'Importer une sauvegarde', 'Scanner un code-barres', 'Revoir l’accueil']
WORDS = ['lait', 'pâtes', 'Coquillettes', 'Jambon sec', 'tomates', '12', '0', '-3', '1,5', 'abc', '', 'Caprice des dieux', 'oeufs x6', 'Moutarde 260 g', '9999', '  ', 'é"<b>', 'poulet', 'riz']
issues = []; t0 = time.time()
with sync_playwright() as p:
    b = p.chromium.launch(channel='chromium')
    ctx = b.new_context(viewport={'width': 360, 'height': 740}, is_mobile=True, has_touch=True, locale='fr-FR', color_scheme=random.choice(['light', 'dark']), accept_downloads=True)
    ctx.grant_permissions(['notifications']); pg = ctx.new_page(); pg.set_default_timeout(1500)
    pg.on('pageerror', lambda e: issues.append(('JS', str(e)[:200])))
    pg.on('console', lambda m: issues.append(('console', m.text[:200])) if m.type == 'error' else None)
    pg.on('filechooser', lambda fc: None); pg.on('dialog', lambda d: (issues.append(('dialog', d.message[:80])), d.dismiss()))
    pg.goto(URL); pg.wait_for_selector('.sheet.open'); pg.locator('.sheet.open').last.get_by_role('button', name='Commencer').click(); pg.wait_for_timeout(300)
    pg.click('#tabbar [data-tab=stock]'); pg.wait_for_timeout(250); pg.get_by_role('button', name='Ajout rapide').first.click(); s = pg.locator('.sheet.open').last
    for n in ['🥚 Œufs', '🍝 Pâtes', '🥓 Lardons', '🧅 Oignon', '🥒 Courgette', '🥛 Lait', '🧀 Fromage râpé', '🍗 Poulet']: s.get_by_role('button', name=n, exact=True).click()
    s.locator('.sheet-foot .btn').click(); pg.wait_for_timeout(300)
    if th: pg.click('#meBtn'); pg.wait_for_timeout(200); pg.locator('.acc-head', has_text='Apparence').click(); pg.get_by_role('button', name='Ambiance ' + th).click(); pg.wait_for_timeout(300); pg.click('#tabbar [data-tab=home]')
    last = []
    for i in range(N):
        try:
            if random.random() < .06: pg.keyboard.press('Escape'); pg.wait_for_timeout(120); continue
            if random.random() < .05: pg.click(f"#tabbar [data-tab={random.choice(['home','stock','recipes','plan','shop'])}]"); pg.wait_for_timeout(120); continue
            scope = pg.locator('.sheet.open').last if pg.locator('.sheet.open').count() else pg.locator('#view')
            cands = scope.locator('button:visible, [role=button]:visible, input:visible, select:visible, summary:visible, .sea-tile:visible').all()
            if not cands: pg.keyboard.press('Escape'); continue
            el = random.choice(cands); tag = el.evaluate('e => e.tagName'); label = (el.get_attribute('aria-label') or el.inner_text() or '')[:40].replace('\n', ' ')
            if any(k in label for k in SKIP): continue
            typ = el.get_attribute('type') if tag == 'INPUT' else None
            if tag == 'INPUT' and typ not in ('checkbox', 'file', 'date'): el.fill(random.choice(WORDS)); el.press(random.choice(['Enter', 'Tab'])) if random.random() < .5 else None; act = f'tape {label}'
            elif tag == 'INPUT' and typ == 'date': el.fill(random.choice(['2026-12-01', '2025-01-01', ''])); el.dispatch_event('change'); act = f'date {label}'
            elif tag == 'INPUT' and typ == 'file': continue
            elif tag == 'SELECT':
                opts = el.locator('option').all_inner_texts()
                if opts: el.select_option(index=random.randrange(len(opts))); act = f'choisit {label}'
                else: continue
            else: el.click(timeout=1200); act = f'clic {label}'
            last = (last + [act])[-6:]; pg.wait_for_timeout(random.choice([40, 80, 150]))
            if pg.locator('text=Oups, un souci d’affichage').count(): issues.append(('écran cassé', ' > '.join(last))); pg.click('#tabbar [data-tab=home]')
        except Exception as e:
            msg = str(e).split('\n')[0]
            if 'Timeout' not in msg and 'not attached' not in msg and 'not visible' not in msg and 'intercepts pointer' not in msg: issues.append(('playwright', msg[:120]))
    state = pg.evaluate("(() => { const d = window.__monFrigo.S.data; return { stock: d.stock.length, bad: d.stock.filter(x => !(x.qty > 0) || !x.name || !x.unit).map(x => x.name + ' ' + x.qty + ' ' + x.unit), shop: d.shop.length, badShop: d.shop.filter(x => !x.name).length, hist: d.history.length } })()")
    b.close()
seen = {}
for k, v in issues: seen.setdefault((k, v), 0); seen[(k, v)] += 1
print(f'graine {seed} : {N} actions en {time.time()-t0:.0f} s, {len(issues)} problème(s) | état final {json.dumps(state, ensure_ascii=False)}')
for (k, v), n in list(seen.items())[:15]: print(f'  [{k}] ×{n} {v}')
sys.exit(1 if issues else 0)
