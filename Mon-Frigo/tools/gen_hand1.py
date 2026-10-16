# -*- coding: utf-8 -*-
from gen_core import *


def I(x):
    if isinstance(x, str): return q(x)
    if len(x) == 2: return q(x[0], x[1])
    return [x[0], x[1], x[2]]


def H(title, cat, time, equip, tags, ings, steps, cuisine="Française", meal=("Déjeuner", "Dîner"), diff="Facile", serv=2):
    return mk(title, cat, time, equip, tags + cooktime_tag(time), [I(i) for i in ings], steps, cuisine, meal, diff, serv, src="classique")


COOK_PASTA = "Cuire les pâtes 9 à 11 min dans une grande casserole d'eau bouillante salée, puis les égoutter en gardant un verre d'eau de cuisson."


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- PÂTES ----------
    P("Pâtes sauce tomate et basilic", "Pâtes", 25, ["plaques"], ["pâtes", "économique", "végétarien"],
      ["pates", "tomate-concassee", "oignon", ("ail", 1), "basilic", ("huile-olive", 0.5), ("parmesan", 0.6)],
      ["Émincer l'oignon et hacher l'ail.", "Faire revenir l'oignon dans l'huile d'olive 4 min, ajouter l'ail 1 min, puis verser la tomate concassée. Saler, poivrer et laisser mijoter 12 min à feu doux.",
       COOK_PASTA, "Mélanger les pâtes à la sauce avec un peu d'eau de cuisson. Servir avec le basilic ciselé et le parmesan râpé."], "Italienne")
    P("Pâtes carbonara", "Pâtes", 20, ["plaques"], ["pâtes", "réconfort"],
      ["pates", "lardons", ("oeufs", 1), ("parmesan", 1), "poivre"],
      [COOK_PASTA, "Faire dorer les lardons 5 min à la poêle, sans matière grasse. Éteindre le feu.", "Battre les œufs avec le parmesan râpé et beaucoup de poivre.",
       "Verser les pâtes chaudes dans la poêle avec les lardons, hors du feu. Ajouter le mélange œufs-parmesan et remuer vivement 1 min, en ajoutant un peu d'eau de cuisson pour obtenir une sauce crémeuse. Servir immédiatement."], "Italienne")
    P("Pâtes crémeuses au poulet et champignons", "Pâtes", 30, ["plaques"], ["pâtes", "poulet", "réconfort"],
      ["pates", ("poulet", 0.9), "champignons", "oignon", "creme", ("huile-olive", 0.5), ("parmesan", 0.5)],
      ["Couper le poulet en dés, émincer l'oignon et les champignons.", COOK_PASTA,
       "Faire dorer le poulet 6 min dans l'huile d'olive, le réserver. Dans la même poêle, faire revenir l'oignon 3 min puis les champignons 6 min.",
       "Remettre le poulet, verser la crème, saler, poivrer et laisser mijoter 4 min. Mélanger avec les pâtes et parsemer de parmesan."])
    P("Pâtes au saumon, crème et citron", "Pâtes", 25, ["plaques"], ["pâtes", "poisson"],
      ["pates", ("saumon", 0.8), "creme", "citron", "aneth", ("huile-olive", 0.3)],
      [COOK_PASTA, "Couper le saumon en dés. Le faire revenir 3 à 4 min dans l'huile d'olive à feu moyen.", "Ajouter la crème, le zeste et le jus du citron, saler, poivrer. Laisser mijoter 3 min à feu doux.", "Mélanger avec les pâtes, parsemer d'aneth ciselé et servir."])
    P("Pâtes au pesto, tomates cerises et mozzarella", "Pâtes", 20, ["plaques"], ["pâtes", "végétarien", "froid"],
      ["pates", "pesto", "tomate-cerise", "mozzarella", "basilic"],
      [COOK_PASTA, "Couper les tomates cerises en deux et la mozzarella en morceaux.", "Mélanger les pâtes égouttées avec le pesto et un peu d'eau de cuisson.", "Ajouter les tomates et la mozzarella, mélanger délicatement et servir avec le basilic."], "Italienne")
    P("Pâtes au thon, tomate et olives", "Pâtes", 25, ["plaques"], ["pâtes", "économique", "poisson"],
      ["pates", "thon", "tomate-concassee", "olives", "oignon", ("ail", 1), ("huile-olive", 0.5)],
      ["Émincer l'oignon, hacher l'ail.", "Faire revenir l'oignon 4 min dans l'huile d'olive, ajouter l'ail puis la tomate concassée. Laisser mijoter 10 min.", COOK_PASTA, "Ajouter le thon égoutté émietté et les olives à la sauce, chauffer 2 min puis mélanger aux pâtes."], "Méditerranéenne")
    P("Pâtes à la courgette, citron et parmesan", "Pâtes", 25, ["plaques"], ["pâtes", "végétarien"],
      ["pates", "courgette", "citron", ("parmesan", 0.8), ("ail", 1), ("huile-olive", 1)],
      ["Râper la courgette (ou la couper en fines rondelles). Hacher l'ail.", COOK_PASTA, "Faire revenir la courgette 6 min dans l'huile d'olive avec l'ail, saler et poivrer.", "Mélanger avec les pâtes, le zeste et le jus du citron et la moitié du parmesan. Servir avec le reste du parmesan."], "Italienne")
    P("Pâtes au brocoli, ail et parmesan", "Pâtes", 25, ["plaques"], ["pâtes", "végétarien", "économique"],
      ["pates", "brocoli", ("ail", 1), ("parmesan", 0.8), ("huile-olive", 1)],
      ["Détailler le brocoli en petits bouquets et hacher l'ail.", "Cuire les pâtes dans l'eau bouillante salée. Ajouter le brocoli dans la même eau 5 min avant la fin de la cuisson, puis égoutter le tout en gardant un verre d'eau.",
       "Faire chauffer l'huile d'olive avec l'ail 1 min à feu doux, sans le brûler.", "Ajouter les pâtes et le brocoli, écraser légèrement le brocoli à la fourchette et mélanger avec un peu d'eau de cuisson. Servir avec le parmesan."], "Italienne")
    P("Pâtes aux épinards et ricotta", "Pâtes", 20, ["plaques"], ["pâtes", "végétarien"],
      ["pates", "epinards", "ricotta", ("ail", 1), ("parmesan", 0.5), ("huile-olive", 0.5)],
      [COOK_PASTA, "Faire tomber les épinards 3 min dans l'huile d'olive avec l'ail haché.", "Ajouter la ricotta et un peu d'eau de cuisson, mélanger jusqu'à obtenir une sauce lisse. Saler, poivrer.", "Mélanger avec les pâtes et servir avec le parmesan."], "Italienne")
    P("Pâtes bolognaise", "Pâtes", 40, ["plaques"], ["pâtes", "familial", "boeuf"],
      ["pates", "boeuf-hache", "tomate-concassee", "oignon", "carotte", ("ail", 1), ("huile-olive", 0.5), "herbes-provence"],
      ["Éplucher et râper la carotte, émincer l'oignon, hacher l'ail.", "Faire revenir l'oignon et la carotte 5 min dans l'huile d'olive, puis ajouter la viande hachée et l'émietter 6 min jusqu'à ce qu'elle soit colorée.",
       "Ajouter l'ail, la tomate concassée et les herbes. Saler, poivrer, couvrir et laisser mijoter 20 min à feu doux.", COOK_PASTA, "Servir les pâtes nappées de sauce bolognaise."], "Italienne")
    P("Pâtes au chorizo et poivron", "Pâtes", 30, ["plaques"], ["pâtes", "épicé"],
      ["pates", "chorizo", "poivron", "oignon", "tomate-concassee"],
      ["Couper le chorizo en rondelles, le poivron en lanières, émincer l'oignon.", "Faire dorer le chorizo 3 min dans la poêle, le retirer. Faire revenir l'oignon et le poivron 8 min dans la graisse du chorizo.",
       "Ajouter la tomate concassée, remettre le chorizo et laisser mijoter 10 min.", COOK_PASTA, "Mélanger les pâtes à la sauce et servir."], "Méditerranéenne")
    P("Pâtes aux crevettes, ail et citron", "Pâtes", 20, ["plaques"], ["pâtes", "poisson", "express"],
      ["pates", "crevettes", ("ail", 1.5), "citron", "persil", ("huile-olive", 1)],
      [COOK_PASTA, "Hacher l'ail. Chauffer l'huile d'olive et faire revenir l'ail 30 secondes, sans le colorer.", "Ajouter les crevettes et cuire 2 à 3 min de chaque côté, jusqu'à ce qu'elles soient roses.", "Ajouter le jus du citron, mélanger avec les pâtes et un peu d'eau de cuisson, parsemer de persil ciselé."], "Méditerranéenne")
    P("Pâtes à l'aubergine, tomate et mozzarella", "Pâtes", 35, ["plaques"], ["pâtes", "végétarien"],
      ["pates", "aubergine", "tomate-concassee", "mozzarella", "oignon", ("ail", 1), ("huile-olive", 1), "basilic"],
      ["Couper l'aubergine en petits cubes, émincer l'oignon, hacher l'ail.", "Faire dorer l'aubergine 10 min dans l'huile d'olive à feu moyen-vif, la réserver.", "Faire revenir l'oignon et l'ail 3 min, ajouter la tomate et laisser mijoter 10 min. Remettre l'aubergine.",
       COOK_PASTA, "Mélanger les pâtes à la sauce, ajouter la mozzarella en morceaux et le basilic. Servir aussitôt."], "Italienne")
    P("Pâtes crémeuses au chèvre et aux épinards", "Pâtes", 20, ["plaques"], ["pâtes", "végétarien"],
      ["pates", "chevre", "epinards", "creme", ("noix", 0.5), ("huile-olive", 0.3)],
      [COOK_PASTA, "Faire tomber les épinards 3 min dans l'huile d'olive.", "Ajouter la crème et le chèvre en morceaux, remuer 3 min à feu doux jusqu'à ce qu'il fonde. Poivrer.", "Mélanger avec les pâtes et parsemer de noix concassées."])
    P("Pâtes aux champignons et à la crème", "Pâtes", 25, ["plaques"], ["pâtes", "végétarien", "réconfort"],
      ["pates", "champignons", "creme", "oignon", ("ail", 1), ("persil", 0.5), ("beurre", 0.5)],
      ["Émincer les champignons et l'oignon, hacher l'ail.", COOK_PASTA, "Faire fondre le beurre, faire revenir l'oignon 3 min puis les champignons 8 min à feu vif jusqu'à évaporation de l'eau. Ajouter l'ail.",
       "Verser la crème, saler, poivrer, laisser mijoter 3 min. Mélanger avec les pâtes et parsemer de persil."])
    P("Pâtes au jambon, petits pois et crème", "Pâtes", 20, ["plaques"], ["pâtes", "familial", "express"],
      ["pates", "jambon", "petits-pois", "creme", "oignon", ("parmesan", 0.5)],
      [COOK_PASTA + " Ajouter les petits pois dans l'eau pour les 4 dernières minutes.", "Couper le jambon en lanières et émincer l'oignon.", "Faire revenir l'oignon 3 min, ajouter le jambon 1 min, puis la crème. Poivrer.", "Mélanger avec les pâtes et les petits pois, parsemer de parmesan."])
    P("Spaghetti ail, huile d'olive et piment", "Pâtes", 15, ["plaques"], ["pâtes", "végétarien", "express", "économique"],
      ["pates", ("ail", 1.5), ("huile-olive", 1.5), ("paprika", 0.5), "persil"],
      ["Cuire les spaghetti dans l'eau bouillante salée, en gardant un verre d'eau de cuisson.", "Émincer l'ail finement. Le faire chauffer doucement dans l'huile d'olive 2 min avec le piment, sans le laisser brunir.", "Ajouter les spaghetti et un peu d'eau de cuisson, mélanger 1 min à feu vif. Parsemer de persil ciselé."], "Italienne")
    P("Macaroni au fromage", "Pâtes", 30, ["plaques"], ["pâtes", "végétarien", "réconfort"],
      ["pates", "lait", ("fromage-rape", 1.5), ("beurre", 1), ("farine", 0.3)],
      [COOK_PASTA, "Faire fondre le beurre dans une casserole, ajouter la farine et remuer 1 min. Verser le lait petit à petit en fouettant, jusqu'à ce que la sauce épaississe (5 min).", "Hors du feu, ajouter le fromage râpé, saler, poivrer et mélanger jusqu'à ce qu'il soit fondu.", "Mélanger avec les pâtes. Servir tel quel ou gratiner 10 min au four à 200 °C."], "Américaine")
    P("Lasagnes à la bolognaise", "Plats au four", 85, ["four", "plaques"], ["four", "familial", "boeuf", "batch"],
      ["lasagnes", "boeuf-hache", "tomate-concassee", "bechamel", "oignon", "carotte", ("fromage-rape", 1), ("huile-olive", 0.5), ("ail", 1)],
      ["Faire revenir l'oignon et la carotte râpée 5 min dans l'huile d'olive, ajouter la viande hachée 6 min, puis l'ail et la tomate. Saler, poivrer, mijoter 15 min.", "Préchauffer le four à 190 °C.",
       "Dans un plat, alterner : un peu de sauce, des feuilles de lasagnes, de la sauce, de la béchamel. Répéter 3 fois en terminant par de la béchamel.", "Parsemer de fromage râpé et enfourner 40 min, jusqu'à ce que le dessus soit gratiné. Laisser reposer 10 min avant de servir."], "Italienne", diff="Intermédiaire")

    # ---------- RIZ & BOLS ----------
    P("Riz cantonais", "Riz", 25, ["plaques"], ["riz", "économique"],
      ["riz", "oeufs", "jambon", "petits-pois", "carotte", ("sauce-soja", 1), ("huile-olive", 0.5)],
      ["Cuire le riz 10 à 12 min, l'égoutter et le laisser refroidir (idéalement de la veille). Couper le jambon et la carotte en petits dés.", "Battre les œufs, les cuire en omelette fine dans l'huile, puis les couper en lamelles.",
       "Faire sauter la carotte 4 min dans la poêle, ajouter les petits pois et le jambon 2 min.", "Ajouter le riz et la sauce soja, faire sauter 3 min à feu vif en remuant. Incorporer l'omelette et servir."], "Asiatique")
    P("Riz sauté au poulet et légumes", "Riz", 30, ["plaques"], ["riz", "poulet"],
      ["riz", "poulet", "carotte", "courgette", "oignon", ("sauce-soja", 1.5), ("huile-olive", 0.5), ("ail", 1)],
      ["Cuire le riz 10 à 12 min. Couper le poulet en lamelles, les légumes en petits dés, hacher l'ail.", "Faire dorer le poulet 6 min à feu vif dans l'huile, le réserver.", "Faire sauter l'oignon, la carotte puis la courgette 8 min avec l'ail.", "Remettre le poulet, ajouter le riz et la sauce soja, mélanger 3 min à feu vif."], "Asiatique")
    P("Risotto aux champignons et parmesan", "Riz", 40, ["plaques"], ["riz", "végétarien", "réconfort"],
      ["riz-risotto", "champignons", "oignon", "bouillon", ("parmesan", 0.8), ("beurre", 1), ("huile-olive", 0.3)],
      ["Faire chauffer le bouillon dans une casserole et le garder frémissant. Émincer l'oignon et les champignons.", "Faire revenir les champignons 6 min dans l'huile d'olive, les réserver.", "Faire fondre la moitié du beurre, suer l'oignon 3 min, ajouter le riz et le nacrer 2 min en remuant.",
       "Ajouter le bouillon louche par louche en remuant, en attendant que chaque louche soit absorbée (environ 18 min).", "Hors du feu, incorporer les champignons, le reste du beurre et le parmesan. Laisser reposer 2 min avant de servir."], "Italienne", diff="Intermédiaire")
    P("Risotto au poulet et au poireau", "Riz", 40, ["plaques"], ["riz", "poulet"],
      ["riz-risotto", ("poulet", 0.8), "poireau", "bouillon", ("parmesan", 0.6), ("beurre", 1), ("huile-olive", 0.3)],
      ["Chauffer le bouillon. Couper le poulet en petits dés, émincer le poireau.", "Faire dorer le poulet 5 min dans l'huile d'olive, le réserver.", "Faire fondre le beurre, cuire le poireau 5 min, ajouter le riz 2 min.", "Verser le bouillon louche par louche pendant 18 min en remuant. Remettre le poulet 3 min avant la fin.", "Incorporer le parmesan, poivrer et servir."], "Italienne", diff="Intermédiaire")
    P("Bol de riz au saumon et à l'avocat", "Riz", 25, ["plaques"], ["riz", "bol", "poisson"],
      ["riz", ("saumon", 0.8), "avocat", "concombre", ("sauce-soja", 1), "citron", ("sesame", 0.5)],
      ["Cuire le riz 10 à 12 min.", "Cuire le saumon 3 à 4 min de chaque côté à la poêle, puis l'effriter.", "Couper l'avocat et le concombre en tranches.", "Dans deux bols, disposer le riz, le saumon, l'avocat et le concombre. Arroser de jus de citron et de sauce soja, parsemer de sésame."], "Japonaise")
    P("Bol de riz au poulet teriyaki et brocoli", "Riz", 30, ["plaques"], ["riz", "bol", "poulet"],
      ["riz", "poulet", "brocoli", ("sauce-soja", 2), "miel", ("ail", 1), ("huile-olive", 0.5)],
      ["Cuire le riz. Couper le poulet en lamelles, détailler le brocoli en bouquets, hacher l'ail.", "Cuire le brocoli 5 min à la vapeur ou à l'eau bouillante.", "Faire dorer le poulet 6 min dans l'huile, ajouter l'ail 1 min.", "Verser la sauce soja et le miel, laisser caraméliser 2 min. Servir sur le riz avec le brocoli."], "Japonaise")
    P("Bol de quinoa, pois chiches et patate douce", "Salades", 40, ["four"], ["bol", "végétarien", "léger"],
      ["quinoa", "pois-chiches", "patate-douce", "epinards", "citron", ("huile-olive", 1), ("cumin", 1)],
      ["Préchauffer le four à 200 °C. Éplucher la patate douce et la couper en cubes.", "Mélanger patate douce et pois chiches égouttés avec l'huile et le cumin. Enfourner 25 min en retournant à mi-cuisson.", "Cuire le quinoa 12 min à l'eau salée.", "Dresser le quinoa, les épinards crus, la patate douce et les pois chiches rôtis. Arroser de jus de citron."], "Cuisine du monde")
    P("Taboulé de semoule", "Salades", 20, [], ["salade", "végétarien", "froid", "économique"],
      ["semoule", "tomate", "concombre", "oignon-rouge", "menthe", "persil", "citron", ("huile-olive", 1)],
      ["Verser la semoule dans un saladier, la recouvrir d'eau bouillante salée à hauteur, couvrir et laisser gonfler 10 min. L'égrener à la fourchette.", "Couper les tomates et le concombre en petits dés, émincer l'oignon, ciseler la menthe et le persil.", "Mélanger avec la semoule, le jus du citron et l'huile d'olive. Saler, poivrer. Laisser reposer 30 min au frais."], "Orientale")
    P("Boulgour au poulet et aux légumes", "Poêlées", 30, ["plaques"], ["poulet", "complet"],
      ["boulgour", "poulet", "courgette", "poivron", "oignon", ("huile-olive", 0.5), "cumin"],
      ["Couper le poulet, la courgette et le poivron en dés, émincer l'oignon.", "Faire dorer le poulet 6 min dans l'huile avec le cumin, ajouter l'oignon puis les légumes 8 min.", "Ajouter le boulgour et deux fois son volume d'eau bouillante salée. Couvrir et cuire 10 min à feu doux.", "Laisser reposer 3 min, égrener à la fourchette et servir."], "Orientale")
    P("Quinoa aux légumes et à la feta", "Salades", 30, ["plaques"], ["végétarien", "bol"],
      ["quinoa", "courgette", "poivron", "feta", "oignon-rouge", ("huile-olive", 1), "citron"],
      ["Cuire le quinoa 12 min à l'eau salée.", "Couper la courgette et le poivron en dés, les faire revenir 8 min dans l'huile d'olive avec l'oignon rouge émincé.", "Mélanger avec le quinoa, ajouter la feta émiettée et le jus du citron. Servir tiède."], "Méditerranéenne")

    # ---------- ŒUFS ----------
    P("Omelette au fromage", "Œufs", 10, ["plaques"], ["œufs", "végétarien", "express"],
      [("oeufs", 1), ("fromage-rape", 0.7), ("beurre", 0.3)],
      ["Battre les œufs avec du sel et du poivre.", "Faire fondre le beurre dans une poêle antiadhésive à feu moyen. Verser les œufs et remuer 30 secondes.", "Quand l'omelette est presque prise, parsemer de fromage, la plier en deux et laisser 1 min. Servir aussitôt."])
    P("Omelette aux champignons", "Œufs", 15, ["plaques"], ["œufs", "végétarien"],
      [("oeufs", 1), "champignons", ("beurre", 0.5), "persil"],
      ["Émincer les champignons et les faire revenir 6 min dans le beurre à feu vif, jusqu'à ce que l'eau s'évapore. Saler.", "Battre les œufs, les verser sur les champignons et cuire 3 min à feu moyen.", "Plier l'omelette, parsemer de persil et servir."])
    P("Omelette jambon-fromage", "Œufs", 10, ["plaques"], ["œufs", "express"],
      [("oeufs", 1), "jambon", ("fromage-rape", 0.7), ("beurre", 0.3)],
      ["Couper le jambon en lanières. Battre les œufs, saler légèrement (le jambon est salé), poivrer.", "Cuire les œufs dans le beurre 2 min à feu moyen, ajouter le jambon et le fromage sur une moitié.", "Plier l'omelette, laisser fondre 1 min et servir."])
    P("Tortilla espagnole aux pommes de terre", "Œufs", 45, ["plaques"], ["œufs", "végétarien", "économique", "familial"],
      [("oeufs", 1.5), "pomme-de-terre", "oignon", ("huile-olive", 2)],
      ["Éplucher les pommes de terre et les couper en fines rondelles, émincer l'oignon.", "Les cuire 15 min à feu doux dans l'huile d'olive, en remuant, jusqu'à ce qu'elles soient tendres sans dorer. Égoutter l'excédent d'huile.", "Battre les œufs, y mélanger les pommes de terre et l'oignon, saler.", "Cuire le mélange dans la poêle 5 min à feu moyen, retourner à l'aide d'une assiette et cuire encore 4 min. L'intérieur doit rester légèrement baveux."], "Espagnole")
    P("Œufs brouillés, tomates et feta", "Œufs", 15, ["plaques"], ["œufs", "végétarien", "express"],
      [("oeufs", 1), "tomate", "feta", ("huile-olive", 0.5), "basilic"],
      ["Couper les tomates en dés et les faire cuire 4 min dans l'huile d'olive.", "Battre les œufs, les verser et remuer doucement à feu doux 3 min jusqu'à une texture crémeuse.", "Émietter la feta, parsemer de basilic et poivrer. Servir avec du pain grillé."], "Méditerranéenne")
    P("Chakchouka aux œufs", "Œufs", 35, ["plaques"], ["œufs", "végétarien", "épicé"],
      [("oeufs", 1), "poivron", "oignon", "tomate-concassee", ("ail", 1), ("cumin", 1), ("paprika", 1), ("huile-olive", 1)],
      ["Émincer l'oignon et le poivron, hacher l'ail.", "Les faire revenir 8 min dans l'huile d'olive avec le cumin et le paprika.", "Ajouter la tomate concassée, saler et laisser mijoter 12 min.", "Creuser 4 puits dans la sauce, y casser les œufs, couvrir et cuire 5 à 6 min à feu doux, jusqu'à ce que les blancs soient pris. Servir avec du pain."], "Orientale")
    P("Œufs cocotte aux épinards", "Œufs", 25, ["four"], ["œufs", "végétarien"],
      [("oeufs", 1), "epinards", "creme", ("beurre", 0.3), ("fromage-rape", 0.5)],
      ["Préchauffer le four à 180 °C. Faire tomber les épinards 3 min dans le beurre, saler.", "Répartir les épinards et une cuillère de crème dans 2 ramequins beurrés. Casser 2 œufs dans chacun.", "Napper d'un peu de crème, parsemer de fromage. Enfourner 10 à 12 min : les blancs doivent être pris et les jaunes encore coulants."])
    P("Frittata courgette et chèvre", "Œufs", 30, ["plaques", "four"], ["œufs", "végétarien"],
      [("oeufs", 1), "courgette", "chevre", "oignon", ("huile-olive", 1)],
      ["Préchauffer le four à 200 °C. Couper la courgette en rondelles, émincer l'oignon.", "Les faire revenir 8 min dans une poêle allant au four, dans l'huile d'olive.", "Battre les œufs avec sel et poivre, verser sur les légumes, ajouter le chèvre en morceaux.", "Cuire 2 min sur le feu puis enfourner 10 à 12 min jusqu'à ce que la frittata soit dorée et ferme."], "Italienne")

    # ---------- SANDWICHS ----------
    P("Croque-monsieur", "Sandwichs", 15, ["four"], ["sandwich", "réconfort", "express"],
      ["pain-mie", "jambon", ("fromage-rape", 1), ("beurre", 0.5), ("creme", 0.3)],
      ["Préchauffer le four à 200 °C. Beurrer légèrement les tranches de pain de mie.", "Garnir de jambon et de fromage râpé, refermer. Napper le dessus d'un peu de crème et de fromage râpé.", "Enfourner 10 min, jusqu'à ce que le dessus soit doré et le fromage gratiné."])
    P("Croque-madame", "Sandwichs", 20, ["four", "plaques"], ["sandwich", "réconfort"],
      ["pain-mie", "jambon", ("fromage-rape", 1), ("oeufs", 0.5), ("beurre", 0.5)],
      ["Préparer deux croque-monsieur : jambon et fromage entre deux tranches de pain de mie, fromage râpé sur le dessus. Enfourner 10 min à 200 °C.", "Faire cuire 2 œufs au plat dans le beurre 3 min, jusqu'à ce que le blanc soit pris.", "Poser un œuf sur chaque croque et servir tout de suite."])
    P("Tartine avocat et œuf", "Sandwichs", 12, ["plaques"], ["sandwich", "végétarien", "express"],
      ["pain", "avocat", ("oeufs", 0.5), "citron", ("huile-olive", 0.3)],
      ["Faire griller le pain. Cuire les œufs 6 min 30 dans l'eau bouillante (jaune mollet), les rafraîchir et les écaler.", "Écraser l'avocat à la fourchette avec le jus du citron, du sel et du poivre.", "Tartiner le pain, déposer l'œuf coupé en deux et un filet d'huile d'olive."])
    P("Tartine de chèvre chaud, miel et noix", "Sandwichs", 15, ["four"], ["sandwich", "végétarien"],
      ["pain", "chevre", "miel", "noix", "salade"],
      ["Préchauffer le gril du four. Disposer le pain sur une plaque, déposer des rondelles de chèvre.", "Passer 5 à 6 min sous le gril, jusqu'à ce que le fromage soit doré.", "Napper de miel, parsemer de noix concassées et servir avec un peu de salade."])
    P("Wrap au poulet et crudités", "Sandwichs", 15, ["plaques"], ["sandwich", "poulet", "express"],
      ["wrap", ("poulet", 0.8), "salade", "tomate", "concombre", "yaourt", ("moutarde", 0.5)],
      ["Couper le poulet en lamelles et le faire dorer 6 min à la poêle, saler et poivrer.", "Mélanger le yaourt et la moutarde pour la sauce. Couper la tomate et le concombre en tranches.", "Garnir chaque wrap de salade, de légumes, de poulet et de sauce. Rouler serré."])
    P("Wrap au thon et à l'avocat", "Sandwichs", 10, [], ["sandwich", "poisson", "express"],
      ["wrap", "thon", "avocat", "citron", "salade", "tomate"],
      ["Écraser l'avocat avec le jus du citron, du sel et du poivre. Émietter le thon égoutté.", "Étaler l'avocat sur les wraps, ajouter le thon, la salade et la tomate en tranches.", "Rouler fermement et couper en deux."])
    P("Pita aux falafels et houmous", "Sandwichs", 15, ["four"], ["sandwich", "végétarien"],
      ["pita", "falafels", "houmous", "tomate", "concombre", "salade", "citron"],
      ["Réchauffer les falafels 8 min au four à 200 °C. Chauffer les pains pita 1 min.", "Ouvrir les pitas, tartiner de houmous.", "Garnir de falafels, de tomate et concombre en tranches, de salade et d'un filet de citron."], "Orientale")
    P("Bagel jambon-fromage", "Sandwichs", 10, ["four"], ["sandwich", "express"],
      ["bagel", "jambon", "emmental", "salade", ("moutarde", 0.5)],
      ["Couper les bagels en deux et les faire dorer 3 min au grille-pain ou au four.", "Tartiner de moutarde, garnir de jambon, de fromage et de salade.", "Refermer et servir."], "Américaine")
    P("Burger maison", "Sandwichs", 25, ["plaques"], ["sandwich", "boeuf", "familial"],
      ["pain", "boeuf-hache", "cheddar", "tomate", "salade", "oignon-rouge", ("ketchup", 1)],
      ["Former 2 steaks avec la viande hachée, saler et poivrer. Trancher la tomate et l'oignon rouge.", "Cuire les steaks 3 à 4 min de chaque côté dans une poêle très chaude. Ajouter une tranche de cheddar sur chaque steak en fin de cuisson.", "Toaster le pain, garnir de salade, de steak fondant, de tomate, d'oignon et de ketchup."], "Américaine")
    P("Panini mozzarella, tomate et basilic", "Sandwichs", 12, ["plaques"], ["sandwich", "végétarien", "express"],
      ["pain", "mozzarella", "tomate", "basilic", ("huile-olive", 0.3)],
      ["Trancher la mozzarella et les tomates. Ouvrir le pain.", "Garnir de mozzarella, de tomate et de basilic. Saler, poivrer, ajouter un filet d'huile d'olive.", "Faire dorer 3 min de chaque côté dans une poêle ou un appareil à panini, en pressant."], "Italienne")
    P("Tartine thon-tomate", "Sandwichs", 10, ["four"], ["sandwich", "poisson", "express", "économique"],
      ["pain", "thon", "tomate", "mayonnaise", "fromage-rape"],
      ["Émietter le thon et le mélanger à la mayonnaise. Couper la tomate en rondelles.", "Tartiner le pain, garnir de tomate, parsemer de fromage râpé.", "Gratiner 5 min sous le gril du four."])

    # ---------- TARTES & PIZZAS ----------
    P("Quiche lorraine", "Tartes", 55, ["four"], ["four", "familial", "tarte"],
      ["pate-brisee", ("lardons", 1.5), ("oeufs", 0.75), ("creme", 2), ("lait", 0.5), ("fromage-rape", 0.8)],
      ["Préchauffer le four à 180 °C. Étaler la pâte dans un moule et la piquer à la fourchette.", "Faire dorer les lardons 4 min à la poêle, les égoutter et les répartir sur la pâte.", "Battre les œufs avec la crème et le lait, saler peu, poivrer et ajouter de la noix de muscade. Verser sur les lardons, parsemer de fromage.", "Enfourner 35 min, jusqu'à ce que la quiche soit dorée et gonflée. Laisser tiédir 5 min."], "Française", serv=4)

    P("Quiche poireaux et chèvre", "Tartes", 55, ["four"], ["four", "végétarien", "tarte"],
      ["pate-brisee", "poireau", "chevre", ("oeufs", 0.75), ("creme", 2), ("lait", 0.5), ("beurre", 0.5)],
      ["Préchauffer le four à 180 °C. Émincer les poireaux et les faire fondre 8 min dans le beurre.", "Étaler la pâte dans un moule, la piquer, y répartir les poireaux et le chèvre en rondelles.", "Battre les œufs avec la crème et le lait, saler, poivrer, verser sur la garniture.", "Cuire 35 min jusqu'à ce que la quiche soit dorée."], serv=4)

    P("Quiche saumon et épinards", "Tartes", 55, ["four"], ["four", "poisson", "tarte"],
      ["pate-brisee", ("saumon", 0.8), "epinards", ("oeufs", 0.75), ("creme", 2), ("lait", 0.5), ("fromage-rape", 0.5)],
      ["Préchauffer le four à 180 °C. Faire tomber les épinards 3 min à la poêle, les presser. Couper le saumon en dés.", "Étaler la pâte dans un moule, y répartir épinards et saumon.", "Battre les œufs avec la crème et le lait, saler, poivrer. Verser sur la garniture et parsemer de fromage.", "Cuire 35 min jusqu'à ce que la quiche soit dorée."], serv=4)

    P("Quiche courgette et feta", "Tartes", 55, ["four"], ["four", "végétarien", "tarte"],
      ["pate-brisee", "courgette", "feta", ("oeufs", 0.75), ("creme", 2), ("lait", 0.5), "menthe"],
      ["Préchauffer le four à 180 °C. Couper les courgettes en rondelles et les faire revenir 6 min, saler.", "Étaler la pâte, y répartir les courgettes et la feta émiettée.", "Battre les œufs avec la crème et le lait, poivrer, verser sur la garniture.", "Cuire 35 min, parsemer de menthe ciselée à la sortie du four."], "Méditerranéenne", serv=4)

    P("Tarte à la tomate et à la moutarde", "Tartes", 45, ["four"], ["four", "végétarien", "tarte"],
      ["pate-brisee", "tomate", ("moutarde", 2), ("fromage-rape", 1), ("herbes-provence", 1), ("huile-olive", 0.3)],
      ["Préchauffer le four à 200 °C. Étaler la pâte dans un moule et la piquer.", "Tartiner le fond de moutarde, parsemer de la moitié du fromage râpé.", "Disposer les tomates en rondelles, saler légèrement, ajouter les herbes de Provence, le reste du fromage et un filet d'huile.", "Enfourner 30 min, jusqu'à ce que la pâte soit bien dorée."])
    P("Tarte aux épinards et au chèvre", "Tartes", 50, ["four"], ["four", "végétarien", "tarte"],
      ["pate-feuilletee", "epinards", "chevre", ("oeufs", 1), "creme", ("noix", 0.4)],
      ["Préchauffer le four à 190 °C. Faire tomber les épinards 3 min à la poêle, les presser.", "Étaler la pâte feuilletée dans un moule, la piquer.", "Mélanger les épinards avec les œufs battus et la crème, saler, poivrer. Verser sur la pâte, ajouter le chèvre en rondelles et les noix.", "Enfourner 30 min, jusqu'à ce que la tarte soit dorée."])
    P("Tarte fine courgette et ricotta", "Tartes", 40, ["four"], ["four", "végétarien", "tarte"],
      ["pate-feuilletee", "courgette", "ricotta", ("ail", 0.5), ("huile-olive", 0.5), "basilic"],
      ["Préchauffer le four à 200 °C. Dérouler la pâte sur une plaque, la piquer en laissant 2 cm de bord.", "Étaler la ricotta mélangée à l'ail haché, du sel et du poivre. Disposer les courgettes en fines rondelles.", "Arroser d'huile d'olive et enfourner 25 min. Parsemer de basilic."], "Italienne")
    P("Pizza margherita", "Pizzas", 25, ["four"], ["four", "végétarien", "pizza"],
      ["pate-pizza", "tomate-concassee", "mozzarella", "basilic", ("huile-olive", 0.5)],
      ["Préchauffer le four à 240 °C (ou le maximum) avec la plaque à l'intérieur.", "Étaler la pâte sur du papier cuisson. Étaler la tomate concassée, saler, ajouter un filet d'huile.", "Enfourner 8 min, ajouter la mozzarella déchirée, puis 4 à 5 min de plus. Parsemer de basilic."], "Italienne")
    P("Pizza jambon-champignons", "Pizzas", 25, ["four"], ["four", "pizza"],
      ["pate-pizza", "tomate-concassee", "jambon", "champignons", ("fromage-rape", 1), ("herbes-provence", 0.5)],
      ["Préchauffer le four à 240 °C. Émincer les champignons.", "Étaler la pâte, la recouvrir de tomate, de jambon en morceaux, de champignons et de fromage. Saupoudrer d'herbes.", "Enfourner 12 à 14 min, jusqu'à ce que le fromage soit doré."], "Italienne")
    P("Pizza chorizo et poivron", "Pizzas", 25, ["four"], ["four", "pizza", "épicé"],
      ["pate-pizza", "tomate-concassee", "chorizo", "poivron", "mozzarella", "oignon-rouge"],
      ["Préchauffer le four à 240 °C. Couper le chorizo en rondelles, le poivron en lanières, l'oignon rouge en fines lamelles.", "Étaler la pâte, la napper de tomate, répartir la garniture et la mozzarella.", "Enfourner 12 à 14 min."], "Italienne")
    P("Pizza chèvre et miel", "Pizzas", 25, ["four"], ["four", "végétarien", "pizza"],
      ["pate-pizza", "creme", "chevre", "miel", "oignon-rouge", "noix"],
      ["Préchauffer le four à 240 °C. Émincer l'oignon rouge.", "Étaler la pâte, la tartiner de crème, ajouter l'oignon et le chèvre en rondelles.", "Enfourner 12 min. À la sortie, arroser de miel et parsemer de noix."], "Italienne")
    P("Pizza quatre fromages", "Pizzas", 25, ["four"], ["four", "végétarien", "pizza", "gourmand"],
      ["pate-pizza", "creme", "mozzarella", "chevre", ("fromage-bleu", 0.6), ("parmesan", 0.5)],
      ["Préchauffer le four à 240 °C.", "Étaler la pâte, la tartiner de crème, répartir la mozzarella, le chèvre, le fromage bleu en morceaux.", "Enfourner 12 min. Parsemer de parmesan et de poivre à la sortie."], "Italienne")
    P("Feuilletés saucisse et moutarde", "Tartes", 35, ["four"], ["four", "familial"],
      ["pate-feuilletee", "saucisses", ("moutarde", 1), ("oeufs", 0.25)],
      ["Préchauffer le four à 200 °C. Dérouler la pâte et la couper en rectangles.", "Tartiner de moutarde, poser une saucisse sur chaque rectangle et rouler en fermant bien. Dorer au jaune d'œuf.", "Enfourner 25 min, jusqu'à ce que la pâte soit bien dorée."])
    return R
