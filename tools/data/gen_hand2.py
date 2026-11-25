# -*- coding: utf-8 -*-
from gen_core import *
from gen_hand1 import H, I


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    D = ("Dessert", "Goûter")
    # ---------- POISSONS ----------
    P("Saumon en papillote, courgettes et citron", "Poisson", 30, ["four"], ["four", "poisson", "léger"],
      ["saumon", "courgette", "citron", ("huile-olive", 0.5), "aneth"],
      ["Préchauffer le four à 200 °C. Couper la courgette en fines rondelles.", "Sur deux grandes feuilles de papier cuisson, déposer la courgette, le saumon, quelques rondelles de citron, un filet d'huile, du sel et du poivre.", "Fermer hermétiquement les papillotes et enfourner 18 min. Ouvrir avec précaution (la vapeur est brûlante) et parsemer d'aneth."])
    P("Cabillaud en papillote, tomates et ail", "Poisson", 30, ["four"], ["four", "poisson", "léger"],
      ["cabillaud", "tomate-cerise", ("ail", 1), "citron", ("huile-olive", 0.5), "persil"],
      ["Préchauffer le four à 190 °C. Couper les tomates cerises en deux, hacher l'ail.", "Déposer le cabillaud sur du papier cuisson avec les tomates, l'ail, un filet d'huile, du sel, du poivre et du citron.", "Fermer la papillote et cuire 18 à 20 min. Parsemer de persil et servir avec du riz."], "Méditerranéenne")
    P("Saumon au four, moutarde et miel", "Poisson", 25, ["four"], ["four", "poisson", "express"],
      ["saumon", ("moutarde", 1), "miel", ("sauce-soja", 0.5)],
      ["Préchauffer le four à 200 °C. Mélanger la moutarde, le miel et la sauce soja.", "Poser les pavés de saumon dans un plat, les badigeonner du mélange.", "Enfourner 12 à 15 min selon l'épaisseur. Servir avec du riz ou des haricots verts."])
    P("Dorade au four, fenouil et citron", "Poisson", 40, ["four"], ["four", "poisson", "léger"],
      ["dorade", "fenouil", "citron", ("huile-olive", 1), "herbes-provence"],
      ["Préchauffer le four à 200 °C. Émincer le fenouil et le disposer dans un plat avec un filet d'huile. Enfourner 15 min.", "Poser la dorade sur le fenouil, ajouter rondelles de citron, herbes, sel et poivre.", "Cuire 12 à 15 min de plus : la chair doit se détacher facilement."], "Méditerranéenne")
    P("Merlu à la crème et aux épinards", "Poisson", 25, ["plaques"], ["poisson", "léger"],
      ["merlu", "epinards", "creme", "citron", ("beurre", 0.5)],
      ["Faire tomber les épinards 3 min dans la moitié du beurre, saler, réserver.", "Cuire le merlu 3 à 4 min de chaque côté dans le reste du beurre.", "Ajouter la crème et le jus de citron, laisser frémir 2 min. Servir le poisson sur les épinards, nappé de sauce."])
    P("Colin sauce citron et riz", "Poisson", 25, ["plaques"], ["poisson", "express"],
      ["colin", "riz", "citron", "creme", "persil", ("beurre", 0.5)],
      ["Cuire le riz 10 à 12 min.", "Cuire le colin 3 à 4 min de chaque côté dans le beurre, le réserver.", "Dans la poêle, verser la crème et le jus de citron, laisser réduire 2 min. Poivrer.", "Servir le poisson sur le riz, nappé de sauce, avec du persil."])
    P("Truite aux amandes et pommes de terre", "Poisson", 35, ["plaques"], ["poisson"],
      ["truite", "pomme-de-terre", "amandes", "citron", ("beurre", 1), "persil"],
      ["Cuire les pommes de terre en cubes 15 min à l'eau salée, égoutter.", "Fariner légèrement la truite (facultatif), la cuire 4 min de chaque côté dans la moitié du beurre.", "Dans une petite poêle, faire dorer les amandes 2 min avec le reste du beurre, ajouter le jus du citron.", "Napper la truite du beurre aux amandes, servir avec les pommes de terre et du persil."], "Française")
    P("Crevettes sautées à l'ail et au persil", "Poisson", 15, ["plaques"], ["poisson", "express"],
      ["crevettes", ("ail", 1.5), "persil", "citron", ("huile-olive", 1)],
      ["Hacher l'ail et le persil.", "Chauffer l'huile à feu vif, saisir les crevettes 2 min de chaque côté.", "Ajouter l'ail et cuire 1 min, puis le jus du citron et le persil. Servir avec du riz ou du pain."], "Méditerranéenne")
    P("Poisson pané maison", "Poisson", 25, ["plaques"], ["poisson", "familial"],
      ["poisson-blanc", "chapelure", ("oeufs", 0.25), ("farine", 0.3), "citron", ("huile-olive", 1)],
      ["Couper le poisson en bâtonnets. Préparer 3 assiettes : farine, œuf battu, chapelure.", "Passer chaque morceau successivement dans la farine, l'œuf puis la chapelure.", "Faire dorer 3 min de chaque côté dans l'huile chaude. Servir avec du citron."])
    P("Thon, tomate et riz en poêle", "Poêlées", 25, ["plaques"], ["poisson", "économique", "express"],
      ["riz", "thon", "tomate-concassee", "oignon", "olives", ("huile-olive", 0.5)],
      ["Émincer l'oignon et le faire revenir 4 min dans l'huile d'olive.", "Ajouter le riz, le nacrer 1 min, verser la tomate et 25 cl d'eau, saler. Couvrir et cuire 12 min à feu doux.", "Incorporer le thon égoutté et les olives, chauffer 3 min."], "Méditerranéenne")

    # ---------- LÉGUMINEUSES & MIJOTÉS ----------
    P("Dahl de lentilles corail", "Légumineuses", 30, ["plaques"], ["légumineuses", "végétarien", "économique", "batch"],
      ["lentilles-corail", "oignon", ("ail", 1), "gingembre", ("curcuma", 1), ("cumin", 1), "lait-coco", ("huile-olive", 0.5), "citron"],
      ["Émincer l'oignon, hacher l'ail et le gingembre. Rincer les lentilles.", "Faire revenir l'oignon 3 min dans l'huile, ajouter l'ail, le gingembre, le curcuma et le cumin 1 min.", "Ajouter les lentilles, le lait de coco et 40 cl d'eau. Saler. Cuire 18 à 20 min à feu doux en remuant de temps en temps.", "Presser le jus du citron, rectifier le sel. Servir avec du riz ou du pain."], "Indienne")
    P("Chili sin carne", "Légumineuses", 40, ["plaques"], ["légumineuses", "végétarien", "batch"],
      ["haricots-rouges", "mais", "poivron", "oignon", "tomate-concassee", ("ail", 1), ("cumin", 1), ("paprika", 1), ("huile-olive", 0.5), "riz"],
      ["Émincer l'oignon et le poivron, hacher l'ail. Égoutter les haricots et le maïs. Cuire le riz.", "Faire revenir l'oignon et le poivron 6 min dans l'huile d'olive avec le cumin et le paprika. Ajouter l'ail.", "Ajouter la tomate, les haricots et le maïs. Saler, poivrer et laisser mijoter 20 min.", "Servir sur le riz."], "Tex-Mex")
    P("Chili con carne", "Plats", 50, ["plaques"], ["boeuf", "batch", "familial"],
      ["boeuf-hache", "haricots-rouges", "oignon", "tomate-concassee", "poivron", ("ail", 1), ("cumin", 1), ("paprika", 1), "riz", ("huile-olive", 0.5)],
      ["Émincer l'oignon et le poivron, hacher l'ail. Cuire le riz.", "Faire dorer la viande hachée 6 min dans l'huile en l'émiettant, ajouter l'oignon, le poivron, les épices.", "Ajouter la tomate et les haricots égouttés, saler et laisser mijoter 25 min à feu doux.", "Servir sur le riz."], "Tex-Mex")
    P("Lentilles aux saucisses", "Plats", 45, ["plaques"], ["légumineuses", "réconfort", "familial"],
      ["lentilles", "saucisses", "carotte", "oignon", ("moutarde", 0.5), "bouillon", ("huile-olive", 0.3)],
      ["Éplucher et couper la carotte en dés, émincer l'oignon.", "Faire dorer les saucisses 8 min dans l'huile, les réserver. Faire revenir l'oignon et la carotte 5 min.", "Ajouter les lentilles, le bouillon, couvrir de 2 cm d'eau. Cuire 25 min à frémissement.", "Remettre les saucisses 5 min, ajouter la moutarde, saler et poivrer."], "Française")
    P("Lentilles, lardons et carottes", "Plats", 40, ["plaques"], ["légumineuses", "économique"],
      ["lentilles", "lardons", "carotte", "oignon", "bouillon"],
      ["Couper la carotte en dés, émincer l'oignon.", "Faire dorer les lardons 4 min dans la cocotte, ajouter l'oignon et la carotte 5 min.", "Ajouter les lentilles rincées, le bouillon et de l'eau pour couvrir. Cuire 25 min à feu doux. Poivrer."], "Française")
    P("Cassoulet express aux haricots blancs", "Plats", 45, ["plaques"], ["légumineuses", "réconfort"],
      ["haricots-blancs", "saucisses", "lardons", "tomate-concassee", "oignon", ("ail", 1), "herbes-provence"],
      ["Émincer l'oignon, hacher l'ail. Faire dorer les saucisses 8 min, les couper en tronçons.", "Faire revenir les lardons et l'oignon 5 min. Ajouter l'ail, les herbes et la tomate.", "Ajouter les haricots égouttés et les saucisses, mijoter 20 min à couvert à feu doux."], "Française")
    P("Pois chiches au chorizo et à la tomate", "Plats", 30, ["plaques"], ["légumineuses", "épicé"],
      ["pois-chiches", "chorizo", "tomate-concassee", "oignon", ("paprika", 0.5), ("huile-olive", 0.5)],
      ["Couper le chorizo en rondelles, émincer l'oignon.", "Faire dorer le chorizo 3 min dans l'huile d'olive, ajouter l'oignon 4 min avec le paprika.", "Ajouter la tomate et les pois chiches égouttés, laisser mijoter 15 min. Servir avec du pain."], "Espagnole")
    P("Tajine de poulet aux carottes et pois chiches", "Plats", 60, ["plaques"], ["poulet", "familial"],
      ["poulet", "carotte", "pois-chiches", "oignon", "raisins-secs", ("epices", 2), ("huile-olive", 0.5), "semoule"],
      ["Couper le poulet en morceaux, émincer l'oignon, couper les carottes en rondelles épaisses.", "Faire dorer le poulet 6 min dans l'huile avec les épices, ajouter l'oignon 3 min.", "Ajouter les carottes, les pois chiches égouttés, les raisins secs et 30 cl d'eau. Couvrir et cuire 35 min à feu doux.", "Cuire la semoule (eau bouillante, 5 min) et servir le tajine dessus."], "Orientale")
    P("Poulet basquaise", "Plats", 55, ["plaques"], ["poulet", "familial"],
      ["poulet", "poivron", "tomate-concassee", "oignon", ("ail", 1), ("paprika", 1), ("huile-olive", 0.5), "riz"],
      ["Couper le poivron en lanières, émincer l'oignon, hacher l'ail. Cuire le riz.", "Faire dorer le poulet en morceaux 6 min dans l'huile d'olive, le réserver. Faire revenir oignon et poivron 8 min.", "Ajouter ail, paprika et tomate. Remettre le poulet, saler, poivrer, couvrir et cuire 25 min à feu doux.", "Servir avec le riz."], "Française")
    P("Poulet rôti et pommes de terre au four", "Plats au four", 70, ["four"], ["poulet", "four", "familial"],
      [("poulet", 1.6), "pomme-de-terre", "oignon", ("huile-olive", 1), "herbes-provence", ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Éplucher les pommes de terre, les couper en quartiers, émincer l'oignon.", "Disposer le poulet dans un plat, entourer des pommes de terre et de l'oignon. Arroser d'huile, parsemer d'herbes, saler et poivrer.", "Ajouter quelques noisettes de beurre sur le poulet. Enfourner 50 à 60 min, en arrosant de jus de cuisson à mi-cuisson, jusqu'à ce que la peau soit dorée et que le jus soit clair."], "Française")
    P("Poulet à la crème et aux champignons", "Plats", 40, ["plaques"], ["poulet", "réconfort"],
      ["poulet", "champignons", "creme", "oignon", ("huile-olive", 0.5), "persil", "riz"],
      ["Couper le poulet en morceaux, émincer l'oignon et les champignons. Cuire le riz.", "Faire dorer le poulet 6 min dans l'huile, le réserver. Faire revenir oignon et champignons 8 min.", "Remettre le poulet, ajouter la crème, saler, poivrer et laisser mijoter 12 min. Parsemer de persil."], "Française")
    P("Boulettes de bœuf à la sauce tomate", "Plats", 40, ["plaques"], ["boeuf", "familial"],
      ["boeuf-hache", ("oeufs", 0.25), ("chapelure", 0.5), "oignon", "tomate-concassee", ("ail", 1), "herbes-provence", ("huile-olive", 0.5), "pates"],
      ["Mélanger la viande, l'œuf, la chapelure, la moitié de l'oignon haché, du sel et du poivre. Former 10 à 12 boulettes.", "Les faire dorer 6 min dans l'huile, les réserver. Faire revenir le reste de l'oignon et l'ail 3 min.", "Ajouter la tomate et les herbes, remettre les boulettes et laisser mijoter 15 min. Servir avec des pâtes."], "Italienne")
    P("Hachis parmentier", "Plats au four", 70, ["four", "plaques"], ["boeuf", "four", "familial", "batch"],
      ["boeuf-hache", ("pomme-de-terre", 1.2), "oignon", "lait", ("beurre", 1), ("fromage-rape", 0.6), ("huile-olive", 0.3)],
      ["Éplucher les pommes de terre, les cuire 20 min à l'eau salée, puis les écraser avec le beurre et le lait chaud. Saler, poivrer.", "Préchauffer le four à 200 °C. Faire revenir l'oignon haché 4 min dans l'huile d'olive, ajouter la viande et cuire 8 min.", "Étaler la viande dans un plat, recouvrir de purée, parsemer de fromage.", "Enfourner 25 min, jusqu'à ce que le dessus soit doré."], "Française")
    P("Boeuf bourguignon", "Plats", 190, ["plaques"], ["boeuf", "familial", "batch"],
      [("boeuf", 1.8), "carotte", "oignon", "lardons", "vin-rouge", "champignons", ("ail", 1), "herbes-provence", ("farine", 0.2), ("beurre", 0.5), "pomme-de-terre"],
      ["Couper le bœuf en cubes de 4 cm. Émincer l'oignon, couper les carottes en rondelles.", "Faire dorer les lardons 4 min dans une cocotte, les retirer. Dorer la viande par petites quantités dans la graisse, saupoudrer de farine.", "Ajouter l'oignon, l'ail, les herbes, le vin rouge et de l'eau à hauteur. Couvrir et cuire 2 h à feu très doux.", "Ajouter les carottes, les lardons et les pommes de terre : cuire encore 30 min. Faire sauter les champignons au beurre et les ajouter en fin de cuisson."], "Française", diff="Intermédiaire", serv=2)
    P("Ratatouille", "Légumes", 60, ["plaques"], ["végétarien", "batch", "léger"],
      ["courgette", "aubergine", "poivron", "tomate", "oignon", ("ail", 1), ("huile-olive", 2), "herbes-provence"],
      ["Couper tous les légumes en cubes de 2 cm. Hacher l'ail.", "Faire revenir séparément l'aubergine (8 min) puis la courgette et le poivron (6 min) dans l'huile d'olive, en les réservant.", "Faire suer l'oignon 4 min, ajouter l'ail et les tomates, cuire 8 min.", "Remettre tous les légumes avec les herbes, saler, poivrer. Couvrir et mijoter 25 min."], "Française")
    P("Gratin dauphinois", "Gratins", 80, ["four"], ["four", "végétarien", "familial"],
      [("pomme-de-terre", 1.2), "creme", "lait", ("ail", 0.5), ("beurre", 0.3)],
      ["Préchauffer le four à 170 °C. Éplucher les pommes de terre et les couper en rondelles de 3 mm (sans les rincer).", "Frotter un plat à gratin d'ail, le beurrer. Y disposer les pommes de terre en couches.", "Chauffer la crème et le lait, saler, poivrer, noix de muscade. Verser sur les pommes de terre.", "Enfourner 1 h à 1 h 10, jusqu'à ce que le dessus soit doré et que la lame d'un couteau s'enfonce sans résistance."], "Française")
    P("Couscous au poulet et aux merguez", "Plats", 60, ["plaques"], ["familial", "poulet"],
      ["semoule", "poulet", "merguez", "carotte", "courgette", "pois-chiches", "oignon", ("epices", 2), ("huile-olive", 0.5)],
      ["Couper les légumes en gros morceaux, émincer l'oignon.", "Faire dorer le poulet 6 min dans l'huile avec l'oignon et les épices, ajouter les carottes et de l'eau à hauteur. Cuire 20 min.", "Ajouter la courgette et les pois chiches, cuire 15 min. Faire griller les merguez 10 min à la poêle.", "Hydrater la semoule (eau bouillante, 5 min) et servir avec les légumes, le bouillon, le poulet et les merguez."], "Orientale")
    P("Sauté de porc à la moutarde et pommes de terre", "Plats", 50, ["plaques"], ["porc", "familial"],
      ["porc", "pomme-de-terre", "oignon", "creme", ("moutarde", 1.5), ("huile-olive", 0.5)],
      ["Couper le porc en cubes, émincer l'oignon, éplucher et couper les pommes de terre en cubes.", "Faire dorer le porc 6 min dans l'huile, ajouter l'oignon 3 min, puis les pommes de terre et 20 cl d'eau. Couvrir, cuire 25 min.", "Ajouter la crème et la moutarde, laisser épaissir 3 min."], "Française")
    P("Saucisses, purée maison", "Plats", 40, ["plaques"], ["porc", "réconfort", "familial"],
      ["saucisses", ("pomme-de-terre", 1.2), "lait", ("beurre", 1), "oignon"],
      ["Éplucher les pommes de terre, les cuire 20 min à l'eau salée. Les écraser avec le beurre et le lait chaud.", "Faire dorer les saucisses 12 min à feu moyen en les retournant. Ajouter l'oignon émincé sur la fin 5 min.", "Servir les saucisses et l'oignon sur la purée."], "Française")
    P("Parmentier de patate douce au bœuf", "Plats au four", 60, ["four"], ["boeuf", "four"],
      ["boeuf-hache", "patate-douce", "oignon", ("beurre", 0.5), ("fromage-rape", 0.5), ("cumin", 0.5)],
      ["Cuire la patate douce en cubes 15 min à l'eau, l'écraser avec le beurre. Saler.", "Préchauffer le four à 200 °C. Faire revenir l'oignon, ajouter le bœuf haché et le cumin, cuire 8 min.", "Étaler la viande dans un plat, couvrir de purée, parsemer de fromage et enfourner 20 min."], "Française")
    P("Pommes de terre sautées aux lardons", "Poêlées", 35, ["plaques"], ["porc", "économique"],
      ["pomme-de-terre", "lardons", "oignon", ("huile-olive", 1), "persil"],
      ["Couper les pommes de terre en dés, les cuire 8 min à l'eau bouillante et égoutter.", "Faire dorer les lardons 4 min, les réserver. Faire sauter les pommes de terre 12 min dans l'huile jusqu'à ce qu'elles soient dorées.", "Ajouter l'oignon émincé 4 min, remettre les lardons, persil."], "Française")
    P("Tian de légumes au four", "Légumes", 65, ["four"], ["four", "végétarien", "léger"],
      ["courgette", "aubergine", "tomate", "oignon", ("huile-olive", 1.5), "herbes-provence", ("ail", 1)],
      ["Préchauffer le four à 190 °C. Couper courgette, aubergine et tomates en rondelles fines.", "Étaler l'oignon émincé et l'ail au fond d'un plat. Disposer les légumes en alternance, en rangées serrées.", "Arroser d'huile, saupoudrer d'herbes, saler, poivrer. Enfourner 45 min."], "Française")
    P("Poêlée de légumes et tofu au soja", "Poêlées", 25, ["plaques"], ["végétarien", "tofu"],
      ["tofu", "poivron", "courgette", "brocoli", ("sauce-soja", 2), ("ail", 1), ("gingembre", 0.5), ("huile-olive", 1), "riz"],
      ["Cuire le riz. Presser le tofu et le couper en cubes ; couper le poivron et la courgette en morceaux, détailler le brocoli en bouquets.", "Faire dorer le tofu 8 min à feu vif dans l'huile, le réserver.", "Faire sauter le poivron, la courgette et le brocoli 8 min avec l'ail et le gingembre, remettre le tofu, verser la sauce soja et mélanger 2 min. Servir sur le riz."], "Asiatique")
    P("Falafels, semoule et sauce yaourt", "Plats", 25, ["four"], ["végétarien"],
      ["falafels", "semoule", "yaourt", "concombre", "citron", "menthe"],
      ["Réchauffer les falafels 10 min au four à 200 °C. Hydrater la semoule 5 min dans l'eau bouillante salée.", "Mélanger le yaourt, le concombre râpé, la menthe, le jus du citron, du sel et du poivre.", "Servir les falafels sur la semoule avec la sauce."], "Orientale")
    P("Houmous maison", "Accompagnements", 10, ["mixeur"], ["végétarien", "économique", "froid"],
      ["pois-chiches", "citron", ("ail", 0.5), ("huile-olive", 1.5), ("cumin", 0.5)],
      ["Égoutter les pois chiches en gardant 5 cl de leur jus.", "Mixer les pois chiches avec le jus du citron, l'ail, le cumin, l'huile d'olive, du sel et un peu de jus de conserve, jusqu'à une purée lisse.", "Servir avec du pain pita ou des bâtonnets de légumes."], "Orientale", meal=("Déjeuner", "Dîner", "Goûter"))

    # ---------- DESSERTS ----------
    P("Gâteau au yaourt", "Desserts", 50, ["four"], ["dessert", "four", "végétarien", "économique"],
      ["yaourt", ("sucre", 2), ("farine", 2), "levure", ("oeufs", 0.75), ("huile-olive", 1.5)],
      ["Préchauffer le four à 180 °C. Beurrer et fariner un moule.", "Vider le yaourt dans un saladier : le pot sert de mesure. Ajouter 2 pots de sucre, les œufs et mélanger.", "Ajouter 3 pots de farine mélangée à la levure, puis 1/2 pot d'huile. Mélanger sans trop travailler la pâte.", "Verser dans le moule et enfourner 35 min : la lame d'un couteau doit ressortir sèche."], "Française", meal=D, serv=6)
    P("Pâte à crêpes et crêpes", "Desserts", 30, ["plaques"], ["dessert", "végétarien", "économique"],
      [("farine", 2), ("oeufs", 0.75), ("lait", 2.5), ("sucre", 0.3), ("beurre", 0.5)],
      ["Verser la farine dans un saladier, creuser un puits et y casser les œufs. Fouetter en versant le lait peu à peu pour éviter les grumeaux.", "Ajouter le sucre et le beurre fondu. Laisser reposer 30 min si possible.", "Cuire chaque crêpe 1 min de chaque côté dans une poêle chaude légèrement huilée. Garnir de sucre, citron, chocolat ou confiture."], "Française", meal=D, serv=4)
    P("Pancakes moelleux", "Desserts", 25, ["plaques"], ["dessert", "végétarien", "petit-déjeuner"],
      [("farine", 1.5), ("lait", 1.5), ("oeufs", 0.5), "levure", ("sucre", 0.4), ("beurre", 0.5)],
      ["Mélanger farine, levure et sucre. Ajouter le lait, les œufs et le beurre fondu : la pâte doit rester un peu épaisse.", "Cuire une petite louche de pâte 2 min à feu moyen, retourner dès que des bulles apparaissent, cuire 1 min.", "Servir avec du miel ou des fruits."], "Américaine", meal=("Petit-déjeuner", "Goûter", "Dessert"))
    P("Clafoutis aux fraises", "Desserts", 50, ["four"], ["dessert", "four", "végétarien"],
      ["fraises", ("oeufs", 0.75), ("farine", 0.6), ("sucre", 1), "lait", ("creme", 0.5), ("beurre", 0.2)],
      ["Préchauffer le four à 180 °C. Beurrer un plat et y répartir les fraises lavées et équeutées.", "Fouetter les œufs avec le sucre, ajouter la farine, puis le lait et la crème.", "Verser sur les fraises et enfourner 35 min, jusqu'à ce que le clafoutis soit doré et gonflé."], "Française", meal=D, serv=4)
    P("Crumble aux pommes", "Desserts", 55, ["four"], ["dessert", "four", "végétarien"],
      ["pomme", ("farine", 0.8), ("sucre", 0.8), ("beurre", 1.5), ("cannelle", 0.5)],
      ["Préchauffer le four à 180 °C. Éplucher les pommes, les couper en dés et les disposer dans un plat avec la cannelle.", "Du bout des doigts, sabler la farine, le sucre et le beurre froid en petits morceaux jusqu'à obtenir une texture de chapelure grossière.", "Répartir sur les pommes et enfourner 35 à 40 min, jusqu'à ce que le dessus soit doré."], "Française", meal=D)
    P("Crumble poires et chocolat", "Desserts", 55, ["four"], ["dessert", "four", "végétarien", "gourmand"],
      ["poire", ("farine", 0.8), ("sucre", 0.6), ("beurre", 1.5), ("chocolat", 0.5)],
      ["Préchauffer le four à 180 °C. Éplucher les poires, les couper en dés, les mettre dans un plat avec le chocolat en morceaux.", "Sabler la farine, le sucre et le beurre froid du bout des doigts.", "Répartir sur les poires et enfourner 35 min."], "Française", meal=D)
    P("Compote de pommes à la cannelle", "Desserts", 25, ["plaques"], ["dessert", "végétarien", "économique", "léger"],
      [("pomme", 1.5), ("cannelle", 0.5), ("sucre", 0.3)],
      ["Éplucher les pommes et les couper en morceaux.", "Les mettre dans une casserole avec 5 cl d'eau, la cannelle et le sucre. Couvrir et cuire 15 à 20 min à feu doux.", "Écraser à la fourchette pour une texture rustique ou mixer pour une compote lisse."], "Française", meal=D)
    P("Mousse au chocolat", "Desserts", 20, [], ["dessert", "végétarien", "gourmand"],
      ["chocolat", ("oeufs", 0.75), ("sucre", 0.3), ("beurre", 0.3)],
      ["Faire fondre le chocolat avec le beurre au bain-marie ou 1 min 30 au micro-ondes, laisser tiédir.", "Séparer les blancs des jaunes. Incorporer les jaunes au chocolat.", "Monter les blancs en neige ferme avec le sucre, puis les incorporer délicatement en 3 fois.", "Répartir dans des verrines et réfrigérer au moins 3 h."], "Française", meal=D, serv=4)
    P("Riz au lait", "Desserts", 45, ["plaques"], ["dessert", "végétarien", "économique"],
      [("riz", 0.5), ("lait", 4), ("sucre", 0.5), "vanille"],
      ["Rincer le riz et le verser dans le lait froid avec le sucre et la vanille.", "Porter à frémissement puis cuire 30 à 35 min à feu très doux en remuant souvent, jusqu'à ce que le riz soit fondant et la crème épaisse.", "Servir tiède ou froid, avec du caramel ou de la confiture."], "Française", meal=D, serv=4)
    P("Fondant au chocolat", "Desserts", 30, ["four"], ["dessert", "four", "végétarien", "gourmand"],
      ["chocolat", ("beurre", 1.5), ("sucre", 0.8), ("oeufs", 0.75), ("farine", 0.3)],
      ["Préchauffer le four à 180 °C. Faire fondre le chocolat avec le beurre.", "Fouetter les œufs avec le sucre, ajouter le chocolat fondu puis la farine.", "Verser dans un moule beurré et cuire 15 min : le centre doit rester coulant. Laisser tiédir 5 min avant de démouler."], "Française", meal=D, serv=4)
    P("Banana bread", "Desserts", 65, ["four"], ["dessert", "four", "végétarien", "anti-gaspillage"],
      [("banane", 1.5), ("farine", 1.5), ("sucre", 0.8), ("oeufs", 0.5), ("beurre", 1.5), "levure"],
      ["Préchauffer le four à 180 °C. Écraser les bananes bien mûres à la fourchette.", "Mélanger avec le beurre fondu, le sucre et les œufs. Ajouter la farine et la levure.", "Verser dans un moule à cake beurré. Cuire 45 à 50 min : un couteau doit ressortir sec."], "Américaine", meal=D, serv=6)
    P("Cookies aux pépites de chocolat", "Desserts", 30, ["four"], ["dessert", "four", "végétarien", "gourmand"],
      [("farine", 1.5), ("beurre", 1.5), ("sucre", 1), ("oeufs", 0.25), ("chocolat", 1), "levure"],
      ["Préchauffer le four à 180 °C. Mélanger le beurre mou avec le sucre, puis l'œuf.", "Ajouter la farine, la levure et le chocolat haché grossièrement.", "Former des boules, les poser espacées sur une plaque et cuire 10 à 12 min : ils doivent rester mous au centre."], "Américaine", meal=D, serv=6)
    P("Gâteau aux carottes", "Desserts", 55, ["four"], ["dessert", "four", "végétarien"],
      ["carotte", ("farine", 1.2), ("sucre", 1), ("oeufs", 0.75), ("huile-olive", 1.5), "levure", ("cannelle", 0.5), "noix"],
      ["Préchauffer le four à 180 °C. Éplucher et râper finement les carottes.", "Fouetter les œufs et le sucre, ajouter l'huile, puis la farine, la levure et la cannelle. Incorporer les carottes et les noix.", "Verser dans un moule beurré et cuire 35 à 40 min."], "Française", meal=D, serv=6)
    P("Tarte aux pommes", "Desserts", 55, ["four"], ["dessert", "four", "végétarien"],
      ["pate-brisee", ("pomme", 2), ("sucre", 0.5), ("beurre", 0.3), ("cannelle", 0.3)],
      ["Préchauffer le four à 190 °C. Étaler la pâte dans un moule et la piquer.", "Éplucher les pommes et les couper en fines lamelles. Les disposer en rosace sur la pâte.", "Parsemer de sucre, de cannelle et de petits morceaux de beurre. Enfourner 35 à 40 min."], "Française", meal=D, serv=4)
    P("Salade de fruits frais", "Desserts", 15, [], ["dessert", "végétarien", "léger", "froid"],
      ["pomme", "banane", "orange", ("fraises", 0.6), ("miel", 0.5)],
      ["Éplucher et couper la pomme, la banane et l'orange en dés, équeuter et couper les fraises.", "Arroser du jus de l'orange pressée et du miel, mélanger délicatement.", "Réserver 30 min au frais avant de servir."], "Française", meal=D)
    P("Yaourt, miel et noix", "Desserts", 5, [], ["dessert", "végétarien", "express"],
      ["yaourt", "miel", "noix"], ["Verser le yaourt dans deux bols.", "Ajouter le miel et les noix concassées."], "Française", meal=("Petit-déjeuner", "Goûter", "Dessert"))
    P("Brownie au chocolat", "Desserts", 35, ["four"], ["dessert", "four", "végétarien", "gourmand"],
      ["chocolat", ("beurre", 1.5), ("sucre", 1), ("oeufs", 0.75), ("farine", 0.5), "noix"],
      ["Préchauffer le four à 180 °C. Faire fondre le chocolat avec le beurre.", "Fouetter les œufs et le sucre, ajouter le chocolat puis la farine et les noix concassées.", "Verser dans un moule carré beurré. Cuire 20 min : le centre doit rester légèrement moelleux. Laisser refroidir avant de découper."], "Américaine", meal=D, serv=4)

    # ---------- PETIT-DÉJEUNER ----------
    B = ("Petit-déjeuner",)
    P("Porridge aux fruits", "Petit-déjeuner", 10, ["plaques"], ["petit-déjeuner", "végétarien", "express"],
      ["flocons-avoine", ("lait", 2), "banane", "miel", "cannelle"],
      ["Verser les flocons d'avoine et le lait dans une casserole. Chauffer 5 min à feu moyen en remuant jusqu'à ce que le porridge épaississe.", "Servir avec la banane en rondelles, du miel et une pincée de cannelle."], "Cuisine du monde", meal=B)
    P("Tartines beurre, confiture et fruit", "Petit-déjeuner", 5, [], ["petit-déjeuner", "végétarien", "express"],
      ["pain", ("beurre", 0.5), "compote", "pomme"], ["Griller le pain.", "Tartiner de beurre et de compote, ajouter des tranches de pomme."], "Française", meal=B)
    P("Œufs brouillés sur toast", "Petit-déjeuner", 10, ["plaques"], ["petit-déjeuner", "végétarien", "express"],
      [("oeufs", 0.5), "pain", ("beurre", 0.5), "ciboulette"],
      ["Griller le pain. Battre les œufs avec du sel et du poivre.", "Faire fondre le beurre à feu doux, verser les œufs et remuer 3 min jusqu'à ce qu'ils soient crémeux.", "Servir sur les toasts avec de la ciboulette."], "Américaine", meal=B)
    P("Yaourt, flocons d'avoine et fruits rouges", "Petit-déjeuner", 5, [], ["petit-déjeuner", "végétarien", "express", "léger"],
      ["yaourt", ("flocons-avoine", 0.5), "fruits-rouges", "miel"], ["Verser le yaourt dans deux bols.", "Ajouter les flocons, les fruits rouges et un filet de miel."], "Cuisine du monde", meal=B)
    return R
