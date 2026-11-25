# -*- coding: utf-8 -*-
"""Familles supplémentaires (v1.3). Mêmes règles : quantités réalistes, étapes précises, chaque ingrédient cité."""
import random
from gen_core import *

# compléments : de / au / aux / à la …
AU = {
    'champignons': 'aux champignons', 'epinards': 'aux épinards', 'jambon': 'au jambon', 'lardons': 'aux lardons', 'fromage-rape': 'au fromage',
    'chevre': 'au chèvre', 'feta': 'à la feta', 'tomate': 'à la tomate', 'courgette': 'à la courgette', 'poivron': 'au poivron',
    'pomme-de-terre': 'aux pommes de terre', 'saumon-fume': 'au saumon fumé', 'ciboulette': 'à la ciboulette', 'oignon': "à l'oignon",
    'mozzarella': 'à la mozzarella', 'chorizo': 'au chorizo', 'poulet': 'au poulet', 'poireau': 'aux poireaux', 'saumon': 'au saumon',
    'thon': 'au thon', 'brocoli': 'au brocoli', 'emmental': "à l'emmental", 'olives': 'aux olives', 'oignon-rouge': "à l'oignon rouge",
    'tomate-cerise': 'aux tomates cerises', 'aubergine': "à l'aubergine", 'pesto': 'au pesto', 'creme': 'à la crème', 'fromage-bleu': 'au gorgonzola',
    'parmesan': 'au parmesan', 'asperges': 'aux asperges', 'petits-pois': 'aux petits pois', 'potimarron': 'au potimarron', 'crevettes': 'aux crevettes',
    'citron': 'au citron', 'reblochon': 'au reblochon', 'ricotta': 'à la ricotta', 'boeuf-hache': 'au bœuf haché', 'lardons-oignon': 'aux lardons',
}

# ---------- garnitures cuites à la poêle (omelettes, quiches, gnocchis) ----------
FILL = {  # id -> (préparation/cuisson, a besoin de cuire ?)
    'champignons': ("Émincer les champignons et les faire revenir 6 min à feu vif jusqu'à évaporation de leur eau.", True),
    'epinards': ("Faire tomber les épinards 3 min à la poêle, puis les presser pour retirer l'eau.", True),
    'lardons': ("Faire dorer les lardons 4 min à la poêle sans matière grasse.", True),
    'courgette': ("Couper la courgette en petits dés et la faire revenir 6 min.", True),
    'poivron': ("Couper le poivron en lanières et le faire revenir 7 min.", True),
    'oignon': ("Émincer l'oignon et le faire fondre 5 min à feu doux.", True),
    'poireau': ("Émincer le poireau et le faire fondre 8 min à feu doux.", True),
    'pomme-de-terre': ("Couper les pommes de terre en petits dés, les cuire 10 min à l'eau salée puis les faire dorer 5 min.", True),
    'brocoli': ("Détailler le brocoli en petits bouquets et le cuire 5 min à l'eau bouillante salée.", True),
    'chorizo': ("Couper le chorizo en rondelles et le faire dorer 2 min.", True),
    'jambon': ("Couper le jambon en lanières.", False), 'saumon-fume': ("Couper le saumon fumé en lanières.", False),
    'tomate': ("Couper les tomates en dés et les égoutter.", False), 'tomate-cerise': ("Couper les tomates cerises en deux.", False),
    'chevre': ("Couper le fromage de chèvre en rondelles.", False), 'feta': ("Émietter la feta.", False), 'mozzarella': ("Couper la mozzarella en dés.", False),
    'fromage-rape': ("", False), 'emmental': ("Couper l'emmental en petits dés.", False), 'thon': ("Égoutter et émietter le thon.", False),
    'saumon': ("Couper le saumon en petits dés.", False), 'ciboulette': ("Ciseler la ciboulette.", False), 'olives': ("Égoutter les olives et les couper en rondelles.", False),
    'ricotta': ("", False), 'fromage-bleu': ("Couper le gorgonzola en petits morceaux.", False), 'parmesan': ("Râper le parmesan.", False),
}
CHEESES = {'chevre', 'feta', 'mozzarella', 'fromage-rape', 'emmental', 'ricotta', 'fromage-bleu', 'parmesan'}


def _fill_steps(fills):
    out = [FILL[f][0] for f in fills if FILL[f][0]]
    return out


