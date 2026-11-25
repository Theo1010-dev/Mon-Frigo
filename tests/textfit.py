"""Audit des textes : aucun texte coupé ni débordement à 360 et 320 px, dans plusieurs ambiances, sur tous les écrans principaux.
Lancer : python3 tests/textfit.py   (sur dist/)"""
import sys
import serve
from playwright.sync_api import sync_playwright
URL = serve.start()
CHECK = """(where) => { const out = [];
  for (const el of document.querySelectorAll('.btn > span, .chip, .seg button, .tabs button, .tag, .sc span, .acc-head .strong, .tabbar .tl, .sheet-head h2, .sea-ph, .sea-name, .pc-l, .pc-v, .tc-name, .b-n, .tagline .btn, .week-actions .btn span, .av-n, .rw-item span, .st-n, .pan-n, .pc-title, .pc-name, .lvl-n, .mo-l, .k-count, .k-always-t, .qp-row .strong, .move-opt .strong, .pc-g-t, .pc-g-s, .me-tile .strong, .g-head .strong, .bot-act, .back-week, .cov, .pan-n, .pan-s, .k-appl .k-more')) {
    const r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight * 3) continue;
    if (el.closest('.sheet.r-sheet') && el.matches('.sheet-head h2')) continue;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).webkitLineClamp === 'none') out.push(where + ' : « ' + el.textContent.trim().slice(0, 40) + ' »'); }
  if (document.documentElement.scrollWidth > innerWidth) out.push(where + ' : débordement horizontal ' + document.documentElement.scrollWidth);
  return out; }"""
