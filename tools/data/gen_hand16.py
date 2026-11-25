# -*- coding: utf-8 -*-
"""Recettes écrites à la main (16) : quelques classiques du quotidien qui manquaient."""
from gen_hand1 import H

D = ("Dessert", "Goûter")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    P("French tacos maison", "Sandwichs", 35, ["four", "plaques"], ["familial", "réconfort", "enfants"],
      [("wrap", 0.5), ("boeuf-hache", 1), ("frites", 0.6), ("emmental", 1), ("creme", 1.5), ("oignon", 0.5), "paprika"],
      ["Cuire les frites surgelées au four selon le paquet.",
       "Faire revenir l'oignon haché 3 min, ajouter le bœuf haché et le paprika, cuire 5 min en émiettant. Saler, poivrer.",
       "Sauce fromagère : chauffer la crème avec l'emmental râpé en remuant jusqu'à ce qu'il fonde.",
       "Garnir chaque wrap de viande, de frites et de sauce, plier en rectangle et dorer 2 min de chaque côté dans une poêle sèche."], "Française")
    P("Pommes de terre en robe des champs, crème à la ciboulette", "Gratins & four", 60, ["four"], ["végétarien", "économique", "réconfort"],
      [("pomme-de-terre", 1.2), ("creme", 1.5), ("ciboulette", 1), ("fromage-rape", 0.7), ("salade", 0.5)],
      ["Préchauffer le four à 200 °C. Laver les pommes de terre, les piquer à la fourchette et les cuire 50 min au four, sur la grille.",
       "Mélanger la crème avec la ciboulette ciselée, sel et poivre.",
       "Fendre les pommes de terre en croix, les ouvrir, parsemer de fromage râpé et garnir de crème à la ciboulette. Servir avec la salade."], "Française")
    P("Salade de chou à l'asiatique", "Salades", 15, [], ["végétarien", "asiatique", "sans cuisson", "économique"],
      [("chou", 1), "carotte", ("sauce-soja", 1), ("citron-vert", 1), ("sesame", 1), ("cacahuetes", 1), ("coriandre", 0.5), ("miel", 0.5)],
      ["Émincer très finement le chou et râper la carotte.", "Mélanger la sauce soja, le jus du citron vert et le miel.",
       "Verser sur les légumes, mélanger et laisser 10 min. Parsemer de sésame, de cacahuètes concassées et de coriandre."], "Asiatique", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Poulet aux pommes et à la crème", "Poêlées", 35, ["plaques"], ["automne", "réconfort", "familial"],
      ["poulet", "pomme", ("creme", 2), "champignons", ("oignon", 0.5), ("beurre", 1), "riz"],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.", "Dorer le poulet en morceaux 6 min dans le beurre, puis le réserver.",
       "Faire revenir l'oignon, les champignons émincés et les pommes en quartiers 6 min.",
       "Remettre le poulet, verser la crème, saler, poivrer et laisser mijoter 8 min. Servir avec le riz."], "Normande")
    P("Pêche Melba", "Desserts", 20, ["plaques"], ["dessert", "été", "classique"],
      ["peches", ("glace", 1), ("fruits-rouges", 1), ("sucre", 0.5), ("amandes", 0.5)],
      ["Pocher les pêches entières 5 min dans de l'eau frémissante avec la moitié du sucre, puis les peler et les couper en deux.",
       "Écraser les fruits rouges avec le reste du sucre pour faire un coulis.",
       "Dans des coupes, poser une boule de glace à la vanille, les demi-pêches, napper de coulis et parsemer d'amandes effilées."], "Française", meal=D)
    return R