def omelettes():
    pairs = [('champignons', 'chevre'), ('champignons', 'ciboulette'), ('epinards', 'feta'), ('epinards', 'chevre'), ('jambon', 'fromage-rape'), ('lardons', 'oignon'),
             ('lardons', 'pomme-de-terre'), ('courgette', 'feta'), ('courgette', 'chevre'), ('poivron', 'chorizo'), ('poivron', 'feta'), ('tomate', 'mozzarella'),
             ('saumon-fume', 'ciboulette'), ('pomme-de-terre', 'oignon'), ('champignons', 'jambon'), ('poireau', 'chevre'), ('brocoli', 'emmental'),
             ('tomate-cerise', 'feta'), ('chorizo', 'pomme-de-terre'), ('epinards', 'champignons'), ('oignon', 'fromage-rape'), ('jambon', 'champignons')]
    out, seen = [], set()
    for a, b in pairs:
        key = frozenset((a, b))
        if key in seen: continue
        seen.add(key)
        title = f"Omelette {AU[a]} et {AU[b]}"
        cooked = [x for x in (a, b) if FILL[x][1]]
        salty = [x for x in (a, b) if x in ('jambon', 'lardons', 'saumon-fume', 'feta', 'chorizo')]
        ings = [q('oeufs', 1), q(a, 0.6), q(b, 0.5 if b in CHEESES else 0.6), q('beurre', 0.5)] + ([q('huile-olive', 0.3)] if cooked else [])
        steps = []
        if cooked: steps.append("Chauffer un filet d'huile d'olive dans une poêle. " + " ".join(FILL[x][0] for x in cooked) + " Réserver la garniture.")
        raw = [FILL[x][0] for x in (a, b) if not FILL[x][1] and FILL[x][0]]
        if raw: steps.append(" ".join(raw))
        steps.append("Battre les œufs en omelette avec du poivre et une pincée de sel" + (" (pas plus : " + d(salty[0]) + (" sont" if plural(salty[0]) else " est") + " déjà salé" + ("s" if plural(salty[0]) else "") + ")." if salty else "."))
        steps.append("Faire fondre le beurre dans la poêle à feu moyen, verser les œufs et remuer 30 secondes. Répartir la garniture" + (" et le fromage râpé" if "fromage-rape" in (a, b) else "") + " et laisser prendre 2 à 3 min.")
        steps.append("Plier l'omelette en deux et servir aussitôt, avec une salade verte.")
        t = 10 + (12 if 'pomme-de-terre' in (a, b) else 6 if cooked else 0)
        out.append(mk(title, "Œufs", t, ["plaques"], ["œufs"] + cooktime_tag(t), ings, steps))
    return out


def quiches():
    pairs = [('lardons', 'champignons'), ('jambon', 'emmental'), ('thon', 'tomate'), ('poireau', 'lardons'), ('epinards', 'chevre'), ('brocoli', 'emmental'),
             ('courgette', 'chevre'), ('champignons', 'jambon'), ('saumon', 'poireau'), ('tomate', 'mozzarella'), ('poivron', 'chorizo'), ('oignon', 'lardons'),
             ('epinards', 'feta'), ('champignons', 'chevre'), ('thon', 'olives'), ('courgette', 'tomate'), ('brocoli', 'saumon'), ('poireau', 'emmental'),
             ('pomme-de-terre', 'lardons'), ('epinards', 'saumon-fume')]
    out = []
    for a, b in pairs:
        title = f"Quiche {AU[a]} et {AU[b]}"
        ings = [q('pate-brisee', 1), q(a, 0.8), q(b, 0.6 if b in CHEESES else 0.8), q('oeufs', 0.75), q('creme', 2), q('lait', 0.5)]
        if not (a in CHEESES or b in CHEESES): ings.append(q('fromage-rape', 0.8))
        steps = ["Préchauffer le four à 180 °C. Étaler la pâte dans un moule et la piquer à la fourchette."] + _fill_steps((a, b))
        steps.append(f"Répartir la garniture sur la pâte.")
        steps.append("Battre les œufs avec la crème et le lait, saler (peu si la garniture est salée) et poivrer. Verser sur la garniture" + (", parsemer de fromage râpé." if not (a in CHEESES or b in CHEESES) else "."))
        steps.append("Enfourner 35 min, jusqu'à ce que la quiche soit dorée et prise au centre. Laisser tiédir 5 min avant de couper.")
        out.append(mk(title, "Tartes & pizzas", 55, ["four"], ["four", "tarte", "familial"], ings, steps, serv=4))
    return out


