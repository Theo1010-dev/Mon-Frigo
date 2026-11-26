# -*- coding: utf-8 -*-
"""Recettes écrites à la main (20) : une par appareil, pour que chacun ait de vraies idées.
Barbecue (ou plancha), appareil à raclette, gaufrier (nouveaux), puis micro-ondes, air fryer, Thermomix, Cookeo, et deux classiques."""
from gen_hand1 import H

D = ("Dessert", "Goûter")
APERO = ("Apéritif", "Entrée")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- Barbecue / plancha ----------
    P("Brochettes de poulet au barbecue, marinade yaourt-paprika", "Grillades", 35, ["barbecue"], ["barbecue", "été", "familial"],
      [("poulet", 1.2), ("yaourt", 0.5), ("paprika", 1), ("citron", 0.5), ("ail", 0.5), ("poivron", 0.8), ("oignon-rouge", 1)],
      ["Couper le poulet en gros cubes. Le mélanger avec le yaourt, le paprika, le jus du demi-citron et l'ail écrasé. Saler, poivrer et laisser mariner au moins 20 min au frais.",
       "Couper le poivron et l'oignon rouge en morceaux. Les enfiler sur des piques en alternant avec le poulet.",
       "Griller 8 à 10 min sur les braises bien chaudes, en tournant les brochettes souvent : le poulet doit être doré et cuit à cœur."], "Méditerranéenne", meal=("Déjeuner", "Dîner"))
    P("Merguez et saucisses grillées, salade de pommes de terre", "Grillades", 40, ["barbecue", "plaques"], ["barbecue", "été", "familial"],
      [("merguez", 1), ("saucisses", 1), ("pomme-de-terre", 1), ("oignon-rouge", 0.5), ("moutarde", 1), ("vinaigre", 1), ("huile-olive", 1.5), ("persil", 1)],
      ["Cuire les pommes de terre avec la peau 20 à 25 min dans l'eau salée. Les égoutter, les peler tièdes et les couper en rondelles.",
       "Mélanger la moutarde, le vinaigre et l'huile d'olive. Verser sur les pommes de terre encore tièdes avec l'oignon rouge émincé et le persil haché.",
       "Griller les merguez et les saucisses 10 à 12 min sur les braises en les tournant régulièrement. Servir avec la salade."], "Française")
    P("Côtelettes d'agneau grillées aux herbes", "Grillades", 25, ["barbecue"], ["barbecue", "été", "rapide"],
      [("agneau", 1), ("ail", 1), ("herbes-provence", 1), ("huile-olive", 1), ("citron", 0.5), ("tomate-cerise", 1)],
      ["Frotter les côtelettes d'agneau avec l'ail écrasé, l'huile d'olive et les herbes de Provence. Laisser reposer 15 min.",
       "Griller 3 à 4 min de chaque côté sur les braises bien chaudes. Saler, poivrer après la cuisson.",
       "Griller les tomates cerises 3 min en même temps, puis servir avec un filet de jus de citron."], "Méditerranéenne")
    P("Sardines grillées au citron", "Grillades", 20, ["barbecue"], ["barbecue", "poisson", "été", "économique"],
      [("sardines", 3), ("citron", 1), ("huile-olive", 1), ("persil", 1), ("pain", 1)],
      ["Rincer les sardines entières et bien les sécher. Les badigeonner d'huile d'olive et les saler.",
       "Les griller 4 à 5 min de chaque côté sur une grille bien chaude, sans les bouger au début pour qu'elles n'attachent pas.",
       "Arroser de jus de citron, parsemer de persil haché et servir avec du pain grillé."], "Portugaise")
    P("Épis de maïs grillés au beurre", "Grillades", 25, ["barbecue", "plaques"], ["barbecue", "été", "enfants", "économique"],
      [("mais", 3.5), ("beurre", 1.5), ("paprika", 0.5), ("citron-vert", 0.5)],
      ["Plonger les épis de maïs 8 min dans l'eau bouillante salée, puis les égoutter.",
       "Les griller 8 à 10 min sur les braises en les tournant, jusqu'à ce qu'ils soient bien marqués.",
       "Les badigeonner de beurre fondu, saupoudrer de paprika et servir avec un quartier de citron vert."], "Américaine", meal=("Déjeuner", "Dîner", "Entrée"))
    P("Légumes grillés au barbecue", "Grillades", 30, ["barbecue"], ["barbecue", "été", "léger"],
      [("courgette", 1), ("poivron", 1), ("aubergine", 0.8), ("oignon-rouge", 1), ("huile-olive", 1.5), ("herbes-provence", 1), ("ail", 0.5)],
      ["Couper la courgette et l'aubergine en tranches dans la longueur, le poivron en lanières et l'oignon rouge en quartiers.",
       "Les badigeonner d'huile d'olive mélangée à l'ail écrasé et aux herbes de Provence. Saler.",
       "Griller 4 à 6 min de chaque côté sur la grille : les légumes doivent être tendres et bien marqués. Servir chaud ou froid."], "Méditerranéenne", meal=("Déjeuner", "Dîner", "Entrée"))
    P("Burgers au barbecue", "Grillades", 30, ["barbecue"], ["barbecue", "été", "familial", "enfants"],
      [("boeuf-hache", 1.2), ("pain", 1), ("cheddar", 1), ("salade", 0.4), ("tomate", 0.5), ("oignon-rouge", 0.5), ("ketchup", 1)],
      ["Former 2 steaks un peu plus larges que le pain avec le bœuf haché, sans trop le tasser. Saler et poivrer.",
       "Griller les steaks 3 à 4 min de chaque côté sur les braises. Poser une tranche de cheddar dessus la dernière minute pour qu'elle fonde.",
       "Toaster le pain 1 min sur la grille. Monter les burgers avec la salade, les rondelles de tomate et d'oignon rouge et le ketchup."], "Américaine")
    P("Gambas grillées à l'ail et au persil", "Grillades", 20, ["barbecue"], ["barbecue", "poisson", "été", "rapide"],
      [("crevettes", 1.2), ("ail", 1), ("persil", 1), ("huile-olive", 1.5), ("citron", 1)],
      ["Mélanger l'huile d'olive, l'ail haché, le persil ciselé et le zeste du citron. Y rouler les crevettes et laisser 10 min.",
       "Griller les crevettes 2 à 3 min de chaque côté sur la plancha ou la grille bien chaude : elles deviennent roses.",
       "Arroser de jus de citron et servir aussitôt."], "Espagnole", meal=("Déjeuner", "Dîner", "Apéritif"))
    P("Brochettes d'halloumi et légumes grillés", "Grillades", 25, ["barbecue"], ["barbecue", "été", "rapide"],
      [("halloumi", 1), ("courgette", 0.7), ("poivron", 0.8), ("tomate-cerise", 0.8), ("huile-olive", 1), ("citron", 0.5), ("menthe", 0.5)],
      ["Couper l'halloumi, la courgette et le poivron en cubes. Les enfiler sur des piques avec les tomates cerises.",
       "Badigeonner d'huile d'olive et griller 6 à 8 min en tournant : l'halloumi doit être doré sans fondre.",
       "Arroser de jus de citron et parsemer de menthe ciselée."], "Grecque")
    P("Bananes au chocolat au barbecue", "Desserts", 15, ["barbecue"], ["barbecue", "été", "enfants", "dessert"],
      [("banane", 1), ("chocolat", 0.5)],
      ["Fendre les bananes dans la longueur sans enlever la peau et sans les couper en deux.",
       "Glisser des carrés de chocolat dans la fente et envelopper chaque banane dans du papier aluminium.",
       "Poser 8 à 10 min sur les braises. Ouvrir et manger à la cuillère, le chocolat fondu dans la banane."], "Française", meal=D)
    P("Ananas grillé au miel et citron vert", "Desserts", 15, ["barbecue"], ["barbecue", "été", "léger", "dessert"],
      [("ananas", 0.6), ("miel", 1.5), ("citron-vert", 1), ("menthe", 0.5)],
      ["Éplucher l'ananas et le couper en tranches épaisses.",
       "Les griller 2 à 3 min de chaque côté sur la grille bien chaude, en les badigeonnant de miel.",
       "Arroser de jus de citron vert et parsemer de menthe ciselée."], "Exotique", meal=D)
    # ---------- Appareil à raclette ----------
    P("Raclette traditionnelle", "Plats mijotés", 35, ["raclette", "plaques"], ["hiver", "fête", "familial", "réconfort"],
      [("raclette", 4), ("pomme-de-terre", 2.4), ("jambon-cru", 2), ("jambon", 2), ("saucisson", 2), ("cornichons", 2), ("salade", 1)],
      ["Cuire les pommes de terre avec la peau 20 à 25 min dans l'eau salée, puis les garder au chaud dans un torchon.",
       "Allumer l'appareil à raclette 10 min avant de passer à table. Disposer les tranches de raclette, la charcuterie (jambon cru, jambon, saucisson) et les cornichons.",
       "Chacun fait fondre son fromage dans son poêlon 2 à 3 min et le verse sur ses pommes de terre. Servir avec la salade verte."], "Savoyarde", serv=4)
    P("Raclette végétarienne aux légumes", "Plats mijotés", 35, ["raclette", "plaques"], ["hiver", "fête", "réconfort"],
      [("raclette", 4), ("pomme-de-terre", 2), ("champignons", 1), ("courgette", 1), ("poivron", 1), ("oignon-rouge", 1), ("salade", 1)],
      ["Cuire les pommes de terre avec la peau 20 à 25 min dans l'eau salée.",
       "Couper les champignons, la courgette, le poivron et l'oignon rouge en petits morceaux.",
       "Faire griller les légumes sur la plaque du haut de l'appareil à raclette pendant que la raclette fond dans les poêlons. Servir avec la salade."], "Savoyarde", serv=4)
    P("Raclette au chèvre, miel et noix", "Plats mijotés", 30, ["raclette", "plaques"], ["hiver", "fête"],
      [("raclette", 1), ("chevre", 1.5), ("miel", 1), ("noix", 1), ("pomme-de-terre", 1), ("jambon-cru", 1)],
      ["Cuire les pommes de terre avec la peau 20 à 25 min dans l'eau salée.",
       "Dans chaque poêlon, poser une tranche de raclette et une rondelle de chèvre, ajouter un filet de miel et des noix concassées.",
       "Faire fondre 3 min sous l'appareil à raclette et verser sur les pommes de terre, avec le jambon cru."], "Savoyarde")
    # ---------- Gaufrier ----------
    P("Gaufres au chocolat", "Desserts", 30, ["gaufrier"], ["goûter", "enfants", "dessert"],
      [("farine", 2), ("cacao", 1.5), ("sucre", 1), ("oeufs", 0.5), ("lait", 2.5), ("beurre", 3), "levure"],
      ["Mélanger la farine, le cacao, le sucre et la levure. Ajouter les œufs puis le lait petit à petit en fouettant.",
       "Incorporer le beurre fondu et laisser reposer 15 min.",
       "Cuire dans le gaufrier bien chaud et graissé, environ 4 min par gaufre."], "Belge", meal=D, serv=4)
    P("Gaufres de pommes de terre au fromage", "Poêlées", 30, ["gaufrier"], ["enfants", "économique", "réconfort"],
      [("pomme-de-terre", 1), ("oeufs", 0.5), ("farine", 0.3), ("fromage-rape", 1), ("ciboulette", 1)],
      ["Râper les pommes de terre crues et les presser fort dans un torchon pour enlever l'eau.",
       "Mélanger avec les œufs battus, la farine, le fromage râpé et la ciboulette ciselée. Saler, poivrer.",
       "Étaler une bonne cuillerée dans le gaufrier chaud et graissé et cuire 6 à 8 min : la gaufre doit être bien dorée. Servir avec une salade."], "Belge")
    P("Croque-gaufre jambon-fromage", "Sandwichs", 10, ["gaufrier"], ["rapide", "enfants", "express"],
      [("pain-mie", 1), ("jambon", 1), ("emmental", 1), ("beurre", 0.5)],
      ["Beurrer les tranches de pain de mie sur une face.",
       "Garnir de jambon et d'emmental, côté beurré à l'extérieur.",
       "Cuire 3 à 4 min dans le gaufrier chaud, couvercle bien fermé : le croque est doré et le fromage coule."], "Française", meal=("Déjeuner", "Dîner", "Goûter"))
    P("Gaufres salées jambon-emmental", "Sandwichs", 30, ["gaufrier"], ["enfants", "familial"],
      [("farine", 1.5), ("oeufs", 0.5), ("lait", 1.5), ("beurre", 2), ("jambon", 1), ("emmental", 1), ("levure", 0.5)],
      ["Mélanger la farine et la levure, ajouter les œufs puis le lait en fouettant, et le beurre fondu. Saler, poivrer.",
       "Ajouter le jambon en petits dés et l'emmental râpé.",
       "Cuire dans le gaufrier chaud et graissé, 4 à 5 min par gaufre. Servir avec une salade."], "Belge", serv=2)
    P("Gaufres banane et flocons d'avoine", "Petit-déjeuner", 20, ["gaufrier"], ["petit-déjeuner", "équilibré", "rapide"],
      [("banane", 1), ("oeufs", 0.5), ("flocons-avoine", 1), ("lait", 0.5), ("levure", 0.5)],
      ["Écraser les bananes à la fourchette.",
       "Ajouter les œufs, les flocons d'avoine, le lait et la levure, et bien mélanger.",
       "Cuire dans le gaufrier chaud et graissé, 4 à 5 min par gaufre. Servir tiède avec des fruits."], "Américaine", meal=("Petit-déjeuner", "Goûter"))
    # ---------- Micro-ondes ----------
    P("Patate douce au micro-ondes, feta et ciboulette", "Poêlées", 15, ["micro-ondes"], ["rapide", "express", "économique"],
      [("patate-douce", 1), ("feta", 0.6), ("yaourt", 0.5), ("ciboulette", 1), ("huile-olive", 0.5)],
      ["Laver les patates douces et les piquer plusieurs fois à la fourchette.",
       "Les cuire 8 à 10 min au micro-ondes à pleine puissance, en les retournant à mi-cuisson : la pointe d'un couteau doit entrer facilement.",
       "Les fendre en deux, arroser d'un filet d'huile d'olive, ajouter le yaourt, la feta émiettée et la ciboulette ciselée. Saler, poivrer."], "Française")
    P("Cabillaud en papillote au micro-ondes", "Poisson", 15, ["micro-ondes"], ["poisson", "léger", "rapide"],
      [("cabillaud", 1), ("courgette", 0.7), ("citron", 0.5), ("huile-olive", 0.5), ("aneth", 0.5)],
      ["Couper la courgette en fines rondelles et les répartir dans un plat allant au micro-ondes.",
       "Poser le cabillaud dessus, saler, poivrer, ajouter des rondelles de citron, l'aneth et un filet d'huile d'olive.",
       "Couvrir d'un film spécial micro-ondes percé ou d'une assiette, et cuire 5 à 6 min à pleine puissance. Laisser reposer 1 min."], "Française")
    P("Légumes vapeur au micro-ondes, beurre citronné", "Poêlées", 15, ["micro-ondes"], ["léger", "rapide", "équilibré"],
      [("brocoli", 1), ("carotte", 0.7), ("beurre", 1), ("citron", 0.5)],
      ["Couper le brocoli en petits bouquets et les carottes en fines rondelles.",
       "Les mettre dans un plat avec 3 cuillères à soupe d'eau, couvrir et cuire 6 à 7 min au micro-ondes à pleine puissance.",
       "Égoutter, ajouter le beurre et le jus du citron, saler, poivrer et mélanger."], "Française", meal=("Déjeuner", "Dîner"))
    P("Quiche en tasse au micro-ondes", "Œufs", 10, ["micro-ondes"], ["rapide", "express", "enfants"],
      [("oeufs", 0.5), ("lait", 0.25), ("jambon", 0.5), ("emmental", 0.4), ("ciboulette", 0.5)],
      ["Battre les œufs avec le lait dans deux grandes tasses. Saler, poivrer.",
       "Ajouter le jambon en dés, l'emmental râpé et la ciboulette.",
       "Cuire 1 min 30 au micro-ondes, mélanger, puis encore 30 s à 1 min : la quiche doit être prise mais encore moelleuse."], "Française", meal=("Déjeuner", "Dîner", "Petit-déjeuner"))
    P("Pommes cuites à la cannelle au micro-ondes", "Desserts", 10, ["micro-ondes"], ["léger", "rapide", "dessert"],
      [("pomme", 1), ("beurre", 0.5), ("sucre", 0.3), ("cannelle", 1)],
      ["Retirer le trognon des pommes avec un vide-pomme ou un couteau, sans les éplucher.",
       "Les poser dans un bol, mettre dans chaque trou un morceau de beurre, le sucre et la cannelle.",
       "Couvrir et cuire 4 à 5 min au micro-ondes à pleine puissance : les pommes sont fondantes. Servir tiède."], "Française", meal=D)
    P("Mug cake aux fruits rouges", "Desserts", 5, ["micro-ondes"], ["rapide", "goûter", "dessert"],
      [("farine", 0.4), ("sucre", 0.5), ("oeufs", 0.5), ("lait", 0.25), ("beurre", 1), ("fruits-rouges", 0.4), ("levure", 0.5)],
      ["Dans deux grandes tasses, faire fondre le beurre 20 s au micro-ondes.",
       "Ajouter le sucre, les œufs, le lait, la farine et la levure, et bien mélanger. Ajouter les fruits rouges.",
       "Cuire 1 min 30 au micro-ondes à pleine puissance. Laisser tiédir 1 min avant de déguster."], "Américaine", meal=D)
    # ---------- Air fryer ----------
    P("Pilons de poulet au paprika au air fryer", "Poêlées", 30, ["air_fryer"], ["poulet", "familial", "enfants"],
      [("poulet", 2), ("paprika", 1), ("ail", 0.5), ("miel", 1), ("huile-olive", 0.5)],
      ["Mélanger l'huile d'olive, le paprika, le miel et l'ail écrasé. Saler, poivrer et y enrober le poulet (pilons ou cuisses).",
       "Les déposer dans le panier du air fryer sans les superposer.",
       "Cuire 22 à 25 min à 190 °C, en les retournant à mi-cuisson : la peau doit être croustillante et le jus clair."], "Américaine")
    P("Courgettes panées au parmesan au air fryer", "Poêlées", 25, ["air_fryer"], ["enfants", "rapide", "apéritif"],
      [("courgette", 1), ("oeufs", 0.25), ("chapelure", 1), ("parmesan", 1)],
      ["Couper les courgettes en bâtonnets.",
       "Les passer dans l'œuf battu, puis dans la chapelure mélangée au parmesan râpé.",
       "Cuire 12 à 14 min à 200 °C au air fryer, en secouant le panier à mi-cuisson. Servir avec une sauce au yaourt ou du ketchup."], "Italienne", meal=("Déjeuner", "Dîner", "Apéritif"))
    P("Camembert rôti au miel et aux noix au air fryer", "Sandwichs", 15, ["air_fryer"], ["apéritif", "fête", "hiver"],
      [("brie", 2), ("miel", 1), ("noix", 1), ("pain", 2)],
      ["Retirer le camembert de son emballage, le remettre dans sa boîte en bois sans le couvercle et entailler le dessus en croisillons.",
       "Arroser de miel et parsemer de noix concassées.",
       "Cuire 8 à 10 min à 180 °C au air fryer : le cœur doit être coulant. Servir avec le pain grillé à tremper."], "Française", meal=APERO)
    P("Saucisses et pommes de terre au air fryer", "Poêlées", 30, ["air_fryer"], ["familial", "enfants", "économique"],
      [("saucisses", 1), ("pomme-de-terre", 1), ("huile-olive", 0.5), ("herbes-provence", 1), ("moutarde", 1)],
      ["Couper les pommes de terre en quartiers, les mélanger avec l'huile d'olive et les herbes de Provence. Saler.",
       "Les cuire 10 min à 200 °C au air fryer.",
       "Ajouter les saucisses piquées à la fourchette et poursuivre 12 à 14 min en secouant le panier à mi-cuisson. Servir avec la moutarde."], "Française")
    P("Falafels croustillants au air fryer", "Sandwichs", 20, ["air_fryer"], ["rapide", "légumineuses"],
      [("falafels", 1), ("pita", 1), ("salade", 0.5), ("tomate", 0.5), ("yaourt", 0.5), ("menthe", 0.5)],
      ["Cuire les falafels 8 à 10 min à 190 °C au air fryer, en secouant à mi-cuisson.",
       "Mélanger le yaourt avec la menthe ciselée, saler.",
       "Garnir les pains pita de salade, de tomate en dés et des falafels chauds, et napper de sauce."], "Orientale")
    # ---------- Thermomix ----------
    P("Purée maison au Thermomix", "Poêlées", 35, ["thermomix"], ["enfants", "réconfort", "économique"],
      [("pomme-de-terre", 1.2), ("lait", 1.5), ("beurre", 2)],
      ["Éplucher les pommes de terre et les couper en morceaux.",
       "Les mettre dans le bol avec le lait et une pincée de sel, et cuire 25 min / 98 °C / vitesse 1.",
       "Ajouter le beurre, mixer 30 s / vitesse 3 avec le fouet, sans aller plus vite pour que la purée ne colle pas."], "Française")
    P("Pâtes bolognaise au Thermomix", "Pâtes", 40, ["thermomix", "plaques"], ["familial", "enfants", "pâtes"],
      [("boeuf-hache", 1), ("tomate-concassee", 1), ("oignon", 1), ("carotte", 0.4), ("ail", 0.5), ("huile-olive", 0.5), ("pates", 1), ("parmesan", 0.5)],
      ["Mettre l'oignon, la carotte et l'ail dans le bol et hacher 5 s / vitesse 5. Ajouter l'huile d'olive et rissoler 3 min / 120 °C / vitesse 1.",
       "Ajouter le bœuf haché et la tomate concassée, saler, poivrer, et cuire 20 min / 100 °C / sens inverse / vitesse 1, gobelet retiré et panier posé sur le couvercle.",
       "Pendant ce temps, cuire les pâtes dans une casserole d'eau bouillante salée. Servir la sauce sur les pâtes avec le parmesan râpé."], "Italienne")
    P("Soupe de carottes au cumin au Thermomix", "Soupes", 30, ["thermomix"], ["hiver", "léger", "économique"],
      [("carotte", 1.5), ("oignon", 1), ("cumin", 1), ("bouillon", 1.2), ("creme", 1), ("huile-olive", 0.5)],
      ["Mettre l'oignon dans le bol, hacher 5 s / vitesse 5, ajouter l'huile d'olive et rissoler 3 min / 120 °C / vitesse 1.",
       "Ajouter les carottes en morceaux, le cumin et le bouillon, et cuire 20 min / 100 °C / vitesse 1.",
       "Ajouter la crème et mixer 1 min en montant progressivement de la vitesse 5 à 10."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Compote de pommes au Thermomix", "Desserts", 25, ["thermomix"], ["goûter", "enfants", "économique", "léger"],
      [("pomme", 2), ("sucre", 0.3), ("cannelle", 1), ("citron", 0.25)],
      ["Éplucher les pommes, retirer le cœur et les couper en quartiers.",
       "Les mettre dans le bol avec le sucre, la cannelle, un filet de jus de citron et 5 cl d'eau, et cuire 15 min / 100 °C / vitesse 1.",
       "Mixer 10 s / vitesse 5 pour une compote lisse, ou laisser en morceaux. Servir tiède ou froide."], "Française", meal=D)
    # ---------- Cookeo ----------
    P("Poulet à la moutarde et pommes de terre au Cookeo", "Plats mijotés", 30, ["cookeo"], ["familial", "réconfort"],
      [("poulet", 1.2), ("pomme-de-terre", 0.8), ("moutarde", 2), ("creme", 1.5), ("oignon", 1), ("bouillon", 0.4)],
      ["Programme Dorer : faire revenir l'oignon émincé et le poulet en morceaux 5 min.",
       "Ajouter les pommes de terre en cubes, le bouillon et la moutarde. Saler, poivrer.",
       "Fermer et lancer la cuisson sous pression 10 min. Ouvrir, ajouter la crème et laisser épaissir 2 min en programme Dorer."], "Française")
    P("Lentilles aux saucisses au Cookeo", "Plats mijotés", 35, ["cookeo"], ["familial", "hiver", "économique"],
      [("lentilles", 1), ("saucisses", 1), ("carotte", 0.6), ("oignon", 1), ("lardons", 0.5), ("bouillon", 1.6)],
      ["Programme Dorer : faire dorer les saucisses, les lardons et l'oignon émincé 5 min.",
       "Ajouter les lentilles rincées, les carottes en rondelles et le bouillon. Poivrer (pas de sel : les lardons salent déjà).",
       "Fermer et lancer la cuisson sous pression 15 min. Laisser la pression retomber avant d'ouvrir."], "Française")
    P("Rougail saucisse au Cookeo", "Plats mijotés", 35, ["cookeo"], ["épicé", "familial"],
      [("saucisses", 1.2), ("tomate-concassee", 1), ("oignon", 1), ("ail", 1), ("gingembre", 1), ("curcuma", 1), ("riz", 1)],
      ["Cuire d'abord le riz : riz rincé et deux fois son volume d'eau salée, cuisson sous pression 8 min. Le réserver au chaud.",
       "Programme Dorer : faire dorer les saucisses en rondelles 5 min, puis ajouter l'oignon, l'ail et le gingembre hachés et le curcuma, 2 min.",
       "Ajouter la tomate concassée, saler, poivrer, fermer et lancer la cuisson sous pression 10 min. Servir avec le riz."], "Réunionnaise")
    P("Couscous express au Cookeo", "Plats mijotés", 40, ["cookeo"], ["familial", "épicé"],
      [("poulet", 1), ("merguez", 0.6), ("carotte", 0.7), ("courgette", 0.7), ("pois-chiches", 0.6), ("epices", 2), ("bouillon", 1.2), ("semoule", 1)],
      ["Programme Dorer : faire dorer le poulet en morceaux et les merguez 5 min avec les épices à couscous.",
       "Ajouter les carottes et les courgettes en gros morceaux, les pois chiches égouttés et le bouillon. Saler.",
       "Fermer et lancer la cuisson sous pression 12 min. Pendant ce temps, verser autant d'eau bouillante salée que de semoule, couvrir 5 min puis égrener à la fourchette.",
       "Servir la semoule avec la viande, les légumes et le bouillon."], "Marocaine")
    P("Tajine de poulet citron-olives au Cookeo", "Plats mijotés", 35, ["cookeo"], ["familial"],
      [("poulet", 1.2), ("citron", 1), ("olives", 1), ("oignon", 1), ("curcuma", 1), ("gingembre", 1), ("bouillon", 0.4), ("coriandre", 1)],
      ["Programme Dorer : faire dorer le poulet en morceaux et l'oignon émincé 5 min avec le curcuma et le gingembre râpé.",
       "Ajouter le bouillon, le citron en quartiers et les olives. Saler peu (les olives salent), poivrer.",
       "Fermer et lancer la cuisson sous pression 12 min. Servir parsemé de coriandre ciselée."], "Marocaine")
    # ---------- encore un peu pour chaque appareil ----------
    P("Croque-monsieur au air fryer", "Sandwichs", 12, ["air_fryer"], ["rapide", "enfants", "express"],
      [("pain-mie", 1), ("jambon", 1), ("emmental", 1), ("beurre", 0.5)],
      ["Beurrer les tranches de pain de mie sur une face.",
       "Monter les croques avec le jambon et l'emmental râpé, côté beurré à l'extérieur, et ajouter un peu d'emmental sur le dessus.",
       "Cuire 7 à 8 min à 180 °C au air fryer : le pain est doré et le fromage fondu. Servir avec une salade."], "Française", meal=("Déjeuner", "Dîner", "Goûter"))
    P("Gaspacho au Thermomix", "Soupes", 15, ["thermomix"], ["été", "froid", "léger", "sans cuisson"],
      [("tomate", 2.5), ("concombre", 0.5), ("poivron", 0.5), ("ail", 0.5), ("huile-olive", 1.5), ("vinaigre", 1), ("basilic", 0.5)],
      ["Couper les tomates, le concombre épluché et le poivron en morceaux.",
       "Les mettre dans le bol avec l'ail, l'huile d'olive, le vinaigre et une pincée de sel, et mixer 1 min en montant progressivement à la vitesse 10.",
       "Réserver au moins 1 h au frais et servir bien froid, parsemé de basilic ciselé."], "Espagnole", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Pâtes au pesto maison au Thermomix", "Pâtes", 20, ["thermomix", "plaques"], ["pâtes", "rapide", "été"],
      [("pates", 1), ("basilic", 2), ("parmesan", 1), ("pignons", 1), ("ail", 0.5), ("huile-olive", 2.5)],
      ["Cuire les pâtes dans une grande casserole d'eau bouillante salée, puis les égoutter en gardant un peu d'eau de cuisson.",
       "Pendant ce temps, mettre le parmesan en morceaux dans le bol et râper 10 s / vitesse 10. Ajouter le basilic, les pignons, l'ail et l'huile d'olive, et mixer 15 s / vitesse 6.",
       "Mélanger le pesto aux pâtes avec un peu d'eau de cuisson. Servir aussitôt."], "Italienne")
    P("Saumon grillé à la plancha, sauce yaourt-aneth", "Grillades", 20, ["barbecue"], ["barbecue", "poisson", "été", "rapide"],
      [("saumon", 1), ("yaourt", 0.5), ("aneth", 1), ("citron", 0.5), ("huile-olive", 0.5)],
      ["Mélanger le yaourt avec l'aneth ciselé et un filet de jus de citron. Saler, poivrer et garder au frais.",
       "Badigeonner le saumon d'huile d'olive et le griller 3 à 4 min côté peau sur la plancha ou la grille bien chaude, puis 1 à 2 min de l'autre côté.",
       "Servir le saumon avec la sauce au yaourt et des quartiers de citron."], "Scandinave")
    # ---------- classiques qui manquaient ----------
    P("Croziflette", "Gratins & four", 45, ["plaques", "four"], ["hiver", "réconfort", "familial"],
      [("pates", 1), ("reblochon", 1), ("lardons", 1), ("oignon", 1), ("creme", 1.5), ("vin-blanc", 0.5)],
      ["Cuire les pâtes (des crozets si possible) 10 à 12 min dans l'eau bouillante salée, puis les égoutter.",
       "Faire dorer les lardons et l'oignon émincé 5 min à la poêle, déglacer au vin blanc 1 min, puis ajouter la crème.",
       "Préchauffer le four à 200 °C. Mélanger les pâtes à la sauce dans un plat, couvrir de reblochon coupé en deux dans l'épaisseur, croûte vers le haut.",
       "Cuire 15 à 20 min : le reblochon doit être fondu et doré."], "Savoyarde")
    P("Petit salé aux lentilles", "Plats mijotés", 75, ["plaques"], ["hiver", "réconfort", "familial"],
      [("porc", 1.2), ("saucisses", 0.6), ("lentilles", 1), ("carotte", 0.6), ("oignon", 1), ("bouillon", 1.6)],
      ["Mettre le porc (petit salé ou poitrine demi-sel) dans une cocotte d'eau froide, porter à ébullition 5 min puis jeter l'eau pour le dessaler.",
       "Remettre le porc dans la cocotte avec le bouillon et l'oignon piqué, et laisser mijoter 30 min à couvert.",
       "Ajouter les lentilles rincées, les carottes en rondelles et les saucisses. Poursuivre 30 min à feu doux, jusqu'à ce que les lentilles soient tendres. Poivrer."], "Auvergnate")
    return R
