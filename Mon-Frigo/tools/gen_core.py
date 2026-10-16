# -*- coding: utf-8 -*-
"""Cœur du générateur de recettes : grammaire française + tables de cuisson réalistes."""
import random
from kb import build

K = {i["id"]: i for i in build()}


# ---------- grammaire ----------
def _vowel(i):
    k = K[i]
    return k["n"][0].lower() in "aeiouyéèêàâîôûœ" and not k["hasp"]


def nm(i):
    return K[i]["n"][0].lower() + K[i]["n"][1:]


def d(i):  # le / la / l' / les
    g = K[i]["g"]
    if g.endswith("p"): return "les " + nm(i)
    if _vowel(i): return "l'" + nm(i)
    return ("la " if g == "f" else "le ") + nm(i)


def p(i):  # du / de la / de l' / des
    g = K[i]["g"]
    if g.endswith("p"): return "des " + nm(i)
    if _vowel(i): return "de l'" + nm(i)
    return ("de la " if g == "f" else "du ") + nm(i)


def de(i):  # de X / d'X
    return ("d'" if _vowel(i) else "de ") + nm(i)


def pron(i):  # le / la / les
    g = K[i]["g"]
    return "les" if g.endswith("p") else ("la" if g == "f" else "le")


def plural(i): return K[i]["g"].endswith("p")


def cap(s): return s[0].upper() + s[1:]


def lst(items):
    items = list(items)
    if len(items) <= 1: return "".join(items)
    return ", ".join(items[:-1]) + " et " + items[-1]


def q(i, mult=1.0, unit=None):
    k = K[i]
    v = k["q2"] * mult
    if k["u"] in ("g", "cl"):
        v = round(v / 5) * 5 if v >= 20 else round(v)
    elif k["u"] in ("pièce", "gousse", "tranche", "pot"):
        v = max(1, round(v))
    else:
        v = round(v * 2) / 2
    return [i, int(v) if float(v).is_integer() else v, unit or k["u"]]


