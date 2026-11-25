# -*- coding: utf-8 -*-
"""Recettes écrites à la main (13) : apéritif, entrées, petit-déjeuner et pains."""
from gen_hand1 import H

AP = ("Apéritif",)
E = ("Entrée",)
B = ("Petit-déjeuner",)


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- APÉRITIF ----------
    P("Œufs farcis au thon", "Œufs", 20, ["plaques"], ["apéritif", "économique", "pique-nique"],
      ["oeufs", ("thon", 0.7), ("mayonnaise", 2), ("ciboulette", 0.5), ("paprika", 0.5)],
      ["Cuire les œufs 10 min dans l'eau bouillante, les refroidir dans l'eau froide puis les écaler.",
       "Les couper en deux dans la longueur et retirer les jaunes.",
       "Écraser les jaunes avec le thon égoutté, la mayonnaise et la ciboulette ciselée. Saler, poivrer.",
       "Garnir les blancs de cette farce et saupoudrer d'une pincée de paprika. Garder au frais."], "Française", meal=("Apéritif", "Entrée"), serv=4)
    P("Tomates cerises farcies au fromage frais", "Salades", 20, [], ["apéritif", "végétarien", "sans cuisson", "fête"],
      [("tomate-cerise", 1.5), ("fromage-frais", 1.5), ("ciboulette", 0.5), ("basilic", 0.3)],
      ["Couper un chapeau sur chaque tomate cerise et les vider délicatement avec une petite cuillère. Les retourner sur du papier absorbant.",
       "Mélanger le fromage frais avec la ciboulette ciselée, saler et poivrer.",
       "Remplir les tomates de fromage à l'aide d'une petite cuillère ou d'une poche, puis poser une feuille de basilic sur chacune."], "Française", meal=AP, serv=4)
    P("Brochettes poulet-chorizo", "Poêlées", 25, ["plaques"], ["apéritif", "fête", "été"],
      [("poulet", 1.2), "chorizo", ("poivron", 0.7), "paprika", ("huile-olive", 1)],
      ["Couper le poulet et le poivron en cubes de 2 cm, le chorizo en rondelles épaisses.",
       "Mélanger le poulet avec l'huile d'olive et le paprika, saler légèrement.",
       "Enfiler sur des piques en alternant poulet, chorizo et poivron.",
       "Cuire 10 à 12 min dans une poêle chaude ou au barbecue en retournant souvent : le poulet doit être bien cuit."], "Espagnole", meal=AP, serv=4)
    P("Falafels maison au four", "Gratins & four", 40, ["four", "mixeur"], ["apéritif", "végétarien", "légumineuses", "économique"],
      ["pois-chiches", ("oignon", 0.5), ("ail", 1), ("persil", 1), ("coriandre", 1), "cumin", ("farine", 0.3), ("huile-olive", 2)],
      ["Préchauffer le four à 200 °C. Égoutter et bien sécher les pois chiches.",
       "Les mixer grossièrement avec l'oignon, l'ail, le persil, la coriandre, le cumin, la farine, sel et poivre : la pâte doit se tenir.",
       "Former des petites boulettes un peu aplaties, les poser sur une plaque huilée et les badigeonner d'huile d'olive.",
       "Cuire 25 min en les retournant à mi-cuisson. Servir avec une sauce au yaourt ou dans une pita."], "Orientale", meal=("Apéritif", "Déjeuner", "Dîner"), serv=4)
    P("Rillettes de poulet", "Salades", 30, ["plaques"], ["apéritif", "anti-gaspi"],
      ["poulet", ("fromage-frais", 1.2), "moutarde", ("ciboulette", 0.5), "bouillon", ("pain", 1.5)],
      ["Pocher le poulet 15 min dans le bouillon frémissant, puis le laisser refroidir dans le liquide.",
       "L'effilocher finement à la fourchette.",
       "Mélanger avec le fromage frais, la moutarde et la ciboulette ciselée. Saler, poivrer et ajouter un peu de bouillon si c'est trop sec.",
       "Garder 1 h au frais et servir sur du pain grillé. Délicieux aussi avec un reste de poulet rôti."], "Française", meal=AP, serv=4)
    P("Cake au thon et aux olives", "Gratins & four", 55, ["four"], ["apéritif", "pique-nique", "familial"],
      [("farine", 1.5), ("oeufs", 0.75), ("lait", 0.6), ("huile-olive", 2), "levure", ("thon", 1.4), "olives", ("fromage-rape", 1)],
      ["Préchauffer le four à 180 °C. Fouetter les œufs avec le lait et l'huile d'olive.",
       "Ajouter la farine mélangée à la levure, puis le thon émietté, les olives coupées en rondelles et le fromage râpé. Poivrer.",
       "Verser dans un moule à cake huilé et cuire 45 min. Servir tiède ou froid, en tranches ou en dés."], "Française", meal=("Apéritif", "Déjeuner"), serv=6)
    P("Chips de pita aux épices", "Gratins & four", 15, ["four"], ["apéritif", "végétarien", "anti-gaspi", "express"],
      [("pita", 1.5), ("huile-olive", 1.5), "paprika", "cumin"],
      ["Préchauffer le four à 200 °C. Couper les pains pita en triangles et ouvrir chaque triangle en deux.",
       "Les mélanger avec l'huile d'olive, le paprika, le cumin et une pincée de sel.",
       "Les étaler sur une plaque et cuire 6 à 8 min : ils doivent être dorés et croustillants. Parfait avec un houmous ou un tzatziki."], "Orientale", meal=AP, serv=4)
    P("Cheese naan maison", "Sandwichs", 30, ["plaques"], ["apéritif", "végétarien", "réconfort"],
      [("farine", 2), ("yaourt", 0.5), "levure", ("fromage-frais", 1.2), ("beurre", 1), ("ail", 0.5)],
      ["Mélanger la farine, la levure, une pincée de sel, le yaourt et 6 cl d'eau tiède : pétrir 2 min pour obtenir une pâte souple. Laisser reposer 10 min.",
       "Diviser en 4 boules, les aplatir, déposer une cuillère de fromage frais au centre, refermer et étaler à nouveau délicatement.",
       "Cuire 2 à 3 min de chaque côté dans une poêle sèche bien chaude, jusqu'à ce que le pain gonfle et dore.",
       "Badigeonner de beurre fondu à l'ail et servir chaud, avec un curry ou à l'apéro."], "Indienne", meal=("Apéritif", "Déjeuner", "Dîner"), serv=4)
    # ---------- ENTRÉES ----------
    P("Taboulé de quinoa", "Salades", 25, ["plaques"], ["végétarien", "été", "léger", "pique-nique"],
      ["quinoa", ("concombre", 0.5), "tomate", ("menthe", 1), ("persil", 1), ("citron", 1), ("huile-olive", 1.5)],
      ["Rincer le quinoa puis le cuire 12 min dans deux fois son volume d'eau salée. Le laisser refroidir.",
       "Couper le concombre et la tomate en petits dés, ciseler la menthe et le persil.",
       "Mélanger le tout avec le jus du citron et l'huile d'olive. Saler, poivrer et garder au frais."], "Libanaise", meal=("Entrée", "Déjeuner"))
    P("Asperges vertes, sauce hollandaise", "Œufs", 25, ["plaques"], ["printemps", "fête", "végétarien"],
      [("asperges", 1.5), ("oeufs", 0.5), ("beurre", 5), ("citron", 0.5)],
      ["Couper la base dure des asperges et les cuire 6 à 8 min à l'eau bouillante salée : elles doivent rester un peu croquantes.",
       "Sauce : fouetter les 2 jaunes d'œufs avec 2 cuillères d'eau dans une casserole au bain-marie, jusqu'à ce que le mélange mousse et épaississe.",
       "Hors du feu, verser le beurre fondu petit à petit en fouettant sans arrêt, puis ajouter le jus du demi-citron, sel et poivre.",
       "Servir les asperges égouttées nappées de sauce tiède."], "Française", meal=E, diff="Intermédiaire")
    P("Salade de betterave à l'orange", "Salades", 15, [], ["végétarien", "hiver", "sans cuisson", "léger"],
      ["betterave", "orange", ("oignon-rouge", 0.3), ("huile-olive", 1), "vinaigre", ("noix", 0.5)],
      ["Couper la betterave cuite en dés ou en fines tranches.", "Peler l'orange à vif et la couper en rondelles en récupérant le jus.",
       "Mélanger le jus d'orange, le vinaigre et l'huile d'olive, saler et poivrer.",
       "Disposer betterave et orange, parsemer d'oignon rouge émincé et de noix, arroser de sauce."], "Française", meal=E)
    P("Champignons à la grecque", "Salades", 30, ["plaques"], ["végétarien", "léger", "bistrot"],
      [("champignons", 1.6), ("tomate-concassee", 0.4), ("oignon", 0.5), "vin-blanc", ("citron", 0.5), ("huile-olive", 1.5), "coriandre"],
      ["Nettoyer les champignons et les couper en deux s'ils sont gros.",
       "Faire revenir l'oignon émincé 3 min dans l'huile d'olive, puis ajouter les champignons, la tomate concassée, le vin blanc et le jus de citron.",
       "Saler, poivrer et laisser mijoter 15 min à couvert.", "Laisser refroidir et servir frais, parsemé de coriandre ciselée."], "Grecque", meal=E, serv=4)
    P("Salade de chou-fleur rôti au cumin", "Salades", 35, ["four"], ["végétarien", "hiver"],
      ["chou-fleur", ("huile-olive", 2), "cumin", ("pois-chiches", 0.5), ("persil", 1), ("citron", 0.5), ("yaourt", 0.5)],
      ["Préchauffer le four à 210 °C. Détailler le chou-fleur en petits bouquets et les mélanger avec l'huile d'olive, le cumin et du sel.",
       "Ajouter les pois chiches égouttés et rôtir 25 min en remuant à mi-cuisson.",
       "Mélanger le yaourt avec le jus de citron, saler.", "Servir tiède, arrosé de sauce au yaourt et parsemé de persil."], "Orientale", meal=("Entrée", "Déjeuner"))
    P("Saumon gravlax à l'aneth", "Poisson", 20, [], ["fête", "sans cuisson"],
      [("saumon", 1.2), ("sucre", 0.7), ("aneth", 2), ("citron", 0.5), ("pain", 1)],
      ["Retirer les arêtes du saumon frais (très frais, idéalement congelé 48 h avant).",
       "Mélanger 2 cuillères de gros sel avec le sucre et le zeste du citron. Couvrir le saumon de ce mélange et de la moitié de l'aneth.",
       "Filmer et laisser 24 h au frigo, en retournant une fois.", "Rincer, sécher et trancher finement. Servir avec le reste de l'aneth et du pain grillé."], "Scandinave", meal=E, serv=4)
    # ---------- PETIT-DÉJEUNER ----------
    P("Wrap petit-déjeuner œufs-fromage", "Petit-déjeuner", 15, ["plaques"], ["express", "brunch"],
      [("wrap", 0.5), "oeufs", ("cheddar", 0.6), ("tomate", 0.3), ("beurre", 0.5)],
      ["Battre les œufs avec sel et poivre, puis les cuire en œufs brouillés dans le beurre, à feu doux, en remuant.",
       "Chauffer les wraps 30 s dans la poêle.", "Garnir chaque wrap d'œufs brouillés, de cheddar râpé et de dés de tomate, puis le rouler serré."], "Américaine", meal=B)
    P("Porridge chocolat-banane", "Petit-déjeuner", 10, ["plaques"], ["express", "goûter"],
      [("flocons-avoine", 1), ("lait", 1.5), "banane", ("cacao", 0.5), ("miel", 1)],
      ["Chauffer le lait avec les flocons d'avoine et le cacao, en remuant, 4 à 5 min jusqu'à ce que ce soit crémeux.",
       "Ajouter le miel et la moitié de la banane écrasée.", "Servir avec le reste de la banane en rondelles."], "Française", meal=("Petit-déjeuner", "Goûter"))
    return R
