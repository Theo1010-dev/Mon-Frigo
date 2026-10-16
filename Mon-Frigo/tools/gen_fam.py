# -*- coding: utf-8 -*-
"""Familles combinatoires. Chaque recette est cohérente : quantités par ingrédient, étapes avec durées réelles."""
import random
from gen_core import *

PROT_MIN = {"poulet": 8, "dinde": 6, "boeuf-hache": 8, "porc": 8, "saucisses": 12, "crevettes": 5, "saumon": 7, "tofu": 8, "pois-chiches": 5, "lentilles": 4}
STARCH_NAME = {"riz": "riz", "pates": "pâtes", "semoule": "semoule", "quinoa": "quinoa", "boulgour": "boulgour", "pomme-de-terre": "pommes de terre"}
RESERVE = {"crevettes", "saumon"}


def cap_first(s): return s[0].upper() + s[1:]


def poelees(seed=1, limit=120):
    rng = random.Random(seed)
    combos = []
    for pr, (_, _, sauces) in PROT.items():
        for sa in sauces:
            for stv in COMPAT_SAUCE_STARCH[sa]:
                for vegs in [(v,) for v in SINGLE_VEG] + VEG_PAIR_OK:
                    if sa == "tomate" and "tomate" in vegs: continue
                    if pr in ("pois-chiches", "lentilles") and stv in ("quinoa",): continue
                    combos.append((pr, sa, stv, vegs))
    rng.shuffle(combos)
    out, used_title, per_prot = [], set(), {}
    for pr, sa, stv, vegs in combos:
        if per_prot.get(pr, 0) >= 9: continue
        frag, sing, sstep, smin = SAUCE[sa]
        vnames = [VEG[v][0] for v in vegs]
        title = f"{cap_first(nm(pr))} {frag}, {lst(vnames + [STARCH_NAME[stv]])}"
        if title in used_title: continue
        used_title.add(title); per_prot[pr] = per_prot.get(pr, 0) + 1
        ings = [q(pr), q("oignon", 0.5 if len(vegs) == 2 else 1), q("huile-olive", 0.5)]
        for v in vegs: ings.append(q(v, 0.7 if len(vegs) == 2 else 1))
        for sid, m in sing: ings.append(q(sid, m))
        if sa in ("tomate", "soja", "citron") or pr in ("crevettes", "tofu"): ings.append(q("ail", 0.5))
        ings.append(q(stv, 1.0))
        preps = [VEG[v][1] for v in vegs if VEG[v][1]]
        steps = []
        if stv == "pomme-de-terre": steps.append(STARCH[stv][0])
        steps.append("Préparer les légumes : émincer l'oignon" + "".join(" ; " + x for x in preps) + ". " + PROT[pr][0])
        if stv != "pomme-de-terre": steps.append(STARCH[stv][0].replace("Cuire", "Pendant ce temps, cuire", 1) if False else STARCH[stv][0])
        steps.append(f"Chauffer l'huile d'olive dans une grande poêle. {PROT[pr][1]}")
        ail = " avec l'ail haché" if any(x[0] == "ail" for x in ings) else ""
        veg_steps = " ".join(VEG[v][2] for v in vegs)
        back = f" Remettre {d(pr)} dans la poêle." if pr in RESERVE else ""
        steps.append(f"Dans la même poêle, faire revenir l'oignon{ail} 3 min. {veg_steps}")
        steps.append(sstep + back)
        steps.append(f"Goûter, rectifier l'assaisonnement et servir {d(pr)} et {'leurs' if plural(pr) else 'ses'} légumes avec {d(stv)}.")
        total = 10 + PROT_MIN[pr] + 3 + max(VEG[v][3] for v in vegs) + smin
        if stv == "pomme-de-terre": total = max(total, 28)
        tags = cooktime_tag(total) + (["légumineuses"] if pr in ("pois-chiches", "lentilles") else [pr.split("-")[0]]) + ["poêlée"]
        if sa == "soja": cuisine = "Asiatique"
        elif sa == "tomate": cuisine = "Méditerranéenne"
        else: cuisine = "Française"
        out.append(mk(title, "Poêlées", total, ["plaques"], tags, ings, steps, cuisine))
    return out


