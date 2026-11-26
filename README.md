# Mon Frigo

Application Android (PWA) pour gérer ton stock, trouver quoi cuisiner, planifier ta semaine et faire tes courses, sans gaspiller.
Tout fonctionne hors ligne, et tes données restent sur ton téléphone.

- Site : https://theo1010-dev.github.io/Mon-Frigo/
- Branche `source` : le code (ce dossier). Branche `main` : le site en ligne, 23 fichiers à plat produits par `npm run build`. On ne modifie jamais `main` à la main.
- Historique des versions : [CHANGELOG.md](CHANGELOG.md).

## Ce que fait l'app
- **Stock** par zone (frigo, congélateur, placard, autres), dates limites estimées, ajout rapide, scanner de code-barres, ticket de caisse, vue « Ma cuisine ».
- **Recettes** : 1 245 recettes (760 écrites à la main), moments du repas, filtres, recettes perso, mode cuisine avec minuteurs.
- **Semaine** : midi/soir, ajout express de n'importe quel plat, déplacement, remplissage automatique selon le stock.
- **Courses** : générées depuis la semaine, rangées par rayon, partage, rangement dans le stock en un geste.
- **Frigo, l'assistant** : on lui écrit comme à quelqu'un (fautes et abréviations comprises) ; il connaît ton frigo et la cuisine (cuissons, conversions, astuces). Tout est calculé sur le téléphone.
- **Profil façon jeu** : personnage, XP, succès, passeport ; six ambiances en clair et en sombre.
- **Sauvegarde** : export/import JSON, envoi vers un autre téléphone.

## Mises à jour (pour l'utilisateur)
- Une mise à jour ne touche jamais aux données : il ne faut **pas** désinstaller l'app.
- Ne jamais utiliser « Effacer les données du site » pour github.io dans Chrome : ça effacerait Mon Frigo **et** Mon Budget.
- La nouvelle version s'installe toute seule en ouvrant l'app avec internet (sinon : fermer l'app des applis récentes et la rouvrir).
- Si « Le chargement est bloqué » apparaît : « Réparer et relancer » (les données sont gardées).

## Organisation du code
```
index.html, styles.css, sw.js, manifest.webmanifest, 404.html
js/            modules ES (un fichier par sujet)
  app.js         démarrage, onglets, mises à jour
  state.js       données en mémoire + VERSION ; db.js (IndexedDB « mon-frigo »), backup.js
  actions.js     toutes les modifications de données (stock, semaine, courses, cuisine)
  views.js       les 5 onglets ; week.js (Semaine), kitchen.js (vue « Ma cuisine »)
  stock-sheets.js, plan-sheets.js, shop-sheets.js, recipe-sheets.js,
  receipt-sheets.js, onboarding.js      les fenêtres (« sheets ») par thème
  brain.js       compréhension des phrases (pur, testé) ; know.js (savoir de cuisine, conversions) ; assistant.js (la discussion) ; mascot.js
  equipment.js   « Mon équipement » (recettes grisées faute d'appareil)
  recipes.js, plan.js, stock.js, kb.js, units.js, habits.js…   la logique
  profile.js, rpg.js, avatar.js, theme.js, season.js, guide.js  profil, jeu, ambiances
assets/        icônes, polices, lecteur de ticket (Tesseract)
data/          ingredients.json et recipes.json (générés, à ne pas éditer à la main)
tools/
  build.mjs      construit dist/ (esbuild, tout à plat, service worker versionné)
  release.py     change le numéro de version (js/state.js + package.json)
  publish.sh     construit, teste et met en ligne sur main
  data/          générateurs du catalogue : ingredients.py, recipes.py (+ audit), gen_*.py (les recettes)
tests/         files/logic (node), e2e, migration, update, monkey, textfit, assistant_eval (Python + Playwright)
```

## Commandes
| Commande | Rôle |
|---|---|
| `npm ci` | installe esbuild |
| `npm run build` | crée `dist/` |
| `npm test` | contrôle de `dist/` + tests de logique |
| `npm run lint` | ESLint |
| `npm run data` | régénère `data/*.json` depuis `tools/data/` (audit strict) |
| `npm run test:all` | build + tests + parcours e2e + migration + textes coupés |
| `python3 tests/monkey.py 700 1` | 700 touchers au hasard (graine 1) |
| `python3 tests/assistant_eval.py` | l'assistant face à ~90 phrases de tous les jours (`--all` pour lire ses réponses) |
| `python3 tests/update.py <dossier>` | mise à jour depuis l'ancienne version (dossier plat) |
| `python3 tools/release.py 1.13.0` | nouveau numéro de version |
| `tools/publish.sh` | construit, teste, vérifie la mise à jour et pousse sur `main` |

## Bon à savoir
- Le service worker charge la page depuis internet en priorité (le cache ne sert que hors ligne), supprime les anciens caches et recharge une page restée sur une ancienne version.
- Si l'app ne démarre pas en 12 s, un écran propose de la réparer sans toucher aux données.
- Aucune recette n'a été testée en cuisine : elles sont signalées comme telles dans l'app.
