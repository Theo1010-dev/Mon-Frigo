# -*- coding: utf-8 -*-
from gen_core import *
from gen_hand1 import H


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    D = ("Dessert", "Goûter"); B = ("Petit-déjeuner",)
    # ---------- PLATS ----------
    P("Tartiflette", "Gratins & four", 60, ["four", "plaques"], ["four", "réconfort", "familial"],
      [("pomme-de-terre", 1.2), "lardons", "oignon", "reblochon", ("creme", 1), ("vin-blanc", 0.5)],
      ["Préchauffer le four à 200 °C. Cuire les pommes de terre épluchées 15 min à l'eau salée, puis les couper en rondelles.", "Faire dorer les lardons 4 min, ajouter l'oignon émincé 5 min, puis déglacer avec le vin blanc.",
       "Dans un plat, alterner pommes de terre, lardons et oignons, puis verser la crème.", "Couper le reblochon en deux dans l'épaisseur et le poser, croûte vers le haut, sur le dessus. Enfourner 25 min."], "Française")
    P("Galettes bretonnes complètes", "Plats mijotés", 40, ["plaques"], ["galette", "familial"],
      [("farine-sarrasin", 1), ("oeufs", 1), "jambon", ("emmental", 1), ("beurre", 1), ("lait", 0.5)],
      ["Mélanger la farine de sarrasin avec une pincée de sel, un œuf, le lait et 25 cl d'eau jusqu'à obtenir une pâte fluide. Laisser reposer 20 min.",
       "Faire fondre un peu de beurre dans une grande poêle, verser une louche de pâte et l'étaler finement. Cuire 2 min.", "Retourner la galette, casser un œuf au centre, ajouter le jambon et l'emmental râpé autour.",
       "Replier les bords en carré et cuire 3 min, jusqu'à ce que le blanc soit pris. Recommencer avec le reste de pâte."], "Française")
    P("Endives au jambon", "Gratins & four", 55, ["four", "plaques"], ["four", "familial"],
      ["endives", ("jambon", 1.5), "bechamel", ("fromage-rape", 1), ("beurre", 0.3)],
      ["Préchauffer le four à 200 °C. Cuire les endives 15 min à l'eau bouillante salée, puis bien les presser pour retirer l'eau.", "Enrouler chaque endive dans une tranche de jambon et les ranger dans un plat beurré.",
       "Napper de béchamel, parsemer de fromage râpé.", "Enfourner 25 min, jusqu'à ce que le dessus soit gratiné."], "Française")
    P("Soupe à l'oignon gratinée", "Soupes", 50, ["plaques", "four"], ["soupe", "réconfort"],
      [("oignon", 3), "bouillon", ("beurre", 1), ("farine", 0.15), ("pain", 1), ("emmental", 1), ("vin-blanc", 0.5)],
      ["Émincer finement les oignons et les faire fondre 20 min à feu doux dans le beurre, jusqu'à ce qu'ils soient bien dorés.", "Saupoudrer de farine, mélanger 1 min, puis verser le vin blanc et le bouillon. Laisser mijoter 15 min.",
       "Préchauffer le gril du four. Répartir la soupe dans des bols allant au four, poser une tranche de pain et couvrir d'emmental râpé.", "Gratiner 5 min sous le gril et servir bien chaud."], "Française")
    P("Blanquette de poulet", "Plats mijotés", 55, ["plaques"], ["poulet", "familial"],
      ["poulet", "carotte", "champignons", "oignon", "bouillon", "creme", ("citron", 0.5), ("beurre", 0.5), ("farine", 0.15), "riz"],
      ["Couper le poulet en morceaux, les carottes en rondelles, émincer l'oignon et les champignons. Cuire le riz.", "Faire revenir le poulet 5 min dans le beurre sans le colorer, ajouter l'oignon, saupoudrer de farine et mélanger.",
       "Verser le bouillon, ajouter les carottes et laisser mijoter 25 min à couvert. Ajouter les champignons 10 min avant la fin.", "Hors du feu, ajouter la crème et le jus de citron, rectifier l'assaisonnement et servir avec le riz."], "Française")
    P("Salade César", "Salades", 25, ["plaques"], ["salade", "poulet"],
      [("salade", 1.5), "poulet", ("parmesan", 0.8), ("pain", 0.5), ("mayonnaise", 2), ("citron", 0.5), ("moutarde", 0.5), ("ail", 0.5), ("huile-olive", 0.5)],
      ["Couper le pain en cubes et les faire dorer 4 min à la poêle avec l'huile d'olive pour faire des croûtons.", "Cuire le poulet 8 min à la poêle, saler, poivrer, puis le trancher.",
       "Mélanger la mayonnaise, le jus du citron, la moutarde, l'ail haché et la moitié du parmesan râpé pour la sauce.", "Mélanger la salade avec la sauce, ajouter le poulet, les croûtons et le reste du parmesan en copeaux."], "Américaine")
    P("Salade niçoise", "Salades", 30, ["plaques"], ["salade", "poisson", "froid"],
      ["thon", ("oeufs", 0.5), "tomate", ("haricots-verts", 0.8), ("pomme-de-terre", 0.5), "olives", ("salade", 0.5), ("huile-olive", 1), ("vinaigre", 0.5)],
      ["Cuire les pommes de terre 15 min et les haricots verts 8 min à l'eau salée, puis les refroidir.", "Cuire les œufs 10 min, les écaler et les couper en quartiers. Couper les tomates en quartiers.",
       "Disposer la salade, les pommes de terre en rondelles, les haricots verts, les tomates, le thon émietté, les œufs et les olives.", "Arroser d'huile d'olive et de vinaigre, saler et poivrer."], "Française")
    P("Paella au poulet et aux crevettes", "Riz", 50, ["plaques"], ["riz", "familial"],
      ["riz", ("poulet", 0.8), ("crevettes", 0.6), ("chorizo", 0.8), "poivron", ("petits-pois", 0.6), "oignon", ("ail", 1), ("curcuma", 1), "bouillon", ("huile-olive", 1), "citron"],
      ["Couper le poulet en morceaux, le chorizo en rondelles, le poivron en lanières, émincer l'oignon et l'ail.", "Faire dorer le poulet et le chorizo 6 min dans l'huile d'olive, ajouter l'oignon, l'ail et le poivron 5 min.",
       "Ajouter le riz et le curcuma, mélanger 1 min, puis verser le bouillon chaud. Cuire 15 min à feu doux sans remuer.", "Ajouter les crevettes et les petits pois, couvrir et cuire encore 6 min. Servir avec des quartiers de citron."], "Espagnole")
    P("Pad thaï aux crevettes", "Pâtes", 25, ["plaques"], ["wok", "asiatique"],
      ["nouilles", "crevettes", ("oeufs", 0.5), ("cacahuetes", 1), "citron-vert", ("sauce-soja", 1.5), ("sucre", 0.15), ("ail", 1), ("huile-olive", 0.5), "coriandre"],
      ["Faire tremper ou cuire les nouilles de riz selon le paquet, puis les égoutter.", "Mélanger la sauce soja, le jus du citron vert et le sucre.",
       "Chauffer l'huile au wok, saisir l'ail haché et les crevettes 2 min. Pousser sur le côté et brouiller les œufs 1 min.", "Ajouter les nouilles et la sauce, faire sauter 2 min. Servir avec les cacahuètes concassées et la coriandre."], "Asiatique")
    P("Fajitas au poulet", "Sandwichs", 25, ["plaques"], ["tex-mex", "poulet", "familial"],
      ["wrap", "poulet", "poivron", "oignon", ("paprika", 1), ("cumin", 1), ("huile-olive", 0.5), ("creme", 0.5), "citron-vert"],
      ["Couper le poulet, le poivron et l'oignon en lanières.", "Saisir le poulet 5 min à feu vif dans l'huile avec le paprika et le cumin, ajouter le poivron et l'oignon 6 min.",
       "Arroser de jus de citron vert. Tiédir les tortillas 20 secondes à la poêle.", "Garnir les tortillas de la préparation et d'une cuillère de crème, puis les rouler."], "Tex-Mex")
    P("Tacos maison au bœuf", "Sandwichs", 25, ["plaques"], ["tex-mex", "boeuf"],
      ["wrap", "boeuf-hache", "tomate", ("salade", 0.5), "cheddar", "oignon-rouge", ("cumin", 1), ("paprika", 0.5)],
      ["Faire cuire le bœuf haché 6 min en l'émiettant, avec le cumin, le paprika, du sel et du poivre.", "Couper la tomate en dés, émincer la salade et l'oignon rouge, râper le cheddar.",
       "Chauffer les tortillas à la poêle, les garnir de viande, de tomate, de salade, d'oignon rouge et de cheddar.", "Plier en deux et servir aussitôt."], "Tex-Mex")
    P("Quesadillas fromage et haricots rouges", "Sandwichs", 15, ["plaques"], ["tex-mex", "express"],
      ["wrap", "haricots-rouges", ("cheddar", 1), ("mais", 0.5), ("cumin", 0.5)],
      ["Égoutter les haricots rouges et le maïs, les écraser grossièrement avec le cumin.", "Étaler sur la moitié des tortillas, parsemer de cheddar râpé, recouvrir d'une autre tortilla.",
       "Faire dorer 2 min de chaque côté dans une poêle sans matière grasse, jusqu'à ce que le fromage soit fondu. Couper en parts."], "Tex-Mex")
    P("Moussaka", "Gratins & four", 85, ["four", "plaques"], ["four", "familial", "boeuf"],
      [("aubergine", 1.5), "boeuf-hache", "oignon", "tomate-concassee", "bechamel", ("fromage-rape", 0.8), ("cannelle", 0.3), ("huile-olive", 1.5)],
      ["Couper les aubergines en rondelles et les faire dorer 3 min de chaque côté dans l'huile d'olive.", "Faire revenir l'oignon haché, ajouter la viande 6 min, puis la tomate et la cannelle. Mijoter 10 min.",
       "Préchauffer le four à 180 °C. Dans un plat, alterner aubergines et viande, terminer par la béchamel et le fromage râpé.", "Enfourner 40 min et laisser reposer 10 min avant de servir."], "Grecque")
    P("Poivrons farcis", "Gratins & four", 60, ["four", "plaques"], ["four", "boeuf"],
      [("poivron", 2), "boeuf-hache", ("riz", 0.5), "oignon", ("tomate-concassee", 0.5), ("fromage-rape", 0.5), "herbes-provence"],
      ["Préchauffer le four à 190 °C. Cuire le riz. Couper le chapeau des poivrons et les épépiner.", "Faire revenir l'oignon haché et la viande 6 min, ajouter la tomate, le riz cuit et les herbes. Saler, poivrer.",
       "Farcir les poivrons, parsemer de fromage râpé et remettre les chapeaux.", "Enfourner 35 min, jusqu'à ce que les poivrons soient tendres."], "Méditerranéenne")
    P("Courgettes farcies", "Gratins & four", 55, ["four", "plaques"], ["four", "familial"],
      [("courgette", 1.5), ("boeuf-hache", 0.8), "oignon", ("chapelure", 0.5), ("fromage-rape", 0.6), "herbes-provence"],
      ["Préchauffer le four à 190 °C. Couper les courgettes en deux et les évider à la cuillère, hacher la chair.", "Faire revenir l'oignon, la chair des courgettes et la viande 8 min avec les herbes. Saler, poivrer.",
       "Garnir les courgettes, parsemer de chapelure et de fromage râpé.", "Enfourner 30 min."], "Française")
    P("Tomates farcies", "Gratins & four", 60, ["four", "plaques"], ["four", "familial"],
      [("tomate", 2), ("boeuf-hache", 1), "oignon", ("ail", 1), ("persil", 0.5), ("chapelure", 0.4), "riz"],
      ["Préchauffer le four à 190 °C. Couper le chapeau des tomates, les évider et les saler à l'intérieur.", "Mélanger la viande avec l'oignon et l'ail hachés, le persil, la chapelure, du sel et du poivre.",
       "Farcir les tomates, remettre les chapeaux et enfourner 40 min. Cuire le riz pendant ce temps.", "Servir avec le riz arrosé du jus de cuisson."], "Française")
    P("Nuggets de poulet maison", "Plats mijotés", 30, ["plaques"], ["poulet", "familial"],
      ["poulet", ("chapelure", 1), ("oeufs", 0.25), ("farine", 0.3), ("paprika", 0.5), ("huile-olive", 2), ("ketchup", 1)],
      ["Couper le poulet en morceaux. Préparer trois assiettes : farine, œuf battu, chapelure mélangée au paprika.", "Passer chaque morceau dans la farine, l'œuf, puis la chapelure.",
       "Faire dorer 3 à 4 min de chaque côté dans l'huile chaude, jusqu'à ce qu'ils soient cuits à cœur.", "Servir avec du ketchup."], "Américaine")
    P("Fish and chips", "Poisson", 45, ["four", "plaques"], ["poisson", "familial"],
      ["poisson-blanc", ("pomme-de-terre", 1), ("farine", 0.8), ("oeufs", 0.25), ("huile-olive", 2), "citron"],
      ["Préchauffer le four à 220 °C. Couper les pommes de terre en frites, les mélanger avec la moitié de l'huile et les enfourner 30 min.", "Mélanger la farine, l'œuf et 10 cl d'eau froide pour une pâte épaisse. Saler.",
       "Tremper les morceaux de poisson dans la pâte et les faire dorer 3 min de chaque côté dans le reste de l'huile.", "Servir le poisson avec les frites et des quartiers de citron."], "Anglaise")
    P("Steak frites", "Plats mijotés", 35, ["four", "plaques"], ["boeuf"],
      ["boeuf", ("frites", 1), ("beurre", 0.5), "salade"],
      ["Enfourner les frites selon le paquet (environ 25 min à 220 °C).", "Sortir la viande 15 min avant la cuisson. Chauffer une poêle très chaude avec le beurre.",
       "Saisir le steak 2 à 3 min de chaque côté pour une cuisson saignante, saler et poivrer, puis le laisser reposer 3 min.", "Servir avec les frites et une salade verte."], "Française")
    P("Croque-monsieur végétarien", "Sandwichs", 15, ["four"], ["sandwich", "express"],
      ["pain-mie", ("fromage-rape", 1), "tomate", ("epinards", 0.5), ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Faire tomber les épinards 2 min à la poêle.", "Beurrer le pain de mie, garnir d'épinards, de tomate en rondelles et de fromage râpé, puis refermer.",
       "Parsemer le dessus de fromage et enfourner 10 min."], "Française")
    P("Poulet tikka à la poêle", "Curry", 35, ["plaques"], ["poulet", "épicé"],
      ["poulet", "yaourt", ("garam-masala", 1), ("curcuma", 0.5), "oignon", ("ail", 1), "gingembre", ("tomate-concassee", 0.5), ("creme", 0.5), "riz"],
      ["Couper le poulet en dés et le mélanger avec la moitié du yaourt, le garam masala et le curcuma. Laisser mariner 10 min. Cuire le riz.",
       "Faire revenir l'oignon, l'ail et le gingembre hachés 4 min, ajouter le poulet et le faire dorer 6 min.", "Ajouter la tomate et laisser mijoter 10 min, puis la crème et le reste du yaourt hors du feu.", "Servir avec le riz."], "Indienne")
    P("Poke bowl au saumon", "Salades", 25, ["plaques"], ["bol", "poisson"],
      ["riz", ("saumon", 0.8), "avocat", "concombre", ("mangue", 0.5), ("sauce-soja", 1.5), ("sesame", 0.5), "citron-vert"],
      ["Cuire le riz et le laisser tiédir. Couper le saumon très frais en cubes et le mariner 10 min avec la sauce soja et le jus du citron vert.",
       "Couper l'avocat, le concombre et la mangue en dés.", "Dresser le riz dans des bols, ajouter le saumon et les fruits et légumes, parsemer de sésame."], "Japonaise")
    P("Crêpes jambon-fromage", "Plats mijotés", 35, ["plaques"], ["familial"],
      [("farine", 1.2), ("oeufs", 0.5), ("lait", 2), "jambon", ("emmental", 1), ("beurre", 0.5)],
      ["Préparer la pâte : farine, œufs, lait et une pincée de sel, fouettés jusqu'à ce qu'elle soit lisse.", "Cuire les crêpes 1 min de chaque côté dans une poêle beurrée.",
       "Remettre une crêpe dans la poêle, ajouter le jambon et l'emmental râpé, replier et laisser fondre 1 min. Recommencer."], "Française")
    P("Saumon fumé, pommes de terre et crème ciboulette", "Poisson", 25, ["plaques"], ["poisson", "froid"],
      ["saumon-fume", "pomme-de-terre", ("creme", 1), "ciboulette", "citron"],
      ["Cuire les pommes de terre 18 min à l'eau salée.", "Mélanger la crème avec la ciboulette ciselée, le jus du demi-citron, du sel et du poivre.",
       "Servir les pommes de terre chaudes avec le saumon fumé et la crème ciboulette."], "Française")
    P("Cabillaud au four, tomates et olives", "Poisson", 30, ["four"], ["poisson", "léger"],
      ["cabillaud", "tomate-cerise", "olives", ("huile-olive", 1), "herbes-provence", ("ail", 1)],
      ["Préchauffer le four à 200 °C. Disposer les tomates cerises, les olives et l'ail haché dans un plat.", "Poser le cabillaud dessus, arroser d'huile d'olive, saupoudrer d'herbes, saler et poivrer.",
       "Enfourner 15 à 18 min : le poisson doit se détacher en lamelles."], "Méditerranéenne")
    P("Colin pané au four et purée", "Poisson", 40, ["four", "plaques"], ["poisson", "familial"],
      ["colin", ("chapelure", 0.6), ("moutarde", 1), ("pomme-de-terre", 1), ("lait", 0.8), ("beurre", 1)],
      ["Cuire les pommes de terre 20 min à l'eau salée et les écraser avec le beurre et le lait chaud.", "Préchauffer le four à 200 °C. Badigeonner le colin de moutarde, puis le couvrir de chapelure.",
       "Enfourner 15 min, jusqu'à ce que la chapelure soit dorée. Servir avec la purée."], "Française")
    P("Crevettes à la crème d'ail", "Poisson", 20, ["plaques"], ["poisson", "express"],
      ["crevettes", ("creme", 1), ("ail", 1.5), "persil", ("beurre", 0.5), "pates"],
      ["Cuire les pâtes dans l'eau bouillante salée.", "Faire fondre le beurre, saisir les crevettes 2 min de chaque côté, ajouter l'ail haché 30 secondes.",
       "Verser la crème, laisser épaissir 2 min, ajouter le persil ciselé. Mélanger avec les pâtes."], "Française")
    # ---------- PETIT-DÉJEUNER ----------
    P("Pain perdu", "Petit-déjeuner", 15, ["plaques"], ["petit-déjeuner", "anti-gaspillage"],
      ["pain", ("oeufs", 0.5), ("lait", 1), ("sucre", 0.4), ("cannelle", 0.3), ("beurre", 0.8)],
      ["Battre les œufs avec le lait, le sucre et la cannelle.", "Tremper les tranches de pain (idéalement rassis) quelques secondes de chaque côté.",
       "Les faire dorer 2 à 3 min de chaque côté dans le beurre à feu moyen. Servir tiède."], "Française", meal=B + D)
    P("Pancakes à la banane (3 ingrédients)", "Petit-déjeuner", 15, ["plaques"], ["petit-déjeuner", "express"],
      [("banane", 1), ("oeufs", 0.5), ("flocons-avoine", 0.5)],
      ["Écraser la banane bien mûre, ajouter les œufs et les flocons d'avoine, mélanger.", "Cuire des petites louches de pâte 2 min de chaque côté dans une poêle légèrement huilée."], "Cuisine du monde", meal=B)
    P("Overnight oats aux fruits rouges", "Petit-déjeuner", 5, [], ["petit-déjeuner", "express", "froid"],
      ["flocons-avoine", ("lait", 1), ("yaourt", 0.5), "fruits-rouges", "miel"],
      ["Mélanger les flocons d'avoine, le lait, le yaourt et le miel dans deux pots.", "Couvrir et laisser au frigo toute la nuit.", "Le matin, ajouter les fruits rouges et déguster froid."], "Cuisine du monde", meal=B)
    P("Granola maison", "Petit-déjeuner", 35, ["four"], ["petit-déjeuner", "batch"],
      [("flocons-avoine", 3), ("noix", 1), ("amandes", 1), ("miel", 2), ("huile-olive", 1), ("raisins-secs", 1)],
      ["Préchauffer le four à 160 °C. Mélanger les flocons d'avoine, les noix et les amandes concassées.", "Ajouter le miel et l'huile, bien enrober.",
       "Étaler sur une plaque et cuire 20 à 25 min en remuant à mi-cuisson. Ajouter les raisins secs une fois refroidi. Se garde 2 semaines dans un bocal."], "Cuisine du monde", meal=B, serv=6)
    P("Smoothie banane-fraise", "Petit-déjeuner", 5, ["mixeur"], ["petit-déjeuner", "express", "boisson"],
      ["banane", ("fraises", 0.8), ("yaourt", 0.5), ("lait", 1)], ["Couper la banane et les fraises équeutées.", "Mixer avec le yaourt et le lait jusqu'à obtenir une texture lisse. Servir bien frais."], "Cuisine du monde", meal=B + D)
    P("Smoothie mangue-coco", "Petit-déjeuner", 5, ["mixeur"], ["petit-déjeuner", "express", "boisson"],
      ["mangue", ("lait-coco", 1), ("banane", 0.5), "citron-vert"], ["Couper la mangue et la banane en morceaux.", "Mixer avec le lait de coco et le jus du citron vert. Ajouter un peu d'eau si c'est trop épais."], "Exotique", meal=B + D)
    P("Œufs à la coque et mouillettes", "Petit-déjeuner", 10, ["plaques"], ["petit-déjeuner", "express"],
      [("oeufs", 0.5), "pain", ("beurre", 0.5)], ["Plonger délicatement les œufs dans l'eau bouillante et compter 3 min.", "Pendant ce temps, griller et beurrer le pain, puis le couper en mouillettes.", "Servir les œufs dans des coquetiers avec les mouillettes."], "Française", meal=B)
    # ---------- DESSERTS ----------
    P("Tiramisu", "Desserts", 25, [], ["dessert", "gourmand"],
      [("mascarpone", 2.5), ("oeufs", 0.75), ("sucre", 1), ("biscuits", 2), ("cafe", 4), ("chocolat", 0.2)],
      ["Préparer 20 cl de café fort et le laisser refroidir.", "Séparer les blancs des jaunes. Fouetter les jaunes avec le sucre, puis ajouter le mascarpone.",
       "Monter les blancs en neige et les incorporer délicatement à la crème.", "Tremper rapidement les biscuits dans le café et alterner couches de biscuits et de crème. Râper du chocolat dessus et réfrigérer au moins 4 h."], "Italienne", meal=D, serv=4)
    P("Gaufres", "Desserts", 30, ["plaques"], ["dessert", "goûter"],
      [("farine", 2), ("lait", 2.5), ("oeufs", 0.5), ("beurre", 2.5), ("sucre", 0.5), "levure"],
      ["Mélanger la farine, la levure et le sucre. Ajouter les œufs, puis le lait petit à petit en fouettant.", "Incorporer le beurre fondu. Laisser reposer 15 min.",
       "Cuire dans un gaufrier bien chaud environ 4 min par gaufre. (Sans gaufrier, la même pâte fait de très bons pancakes à la poêle.)"], "Belge", meal=D, serv=4)
    P("Quatre-quarts", "Desserts", 55, ["four"], ["dessert", "four", "économique"],
      [("oeufs", 0.75), ("sucre", 2.5), ("farine", 1.25), ("beurre", 7.5), ("levure", 0.5)],
      ["Préchauffer le four à 180 °C. Peser les œufs : il faut le même poids de sucre, de farine et de beurre (environ 150 g chacun).", "Fouetter les œufs et le sucre, ajouter le beurre fondu, puis la farine et la levure.",
       "Verser dans un moule à cake beurré et enfourner 40 min. La lame d'un couteau doit ressortir sèche."], "Française", meal=D, serv=6)
    P("Moelleux au citron", "Desserts", 40, ["four"], ["dessert", "four"],
      [("oeufs", 0.75), ("sucre", 2), ("farine", 1.2), ("beurre", 5), "levure", ("citron", 2)],
      ["Préchauffer le four à 180 °C. Râper le zeste des citrons et presser leur jus.", "Fouetter les œufs et le sucre, ajouter le beurre fondu, le zeste et le jus, puis la farine et la levure.",
       "Verser dans un moule beurré et cuire 25 min."], "Française", meal=D, serv=6)
    P("Mug cake au chocolat", "Desserts", 5, ["micro-ondes"], ["dessert", "express"],
      [("chocolat", 0.4), ("beurre", 1), ("oeufs", 0.25), ("sucre", 0.3), ("farine", 0.25)],
      ["Dans une grande tasse, faire fondre le chocolat avec le beurre 40 secondes au micro-ondes.", "Ajouter l'œuf, le sucre et la farine, bien mélanger à la fourchette.",
       "Cuire 1 min à 1 min 15 au micro-ondes (800 W) : le centre doit rester moelleux."], "Américaine", meal=D, serv=1)
    P("Pommes au four, miel et cannelle", "Desserts", 35, ["four"], ["dessert", "four", "léger"],
      [("pomme", 1), "miel", ("cannelle", 0.5), ("beurre", 0.5), ("noix", 0.5)],
      ["Préchauffer le four à 180 °C. Retirer le trognon des pommes sans les traverser.", "Remplir le centre de miel, de noix concassées, d'une noisette de beurre et de cannelle.", "Enfourner 25 min, jusqu'à ce que les pommes soient tendres."], "Française", meal=D)
    P("Poires au chocolat chaud", "Desserts", 25, ["plaques"], ["dessert", "gourmand"],
      [("poire", 1), ("chocolat", 0.8), ("creme", 0.8), ("sucre", 0.3)],
      ["Éplucher les poires et les pocher 15 min dans de l'eau frémissante avec le sucre.", "Faire fondre le chocolat avec la crème à feu doux.", "Servir les poires égouttées nappées de sauce chocolat."], "Française", meal=D)
    P("Flan pâtissier facile", "Desserts", 60, ["four", "plaques"], ["dessert", "four"],
      [("lait", 4), ("oeufs", 0.75), ("sucre", 1.5), ("maizena", 2), "vanille"],
      ["Préchauffer le four à 180 °C. Chauffer le lait avec la vanille.", "Fouetter les œufs avec le sucre et la maïzena, verser le lait chaud en fouettant, puis remettre sur le feu et remuer jusqu'à épaississement.",
       "Verser dans un moule beurré et cuire 40 min. Laisser refroidir puis réfrigérer 2 h."], "Française", meal=D, serv=6)
    P("Semoule au lait", "Desserts", 20, ["plaques"], ["dessert", "économique"],
      [("lait", 4), ("semoule", 0.4), ("sucre", 0.5), "vanille"],
      ["Porter le lait à frémissement avec le sucre et la vanille.", "Verser la semoule en pluie en remuant et cuire 8 min à feu doux sans cesser de remuer.", "Répartir dans des ramequins et servir tiède ou froid."], "Française", meal=D, serv=4)
    P("Cheesecake sans cuisson", "Desserts", 25, [], ["dessert", "gourmand"],
      [("biscuits", 2), ("beurre", 3), ("fromage-frais", 3), ("creme", 2), ("sucre", 1), "citron", ("fruits-rouges", 1)],
      ["Écraser les biscuits, les mélanger au beurre fondu et tasser au fond d'un moule.", "Fouetter le fromage frais avec le sucre et le jus du citron, puis ajouter la crème bien froide montée en chantilly.",
       "Étaler sur les biscuits et réfrigérer au moins 4 h. Servir avec les fruits rouges."], "Américaine", meal=D, serv=6)
    P("Muffins aux fruits rouges", "Desserts", 35, ["four"], ["dessert", "four", "goûter"],
      [("farine", 2), ("sucre", 1.2), ("oeufs", 0.5), ("lait", 1), ("beurre", 4), "levure", ("fruits-rouges", 1)],
      ["Préchauffer le four à 180 °C. Mélanger la farine, le sucre et la levure.", "Ajouter les œufs, le lait et le beurre fondu sans trop mélanger, puis les fruits rouges.", "Remplir des moules à muffins aux deux tiers et cuire 20 min."], "Américaine", meal=D, serv=6)
    P("Gâteau au chocolat fondant", "Desserts", 40, ["four"], ["dessert", "four", "gourmand"],
      [("chocolat", 2), ("beurre", 7), ("sucre", 1.5), ("oeufs", 1), ("farine", 0.5)],
      ["Préchauffer le four à 180 °C. Faire fondre le chocolat avec le beurre.", "Fouetter les œufs et le sucre, ajouter le chocolat puis la farine.", "Verser dans un moule beurré et cuire 22 à 25 min : le centre doit rester humide."], "Française", meal=D, serv=6)
    P("Salade de fraises à la menthe", "Desserts", 10, [], ["dessert", "léger", "froid"],
      ["fraises", ("menthe", 0.5), ("sucre", 0.3), ("citron", 0.5)], ["Laver, équeuter et couper les fraises en deux.", "Ajouter le sucre, le jus de citron et la menthe ciselée. Réserver 15 min au frais."], "Française", meal=D)
    P("Banane rôtie, chocolat et amandes", "Desserts", 15, ["four"], ["dessert", "express"],
      [("banane", 1), ("chocolat", 0.4), ("amandes", 0.5)], ["Préchauffer le four à 200 °C. Fendre les bananes dans la longueur sans les éplucher.", "Glisser des carrés de chocolat dans la fente, envelopper dans du papier aluminium.", "Cuire 10 min, ouvrir et parsemer d'amandes effilées."], "Cuisine du monde", meal=D)
    P("Crème au chocolat", "Desserts", 20, ["plaques"], ["dessert", "gourmand"],
      [("lait", 2.5), ("chocolat", 1), ("sucre", 0.5), ("maizena", 1)],
      ["Délayer la maïzena dans un peu de lait froid.", "Chauffer le reste du lait avec le sucre et le chocolat en morceaux jusqu'à ce qu'il soit fondu.",
       "Ajouter la maïzena et remuer 3 min à feu doux jusqu'à épaississement. Verser dans des ramequins et réfrigérer 2 h."], "Française", meal=D, serv=4)
    return R