found = []
with sync_playwright() as p:
    b=p.chromium.launch(channel='chromium')
    for W in (360, 320):
        for theme in ('auto', 'cottage', 'bistro'):
            ctx=b.new_context(viewport={'width':W,'height':740}, is_mobile=True, has_touch=True, locale='fr-FR'); pg=ctx.new_page(); S=lambda: pg.locator('.sheet.open').last
            c = lambda where: found.extend(pg.evaluate(CHECK, f'{W}px {theme} {where}'))
            pg.goto(URL); pg.wait_for_selector('.sheet.open'); S().get_by_role('button',name='Commencer').click(); pg.wait_for_timeout(300)
            pg.click('#tabbar [data-tab=stock]'); pg.wait_for_timeout(250); pg.get_by_role('button',name='Ajout rapide').first.click(); s=S()
            for n in ['🥚 Œufs','🍝 Pâtes','🥓 Lardons','🧅 Oignon','🥒 Courgette','🥛 Lait']: s.get_by_role('button',name=n, exact=True).click()
            s.locator('.sheet-foot .btn').click(); pg.wait_for_timeout(300)
            if theme != 'auto': pg.click('#meBtn'); pg.wait_for_timeout(200); pg.locator('.acc-head', has_text='Apparence').click(); pg.get_by_role('button', name={'cottage': 'Ambiance Chaumière', 'bistro': 'Ambiance Bistrot'}[theme]).click(); pg.wait_for_timeout(300); c('apparence')
            for t in ['home','stock','recipes','plan','shop']: pg.click(f'#tabbar [data-tab={t}]'); pg.wait_for_timeout(250); c(t)
            pg.click('#tabbar [data-tab=stock]'); pg.get_by_role('tab', name='🏠 Ma cuisine').click(); pg.wait_for_timeout(500); c('cuisine'); pg.get_by_role('tab', name='📋 Liste').click(); pg.wait_for_timeout(250)
            pg.click('#tabbar [data-tab=recipes]'); pg.locator('.chip', has_text='Filtres').click(); pg.wait_for_timeout(350); c('filtres'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.click('#tabbar [data-tab=plan]'); pg.locator('.slot-add').first.click(); pg.wait_for_timeout(400); c('ajout repas'); S().locator('input').first.fill('Pâtes'); pg.wait_for_timeout(200); c('ajout repas tapé')
            S().locator('.qp-row').first.click(); pg.wait_for_timeout(400); pg.get_by_role('button', name='Options du repas').first.click(); pg.wait_for_timeout(300); S().get_by_role('button', name='Déplacer').click(); pg.wait_for_timeout(400); c('déplacer'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.click('#tabbar [data-tab=home]'); pg.get_by_role('button', name='Demander à mon assistant').click(); pg.wait_for_timeout(400); c('assistant')
            for q in ['on mange quoi ce soir', 'plus rapide', 'ajoute du lait aux courses', 'j ai acheté du lait et des oeufs', 'j ai fini le beurre', 'je n aime pas les champignons', 'mets des lasagnes demain soir', 'combien de temps se garde le poulet', 'qu as tu appris sur moi']:
                S().locator('.chat-bar input').fill(q); S().locator('.chat-bar input').press('Enter'); pg.wait_for_timeout(500)
            c('assistant réponses'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.click('#meBtn'); pg.get_by_role('button', name='Comment ça marche').click(); pg.wait_for_timeout(400)
            for g in S().locator('.g-head').all()[1:]: g.click()
            c('guide'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.click('#tabbar [data-tab=plan]'); pg.get_by_role('button', name='Semaine suivante').click(); pg.wait_for_timeout(300); c('semaine suivante')
            pg.click('#tabbar [data-tab=stock]'); pg.locator('.view .item').first.click(); pg.wait_for_timeout(350); c('fiche produit')
            S().get_by_role('button', name='Aux courses').click(); pg.wait_for_timeout(300); c('aux courses'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            S().get_by_role('button', name='J’en ai utilisé').click(); pg.wait_for_timeout(300); c('utilisé'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.get_by_role('button', name='Exporter mon stock').click(); pg.wait_for_timeout(300); c('export'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.click('#tabbar [data-tab=home]'); pg.wait_for_timeout(250); pg.locator('.sea-tile').first.click(); pg.wait_for_timeout(350); c('fiche saison'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.get_by_role('button', name='Calendrier').click(); pg.wait_for_timeout(350); c('calendrier'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.click('#meBtn'); pg.wait_for_timeout(300); c('moi')
            pg.locator('.acc-head', has_text='Mon équipement').click(); pg.wait_for_timeout(250); pg.locator('.acc.open .pan-tile', has_text='Four').click(); pg.wait_for_timeout(250); c('équipement')
            pg.get_by_role('button', name='Passeport', exact=False).click(); pg.wait_for_timeout(350); S().locator('.stamp', has_text='Lorraine').click(); pg.wait_for_timeout(600); c('recettes grisées')
            pg.locator('.rgrid .rec').first.click(); pg.wait_for_timeout(450); c('recette grisée'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250); pg.click('#meBtn'); pg.wait_for_timeout(300)
            pg.get_by_role('button', name='Mes succès', exact=False).click(); pg.wait_for_timeout(350); c('succès'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.get_by_role('button', name='Récompenses').click(); pg.wait_for_timeout(350); c('récompenses'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.get_by_role('button', name='Passeport', exact=False).click(); pg.wait_for_timeout(350); c('passeport'); pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            pg.locator('.pc-av').click(); pg.wait_for_timeout(400)
            for tb in ['Corps', 'Visage', 'Cheveux', 'Tête', 'Tenue', 'Objet', 'Fond', 'Compagnon']: S().locator('.av-tabs .chip', has_text=tb).click(); pg.wait_for_timeout(150); c('perso ' + tb)
            pg.keyboard.press('Escape'); pg.wait_for_timeout(250)
            for h in pg.locator('.acc-head').all():
                if 'open' not in (h.locator('xpath=..').get_attribute('class') or ''): h.click(); pg.wait_for_timeout(100)
            c('moi (tout ouvert)'); ctx.close()
    b.close()
print(f'{len(found)} texte(s) coupé(s)'); [print(' -', f) for f in found[:40]]
sys.exit(1 if found else 0)
