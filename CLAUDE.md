# Mon Frigo — règles du projet

Utilisateur : Théo, français, pas développeur. Répondre en français, court et simple (pas de pavés).

## Règles absolues
- Ses données ne doivent jamais être perdues : une mise à jour garde tout (IndexedDB « mon-frigo », clé par clé). Il ne doit jamais désinstaller.
- Ne jamais conseiller « Effacer les données du site » pour github.io (Mon Budget partage le domaine).
- Changer la version à chaque livraison : `python3 tools/release.py X.Y.Z` (jamais deux mises en ligne avec le même numéro).
- Garder l'ambiance « Chaumière » (il a refusé le thème Seigneur des anneaux). Ne pas surcharger l'interface (pas de gros encadrés).
- Tout homogénéiser, ne rien casser. Finir chaque tour par un gros audit, puis un message court avec les points à tester.

## Confidentialité (impératif)
- Aucune donnée personnelle de Théo dans le code (chiffres, portefeuille, salaire, nom, adresse mail) : un nouveau visiteur doit arriver sur une appli vide.
- Les données de chacun restent uniquement sur son téléphone (stockage du navigateur). Ne jamais changer l'adresse de l'appli, la clé de stockage ni le nom de la base : ça effacerait les données.
- Une mise à jour garde toujours les données existantes (tester : ancienne version avec données → nouvelle version → données identiques).
- L'historique Git a été nettoyé le 26/11/2026 (un seul commit) : repartir d'un clone neuf, ne jamais refusionner une ancienne copie.

## Branches
- `source` : le code. `main` : le site GitHub Pages, 23 fichiers à plat = `dist/` (+ un CLAUDE.md qui renvoie ici). Ne jamais éditer `main` à la main.
- Mise en ligne : `tools/publish.sh` (build, tests, lint, test de mise à jour depuis main, copie de dist/ sur main, commit, push). Pages se met à jour en ~1 min ; vérifier https://theo1010-dev.github.io/Mon-Frigo/version.json.

## Audit avant livraison
1. `npm run build && npm test && npm run lint`
2. `python3 tests/e2e.py` (≈ 5 min ; en arrière-plan) et `python3 tests/migration.py`
3. `python3 tests/textfit.py` (aucun texte coupé à 360 et 320 px) et `python3 tests/assistant_eval.py` (≈ 90 phrases de tous les jours : toutes doivent être comprises)
4. `python3 tests/monkey.py 700 <graine>` sur 2 ou 3 graines
5. Si le catalogue change : `npm run data` (0 alerte d'audit, chaque ingrédient cité dans les étapes)
6. `publish.sh` lance `tests/update.py` sur la version en ligne

## Code
- JS vanilla, modules ES dans `js/`, regroupés par esbuild. Pas de framework. `h(tag, attrs, ...enfants)` de `ui.js` crée le DOM.
- Les fenêtres (« sheets ») sont rangées par thème : stock-, plan-, shop-, recipe-, receipt-sheets.js et onboarding.js.
- N'exporter que ce qui sert ailleurs ; `npm run lint` doit rester sans avertissement.
- Assistant : `brain.js` comprend la phrase (intentions, abréviations, fautes de frappe, plusieurs demandes), `know.js` contient le savoir de cuisine et le mode d'emploi (fiches à groupes de mots + conversions), `assistant.js` répond avec les données. Tout est hors ligne ; ajouter une fiche = une entrée dans KNOW + un test dans tests/logic.test.mjs.
- Équipement : `equipment.js` ; liste des appareils dans `recipes.js` (`EQUIP`, `EQUIP_TXT`…). Une recette qui demande un appareil absent n'est jamais cachée : grisée (`missingEquip`, `allowed(..., ignoreEquip)`). Filtre « Appareil » de l'onglet Recettes : `RUI.equip` (+ `quick.myEquip`). Remplacements : `ALT` dans recipes.js (air fryer → four, Cookeo → plaques, barbecue → plaques ou four…) + `r.x` par recette (four → air fryer si le plat tient dans le panier, Thermomix → plaques [+ mixeur]), calculés par `alternatives()` dans tools/data/recipes.py ; `equipPlan()` donne les manques et les conseils (`SWAP_TIP`).
- Vitesse : `score`, `coverage`, `lotsOf` sont mémorisés tant que l'état ne change pas ; ne jamais modifier stock, historique ou réglages sur place (toujours un nouveau tableau/objet).
- Recettes : `tools/data/gen_hand*.py`, fonction `H(titre, catégorie, temps, matériel, tags, ingrédients, étapes, cuisine, meal=(...), serv, diff)`. Ingrédients connus : `tools/data/ingredients.py`.
