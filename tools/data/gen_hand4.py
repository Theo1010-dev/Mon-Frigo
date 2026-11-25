# -*- coding: utf-8 -*-
"""Recettes élaborées : plus d'ingrédients, de vraies techniques, des étapes détaillées (tag « week-end »)."""
from gen_core import *
from gen_hand1 import H


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **{"diff": "Intermédiaire", **k}))
    D = ("Dessert", "Goûter")
    P("Blanquette de veau à l'ancienne", "Plats mijotés", 150, ["plaques"], ["week-end", "familial", "mijoté"],
      [("veau", 2), "carotte", "poireau", "oignon", "champignons", ("bouillon", 2), ("creme", 2), ("beurre", 1.5), ("farine", 0.25), ("citron", 0.5), "herbes-provence", ("riz", 1.5)],
      ["Couper le veau en cubes de 4 cm. Les mettre dans une cocotte, couvrir d'eau froide, porter à ébullition 2 min puis égoutter et rincer : la sauce restera bien blanche.",
       "Remettre la viande dans la cocotte avec le bouillon, l'oignon piqué, les carottes en tronçons, le vert du poireau et les herbes. Couvrir d'eau à hauteur et laisser frémir 1 h 30 à couvert.",
       "Faire revenir les champignons émincés 6 min dans un peu de beurre, réserver. Cuire le riz.",
       "Retirer la viande et les carottes avec une écumoire. Filtrer et garder 50 cl de bouillon.",
       "Dans la cocotte, faire fondre le reste du beurre, ajouter la farine et remuer 1 min (roux blanc), puis verser le bouillon chaud en fouettant. Laisser épaissir 5 min.",
       "Hors du feu, ajouter la crème et le jus du demi-citron, rectifier le sel et le poivre.",
       "Remettre la viande, les carottes et les champignons, réchauffer 5 min sans faire bouillir. Servir avec le riz."], "Française", serv=4)
    P("Coq au vin", "Plats mijotés", 130, ["plaques"], ["week-end", "mijoté", "familial"],
      [("poulet", 2.5), ("vin-rouge", 4), "lardons", "champignons", "oignon", ("carotte", 0.7), ("ail", 1), ("farine", 0.25), ("beurre", 1), "herbes-provence", ("pomme-de-terre", 1.5)],
      ["La veille si possible, faire mariner le poulet en morceaux dans le vin rouge avec la carotte en rondelles, l'oignon émincé, l'ail et les herbes (au moins 2 h).",
       "Égoutter le poulet et l'éponger en gardant la marinade. Faire dorer les lardons dans une cocotte, les réserver.",
       "Dorer les morceaux de poulet 8 min dans la graisse des lardons avec la moitié du beurre, saupoudrer de farine et remuer 1 min.",
       "Verser la marinade avec ses légumes, porter à ébullition puis couvrir et laisser mijoter 1 h 15 à feu doux.",
       "Cuire les pommes de terre à l'eau salée 20 min. Faire sauter les champignons dans le reste du beurre 6 min.",
       "Ajouter les lardons et les champignons dans la cocotte 10 min avant la fin. La sauce doit napper la cuillère : sinon, retirer le couvercle et laisser réduire.",
       "Servir bien chaud avec les pommes de terre."], "Française", serv=4)
    P("Magret de canard au miel, purée de patate douce", "Plats mijotés", 45, ["plaques"], ["week-end", "gourmand"],
      ["canard", ("miel", 1.5), ("vinaigre", 1), "patate-douce", ("beurre", 1), ("lait", 0.5), "oignon-nouveau"],
      ["Sortir le magret 20 min avant. Quadriller la peau au couteau sans entailler la chair, saler et poivrer.",
       "Cuire la patate douce en cubes 15 min à l'eau salée, puis l'écraser avec le beurre et le lait chaud.",
       "Poser le magret côté peau dans une poêle froide, puis allumer à feu moyen : cuire 8 min en retirant la graisse au fur et à mesure.",
       "Retourner le magret et cuire 4 min côté chair pour une cuisson rosée. Le laisser reposer 5 min sous une feuille d'aluminium.",
       "Vider la graisse de la poêle, verser le miel et le vinaigre, laisser réduire 1 min en grattant les sucs.",
       "Trancher le magret, napper de sauce au miel et servir avec la purée parsemée d'oignon nouveau ciselé."], "Française")
    P("Tajine d'agneau aux pruneaux et amandes", "Plats mijotés", 140, ["plaques"], ["week-end", "mijoté", "épicé"],
      [("agneau", 2), "pruneaux", ("amandes", 1.5), "oignon", ("miel", 1), ("cannelle", 0.5), ("epices", 2), ("bouillon", 1), ("huile-olive", 1), ("semoule", 1.5), "coriandre"],
      ["Couper l'agneau en morceaux, émincer les oignons.", "Faire dorer l'agneau 8 min dans l'huile d'olive, ajouter les oignons 5 min, puis les épices et la cannelle 1 min.",
       "Verser le bouillon et de l'eau à hauteur, couvrir et laisser mijoter 1 h 30 à feu doux en remuant de temps en temps.",
       "Ajouter les pruneaux et le miel, poursuivre 20 min sans couvercle pour que la sauce devienne sirupeuse.",
       "Faire dorer les amandes 3 min à sec dans une poêle. Préparer la semoule (eau bouillante salée, 5 min, puis égrener).",
       "Servir le tajine parsemé d'amandes et de coriandre, avec la semoule."], "Orientale", serv=4)
    P("Filet mignon de porc, sauce moutarde et champignons", "Plats mijotés", 50, ["plaques", "four"], ["week-end", "porc"],
      [("porc", 1.5), ("moutarde", 1.5), ("creme", 1.5), "champignons", "oignon", ("vin-blanc", 1), ("pomme-de-terre", 1.2), ("beurre", 1), "persil"],
      ["Préchauffer le four à 180 °C. Couper les pommes de terre en quartiers et les rôtir 35 min avec un filet d'huile et du sel.",
       "Saler et poivrer le filet mignon, le saisir 2 min sur chaque face dans le beurre, puis l'enfourner 15 min dans un plat.",
       "Dans la même poêle, faire revenir l'oignon émincé 3 min et les champignons 6 min.", "Déglacer au vin blanc, laisser réduire de moitié, puis ajouter la crème et la moutarde. Laisser épaissir 3 min.",
       "Laisser reposer la viande 5 min avant de la trancher (elle doit rester rosée). Napper de sauce, parsemer de persil et servir avec les pommes de terre."], "Française", serv=3)
    P("Saumon en croûte d'herbes et légumes rôtis", "Poisson", 45, ["four"], ["week-end", "poisson"],
      ["saumon", ("chapelure", 0.6), "persil", "citron", ("beurre", 1.5), "courgette", "poivron", ("tomate-cerise", 0.8), ("huile-olive", 1)],
      ["Préchauffer le four à 200 °C. Couper la courgette et le poivron en morceaux, les mélanger avec les tomates cerises, l'huile, du sel et du poivre, et enfourner 20 min.",
       "Mélanger la chapelure, le persil haché, le zeste du citron et le beurre mou jusqu'à obtenir une pâte.",
       "Poser les pavés de saumon sur les légumes, couvrir le dessus de la croûte d'herbes en pressant légèrement.",
       "Enfourner 12 à 14 min : la croûte doit être dorée et le saumon nacré à cœur.", "Servir avec un trait de jus de citron."], "Française")
    P("Lasagnes épinards et ricotta", "Gratins & four", 75, ["four", "plaques"], ["week-end", "four", "familial"],
      ["lasagnes", ("epinards", 2), ("ricotta", 2), "tomate-concassee", ("mozzarella", 1), ("parmesan", 1), "oignon", ("ail", 1), ("huile-olive", 1)],
      ["Faire revenir l'oignon et l'ail hachés 4 min dans l'huile, ajouter la tomate, saler et laisser mijoter 15 min.", "Faire tomber les épinards 4 min, bien les presser et les hacher grossièrement.",
       "Mélanger les épinards avec la ricotta, la moitié du parmesan, du sel, du poivre et une pincée de muscade.", "Préchauffer le four à 190 °C.",
       "Dans un plat, alterner : sauce tomate, feuilles de lasagnes, crème épinards-ricotta. Recommencer trois fois et finir par la sauce tomate.",
       "Couvrir de mozzarella en tranches et du reste de parmesan. Enfourner 35 min, puis laisser reposer 10 min avant de couper."], "Italienne", serv=4)
    P("Curry rouge thaï au poulet maison", "Curry", 40, ["plaques"], ["week-end", "épicé", "asiatique"],
      ["poulet", "lait-coco", ("curry", 1.5), "citron-vert", "gingembre", ("ail", 1), "poivron", "haricots-verts", ("sauce-soja", 1), ("sucre", 0.15), "coriandre", "riz"],
      ["Cuire le riz. Couper le poulet en lamelles, le poivron en lanières, équeuter les haricots verts.", "Faire chauffer 3 cuillères de lait de coco jusqu'à ce qu'il frémisse, ajouter le curry, l'ail et le gingembre râpés : remuer 1 min pour libérer les arômes.",
       "Ajouter le poulet et le saisir 4 min, puis le reste du lait de coco.", "Ajouter les haricots verts et le poivron, laisser mijoter 10 min à feu doux.",
       "Assaisonner avec la sauce soja, le sucre et le jus du citron vert : goûter et équilibrer salé, sucré, acide.", "Servir sur le riz avec la coriandre."], "Asiatique")
    P("Butter chicken", "Curry", 60, ["plaques"], ["week-end", "épicé"],
      ["poulet", "yaourt", ("garam-masala", 2), ("tomate-concassee", 1), ("creme", 1), ("beurre", 2), "oignon", ("ail", 1.5), "gingembre", "riz", "coriandre"],
      ["Couper le poulet en morceaux et le mélanger avec le yaourt, la moitié du garam masala, du sel. Laisser mariner au moins 30 min.",
       "Faire griller le poulet 6 min dans une poêle très chaude, sans trop remuer, pour qu'il colore. Réserver. Cuire le riz.",
       "Faire fondre le beurre, ajouter l'oignon haché 6 min, puis l'ail, le gingembre et le reste du garam masala 1 min.",
       "Verser la tomate et laisser mijoter 10 min, puis mixer pour obtenir une sauce lisse.", "Ajouter la crème et le poulet, laisser mijoter 10 min à feu doux.", "Servir avec le riz et la coriandre."], "Indienne")
    P("Bibimbap au bœuf", "Riz", 50, ["plaques"], ["week-end", "asiatique", "bol"],
      ["riz", ("boeuf-hache", 1), ("epinards", 0.7), "carotte", ("champignons", 0.6), ("oeufs", 0.5), ("sauce-soja", 2), ("sesame", 1), ("ail", 1), ("paprika", 1), ("miel", 1), ("huile-olive", 1)],
      ["Cuire le riz. Mélanger la sauce soja, le miel, l'ail haché, le paprika et un peu d'huile : c'est la sauce.", "Faire cuire le bœuf haché 6 min avec la moitié de la sauce.",
       "Faire sauter séparément la carotte en julienne (3 min), les champignons émincés (5 min) et les épinards (2 min), en salant légèrement chacun.",
       "Cuire les œufs au plat en gardant le jaune coulant.", "Dans des bols, disposer le riz, puis le bœuf et chaque légume en petits tas, l'œuf au centre.", "Arroser du reste de sauce, parsemer de sésame et mélanger au moment de manger."], "Coréenne")
    P("Bœuf Stroganoff", "Plats mijotés", 40, ["plaques"], ["week-end", "boeuf"],
      [("boeuf", 1.2), "champignons", "oignon", ("creme", 1.5), ("paprika", 1), ("moutarde", 0.5), ("beurre", 1), "pates", "persil"],
      ["Couper le bœuf en fines lanières, émincer l'oignon et les champignons. Cuire les pâtes.", "Saisir le bœuf 2 min à feu très vif dans la moitié du beurre, par petites quantités, puis réserver.",
       "Faire revenir l'oignon 4 min et les champignons 6 min dans le reste du beurre avec le paprika.", "Ajouter la crème et la moutarde, laisser épaissir 3 min.", "Remettre le bœuf 1 min juste pour le réchauffer (il doit rester tendre). Parsemer de persil et servir avec les pâtes."], "Russe")
    P("Goulash hongrois", "Plats mijotés", 150, ["plaques"], ["week-end", "mijoté", "boeuf"],
      [("boeuf", 2), ("oignon", 2), "poivron", ("paprika", 3), ("tomate-concassee", 1), ("ail", 1), ("cumin", 1), ("bouillon", 2), ("pomme-de-terre", 1.2), ("huile-olive", 1)],
      ["Couper le bœuf en cubes, émincer les oignons, couper le poivron en dés.", "Faire dorer le bœuf dans l'huile par petites quantités, réserver.", "Faire fondre les oignons 10 min à feu doux, ajouter l'ail, le paprika et le cumin hors du feu (le paprika brûle vite).",
       "Remettre la viande, ajouter la tomate, le poivron et le bouillon. Couvrir et laisser mijoter 1 h 30.", "Ajouter les pommes de terre en gros cubes et poursuivre 30 min, jusqu'à ce qu'elles soient tendres. Servir avec du pain."], "Hongroise", serv=4)
    P("Sauté de veau à la tomate façon osso buco", "Plats mijotés", 120, ["plaques"], ["week-end", "mijoté"],
      [("veau", 2), "tomate-concassee", "carotte", "oignon", ("ail", 1), ("vin-blanc", 1.5), "citron", "persil", ("farine", 0.2), ("huile-olive", 1), ("riz-risotto", 1)],
      ["Fariner légèrement les morceaux de veau et les faire dorer dans l'huile, réserver.", "Faire revenir l'oignon et la carotte en petits dés 6 min, déglacer au vin blanc.",
       "Ajouter la tomate et le veau, saler, poivrer, couvrir et laisser mijoter 1 h 30 à feu doux.", "Préparer la gremolata : hacher le persil avec le zeste du citron et l'ail.",
       "Cuire le riz comme un risotto simple (nacré au beurre, puis mouillé d'eau bouillante salée louche par louche 18 min).", "Servir le veau parsemé de gremolata, avec le riz."], "Italienne", serv=4)
    P("Ramen au porc et œuf mollet", "Soupes", 60, ["plaques"], ["week-end", "asiatique"],
      ["nouilles", ("porc", 0.8), ("bouillon", 3), ("oeufs", 0.5), ("sauce-soja", 2), "gingembre", ("ail", 1), "oignon-nouveau", "champignons", ("epinards", 0.5), ("miel", 0.5)],
      ["Cuire les œufs 6 min 30 dans l'eau bouillante, les rafraîchir, les écaler et les laisser mariner dans la moitié de la sauce soja.",
       "Faire chauffer le bouillon avec le gingembre en tranches, l'ail écrasé et le reste de la sauce soja : laisser infuser 15 min à feu doux.",
       "Saisir le porc en fines tranches 3 min avec le miel, jusqu'à ce qu'il caramélise.", "Cuire les nouilles selon le paquet. Ajouter les champignons émincés et les épinards dans le bouillon 2 min.",
       "Répartir les nouilles dans de grands bols, verser le bouillon brûlant avec ses légumes.", "Ajouter le porc, les œufs coupés en deux et l'oignon nouveau ciselé."], "Japonaise")
    P("Poulet katsu et riz", "Plats mijotés", 45, ["plaques"], ["week-end", "asiatique", "poulet"],
      ["poulet", ("chapelure", 1), ("farine", 0.3), ("oeufs", 0.25), ("huile-olive", 2), "riz", ("chou", 0.5), ("ketchup", 1.5), ("sauce-soja", 1), ("miel", 0.5)],
      ["Cuire le riz. Émincer très finement le chou.", "Aplatir les filets de poulet à 1 cm d'épaisseur, saler et poivrer.",
       "Passer chaque filet dans la farine, l'œuf battu puis la chapelure, en appuyant bien.", "Faire dorer 4 min de chaque côté dans l'huile chaude, puis égoutter sur du papier absorbant.",
       "Mélanger le ketchup, la sauce soja et le miel pour la sauce katsu.", "Trancher le poulet, servir avec le riz, le chou et la sauce."], "Japonaise")
    P("Porc au caramel", "Plats mijotés", 50, ["plaques"], ["week-end", "asiatique", "porc"],
      [("porc", 1.2), ("sucre", 0.8), ("sauce-soja", 2), ("ail", 1.5), "oignon", "oignon-nouveau", "riz"],
      ["Couper le porc en cubes, émincer l'oignon, hacher l'ail. Cuire le riz.", "Faire un caramel à sec avec le sucre dans une cocotte, jusqu'à ce qu'il soit ambré (ne pas remuer).",
       "Hors du feu, ajouter prudemment 10 cl d'eau chaude (ça éclabousse), puis la sauce soja.", "Ajouter le porc, l'oignon et l'ail, couvrir et laisser mijoter 30 min.",
       "Retirer le couvercle et laisser réduire jusqu'à ce que la sauce soit sirupeuse et enrobe la viande. Parsemer d'oignon nouveau et servir avec le riz."], "Vietnamienne")
    P("Soupe pho au bœuf", "Soupes", 50, ["plaques"], ["week-end", "asiatique"],
      ["nouilles", ("boeuf", 0.7), ("bouillon", 3), "gingembre", "oignon", ("cannelle", 0.3), "coriandre", "citron-vert", ("sauce-soja", 1.5), "oignon-nouveau"],
      ["Couper l'oignon en deux et le faire noircir 5 min à sec dans une poêle avec le gingembre en tranches : c'est ce qui donne son goût au bouillon.",
       "Les mettre dans le bouillon avec la cannelle et la sauce soja, laisser frémir 25 min.", "Couper le bœuf en tranches très fines (plus facile s'il a passé 20 min au congélateur).",
       "Cuire les nouilles de riz selon le paquet et les répartir dans les bols.", "Poser le bœuf cru sur les nouilles et verser le bouillon filtré bouillant : il cuit instantanément.", "Servir avec la coriandre, l'oignon nouveau et des quartiers de citron vert."], "Vietnamienne")
    P("Poulet rôti au citron et légumes racines", "Gratins & four", 95, ["four"], ["week-end", "four", "poulet"],
      [("poulet", 2.5), ("citron", 2), ("ail", 2), "herbes-provence", ("carotte", 1.5), ("pomme-de-terre", 1.2), "oignon-rouge", ("beurre", 1), ("huile-olive", 1)],
      ["Préchauffer le four à 200 °C. Sortir le poulet 30 min avant.", "Couper les carottes, les pommes de terre et l'oignon rouge en gros morceaux, les mélanger avec l'huile, du sel et les herbes dans un grand plat.",
       "Glisser le beurre mélangé à l'ail haché et au zeste d'un citron sous la peau du poulet. Mettre l'autre citron coupé en deux à l'intérieur.",
       "Poser le poulet sur les légumes et enfourner 1 h 15, en l'arrosant toutes les 20 min avec le jus.", "Vérifier la cuisson : le jus qui coule de la cuisse doit être clair.",
       "Laisser reposer 10 min sous une feuille d'aluminium avant de découper."], "Française", serv=4)
    # ---------- desserts ----------
    P("Tarte au citron meringuée", "Desserts", 90, ["four", "plaques"], ["week-end", "dessert", "pâtisserie"],
      ["pate-sablee", ("citron", 3), ("oeufs", 1), ("sucre", 3), ("beurre", 3), ("maizena", 1)],
      ["Préchauffer le four à 180 °C. Étaler la pâte dans un moule, la piquer, la couvrir de papier cuisson et de légumes secs, et la cuire à blanc 20 min.",
       "Séparer les blancs des jaunes de 3 œufs. Fouetter le jus et le zeste des citrons, 1 œuf entier, les 3 jaunes, la moitié du sucre et la maïzena.",
       "Cuire à feu doux en fouettant sans arrêt jusqu'à épaississement, puis ajouter le beurre en morceaux hors du feu. Verser sur le fond de tarte.",
       "Monter les blancs en neige, ajouter le reste du sucre en pluie et fouetter jusqu'à ce que la meringue soit ferme et brillante.",
       "Étaler la meringue sur la crème en formant des pics. La dorer 5 min sous le gril du four en surveillant.", "Réfrigérer au moins 2 h avant de servir."], "Française", meal=D, serv=6)
    P("Tarte Tatin", "Desserts", 75, ["four", "plaques"], ["week-end", "dessert", "four"],
      [("pomme", 3), ("sucre", 2), ("beurre", 4), "pate-feuilletee"],
      ["Préchauffer le four à 200 °C. Éplucher les pommes et les couper en quartiers.", "Dans un moule allant sur le feu, faire fondre le sucre jusqu'à obtenir un caramel blond, puis ajouter le beurre.",
       "Disposer les quartiers de pomme serrés, bombés vers le bas, et cuire 10 min sur le feu pour qu'ils s'imprègnent de caramel.",
       "Couvrir de pâte feuilletée en rentrant les bords à l'intérieur du moule, piquer.", "Enfourner 30 min, jusqu'à ce que la pâte soit bien dorée.", "Laisser tiédir 5 min puis retourner la tarte d'un coup sur un plat."], "Française", meal=D, serv=6)
    P("Crème brûlée", "Desserts", 70, ["four"], ["week-end", "dessert"],
      [("creme", 4), ("oeufs", 1), ("sucre", 1.5), "vanille"],
      ["Préchauffer le four à 100 °C. Chauffer la crème avec la vanille sans la faire bouillir.", "Fouetter les jaunes de 4 œufs avec les deux tiers du sucre, puis verser la crème chaude en remuant doucement (sans faire de mousse).",
       "Répartir dans des ramequins et cuire 50 min : la crème doit trembler légèrement au centre.", "Laisser refroidir puis réfrigérer au moins 3 h.",
       "Au moment de servir, saupoudrer le reste du sucre et le caraméliser au chalumeau ou 2 min sous le gril très chaud."], "Française", meal=D, serv=4)
    P("Charlotte aux fruits rouges", "Desserts", 40, [], ["week-end", "dessert", "froid"],
      [("biscuits", 2), ("fruits-rouges", 2), ("mascarpone", 2.5), ("creme", 2), ("sucre", 1)],
      ["Fouetter la crème bien froide en chantilly avec la moitié du sucre.", "Mélanger le mascarpone avec le reste du sucre, puis incorporer délicatement la chantilly.",
       "Tremper rapidement les biscuits dans un peu d'eau sucrée et en tapisser le fond et les bords d'un moule.", "Alterner couches de crème et de fruits rouges, finir par des biscuits.",
       "Couvrir, poser un poids léger et réfrigérer au moins 6 h. Démouler et décorer de fruits rouges."], "Française", meal=D, serv=6)
    P("Tagliatelles fraîches maison au beurre et parmesan", "Pâtes", 70, ["plaques"], ["week-end", "fait maison"],
      [("farine", 2), ("oeufs", 0.75), ("beurre", 2), ("parmesan", 1), "herbes-fraiches"],
      ["Verser la farine en fontaine, casser les œufs au centre et mélanger à la fourchette, puis pétrir 8 à 10 min jusqu'à ce que la pâte soit lisse et élastique.",
       "Envelopper la pâte et la laisser reposer 30 min à température ambiante.", "L'étaler très finement au rouleau sur un plan fariné (on doit presque voir à travers), la fariner et la rouler sur elle-même.",
       "Couper des bandes de 1 cm, les dérouler et les fariner pour qu'elles ne collent pas.", "Cuire 2 à 3 min seulement dans une grande casserole d'eau bouillante salée.",
       "Égoutter en gardant un peu d'eau, mélanger avec le beurre fondu, le parmesan et les herbes. Servir aussitôt."], "Italienne")
    return R
