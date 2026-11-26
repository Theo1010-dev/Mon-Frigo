# -*- coding: utf-8 -*-
"""Recettes écrites à la main (21) : idées du quotidien qui manquaient, quelques desserts, et encore un peu pour chaque appareil."""
from gen_hand1 import H

D = ("Dessert", "Goûter")
APERO = ("Apéritif", "Entrée")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- plats du quotidien ----------
    P("Buddha bowl au poulet, riz, avocat et carottes", "Riz", 30, ["plaques"], ["équilibré", "rapide", "bowl"],
      [("riz", 0.8), ("poulet", 1), ("avocat", 1), ("carotte", 0.6), ("concombre", 0.5), ("sauce-soja", 1), ("sesame", 1)],
      ["Cuire le riz 11 min dans l'eau bouillante salée, puis l'égoutter.",
       "Couper le poulet en lamelles et le faire dorer 6 à 8 min à la poêle avec la moitié de la sauce soja.",
       "Râper les carottes, couper le concombre en rondelles et l'avocat en tranches.",
       "Répartir le riz dans des bols, ajouter le poulet et les légumes, arroser du reste de sauce soja et parsemer de sésame."], "Asiatique", meal=("Déjeuner", "Dîner"))
    P("Nouilles sautées au bœuf et brocoli", "Pâtes", 25, ["plaques"], ["rapide", "épicé"],
      [("nouilles", 1), ("boeuf", 0.8), ("brocoli", 0.8), ("sauce-soja", 1.5), ("gingembre", 1), ("ail", 0.5), ("sesame", 1), ("huile-olive", 0.5)],
      ["Cuire les nouilles selon le paquet, puis les égoutter. Couper le brocoli en petits bouquets et le cuire 4 min dans l'eau bouillante.",
       "Couper le bœuf en fines lanières et le saisir 2 min à feu vif dans l'huile, avec l'ail et le gingembre râpés.",
       "Ajouter le brocoli, les nouilles et la sauce soja, et faire sauter 2 min en remuant. Parsemer de sésame."], "Asiatique")
    P("Poulet au citron et aux olives au four", "Gratins & four", 50, ["four"], ["familial", "été"],
      [("poulet", 1.2), ("pomme-de-terre", 1), ("citron", 1), ("olives", 1), ("ail", 1), ("herbes-provence", 1), ("huile-olive", 1.5)],
      ["Préchauffer le four à 200 °C. Couper les pommes de terre en quartiers et le citron en rondelles.",
       "Mettre le poulet en morceaux, les pommes de terre, le citron, les olives et l'ail en chemise dans un plat. Arroser d'huile d'olive, ajouter les herbes de Provence, saler et poivrer.",
       "Cuire 40 min en arrosant à mi-cuisson : le poulet doit être bien doré et les pommes de terre tendres."], "Méditerranéenne")
    P("Pâtes à la ricotta, épinards et citron", "Pâtes", 20, ["plaques"], ["rapide", "végétarien", "économique"],
      [("pates", 1), ("ricotta", 1), ("epinards", 0.8), ("citron", 0.5), ("parmesan", 0.5), ("ail", 0.5)],
      ["Cuire les pâtes dans l'eau bouillante salée en gardant une tasse d'eau de cuisson.",
       "Faire tomber les épinards 2 min à la poêle avec l'ail haché.",
       "Mélanger la ricotta avec le zeste et le jus du citron, le parmesan et un peu d'eau de cuisson.",
       "Ajouter les pâtes et les épinards, mélanger, poivrer et servir aussitôt."], "Italienne")
    P("Saumon en croûte d'herbes, haricots verts", "Poisson", 30, ["four", "plaques"], ["poisson", "équilibré"],
      [("saumon", 1), ("chapelure", 0.5), ("persil", 1), ("moutarde", 1), ("haricots-verts", 1), ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Mélanger la chapelure avec le persil haché et un peu de beurre fondu.",
       "Badigeonner le saumon de moutarde, le couvrir du mélange à la chapelure et cuire 12 à 15 min au four.",
       "Pendant ce temps, cuire les haricots verts 8 min dans l'eau bouillante salée et les égoutter avec le reste du beurre."], "Française")
    P("Galettes de sarrasin complètes", "Œufs", 30, ["plaques"], ["familial", "économique"],
      [("farine-sarrasin", 1), ("oeufs", 1), ("jambon", 1), ("emmental", 1), ("beurre", 1)],
      ["Mélanger la farine de sarrasin avec 30 cl d'eau froide et une pincée de sel jusqu'à obtenir une pâte lisse. Laisser reposer 15 min si possible.",
       "Faire chauffer une grande poêle beurrée et y étaler une louche de pâte. Cuire 2 min.",
       "Retourner la galette, casser un œuf au centre, ajouter le jambon et l'emmental râpé autour.",
       "Replier les bords en carré et laisser cuire 3 min jusqu'à ce que le blanc soit pris."], "Bretonne", meal=("Déjeuner", "Dîner"))
    P("Pizza blanche au chèvre et au miel", "Tartes & pizzas", 25, ["four"], ["végétarien", "rapide"],
      [("pate-pizza", 1), ("creme", 1), ("chevre", 1.5), ("miel", 1), ("noix", 0.5), ("oignon-rouge", 0.5)],
      ["Préchauffer le four à 240 °C. Dérouler la pâte à pizza sur une plaque et la couvrir de crème.",
       "Ajouter le chèvre en rondelles et l'oignon rouge émincé finement.",
       "Cuire 12 à 15 min. À la sortie, arroser de miel et parsemer de noix concassées."], "Italienne")
    P("Tarte fine à la tomate et au chèvre", "Tartes & pizzas", 35, ["four"], ["végétarien", "été"],
      [("pate-feuilletee", 1), ("tomate", 1.5), ("chevre", 1), ("moutarde", 1), ("herbes-provence", 1), ("huile-olive", 0.5)],
      ["Préchauffer le four à 200 °C. Dérouler la pâte feuilletée sur une plaque et la piquer à la fourchette.",
       "Étaler la moutarde, puis disposer les tomates en rondelles et le chèvre émietté.",
       "Parsemer d'herbes de Provence, arroser d'un filet d'huile d'olive et cuire 25 min : la pâte doit être dorée."], "Française", meal=("Déjeuner", "Dîner", "Entrée"))
    P("Poêlée de champignons à l'ail et au persil", "Poêlées", 15, ["plaques"], ["rapide", "végétarien", "économique"],
      [("champignons", 1.5), ("ail", 1), ("persil", 1), ("beurre", 1)],
      ["Nettoyer les champignons et les couper en quartiers.",
       "Les faire sauter 8 min à feu vif dans le beurre, sans les remuer tout le temps, jusqu'à ce qu'ils soient dorés.",
       "Ajouter l'ail et le persil hachés, saler, poivrer et cuire encore 1 min."], "Française", meal=("Déjeuner", "Dîner"))
    P("Fenouil rôti au parmesan", "Gratins & four", 40, ["four"], ["végétarien", "léger"],
      [("fenouil", 1.5), ("parmesan", 1), ("huile-olive", 1), ("citron", 0.5)],
      ["Préchauffer le four à 200 °C. Couper les bulbes de fenouil en quartiers.",
       "Les mettre dans un plat, arroser d'huile d'olive, saler et poivrer, et cuire 25 min.",
       "Parsemer de parmesan râpé et remettre 10 min au four. Servir avec un filet de jus de citron."], "Italienne", meal=("Déjeuner", "Dîner", "Entrée"))
    P("Salade de quinoa, feta, concombre et menthe", "Salades", 20, ["plaques"], ["été", "végétarien", "léger"],
      [("quinoa", 1), ("feta", 1), ("concombre", 1), ("tomate-cerise", 1), ("menthe", 1), ("citron", 0.5), ("huile-olive", 1)],
      ["Cuire le quinoa 12 min dans l'eau bouillante salée, l'égoutter et le laisser refroidir.",
       "Couper le concombre en dés et les tomates cerises en deux.",
       "Mélanger le quinoa avec les légumes, la feta émiettée et la menthe ciselée. Assaisonner avec le jus du citron et l'huile d'olive."], "Méditerranéenne", meal=("Déjeuner", "Dîner", "Entrée"))
    # ---------- desserts ----------
    P("Cake au citron", "Desserts", 55, ["four"], ["goûter", "dessert"],
      [("farine", 1.67), ("sucre", 2.5), ("oeufs", 0.75), ("beurre", 6), ("citron", 1.5), ("levure", 1)],
      ["Préchauffer le four à 180 °C. Fouetter les œufs avec le sucre jusqu'à ce que le mélange blanchisse.",
       "Ajouter le beurre fondu, le zeste et le jus des citrons, puis la farine et la levure.",
       "Verser dans un moule à cake beurré et cuire 40 min : la pointe d'un couteau doit ressortir sèche."], "Française", meal=D, serv=6)
    P("Salade de mangue et kiwi à la menthe", "Desserts", 10, [], ["léger", "été", "dessert", "sans cuisson"],
      [("mangue", 1), ("kiwi", 1), ("citron-vert", 0.5), ("menthe", 0.5), ("miel", 0.5)],
      ["Éplucher la mangue et les kiwis et les couper en dés.",
       "Arroser du jus du citron vert et d'un filet de miel, puis mélanger.",
       "Parsemer de menthe ciselée et servir bien frais."], "Exotique", meal=D)
    P("Poires rôties au miel et aux noix", "Desserts", 30, ["four"], ["hiver", "léger", "dessert"],
      [("poire", 1), ("miel", 1), ("noix", 1), ("beurre", 0.5), ("cannelle", 1)],
      ["Préchauffer le four à 190 °C. Couper les poires en deux et retirer le cœur.",
       "Les poser dans un plat, côté coupé vers le haut, ajouter un petit morceau de beurre, le miel et la cannelle.",
       "Cuire 20 min, parsemer de noix concassées et servir tiède."], "Française", meal=D)
    # ---------- appareils ----------
    P("Fondant au chocolat au micro-ondes", "Desserts", 10, ["micro-ondes"], ["rapide", "dessert", "chocolat"],
      [("chocolat", 2), ("beurre", 5), ("sucre", 1.5), ("oeufs", 0.75), ("farine", 0.25)],
      ["Faire fondre le chocolat et le beurre 1 min au micro-ondes dans un plat rond, puis bien mélanger.",
       "Ajouter le sucre, les œufs puis la farine, et mélanger jusqu'à ce que ce soit lisse.",
       "Cuire 3 min à pleine puissance : le centre doit rester un peu tremblant. Laisser tiédir 5 min avant de servir."], "Française", meal=D, serv=4)
    P("Choux de Bruxelles croustillants au air fryer", "Poêlées", 25, ["air_fryer"], ["hiver", "léger", "végétarien"],
      [("choux-bruxelles", 1), ("huile-olive", 1), ("parmesan", 0.5), ("miel", 0.5)],
      ["Couper les choux de Bruxelles en deux et les mélanger avec l'huile d'olive, du sel et du poivre.",
       "Les cuire 15 min à 190 °C au air fryer en secouant le panier à mi-cuisson.",
       "Les arroser d'un filet de miel, parsemer de parmesan râpé et cuire encore 2 min."], "Belge", meal=("Déjeuner", "Dîner"))
    P("Saumon teriyaki au air fryer", "Poisson", 20, ["air_fryer", "plaques"], ["poisson", "rapide"],
      [("saumon", 1), ("sauce-soja", 1.5), ("miel", 1), ("gingembre", 1), ("riz", 0.8), ("sesame", 1)],
      ["Mélanger la sauce soja, le miel et le gingembre râpé. Y enrober le saumon et laisser 10 min.",
       "Cuire le riz 11 min dans l'eau bouillante salée.",
       "Cuire le saumon 8 à 10 min à 190 °C au air fryer, en le badigeonnant de marinade à mi-cuisson. Servir avec le riz et parsemer de sésame."], "Japonaise")
    P("Poulet aux champignons et à la crème au Cookeo", "Plats mijotés", 25, ["cookeo"], ["familial", "rapide", "réconfort"],
      [("poulet", 1.2), ("champignons", 1), ("creme", 1.5), ("oignon", 1), ("bouillon", 0.4), ("moutarde", 0.5), ("riz", 1)],
      ["Cuire d'abord le riz : riz rincé et deux fois son volume d'eau salée, cuisson sous pression 8 min. Le réserver au chaud.",
       "Programme Dorer : faire dorer le poulet en morceaux avec l'oignon émincé 5 min, puis ajouter les champignons émincés.",
       "Ajouter le bouillon et la moutarde, saler, poivrer, fermer et lancer la cuisson sous pression 8 min.",
       "Ouvrir, ajouter la crème et laisser épaissir 2 min en programme Dorer. Servir avec le riz."], "Française")
    P("Soupe de potimarron au Cookeo", "Soupes", 25, ["cookeo"], ["hiver", "végétarien", "économique"],
      [("potimarron", 1), ("pomme-de-terre", 0.4), ("oignon", 1), ("bouillon", 1.2), ("creme", 1)],
      ["Couper le potimarron en morceaux (la peau peut rester), la pomme de terre et l'oignon aussi.",
       "Programme Dorer : faire revenir l'oignon 2 min, puis ajouter le potimarron, la pomme de terre et le bouillon. Saler, poivrer.",
       "Fermer et lancer la cuisson sous pression 10 min.",
       "Écraser au presse-purée (ou mixer si tu as un mixeur), ajouter la crème et servir."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Velouté de brocoli au Thermomix", "Soupes", 30, ["thermomix"], ["hiver", "végétarien", "léger"],
      [("brocoli", 1.2), ("pomme-de-terre", 0.4), ("oignon", 1), ("bouillon", 1.2), ("fromage-frais", 0.8)],
      ["Mettre l'oignon dans le bol et hacher 5 s / vitesse 5.",
       "Ajouter le brocoli en bouquets, la pomme de terre en morceaux et le bouillon, et cuire 20 min / 100 °C / vitesse 1.",
       "Ajouter le fromage frais et mixer 1 min en montant progressivement de la vitesse 5 à 10. Saler, poivrer."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Brochettes de légumes et tofu au barbecue", "Grillades", 30, ["barbecue"], ["barbecue", "été", "végétarien"],
      [("tofu", 1), ("courgette", 0.7), ("poivron", 0.8), ("oignon-rouge", 0.5), ("sauce-soja", 1), ("huile-olive", 1)],
      ["Couper le tofu en cubes et le faire mariner 15 min dans la sauce soja avec l'huile d'olive.",
       "Couper la courgette, le poivron et l'oignon rouge en morceaux et les enfiler sur des piques en alternant avec le tofu.",
       "Griller 10 min sur les braises en tournant souvent et en badigeonnant du reste de marinade."], "Asiatique", meal=("Déjeuner", "Dîner"))
    P("Pilons de poulet marinés au barbecue", "Grillades", 45, ["barbecue"], ["barbecue", "été", "familial"],
      [("poulet", 2), ("miel", 1), ("sauce-soja", 1), ("paprika", 1), ("ail", 0.5), ("citron", 0.5)],
      ["Mélanger le miel, la sauce soja, le paprika, l'ail écrasé et le jus du citron. Y laisser mariner le poulet (pilons) au moins 30 min.",
       "Griller 25 à 30 min sur le bord de la grille, à chaleur moyenne, en les tournant souvent pour que la marinade ne brûle pas.",
       "Le jus doit être clair quand on pique près de l'os. Servir avec une salade ou du maïs."], "Américaine")
    P("Gaufres aux pommes et à la cannelle", "Desserts", 30, ["gaufrier"], ["goûter", "enfants", "dessert"],
      [("farine", 2), ("lait", 2.5), ("oeufs", 0.75), ("beurre", 4), ("sucre", 1), ("pomme", 0.5), ("cannelle", 1), ("levure", 0.5)],
      ["Mélanger la farine, le sucre, la cannelle et la levure, puis ajouter les œufs et le lait en fouettant.",
       "Ajouter le beurre fondu et la pomme râpée.",
       "Cuire dans le gaufrier chaud et graissé, environ 4 min par gaufre."], "Belge", meal=D, serv=4)
    # ---------- encore plus pour les appareils qui avaient peu de recettes ----------
    # raclette
    P("Raclette savoyarde au reblochon", "Gratins & four", 35, ["raclette"], ["hiver", "convivial", "fromage"],
      [("reblochon", 1), ("pomme-de-terre", 1.2), ("jambon-cru", 1), ("oignon", 0.5), ("cornichons", 0.5)],
      ["Cuire les pommes de terre 20 min dans l'eau bouillante salée, puis les garder au chaud dans un torchon.",
       "Couper le reblochon en tranches épaisses (avec la croûte) et émincer l'oignon finement.",
       "Dans chaque coupelle, mettre un peu d'oignon et une tranche de reblochon, et faire fondre sous l'appareil à raclette.",
       "Napper les pommes de terre de reblochon fondu et servir avec le jambon cru et les cornichons."], "Savoyarde", diff="Facile")
    P("Raclette façon tartiflette", "Gratins & four", 35, ["raclette"], ["hiver", "convivial", "fromage"],
      [("raclette", 1), ("pomme-de-terre", 1.2), ("lardons", 1), ("oignon", 1), ("creme", 0.5)],
      ["Cuire les pommes de terre 20 min dans l'eau bouillante salée, puis les couper en rondelles.",
       "Faire dorer les lardons avec l'oignon émincé 5 min à la poêle, sans matière grasse.",
       "Dans chaque coupelle, mettre quelques rondelles de pommes de terre, un peu de lardons et d'oignon, une cuillère de crème et une tranche de raclette.",
       "Glisser sous l'appareil jusqu'à ce que le fromage soit fondu et doré."], "Savoyarde")
    P("Raclette au poulet et légumes grillés", "Grillades", 40, ["raclette"], ["convivial", "fromage", "poulet"],
      [("poulet", 1), ("courgette", 0.6), ("poivron", 0.6), ("champignons", 0.6), ("raclette", 0.8), ("pomme-de-terre", 1), ("paprika", 1), ("huile-olive", 0.5)],
      ["Cuire les pommes de terre 20 min dans l'eau bouillante salée.",
       "Couper le poulet en fines lamelles et le mélanger avec l'huile d'olive et le paprika. Couper la courgette, le poivron et les champignons en tranches fines.",
       "Chacun fait griller son poulet et ses légumes sur la plaque du dessus, 4 à 5 min en les retournant.",
       "Pendant ce temps, faire fondre la raclette dans les coupelles et la verser sur les pommes de terre, le poulet et les légumes."], "Française")
    # gaufrier
    P("Gaufres de courgette au parmesan", "Œufs", 30, ["gaufrier"], ["végétarien", "été", "enfants"],
      [("courgette", 1), ("oeufs", 0.5), ("farine", 0.8), ("parmesan", 1), ("lait", 0.5)],
      ["Râper la courgette, la saler et la presser dans les mains pour enlever l'eau.",
       "Mélanger les œufs, la farine, le lait et le parmesan râpé, puis ajouter la courgette. Poivrer.",
       "Cuire dans le gaufrier chaud et graissé environ 5 min, jusqu'à ce que les gaufres soient dorées. Servir avec une salade."], "Française", meal=("Déjeuner", "Dîner"))
    P("Gaufres-brownies au chocolat", "Desserts", 20, ["gaufrier"], ["goûter", "chocolat", "enfants"],
      [("chocolat", 1.5), ("beurre", 5), ("sucre", 1.5), ("oeufs", 0.5), ("farine", 0.5)],
      ["Faire fondre le chocolat avec le beurre (au bain-marie ou 1 min au micro-ondes), puis mélanger.",
       "Ajouter le sucre, les œufs puis la farine, et mélanger juste ce qu'il faut.",
       "Cuire des petites louches dans le gaufrier chaud environ 3 min : l'intérieur doit rester fondant. Laisser tiédir avant de servir."], "Américaine", meal=D, serv=4)
    P("Pain perdu au gaufrier", "Petit-déjeuner", 15, ["gaufrier"], ["goûter", "anti-gaspi", "enfants"],
      [("pain-mie", 1), ("oeufs", 0.5), ("lait", 0.5), ("sucre", 0.5), ("cannelle", 1), ("beurre", 0.5)],
      ["Battre les œufs avec le lait, le sucre et la cannelle.",
       "Tremper rapidement chaque tranche de pain de mie dans le mélange.",
       "Cuire 3 min dans le gaufrier chaud et beurré, jusqu'à ce que ce soit doré et croustillant."], "Française", meal=("Petit-déjeuner", "Goûter", "Dessert"))
    # micro-ondes
    P("Saumon au citron et à l'aneth au micro-ondes", "Poisson", 10, ["micro-ondes"], ["poisson", "rapide", "léger"],
      [("saumon", 1), ("citron", 0.5), ("aneth", 0.5), ("huile-olive", 0.5)],
      ["Poser le saumon dans un plat qui va au micro-ondes, arroser du jus du citron et d'un filet d'huile d'olive. Saler, poivrer et parsemer d'aneth.",
       "Couvrir d'une assiette ou d'un film percé et cuire 3 à 4 min à 800 W.",
       "Laisser reposer 1 min couvert avant de servir."], "Française")
    P("Courgettes au micro-ondes, feta et menthe", "Salades", 10, ["micro-ondes"], ["léger", "végétarien", "rapide"],
      [("courgette", 1), ("feta", 0.6), ("menthe", 0.5), ("huile-olive", 0.5), ("citron", 0.5)],
      ["Couper les courgettes en rondelles et les mettre dans un plat avec 2 cuillères d'eau.",
       "Couvrir et cuire 5 min à 800 W, puis égoutter.",
       "Arroser d'huile d'olive et du jus du citron, émietter la feta et parsemer de menthe ciselée."], "Méditerranéenne", meal=("Déjeuner", "Dîner", "Entrée"))
    P("Riz sauté express au micro-ondes", "Riz", 20, ["micro-ondes"], ["rapide", "économique", "anti-gaspi"],
      [("riz", 0.8), ("legumes-surgeles", 0.8), ("oeufs", 0.7), ("sauce-soja", 1)],
      ["Mettre le riz dans un grand bol avec deux fois son volume d'eau salée. Cuire 12 min à 800 W sans couvrir, puis laisser gonfler 3 min.",
       "Ajouter les légumes surgelés, couvrir et cuire 3 min.",
       "Battre les œufs, les verser sur le riz, mélanger et cuire encore 1 à 2 min en remuant à mi-temps.",
       "Arroser de sauce soja et mélanger."], "Asiatique")
    # Thermomix
    P("Soupe poireaux-pommes de terre au Thermomix", "Soupes", 30, ["thermomix"], ["hiver", "économique", "végétarien"],
      [("poireau", 1), ("pomme-de-terre", 0.8), ("bouillon", 1.2), ("creme", 0.5)],
      ["Couper le poireau en tronçons, le mettre dans le bol et hacher 5 s / vitesse 5.",
       "Ajouter les pommes de terre en morceaux et le bouillon, et cuire 20 min / 100 °C / vitesse 1.",
       "Ajouter la crème et mixer 1 min en montant progressivement à vitesse 10. Saler, poivrer."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Riz au lait au Thermomix", "Desserts", 45, ["thermomix"], ["réconfort", "dessert", "économique"],
      [("riz", 0.6), ("lait", 4), ("sucre", 1), ("vanille", 1)],
      ["Mettre le lait, le riz, le sucre et la vanille dans le bol.",
       "Cuire 40 min / 90 °C / vitesse sens inverse 1, sans le gobelet, en posant le panier sur le couvercle.",
       "Verser dans des pots et laisser refroidir : le riz au lait épaissit en refroidissant."], "Française", meal=D, serv=4)
    # barbecue
    P("Côtes de porc marinées au barbecue", "Grillades", 40, ["barbecue"], ["barbecue", "été", "familial"],
      [("porc", 1), ("miel", 1), ("moutarde", 1), ("sauce-soja", 1), ("ail", 0.5)],
      ["Mélanger le miel, la moutarde, la sauce soja et l'ail écrasé. Y laisser mariner le porc (côtes) au moins 30 min.",
       "Griller 5 à 6 min de chaque côté sur les braises, en badigeonnant de marinade.",
       "Laisser reposer 2 min avant de servir."], "Américaine")
    P("Saumon en papillote au barbecue", "Grillades", 30, ["barbecue"], ["barbecue", "poisson", "été"],
      [("saumon", 1), ("courgette", 0.6), ("citron", 0.5), ("aneth", 0.5), ("huile-olive", 0.5)],
      ["Couper la courgette en fines rondelles et le citron en tranches.",
       "Sur une grande feuille de papier aluminium, poser la courgette puis le saumon. Ajouter le citron, l'aneth et un filet d'huile d'olive. Saler, poivrer et bien fermer.",
       "Cuire 15 min sur la grille, sur le côté des braises."], "Française")
    P("Pommes de terre en papillote au barbecue", "Grillades", 50, ["barbecue"], ["barbecue", "été", "végétarien"],
      [("pomme-de-terre", 1.2), ("beurre", 0.5), ("ail", 0.5), ("herbes-provence", 1), ("creme", 0.5)],
      ["Laver les pommes de terre et les entailler en croix sur le dessus.",
       "Glisser un peu de beurre, d'ail haché et d'herbes de Provence dans chaque entaille, puis emballer chaque pomme de terre dans du papier aluminium.",
       "Cuire 40 min dans les braises (ou sur la grille), en les tournant de temps en temps. Ouvrir et servir avec une cuillère de crème."], "Française")
    # air fryer
    P("Nuggets de poulet au air fryer", "Poêlées", 25, ["air_fryer"], ["enfants", "poulet", "rapide"],
      [("poulet", 1), ("farine", 0.25), ("oeufs", 0.25), ("chapelure", 1), ("paprika", 1)],
      ["Couper le poulet en morceaux. Mettre la farine, les œufs battus et la chapelure mélangée au paprika dans trois assiettes.",
       "Passer chaque morceau dans la farine, puis dans les œufs, puis dans la chapelure.",
       "Cuire 10 à 12 min à 200 °C au air fryer, en les retournant à mi-cuisson, jusqu'à ce qu'ils soient dorés."], "Américaine")
    P("Potatoes au air fryer", "Poêlées", 30, ["air_fryer"], ["enfants", "végétarien", "économique"],
      [("pomme-de-terre", 1.2), ("huile-olive", 1), ("paprika", 1), ("herbes-provence", 1)],
      ["Couper les pommes de terre en quartiers, sans les éplucher.",
       "Les mélanger avec l'huile d'olive, le paprika, les herbes de Provence et du sel.",
       "Cuire 20 à 25 min à 200 °C au air fryer, en secouant le panier deux fois."], "Américaine", meal=("Déjeuner", "Dîner"))
    P("Cordons bleus maison au air fryer", "Poêlées", 30, ["air_fryer"], ["enfants", "familial"],
      [("dinde", 1), ("jambon", 0.5), ("emmental", 0.5), ("farine", 0.25), ("oeufs", 0.25), ("chapelure", 1)],
      ["Aplatir la dinde (escalopes) entre deux feuilles de papier cuisson. Poser une demi-tranche de jambon et un peu d'emmental sur une moitié, puis replier.",
       "Passer dans la farine, les œufs battus puis la chapelure, en appuyant bien sur les bords.",
       "Cuire 14 à 16 min à 190 °C au air fryer, en les retournant à mi-cuisson."], "Française")
    # Cookeo
    P("Pâtes bolognaise au Cookeo", "Pâtes", 25, ["cookeo"], ["familial", "rapide", "enfants"],
      [("pates", 1), ("boeuf-hache", 1), ("tomate-concassee", 1), ("oignon", 1), ("ail", 0.5), ("herbes-provence", 1)],
      ["Programme Dorer : faire revenir l'oignon émincé et l'ail 2 min, puis le bœuf haché 3 min en l'émiettant.",
       "Ajouter les pâtes, la tomate concassée, les herbes de Provence et de l'eau à hauteur. Saler, poivrer.",
       "Fermer et lancer la cuisson sous pression 5 min. Ouvrir, mélanger et servir."], "Italienne")
    P("Curry de pois chiches au Cookeo", "Curry", 25, ["cookeo"], ["végétarien", "économique", "épicé"],
      [("pois-chiches", 1), ("lait-coco", 1), ("tomate-concassee", 0.5), ("oignon", 1), ("curry", 1), ("epinards", 0.5), ("riz", 0.8)],
      ["Cuire d'abord le riz : riz rincé et deux fois son volume d'eau salée, cuisson sous pression 8 min. Le réserver au chaud.",
       "Programme Dorer : faire revenir l'oignon émincé 2 min avec le curry.",
       "Ajouter les pois chiches égouttés, la tomate concassée et le lait de coco. Saler, fermer et lancer la cuisson sous pression 5 min.",
       "Ouvrir, ajouter les épinards et remuer 1 min pour qu'ils fondent. Servir avec le riz."], "Indienne")
    P("Riz au poulet et chorizo au Cookeo", "Riz", 30, ["cookeo"], ["familial", "épicé"],
      [("riz", 1), ("poulet", 1), ("chorizo", 0.8), ("poivron", 0.8), ("oignon", 1), ("tomate-concassee", 0.5), ("bouillon", 0.8), ("paprika", 1)],
      ["Programme Dorer : faire dorer le poulet en morceaux, le chorizo en rondelles et l'oignon émincé 5 min.",
       "Ajouter le poivron en lanières, le riz et le paprika, et remuer 1 min.",
       "Verser la tomate concassée et le bouillon, fermer et lancer la cuisson sous pression 8 min.",
       "Laisser reposer 5 min avant d'ouvrir, puis mélanger."], "Espagnole")
    return R