# ---------- tables de cuisson ----------
# protéine -> (préparation, cuisson poêle, minutes de cuisson, sauces compatibles)
PROT = {
    "poulet": ("Couper le poulet en dés de 2 cm, saler et poivrer.", "Faire dorer le poulet à feu vif 6 à 8 min en remuant, jusqu'à ce que la chair ne soit plus rosée à cœur.", ["moutarde", "tomate", "soja", "paprika", "citron", "pesto", "creme"]),
    "dinde": ("Couper la dinde en lanières, saler et poivrer.", "Saisir la dinde à feu vif 5 à 6 min en remuant, jusqu'à ce qu'elle soit dorée et cuite à cœur.", ["moutarde", "tomate", "soja", "paprika", "citron", "creme"]),
    "boeuf-hache": ("Sortir le bœuf haché du frigo 10 min avant la cuisson.", "Faire cuire le bœuf haché à feu vif 6 à 8 min en l'émiettant à la spatule, jusqu'à ce qu'il soit bien coloré.", ["tomate", "paprika", "soja"]),
    "porc": ("Couper le porc en dés ou en lanières, saler et poivrer.", "Faire dorer le porc 7 à 8 min à feu moyen-vif en remuant, jusqu'à ce qu'il soit cuit à cœur.", ["moutarde", "soja", "paprika", "creme"]),
    "saucisses": ("Piquer les saucisses à la fourchette.", "Faire dorer les saucisses entières 10 à 12 min à feu moyen en les retournant, puis les couper en rondelles.", ["moutarde", "tomate"]),
    "crevettes": ("Décortiquer les crevettes si nécessaire et les éponger.", "Saisir les crevettes 2 à 3 min de chaque côté à feu vif, jusqu'à ce qu'elles soient roses, puis les réserver.", ["citron", "soja", "paprika", "creme", "tomate"]),
    "saumon": ("Couper le saumon en gros cubes, saler et poivrer.", "Cuire le saumon 3 à 4 min de chaque côté à feu moyen, sans trop le remuer, puis le réserver.", ["citron", "soja", "creme", "moutarde"]),
    "tofu": ("Égoutter le tofu, le presser dans un torchon puis le couper en cubes.", "Faire dorer le tofu dans l'huile 8 min à feu moyen-vif en le retournant, jusqu'à ce qu'il soit croustillant.", ["soja", "tomate", "paprika"]),
    "pois-chiches": ("Égoutter et rincer les pois chiches.", "Ajouter les pois chiches et les faire revenir 5 min pour qu'ils dorent légèrement.", ["tomate", "paprika", "citron", "soja"]),
    "lentilles": ("Égoutter et rincer les lentilles cuites.", "Ajouter les lentilles et les réchauffer 4 min en remuant.", ["moutarde", "tomate", "creme"]),
}
# légume -> (nom court pluriel/sing. pour le titre, préparation, cuisson, minutes)
VEG = {
    "carotte": ("carottes", "éplucher les carottes et les couper en fines rondelles", "Ajouter les carottes, couvrir et cuire 10 à 12 min à feu moyen.", 12),
    "courgette": ("courgettes", "couper la courgette en demi-rondelles", "Ajouter la courgette et cuire 6 à 8 min jusqu'à ce qu'elle soit tendre.", 8),
    "poivron": ("poivrons", "épépiner le poivron et le couper en lanières", "Ajouter le poivron et cuire 8 min en remuant.", 8),
    "aubergine": ("aubergines", "couper l'aubergine en cubes", "Ajouter l'aubergine avec un filet d'huile et cuire 10 min en remuant, jusqu'à ce qu'elle soit fondante.", 10),
    "champignons": ("champignons", "nettoyer les champignons et les couper en lamelles", "Ajouter les champignons et cuire 6 à 8 min, jusqu'à évaporation de leur eau.", 8),
    "epinards": ("épinards", "rincer les épinards", "Ajouter les épinards et les laisser tomber 2 à 3 min en remuant.", 3),
    "brocoli": ("brocolis", "détailler le brocoli en petits bouquets", "Ajouter le brocoli avec 5 cl d'eau, couvrir et cuire 8 min.", 8),
    "poireau": ("poireaux", "laver le poireau et l'émincer", "Ajouter le poireau et cuire 8 min à feu moyen.", 8),
    "tomate": ("tomates", "couper les tomates en dés", "Ajouter les tomates et cuire 5 min.", 5),
    "haricots-verts": ("haricots verts", "équeuter les haricots verts", "Ajouter les haricots verts avec un peu d'eau, couvrir et cuire 10 min.", 10),
    "petits-pois": ("petits pois", "", "Ajouter les petits pois et cuire 5 min.", 5),
    "chou-fleur": ("chou-fleur", "détailler le chou-fleur en petits bouquets", "Ajouter le chou-fleur avec un peu d'eau, couvrir et cuire 10 min.", 10),
    "fenouil": ("fenouil", "émincer le fenouil", "Ajouter le fenouil et cuire 10 min à feu moyen.", 10),
    "patate-douce": ("patate douce", "éplucher la patate douce et la couper en petits cubes", "Ajouter la patate douce, couvrir et cuire 12 à 15 min, jusqu'à ce qu'elle soit tendre.", 14),
}
# féculent -> (étape de cuisson, minutes)
STARCH = {
    "riz": ("Cuire le riz 10 à 12 min dans deux fois son volume d'eau salée frémissante, à couvert, puis le laisser gonfler 5 min hors du feu.", 15),
    "pates": ("Cuire les pâtes 9 à 11 min dans une grande casserole d'eau bouillante salée, puis les égoutter en gardant un peu d'eau de cuisson.", 12),
    "semoule": ("Verser la semoule dans un volume égal d'eau bouillante salée avec un filet d'huile d'olive, couvrir 5 min puis l'égrener à la fourchette.", 6),
    "quinoa": ("Rincer le quinoa puis le cuire 12 min dans deux fois son volume d'eau salée, jusqu'à absorption complète.", 13),
    "boulgour": ("Cuire le boulgour 10 min dans deux fois son volume d'eau bouillante salée, puis l'égrener à la fourchette.", 10),
    "pomme-de-terre": ("Éplucher les pommes de terre, les couper en cubes et les cuire 15 min à l'eau bouillante salée, puis les égoutter.", 18),
}
START_PREP = "Mettre une grande casserole d'eau à bouillir."