def pizzas():
    combos = [('creme', 'lardons', 'oignon-rouge'), ('tomate', 'thon', 'olives'), ('tomate', 'poulet', 'poivron'), ('creme', 'saumon-fume', 'epinards'),
              ('tomate', 'champignons', 'chorizo'), ('tomate', 'aubergine', 'feta'), ('creme', 'poireau', 'lardons'), ('tomate', 'courgette', 'chevre'),
              ('pesto', 'tomate-cerise', 'mozzarella-only'), ('tomate', 'jambon', 'olives'), ('creme', 'pomme-de-terre', 'lardons'), ('tomate', 'boeuf-hache', 'oignon-rouge'),
              ('creme', 'champignons', 'chevre'), ('tomate', 'epinards', 'ricotta'), ('tomate', 'poivron', 'oignon-rouge'), ('creme', 'poulet', 'champignons'),
              ('tomate', 'crevettes', 'tomate-cerise'), ('creme', 'brocoli', 'fromage-bleu'), ('tomate', 'thon', 'oignon-rouge'), ('creme', 'jambon', 'champignons')]
    TOP = {'lardons': "Faire dorer les lardons 3 min à la poêle.", 'oignon-rouge': "Émincer finement l'oignon rouge.", 'thon': "Égoutter le thon.", 'olives': "Couper les olives en rondelles.",
           'poulet': "Couper le poulet en fines lanières et le saisir 4 min à la poêle.", 'poivron': "Couper le poivron en fines lanières.", 'saumon-fume': "Couper le saumon fumé en lanières (il s'ajoute à la sortie du four).",
           'epinards': "Faire tomber les épinards 2 min à la poêle et les presser.", 'champignons': "Émincer finement les champignons.", 'chorizo': "Couper le chorizo en fines rondelles.",
           'aubergine': "Couper l'aubergine en fines rondelles et les faire griller 3 min de chaque côté à la poêle.", 'feta': "Émietter la feta.", 'poireau': "Émincer le poireau et le faire fondre 6 min à la poêle.",
           'courgette': "Couper la courgette en très fines rondelles.", 'chevre': "Couper le chèvre en rondelles.", 'tomate-cerise': "Couper les tomates cerises en deux.", 'jambon': "Couper le jambon en morceaux.",
           'pomme-de-terre': "Couper les pommes de terre en fines rondelles et les précuire 8 min à l'eau bouillante.", 'boeuf-hache': "Faire cuire le bœuf haché 5 min à la poêle en l'émiettant, saler, poivrer.",
           'ricotta': "Déposer la ricotta par petites cuillères.", 'crevettes': "Décortiquer les crevettes si nécessaire.", 'brocoli': "Détailler le brocoli en tout petits bouquets et le cuire 4 min à l'eau bouillante.",
           'fromage-bleu': "Couper le gorgonzola en morceaux."}
    out = []
    for base, a, b in combos:
        items = [a] + ([] if b == 'mozzarella-only' else [b])
        title = "Pizza " + " et ".join(AU[x] for x in items)
        if base == 'pesto': title = "Pizza au pesto, tomates cerises et mozzarella"
        ings = [q('pate-pizza', 1)]
        ings.append(q('tomate-concassee', 0.4) if base == 'tomate' else q('creme', 1) if base == 'creme' else q('pesto', 1.2))
        for x in items: ings.append(q(x, 0.5 if x in CHEESES or x in ('olives', 'saumon-fume') else 0.6))
        if 'mozzarella' not in items and not any(x in CHEESES for x in items): ings.append(q('mozzarella', 1))
        elif b == 'mozzarella-only': ings.append(q('mozzarella', 1))
        has_moz = any(x[0] == 'mozzarella' for x in ings)
        base_txt = {'tomate': "tomate concassée", 'creme': "crème", 'pesto': "pesto"}[base]
        steps = ["Préchauffer le four à 240 °C (ou au maximum) avec la plaque à l'intérieur."] + [TOP[x] for x in items if x in TOP]
        steps.append(f"Étaler la pâte sur du papier cuisson, la napper de {base_txt}, saler légèrement et poivrer.")
        steps.append("Répartir la garniture" + (" et la mozzarella en morceaux" if has_moz else "") + (" (sauf le saumon fumé)" if 'saumon-fume' in items else "") + ".")
        steps.append("Enfourner 12 à 14 min, jusqu'à ce que la pâte soit bien dorée." + (" Ajouter le saumon fumé à la sortie du four." if 'saumon-fume' in items else ""))
        out.append(mk(title, "Tartes & pizzas", 30, ["four"], ["four", "pizza"], ings, steps, "Italienne"))
    return out


def gnocchis():
    combos = [('champignons', 'creme'), ('epinards', 'fromage-bleu'), ('lardons', 'creme'), ('tomate-cerise', 'mozzarella'), ('courgette', 'parmesan'), ('pesto', 'tomate-cerise'),
              ('chorizo', 'poivron'), ('epinards', 'ricotta'), ('champignons', 'lardons'), ('poireau', 'creme'), ('brocoli', 'parmesan'), ('poivron', 'feta'),
              ('epinards', 'champignons'), ('tomate', 'mozzarella'), ('courgette', 'chevre'), ('jambon', 'creme')]
    out = []
    for a, b in combos:
        title = f"Gnocchis poêlés {AU[a]} et {AU[b]}"
        ings = [q('gnocchis', 1), q('beurre', 0.6)]
        for x in (a, b):
            ings.append(q(x, 1 if x in ('creme', 'pesto') else 0.5 if x in CHEESES else 0.7))
        steps = []
        cooked = [FILL[x][0] for x in (a, b) if x in FILL and FILL[x][1]]
        steps += cooked
        steps.append("Faire dorer les gnocchis 6 à 8 min dans le beurre à feu moyen, en les retournant, jusqu'à ce qu'ils soient croustillants (inutile de les cuire à l'eau).")
        fin = []
        for x in (a, b):
            if x == 'creme': fin.append("verser la crème et laisser épaissir 2 min")
            elif x == 'pesto': fin.append("ajouter le pesto hors du feu")
            elif x in FILL and not FILL[x][1]:
                fin.append({'tomate-cerise': "ajouter les tomates cerises coupées en deux 2 min", 'mozzarella': "ajouter la mozzarella en dés hors du feu", 'parmesan': "parsemer de parmesan râpé",
                            'fromage-bleu': "ajouter le gorgonzola en morceaux et laisser fondre 1 min", 'ricotta': "ajouter la ricotta par cuillerées", 'feta': "parsemer de feta émiettée",
                            'chevre': "ajouter le chèvre en morceaux et laisser fondre 1 min", 'tomate': "ajouter les tomates en dés 3 min", 'jambon': "ajouter le jambon en lanières 1 min"}.get(x, f"ajouter {d(x)}"))
        steps.append("Remettre la garniture cuite dans la poêle, " + ", puis ".join(fin) + ". Poivrer et servir aussitôt." if cooked else cap(", puis ".join(fin)) + ". Poivrer et servir aussitôt.")
        out.append(mk(title, "Pâtes", 20, ["plaques"], ["gnocchis"] + cooktime_tag(20), ings, steps, "Italienne"))
    return out


