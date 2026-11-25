# -*- coding: utf-8 -*-
"""Recettes écrites à la main (17) : des cuisines du passeport qui n'avaient qu'une ou deux recettes
(Portugal, Australie, Québec, Picardie, Sud-Ouest, Suède, Russie, Maghreb, Irlande, Auvergne, Réunion, Pérou, Brésil,
Limousin, Normandie, Allemagne, Corée, Indonésie, Turquie, Cambodge, Antilles, Scandinavie…)."""
from gen_hand1 import H

D = ("Dessert", "Goûter")
APERO = ("Apéritif", "Entrée")
ENTREE = ("Entrée", "Déjeuner", "Dîner")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- Portugal ----------
    P("Bacalhau à Brás, cabillaud aux pommes de terre et aux œufs", "Poisson", 35, ["plaques"], ["familial", "réconfort"],
      [("cabillaud", 1), ("pomme-de-terre", 0.8), ("oeufs", 1), ("oignon", 1), ("olives", 0.6), ("persil", 1), ("huile-olive", 1.5), ("ail", 0.5)],
      ["Couper les pommes de terre en très fines allumettes et les dorer 10 min dans la moitié de l'huile d'olive, à feu vif. Les réserver sur du papier absorbant et saler.",
       "Pocher le cabillaud 5 min dans de l'eau frémissante, l'égoutter et l'effeuiller en retirant la peau et les arêtes.",
       "Faire fondre l'oignon émincé et l'ail haché 6 min dans le reste d'huile. Ajouter le cabillaud et les pommes de terre et mélanger.",
       "Battre les œufs, les verser dans la poêle et remuer 1 à 2 min hors du feu : ils doivent rester crémeux. Poivrer, parsemer de persil et d'olives."], "Portugaise")
    P("Caldo verde, soupe au chou et au chorizo", "Soupes", 40, ["plaques"], ["économique", "hiver", "réconfort"],
      [("pomme-de-terre", 0.8), ("chou", 0.8), ("chorizo", 0.8), ("oignon", 1), ("ail", 0.5), ("huile-olive", 1)],
      ["Faire revenir l'oignon et l'ail hachés 4 min dans l'huile d'olive.",
       "Ajouter les pommes de terre en morceaux, couvrir d'un litre d'eau salée et cuire 20 min. Mixer ou écraser grossièrement.",
       "Émincer le chou en très fines lanières, l'ajouter à la soupe avec le chorizo en rondelles et cuire encore 6 min. Poivrer et servir avec un filet d'huile."], "Portugaise", meal=ENTREE)
    P("Riz au canard et au chorizo au four", "Riz", 70, ["plaques", "four"], ["week-end", "familial"],
      [("canard", 1), ("riz", 1.2), ("chorizo", 0.8), ("oignon", 1), ("bouillon", 1), ("orange", 0.5)],
      ["Dorer les morceaux de canard 8 min côté peau dans une cocotte, puis les retourner 2 min et les réserver.",
       "Dans la graisse, faire revenir l'oignon émincé 4 min, ajouter le riz et le nacrer 2 min.",
       "Verser le bouillon chaud et le jus de l'orange, remettre le canard, couvrir et cuire 15 min à feu doux.",
       "Disposer le chorizo en rondelles sur le dessus et passer 15 min au four à 200 °C, jusqu'à ce que le riz soit doré."], "Portugaise", diff="Moyen")
    # ---------- Australie ----------
    P("Lamingtons au chocolat et à la noix de coco", "Desserts", 60, ["four", "plaques"], ["goûter", "enfants", "fête"],
      [("farine", 1.2), ("sucre", 2), ("beurre", 4), ("oeufs", 0.75), ("levure", 0.5), ("lait", 0.5), ("chocolat", 1), ("noix-coco", 2)],
      ["Préchauffer le four à 180 °C. Fouetter les œufs avec le sucre jusqu'à ce que le mélange blanchisse, ajouter le beurre fondu (garder 20 g), le lait, puis la farine et la levure.",
       "Verser dans un moule carré beurré et cuire 25 min. Laisser refroidir complètement et couper en cubes.",
       "Faire fondre le chocolat avec le beurre restant et 5 cl d'eau.",
       "Tremper chaque cube dans le chocolat, puis le rouler dans la noix de coco. Laisser prendre 15 min."], "Australienne", meal=D, serv=8, diff="Moyen")
    P("Biscuits Anzac à l'avoine et à la noix de coco", "Desserts", 25, ["four", "plaques"], ["goûter", "enfants", "économique"],
      [("flocons-avoine", 1), ("noix-coco", 1.5), ("farine", 0.8), ("sucre", 1.5), ("beurre", 5), ("miel", 2)],
      ["Préchauffer le four à 170 °C. Mélanger les flocons d'avoine, la noix de coco, la farine et le sucre.",
       "Faire fondre le beurre avec le miel et 2 cuillères à soupe d'eau, puis verser sur le mélange sec et bien mélanger.",
       "Former des boules, les aplatir sur une plaque recouverte de papier cuisson en les espaçant, et cuire 12 à 14 min : ils doivent être dorés.",
       "Laisser durcir 10 min sur la plaque avant de les décoller."], "Australienne", meal=D, serv=6)
    # ---------- Québec ----------
    P("Pâté chinois", "Gratins & four", 55, ["plaques", "four"], ["familial", "réconfort", "enfants"],
      [("boeuf-hache", 1.2), ("mais", 1), ("pomme-de-terre", 1.2), ("oignon", 1), ("beurre", 1.5), ("lait", 0.5)],
      ["Cuire les pommes de terre en morceaux 20 min à l'eau salée, puis les écraser avec le beurre et le lait chaud. Saler, poivrer.",
       "Faire revenir l'oignon haché 3 min, ajouter le bœuf haché et cuire 6 min en émiettant. Saler, poivrer.",
       "Dans un plat, étaler la viande, puis le maïs égoutté, et recouvrir de purée.",
       "Enfourner 20 min à 200 °C, jusqu'à ce que le dessus soit doré."], "Québécoise")
    P("Pouding chômeur", "Desserts", 50, ["four", "plaques"], ["réconfort", "économique", "hiver"],
      [("farine", 1.2), ("sucre", 3), ("beurre", 3), ("lait", 0.6), ("levure", 0.5), ("eau", 1)],
      ["Préchauffer le four à 180 °C. Mélanger la farine, la levure, la moitié du sucre, le beurre mou (garder 20 g) et le lait pour obtenir une pâte épaisse ; l'étaler dans un plat beurré.",
       "Porter à ébullition 30 cl d'eau avec le reste du sucre et le beurre restant pendant 3 min pour faire un sirop.",
       "Verser le sirop bouillant doucement sur la pâte : il passe dessous pendant la cuisson.",
       "Cuire 30 min : le dessus est doré, le fond devient un caramel. Servir tiède."], "Québécoise", meal=D, serv=6)
    # ---------- Picardie, Sud-Ouest, Périgord, Limousin, Auvergne, Normandie ----------
    P("Flamiche aux poireaux", "Tartes & pizzas", 55, ["plaques", "four"], ["végétarien", "hiver", "familial"],
      [("pate-brisee", 1), ("poireau", 1.5), ("creme", 2), ("oeufs", 0.75), ("beurre", 1.5)],
      ["Préchauffer le four à 200 °C. Émincer finement les poireaux et les faire fondre 15 min dans le beurre à feu doux. Saler, poivrer.",
       "Étaler la pâte brisée dans un moule et la piquer à la fourchette.",
       "Battre les œufs avec la crème, ajouter les poireaux et verser sur la pâte.",
       "Cuire 30 min, jusqu'à ce que la flamiche soit bien dorée. Servir chaud avec une salade."], "Picarde", serv=4)
    P("Garbure express", "Soupes", 50, ["plaques"], ["hiver", "réconfort", "familial"],
      [("chou", 1), ("haricots-blancs", 1), ("carotte", 0.7), ("pomme-de-terre", 0.6), ("poireau", 0.6), ("lardons", 1), ("ail", 0.5)],
      ["Faire revenir les lardons 4 min dans une grande casserole.",
       "Ajouter la carotte, le poireau et les pommes de terre en morceaux, l'ail haché, puis 1,2 litre d'eau. Saler peu, poivrer et cuire 20 min.",
       "Ajouter le chou émincé et les haricots blancs égouttés, et cuire encore 15 min.",
       "Servir bien chaud, très épais, avec une tranche de pain grillé."], "Sud-Ouest")
    P("Pommes de terre sarladaises", "Poêlées", 40, ["plaques"], ["végétarien", "réconfort", "économique"],
      [("pomme-de-terre", 1.2), ("ail", 1), ("persil", 1.5), ("beurre", 1.5), ("huile-olive", 1), ("salade", 0.7)],
      ["Éplucher les pommes de terre et les couper en rondelles de 3 mm. Les rincer et bien les sécher.",
       "Les faire dorer 10 min dans le beurre et l'huile d'olive à feu vif en les retournant, puis couvrir et cuire 15 min à feu doux.",
       "Hacher l'ail et le persil, les ajouter 2 min avant la fin. Saler, poivrer.",
       "Servir avec la salade verte."], "Périgourdine")
    P("Pâté aux pommes de terre", "Tartes & pizzas", 80, ["plaques", "four"], ["végétarien", "familial", "week-end"],
      [("pate-feuilletee", 2), ("pomme-de-terre", 1.2), ("creme", 2), ("oignon", 0.5), ("persil", 1), ("ail", 0.5), ("oeufs", 0.25)],
      ["Préchauffer le four à 190 °C. Couper les pommes de terre en rondelles très fines et les mélanger avec l'oignon et l'ail hachés, le persil, du sel et du poivre.",
       "Étaler une pâte feuilletée dans un moule, y ranger les pommes de terre et couvrir de la seconde pâte. Souder les bords et faire une cheminée au centre.",
       "Dorer avec l'œuf battu et cuire 50 min.",
       "À la sortie du four, verser la crème par la cheminée et attendre 5 min avant de servir."], "Limousine", serv=4, diff="Moyen")
    P("Pounti aux pruneaux", "Gratins & four", 60, ["four"], ["familial", "réconfort"],
      [("jambon", 1.5), ("epinards", 0.8), ("pruneaux", 1), ("oeufs", 0.75), ("farine", 0.8), ("lait", 1), ("oignon", 0.5), ("persil", 1)],
      ["Préchauffer le four à 180 °C. Hacher le jambon, les épinards, l'oignon et le persil.",
       "Fouetter les œufs avec la farine, puis le lait petit à petit. Ajouter le hachis, saler peu et poivrer.",
       "Verser dans un moule beurré et y enfoncer les pruneaux.",
       "Cuire 40 min : la lame d'un couteau doit ressortir sèche. Servir chaud ou tiède avec une salade."], "Auvergnate", serv=4)
    P("Truffade", "Poêlées", 45, ["plaques"], ["réconfort", "hiver", "familial"],
      [("pomme-de-terre", 1.3), ("raclette", 1), ("lardons", 1), ("ail", 0.5), ("salade", 0.7)],
      ["Couper les pommes de terre en fines lamelles. Faire revenir les lardons 3 min dans une grande poêle.",
       "Ajouter les pommes de terre et l'ail haché, et cuire 25 min à feu moyen, couvert, en remuant de temps en temps. Saler peu, poivrer.",
       "Ajouter le fromage à raclette en lamelles et mélanger jusqu'à ce qu'il file.",
       "Laisser dorer 2 min sans remuer et servir avec la salade."], "Auvergnate")
    P("Teurgoule, riz au lait à la cannelle", "Desserts", 190, ["four"], ["réconfort", "économique", "week-end"],
      [("riz", 0.6), ("lait", 5), ("sucre", 1.5), ("cannelle", 1)],
      ["Préchauffer le four à 150 °C.", "Dans un plat en terre, mélanger le riz rond rincé, le sucre et la cannelle, puis verser le lait froid.",
       "Cuire 3 heures sans remuer : une croûte brune se forme et le riz devient très crémeux.",
       "Servir tiède ou froid."], "Normande", meal=D, serv=6)
    # ---------- Europe du Nord et de l'Est ----------
    P("Boulettes suédoises sauce crème et purée", "Poêlées", 45, ["plaques"], ["familial", "enfants", "réconfort"],
      [("boeuf-hache", 1.2), ("chapelure", 0.6), ("oignon", 0.5), ("creme", 1.5), ("bouillon", 0.5), ("pomme-de-terre", 1), ("beurre", 2), ("confiture", 0.7)],
      ["Cuire les pommes de terre 20 min à l'eau salée et les écraser en purée avec la moitié du beurre.",
       "Mélanger le bœuf haché, la chapelure, l'oignon râpé, du sel et du poivre ; former de petites boulettes.",
       "Les dorer 8 min dans le reste du beurre, puis verser le bouillon et la crème et laisser épaissir 5 min.",
       "Servir avec la purée et une cuillère de confiture de fruits rouges, comme en Suède."], "Suédoise")
    P("Salade de pommes de terre au saumon fumé et à l'aneth", "Salades", 30, ["plaques"], ["été", "pique-nique"],
      [("pomme-de-terre", 1), ("saumon-fume", 1.2), ("aneth", 1), ("creme", 1), ("citron", 0.5), ("oignon-rouge", 0.5), ("concombre", 0.5)],
      ["Cuire les pommes de terre 20 min à l'eau salée, les laisser tiédir et les couper en rondelles.",
       "Mélanger la crème avec le jus du citron, l'aneth ciselé, du sel et du poivre.",
       "Ajouter l'oignon rouge émincé finement et le concombre en dés.",
       "Mélanger avec les pommes de terre et déposer le saumon fumé en lanières."], "Scandinave", meal=ENTREE)
    P("Salade Olivier", "Salades", 35, ["plaques"], ["fête", "pique-nique"],
      [("pomme-de-terre", 0.8), ("carotte", 0.5), ("petits-pois", 0.6), ("cornichons", 1), ("oeufs", 0.5), ("mayonnaise", 3), ("jambon", 1)],
      ["Cuire les pommes de terre et la carotte entières 20 min à l'eau salée, et les œufs 9 min. Ajouter les petits pois les 3 dernières minutes.",
       "Laisser refroidir, puis couper les pommes de terre, la carotte, les œufs, le jambon et les cornichons en petits dés.",
       "Mélanger avec les petits pois et la mayonnaise. Saler, poivrer.",
       "Servir bien frais."], "Russe", meal=ENTREE)
    P("Blinis maison au saumon fumé", "Sandwichs", 40, ["plaques"], ["apéritif", "fête"],
      [("farine", 1), ("lait", 1), ("oeufs", 0.5), ("levure", 0.5), ("saumon-fume", 1.2), ("creme", 1), ("aneth", 1)],
      ["Mélanger la farine et la levure, ajouter les œufs puis le lait petit à petit pour obtenir une pâte épaisse. Saler et laisser reposer 15 min.",
       "Dans une poêle légèrement graissée, cuire de petites cuillerées de pâte 1 min par face.",
       "Mélanger la crème avec l'aneth ciselé, du sel et du poivre.",
       "Garnir chaque blini de crème et d'un morceau de saumon fumé."], "Russe", meal=APERO, serv=4)
    P("Colcannon et saucisses", "Poêlées", 40, ["plaques"], ["réconfort", "hiver", "économique"],
      [("pomme-de-terre", 1.2), ("chou", 0.8), ("beurre", 2), ("lait", 0.5), ("oignon-nouveau", 1), ("saucisses", 1)],
      ["Cuire les pommes de terre 20 min à l'eau salée et les écraser avec la moitié du beurre et le lait chaud.",
       "Émincer le chou et le faire revenir 8 min dans le reste du beurre.",
       "Mélanger le chou et l'oignon nouveau ciselé à la purée. Saler, poivrer.",
       "Dorer les saucisses 10 min à la poêle et servir avec le colcannon."], "Irlandaise")
    P("Pain soda irlandais", "Petit-déjeuner", 50, ["four"], ["économique", "végétarien", "week-end"],
      [("farine", 3), ("levure", 1), ("yaourt", 1), ("lait", 0.5), ("sel", 1)],
      ["Préchauffer le four à 200 °C. Mélanger la farine, la levure et le sel.",
       "Ajouter le yaourt et le lait, et mélanger rapidement juste assez pour former une boule (sans pétrir).",
       "Poser sur une plaque farinée, inciser une croix profonde sur le dessus.",
       "Cuire 35 min : le pain sonne creux quand on tape dessous. Le manger tiède avec du beurre."], "Irlandaise", meal=("Petit-déjeuner", "Goûter"), serv=6)
    P("Spätzle au fromage et oignons dorés", "Pâtes", 35, ["plaques", "four"], ["végétarien", "réconfort", "hiver"],
      [("farine", 1.5), ("oeufs", 0.75), ("lait", 0.5), ("emmental", 1.5), ("oignon", 1.5), ("beurre", 2)],
      ["Fouetter la farine, les œufs, le lait et une pincée de sel jusqu'à une pâte épaisse et collante. Laisser reposer 10 min.",
       "Faire dorer les oignons émincés 12 min dans le beurre.",
       "Faire tomber la pâte en petits morceaux dans l'eau bouillante salée (à la cuillère ou à travers une passoire à gros trous). Ils sont cuits dès qu'ils remontent.",
       "Alterner dans un plat spätzle et emmental râpé, couvrir d'oignons et passer 5 min au four à 200 °C."], "Allemande")
    P("Strudel aux pommes", "Desserts", 55, ["four"], ["automne", "goûter", "week-end"],
      [("pate-feuilletee", 1), ("pomme", 2), ("raisins-secs", 1), ("cannelle", 1), ("sucre", 1), ("chapelure", 0.6), ("beurre", 2)],
      ["Préchauffer le four à 190 °C. Éplucher les pommes et les couper en petits dés.",
       "Mélanger les pommes avec les raisins secs, le sucre et la cannelle.",
       "Étaler la pâte feuilletée, la badigeonner de beurre fondu, parsemer de chapelure sur la moitié, puis répartir les pommes dessus.",
       "Rouler la pâte, souder les bords, badigeonner du reste de beurre et cuire 35 min. Servir tiède."], "Allemande", meal=D, serv=6)
    # ---------- Maghreb, Turquie ----------
    P("Chorba frik à l'agneau", "Soupes", 70, ["plaques"], ["hiver", "réconfort", "mijoté"],
      [("agneau", 0.7), ("tomate-concassee", 0.5), ("pois-chiches", 0.6), ("oignon", 1), ("celeri", 0.5), ("coriandre", 1.5), ("pates", 0.25), ("epices", 1)],
      ["Couper l'agneau en petits dés et le faire revenir 5 min avec l'oignon haché et les épices.",
       "Ajouter la tomate concassée, le céleri en dés, la moitié de la coriandre ciselée et 1,2 litre d'eau. Saler, poivrer et cuire 45 min à feu doux.",
       "Ajouter les pois chiches égouttés et les pâtes (vermicelles ou plombs) et cuire 10 min.",
       "Servir parsemé du reste de coriandre, avec un quartier de citron si tu en as."], "Maghrébine", meal=ENTREE)
    P("Loubia, haricots blancs à la tomate et au cumin", "Plats mijotés", 35, ["plaques"], ["végétarien", "économique", "réconfort"],
      [("haricots-blancs", 1.5), ("tomate-concassee", 0.8), ("oignon", 1), ("ail", 1), ("cumin", 1), ("paprika", 1), ("huile-olive", 1), ("pain", 1)],
      ["Faire revenir l'oignon haché 4 min dans l'huile d'olive, ajouter l'ail haché, le cumin et le paprika 1 min.",
       "Verser la tomate concassée et 20 cl d'eau, saler, poivrer et laisser mijoter 10 min.",
       "Ajouter les haricots blancs égouttés et cuire encore 15 min jusqu'à ce que la sauce épaississe.",
       "Servir bien chaud avec du pain."], "Maghrébine")
    P("Menemen, œufs brouillés à la tomate et au poivron", "Œufs", 20, ["plaques"], ["végétarien", "rapide", "économique"],
      [("oeufs", 1), ("tomate", 1), ("poivron", 0.7), ("oignon", 0.5), ("huile-olive", 1), ("pain", 1)],
      ["Faire revenir l'oignon et le poivron émincés 5 min dans l'huile d'olive.",
       "Ajouter la tomate en dés, saler, poivrer et cuire 5 min jusqu'à ce qu'elle compote.",
       "Casser les œufs dans la poêle et remuer doucement 2 min : ils doivent rester moelleux.",
       "Servir aussitôt avec du pain."], "Turque", meal=("Petit-déjeuner", "Déjeuner", "Dîner"))
    # ---------- Réunion, Antilles ----------
    P("Cari de poulet réunionnais", "Curry", 50, ["plaques"], ["familial", "épicé"],
      [("poulet", 1.2), ("tomate", 1), ("oignon", 1), ("ail", 1), ("gingembre", 1), ("curcuma", 1), ("riz", 1), ("huile-olive", 1)],
      ["Couper le poulet en morceaux et le faire dorer 8 min dans l'huile.",
       "Ajouter l'oignon émincé, l'ail et le gingembre écrasés et le curcuma, et cuire 3 min.",
       "Ajouter les tomates en dés, saler, poivrer, couvrir et laisser mijoter 25 min à feu doux.",
       "Pendant ce temps, cuire le riz 12 min à l'eau salée. Servir le cari avec le riz."], "Réunionnaise")
    P("Gâteau patate douce coco", "Desserts", 70, ["plaques", "four"], ["goûter", "automne"],
      [("patate-douce", 1.2), ("sucre", 2), ("oeufs", 0.75), ("lait-coco", 1), ("farine", 0.5), ("vanille", 1), ("cannelle", 0.5), ("beurre", 2)],
      ["Cuire la patate douce en morceaux 20 min à l'eau, l'égoutter et l'écraser en purée.",
       "Préchauffer le four à 180 °C. Mélanger la purée avec le beurre fondu, le sucre, les œufs, le lait de coco, la vanille et la cannelle.",
       "Ajouter la farine et verser dans un moule beurré.",
       "Cuire 40 min : le gâteau doit être ferme au centre. Le servir froid."], "Réunionnaise", meal=D, serv=6)
    P("Accras de cabillaud", "Poisson", 40, ["plaques"], ["apéritif", "fête"],
      [("cabillaud", 1), ("farine", 1), ("oeufs", 0.25), ("levure", 0.5), ("oignon-nouveau", 1), ("persil", 1), ("ail", 0.5), ("citron-vert", 1)],
      ["Pocher le cabillaud 5 min dans l'eau frémissante, l'égoutter et l'émietter.",
       "Mélanger la farine, la levure, l'œuf et 15 cl d'eau pour obtenir une pâte épaisse. Ajouter le cabillaud, l'oignon nouveau, le persil et l'ail hachés. Saler, poivrer.",
       "Faire frire des petites cuillerées de pâte 3 à 4 min dans l'huile bien chaude, jusqu'à ce qu'elles soient dorées.",
       "Égoutter sur du papier absorbant et servir chaud avec le citron vert."], "Antillaise", meal=APERO, diff="Moyen")
    # ---------- Amériques du Sud ----------
    P("Lomo saltado, bœuf sauté aux frites", "Poêlées", 35, ["four", "plaques"], ["familial", "épicé"],
      [("boeuf", 1), ("oignon-rouge", 1), ("tomate", 0.7), ("frites", 0.8), ("sauce-soja", 1), ("vinaigre", 1), ("riz", 0.8), ("coriandre", 1), ("ail", 0.5)],
      ["Cuire les frites au four selon le paquet et le riz 12 min à l'eau salée.",
       "Couper le bœuf en lanières et le saisir 2 min à feu très vif. Le réserver.",
       "Dans la même poêle, faire sauter l'oignon rouge en quartiers et l'ail 3 min, puis la tomate en quartiers 1 min.",
       "Remettre le bœuf, verser la sauce soja et le vinaigre, mélanger 1 min puis ajouter les frites et la coriandre. Servir avec le riz."], "Péruvienne")
    P("Causa au thon et à l'avocat", "Salades", 40, ["plaques"], ["été", "fête"],
      [("pomme-de-terre", 1), ("citron-vert", 1.5), ("thon", 1), ("avocat", 1), ("mayonnaise", 2), ("huile-olive", 1)],
      ["Cuire les pommes de terre 20 min à l'eau salée, puis les écraser en purée lisse avec l'huile d'olive et le jus d'un citron vert. Saler, poivrer, laisser refroidir.",
       "Mélanger le thon émietté avec la mayonnaise.",
       "Écraser l'avocat avec le reste du citron vert et une pincée de sel.",
       "Dans un cercle ou un verre, monter des couches : purée, thon, avocat, purée. Servir frais."], "Péruvienne", meal=ENTREE, diff="Moyen")
    P("Feijoada express", "Plats mijotés", 50, ["plaques"], ["familial", "réconfort", "week-end"],
      [("haricots-rouges", 1.5), ("saucisses", 1), ("lardons", 1), ("oignon", 1), ("ail", 1), ("riz", 1), ("orange", 0.5)],
      ["Faire revenir les lardons et les saucisses en rondelles 5 min, ajouter l'oignon et l'ail hachés 3 min.",
       "Ajouter les haricots rouges égouttés et 30 cl d'eau, saler peu, poivrer et laisser mijoter 25 min : écraser une partie des haricots pour épaissir.",
       "Pendant ce temps, cuire le riz 12 min à l'eau salée.",
       "Servir la feijoada avec le riz et des quartiers d'orange, comme au Brésil."], "Brésilienne")
    # ---------- Asie ----------
    P("Japchae, nouilles sautées au bœuf et aux légumes", "Poêlées", 35, ["plaques"], ["familial", "asiatique"],
      [("nouilles", 1), ("boeuf", 0.6), ("epinards", 0.6), ("carotte", 0.4), ("champignons", 0.6), ("sauce-soja", 2), ("sesame", 1), ("ail", 0.5), ("sucre", 0.15)],
      ["Cuire les nouilles selon le paquet, les rincer à l'eau froide et les égoutter.",
       "Mélanger la sauce soja, le sucre et l'ail haché. Couper le bœuf en fines lanières et la carotte en bâtonnets.",
       "Faire sauter le bœuf 2 min, puis la carotte et les champignons 4 min, et les épinards 1 min.",
       "Ajouter les nouilles et la sauce, mélanger 2 min sur le feu et parsemer de sésame."], "Coréenne")
    P("Gado-gado, salade indonésienne sauce cacahuète", "Salades", 35, ["plaques"], ["végétarien", "asiatique"],
      [("pomme-de-terre", 0.6), ("haricots-verts", 0.8), ("chou", 0.5), ("oeufs", 0.5), ("tofu", 1), ("cacahuete", 2), ("sauce-soja", 1), ("citron-vert", 1), ("lait-coco", 0.5)],
      ["Cuire les pommes de terre 20 min et les œufs 9 min. Cuire les haricots verts 8 min à l'eau salée.",
       "Dorer le tofu en cubes 6 min à la poêle.",
       "Sauce : chauffer doucement le beurre de cacahuète avec le lait de coco, la sauce soja et le jus du citron vert, en remuant jusqu'à ce qu'elle soit lisse.",
       "Disposer le chou émincé, les pommes de terre et les œufs en quartiers, les haricots verts et le tofu, et napper de sauce."], "Indonésienne")
    P("Amok de poisson au lait de coco", "Curry", 35, ["plaques"], ["asiatique", "épicé"],
      [("poisson-blanc", 1.2), ("lait-coco", 1.5), ("curry", 1), ("citron-vert", 1), ("epinards", 0.5), ("gingembre", 1), ("riz", 1), ("oeufs", 0.25)],
      ["Cuire le riz 12 min à l'eau salée.",
       "Chauffer le lait de coco avec le curry et le gingembre râpé 3 min. Hors du feu, ajouter l'œuf battu.",
       "Couper le poisson blanc en morceaux et les poser sur les épinards dans une poêle ou un plat, verser la sauce, couvrir et cuire 10 min à feu doux.",
       "Arroser de jus de citron vert et servir avec le riz."], "Cambodgienne")
    # ---------- pâtisseries qu'on aime partout ----------
    P("Churros et sauce chocolat", "Desserts", 40, ["plaques"], ["goûter", "fête", "enfants"],
      [("farine", 1.2), ("beurre", 1.5), ("sucre", 1), ("cannelle", 1), ("chocolat", 1), ("lait", 0.75), ("eau", 1)],
      ["Porter à ébullition 25 cl d'eau avec le beurre et une pincée de sel. Hors du feu, verser la farine d'un coup et mélanger vivement jusqu'à obtenir une boule lisse.",
       "Mettre la pâte dans une poche à douille cannelée et faire tomber des bâtons de 10 cm dans l'huile chaude (170 °C). Frire 3 à 4 min en les retournant.",
       "Égoutter sur du papier absorbant et rouler aussitôt dans le sucre mélangé à la cannelle.",
       "Sauce : faire fondre le chocolat dans le lait chaud en remuant. Servir les churros tièdes avec la sauce."], "Espagnole", meal=D, serv=4, diff="Moyen")
    P("Beignets aux pommes", "Desserts", 35, ["plaques"], ["goûter", "automne", "enfants"],
      [("pomme", 1.5), ("farine", 1), ("oeufs", 0.5), ("lait", 0.75), ("sucre", 1), ("levure", 0.5), ("cannelle", 0.5)],
      ["Fouetter la farine, la levure, les œufs, la moitié du sucre et le lait pour obtenir une pâte lisse et épaisse.",
       "Éplucher les pommes, retirer le cœur et les couper en rondelles d'un centimètre.",
       "Tremper chaque rondelle dans la pâte et frire 2 min de chaque côté dans l'huile chaude, jusqu'à ce qu'elle soit dorée.",
       "Égoutter et saupoudrer du reste de sucre mélangé à la cannelle."], "Française", meal=D, serv=4)
    P("Éclairs au chocolat", "Desserts", 90, ["plaques", "four"], ["pâtisserie", "week-end", "fête"],
      [("farine", 1), ("beurre", 4), ("oeufs", 1.75), ("lait", 3), ("sucre", 1.5), ("maizena", 1), ("chocolat", 1.5)],
      ["Pâte à choux : porter à ébullition 12 cl de lait, 12 cl d'eau, le beurre et une pincée de sel, verser la farine d'un coup, mélanger, puis ajouter 4 œufs un à un.",
       "Préchauffer le four à 190 °C. Pocher des boudins de 12 cm sur une plaque et cuire 25 min sans ouvrir le four.",
       "Crème au chocolat : fouetter 3 œufs avec le sucre et la maïzena, verser le reste du lait chaud, cuire en remuant jusqu'à épaississement, puis ajouter les deux tiers du chocolat. Laisser refroidir.",
       "Fendre ou percer les éclairs, les garnir de crème et napper le dessus du reste de chocolat fondu."], "Française", meal=D, serv=6, diff="Difficile")
    return R
