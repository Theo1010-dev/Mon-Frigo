"""Parcours utilisateur complet dans Chromium (mobile). Lancer : python3 tests/e2e.py"""
import sys, os, json, threading, http.server, socketserver, functools, time
from playwright.sync_api import sync_playwright, expect
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 8820), functools.partial(Q, directory=ROOT)); threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:8820/index.html'
OK, KO, errs = [], [], []
def step(name):
    def deco(fn):
        try: fn(); OK.append(name); print('✓', name)
        except Exception as e: KO.append((name, str(e)[:400])); print('✗', name, '\n   ', str(e)[:400]); pg.screenshot(path=f'/tmp/fail_{len(KO)}.png')
    return deco
def D(): return pg.evaluate('JSON.parse(JSON.stringify(window.__monFrigo.S.data))')
def sheet(): return pg.locator('.sheet.open').last
def close_sheets():
    for _ in range(4):
        if pg.locator('.sheet.open').count(): pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
def tab(t): close_sheets(); pg.click(f'#tabbar [data-tab={t}]'); pg.wait_for_timeout(300)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='fr-FR', accept_downloads=True)
    pg = ctx.new_page()
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    pg.goto(URL); pg.wait_for_selector('.sheet.open')

    @step('Onboarding : réglages enregistrés')
    def _():
        s = sheet(); s.get_by_role('button', name='Plus').click(); s.get_by_role('button', name='Mixeur').click()
        s.get_by_role('button', name='Commencer').click(); pg.wait_for_timeout(400)
        d = D()['prefs']; assert d['onboarded'] and d['people'] == 3 and 'mixeur' in d['equip'], d

    @step('Stock : ajout via le formulaire (suggestion, date estimée)')
    def _():
        tab('stock'); pg.click('.fab'); s = sheet()
        s.locator('#as-name').fill('lai'); s.get_by_role('button', name='🥛 Lait').click()
        s.locator('#as-qty').fill('1'); s.locator('#as-unit').select_option('l')
        assert s.locator('#as-exp').input_value(), 'date non estimée'
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        lait = [x for x in D()['stock'] if x['ing'] == 'lait'][0]; assert lait['qty'] == 1 and lait['unit'] == 'l' and lait['zone'] == 'frigo' and lait['expiry'], lait

    @step('Stock : produit inconnu accepté et "Aucune date limite"')
    def _():
        pg.click('.fab'); s = sheet(); s.locator('#as-name').fill('Sauce samouraï maison'); s.locator('#as-qty').fill('2'); s.locator('#as-none').check()
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        it = [x for x in D()['stock'] if 'samoura' in x['name'].lower()][0]; assert it['expiry'] is None and it['ing'].startswith('c-'), it
        assert pg.get_by_text('Sauce samouraï maison').count() and pg.locator('.tag.none').count()

    @step('Ajout rapide de plusieurs produits')
    def _():
        pg.get_by_role('button', name='Ajout rapide').first.click(); s = sheet()
        for n in ['🥚 Œufs', '🍝 Pâtes', '🥓 Lardons', '🧅 Oignon', '🍅 Tomates']: s.get_by_role('button', name=n).click()
        s.get_by_role('button', name='Ajouter 5 produits').click(); pg.wait_for_timeout(300)
        ings = {x['ing'] for x in D()['stock']}; assert {'oeufs', 'pates', 'lardons', 'oignon', 'tomate'} <= ings, ings

    @step('Stock : ajout avec fusion du même lot + parmesan')
    def _():
        pg.click('.fab'); s = sheet(); s.locator('#as-name').fill('parmesan'); s.locator('#as-name').press('Enter'); s.locator('#as-qty').fill('100'); s.locator('#as-unit').select_option('g')
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        assert any(x['ing'] == 'parmesan' and x['qty'] == 100 for x in D()['stock'])

    @step('Recherche de recette + couverture du stock exacte')
    def _():
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', 'carbonara'); pg.wait_for_timeout(400)
        pg.get_by_text('Pâtes carbonara').first.click(); pg.wait_for_timeout(400); s = sheet()
        expect(s.get_by_text('Tu as tous les ingrédients')).to_be_visible()
        s.get_by_role('button', name='Moins').click(); pg.wait_for_timeout(100)  # 3 -> 2 personnes
        expect(s.get_by_text('2 personnes')).to_be_visible()

    @step('Favori depuis la fiche recette')
    def _():
        sheet().get_by_role('button', name='Favori').click(); pg.wait_for_timeout(200); assert 'pates-carbonara' in D()['fav']

    @step('Mode cuisine : étapes, minuteur détecté, session reprise depuis l’accueil')
    def _():
        sheet().get_by_role('button', name='Cuisiner').click(); pg.wait_for_timeout(500); s = sheet()
        expect(s.get_by_text('Étape 1 sur 4')).to_be_visible(); s.get_by_role('button', name='Minuteur 11 min').click(); pg.wait_for_timeout(700)
        assert D()['cook']['timers'], 'minuteur non enregistré'
        s.get_by_role('button', name='Étape suivante').click(); assert D()['cook']['step'] == 1
        close_sheets(); tab('home'); pg.get_by_text('Cuisson en cours').click(); pg.wait_for_timeout(500)
        expect(sheet().get_by_text('Étape 2 sur 4')).to_be_visible()

    @step('Fin de cuisson : stock déduit (FIFO), restes, note, historique, annulation')
    def _():
        before = {x['ing']: x['qty'] for x in D()['stock'] if x['ing']}
        s = sheet()
        for _ in range(3): s.locator('.sheet-foot .btn.primary').click(); pg.wait_for_timeout(150)
        pg.wait_for_timeout(500); s = sheet(); expect(s.get_by_text('Bon appétit')).to_be_visible()
        s.get_by_role('button', name='Plus').click(); s.get_by_role('button', name='5 étoiles').click(); s.get_by_role('button', name='Terminer').click(); pg.wait_for_timeout(500)
        d = D(); after = {x['ing']: x['qty'] for x in d['stock'] if x['ing']}
        assert after['pates'] == before['pates'] - 200, (before['pates'], after.get('pates'))
        assert after['lardons'] == before['lardons'] - 100 and after['oeufs'] == before['oeufs'] - 4, (before, after)
        assert after['parmesan'] == 60, after['parmesan']
        assert d['history'][-1]['rid'] == 'pates-carbonara' and d['history'][-1]['rating'] == 5 and d['ratings']['pates-carbonara'] == 5
        assert any(x['name'].startswith('Reste : Pâtes carbonara') and x['qty'] == 1 for x in d['stock']) and d['cook'] is None
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); d2 = D()
        assert {x['ing']: x['qty'] for x in d2['stock'] if x['ing']}['pates'] == before['pates'] and len(d2['history']) == 0, 'annulation incomplète'

    @step('Semaine : génération automatique puis liste de courses déduite du stock')
    def _():
        tab('plan'); pg.get_by_role('button', name='Compléter').click(); pg.wait_for_timeout(600)
        d = D(); n = sum(len(v) for v in d['plan'].values()); assert n >= 2, n
        pg.get_by_role('button', name='Courses').first.click(); pg.wait_for_timeout(600)
        shop = D()['shop']; assert shop and all(x['src'] == 'plan' for x in shop), shop
        assert not any(x['ing'] in ('sel', 'poivre', 'huile-olive') for x in shop), 'produits de base dans les courses'
        assert pg.evaluate('location.hash') == '#/shop'

    @step('Courses : cocher, ranger dans le stock avec zone et date')
    def _():
        shop = D()['shop']; n0 = len(D()['stock'])
        cbs = pg.locator('.shop-item .cb'); cbs.nth(0).click(); pg.wait_for_timeout(150); pg.locator('.shop-item:not(.done) .cb').first.click(); pg.wait_for_timeout(300)
        pg.get_by_role('button', name='Ranger 2 produits dans le stock', exact=True).click(); pg.wait_for_timeout(400)
        sheet().get_by_role('button', name='Ranger dans le stock').click(); pg.wait_for_timeout(400)
        d = D(); assert len(d['shop']) == len(shop) - 2, (len(shop), len(d['shop'])); assert len(d['stock']) >= n0 + 1

    @step('Courses : ajout manuel sans doublon')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('Pain'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('pain'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('pain'); s.locator('input').nth(1).fill('2'); s.locator('select').select_option('tranche'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pains=[x for x in D()['shop'] if x['ing'] == 'pain' and not x['done']]; assert len(pains) == 1 and pains[0]['qty'] in (2, 8), [(x['name'],x['qty'],x['unit']) for x in pains]
        assert len(pains) == 1, [ (x['name'],x['qty'],x['unit'],x['src']) for x in D()['shop'] if 'ain' in x['name']]

    @step('Produit : quantité modifiée, suppression puis annulation')
    def _():
        tab('stock'); pg.get_by_text('Lait').first.click(); pg.wait_for_timeout(300); s = sheet()
        s.get_by_role('button', name='Plus').click(); pg.wait_for_timeout(200)
        lait = [x for x in D()['stock'] if x['ing'] == 'lait'][0]; assert lait['qty'] == 1.25, lait
        s.get_by_role('button', name='Supprimer ce produit').click(); pg.wait_for_timeout(300); assert not any(x['ing'] == 'lait' for x in D()['stock'])
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert any(x['ing'] == 'lait' for x in D()['stock'])

    @step('Jeter un produit : journal anti-gaspi')
    def _():
        pg.get_by_text('Lait').first.click(); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Jeter').click(); pg.wait_for_timeout(300)
        s = sheet(); s.get_by_role('button', name='Abîmé').click(); s.get_by_role('button', name='Jeter et noter').click(); pg.wait_for_timeout(300)
        w = D()['waste']; assert w and w[-1]['reason'] == 'Abîmé' and w[-1]['ing'] == 'lait'

    @step('Bouton retour Android : ferme la feuille sans quitter l’onglet')
    def _():
        close_sheets(); tab('stock'); pg.click('.fab'); pg.wait_for_timeout(300); assert pg.locator('.sheet.open').count() == 1
        pg.go_back(); pg.wait_for_timeout(400); assert pg.locator('.sheet.open').count() == 0 and pg.evaluate('location.hash') == '#/stock'
        pg.click('.fab'); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Fermer').click(); pg.wait_for_timeout(300)
        pg.click('.fab'); pg.wait_for_timeout(300); assert pg.locator('.sheet.open').count() == 1, 'réouverture après fermeture'
        pg.go_back(); pg.wait_for_timeout(400); assert pg.locator('.sheet.open').count() == 0 and pg.evaluate('location.hash') == '#/stock'

    @step('Recette personnelle : validation puis création, recherche, filtre « Mes recettes »')
    def _():
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', ''); pg.wait_for_timeout(300); pg.get_by_role('button', name='Créer ma recette').click(); pg.wait_for_timeout(300); s = sheet()
        s.get_by_role('button', name='Enregistrer').click(); pg.wait_for_timeout(200); assert not D()['custom'], ('recette vide acceptée', D()['custom'])
        s.locator('input').first.fill('Gratin de mamie'); ing = s.locator('.ing-row').first; ing.locator('input').nth(0).fill('pommes de terre'); ing.locator('input').nth(1).fill('800')
        s.locator('textarea').fill('Couper les pommes de terre\nCuire 45 min au four'); s.get_by_role('button', name='Enregistrer').click(); pg.wait_for_timeout(600)
        c = D()['custom']; assert len(c) == 1 and c[0]['i'][0][0] == 'pomme-de-terre', ('custom', c)
        close_sheets(); pg.get_by_role('button', name='Mes recettes').click(); pg.wait_for_timeout(300); assert pg.get_by_text('Gratin de mamie').count() == 1, ('visible', pg.get_by_text('Gratin de mamie').count(), pg.locator('.rec').count())
        pg.get_by_role('button', name='Mes recettes').click()

    @step('Filtres : végé + temps max respectés')
    def _():
        pg.get_by_role('button', name='Végé').click(); pg.wait_for_timeout(200)
        ok = pg.evaluate('''() => { const S = window.__monFrigo.S; return [...document.querySelectorAll('.rec .strong')].slice(0,30).every(e => { const r = S.cat.list.find(x => x.t === e.textContent); return r && r.veg; }); }''')
        assert ok; pg.get_by_role('button', name='Végé').click()

    @step('Sauvegarde : export, effacement total, import, données restaurées')
    def _():
        before = D(); tab('home'); pg.click('#meBtn'); pg.wait_for_timeout(300)
        with pg.expect_download() as dl: pg.get_by_role('button', name='Télécharger une sauvegarde').click()
        path = dl.value.path(); data = json.load(open(path)); assert data['app'] == 'mon-frigo' and len(data['data']['stock']) == len(before['stock'])
        pg.get_by_role('button', name='Effacer toutes mes données').click(); sheet().get_by_role('button', name='Tout effacer').click(); pg.wait_for_timeout(900)
        close_sheets(); assert not D()['stock'] and not D()['custom']
        pg.click('#meBtn'); pg.wait_for_timeout(300); pg.set_input_files('input[type=file]', path); pg.wait_for_timeout(500)
        sheet().get_by_role('button', name='Remplacer').click(); pg.wait_for_timeout(600)
        after = D(); assert len(after['stock']) == len(before['stock']) and len(after['custom']) == 1 and after['fav'] == before['fav']
        assert pg.evaluate('window.__monFrigo.S.cat.get(window.__monFrigo.S.data.custom[0].id) != null'), 'recette perso non recréée'

    @step('Persistance : les données survivent au rechargement')
    def _():
        n = len(D()['stock']); pg.reload(); pg.wait_for_selector('.view'); pg.wait_for_timeout(500); assert len(D()['stock']) == n

    @step('Hors ligne : l’app se recharge sans réseau (service worker)')
    def _():
        pg.wait_for_timeout(1500); pg.evaluate('navigator.serviceWorker.ready'); pg.reload(); pg.wait_for_timeout(800)
        ctx.set_offline(True); pg.reload(); pg.wait_for_selector('.view', timeout=8000); pg.click('#tabbar [data-tab=recipes]'); pg.wait_for_timeout(400)
        assert pg.locator('.rec').count() > 5; ctx.set_offline(False)

    @step('Thème sombre appliqué')
    def _():
        pg.click('#meBtn'); pg.wait_for_timeout(300); pg.get_by_role('tab', name='Sombre').click(); pg.wait_for_timeout(300)
        bg = pg.evaluate("getComputedStyle(document.body).backgroundColor"); assert bg == 'rgb(21, 17, 24)', bg; pg.screenshot(path='/tmp/dark_me.png')
        pg.get_by_role('tab', name='Automatique').click()

    @step('Petit écran 320 px : aucun débordement horizontal')
    def _():
        pg.set_viewport_size({'width': 320, 'height': 640}); bad = []
        for t in ['home', 'stock', 'recipes', 'plan', 'shop']:
            pg.click(f'#tabbar [data-tab={t}]'); pg.wait_for_timeout(300)
            w = pg.evaluate('document.documentElement.scrollWidth'); 
            if w > 320: bad.append((t, w))
        pg.click('#meBtn'); pg.wait_for_timeout(300); w = pg.evaluate('document.documentElement.scrollWidth'); bad += [('me', w)] if w > 320 else []
        pg.set_viewport_size({'width': 390, 'height': 844}); assert not bad, bad

    print(f'\n{len(OK)} parcours réussis, {len(KO)} échecs, {len(errs)} erreurs console')
    for e in errs[:10]: print('  console:', e[:300])
    b.close()
sys.exit(1 if KO or errs else 0)