CURRY_PROT = {
    "poulet": ("Couper le poulet en dés de 2 cm.", "Faire dorer le poulet 5 min à feu vif dans la cocotte, avec les épices.", 8),
    "crevettes": ("Décortiquer les crevettes si nécessaire.", "Ajouter les crevettes en fin de cuisson : 3 min suffisent, dès qu'elles sont roses.", 4),
    "pois-chiches": ("Égoutter et rincer les pois chiches.", "Ajouter les pois chiches et laisser mijoter avec la sauce.", 5),
    "lentilles-corail": ("Rincer les lentilles corail.", "Ajouter les lentilles corail rincées et leur volume d'eau : elles cuisent en 15 min et épaississent la sauce.", 15),
    "tofu": ("Couper le tofu en cubes.", "Faire dorer le tofu 6 min dans la cocotte avant d'ajouter la sauce.", 8),
    "saumon": ("Couper le saumon en gros cubes.", "Déposer le saumon dans la sauce en fin de cuisson et cuire 5 min à feu doux, sans remuer.", 6),
    "boeuf": ("Couper le bœuf en petits cubes.", "Faire dorer le bœuf 5 min puis laisser mijoter 35 à 40 min à couvert pour qu'il devienne tendre.", 45),
}
CURRY_VEG = ["carotte", "courgette", "poivron", "epinards", "brocoli", "aubergine", "patate-douce", "chou-fleur", "haricots-verts", "champignons", "petits-pois"]


def currys(seed=2, limit=40):
    rng = random.Random(seed); combos = []
    for pr in CURRY_PROT:
        for v in CURRY_VEG:
            for base in ("coco", "tomate"):
                for stv in ("riz", "semoule"):
                    if pr == "boeuf" and base == "tomate": continue
                    combos.append((pr, v, base, stv))
    rng.shuffle(combos); out, used = [], set(); per = {}
    for pr, v, base, stv in combos:
        if per.get(pr, 0) >= 7: continue
        bname = "coco" if base == "coco" else "tomate"
        title = f"Curry {'de ' if pr not in ('oeufs',) else ''}{nm(pr)} et {VEG[v][0]} au lait de coco" if base == "coco" else f"Curry {'de ' if True else ''}{nm(pr)} et {VEG[v][0]} à la tomate"
        if title in used: continue
        used.add(title); per[pr] = per.get(pr, 0) + 1
        ings = [q(pr, 0.9 if pr == "boeuf" else 1), q("oignon", 1), q("ail", 1), q("gingembre", 0.5), q("curry", 1), q(v, 1), q("huile-olive", 0.5)]
        ings.append(q("lait-coco", 1) if base == "coco" else q("tomate-concassee", 0.6))
        if base == "tomate": ings.append(q("creme", 0.5))
        ings.append(q(stv, 1))
        steps = [STARCH[stv][0] if False else f"Émincer l'oignon, hacher l'ail et le gingembre, {VEG[v][1] if VEG[v][1] else 'préparer le légume'}. {CURRY_PROT[pr][0]}",
                 "Chauffer l'huile d'olive dans une cocotte, faire revenir l'oignon 3 min puis ajouter l'ail, le gingembre et le curry 1 min en remuant.",
                 CURRY_PROT[pr][1] if pr not in ("crevettes", "saumon", "lentilles-corail", "pois-chiches") else f"{VEG[v][2]}",
                 (f"Verser le lait de coco" if base == "coco" else "Verser la tomate concassée et la crème") + (", saler et laisser mijoter 12 min à feu doux." if pr not in ("boeuf",) else ", saler, couvrir et laisser mijoter."),
                 ]
        if pr in ("crevettes", "saumon", "lentilles-corail", "pois-chiches"):
            steps.insert(3, CURRY_PROT[pr][1]) if pr in ("lentilles-corail", "pois-chiches") else None
            if pr in ("crevettes", "saumon"): steps.append(CURRY_PROT[pr][1])
        else:
            steps.insert(3, VEG[v][2])
        steps.insert(2 if False else 0, STARCH[stv][0])
        steps.append(f"Rectifier l'assaisonnement et servir le curry sur {d(stv)}.")
        total = 15 + CURRY_PROT[pr][2] + 12
        tags = ["curry"] + (["végétarien"] if pr in ("pois-chiches", "lentilles-corail", "tofu") else []) + cooktime_tag(total)
        out.append(mk(title, "Curry", total, ["plaques"], tags, ings, steps, "Indienne" if base == "tomate" else "Exotique"))
    return out


