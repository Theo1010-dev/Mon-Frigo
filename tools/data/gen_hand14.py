# -*- coding: utf-8 -*-
"""Recettes écrites à la main (14) : plats du midi et du soir."""
from gen_hand1 import H, COOK_PASTA


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    P("Potée au chou et saucisses", "Plats mijotés", 75, ["plaques"], ["hiver", "réconfort", "familial"],
      ["chou", "saucisses", ("lardons", 1), ("pomme-de-terre", 1), "carotte", "oignon", ("bouillon", 2)],
      ["Couper le chou en quartiers et le blanchir 5 min à l'eau bouillante, puis l'égoutter.",
       "Dans une cocotte, faire revenir les lardons et l'oignon émincé 5 min.",
       "Ajouter le chou, les carottes en tronçons, les saucisses piquées et le bouillon. Couvrir et cuire 30 min à feu doux.",
       "Ajouter les pommes de terre épluchées en gros morceaux et poursuivre 25 min. Poivrer et servir bien chaud avec de la moutarde."], "Auvergnate", serv=4)
    P("Waterzoi de poulet", "Plats mijotés", 50, ["plaques"], ["réconfort", "hiver"],
      ["poulet", "poireau", "carotte", ("celeri", 1), ("bouillon", 1.2), ("creme", 2), ("oeufs", 0.25), ("persil", 0.5), ("beurre", 1)],
      ["Couper le poireau, les carottes et le céleri en julienne fine.",
       "Les faire suer 5 min dans le beurre, puis ajouter le poulet en morceaux et le bouillon. Cuire 25 min à feu doux.",
       "Fouetter la crème avec le jaune d'œuf, verser dans la cocotte hors du feu en remuant pour lier la sauce sans faire bouillir.",
       "Rectifier l'assaisonnement et servir parsemé de persil, avec des pommes de terre vapeur."], "Belge")
    P("Parmentier de poisson", "Gratins & four", 55, ["four", "plaques"], ["familial", "poisson", "réconfort"],
      [("poisson-blanc", 1.2), ("pomme-de-terre", 1.5), ("lait", 1), ("beurre", 2), ("fromage-rape", 1), ("persil", 0.5), ("citron", 0.5)],
      ["Cuire les pommes de terre épluchées 20 min à l'eau bouillante salée, puis les écraser en purée avec le lait chaud et la moitié du beurre.",
       "Pocher le poisson 6 min dans de l'eau frémissante, l'égoutter et l'émietter avec le persil et le jus de citron.",
       "Préchauffer le four à 200 °C. Mettre le poisson dans un plat beurré, couvrir de purée, parsemer de fromage râpé et du reste de beurre.",
       "Gratiner 20 min."], "Française")
    P("Coquillettes jambon-emmental", "Pâtes", 15, ["plaques"], ["pâtes", "enfants", "économique", "réconfort"],
      ["pates", "jambon", "emmental", ("beurre", 1), ("creme", 0.5)],
      ["Cuire les coquillettes (ou d'autres petites pâtes) 9 min dans une grande casserole d'eau bouillante salée, puis les égoutter.",
       "Les remettre dans la casserole avec le beurre, la crème, le jambon coupé en dés et l'emmental râpé.",
       "Remuer 1 min à feu doux jusqu'à ce que le fromage file. Poivrer et servir aussitôt."], "Française")
    P("Poulet sauté au basilic thaï", "Poêlées", 20, ["plaques"], ["asiatique", "épicé", "rapide"],
      ["poulet", ("sauce-soja", 1.5), ("ail", 1), ("basilic", 1), ("poivron", 0.5), "riz", ("oeufs", 0.5), ("sucre", 0.1)],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.", "Hacher grossièrement le poulet au couteau et émincer le poivron.",
       "Faire sauter l'ail haché 30 s dans un filet d'huile, ajouter le poulet et le poivron et cuire 5 min à feu vif. Verser la sauce soja et une pincée de sucre.",
       "Hors du feu, ajouter les feuilles de basilic. Servir sur le riz avec un œuf au plat bien croustillant."], "Thaïlandaise")
    P("Poulet général Tao", "Poêlées", 30, ["plaques"], ["asiatique", "familial"],
      ["poulet", ("maizena", 1), ("sauce-soja", 2), ("miel", 2), "vinaigre", ("ail", 1), ("gingembre", 0.5), "riz", ("sesame", 1)],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.", "Couper le poulet en morceaux et les rouler dans la maïzena.",
       "Les faire dorer 6 à 8 min dans un bon filet d'huile, en plusieurs fois, puis les réserver.",
       "Dans la même poêle, chauffer la sauce soja, le miel, le vinaigre, l'ail et le gingembre râpés 2 min, remettre le poulet et l'enrober. Parsemer de sésame et servir avec le riz."], "Chinoise")
    P("Bœuf sauté aux oignons", "Poêlées", 25, ["plaques"], ["asiatique", "rapide"],
      ["boeuf", ("oignon", 2), ("sauce-soja", 2), ("gingembre", 0.5), ("maizena", 0.3), "riz", ("oignon-nouveau", 0.5)],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.", "Émincer finement le bœuf et le mélanger avec la maïzena et la moitié de la sauce soja.",
       "Faire sauter les oignons émincés 4 min à feu vif, ajouter le bœuf et le gingembre râpé et saisir 2 à 3 min.",
       "Verser le reste de la sauce soja, mélanger et servir sur le riz, parsemé d'oignon nouveau."], "Chinoise")
    P("Gyudon, bol de bœuf à la japonaise", "Riz", 25, ["plaques"], ["asiatique", "bol", "rapide"],
      ["riz", "boeuf", "oignon", ("sauce-soja", 2), ("sucre", 0.2), ("oeufs", 0.5), ("oignon-nouveau", 0.5)],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.",
       "Cuire l'oignon émincé 5 min dans 10 cl d'eau avec la sauce soja et le sucre.",
       "Ajouter le bœuf en tranches très fines et cuire 2 min à frémissement.",
       "Servir sur le riz, avec un œuf mollet ou poché et l'oignon nouveau ciselé."], "Japonaise")
    P("Souvlaki de porc, pita et tzatziki", "Sandwichs", 35, ["plaques"], ["été", "familial"],
      ["porc", ("citron", 0.5), "herbes-provence", ("huile-olive", 1.5), "pita", ("yaourt", 1), ("concombre", 0.5), ("ail", 0.5), "tomate", ("oignon-rouge", 0.5)],
      ["Couper le porc en cubes et le faire mariner 15 min avec le jus de citron, l'huile d'olive, les herbes de Provence, sel et poivre.",
       "Tzatziki : mélanger le yaourt avec le concombre râpé et pressé, l'ail haché, sel et poivre.",
       "Enfiler la viande sur des piques et la cuire 8 à 10 min dans une poêle chaude en retournant souvent.",
       "Servir dans les pains pita chauds avec la tomate, l'oignon rouge émincé et le tzatziki."], "Grecque")
    P("Burger végétarien aux haricots rouges", "Sandwichs", 35, ["plaques"], ["végétarien", "familial", "économique"],
      [("haricots-rouges", 1), ("chapelure", 1), ("oeufs", 0.25), "cumin", ("oignon", 0.5), ("pain", 1.5), "cheddar", ("salade", 0.3), ("tomate", 0.5), ("ketchup", 1)],
      ["Égoutter et rincer les haricots rouges, puis les écraser grossièrement à la fourchette.",
       "Ajouter l'oignon haché finement, l'œuf, la chapelure, le cumin, sel et poivre. Former 2 galettes épaisses.",
       "Les dorer 4 min de chaque côté dans une poêle huilée, poser une tranche de cheddar à la fin pour qu'elle fonde.",
       "Garnir les pains à burger (ou des tranches de pain grillé) de salade, de tomate, de la galette et de ketchup."], "Américaine")
    P("Tajine de légumes aux pois chiches", "Plats mijotés", 50, ["plaques"], ["végétarien", "épicé", "économique"],
      ["courgette", "carotte", "pois-chiches", ("tomate-concassee", 0.6), "oignon", "epices", ("raisins-secs", 0.5), ("coriandre", 0.5), "semoule"],
      ["Faire revenir l'oignon émincé 4 min dans un filet d'huile avec les épices (ras el hanout).",
       "Ajouter les carottes en rondelles, la tomate concassée et 20 cl d'eau. Couvrir et cuire 15 min.",
       "Ajouter la courgette en morceaux, les pois chiches égouttés et les raisins secs, puis cuire encore 15 min.",
       "Préparer la semoule dans son volume d'eau bouillante salée. Servir le tajine parsemé de coriandre."], "Marocaine")
    P("Œufs à la florentine", "Œufs", 25, ["four", "plaques"], ["végétarien", "réconfort"],
      [("epinards", 2), "oeufs", ("bechamel", 1), ("fromage-rape", 0.7), ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Faire tomber les épinards 3 min dans le beurre, saler et poivrer.",
       "Les répartir dans un plat, creuser 4 nids et y casser les œufs.",
       "Napper de béchamel autour des jaunes, parsemer de fromage râpé et cuire 10 à 12 min : le blanc doit être pris et le jaune encore coulant."], "Française")
    P("Boulettes de poulet au citron, sauce yaourt", "Poêlées", 35, ["plaques"], ["familial", "léger"],
      ["poulet", ("chapelure", 0.6), ("oeufs", 0.25), ("citron", 1), ("persil", 1), ("ail", 0.5), "yaourt", "boulgour"],
      ["Hacher le poulet au couteau, le mélanger avec la chapelure, l'œuf, le zeste du citron, la moitié du persil, l'ail, sel et poivre. Former des boulettes.",
       "Cuire le boulgour 10 min dans deux fois son volume d'eau bouillante salée.",
       "Dorer les boulettes 10 min dans une poêle huilée en les retournant.",
       "Mélanger le yaourt avec le jus du citron et le reste du persil. Servir les boulettes sur le boulgour, avec la sauce."], "Méditerranéenne")
    P("Parmentier végétarien aux lentilles", "Gratins & four", 60, ["four", "plaques"], ["végétarien", "économique", "réconfort"],
      ["lentilles", "carotte", "oignon", ("tomate-concassee", 0.5), ("pomme-de-terre", 1.5), ("lait", 1), ("beurre", 2), ("fromage-rape", 1), "herbes-provence"],
      ["Cuire les lentilles 20 min à l'eau non salée, puis les égoutter.",
       "Faire revenir l'oignon et les carottes en petits dés 5 min, ajouter les lentilles, la tomate concassée et les herbes de Provence, saler et laisser mijoter 10 min.",
       "Cuire les pommes de terre épluchées 20 min à l'eau salée et les écraser en purée avec le lait chaud et le beurre.",
       "Préchauffer le four à 200 °C. Étaler les lentilles dans un plat, couvrir de purée et de fromage râpé, puis gratiner 20 min."], "Française", serv=4)
    P("Saumon, purée de céleri et beurre citronné", "Poisson", 40, ["plaques"], ["poisson", "hiver"],
      ["saumon", ("celeri", 3), ("pomme-de-terre", 0.5), ("lait", 1), ("beurre", 2), ("citron", 0.5), ("ciboulette", 0.5)],
      ["Éplucher le céleri-rave et la pomme de terre, les couper en cubes et les cuire 20 min à l'eau salée.",
       "Les écraser en purée avec le lait chaud et la moitié du beurre.",
       "Cuire le saumon 4 min côté peau puis 2 min de l'autre côté dans une poêle chaude.",
       "Faire fondre le reste du beurre avec le jus de citron et la ciboulette ciselée. Servir le saumon sur la purée, nappé de beurre citronné."], "Française")
    P("Lasagnes au poulet et aux champignons", "Gratins & four", 70, ["four", "plaques"], ["familial", "réconfort"],
      ["lasagnes", ("poulet", 1.2), "champignons", ("bechamel", 2), "oignon", ("fromage-rape", 1.5), ("epinards", 1)],
      ["Préchauffer le four à 190 °C. Faire revenir l'oignon émincé et le poulet en petits morceaux 6 min, puis ajouter les champignons émincés 5 min et les épinards 2 min. Saler, poivrer.",
       "Mélanger la moitié de la béchamel avec cette garniture.",
       "Dans un plat, alterner feuilles de lasagnes et garniture, finir par des feuilles et le reste de béchamel.",
       "Parsemer de fromage râpé et cuire 35 min."], "Italienne", serv=4)
    P("Escalopes de dinde à la crème et aux champignons", "Poêlées", 25, ["plaques"], ["familial", "rapide"],
      ["dinde", "champignons", ("creme", 2), ("oignon", 0.5), "riz", ("persil", 0.5)],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.", "Dorer les escalopes 3 min de chaque côté dans un filet d'huile, puis les réserver.",
       "Dans la même poêle, faire revenir l'oignon et les champignons émincés 6 min.",
       "Verser la crème, remettre les escalopes et laisser mijoter 4 min. Parsemer de persil et servir avec le riz."], "Française")
    P("Gnocchis maison au beurre et parmesan", "Pâtes", 60, ["plaques"], ["végétarien", "week-end", "réconfort"],
      [("pomme-de-terre", 1.2), ("farine", 1.5), ("oeufs", 0.25), ("beurre", 2), ("parmesan", 1)],
      ["Cuire les pommes de terre avec la peau 25 min à l'eau salée, les éplucher encore chaudes et les écraser finement.",
       "Ajouter l'œuf, une pincée de sel et la farine petit à petit, jusqu'à obtenir une pâte souple qui ne colle plus.",
       "Rouler en boudins, couper des tronçons de 2 cm et les marquer à la fourchette.",
       "Les plonger dans l'eau bouillante salée : ils sont cuits quand ils remontent. Les égoutter et les faire dorer 2 min dans le beurre. Servir avec le parmesan."], "Italienne", diff="Intermédiaire")
    return R
