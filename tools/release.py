"""Change la version : python3 tools/release.py 1.2.1  puis  npm run build
Le numéro est injecté partout (cache hors ligne, fichiers) au moment de la compilation."""
import sys, re, json, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
v = sys.argv[1] if len(sys.argv) > 1 else None
if not v or not re.fullmatch(r"\d+\.\d+\.\d+", v): sys.exit("Usage : python3 tools/release.py 1.2.1")
s = open("js/state.js", encoding="utf-8").read(); open("js/state.js", "w", encoding="utf-8").write(re.sub(r"export const VERSION = '[^']+'", f"export const VERSION = '{v}'", s))
p = json.load(open("package.json")); p["version"] = v; json.dump(p, open("package.json", "w"), indent=2, ensure_ascii=False)
print("Version", v, "appliquée. Lance maintenant : npm run build && npm test")