SOUP_VEG = {  # légume -> (titre, préparation, minutes cuisson, ingrédients principaux)
    "carotte": ("carottes", "Éplucher les carottes et les couper en rondelles.", 20),
    "courgette": ("courgettes", "Laver les courgettes et les couper en morceaux (sans les éplucher).", 15),
    "potimarron": ("potimarron", "Couper le potimarron en cubes (la peau se mange après cuisson).", 20),
    "poireau": ("poireaux", "Laver les poireaux et les émincer.", 18),
    "brocoli": ("brocoli", "Détailler le brocoli en petits bouquets.", 12),
    "epinards": ("épinards", "Rincer les épinards.", 8),
    "tomate": ("tomates", "Couper les tomates en quartiers.", 20),
    "champignons": ("champignons", "Nettoyer et émincer les champignons.", 15),
    "patate-douce": ("patate douce", "Éplucher la patate douce et la couper en cubes.", 18),
    "chou-fleur": ("chou-fleur", "Détailler le chou-fleur en bouquets.", 18),
    "petits-pois": ("petits pois", "Rincer les petits pois (ou les utiliser surgelés).", 12),
    "lentilles-corail": ("lentilles corail", "Rincer les lentilles corail.", 18),
}
SOUP_FINISH = {
    "creme": ("et crème", [("creme", 0.6)], "Mixer finement, ajouter la crème, chauffer 1 min sans bouillir et poivrer."),
    "coco": ("et lait de coco", [("lait-coco", 0.8), ("curry", 0.5)], "Mixer finement avec le lait de coco et le curry, puis chauffer 2 min."),
    "fromage": ("et fromage", [("fromage-rape", 0.7)], "Mixer finement, puis servir en parsemant de fromage râpé."),
    "simple": ("", [], "Mixer finement jusqu'à obtenir un velouté lisse, rectifier le sel et le poivre."),
}


def soupes(seed=3, limit=32):
    rng = random.Random(seed); combos = []
    mains = list(SOUP_VEG)
    for v in mains:
        for f in SOUP_FINISH:
            if v == "lentilles-corail" and f in ("fromage",): continue
            combos.append((v, None, f))
            for v2 in ("pomme-de-terre", "carotte", "poireau", "courgette"):
                if v2 != v and not (v2 == "pomme-de-terre" and v in ("patate-douce", "potimarron")):
                    combos.append((v, v2, f))
    rng.shuffle(combos); out, used = [], set()
    for v, v2, f in combos:
        base = SOUP_VEG[v][0]; fr = SOUP_FINISH[f]
        v2name = {"pomme-de-terre": "pomme de terre", "carotte": "carotte", "poireau": "poireau", "courgette": "courgette"}.get(v2)
        lab = {"creme": "crème", "coco": "lait de coco", "fromage": "fromage", "simple": ""}[f]
        title = "Velouté de " + lst([base] + ([v2name] if v2name else []) + ([lab] if lab else []))
        if title in used: continue
        used.add(title)
        ings = [q(v, 1.0), q("oignon", 0.5), q("bouillon", 1.0), q("huile-olive", 0.5)]
        if v2: ings.append(q(v2, 0.6))
        for sid, m in fr[1]: ings.append(q(sid, m))
        mins = SOUP_VEG[v][2]
        steps = [SOUP_VEG[v][1] + (" Éplucher et couper la pomme de terre en cubes." if v2 == "pomme-de-terre" else (" Préparer aussi " + d(v2) + " en morceaux." if v2 else "")),
                 "Faire suer l'oignon émincé dans l'huile d'olive 3 min à feu moyen, sans coloration.",
                 f"Ajouter les légumes, mouiller avec 50 cl de bouillon de légumes chaud et porter à ébullition. Couvrir et cuire {mins} min à petit feu, jusqu'à ce que tout soit tendre.",
                 fr[2], "Servir bien chaud, avec un filet d'huile d'olive ou du pain grillé."]
        total = 10 + 3 + mins + 5
        tags = ["soupe", "économique"] + (["végétarien"] if True else []) + cooktime_tag(total)
        out.append(mk(title, "Soupes", total, ["plaques", "mixeur"], tags, ings, steps, "Française", ("Dîner", "Déjeuner")))
        if len(out) >= limit: break
    return out


