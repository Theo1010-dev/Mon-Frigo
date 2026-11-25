# -*- coding: utf-8 -*-
"""Recettes écrites à la main (18) : pour l'air fryer, le Thermomix et le micro-ondes, avec les vrais réglages
(température et temps pour l'air fryer ; temps / température / vitesse pour le Thermomix)."""
from gen_hand1 import H

D = ("Dessert", "Goûter")
APERO = ("Apéritif", "Entrée")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- air fryer ----------
    P("Frites maison au air fryer", "Gratins & four", 30, ["air_fryer"], ["économique", "enfants", "réconfort"],
      [("pomme-de-terre", 1.2), ("huile-olive", 0.5), ("paprika", 0.5), ("sel", 1)],
      ["Éplucher les pommes de terre, les couper en frites de 1 cm et les rincer à l'eau froide. Bien les sécher dans un torchon.",
       "Les mélanger avec l'huile d'olive, le paprika et le sel.",
       "Cuire au air fryer 20 min à 200 °C en secouant le panier toutes les 5 min, jusqu'à ce qu'elles soient bien dorées."], "Belge", meal=("Déjeuner", "Dîner"))
    P("Poulet croustillant au air fryer", "Gratins & four", 30, ["air_fryer"], ["enfants", "familial", "rapide"],
      [("poulet", 1.2), ("chapelure", 1.2), ("oeufs", 0.25), ("farine", 0.25), ("paprika", 1), ("salade", 0.7)],
      ["Couper le poulet en lanières. Préparer trois assiettes : la farine, l'œuf battu, la chapelure mélangée au paprika, au sel et au poivre.",
       "Passer chaque lanière dans la farine, puis l'œuf, puis la chapelure en appuyant bien.",
       "Disposer sans les superposer dans le panier et cuire 12 min à 200 °C en les retournant à mi-cuisson. Servir avec la salade."], "Américaine")
    P("Légumes rôtis au air fryer", "Gratins & four", 25, ["air_fryer"], ["végétarien", "léger", "été"],
      [("courgette", 1), ("poivron", 1), ("oignon-rouge", 1), ("huile-olive", 1), ("herbes-provence", 1), ("feta", 0.5)],
      ["Couper la courgette, le poivron et l'oignon rouge en morceaux de taille égale.",
       "Les mélanger avec l'huile d'olive, les herbes de Provence, du sel et du poivre.",
       "Cuire au air fryer 15 min à 190 °C en secouant le panier à mi-cuisson. Servir parsemé de feta émiettée."], "Méditerranéenne")
    P("Saumon miel-soja au air fryer", "Poisson", 25, ["air_fryer", "plaques"], ["rapide", "asiatique"],
      [("saumon", 1.2), ("miel", 1), ("sauce-soja", 1), ("ail", 0.5), ("riz", 1), ("sesame", 0.5)],
      ["Cuire le riz 12 min à l'eau bouillante salée.",
       "Mélanger le miel, la sauce soja et l'ail haché, et en badigeonner les pavés de saumon.",
       "Cuire au air fryer 8 à 10 min à 200 °C, côté peau en dessous. Parsemer de sésame et servir avec le riz."], "Asiatique")
    P("Patates douces rôties au air fryer, sauce yaourt", "Gratins & four", 30, ["air_fryer"], ["végétarien", "automne"],
      [("patate-douce", 1.2), ("huile-olive", 1), ("paprika", 1), ("yaourt", 0.5), ("ciboulette", 1), ("citron", 0.5)],
      ["Couper les patates douces en cubes de 2 cm et les mélanger avec l'huile d'olive, le paprika et du sel.",
       "Cuire au air fryer 18 min à 200 °C en secouant le panier deux fois.",
       "Mélanger le yaourt avec la ciboulette ciselée, le jus du citron, du sel et du poivre, et servir avec les patates douces."], "Française")
    P("Pois chiches croustillants au air fryer", "Salades", 20, ["air_fryer"], ["apéritif", "végétarien", "économique"],
      [("pois-chiches", 1), ("huile-olive", 0.5), ("paprika", 1), ("cumin", 0.5)],
      ["Égoutter, rincer et bien sécher les pois chiches dans un torchon.",
       "Les mélanger avec l'huile d'olive, le paprika, le cumin et du sel.",
       "Cuire au air fryer 14 min à 200 °C en secouant le panier toutes les 4 min : ils doivent être croquants."], "Orientale", meal=APERO)
    P("Pommes rôties au air fryer, miel et cannelle", "Desserts", 20, ["air_fryer"], ["automne", "goûter", "rapide"],
      [("pomme", 1), ("miel", 2), ("cannelle", 0.5), ("beurre", 1), ("yaourt", 0.5)],
      ["Couper les pommes en deux et retirer le cœur.",
       "Les poser dans le panier, côté coupé vers le haut, avec une noisette de beurre, le miel et la cannelle.",
       "Cuire au air fryer 12 min à 180 °C. Servir tiède avec une cuillère de yaourt."], "Française", meal=D)
    # ---------- Thermomix ----------
    P("Risotto aux champignons au Thermomix", "Riz", 30, ["thermomix"], ["réconfort", "familial"],
      [("riz-risotto", 1), ("champignons", 1), ("parmesan", 1.2), ("oignon", 1), ("vin-blanc", 1), ("bouillon", 1.4), ("beurre", 1.5)],
      ["Râper le parmesan 10 s / vitesse 10 et le réserver.",
       "Mettre l'oignon dans le bol, 5 s / vitesse 5. Ajouter la moitié du beurre et rissoler 3 min / 120 °C / vitesse 1.",
       "Ajouter le riz à risotto et les champignons émincés, 2 min / 120 °C / sens inverse / vitesse 1. Verser le vin blanc, 1 min / 120 °C / sens inverse / vitesse 1.",
       "Ajouter le bouillon et cuire 15 min / 100 °C / sens inverse / vitesse 1, gobelet retiré et panier posé sur le couvercle.",
       "Verser dans un plat, ajouter le parmesan et le reste du beurre, mélanger et laisser reposer 2 min."], "Italienne")
    P("Velouté de potimarron au Thermomix", "Soupes", 35, ["thermomix"], ["végétarien", "automne", "hiver"],
      [("potimarron", 1), ("oignon", 1), ("bouillon", 1), ("creme", 1), ("huile-olive", 0.5)],
      ["Mettre l'oignon dans le bol, 5 s / vitesse 5, ajouter l'huile d'olive et rissoler 3 min / 120 °C / vitesse 1.",
       "Ajouter le potimarron lavé et coupé en morceaux (la peau se mange) et le bouillon. Cuire 25 min / 100 °C / vitesse 1.",
       "Ajouter la crème et réduire en velouté 1 min en augmentant progressivement de vitesse 5 à 10. Saler, poivrer."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Pâte à crêpes au Thermomix", "Desserts", 30, ["thermomix", "plaques"], ["goûter", "enfants", "économique"],
      [("farine", 2), ("oeufs", 0.75), ("lait", 2.5), ("beurre", 1.5), ("sucre", 0.5)],
      ["Mettre la farine, les œufs, le lait, le beurre fondu, le sucre et une pincée de sel dans le bol.",
       "Mélanger 20 s / vitesse 5, racler les parois et mélanger encore 5 s / vitesse 5 : la pâte est lisse, sans grumeaux.",
       "Laisser reposer 30 min si possible, puis cuire les crêpes dans une poêle chaude légèrement graissée, 1 min de chaque côté."], "Bretonne", meal=D, serv=4)
    P("Crème dessert au chocolat au Thermomix", "Desserts", 15, ["thermomix"], ["enfants", "goûter", "rapide"],
      [("lait", 2.5), ("chocolat", 1), ("sucre", 0.75), ("maizena", 1), ("oeufs", 0.25)],
      ["Mettre le chocolat en morceaux dans le bol, 10 s / vitesse 8.",
       "Ajouter le lait, le sucre, la maïzena et l'œuf, et cuire 8 min / 90 °C / vitesse 4.",
       "Verser dans des ramequins et laisser refroidir, puis 2 heures au frigo avant de servir."], "Française", meal=D, serv=4)
    P("Curry de lentilles corail au Thermomix", "Curry", 30, ["thermomix", "plaques"], ["végétarien", "économique", "épicé"],
      [("lentilles-corail", 1), ("lait-coco", 1), ("tomate-concassee", 0.5), ("oignon", 1), ("gingembre", 1), ("curry", 1), ("riz", 1)],
      ["Mettre l'oignon et le gingembre dans le bol, 5 s / vitesse 5, puis rissoler 3 min / 120 °C / vitesse 1 avec le curry.",
       "Ajouter les lentilles corail rincées, la tomate concassée, le lait de coco et 20 cl d'eau. Saler.",
       "Cuire 18 min / 100 °C / sens inverse / vitesse 1. Pendant ce temps, cuire le riz 12 min à l'eau bouillante salée, et servir ensemble."], "Indienne")
    # ---------- micro-ondes ----------
    P("Pommes de terre au micro-ondes, beurre et ciboulette", "Gratins & four", 15, ["micro-ondes"], ["rapide", "économique", "végétarien"],
      [("pomme-de-terre", 0.8), ("beurre", 1.5), ("ciboulette", 1), ("fromage-frais", 0.5)],
      ["Laver les pommes de terre et les piquer plusieurs fois à la fourchette.",
       "Les cuire au micro-ondes 8 à 10 min à pleine puissance dans un plat couvert, en les retournant à mi-cuisson : la pointe d'un couteau doit entrer sans résistance.",
       "Les fendre, ajouter le beurre, le fromage frais et la ciboulette ciselée. Saler, poivrer."], "Française")
    P("Porridge express au micro-ondes", "Petit-déjeuner", 5, ["micro-ondes"], ["rapide", "économique", "végétarien"],
      [("flocons-avoine", 0.6), ("lait", 1.5), ("banane", 0.5), ("miel", 1), ("cannelle", 0.5)],
      ["Dans un grand bol, mélanger les flocons d'avoine et le lait.",
       "Chauffer au micro-ondes 2 min en remuant à mi-cuisson (le bol doit être assez grand : ça gonfle).",
       "Laisser reposer 1 min, puis ajouter la banane en rondelles, le miel et la cannelle."], "Anglaise", meal=("Petit-déjeuner", "Goûter"))
    P("Œufs brouillés express au micro-ondes", "Œufs", 5, ["micro-ondes"], ["rapide", "économique"],
      [("oeufs", 0.75), ("lait", 0.25), ("ciboulette", 0.5), ("pain", 1)],
      ["Battre les œufs avec le lait, du sel et du poivre dans un bol.",
       "Chauffer au micro-ondes 45 s, mélanger, puis encore 30 à 45 s : ils doivent rester moelleux.",
       "Parsemer de ciboulette et servir avec le pain grillé."], "Française", meal=("Petit-déjeuner", "Déjeuner", "Dîner"))
    return R