def risottos():
    combos = [('courgette', 'parmesan', "Couper la courgette en petits dés."), ('poireau', 'parmesan', "Émincer finement le poireau."), ('asperges', 'parmesan', "Couper les asperges en tronçons en gardant les pointes."),
              ('petits-pois', 'jambon', ""), ('potimarron', 'parmesan', "Couper le potimarron en petits dés (la peau se mange)."), ('epinards', 'chevre', ""),
              ('tomate', 'mozzarella', "Couper les tomates en dés."), ('saumon', 'citron', "Couper le saumon en dés."), ('chorizo', 'poivron', "Couper le chorizo en dés et le poivron en petits morceaux."),
              ('crevettes', 'citron', "Décortiquer les crevettes."), ('champignons', 'lardons', "Émincer les champignons."), ('poulet', 'champignons', "Couper le poulet en petits dés et émincer les champignons.")]
    out = []
    for a, b, prep in combos:
        title = f"Risotto {AU[a]} et {AU[b]}"
        ings = [q('riz-risotto', 1), q('oignon', 0.5), q('bouillon', 1.5), q('beurre', 1), q(a, 0.7), q(b, 0.5 if b in CHEESES else 0.6)]
        if 'parmesan' not in (a, b): ings.append(q('parmesan', 0.5))
        steps = ["Faire chauffer le bouillon (75 cl) et le garder frémissant. Émincer l'oignon." + (" " + prep if prep else "")]
        early = {'poireau': "Ajouter le poireau avec l'oignon.", 'potimarron': "Ajouter le potimarron avec le riz.", 'chorizo': "Faire dorer le chorizo et le poivron 4 min avant l'oignon.", 'lardons': "Faire dorer les lardons 4 min avant l'oignon.", 'poulet': "Faire dorer le poulet 5 min, le réserver, puis cuire les champignons 5 min avant l'oignon."}
        steps.append("Faire fondre la moitié du beurre, faire suer l'oignon 3 min sans coloration. " + " ".join(early[x] for x in (a, b) if x in early) + " Ajouter le riz et le nacrer 2 min en remuant.".strip())
        late = {'courgette': "la courgette 8 min avant la fin", 'asperges': "les asperges 8 min avant la fin", 'petits-pois': "les petits pois 5 min avant la fin", 'epinards': "les épinards 2 min avant la fin",
                'tomate': "les tomates 5 min avant la fin", 'saumon': "le saumon 4 min avant la fin", 'crevettes': "les crevettes 4 min avant la fin", 'champignons': "les champignons 6 min avant la fin" if a == 'champignons' else None, 'poulet': "le poulet 5 min avant la fin"}
        lt = [late[x] for x in (a, b) if late.get(x)]
        steps.append("Verser le bouillon louche par louche en remuant, en attendant que chaque louche soit absorbée (environ 18 min)." + (" Ajouter " + " et ".join(lt) + "." if lt else ""))
        fin = {'jambon': "le jambon en lanières", 'chevre': "le chèvre en morceaux", 'mozzarella': "la mozzarella en dés", 'citron': "le zeste et le jus du citron"}
        ft = [fin[x] for x in (a, b) if x in fin]
        steps.append("Hors du feu, incorporer le reste du beurre, le parmesan" + (", " + ", ".join(ft) if ft else "") + ". Poivrer, couvrir 2 min et servir.")
        out.append(mk(title, "Riz", 40, ["plaques"], ["riz", "réconfort"], ings, steps, "Italienne", diff="Intermédiaire"))
    return out


WOK_PROT = {'poulet': ("au poulet", "Couper le poulet en fines lanières.", "Saisir le poulet 5 min à feu vif, puis le réserver."), 'boeuf': ("au bœuf", "Couper le bœuf en fines lanières.", "Saisir le bœuf 2 min à feu très vif, puis le réserver."),
            'crevettes': ("aux crevettes", "Décortiquer les crevettes.", "Saisir les crevettes 2 min de chaque côté, puis les réserver."), 'tofu': ("au tofu", "Presser le tofu et le couper en cubes.", "Faire dorer le tofu 6 min, puis le réserver."),
            'porc': ("au porc", "Couper le porc en fines lanières.", "Saisir le porc 5 min à feu vif, puis le réserver."), 'oeufs': ("aux œufs", "Battre les œufs avec une pincée de sel.", "Cuire les œufs brouillés 1 min en remuant, puis les réserver.")}