SAL_BASE = {"riz": ("riz", "Cuire le riz 10 à 12 min à l'eau bouillante salée, l'égoutter et le rincer à l'eau froide pour le refroidir."),
            "pates": ("pâtes", "Cuire les pâtes 9 à 11 min à l'eau bouillante salée, les égoutter, les rincer à l'eau froide et les huiler légèrement."),
            "semoule": ("semoule", "Hydrater la semoule dans un volume égal d'eau bouillante salée 5 min, puis l'égrener à la fourchette."),
            "quinoa": ("quinoa", "Cuire le quinoa 12 min dans deux fois son volume d'eau salée, égoutter et laisser refroidir."),
            "lentilles": ("lentilles", "Égoutter et rincer les lentilles cuites (ou les cuire 20 min à l'eau frémissante)."),
            "pois-chiches": ("pois chiches", "Égoutter et rincer les pois chiches."),
            "pomme-de-terre": ("pommes de terre", "Cuire les pommes de terre 15 à 18 min à l'eau salée, les égoutter et les couper en rondelles encore tièdes.")}
SAL_PROT = {"thon": "Émietter le thon égoutté.", "poulet": "Cuire le poulet en dés 8 min à la poêle, saler et poivrer, laisser tiédir.",
            "oeufs": "Cuire les œufs 10 min dans l'eau bouillante, les rafraîchir puis les écaler et les couper en quartiers.",
            "feta": "Couper la feta en cubes.", "chevre": "Faire dorer le fromage de chèvre en rondelles 3 min sous le gril du four.",
            "jambon": "Couper le jambon en lanières.", "crevettes": "Saisir les crevettes 2 à 3 min de chaque côté à la poêle.",
            "saumon": "Cuire le saumon 4 min de chaque côté à la poêle puis l'émietter.", "mozzarella": "Égoutter la mozzarella et la couper en morceaux.", "halloumi": "Faire dorer le halloumi en tranches 2 min de chaque côté."}
SAL_VEG = {"tomate": "Couper les tomates en dés.", "concombre": "Couper le concombre en demi-rondelles.", "poivron": "Épépiner le poivron et le couper en petits dés.",
           "carotte": "Râper les carottes.", "avocat": "Couper l'avocat en tranches juste avant de servir.", "mais": "Égoutter le maïs.", "oignon-rouge": "Émincer finement l'oignon rouge.",
           "courgette": "Couper la courgette en fins rubans à l'économe.", "salade": "Laver et essorer la salade.", "olives": "Égoutter les olives.", "tomate-cerise": "Couper les tomates cerises en deux.",
           "fenouil": "Émincer très finement le fenouil.", "champignons": "Émincer les champignons crus."}
