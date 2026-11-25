# -*- coding: utf-8 -*-
"""Recettes écrites à la main (12) : plats du midi et du soir qui manquaient."""
from gen_hand1 import H, COOK_PASTA


def recipes():
    R = []
    P = lambda *a, **k: R.append(H(*a, **k))
    P("Gnocchis à la sorrentina", "Gratins & four", 30, ["four", "plaques"], ["familial", "végétarien", "réconfort"],
      ["gnocchis", "tomate-concassee", "mozzarella", ("basilic", 0.5), ("ail", 0.5), ("parmesan", 0.5), ("huile-olive", 1)],
      ["Préchauffer le four en position gril à 220 °C.", "Faire revenir l'ail haché dans l'huile d'olive 1 min, ajouter la tomate concassée, saler, poivrer et laisser mijoter 10 min.",
       "Cuire les gnocchis 2 min à l'eau bouillante salée, les égoutter et les mélanger à la sauce avec le basilic ciselé.",
       "Verser dans un plat, couvrir de mozzarella en morceaux et de parmesan, puis gratiner 8 min."], "Italienne")
    P("Bo bun au bœuf", "Salades", 30, ["plaques"], ["asiatique", "équilibré", "bol"],
      [("nouilles", 0.6), "boeuf", ("carotte", 0.5), ("concombre", 0.5), ("salade", 0.5), ("menthe", 0.5), ("coriandre", 0.5), "cacahuetes", ("sauce-soja", 1.5), "citron-vert", ("sucre", 0.15), ("ail", 0.5), "oignon"],
      ["Plonger les vermicelles de riz 4 min dans l'eau bouillante, les rincer à l'eau froide et les égoutter.",
       "Préparer la sauce : le jus du citron vert, 1 cuillère de sucre, la moitié de la sauce soja et 4 cuillères d'eau.",
       "Émincer le bœuf et l'oignon et les saisir 3 min à feu vif avec l'ail haché et le reste de la sauce soja.",
       "Dans des bols : salade, vermicelles, carotte et concombre en bâtonnets, puis le bœuf chaud. Parsemer de menthe, de coriandre et de cacahuètes concassées, arroser de sauce."], "Vietnamienne")
    P("Bœuf loc lac", "Poêlées", 30, ["plaques"], ["asiatique", "rapide"],
      ["boeuf", "riz", ("sauce-soja", 2), ("ail", 1), "oignon", ("tomate", 0.7), ("salade", 0.5), "citron-vert", ("sucre", 0.15)],
      ["Rincer le riz et le cuire 12 min à l'eau bouillante salée.",
       "Couper le bœuf en cubes et le faire mariner 10 min avec la moitié de la sauce soja, l'ail haché, le sucre et beaucoup de poivre.",
       "Préparer la sauce : le jus du citron vert avec une pincée de sel et du poivre moulu généreusement.",
       "Saisir le bœuf 2 à 3 min à feu très vif avec le reste de la sauce soja. Servir sur la salade avec la tomate et l'oignon en rondelles, le riz et la sauce au citron vert."], "Cambodgienne")
    P("Welsh rarebit", "Sandwichs", 25, ["four", "plaques"], ["réconfort", "hiver"],
      ["pain", ("cheddar", 2.5), "jambon", ("oeufs", 0.5), "moutarde", ("lait", 0.5)],
      ["Préchauffer le four à 220 °C. Faire griller les tranches de pain et les poser dans des plats individuels avec une tranche de jambon.",
       "Faire fondre le cheddar râpé à feu doux avec le lait (ou un peu de bière) et la moutarde, en remuant jusqu'à obtenir une sauce lisse.",
       "Napper le pain de fromage fondu et gratiner 8 min au four.", "Servir avec un œuf au plat sur le dessus."], "Anglaise")
    P("Steak haché et potatoes maison", "Gratins & four", 45, ["four", "plaques"], ["familial", "enfants"],
      ["boeuf-hache", ("pomme-de-terre", 1.2), ("huile-olive", 2), "paprika", "herbes-provence", ("salade", 0.5)],
      ["Préchauffer le four à 210 °C. Laver les pommes de terre sans les éplucher et les couper en quartiers.",
       "Les mélanger avec l'huile d'olive, le paprika, les herbes de Provence et du sel, puis les étaler sur une plaque. Cuire 35 min en les retournant à mi-cuisson.",
       "Former deux steaks avec le bœuf haché et les cuire 2 à 4 min de chaque côté dans une poêle chaude. Saler, poivrer.",
       "Servir avec les potatoes et la salade."], "Française")
    P("Ficelles picardes", "Gratins & four", 55, ["four", "plaques"], ["familial", "réconfort", "hiver"],
      ["farine", ("oeufs", 0.5), ("lait", 1.25), ("jambon", 2), "champignons", ("creme", 2.5), ("fromage-rape", 1.3), "oignon", ("beurre", 1.5)],
      ["Préparer la pâte à crêpes : fouetter la farine avec les œufs, puis le lait petit à petit. Cuire 8 crêpes dans une poêle beurrée.",
       "Faire revenir l'oignon haché et les champignons émincés 8 min dans un peu de beurre, puis ajouter la moitié de la crème. Saler, poivrer.",
       "Préchauffer le four à 200 °C. Garnir chaque crêpe d'une tranche de jambon et d'une cuillère de champignons, la rouler et la poser dans un plat.",
       "Napper du reste de crème, parsemer de fromage râpé et gratiner 15 min."], "Picarde", serv=4)
    P("Piadina jambon cru, mozzarella et roquette", "Sandwichs", 15, ["plaques"], ["express", "pique-nique"],
      [("wrap", 0.5), "jambon-cru", "mozzarella", ("salade", 0.4), ("tomate", 0.5), ("huile-olive", 0.5)],
      ["Chauffer les wraps (galettes) 1 min de chaque côté dans une poêle sèche.",
       "Garnir une moitié de chaque galette de mozzarella en tranches, de jambon cru, de rondelles de tomate et de roquette (salade). Arroser d'un filet d'huile d'olive.",
       "Replier et presser 1 min dans la poêle pour faire fondre la mozzarella."], "Italienne", meal=("Déjeuner",))
    P("Crumble de courgettes au chèvre", "Gratins & four", 45, ["four", "plaques"], ["végétarien", "été"],
      [("courgette", 2), "chevre", ("farine", 0.7), ("beurre", 3), "parmesan", ("ail", 0.5), ("huile-olive", 1), "herbes-provence"],
      ["Préchauffer le four à 190 °C. Couper les courgettes en dés et les faire revenir 8 min dans l'huile d'olive avec l'ail haché et les herbes de Provence. Saler, poivrer.",
       "Les verser dans un plat et parsemer de chèvre émietté.",
       "Sabler du bout des doigts la farine, le parmesan râpé et le beurre froid en dés, puis répartir sur les légumes.",
       "Cuire 25 min, jusqu'à ce que le crumble soit doré."], "Française", serv=4)
    P("Pâtes au citron et au parmesan", "Pâtes", 15, ["plaques"], ["pâtes", "végétarien", "économique"],
      ["pates", "citron", ("beurre", 1.5), ("parmesan", 1.2), ("persil", 0.5)],
      [COOK_PASTA, "Pendant ce temps, râper le zeste du citron et presser son jus.",
       "Dans la casserole vide, faire fondre le beurre, ajouter les pâtes, le zeste, le jus et une louche d'eau de cuisson, puis le parmesan râpé en remuant vivement pour obtenir une sauce crémeuse.",
       "Poivrer généreusement et parsemer de persil ciselé."], "Italienne")
    P("Röstis et œufs au plat", "Poêlées", 30, ["plaques"], ["végétarien", "économique"],
      ["pomme-de-terre", ("oeufs", 0.75), ("oignon", 0.5), ("farine", 0.2), ("huile-olive", 2), ("salade", 0.5)],
      ["Éplucher et râper les pommes de terre, puis les presser fortement dans un torchon pour retirer l'eau.",
       "Les mélanger avec l'oignon finement haché, 1 œuf, la farine, du sel et du poivre.",
       "Former des galettes et les cuire 5 min de chaque côté dans l'huile d'olive bien chaude, jusqu'à ce qu'elles soient dorées et croustillantes.",
       "Cuire les autres œufs au plat et les servir sur les röstis, avec la salade."], "Suisse")
    P("Fondue savoyarde", "Plats mijotés", 25, ["plaques"], ["fête", "hiver", "réconfort"],
      [("emmental", 3), ("fromage-rape", 2), ("vin-blanc", 2), ("ail", 0.5), ("maizena", 0.3), ("pain", 3)],
      ["Couper le pain en cubes, en gardant un peu de croûte sur chaque morceau.",
       "Frotter le caquelon (ou une casserole à fond épais) avec la gousse d'ail coupée en deux. Y chauffer le vin blanc sans le faire bouillir.",
       "Ajouter l'emmental et le fromage râpé peu à peu, à feu doux, en remuant en forme de huit jusqu'à ce que tout soit fondu.",
       "Délayer la maïzena dans un peu de vin, l'ajouter pour lier la fondue, poivrer et servir aussitôt sur un réchaud avec le pain."], "Savoyarde")
    P("Cannellonis épinards-ricotta", "Gratins & four", 50, ["four", "plaques"], ["végétarien", "familial"],
      ["lasagnes", ("epinards", 2), ("ricotta", 2), "tomate-concassee", "parmesan", ("ail", 0.5), ("huile-olive", 1)],
      ["Préchauffer le four à 190 °C. Faire tomber les épinards 3 min dans une poêle avec l'huile d'olive et l'ail haché, puis les égoutter et les hacher.",
       "Les mélanger avec la ricotta et la moitié du parmesan. Saler et poivrer.",
       "Plonger les feuilles de lasagnes 2 min dans l'eau bouillante, les garnir de farce et les rouler.",
       "Napper le fond d'un plat de tomate concassée, y ranger les cannellonis, couvrir du reste de tomate et de parmesan. Cuire 25 min."], "Italienne")
    return R