WOK_VEG = [('poivron', 'carotte'), ('brocoli', 'carotte'), ('courgette', 'champignons'), ('chou', 'carotte'), ('poivron', 'champignons'), ('haricots-verts', 'carotte'), ('epinards', 'champignons'), ('brocoli', 'poivron')]
WOK_SAUCE = {'soja': ("sauce soja-miel", [('sauce-soja', 1.5), ('miel', 1), ('ail', 0.5)], "la sauce soja, le miel et l'ail haché"),
             'gingembre': ("soja-gingembre", [('sauce-soja', 1.5), ('gingembre', 1), ('ail', 1)], "la sauce soja, le gingembre râpé et l'ail haché"),
             'coco': ("au curry et lait de coco", [('lait-coco', 0.8), ('curry', 1)], "le lait de coco et le curry"),
             'cacahuete': ("sauce cacahuète", [('cacahuete', 1), ('sauce-soja', 1), ('citron-vert', 1)], "le beurre de cacahuète détendu avec la sauce soja et le jus du citron vert")}
VEG_WOK = {'chou': ("chou", "émincer finement le chou", "Ajouter le chou et le faire sauter 5 min.", 5)}
WOK_MIN = {'carotte': 4, 'poivron': 3, 'brocoli': 4, 'courgette': 3, 'champignons': 4, 'chou': 3, 'haricots-verts': 6, 'epinards': 1}


def woks(seed=7, limit=40):
    rng = random.Random(seed); combos = [(p, v, s) for p in WOK_PROT for v in WOK_VEG for s in WOK_SAUCE]
    rng.shuffle(combos); out, used, per = [], set(), {}
    VV = {**VEG, **VEG_WOK}
    for p, vs, s in combos:
        if per.get(p, 0) >= 7: continue
        if p == 'oeufs' and s == 'coco': continue
        title = f"Nouilles sautées {WOK_PROT[p][0]}, {lst([VV[v][0] for v in vs])}, {WOK_SAUCE[s][0]}"
        if title in used: continue
        used.add(title); per[p] = per.get(p, 0) + 1
        ings = [q('nouilles', 1), q(p, 0.5 if p == 'oeufs' else 0.8), q('huile-olive', 0.5)] + [q(v, 0.6) for v in vs] + [q(i, m) for i, m in WOK_SAUCE[s][1]]
        top = 'cacahuetes' if s == 'cacahuete' else ('sesame' if s in ('soja', 'gingembre') else 'coriandre')
        ings.append(q(top, 0.5 if top != 'coriandre' else 0.5))
        preps = [VV[v][1] for v in vs if VV[v][1]]
        steps = ["Cuire les nouilles selon le paquet (3 à 5 min dans l'eau bouillante), les égoutter et les rincer à l'eau froide pour qu'elles ne collent pas.",
                 WOK_PROT[p][1] + (" Préparer les légumes : " + " ; ".join(preps) + "." if preps else ""),
                 "Chauffer l'huile dans un wok ou une grande poêle à feu vif. " + WOK_PROT[p][2],
                 "Dans le même wok, faire sauter à feu vif " + ", puis ".join(f"{d(v)} {WOK_MIN[v]} min" for v in vs) + ".",
                 f"Remettre {('les œufs' if p == 'oeufs' else d(p))}, ajouter les nouilles et {WOK_SAUCE[s][2]}. Faire sauter 2 min en mélangeant bien.",
                 f"Servir aussitôt, parsemé {'de cacahuètes concassées' if top == 'cacahuetes' else 'de graines de sésame' if top == 'sesame' else 'de coriandre ciselée'}."]
        t = 25
        out.append(mk(title, "Pâtes", t, ["plaques"], ["wok", "asiatique"] + cooktime_tag(t), ings, steps, "Asiatique"))
        if len(out) >= limit: break
    return out


BOWL_BASE = {'riz': "Cuire le riz 10 à 12 min dans deux fois son volume d'eau salée, à couvert.", 'quinoa': "Rincer le quinoa et le cuire 12 min dans deux fois son volume d'eau salée.",
             'semoule': "Verser la semoule dans un volume égal d'eau bouillante salée, couvrir 5 min puis l'égrener.", 'boulgour': "Cuire le boulgour 10 min dans deux fois son volume d'eau salée."}
BOWL_PROT = {'poulet': "Cuire le poulet 6 à 8 min à la poêle, saler, poivrer, puis le trancher.", 'saumon': "Cuire le saumon 3 à 4 min de chaque côté à la poêle, puis l'effeuiller.",
             'tofu': "Faire dorer le tofu en cubes 6 min à la poêle avec un peu de sauce soja.", 'pois-chiches': "Égoutter les pois chiches et les faire rôtir 10 min à la poêle avec le cumin.",
             'oeufs': "Cuire les œufs 6 min 30 dans l'eau bouillante, les rafraîchir et les écaler (jaune coulant).", 'crevettes': "Saisir les crevettes 2 à 3 min de chaque côté à la poêle.",
             'halloumi': "Couper le halloumi en tranches et le faire dorer 2 min de chaque côté.", 'falafels': "Réchauffer les falafels 8 min au four ou à la poêle."}
