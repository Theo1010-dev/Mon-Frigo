# -*- coding: utf-8 -*-
"""Assemble le catalogue : python3 tools/data/recipes.py --strict  ->  data/recipes.json (+ audit).
Les recettes sont écrites dans gen_*.py (gen_hand*.py = recettes écrites à la main, une famille par fichier)."""
import json, re, unicodedata, sys, collections, os
from gen_core import K, nm
import gen_fam, gen_fam2, gen_hand1, gen_hand2, gen_hand3, gen_hand4, gen_hand5, gen_hand6, gen_hand7, gen_hand8, gen_hand9, gen_hand10, gen_hand11, gen_hand12, gen_hand13, gen_hand14, gen_hand15, gen_hand16, gen_hand17, gen_hand18, gen_hand19, gen_hand20, gen_hand21

def slug(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s.replace("œ", "oe")).strip("-")

# un plat régional étiqueté « Française » rejoint sa région (pour le passeport : quiche lorraine -> Lorraine)
REGIONS = [("bourguignon", "Bourguignonne"), ("breton", "Bretonne"), ("lorrain", "Lorraine"), ("nicois", "Niçoise"), ("provencal", "Provençale"), ("lyonnais", "Lyonnaise"), ("savoyard", "Savoyarde"), ("basque", "Basque"), ("alsacien", "Alsacienne"), ("normand", "Normande")]
def region(title, k):
    if k != "Française": return k
    t = norm(title)
    return next((reg for key, reg in REGIONS if key in t), k)

def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return s.replace("œ", "oe").replace("’", "'")

def fix_title(t):
    # élision (« d'aubergines », « d'épinards ») ; l'identifiant garde l'ancien titre pour ne rien casser
    return re.sub(r"\bde ([aeiouéèêâîôûœh](?!aricot)|[AEIOUÉ])", r"d'\1", t)

MIX = re.compile(r"\b(mixer|mixez|blender)\b", re.I)
MIX_TITLES = re.compile(r"smoothie|milk-shake|yaourt glacé|tapenade|gaspacho|crème de poivrons|mousse aux fruits rouges|purée de petits pois", re.I)
def needs_mixer(r):
    # le mixeur n'est exigé que quand il est indispensable (soupes mixées, boissons, tartinades), pas pour hacher des noix
    if "thermomix" in r["equip"]: return False   # le Thermomix mixe lui-même
    txt = " ".join(r["steps"]).replace("sans mixer", "")
    return bool(MIX.search(txt)) and (r["cat"] == "Soupes" or bool(MIX_TITLES.search(r["title"])))

def fix_text(s):
    s = s.replace(": Couper", ": couper").replace(": Émincer", ": émincer").replace(": Râper", ": râper").replace(": Égoutter", ": égoutter")
    s = re.sub(r"(: )([A-ZÉ])", lambda m: m.group(1) + m.group(2).lower(), s)
    return s

# entrées : les recettes légères qui se servent aussi en début de repas (en plus de leurs autres moments)
ENTREE_RE = re.compile(r"^(Velouté|Potage|Gaspacho|Soupe froide|Crème de|Soupe de céleri|Soupe de petits pois|Soupe de tomates|Soupe à l'oignon|Œufs mimosa|Œufs cocotte|Œufs mollets|Carottes râpées|Concombre à la crème|Salade de tomates|Salade caprese|Salade de melon|Salade de fenouil|Salade d'endives|Salade de betterave|Salade de chèvre chaud|Salade Waldorf|Salade de chou à la carotte|Tartare de saumon|Taboulé|Rillettes|Caviar d'aubergine|Ceviche|Champignons farcis|Bruschetta)")
def meal_of(r):
    m = list(r["meal"])
    if "Entrée" not in m and "Dessert" not in m and ENTREE_RE.search(fix_title(r["title"])): m.append("Entrée")
    return m

CAT_MAP = {"Plats au four": "Gratins & four", "Gratins": "Gratins & four", "Tartes": "Tartes & pizzas", "Pizzas": "Tartes & pizzas",
           "Légumineuses": "Plats mijotés", "Légumes": "Plats mijotés", "Accompagnements": "Plats mijotés", "Plats": "Plats mijotés"}

def all_recipes():
    R = []
    R += gen_hand1.recipes() + gen_hand2.recipes() + gen_hand3.recipes() + gen_hand4.recipes() + gen_hand5.recipes() + gen_hand6.recipes() + gen_hand7.recipes() + gen_hand8.recipes() + gen_hand9.recipes()
    R += gen_hand10.recipes() + gen_hand11.recipes() + gen_hand12.recipes() + gen_hand13.recipes() + gen_hand14.recipes() + gen_hand15.recipes() + gen_hand16.recipes() + gen_hand17.recipes() + gen_hand18.recipes() + gen_hand19.recipes() + gen_hand20.recipes() + gen_hand21.recipes()
    R += gen_fam.poelees(limit=100) + gen_fam.currys() + gen_fam.soupes(limit=52) + gen_fam.salades() + gen_fam.gratins()
    R += gen_fam2.omelettes() + gen_fam2.quiches() + gen_fam2.pizzas() + gen_fam2.gnocchis() + gen_fam2.risottos() + gen_fam2.woks() + gen_fam2.bowls() + gen_fam2.tartines() + gen_fam2.wraps()
    return R

