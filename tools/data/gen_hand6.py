# -*- coding: utf-8 -*-
"""Recettes élaborées, lot 3 : légumes, soupes, salades, tartes, gratins, œufs et pâtisserie."""
from gen_hand1 import H

D = ("Dessert", "Goûter")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **{"diff": "Intermédiaire", **k}))
    # ---------- légumes et plats végétariens ----------
    P("Aubergines farcies à la turque", "Gratins & four", 70, ["four", "plaques"], ["week-end", "végétarien", "été"],
      [("aubergine", 2), "oignon", ("ail", 1.5), "tomate", "persil", ("pignons", 1), "cumin", ("huile-olive", 2), "yaourt", ("semoule", 1)],
      ["Préchauffer le four à 200 °C. Couper les aubergines en deux, quadriller la chair, arroser d'un peu d'huile d'olive et enfourner 25 min.",
       "Retirer la chair en laissant 1 cm contre la peau. La hacher.", "Faire revenir l'oignon et l'ail hachés 5 min dans l'huile d'olive, ajouter la tomate en dés, la chair d'aubergine et le cumin. Cuire 10 min.",
       "Ajouter le persil haché et les pignons grillés, saler, poivrer. Remplir les aubergines de cette farce.", "Enfourner 15 min. Préparer la semoule et servir avec une cuillère de yaourt."], "Turque")
    P("Aubergines à la parmigiana", "Gratins & four", 80, ["four", "plaques"], ["week-end", "végétarien", "four"],
      [("aubergine", 3), "tomate-concassee", ("mozzarella", 2), ("parmesan", 1.2), "basilic", ("ail", 1), "oignon", ("huile-olive", 2.5)],
      ["Couper les aubergines en tranches de 5 mm, les saler et les laisser dégorger 20 min. Les éponger.", "Les badigeonner d'huile d'olive et les faire griller au four (220 °C) 15 min en les retournant à mi-cuisson.",
       "Pendant ce temps, faire revenir l'oignon et l'ail hachés, ajouter la tomate concassée et laisser mijoter 15 min. Ajouter le basilic.",
       "Dans un plat, alterner sauce tomate, aubergines, mozzarella en tranches et parmesan, sur trois couches. Finir par la sauce et le parmesan.", "Cuire 30 min à 190 °C. Laisser reposer 10 min avant de servir."], "Italienne", serv=4)
    P("Champignons farcis à l'ail et au persil", "Gratins & four", 35, ["four"], ["apéritif", "végétarien"],
      [("champignons", 1.5), ("ail", 1.5), "persil", ("chapelure", 0.6), ("fromage-frais", 0.8), ("parmesan", 0.6), ("huile-olive", 1), "salade"],
      ["Préchauffer le four à 200 °C. Retirer les pieds des champignons et les hacher finement.", "Faire revenir les pieds hachés avec l'ail 4 min dans l'huile d'olive.",
       "Hors du feu, ajouter le persil haché, le fromage frais, la moitié de la chapelure, sel et poivre.", "Garnir les chapeaux, parsemer du reste de chapelure et de parmesan.",
       "Enfourner 15 à 18 min, jusqu'à ce que le dessus soit doré. Servir avec la salade."], "Française")
    P("Potimarron farci au quinoa, feta et noisettes", "Gratins & four", 75, ["four", "plaques"], ["week-end", "végétarien", "automne"],
      [("potimarron", 1), ("quinoa", 0.8), ("feta", 1), ("noisettes", 1), "oignon", ("epinards", 0.6), "herbes-provence", ("miel", 0.5), ("huile-olive", 1)],
      ["Préchauffer le four à 200 °C. Couper le potimarron en deux, retirer les graines, arroser d'huile d'olive, saler et enfourner 35 min.",
       "Cuire le quinoa 12 min à l'eau salée. Faire griller les noisettes à sec et les concasser.", "Faire revenir l'oignon haché 5 min, ajouter les épinards jusqu'à ce qu'ils tombent.",
       "Mélanger le quinoa, les épinards, la feta émiettée, les noisettes et les herbes de Provence.", "Remplir les moitiés de potimarron, arroser d'un filet de miel et remettre 15 min au four."], "Française")
    P("Curry de chou-fleur et aubergine rôtis", "Curry", 55, ["four", "plaques"], ["végétarien", "épicé"],
      [("chou-fleur", 1), ("aubergine", 1), "lait-coco", "tomate-concassee", ("curry", 1.5), "oignon", ("ail", 1), "gingembre", "coriandre", "riz", ("huile-olive", 1.5)],
      ["Préchauffer le four à 220 °C. Couper le chou-fleur en fleurettes et l'aubergine en cubes, les mélanger avec la moitié de l'huile d'olive et la moitié du curry. Rôtir 25 min.",
       "Cuire le riz.", "Faire revenir l'oignon haché 5 min dans le reste de l'huile, ajouter l'ail, le gingembre râpé et le reste du curry 1 min.",
       "Verser la tomate concassée et le lait de coco, laisser mijoter 10 min.", "Ajouter les légumes rôtis, mélanger et cuire encore 5 min. Servir avec le riz et la coriandre."], "Indienne")
    P("Curry de pois chiches aux épinards", "Curry", 35, ["plaques"], ["végétarien", "économique", "épicé"],
      [("pois-chiches", 1.5), ("epinards", 1), "tomate-concassee", "oignon", ("ail", 1), "gingembre", ("garam-masala", 1.5), "yaourt", "riz", ("huile-olive", 1)],
      ["Cuire le riz. Faire revenir l'oignon haché 6 min dans l'huile d'olive jusqu'à ce qu'il dore.", "Ajouter l'ail, le gingembre râpé et le garam masala, remuer 1 min.",
       "Verser la tomate concassée et les pois chiches égouttés, laisser mijoter 12 min.", "Ajouter les épinards et laisser tomber 3 min. Saler.",
       "Servir avec le riz et une cuillère de yaourt."], "Indienne")
    P("Ragoût de légumes d'été au four", "Plats mijotés", 70, ["four"], ["végétarien", "été", "économique"],
      [("courgette", 1), ("aubergine", 1), ("haricots-verts", 1), "poivron", "tomate", "oignon", ("ail", 1.5), "herbes-provence", ("huile-olive", 2), ("feta", 0.8), "pain"],
      ["Préchauffer le four à 180 °C. Couper la courgette, l'aubergine, le poivron et la tomate en morceaux, équeuter les haricots verts, émincer l'oignon et l'ail.", "Les mélanger dans un grand plat avec l'huile d'olive, les herbes de Provence, sel et poivre.",
       "Couvrir d'aluminium et enfourner 40 min.", "Retirer l'aluminium, remuer et poursuivre 20 min pour concentrer les saveurs.", "Émietter la feta par-dessus et servir avec du pain."], "Grecque", serv=4)
    P("Cannellonis ricotta-épinards", "Gratins & four", 70, ["four", "plaques"], ["week-end", "végétarien", "four"],
      [("lasagnes", 1), ("ricotta", 2), ("epinards", 1.5), "tomate-concassee", ("bechamel", 1), ("parmesan", 1), ("ail", 1), "basilic"],
      ["Préchauffer le four à 190 °C. Cuire les feuilles de lasagnes 3 min dans l'eau bouillante, les étaler sur un torchon.", "Faire tomber les épinards 4 min, bien les presser et les hacher.",
       "Mélanger les épinards, la ricotta, la moitié du parmesan, l'ail haché, sel, poivre et une pincée de muscade.", "Rouler chaque feuille autour d'un boudin de farce.",
       "Verser la tomate concassée assaisonnée de basilic dans un plat, ranger les cannellonis, napper de béchamel et parsemer du reste de parmesan.", "Enfourner 30 min, jusqu'à ce que le dessus soit doré."], "Italienne", serv=4)
    P("Gnocchis sauce gorgonzola et noix", "Pâtes", 25, ["plaques"], ["végétarien", "rapide", "réconfort"],
      ["gnocchis", ("fromage-bleu", 1), "creme", ("noix", 1), ("epinards", 0.5), "poivre"],
      ["Faire griller les noix à sec 3 min et les concasser.", "Faire fondre le fromage bleu dans la crème à feu doux en remuant.",
       "Cuire les gnocchis dans l'eau bouillante salée : ils sont prêts quand ils remontent à la surface.", "Les ajouter à la sauce avec les épinards et mélanger 1 min.",
       "Servir parsemé de noix et de poivre."], "Italienne")
    P("Gratin de chou-fleur à la béchamel", "Gratins & four", 50, ["four", "plaques"], ["familial", "végétarien", "hiver"],
      [("chou-fleur", 1.2), ("bechamel", 1.5), ("fromage-rape", 1), "poivre"],
      ["Préchauffer le four à 200 °C. Détailler le chou-fleur en fleurettes et les cuire 8 min à l'eau bouillante salée : elles doivent rester un peu fermes.",
       "Bien égoutter et disposer dans un plat beurré.", "Napper de béchamel, poivrer et parsemer de fromage râpé.", "Enfourner 25 min, jusqu'à ce que le gratin soit bien doré."], "Française", diff="Facile")
    P("Gratin de courgettes au parmesan", "Gratins & four", 50, ["four", "plaques"], ["végétarien", "été"],
      [("courgette", 1.5), ("oeufs", 0.5), "creme", ("parmesan", 1), ("ail", 1), "herbes-provence", ("huile-olive", 1)],
      ["Préchauffer le four à 190 °C. Couper les courgettes en rondelles et les faire revenir 8 min dans l'huile d'olive avec l'ail, pour qu'elles rendent leur eau.",
       "Les disposer dans un plat.", "Battre les œufs avec la crème, la moitié du parmesan, les herbes de Provence, sel et poivre. Verser sur les courgettes.",
       "Parsemer du reste de parmesan et enfourner 25 min."], "Française", diff="Facile")
    # ---------- soupes ----------
    P("Minestrone", "Soupes", 55, ["plaques"], ["végétarien", "familial"],
      [("carotte", 1), "courgette", ("haricots-blancs", 0.8), "tomate-concassee", "oignon", ("pates", 0.4), ("haricots-verts", 0.6), ("bouillon", 2), "basilic", ("parmesan", 0.6), ("huile-olive", 1)],
      ["Couper la carotte, la courgette et les haricots verts en petits morceaux, émincer l'oignon.", "Faire revenir l'oignon et la carotte 5 min dans l'huile d'olive.",
       "Ajouter la tomate concassée, le bouillon et 50 cl d'eau, porter à ébullition et laisser mijoter 15 min.", "Ajouter la courgette, les haricots verts, les haricots blancs égouttés et les pâtes, cuire 12 min.",
       "Servir avec le basilic ciselé et le parmesan râpé."], "Italienne", serv=4)
    P("Soupe coco au poulet et citron vert", "Soupes", 35, ["plaques"], ["asiatique", "épicé"],
      [("poulet", 1), "lait-coco", ("bouillon", 1.5), "champignons", "gingembre", "citron-vert", ("sauce-soja", 1), "coriandre", ("curry", 0.5), "oignon-nouveau"],
      ["Couper le poulet en fines lanières, émincer les champignons, trancher le gingembre.", "Porter le bouillon à frémissement avec le gingembre et le curry, laisser infuser 10 min.",
       "Ajouter le lait de coco et le poulet, cuire 8 min à feu doux.", "Ajouter les champignons 3 min, puis la sauce soja et le jus du citron vert.",
       "Servir parsemé de coriandre et d'oignon nouveau."], "Thaïlandaise")
    P("Velouté de courge rôtie au gingembre", "Soupes", 55, ["four", "plaques"], ["végétarien", "automne"],
      [("potimarron", 1), "oignon", "gingembre", "lait-coco", ("bouillon", 1.5), "cumin", ("huile-olive", 1), ("noisettes", 0.6)],
      ["Préchauffer le four à 210 °C. Couper le potimarron en gros morceaux (inutile de l'éplucher), le mélanger avec l'huile d'olive et le cumin, rôtir 30 min.",
       "Faire revenir l'oignon et le gingembre râpé 5 min dans une casserole.", "Ajouter la courge rôtie et le bouillon, laisser mijoter 10 min.",
       "Mixer avec la moitié du lait de coco jusqu'à obtenir un velouté lisse.", "Servir avec un trait du reste de lait de coco et les noisettes grillées concassées."], "Française")
    P("Velouté Dubarry au chou-fleur", "Soupes", 40, ["plaques"], ["végétarien", "hiver"],
      [("chou-fleur", 1), ("pomme-de-terre", 0.5), "poireau", ("lait", 1), ("bouillon", 1), ("creme", 0.5), ("beurre", 0.5), "ciboulette"],
      ["Faire fondre le blanc du poireau émincé dans le beurre 5 min.", "Ajouter le chou-fleur en fleurettes, la pomme de terre en dés, le bouillon et le lait. Laisser mijoter 20 min.",
       "Mixer finement, ajouter la crème, saler et poivrer.", "Servir parsemé de ciboulette ciselée."], "Française", diff="Facile")
    P("Soupe de lentilles au curry", "Soupes", 40, ["plaques"], ["végétarien", "économique", "hiver"],
      [("lentilles-corail", 1), "carotte", "oignon", ("ail", 1), ("curry", 1), "tomate-concassee", "lait-coco", ("bouillon", 1.5), "citron", "coriandre"],
      ["Faire revenir l'oignon et la carotte en dés 5 min, ajouter l'ail et le curry 1 min.", "Ajouter les lentilles corail rincées, la tomate concassée et le bouillon. Laisser mijoter 20 min.",
       "Ajouter le lait de coco et mixer à moitié pour garder un peu de texture.", "Assaisonner avec un trait de jus de citron et servir avec la coriandre."], "Indienne", diff="Facile")
    # ---------- salades ----------
    P("Salade de fenouil, orange et aneth", "Salades", 15, [], ["froid", "léger", "végétarien", "hiver"],
      ["fenouil", ("orange", 1), "aneth", ("olives", 0.6), ("huile-olive", 1), "citron"],
      ["Émincer le fenouil le plus finement possible.", "Peler les oranges à vif et les couper en rondelles, en récupérant le jus.",
       "Mélanger le jus d'orange, un trait de jus de citron, l'huile d'olive, sel et poivre.", "Disposer le fenouil et les oranges, ajouter les olives, arroser de vinaigrette et parsemer d'aneth."], "Méditerranéenne", diff="Facile")
    P("Salade de lentilles, chèvre et noix", "Salades", 35, ["plaques"], ["végétarien", "économique"],
      [("lentilles", 1), ("chevre", 1), ("noix", 0.8), "oignon-rouge", "salade", ("moutarde", 0.5), ("vinaigre", 1), ("huile-olive", 1.5), "persil"],
      ["Cuire les lentilles 20 min à l'eau non salée, saler en fin de cuisson et égoutter.", "Préparer la vinaigrette avec la moutarde, le vinaigre, l'huile d'olive, sel et poivre.",
       "Mélanger les lentilles tièdes avec la vinaigrette, l'oignon rouge émincé et le persil.", "Servir sur la salade avec le chèvre émietté et les noix concassées."], "Française", diff="Facile")
    P("Salade grecque", "Salades", 15, [], ["froid", "végétarien", "été"],
      [("tomate", 1.5), "concombre", "poivron", "oignon-rouge", ("feta", 1), ("olives", 0.8), "herbes-provence", ("huile-olive", 1.5), ("vinaigre", 0.5)],
      ["Couper les tomates et le concombre en gros morceaux, le poivron en lanières et l'oignon rouge en fines rondelles.", "Mélanger les légumes avec les olives.",
       "Poser la feta en bloc ou en gros morceaux par-dessus.", "Arroser d'huile d'olive et de vinaigre, parsemer d'herbes de Provence et poivrer."], "Grecque", diff="Facile")
    P("Salade de poulet à la thaïe", "Salades", 30, ["plaques"], ["asiatique", "froid", "été"],
      [("poulet", 1), "salade", "concombre", "carotte", "menthe", "coriandre", ("cacahuetes", 0.8), "citron-vert", ("sauce-soja", 1), ("miel", 0.5), "gingembre"],
      ["Cuire le poulet 12 min à l'eau frémissante salée, le laisser tiédir et l'effilocher.", "Couper le concombre et la carotte en fins bâtonnets.",
       "Sauce : jus du citron vert, sauce soja, miel et gingembre râpé.", "Mélanger la salade, les légumes, le poulet, la menthe et la coriandre avec la sauce.",
       "Parsemer de cacahuètes concassées et servir aussitôt."], "Thaïlandaise")
    P("Salade de quinoa, maïs, haricots rouges et avocat", "Salades", 25, ["plaques"], ["végétarien", "froid", "été"],
      [("quinoa", 1), "mais", ("haricots-rouges", 0.8), "avocat", "tomate", "oignon-rouge", "citron-vert", "coriandre", "cumin", ("huile-olive", 1)],
      ["Cuire le quinoa 12 min à l'eau salée et le laisser refroidir.", "Égoutter le maïs et les haricots rouges, couper l'avocat et la tomate en dés, émincer l'oignon rouge.",
       "Vinaigrette : jus du citron vert, huile d'olive, cumin, sel et poivre.", "Mélanger tous les ingrédients, ajouter la coriandre ciselée et servir frais."], "Mexicaine", diff="Facile")
    P("Salade tiède de pommes de terre à la moutarde", "Salades", 30, ["plaques"], ["végétarien", "économique"],
      [("pomme-de-terre", 1.2), "oignon-rouge", "ciboulette", "persil", ("moutarde", 1), ("vinaigre", 1), ("huile-olive", 1.5), "cornichons"],
      ["Cuire les pommes de terre avec la peau 20 min à l'eau salée.", "Vinaigrette : moutarde, vinaigre, huile d'olive, sel et poivre.",
       "Peler les pommes de terre encore chaudes, les couper en rondelles et les arroser aussitôt de vinaigrette : elles l'absorbent mieux tièdes.",
       "Ajouter l'oignon rouge émincé, les cornichons en rondelles, la ciboulette et le persil."], "Allemande", diff="Facile")
    # ---------- tartes, tourtes, galettes ----------
    P("Tarte fine aux oignons caramélisés et au chèvre", "Tartes & pizzas", 60, ["four", "plaques"], ["végétarien", "week-end"],
      ["pate-feuilletee", ("oignon", 3), ("chevre", 1), ("miel", 1), "herbes-provence", ("beurre", 1), ("vinaigre", 0.5), "salade"],
      ["Émincer les oignons et les faire fondre 25 min à feu doux dans le beurre, à couvert, en remuant de temps en temps.", "Ajouter le miel et le vinaigre, laisser caraméliser 5 min à découvert.",
       "Préchauffer le four à 200 °C. Étaler la pâte feuilletée sur une plaque et la piquer.", "Répartir les oignons, puis le chèvre en rondelles et les herbes de Provence.",
       "Enfourner 20 à 25 min, jusqu'à ce que la pâte soit bien dorée. Servir avec la salade."], "Française")
    P("Tourte au poulet et aux champignons", "Tartes & pizzas", 70, ["four", "plaques"], ["week-end", "familial", "hiver"],
      [("pate-feuilletee", 2), ("poulet", 1.5), "champignons", "poireau", ("creme", 1), ("moutarde", 0.5), ("oeufs", 0.25), "herbes-provence", ("beurre", 1)],
      ["Préchauffer le four à 200 °C. Couper le poulet en dés et le faire dorer 6 min dans le beurre. Réserver.", "Faire revenir le poireau émincé 6 min, puis les champignons 5 min.",
       "Ajouter le poulet, la crème, la moutarde et les herbes de Provence. Laisser épaissir 3 min, saler, poivrer et laisser tiédir.",
       "Foncer un moule avec une pâte feuilletée, verser la garniture, couvrir de la seconde pâte et souder les bords. Faire une cheminée au centre.",
       "Dorer avec l'œuf battu et enfourner 35 min."], "Anglaise", serv=4)
    P("Galette de pommes de terre au saumon fumé", "Poêlées", 40, ["plaques"], ["week-end", "brunch"],
      [("pomme-de-terre", 1.2), ("saumon-fume", 1), ("fromage-frais", 0.8), "aneth", "citron", ("oeufs", 0.25), ("beurre", 1.5), "salade"],
      ["Râper les pommes de terre, les presser fortement dans un torchon pour retirer toute l'eau.", "Mélanger avec l'œuf, sel et poivre.",
       "Faire fondre le beurre dans une poêle, étaler les pommes de terre en une galette bien tassée. Cuire 10 min à feu moyen.",
       "Retourner la galette à l'aide d'une assiette et cuire encore 8 min : elle doit être dorée et croustillante.",
       "Mélanger le fromage frais avec l'aneth et le zeste du citron. Garnir la galette de cette crème et du saumon fumé. Servir avec la salade."], "Française")
    P("Galette des rois à la frangipane", "Desserts", 75, ["four"], ["week-end", "pâtisserie", "fête", "hiver"],
      [("pate-feuilletee", 2), ("amandes", 3), ("beurre", 4), ("sucre", 1.2), ("oeufs", 0.75), ("farine", 0.15)],
      ["Préchauffer le four à 200 °C. Frangipane : mélanger le beurre mou et le sucre, ajouter 2 œufs un par un, puis les amandes en poudre et la farine.",
       "Étaler une pâte feuilletée sur une plaque. Étaler la frangipane en laissant 2 cm de bord libre (et cacher une fève !).",
       "Mouiller le bord au pinceau, couvrir de la seconde pâte et bien souder en pressant.", "Battre le dernier œuf et dorer le dessus. Dessiner des arcs avec la pointe d'un couteau sans percer la pâte, et faire un petit trou au centre.",
       "Enfourner 30 à 35 min, jusqu'à ce que la galette soit bien dorée. Servir tiède."], "Française", meal=D, serv=6)
    P("Galette rustique aux pommes", "Desserts", 55, ["four"], ["automne", "pâtisserie"],
      ["pate-brisee", ("pomme", 2), ("sucre", 0.6), ("beurre", 1.5), "cannelle", ("amandes", 0.8), ("oeufs", 0.25)],
      ["Préchauffer le four à 200 °C. Étaler la pâte sur une plaque, sans moule.", "Parsemer le centre d'amandes en poudre (elles absorbent le jus).",
       "Disposer les pommes en fines lamelles en rosace, en laissant 4 cm de bord. Saupoudrer de sucre et de cannelle, parsemer de beurre en morceaux.",
       "Rabattre les bords de pâte sur les fruits en les plissant. Dorer la pâte à l'œuf battu.", "Enfourner 35 min. Servir tiède."], "Française", meal=D, serv=6)
    P("Tarte amandine aux poires", "Desserts", 70, ["four"], ["week-end", "pâtisserie", "automne"],
      ["pate-sablee", ("poire", 2), ("amandes", 2), ("beurre", 3), ("sucre", 1), ("oeufs", 0.5)],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte sablée et la piquer.", "Crème d'amande : mélanger le beurre mou et le sucre, ajouter les œufs puis les amandes en poudre.",
       "Étaler la crème sur la pâte.", "Peler les poires, les couper en deux, retirer le cœur et les émincer en gardant leur forme. Les disposer en étoile sur la crème.",
       "Enfourner 40 min : la crème doit être dorée et prise. Laisser refroidir avant de démouler."], "Française", meal=D, serv=6)
    P("Tarte aux abricots et amandes", "Desserts", 55, ["four"], ["été", "pâtisserie"],
      ["pate-brisee", ("abricots", 2), ("amandes", 1), ("sucre", 0.8), ("oeufs", 0.5), "creme"],
      ["Préchauffer le four à 190 °C. Foncer un moule avec la pâte et la piquer.", "Parsemer le fond d'amandes en poudre.",
       "Couper les abricots en deux et les disposer serrés, face bombée vers le bas.", "Battre les œufs avec le sucre et la crème, verser entre les fruits.", "Enfourner 35 min. Servir tiède ou froid."], "Française", meal=D, serv=6)
    P("Tarte au chocolat", "Desserts", 60, ["four", "plaques"], ["week-end", "pâtisserie", "chocolat"],
      ["pate-sablee", ("chocolat", 2), ("creme", 2), ("beurre", 1), ("oeufs", 0.25), ("sucre", 0.2)],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte sablée, la couvrir de papier cuisson et de légumes secs, et cuire à blanc 20 min. Retirer le papier, cuire 5 min de plus.",
       "Porter la crème à ébullition avec le sucre, la verser sur le chocolat en morceaux. Attendre 1 min puis mélanger doucement jusqu'à obtenir une ganache lisse.", "Ajouter le beurre puis l'œuf battu.",
       "Verser sur le fond de tarte et cuire 10 min à 150 °C : le centre doit encore trembloter.", "Laisser refroidir au moins 2 h avant de servir."], "Française", meal=D, serv=6)
    # ---------- œufs ----------
    P("Piperade basque aux œufs", "Œufs", 40, ["plaques"], ["été", "familial"],
      [("poivron", 2), ("tomate", 1.5), "oignon", ("ail", 1), "paprika", ("oeufs", 1), ("jambon-cru", 0.6), ("huile-olive", 1.5), "pain"],
      ["Couper les poivrons en lanières, émincer l'oignon, couper les tomates en morceaux.", "Faire revenir l'oignon et les poivrons 12 min dans l'huile d'olive à feu moyen.",
       "Ajouter l'ail, le paprika et les tomates, laisser compoter 15 min à découvert.", "Battre les œufs et les verser dans la piperade en remuant doucement, comme des œufs brouillés, 2 min.",
       "Faire griller rapidement le jambon cru à la poêle et le poser dessus. Servir avec du pain."], "Basque")
    P("Œufs mimosa", "Œufs", 25, ["plaques"], ["apéritif", "froid", "fête"],
      [("oeufs", 1.5), ("mayonnaise", 2), ("moutarde", 0.3), "ciboulette", "paprika", "salade"],
      ["Cuire les œufs 10 min dans l'eau bouillante, les rafraîchir à l'eau froide et les écaler.", "Les couper en deux dans la longueur et retirer les jaunes.",
       "Écraser la moitié des jaunes avec la mayonnaise, la moutarde et la ciboulette ciselée. Saler, poivrer.", "Garnir les blancs de cette crème.",
       "Émietter le reste des jaunes par-dessus (c'est le « mimosa »), saupoudrer d'un peu de paprika et servir sur la salade."], "Française", diff="Facile")
    P("Frittata pommes de terre, oignons confits et jambon", "Œufs", 40, ["plaques", "four"], ["familial", "brunch"],
      [("oeufs", 1.5), ("pomme-de-terre", 0.8), ("oignon", 2), ("jambon", 1), ("fromage-rape", 0.6), ("huile-olive", 1.5), "persil"],
      ["Couper les pommes de terre en fines rondelles et les cuire 12 min à la poêle dans l'huile d'olive en les retournant.", "Ajouter les oignons émincés et poursuivre 10 min à feu doux jusqu'à ce qu'ils soient fondants.",
       "Battre les œufs avec le fromage râpé, le persil, sel et poivre. Ajouter le jambon en lanières.", "Verser sur les légumes et cuire 8 min à feu doux sans remuer.",
       "Finir 5 min sous le gril du four pour dorer le dessus. Servir chaud ou tiède."], "Italienne")
    # ---------- desserts et pâtisserie ----------
    P("Île flottante", "Desserts", 45, ["plaques"], ["week-end", "pâtisserie", "classique"],
      [("oeufs", 1), ("lait", 2.5), ("sucre", 1.5), "vanille", ("amandes", 0.5)],
      ["Crème anglaise : chauffer le lait avec la vanille. Fouetter les jaunes avec la moitié du sucre, verser le lait chaud dessus en fouettant.",
       "Remettre dans la casserole et cuire à feu très doux en remuant sans arrêt : la crème est prête quand elle nappe la cuillère (ne jamais la faire bouillir). Laisser refroidir.",
       "Monter les blancs en neige ferme en ajoutant un quart du sucre à la fin.", "Former des quenelles de blanc et les pocher 1 min de chaque côté dans de l'eau frémissante, ou 30 secondes au micro-ondes. Égoutter.",
       "Faire un caramel blond avec le reste du sucre et un peu d'eau. Servir les blancs sur la crème, filet de caramel et amandes effilées grillées."], "Française", meal=D, serv=4)
    P("Profiteroles au chocolat", "Desserts", 75, ["four", "plaques"], ["week-end", "pâtisserie", "fête"],
      [("farine", 0.6), ("beurre", 2.5), ("oeufs", 0.75), ("lait", 0.6), ("sucre", 0.15), ("chocolat", 1.5), ("creme", 1), "glace"],
      ["Préchauffer le four à 190 °C. Pâte à choux : porter à ébullition 12 cl d'eau, le lait, le beurre en morceaux, le sucre et une pincée de sel.",
       "Hors du feu, verser la farine d'un coup et mélanger vivement. Remettre sur le feu 1 min pour dessécher la pâte, jusqu'à ce qu'elle forme une boule.",
       "Hors du feu, incorporer les œufs un par un : la pâte doit être lisse et brillante.", "Former des petits tas sur une plaque avec deux cuillères ou une poche. Enfourner 25 min sans ouvrir la porte.",
       "Sauce : faire fondre le chocolat dans la crème chaude. Ouvrir les choux, les garnir de glace et napper de sauce chaude au moment de servir."], "Française", meal=D, serv=6)
    P("Madeleines au miel", "Desserts", 40, ["four"], ["pâtisserie", "goûter"],
      [("farine", 0.8), ("beurre", 4), ("sucre", 0.8), ("oeufs", 0.75), ("miel", 1), "levure", "citron"],
      ["Faire fondre le beurre et le laisser tiédir.", "Fouetter les œufs avec le sucre et le miel jusqu'à ce que le mélange blanchisse.",
       "Ajouter la farine et la levure, puis le beurre fondu et le zeste du citron.", "Laisser reposer la pâte au moins 1 h au frais : c'est le secret de la bosse.",
       "Préchauffer le four à 220 °C. Remplir les moules beurrés aux trois quarts, enfourner 5 min puis baisser à 180 °C et cuire 6 min."], "Française", meal=D, serv=6)
    P("Crêpes Suzette", "Desserts", 45, ["plaques"], ["week-end", "fête"],
      [("farine", 0.8), ("oeufs", 0.5), ("lait", 2), ("beurre", 2.5), ("sucre", 0.8), ("orange", 2)],
      ["Pâte : mélanger la farine, les œufs, une pincée de sel, puis le lait petit à petit. Ajouter une noix de beurre fondu et laisser reposer 30 min.",
       "Cuire des crêpes fines dans une poêle légèrement beurrée.", "Sauce : faire fondre le sucre dans une grande poêle jusqu'à un caramel blond, ajouter le reste du beurre puis le jus et le zeste des oranges. Laisser réduire 3 min.",
       "Plier les crêpes en quatre et les réchauffer dans la sauce en les retournant.", "Servir aussitôt, nappées de sauce à l'orange."], "Française", meal=D, serv=4)
    P("Poires pochées au vin rouge et à la cannelle", "Desserts", 50, ["plaques"], ["automne", "fête"],
      [("poire", 2), ("vin-rouge", 3), ("sucre", 1), "cannelle", "orange", "vanille"],
      ["Peler les poires en gardant la queue.", "Porter à ébullition le vin rouge avec le sucre, la cannelle, la vanille et le zeste de l'orange.",
       "Plonger les poires et les pocher 25 à 30 min à feu doux en les retournant : la pointe d'un couteau doit entrer facilement.", "Retirer les poires et faire réduire le sirop 10 min jusqu'à ce qu'il soit nappant.",
       "Servir les poires tièdes ou froides, arrosées de sirop."], "Française", meal=D)
    P("Clafoutis aux poires", "Desserts", 50, ["four"], ["automne", "familial"],
      [("poire", 2), ("oeufs", 0.75), ("lait", 1.5), ("farine", 0.5), ("sucre", 0.8), ("beurre", 1), "vanille"],
      ["Préchauffer le four à 180 °C. Beurrer un plat et y disposer les poires en lamelles.", "Fouetter les œufs avec le sucre, ajouter la farine puis le lait petit à petit et la vanille.",
       "Verser la pâte sur les poires.", "Enfourner 35 à 40 min : le clafoutis doit être doré et pris. Servir tiède."], "Française", meal=D, serv=4, diff="Facile")
    P("Gâteau moelleux aux pommes", "Desserts", 60, ["four"], ["goûter", "familial", "automne"],
      [("pomme", 2), ("farine", 1.2), ("sucre", 1), ("oeufs", 0.75), ("beurre", 4), "levure", "cannelle", ("lait", 0.5)],
      ["Préchauffer le four à 180 °C. Éplucher les pommes et les couper en dés.", "Fouetter les œufs et le sucre, ajouter le beurre fondu et le lait.",
       "Incorporer la farine, la levure et la cannelle, puis les pommes.", "Verser dans un moule beurré et enfourner 40 min : la lame d'un couteau doit ressortir sèche."], "Française", meal=D, serv=6, diff="Facile")
    P("Moelleux chocolat-noisette", "Desserts", 40, ["four", "plaques"], ["chocolat", "goûter"],
      [("chocolat", 2), ("beurre", 5), ("sucre", 1), ("oeufs", 1), ("farine", 0.4), ("noisettes", 1.5)],
      ["Préchauffer le four à 180 °C. Faire fondre le chocolat avec le beurre.", "Torréfier les noisettes 8 min au four, puis les mixer en poudre grossière.",
       "Fouetter les œufs avec le sucre, ajouter le chocolat fondu, la farine et les noisettes.", "Verser dans un moule beurré et cuire 20 à 22 min : le cœur doit rester fondant."], "Française", meal=D, serv=6)
    return R