BOWL_VEG = {'avocat': "trancher l'avocat", 'concombre': "couper le concombre en fines rondelles", 'carotte': "râper les carottes", 'mais': "égoutter le maïs", 'tomate-cerise': "couper les tomates cerises en deux",
            'betterave': "couper la betterave cuite en dés", 'chou': "émincer très finement le chou", 'radis': "trancher finement les radis", 'epinards': "rincer les jeunes pousses d'épinards",
            'mangue': "couper la mangue en dés", 'edamame': ""}
BOWL_ROAST = {'patate-douce': "Couper la patate douce en cubes et la rôtir 25 min au four à 200 °C avec un filet d'huile.", 'brocoli': "Cuire le brocoli en bouquets 5 min à la vapeur ou à l'eau bouillante.",
              'courgette': "Couper la courgette en demi-rondelles et la faire griller 6 min à la poêle.", 'poivron': "Couper le poivron en lanières et le faire griller 7 min à la poêle."}
BOWL_SAUCE = {'yaourt': ("sauce yaourt-citron", [('yaourt', 0.5), ('citron', 0.5)], "Mélanger le yaourt avec le jus du citron, du sel et du poivre."),
              'soja': ("sauce soja-sésame", [('sauce-soja', 1), ('sesame', 0.5)], "Mélanger la sauce soja avec un filet d'huile et les graines de sésame."),
              'houmous': ("houmous", [('houmous', 0.8), ('citron', 0.5)], "Détendre le houmous avec le jus du citron et un peu d'eau.")}
BOWLS = [('riz', 'saumon', ('avocat', 'concombre'), 'soja'), ('riz', 'poulet', ('carotte', 'chou'), 'soja'), ('riz', 'tofu', ('brocoli', 'carotte'), 'soja'), ('riz', 'crevettes', ('mangue', 'concombre'), 'soja'),
         ('quinoa', 'pois-chiches', ('patate-douce', 'epinards'), 'yaourt'), ('quinoa', 'saumon', ('avocat', 'radis'), 'yaourt'), ('quinoa', 'halloumi', ('courgette', 'tomate-cerise'), 'houmous'),
         ('quinoa', 'oeufs', ('avocat', 'tomate-cerise'), 'yaourt'), ('semoule', 'falafels', ('concombre', 'tomate-cerise'), 'houmous'), ('semoule', 'poulet', ('poivron', 'concombre'), 'yaourt'),
         ('boulgour', 'halloumi', ('betterave', 'epinards'), 'yaourt'), ('boulgour', 'pois-chiches', ('carotte', 'betterave'), 'houmous'), ('riz', 'oeufs', ('epinards', 'carotte'), 'soja'),
         ('quinoa', 'poulet', ('patate-douce', 'brocoli'), 'yaourt'), ('riz', 'saumon', ('mangue', 'avocat'), 'soja'), ('semoule', 'oeufs', ('courgette', 'poivron'), 'houmous'),
         ('boulgour', 'poulet', ('carotte', 'radis'), 'yaourt'), ('quinoa', 'tofu', ('chou', 'avocat'), 'soja'), ('riz', 'crevettes', ('avocat', 'mais'), 'soja'), ('quinoa', 'falafels', ('betterave', 'concombre'), 'houmous'),
         ('riz', 'poulet', ('brocoli', 'mais'), 'soja'), ('semoule', 'pois-chiches', ('courgette', 'tomate-cerise'), 'yaourt'), ('boulgour', 'saumon', ('concombre', 'radis'), 'yaourt'), ('quinoa', 'oeufs', ('patate-douce', 'epinards'), 'houmous')]


def bowls():
    out, seen = [], set()
    BN = {'riz': 'riz', 'quinoa': 'quinoa', 'semoule': 'semoule', 'boulgour': 'boulgour'}
    for base, pr, vs, sa in BOWLS:
        prn = {'oeufs': 'œufs mollets', 'pois-chiches': 'pois chiches rôtis', 'saumon': 'saumon', 'poulet': 'poulet', 'tofu': 'tofu', 'crevettes': 'crevettes', 'halloumi': 'halloumi', 'falafels': 'falafels'}[pr]
        vn = [{'tomate-cerise': 'tomates cerises', 'patate-douce': 'patate douce'}.get(v, nm(v)) for v in vs]
        title = f"Bol de {BN[base]}, {prn}, " + lst(vn)
        if title in seen: continue
        seen.add(title)
        ings = [q(base, 0.9), q(pr, 0.5 if pr == 'oeufs' else 0.8)] + [q(v, 0.5) for v in vs] + [q(i, m) for i, m in BOWL_SAUCE[sa][1]]
        if pr == 'pois-chiches': ings.append(q('cumin', 1))
        if pr == 'tofu' and sa != 'soja': ings.append(q('sauce-soja', 0.5))
        roast = [BOWL_ROAST[v] for v in vs if v in BOWL_ROAST]; raw = [BOWL_VEG[v] for v in vs if v in BOWL_VEG and BOWL_VEG[v]]
        steps = [BOWL_BASE[base]] + roast + [BOWL_PROT[pr]]
        if raw: steps.append("Préparer les crudités : " + " ; ".join(raw) + ".")
        steps += [BOWL_SAUCE[sa][2], "Dresser dans deux bols : la base, la protéine et les légumes côte à côte, puis napper de sauce."]
        t = 35 if 'patate-douce' in vs else 25
        out.append(mk(title, "Salades", t, ["plaques"] + (["four"] if 'patate-douce' in vs else []), ["bol", "équilibré"] + cooktime_tag(t), ings, steps, "Cuisine du monde"))
    return out


