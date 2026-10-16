"""Change la version partout (app, cache hors ligne, package) : python3 tools/release.py 1.0.1
Indispensable à chaque mise en ligne : sinon les téléphones gardent l'ancienne version en cache."""
import sys, re, json, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
v = sys.argv[1] if len(sys.argv) > 1 else None
if not v or not re.fullmatch(r"\d+\.\d+\.\d+", v): sys.exit("Usage : python3 tools/release.py 1.0.1")
for path, pat, rep in [("sw.js", r"const VERSION = '[^']+'", f"const VERSION = '{v}'"), ("js/state.js", r"export const VERSION = '[^']+'", f"export const VERSION = '{v}'")]:
    s = open(path, encoding="utf-8").read(); s2 = re.sub(pat, rep, s); assert s2 != s or rep in s, path; open(path, "w", encoding="utf-8").write(s2)
p = json.load(open("package.json")); p["version"] = v; json.dump(p, open("package.json", "w"), indent=2, ensure_ascii=False)
print("Version", v, "appliquée. Lance maintenant : npm test")
