#!/usr/bin/env bash
# Met en ligne la version en cours sur la branche main (GitHub Pages), après tous les contrôles.
#   tools/publish.sh ["texte ajouté au message du commit"]
# À lancer depuis la branche source, après python3 tools/release.py X.Y.Z (la version doit changer à chaque mise en ligne).
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(python3 -c "import json; print(json.load(open('package.json'))['version'])")
SITE=.site

npm run build
npm test
npm run lint

# copie de travail de main dans .site/ (ignorée par git)
git fetch -q origin main:refs/remotes/origin/main
if [ -e "$SITE/.git" ]; then git -C "$SITE" checkout -q -B main origin/main
else git worktree add -q -B main "$SITE" origin/main; fi

OLD=$(python3 -c "import json; print(json.load(open('$SITE/version.json'))['version'])")
if [ "$OLD" = "$V" ]; then echo "La version $V est déjà en ligne : lance d'abord python3 tools/release.py <nouvelle version>"; exit 1; fi

python3 tests/update.py "$SITE"   # l'ancienne version en ligne -> la nouvelle : données gardées, hors ligne OK

find "$SITE" -mindepth 1 -maxdepth 1 ! -name .git ! -name CLAUDE.md -exec rm -rf {} +   # CLAUDE.md : renvoie vers la branche source
cp dist/* "$SITE"/
git -C "$SITE" add -A
git -C "$SITE" commit -q -m "Mon Frigo v$V" ${1:+-m "$1"}
git -C "$SITE" push -q origin main
echo "v$OLD -> v$V envoyée sur main : en ligne dans 1 à 2 minutes (https://theo1010-dev.github.io/Mon-Frigo/version.json)"