SAL_COMBOS = [
    ("riz", "thon", ["tomate", "mais", "concombre"]), ("riz", "crevettes", ["avocat", "concombre", "citron"]), ("riz", "saumon", ["avocat", "concombre"]), ("riz", "poulet", ["carotte", "mais", "concombre"]),
    ("pates", "thon", ["tomate-cerise", "olives", "poivron"]), ("pates", "mozzarella", ["tomate-cerise", "salade"]), ("pates", "poulet", ["poivron", "tomate", "mais"]), ("pates", "feta", ["concombre", "tomate", "olives"]),
    ("pates", "jambon", ["mais", "poivron", "carotte"]), ("semoule", "poulet", ["concombre", "tomate", "poivron"]), ("semoule", "feta", ["concombre", "tomate-cerise", "oignon-rouge"]),
    ("semoule", "thon", ["tomate", "concombre", "poivron"]), ("quinoa", "feta", ["concombre", "tomate-cerise", "avocat"]), ("quinoa", "poulet", ["avocat", "carotte", "mais"]),
    ("quinoa", "saumon", ["avocat", "concombre", "oignon-rouge"]), ("lentilles", "chevre", ["carotte", "oignon-rouge", "salade"]), ("lentilles", "feta", ["tomate", "oignon-rouge", "concombre"]),
    ("lentilles", "oeufs", ["carotte", "oignon-rouge", "salade"]), ("lentilles", "saumon", ["fenouil", "oignon-rouge"]), ("pois-chiches", "feta", ["concombre", "tomate", "oignon-rouge"]),
    ("pois-chiches", "thon", ["tomate", "poivron", "oignon-rouge"]), ("pois-chiches", "halloumi", ["tomate-cerise", "concombre", "salade"]), ("pois-chiches", "poulet", ["carotte", "poivron", "concombre"]),
    ("pomme-de-terre", "oeufs", ["oignon-rouge", "salade"]), ("pomme-de-terre", "thon", ["tomate", "oignon-rouge", "olives"]), ("pomme-de-terre", "jambon", ["oignon-rouge", "salade"]),
    ("pomme-de-terre", "saumon", ["concombre", "oignon-rouge"]), ("riz", "oeufs", ["avocat", "mais", "tomate"]), ("quinoa", "halloumi", ["tomate-cerise", "concombre", "salade"]),
    ("semoule", "crevettes", ["concombre", "tomate-cerise", "poivron"]), ("pates", "saumon", ["concombre", "salade"]), ("quinoa", "chevre", ["salade", "fenouil", "oignon-rouge"]),
]
DRESS = [("vinaigrette à la moutarde", [("huile-olive", 1), ("vinaigre", 0.7), ("moutarde", 0.7)], "Mélanger l'huile d'olive, le vinaigre, la moutarde, du sel et du poivre pour la vinaigrette."),
         ("sauce citron", [("huile-olive", 1), ("citron", 0.5)], "Presser le citron avec l'huile d'olive, saler et poivrer."),
         ("sauce yaourt-herbes", [("yaourt", 0.5), ("herbes-fraiches", 0.5)], "Mélanger le yaourt, les herbes ciselées, du sel et du poivre.")]


def salades(seed=4, limit=36):
    rng = random.Random(seed); out, used = [], set()
    for idx, (b, pr, vs) in enumerate(SAL_COMBOS):
        dr = DRESS[(idx + rng.randint(0, 2)) % 3]
        if pr in ("crevettes", "saumon") and dr[0] == "sauce yaourt-herbes" and b == "riz": dr = DRESS[1]
        bn = SAL_BASE[b][0]
        vtitle = [("tomates" if v == "tomate" else K[v]["n"].lower()) for v in vs if v not in ("olives", "mais", "citron")][:2]
        title = f"Salade de {bn}, " + lst([("thon" if pr == "thon" else nm(pr))] + vtitle)
        if title in used: continue
        used.add(title)
        ings = [q(b, 1.0 if b != "pomme-de-terre" else 0.8), q(pr, 0.8 if pr in ("poulet", "saumon", "crevettes") else 1)]
        for v in vs:
            if v == "citron": continue
            ings.append(q(v, 0.7))
        ings += [q(i, m) for i, m in dr[1]]
        vp = [SAL_VEG[v] for v in vs if v in SAL_VEG]
        steps = [SAL_BASE[b][1], SAL_PROT[pr], "Préparer les légumes : " + " ".join(vp)] + [dr[2],
                 "Mélanger la base, la protéine et les légumes dans un saladier, verser la sauce et remuer délicatement. Laisser reposer 10 min au frais avant de servir."]
        steps = [s for s in steps if s]
        total = {"riz": 25, "pates": 22, "semoule": 15, "quinoa": 25, "lentilles": 15, "pois-chiches": 12, "pomme-de-terre": 30}[b] + (8 if pr in ("poulet", "saumon", "crevettes", "oeufs") else 3)
        tags = ["salade", "froid"] + (["végétarien"] if pr in ("oeufs", "feta", "chevre", "mozzarella", "halloumi") else []) + cooktime_tag(total)
        out.append(mk(title, "Salades", total, ["plaques"] if pr in ("poulet", "crevettes", "saumon", "oeufs", "halloumi") or b != "lentilles" else [], tags, ings, steps, "Méditerranéenne" if pr in ("feta", "mozzarella", "halloumi") else "Française"))
    return out[:limit]


