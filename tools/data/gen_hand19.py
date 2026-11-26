# -*- coding: utf-8 -*-
"""Recettes écrites à la main (19) : au Cookeo (programmes « Dorer » et « Cuisson sous pression », tout se fait dans la cuve),
puis quelques classiques qui manquaient."""
from gen_hand1 import H

D = ("Dessert", "Goûter")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- Cookeo ----------
    P("Bœuf bourguignon au Cookeo", "Plats mijotés", 60, ["cookeo"], ["réconfort", "hiver", "familial"],
      [("boeuf", 1.2), ("lardons", 0.8), ("carotte", 0.8), ("champignons", 0.8), ("oignon", 1), ("vin-rouge", 1.7), ("bouillon", 0.6), ("farine", 0.25)],
      ["Programme Dorer : faire revenir les lardons et l'oignon émincé 3 min, puis le bœuf en cubes 5 min en remuant.",
       "Saupoudrer de farine, mélanger, puis verser le vin rouge et le bouillon. Ajouter les carottes en rondelles et les champignons. Saler, poivrer.",
       "Fermer et lancer la cuisson sous pression 35 min.",
       "Laisser la pression retomber, ouvrir et laisser épaissir 3 min en programme Dorer si la sauce est trop liquide."], "Bourguignonne")
    P("Poulet au curry et lait de coco au Cookeo", "Curry", 30, ["cookeo"], ["familial", "rapide"],
      [("poulet", 1.2), ("lait-coco", 1), ("curry", 1), ("oignon", 1), ("tomate-concassee", 0.5), ("riz", 1)],
      ["Cuire d'abord le riz : riz rincé et deux fois son volume d'eau salée dans la cuve, cuisson sous pression 8 min. Le réserver au chaud.",
       "Programme Dorer : faire revenir l'oignon émincé et le poulet en morceaux 4 min avec le curry.",
       "Ajouter le lait de coco et la tomate concassée, saler, fermer et lancer la cuisson sous pression 8 min.",
       "Servir le curry avec le riz."], "Indienne")
    P("Chili con carne au Cookeo", "Plats mijotés", 35, ["cookeo"], ["familial", "épicé", "économique"],
      [("boeuf-hache", 1.2), ("haricots-rouges", 1.2), ("tomate-concassee", 1), ("oignon", 1), ("poivron", 0.7), ("cumin", 1), ("paprika", 1), ("riz", 1)],
      ["Cuire le riz : riz rincé et deux fois son volume d'eau salée, cuisson sous pression 8 min, puis le réserver.",
       "Programme Dorer : faire revenir l'oignon et le poivron en dés 3 min, ajouter le bœuf haché, le cumin et le paprika et cuire 4 min en émiettant.",
       "Ajouter la tomate concassée et les haricots rouges égouttés, saler, poivrer, fermer et lancer la cuisson sous pression 10 min.",
       "Servir avec le riz."], "Tex-Mex")
    P("Risotto aux champignons au Cookeo", "Riz", 25, ["cookeo"], ["réconfort", "végétarien", "rapide"],
      [("riz-risotto", 1), ("champignons", 1), ("oignon", 1), ("bouillon", 1.4), ("vin-blanc", 1), ("parmesan", 1), ("beurre", 1.5)],
      ["Programme Dorer : faire fondre la moitié du beurre et revenir l'oignon haché 2 min, ajouter le riz à risotto et les champignons émincés et remuer 2 min.",
       "Verser le vin blanc, laisser s'évaporer 1 min, puis ajouter le bouillon chaud.",
       "Fermer et lancer la cuisson sous pression 6 min.",
       "Ouvrir, ajouter le parmesan râpé et le reste du beurre, mélanger et laisser reposer 2 min avant de servir."], "Italienne")
    P("Dahl de lentilles corail au Cookeo", "Curry", 25, ["cookeo"], ["végétarien", "économique", "rapide"],
      [("lentilles-corail", 1), ("lait-coco", 1), ("tomate-concassee", 0.5), ("oignon", 1), ("ail", 0.5), ("gingembre", 1), ("curry", 1), ("coriandre", 1)],
      ["Programme Dorer : faire revenir l'oignon haché, l'ail et le gingembre râpés avec le curry 3 min.",
       "Ajouter les lentilles corail rincées, la tomate concassée, le lait de coco et 30 cl d'eau. Saler.",
       "Fermer et lancer la cuisson sous pression 6 min.",
       "Mélanger : le dahl doit être crémeux. Servir parsemé de coriandre."], "Indienne")
    P("Blanquette de veau au Cookeo", "Plats mijotés", 50, ["cookeo"], ["familial", "réconfort", "week-end"],
      [("veau", 1.2), ("carotte", 0.8), ("champignons", 0.8), ("oignon", 1), ("bouillon", 1), ("creme", 2), ("maizena", 1), ("citron", 0.5), ("riz", 1)],
      ["Cuire le riz : riz rincé et deux fois son volume d'eau salée, cuisson sous pression 8 min, puis le réserver.",
       "Programme Dorer : faire revenir le veau en morceaux et l'oignon émincé 4 min sans trop colorer.",
       "Ajouter les carottes en rondelles, les champignons et le bouillon. Fermer et lancer la cuisson sous pression 25 min.",
       "Ouvrir, ajouter la crème mélangée à la maïzena et le jus du citron, et laisser épaissir 3 min en programme Dorer. Servir avec le riz."], "Française")
    P("Poulet basquaise au Cookeo", "Plats mijotés", 35, ["cookeo"], ["familial", "été"],
      [("poulet", 1.2), ("poivron", 1.5), ("tomate-concassee", 1), ("oignon", 1), ("ail", 0.5), ("chorizo", 0.5), ("paprika", 1)],
      ["Programme Dorer : faire dorer le poulet en morceaux 5 min, puis ajouter l'oignon, l'ail et les poivrons émincés et le chorizo en rondelles, 3 min.",
       "Ajouter la tomate concassée et le paprika, saler et poivrer.",
       "Fermer et lancer la cuisson sous pression 12 min.",
       "Servir tel quel ou avec du riz."], "Basque")
    P("Pâtes crémeuses jambon-champignons au Cookeo", "Pâtes", 20, ["cookeo"], ["rapide", "enfants", "économique"],
      [("pates", 1), ("jambon", 1), ("champignons", 0.8), ("creme", 1.5), ("bouillon", 1), ("emmental", 0.8), ("oignon", 0.5)],
      ["Programme Dorer : faire revenir l'oignon haché et les champignons émincés 3 min.",
       "Ajouter les pâtes, le bouillon et juste assez d'eau pour les couvrir. Fermer et lancer la cuisson sous pression 4 min (la moitié du temps indiqué sur le paquet).",
       "Ouvrir, ajouter la crème, le jambon en lanières et l'emmental râpé, et mélanger 1 min en programme Dorer. Poivrer et servir."], "Française")
    P("Soupe de légumes au Cookeo", "Soupes", 25, ["cookeo"], ["végétarien", "hiver", "économique"],
      [("poireau", 0.8), ("carotte", 0.8), ("pomme-de-terre", 0.6), ("courgette", 0.6), ("bouillon", 1.4), ("creme", 1)],
      ["Programme Dorer : faire revenir le poireau émincé 3 min.",
       "Ajouter les carottes, les pommes de terre et la courgette en morceaux, puis le bouillon. Saler, poivrer.",
       "Fermer et lancer la cuisson sous pression 10 min.",
       "Écraser au presse-purée pour une soupe paysanne, ajouter la crème et servir bien chaud."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Riz au lait au Cookeo", "Desserts", 30, ["cookeo"], ["réconfort", "enfants", "économique"],
      [("riz", 0.6), ("lait", 5), ("sucre", 1.5), ("vanille", 1)],
      ["Mettre le riz rond, le lait, le sucre et la vanille dans la cuve et mélanger.",
       "Fermer et lancer la cuisson sous pression 10 min.",
       "Laisser la pression retomber seule pendant 10 min, ouvrir et mélanger : le riz est fondant.",
       "Servir tiède ou bien frais."], "Française", meal=D, serv=4)
    # ---------- classiques qui manquaient ----------
    P("Soupe à l'oignon gratinée", "Soupes", 50, ["plaques", "four"], ["hiver", "réconfort", "économique"],
      [("oignon", 3), ("beurre", 2), ("farine", 0.25), ("bouillon", 1.4), ("pain", 1), ("emmental", 1.5)],
      ["Émincer finement les oignons et les faire fondre 20 min dans le beurre à feu doux, jusqu'à ce qu'ils soient bien dorés.",
       "Saupoudrer de farine, mélanger, puis verser le bouillon. Saler, poivrer et laisser mijoter 15 min.",
       "Verser la soupe dans des bols allant au four, poser dessus des tranches de pain grillé et couvrir d'emmental râpé.",
       "Faire gratiner 5 min sous le grill du four, jusqu'à ce que le fromage soit doré."], "Française", meal=("Entrée", "Dîner"))
    P("Shakshuka, œufs pochés à la tomate épicée", "Œufs", 30, ["plaques"], ["végétarien", "économique", "épicé"],
      [("oeufs", 1), ("tomate-concassee", 1), ("poivron", 0.7), ("oignon", 0.5), ("ail", 0.5), ("cumin", 1), ("paprika", 1), ("coriandre", 1), ("pain", 1)],
      ["Faire revenir l'oignon et le poivron émincés 6 min dans un peu d'huile, ajouter l'ail haché, le cumin et le paprika 1 min.",
       "Verser la tomate concassée, saler, poivrer et laisser mijoter 10 min.",
       "Creuser des petits puits dans la sauce, y casser les œufs, couvrir et cuire 6 à 8 min : le blanc doit être pris et le jaune coulant.",
       "Parsemer de coriandre et servir dans la poêle avec du pain."], "Orientale", meal=("Petit-déjeuner", "Déjeuner", "Dîner"))
    P("Œufs cocotte à la crème et au jambon", "Œufs", 20, ["four"], ["rapide", "économique"],
      [("oeufs", 1), ("creme", 1), ("jambon", 0.5), ("ciboulette", 1), ("pain", 1)],
      ["Préchauffer le four à 180 °C. Répartir le jambon en petits morceaux et la moitié de la crème dans des ramequins.",
       "Casser un œuf dans chaque ramequin, ajouter le reste de crème, saler, poivrer.",
       "Cuire 10 à 12 min au bain-marie dans le four (ramequins posés dans un plat d'eau chaude) : le blanc est pris, le jaune reste coulant.",
       "Parsemer de ciboulette et servir avec des mouillettes de pain."], "Française", meal=("Entrée", "Déjeuner", "Dîner"))
    P("Endives braisées au miel", "Poêlées", 30, ["plaques"], ["végétarien", "hiver", "économique"],
      [("endives", 1.5), ("beurre", 1.5), ("miel", 1), ("citron", 0.5)],
      ["Couper les endives en deux dans la longueur et retirer le petit cône amer à la base.",
       "Les faire dorer 5 min côté coupé dans le beurre.",
       "Ajouter le miel, le jus du citron et un fond d'eau, couvrir et laisser braiser 15 min à feu doux en les retournant à mi-cuisson. Saler, poivrer."], "Belge", meal=("Déjeuner", "Dîner"))
    P("Poires Belle-Hélène", "Desserts", 35, ["plaques"], ["fête", "hiver"],
      [("poire", 1), ("sucre", 1.5), ("vanille", 1), ("chocolat", 1), ("creme", 1), ("glace", 1)],
      ["Éplucher les poires en gardant la queue. Les pocher 20 min dans 50 cl d'eau frémissante avec le sucre et la vanille, puis les laisser refroidir dans le sirop.",
       "Faire fondre le chocolat avec la crème en remuant jusqu'à obtenir une sauce lisse.",
       "Servir chaque poire avec une boule de glace et napper de sauce au chocolat chaude."], "Française", meal=D)
    return R
