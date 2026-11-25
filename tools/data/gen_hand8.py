# -*- coding: utf-8 -*-
"""Recettes, lot 5 : pâtes, riz, poêlées, currys, mijotés et poissons (plats connus, écrits à la main)."""
from gen_hand1 import H, COOK_PASTA


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- pâtes ----------
    P("Linguine aux moules", "Pâtes", 30, ["plaques"], ["pâtes", "poisson"],
      ["pates", ("moules", 1.5), ("ail", 1.5), ("vin-blanc", 1), "tomate-cerise", "persil", ("huile-olive", 1)],
      ["Gratter et rincer les moules, jeter celles qui restent ouvertes.", COOK_PASTA,
       "Faire revenir l'ail émincé dans l'huile d'olive 1 min, ajouter les moules et le vin blanc, couvrir et cuire 5 min jusqu'à ce qu'elles s'ouvrent.",
       "Ajouter les tomates cerises coupées en deux et les pâtes, mélanger 1 min dans le jus. Parsemer de persil et servir."], "Italienne")
    P("Pâtes à la puttanesca", "Pâtes", 25, ["plaques"], ["pâtes", "économique"],
      ["pates", "tomate-concassee", ("olives", 1), ("ail", 1), ("cornichons", 0.3), "persil", ("huile-olive", 1)],
      ["Faire revenir l'ail émincé dans l'huile d'olive 1 min.", "Ajouter la tomate concassée, les olives coupées et les cornichons hachés (à la place des câpres). Laisser mijoter 12 min.",
       COOK_PASTA, "Mélanger les pâtes à la sauce, poivrer généreusement et parsemer de persil."], "Italienne")
    P("Penne all'arrabbiata", "Pâtes", 25, ["plaques"], ["pâtes", "végétarien", "épicé", "économique"],
      ["pates", "tomate-concassee", ("ail", 1.5), "paprika", ("huile-olive", 1), "persil", ("parmesan", 0.5)],
      ["Faire chauffer l'huile d'olive avec l'ail émincé et le paprika (ou du piment) 1 min sans laisser brûler.", "Ajouter la tomate concassée, saler et laisser mijoter 15 min.",
       COOK_PASTA, "Mélanger les pâtes à la sauce, parsemer de persil et de parmesan."], "Italienne")
    P("Spaghetti cacio e pepe", "Pâtes", 15, ["plaques"], ["pâtes", "végétarien", "rapide"],
      ["pates", ("parmesan", 2), ("poivre", 3), ("beurre", 0.5)],
      ["Cuire les pâtes dans un peu moins d'eau que d'habitude, en gardant un grand verre d'eau de cuisson.", "Faire griller le poivre fraîchement moulu 30 secondes dans une poêle avec le beurre.",
       "Hors du feu, ajouter les pâtes égouttées et un peu d'eau de cuisson, puis le parmesan râpé en remuant vivement.", "Ajouter de l'eau de cuisson petit à petit jusqu'à obtenir une sauce crémeuse. Servir aussitôt."], "Italienne")
    P("Pâtes primavera", "Pâtes", 25, ["plaques"], ["pâtes", "végétarien", "printemps"],
      ["pates", ("asperges", 0.6), ("petits-pois", 0.6), "courgette", ("ail", 1), ("creme", 0.5), ("parmesan", 0.6), "basilic", ("huile-olive", 0.5)],
      ["Couper les asperges en tronçons et la courgette en dés.", COOK_PASTA,
       "Faire sauter les légumes et l'ail 6 min dans l'huile d'olive, ajouter les petits pois 2 min.", "Ajouter la crème, les pâtes et le parmesan, mélanger. Servir avec le basilic."], "Italienne")
    P("One pot pasta tomate-basilic", "Pâtes", 20, ["plaques"], ["pâtes", "végétarien", "rapide", "économique"],
      ["pates", "tomate-cerise", "oignon", ("ail", 1), "basilic", ("bouillon", 1.2), ("huile-olive", 0.5), ("parmesan", 0.5)],
      ["Mettre dans une grande sauteuse les pâtes crues, les tomates cerises coupées en deux, l'oignon émincé, l'ail, la moitié du basilic et l'huile d'olive.",
       "Verser le bouillon et porter à ébullition.", "Cuire 10 à 12 min en remuant souvent, jusqu'à ce que le liquide ait presque disparu.", "Servir avec le parmesan et le reste de basilic."], "Italienne")
    P("Lasagnes au saumon et aux épinards", "Gratins & four", 60, ["four", "plaques"], ["poisson", "familial"],
      ["lasagnes", ("saumon", 1.5), ("epinards", 1.5), ("bechamel", 2), ("fromage-rape", 1), ("ail", 1)],
      ["Préchauffer le four à 180 °C. Faire tomber les épinards avec l'ail 3 min, bien les égoutter.", "Couper le saumon en dés.",
       "Dans un plat, alterner béchamel, pâtes à lasagnes, épinards et saumon, sur trois couches.", "Finir par de la béchamel et le fromage râpé. Cuire 35 min."], serv=4, diff="Intermédiaire")
    P("Pâtes aux saucisses et au brocoli", "Pâtes", 25, ["plaques"], ["pâtes", "familial"],
      ["pates", ("saucisses", 0.8), ("brocoli", 1), ("ail", 1), ("parmesan", 0.6), ("huile-olive", 0.5)],
      ["Retirer la peau des saucisses et émietter la chair.", COOK_PASTA + " Ajouter le brocoli en petites fleurettes 4 min avant la fin.",
       "Faire dorer la chair à saucisse avec l'ail dans l'huile d'olive 6 min.", "Mélanger avec les pâtes et le brocoli, un peu d'eau de cuisson et le parmesan."], "Italienne")
    P("Pâtes à la crème de poivrons", "Pâtes", 35, ["four", "plaques"], ["pâtes", "végétarien"],
      ["pates", ("poivron", 2), ("ail", 1), ("fromage-frais", 0.8), "basilic", ("huile-olive", 0.5), ("parmesan", 0.4)],
      ["Préchauffer le four à 220 °C. Rôtir les poivrons coupés en lanières avec l'ail et l'huile d'olive 20 min.", "Mixer les poivrons et l'ail avec le fromage frais et un peu d'eau.",
       COOK_PASTA, "Mélanger les pâtes à la crème de poivrons, servir avec le basilic et le parmesan."])
    P("Pâtes au thon, crème et citron", "Pâtes", 20, ["plaques"], ["pâtes", "économique", "rapide"],
      ["pates", "thon", ("creme", 1), "citron", "persil", ("ail", 0.5)],
      [COOK_PASTA, "Faire chauffer la crème avec l'ail écrasé et le zeste du citron.", "Ajouter le thon émietté et un trait de jus de citron, poivrer.", "Mélanger avec les pâtes et parsemer de persil."])
    P("Pâtes au potimarron, noisettes et parmesan", "Pâtes", 35, ["plaques"], ["pâtes", "végétarien", "automne"],
      ["pates", ("potimarron", 0.6), "oignon", ("creme", 0.6), ("noisettes", 0.6), ("parmesan", 0.6), ("huile-olive", 0.5)],
      ["Couper le potimarron en petits cubes sans l'éplucher.", "Le faire revenir avec l'oignon émincé dans l'huile d'olive, couvrir et cuire 15 min.",
       COOK_PASTA, "Écraser une partie du potimarron avec la crème, ajouter les pâtes et le parmesan. Parsemer de noisettes grillées concassées."])
    P("Bolognaise de lentilles", "Pâtes", 45, ["plaques"], ["pâtes", "végétarien", "économique"],
      ["pates", ("lentilles", 0.6), "carotte", "oignon", ("celeri", 0.5), "tomate-concassee", ("ail", 1), "herbes-provence", ("huile-olive", 0.5), ("parmesan", 0.5)],
      ["Hacher finement l'oignon, la carotte et le céleri, les faire revenir 6 min dans l'huile d'olive avec l'ail.", "Ajouter les lentilles rincées, la tomate concassée, les herbes de Provence et 30 cl d'eau.",
       "Laisser mijoter 30 min à couvert : les lentilles doivent être fondantes.", COOK_PASTA, "Servir la sauce sur les pâtes avec le parmesan."], "Italienne")
    P("Tagliatelles au saumon fumé", "Pâtes", 15, ["plaques"], ["pâtes", "poisson", "rapide"],
      ["pates", ("saumon-fume", 1), ("creme", 1), "aneth", "citron"],
      [COOK_PASTA, "Faire chauffer la crème avec le zeste du citron.", "Hors du feu, ajouter le saumon fumé en lanières et l'aneth.", "Mélanger avec les pâtes, poivrer et servir."])
    P("Pâtes aux légumes grillés et feta", "Pâtes", 35, ["four", "plaques"], ["pâtes", "végétarien", "été"],
      ["pates", "courgette", "aubergine", "poivron", ("feta", 0.8), ("huile-olive", 1.5), "herbes-provence", "basilic"],
      ["Préchauffer le four à 220 °C. Couper la courgette, l'aubergine et le poivron en dés, les mélanger avec l'huile d'olive et les herbes de Provence.",
       "Rôtir 25 min.", COOK_PASTA, "Mélanger les pâtes et les légumes, émietter la feta et parsemer de basilic."], "Méditerranéenne")
    P("Pâtes aux champignons et jambon cru", "Pâtes", 25, ["plaques"], ["pâtes"],
      ["pates", "champignons", ("jambon-cru", 0.8), ("creme", 0.6), ("ail", 1), ("parmesan", 0.5), ("beurre", 0.5)],
      [COOK_PASTA, "Faire sauter les champignons émincés et l'ail dans le beurre 8 min.", "Ajouter la crème et laisser réduire 2 min.",
       "Mélanger avec les pâtes, ajouter le jambon cru déchiré et le parmesan."], "Italienne")
    P("Pâtes aux courgettes et lardons", "Pâtes", 25, ["plaques"], ["pâtes", "été", "familial"],
      ["pates", ("courgette", 1.2), "lardons", ("ail", 0.5), ("creme", 0.5), ("parmesan", 0.4)],
      [COOK_PASTA, "Faire dorer les lardons, ajouter la courgette en dés et l'ail, cuire 8 min.", "Verser la crème et laisser réduire 2 min.", "Mélanger avec les pâtes et parsemer de parmesan."])
    P("Pâtes alla Norma", "Pâtes", 40, ["plaques"], ["pâtes", "végétarien"],
      ["pates", ("aubergine", 1.2), "tomate-concassee", ("ail", 1), "basilic", ("ricotta", 0.6), ("huile-olive", 2)],
      ["Couper l'aubergine en cubes et la faire dorer 10 min dans l'huile d'olive. Réserver.", "Dans la même poêle, faire revenir l'ail, ajouter la tomate concassée et cuire 12 min.",
       COOK_PASTA, "Ajouter l'aubergine et le basilic à la sauce, mélanger avec les pâtes et servir avec la ricotta émiettée."], "Italienne")
    P("Pâtes au chou-fleur et à la chapelure", "Pâtes", 30, ["plaques"], ["pâtes", "végétarien", "économique", "hiver"],
      ["pates", ("chou-fleur", 0.8), ("ail", 1.5), ("chapelure", 0.6), ("raisins-secs", 0.4), ("pignons", 1), ("huile-olive", 1.5), ("parmesan", 0.4)],
      ["Faire dorer la chapelure 2 min dans un peu d'huile d'olive, réserver.", COOK_PASTA + " Ajouter le chou-fleur en petites fleurettes pendant les 6 dernières minutes.",
       "Faire revenir l'ail dans le reste d'huile, ajouter les raisins secs et les pignons.", "Mélanger avec les pâtes et le chou-fleur, parsemer de chapelure dorée et de parmesan."], "Italienne")
    P("Pâtes aux sardines à la sicilienne", "Pâtes", 25, ["plaques"], ["pâtes", "poisson", "économique"],
      ["pates", ("sardines", 1), ("fenouil", 0.6), "oignon", ("raisins-secs", 0.4), ("pignons", 1), ("chapelure", 0.4), ("huile-olive", 1)],
      ["Émincer finement le fenouil et l'oignon, les faire fondre 10 min dans l'huile d'olive.", "Ajouter les raisins secs, les pignons et les sardines émiettées, chauffer 3 min.",
       COOK_PASTA, "Mélanger avec la sauce et un peu d'eau de cuisson, parsemer de chapelure grillée."], "Italienne")
    P("Pâtes à l'amatriciana", "Pâtes", 25, ["plaques"], ["pâtes", "économique"],
      ["pates", "lardons", "tomate-concassee", "oignon", "paprika", ("parmesan", 0.6)],
      ["Faire dorer les lardons, ajouter l'oignon émincé et cuire 4 min.", "Ajouter le paprika (ou un peu de piment) et la tomate concassée, laisser mijoter 12 min.",
       COOK_PASTA, "Mélanger avec la sauce et servir avec le parmesan."], "Italienne")
    P("Pasta e fagioli", "Soupes", 40, ["plaques"], ["économique", "hiver", "végétarien"],
      [("pates", 0.5), ("haricots-blancs", 1.2), "tomate-concassee", "oignon", "carotte", ("celeri", 0.5), ("bouillon", 1.5), ("huile-olive", 1), ("parmesan", 0.5)],
      ["Faire revenir l'oignon, la carotte et le céleri hachés dans l'huile d'olive 6 min.", "Ajouter la tomate concassée, les haricots blancs égouttés et le bouillon, cuire 15 min.",
       "Écraser une partie des haricots pour épaissir, ajouter les petites pâtes et cuire 10 min.", "Servir avec le parmesan et un filet d'huile."], "Italienne")
    # ---------- riz ----------
    P("Riz frit à l'ananas et aux crevettes", "Riz", 25, ["plaques"], ["asiatique"],
      ["riz", ("crevettes", 0.8), ("ananas", 0.3), ("oeufs", 0.5), ("petits-pois", 0.5), "oignon-nouveau", ("sauce-soja", 1.5), ("huile-olive", 1)],
      ["Cuire le riz la veille ou le laisser bien refroidir.", "Faire sauter les crevettes 2 min dans l'huile d'olive, les réserver. Brouiller les œufs dans la poêle.",
       "Ajouter le riz, les petits pois et l'ananas en dés, faire sauter 5 min à feu vif.", "Remettre les crevettes, ajouter la sauce soja et l'oignon nouveau."], "Thaïlandaise")
    P("Arroz con pollo", "Riz", 50, ["plaques"], ["familial"],
      ["riz", ("poulet", 1.2), "poivron", "oignon", ("ail", 1), "tomate-concassee", ("petits-pois", 0.5), "paprika", "curcuma", ("bouillon", 1.5), ("huile-olive", 1)],
      ["Faire dorer les morceaux de poulet dans l'huile d'olive, réserver.", "Faire revenir l'oignon, le poivron et l'ail 5 min, ajouter le paprika et le curcuma.",
       "Ajouter le riz, la tomate concassée, le bouillon et le poulet. Cuire 20 min à couvert.", "Ajouter les petits pois 5 min avant la fin et laisser reposer hors du feu."], "Latino-américaine")
    P("Riz pilaf aux amandes et raisins secs", "Riz", 30, ["plaques"], ["végétarien", "économique"],
      ["riz", "oignon", ("beurre", 1), ("bouillon", 1), ("amandes", 0.8), ("raisins-secs", 0.6), "cannelle", "persil"],
      ["Faire fondre l'oignon émincé dans le beurre 4 min.", "Ajouter le riz et le nacrer 2 min, puis la cannelle.",
       "Verser le bouillon chaud, couvrir et cuire 15 min à feu doux sans remuer.", "Ajouter les raisins secs et les amandes grillées, laisser reposer 5 min et parsemer de persil."], "Orientale")
    P("Jambalaya", "Riz", 45, ["plaques"], ["épicé", "familial"],
      ["riz", ("poulet", 0.8), ("chorizo", 0.8), ("crevettes", 0.6), "poivron", "oignon", ("celeri", 0.5), "tomate-concassee", "paprika", ("bouillon", 1.5), ("huile-olive", 0.5)],
      ["Faire dorer le poulet en dés et le chorizo dans l'huile d'olive.", "Ajouter l'oignon, le poivron et le céleri, cuire 5 min, puis le paprika.",
       "Ajouter le riz, la tomate concassée et le bouillon, couvrir et cuire 18 min.", "Ajouter les crevettes et cuire encore 4 min à couvert."], "Américaine")
    P("Mujaddara, riz et lentilles aux oignons frits", "Riz", 50, ["plaques"], ["végétarien", "économique"],
      [("riz", 0.6), ("lentilles", 0.8), ("oignon", 3), "cumin", ("huile-olive", 2), ("yaourt", 0.5)],
      ["Cuire les lentilles 15 min à l'eau : elles doivent rester un peu fermes.", "Faire frire les oignons émincés dans l'huile d'olive 20 min jusqu'à ce qu'ils soient bien bruns.",
       "Ajouter le riz et le cumin aux lentilles avec 30 cl d'eau, couvrir et cuire 15 min.", "Servir couvert d'oignons frits, avec le yaourt."], "Libanaise")
    P("Kedgeree", "Riz", 35, ["plaques"], ["poisson", "brunch"],
      ["riz", ("poisson-blanc", 1), ("oeufs", 0.5), "oignon", ("curry", 0.7), ("beurre", 1), "persil", "citron"],
      ["Pocher le poisson 8 min dans de l'eau frémissante, l'effeuiller.", "Cuire les œufs 9 min et les couper en quartiers. Cuire le riz.",
       "Faire fondre l'oignon dans le beurre, ajouter le curry puis le riz et le poisson.", "Servir avec les œufs, le persil et un trait de jus de citron."], "Anglaise")
    P("Paella végétarienne", "Riz", 45, ["plaques"], ["végétarien"],
      ["riz", "poivron", ("haricots-verts", 0.6), ("artichaut", 0.6), "tomate", "oignon", ("ail", 1), "paprika", "curcuma", ("bouillon", 1.8), ("huile-olive", 1), "citron"],
      ["Faire revenir l'oignon, le poivron et l'ail dans l'huile d'olive 5 min.", "Ajouter la tomate râpée, le paprika et le curcuma, cuire 3 min.",
       "Ajouter le riz, les haricots verts, l'artichaut et le bouillon chaud. Cuire 20 min sans remuer.", "Laisser reposer 5 min sous un linge et servir avec des quartiers de citron."], "Espagnole")
    P("Riz aux haricots rouges à la créole", "Riz", 35, ["plaques"], ["végétarien", "économique"],
      ["riz", ("haricots-rouges", 1), "oignon", ("ail", 1), "lait-coco", "herbes-provence", "paprika"],
      ["Faire revenir l'oignon et l'ail émincés.", "Ajouter le riz, les haricots rouges égouttés, le lait de coco, les herbes de Provence, le paprika et 20 cl d'eau.",
       "Cuire 18 min à couvert à feu doux.", "Laisser reposer 5 min et égrener à la fourchette."], "Antillaise")
    P("Oyakodon, bol de riz au poulet et aux œufs", "Riz", 25, ["plaques"], ["asiatique", "réconfort"],
      ["riz", ("poulet", 1), ("oeufs", 0.75), "oignon", ("sauce-soja", 2), ("sucre", 0.15), ("bouillon", 0.5), "oignon-nouveau"],
      ["Cuire le riz.", "Faire mijoter l'oignon émincé dans le bouillon avec la sauce soja et le sucre 3 min.",
       "Ajouter le poulet en petits morceaux et cuire 6 min.", "Verser les œufs légèrement battus, couvrir 1 min : ils doivent rester coulants. Servir sur le riz avec l'oignon nouveau."], "Japonaise")
    P("Nasi goreng", "Riz", 25, ["plaques"], ["asiatique", "épicé"],
      ["riz", ("crevettes", 0.6), ("poulet", 0.5), ("oeufs", 0.5), "oignon", ("ail", 1), ("sauce-soja", 2), ("miel", 0.5), "paprika", "concombre", ("huile-olive", 1)],
      ["Utiliser du riz cuit et refroidi.", "Faire revenir l'oignon et l'ail, ajouter le poulet en dés 5 min puis les crevettes 2 min.",
       "Ajouter le riz, la sauce soja, le miel et le paprika, faire sauter 4 min.", "Servir avec un œuf au plat cuit dans l'huile d'olive et des rondelles de concombre."], "Indonésienne")
    P("Congee au poulet et gingembre", "Riz", 60, ["plaques"], ["asiatique", "réconfort"],
      [("riz", 0.6), ("poulet", 0.8), ("bouillon", 3), "gingembre", "oignon-nouveau", ("sauce-soja", 1), ("sesame", 0.5)],
      ["Rincer le riz et le mettre dans le bouillon avec le gingembre en tranches.", "Laisser cuire 45 min à petit feu en remuant de temps en temps : le riz doit devenir une bouillie crémeuse.",
       "Ajouter le poulet en fines lamelles les 10 dernières minutes.", "Servir avec la sauce soja, l'oignon nouveau et le sésame."], "Chinoise")
    # ---------- poêlées ----------
    P("Fajitas végétariennes", "Sandwichs", 25, ["plaques"], ["végétarien", "familial"],
      ["wrap", ("poivron", 2), "oignon-rouge", ("haricots-rouges", 0.6), "cumin", "paprika", "avocat", ("creme", 0.5), "citron-vert", ("huile-olive", 1)],
      ["Émincer les poivrons et l'oignon rouge en lanières.", "Les faire sauter 8 min à feu vif dans l'huile d'olive avec le cumin et le paprika.",
       "Ajouter les haricots rouges égouttés et chauffer 2 min.", "Garnir les wraps chauds avec les légumes, l'avocat en tranches arrosé de jus de citron vert et la crème."], "Mexicaine")
    P("Saucisses aux poivrons et oignons", "Poêlées", 30, ["plaques"], ["familial", "économique"],
      ["saucisses", ("poivron", 2), ("oignon", 2), "tomate-concassee", "paprika", ("huile-olive", 0.5), "pain"],
      ["Faire dorer les saucisses dans l'huile d'olive, les réserver.", "Faire revenir les poivrons et les oignons émincés 10 min.",
       "Ajouter le paprika, la tomate concassée et les saucisses, laisser mijoter 10 min.", "Servir avec du pain."], "Italienne")
    P("Poulet aux cacahuètes", "Poêlées", 25, ["plaques"], ["asiatique", "épicé"],
      ["poulet", ("cacahuetes", 1.5), "poivron", "oignon-nouveau", ("ail", 1), "gingembre", ("sauce-soja", 2), ("miel", 0.5), ("vinaigre", 0.5), ("maizena", 0.2), "riz", ("huile-olive", 1)],
      ["Couper le poulet en dés et l'enrober de maïzena.", "Le faire sauter 6 min dans l'huile d'olive, ajouter le poivron, l'ail et le gingembre 3 min.",
       "Ajouter la sauce soja, le miel et le vinaigre, puis les cacahuètes.", "Servir avec le riz et l'oignon nouveau."], "Chinoise")
    P("Tofu sauté au sésame et brocoli", "Poêlées", 25, ["plaques"], ["végétarien", "asiatique"],
      ["tofu", "brocoli", ("sesame", 1.5), ("sauce-soja", 2), ("miel", 0.5), ("ail", 1), "riz", ("huile-olive", 1)],
      ["Couper le tofu en cubes et le faire dorer dans l'huile d'olive 8 min.", "Ajouter le brocoli en fleurettes et l'ail, faire sauter 5 min avec un peu d'eau.",
       "Ajouter la sauce soja, le miel et le sésame, mélanger.", "Servir avec le riz."], "Asiatique")
    P("Galettes de courgettes à la feta", "Poêlées", 30, ["plaques"], ["végétarien", "été"],
      [("courgette", 1.5), ("feta", 0.8), ("oeufs", 0.5), ("farine", 0.5), "menthe", "yaourt", ("huile-olive", 1.5)],
      ["Râper les courgettes, les saler et les presser pour retirer l'eau.", "Mélanger avec la feta émiettée, les œufs, la farine et la menthe.",
       "Cuire des petites galettes 3 min par face dans l'huile d'olive.", "Servir avec le yaourt."], "Grecque")
    P("Galettes de lentilles corail", "Poêlées", 40, ["plaques"], ["végétarien", "économique"],
      [("lentilles-corail", 0.8), "oignon", "carotte", "cumin", ("farine", 0.3), ("chapelure", 0.4), "coriandre", ("huile-olive", 1.5), "yaourt"],
      ["Cuire les lentilles corail 12 min à l'eau, bien les égoutter.", "Mélanger avec l'oignon haché, la carotte râpée, le cumin, la farine et la coriandre.",
       "Former des galettes et les passer dans la chapelure.", "Les faire dorer 4 min par face dans l'huile d'olive. Servir avec le yaourt."], "Indienne")
    P("Côtes de porc et purée de patate douce", "Poêlées", 35, ["plaques"], ["familial"],
      [("porc", 1), ("patate-douce", 1), ("beurre", 1), ("lait", 0.3), "herbes-provence", ("huile-olive", 0.5)],
      ["Cuire la patate douce en cubes 15 min à l'eau salée, l'écraser avec le beurre et le lait.", "Saler les côtes de porc et les parsemer d'herbes de Provence.",
       "Les cuire 5 à 6 min par face dans l'huile d'olive.", "Laisser reposer 2 min et servir avec la purée."])
    P("Escalope milanaise et spaghetti", "Poêlées", 35, ["plaques"], ["familial", "classique"],
      [("veau", 0.8), ("chapelure", 1), ("oeufs", 0.25), ("farine", 0.3), "pates", "tomate-concassee", ("parmesan", 0.5), "citron", ("huile-olive", 1.5)],
      ["Aplatir les escalopes, les passer dans la farine, l'œuf battu puis la chapelure mélangée au parmesan.", "Chauffer la tomate concassée 10 min avec un peu de sel.",
       COOK_PASTA, "Faire dorer les escalopes 3 min par face dans l'huile d'olive. Servir avec les spaghetti à la tomate et un quartier de citron."], "Italienne", diff="Intermédiaire")
    P("Patatas bravas", "Poêlées", 40, ["four", "plaques"], ["végétarien", "apéritif", "épicé"],
      [("pomme-de-terre", 1), ("huile-olive", 1.5), "tomate-concassee", ("ail", 1), "paprika", ("mayonnaise", 1)],
      ["Préchauffer le four à 220 °C. Couper les pommes de terre en cubes, les mélanger avec l'huile d'olive et le sel, rôtir 30 min.",
       "Cuire la tomate concassée avec l'ail et le paprika 10 min, puis la mixer.", "Mélanger la mayonnaise avec un peu d'ail.", "Servir les pommes de terre nappées de sauce tomate et de mayonnaise."], "Espagnole", meal=("Déjeuner", "Dîner", "Apéritif"))
    P("Brochettes de poulet au citron", "Poêlées", 30, ["plaques"], ["été", "barbecue"],
      [("poulet", 1.2), "citron", ("ail", 1), "herbes-provence", ("huile-olive", 1), "poivron", "oignon-rouge", "yaourt"],
      ["Couper le poulet en cubes et le mariner 15 min avec le jus du citron, l'ail, les herbes de Provence et l'huile d'olive.", "Enfiler sur des piques en alternant avec le poivron et l'oignon rouge.",
       "Cuire 10 à 12 min sur le gril ou à la poêle en les retournant.", "Servir avec le yaourt."], "Méditerranéenne")
    P("Choux de Bruxelles poêlés aux lardons", "Poêlées", 30, ["plaques"], ["hiver"],
      [("choux-bruxelles", 1.5), "lardons", "oignon", ("beurre", 0.5), ("pomme-de-terre", 0.6)],
      ["Cuire les choux de Bruxelles coupés en deux et les pommes de terre en cubes 8 min à l'eau bouillante salée.", "Faire dorer les lardons et l'oignon.",
       "Ajouter les légumes égouttés et le beurre, faire dorer 10 min à la poêle.", "Poivrer et servir."])
    P("Burritos au bœuf et au riz", "Sandwichs", 35, ["plaques"], ["familial"],
      ["wrap", ("boeuf-hache", 1), ("riz", 0.5), ("haricots-rouges", 0.6), "oignon", "cumin", "paprika", "tomate-concassee", ("cheddar", 0.6), ("creme", 0.5)],
      ["Cuire le riz.", "Faire revenir l'oignon et le bœuf haché, ajouter le cumin, le paprika, la moitié de la tomate concassée et les haricots rouges, mijoter 8 min.",
       "Garnir les wraps de riz, de viande et de cheddar râpé, ajouter la crème.", "Rouler serré en repliant les bords et dorer 1 min de chaque côté à la poêle."], "Mexicaine")
    P("Quesadillas au poulet et au poivron", "Sandwichs", 20, ["plaques"], ["rapide", "familial"],
      ["wrap", ("poulet", 0.8), "poivron", ("cheddar", 1), "cumin", "coriandre", ("creme", 0.5)],
      ["Faire sauter le poulet en lamelles et le poivron émincé 8 min avec le cumin.", "Garnir la moitié de chaque wrap de poulet, de poivron, de cheddar et de coriandre.",
       "Replier et cuire 2 min par face dans une poêle sèche jusqu'à ce que le fromage fonde.", "Couper en triangles et servir avec la crème."], "Mexicaine")
    P("Okonomiyaki, galette japonaise au chou", "Poêlées", 30, ["plaques"], ["asiatique"],
      [("chou", 1), ("farine", 0.8), ("oeufs", 0.5), "lardons", "oignon-nouveau", ("bouillon", 0.3), ("mayonnaise", 1), ("sauce-soja", 1), ("ketchup", 1)],
      ["Émincer très finement le chou.", "Mélanger la farine, les œufs et le bouillon, puis ajouter le chou et l'oignon nouveau.",
       "Verser dans une poêle huilée en galette épaisse, poser les lardons dessus et cuire 6 min par face à feu moyen.", "Napper d'un mélange ketchup-sauce soja et de mayonnaise."], "Japonaise")
    P("Côtelettes d'agneau et haricots blancs à l'ail", "Poêlées", 25, ["plaques"], ["classique"],
      [("agneau", 1), ("haricots-blancs", 1.2), ("ail", 1.5), "tomate", "persil", "herbes-provence", ("huile-olive", 1)],
      ["Frotter les côtelettes d'agneau avec les herbes de Provence et un peu d'huile d'olive.", "Faire revenir l'ail dans le reste d'huile, ajouter la tomate en dés et les haricots blancs, chauffer 8 min.",
       "Saisir les côtelettes 2 à 3 min par face.", "Servir avec les haricots parsemés de persil."])
    # ---------- currys ----------
    P("Curry vert de légumes", "Curry", 30, ["plaques"], ["végétarien", "épicé", "asiatique"],
      ["lait-coco", "courgette", ("haricots-verts", 0.6), "poivron", ("curry", 1), "basilic", "coriandre", "citron-vert", ("sauce-soja", 1), "riz"],
      ["Faire chauffer un peu de lait de coco avec le curry (ou de la pâte de curry vert) 2 min.", "Ajouter le reste du lait de coco, puis la courgette, les haricots verts et le poivron en morceaux. Cuire 10 min.",
       "Assaisonner avec la sauce soja et le jus du citron vert.", "Parsemer de basilic et de coriandre, servir avec le riz."], "Thaïlandaise")
    P("Korma de poulet", "Curry", 40, ["plaques"], ["indien", "doux"],
      [("poulet", 1.2), "oignon", ("ail", 1), "gingembre", "garam-masala", "curcuma", ("amandes", 1), ("yaourt", 0.5), ("creme", 0.8), "riz", ("huile-olive", 1)],
      ["Faire revenir l'oignon, l'ail et le gingembre dans l'huile d'olive 6 min, ajouter le garam masala et le curcuma.", "Ajouter le poulet en morceaux et le faire dorer 5 min.",
       "Mixer les amandes avec le yaourt et la crème, verser sur le poulet et mijoter 15 min à feu doux.", "Servir avec le riz."], "Indienne")
    P("Massaman de bœuf", "Curry", 120, ["plaques"], ["asiatique", "week-end"],
      [("boeuf", 1.2), "lait-coco", ("pomme-de-terre", 0.6), "oignon", ("curry", 1), "cannelle", ("cacahuetes", 1), ("sauce-soja", 1), ("sucre", 0.15), "riz"],
      ["Couper le bœuf en cubes et le faire dorer.", "Ajouter l'oignon, le curry et la cannelle, puis le lait de coco et 20 cl d'eau. Laisser mijoter 1 h à couvert.",
       "Ajouter les pommes de terre en morceaux, la sauce soja et le sucre, cuire 30 min.", "Parsemer de cacahuètes concassées et servir avec le riz."], "Thaïlandaise", diff="Intermédiaire")
    P("Dal de lentilles vertes aux épinards", "Curry", 45, ["plaques"], ["végétarien", "économique", "indien"],
      [("lentilles", 1), ("epinards", 1), "oignon", ("ail", 1), "gingembre", "curcuma", "cumin", "tomate-concassee", ("huile-olive", 1), "riz"],
      ["Faire revenir l'oignon, l'ail et le gingembre dans l'huile d'olive avec le cumin et le curcuma.", "Ajouter les lentilles, la tomate concassée et 60 cl d'eau, cuire 30 min.",
       "Ajouter les épinards 3 min.", "Saler et servir avec le riz."], "Indienne")
    P("Curry d'agneau à l'indienne", "Curry", 90, ["plaques"], ["épicé", "indien"],
      [("agneau", 1.2), "oignon", ("ail", 1.5), "gingembre", "tomate-concassee", ("yaourt", 0.5), "garam-masala", "paprika", "cumin", "coriandre", "riz", ("huile-olive", 1)],
      ["Faire dorer l'agneau en cubes dans l'huile d'olive, réserver.", "Faire revenir l'oignon, l'ail et le gingembre, ajouter le garam masala, le paprika et le cumin.",
       "Remettre l'agneau, ajouter la tomate concassée et le yaourt, couvrir et mijoter 1 h.", "Parsemer de coriandre et servir avec le riz."], "Indienne", diff="Intermédiaire")
    P("Aloo gobi, chou-fleur et pommes de terre épicés", "Curry", 35, ["plaques"], ["végétarien", "indien"],
      [("chou-fleur", 1), ("pomme-de-terre", 0.6), "oignon", "tomate", "gingembre", "curcuma", "cumin", "garam-masala", "coriandre", ("huile-olive", 1)],
      ["Faire revenir l'oignon et le gingembre dans l'huile d'olive avec le cumin et le curcuma.", "Ajouter les pommes de terre en cubes et le chou-fleur en fleurettes, mélanger.",
       "Ajouter la tomate en dés et un fond d'eau, couvrir et cuire 20 min.", "Ajouter le garam masala et la coriandre."], "Indienne")
    P("Chana masala", "Curry", 35, ["plaques"], ["végétarien", "économique", "indien"],
      [("pois-chiches", 1.5), "oignon", ("ail", 1), "gingembre", "tomate-concassee", "garam-masala", "cumin", "curcuma", "citron", "coriandre", "riz", ("huile-olive", 1)],
      ["Faire revenir l'oignon haché dans l'huile d'olive 8 min, ajouter l'ail et le gingembre.", "Ajouter le garam masala, le cumin et le curcuma, puis la tomate concassée. Cuire 10 min.",
       "Ajouter les pois chiches égouttés et un peu d'eau, mijoter 12 min.", "Finir avec un trait de jus de citron et la coriandre, servir avec le riz."], "Indienne")
    P("Curry japonais au poulet", "Curry", 45, ["plaques"], ["asiatique", "réconfort"],
      [("poulet", 1), "carotte", ("pomme-de-terre", 0.6), "oignon", ("curry", 1), ("farine", 0.2), ("beurre", 1), ("bouillon", 1.2), ("ketchup", 0.5), ("miel", 0.5), "riz"],
      ["Faire fondre le beurre, ajouter la farine et le curry, cuire 2 min en remuant : c'est le roux.", "Dans une cocotte, faire revenir l'oignon et le poulet, ajouter la carotte et les pommes de terre en morceaux.",
       "Verser le bouillon, cuire 20 min, puis incorporer le roux, le ketchup et le miel. Cuire 5 min jusqu'à ce que la sauce épaississe.", "Servir avec le riz."], "Japonaise")
    P("Vindaloo de porc", "Curry", 75, ["plaques"], ["épicé", "indien"],
      [("porc", 1.2), "oignon", ("ail", 2), "gingembre", ("vinaigre", 2), "paprika", "cumin", "cannelle", "tomate-concassee", "riz", ("huile-olive", 1)],
      ["Mariner le porc en cubes avec le vinaigre, l'ail, le gingembre, le paprika, le cumin et la cannelle (30 min si possible).", "Faire revenir l'oignon dans l'huile d'olive 8 min.",
       "Ajouter le porc et sa marinade, puis la tomate concassée. Couvrir et mijoter 45 min.", "Servir avec le riz."], "Indienne", diff="Intermédiaire")
    # ---------- mijotés ----------
    P("Daube provençale", "Plats mijotés", 210, ["plaques"], ["week-end", "hiver"],
      [("boeuf", 2.5), ("vin-rouge", 4), ("carotte", 1), "oignon", ("ail", 2), "lardons", "orange", ("olives", 1), "herbes-provence", ("huile-olive", 1)],
      ["La veille, mariner le bœuf en gros cubes avec le vin rouge, l'oignon, l'ail, les herbes de Provence et un zeste d'orange.", "Égoutter la viande, la faire dorer avec les lardons dans l'huile d'olive.",
       "Ajouter les carottes en rondelles et la marinade, couvrir et laisser mijoter 3 h à feu très doux.", "Ajouter les olives 15 min avant la fin. Servir avec des pâtes ou de la polenta."], "Provençale", serv=4, diff="Intermédiaire")
    P("Bœuf carottes", "Plats mijotés", 150, ["plaques"], ["hiver", "familial", "classique"],
      [("boeuf", 2.5), ("carotte", 2.5), ("oignon", 2), ("vin-blanc", 2), ("bouillon", 1), "herbes-provence", ("huile-olive", 1)],
      ["Faire dorer le bœuf en morceaux dans l'huile d'olive.", "Ajouter les oignons émincés, puis le vin blanc et le bouillon, les herbes de Provence.",
       "Couvrir et laisser mijoter 1 h 30.", "Ajouter les carottes en rondelles et cuire encore 45 min."], serv=4)
    P("Porc aux pruneaux", "Plats mijotés", 75, ["plaques"], ["hiver", "classique"],
      [("porc", 2.5), ("pruneaux", 2), "oignon", ("vin-blanc", 2), ("creme", 1), "moutarde", ("huile-olive", 1)],
      ["Faire dorer le porc en cubes dans l'huile d'olive, ajouter l'oignon émincé.", "Verser le vin blanc et 20 cl d'eau, couvrir et mijoter 45 min.",
       "Ajouter les pruneaux et cuire 15 min.", "Lier avec la crème et la moutarde, rectifier l'assaisonnement."], serv=4)
    P("Poulet au pot", "Plats mijotés", 120, ["plaques"], ["hiver", "familial", "classique"],
      [("poulet", 4), ("carotte", 2), ("poireau", 1.5), ("celeri", 1), "oignon", ("riz", 1.5), ("bouillon", 4), "persil"],
      ["Mettre le poulet entier ou en morceaux dans une grande cocotte, couvrir avec le bouillon et porter à frémissement.", "Ajouter les carottes, les poireaux, le céleri et l'oignon. Laisser cuire 1 h 30 à petits frémissements.",
       "Prélever un peu de bouillon pour cuire le riz.", "Servir le poulet découpé avec les légumes, le riz et le persil."], serv=4)
    P("Irish stew", "Plats mijotés", 120, ["plaques"], ["hiver"],
      [("agneau", 2.5), ("pomme-de-terre", 2), ("carotte", 1), ("oignon", 2), ("bouillon", 2), "persil"],
      ["Couper l'agneau en morceaux, les pommes de terre et les carottes en gros morceaux, les oignons en quartiers.", "Disposer en couches dans une cocotte, saler et poivrer chaque couche.",
       "Verser le bouillon, couvrir et laisser mijoter 1 h 45 à feu très doux.", "Parsemer de persil."], "Irlandaise", serv=4)
    P("Chili blanc à la dinde", "Plats mijotés", 45, ["plaques"], ["épicé", "familial"],
      [("dinde", 2), ("haricots-blancs", 2), "oignon", ("ail", 1), "poivron", "cumin", ("bouillon", 1.5), ("mais", 1), ("creme", 1), "coriandre", "citron-vert"],
      ["Faire revenir l'oignon, l'ail et le poivron, ajouter la dinde en dés et le cumin.", "Ajouter les haricots blancs égouttés, le maïs et le bouillon, mijoter 25 min.",
       "Écraser une partie des haricots pour épaissir et ajouter la crème.", "Servir avec la coriandre et le jus du citron vert."], "Américaine", serv=4)
    P("Rougail saucisses", "Plats mijotés", 50, ["plaques"], ["épicé", "familial"],
      [("saucisses", 2), ("tomate", 2), ("oignon", 2), ("ail", 1.5), "gingembre", "curcuma", ("riz", 2)],
      ["Piquer les saucisses et les faire blanchir 5 min dans l'eau bouillante, puis les couper en rondelles.", "Les faire dorer dans une cocotte, ajouter les oignons émincés, l'ail et le gingembre écrasés et le curcuma.",
       "Ajouter les tomates en dés et laisser mijoter 25 min.", "Servir avec le riz."], "Réunionnaise", serv=4)
    P("Mafé de poulet", "Plats mijotés", 60, ["plaques"], ["familial"],
      [("poulet", 2.5), ("cacahuete", 3), "oignon", "tomate-concassee", ("carotte", 1), ("patate-douce", 0.6), ("ail", 1), ("riz", 2), ("huile-olive", 1)],
      ["Faire dorer le poulet en morceaux avec l'oignon dans l'huile d'olive.", "Ajouter l'ail, la tomate concassée et 50 cl d'eau, cuire 15 min.",
       "Délayer le beurre de cacahuète dans un peu de bouillon et l'ajouter avec les carottes et la patate douce. Laisser mijoter 30 min.", "Servir avec le riz."], "Sénégalaise", serv=4)
    P("Poulet au vinaigre", "Plats mijotés", 50, ["plaques"], ["classique", "lyonnaise"],
      [("poulet", 2.5), ("vinaigre", 4), "tomate-concassee", ("ail", 2), ("vin-blanc", 1), ("creme", 0.8), ("beurre", 1), "persil"],
      ["Faire dorer les morceaux de poulet dans le beurre.", "Déglacer avec le vinaigre, laisser réduire 3 min, puis ajouter l'ail, le vin blanc et la tomate concassée.",
       "Couvrir et cuire 30 min.", "Retirer le poulet, ajouter la crème à la sauce et faire réduire. Napper et parsemer de persil."], "Lyonnaise", serv=4)
    P("Veau Marengo", "Plats mijotés", 100, ["plaques"], ["classique", "week-end"],
      [("veau", 2.5), "tomate-concassee", "champignons", ("oignon", 1.5), ("ail", 1), ("vin-blanc", 2), ("farine", 0.15), "herbes-provence", ("huile-olive", 1)],
      ["Faire dorer le veau en morceaux dans l'huile d'olive, saupoudrer de farine et remuer 1 min.", "Ajouter les oignons, l'ail, le vin blanc, la tomate concassée et les herbes de Provence.",
       "Couvrir et laisser mijoter 1 h 15.", "Ajouter les champignons et cuire encore 15 min."], serv=4)
    P("Couscous aux légumes", "Plats mijotés", 60, ["plaques"], ["végétarien", "familial"],
      [("semoule", 2), ("pois-chiches", 1), ("carotte", 1), ("courgette", 1), "poivron", "oignon", "tomate-concassee", ("epices", 2), ("bouillon", 2), ("beurre", 1), ("raisins-secs", 0.5)],
      ["Faire revenir l'oignon dans une grande cocotte, ajouter les épices à couscous et la tomate concassée.", "Ajouter le bouillon et les carottes, cuire 15 min, puis le poivron, les courgettes et les pois chiches égouttés, cuire 20 min.",
       "Préparer la semoule avec le même volume d'eau bouillante salée, couvrir 5 min puis égrener avec le beurre.", "Servir les légumes et leur bouillon sur la semoule, avec les raisins secs."], "Maghrébine", serv=4)
    P("Poulet paprikash", "Plats mijotés", 50, ["plaques"], ["familial"],
      [("poulet", 2.5), ("oignon", 2), ("paprika", 2), "poivron", "tomate", ("creme", 1.5), ("pates", 1.5), ("huile-olive", 1)],
      ["Faire dorer le poulet dans l'huile d'olive, réserver.", "Faire fondre les oignons émincés 8 min, ajouter le paprika hors du feu.",
       "Ajouter le poivron, la tomate en dés, le poulet et 20 cl d'eau, couvrir et mijoter 30 min.", "Ajouter la crème et servir avec les pâtes."], "Hongroise", serv=4)
    P("Colombo de porc", "Plats mijotés", 75, ["plaques"], ["épicé"],
      [("porc", 2.5), ("curry", 1.5), "oignon", ("ail", 1.5), ("pomme-de-terre", 1), "courgette", "citron-vert", ("riz", 2), ("huile-olive", 1)],
      ["Mariner le porc en cubes avec le jus du citron vert, l'ail et la moitié du curry.", "Faire dorer la viande dans l'huile d'olive avec l'oignon, ajouter le reste du curry.",
       "Couvrir d'eau, ajouter les pommes de terre et la courgette en morceaux, mijoter 50 min.", "Servir avec le riz."], "Antillaise", serv=4)
    P("Épaule d'agneau aux haricots blancs", "Plats mijotés", 120, ["four", "plaques"], ["week-end"],
      [("agneau", 3), ("haricots-blancs", 2), ("tomate", 1), ("ail", 2), "oignon", ("vin-blanc", 1.5), "herbes-provence", ("huile-olive", 1)],
      ["Préchauffer le four à 160 °C. Faire dorer l'agneau en morceaux dans une cocotte avec l'huile d'olive.", "Ajouter l'oignon, l'ail, les herbes de Provence, le vin blanc et les tomates en dés.",
       "Couvrir et cuire 1 h 30 au four.", "Ajouter les haricots blancs égouttés 20 min avant la fin."], serv=4)
    # ---------- poissons ----------
    P("Moules marinières", "Poisson", 25, ["plaques"], ["classique", "rapide"],
      [("moules", 2), "oignon", ("ail", 1), ("vin-blanc", 1.5), ("beurre", 1), "persil", "pain"],
      ["Gratter et rincer les moules, jeter celles qui sont ouvertes.", "Faire fondre l'oignon et l'ail hachés dans le beurre 3 min dans une grande cocotte.",
       "Ajouter les moules et le vin blanc, couvrir et cuire 5 à 7 min à feu vif en secouant la cocotte.", "Parsemer de persil et servir avec le pain pour saucer."])
    P("Moules-frites à la crème", "Poisson", 35, ["plaques", "four"], ["familial"],
      [("moules", 2), ("frites", 1), "oignon", ("vin-blanc", 1), ("creme", 1), "persil", ("beurre", 0.5)],
      ["Cuire les frites au four selon le paquet.", "Faire fondre l'oignon dans le beurre, ajouter les moules nettoyées et le vin blanc. Couvrir et cuire 6 min.",
       "Retirer les moules, ajouter la crème au jus et laisser réduire 3 min.", "Remettre les moules, parsemer de persil et servir avec les frites."], "Belge")
    P("Saumon sauce yaourt à l'aneth", "Poisson", 25, ["plaques"], ["poisson", "léger"],
      ["saumon", ("pomme-de-terre", 0.8), ("yaourt", 1), "aneth", "citron", ("huile-olive", 0.5)],
      ["Cuire les pommes de terre 20 min à la vapeur.", "Mélanger le yaourt avec l'aneth, le zeste et un trait de jus de citron.",
       "Cuire le saumon 4 min par face dans l'huile d'olive.", "Servir avec les pommes de terre et la sauce au yaourt."], "Scandinave")
    P("Cabillaud au chorizo et pois chiches", "Poisson", 25, ["plaques"], ["poisson"],
      ["cabillaud", ("chorizo", 0.6), ("pois-chiches", 1), "tomate-cerise", ("ail", 1), "persil", ("huile-olive", 0.5)],
      ["Faire revenir le chorizo en rondelles dans l'huile d'olive, ajouter l'ail, les pois chiches égouttés et les tomates cerises, cuire 6 min.", "Saler le cabillaud.",
       "Le poser sur la garniture, couvrir et cuire 8 min à feu doux.", "Parsemer de persil."], "Espagnole")
    P("Poisson en croûte de parmesan", "Poisson", 25, ["four"], ["poisson", "familial"],
      ["poisson-blanc", ("parmesan", 1), ("chapelure", 0.6), ("beurre", 1), "persil", "citron", ("haricots-verts", 1)],
      ["Préchauffer le four à 200 °C. Mélanger le parmesan râpé, la chapelure, le persil haché et le beurre fondu.", "Poser le poisson sur une plaque et le couvrir de ce mélange.",
       "Cuire 12 à 15 min. Pendant ce temps, cuire les haricots verts 8 min à l'eau.", "Servir avec les haricots et un quartier de citron."])
    P("Papillotes de colin au lait de coco", "Poisson", 30, ["four"], ["poisson", "léger"],
      ["colin", ("lait-coco", 0.5), "carotte", "courgette", "gingembre", "citron-vert", "coriandre", "riz"],
      ["Préchauffer le four à 200 °C. Couper la carotte et la courgette en julienne.", "Déposer les légumes et le colin sur du papier cuisson, ajouter le gingembre râpé, le lait de coco et le zeste du citron vert.",
       "Fermer les papillotes et cuire 18 min. Cuire le riz.", "Ouvrir, arroser de jus de citron vert et parsemer de coriandre."], "Asiatique")
    P("Merlu sauce vierge", "Poisson", 25, ["plaques"], ["poisson", "été"],
      ["merlu", "tomate", "basilic", "citron", ("huile-olive", 2), ("olives", 0.5), "riz"],
      ["Cuire le riz.", "Préparer la sauce vierge : tomate en petits dés, basilic ciselé, olives hachées, jus du citron et la moitié de l'huile d'olive. Saler.",
       "Cuire le merlu 3 à 4 min par face dans le reste d'huile.", "Napper de sauce vierge et servir avec le riz."], "Provençale")
    P("Dorade grillée, beurre citronné et riz", "Poisson", 30, ["plaques"], ["poisson"],
      ["dorade", ("beurre", 1.5), "citron", "persil", "riz", ("huile-olive", 0.5)],
      ["Cuire le riz.", "Saler les filets de dorade et les cuire côté peau 4 min dans l'huile d'olive, puis 1 min de l'autre côté.",
       "Faire fondre le beurre jusqu'à ce qu'il soit noisette, ajouter le jus du citron et le persil.", "Napper le poisson de beurre citronné et servir avec le riz."])
    P("Tacos de poisson", "Sandwichs", 30, ["plaques"], ["poisson", "été"],
      ["wrap", "poisson-blanc", ("chou", 0.5), "citron-vert", ("mayonnaise", 1), "paprika", "coriandre", "avocat", ("farine", 0.2), ("huile-olive", 1)],
      ["Couper le poisson en morceaux, les fariner avec le paprika et les faire dorer dans l'huile d'olive.", "Émincer finement le chou et le mélanger au jus du citron vert.",
       "Mélanger la mayonnaise avec un peu de jus de citron vert.", "Garnir les wraps de chou, de poisson, d'avocat, de sauce et de coriandre."], "Mexicaine")
    P("Saumon en croûte de sésame et nouilles", "Poisson", 25, ["plaques"], ["poisson", "asiatique"],
      ["saumon", ("sesame", 2), "nouilles", ("sauce-soja", 2), ("miel", 0.5), "gingembre", "oignon-nouveau", ("huile-olive", 1)],
      ["Rouler le dessus des pavés de saumon dans le sésame.", "Les cuire 4 min côté sésame puis 3 min de l'autre côté dans l'huile d'olive.",
       "Cuire les nouilles, les mélanger avec la sauce soja, le miel et le gingembre râpé.", "Servir le saumon sur les nouilles avec l'oignon nouveau."], "Asiatique")
    P("Ceviche de poisson au citron vert", "Poisson", 20, [], ["poisson", "été", "sans cuisson", "froid"],
      [("dorade", 1), ("citron-vert", 3), "oignon-rouge", "coriandre", "avocat", "mais", "tomate"],
      ["Couper les filets de dorade, très frais, en petits cubes.", "Le couvrir du jus des citrons verts avec l'oignon rouge émincé, saler et laisser mariner 10 min au frais : la chair devient blanche.",
       "Ajouter la tomate en dés, l'avocat, le maïs et la coriandre.", "Servir aussitôt, bien frais."], "Péruvienne", meal=("Déjeuner", "Dîner", "Apéritif"))
    P("Merlu à la basquaise, sauce verte", "Poisson", 30, ["plaques"], ["poisson"],
      ["merlu", ("petits-pois", 0.6), ("asperges", 0.6), ("ail", 1.5), ("persil", 2), ("vin-blanc", 1), ("farine", 0.1), ("huile-olive", 1.5)],
      ["Faire revenir l'ail émincé dans l'huile d'olive, ajouter la farine et remuer.", "Verser le vin blanc et 10 cl d'eau, mélanger jusqu'à ce que la sauce épaississe, ajouter beaucoup de persil haché.",
       "Poser le merlu dans la sauce avec les petits pois et les asperges en tronçons.", "Couvrir et cuire 8 min en secouant la poêle pour lier la sauce."], "Basque")
    P("Papillote de truite aux poireaux", "Poisson", 30, ["four"], ["poisson", "léger"],
      ["truite", ("poireau", 1), ("creme", 0.5), "citron", "aneth", ("pomme-de-terre", 0.8)],
      ["Préchauffer le four à 200 °C. Cuire les pommes de terre à la vapeur.", "Émincer finement le poireau et le faire fondre 5 min à la poêle.",
       "Déposer le poireau, la truite, la crème, l'aneth et une rondelle de citron sur du papier cuisson, fermer.", "Cuire 15 min et servir avec les pommes de terre."])
    return R
