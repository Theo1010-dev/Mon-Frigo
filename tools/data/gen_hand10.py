# -*- coding: utf-8 -*-
"""Recettes écrites à la main (10) : apéritif / tapas et entrées."""
from gen_hand1 import H

AP = ("Apéritif",)
E = ("Entrée",)


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- APÉRITIF & TAPAS ----------
    P("Pan con tomate", "Sandwichs", 10, ["plaques"], ["apéritif", "végétarien", "économique"],
      [("pain", 2), "tomate", ("ail", 0.5), ("huile-olive", 1.5)],
      ["Faire griller les tranches de pain dans une poêle sèche ou au grille-pain.", "Frotter chaque tranche encore chaude avec la gousse d'ail coupée en deux.",
       "Couper les tomates en deux et les râper sur une grosse râpe : étaler la pulpe sur le pain. Arroser d'un filet d'huile d'olive, saler et servir aussitôt."], "Espagnole", meal=AP, serv=4)
    P("Chorizo poêlé au vin blanc", "Poêlées", 15, ["plaques"], ["apéritif", "fête"],
      [("chorizo", 2.5), "vin-blanc", ("ail", 0.5), ("persil", 0.5)],
      ["Couper le chorizo en rondelles épaisses.", "Les faire revenir 3 min à sec dans une poêle chaude avec l'ail écrasé : le chorizo rend sa graisse.",
       "Verser le vin blanc et laisser réduire 5 min à feu moyen. Parsemer de persil ciselé et servir chaud avec des piques."], "Espagnole", meal=AP, serv=4)
    P("Champignons à l'ail façon tapas", "Poêlées", 15, ["plaques"], ["apéritif", "végétarien"],
      [("champignons", 1.6), ("ail", 1), "persil", ("huile-olive", 1.5), ("citron", 0.5)],
      ["Nettoyer les champignons et les couper en quartiers.", "Les faire sauter 6 min à feu vif dans l'huile d'olive, jusqu'à ce qu'ils soient bien dorés.",
       "Ajouter l'ail haché et le persil, cuire encore 1 min, puis arroser d'un trait de jus de citron. Saler, poivrer et servir chaud."], "Espagnole", meal=AP, serv=4)
    P("Feta rôtie au miel et aux herbes", "Gratins & four", 20, ["four"], ["apéritif", "végétarien", "fête"],
      [("feta", 2), ("miel", 1.5), "herbes-provence", ("huile-olive", 1), ("pain", 1.5)],
      ["Préchauffer le four à 200 °C. Poser le bloc de feta dans un petit plat, l'arroser d'huile d'olive et le parsemer d'herbes de Provence.",
       "Enfourner 12 min, puis verser le miel dessus et passer 3 min sous le gril.", "Servir aussitôt avec le pain grillé, pour tartiner la feta fondante."], "Grecque", meal=AP, serv=4)
    P("Brochettes tomate, mozzarella et basilic", "Salades", 10, [], ["apéritif", "végétarien", "sans cuisson", "été"],
      ["tomate-cerise", "mozzarella", ("basilic", 0.5), ("huile-olive", 1), "vinaigre"],
      ["Égoutter la mozzarella et la couper en dés.", "Piquer sur des petites brochettes une tomate cerise, une feuille de basilic et un dé de mozzarella.",
       "Arroser d'un filet d'huile d'olive et de quelques gouttes de vinaigre balsamique, saler, poivrer et garder au frais."], "Italienne", meal=AP, serv=4)
    P("Mini croques jambon-fromage", "Sandwichs", 20, ["four"], ["apéritif", "familial", "enfants"],
      [("pain-mie", 2), "jambon", "emmental", ("beurre", 1.5)],
      ["Préchauffer le four à 200 °C. Beurrer légèrement les tranches de pain de mie sur une face.",
       "Garnir la moitié des tranches (côté non beurré) de jambon et d'emmental, puis refermer avec les autres tranches, beurre à l'extérieur.",
       "Cuire 10 min au four en retournant à mi-cuisson, puis couper chaque croque en 4 petits triangles."], "Française", meal=AP, serv=4)
    P("Cake salé chèvre, courgette et menthe", "Gratins & four", 60, ["four"], ["apéritif", "végétarien", "pique-nique"],
      [("farine", 1.5), ("oeufs", 0.75), ("lait", 0.6), ("huile-olive", 2), "levure", ("courgette", 0.7), ("chevre", 1.2), ("menthe", 0.5), ("fromage-rape", 0.8)],
      ["Préchauffer le four à 180 °C. Râper la courgette, la saler et la presser dans un torchon pour retirer son eau.",
       "Fouetter les œufs avec le lait et l'huile d'olive, puis ajouter la farine mélangée à la levure.",
       "Incorporer la courgette, le chèvre émietté, la menthe ciselée et le fromage râpé. Poivrer.",
       "Verser dans un moule à cake huilé et cuire 45 min. Laisser tiédir avant de couper en tranches ou en dés."], "Française", meal=("Apéritif", "Déjeuner"), serv=6)
    P("Gressins express au parmesan", "Tartes & pizzas", 25, ["four"], ["apéritif", "végétarien", "enfants"],
      ["pate-pizza", "parmesan", ("huile-olive", 1), "herbes-provence"],
      ["Préchauffer le four à 210 °C. Dérouler la pâte à pizza, la badigeonner d'huile d'olive et la parsemer de parmesan râpé et d'herbes de Provence.",
       "Couper la pâte en bandes de 1,5 cm de large, puis torsader chaque bande.", "Poser les gressins sur une plaque et cuire 12 min, jusqu'à ce qu'ils soient dorés et croustillants."], "Italienne", meal=AP, serv=4)
    P("Chips de patate douce au four", "Gratins & four", 40, ["four"], ["apéritif", "végétarien", "enfants"],
      ["patate-douce", ("huile-olive", 1.5), "paprika"],
      ["Préchauffer le four à 150 °C. Éplucher la patate douce et la couper en tranches très fines, à la mandoline si possible.",
       "Les mélanger avec l'huile d'olive, le paprika et une pincée de sel, puis les étaler sans les superposer sur deux plaques.",
       "Cuire 25 à 30 min en les retournant à mi-cuisson : elles doivent être sèches et croustillantes. Les laisser refroidir sur la plaque."], "Américaine", meal=AP, serv=4)
    P("Pois chiches grillés aux épices", "Gratins & four", 40, ["four"], ["apéritif", "végétarien", "économique", "légumineuses"],
      ["pois-chiches", ("huile-olive", 1), "cumin", "paprika"],
      ["Préchauffer le four à 200 °C. Rincer les pois chiches, les égoutter et bien les sécher dans un torchon.",
       "Les mélanger avec l'huile d'olive, le cumin, le paprika et une bonne pincée de sel.",
       "Les étaler sur une plaque et cuire 30 min en remuant deux fois : ils doivent être croquants. Servir tiède ou froid."], "Orientale", meal=AP, serv=4)
    P("Verrines avocat, crevettes et citron vert", "Salades", 15, [], ["apéritif", "fête", "sans cuisson"],
      [("avocat", 2), "crevettes", "citron-vert", "fromage-frais", ("coriandre", 0.5)],
      ["Écraser les avocats à la fourchette avec la moitié du jus de citron vert. Saler, poivrer.",
       "Mélanger le fromage frais avec le reste du jus et le zeste du citron vert.",
       "Dans des verrines, superposer la crème d'avocat, le fromage frais et les crevettes décortiquées. Parsemer de coriandre ciselée et garder au frais jusqu'au service."], "Française", meal=("Apéritif", "Entrée"), serv=4)
    P("Frites de polenta au parmesan", "Gratins & four", 55, ["four", "plaques"], ["apéritif", "végétarien", "enfants"],
      ["polenta", ("parmesan", 1.2), ("huile-olive", 1.5), "herbes-provence"],
      ["Porter 60 cl d'eau salée à ébullition, verser la polenta en pluie et cuire 5 min en remuant. Hors du feu, ajouter la moitié du parmesan râpé.",
       "Étaler la polenta sur 1,5 cm d'épaisseur dans un plat huilé et la laisser prendre 30 min.",
       "Préchauffer le four à 220 °C. Couper la polenta en bâtonnets, les poser sur une plaque, les badigeonner d'huile d'olive et les parsemer d'herbes de Provence.",
       "Cuire 20 min en les retournant à mi-cuisson, puis parsemer du reste de parmesan."], "Italienne", meal=AP, serv=4)
    P("Rillettes de saumon fumé", "Salades", 10, [], ["apéritif", "sans cuisson", "fête"],
      ["saumon-fume", "fromage-frais", ("citron", 0.5), "ciboulette", ("pain", 1.5)],
      ["Couper le saumon fumé en tout petits morceaux.", "L'écraser à la fourchette avec le fromage frais, le jus de citron et la ciboulette ciselée. Poivrer.",
       "Garder 30 min au frais et servir sur du pain grillé."], "Française", meal=AP, serv=4)
    P("Bâtonnets de légumes et dip au fromage frais", "Salades", 15, [], ["apéritif", "végétarien", "sans cuisson", "enfants"],
      ["carotte", "concombre", "radis", ("fromage-frais", 1.5), ("yaourt", 0.5), ("ail", 0.5), "ciboulette"],
      ["Éplucher les carottes et le concombre et les couper en bâtonnets. Laver les radis.",
       "Mélanger le fromage frais avec le yaourt, l'ail haché et la ciboulette ciselée. Saler et poivrer.", "Servir le dip bien frais au milieu des légumes."], "Française", meal=AP, serv=4)
    P("Muhammara, tartinade de poivrons et noix", "Salades", 35, ["four", "mixeur"], ["apéritif", "végétarien"],
      [("poivron", 2), ("noix", 1.5), ("chapelure", 0.5), "cumin", "paprika", ("huile-olive", 1.5), ("citron", 0.5), "pita"],
      ["Préchauffer le four à 220 °C et rôtir les poivrons entiers 25 min en les retournant, jusqu'à ce que la peau noircisse.",
       "Les laisser tiédir dans un saladier couvert, puis les peler et retirer les graines.",
       "Mixer les poivrons avec les noix, la chapelure, le cumin, le paprika, l'huile d'olive et le jus de citron. Saler.",
       "Servir avec les pains pita grillés coupés en triangles."], "Orientale", meal=AP, serv=4)
    P("Nachos maison au cheddar et salsa", "Gratins & four", 25, ["four"], ["apéritif", "végétarien", "fête"],
      ["wrap", ("cheddar", 1.5), "tomate", ("oignon-rouge", 0.5), ("coriandre", 0.5), ("citron-vert", 0.5), ("huile-olive", 1), "paprika"],
      ["Préchauffer le four à 200 °C. Couper les wraps en triangles, les badigeonner d'huile d'olive, saupoudrer de paprika et les cuire 8 min sur une plaque.",
       "Pendant ce temps, préparer la salsa : tomates en petits dés, oignon rouge haché, coriandre ciselée, jus de citron vert et sel.",
       "Parsemer les chips de cheddar râpé et repasser 4 min au four. Servir avec la salsa."], "Mexicaine", meal=AP, serv=4)
    P("Feuilletés chèvre-miel", "Tartes & pizzas", 25, ["four"], ["apéritif", "végétarien", "fête"],
      ["pate-feuilletee", ("chevre", 1.2), "miel", ("noix", 0.5), ("oeufs", 0.25)],
      ["Préchauffer le four à 200 °C. Découper des carrés de 6 cm dans la pâte feuilletée et les poser sur une plaque.",
       "Poser sur chacun une rondelle de chèvre, un filet de miel et un morceau de noix.", "Dorer les bords à l'œuf battu et cuire 15 min. Servir tiède."], "Française", meal=AP, serv=4)
    P("Olives marinées aux herbes et au citron", "Salades", 15, [], ["apéritif", "végétarien", "sans cuisson"],
      [("olives", 4), ("huile-olive", 2), ("citron", 0.5), ("ail", 0.5), "herbes-provence"],
      ["Égoutter les olives.", "Les mélanger avec l'huile d'olive, le zeste et le jus du citron, l'ail en lamelles et les herbes de Provence.",
       "Laisser mariner au moins 1 h au frais, ou toute une nuit, en remuant de temps en temps."], "Provençale", meal=AP, serv=6)
    P("Houmous de betterave", "Salades", 10, ["mixeur"], ["apéritif", "végétarien", "sans cuisson"],
      ["pois-chiches", ("betterave", 0.8), ("ail", 0.5), ("citron", 0.5), "cumin", ("huile-olive", 1.5), "sesame"],
      ["Égoutter et rincer les pois chiches. Couper la betterave cuite en morceaux.",
       "Mixer les pois chiches, la betterave, l'ail, le jus de citron, le cumin et l'huile d'olive jusqu'à obtenir une crème lisse. Saler.",
       "Servir parsemé de graines de sésame, avec des légumes ou du pain."], "Orientale", meal=AP, serv=4)
    P("Tartinade de surimi au fromage frais", "Salades", 10, [], ["apéritif", "sans cuisson", "express"],
      ["surimi", "fromage-frais", ("citron", 0.5), "ciboulette", ("pain", 1.5)],
      ["Couper les bâtonnets de surimi en tout petits morceaux.", "Les mélanger avec le fromage frais, un trait de jus de citron et la ciboulette ciselée. Poivrer.",
       "Servir bien frais sur des toasts de pain grillé."], "Française", meal=AP, serv=4)
    P("Brochettes melon et jambon cru", "Salades", 15, [], ["apéritif", "sans cuisson", "été"],
      ["melon", "jambon-cru", ("menthe", 0.5)],
      ["Couper le melon en deux, retirer les graines et prélever des billes ou des cubes de chair.",
       "Couper les tranches de jambon cru en lanières.", "Piquer sur des brochettes un morceau de melon, une lanière de jambon pliée et une feuille de menthe. Servir très frais."], "Italienne", meal=AP, serv=4)
    P("Pizzettes jambon-mozzarella", "Tartes & pizzas", 25, ["four"], ["apéritif", "enfants", "familial"],
      ["pate-pizza", ("tomate-concassee", 0.4), "mozzarella", ("jambon", 0.8), "herbes-provence"],
      ["Préchauffer le four à 220 °C. Découper des disques de 6 cm dans la pâte à pizza à l'aide d'un verre et les poser sur une plaque.",
       "Les garnir d'une cuillère de tomate concassée, d'un morceau de jambon et d'un dé de mozzarella. Parsemer d'herbes de Provence.",
       "Cuire 10 à 12 min, jusqu'à ce que la pâte soit dorée."], "Italienne", meal=AP, serv=4)
    # ---------- ENTRÉES ----------
    P("Œufs mayonnaise", "Œufs", 15, ["plaques"], ["classique", "bistrot", "économique"],
      ["oeufs", ("mayonnaise", 2), ("salade", 0.5), ("ciboulette", 0.5)],
      ["Plonger les œufs dans l'eau bouillante et les cuire 10 min, puis les refroidir dans l'eau froide et les écaler.",
       "Les couper en deux et les poser sur quelques feuilles de salade.", "Napper de mayonnaise et parsemer de ciboulette ciselée."], "Française", meal=E)
    P("Poireaux vinaigrette", "Salades", 25, ["plaques"], ["classique", "bistrot", "végétarien", "économique"],
      [("poireau", 1.3), "moutarde", "vinaigre", ("huile-olive", 2), ("oeufs", 0.25), ("persil", 0.5)],
      ["Couper les poireaux en tronçons de 10 cm, bien les laver et les cuire 15 min à l'eau bouillante salée. Cuire l'œuf 10 min dans une petite casserole.",
       "Égoutter soigneusement les poireaux et les laisser tiédir. Écaler l'œuf dur.",
       "Fouetter la moutarde avec le vinaigre, saler, poivrer, puis ajouter l'huile d'olive.",
       "Napper les poireaux de vinaigrette, parsemer d'œuf dur écrasé et de persil."], "Française", meal=E)
    P("Céleri rémoulade", "Salades", 15, [], ["classique", "bistrot", "végétarien", "sans cuisson"],
      [("celeri", 3), ("mayonnaise", 3), "moutarde", ("citron", 0.5), ("persil", 0.5)],
      ["Éplucher le céleri-rave et le râper finement. L'arroser aussitôt de jus de citron pour qu'il ne noircisse pas.",
       "Mélanger la mayonnaise et la moutarde, saler et poivrer.", "Enrober le céleri de sauce, parsemer de persil et laisser 30 min au frais avant de servir."], "Française", meal=E, serv=4)
    P("Carpaccio de courgettes au parmesan", "Salades", 15, ["plaques"], ["végétarien", "été", "léger"],
      ["courgette", ("parmesan", 0.6), ("citron", 0.5), ("huile-olive", 1.5), ("basilic", 0.5), ("pignons", 0.5)],
      ["Laver les courgettes et les couper en rubans très fins avec un économe.", "Faire griller les pignons 2 min à sec dans une poêle.",
       "Étaler les rubans dans les assiettes, arroser d'huile d'olive et de jus de citron, saler et poivrer.",
       "Parsemer de copeaux de parmesan, de pignons et de basilic ciselé."], "Italienne", meal=E)
    P("Avocat aux crevettes, sauce cocktail", "Salades", 15, [], ["classique", "fête", "sans cuisson"],
      ["avocat", ("crevettes", 0.75), ("mayonnaise", 2), "ketchup", ("citron", 0.5), ("salade", 0.3)],
      ["Mélanger la mayonnaise avec le ketchup et quelques gouttes de jus de citron : c'est la sauce cocktail.",
       "Couper l'avocat en deux, retirer le noyau et arroser la chair de jus de citron.",
       "Garnir chaque moitié de crevettes décortiquées, napper de sauce et servir sur un lit de salade."], "Française", meal=E)
    P("Tartare de tomates et avocat au basilic", "Salades", 15, [], ["végétarien", "été", "sans cuisson", "léger"],
      ["tomate", "avocat", ("oignon-rouge", 0.3), ("basilic", 0.5), ("citron", 0.5), ("huile-olive", 1)],
      ["Épépiner les tomates et les couper en petits dés, comme l'avocat.",
       "Ajouter l'oignon rouge très finement haché, le basilic ciselé, le jus de citron et l'huile d'olive. Saler, poivrer.",
       "Dresser à l'aide d'un cercle ou d'un verre retourné et servir bien frais."], "Française", meal=E)
    P("Poivrons marinés à l'huile d'olive", "Salades", 40, ["four"], ["végétarien", "été"],
      [("poivron", 2), ("ail", 0.5), ("huile-olive", 2), ("basilic", 0.5), "vinaigre"],
      ["Préchauffer le four à 220 °C et rôtir les poivrons entiers 25 min, jusqu'à ce que la peau noircisse.",
       "Les enfermer 10 min dans un saladier couvert, puis retirer la peau et les graines et les couper en lanières.",
       "Les arroser d'huile d'olive et d'un trait de vinaigre, ajouter l'ail émincé et le basilic. Saler et laisser mariner au frais."], "Italienne", meal=("Entrée", "Apéritif"), serv=4)
    P("Salade de surimi, avocat et maïs", "Salades", 10, [], ["sans cuisson", "express", "été"],
      ["surimi", "avocat", "mais", ("salade", 0.5), ("citron", 0.5), "mayonnaise"],
      ["Couper les bâtonnets de surimi en tronçons et l'avocat en dés arrosés de jus de citron.",
       "Égoutter le maïs et mélanger le tout avec la mayonnaise. Saler, poivrer.", "Servir sur un lit de salade."], "Française", meal=("Entrée", "Déjeuner"))
    P("Salade de carottes à l'orange et à la cannelle", "Salades", 15, [], ["végétarien", "sans cuisson", "hiver"],
      ["carotte", ("orange", 0.5), "cannelle", ("menthe", 0.5), ("huile-olive", 1), ("citron", 0.5)],
      ["Éplucher les carottes et les râper finement.", "Peler l'orange à vif et la couper en petits morceaux en récupérant le jus.",
       "Mélanger les carottes avec l'orange, son jus, le jus de citron, l'huile d'olive et la cannelle. Saler légèrement.",
       "Parsemer de menthe ciselée et servir frais."], "Marocaine", meal=E)
    return R
