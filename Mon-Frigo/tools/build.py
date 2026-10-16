# -*- coding: utf-8 -*-
"""Assemble le catalogue : python3 tools/build.py  ->  data/recipes.json (+ audit)"""
import json, re, unicodedata, sys, collections
from gen_core import K, nm
import gen_fam, gen_hand1, gen_hand2

def slug(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s.replace("œ", "oe")).strip("-")

def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return s.replace("œ", "oe").replace("’", "'")

def fix_text(s):
    s = s.replace(": Couper", ": couper").replace(": Émincer", ": émincer").replace(": Râper", ": râper").replace(": Égoutter", ": égoutter")
    s = re.sub(r"(: )([A-ZÉ])", lambda m: m.group(1) + m.group(2).lower(), s)
    return s

CAT_MAP = {"Plats au four": "Gratins & four", "Gratins": "Gratins & four", "Tartes": "Tartes & pizzas", "Pizzas": "Tartes & pizzas",
           "Légumineuses": "Plats mijotés", "Légumes": "Plats mijotés", "Accompagnements": "Plats mijotés", "Plats": "Plats mijotés"}

def all_recipes():
    R = []
    R += gen_hand1.recipes() + gen_hand2.recipes()
    R += gen_fam.poelees(limit=100) + gen_fam.currys() + gen_fam.soupes() + gen_fam.salades() + gen_fam.gratins()
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

def main():
    R = all_recipes(); seen = {}; out = []
    for r in R:
        sid = slug(r["title"])
        if sid in seen: continue
        seen[sid] = 1
        r["steps"] = [fix_text(s) for s in r["steps"]]
        r["tags"] = [t for t in r["tags"] if t not in ("végétarien",)]  # dérivé dans l'app
        out.append(dict(id=sid, t=r["title"], c=CAT_MAP.get(r["cat"], r["cat"]), d=r["diff"], m=r["time"], s=r["serv"], e=r["equip"], g=r["tags"], k=r["cuisine"],
                        mt=r["meal"], i=r["ing"], p=r["steps"], o=r["src"]))
    probs = audit(R)
    # tri : classiques d'abord (meilleure qualité), puis par catégorie
    out.sort(key=lambda x: (x["o"] != "classique", x["c"], x["t"]))
    json.dump(out, open("../data/recipes.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(len(out), "recettes ;", sum(1 for x in out if x["o"] == "classique"), "classiques écrits à la main ;", len(probs), "alertes d'audit")
    for p in probs[:40]: print("  ⚠", p)
    c = collections.Counter(x["c"] for x in out); print(dict(c))
    if "--strict" in sys.argv and probs: sys.exit(1)

if __name__ == "__main__": main()