GR_BASE = {"pomme-de-terre": ("pommes de terre", "Éplucher les pommes de terre et les couper en fines rondelles (3 mm).", 40), "courgette": ("courgettes", "Couper les courgettes en rondelles et les faire revenir 5 min à la poêle pour retirer l'eau.", 30),
           "brocoli": ("brocoli", "Cuire les bouquets de brocoli 5 min à l'eau bouillante salée, puis égoutter.", 25), "chou-fleur": ("chou-fleur", "Cuire les bouquets de chou-fleur 8 min à l'eau bouillante salée, puis égoutter.", 30),
           "poireau": ("poireaux", "Émincer les poireaux et les faire fondre 8 min à la poêle avec un peu de beurre.", 30), "pates": ("pâtes", "Cuire les pâtes 3 min de moins que le temps indiqué sur le paquet, puis égoutter.", 25),
           "gnocchis": ("gnocchis", "Plonger les gnocchis 2 min dans l'eau bouillante salée, puis égoutter.", 25), "aubergine": ("aubergines", "Couper les aubergines en rondelles et les faire dorer 4 min de chaque côté à la poêle.", 35),
           "patate-douce": ("patate douce", "Éplucher la patate douce, la couper en rondelles et la précuire 8 min à l'eau bouillante.", 35), "epinards": ("épinards", "Faire tomber les épinards 3 min à la poêle avec une noix de beurre, puis les égoutter.", 25)}
GR_ADD = {"jambon": "Couper le jambon en lanières et le mélanger aux légumes.", "lardons": "Faire dorer les lardons 4 min à la poêle sans matière grasse, puis les égoutter.",
          "thon": "Émietter le thon égoutté et le répartir dans le plat.", "chevre": "Couper le fromage de chèvre en rondelles pour le disposer sur le dessus.", "saumon": "Couper le saumon en dés et le répartir dans le plat.",
          "poulet": "Faire dorer le poulet en dés 6 min à la poêle, saler et poivrer.", "champignons": "Faire revenir les champignons émincés 6 min à la poêle.", "chorizo": "Couper le chorizo en rondelles et le faire dorer 2 min.",
          "feta": "Émietter la feta sur les légumes.", "mozzarella": "Couper la mozzarella en tranches pour la disposer sur le dessus.", "tomate": "Couper les tomates en rondelles et les ajouter dans le plat.", "boeuf-hache": "Faire cuire le bœuf haché 6 min avec l'oignon, saler et poivrer."}
GR_SAUCE = {"creme": ("à la crème", [("creme", 1)], "Mélanger la crème avec du sel, du poivre et une pincée de muscade (facultatif)."),
            "bechamel": ("à la béchamel", [("bechamel", 1)], "Réchauffer la béchamel et la poivrer."),
            "tomate": ("à la tomate", [("tomate-concassee", 0.7), ("herbes-provence", 1)], "Mélanger la tomate concassée avec les herbes de Provence, du sel et du poivre.")}
