# -*- coding: utf-8 -*-
"""Recettes écrites à la main (11) : desserts, gâteaux et goûters."""
from gen_hand1 import H

D = ("Dessert", "Goûter")
G = ("Goûter", "Petit-déjeuner")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    # ---------- GÂTEAUX ----------
    P("Gâteau basque à la crème", "Desserts", 90, ["four", "plaques"], ["dessert", "fête", "week-end"],
      [("farine", 2.5), ("beurre", 7.5), ("sucre", 3), "oeufs", ("lait", 2.5), "maizena", "vanille", ("levure", 0.5)],
      ["Porter le lait à frémir avec la vanille. Fouetter 2 jaunes d'œufs avec 50 g de sucre et la maïzena, verser le lait chaud dessus en fouettant, puis remettre 2 min sur le feu sans cesser de remuer jusqu'à ce que la crème épaississe. Filmer au contact et laisser refroidir.",
       "Travailler le beurre mou avec le reste du sucre, ajouter 1 œuf entier et 1 jaune, puis la farine mélangée à la levure et une pincée de sel. Laisser la pâte 30 min au frais.",
       "Préchauffer le four à 180 °C. Étaler les deux tiers de la pâte dans un moule beurré de 24 cm en remontant sur les bords, garnir de crème pâtissière et couvrir avec le reste de la pâte. Souder les bords.",
       "Dorer avec un peu de lait, tracer des croisillons à la fourchette et cuire 40 min. Laisser refroidir avant de démouler."], "Basque", meal=D, serv=8, diff="Intermédiaire")
    P("Gâteau magique à la vanille", "Desserts", 75, ["four", "plaques"], ["dessert", "familial"],
      ["oeufs", ("sucre", 2.5), ("beurre", 6.25), "farine", ("lait", 2.5), "vanille"],
      ["Préchauffer le four à 150 °C. Faire fondre le beurre et tiédir le lait avec la vanille.",
       "Séparer les blancs des jaunes. Fouetter les jaunes avec le sucre et 1 cuillère d'eau jusqu'à ce que le mélange blanchisse, puis ajouter le beurre fondu et la farine.",
       "Verser le lait tiède petit à petit en fouettant : la pâte est très liquide, c'est normal.",
       "Monter les blancs en neige ferme et les incorporer délicatement : il doit rester des petits morceaux de blanc en surface.",
       "Verser dans un moule de 20 cm beurré et cuire 50 min. Laisser refroidir puis 2 h au frais : le gâteau forme trois couches."], "Française", meal=D, serv=8, diff="Intermédiaire")
    P("Biscuit de Savoie", "Desserts", 55, ["four"], ["dessert", "goûter", "économique"],
      [("oeufs", 1.25), ("sucre", 2.5), ("farine", 0.6), ("maizena", 2.5), ("citron", 0.5), "beurre"],
      ["Préchauffer le four à 170 °C. Beurrer un moule à manqué et le saupoudrer de sucre.",
       "Séparer les œufs. Fouetter les jaunes avec le sucre et le zeste du citron jusqu'à ce que le mélange blanchisse et double de volume.",
       "Ajouter la farine et la maïzena tamisées, puis incorporer délicatement les blancs montés en neige ferme avec une pincée de sel.",
       "Verser dans le moule et cuire 35 min sans ouvrir le four. Démouler tiède."], "Savoyarde", meal=D, serv=8)
    P("Brookies", "Desserts", 45, ["four", "plaques"], ["dessert", "goûter", "fête"],
      [("chocolat", 2), ("beurre", 7.5), ("sucre", 3), ("oeufs", 0.5), ("farine", 1.5), ("levure", 0.5)],
      ["Préchauffer le four à 180 °C et chemiser un moule carré de 20 cm de papier cuisson.",
       "Brownie : faire fondre 100 g de chocolat avec 80 g de beurre, ajouter 80 g de sucre, 1 œuf et 40 g de farine. Étaler au fond du moule.",
       "Cookie : mélanger le reste du beurre, mou, avec le reste du sucre, 1 œuf, le reste de la farine et la levure, puis le reste du chocolat haché en pépites.",
       "Répartir la pâte à cookie en morceaux sur le brownie, cuire 25 min et laisser refroidir avant de couper en carrés."], "Américaine", meal=D, serv=9)
    P("Gâteau roulé à la confiture", "Desserts", 40, ["four"], ["dessert", "goûter", "économique"],
      ["oeufs", ("sucre", 2), "farine", ("confiture", 3.5), ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Recouvrir une plaque de papier cuisson beurré.",
       "Fouetter les œufs avec 100 g de sucre pendant 8 à 10 min : le mélange doit tripler de volume. Incorporer délicatement la farine tamisée.",
       "Étaler la pâte sur la plaque sur 1 cm d'épaisseur et cuire 8 à 10 min : le biscuit doit rester souple.",
       "Le retourner aussitôt sur un torchon humide saupoudré du reste du sucre, retirer le papier et rouler le biscuit avec le torchon. Laisser tiédir.",
       "Dérouler, tartiner de confiture et rouler à nouveau. Couper les extrémités et servir."], "Française", meal=D, serv=8, diff="Intermédiaire")
    P("Moelleux à la pâte à tartiner", "Desserts", 40, ["four"], ["dessert", "goûter", "enfants"],
      [("pate-tartiner", 4), "oeufs", ("farine", 0.3), ("beurre", 0.5)],
      ["Préchauffer le four à 170 °C et beurrer un moule de 20 cm.",
       "Séparer les blancs des jaunes. Mélanger la pâte à tartiner légèrement tiédie avec les jaunes et la farine.",
       "Monter les blancs en neige ferme et les incorporer délicatement en trois fois.",
       "Verser dans le moule et cuire 20 à 25 min : le cœur doit rester moelleux."], "Française", meal=D, serv=6)
    P("Cake à l'orange", "Desserts", 60, ["four", "plaques"], ["dessert", "goûter", "hiver"],
      ["orange", ("farine", 1.7), ("sucre", 3), ("beurre", 6), ("oeufs", 0.75), "levure"],
      ["Préchauffer le four à 175 °C. Râper le zeste des oranges et presser leur jus.",
       "Fouetter le beurre mou avec 150 g de sucre, ajouter les œufs un à un, puis le zeste et la moitié du jus.",
       "Incorporer la farine mélangée à la levure. Verser dans un moule à cake beurré et cuire 45 min.",
       "Chauffer le reste du jus avec le reste du sucre 2 min et en imbiber le cake encore chaud."], "Française", meal=D, serv=8)
    P("Gâteau invisible aux pommes", "Desserts", 65, ["four"], ["dessert", "automne", "familial"],
      [("pomme", 2.5), ("oeufs", 0.5), ("sucre", 0.8), ("farine", 0.7), ("lait", 0.75), ("beurre", 1.5), "vanille"],
      ["Préchauffer le four à 180 °C et chemiser un moule à cake de papier cuisson.",
       "Fouetter les œufs avec le sucre et la vanille, ajouter le beurre fondu, la farine, puis le lait.",
       "Éplucher les pommes et les couper en tranches très fines, à la mandoline si possible. Les mélanger délicatement à la pâte.",
       "Verser dans le moule en tassant les tranches et cuire 45 à 50 min. Laisser refroidir avant de démouler."], "Française", meal=D, serv=6)
    # ---------- TARTES ----------
    P("Tarte fine aux pommes", "Desserts", 40, ["four"], ["dessert", "automne", "tarte"],
      ["pate-feuilletee", ("pomme", 1.5), ("compote", 0.5), ("beurre", 1.5), ("sucre", 0.5)],
      ["Préchauffer le four à 200 °C. Dérouler la pâte feuilletée sur une plaque et la piquer à la fourchette.",
       "L'étaler d'une fine couche de compote en laissant 1 cm de bord.",
       "Éplucher les pommes, les couper en lamelles très fines et les disposer en rosace. Parsemer de beurre en morceaux et de sucre.",
       "Cuire 25 min, jusqu'à ce que les pommes soient dorées et légèrement caramélisées."], "Française", meal=D, serv=4)
    P("Tarte aux fruits rouges et mascarpone", "Desserts", 45, ["four"], ["dessert", "été", "tarte", "fête"],
      ["pate-sablee", ("mascarpone", 2.5), ("sucre", 0.7), "vanille", ("fruits-rouges", 2), ("creme", 1.5)],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte sablée, la piquer, la couvrir de papier cuisson et de légumes secs et cuire 15 min, puis 5 min sans les légumes secs. Laisser refroidir.",
       "Fouetter la crème bien froide en chantilly. Mélanger le mascarpone avec le sucre et la vanille, puis incorporer la chantilly.",
       "Garnir le fond de tarte de crème et couvrir de fruits rouges. Garder au frais jusqu'au service."], "Française", meal=D, serv=6)
    P("Tarte à la noix de coco", "Desserts", 50, ["four"], ["dessert", "tarte"],
      ["pate-brisee", ("noix-coco", 3), ("sucre", 1.5), ("oeufs", 0.75), ("creme", 2)],
      ["Préchauffer le four à 180 °C. Foncer un moule avec la pâte brisée et la piquer à la fourchette.",
       "Fouetter les œufs avec le sucre, puis ajouter la crème et la noix de coco râpée.",
       "Verser sur la pâte et cuire 35 min : le dessus doit être bien doré. Servir tiède ou froid."], "Française", meal=D, serv=6)
    # ---------- DESSERTS ----------
    P("Tiramisu aux fraises", "Desserts", 30, [], ["dessert", "été", "fête", "sans cuisson"],
      [("mascarpone", 2.5), ("oeufs", 0.75), ("sucre", 1.5), ("biscuits", 2), ("fraises", 2), ("citron", 0.5)],
      ["Écraser 150 g de fraises à la fourchette avec 1 cuillère de sucre et le jus du demi-citron : c'est le sirop. Couper le reste des fraises en morceaux.",
       "Séparer les œufs. Fouetter les jaunes avec le reste du sucre, ajouter le mascarpone, puis incorporer les blancs montés en neige.",
       "Tremper rapidement les biscuits dans le sirop de fraise et en tapisser le fond d'un plat. Couvrir de fraises, puis de crème au mascarpone. Recommencer une fois.",
       "Laisser au moins 4 h au frais et décorer de quelques fraises au moment de servir."], "Italienne", meal=D, serv=6)
    P("Flan à la noix de coco", "Desserts", 70, ["four", "plaques"], ["dessert", "fête"],
      [("lait-coco", 2), "lait", "oeufs", ("sucre", 2.5), ("noix-coco", 2)],
      ["Préchauffer le four à 180 °C. Faire fondre 100 g de sucre avec 3 cuillères d'eau jusqu'à obtenir un caramel blond et le verser dans un moule.",
       "Fouetter les œufs avec le reste du sucre, puis ajouter le lait de coco, le lait et la noix de coco râpée.",
       "Verser sur le caramel et cuire 45 min au bain-marie.", "Laisser refroidir puis au moins 3 h au frais avant de démouler."], "Antillaise", meal=D, serv=6)
    P("Clafoutis aux abricots", "Desserts", 50, ["four"], ["dessert", "été", "familial"],
      [("abricots", 2), ("oeufs", 0.75), ("sucre", 1.5), ("farine", 0.6), ("lait", 1.25), "creme", "beurre", "amandes"],
      ["Préchauffer le four à 180 °C. Beurrer un plat et y ranger les abricots coupés en deux, face bombée vers le haut.",
       "Fouetter les œufs avec le sucre, ajouter la farine, puis le lait et la crème pour obtenir une pâte lisse.",
       "Verser sur les fruits, parsemer d'amandes effilées et cuire 35 min. Servir tiède ou froid."], "Française", meal=D, serv=6)
    P("Crumble mangue-coco", "Desserts", 40, ["four"], ["dessert", "hiver"],
      [("mangue", 2), ("farine", 0.7), ("beurre", 3.5), "sucre", "noix-coco", ("citron-vert", 0.5)],
      ["Préchauffer le four à 190 °C. Peler les mangues, les couper en cubes et les mettre dans un plat avec le zeste et le jus du citron vert.",
       "Sabler du bout des doigts la farine, le sucre, la noix de coco râpée et le beurre froid en dés.",
       "Répartir la pâte sur les fruits et cuire 25 min, jusqu'à ce que le dessus soit doré."], "Exotique", meal=D, serv=4)
    P("Bananes caramélisées à la cannelle", "Desserts", 10, ["plaques"], ["dessert", "express"],
      ["banane", "beurre", ("sucre", 0.5), ("citron", 0.5), "cannelle", ("glace", 0.5)],
      ["Éplucher les bananes et les couper en deux dans la longueur.", "Faire fondre le beurre avec le sucre dans une poêle jusqu'à ce qu'il caramélise légèrement.",
       "Ajouter les bananes et les cuire 2 min de chaque côté. Arroser d'un trait de jus de citron et saupoudrer de cannelle.", "Servir aussitôt, avec une boule de glace."], "Antillaise", meal=D)
    P("Barres coco enrobées de chocolat", "Desserts", 50, ["plaques"], ["dessert", "goûter", "fête"],
      [("noix-coco", 4), "creme", ("sucre", 0.8), ("chocolat", 2)],
      ["Mélanger la noix de coco râpée avec la crème et le sucre jusqu'à obtenir une pâte compacte.",
       "Former des petites barres, les poser sur une plaque recouverte de papier cuisson et les mettre 30 min au congélateur.",
       "Faire fondre le chocolat au bain-marie, y tremper les barres une à une et les laisser figer sur le papier.", "Garder au frais."], "Française", meal=D, serv=8)
    P("Rochers à la noix de coco", "Desserts", 30, ["four"], ["dessert", "goûter", "économique"],
      [("noix-coco", 5), ("sucre", 2), ("oeufs", 0.75), "vanille"],
      ["Préchauffer le four à 180 °C.", "Mélanger la noix de coco râpée, le sucre, la vanille et les blancs d'œufs légèrement battus à la fourchette.",
       "Former des petites pyramides avec les doigts mouillés et les poser sur une plaque recouverte de papier cuisson.",
       "Cuire 12 à 15 min : les pointes doivent être dorées. Laisser refroidir sur la plaque."], "Française", meal=D, serv=6)
    P("Sablés lunettes à la confiture", "Desserts", 60, ["four"], ["dessert", "goûter", "fête"],
      [("farine", 2), ("beurre", 6), ("sucre", 1.3), ("oeufs", 0.25), ("amandes", 2), ("confiture", 2), "vanille"],
      ["Mélanger la farine, les amandes en poudre, le sucre et la vanille. Ajouter le beurre froid en dés et sabler du bout des doigts, puis l'œuf pour former une boule. Laisser 30 min au frais.",
       "Préchauffer le four à 180 °C. Étaler la pâte sur 3 mm et découper des cercles. Évider le centre de la moitié des cercles.",
       "Cuire 10 à 12 min sur une plaque : les sablés doivent rester clairs. Laisser refroidir.",
       "Tartiner les fonds pleins de confiture et les couvrir avec les sablés évidés."], "Française", meal=D, serv=8, diff="Intermédiaire")
    # ---------- GOÛTERS ----------
    P("Chaussons aux pommes", "Petit-déjeuner", 35, ["four"], ["goûter", "automne", "familial"],
      [("pate-feuilletee", 2), "compote", ("pomme", 0.5), "cannelle", ("oeufs", 0.25), ("sucre", 0.3)],
      ["Préchauffer le four à 200 °C. Éplucher la pomme, la couper en petits dés et la mélanger à la compote et à la cannelle.",
       "Découper des disques de 12 cm dans la pâte feuilletée. Déposer une cuillère de garniture sur une moitié, replier et souder les bords à la fourchette.",
       "Dorer à l'œuf battu, saupoudrer d'un peu de sucre, entailler le dessus et cuire 20 min."], "Française", meal=("Goûter", "Petit-déjeuner", "Dessert"), serv=6)
    P("Feuilletés au chocolat", "Petit-déjeuner", 25, ["four"], ["goûter", "enfants", "express"],
      ["pate-feuilletee", ("chocolat", 0.8), ("oeufs", 0.25)],
      ["Préchauffer le four à 200 °C. Couper la pâte feuilletée en 8 rectangles.", "Poser deux carrés de chocolat sur chaque rectangle et les rouler en serrant bien.",
       "Dorer à l'œuf battu et cuire 15 min. Laisser tiédir avant de croquer : le chocolat est brûlant."], "Française", meal=G, serv=4)
    P("Barres de céréales maison", "Petit-déjeuner", 35, ["four", "plaques"], ["goûter", "pique-nique", "économique"],
      [("flocons-avoine", 2.5), ("miel", 4), ("beurre", 2.5), "noisettes", "raisins-secs", ("chocolat", 0.5)],
      ["Préchauffer le four à 170 °C. Faire fondre le beurre avec le miel.",
       "Mélanger les flocons d'avoine, les noisettes concassées et les raisins secs, puis verser le beurre au miel et bien enrober.",
       "Tasser la préparation dans un moule carré recouvert de papier cuisson et cuire 20 min.",
       "Laisser refroidir complètement, filer de chocolat fondu et couper en barres."], "Française", meal=G, serv=8)
    P("Boules d'énergie avoine, cacao et cacahuète", "Petit-déjeuner", 15, [], ["goûter", "sans cuisson", "express"],
      [("flocons-avoine", 1.2), ("cacahuete", 3), ("miel", 2), "cacao", ("noix-coco", 0.5)],
      ["Mélanger les flocons d'avoine, le beurre de cacahuète, le miel et le cacao jusqu'à obtenir une pâte qui se tient.",
       "Former des boules de la taille d'une noix entre les mains mouillées.", "Les rouler dans la noix de coco râpée et les garder au moins 30 min au frais."], "Américaine", meal=("Goûter",), serv=6)
    P("Muffins pommes-cannelle", "Petit-déjeuner", 35, ["four", "plaques"], ["goûter", "automne", "familial"],
      [("farine", 2), ("sucre", 1.5), ("oeufs", 0.5), "lait", ("beurre", 4), "levure", "pomme", "cannelle"],
      ["Préchauffer le four à 180 °C. Éplucher les pommes et les couper en petits dés.",
       "Mélanger la farine, la levure, le sucre et la cannelle. Dans un autre bol, fouetter les œufs avec le lait et le beurre fondu.",
       "Verser le liquide sur les poudres et mélanger rapidement sans trop travailler, puis ajouter les pommes.",
       "Remplir des moules à muffins aux deux tiers et cuire 20 min."], "Américaine", meal=G, serv=6)
    P("Cookies fourrés à la pâte à tartiner", "Desserts", 50, ["four"], ["goûter", "enfants", "fête"],
      [("farine", 1.7), ("beurre", 5), ("sucre", 1.7), ("oeufs", 0.25), ("levure", 0.5), ("pate-tartiner", 2)],
      ["Déposer 12 petites cuillères de pâte à tartiner sur du papier cuisson et les mettre 30 min au congélateur.",
       "Mélanger le beurre mou avec le sucre, ajouter l'œuf, puis la farine et la levure pour obtenir une pâte souple.",
       "Préchauffer le four à 180 °C. Aplatir une boule de pâte, y poser un palet de pâte à tartiner congelé et l'enfermer avec un peu de pâte.",
       "Cuire 11 min sur une plaque : les cookies doivent rester tendres au centre."], "Américaine", meal=D, serv=6, diff="Intermédiaire")
    return R