def audit(R):
    problems = []
    for r in R:
        txt = norm(" ".join(r["steps"]))
        for ing, qn, u in r["ing"]:
            if ing not in K: problems.append((r["title"], "ingrédient inconnu", ing)); continue
            k = K[ing]
            if k["staple"] and ing not in ("huile-olive",): continue
            keys = {norm(k["n"]), norm(k["n"]).split()[0]} | {norm(a) for a in k["al"]}
            keys |= {w for z in list(keys) for w in z.split() if len(w) >= 5}
            keys |= {x.rstrip("s") for x in list(keys)}
            if not any(x and x in txt for x in keys) and ing not in ("oeufs",):
                if ing in ("oeufs",) and "oeuf" in txt: continue
                problems.append((r["title"], "ingrédient non cité dans les étapes", ing))
        if len(r["steps"]) < 2: problems.append((r["title"], "trop peu d'étapes", len(r["steps"])))
        if r["time"] < 5 or r["time"] > 240: problems.append((r["title"], "durée douteuse", r["time"]))
        for s in r["steps"]:
            if "  " in s or "{" in s or "None" in s: problems.append((r["title"], "texte suspect", s[:60]))
    return problems

# appareils de remplacement propres à une recette (les autres sont réglés dans l'app : air fryer → four, Cookeo → cocotte…)
# four → air fryer : pour un plat qui tient dans le panier (pas les tartes, pizzas, gâteaux en moule, rôtis entiers, pains, soufflés…)
NOT_AIR = re.compile(r"(?i)tarte|quiche|pizza|gâteau|cake|clafoutis|rôti|gigot|soufflé|meringue|brioche|\bpain\b|bûche|tatin|\bflan\b|\bfar\b|génoise|biscuit|baba|savarin|galette|pithiviers|pissaladière|flammekueche|calzone|lahmacun|pavlova|charlotte|kouign|kugelhopf|panettone|strudel|wellington|en croûte|poulet entier|poulet rôti|dinde|cassoulet|baeckeoffe|focaccia|fougasse|madeleine|financier|cannelé")
MIX_STEP = re.compile(r"(?i)vitesse 5 à 10|à la vitesse 10|\d+ min[^.]{0,20}vitesse (?:[6-9]|10)\b")   # vrai mixage long (soupe, gaspacho) ; hacher ou râper 10 s se fait au couteau
def alternatives(r, equip):
    x = {}
    if "four" in equip and CAT_MAP.get(r["cat"], r["cat"]) != "Tartes & pizzas" and r["serv"] <= 4 and not NOT_AIR.search(r["title"]): x["four"] = [["air_fryer"]]
    # sans Thermomix : une casserole, et un mixeur seulement si la recette mixe vraiment
    if "thermomix" in equip:
        txt = " ".join(r["steps"]); need = (["plaques"] if "°C" in txt else []) + (["mixeur"] if MIX_STEP.search(txt) else [])
        x["thermomix"] = [need or ["plaques"]]
    return x

def main():
    R = all_recipes(); seen = {}; out = []
    for r in R:
        sid = slug(r["title"])
        if sid in seen: continue
        seen[sid] = 1
        r["steps"] = [fix_text(s) for s in r["steps"]]
        r["tags"] = [t for t in r["tags"] if t not in ("végétarien",)]  # dérivé dans l'app
        out.append(dict(id=sid, t=fix_title(r["title"]), c=CAT_MAP.get(r["cat"], r["cat"]), d=r["diff"], m=r["time"], s=r["serv"], e=sorted(set(r["equip"]) | ({"mixeur"} if needs_mixer(r) else set())), g=r["tags"], k=region(r["title"], r["cuisine"]),
                        mt=meal_of(r), i=r["ing"], p=r["steps"], o=r["src"]))
        x = alternatives(r, out[-1]["e"])
        if x: out[-1]["x"] = x
    probs = audit(R)
    probs += [f"{x['t']} : quantité nulle pour {i[0]}" for x in out for i in x['i'] if not i[1] > 0]   # une quantité arrondie à 0 est une erreur
    # tri : classiques d'abord (meilleure qualité), puis par catégorie
    out.sort(key=lambda x: (x["o"] != "classique", x["c"], x["t"]))
    json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "data", "recipes.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(len(out), "recettes ;", sum(1 for x in out if x["o"] == "classique"), "classiques écrits à la main ;", len(probs), "alertes d'audit")
    for p in probs[:40]: print("  ⚠", p)
    c = collections.Counter(x["c"] for x in out); print(dict(c))
    if "--strict" in sys.argv and probs: sys.exit(1)

if __name__ == "__main__": main()