GR_PAIRS = [("pomme-de-terre", "jambon", "creme"), ("pomme-de-terre", "lardons", "creme"), ("pomme-de-terre", "champignons", "creme"), ("pomme-de-terre", "chevre", "creme"), ("pomme-de-terre", "saumon", "creme"),
            ("courgette", "chevre", "creme"), ("courgette", "thon", "tomate"), ("courgette", "jambon", "bechamel"), ("courgette", "feta", "tomate"), ("courgette", "poulet", "creme"), ("courgette", "mozzarella", "tomate"),
            ("brocoli", "jambon", "bechamel"), ("brocoli", "saumon", "creme"), ("brocoli", "poulet", "bechamel"), ("brocoli", "chevre", "creme"), ("brocoli", "lardons", "creme"),
            ("chou-fleur", "jambon", "bechamel"), ("chou-fleur", "lardons", "bechamel"), ("chou-fleur", "chevre", "creme"), ("poireau", "jambon", "bechamel"), ("poireau", "saumon", "creme"), ("poireau", "lardons", "creme"),
            ("pates", "jambon", "bechamel"), ("pates", "thon", "tomate"), ("pates", "poulet", "creme"), ("pates", "boeuf-hache", "tomate"), ("pates", "champignons", "creme"), ("pates", "chorizo", "tomate"),
            ("gnocchis", "mozzarella", "tomate"), ("gnocchis", "jambon", "creme"), ("gnocchis", "poulet", "creme"), ("gnocchis", "chorizo", "tomate"), ("aubergine", "mozzarella", "tomate"), ("aubergine", "boeuf-hache", "tomate"),
            ("patate-douce", "chevre", "creme"), ("patate-douce", "lardons", "creme"), ("epinards", "saumon", "creme"), ("epinards", "poulet", "bechamel"), ("epinards", "chevre", "creme")]


def gratins(seed=5, limit=40):
    out, used = [], set()
    for b, add, sa in GR_PAIRS:
        gb = GR_BASE[b]; gs = GR_SAUCE[sa]
        if sa == "tomate" and add == "tomate": continue
        title = f"Gratin de {gb[0]} {nm(add) if False else ''}".strip()
        addname = {"jambon": "au jambon", "lardons": "aux lardons", "champignons": "aux champignons", "chevre": "au chèvre", "saumon": "au saumon", "thon": "au thon", "feta": "à la feta", "poulet": "au poulet", "mozzarella": "à la mozzarella", "chorizo": "au chorizo", "boeuf-hache": "au bœuf haché"}[add]
        title = f"Gratin de {gb[0]} {addname} {gs[0]}" if not (sa == "creme" and b == "pomme-de-terre") else f"Gratin de {gb[0]} {addname}"
        if title in used: continue
        used.add(title)
        qb = 1.0 if b not in ("pates", "gnocchis") else 0.85
        ings = [q(b, qb), q(add, 0.6 if add in ("jambon", "lardons", "chorizo", "chevre", "feta", "mozzarella", "champignons") else 0.8)]
        ings += [q(i, m) for i, m in gs[1]] + [q("fromage-rape", 0.8), q("beurre", 0.3)]
        if add == "boeuf-hache": ings.append(q("oignon", 0.5))
        steps = ["Préchauffer le four à 200 °C (chaleur tournante : 180 °C). Beurrer un plat à gratin.", gb[1], GR_ADD[add], gs[2],
                 f"Répartir {d(b)} dans le plat avec {d(add)}, napper de sauce, puis parsemer de fromage râpé et de quelques noisettes de beurre.",
                 f"Enfourner {gb[2] if b=='pomme-de-terre' else 20} min, jusqu'à ce que le dessus soit bien doré. Laisser reposer 5 min avant de servir."]
        total = 20 + gb[2] if b == "pomme-de-terre" else 15 + gb[2] - 5 + 10
        out.append(mk(title, "Gratins", total, ["four"], ["four", "réconfort", "familial"] + (["végétarien"] if add in ("chevre", "feta", "mozzarella", "champignons") else []), ings, steps))
    return out[:limit]
