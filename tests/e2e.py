"""Parcours utilisateur complet dans Chromium (mobile). Lancer : python3 tests/e2e.py"""
import sys, os, json, threading, http.server, socketserver, functools, time
from playwright.sync_api import sync_playwright, expect
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), os.environ.get('FRIGO_ROOT', 'dist'))
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
def open_acc(name):
    if pg.locator('.acc.open', has_text=name).count() == 0: pg.locator('.acc-head', has_text=name).first.click(); pg.wait_for_timeout(250)
def tab(t): close_sheets(); pg.click(f'#tabbar [data-tab={t}]'); pg.wait_for_timeout(300)

with sync_playwright() as p:
    b = p.chromium.launch(channel='chromium')
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='fr-FR', accept_downloads=True)
    ctx.grant_permissions(['notifications']); pg = ctx.new_page()
    pg.add_init_script("new MutationObserver(() => { if (document.querySelector('.lvlup')) try { sessionStorage.setItem('lvlSeen', '1'); } catch (e) {} }).observe(document, { childList: true, subtree: true })")
    LVL = []  # écran « Niveau n ! » : noté puis refermé quand il gêne un clic
    pg.add_locator_handler(pg.locator('.lvlup.in'), lambda: (LVL.append(pg.locator('.lvl-n').inner_text()), pg.keyboard.press('Escape'), pg.wait_for_timeout(400)))
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
        s.locator('#as-name').fill('lai'); s.get_by_role('button', name='🥛 Lait', exact=True).click()
        s.locator('#as-qty').fill('1'); s.locator('#as-unit').select_option('l')
        assert s.locator('#as-exp').input_value(), 'date non estimée'
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        lait = [x for x in D()['stock'] if x['ing'] == 'lait'][0]; assert lait['qty'] == 1 and lait['unit'] == 'l' and lait['zone'] == 'frigo' and lait['expiry'], lait

    @step('Stock : produit inconnu accepté et "Aucune date limite"')
    def _():
        pg.click('.fab'); s = sheet(); s.locator('#as-name').fill('Sauce samouraï maison'); pg.wait_for_timeout(400); s.locator('#as-qty').fill('2'); sd = s.get_by_role('button', name='Sans date limite'); sd.click() if sd.is_visible() else None
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        it = [x for x in D()['stock'] if 'samoura' in x['name'].lower()][0]; assert it['expiry'] is None and it['ing'].startswith('c-'), it
        assert pg.get_by_text('Sauce samouraï maison').count() and pg.locator('.tag.none').count()

    @step('Ajout rapide de plusieurs produits')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Ajouter plusieurs produits courants d’un coup').click(); pg.wait_for_timeout(400); s = sheet()
        for n in ['🥚 Œufs', '🍝 Pâtes', '🥓 Lardons', '🧅 Oignon', '🍅 Tomates']: s.get_by_role('button', name=n).click()
        s.get_by_role('button', name='Ajouter 5 produits').click(); pg.wait_for_timeout(300)
        ings = {x['ing'] for x in D()['stock']}; assert {'oeufs', 'pates', 'lardons', 'oignon', 'tomate'} <= ings, ings

    @step('Stock : vue « Ma cuisine » (frigo, placard, plan de travail), fiche au toucher, retour à la liste')
    def _():
        tab('stock'); pg.get_by_role('tab', name='🏠 Ma cuisine').click(); pg.wait_for_timeout(500)
        assert pg.locator('.kitchen').count() == 1 and D()['prefs'].get('stockView') == 'kitchen'
        assert pg.locator('.k-item').count() == len(D()['stock']), (pg.locator('.k-item').count(), len(D()['stock']))
        assert pg.locator('.k-fridge .k-item').count() == sum(1 for x in D()['stock'] if x['zone'] == 'frigo')
        pg.locator('.k-item').first.click(); pg.wait_for_timeout(400); assert sheet().count() == 1; close_sheets()
        pg.locator('.k-always').click(); pg.wait_for_timeout(400); assert 'Toujours chez moi' in sheet().locator('.sheet-head h2').inner_text(); close_sheets()
        pg.get_by_role('tab', name='📋 Liste').click(); pg.wait_for_timeout(300); assert pg.locator('.kitchen').count() == 0 and D()['prefs'].get('stockView') == 'list'

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
        tab('plan'); pg.get_by_role('button', name='Proposer des repas').click(); pg.wait_for_timeout(400); pg.get_by_role('button', name='Compléter la semaine').click(); pg.wait_for_timeout(600)
        d = D(); n = sum(len(v) for v in d['plan'].values()); assert n >= 2, n
        pg.get_by_role('button', name='Courses').first.click(); pg.wait_for_timeout(600)
        shop = D()['shop']; assert shop and all(x['src'] == 'plan' for x in shop), shop
        assert not any(x['ing'] in ('sel', 'poivre', 'huile-olive') for x in shop), 'produits de base dans les courses'
        assert pg.evaluate('location.hash') == '#/shop'

    @step('Courses : cocher, ranger dans le stock avec zone et date')
    def _():
        shop = D()['shop']; qty = lambda nm: sum(x['qty'] for x in D()['stock'] if x['name'] == nm)
        pg.locator('.shop-item .cb').nth(0).click(); pg.wait_for_timeout(150); pg.locator('.shop-item:not(.done) .cb').first.click(); pg.wait_for_timeout(300)
        picked = [x for x in D()['shop'] if x['done']]; before = {x['name']: qty(x['name']) for x in picked}
        pg.get_by_role('button', name='Ranger 2 produits dans le stock', exact=True).click(); pg.wait_for_timeout(400)
        sheet().get_by_role('button', name='Ranger dans le stock').click(); pg.wait_for_timeout(400)
        d = D(); assert len(d['shop']) == len(shop) - 2, ('courses', len(shop), len(d['shop']))
        for nm, q0 in before.items(): assert qty(nm) > q0, ('quantité non ajoutée', nm, q0, qty(nm))

    @step('Courses : ajout manuel sans doublon')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('Pain'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('pain'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        prev = [x for x in D()['shop'] if x['ing'] == 'pain' and not x['done']]; prevq = (prev[0]['qty'] or 0) if prev and prev[0]['unit'] == 'tranche' else 0
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('pain'); s.locator('input').nth(1).fill('2'); s.locator('select').select_option('tranche'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pains=[x for x in D()['shop'] if x['ing'] == 'pain' and not x['done']]; assert len(pains) == 1 and pains[0]['qty'] == prevq + 2, (prevq, [(x['name'],x['qty'],x['unit']) for x in pains])
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

    @step('Recette personnelle : validation, icône choisie, moment, type de plat, cuisine, appareil, difficulté ; recherche, filtre « Mes recettes »')
    def _():
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', ''); pg.wait_for_timeout(300); pg.get_by_role('button', name='Créer ma recette').click(); pg.wait_for_timeout(300); s = sheet()
        s.get_by_role('button', name='Enregistrer').click(); pg.wait_for_timeout(200); assert not D()['custom'], ('recette vide acceptée', D()['custom'])
        s.locator('input').first.fill('Gratin de mamie'); ing = s.locator('.ing-row').first; ing.locator('input').nth(0).fill('pommes de terre'); ing.locator('input').nth(1).fill('800')
        s.locator('.emo-pick').click(); pg.wait_for_timeout(200); s.get_by_role('button', name='Icône 🥧').click(); pg.wait_for_timeout(200)
        assert s.locator('.emo-grid').is_hidden() and s.locator('.emo-pick .plate').inner_text() == '🥧', 'icône choisie'
        s.locator('select[aria-label="Type de plat"]').select_option('Gratins & four'); s.locator('select[aria-label="Cuisine"]').select_option('Savoyarde')
        s.locator('.chip', has_text='♨️ Four').click(); s.locator('.chip', has_text='Intermédiaire').click()
        s.locator('textarea').fill('Couper les pommes de terre\nCuire 45 min au four'); s.get_by_role('button', name='Enregistrer').click(); pg.wait_for_timeout(600)
        c = D()['custom']; assert len(c) == 1 and c[0]['i'][0][0] == 'pomme-de-terre', ('custom', c)
        assert [c[0].get('emo'), c[0]['c'], c[0]['k'], c[0]['e'], c[0]['d'], c[0]['mt']] == ['🥧', 'Gratins & four', 'Savoyarde', ['four'], 'Intermédiaire', ['Déjeuner', 'Dîner']], c[0]
        assert sheet().locator('.plate').first.inner_text() == '🥧', 'icône sur la fiche'
        sheet().get_by_role('button', name='Modifier').click(); pg.wait_for_timeout(500)
        assert sheet().locator('select[aria-label="Cuisine"]').input_value() == 'Savoyarde' and sheet().locator('.chip.on', has_text='♨️ Four').count() == 1, 'réglages repris'
        def mine():
            pg.locator('.chip', has_text='Filtres').click(); pg.wait_for_timeout(400); sheet().locator('.chip', has_text='Mes recettes').click(); sheet().get_by_role('button', name='Voir les recettes').click(); pg.wait_for_timeout(400)
        close_sheets(); mine(); assert pg.get_by_text('Gratin de mamie').count() == 1 and pg.locator('.rec').count() == 1, ('visible', pg.get_by_text('Gratin de mamie').count(), pg.locator('.rec').count())
        mine(); assert pg.locator('.rec').count() > 1

    @step('Recettes : moments du repas (apéro, entrées, desserts…) puis « tout effacer »')
    def _():
        for name, key in [('Apéro', 'Apéritif'), ('Entrées', 'Entrée'), ('Desserts', None)]:
            pg.get_by_role('radio', name=name).click(); pg.wait_for_timeout(300)
            ok = pg.evaluate('''(key) => { const S = window.__monFrigo.S; const t = [...document.querySelectorAll('.rec .strong')].map(e => e.textContent); return t.length > 5 && t.every(x => { const r = S.cat.list.find(y => y.t === x); return r && (key ? r.mt.includes(key) : (r.c === 'Desserts' || r.mt.includes('Dessert'))); }); }''', key)
            assert ok, name
        pg.locator('.count-line .linkish', has_text='tout effacer').click(); pg.wait_for_timeout(300); assert pg.get_by_role('radio', name='Tout').get_attribute('aria-checked') == 'true'

    @step('Filtres : végé + temps max respectés')
    def _():
        pg.get_by_role('button', name='Végé', exact=True).click(); pg.wait_for_timeout(200)
        ok = pg.evaluate('''() => { const S = window.__monFrigo.S; return [...document.querySelectorAll('.rec .strong')].slice(0,30).every(e => { const r = S.cat.list.find(x => x.t === e.textContent); return r && r.veg; }); }''')
        assert ok; pg.get_by_role('button', name='Végé', exact=True).click()

    @step('Filtres : appareil (Cookeo), « seulement mon équipement », puce retirable, Effacer')
    def _():
        tab('recipes'); pg.locator('.chip', has_text='Filtres').click(); pg.wait_for_timeout(400)
        sheet().locator('.chip', has_text='Cookeo').click(); sheet().get_by_role('button', name='Voir les recettes').click(); pg.wait_for_timeout(500)
        titles = [e.inner_text() for e in pg.locator('.rec .strong').all()]; assert len(titles) >= 10 and all('Cookeo' in t for t in titles), titles
        assert pg.locator('.rgrid .rec.locked').count() == 0, 'sans Cookeo, faisables en cocotte : pas grisées'
        pg.locator('.rgrid .rec').first.click(); pg.wait_for_timeout(500); assert 'Sans Cookeo' in sheet().locator('.swap-note').first.inner_text(), 'conseil cocotte'; close_sheets()
        pg.locator('.chip', has_text='Filtres').click(); pg.wait_for_timeout(400); sheet().locator('.chip.on', has_text='Cookeo').click(); sheet().locator('.chip', has_text='Gaufrier').click(); sheet().locator('.chip', has_text='Seulement avec mon équipement').click(); sheet().get_by_role('button', name='Voir les recettes').click(); pg.wait_for_timeout(500)
        assert pg.locator('.rgrid .rec').count() == 0, 'gaufrier : grisées cachées'
        pg.locator('.chip', has_text='Filtres').click(); pg.wait_for_timeout(400); sheet().get_by_role('button', name='Effacer').click(); pg.wait_for_timeout(200); assert sheet().locator('.chip.on', has_text='Gaufrier').count() == 0; sheet().get_by_role('button', name='Voir les recettes').click(); pg.wait_for_timeout(400)
        pg.locator('.chip', has_text='Filtres').click(); pg.wait_for_timeout(400); sheet().locator('.chip', has_text='Sans cuisson').click(); sheet().get_by_role('button', name='Voir les recettes').click(); pg.wait_for_timeout(500)
        nocook = pg.evaluate('''() => { const S = window.__monFrigo.S; return [...document.querySelectorAll('.rec .strong')].slice(0, 30).every(e => { const r = S.cat.list.find(x => x.t === e.textContent); return r && !(r.e || []).length; }); }''')
        assert nocook and pg.locator('.rgrid .rec').count() > 0, 'sans cuisson'
        pg.locator('.chips .chip.on', has_text='Sans cuisson').click(); pg.wait_for_timeout(300); assert pg.locator('.chips .chip.on', has_text='Sans cuisson').count() == 0 and pg.locator('.chip', has_text='Filtres (').count() == 0, 'puce retirée'

    @step('Semaine : repas libre (sans recette)')
    def _():
        tab('plan'); pg.get_by_role('button', name='Semaine suivante').click(); pg.wait_for_timeout(300); pg.locator('.slot-add').first.click(); pg.wait_for_timeout(400)
        s = sheet(); assert pg.evaluate("document.activeElement && document.activeElement.getAttribute('aria-label')") == 'Qu’est-ce qu’on mange ?', 'champ non sélectionné'
        s.locator('input').first.fill('Pizza maison'); pg.wait_for_timeout(150); s.locator('input').first.press('Enter'); pg.wait_for_timeout(400)
        notes = [e['note'] for d in D()['plan'].values() for e in d.values() if e.get('note')]; assert 'Pizza maison' in notes, notes
        assert pg.get_by_text('Pizza maison').count() >= 1
        # tes plats habituels : un toucher suffit
        pg.locator('.slot-add').first.click(); pg.wait_for_timeout(400); sheet().locator('.qp-ideas .chip', has_text='Pizza maison').click(); pg.wait_for_timeout(400)
        assert sum(1 for d in D()['plan'].values() for e in d.values() if e.get('note') == 'Pizza maison') == 2
        # une recette de l'app depuis le même champ
        carbo = lambda: {(d, k) for d, v in D()['plan'].items() for k, e in v.items() if e.get('rid') == 'pates-carbonara'}
        before = carbo(); pg.locator('.day-cell').nth(1).click(); pg.wait_for_timeout(300)
        pg.locator('.slot-add').first.click(); pg.wait_for_timeout(400); s = sheet(); s.locator('input').first.fill('carbonara'); pg.wait_for_timeout(200)
        s.locator('.qp-row', has_text='Pâtes carbonara').first.click(); pg.wait_for_timeout(400)
        added = carbo() - before; assert len(added) == 1, 'recette non planifiée'; src = added.pop()
        # déplacer un repas (échange si le créneau est pris), puis annuler
        pg.locator('.slot', has_text='carbonara').get_by_role('button', name='Options du repas').click(); pg.wait_for_timeout(300)
        sheet().get_by_role('button', name='Déplacer').click(); pg.wait_for_timeout(400); sheet().locator('.move-opt:not(.busy)').last.click(); pg.wait_for_timeout(400)
        assert src not in carbo() and len(carbo() - before) == 1, (src, carbo() - before)
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert carbo() - before == {src}, 'annulation du déplacement'

    @step('Semaine : au hasard puis annuler, vider puis annuler')
    def _():
        before = json.dumps(D()['plan'], sort_keys=True)
        pg.get_by_role('button', name='Proposer des repas').click(); pg.wait_for_timeout(400); pg.get_by_role('button', name='Nouvelle semaine au hasard').click(); pg.wait_for_timeout(500)
        after = D()['plan']; assert json.dumps(after, sort_keys=True) != before
        assert any(e.get('note') == 'Pizza maison' for d in after.values() for e in d.values()), 'le repas libre doit être conservé'
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert json.dumps(D()['plan'], sort_keys=True) == before
        pg.get_by_role('button', name='Vider la semaine').click(); pg.wait_for_timeout(300)
        days = pg.evaluate("(() => { const s = new Date(); const wd = (s.getDay() + 6) % 7; s.setDate(s.getDate() - wd + 7); return [...Array(7)].map((_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }); })()")
        assert not any(d in D()['plan'] for d in days), 'semaine non vidée'
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert json.dumps(D()['plan'], sort_keys=True) == before

    @step('Courses : prix, unité reconnue, ajout de plusieurs articles, vider puis annuler')
    def _():
        tab('shop'); pg.click('.fab'); pg.wait_for_timeout(300); s = sheet()
        s.locator('input').first.fill('Huile de tournesol'); s.locator('input[aria-label="Prix en euros"]').fill('2,49'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        it = [x for x in D()['shop'] if x['ing'] == 'huile-olive'][0]; assert it['price'] == 2.49 and it['unit'] == 'c. à soupe', it
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('Jus de pomme'); pg.wait_for_timeout(100)
        assert s.locator('select').input_value() == 'cl', 'unité non reconnue'
        s.locator('input').first.fill('farine, sucre en poudre, levure'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        ings = {x['ing'] for x in D()['shop'] if not x['done']}; assert {'farine', 'sucre', 'levure'} <= ings, ings
        assert pg.get_by_text('2,49 €').count() >= 1
        n = len(D()['shop']); pg.get_by_role('button', name='Vider toute la liste').click(); pg.wait_for_timeout(300); assert D()['shop'] == []
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert len(D()['shop']) == n

    @step('Cuisson : arrêter sans rien retirer du stock')
    def _():
        before = json.dumps(D()['stock'], sort_keys=True); tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', 'tiramisu'); pg.wait_for_timeout(400)
        pg.get_by_text('Tiramisu').first.click(); pg.wait_for_timeout(400); sheet().get_by_role('button', name='Cuisiner').click(); pg.wait_for_timeout(500)
        sheet().get_by_role('button', name='Arrêter', exact=True).click(); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Arrêter', exact=True).click(); pg.wait_for_timeout(600)
        d = D(); assert d['cook'] is None and json.dumps(d['stock'], sort_keys=True) == before and pg.locator('.sheet.open').count() == 0

    @step('Repas déjà cuisiné, puis annulé depuis « Moi » : stock remis')
    def _():
        pg.fill('input[aria-label="Rechercher une recette"]', 'carbonara'); pg.wait_for_timeout(400); pg.get_by_text('Pâtes carbonara').first.click(); pg.wait_for_timeout(400)
        before = {x['ing']: x['qty'] for x in D()['stock'] if x['ing']}; n0 = len(D()['history'])
        sheet().get_by_role('button', name='Déjà cuisiné ? Retirer les ingrédients du stock').click(); pg.wait_for_timeout(500)
        sheet().get_by_role('button', name='Terminer').click(); pg.wait_for_timeout(500)
        mid = {x['ing']: x['qty'] for x in D()['stock'] if x['ing']}; assert len(D()['history']) == n0 + 1 and mid.get('lardons', 0) < before.get('lardons', 0), (before, mid)
        pg.click('#tabbar [data-tab=home]'); pg.wait_for_timeout(300); pg.click('#meBtn'); pg.wait_for_timeout(400)
        open_acc('Derniers repas'); pg.locator('.item', has_text='Pâtes carbonara').first.click(); pg.wait_for_timeout(400); sheet().get_by_role('button', name='Annuler ce repas').click(); pg.wait_for_timeout(500)
        after = {x['ing']: x['qty'] for x in D()['stock'] if x['ing']}; assert len(D()['history']) == n0 and after.get('lardons') == before.get('lardons'), (before, after)
        pg.fill if False else None

    @step('Nom tapé conservé pour tous les produits (y compris avec la touche Entrée)')
    def _():
        close_sheets(); tab('stock')
        for name, ing in [('Jambon sec italien', 'jambon-cru'), ('Comté 18 mois', 'emmental'), ('Tomates anciennes', 'tomate')]:
            pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill(name); pg.wait_for_timeout(350); s.locator('#as-name').press('Enter')
            assert s.locator('#as-name').input_value() == name, 'nom remplacé par Entrée'
            s.locator('#as-qty').fill('1'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
            it = [x for x in D()['stock'] if x['name'] == name]; assert it and it[0]['ing'] == ing, (name, it)

    @step('Validation immédiate : le produit est quand même bien reconnu')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Beurre doux'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        it = [x for x in D()['stock'] if x['name'] == 'Beurre doux']; assert it and it[0]['ing'] == 'beurre', it

    @step('Produit inconnu typé « fromage » : utilisé comme remplaçant dans les recettes')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Fromage du marché de Montaigu'); pg.wait_for_timeout(400)
        assert s.locator('.assoc-sel').input_value() == 'type:fromage', s.locator('.assoc-sel').input_value()
        s.locator('#as-qty').fill('1'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        it = [x for x in D()['stock'] if x['name'] == 'Fromage du marché de Montaigu'][0]; assert it['ing'].startswith('c-'), it
        for x in D()['stock']:
            if x['ing'] in ('emmental', 'fromage-rape', 'parmesan'): pass
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', 'omelette au fromage'); pg.wait_for_timeout(400)
        pg.get_by_text('Omelette au fromage').first.click(); pg.wait_for_timeout(500)
        assert sheet().get_by_text('Remplacé par ton', exact=False).count() >= 1, 'pas de remplacement affiché'
        close_sheets()

    @step('Habitudes : produit prérempli, achats habituels proposés')
    def _():
        tab('stock'); pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Lait'); pg.wait_for_timeout(350)
        s.locator('#as-qty').fill('2'); s.locator('#as-unit').select_option('l'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Lait'); pg.wait_for_timeout(500)
        assert s.locator('#as-qty').input_value() == '2' and s.locator('#as-unit').input_value() == 'l', (s.locator('#as-qty').input_value(), s.locator('#as-unit').input_value())
        assert s.get_by_text('habitudes', exact=False).count() >= 1; close_sheets()
        tab('shop')
        for _ in range(2):
            pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('input').first.fill('Brioche tranchée'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
            pg.locator('.shop-item', has_text='Brioche tranchée').locator('.cb').click(); pg.wait_for_timeout(200)
            pg.get_by_role('button', name='Retirer les articles cochés sans les ranger').click(); pg.wait_for_timeout(300)
        assert pg.get_by_text('Tes habituels').count() == 1 and pg.locator('.chip', has_text='Brioche tranchée').count() == 1, 'habituels absents'
        pg.locator('.chip', has_text='Brioche tranchée').click(); pg.wait_for_timeout(300); assert any(x['name'] == 'Brioche tranchée' and not x['done'] for x in D()['shop'])

    @step('Profil : cocher une restriction n’ouvre pas le clavier et ne fait pas sauter la page')
    def _():
        close_sheets(); tab('home'); pg.click('#meBtn'); pg.wait_for_timeout(300); open_acc('Allergies')
        pg.wait_for_function("!document.querySelector('.toast, .achv')", timeout=9000)  # aucun message ne recouvre l'interrupteur
        sw = pg.get_by_role('checkbox', name='Sans porc'); sw.scroll_into_view_if_needed(); y0 = pg.evaluate('scrollY'); sw.click(); pg.wait_for_timeout(300)
        foc = pg.evaluate("document.activeElement && document.activeElement.matches('input:not([type=checkbox]),textarea') ? (document.activeElement.getAttribute('aria-label') || 'champ') : null")
        y1, pork = pg.evaluate('scrollY'), D()['prefs']['noPork']
        pg.wait_for_function("!document.querySelector('.toast, .achv')", timeout=9000); sw.click(); pg.wait_for_timeout(200)  # toujours remettre l'état initial
        assert foc is None and abs(y1 - y0) < 60 and pork is True, (foc, y0, y1, pork)
        assert D()['prefs']['noPork'] is False

    @step('Hors ligne : plus de badge à l’écran, info dans « Moi »')
    def _():
        assert pg.locator('.offline-badge').count() == 0
        ctx.set_offline(True); pg.wait_for_timeout(300); open_acc('Application')
        assert pg.get_by_text('Hors ligne : tout fonctionne quand même', exact=False).count() >= 1; ctx.set_offline(False); pg.wait_for_timeout(200)

    @step('Alertes de péremption : notification envoyée pour un produit qui expire aujourd’hui')
    def _():
        today = pg.evaluate("(() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })()")
        tab('stock'); pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Crème dessert vanille'); s.locator('#as-qty').fill('2'); s.locator('#as-exp').fill(today); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        tab('home'); pg.click('#meBtn'); pg.wait_for_timeout(300); open_acc('Alertes')
        pg.get_by_role('checkbox', name='Me prévenir des produits qui vont périmer').click(); pg.wait_for_timeout(1500)
        notes = pg.evaluate("navigator.serviceWorker.ready.then(r => r.getNotifications()).then(l => l.map(n => n.title + ' | ' + n.body))")
        assert D()['prefs']['notify'] is True and notes and 'Crème dessert vanille' in notes[0], notes

    @step('Vider le frigo : recettes proposées puis ajoutées à la semaine')
    def _():
        tab('plan'); pg.get_by_role('button', name='Proposer des repas').click(); pg.wait_for_timeout(300); pg.get_by_role('button', name='Vider le frigo').click(); pg.wait_for_timeout(600)
        n_before = sum(len(v) for v in D()['plan'].values()); assert sheet().locator('.rec-row').count() >= 1
        sheet().get_by_role('button', name='Ajouter ces repas à ma semaine').click(); pg.wait_for_timeout(400)
        assert sum(len(v) for v in D()['plan'].values()) > n_before

    @step('Restes : proposés dans la semaine, puis « C’est mangé » les retire du stock')
    def _():
        tab('plan'); pg.get_by_role('button', name='Semaine suivante').click(); pg.wait_for_timeout(200); pg.get_by_role('button', name='Semaine suivante').click(); pg.wait_for_timeout(200)
        pg.evaluate("(() => { const S = window.__monFrigo.S; S.data.stock.push({ id: 'rest1', ing: null, name: 'Reste : Gratin test', qty: 2, unit: 'portion', zone: 'frigo', expiry: null, added: '2026-01-01' }); })()")
        pg.locator('.slot-add').first.click(); pg.wait_for_timeout(400); sheet().locator('.chip', has_text='Gratin test').click(); pg.wait_for_timeout(300)
        e = [x for d in D()['plan'].values() for x in d.values() if x.get('leftover') == 'rest1']; assert e, 'restes non planifiés'
        pg.locator('.slot', has_text='Reste : Gratin test').get_by_role('button', name='Options du repas').click(); pg.wait_for_timeout(300)
        sheet().get_by_role('button', name='C’est mangé').click(); pg.wait_for_timeout(300)
        assert not any(x['id'] == 'rest1' for x in D()['stock']), 'restes toujours en stock'

    @step('Ticket de caisse : photo lue, vérification, ajout au stock')
    def _():
        close_sheets(); tab('stock'); pg.get_by_role('button', name='Scanner un ticket de caisse').click(); pg.wait_for_timeout(400)
        with pg.expect_file_chooser() as fc: pg.get_by_role('button', name='Choisir une photo').click()
        fc.value.set_files(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', 'ticket.jpg'))
        pg.wait_for_selector('.sheet.open .rr', timeout=120000)
        names = pg.evaluate("[...document.querySelectorAll('.sheet.open .rr input[aria-label=Nom]')].map(x => x.value.toLowerCase())")
        assert any('lait' in n for n in names) and any('caprice' in n for n in names), names
        sheet().locator('.sheet-foot .btn.primary').click(); pg.wait_for_timeout(500)
        st = {x['name'].lower(): x for x in D()['stock']}; assert any('caprice' in k for k in st) and any('courgettes' == k and v['qty'] == 812 for k, v in st.items()), list(st)[:12]

    @step('Ticket : coller le texte')
    def _():
        pg.get_by_role('button', name='Scanner un ticket de caisse').click(); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Coller le texte du ticket').click(); pg.wait_for_timeout(400)
        sheet().locator('textarea').fill('SAUMON FUME 4 TR   4,99\nTOTAL 4,99'); sheet().get_by_role('button', name='Lire ce texte').click(); pg.wait_for_timeout(400)
        assert sheet().locator('.rr').count() == 1; sheet().locator('.sheet-foot .btn.primary').click(); pg.wait_for_timeout(300)
        assert any(x['ing'] == 'saumon-fume' and x['qty'] == 4 and x['unit'] == 'tranche' for x in D()['stock'])

    @step('Filtre « De saison » : uniquement des recettes de saison')
    def _():
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', ''); pg.wait_for_timeout(200); pg.get_by_role('button', name='De saison', exact=True).click(); pg.wait_for_timeout(400)
        ok = pg.evaluate("""() => { const S = window.__monFrigo.S, mo = new Date().getMonth() + 1; const titles = [...document.querySelectorAll('.rec .strong')].slice(0, 20).map(e => e.textContent);
          return titles.length > 0 && titles.every(t => { const r = S.cat.list.find(x => x.t === t); const ks = r.i.map(i => S.kb.get(i[0])).filter(k => k && k.season); return ks.some(k => k.season.includes(mo)) && ks.every(k => k.season.includes(mo)); }); }""")
        assert ok; pg.get_by_role('button', name='De saison', exact=True).click()

    @step('Bug signalé : la date choisie (événement « change » seul, comme Android) n’est jamais écrasée')
    def _():
        close_sheets(); tab('stock'); pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Yaourt grec'); pg.wait_for_timeout(400)
        pg.evaluate("(() => { const e = document.querySelector('#as-exp'); e.value = '2027-01-15'; e.dispatchEvent(new Event('change', { bubbles: true })); })()")
        s.get_by_role('tab', name='Congélo').click(); pg.wait_for_timeout(100); s.locator('#as-name').press('End'); s.locator('#as-name').type(' nature'); pg.wait_for_timeout(450)
        assert s.locator('#as-exp').input_value() == '2027-01-15', s.locator('#as-exp').input_value()
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        it = [x for x in D()['stock'] if x['name'] == 'Yaourt grec nature']; assert it and it[0]['expiry'] == '2027-01-15', it

    @step('Bug signalé : « coquillettes » toujours reconnu comme pâtes (même saisi autrement)')
    def _():
        pg.evaluate("(() => { const S = window.__monFrigo.S; S.data.memo.products['coquillettes'] = { name: 'Coquillettes', assoc: 'type:sauce', count: 1 }; })()")  # fausse habitude d'une ancienne version
        for typed in [['coquillettes'], ['patte', 'coquillettes']]:
            pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); inp = s.locator('#as-name')
            for w in typed: inp.fill(''); inp.type(w, delay=20); pg.wait_for_timeout(350)
            assert s.locator('.assoc-sel').input_value() == 'pates', (typed, s.locator('.assoc-sel').input_value())
            s.locator('#as-qty').fill('1'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        assert all(x['ing'] == 'pates' for x in D()['stock'] if x['name'].lower() == 'coquillettes')

    @step('Quantité dans le nom (« Moutarde 260 g ») et épice ajoutée en « 1 pot »')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Moutarde 260 g'); pg.wait_for_timeout(450)
        assert (s.locator('#as-qty').input_value(), s.locator('#as-unit').input_value()) == ('260', 'g'), (s.locator('#as-qty').input_value(), s.locator('#as-unit').input_value())
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Paprika fumé'); pg.wait_for_timeout(450)
        assert (s.locator('#as-qty').input_value(), s.locator('#as-unit').input_value()) == ('1', 'pot'), (s.locator('#as-qty').input_value(), s.locator('#as-unit').input_value())
        s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        assert any(x['name'] == 'Paprika fumé' and x['ing'] == 'paprika' and x['unit'] == 'pot' for x in D()['stock'])

    @step('Bug signalé : un produit ajouté pendant une recherche reste visible')
    def _():
        pg.fill('input[aria-label="Rechercher dans le stock"]', 'lait'); pg.wait_for_timeout(200)
        pg.click('.fab'); pg.wait_for_timeout(300); s = sheet(); s.locator('#as-name').fill('Poivron jaune'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(400)
        assert pg.locator('.view .item', has_text='Poivron jaune').count() == 1, 'produit invisible après ajout'

    @step('Ticket : la date se modifie avant l’ajout')
    def _():
        pg.get_by_role('button', name='Scanner un ticket de caisse').click(); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Coller le texte du ticket').click(); pg.wait_for_timeout(400)
        sheet().locator('textarea').fill('MOZZARELLA 125G   0,99\nTOTAL 0,99'); sheet().get_by_role('button', name='Lire ce texte').click(); pg.wait_for_timeout(400)
        sheet().locator('.rr input[aria-label="Date limite"]').fill('2027-02-02'); sheet().locator('.sheet-foot .btn.primary').click(); pg.wait_for_timeout(300)
        assert any(x['name'].lower() == 'mozzarella' and x['expiry'] == '2027-02-02' and x['qty'] == 125 for x in D()['stock']), [x for x in D()['stock'] if 'ozza' in x['name']]

    @step('Code-barres (caméra et Open Food Facts simulés) : nom, quantité, association et date gardés')
    def _():
        c2 = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='fr-FR'); p2 = c2.new_page()
        p2.add_init_script("""window.BarcodeDetector = class { constructor() {} async detect() { this.n = (this.n || 0) + 1; return this.n > 2 ? [{ rawValue: '3017620422003' }] : []; } };
          navigator.mediaDevices.getUserMedia = async () => { const c = document.createElement('canvas'); c.width = 64; c.height = 64; c.getContext('2d').fillRect(0, 0, 64, 64); return c.captureStream(5); };""")
        p2.route('https://world.openfoodfacts.org/**', lambda route: route.fulfill(status=200, content_type='application/json', body=json.dumps({'product': {'product_name_fr': 'Fine & Légère', 'brands': 'Amora', 'quantity': '235 g', 'categories_tags': ['en:condiments', 'en:sauces', 'en:mayonnaises']}})))
        p2.goto(URL); p2.wait_for_selector('.sheet.open'); p2.get_by_role('button', name='Commencer').click(); p2.wait_for_timeout(300)
        p2.click('#tabbar [data-tab=stock]'); p2.click('.fab'); p2.wait_for_timeout(300); s2 = p2.locator('.sheet.open').last
        s2.get_by_role('button', name='Scanner un code-barres').click(); p2.wait_for_timeout(2500); s2 = p2.locator('.sheet.open').last
        got = (s2.locator('#as-name').input_value(), s2.locator('.assoc-sel').input_value(), s2.locator('#as-qty').input_value(), s2.locator('#as-unit').input_value())
        assert got == ('Fine & Légère Amora', 'mayonnaise', '235', 'g'), got
        p2.evaluate("(() => { const e = document.querySelector('#as-exp'); e.value = '2027-03-03'; e.dispatchEvent(new Event('change', { bubbles: true })); })()")
        s2.get_by_role('button', name='Ajouter', exact=True).click(); p2.wait_for_timeout(300)
        st = p2.evaluate('JSON.parse(JSON.stringify(window.__monFrigo.S.data.stock))'); c2.close()
        assert any(x['ing'] == 'mayonnaise' and x['qty'] == 235 and x['expiry'] == '2027-03-03' for x in st), st

    @step('Stock : « Tout jeter » vide les produits périmés et s’annule')
    def _():
        close_sheets(); tab('stock'); pg.evaluate("(() => { const S = window.__monFrigo.S; S.data.stock = [...S.data.stock, { id: 'ex1', ing: 'lait', name: 'Vieux lait', qty: 1, unit: 'l', zone: 'frigo', expiry: '2020-01-01', added: '2020-01-01' }]; })()")
        tab('home'); tab('stock'); pg.locator('.chip', has_text='Expirés').click(); pg.wait_for_timeout(200)
        n0 = len(D()['waste']); pg.get_by_role('button', name='Tout jeter', exact=False).click(); pg.wait_for_timeout(300)
        assert not any(x['id'] == 'ex1' for x in D()['stock']) and len(D()['waste']) > n0
        pg.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert any(x['id'] == 'ex1' for x in D()['stock'])
        pg.evaluate("(() => { const S = window.__monFrigo.S; S.data.stock = S.data.stock.filter(x => x.id !== 'ex1'); })()")

    @step('Recette : partage (texte avec ingrédients et étapes)')
    def _():
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', 'carbonara'); pg.wait_for_timeout(300); pg.get_by_text('Pâtes carbonara').first.click(); pg.wait_for_timeout(400)
        pg.evaluate("(() => { window.__shared = null; navigator.share = async d => { window.__shared = d.text; }; })()")
        sheet().get_by_role('button', name='Partager la recette').click(); pg.wait_for_timeout(200)
        txt = pg.evaluate('window.__shared'); assert txt and 'Pâtes carbonara' in txt and 'Lardons' in txt and 'Préparation' in txt, txt; close_sheets()

    @step('Stock : tri par date limite, par nom, par ajout récent (mémorisé)')
    def _():
        close_sheets(); tab('stock'); pg.fill('input[aria-label="Rechercher dans le stock"]', '')
        pg.evaluate("""(() => { const S = window.__monFrigo.S; S.data.stock = [...S.data.stock,
          { id: 'zz1', ing: null, name: 'Zèbre test', qty: 1, unit: 'pièce', zone: 'placard', expiry: '2031-01-03', added: '2031-01-01' },
          { id: 'zz2', ing: null, name: 'Abricot test', qty: 1, unit: 'pièce', zone: 'frigo', expiry: '2031-01-02', added: '2031-01-02' },
          { id: 'zz3', ing: null, name: 'Mangue test', qty: 1, unit: 'pièce', zone: 'congelateur', expiry: '2031-01-01', added: '2031-01-03' }]; })()""")
        tab('home'); tab('stock')
        order = lambda: [x for x in pg.evaluate("[...document.querySelectorAll('.view .item .t')].map(e => e.textContent)") if x.endswith(' test')]
        pg.select_option('select[aria-label="Trier le stock"]', 'date'); pg.wait_for_timeout(300); assert order() == ['Mangue test', 'Abricot test', 'Zèbre test'], order()
        pg.select_option('select[aria-label="Trier le stock"]', 'name'); pg.wait_for_timeout(300); assert order() == ['Abricot test', 'Mangue test', 'Zèbre test'], order()
        pg.select_option('select[aria-label="Trier le stock"]', 'added'); pg.wait_for_timeout(300); assert order() == ['Mangue test', 'Abricot test', 'Zèbre test'], order()
        assert pg.get_by_text('1 pièce, congélateur').count() >= 1, 'zone non indiquée en liste triée'
        pg.select_option('select[aria-label="Trier le stock"]', 'name'); pg.wait_for_timeout(300); pg.reload(); pg.wait_for_selector('.view'); pg.wait_for_timeout(400)
        assert D()['prefs']['stockSort'] == 'name' and pg.locator('select[aria-label="Trier le stock"]').input_value() == 'name'
        pg.select_option('select[aria-label="Trier le stock"]', 'zone'); pg.wait_for_timeout(200)

    @step('Stock v1.7 : quantités d’achat, « Lait » sans « Salade verte », quantité lue dans le nom')
    def _():
        close_sheets(); tab('stock')
        for name, q, u in [('Lait de vache', '1', 'l'), ('Crème fraîche', '20', 'cl'), ('Pâtes', '500', 'g'), ('Œufs', '6', 'pièce'), ('Yaourts x4', '4', 'pot'), ('6 tomates', '6', 'pièce')]:
            pg.click('.fab'); pg.wait_for_timeout(250); s = sheet(); s.locator('#as-name').type(name, delay=10); pg.wait_for_timeout(400)
            got = (s.locator('#as-qty').input_value(), s.locator('#as-unit').input_value()); assert got == (q, u), (name, got)
            pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
        pg.click('.fab'); pg.wait_for_timeout(250); s = sheet(); s.locator('#as-name').type('Lait', delay=10); pg.wait_for_timeout(400)
        assert 'Salade' not in ' '.join(s.locator('.chips .chip').all_inner_texts()); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
        pg.click('.fab'); pg.wait_for_timeout(250); s = sheet(); s.locator('#as-name').fill('Cornichons 370 g'); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        assert any(x['name'] == 'Cornichons' and x['qty'] == 370 and x['unit'] == 'g' and x['ing'] == 'cornichons' for x in D()['stock']), [x for x in D()['stock'] if 'ornichon' in x['name']]

    @step('Stock v1.7 : fiche produit (− jamais à 0, quantité tapée, congélo, utilisé, aux courses)')
    def _():
        pg.click('.fab'); pg.wait_for_timeout(250); s = sheet(); s.locator('#as-name').fill('Blanc de dinde'); pg.wait_for_timeout(400); s.get_by_role('button', name='Ajouter', exact=True).click(); pg.wait_for_timeout(300)
        pg.locator('.view .item', has_text='Blanc de dinde').first.click(); pg.wait_for_timeout(400); s = sheet()
        assert s.locator('.sheet-head h2').inner_text() == 'Blanc de dinde'
        for _ in range(60):
            m = s.get_by_role('button', name='Moins').first
            if m.is_disabled(): break
            m.click()
        q = [x for x in D()['stock'] if x['name'] == 'Blanc de dinde'][0]['qty']; assert 0 < q <= 10, q
        inp = s.locator('.step-input').first; inp.fill('320'); inp.press('Enter'); pg.wait_for_timeout(200)
        assert [x for x in D()['stock'] if x['name'] == 'Blanc de dinde'][0]['qty'] == 320
        s.get_by_role('tab', name='Congélo').click(); pg.wait_for_timeout(300); it = [x for x in D()['stock'] if x['name'] == 'Blanc de dinde'][0]
        assert it['zone'] == 'congelateur' and it['expiry'] and it['expiry'] > '2026-12-31', it
        s.get_by_role('button', name='J’en ai utilisé').click(); pg.wait_for_timeout(350); sheet().get_by_role('button', name='La moitié').click(); sheet().get_by_role('button', name='Retirer du stock').click(); pg.wait_for_timeout(300)
        assert [x for x in D()['stock'] if x['name'] == 'Blanc de dinde'][0]['qty'] == 160
        sheet().get_by_role('button', name='Aux courses').click(); pg.wait_for_timeout(350); s2 = sheet()
        s2.locator('input[aria-label="Quantité à acheter"]').fill('400'); s2.locator('input[aria-label="Prix en euros"]').fill('5,20'); s2.get_by_role('button', name='Ajouter à la liste').click(); pg.wait_for_timeout(300)
        it = [x for x in D()['shop'] if x['name'] == 'Blanc de dinde' and not x['done']][0]; assert it['qty'] == 400 and it['price'] == 5.2, it
        close_sheets()

    @step('Stock v1.7 : export en note (.txt) et tableau (.csv)')
    def _():
        tab('stock'); pg.get_by_role('button', name='Exporter mon stock').click(); pg.wait_for_timeout(400)
        with pg.expect_download() as dl: sheet().get_by_role('button', name='Télécharger la note (.txt)').click()
        txt = open(dl.value.path(), encoding='utf-8').read(); assert txt.startswith('MON STOCK') and 'Cornichons : 370 g' in txt and 'FRIGO' in txt, txt[:300]
        with pg.expect_download() as dl: sheet().get_by_role('button', name='Tableau pour Excel (.csv)').click()
        csv = open(dl.value.path(), encoding='utf-8-sig', newline='').read(); assert csv.split('\r\n')[0] == 'Produit;Quantité;Unité;Rangement;Date limite;Ajouté le' and 'Cornichons;370;g' in csv, [l for l in csv.split('\r\n') if 'ornichon' in l]
        assert dl.value.suggested_filename.endswith('.csv'); close_sheets()

    @step('Stock v1.7 : le dernier produit n’est jamais caché sous le bouton +')
    def _():
        tab('stock'); pg.evaluate('scrollTo(0, document.body.scrollHeight)'); pg.wait_for_timeout(300)
        last = pg.locator('.view .item').last.bounding_box(); fab = pg.locator('.fab').bounding_box(); assert last['y'] + last['height'] <= fab['y'] + 2, (last, fab)

    @step('Toujours chez moi : décocher l’huile la rend « manquante », la recocher la rend acquise (coche verte), autre produit')
    def _():
        close_sheets(); tab('home'); pg.click('#meBtn'); pg.wait_for_timeout(300); open_acc('Toujours chez moi')
        assert pg.locator('.acc.open .pan-tile').count() >= 25
        pg.locator('.acc.open .pan-tile', has_text='Huile d\'olive').click(); pg.wait_for_timeout(250); assert 'huile-olive' not in D()['prefs']['pantry']
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', 'spaghetti ail'); pg.wait_for_timeout(350); pg.locator('.rec').first.click(); pg.wait_for_timeout(400)
        row = sheet().locator('.ing', has_text='Huile d\'olive'); assert row.count() and 'chez toi' not in row.first.inner_text(), row.first.inner_text(); close_sheets()
        pg.click('#meBtn'); pg.wait_for_timeout(300); open_acc('Toujours chez moi'); pg.locator('.acc.open .pan-tile', has_text='Huile d\'olive').click(); pg.wait_for_timeout(250)
        assert 'huile-olive' in D()['prefs']['pantry']
        pg.locator('.acc.open input[aria-label^="Ajouter un autre produit"]').fill('crème fra'); pg.wait_for_timeout(250); pg.locator('.acc.open .pan .chips.wrap .chip').first.click(); pg.wait_for_timeout(300)
        assert 'creme' in D()['prefs']['pantry'], D()['prefs']['pantry']
        pg.locator('.acc.open .pan-tile.on', has_text='Crème').click(); pg.wait_for_timeout(250); assert 'creme' not in D()['prefs']['pantry']
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', 'spaghetti ail'); pg.wait_for_timeout(350); pg.locator('.rec').first.click(); pg.wait_for_timeout(400)
        row = sheet().locator('.ing', has_text='Huile d\'olive').first; assert 'Toujours chez toi' in row.inner_text() and row.locator('.st.ok').count() == 1, row.inner_text(); close_sheets()
        tab('stock'); assert pg.locator('.pan-card').count() == 1; pg.locator('.pan-card').click(); pg.wait_for_timeout(400); assert sheet().locator('.pan-tile.on').count() >= 3; close_sheets()
        pg.click('#meBtn'); pg.wait_for_timeout(300)

    @step('Envoyer vers un autre téléphone : fichier de sauvegarde partagé')
    def _():
        pg.evaluate("(() => { window.__sharedFiles = null; navigator.canShare = () => true; navigator.share = async d => { window.__sharedFiles = d.files.map(f => f.name + ':' + f.size); }; })()")
        open_acc('Sauvegarde'); pg.get_by_role('button', name='Envoyer vers un autre téléphone').click(); pg.wait_for_timeout(400)
        files = pg.evaluate('window.__sharedFiles'); assert files and files[0].startswith('mon-frigo-') and int(files[0].split(':')[1]) > 200, files

    @step('Matin : idée de petit-déjeuner ; jour de fête : message et recettes (Chandeleur)')
    def _():
        for when, check in [("2027-02-02T08:10:00", 'matin'), ("2027-02-02T12:30:00", 'fête')]:
            c3 = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, locale='fr-FR'); p3 = c3.new_page()
            p3.add_init_script("{ const T = new Date('%s').getTime(), R = Date; Date = class extends R { constructor(...a) { if (a.length) super(...a); else super(T + (R.now() - START)); } static now() { return T + (R.now() - START); } }; var START = R.now(); }" % when)
            p3.goto(URL); p3.wait_for_selector('.sheet.open'); p3.get_by_role('button', name='Commencer').click(); p3.wait_for_timeout(500)
            if check == 'matin':
                k = p3.locator('.hero .kicker').inner_text(); title = p3.locator('.hero h2').inner_text()
                cat = p3.evaluate("t => window.__monFrigo.S.cat.list.find(r => r.t === t).mt", title); assert 'matin' in k and 'Petit-déjeuner' in cat, (k, title, cat)
            else:
                tg = p3.locator('.tagline.special'); assert tg.count() == 1 and 'Chandeleur' in tg.inner_text(), p3.locator('.tagline').all_inner_texts()
                tg.get_by_role('button', name='Idées').click(); p3.wait_for_timeout(400); assert p3.locator('.rec').count() >= 1
            c3.close()

    @step('Sauvegarde : export, effacement total, import, données restaurées')
    def _():
        before = D(); tab('home'); pg.click('#meBtn'); pg.wait_for_timeout(300)
        open_acc('Sauvegarde')
        with pg.expect_download() as dl: pg.get_by_role('button', name='Télécharger une sauvegarde').click()
        path = dl.value.path(); data = json.load(open(path)); assert data['app'] == 'mon-frigo' and len(data['data']['stock']) == len(before['stock'])
        open_acc('Application'); pg.get_by_role('button', name='Effacer toutes mes données').click(); sheet().get_by_role('button', name='Tout effacer').click(); pg.wait_for_timeout(900)
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

    @step('Apparence : clair/sombre séparé, Chaumière (paysage, textes, secret), Saisons (hiver), Bord de mer, Bistrot, Zen, animations')
    def _():
        def look(amb=None, mode=None):
            close_sheets(); pg.click('#meBtn'); pg.wait_for_timeout(300); open_acc('Apparence')
            if mode: pg.locator('.acc.open .seg button', has_text=mode).click(); pg.wait_for_timeout(250)
            if amb: pg.get_by_role('button', name='Ambiance ' + amb).click(); pg.wait_for_timeout(300)
        look(mode='Sombre')
        bg = pg.evaluate("getComputedStyle(document.body).backgroundColor"); assert bg == 'rgb(21, 17, 24)', bg
        assert pg.evaluate("[document.documentElement.dataset.amb, document.documentElement.hasAttribute('data-dark')]") == ['classic', True]
        look('Chaumière'); assert pg.evaluate("document.documentElement.dataset.amb") == 'cottage'
        assert pg.evaluate("getComputedStyle(document.body).backgroundColor") == 'rgb(22, 19, 12)'  # chaumière en sombre
        assert pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--display')").find('Fraunces') >= 0
        assert pg.locator('.acc.open .theme-card').count() == 6 and pg.locator('.acc.open .theme-card.on .tc-art svg').count() == 1
        look(mode='Clair'); assert pg.evaluate("getComputedStyle(document.body).backgroundColor") == 'rgb(246, 240, 225)'  # chaumière en clair
        tab('home'); pg.wait_for_timeout(300)
        assert pg.locator('.home-scene svg').count() == 1 and pg.locator('.home-head h1').inner_text() in ('Bien le bonjour', 'Bel après-midi', 'Douce soirée', 'Bonne veillée'), pg.locator('.home-head h1').inner_text()
        for _ in range(5): pg.locator('.home-head h1').click(); pg.wait_for_timeout(60)
        pg.wait_for_timeout(300); assert D()['meta'].get('secret') is True
        hb = pg.locator('.home-scene [data-egg="house"]').bounding_box(); pg.mouse.click(hb['x'] + hb['width'] / 2, hb['y'] + hb['height'] / 2); pg.wait_for_timeout(300)
        assert 'house' in (D()['meta'].get('eggs') or []), D()['meta'].get('eggs')
        look('Saisons'); pg.get_by_role('button', name='❄️ Hiver', exact=True).click(); pg.wait_for_timeout(250)
        assert pg.evaluate("[document.documentElement.dataset.amb, document.documentElement.dataset.season]") == ['season', 'winter']
        for amb, key, egg in [('Bord de mer', 'sea', 'lighthouse'), ('Bistrot', 'bistro', 'awning'), ('Zen', 'zen', 'branch')]:
            for mode in ('Sombre', 'Clair'):
                look(amb, mode); assert pg.evaluate("document.documentElement.dataset.amb") == key
                tab('home'); pg.wait_for_timeout(250); assert pg.locator(f'.home-scene [data-egg="{egg}"]').count() == 1, (amb, mode)
                tab('stock'); assert pg.locator('.page-band svg').count() == 1, (amb, 'bandeau')
        look(); pg.get_by_role('checkbox', name='Animations du décor').click(); pg.wait_for_timeout(200); assert pg.evaluate("document.documentElement.hasAttribute('data-still')")
        pg.get_by_role('checkbox', name='Animations du décor').click(); pg.wait_for_timeout(150)
        look('Classique', 'Auto')
        # « Mes horaires » : une plage claire qui ne contient pas l'heure actuelle → sombre ; « Comme le téléphone » (clair ici) → clair
        pg.get_by_role('button', name='🕒 Mes horaires').click(); pg.wait_for_timeout(250)
        a, b = pg.evaluate("(() => { const d = new Date(), f = m => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); const n = d.getHours() * 60 + d.getMinutes(); return [f(n + 60), f(n + 120)]; })()")
        tins = pg.locator('.auto-box input[type=time]'); tins.nth(0).fill(a); tins.nth(1).fill(b); pg.wait_for_timeout(300)
        assert pg.evaluate("document.documentElement.hasAttribute('data-dark')"), ('horaires', D()['prefs'].get('lightFrom'), D()['prefs'].get('lightTo'))
        pg.get_by_role('button', name='📱 Comme le téléphone').click(); pg.wait_for_timeout(250)
        assert pg.evaluate("[document.documentElement.dataset.amb, document.documentElement.hasAttribute('data-dark')]") == ['classic', False]
        pg.get_by_role('button', name='☀️ Avec le soleil').click(); pg.wait_for_timeout(150)

    @step('Saison : tuiles sur l’accueil, fiche produit (mois, courses), calendrier mois par mois')
    def _():
        tab('home'); pg.wait_for_timeout(200); assert pg.locator('.sea-tile').count() >= 6
        pg.locator('.sea-tile').first.click(); pg.wait_for_timeout(400); s = sheet()
        assert s.locator('.sea-months span').count() == 12 and s.locator('.sea-months span.now').count() == 1
        name = s.locator('.sheet-head h2').inner_text().split(' ', 1)[1]; s.get_by_role('button', name='Aux courses').click(); pg.wait_for_timeout(300)
        assert any(x['name'] == name for x in D()['shop']), name; close_sheets()
        pg.get_by_role('button', name='Calendrier').click(); pg.wait_for_timeout(400); s = sheet(); n_now = s.locator('.sea-tile').count()
        s.get_by_role('button', name='Juillet', exact=True).click(); pg.wait_for_timeout(300)
        names = s.locator('.sea-name').all_inner_texts(); assert 'Courgette' in names and n_now > 0, names; close_sheets()

    @step('Profil RPG : niveau, XP, succès « Premier repas », grille des succès')
    def _():
        pg.click('#meBtn'); pg.wait_for_timeout(300)
        assert pg.locator('.profile-card').count() == 1 and 'Niveau' in pg.locator('.pc-title').inner_text(), 'carte'
        assert pg.locator('.pc-chal').count() == 0 and pg.locator('.pc-tier').count() == 1, 'palier'
        assert 'first' in (D()['meta'].get('badges') or []), D()['meta'].get('badges')
        pg.get_by_role('button', name='Mes succès', exact=False).click(); pg.wait_for_timeout(400)
        assert sheet().locator('.badge').count() >= 24 and sheet().locator('.badge.on').count() >= 2, ('succès', sheet().locator('.badge.on').count()); close_sheets()
        pg.locator('.pc-name').click(); pg.wait_for_timeout(300); sheet().locator('input').fill('Chef Théo'); sheet().get_by_role('button', name='Enregistrer').click(); pg.wait_for_timeout(300)
        assert D()['prefs']['name'] == 'Chef Théo' and 'Chef Théo' in pg.locator('.pc-name').inner_text(), 'nom'
        assert 'niveau' in pg.locator('#meBtn').get_attribute('aria-label') and pg.locator('#meBtn svg').count() == 1, 'bouton profil'
        # personnage : choix libres, objet verrouillé refusé, enregistrement, présence dans le bouton du profil
        pg.locator('.pc-av').click(); pg.wait_for_timeout(500)
        def avtab(t): sheet().locator('.av-tabs .chip', has_text=t).click(); pg.wait_for_timeout(200)
        avtab('Corps'); sheet().get_by_role('button', name='Robot', exact=True).click(); pg.wait_for_timeout(150)
        avtab('Tête'); sheet().locator('.av-opt.locked', has_text='Couronne de chef').click(); pg.wait_for_timeout(250)
        assert 'niveau 20' in pg.locator('.toast').last.inner_text().lower(), ('toast', pg.locator('.toast').all_inner_texts())
        avtab('Fond'); sheet().get_by_role('button', name='Espace', exact=True).click(); pg.wait_for_timeout(150)
        avtab('Compagnon'); sheet().get_by_role('button', name='Mini-soucoupe', exact=True).click(); pg.wait_for_timeout(150)
        sheet().get_by_role('button', name='Enregistrer').click(); pg.wait_for_timeout(500)
        av = D()['prefs']['avatar']; assert av['kind'] == 'robot' and av['bg'] == 'space' and av['pet'] == 'ufo' and av['hat'] != 'crown', av
        expect(pg.locator('#meBtn .av-dot')).to_have_count(0); expect(pg.locator('.pc-av .av-svg')).to_have_count(1)
        assert D()['meta'].get('lvl', 1) < 2 or LVL or pg.evaluate("sessionStorage.getItem('lvlSeen')") == '1', 'montée de niveau jamais montrée'
        pg.get_by_role('button', name='Récompenses').click(); pg.wait_for_timeout(400); assert sheet().locator('.rw-row').count() >= 20, 'récompenses'; close_sheets()
        pg.get_by_role('button', name='Passeport', exact=False).click(); pg.wait_for_timeout(400); assert sheet().locator('.stamp').count() >= 30, 'passeport'; close_sheets()

    @step('Assistant : courses, semaine (avec annulation), recette, stock ; guide ; anneau d’XP')
    def _():
        tab('home'); pg.get_by_role('button', name='Demander à mon assistant').click(); pg.wait_for_timeout(500); s = sheet()
        assert s.locator('.msg.bot').count() >= 1 and s.locator('.bot-starters .chip').count() >= 4, ('accueil assistant', s.locator('.bot-starters .chip').count())
        def say(q):
            sheet().locator('.chat-bar input').fill(q); sheet().locator('.chat-bar input').press('Enter'); pg.wait_for_timeout(600); return sheet().locator('.msg.bot').last
        say('ajoute du beurre et 2 litres de jus de pomme aux courses')
        names = [x['name'] for x in D()['shop'] if not x['done']]; assert 'Beurre' in names and any('jus' in n.lower() for n in names), names
        m = say('mets une raclette demain soir'); tomorrow = pg.evaluate("(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })()")
        assert (D()['plan'].get(tomorrow) or {}).get('dinner', {}).get('note') == 'Raclette', D()['plan'].get(tomorrow)
        m.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(400); assert (D()['plan'].get(tomorrow) or {}).get('dinner', {}).get('note') != 'Raclette'
        m = say('une recette de crêpes'); assert m.locator('.bot-rec').count() >= 1, m.inner_text()
        m = say('est-ce qu\'il me reste des oeufs ?'); assert 'Œufs' in m.inner_text(), m.inner_text()
        m = say('qu\'est-ce qui va périmer ?'); assert m.inner_text().strip(), 'réponse vide'
        m = say('blablabla zzz'); assert 'pas sûr de comprendre' in m.inner_text(), m.inner_text()
        assert sheet().locator('.msg-av .mascot').count() >= 1, 'mascotte'
        m = say('on mange quoi ce soir ?'); assert m.locator('.bot-rec').count() >= 1, ('ce soir', m.inner_text())
        m = say('plus rapide'); ok = pg.evaluate('''() => { const S = window.__monFrigo.S; const t = [...document.querySelectorAll('.sheet.open .msg.bot:last-child .bot-rec .strong')].map(e => e.textContent); return t.length > 0 && t.every(x => { const r = S.cat.list.find(y => y.t === x); return r && r.m <= 25; }); }''')
        assert ok, 'relance « plus rapide » ignorée'
        s0 = json.dumps(D()['stock'], sort_keys=True); m = say('j\'ai acheté du lait et 6 oeufs'); assert json.dumps(D()['stock'], sort_keys=True) != s0 and 'rangé' in m.inner_text(), m.inner_text()
        m.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert json.dumps(D()['stock'], sort_keys=True) == s0, 'annuler stock'
        m = say('je n\'aime pas le céleri'); assert any('céleri' in x.lower() for x in D()['prefs'].get('dislikes', [])), D()['prefs'].get('dislikes')
        m.get_by_role('button', name='Annuler').click(); pg.wait_for_timeout(300); assert not any('céleri' in x.lower() for x in D()['prefs'].get('dislikes', [])), ('annuler goûts', D()['prefs'].get('dislikes'))
        m = say('une idée rapide avec du poulet'); assert m.locator('.bot-rec').count() >= 1, ('poulet', m.inner_text())
        m.locator('.bot-rec').first.click(); pg.wait_for_timeout(600); assert pg.locator('.sheet.open .serv-row').count() == 1, 'fiche recette'; close_sheets()
        pg.click('#meBtn'); pg.wait_for_timeout(300); pg.get_by_role('button', name='Comment ça marche').click(); pg.wait_for_timeout(400)
        assert sheet().locator('.g-sec').count() == 8 and sheet().locator('.g-sec.open').count() == 1; sheet().locator('.g-head', has_text='Semaine').click(); pg.wait_for_timeout(150); assert sheet().locator('.g-sec.open').count() == 2; close_sheets()
        xp = pg.locator('#meBtn').evaluate("e => e.style.getPropertyValue('--xp')"); assert xp.endswith('%') and 'vers le niveau suivant' in pg.locator('#meBtn').get_attribute('aria-label'), xp

    @step('Équipement : recettes grisées (pas cachées), passeport = liste, « J’ai un four », Ma cuisine')
    def _():
        close_sheets(); pg.click('#meBtn'); pg.wait_for_timeout(300); open_acc('Mon équipement')
        names = [x.inner_text() for x in pg.locator('.acc.open .pan-tile .pan-n').all()]; assert names == ['Plaques', 'Four', 'Micro-ondes', 'Mixeur', 'Air fryer', 'Thermomix', 'Cookeo', 'Barbecue', 'Raclette', 'Gaufrier'], names
        pg.locator('.acc.open .pan-tile', has_text='Four').click(); pg.wait_for_timeout(300); assert 'four' not in D()['prefs']['equip'], D()['prefs']['equip']
        pg.click('#meBtn'); pg.wait_for_timeout(300); pg.get_by_role('button', name='Passeport', exact=False).click(); pg.wait_for_timeout(400)
        st = sheet().locator('.stamp', has_text='Lorraine'); n = int(st.locator('.st-c').inner_text().split()[0]); st.click(); pg.wait_for_timeout(700)
        cards = pg.locator('.rgrid .rec'); assert cards.count() == n and n >= 2, ('passeport ≠ liste', n, cards.count())
        assert pg.locator('.rgrid .rec.locked').count() == n and 'Il faut un four' in cards.first.inner_text(), 'grisées'
        assert 'grisée' in pg.locator('.count-line').inner_text(), pg.locator('.count-line').inner_text()
        cards.first.click(); pg.wait_for_timeout(500); sheet().get_by_role('button', name='J’ai un four').click(); pg.wait_for_timeout(300)
        assert 'four' in D()['prefs']['equip'] and sheet().locator('.lock-note').count() == 0; close_sheets()
        assert pg.locator('.rgrid .rec.locked').count() == 0, 'plus grisées'
        pg.locator('.chips .chip.on', has_text='Lorraine').click(); pg.wait_for_timeout(300); assert pg.locator('.rgrid .rec').count() > n, 'filtre cuisine retiré'
        tab('stock')
        if pg.get_by_role('tab', name='🏠 Ma cuisine').count(): pg.get_by_role('tab', name='🏠 Ma cuisine').click(); pg.wait_for_timeout(400)
        if pg.locator('.k-appl').count(): pg.locator('.k-appl').click(); pg.wait_for_timeout(400); assert sheet().locator('.pan-tile').count() == 10 and all(sheet().locator('.pan-tile', has_text=x).count() == 1 for x in ('Air fryer', 'Thermomix', 'Cookeo', 'Barbecue', 'Raclette', 'Gaufrier')), 'fenêtre équipement'; close_sheets(); pg.get_by_role('tab', name='📋 Liste').click(); pg.wait_for_timeout(300)

    @step('Assistant : questions de cuisine, conversions, fautes de frappe, deux demandes d’un coup')
    def _():
        tab('home'); pg.get_by_role('button', name='Demander à mon assistant').click(); pg.wait_for_timeout(500)
        def say(q):
            sheet().locator('.chat-bar input').fill(q); sheet().locator('.chat-bar input').press('Enter'); pg.wait_for_timeout(600); return sheet().locator('.msg.bot').last.inner_text()
        assert '100 g' in say('cb de tps pr cuire les pattes'), 'pâtes'
        assert 'Mollet' in say('oeuf mollet combien de minutes'), 'œufs'
        assert 'thermostat 6' in say('180 degres c est quel thermostat'), 'thermostat'
        assert 'non salé' in say('ma sauce est trop salée'), 'astuce'
        cnt = lambda: sum(len(e) for e in D()['plan'].values()); n0, p0 = len(D()['shop']), cnt(); say('ajoute des radis aux courses et mets une tartiflette samedi soir')
        assert len(D()['shop']) == n0 + 1 and cnt() >= p0 and sheet().locator('.msg.bot', has_text='C’est prévu').count() >= 1, ('deux demandes', len(D()['shop']), n0)
        assert 'Mon équipement' in say('où je règle mon équipement'), 'mode d’emploi'
        assert 'internet' in say('quelle est la capitale du japon'), 'hors sujet honnête'
        assert 'air fryer' in say('une recette au air fryer').lower(), 'air fryer'
        assert 'barbecue' in say('une idée au barbecue').lower(), 'barbecue'
        sheet().locator('.msg.bot').last.get_by_role('button', name='Voir les', exact=False).click(); pg.wait_for_timeout(700)
        assert pg.locator('.chips .chip.on', has_text='Barbecue').count() == 1 and pg.locator('.rgrid .rec').count() >= 5, 'toutes les recettes au barbecue'
        pg.locator('.chips .chip.on', has_text='Barbecue').click(); pg.wait_for_timeout(300)
        close_sheets()

    @step('Assistant : micro (dictée simulée, erreurs), suite de conversation, menu, mode cuisine expliqué, ingrédient remplacé')
    def _():
        FAKE = """(mode) => { window.__spoken = []; try { window.speechSynthesis.speak = u => window.__spoken.push(u.text); } catch (e) {}
          window.SpeechRecognition = class { start() { setTimeout(() => { if (mode === 'ok') { this.onresult && this.onresult({ results: [[{ transcript: 'on mange quoi ce soir' }]] }); this.onend && this.onend(); }
            else { this.onerror && this.onerror({ error: mode }); this.onend && this.onend(); } }, 120); } stop() { this.onend && this.onend(); } abort() {} }; }"""
        close_sheets(); tab('home'); pg.evaluate(FAKE, 'ok')
        pg.get_by_role('button', name='Demander à mon assistant').click(); pg.wait_for_timeout(500)
        sheet().get_by_role('button', name='Parler').click(); pg.wait_for_timeout(900)
        assert sheet().locator('.msg.me', has_text='on mange quoi ce soir').count() >= 1 and sheet().locator('.msg.bot').last.locator('.bot-rec').count() >= 2, 'dictée'
        assert len(pg.evaluate('window.__spoken')) == 1, 'réponse lue à voix haute'
        def say(q):
            n0 = sheet().locator('.msg.bot').count(); sheet().locator('.chat-bar input').fill(q); sheet().locator('.chat-bar input').press('Enter'); pg.wait_for_timeout(600)
            return ' '.join(m.inner_text() for m in sheet().locator('.msg.bot').all()[n0:])
        second = sheet().locator('.msg.bot').last.locator('.bot-rec').nth(1).get_attribute('data-rid')
        assert 'Bon choix' in say('la deuxième'), 'choisir'
        say('mets-la demain soir'); tom = pg.evaluate("(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })()")
        assert (D()['plan'].get(tom) or {}).get('dinner', {}).get('rid') == second, ('mets-la', D()['plan'].get(tom))
        t = say('il me manque quoi ?'); assert 'il te manque' in t or 'tu as déjà tout' in t, t
        assert 'Entrée' in say('un menu complet pour ce soir') and 'Dessert' in sheet().locator('.msg.bot').last.inner_text(), 'menu'
        assert 'Il n’y en avait que' in say('la cinquième'), 'hors liste'
        pg.evaluate(FAKE, 'not-allowed'); close_sheets(); pg.get_by_role('button', name='Demander à mon assistant').click(); pg.wait_for_timeout(500)
        sheet().get_by_role('button', name='Parler').click(); pg.wait_for_timeout(700); assert 'micro de ton clavier' in sheet().locator('.msg.bot').last.inner_text(), 'micro bloqué'
        close_sheets(); tab('recipes'); pg.locator('.view input').first.fill('carbonara'); pg.wait_for_timeout(600)
        pg.locator('.rec', has_text='Pâtes carbonara').first.click(); pg.wait_for_timeout(600); sheet().get_by_role('button', name='Cuisiner').click(); pg.wait_for_timeout(600)
        sheet().get_by_role('button', name='🤔 Je ne comprends pas').click(); pg.wait_for_timeout(300)
        assert 'En plus simple' in sheet().locator('.step-help').first.inner_text(), 'étape expliquée'
        sheet().get_by_role('button', name='👀 C’est bon quand ?').click(); pg.wait_for_timeout(300)
        assert 'grosses bulles' in sheet().locator('.step-help').nth(1).inner_text() and sheet().locator('.step-help').first.is_hidden(), 'repères'
        sheet().get_by_role('button', name='Voir les ingrédients').click(); pg.wait_for_timeout(300)
        sheet().get_by_role('button', name='Je n’ai pas de parmesan').click(); pg.wait_for_timeout(1200)
        assert 'remplacer le parmesan' in sheet().locator('.msg.bot').last.inner_text(), 'remplacer dans la recette'
        t = say('je comprends pas cette étape'); assert 'Étape 1 sur 4' in t, t
        pg.keyboard.press('Escape'); pg.wait_for_timeout(400)
        sheet().get_by_role('button', name='Arrêter', exact=True).click(); pg.wait_for_timeout(300); sheet().get_by_role('button', name='Arrêter', exact=True).click(); pg.wait_for_timeout(600)
        pg.locator('.view input').first.fill(''); pg.wait_for_timeout(300); close_sheets()

    @step('Navigation : défilement mémorisé par onglet, onglet actif = retour en haut ; fiche recette sans encadré')
    def _():
        tab('recipes'); pg.fill('input[aria-label="Rechercher une recette"]', ''); pg.wait_for_timeout(300); pg.evaluate('scrollTo(0, 1500)'); pg.wait_for_timeout(200); y = pg.evaluate('scrollY')
        tab('stock'); pg.wait_for_timeout(200); tab('recipes'); pg.wait_for_timeout(300); assert abs(pg.evaluate('scrollY') - y) < 5, (y, pg.evaluate('scrollY'))
        pg.click('#tabbar [data-tab=recipes]'); pg.wait_for_timeout(900); assert pg.evaluate('scrollY') < 5
        pg.locator('.rec').first.click(); pg.wait_for_timeout(400); assert sheet().get_by_text('non testée', exact=False).count() == 0
        sheet().locator('.sheet-body').evaluate('e => e.scrollTop = 900'); pg.wait_for_timeout(300); assert pg.locator('.sheet.open.scrolled').count() == 1; close_sheets()

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