# sauces pour poêlées : id -> (fragment de titre, ingrédients, étape, minutes)
SAUCE = {
    "moutarde": ("à la moutarde", [("creme", 1), ("moutarde", 1)], "Baisser le feu, ajouter la crème et la moutarde, mélanger et laisser épaissir 2 à 3 min.", 4),
    "creme": ("à la crème", [("creme", 1)], "Baisser le feu, verser la crème, saler, poivrer et laisser réduire 3 min.", 4),
    "tomate": ("à la tomate", [("tomate-concassee", 0.6), ("herbes-provence", 1)], "Verser la tomate concassée, ajouter les herbes de Provence, saler, poivrer et laisser mijoter 10 min à feu doux.", 11),
    "soja": ("sauce soja-miel", [("sauce-soja", 1), ("miel", 1)], "Verser la sauce soja et le miel, laisser caraméliser 2 min en enrobant bien.", 3),
    "paprika": ("au paprika", [("paprika", 1), ("creme", 0.6)], "Saupoudrer de paprika, ajouter la crème, mélanger et laisser mijoter 3 min.", 4),
    "citron": ("au citron", [("citron", 1), ("persil", 0.5)], "Presser le citron sur la poêle, ajouter le persil ciselé, mélanger et rectifier l'assaisonnement.", 2),
    "pesto": ("au pesto", [("pesto", 1)], "Hors du feu, ajouter le pesto et mélanger pour bien enrober.", 1),
}
SAUCE_ITEM_ING = {}  # rempli à la volée

COMPAT_SAUCE_STARCH = {
    "tomate": ["pates", "riz", "semoule", "pomme-de-terre"], "moutarde": ["riz", "pates", "pomme-de-terre", "semoule"],
    "creme": ["riz", "pates", "pomme-de-terre"], "soja": ["riz", "semoule", "quinoa", "pates"],
    "paprika": ["riz", "semoule", "pomme-de-terre", "pates"], "citron": ["riz", "semoule", "quinoa", "pomme-de-terre"],
    "pesto": ["pates", "riz", "pomme-de-terre"],
}
VEG_PAIR_OK = [  # associations de légumes cohérentes
    ("courgette", "poivron"), ("courgette", "carotte"), ("poivron", "aubergine"), ("champignons", "epinards"), ("brocoli", "carotte"),
    ("courgette", "aubergine"), ("poireau", "champignons"), ("carotte", "haricots-verts"), ("poivron", "tomate"), ("brocoli", "champignons"),
    ("petits-pois", "carotte"), ("courgette", "tomate"), ("chou-fleur", "carotte"), ("fenouil", "tomate"), ("epinards", "poireau"),
    ("haricots-verts", "tomate"), ("patate-douce", "poivron"), ("courgette", "champignons"),
]
SINGLE_VEG = ["courgette", "poivron", "champignons", "brocoli", "carotte", "aubergine", "epinards", "poireau", "haricots-verts", "chou-fleur", "fenouil", "tomate"]

DIFF_MAP = {"Facile": 1, "Intermédiaire": 2}


def mk(title, cat, time, equip, tags, ings, steps, cuisine="Française", meal=("Déjeuner", "Dîner"), diff="Facile", serv=2, src="compose"):
    # fusionne les doublons d'ingrédients
    seen, out = {}, []
    for x in ings:
        if x[0] in seen:
            seen[x[0]][1] += x[1]
        else:
            seen[x[0]] = list(x); out.append(seen[x[0]])
    return dict(title=title, cat=cat, time=int(time), equip=list(equip), tags=sorted(set(tags)), ing=out, steps=steps,
                cuisine=cuisine, meal=list(meal), diff=diff, serv=serv, src=src)


def cooktime_tag(t):
    return ["express"] if t <= 20 else (["rapide"] if t <= 30 else [])