TART_BASE = {'fromage-frais': "Tartiner le pain de fromage frais.", 'ricotta': "Tartiner le pain de ricotta assaisonnée de sel et de poivre.", 'houmous': "Tartiner le pain de houmous.",
             'avocat': "Écraser l'avocat avec un peu de jus de citron, du sel et du poivre, puis l'étaler sur le pain.", 'pesto': "Tartiner le pain de pesto."}
TARTINES = [('fromage-frais', 'saumon-fume', 'concombre'), ('fromage-frais', 'radis', 'ciboulette'), ('ricotta', 'tomate-cerise', 'basilic'), ('houmous', 'carotte', 'pois-chiches'),
            ('avocat', 'oeufs', 'radis'), ('avocat', 'saumon-fume', 'citron'), ('pesto', 'mozzarella', 'tomate'), ('ricotta', 'champignons', 'parmesan'), ('fromage-frais', 'jambon', 'concombre'),
            ('houmous', 'feta', 'concombre'), ('avocat', 'tomate', 'feta'), ('pesto', 'jambon', 'tomate-cerise'), ('ricotta', 'epinards', 'oeufs'), ('fromage-frais', 'betterave', 'noix')]
TOPP = {'saumon-fume': "déposer le saumon fumé", 'concombre': "ajouter de fines rondelles de concombre", 'radis': "ajouter les radis en fines rondelles", 'ciboulette': "parsemer de ciboulette ciselée",
        'tomate-cerise': "ajouter les tomates cerises coupées en deux", 'basilic': "parsemer de basilic", 'carotte': "ajouter la carotte râpée", 'pois-chiches': "parsemer de pois chiches rôtis 5 min à la poêle",
        'oeufs': "ajouter un œuf poché ou mollet (6 min 30 dans l'eau bouillante) coupé en deux", 'citron': "arroser d'un trait de citron", 'mozzarella': "ajouter la mozzarella en tranches",
        'tomate': "ajouter la tomate en rondelles", 'champignons': "ajouter les champignons poêlés 5 min", 'parmesan': "parsemer de copeaux de parmesan", 'jambon': "ajouter le jambon",
        'feta': "émietter la feta", 'epinards': "ajouter les épinards tombés 2 min à la poêle", 'noix': "parsemer de noix concassées", 'betterave': "ajouter la betterave en fines tranches"}


def tartines():
    out = []
    for base, a, b in TARTINES:
        an = {'saumon-fume': 'saumon fumé', 'tomate-cerise': 'tomates cerises', 'oeufs': 'œuf', 'pois-chiches': 'pois chiches'}.get(a, nm(a))
        bn = {'saumon-fume': 'saumon fumé', 'tomate-cerise': 'tomates cerises', 'oeufs': 'œuf', 'pois-chiches': 'pois chiches'}.get(b, nm(b))
        basen = {'fromage-frais': 'fromage frais', 'ricotta': 'ricotta', 'houmous': 'houmous', 'avocat': 'avocat', 'pesto': 'pesto'}[base]
        title = f"Tartines {basen}, {an} et {bn}"
        ings = [q('pain', 1), q(base, 0.8 if base != 'avocat' else 1)] + [q(x, 0.5 if x in ('oeufs',) else 0.6) for x in (a, b)]
        if base == 'avocat' and 'citron' not in (a, b): ings.append(q('citron', 0.5))
        steps = ["Faire griller les tranches de pain.", TART_BASE[base], cap(TOPP[a]) + ", puis " + TOPP[b] + ".", "Poivrer, ajouter un filet d'huile d'olive et servir aussitôt."]
        ings.append(q('huile-olive', 0.3))
        out.append(mk(title, "Sandwichs", 10 if 'oeufs' not in (a, b) and 'champignons' not in (a, b) else 15, [], ["sandwich", "express"], ings, steps, meal=("Déjeuner", "Dîner", "Petit-déjeuner")))
    return out


WRAPS = [('poulet', ('salade', 'tomate'), 'yaourt'), ('thon', ('mais', 'salade'), 'mayonnaise'), ('saumon-fume', ('concombre', 'salade'), 'fromage-frais'), ('falafels', ('tomate', 'concombre'), 'houmous'),
         ('haricots-rouges', ('mais', 'poivron'), 'avocat'), ('oeufs', ('salade', 'tomate'), 'mayonnaise'), ('jambon', ('salade', 'emmental'), 'moutarde'), ('poulet', ('poivron', 'oignon-rouge'), 'fromage-frais'),
         ('boeuf-hache', ('tomate', 'salade'), 'cheddar'), ('halloumi', ('concombre', 'tomate-cerise'), 'yaourt'), ('crevettes', ('avocat', 'salade'), 'mayonnaise'), ('tofu', ('carotte', 'chou'), 'sauce-soja')]
