# -*- coding: utf-8 -*-
"""Recettes, lot 6 : four et gratins, tartes et pizzas, desserts et goûters, quelques soupes, salades et brunchs (plats connus, écrits à la main)."""
from gen_hand1 import H

D = ("Dessert", "Goûter")
B = ("Petit-déjeuner",)
AP = ("Apéritif",)


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- four et gratins ----------
    P("Lasagnes végétariennes aux légumes du soleil", "Gratins & four", 75, ["four", "plaques"], ["végétarien", "familial"],
      [("lasagnes", 1.25), "courgette", "aubergine", ("poivron", 1.5), ("tomate-concassee", 1.5), ("bechamel", 2), "mozzarella", ("parmesan", 1), ("ail", 1), ("huile-olive", 1)],
      ["Couper la courgette, l'aubergine et le poivron en petits dés, les faire revenir 10 min dans l'huile d'olive avec l'ail.", "Ajouter la tomate concassée et laisser mijoter 10 min.",
       "Préchauffer le four à 180 °C. Alterner dans un plat sauce aux légumes, pâtes à lasagnes et béchamel, sur trois couches.", "Finir par la béchamel, la mozzarella en tranches et le parmesan. Cuire 35 min."], "Italienne", serv=4, diff="Intermédiaire")
    P("Gratin d'endives au fromage bleu et aux noix", "Gratins & four", 40, ["four", "plaques"], ["végétarien", "hiver"],
      [("endives", 2), ("fromage-bleu", 1), ("creme", 1), ("noix", 0.5), ("beurre", 0.5)],
      ["Couper les endives en deux dans la longueur et les faire dorer 10 min dans le beurre, à couvert.", "Préchauffer le four à 200 °C et les disposer dans un plat.",
       "Faire fondre le fromage bleu dans la crème et napper les endives.", "Parsemer de noix concassées et gratiner 15 min."])
    P("Pommes de terre farcies jambon-fromage", "Gratins & four", 70, ["four"], ["familial"],
      [("pomme-de-terre", 1.2), ("jambon", 1), ("creme", 0.5), ("emmental", 0.8), "ciboulette"],
      ["Préchauffer le four à 200 °C. Cuire les grosses pommes de terre entières 45 min au four.", "Les couper en deux et creuser la chair sans percer la peau.",
       "Écraser la chair avec la crème, le jambon en dés, la ciboulette, sel et poivre. Remplir les pommes de terre.", "Couvrir d'emmental râpé et gratiner 10 min."])
    P("Poulet tandoori au four", "Gratins & four", 55, ["four"], ["épicé", "indien"],
      [("poulet", 3), ("yaourt", 1), ("paprika", 2), ("garam-masala", 1.5), "curcuma", ("ail", 1.5), "gingembre", "citron", ("riz", 2), "coriandre"],
      ["Inciser les morceaux de poulet. Mélanger le yaourt, le paprika, le garam masala, le curcuma, l'ail et le gingembre râpés et le jus du citron.",
       "Enrober le poulet de cette marinade et laisser au frais au moins 1 h (idéalement une nuit).", "Préchauffer le four à 220 °C et cuire 35 min en retournant à mi-cuisson.", "Servir avec le riz et la coriandre."], "Indienne", serv=4)
    P("Clafoutis salé aux tomates cerises et chèvre", "Gratins & four", 45, ["four"], ["végétarien", "été"],
      [("tomate-cerise", 1.5), ("chevre", 1.2), ("oeufs", 0.75), ("farine", 0.5), ("lait", 1.25), "creme", "basilic"],
      ["Préchauffer le four à 180 °C. Fouetter les œufs avec la farine, puis le lait et la crème. Saler, poivrer.", "Disposer les tomates cerises et le chèvre en morceaux dans un plat beurré.",
       "Verser l'appareil et parsemer de basilic.", "Cuire 35 min jusqu'à ce que le clafoutis soit doré et pris."], serv=4)
    P("Patates douces farcies au chili", "Gratins & four", 60, ["four", "plaques"], ["familial"],
      [("patate-douce", 1.5), ("boeuf-hache", 0.8), ("haricots-rouges", 0.5), ("tomate-concassee", 0.5), "oignon", "cumin", "paprika", ("cheddar", 0.6), ("creme", 0.5)],
      ["Préchauffer le four à 200 °C. Cuire les patates douces entières 45 min.", "Faire revenir l'oignon et le bœuf haché, ajouter le cumin, le paprika, la tomate concassée et les haricots rouges, laisser mijoter 15 min.",
       "Ouvrir les patates douces et écraser un peu la chair.", "Garnir de chili et de cheddar, repasser 5 min au four et servir avec la crème."], "Américaine")
    P("Pommes de terre Hasselback", "Gratins & four", 60, ["four"], ["végétarien"],
      [("pomme-de-terre", 1.2), ("beurre", 2), ("ail", 1), "herbes-provence", ("parmesan", 0.5)],
      ["Préchauffer le four à 210 °C. Entailler les pommes de terre en fines tranches sans les couper jusqu'en bas (les poser entre deux baguettes aide).",
       "Faire fondre le beurre avec l'ail écrasé et les herbes de Provence, en badigeonner les pommes de terre.", "Cuire 50 min en les arrosant deux fois de beurre.", "Parsemer de parmesan 5 min avant la fin."], "Suédoise")
    P("Légumes rôtis au four et houmous", "Gratins & four", 45, ["four"], ["végétarien", "économique"],
      [("carotte", 1), ("patate-douce", 0.6), "oignon-rouge", ("pois-chiches", 0.8), ("huile-olive", 1.5), "cumin", ("houmous", 1.5), "persil"],
      ["Préchauffer le four à 210 °C. Couper la carotte, la patate douce et l'oignon rouge en morceaux.", "Les mélanger avec les pois chiches égouttés, l'huile d'olive, le cumin et le sel.",
       "Rôtir 35 min en remuant à mi-cuisson.", "Étaler le houmous dans les assiettes, ajouter les légumes et le persil."], "Orientale")
    P("Shepherd's pie à l'agneau", "Gratins & four", 75, ["four", "plaques"], ["familial", "hiver"],
      [("agneau", 1.5), ("pomme-de-terre", 2), "carotte", "oignon", ("petits-pois", 1), ("bouillon", 0.6), ("tomate-concassee", 0.25), ("farine", 0.15), ("beurre", 2), ("lait", 0.75), ("cheddar", 0.6)],
      ["Cuire les pommes de terre 20 min à l'eau, les écraser en purée avec le beurre et le lait.", "Faire revenir l'oignon et la carotte en dés, ajouter l'agneau haché et le faire dorer.",
       "Saupoudrer de farine, ajouter la tomate concassée et le bouillon, cuire 10 min puis ajouter les petits pois.", "Verser dans un plat, couvrir de purée et de cheddar râpé. Cuire 25 min à 200 °C."], "Anglaise", serv=4)
    P("Potimarron rôti au parmesan et aux noisettes", "Gratins & four", 40, ["four"], ["végétarien", "automne"],
      [("potimarron", 1), ("huile-olive", 1), ("parmesan", 1), ("noisettes", 0.75), "herbes-provence", "salade"],
      ["Préchauffer le four à 200 °C. Couper le potimarron en quartiers sans l'éplucher et retirer les graines.", "Badigeonner d'huile d'olive, saler et parsemer d'herbes de Provence.",
       "Rôtir 30 min, ajouter le parmesan et les noisettes concassées et cuire encore 5 min.", "Servir avec la salade."])
    P("Pommes de terre au four, lardons et cheddar", "Gratins & four", 60, ["four", "plaques"], ["familial", "réconfort"],
      [("pomme-de-terre", 1.2), "lardons", ("cheddar", 0.8), ("creme", 0.8), "ciboulette"],
      ["Préchauffer le four à 200 °C. Cuire les grosses pommes de terre entières 50 min.", "Faire dorer les lardons à la poêle.",
       "Entailler les pommes de terre en croix et les ouvrir, garnir de lardons et de cheddar, repasser 5 min au four.", "Servir avec une cuillère de crème et la ciboulette."], "Américaine")
    P("Pain de viande", "Gratins & four", 70, ["four"], ["familial"],
      [("boeuf-hache", 2.4), ("oeufs", 0.5), ("chapelure", 1), ("lait", 0.5), "oignon", ("ail", 1), ("ketchup", 3), ("moutarde", 1), "herbes-provence"],
      ["Préchauffer le four à 180 °C. Mélanger le bœuf haché, les œufs, la chapelure trempée dans le lait, l'oignon et l'ail hachés, les herbes de Provence, sel et poivre.",
       "Former un pain dans un moule à cake.", "Mélanger le ketchup et la moutarde et en napper le dessus.", "Cuire 50 min et laisser reposer 10 min avant de trancher."], "Américaine", serv=4)
    P("Raclette au four", "Gratins & four", 45, ["four"], ["hiver", "réconfort"],
      [("pomme-de-terre", 1.2), ("raclette", 1.25), ("jambon", 1), ("jambon-cru", 1), "cornichons", "salade"],
      ["Cuire les pommes de terre 20 min à l'eau, les couper en deux.", "Préchauffer le four à 220 °C. Les disposer dans un plat et les couvrir du fromage à raclette en tranches.",
       "Gratiner 10 min jusqu'à ce que le fromage coule.", "Servir avec le jambon, le jambon cru, les cornichons et la salade."], "Savoyarde")
    P("Saumon en croûte feuilletée aux épinards", "Gratins & four", 55, ["four", "plaques"], ["poisson", "fête"],
      ["pate-feuilletee", ("saumon", 2.4), ("epinards", 1.5), ("fromage-frais", 1), "citron", ("oeufs", 0.25), "aneth"],
      ["Préchauffer le four à 200 °C. Faire tomber les épinards, bien les presser, puis les mélanger avec le fromage frais, l'aneth et le zeste du citron.",
       "Poser le saumon sur la moitié de la pâte feuilletée, le couvrir de la farce aux épinards.", "Refermer la pâte, souder les bords et dorer à l'œuf battu. Faire quelques entailles.",
       "Cuire 30 min et laisser reposer 5 min avant de trancher."], serv=4, diff="Intermédiaire")
    P("Filet mignon en croûte", "Gratins & four", 70, ["four", "plaques"], ["fête", "week-end"],
      [("porc", 2), "pate-feuilletee", ("champignons", 1), "oignon", ("jambon-cru", 1), ("moutarde", 1), ("oeufs", 0.25), ("huile-olive", 0.5)],
      ["Saisir le filet mignon de tous côtés dans l'huile d'olive, le laisser refroidir puis le badigeonner de moutarde.", "Faire revenir les champignons hachés avec l'oignon jusqu'à évaporation de l'eau.",
       "Préchauffer le four à 200 °C. Étaler la pâte feuilletée, y poser le jambon cru, les champignons puis le filet. Envelopper et dorer à l'œuf.",
       "Cuire 30 min et laisser reposer 10 min avant de trancher."], serv=4, diff="Intermédiaire")
    P("Cuisses de poulet au miel et à la moutarde", "Gratins & four", 55, ["four"], ["familial"],
      [("poulet", 3), ("miel", 3), ("moutarde", 3), ("pomme-de-terre", 2), ("ail", 1), "herbes-provence", ("huile-olive", 1)],
      ["Préchauffer le four à 200 °C. Mélanger le miel, la moutarde et l'ail écrasé.", "Couper les pommes de terre en quartiers, les mélanger avec l'huile d'olive et les herbes de Provence.",
       "Disposer le poulet sur les pommes de terre et le badigeonner de sauce.", "Cuire 45 min en arrosant le poulet de son jus à mi-cuisson."], serv=4)
    P("Parmentier de canard", "Gratins & four", 60, ["four", "plaques"], ["hiver", "fête"],
      [("canard", 1.5), ("pomme-de-terre", 2), ("beurre", 2), ("lait", 1), "oignon", ("ail", 1), ("chapelure", 0.4), "persil"],
      ["Cuire les pommes de terre 20 min et les écraser en purée avec le beurre et le lait.", "Effilocher la viande de canard (cuisses confites ou rôties) et la faire revenir avec l'oignon, l'ail et le persil.",
       "Préchauffer le four à 200 °C. Mettre le canard dans un plat et le couvrir de purée.", "Parsemer de chapelure et gratiner 20 min."], "Sud-Ouest", serv=4)
    P("Gratin de potimarron à la crème", "Gratins & four", 50, ["four"], ["végétarien", "automne"],
      [("potimarron", 1.5), ("creme", 2.5), ("ail", 1), ("fromage-rape", 1)],
      ["Préchauffer le four à 190 °C. Couper le potimarron en fines tranches sans l'éplucher.", "Les disposer dans un plat frotté à l'ail.",
       "Verser la crème salée et poivrée, couvrir de fromage râpé.", "Cuire 40 min jusqu'à ce que le potimarron soit tendre."], serv=4)
    P("Gratin de polenta à la tomate et mozzarella", "Gratins & four", 50, ["four", "plaques"], ["végétarien", "économique"],
      [("polenta", 1.3), ("bouillon", 1.6), ("tomate-concassee", 1), "mozzarella", ("parmesan", 1), "basilic", ("ail", 1)],
      ["Porter le bouillon à ébullition, verser la polenta en pluie et cuire en remuant selon le paquet. Ajouter la moitié du parmesan.", "L'étaler dans un plat et laisser prendre 15 min.",
       "Préchauffer le four à 200 °C. Couper la polenta en carrés, napper de tomate concassée cuite 10 min avec l'ail.", "Ajouter la mozzarella, le reste de parmesan et gratiner 20 min. Servir avec le basilic."], "Italienne", serv=4)
    P("Rôti de bœuf et pommes de terre rôties", "Gratins & four", 70, ["four"], ["fête", "week-end", "classique"],
      [("boeuf", 3), ("pomme-de-terre", 2), ("ail", 2), "herbes-provence", ("beurre", 1), ("huile-olive", 1), "moutarde"],
      ["Sortir le rôti du réfrigérateur 1 h avant. Préchauffer le four à 220 °C.", "Couper les pommes de terre en quartiers, les mélanger avec l'huile d'olive, l'ail en chemise et les herbes de Provence, rôtir 20 min.",
       "Badigeonner le rôti de bœuf de beurre, le poser au milieu et cuire 15 min par 500 g pour une viande rosée.", "Laisser reposer 10 min sous une feuille d'aluminium et servir avec la moutarde."], serv=4)
    P("Travers de porc laqués au miel", "Gratins & four", 120, ["four"], ["week-end", "barbecue"],
      [("porc", 4), ("miel", 4), ("sauce-soja", 3), ("ketchup", 2), ("ail", 1.5), "paprika"],
      ["Préchauffer le four à 150 °C. Mélanger le miel, la sauce soja, le ketchup, l'ail écrasé et le paprika.", "Badigeonner les travers de porc et les envelopper dans du papier aluminium.",
       "Cuire 1 h 30.", "Ouvrir, badigeonner à nouveau de sauce et faire caraméliser 20 min à 220 °C."], "Américaine", serv=4)
    P("Plaque de saucisses, pommes de terre et oignons rôtis", "Gratins & four", 50, ["four"], ["familial", "économique"],
      [("saucisses", 2), ("pomme-de-terre", 2), ("oignon-rouge", 2), "poivron", ("huile-olive", 1), "herbes-provence", "moutarde"],
      ["Préchauffer le four à 210 °C. Couper les pommes de terre en quartiers, l'oignon rouge et le poivron en morceaux.", "Les mélanger sur une plaque avec l'huile d'olive, les herbes de Provence, sel et poivre.",
       "Ajouter les saucisses et cuire 40 min en remuant à mi-cuisson.", "Servir avec la moutarde."], "Anglaise", serv=4)
    P("Chou-fleur rôti entier, sauce yaourt", "Gratins & four", 60, ["four"], ["végétarien"],
      [("chou-fleur", 2.5), ("huile-olive", 1.5), "curcuma", "cumin", "paprika", ("yaourt", 1), "citron", ("ail", 0.5), "persil"],
      ["Préchauffer le four à 200 °C. Cuire le chou-fleur entier 8 min à l'eau bouillante salée et l'égoutter.", "Le badigeonner d'huile d'olive mélangée au curcuma, au cumin et au paprika.",
       "Rôtir 45 min jusqu'à ce qu'il soit bien doré.", "Servir avec le yaourt mélangé à l'ail, au jus du citron et au persil."], "Orientale", serv=4)
    P("Flan de courgettes", "Gratins & four", 50, ["four", "plaques"], ["végétarien", "été", "léger"],
      [("courgette", 2), ("oeufs", 0.75), ("creme", 2), ("fromage-rape", 1), ("ail", 0.5), "basilic"],
      ["Couper les courgettes en rondelles et les faire revenir 10 min avec l'ail.", "Préchauffer le four à 180 °C. Battre les œufs avec la crème, le fromage râpé et le basilic.",
       "Mélanger avec les courgettes et verser dans un moule beurré.", "Cuire 30 min au bain-marie."], serv=4)
    P("Soufflé au fromage", "Gratins & four", 50, ["four", "plaques"], ["végétarien", "classique"],
      [("beurre", 2.5), ("farine", 0.42), ("lait", 1.25), ("oeufs", 1), ("emmental", 1.25)],
      ["Préchauffer le four à 200 °C. Beurrer un moule à soufflé.", "Faire une béchamel épaisse : faire fondre le beurre, ajouter la farine puis le lait en fouettant. Cuire 2 min.",
       "Hors du feu, ajouter les jaunes d'œufs et l'emmental râpé. Saler et poivrer.", "Monter les blancs en neige ferme et les incorporer délicatement.",
       "Verser dans le moule et cuire 25 min sans ouvrir le four. Servir aussitôt."], serv=4, diff="Intermédiaire")
    P("Tomates provençales", "Gratins & four", 40, ["four"], ["végétarien", "été"],
      [("tomate", 2.5), ("ail", 2), ("persil", 2), ("chapelure", 0.6), ("huile-olive", 1.5), "herbes-provence"],
      ["Préchauffer le four à 200 °C. Couper les tomates en deux et les poser dans un plat, face coupée vers le haut.", "Mélanger l'ail et le persil hachés avec la chapelure et les herbes de Provence.",
       "Garnir les tomates, arroser d'huile d'olive.", "Cuire 30 min jusqu'à ce qu'elles soient fondantes et gratinées."], "Provençale", serv=4)
    P("Gnocchis à la romaine", "Gratins & four", 60, ["four", "plaques"], ["végétarien", "classique"],
      [("semoule", 1.25), ("lait", 5), ("beurre", 2.5), ("parmesan", 2), ("oeufs", 0.5)],
      ["Porter le lait à ébullition avec du sel, verser la semoule en pluie et cuire 5 min en remuant.", "Hors du feu, ajouter les jaunes d'œufs, la moitié du beurre et la moitié du parmesan.",
       "Étaler sur 1,5 cm d'épaisseur et laisser refroidir. Découper des disques.", "Les disposer dans un plat beurré, arroser du reste de beurre fondu, parsemer de parmesan et gratiner 20 min à 200 °C."], "Italienne", serv=4)
    P("Poulet à la parmigiana", "Gratins & four", 50, ["four", "plaques"], ["familial"],
      [("poulet", 2.4), ("chapelure", 1.5), ("oeufs", 0.25), ("farine", 0.3), "tomate-concassee", ("mozzarella", 1.5), ("parmesan", 1), "basilic", ("huile-olive", 1)],
      ["Aplatir les filets de poulet, les passer dans la farine, l'œuf battu puis la chapelure.", "Les faire dorer 3 min par face dans l'huile d'olive.",
       "Préchauffer le four à 200 °C. Disposer le poulet dans un plat, napper de tomate concassée assaisonnée.", "Couvrir de mozzarella et de parmesan, cuire 20 min. Servir avec le basilic."], "Italienne", serv=4)
    # ---------- tartes et pizzas ----------
    P("Tarte flambée", "Tartes & pizzas", 30, ["four"], ["alsacienne"],
      ["pate-pizza", ("fromage-frais", 1.5), ("creme", 1), "oignon", "lardons"],
      ["Préchauffer le four au maximum (250 °C). Étaler la pâte très finement.", "Mélanger le fromage frais et la crème, saler, poivrer et étaler sur la pâte.",
       "Parsemer d'oignon émincé très finement et de lardons.", "Cuire 10 à 12 min jusqu'à ce que les bords soient bien dorés."], "Alsacienne")
    P("Calzone jambon-mozzarella", "Tartes & pizzas", 35, ["four"], ["familial"],
      ["pate-pizza", ("jambon", 1), "mozzarella", ("champignons", 0.6), ("tomate-concassee", 0.4), ("oeufs", 0.25), "herbes-provence"],
      ["Préchauffer le four à 230 °C. Étaler la pâte à pizza en cercle.", "Sur une moitié, étaler la tomate concassée, puis le jambon, les champignons émincés, la mozzarella et les herbes de Provence.",
       "Replier la pâte et souder les bords en les pinçant. Dorer à l'œuf battu.", "Cuire 18 min."], "Italienne")
    P("Pissaladière", "Tartes & pizzas", 70, ["four", "plaques"], ["végétarien", "apéritif"],
      ["pate-pizza", ("oignon", 4), ("olives", 1), ("huile-olive", 1.5), "herbes-provence"],
      ["Émincer les oignons et les faire fondre 40 min à feu doux dans l'huile d'olive avec les herbes de Provence, sans les colorer.", "Préchauffer le four à 220 °C. Étaler la pâte sur une plaque.",
       "Couvrir des oignons confits et disposer les olives.", "Cuire 20 min. Servir tiède."], "Niçoise", serv=4)
    P("Quiche aux asperges et au parmesan", "Tartes & pizzas", 55, ["four", "plaques"], ["printemps"],
      ["pate-brisee", ("asperges", 1.5), ("oeufs", 0.75), ("creme", 2), ("lait", 0.75), ("parmesan", 1)],
      ["Préchauffer le four à 180 °C. Cuire les asperges 6 min à l'eau bouillante, les couper en tronçons en gardant les pointes.", "Foncer un moule avec la pâte brisée.",
       "Battre les œufs avec la crème, le lait et le parmesan, saler, poivrer.", "Disposer les asperges, verser l'appareil et cuire 35 min."], serv=4)
    P("Tourte au bœuf et aux pommes de terre", "Tartes & pizzas", 75, ["four", "plaques"], ["familial", "hiver"],
      [("pate-brisee", 2), ("boeuf-hache", 1.6), ("pomme-de-terre", 0.8), "oignon", ("carotte", 0.5), ("bouillon", 0.2), ("oeufs", 0.25), "herbes-provence"],
      ["Faire revenir l'oignon et la carotte en petits dés, ajouter le bœuf haché et le faire dorer.", "Ajouter les pommes de terre en petits dés, le bouillon et les herbes de Provence, cuire 10 min.",
       "Préchauffer le four à 190 °C. Foncer un moule avec une pâte brisée, garnir, couvrir de la seconde pâte et souder les bords.", "Dorer à l'œuf, faire une cheminée et cuire 40 min."], "Anglaise", serv=4)
    P("Focaccia express aux tomates cerises", "Tartes & pizzas", 35, ["four"], ["végétarien", "apéritif"],
      ["pate-pizza", "tomate-cerise", ("olives", 1), ("huile-olive", 2), "herbes-provence", "sel"],
      ["Préchauffer le four à 220 °C. Étaler la pâte à pizza sur 1,5 cm d'épaisseur dans un plat huilé.", "Creuser des trous avec les doigts et arroser généreusement d'huile d'olive.",
       "Enfoncer les tomates cerises et les olives, parsemer d'herbes de Provence et de gros sel.", "Cuire 20 min jusqu'à ce que la focaccia soit dorée."], "Italienne", meal=AP + ("Déjeuner",), serv=4)
    P("Spanakopita, feuilleté épinards-feta", "Tartes & pizzas", 60, ["four", "plaques"], ["végétarien"],
      [("pate-feuilletee", 2), ("epinards", 2.5), ("feta", 2), ("oeufs", 0.5), "oignon-nouveau", "aneth"],
      ["Faire tomber les épinards et l'oignon nouveau émincé, bien les presser.", "Mélanger avec la feta émiettée, les œufs battus (en garder un peu) et l'aneth.",
       "Préchauffer le four à 190 °C. Foncer un moule avec une pâte feuilletée, garnir et couvrir de la seconde pâte.", "Dorer avec le reste d'œuf, inciser le dessus et cuire 35 min."], "Grecque", serv=4)
    P("Tarte au potimarron et au chèvre", "Tartes & pizzas", 60, ["four", "plaques"], ["végétarien", "automne"],
      ["pate-brisee", ("potimarron", 1), ("chevre", 1), ("oeufs", 0.75), ("creme", 1.5), "oignon"],
      ["Couper le potimarron en dés et le cuire 15 min à la vapeur avec l'oignon.", "Préchauffer le four à 180 °C et foncer un moule avec la pâte brisée.",
       "Écraser le potimarron avec les œufs et la crème, saler et poivrer.", "Verser sur la pâte, ajouter le chèvre en rondelles et cuire 35 min."], serv=4)
    P("Pâté lorrain", "Tartes & pizzas", 80, ["four"], ["fête", "classique"],
      [("pate-feuilletee", 2), ("porc", 1.4), ("veau", 1), ("vin-blanc", 1.5), "oignon", ("ail", 1), "persil", ("oeufs", 0.25)],
      ["La veille, couper le porc et le veau en petits morceaux et les mariner avec le vin blanc, l'oignon et l'ail hachés et le persil.", "Préchauffer le four à 200 °C. Égoutter la viande.",
       "La disposer sur une pâte feuilletée en laissant une bordure, couvrir de la seconde pâte et souder.", "Dorer à l'œuf battu, faire une cheminée et cuire 45 min."], "Lorraine", serv=6, diff="Intermédiaire")
    P("Pizza capricciosa", "Tartes & pizzas", 30, ["four"], ["familial"],
      ["pate-pizza", ("tomate-concassee", 0.4), ("jambon", 0.8), ("champignons", 0.5), ("artichaut", 0.6), ("olives", 0.6), "mozzarella", "herbes-provence"],
      ["Préchauffer le four à 250 °C. Étaler la pâte et la couvrir de tomate concassée.", "Ajouter le jambon, les champignons émincés, les cœurs d'artichaut en quartiers et les olives.",
       "Parsemer de mozzarella et d'herbes de Provence.", "Cuire 12 min."], "Italienne")
    P("Lahmacun, pizza turque à la viande", "Tartes & pizzas", 35, ["four"], ["épicé"],
      ["pate-pizza", ("boeuf-hache", 0.8), "oignon", ("poivron", 0.5), ("tomate", 0.5), "persil", "cumin", "paprika", "citron", "salade"],
      ["Préchauffer le four au maximum. Hacher finement l'oignon, le poivron, la tomate et la moitié du persil.", "Les mélanger avec le bœuf haché, le cumin, le paprika, sel et poivre.",
       "Étaler la pâte très finement en deux galettes, les couvrir d'une fine couche de viande.", "Cuire 8 à 10 min. Servir avec la salade, le reste de persil et un trait de jus de citron, puis rouler."], "Turque")
    P("Tarte poire, fromage bleu et noix", "Tartes & pizzas", 45, ["four"], ["végétarien", "automne"],
      ["pate-feuilletee", "poire", ("fromage-bleu", 1.2), ("noix", 0.75), ("oeufs", 0.5), ("creme", 1.5)],
      ["Préchauffer le four à 190 °C. Foncer un moule avec la pâte feuilletée.", "Battre les œufs avec la crème, poivrer.",
       "Disposer la poire en lamelles et le fromage bleu émietté, verser la crème.", "Parsemer de noix et cuire 30 min."], serv=4)
    P("Tarte soleil au pesto", "Tartes & pizzas", 35, ["four"], ["végétarien", "fête"],
      [("pate-feuilletee", 2), ("pesto", 2), ("parmesan", 0.5), ("oeufs", 0.25)],
      ["Préchauffer le four à 200 °C. Étaler une pâte feuilletée, la tartiner de pesto et la parsemer de parmesan.", "Couvrir de la seconde pâte. Poser un verre au centre.",
       "Découper 16 rayons autour du verre et torsader chacun deux fois.", "Dorer à l'œuf battu et cuire 20 min. Servir tiède à partager."], "Italienne", meal=AP, serv=6)
    P("Empanadas au bœuf", "Tartes & pizzas", 60, ["four", "plaques"], ["familial", "pique-nique"],
      [("pate-brisee", 2), ("boeuf-hache", 1.2), "oignon", ("poivron", 0.5), ("olives", 0.6), ("oeufs", 0.5), "cumin", "paprika"],
      ["Faire revenir l'oignon et le poivron en petits dés, ajouter le bœuf haché, le cumin et le paprika, cuire 8 min. Ajouter les olives hachées.", "Cuire un œuf 10 min et le hacher, l'ajouter à la farce.",
       "Préchauffer le four à 200 °C. Découper des disques dans la pâte brisée, garnir, replier en chaussons et souder les bords.", "Dorer à l'œuf battu et cuire 20 min."], "Argentine", meal=("Déjeuner", "Dîner", "Apéritif"), serv=4)
    P("Pizza hawaïenne", "Tartes & pizzas", 25, ["four"], ["familial", "enfants"],
      ["pate-pizza", ("tomate-concassee", 0.4), ("jambon", 1), ("ananas", 0.3), "mozzarella"],
      ["Préchauffer le four à 250 °C. Étaler la pâte et la couvrir de tomate concassée.", "Ajouter le jambon, l'ananas en petits morceaux et la mozzarella.", "Cuire 12 min."], "Américaine")
    P("Roulés feuilletés jambon-fromage", "Tartes & pizzas", 30, ["four"], ["apéritif", "enfants"],
      ["pate-feuilletee", ("jambon", 1), ("emmental", 1), ("moutarde", 0.5)],
      ["Préchauffer le four à 200 °C. Étaler la pâte feuilletée et la badigeonner de moutarde.", "Couvrir de jambon et d'emmental râpé.",
       "Rouler serré, mettre 15 min au frais puis couper en tranches de 1 cm.", "Cuire 15 min sur une plaque."], meal=AP, serv=4)
    # ---------- soupes, salades, sandwichs, œufs ----------
    P("Soupe à l'oignon gratinée", "Soupes", 60, ["plaques", "four"], ["hiver", "classique"],
      [("oignon", 5), ("beurre", 2), ("farine", 0.15), ("vin-blanc", 1), ("bouillon", 2.4), "pain", ("emmental", 1.25)],
      ["Émincer les oignons et les faire dorer doucement 25 min dans le beurre.", "Saupoudrer de farine, mélanger, puis verser le vin blanc et le bouillon. Laisser cuire 20 min.",
       "Verser dans des bols allant au four, poser une tranche de pain grillé et couvrir d'emmental râpé.", "Gratiner 5 min sous le gril."], serv=4)
    P("Bortsch", "Soupes", 75, ["plaques"], ["hiver"],
      [("betterave", 2), ("chou", 1), ("pomme-de-terre", 0.6), ("carotte", 0.5), "oignon", ("boeuf", 1), ("tomate-concassee", 0.5), ("vinaigre", 1), ("bouillon", 3), ("creme", 1), "aneth"],
      ["Faire cuire le bœuf en morceaux 30 min dans le bouillon.", "Faire revenir l'oignon, la carotte et la betterave râpées 8 min, ajouter la tomate concassée et le vinaigre.",
       "Ajouter ces légumes au bouillon avec les pommes de terre en dés et le chou émincé, cuire 30 min.", "Servir avec une cuillère de crème et l'aneth."], "Ukrainienne", serv=4)
    P("Soupe au pistou", "Soupes", 50, ["plaques"], ["végétarien", "été"],
      [("haricots-blancs", 1), ("haricots-verts", 1), "courgette", ("carotte", 0.6), ("pomme-de-terre", 0.6), "tomate", ("pates", 0.4), ("pesto", 2), ("parmesan", 1)],
      ["Couper la courgette, les carottes, les pommes de terre, la tomate et les haricots verts en petits dés.", "Les mettre dans 1,5 litre d'eau salée avec les haricots blancs égouttés et cuire 25 min.",
       "Ajouter les petites pâtes et cuire 10 min.", "Hors du feu, ajouter le pesto (le pistou). Servir avec le parmesan."], "Provençale", serv=4)
    P("Avgolemono, soupe grecque au poulet et citron", "Soupes", 40, ["plaques"], ["réconfort"],
      [("poulet", 1.2), ("riz", 0.6), ("oeufs", 0.5), ("citron", 2), ("bouillon", 3), "aneth"],
      ["Pocher le poulet 15 min dans le bouillon, le retirer et l'effilocher.", "Cuire le riz 15 min dans le bouillon.",
       "Battre les œufs avec le jus des citrons, puis y verser lentement une louche de bouillon chaud en fouettant.", "Verser le mélange dans la soupe hors du feu en remuant, ajouter le poulet et l'aneth."], "Grecque", serv=4)
    P("Fattoush", "Salades", 15, [], ["végétarien", "froid", "été"],
      ["pita", "tomate", "concombre", ("radis", 0.6), ("salade", 0.6), "menthe", "persil", "citron", ("huile-olive", 1.5), "oignon-nouveau"],
      ["Couper le pain pita en morceaux et le faire griller au four ou à la poêle.", "Couper la tomate, le concombre et les radis en morceaux, émincer la salade et l'oignon nouveau.",
       "Assaisonner avec le jus du citron, l'huile d'olive, la menthe et le persil ciselés.", "Ajouter le pain grillé juste avant de servir."], "Libanaise")
    P("Panzanella", "Salades", 20, [], ["végétarien", "froid", "été", "économique"],
      [("pain", 1.5), ("tomate", 2), ("concombre", 0.5), ("oignon-rouge", 0.5), "basilic", ("huile-olive", 2), ("vinaigre", 1)],
      ["Couper le pain rassis en cubes.", "Couper les tomates en morceaux, les saler et les laisser rendre leur jus 10 min.",
       "Ajouter le pain, le concombre, l'oignon rouge émincé, le basilic, l'huile d'olive et le vinaigre.", "Laisser reposer 15 min pour que le pain s'imbibe."], "Italienne")
    P("Salade piémontaise", "Salades", 35, ["plaques"], ["froid", "familial"],
      [("pomme-de-terre", 1.2), ("oeufs", 0.75), "tomate", ("cornichons", 1), ("jambon", 1), ("mayonnaise", 3), ("moutarde", 0.5), "persil"],
      ["Cuire les pommes de terre 20 min et les œufs 10 min. Laisser refroidir.", "Couper les pommes de terre, les œufs, la tomate, le jambon et les cornichons en dés.",
       "Mélanger la mayonnaise avec la moutarde.", "Mélanger le tout et parsemer de persil."], serv=4)
    P("Bánh mì au porc", "Sandwichs", 35, ["plaques"], ["asiatique"],
      [("pain", 1.2), ("porc", 0.8), "carotte", ("concombre", 0.5), ("vinaigre", 2), ("sucre", 0.15), "coriandre", ("mayonnaise", 1), ("sauce-soja", 1), ("ail", 0.5)],
      ["Râper la carotte et la mariner 15 min dans le vinaigre avec le sucre et un peu de sel.", "Couper le porc en fines lanières, le mariner avec la sauce soja et l'ail, puis le saisir 5 min.",
       "Ouvrir les baguettes et les tartiner de mayonnaise.", "Garnir de porc, de carotte marinée, de concombre en bâtonnets et de coriandre."], "Vietnamienne")
    P("Sloppy joe", "Sandwichs", 25, ["plaques"], ["familial", "enfants"],
      [("pain", 1), ("boeuf-hache", 1), "oignon", ("poivron", 0.5), ("ketchup", 3), ("moutarde", 0.5), ("tomate-concassee", 0.3), ("cheddar", 0.5)],
      ["Faire revenir l'oignon et le poivron en petits dés, ajouter le bœuf haché et le faire dorer.", "Ajouter le ketchup, la moutarde et la tomate concassée, laisser mijoter 10 min.",
       "Toaster les pains à burger.", "Garnir généreusement de viande et de cheddar."], "Américaine")
    P("Scotch eggs au four", "Œufs", 50, ["four", "plaques"], ["pique-nique"],
      [("oeufs", 1.5), ("saucisses", 1.4), ("farine", 0.3), ("chapelure", 1.5), "herbes-provence"],
      ["Cuire 4 œufs 6 min, les rafraîchir et les écaler.", "Retirer la peau des saucisses, mélanger la chair avec les herbes de Provence et l'étaler en 4 galettes.",
       "Envelopper chaque œuf de chair à saucisse, les passer dans la farine, le dernier œuf battu puis la chapelure.", "Cuire 25 min à 200 °C sur une plaque, en les retournant à mi-cuisson."], "Anglaise", serv=4)
    P("Scones", "Petit-déjeuner", 30, ["four"], ["végétarien", "goûter", "brunch"],
      [("farine", 2.08), ("beurre", 3), ("lait", 0.6), ("sucre", 0.5), "levure", ("oeufs", 0.25), ("miel", 2)],
      ["Préchauffer le four à 220 °C. Sabler la farine, la levure et le sucre avec le beurre froid du bout des doigts.", "Ajouter l'œuf battu et le lait, mélanger rapidement sans pétrir.",
       "Étaler sur 2,5 cm et découper des disques.", "Cuire 12 min. Servir tièdes, ouverts, avec du beurre et le miel."], "Anglaise", meal=B + ("Goûter",), serv=4)
    # ---------- desserts et goûters ----------
    P("Tarte aux fraises", "Desserts", 60, ["four", "plaques"], ["printemps", "fête"],
      ["pate-sablee", ("fraises", 2), ("lait", 1.25), ("oeufs", 0.5), "sucre", ("maizena", 1), "vanille"],
      ["Préchauffer le four à 180 °C. Cuire la pâte sablée à blanc 20 min, couverte de papier cuisson et de légumes secs.", "Crème pâtissière : chauffer le lait avec la vanille. Fouetter les œufs, le sucre et la maïzena, verser le lait chaud dessus.",
       "Remettre sur le feu et cuire en fouettant jusqu'à épaississement. Laisser refroidir.", "Garnir le fond de tarte de crème, puis des fraises coupées en deux. Réfrigérer 1 h."], meal=D, serv=6, diff="Intermédiaire")
    P("Cookies au beurre de cacahuète", "Desserts", 25, ["four"], ["goûter", "enfants"],
      [("cacahuete", 4), ("sucre", 1.67), ("oeufs", 0.25), ("farine", 0.5), ("levure", 0.5)],
      ["Préchauffer le four à 180 °C. Mélanger le beurre de cacahuète, le sucre et l'œuf.", "Ajouter la farine et la levure.",
       "Former des boules, les aplatir avec une fourchette sur une plaque.", "Cuire 10 min : ils durcissent en refroidissant."], "Américaine", meal=D, serv=6)
    P("Gâteau marbré", "Desserts", 65, ["four"], ["goûter", "familial"],
      [("farine", 1.67), ("sucre", 2.5), ("beurre", 7.5), ("oeufs", 0.75), ("lait", 0.25), ("cacao", 1), "levure", "vanille"],
      ["Préchauffer le four à 170 °C. Battre le beurre mou avec le sucre, ajouter les œufs un à un, puis la vanille.", "Ajouter la farine, la levure et le lait.",
       "Partager la pâte en deux et ajouter le cacao à une moitié.", "Verser les pâtes en alternance dans un moule à cake, tracer des vagues avec un couteau et cuire 45 min."], meal=D, serv=8)
    P("Mousse aux fruits rouges", "Desserts", 20, [], ["été", "sans cuisson"],
      [("fruits-rouges", 2), ("creme", 2), ("sucre", 0.83), "citron"],
      ["Mixer les fruits rouges avec le sucre et un trait de jus de citron, puis filtrer pour retirer les graines.", "Fouetter la crème bien froide en chantilly ferme.",
       "Incorporer délicatement le coulis à la chantilly.", "Répartir dans des verres et réfrigérer 2 h."], meal=D, serv=4)
    P("Crème caramel", "Desserts", 55, ["four", "plaques"], ["classique"],
      [("lait", 2.5), ("oeufs", 1), ("sucre", 2), "vanille"],
      ["Faire un caramel avec la moitié du sucre et un peu d'eau, le verser dans des ramequins.", "Préchauffer le four à 160 °C. Chauffer le lait avec la vanille.",
       "Fouetter les œufs avec le reste de sucre, verser le lait chaud dessus et répartir dans les ramequins.", "Cuire 35 min au bain-marie. Réfrigérer au moins 3 h puis démouler."], meal=D, serv=4)
    P("Pudding au pain", "Desserts", 55, ["four"], ["économique", "anti-gaspi"],
      [("pain", 2), ("lait", 2.5), ("oeufs", 0.75), ("sucre", 1.33), ("raisins-secs", 1.5), ("beurre", 1.5), "cannelle"],
      ["Couper le pain rassis en morceaux et le faire tremper dans le lait 15 min.", "Préchauffer le four à 180 °C. Ajouter les œufs battus, le sucre, la cannelle et les raisins secs.",
       "Verser dans un plat beurré et parsemer du reste de beurre en noisettes.", "Cuire 40 min jusqu'à ce que le dessus soit doré."], "Anglaise", meal=D, serv=6)
    P("Banana split", "Desserts", 10, [], ["été", "enfants", "sans cuisson"],
      ["banane", ("glace", 1), ("chocolat", 0.5), ("creme", 1), ("amandes", 0.67)],
      ["Faire fondre le chocolat avec un peu de crème.", "Fouetter le reste de crème en chantilly.",
       "Couper les bananes en deux dans la longueur, poser trois boules de glace entre les moitiés.", "Napper de chocolat, ajouter la chantilly et les amandes grillées."], "Américaine", meal=D)
    P("Pêches rôties au miel", "Desserts", 30, ["four"], ["été"],
      [("peches", 2), ("miel", 3), ("beurre", 1), "vanille", "amandes", ("yaourt", 1)],
      ["Préchauffer le four à 200 °C. Couper les pêches en deux et retirer le noyau.", "Les disposer dans un plat, arroser de miel et de beurre fondu, ajouter la vanille.",
       "Rôtir 20 min en arrosant de jus à mi-cuisson.", "Servir tiède avec le yaourt et les amandes grillées."], meal=D, serv=4)
    P("Clafoutis aux cerises", "Desserts", 50, ["four"], ["été", "classique"],
      [("cerises", 2), ("oeufs", 1), ("farine", 0.67), ("sucre", 1.33), ("lait", 1.5), ("beurre", 1)],
      ["Préchauffer le four à 180 °C. Beurrer un plat et y disposer les cerises (traditionnellement avec leurs noyaux).", "Fouetter les œufs avec le sucre, ajouter la farine puis le lait.",
       "Verser sur les cerises.", "Cuire 35 min. Servir tiède."], "Limousine", meal=D, serv=6)
    P("Crumble pêches et fruits rouges", "Desserts", 45, ["four"], ["été"],
      [("peches", 2), "fruits-rouges", ("farine", 0.83), ("sucre", 1.33), ("beurre", 4), ("flocons-avoine", 0.4)],
      ["Préchauffer le four à 180 °C. Couper les pêches en morceaux et les mélanger aux fruits rouges dans un plat.", "Sabler la farine, le sucre, les flocons d'avoine et le beurre froid du bout des doigts.",
       "Répartir la pâte sur les fruits.", "Cuire 30 min jusqu'à ce que le crumble soit doré."], "Anglaise", meal=D, serv=4)
    P("Financiers", "Desserts", 30, ["four", "plaques"], ["goûter"],
      [("amandes", 3.33), ("sucre", 2), ("farine", 0.33), ("beurre", 5), ("oeufs", 1)],
      ["Préchauffer le four à 200 °C. Faire fondre le beurre jusqu'à ce qu'il soit noisette.", "Mixer les amandes en poudre fine, les mélanger avec le sucre et la farine.",
       "Ajouter les blancs d'œufs puis le beurre noisette.", "Répartir dans des moules et cuire 12 min."], meal=D, serv=6)
    P("Sablés au beurre", "Desserts", 35, ["four"], ["goûter", "enfants"],
      [("farine", 2.08), ("beurre", 6.25), ("sucre", 1.67), ("oeufs", 0.25), "vanille"],
      ["Mélanger le beurre mou avec le sucre et la vanille, ajouter l'œuf.", "Incorporer la farine sans trop travailler la pâte. La mettre 30 min au frais.",
       "Préchauffer le four à 180 °C. Étaler la pâte sur 5 mm et découper des formes.", "Cuire 10 à 12 min : les bords doivent juste dorer."], "Bretonne", meal=D, serv=6)
    P("Soufflé au chocolat", "Desserts", 30, ["four", "plaques"], ["fête"],
      [("chocolat", 1.5), ("oeufs", 1), ("sucre", 0.67), ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Beurrer et sucrer des ramequins.", "Faire fondre le chocolat, ajouter les jaunes d'œufs.",
       "Monter les blancs en neige en ajoutant le sucre, puis les incorporer délicatement au chocolat.", "Remplir les ramequins et cuire 12 min sans ouvrir le four. Servir aussitôt."], meal=D, serv=4, diff="Intermédiaire")
    P("Far breton", "Desserts", 60, ["four"], ["classique"],
      [("farine", 1), ("sucre", 1.67), ("oeufs", 1), ("lait", 2.5), ("pruneaux", 2.5), ("beurre", 1)],
      ["Préchauffer le four à 200 °C. Fouetter les œufs avec le sucre, ajouter la farine puis le lait petit à petit.", "Beurrer un plat et y répartir les pruneaux.",
       "Verser la pâte.", "Cuire 10 min à 200 °C puis 35 min à 180 °C. Servir froid."], "Bretonne", meal=D, serv=6)
    P("Gâteau breton", "Desserts", 55, ["four"], ["goûter", "classique"],
      [("farine", 2.08), ("beurre", 10), ("sucre", 2.5), ("oeufs", 1.25)],
      ["Préchauffer le four à 180 °C. Mélanger le beurre mou et le sucre, ajouter 4 jaunes d'œufs.", "Incorporer la farine pour obtenir une pâte épaisse.",
       "L'étaler dans un moule beurré, dorer avec le dernier jaune et tracer des croisillons à la fourchette.", "Cuire 40 min."], "Bretonne", meal=D, serv=8)
    P("Tarte normande", "Desserts", 55, ["four"], ["automne", "classique"],
      ["pate-brisee", ("pomme", 2), ("oeufs", 0.5), ("creme", 2), "sucre", ("farine", 0.17), "cannelle"],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte brisée.", "Disposer les pommes en quartiers.",
       "Fouetter les œufs, le sucre, la farine, la crème et la cannelle, verser sur les pommes.", "Cuire 40 min jusqu'à ce que la crème soit dorée."], "Normande", meal=D, serv=6)
    P("Ananas rôti à la vanille", "Desserts", 35, ["four"], ["fête", "hiver"],
      ["ananas", ("sucre", 0.67), ("beurre", 1.5), "vanille", "citron-vert"],
      ["Préchauffer le four à 200 °C. Éplucher l'ananas et le couper en quartiers.", "Le disposer dans un plat avec le beurre, le sucre et la vanille.",
       "Rôtir 25 min en l'arrosant souvent de son jus.", "Râper le zeste du citron vert dessus et servir tiède."], meal=D, serv=4)
    P("Milk-shake à la banane", "Desserts", 5, [], ["goûter", "enfants", "sans cuisson"],
      ["banane", ("lait", 2), ("glace", 0.5), "miel"],
      ["Mettre les bananes, le lait froid, la glace et le miel dans le blender.", "Mixer jusqu'à ce que ce soit mousseux.", "Servir aussitôt dans de grands verres."], "Américaine", meal=("Goûter",))
    P("Pain d'épices", "Desserts", 70, ["four", "plaques"], ["hiver", "goûter"],
      [("farine", 2.08), ("miel", 10), ("lait", 0.75), ("sucre", 0.83), ("epices", 2), "cannelle", "levure", ("oeufs", 0.25)],
      ["Préchauffer le four à 160 °C. Faire tiédir le miel avec le lait et le sucre.", "Mélanger la farine, la levure, les épices à pain d'épices et la cannelle.",
       "Ajouter le mélange au miel et l'œuf, mélanger jusqu'à obtenir une pâte lisse.", "Verser dans un moule à cake et cuire 50 min. Il est meilleur le lendemain."], meal=D, serv=8)
    P("Cheesecake au four", "Desserts", 90, ["four"], ["fête"],
      [("biscuits", 2), ("beurre", 4), ("fromage-frais", 6), ("sucre", 2.5), ("oeufs", 0.75), ("creme", 2), "citron", ("farine", 0.25)],
      ["Préchauffer le four à 160 °C. Mélanger les biscuits écrasés avec le beurre fondu et tasser au fond d'un moule.", "Fouetter le fromage frais avec le sucre, la farine, le zeste du citron, puis les œufs un à un et la crème.",
       "Verser sur le fond de biscuits.", "Cuire 1 h, laisser refroidir dans le four éteint porte entrouverte, puis réfrigérer une nuit."], "Américaine", meal=D, serv=8, diff="Intermédiaire")
    P("Muffins au chocolat", "Desserts", 35, ["four"], ["goûter", "enfants"],
      [("farine", 1.67), ("cacao", 1.5), ("sucre", 2), ("oeufs", 0.5), ("lait", 1), ("beurre", 4), "chocolat", "levure"],
      ["Préchauffer le four à 180 °C. Mélanger la farine, le cacao, le sucre et la levure.", "Ajouter les œufs, le lait et le beurre fondu, mélanger juste ce qu'il faut.",
       "Ajouter le chocolat haché et répartir dans des moules à muffins.", "Cuire 20 min."], "Américaine", meal=D, serv=6)
    P("Gâteau renversé à l'ananas", "Desserts", 55, ["four", "plaques"], ["goûter"],
      ["ananas", ("sucre", 3), ("beurre", 5), ("farine", 1.25), ("oeufs", 0.75), "levure", ("lait", 0.25)],
      ["Préchauffer le four à 180 °C. Faire un caramel avec un tiers du sucre et le verser au fond d'un moule.", "Disposer les tranches d'ananas sur le caramel.",
       "Battre le beurre mou avec le reste du sucre, ajouter les œufs, la farine, la levure et le lait. Verser sur l'ananas.", "Cuire 35 min et démouler tiède."], meal=D, serv=8)
    P("Pavlova aux fruits rouges", "Desserts", 120, ["four"], ["fête", "été"],
      [("oeufs", 1), ("sucre", 3.33), ("maizena", 0.33), ("vinaigre", 1), ("creme", 2.5), ("fruits-rouges", 2), "kiwi"],
      ["Préchauffer le four à 120 °C. Monter les blancs d'œufs en neige en ajoutant le sucre petit à petit jusqu'à ce que la meringue soit brillante.", "Ajouter la maïzena et le vinaigre.",
       "Former un grand disque sur du papier cuisson et cuire 1 h 30, puis laisser refroidir dans le four éteint.", "Garnir de crème fouettée, de fruits rouges et de kiwi juste avant de servir."], "Australienne", meal=D, serv=6, diff="Intermédiaire")
    P("Truffes au chocolat", "Desserts", 30, ["plaques"], ["fête", "hiver"],
      [("chocolat", 2), ("creme", 1), ("beurre", 1), ("cacao", 1.5)],
      ["Faire chauffer la crème et la verser sur le chocolat haché. Laisser 2 min puis mélanger.", "Ajouter le beurre et laisser prendre au frais 2 h.",
       "Former des petites boules avec une cuillère.", "Les rouler dans le cacao et garder au frais."], meal=D, serv=8)
    P("Tarte aux noix et au miel", "Desserts", 50, ["four", "plaques"], ["automne", "hiver"],
      ["pate-sablee", ("noix", 5), ("miel", 4), ("sucre", 1.33), ("creme", 1.5), ("oeufs", 0.5), ("beurre", 1.5)],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte sablée.", "Faire chauffer le miel, le sucre, le beurre et la crème 3 min.",
       "Hors du feu, ajouter les œufs battus et les noix concassées.", "Verser sur la pâte et cuire 30 min."], meal=D, serv=6)
    P("Tarte au sucre", "Desserts", 45, ["four"], ["québécoise"],
      ["pate-brisee", ("sucre", 2.5), ("creme", 2), ("farine", 0.17), ("oeufs", 0.25), ("beurre", 1)],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte brisée.", "Mélanger le sucre (cassonade de préférence) avec la farine, puis la crème, l'œuf et le beurre fondu.",
       "Verser sur la pâte.", "Cuire 35 min : la garniture doit rester tremblotante au centre. Laisser refroidir."], "Québécoise", meal=D, serv=6)
    P("Tarte aux prunes", "Desserts", 50, ["four"], ["été", "automne"],
      ["pate-brisee", ("prunes", 3.2), "sucre", "amandes", "cannelle"],
      ["Préchauffer le four à 190 °C. Foncer un moule avec la pâte brisée.", "Mixer les amandes en poudre et les répartir sur le fond : elles absorbent le jus.",
       "Disposer les prunes coupées en deux bien serrées.", "Saupoudrer de sucre et de cannelle et cuire 35 min."], "Alsacienne", meal=D, serv=6)
    P("Charlotte au chocolat", "Desserts", 40, ["plaques"], ["fête", "sans cuisson"],
      [("biscuits", 2), ("chocolat", 2), ("oeufs", 1.5), ("sucre", 0.5), "cafe"],
      ["Faire fondre le chocolat et le laisser tiédir, ajouter les jaunes d'œufs.", "Monter les blancs en neige avec le sucre et les incorporer au chocolat.",
       "Préparer le café et y tremper rapidement les biscuits, en tapisser un moule.", "Alterner mousse et biscuits, finir par des biscuits. Réfrigérer au moins 6 h avant de démouler."], meal=D, serv=6)
    P("Mousse au citron", "Desserts", 30, ["plaques"], ["printemps"],
      [("citron", 2), ("oeufs", 0.75), ("sucre", 1.33), ("creme", 2), ("maizena", 0.5)],
      ["Chauffer le jus et le zeste des citrons avec le sucre, les œufs et la maïzena en fouettant jusqu'à épaississement.", "Laisser refroidir complètement.",
       "Fouetter la crème en chantilly et l'incorporer délicatement à la crème au citron.", "Répartir dans des verres et réfrigérer 2 h."], meal=D, serv=4)
    P("Crème vanille maison", "Desserts", 20, ["plaques"], ["enfants", "classique"],
      [("lait", 2.5), ("maizena", 1.33), ("sucre", 1.17), "vanille", ("oeufs", 0.5)],
      ["Chauffer le lait avec la vanille.", "Fouetter les jaunes d'œufs avec le sucre et la maïzena, verser le lait chaud dessus.",
       "Remettre sur feu doux et cuire en fouettant jusqu'à ce que la crème épaississe.", "Répartir dans des pots et réfrigérer 2 h."], meal=D, serv=4)
    P("Gâteau aux noix", "Desserts", 55, ["four"], ["goûter", "automne"],
      [("noix", 3.75), ("farine", 0.83), ("sucre", 2.5), ("beurre", 6.25), ("oeufs", 0.75), ("levure", 0.5)],
      ["Préchauffer le four à 180 °C. Mixer grossièrement les noix.", "Battre le beurre mou avec le sucre, ajouter les œufs un à un.",
       "Ajouter la farine, la levure et les noix.", "Verser dans un moule beurré et cuire 35 min."], "Périgourdine", meal=D, serv=8)
    P("Cookies aux flocons d'avoine et raisins secs", "Desserts", 30, ["four"], ["goûter"],
      [("flocons-avoine", 1.9), ("farine", 0.83), ("beurre", 5), ("sucre", 1.67), ("oeufs", 0.25), ("raisins-secs", 2), "cannelle", ("levure", 0.5)],
      ["Préchauffer le four à 180 °C. Mélanger le beurre mou et le sucre, ajouter l'œuf.", "Ajouter la farine, la levure, les flocons d'avoine, la cannelle et les raisins secs.",
       "Former des boules et les aplatir légèrement sur une plaque.", "Cuire 12 min."], "Américaine", meal=D, serv=6)
    P("Salade d'oranges à la cannelle", "Desserts", 10, [], ["hiver", "sans cuisson", "léger"],
      [("orange", 2), "cannelle", "miel", "menthe"],
      ["Peler les oranges à vif et les couper en rondelles.", "Les disposer dans un plat, arroser de miel et saupoudrer de cannelle.", "Parsemer de menthe et servir frais."], "Marocaine", meal=D, serv=4)
    P("Fondue au chocolat et fruits", "Desserts", 20, ["plaques"], ["fête", "hiver"],
      [("chocolat", 2), ("creme", 2), "banane", "fraises", "poire", "kiwi"],
      ["Couper la banane, la poire, le kiwi et les fraises en morceaux.", "Faire chauffer la crème et y faire fondre le chocolat en remuant.",
       "Verser dans un caquelon ou un bol tenu au chaud.", "Tremper les fruits dans le chocolat avec des piques."], "Suisse", meal=D, serv=4)
    P("Yaourt glacé aux fruits rouges", "Desserts", 10, [], ["été", "sans cuisson"],
      [("fruits-rouges", 2), ("yaourt", 2), ("miel", 3)],
      ["Utiliser des fruits rouges surgelés.", "Les mixer avec le yaourt et le miel jusqu'à obtenir une texture de glace.", "Servir aussitôt, ou passer 30 min au congélateur pour la raffermir."], meal=D, serv=4)
    P("Petits pots de crème au café", "Desserts", 45, ["four", "plaques"], ["classique"],
      [("lait", 2), ("creme", 2), ("oeufs", 1), ("sucre", 1.33), ("cafe", 2)],
      ["Préchauffer le four à 150 °C. Chauffer le lait et la crème avec le café.", "Fouetter les jaunes d'œufs avec le sucre, verser le mélange chaud dessus.",
       "Répartir dans des petits pots.", "Cuire 30 min au bain-marie et réfrigérer 3 h."], meal=D, serv=4)
    P("Affogato", "Desserts", 5, [], ["rapide", "sans cuisson"],
      [("glace", 0.5), ("cafe", 2), ("biscuits", 0.3)],
      ["Préparer deux expressos bien chauds avec le café.", "Mettre une boule de glace à la vanille dans chaque tasse.", "Verser le café brûlant dessus et servir aussitôt avec un biscuit."], "Italienne", meal=D)
    P("Meringues", "Desserts", 100, ["four"], ["anti-gaspi", "goûter"],
      [("oeufs", 1), ("sucre", 3.33), "vanille"],
      ["Préchauffer le four à 100 °C. Monter les blancs d'œufs en neige ferme.", "Ajouter le sucre petit à petit en continuant de fouetter jusqu'à ce que la meringue soit brillante. Ajouter la vanille.",
       "Former des petits tas sur une plaque couverte de papier cuisson.", "Cuire 1 h 30 : elles doivent se détacher facilement. (Les jaunes servent pour une crème.)"], meal=D, serv=6)
    P("Tuiles aux amandes", "Desserts", 25, ["four"], ["goûter", "anti-gaspi"],
      [("amandes", 2.67), ("sucre", 1.33), ("farine", 0.25), ("oeufs", 0.5), ("beurre", 1.5)],
      ["Préchauffer le four à 180 °C. Mélanger les blancs d'œufs, le sucre, la farine et le beurre fondu.", "Ajouter les amandes effilées.",
       "Déposer des petites cuillerées bien espacées sur une plaque et les étaler finement.", "Cuire 8 min et les poser encore chaudes sur un rouleau pour les courber."], meal=D, serv=6)
    P("Palmiers", "Desserts", 30, ["four"], ["goûter", "rapide"],
      ["pate-feuilletee", ("sucre", 1.33), "cannelle"],
      ["Préchauffer le four à 200 °C. Saupoudrer le plan de travail et la pâte feuilletée de sucre.", "Rouler les deux côtés de la pâte vers le centre jusqu'à ce qu'ils se rejoignent, ajouter la cannelle si on veut.",
       "Couper en tranches de 1 cm et les poser sur une plaque.", "Cuire 15 min en les retournant à mi-cuisson."], meal=D, serv=6)
    P("Chouquettes", "Desserts", 45, ["four", "plaques"], ["goûter"],
      [("farine", 0.63), ("beurre", 3), ("oeufs", 0.75), ("lait", 0.63), ("sucre", 0.67)],
      ["Préchauffer le four à 190 °C. Porter le lait, 12 cl d'eau et le beurre à ébullition avec une pincée de sel.", "Ajouter la farine d'un coup, mélanger et dessécher 1 min sur le feu.",
       "Incorporer les œufs un à un. Former des petites boules sur une plaque.", "Parsemer de sucre (en grains si possible) et cuire 20 min sans ouvrir le four."], meal=D, serv=6, diff="Intermédiaire")
    P("Omelette norvégienne", "Desserts", 30, ["four"], ["fête"],
      [("glace", 3), ("oeufs", 1), ("sucre", 2.5), ("biscuits", 1.5)],
      ["Disposer les biscuits sur un plat allant au four et poser la glace bien ferme dessus en dôme.", "Monter les blancs d'œufs en neige avec le sucre en meringue ferme.",
       "Couvrir entièrement la glace de meringue.", "Passer 3 à 4 min sous le gril très chaud jusqu'à ce que la meringue dore, et servir aussitôt."], meal=D, serv=6, diff="Intermédiaire")
    P("Riz gluant au lait de coco et à la mangue", "Desserts", 40, ["plaques"], ["été", "asiatique"],
      [("riz", 0.8), ("lait-coco", 1.5), ("sucre", 0.67), ("mangue", 2), ("sesame", 0.5)],
      ["Cuire le riz (rond de préférence) 20 min à feu doux avec la moitié du lait de coco, 20 cl d'eau et la moitié du sucre.", "Chauffer le reste du lait de coco avec le reste du sucre et une pincée de sel.",
       "Couper la mangue en tranches.", "Servir le riz tiède avec la mangue, napper de sauce coco et parsemer de sésame."], "Thaïlandaise", meal=D, serv=4)
    P("Gratin de fruits rouges au sabayon", "Desserts", 20, ["four", "plaques"], ["été", "fête"],
      [("fruits-rouges", 3), ("oeufs", 1), "sucre", ("vin-blanc", 0.8)],
      ["Répartir les fruits rouges dans des plats individuels.", "Fouetter les jaunes d'œufs avec le sucre et le vin blanc au bain-marie jusqu'à ce que le mélange soit mousseux et épais.",
       "Napper les fruits de sabayon.", "Passer 2 min sous le gril jusqu'à ce que ce soit doré."], meal=D, serv=4, diff="Intermédiaire")
    P("Polenta crémeuse aux champignons", "Poêlées", 30, ["plaques"], ["végétarien", "automne", "réconfort"],
      [("polenta", 0.8), ("lait", 2), ("bouillon", 0.8), ("champignons", 1.2), ("ail", 1), ("beurre", 1), ("parmesan", 1), "persil"],
      ["Porter le lait et le bouillon à ébullition, verser la polenta en pluie et cuire en remuant selon le paquet.", "Ajouter la moitié du beurre et le parmesan : elle doit rester crémeuse.",
       "Faire sauter les champignons avec l'ail dans le reste de beurre 8 min.", "Servir la polenta couverte de champignons et de persil."], "Italienne")
    return R
