# -*- coding: utf-8 -*-
"""Recettes, lot 4 : soupes, salades, entrées et apéritif, œufs, sandwichs, petits-déjeuners (plats connus, écrits à la main)."""
from gen_hand1 import H

B = ("Petit-déjeuner",)
A = ("Déjeuner", "Dîner", "Apéritif")
AP = ("Apéritif",)


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- soupes ----------
    P("Velouté de carottes au cumin et à l'orange", "Soupes", 35, ["plaques"], ["végétarien", "économique", "hiver"],
      [("carotte", 2), "oignon", "orange", "cumin", ("bouillon", 1.5), ("creme", 0.5), ("huile-olive", 0.5)],
      ["Émincer l'oignon et couper les carottes en rondelles.", "Faire revenir l'oignon 3 min dans l'huile d'olive, ajouter les carottes et le cumin 2 min.",
       "Verser le bouillon et le jus de l'orange, laisser cuire 20 min.", "Mixer avec la crème, saler, poivrer et servir avec un peu de zeste d'orange."])
    P("Potage poireaux-pommes de terre", "Soupes", 40, ["plaques"], ["végétarien", "économique", "hiver", "familial"],
      [("poireau", 1.5), ("pomme-de-terre", 1), "oignon", ("beurre", 1), ("bouillon", 2), ("creme", 0.5)],
      ["Laver et émincer les poireaux, couper les pommes de terre en cubes, hacher l'oignon.", "Faire fondre l'oignon et les poireaux 8 min dans le beurre.",
       "Ajouter les pommes de terre et le bouillon, cuire 20 min.", "Mixer, ajouter la crème, saler et poivrer."])
    P("Soupe de tomates rôties au basilic", "Soupes", 50, ["four", "plaques"], ["végétarien", "été"],
      [("tomate", 2.5), "oignon", ("ail", 1.5), "basilic", ("huile-olive", 1), ("bouillon", 1), "pain"],
      ["Préchauffer le four à 200 °C. Couper les tomates en deux, l'oignon en quartiers, ajouter l'ail en chemise. Arroser d'huile d'olive, saler et rôtir 30 min.",
       "Presser l'ail hors de sa peau et mettre tous les légumes dans une casserole avec le bouillon. Chauffer 5 min.", "Mixer avec la moitié du basilic.", "Servir avec le reste du basilic et du pain grillé."])
    P("Crème de brocoli au fromage bleu", "Soupes", 30, ["plaques"], ["végétarien", "hiver"],
      [("brocoli", 1.5), "oignon", ("pomme-de-terre", 0.5), ("bouillon", 1.5), ("fromage-bleu", 0.6), ("creme", 0.5)],
      ["Détailler le brocoli en fleurettes, couper la pomme de terre en dés, émincer l'oignon.", "Mettre les légumes dans le bouillon et cuire 15 min.",
       "Mixer avec la crème et la moitié du fromage bleu.", "Servir avec le reste du fromage bleu émietté."])
    P("Soupe de petits pois à la menthe", "Soupes", 25, ["plaques"], ["végétarien", "printemps", "rapide"],
      [("petits-pois", 2), "oignon-nouveau", "menthe", ("bouillon", 1.5), ("creme", 0.5), ("beurre", 0.5)],
      ["Faire fondre l'oignon nouveau émincé dans le beurre 3 min.", "Ajouter les petits pois et le bouillon, cuire 8 min.",
       "Mixer avec la menthe et la crème. Saler, poivrer.", "Servir chaud ou bien frais l'été."])
    P("Gaspacho andalou", "Soupes", 20, [], ["végétarien", "été", "froid", "sans cuisson"],
      [("tomate", 3), "concombre", "poivron", "oignon-rouge", ("ail", 0.5), ("pain", 0.5), ("vinaigre", 1), ("huile-olive", 1.5)],
      ["Couper grossièrement les tomates, le concombre épluché, le poivron et l'oignon rouge.", "Mixer avec l'ail, le pain, le vinaigre, l'huile d'olive, sel et poivre jusqu'à obtenir un velouté lisse.",
       "Réfrigérer au moins 1 h.", "Servir bien froid avec quelques dés de légumes réservés."], "Espagnole")
    P("Bouillon de poulet aux nouilles et légumes", "Soupes", 40, ["plaques"], ["réconfort", "hiver"],
      [("poulet", 1), ("nouilles", 0.5), "carotte", ("celeri", 0.6), "oignon", ("bouillon", 2.5), "persil", "gingembre"],
      ["Couper la carotte et le céleri en petits dés, émincer l'oignon.", "Porter le bouillon à frémissement avec le gingembre en tranches et l'oignon, y pocher le poulet 15 min.",
       "Retirer le poulet, l'effilocher. Ajouter les légumes au bouillon et cuire 8 min.", "Ajouter les nouilles 4 min, puis remettre le poulet. Servir avec le persil ciselé."])
    P("Soupe de haricots blancs au chorizo", "Soupes", 35, ["plaques"], ["hiver", "épicé"],
      [("haricots-blancs", 1.5), ("chorizo", 0.8), "oignon", ("ail", 1), "tomate-concassee", ("bouillon", 1.5), "paprika", ("huile-olive", 0.5)],
      ["Couper le chorizo en rondelles et le faire revenir 3 min dans l'huile d'olive. Réserver.", "Faire revenir l'oignon haché et l'ail 4 min, ajouter le paprika.",
       "Ajouter la tomate concassée, les haricots blancs égouttés et le bouillon. Cuire 15 min.", "Mixer la moitié de la soupe pour l'épaissir, remettre le chorizo et servir."], "Espagnole")
    P("Harira", "Soupes", 70, ["plaques"], ["épicé", "hiver"],
      [("lentilles", 0.6), ("pois-chiches", 0.8), "tomate-concassee", "oignon", ("celeri", 0.5), "coriandre", "curcuma", "cannelle", "gingembre", ("farine", 0.15), "citron", ("huile-olive", 1)],
      ["Faire revenir l'oignon et le céleri hachés 5 min dans l'huile d'olive, ajouter le curcuma, la cannelle et le gingembre râpé.",
       "Ajouter les lentilles rincées, la tomate concassée et 1,5 litre d'eau. Laisser cuire 30 min.", "Ajouter les pois chiches égouttés et la moitié de la coriandre, cuire 10 min.",
       "Délayer la farine dans un peu d'eau froide et la verser en remuant pour épaissir légèrement. Cuire 5 min.", "Servir avec le reste de coriandre et un quartier de citron."], "Marocaine", serv=4, diff="Intermédiaire")
    P("Soupe de patate douce au lait de coco", "Soupes", 35, ["plaques"], ["végétarien", "épicé"],
      [("patate-douce", 1.5), "oignon", "gingembre", "lait-coco", ("bouillon", 1), "curry", "coriandre"],
      ["Éplucher et couper la patate douce en cubes, émincer l'oignon.", "Faire revenir l'oignon avec le gingembre râpé et le curry 3 min.",
       "Ajouter la patate douce et le bouillon, cuire 20 min.", "Mixer avec le lait de coco et servir avec la coriandre."], "Asiatique")
    P("Velouté de chou-fleur au curry", "Soupes", 30, ["plaques"], ["végétarien", "hiver"],
      [("chou-fleur", 1), "oignon", ("curry", 0.8), ("bouillon", 1.5), ("creme", 0.5), ("huile-olive", 0.5), ("amandes", 0.4)],
      ["Faire revenir l'oignon émincé dans l'huile d'olive avec le curry 3 min.", "Ajouter le chou-fleur en fleurettes et le bouillon, cuire 18 min.",
       "Mixer avec la crème.", "Servir avec les amandes grillées concassées."])
    P("Soupe paysanne aux légumes et lardons", "Soupes", 50, ["plaques"], ["hiver", "familial"],
      [("carotte", 1), ("poireau", 1), ("pomme-de-terre", 1), ("chou", 0.6), "lardons", "oignon", ("bouillon", 2)],
      ["Couper tous les légumes en petits morceaux.", "Faire dorer les lardons dans une cocotte, ajouter l'oignon et le poireau 5 min.",
       "Ajouter la carotte, la pomme de terre, le chou et le bouillon. Laisser mijoter 30 min.", "Poivrer et servir sans mixer, avec du pain."], serv=4)
    P("Soupe de lentilles vertes et carottes", "Soupes", 45, ["plaques"], ["végétarien", "économique"],
      [("lentilles", 1), ("carotte", 1), "oignon", ("ail", 1), "cumin", ("bouillon", 2), "persil", ("huile-olive", 0.5)],
      ["Faire revenir l'oignon et la carotte en dés 5 min dans l'huile d'olive, ajouter l'ail et le cumin.", "Ajouter les lentilles rincées et le bouillon, laisser cuire 30 min.",
       "Mixer une partie de la soupe pour la rendre onctueuse.", "Servir avec le persil haché."])
    P("Velouté de courgettes au chèvre frais", "Soupes", 25, ["plaques"], ["végétarien", "été", "rapide"],
      [("courgette", 2), "oignon", ("chevre", 0.8), ("bouillon", 1.2), "basilic", ("huile-olive", 0.5)],
      ["Couper les courgettes en rondelles et émincer l'oignon.", "Les faire revenir 5 min dans l'huile d'olive, ajouter le bouillon et cuire 12 min.",
       "Mixer avec le chèvre et le basilic.", "Servir chaud ou froid."])
    P("Soupe de céleri et pomme", "Soupes", 35, ["plaques"], ["végétarien", "hiver"],
      [("celeri", 2), "pomme", "oignon", ("beurre", 1), ("bouillon", 1.5), ("creme", 0.5), ("noix", 0.4)],
      ["Éplucher et couper le céleri et la pomme en cubes, émincer l'oignon.", "Faire revenir le tout 5 min dans le beurre.",
       "Verser le bouillon et cuire 20 min.", "Mixer avec la crème et servir avec les noix concassées."])
    P("Soupe de pois chiches, épinards et cumin", "Soupes", 30, ["plaques"], ["végétarien", "économique"],
      [("pois-chiches", 1.5), ("epinards", 0.8), "oignon", ("ail", 1), "cumin", "tomate-concassee", ("bouillon", 1.5), "citron", ("huile-olive", 0.5)],
      ["Faire revenir l'oignon, l'ail et le cumin 4 min dans l'huile d'olive.", "Ajouter la tomate concassée, les pois chiches égouttés et le bouillon, cuire 15 min.",
       "Ajouter les épinards 3 min.", "Écraser grossièrement quelques pois chiches pour épaissir et finir avec un filet de jus de citron."], "Orientale")
    P("Velouté d'asperges", "Soupes", 35, ["plaques"], ["végétarien", "printemps"],
      [("asperges", 2), ("pomme-de-terre", 0.5), "oignon", ("beurre", 1), ("bouillon", 1.5), ("creme", 0.6)],
      ["Couper les pointes des asperges et les réserver. Peler et tronçonner le reste.", "Faire revenir l'oignon dans le beurre, ajouter les tronçons d'asperges et la pomme de terre en dés.",
       "Verser le bouillon et cuire 20 min, en ajoutant les pointes pour les 5 dernières minutes. Les retirer.", "Mixer avec la crème et servir avec les pointes d'asperges."])
    P("Soupe au chou et au lard", "Soupes", 60, ["plaques"], ["hiver", "familial"],
      [("chou", 1.5), "lardons", ("pomme-de-terre", 1), "carotte", "oignon", ("bouillon", 2), "pain"],
      ["Couper le chou en lanières et le blanchir 5 min à l'eau bouillante.", "Faire revenir les lardons et l'oignon dans une cocotte.",
       "Ajouter le chou, les pommes de terre et la carotte en morceaux, puis le bouillon. Laisser mijoter 40 min.", "Servir très chaud sur une tranche de pain."], serv=4)
    P("Soupe froide de concombre au yaourt", "Soupes", 15, [], ["végétarien", "été", "froid", "sans cuisson"],
      [("concombre", 2), ("yaourt", 1.5), "menthe", ("ail", 0.5), "citron", ("huile-olive", 0.5)],
      ["Éplucher le concombre et le couper en morceaux.", "Mixer avec le yaourt, la menthe, l'ail, un trait de jus de citron, sel et poivre.",
       "Réfrigérer au moins 30 min.", "Servir avec un filet d'huile d'olive."], "Grecque")
    P("Velouté de betterave et crème", "Soupes", 35, ["plaques"], ["végétarien", "hiver"],
      [("betterave", 1.5), "oignon", ("pomme-de-terre", 0.5), ("bouillon", 1.5), ("creme", 0.8), "aneth"],
      ["Couper la betterave cuite, la pomme de terre et l'oignon en morceaux.", "Faire cuire le tout 20 min dans le bouillon.",
       "Mixer avec la moitié de la crème.", "Servir avec le reste de crème et l'aneth."], "Européenne de l'Est")
    P("Soupe de fenouil et pommes de terre", "Soupes", 35, ["plaques"], ["végétarien"],
      [("fenouil", 1.2), ("pomme-de-terre", 1), "oignon", ("bouillon", 1.5), ("creme", 0.5), ("huile-olive", 0.5)],
      ["Émincer le fenouil et l'oignon, couper les pommes de terre en cubes.", "Faire revenir le fenouil et l'oignon 6 min dans l'huile d'olive.",
       "Ajouter les pommes de terre et le bouillon, cuire 20 min.", "Mixer avec la crème et servir avec un peu de vert de fenouil."])
    P("Soupe de tomate et riz", "Soupes", 30, ["plaques"], ["économique", "familial"],
      ["tomate-concassee", ("riz", 0.4), "oignon", ("ail", 1), ("bouillon", 1.5), "herbes-provence", ("huile-olive", 0.5), ("parmesan", 0.4)],
      ["Faire revenir l'oignon et l'ail 4 min dans l'huile d'olive.", "Ajouter la tomate concassée, le bouillon et les herbes de Provence, porter à ébullition.",
       "Ajouter le riz et cuire 15 min.", "Servir avec le parmesan râpé."], "Méditerranéenne")
    P("Soupe de haricots rouges épicée", "Soupes", 35, ["plaques"], ["végétarien", "épicé"],
      [("haricots-rouges", 1.5), "oignon", "poivron", ("ail", 1), "cumin", "paprika", "tomate-concassee", ("bouillon", 1.2), "creme", "coriandre"],
      ["Faire revenir l'oignon, le poivron en dés et l'ail 6 min.", "Ajouter le cumin et le paprika, puis la tomate concassée, les haricots rouges égouttés et le bouillon. Cuire 15 min.",
       "Mixer la moitié de la soupe.", "Servir avec une cuillère de crème et la coriandre."], "Mexicaine")
    # ---------- salades ----------
    P("Salade de pâtes, pesto et poulet", "Salades", 25, ["plaques"], ["froid", "été"],
      ["pates", ("poulet", 0.8), "pesto", "tomate-cerise", ("mozzarella", 0.6), "basilic", ("huile-olive", 0.5)],
      ["Cuire les pâtes, les rincer à l'eau froide et les égoutter.", "Cuire le poulet 10 min à la poêle dans l'huile d'olive, le couper en morceaux.",
       "Mélanger les pâtes avec le pesto, le poulet, les tomates cerises coupées en deux et la mozzarella en dés.", "Parsemer de basilic et servir frais."], "Italienne")
    P("Taboulé libanais au boulgour", "Salades", 25, [], ["végétarien", "froid", "été"],
      [("boulgour", 0.5), ("persil", 3), "menthe", ("tomate", 1.5), "oignon-nouveau", ("citron", 1.5), ("huile-olive", 1.5)],
      ["Faire gonfler le boulgour 15 min dans de l'eau tiède, puis bien l'égoutter.", "Hacher finement le persil et la menthe, couper les tomates en petits dés, ciseler l'oignon nouveau.",
       "Mélanger le tout avec le boulgour : il doit y avoir plus de persil que de boulgour.", "Assaisonner avec le jus des citrons, l'huile d'olive, sel et poivre."], "Libanaise")
    P("Salade de chou à la carotte (coleslaw)", "Salades", 15, [], ["végétarien", "froid", "sans cuisson"],
      [("chou", 1), ("carotte", 1), "oignon-rouge", ("mayonnaise", 2), ("yaourt", 0.5), ("vinaigre", 0.5), ("sucre", 0.1)],
      ["Émincer très finement le chou, râper la carotte, émincer l'oignon rouge.", "Mélanger la mayonnaise, le yaourt, le vinaigre, le sucre, sel et poivre.",
       "Mélanger la sauce aux légumes.", "Laisser reposer 30 min au frais avant de servir."], "Américaine")
    P("Carottes râpées au citron", "Salades", 10, [], ["végétarien", "froid", "économique", "sans cuisson"],
      [("carotte", 1.2), "citron", ("huile-olive", 1), "persil", ("raisins-secs", 0.4)],
      ["Râper finement les carottes.", "Mélanger le jus du citron, l'huile d'olive, sel et poivre.", "Ajouter les raisins secs et le persil haché, mélanger et servir."])
    P("Salade de betterave, chèvre et noix", "Salades", 15, [], ["végétarien", "froid", "hiver"],
      [("betterave", 1), ("chevre", 0.8), ("noix", 0.6), "salade", ("vinaigre", 0.5), ("huile-olive", 1), ("miel", 0.3)],
      ["Couper la betterave cuite en dés.", "Préparer la vinaigrette : vinaigre, miel, huile d'olive, sel et poivre.",
       "Disposer la salade, la betterave, le chèvre émietté et les noix.", "Arroser de vinaigrette au moment de servir."])
    P("Salade d'endives, poires et fromage bleu", "Salades", 15, [], ["végétarien", "froid", "hiver"],
      [("endives", 1.5), "poire", ("fromage-bleu", 0.6), ("noix", 0.5), ("huile-olive", 1), ("vinaigre", 0.5), ("moutarde", 0.3)],
      ["Effeuiller les endives et les couper en tronçons.", "Couper la poire en lamelles.", "Préparer une vinaigrette avec la moutarde, le vinaigre et l'huile d'olive.",
       "Mélanger endives et poire, parsemer de fromage bleu émietté et de noix, arroser de vinaigrette."])
    P("Salade caprese", "Salades", 10, [], ["végétarien", "froid", "été", "sans cuisson"],
      [("tomate", 1.5), ("mozzarella", 1.2), "basilic", ("huile-olive", 1), "sel", "poivre"],
      ["Couper les tomates et la mozzarella en tranches.", "Les disposer en les alternant sur un plat avec les feuilles de basilic.",
       "Arroser d'huile d'olive, saler et poivrer juste avant de servir."], "Italienne")
    P("Concombre à la crème et à l'aneth", "Salades", 15, [], ["végétarien", "froid", "été"],
      [("concombre", 1.5), ("creme", 1), "aneth", "citron", "oignon-rouge"],
      ["Éplucher le concombre et le couper en fines rondelles. Le saler et le laisser dégorger 10 min, puis l'égoutter.",
       "Mélanger la crème, le jus du citron, l'aneth ciselé et l'oignon rouge très finement émincé.", "Ajouter le concombre, poivrer et servir frais."])
    P("Salade de pommes de terre au saumon fumé", "Salades", 30, ["plaques"], ["froid", "fête"],
      [("pomme-de-terre", 1.2), ("saumon-fume", 1), ("fromage-frais", 0.6), "aneth", "citron", "oignon-rouge", "salade"],
      ["Cuire les pommes de terre 20 min à l'eau salée, les laisser tiédir et les couper en rondelles.", "Mélanger le fromage frais avec le jus du citron et l'aneth.",
       "Mélanger les pommes de terre avec la sauce et l'oignon rouge émincé.", "Servir sur la salade avec le saumon fumé en lanières."], "Scandinave")
    P("Salade de haricots verts, œufs et thon", "Salades", 25, ["plaques"], ["froid", "été"],
      [("haricots-verts", 1.2), ("oeufs", 0.5), "thon", "oignon-rouge", ("moutarde", 0.3), ("vinaigre", 0.5), ("huile-olive", 1)],
      ["Cuire les haricots verts 8 min à l'eau bouillante salée, puis les rafraîchir.", "Cuire les œufs 10 min et les couper en quartiers.",
       "Préparer la vinaigrette avec la moutarde, le vinaigre et l'huile d'olive.", "Mélanger les haricots, l'oignon rouge émincé et le thon, ajouter les œufs et la vinaigrette."])
    P("Salade de quinoa aux légumes rôtis", "Salades", 40, ["four", "plaques"], ["végétarien", "froid"],
      [("quinoa", 1), "courgette", "poivron", "oignon-rouge", ("feta", 0.6), ("huile-olive", 1.5), "herbes-provence", "citron"],
      ["Préchauffer le four à 210 °C. Couper la courgette, le poivron et l'oignon rouge en morceaux, les mélanger avec la moitié de l'huile d'olive et les herbes de Provence, rôtir 25 min.",
       "Cuire le quinoa 12 min à l'eau salée et l'égoutter.", "Mélanger le quinoa, les légumes rôtis, le reste d'huile et le jus du citron.", "Parsemer de feta émiettée."])
    P("Salade de boulgour à la menthe et au citron", "Salades", 25, [], ["végétarien", "froid", "été"],
      [("boulgour", 1), "concombre", "tomate-cerise", "menthe", "persil", "citron", ("huile-olive", 1.5), ("pois-chiches", 0.6)],
      ["Cuire le boulgour 12 min à l'eau salée, l'égoutter et le laisser refroidir.", "Couper le concombre en dés et les tomates cerises en deux.",
       "Mélanger avec les pois chiches égouttés, la menthe et le persil ciselés.", "Assaisonner avec le jus du citron et l'huile d'olive."], "Orientale")
    P("Salade de poulet, avocat et maïs", "Salades", 25, ["plaques"], ["froid", "été"],
      [("poulet", 1), "avocat", "mais", "tomate", "salade", "citron-vert", ("huile-olive", 1), "coriandre"],
      ["Cuire le poulet 10 min à la poêle et le couper en lamelles.", "Couper l'avocat et la tomate en dés.",
       "Disposer la salade, le poulet, l'avocat, la tomate et le maïs égoutté.", "Arroser du jus du citron vert mélangé à l'huile d'olive, parsemer de coriandre."], "Mexicaine")
    P("Salade lyonnaise", "Salades", 25, ["plaques"], ["froid", "classique"],
      ["salade", "lardons", ("oeufs", 0.5), ("pain", 0.5), ("vinaigre", 1), ("moutarde", 0.3), ("huile-olive", 1)],
      ["Faire dorer les lardons sans matière grasse, puis les croûtons de pain coupés en dés dans leur graisse.", "Pocher les œufs 3 min dans de l'eau frémissante vinaigrée.",
       "Préparer la vinaigrette avec la moutarde, le reste du vinaigre et l'huile d'olive.", "Mélanger la salade avec la vinaigrette, ajouter lardons et croûtons, poser un œuf poché sur chaque assiette."], "Lyonnaise", diff="Intermédiaire")
    P("Salade de chèvre chaud au miel", "Salades", 20, ["four"], ["végétarien", "classique"],
      [("chevre", 1), ("pain", 0.6), ("miel", 0.5), "salade", ("noix", 0.5), ("huile-olive", 1), ("vinaigre", 0.5)],
      ["Préchauffer le gril du four. Poser une rondelle de chèvre sur chaque tranche de pain, arroser d'un filet de miel.", "Gratiner 5 min sous le gril.",
       "Assaisonner la salade avec l'huile d'olive, le vinaigre, sel et poivre.", "Servir les toasts chauds sur la salade avec les noix."])
    P("Salade de melon, jambon cru et menthe", "Salades", 15, [], ["froid", "été", "sans cuisson"],
      ["melon", ("jambon-cru", 1), ("mozzarella", 0.6), "menthe", ("huile-olive", 0.5), "poivre"],
      ["Couper le melon en morceaux ou en billes.", "Disposer avec le jambon cru et la mozzarella déchirée.", "Parsemer de menthe, arroser d'huile d'olive et poivrer."], "Italienne")
    P("Salade de nouilles au sésame et légumes croquants", "Salades", 25, ["plaques"], ["végétarien", "froid", "asiatique"],
      ["nouilles", "carotte", "concombre", "poivron", ("sesame", 1), ("sauce-soja", 1.5), ("miel", 0.5), ("vinaigre", 0.5), "oignon-nouveau"],
      ["Cuire les nouilles, les rincer à l'eau froide.", "Couper la carotte, le concombre et le poivron en fins bâtonnets.",
       "Mélanger la sauce soja, le miel et le vinaigre.", "Mélanger nouilles, légumes et sauce, parsemer de sésame et d'oignon nouveau."], "Asiatique")
    P("Salade tiède de lentilles et saumon", "Salades", 35, ["plaques"], ["poisson"],
      [("lentilles", 1), ("saumon", 0.8), "oignon-rouge", "persil", ("moutarde", 0.5), ("vinaigre", 1), ("huile-olive", 1.5)],
      ["Cuire les lentilles 20 min à l'eau, saler en fin de cuisson et égoutter.", "Cuire le saumon 4 min de chaque côté à la poêle, puis l'effeuiller.",
       "Préparer une vinaigrette avec la moutarde, le vinaigre et l'huile d'olive.", "Mélanger les lentilles tièdes, l'oignon rouge, le persil et la vinaigrette, ajouter le saumon."])
    P("Salade de crevettes, mangue et avocat", "Salades", 20, ["plaques"], ["froid", "été", "fête"],
      [("crevettes", 1), "mangue", "avocat", "salade", "citron-vert", "coriandre", ("huile-olive", 1)],
      ["Saisir les crevettes 2 min à la poêle avec un peu d'huile d'olive.", "Couper la mangue et l'avocat en dés.",
       "Mélanger avec la salade et la coriandre.", "Assaisonner avec le jus du citron vert, le reste d'huile, sel et poivre, ajouter les crevettes."], "Exotique")
    P("Salade de semoule, pois chiches et raisins secs", "Salades", 20, [], ["végétarien", "froid", "économique"],
      [("semoule", 1), ("pois-chiches", 0.8), ("raisins-secs", 0.6), "menthe", "citron", "cumin", ("huile-olive", 1.5), "oignon-rouge"],
      ["Verser de l'eau bouillante salée sur la semoule à hauteur, couvrir 5 min puis égrener.", "Ajouter les pois chiches égouttés, les raisins secs, l'oignon rouge émincé et la menthe.",
       "Assaisonner avec le jus du citron, le cumin, l'huile d'olive, sel et poivre.", "Servir frais."], "Orientale")
    P("Salade de tomates, oignon rouge et basilic", "Salades", 10, [], ["végétarien", "froid", "été", "sans cuisson"],
      [("tomate", 2), "oignon-rouge", "basilic", ("huile-olive", 1), ("vinaigre", 0.5)],
      ["Couper les tomates en quartiers et l'oignon rouge en fines rondelles.", "Les disposer dans un plat avec le basilic.",
       "Arroser d'huile d'olive et de vinaigre, saler et poivrer."])
    P("Salade Waldorf", "Salades", 15, [], ["végétarien", "froid", "automne"],
      [("celeri", 1), "pomme", ("raisin", 0.6), ("noix", 0.6), ("mayonnaise", 1.5), "citron", "salade"],
      ["Couper le céleri en tronçons fins et la pomme en dés, les arroser de jus de citron.", "Couper les grains de raisin en deux.",
       "Mélanger avec la mayonnaise et les noix concassées.", "Servir sur des feuilles de salade."], "Américaine")
    P("Salade de brocoli, feta et amandes", "Salades", 20, ["plaques"], ["végétarien", "froid"],
      [("brocoli", 1.2), ("feta", 0.6), ("amandes", 0.6), "oignon-rouge", "citron", ("huile-olive", 1)],
      ["Cuire les fleurettes de brocoli 3 min à l'eau bouillante, puis les rafraîchir : elles doivent rester croquantes.", "Faire griller les amandes à sec.",
       "Mélanger le brocoli, l'oignon rouge émincé et la feta émiettée.", "Assaisonner avec le jus du citron et l'huile d'olive, parsemer d'amandes."])
    # ---------- entrées et apéritif ----------
    P("Guacamole maison", "Salades", 10, [], ["végétarien", "apéritif", "sans cuisson"],
      [("avocat", 2), "citron-vert", "tomate", "oignon-rouge", "coriandre", "sel"],
      ["Écraser la chair des avocats à la fourchette avec le jus du citron vert.", "Ajouter la tomate en petits dés, l'oignon rouge haché et la coriandre ciselée.",
       "Saler, mélanger et servir aussitôt avec des légumes ou des chips de tortilla."], "Mexicaine", meal=AP)
    P("Tzatziki", "Salades", 10, [], ["végétarien", "apéritif", "sans cuisson"],
      [("yaourt", 2), "concombre", ("ail", 0.5), "menthe", ("huile-olive", 0.5), "pita"],
      ["Râper le concombre, le saler et le presser pour retirer l'eau.", "Mélanger le yaourt, le concombre, l'ail écrasé et la menthe ciselée.",
       "Arroser d'huile d'olive et servir avec le pain pita."], "Grecque", meal=AP)
    P("Rillettes de thon", "Salades", 10, [], ["apéritif", "sans cuisson", "économique"],
      [("thon", 1.5), ("fromage-frais", 1), "citron", "ciboulette", "pain"],
      ["Égoutter le thon et l'écraser à la fourchette.", "Mélanger avec le fromage frais, le jus du citron et la ciboulette ciselée. Poivrer.",
       "Réfrigérer 15 min et servir sur du pain grillé."], meal=AP)
    P("Caviar d'aubergine", "Salades", 50, ["four"], ["végétarien", "apéritif"],
      [("aubergine", 2), ("ail", 1), "citron", ("huile-olive", 1.5), "cumin", "persil", "pain"],
      ["Préchauffer le four à 200 °C. Piquer les aubergines et les cuire entières 40 min, jusqu'à ce qu'elles soient très tendres.",
       "Récupérer la chair et l'écraser avec l'ail, le jus du citron, l'huile d'olive et le cumin.", "Saler, ajouter le persil haché et servir frais avec du pain."], "Orientale", meal=AP)
    P("Bruschetta tomate-basilic", "Sandwichs", 15, ["four"], ["végétarien", "apéritif", "été"],
      [("pain", 1), ("tomate", 1.2), ("ail", 1), "basilic", ("huile-olive", 1)],
      ["Faire griller les tranches de pain au four ou au grille-pain.", "Les frotter avec une gousse d'ail coupée.",
       "Couper les tomates en petits dés, les mélanger avec le basilic, l'huile d'olive, sel et poivre.", "Garnir le pain au dernier moment."], "Italienne", meal=AP)
    P("Gougères au fromage", "Tartes & pizzas", 45, ["four", "plaques"], ["apéritif", "fête"],
      [("farine", 0.6), ("beurre", 2.5), ("oeufs", 0.75), ("emmental", 1), ("lait", 0.3)],
      ["Préchauffer le four à 190 °C. Porter à ébullition 6 cl d'eau, le lait et le beurre avec une pincée de sel.", "Hors du feu, ajouter la farine d'un coup et mélanger, puis dessécher la pâte 1 min sur le feu.",
       "Incorporer les œufs un à un, puis l'emmental râpé.", "Former des petits tas sur une plaque et cuire 22 min sans ouvrir le four."], "Bourguignonne", meal=AP, serv=4, diff="Intermédiaire")
    P("Cake salé jambon-olives", "Gratins & four", 55, ["four"], ["apéritif", "pique-nique"],
      [("farine", 1.2), ("oeufs", 0.75), ("lait", 0.5), ("huile-olive", 2), "levure", ("jambon", 1.2), ("olives", 1), ("emmental", 0.8)],
      ["Préchauffer le four à 180 °C. Fouetter les œufs avec le lait et l'huile d'olive.", "Ajouter la farine et la levure, mélanger sans excès.",
       "Incorporer le jambon en dés, les olives et l'emmental râpé. Saler peu, poivrer.", "Verser dans un moule à cake beurré et cuire 40 min. Laisser tiédir avant de couper."], meal=A, serv=6)
    P("Feuilletés au fromage", "Tartes & pizzas", 25, ["four"], ["apéritif", "rapide"],
      ["pate-feuilletee", ("emmental", 0.8), ("oeufs", 0.25), "paprika"],
      ["Préchauffer le four à 200 °C. Étaler la pâte feuilletée et la badigeonner d'œuf battu.", "Parsemer la moitié d'emmental râpé et d'un peu de paprika, replier l'autre moitié par-dessus.",
       "Découper des bandes, les torsader et les poser sur une plaque.", "Cuire 12 à 15 min jusqu'à ce qu'ils soient dorés."], meal=AP)
    P("Tapenade maison", "Salades", 10, [], ["végétarien", "apéritif", "sans cuisson"],
      [("olives", 2), ("ail", 0.5), ("huile-olive", 1), "citron", "herbes-provence", "pain"],
      ["Mixer les olives dénoyautées avec l'ail, l'huile d'olive, un trait de jus de citron et les herbes de Provence.", "Mixer par à-coups pour garder un peu de texture.",
       "Servir sur des tranches de pain grillé."], "Provençale", meal=AP)
    P("Rillettes de sardines", "Salades", 10, [], ["apéritif", "sans cuisson", "économique"],
      [("sardines", 1.5), ("fromage-frais", 0.8), "citron", "ciboulette", "pain"],
      ["Égoutter les sardines et retirer l'arête centrale.", "Les écraser avec le fromage frais, le jus du citron et la ciboulette ciselée. Poivrer.",
       "Servir frais sur du pain grillé."], meal=AP)
    # ---------- œufs ----------
    P("Œufs bénédicte", "Œufs", 30, ["plaques"], ["brunch", "week-end"],
      [("oeufs", 1), ("pain-mie", 1), ("jambon", 0.8), ("beurre", 3), "citron", ("vinaigre", 0.5)],
      ["Sauce hollandaise : fouetter 2 jaunes d'œufs avec 2 cuillères d'eau au bain-marie, puis incorporer le beurre fondu petit à petit en fouettant. Ajouter un trait de jus de citron, saler.",
       "Pocher les autres œufs 3 min dans de l'eau frémissante vinaigrée.", "Faire griller le pain de mie et poser une tranche de jambon dessus.",
       "Déposer l'œuf poché et napper de sauce hollandaise. Servir aussitôt."], "Américaine", meal=B + ("Déjeuner",), diff="Intermédiaire")
    P("Omelette aux fines herbes", "Œufs", 10, ["plaques"], ["végétarien", "rapide"],
      [("oeufs", 1.5), "herbes-fraiches", "ciboulette", ("beurre", 0.5)],
      ["Battre les œufs avec les herbes fraîches et la ciboulette ciselées, sel et poivre.", "Faire mousser le beurre dans une poêle.",
       "Verser les œufs et remuer doucement à la fourchette 1 min, puis laisser prendre 1 min.", "Plier l'omelette en deux : l'intérieur doit rester baveux."])
    P("Œufs en meurette", "Œufs", 45, ["plaques"], ["week-end", "classique"],
      [("oeufs", 1), ("vin-rouge", 3), "lardons", "champignons", "oignon", ("beurre", 1), ("farine", 0.1), "pain"],
      ["Faire revenir les lardons, l'oignon et les champignons dans la moitié du beurre.", "Verser le vin rouge, porter à ébullition et laisser réduire de moitié.",
       "Épaissir avec la farine mélangée au reste du beurre, cuire 3 min : la sauce doit napper.", "Pocher les œufs 3 min dans la sauce frémissante ou dans de l'eau.",
       "Servir les œufs nappés de sauce sur du pain grillé."], "Bourguignonne", diff="Intermédiaire")
    P("Œufs cocotte au saumon fumé", "Œufs", 20, ["four"], ["fête", "brunch"],
      [("oeufs", 1), ("saumon-fume", 0.6), "creme", "ciboulette", "pain"],
      ["Préchauffer le four à 180 °C. Beurrer des ramequins et y mettre le saumon fumé en lanières.", "Casser un œuf dans chaque ramequin, ajouter une cuillère de crème, poivrer.",
       "Cuire 12 min au bain-marie dans le four : le blanc doit être pris et le jaune coulant.", "Parsemer de ciboulette et servir avec des mouillettes de pain."])
    P("Quiche sans pâte aux légumes", "Œufs", 45, ["four", "plaques"], ["végétarien", "léger"],
      [("oeufs", 1), ("lait", 1.5), "courgette", "poivron", "oignon", ("fromage-rape", 0.8), ("farine", 0.3), ("huile-olive", 0.5)],
      ["Préchauffer le four à 180 °C. Faire revenir l'oignon, le poivron et la courgette en dés 8 min dans l'huile d'olive.",
       "Fouetter les œufs avec la farine puis le lait, saler et poivrer.", "Ajouter les légumes et le fromage râpé, verser dans un moule beurré.", "Cuire 30 min jusqu'à ce que la quiche soit prise et dorée."])
    P("Œufs mollets et asperges", "Œufs", 20, ["plaques"], ["printemps", "léger"],
      [("asperges", 1.5), ("oeufs", 1), ("parmesan", 0.4), ("beurre", 0.5), "pain"],
      ["Cuire les asperges 8 à 10 min à l'eau bouillante salée.", "Cuire les œufs 6 min dans l'eau bouillante, les rafraîchir et les écaler délicatement.",
       "Disposer les asperges, arroser de beurre fondu et parsemer de parmesan.", "Poser les œufs mollets dessus et servir avec du pain."])
    P("Huevos rancheros", "Œufs", 25, ["plaques"], ["brunch", "épicé"],
      [("oeufs", 1), ("wrap", 1), ("haricots-rouges", 0.6), "tomate-concassee", "oignon", "cumin", "avocat", "coriandre", ("huile-olive", 0.5)],
      ["Faire revenir l'oignon haché dans l'huile d'olive avec le cumin, ajouter la tomate concassée et les haricots rouges égouttés, laisser mijoter 8 min.", "Cuire les œufs au plat.",
       "Réchauffer les wraps à sec dans une poêle.", "Garnir chaque wrap de sauce aux haricots, d'un œuf, d'avocat en tranches et de coriandre."], "Mexicaine", meal=B + ("Déjeuner",))
    # ---------- sandwichs et tartines ----------
    P("Club sandwich au poulet", "Sandwichs", 25, ["plaques"], ["rapide", "pique-nique"],
      [("pain-mie", 1.5), ("poulet", 0.8), ("lardons", 0.6), "tomate", "salade", ("mayonnaise", 1), ("oeufs", 0.25)],
      ["Cuire le poulet à la poêle et l'émincer. Faire dorer les lardons. Cuire l'œuf 10 min et le trancher.", "Faire griller le pain de mie.",
       "Monter trois étages : mayonnaise, salade, poulet et lardons, puis tomate et œuf.", "Couper en triangles et maintenir avec des piques."], "Américaine")
    P("Croque au thon et fromage", "Sandwichs", 15, ["four"], ["rapide", "économique"],
      [("pain-mie", 1), "thon", ("mayonnaise", 0.5), ("emmental", 0.8), "oignon-rouge"],
      ["Mélanger le thon égoutté avec la mayonnaise et un peu d'oignon rouge haché.", "Tartiner sur le pain de mie et couvrir d'emmental.",
       "Passer 6 à 8 min sous le gril du four jusqu'à ce que le fromage soit doré."], "Américaine")
    P("Bagel saumon fumé et fromage frais", "Sandwichs", 10, [], ["rapide", "brunch", "sans cuisson"],
      ["bagel", ("saumon-fume", 0.8), ("fromage-frais", 0.6), "concombre", "aneth", "citron"],
      ["Ouvrir les bagels et les toaster légèrement.", "Tartiner de fromage frais mélangé à l'aneth et à un trait de jus de citron.",
       "Garnir de saumon fumé et de fines rondelles de concombre, refermer."], "Américaine", meal=B + ("Déjeuner",))
    P("Jambon-beurre", "Sandwichs", 5, [], ["rapide", "pique-nique", "sans cuisson"],
      [("pain", 1), ("beurre", 1), ("jambon", 1), "cornichons"],
      ["Couper le pain dans la longueur sans séparer complètement les deux moitiés.", "Tartiner généreusement de beurre.",
       "Garnir de jambon plié et de cornichons en lamelles."])
    P("Hot-dog maison", "Sandwichs", 15, ["plaques"], ["rapide", "enfants"],
      [("pain", 1), ("saucisses", 1), "oignon", ("moutarde", 0.5), ("ketchup", 0.5), ("cornichons", 0.5)],
      ["Faire dorer les saucisses 10 min à la poêle.", "Faire revenir l'oignon émincé jusqu'à ce qu'il soit fondant.",
       "Ouvrir les pains, y glisser les saucisses et les oignons.", "Ajouter moutarde, ketchup et cornichons en dés."], "Américaine")
    P("Pan bagnat", "Sandwichs", 15, [], ["pique-nique", "été", "sans cuisson"],
      [("pain", 1.2), "thon", "tomate", ("oeufs", 0.5), "poivron", "oignon-rouge", "olives", ("huile-olive", 1)],
      ["Ouvrir les pains ronds et arroser généreusement la mie d'huile d'olive.", "Garnir de tomate en rondelles, poivron et oignon rouge émincés, thon, olives et œuf dur en tranches.",
       "Refermer, presser et laisser reposer 30 min pour que le pain s'imprègne."], "Niçoise")
    P("Kebab maison au poulet", "Sandwichs", 30, ["plaques"], ["familial"],
      [("poulet", 1.2), ("pita", 1), ("yaourt", 1), ("ail", 1), "paprika", "cumin", "salade", "tomate", "oignon-rouge", "citron"],
      ["Couper le poulet en fines lanières et le mariner 15 min avec la moitié du yaourt, le paprika, le cumin et un trait de jus de citron.",
       "Mélanger le reste du yaourt avec l'ail écrasé : c'est la sauce blanche.", "Saisir le poulet 8 min à feu vif jusqu'à ce qu'il dore.",
       "Garnir les pains pita chauds de poulet, salade, tomate, oignon rouge et sauce."], "Turque")
    P("Wrap végétarien houmous et crudités", "Sandwichs", 10, [], ["végétarien", "rapide", "sans cuisson"],
      [("wrap", 1), ("houmous", 1), "carotte", "concombre", "salade", "avocat"],
      ["Tartiner les wraps de houmous.", "Garnir de carotte râpée, concombre en bâtonnets, salade et avocat en tranches.", "Rouler serré et couper en deux."])
    P("Burger au poulet croustillant", "Sandwichs", 35, ["plaques"], ["familial", "enfants"],
      [("poulet", 1), ("chapelure", 0.8), ("oeufs", 0.25), ("farine", 0.3), ("pain", 1), "salade", "tomate", ("mayonnaise", 1), ("huile-olive", 1.5)],
      ["Aplatir les filets de poulet et les passer dans la farine, l'œuf battu puis la chapelure.", "Les faire dorer 5 min par face dans l'huile d'olive.",
       "Toaster les pains, les tartiner de mayonnaise.", "Garnir de salade, de tomate et du poulet croustillant."], "Américaine")
    P("Tartine champignons et œuf poché", "Sandwichs", 20, ["plaques"], ["végétarien", "brunch"],
      [("pain", 1), "champignons", ("oeufs", 0.5), ("ail", 0.5), ("beurre", 1), "persil", ("vinaigre", 0.3)],
      ["Faire sauter les champignons émincés avec l'ail dans le beurre 6 min.", "Pocher les œufs 3 min dans de l'eau frémissante vinaigrée.",
       "Faire griller le pain, le garnir de champignons.", "Poser l'œuf poché et parsemer de persil."], meal=B + ("Déjeuner", "Dîner"))
    # ---------- petits-déjeuners ----------
    P("Pancakes aux fruits rouges", "Petit-déjeuner", 25, ["plaques"], ["végétarien", "week-end"],
      [("farine", 1), ("lait", 1.2), ("oeufs", 0.5), ("sucre", 0.3), "levure", ("fruits-rouges", 1), ("beurre", 0.5), ("miel", 0.5)],
      ["Mélanger la farine, le sucre et la levure. Ajouter les œufs puis le lait en fouettant, et le beurre fondu.", "Ajouter la moitié des fruits rouges.",
       "Cuire de petites louches de pâte 2 min par face dans une poêle légèrement beurrée.", "Servir avec le reste des fruits rouges et un filet de miel."], "Américaine", meal=B)
    P("Porridge pomme-cannelle", "Petit-déjeuner", 10, ["plaques"], ["végétarien", "rapide", "hiver"],
      [("flocons-avoine", 1), ("lait", 1.5), "pomme", "cannelle", ("miel", 0.5), ("noix", 0.3)],
      ["Faire chauffer les flocons d'avoine dans le lait 5 min en remuant.", "Ajouter la pomme râpée et la cannelle, cuire 2 min.",
       "Servir avec un filet de miel et les noix concassées."], meal=B)
    P("Muesli maison aux fruits secs", "Petit-déjeuner", 10, [], ["végétarien", "sans cuisson"],
      [("flocons-avoine", 1.5), ("noisettes", 0.6), ("amandes", 0.5), ("raisins-secs", 0.5), ("lait", 1.5), "pomme"],
      ["Concasser grossièrement les noisettes et les amandes.", "Mélanger avec les flocons d'avoine et les raisins secs (le mélange se garde en bocal).",
       "Servir avec le lait froid et la pomme en dés."], "Suisse", meal=B)
    P("Smoothie bowl aux fruits rouges", "Petit-déjeuner", 10, [], ["végétarien", "sans cuisson", "été"],
      [("fruits-rouges", 1.5), "banane", ("yaourt", 1), ("flocons-avoine", 0.4), "kiwi", ("miel", 0.3)],
      ["Mixer les fruits rouges, la moitié de la banane et le yaourt jusqu'à obtenir une crème épaisse.", "Verser dans des bols.",
       "Décorer avec le reste de banane en rondelles, le kiwi en dés, les flocons d'avoine et un filet de miel."], meal=B)
    P("Œufs au plat, jambon et toast", "Petit-déjeuner", 10, ["plaques"], ["rapide", "brunch"],
      [("oeufs", 1), ("jambon", 0.8), ("pain", 0.6), ("beurre", 0.5)],
      ["Faire griller le pain.", "Faire chauffer le jambon 1 min à la poêle avec le beurre.", "Casser les œufs à côté et cuire 3 min à feu moyen : le blanc doit être pris.", "Saler, poivrer et servir avec le pain."], "Anglaise", meal=B + ("Déjeuner",))
    P("Bircher muesli", "Petit-déjeuner", 10, [], ["végétarien", "sans cuisson"],
      [("flocons-avoine", 1), ("yaourt", 1), ("lait", 0.8), "pomme", "citron", ("miel", 0.4), ("noisettes", 0.3)],
      ["La veille, mélanger les flocons d'avoine avec le lait et le yaourt. Réserver au frais toute la nuit.", "Le matin, ajouter la pomme râpée arrosée d'un peu de jus de citron.",
       "Servir avec le miel et les noisettes concassées."], "Suisse", meal=B)
    P("Tartines ricotta, miel et poires", "Petit-déjeuner", 10, [], ["végétarien", "rapide"],
      [("pain", 1), ("ricotta", 1), "poire", ("miel", 0.5), ("noix", 0.3)],
      ["Faire griller le pain.", "Tartiner de ricotta.", "Ajouter la poire en fines lamelles, un filet de miel et les noix concassées."], meal=B + ("Goûter",))
    P("Muffins banane-avoine", "Petit-déjeuner", 35, ["four"], ["végétarien", "goûter"],
      [("banane", 2), ("flocons-avoine", 1), ("farine", 0.6), ("oeufs", 0.5), ("lait", 0.5), ("miel", 2), "levure", ("huile-olive", 1)],
      ["Préchauffer le four à 180 °C. Écraser les bananes.", "Ajouter les œufs, le lait, le miel et l'huile, puis la farine, les flocons d'avoine et la levure.",
       "Répartir dans des moules à muffins.", "Cuire 20 min."], meal=B + ("Goûter",), serv=6)
    P("Bol de fromage blanc, kiwi et noix", "Petit-déjeuner", 5, [], ["végétarien", "rapide", "sans cuisson"],
      [("fromage-frais", 1.5), "kiwi", ("noix", 0.4), ("miel", 0.3), ("flocons-avoine", 0.3)],
      ["Verser le fromage blanc dans des bols.", "Ajouter le kiwi en dés, les noix concassées et les flocons d'avoine.", "Arroser d'un filet de miel."], meal=B)
    P("Smoothie vert épinards, banane et pomme", "Petit-déjeuner", 5, [], ["végétarien", "rapide", "sans cuisson"],
      [("epinards", 0.4), "banane", "pomme", ("lait-vegetal", 1), "citron"],
      ["Mettre les épinards, la banane, la pomme en morceaux et le lait végétal dans le blender.", "Ajouter un trait de jus de citron.", "Mixer jusqu'à ce que ce soit bien lisse et servir aussitôt."], meal=B)
    return R
