# -*- coding: utf-8 -*-
"""Recettes élaborées, lot 2 : viandes, volailles, poissons (idées tirées de la base de recettes fournie,
réécrites en français avec des produits courants et des étapes détaillées)."""
from gen_hand1 import H


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **{"diff": "Intermédiaire", **k}))
    # ---------- agneau ----------
    P("Gigot d'agneau à l'ail et au romarin", "Plats mijotés", 110, ["four"], ["week-end", "four", "fête"],
      [("agneau", 3), ("ail", 3), "herbes-provence", ("huile-olive", 1.5), ("pomme-de-terre", 2), ("haricots-verts", 1.5), ("beurre", 1)],
      ["Sortir le gigot 1 h avant. Préchauffer le four à 210 °C.", "Piquer le gigot de petites entailles et y glisser la moitié de l'ail en lamelles. Le frotter d'huile d'olive, d'herbes de Provence, de sel et de poivre.",
       "Couper les pommes de terre en quartiers et les mettre autour du gigot avec le reste de l'ail en chemise.", "Enfourner 20 min à 210 °C, puis baisser à 180 °C et compter 15 min par livre pour une viande rosée, en arrosant toutes les 20 min.",
       "Cuire les haricots verts 8 min à l'eau bouillante salée, puis les faire sauter 2 min dans le beurre.", "Laisser reposer le gigot 15 min sous une feuille d'aluminium avant de le trancher. Servir avec le jus, les pommes de terre et les haricots."], "Française", serv=6)
    P("Souris d'agneau braisées au vin rouge", "Plats mijotés", 180, ["plaques", "four"], ["week-end", "mijoté", "fête"],
      [("agneau", 2.5), ("vin-rouge", 3), "carotte", "oignon", ("ail", 2), "tomate-concassee", "herbes-provence", ("huile-olive", 1), ("polenta", 1.5)],
      ["Préchauffer le four à 160 °C. Saler, poivrer les souris et les faire dorer sur toutes les faces dans l'huile d'olive, dans une cocotte allant au four. Réserver.",
       "Faire revenir l'oignon et la carotte en dés 6 min, ajouter l'ail écrasé 1 min.", "Verser le vin rouge et gratter les sucs, laisser bouillir 3 min. Ajouter la tomate concassée et les herbes de Provence.",
       "Remettre la viande, couvrir et enfourner 2 h 30 en retournant les souris à mi-cuisson : la viande doit se détacher de l'os.",
       "Dix minutes avant la fin, cuire la polenta dans quatre fois son volume d'eau salée en remuant.", "Si la sauce est trop liquide, la faire réduire 5 min sur le feu. Servir les souris sur la polenta, nappées de sauce."], "Française", serv=4)
    P("Navarin d'agneau aux petits légumes", "Plats mijotés", 120, ["plaques"], ["week-end", "mijoté", "printemps"],
      [("agneau", 2), ("carotte", 1.2), ("pomme-de-terre", 1), ("petits-pois", 1), "oignon", ("ail", 1), "tomate-concassee", ("farine", 0.2), ("bouillon", 1), "herbes-provence", ("huile-olive", 1)],
      ["Couper l'agneau en morceaux, saler, poivrer et le faire dorer dans l'huile d'olive par petites quantités.", "Ajouter l'oignon émincé 4 min, saupoudrer de farine et remuer 1 min.",
       "Verser le bouillon et la tomate concassée, ajouter l'ail et les herbes de Provence. Couvrir et laisser mijoter 1 h à feu doux.",
       "Ajouter les carottes en tronçons et les pommes de terre en morceaux, poursuivre 30 min.", "Ajouter les petits pois 10 min avant la fin. Rectifier l'assaisonnement et servir bien chaud."], "Française", serv=4)
    P("Côtelettes d'agneau, sauce yaourt à la menthe", "Poêlées", 35, ["plaques"], ["week-end", "rapide"],
      [("agneau", 1.2), "yaourt", "menthe", "citron", ("ail", 1), ("semoule", 1), ("huile-olive", 1), "cumin"],
      ["Mélanger l'huile d'olive, le cumin, la moitié de l'ail râpé, du sel et du poivre. En frotter les côtelettes d'agneau et laisser reposer 15 min.",
       "Préparer la sauce : yaourt, menthe ciselée, reste d'ail, un filet de jus de citron, sel.", "Verser de l'eau bouillante salée sur la semoule à hauteur, couvrir 5 min puis égrener à la fourchette avec le zeste du citron.",
       "Saisir les côtelettes 2 à 3 min par face dans une poêle très chaude : elles doivent rester rosées.", "Servir avec la semoule et la sauce à la menthe."], "Orientale")
    P("Boulettes d'agneau aux herbes et sauce tomate épicée", "Plats mijotés", 50, ["plaques"], ["week-end", "épicé"],
      [("agneau", 1.5), "oignon", ("ail", 1.5), "persil", "cumin", ("chapelure", 0.6), ("oeufs", 0.25), "tomate-concassee", "paprika", ("semoule", 1.2), ("huile-olive", 1)],
      ["Hacher finement l'agneau au couteau (ou demander au boucher de le hacher).", "Mélanger la viande avec la moitié de l'oignon râpé, la moitié de l'ail, le persil haché, le cumin, la chapelure, l'œuf, sel et poivre. Former des boulettes de la taille d'une noix.",
       "Les faire dorer 6 min dans l'huile d'olive en les retournant, puis les réserver.", "Faire revenir le reste de l'oignon et de l'ail 3 min, ajouter le paprika puis la tomate concassée. Laisser mijoter 10 min.",
       "Remettre les boulettes dans la sauce et poursuivre 12 min à couvert.", "Préparer la semoule (eau bouillante salée à hauteur, 5 min, égrener). Servir les boulettes sur la semoule."], "Orientale", serv=4)
    # ---------- bœuf, veau, porc ----------
    P("Pot-au-feu", "Soupes", 210, ["plaques"], ["week-end", "mijoté", "familial", "hiver"],
      [("boeuf", 3), ("carotte", 1.5), ("poireau", 1.5), ("pomme-de-terre", 1.5), "oignon", ("chou", 1), "herbes-provence", ("moutarde", 1), "cornichons", "sel", "poivre"],
      ["Mettre le bœuf dans une grande marmite, couvrir largement d'eau froide et porter doucement à ébullition. Écumer soigneusement la mousse qui se forme.",
       "Ajouter l'oignon coupé en deux, les herbes de Provence, du sel et du poivre. Laisser frémir 2 h à petits bouillons, sans couvrir complètement.",
       "Ajouter les carottes en gros tronçons et les poireaux ficelés, poursuivre 30 min.", "Ajouter les pommes de terre et le chou en quartiers, cuire encore 30 min.",
       "Servir d'abord le bouillon bien chaud en entrée, puis la viande tranchée avec les légumes, la moutarde et les cornichons."], "Française", serv=6)
    P("Bœuf mariné à la coréenne et riz", "Riz", 40, ["plaques"], ["week-end", "asiatique"],
      [("boeuf", 1.2), ("sauce-soja", 2), ("miel", 1), ("ail", 1.5), "gingembre", ("sesame", 1), "oignon-nouveau", "oignon", "riz", ("huile-olive", 1)],
      ["Couper le bœuf en tranches très fines (plus facile s'il a passé 20 min au congélateur).", "Mélanger la sauce soja, le miel, l'ail et le gingembre râpés, la moitié du sésame et un filet d'huile. Y faire mariner la viande au moins 20 min.",
       "Cuire le riz.", "Faire sauter l'oignon émincé 3 min à feu vif, ajouter la viande égouttée et la saisir 2 à 3 min en remuant.", "Verser la marinade, laisser caraméliser 1 min.",
       "Servir sur le riz, parsemé d'oignon nouveau ciselé et du reste de sésame."], "Coréenne")
    P("Bœuf sauté aux oignons et au gingembre", "Poêlées", 30, ["plaques"], ["asiatique", "rapide"],
      [("boeuf", 1), ("oignon", 2), "gingembre", ("ail", 1), ("sauce-soja", 2), ("maizena", 0.5), ("sucre", 0.1), "riz", ("huile-olive", 1)],
      ["Cuire le riz. Couper le bœuf en fines lanières et le mélanger avec la maïzena et la moitié de la sauce soja.", "Émincer les oignons en lamelles, râper le gingembre et l'ail.",
       "Saisir le bœuf 2 min à feu très vif dans l'huile d'olive, en deux fois, puis le réserver.", "Faire sauter les oignons 4 min : ils doivent rester un peu croquants. Ajouter le gingembre et l'ail 1 min.",
       "Remettre la viande avec le reste de la sauce soja, le sucre et 3 cuillères d'eau. Mélanger 1 min jusqu'à ce que la sauce nappe. Servir avec le riz."], "Chinoise")
    P("Brochettes de bœuf marinées, sauce chimichurri", "Poêlées", 45, ["plaques"], ["week-end", "barbecue", "été"],
      [("boeuf", 1.2), "poivron", "oignon-rouge", "persil", ("ail", 1.5), ("vinaigre", 1.5), ("huile-olive", 2), "paprika", ("pomme-de-terre", 1.2)],
      ["Couper le bœuf en gros cubes, le poivron et l'oignon rouge en morceaux.", "Chimichurri : mélanger le persil haché très finement, l'ail haché, le vinaigre, l'huile d'olive, le paprika, sel et poivre. Garder la moitié pour servir.",
       "Faire mariner la viande 30 min dans l'autre moitié. Pendant ce temps, cuire les pommes de terre 20 min à l'eau salée.", "Enfiler viande et légumes en alternant sur des piques.",
       "Cuire les brochettes 8 à 10 min dans une poêle-gril très chaude (ou au barbecue), en les tournant. Servir avec les pommes de terre et la sauce."], "Argentine")
    P("Chou farci au bœuf et à la tomate", "Plats mijotés", 100, ["plaques", "four"], ["week-end", "familial", "hiver"],
      [("chou", 1), ("boeuf-hache", 2), ("riz", 0.6), "oignon", ("ail", 1), "tomate-concassee", "paprika", "herbes-provence", ("bouillon", 0.5), ("huile-olive", 1)],
      ["Détacher 8 grandes feuilles de chou et les blanchir 4 min dans l'eau bouillante salée, puis les égoutter. Retirer la grosse côte.", "Cuire le riz 10 min (il finira de cuire au four).",
       "Mélanger le bœuf haché, le riz, la moitié de l'oignon haché, l'ail, le paprika, les herbes de Provence, sel et poivre.", "Déposer une boule de farce sur chaque feuille et la rouler en rentrant les bords. Préchauffer le four à 180 °C.",
       "Faire revenir le reste de l'oignon dans l'huile d'olive, ajouter la tomate concassée et le bouillon. Verser la moitié de la sauce dans un plat, y ranger les choux farcis, couvrir du reste.",
       "Couvrir d'aluminium et enfourner 1 h. Retirer l'aluminium les 10 dernières minutes."], "Européenne de l'Est", serv=4)
    P("Tajine de kefta aux œufs", "Plats mijotés", 45, ["plaques"], ["épicé", "familial"],
      [("boeuf-hache", 1.5), "oignon", ("ail", 1), "cumin", "paprika", "coriandre", "tomate-concassee", ("oeufs", 0.75), "pain", ("huile-olive", 1)],
      ["Mélanger le bœuf haché avec la moitié de la coriandre ciselée, la moitié du cumin et du paprika, sel et poivre. Former de petites boulettes.",
       "Faire revenir l'oignon haché dans l'huile d'olive 4 min dans une grande poêle, ajouter l'ail et le reste des épices.", "Verser la tomate concassée, laisser mijoter 10 min.",
       "Ajouter les boulettes et cuire 12 min à couvert en les retournant une fois.", "Creuser des puits et y casser les œufs. Couvrir et cuire 5 à 6 min, jusqu'à ce que les blancs soient pris.",
       "Parsemer du reste de coriandre et servir dans la poêle, avec du pain."], "Marocaine")
    P("Saltimbocca de veau au jambon cru", "Poêlées", 30, ["plaques"], ["week-end", "rapide"],
      [("veau", 1), ("jambon-cru", 1), "herbes-fraiches", ("beurre", 1.5), ("vin-blanc", 1), ("farine", 0.15), ("pates", 1), "citron"],
      ["Aplatir finement les escalopes de veau. Poser sur chacune une tranche de jambon cru et quelques feuilles d'herbes fraîches (sauge ou basilic), fixer avec un pique.",
       "Cuire les pâtes.", "Fariner légèrement le côté veau, poivrer (le jambon est déjà salé).", "Faire mousser la moitié du beurre et cuire les saltimbocca 2 min côté jambon puis 2 min côté veau. Réserver au chaud.",
       "Déglacer la poêle avec le vin blanc, laisser réduire 2 min, ajouter le reste du beurre et un trait de jus de citron.", "Napper la viande de sauce et servir avec les pâtes."], "Italienne")
    P("Côtes de porc braisées aux poivrons", "Plats mijotés", 55, ["plaques"], ["familial"],
      [("porc", 1.5), ("poivron", 2), "oignon", ("ail", 1), "tomate-concassee", "paprika", ("vin-blanc", 1), ("riz", 1), ("huile-olive", 1)],
      ["Saler, poivrer les côtes de porc et les faire dorer 3 min par face dans l'huile d'olive. Réserver.", "Faire revenir l'oignon et les poivrons en lanières 8 min, ajouter l'ail et le paprika.",
       "Déglacer au vin blanc, ajouter la tomate concassée, puis remettre la viande. Couvrir et laisser mijoter 30 min à feu doux.", "Pendant ce temps, cuire le riz.",
       "Servir les côtes nappées de poivrons, avec le riz."], "Espagnole")
    P("Rôti de porc à la moutarde et aux pommes", "Gratins & four", 85, ["four"], ["week-end", "four", "automne"],
      [("porc", 2.5), ("moutarde", 2), ("pomme", 2), "oignon", ("miel", 1), "herbes-provence", ("pomme-de-terre", 1.5), ("huile-olive", 1)],
      ["Préchauffer le four à 190 °C. Badigeonner le rôti de porc de moutarde mélangée au miel, saler, poivrer et parsemer d'herbes de Provence.",
       "Disposer autour les pommes de terre en quartiers, l'oignon en lamelles, arroser d'huile d'olive.", "Enfourner 30 min, puis ajouter les pommes en quartiers et un verre d'eau dans le plat.",
       "Poursuivre 30 à 35 min : le jus doit être clair quand on pique la viande.", "Laisser reposer 10 min sous aluminium, trancher et servir avec les pommes fondantes et les légumes."], "Française", serv=4)
    P("Porc braisé au soja et au gingembre", "Plats mijotés", 75, ["plaques"], ["week-end", "asiatique", "mijoté"],
      [("porc", 1.5), ("sauce-soja", 3), ("sucre", 0.6), "gingembre", ("ail", 1.5), "cannelle", "oignon-nouveau", "riz", ("brocoli", 1)],
      ["Couper le porc en cubes de 3 cm. Les blanchir 2 min dans l'eau bouillante, égoutter.", "Faire fondre le sucre dans une cocotte jusqu'à obtenir un caramel blond, ajouter la viande et l'enrober 2 min.",
       "Ajouter la sauce soja, le gingembre en tranches, l'ail écrasé, la cannelle et de l'eau à hauteur. Couvrir et laisser mijoter 50 min.", "Retirer le couvercle et faire réduire 10 min, jusqu'à ce que la sauce soit brillante et sirupeuse.",
       "Cuire le riz et le brocoli en fleurettes à la vapeur. Servir le porc parsemé d'oignon nouveau."], "Chinoise")
    P("Cordon bleu maison", "Poêlées", 40, ["plaques"], ["familial", "enfants"],
      [("dinde", 1.2), ("jambon", 1), ("emmental", 1), ("farine", 0.3), ("oeufs", 0.5), ("chapelure", 1), ("huile-olive", 2), ("pomme-de-terre", 1.2), "salade"],
      ["Couper les escalopes de dinde en deux dans l'épaisseur sans les séparer complètement, puis les ouvrir en portefeuille et les aplatir.", "Garnir une moitié d'une tranche de jambon et d'emmental en tranches, refermer en pressant bien les bords.",
       "Passer chaque cordon bleu dans la farine, l'œuf battu puis la chapelure.", "Cuire les pommes de terre en quartiers 20 min à l'eau salée, puis les faire dorer à la poêle.",
       "Faire dorer les cordons bleus 6 à 7 min par face à feu moyen dans l'huile d'olive, pour que le fromage fonde à cœur.", "Servir avec les pommes de terre et la salade."], "Française")
    # ---------- volailles ----------
    P("Canard à l'orange", "Plats mijotés", 60, ["plaques", "four"], ["week-end", "fête"],
      [("canard", 1.5), ("orange", 2), ("sucre", 0.3), ("vinaigre", 1), ("bouillon", 0.5), ("maizena", 0.3), ("beurre", 1), ("pomme-de-terre", 1.2)],
      ["Préchauffer le four à 200 °C. Quadriller la peau des magrets, saler et poivrer.", "Cuire les pommes de terre en rondelles 25 min au four avec un peu de graisse de canard ou de beurre.",
       "Poser les magrets côté peau dans une poêle froide, cuire 8 min à feu moyen en retirant la graisse, retourner et cuire 3 min. Laisser reposer sous aluminium.",
       "Sauce : faire un caramel blond avec le sucre, verser le vinaigre (attention aux projections), puis le jus des oranges et le bouillon. Laisser réduire 5 min.",
       "Épaissir avec la maïzena délayée dans un peu d'eau, ajouter le beurre et des suprêmes d'orange.", "Trancher les magrets et servir nappés de sauce, avec les pommes de terre."], "Française")
    P("Poulet chasseur", "Plats mijotés", 60, ["plaques"], ["familial", "mijoté"],
      [("poulet", 2), "champignons", "oignon", ("ail", 1), "tomate-concassee", ("vin-blanc", 1.5), "herbes-provence", "persil", ("beurre", 1), ("pates", 1.5)],
      ["Faire dorer les morceaux de poulet salés et poivrés dans le beurre, 8 min. Réserver.", "Faire revenir l'oignon émincé et les champignons en quartiers 6 min.",
       "Ajouter l'ail, déglacer au vin blanc et laisser réduire de moitié.", "Ajouter la tomate concassée et les herbes de Provence, remettre le poulet. Couvrir et laisser mijoter 35 min.",
       "Cuire les pâtes. Servir le poulet parsemé de persil, avec les pâtes."], "Française", serv=4)
    P("Poulet yassa", "Plats mijotés", 75, ["plaques"], ["week-end", "mijoté"],
      [("poulet", 2), ("oignon", 4), ("citron", 2), ("moutarde", 1.5), ("ail", 1.5), ("huile-olive", 1.5), ("bouillon", 0.5), ("riz", 1.5), "olives"],
      ["Mélanger le jus des citrons, la moutarde, l'ail écrasé, la moitié de l'huile, sel et poivre. Y faire mariner le poulet et les oignons émincés au moins 1 h (idéalement une nuit).",
       "Égoutter le poulet et le faire dorer 8 min dans le reste de l'huile. Réserver.", "Faire fondre les oignons de la marinade 15 min à feu moyen, jusqu'à ce qu'ils soient bien tendres et dorés.",
       "Remettre le poulet avec le reste de la marinade, le bouillon et les olives. Couvrir et laisser mijoter 30 min.", "Cuire le riz et servir avec le poulet et sa sauce aux oignons."], "Sénégalaise", serv=4)
    P("Tajine de poulet aux olives et au citron", "Plats mijotés", 70, ["plaques"], ["week-end", "mijoté"],
      [("poulet", 2), "oignon", ("ail", 1), "gingembre", "curcuma", "cumin", ("citron", 1.5), "olives", "coriandre", ("bouillon", 0.6), ("semoule", 1.5), ("huile-olive", 1)],
      ["Faire dorer le poulet dans l'huile d'olive, puis ajouter l'oignon râpé, l'ail, le gingembre râpé, le curcuma et le cumin. Remuer 2 min.",
       "Verser le bouillon, couvrir et laisser mijoter 35 min à feu doux.", "Ajouter le citron coupé en fins quartiers et les olives, poursuivre 15 min à découvert pour réduire la sauce.",
       "Préparer la semoule : eau bouillante salée à hauteur, 5 min à couvert, puis égrener.", "Parsemer le tajine de coriandre et servir avec la semoule."], "Marocaine", serv=4)
    P("Poulet satay, sauce cacahuète", "Poêlées", 45, ["plaques"], ["asiatique", "épicé"],
      [("poulet", 1.2), ("cacahuete", 2), "lait-coco", ("sauce-soja", 1.5), "citron-vert", "curry", ("miel", 0.5), ("ail", 1), "concombre", "riz"],
      ["Couper le poulet en lanières et le faire mariner 20 min avec la moitié de la sauce soja, le curry, le miel et l'ail râpé.", "Cuire le riz.",
       "Sauce : chauffer doucement le beurre de cacahuète avec le lait de coco, le reste de sauce soja et le jus du citron vert, en fouettant jusqu'à ce qu'elle soit lisse.",
       "Enfiler le poulet sur des piques et le cuire 8 min dans une poêle-gril bien chaude, en retournant.", "Servir avec le riz, des bâtonnets de concombre et la sauce cacahuète."], "Indonésienne")
    P("Poulet sauce aigre-douce façon traiteur", "Poêlées", 40, ["plaques"], ["asiatique", "familial"],
      [("poulet", 1.2), ("maizena", 1), ("oeufs", 0.25), ("sauce-soja", 1.5), ("miel", 1.5), ("vinaigre", 1.5), ("ketchup", 1), ("ail", 1), "gingembre", "poivron", "riz", ("huile-olive", 2)],
      ["Cuire le riz. Couper le poulet en cubes, le passer dans l'œuf battu puis dans la maïzena.", "Faire dorer les morceaux 6 à 8 min dans l'huile d'olive bien chaude, en plusieurs fois, jusqu'à ce qu'ils soient croustillants. Égoutter.",
       "Faire sauter le poivron en morceaux 3 min avec l'ail et le gingembre râpés.", "Ajouter la sauce soja, le miel, le vinaigre, le ketchup et 4 cuillères d'eau. Laisser épaissir 2 min.",
       "Remettre le poulet et l'enrober vivement de sauce. Servir aussitôt avec le riz."], "Chinoise")
    P("Biryani au poulet", "Riz", 70, ["plaques"], ["week-end", "épicé"],
      [("poulet", 1.5), ("riz", 1.5), "yaourt", ("oignon", 2), ("garam-masala", 1.5), "curcuma", "gingembre", ("ail", 1), ("raisins-secs", 0.6), ("amandes", 0.6), "coriandre", ("beurre", 1.5)],
      ["Mélanger le poulet en morceaux avec le yaourt, le garam masala, le curcuma, le gingembre et l'ail râpés, du sel. Laisser mariner 30 min.",
       "Faire dorer longuement les oignons émincés dans le beurre (15 min) jusqu'à ce qu'ils soient bien caramélisés. En réserver un tiers.", "Ajouter le poulet et sa marinade, cuire 10 min.",
       "Pendant ce temps, cuire le riz 6 min dans l'eau bouillante salée (il doit rester ferme) et l'égoutter.", "Étaler le riz sur le poulet, parsemer de raisins secs, couvrir hermétiquement et cuire 20 min à feu très doux.",
       "Faire griller les amandes à sec. Servir le biryani garni des oignons réservés, des amandes et de la coriandre."], "Indienne", serv=4)
    P("Enchiladas au poulet", "Gratins & four", 50, ["four", "plaques"], ["familial", "épicé"],
      [("poulet", 1.2), ("wrap", 1.5), "tomate-concassee", ("haricots-rouges", 0.8), "oignon", "cumin", "paprika", ("fromage-rape", 1.5), "creme", "coriandre"],
      ["Préchauffer le four à 200 °C. Cuire le poulet 12 min à l'eau frémissante salée, puis l'effilocher.", "Faire revenir l'oignon haché 4 min, ajouter le cumin, le paprika et la tomate concassée. Laisser mijoter 10 min : c'est la sauce.",
       "Mélanger le poulet, les haricots rouges égouttés, la moitié de la sauce et un tiers du fromage râpé.", "Garnir les wraps de ce mélange, les rouler et les ranger serrés dans un plat.",
       "Napper du reste de sauce, parsemer du reste de fromage et enfourner 20 min.", "Servir avec une cuillère de crème et de la coriandre ciselée."], "Mexicaine")
    # ---------- poissons et fruits de mer ----------
    P("Curry de crevettes au lait de coco", "Curry", 35, ["plaques"], ["asiatique", "épicé"],
      [("crevettes", 1.2), "lait-coco", ("curry", 1.5), "oignon", ("ail", 1), "gingembre", "tomate", "citron-vert", "coriandre", "riz", ("huile-olive", 1)],
      ["Cuire le riz. Émincer l'oignon, râper l'ail et le gingembre, couper la tomate en dés.", "Faire revenir l'oignon 4 min dans l'huile d'olive, ajouter l'ail, le gingembre et le curry, remuer 1 min.",
       "Ajouter la tomate 3 min, puis le lait de coco. Laisser mijoter 8 min.", "Ajouter les crevettes décortiquées et cuire 3 à 4 min, juste jusqu'à ce qu'elles deviennent roses.",
       "Assaisonner avec le jus du citron vert, parsemer de coriandre et servir avec le riz."], "Indienne")
    P("Risotto au citron, crevettes et petits pois", "Riz", 40, ["plaques"], ["week-end", "printemps"],
      [("riz-risotto", 1), ("crevettes", 1), ("petits-pois", 0.8), "oignon", ("vin-blanc", 1), ("bouillon", 2), "citron", ("parmesan", 0.6), ("beurre", 1.5)],
      ["Faire chauffer le bouillon et le garder frémissant. Hacher l'oignon.", "Faire fondre l'oignon dans la moitié du beurre 3 min, ajouter le riz et le nacrer 2 min.",
       "Verser le vin blanc et remuer jusqu'à absorption. Ajouter le bouillon louche par louche en remuant, pendant 16 min.", "Ajouter les petits pois et les crevettes décortiquées pour les 4 dernières minutes.",
       "Hors du feu, incorporer le reste du beurre, le parmesan, le zeste et un filet de jus du citron. Couvrir 2 min et servir."], "Italienne")
    P("Saumon laqué miel-soja et riz", "Poisson", 30, ["plaques"], ["asiatique", "rapide"],
      ["saumon", ("sauce-soja", 1.5), ("miel", 1), ("ail", 1), "gingembre", ("sesame", 0.5), "riz", "brocoli", "oignon-nouveau"],
      ["Cuire le riz et le brocoli en fleurettes à la vapeur.", "Mélanger la sauce soja, le miel, l'ail et le gingembre râpés.",
       "Saisir les pavés de saumon côté peau 4 min dans une poêle chaude, puis les retourner 2 min.", "Verser la sauce et laisser bouillonner 1 à 2 min en arrosant le saumon : elle doit devenir sirupeuse.",
       "Servir avec le riz et le brocoli, parsemé de sésame et d'oignon nouveau."], "Japonaise")
    P("Tartare de saumon à l'avocat", "Salades", 25, [], ["froid", "été", "sans cuisson"],
      [("saumon", 1), "avocat", "citron-vert", "oignon-rouge", "ciboulette", ("huile-olive", 1), ("sauce-soja", 0.5), "pain"],
      ["Choisir un saumon très frais (qualité « à consommer cru ») et le couper en petits dés au couteau.", "Couper l'avocat en dés et l'arroser de la moitié du jus de citron vert.",
       "Mélanger le saumon avec l'oignon rouge très finement haché, la ciboulette ciselée, l'huile d'olive, la sauce soja et le reste du citron vert. Poivrer.",
       "Dresser dans un cercle : une couche d'avocat, puis le saumon. Réserver 10 min au frais.", "Servir bien frais avec du pain grillé."], "Française")
    P("Pavé de saumon, poireaux fondants et beurre blanc", "Poisson", 40, ["plaques"], ["week-end", "fête"],
      ["saumon", ("poireau", 1.5), ("beurre", 3), ("vin-blanc", 1), ("vinaigre", 0.5), "oignon", ("creme", 0.5), ("riz", 1)],
      ["Cuire le riz. Émincer les poireaux et les faire fondre 15 min à couvert avec un peu de beurre et 3 cuillères d'eau.", "Beurre blanc : faire réduire l'oignon finement haché avec le vin blanc et le vinaigre jusqu'à ce qu'il ne reste presque plus de liquide.",
       "Ajouter la crème, puis le reste du beurre très froid en petits morceaux, en fouettant sur feu très doux : la sauce doit rester onctueuse, sans bouillir.",
       "Cuire le saumon côté peau 4 min à la poêle, le retourner 2 min.", "Dresser le saumon sur les poireaux, napper de beurre blanc et servir avec le riz."], "Française")
    P("Brandade de cabillaud", "Gratins & four", 55, ["plaques", "four"], ["week-end", "familial"],
      [("cabillaud", 1.5), ("pomme-de-terre", 1.5), ("lait", 1.5), ("ail", 1.5), ("huile-olive", 2), "persil", ("chapelure", 0.3), "salade"],
      ["Cuire les pommes de terre épluchées 20 min à l'eau salée.", "Pocher le cabillaud 8 min dans le lait frémissant avec l'ail écrasé. L'égoutter (garder le lait) et l'effeuiller en retirant les arêtes.",
       "Écraser les pommes de terre, ajouter le poisson, l'ail, puis l'huile d'olive et un peu de lait chaud en mélangeant à la fourchette : la texture doit être souple.",
       "Ajouter le persil haché, saler et poivrer. Préchauffer le four à 220 °C.", "Verser dans un plat, saupoudrer de chapelure et faire gratiner 10 min. Servir avec la salade."], "Provençale", serv=4)
    P("Croquettes de poisson et pommes de terre", "Poisson", 45, ["plaques"], ["familial", "enfants"],
      [("poisson-blanc", 1.2), ("pomme-de-terre", 1), "persil", "citron", ("oeufs", 0.5), ("farine", 0.3), ("chapelure", 0.8), ("huile-olive", 2), "salade", "mayonnaise"],
      ["Cuire les pommes de terre 20 min à l'eau salée et le poisson 6 min à la vapeur. Bien égoutter.", "Écraser les pommes de terre avec le poisson effeuillé, le persil haché, le zeste du citron, un œuf, sel et poivre.",
       "Former des galettes épaisses et les réfrigérer 15 min pour qu'elles se tiennent.", "Les passer dans la farine, l'œuf restant battu puis la chapelure.",
       "Les faire dorer 4 min par face dans l'huile d'olive. Servir avec la salade et la mayonnaise relevée d'un trait de citron."], "Anglaise")
    P("Moqueca, ragoût de poisson au lait de coco", "Poisson", 45, ["plaques"], ["week-end", "épicé", "été"],
      [("poisson-blanc", 1.5), "lait-coco", "poivron", "tomate", "oignon", ("ail", 1), "paprika", "citron-vert", "coriandre", "riz", ("huile-olive", 1)],
      ["Couper le poisson en gros morceaux et le faire mariner 15 min avec le jus du citron vert, l'ail râpé, sel et poivre.", "Cuire le riz.",
       "Dans une cocotte, faire revenir l'oignon et le poivron en lanières 6 min dans l'huile d'olive, ajouter le paprika et la tomate en dés 4 min.",
       "Poser le poisson sur les légumes, verser le lait de coco. Couvrir et laisser frémir 10 min sans remuer pour ne pas briser le poisson.", "Parsemer de coriandre et servir avec le riz."], "Brésilienne")
    P("Soupe de poissons à la provençale", "Soupes", 60, ["plaques"], ["week-end", "poisson"],
      [("poisson-blanc", 2), "tomate-concassee", "fenouil", "oignon", ("ail", 2), ("pomme-de-terre", 1), "herbes-provence", "curcuma", ("huile-olive", 1.5), "pain", ("fromage-rape", 0.5), "mayonnaise"],
      ["Faire revenir l'oignon, le fenouil émincé et la moitié de l'ail dans l'huile d'olive 8 min.", "Ajouter la tomate concassée, les herbes de Provence et le curcuma (pour la couleur), puis 1,2 litre d'eau. Saler, poivrer.",
       "Ajouter les pommes de terre en dés et laisser mijoter 20 min.", "Ajouter le poisson en morceaux 8 min, puis mixer finement (ou garder des morceaux pour une version rustique).",
       "Préparer une rouille rapide : mayonnaise et reste d'ail écrasé. Servir la soupe avec le pain grillé, la rouille et le fromage râpé."], "Provençale", serv=4)
    P("Cabillaud rôti, purée de petits pois à la menthe", "Poisson", 35, ["plaques", "four"], ["printemps", "léger"],
      ["cabillaud", ("petits-pois", 1.5), "menthe", ("beurre", 1), ("creme", 0.5), "citron", ("huile-olive", 0.5)],
      ["Préchauffer le four à 200 °C. Déposer le cabillaud dans un plat, arroser d'huile d'olive, saler, poivrer.", "Enfourner 12 à 15 min : la chair doit se détacher en lamelles nacrées.",
       "Cuire les petits pois 8 min à l'eau bouillante salée, les égoutter.", "Les mixer avec le beurre, la crème, la moitié de la menthe et un trait de jus de citron.",
       "Servir le poisson sur la purée, avec le reste de la menthe ciselée et le zeste du citron."], "Anglaise")
    P("Crevettes grillées marinées, salade de quinoa", "Salades", 35, ["plaques"], ["été", "léger"],
      [("crevettes", 1), ("quinoa", 1), "concombre", "tomate-cerise", "avocat", "citron-vert", ("ail", 1), "paprika", "coriandre", ("huile-olive", 1.5)],
      ["Cuire le quinoa 12 min à l'eau salée, l'égoutter et le laisser tiédir.", "Faire mariner les crevettes 15 min avec l'ail râpé, le paprika, la moitié de l'huile d'olive et la moitié du jus de citron vert.",
       "Couper le concombre en dés, les tomates cerises en deux, l'avocat en morceaux.", "Mélanger le quinoa, les légumes, la coriandre, le reste d'huile et de citron vert. Saler, poivrer.",
       "Saisir les crevettes 2 min par face dans une poêle-gril très chaude et les poser sur la salade."], "Mexicaine")
    return R
