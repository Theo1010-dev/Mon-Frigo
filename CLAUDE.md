# Mon Frigo — branche main = le site en ligne

Cette branche ne contient que le site construit (fichiers à plat servis par GitHub Pages). Ne pas la modifier à la main.
Le code source, les règles du projet et les outils sont sur la branche **source** :

    git fetch origin source && git checkout source    # puis lire CLAUDE.md

Mise en ligne : depuis la branche source, `python3 tools/release.py X.Y.Z` puis `tools/publish.sh`.