WRAP_P = {'poulet': "Couper le poulet en lanières et le saisir 6 à 8 min à la poêle avec du sel, du poivre et du paprika.", 'thon': "Égoutter et émietter le thon.", 'saumon-fume': "Couper le saumon fumé en lanières.",
          'falafels': "Réchauffer les falafels 5 min à la poêle et les écraser grossièrement.", 'haricots-rouges': "Égoutter les haricots rouges et les réchauffer 3 min avec du cumin, en les écrasant légèrement.",
          'oeufs': "Cuire les œufs 10 min dans l'eau bouillante, les écaler et les couper en rondelles.", 'jambon': "Couper le jambon en lanières.", 'boeuf-hache': "Faire cuire le bœuf haché 6 min en l'émiettant, avec du sel, du poivre et du cumin.",
          'halloumi': "Faire dorer le halloumi en bâtonnets 2 min de chaque côté.", 'crevettes': "Saisir les crevettes 2 min de chaque côté.", 'tofu': "Faire dorer le tofu en bâtonnets 6 min avec un peu de sauce soja."}
WRAP_S = {'yaourt': "de yaourt salé et poivré", 'mayonnaise': "de mayonnaise", 'fromage-frais': "de fromage frais", 'houmous': "de houmous", 'avocat': "d'avocat écrasé avec du sel",
          'moutarde': "d'une fine couche de moutarde", 'cheddar': "de cheddar râpé (le passer 1 min à la poêle pour le faire fondre)", 'sauce-soja': "d'un trait de sauce soja"}


def wraps():
    out = []
    for p, vs, s in WRAPS:
        pn = {'saumon-fume': 'saumon fumé', 'haricots-rouges': 'haricots rouges', 'oeufs': 'œufs', 'boeuf-hache': 'bœuf haché'}.get(p, nm(p))
        title = f"Wraps {AU.get(p, 'au ' + pn)}" + (f" et {AU[vs[0]]}" if vs[0] in AU and vs[0] not in ('salade', 'tomate') else "")
        title = title.replace("Wraps aux haricots rouges", "Wraps aux haricots rouges").strip()
        if p == 'haricots-rouges': title = "Wraps végétariens aux haricots rouges et au maïs"
        if p == 'falafels': title = "Wraps aux falafels et houmous"
        if p == 'oeufs': title = "Wraps aux œufs et crudités"
        if p == 'halloumi': title = "Wraps au halloumi grillé"
        if p == 'tofu': title = "Wraps au tofu et chou croquant"
        if p == 'crevettes': title = "Wraps aux crevettes et avocat"
        if p == 'thon': title = "Wraps au thon et maïs"
        if p == 'jambon': title = "Wraps jambon-emmental"
        if p == 'boeuf-hache': title = "Wraps au bœuf haché et cheddar"
        if p == 'saumon-fume': title = "Wraps au saumon fumé et fromage frais"
        if p == 'poulet' and s == 'yaourt': title = "Wraps au poulet et crudités, sauce yaourt"
        if p == 'poulet' and s == 'fromage-frais': title = "Wraps au poulet, poivron et fromage frais"
        ings = [q('wrap', 1), q(p, 0.5 if p == 'oeufs' else 0.7)] + [q(v, 0.5) for v in vs] + [q(s, 0.6)]
        if p in ('haricots-rouges', 'boeuf-hache'): ings.append(q('cumin', 0.5))
        if p == 'poulet': ings.append(q('paprika', 0.5))
        if p == 'tofu' and s != 'sauce-soja': ings.append(q('sauce-soja', 0.5))
        vp = {'salade': "laver la salade", 'tomate': "couper la tomate en rondelles", 'mais': "égoutter le maïs", 'concombre': "couper le concombre en bâtonnets", 'poivron': "couper le poivron en fines lanières",
              'oignon-rouge': "émincer finement l'oignon rouge", 'emmental': "couper l'emmental en bâtonnets", 'tomate-cerise': "couper les tomates cerises en deux", 'avocat': "trancher l'avocat",
              'carotte': "râper la carotte", 'chou': "émincer finement le chou"}
        steps = [WRAP_P[p], "Préparer les légumes : " + " ; ".join(vp[v] for v in vs) + ".", f"Tiédir les wraps 20 secondes à la poêle. Les garnir {WRAP_S[s]}, puis de la garniture et des légumes.", "Rouler bien serré en repliant les bords, couper en deux et servir."]
        t = 15 if p not in ('oeufs', 'boeuf-hache', 'poulet') else 20
        out.append(mk(title, "Sandwichs", t, ["plaques"], ["sandwich", "wrap"] + cooktime_tag(t), ings, steps, "Tex-Mex" if p in ('haricots-rouges', 'boeuf-hache') else "Cuisine du monde"))
    return out
