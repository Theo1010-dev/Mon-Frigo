"""Évaluation de l'assistant : une centaine de phrases de tous les jours, et ce qu'il répond.
Lancer : python3 tests/assistant_eval.py [--all]   (sur dist/)
Sans --all : n'affiche que les réponses « pas compris » et les réponses suspectes. Code de sortie 1 s'il y en a."""
import sys, re
import serve
from playwright.sync_api import sync_playwright
URL = serve.start()

# (phrase, mots attendus dans la réponse : l'un d'eux suffit ; None = juste « pas de pas-compris »)
QUESTIONS = [
    # stock
    ("qu'est-ce que j'ai dans le frigo", ['œufs']),
    ("il me reste des oeufs ?", ['œufs']),
    ("j'ai combien de lait", ['Lait :']),
    ("qu'est-ce que j'ai au congélateur", ['stock', 'congél', 'Frigo', 'produit']),
    ("c'est quoi qui périme bientôt", ['périm', 'expire', 'rien', 'finir']),
    ("je viens d'acheter du poulet et des tomates", ['poulet']),
    ("j'ai fini les yaourts", ['yaourt', 'pas trouvé', 'stock']),
    # idées
    ("j'ai faim", ['idée', 'recette']),
    ("je sais pas quoi manger ce soir", ['idée', 'recette']),
    ("un truc rapide avec des oeufs", ['œuf']),
    ("une recette sans four", ['idée', 'sans']),
    ("un plat réconfortant", ['idée']),
    ("quelque chose de léger", ['idée', 'léger']),
    ("une idée pour un apéro entre potes", ['apéro', 'idée']),
    ("un dessert avec des pommes", ['pomme']),
    ("qu'est-ce que je peux faire avec du poulet et du riz", ['poulet']),
    ("recette de crêpes", ['crêpe']),
    ("c'est quoi la recette du boeuf bourguignon", ['Bœuf bourguignon']),
    ("comment on fait des crêpes", ['Crêpes']),
    ("un plat italien", ['italienne']),
    ("quelque chose de japonais", ['japonaise']),
    ("quelque chose d'asiatique", ['asiat', 'idée']),
    ("un repas pas cher", ['idée', 'chère']),
    ("on reçoit des amis samedi une idée ?", ['recevoir']),
    ("un truc pour les enfants", ['enfants']),
    ("j'ai pas de four je peux faire quoi", ['sans four']),
    ("un burger", ['urger']),
    ("une raclette ce soir", ['aclette']),
    ("j'ai envie de quelque chose de chaud", ['idée']),
    ("une idée au air fryer", ['air fryer']),
    ("une recette végétarienne", ['idée', 'végé']),
    ("un gâteau au chocolat", ['chocolat']),
    ("une soupe", ['soupe', 'idée']),
    ("une salade composée", ['salades']),
    # savoir de cuisine
    ("combien de temps cuire un oeuf dur", ['10', '9']),
    ("à quelle température cuire un poulet rôti", ['°C', 'thermostat']),
    ("comment savoir si un oeuf est frais", ['eau', 'coule', 'flotte']),
    ("par quoi remplacer le beurre", ['huile', 'margarine', 'remplac']),
    ("je n'ai pas de crème fraîche", ['À la place']),
    ("combien de grammes dans une cuillère à soupe de farine", ['10 g', 'g']),
    ("comment décongeler de la viande", ['frigo', 'décongel']),
    ("on peut recongeler du poulet ?", ['recongel', 'cuit']),
    ("comment faire une vinaigrette", ['huile', 'vinaigre']),
    ("ma sauce est trop liquide", ['maïzena']),
    ("ma chantilly ne monte pas", ['froide']),
    ("mon gâteau est pas cuit au milieu", ['couteau']),
    ("que veut dire déglacer", ['Déglacer']),
    ("c'est quoi une julienne", ['bâtonnets']),
    ("j'ai la flemme de cuisiner", ['15 min']),
    ("combien de riz par personne", ['g']),
    ("combien de pâtes par personne", ['g']),
    ("le poulet se garde combien de temps au frigo", ['jour']),
    ("ça se garde combien de temps la sauce tomate maison", ['jour', 'frigo']),
    ("comment conserver les herbes fraîches", ['eau', 'frigo', 'herbe']),
    ("comment émincer un oignon sans pleurer", ['oignon', 'froid', 'couteau']),
    ("c'est quoi un bain-marie", ['eau', 'casserole']),
    ("différence entre levure chimique et levure boulangère", ['levure']),
    ("je peux faire des frites au four ?", ['four', '°C']),
    ("comment adapter une recette du four au air fryer", ['20 °C']),
    ("sans barbecue comment faire des brochettes", ['poêle']),
    ("j'ai pas de cookeo", ['cocotte']),
    ("je peux faire la recette sans thermomix ?", ['casserole']),
    ("cuisson des pâtes", ['min']),
    ("ma pâte à crêpes a des grumeaux", ['grumeau', 'mix', 'fouet', 'lait']),
    ("comment rattraper une mayonnaise ratée", ['mayonnaise', 'jaune', 'moutarde']),
    # semaine et courses
    ("qu'est-ce qu'on mange demain", ['demain', 'prévu']),
    ("planifie ma semaine", ['repas dans les cases vides', 'déjà bien remplie']),
    ("mets des lasagnes dimanche midi", ['lasagne', 'prévu']),
    ("fais ma liste de courses", ['courses', 'liste']),
    ("ajoute du pain aux courses", ['pain']),
    ("combien vont coûter mes courses", ['€']),
    # l'appli
    ("comment ajouter un produit", ['+', 'ajout', 'Stock']),
    ("comment scanner un ticket", ['ticket']),
    ("comment installer l'appli sur iphone", ['Safari', 'écran d’accueil']),
    ("c'est quoi les xp", ['XP', 'niveau']),
    ("comment changer le thème", ['Apparence', 'ambiance']),
    ("où je règle mon équipement", ['équipement']),
    # discussion
    ("t'es qui", ['assistant', 'Frigo']),
    ("tu es une IA ?", ['assistant', 'IA', 'téléphone']),
    ("raconte moi une blague", None),
    ("merci beaucoup", None),
    ("salut", None),
    ("comment ça va", None),
    ("t'es nul", None),
    ("quel temps il fait demain", ['internet']),
    ("quelle heure il est", ['Il est']),
    ("quelle est la capitale du japon", ['internet']),
    # nouveautés 1.17 : menu, ce qu'il manque pour un plat, remplacer un ingrédient, étapes, photo
    ("un menu complet pour ce soir", ['Entrée']),
    ("il me manque quoi pour des crêpes", ['Pâte à crêpes']),
    ("est-ce que j'ai tout pour une omelette", ['Omelette']),
    ("j'ai pas de riz", ['Semoule']),
    ("je n'ai pas de parmesan", ['Emmental', 'Fromage râpé']),
    ("je n'ai pas de poivre", ['relever']),
    ("je comprends pas l'étape 2", ['De quelle recette']),
    ("je peux t'envoyer une photo de mon plat ?", ['photos']),
    ("c'est quoi un roux", ['farine']),
    ("ça veut dire quoi faire suer les oignons", ['sans les colorer']),
    ("cmt faire une vinaigrette", ['vinaigre']),
    ("cb de tps pr cuire des pates", ['min']),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 390, 'height': 844}); S = lambda: pg.locator('.sheet.open').last
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_selector('.sheet.open'); pg.wait_for_timeout(400); S().get_by_role('button', name='Commencer').click(); pg.wait_for_timeout(400)
    pg.click('#tabbar [data-tab=stock]'); pg.wait_for_timeout(250); pg.get_by_role('button', name='Ajout rapide').first.click(); pg.wait_for_timeout(500); s = S()
    for n in ['🥚 Œufs', '🍝 Pâtes', '🥓 Lardons', '🧅 Oignon', '🥛 Lait', '🧈 Beurre', '🍗 Poulet', '🍚 Riz', '🍎 Pommes']: s.get_by_role('button', name=n, exact=True).click()
    s.locator('.sheet-foot .btn').click(); pg.wait_for_timeout(400)
    pg.click('#tabbar [data-tab=home]'); pg.wait_for_timeout(300); pg.get_by_role('button', name='Demander à mon assistant').click(); pg.wait_for_timeout(500)
    bad = []
    for q, want in QUESTIONS:
        n0 = S().locator('.msg.bot').count()
        S().locator('.chat-bar input').fill(q); S().locator('.chat-bar input').press('Enter'); pg.wait_for_timeout(450)
        msgs = S().locator('.msg.bot').all()[n0:]
        txt = ' '.join(m.inner_text() for m in msgs).replace('\n', ' ')
        lost = bool(re.search(r'pas sûr de comprendre|je n’ai pas compris|pas compris', txt, re.I))
        miss = want is not None and not any(w.lower() in txt.lower() for w in want)
        if lost or miss or '--all' in sys.argv: bad.append((q, 'PAS COMPRIS' if lost else 'À CÔTÉ' if miss else 'ok', txt[:170]))
    b.close()
for q, k, t in bad: print(f'[{k}] {q}\n      → {t}')
nb = sum(1 for x in bad if x[1] != 'ok')
print(f'\n{len(QUESTIONS) - nb}/{len(QUESTIONS)} bien comprises ; erreurs JS : {errs or "aucune"}')
sys.exit(1 if nb or errs else 0)
