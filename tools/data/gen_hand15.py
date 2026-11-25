# -*- coding: utf-8 -*-
"""Recettes écrites à la main (15) : desserts, gâteaux et goûters."""
from gen_hand1 import H

D = ("Dessert", "Goûter")


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    P("Panna cotta aux fruits rouges", "Desserts", 25, ["plaques"], ["dessert", "fête", "été"],
      [("creme", 4), ("lait", 0.5), ("sucre", 1), "vanille", "gelatine", ("fruits-rouges", 1.5)],
      ["Faire ramollir la gélatine 5 min dans un bol d'eau froide.",
       "Chauffer la crème, le lait, la moitié du sucre et la vanille sans faire bouillir. Hors du feu, ajouter la gélatine essorée et bien mélanger.",
       "Verser dans des verrines et laisser prendre au moins 4 h au frais.",
       "Cuire les fruits rouges 5 min avec le reste du sucre pour faire un coulis, le laisser refroidir et le verser sur les panna cotta."], "Italienne", meal=D, serv=4)
    P("Gâteau poires-chocolat", "Desserts", 55, ["four", "plaques"], ["dessert", "automne", "familial"],
      [("chocolat", 1.5), ("beurre", 5), ("sucre", 1.5), ("oeufs", 0.75), ("farine", 0.7), "poire"],
      ["Préchauffer le four à 180 °C. Faire fondre le chocolat avec le beurre.",
       "Fouetter les œufs avec le sucre, ajouter le chocolat fondu puis la farine.",
       "Verser dans un moule beurré et enfoncer les poires épluchées coupées en quartiers.",
       "Cuire 30 min : le cœur doit rester fondant. Laisser tiédir avant de démouler."], "Française", meal=D, serv=6)
    P("Mille-feuille maison", "Desserts", 70, ["four", "plaques"], ["dessert", "fête", "week-end"],
      [("pate-feuilletee", 2), ("lait", 2.5), ("oeufs", 0.75), ("sucre", 1.5), ("maizena", 1.3), "vanille"],
      ["Préchauffer le four à 200 °C. Piquer les pâtes feuilletées, les couvrir de papier cuisson et d'une plaque (pour qu'elles ne gonflent pas) et cuire 20 min.",
       "Crème pâtissière : chauffer le lait avec la vanille. Fouetter les œufs avec le sucre et la maïzena, verser le lait chaud dessus, remettre sur le feu et cuire 2 min en fouettant. Laisser refroidir filmé au contact.",
       "Couper chaque pâte en 3 rectangles égaux.",
       "Monter le mille-feuille en alternant pâte et crème, finir par une pâte. Saupoudrer de sucre et garder 1 h au frais avant de couper."], "Française", meal=D, serv=6, diff="Intermédiaire")
    P("Banoffee pie", "Desserts", 40, ["plaques"], ["dessert", "fête", "sans cuisson"],
      [("biscuits", 2), ("beurre", 4), ("sucre", 1.5), ("creme", 3), ("banane", 1.5)],
      ["Écraser les biscuits, les mélanger avec la moitié du beurre fondu et tasser au fond d'un moule. Garder au frais.",
       "Caramel : faire fondre le sucre à sec jusqu'à ce qu'il soit ambré, ajouter hors du feu le reste du beurre puis 10 cl de crème. Laisser tiédir et verser sur les biscuits.",
       "Couvrir de rondelles de banane.", "Fouetter le reste de la crème bien froide en chantilly et l'étaler sur le dessus. Garder 2 h au frais."], "Anglaise", meal=D, serv=6)
    P("Granité au citron", "Desserts", 20, [], ["dessert", "été", "sans cuisson", "léger"],
      [("citron", 3), ("sucre", 1.5), ("menthe", 0.3)],
      ["Faire fondre le sucre dans 50 cl d'eau chaude, puis laisser refroidir.", "Ajouter le jus et le zeste des citrons.",
       "Verser dans un plat et mettre au congélateur. Toutes les 30 min pendant 3 h, gratter à la fourchette pour former des cristaux.",
       "Servir dans des verres bien froids avec une feuille de menthe."], "Italienne", meal=D, serv=4)
    P("Gâteau de semoule aux raisins", "Desserts", 50, ["four", "plaques"], ["dessert", "économique", "familial"],
      [("lait", 2.5), ("semoule", 0.5), ("sucre", 2), ("oeufs", 0.5), ("raisins-secs", 1), "vanille"],
      ["Préchauffer le four à 180 °C. Faire un caramel avec 60 g de sucre et 2 cuillères d'eau, le verser dans un moule.",
       "Porter le lait à ébullition avec la vanille et le reste du sucre, verser la semoule en pluie et cuire 5 min en remuant.",
       "Hors du feu, ajouter les œufs battus et les raisins secs.", "Verser sur le caramel et cuire 25 min au bain-marie. Démouler froid."], "Française", meal=D, serv=6)
    P("Pastéis de nata", "Desserts", 45, ["four", "plaques"], ["dessert", "goûter", "fête"],
      ["pate-feuilletee", ("lait", 1.5), ("oeufs", 0.75), ("sucre", 1.3), ("maizena", 0.8), "cannelle", ("citron", 0.3)],
      ["Préchauffer le four au maximum (250 °C). Rouler la pâte feuilletée, la couper en 12 tronçons et en garnir des moules à muffins en écrasant chaque disque avec le pouce.",
       "Fouetter les jaunes d'œufs (et 1 œuf entier) avec le sucre et la maïzena, ajouter le lait et le zeste de citron.",
       "Cuire ce mélange 3 min à feu doux en fouettant jusqu'à ce qu'il épaississe, puis le répartir dans les moules.",
       "Cuire 12 à 15 min : le dessus doit être caramélisé par endroits. Saupoudrer de cannelle."], "Portugaise", meal=D, serv=6, diff="Intermédiaire")
    P("Bûche roulée au chocolat", "Desserts", 60, ["four", "plaques"], ["dessert", "fête", "hiver"],
      ["oeufs", ("sucre", 2), ("farine", 0.8), ("cacao", 1), ("chocolat", 2), ("creme", 3), ("beurre", 0.5)],
      ["Préchauffer le four à 200 °C. Fouetter les œufs avec le sucre 8 min jusqu'à ce qu'ils triplent de volume, puis incorporer la farine et le cacao tamisés.",
       "Étaler sur une plaque recouverte de papier cuisson beurré et cuire 8 à 10 min. Rouler aussitôt le biscuit dans un torchon humide.",
       "Ganache : verser la crème chaude sur le chocolat haché, mélanger et laisser épaissir au frais 30 min.",
       "Dérouler le biscuit, tartiner d'un tiers de ganache, rouler à nouveau et couvrir du reste. Strier à la fourchette pour imiter l'écorce."], "Française", meal=D, serv=8, diff="Intermédiaire")
    P("Mendiants au chocolat", "Desserts", 30, ["plaques"], ["dessert", "fête", "hiver", "goûter"],
      [("chocolat", 2), ("amandes", 1), ("noisettes", 1), ("raisins-secs", 1)],
      ["Faire fondre le chocolat au bain-marie.", "Déposer des petits disques de chocolat sur du papier cuisson.",
       "Garnir aussitôt chaque disque d'amandes, de noisettes et de raisins secs.", "Laisser durcir 1 h au frais. Parfait à offrir."], "Française", meal=D, serv=6)
    P("Glace minute à la banane", "Desserts", 10, ["mixeur"], ["dessert", "goûter", "sans cuisson", "anti-gaspi"],
      [("banane", 1.5), ("cacao", 0.5), ("miel", 1)],
      ["La veille, couper les bananes bien mûres en rondelles et les mettre au congélateur.",
       "Les mixer encore congelées avec le cacao et le miel, en raclant les bords, jusqu'à obtenir une texture de glace onctueuse.",
       "Servir aussitôt, ou remettre 30 min au congélateur pour une glace plus ferme."], "Française", meal=D, serv=2)
    P("Gâteau moelleux aux amandes", "Desserts", 45, ["four"], ["dessert", "goûter"],
      [("amandes", 4), ("beurre", 5), ("sucre", 2), ("oeufs", 0.75), ("farine", 0.4), ("citron", 0.5)],
      ["Préchauffer le four à 180 °C. Fouetter le beurre mou avec le sucre, puis ajouter les œufs un à un.",
       "Incorporer les amandes en poudre, la farine et le zeste du citron.",
       "Verser dans un moule beurré et cuire 30 min : le gâteau doit rester moelleux au centre."], "Française", meal=D, serv=6)
    P("Brochettes de fruits au chocolat", "Desserts", 15, ["plaques"], ["dessert", "goûter", "enfants"],
      ["banane", ("fraises", 1), ("ananas", 0.5), ("chocolat", 1)],
      ["Couper la banane, les fraises et l'ananas en morceaux.", "Les piquer sur des brochettes en alternant les couleurs.",
       "Faire fondre le chocolat au bain-marie et le verser en filet sur les brochettes. Laisser figer 10 min au frais."], "Française", meal=D, serv=4)
    return R
