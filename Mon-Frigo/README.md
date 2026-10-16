# Mon Frigo — v1.1.0

Application Android (PWA) pour gérer ton stock, trouver quoi cuisiner, planifier ta semaine et faire tes courses, sans gaspiller.
Tout fonctionne hors ligne, et tes données restent sur ton téléphone.

## Design (v1.1)
- Chaque recette est servie dans une « assiette » teintée selon sa catégorie (blé pour les pâtes, curcuma pour les currys, basilic pour les salades…).
- Fond blanc émaillé comme un intérieur de frigo, texte couleur aubergine, magenta réservé aux actions principales.
- Statuts aux couleurs des aliments : neutre quand tout va bien, curry quand ça approche, tomate quand c'est urgent.
- Polices embarquées (fonctionnent hors ligne) : Bricolage Grotesque pour les titres, Instrument Sans pour le texte.
- Mode sombre complet, testé de 320 à 620 px de large.

## Ce que fait l'app
- **Stock** par zone (frigo, congélateur, placard, autres) avec dates limites estimées automatiquement, ajout rapide en un geste, scanner de code-barres (si le téléphone le permet).
- **Recettes** : 359 recettes cohérentes (117 classiques écrites à la main + idées composées à partir de vrais temps de cuisson), recherche par plat ou ingrédient, filtres (faisable avec mon stock, anti-gaspi, végé, rapide…), recettes perso.
- **Recommandations expliquées** : « Utilise le poulet qui expire aujourd'hui », « Il te manque 1 ingrédient »…
- **Semaine** : planning midi/soir, remplissage automatique qui tient compte de ton stock et évite les répétitions.
- **Courses** : générées depuis la semaine en déduisant ce que tu as déjà, regroupées par rayon, partage par message, rangement dans le stock en un clic.
- **Mode cuisine** : étapes en grand, minuteurs détectés dans le texte, écran qui reste allumé, retrait automatique du stock à la fin, restes et note.
- **Anti-gaspi** : produits à consommer vite en tête de l'accueil, journal de ce qui est jeté.
- **Sauvegarde** : export/import JSON (fusion ou remplacement), point de restauration automatique.
- **Reprise de l'ancienne version** : au premier lancement, le stock, les courses et le journal de la v0.9 sont récupérés automatiquement.

## Mettre à jour l'app (à chaque nouvelle version)
1. `python3 tools/release.py 1.0.1` (change le numéro de version partout — indispensable pour que les téléphones reçoivent la mise à jour)
2. `npm test`
3. Publier sur GitHub.

## Pour les développeurs
- Aucun outil de compilation : HTML, CSS et JavaScript (modules ES) servis tels quels.
- `npm test` : contrôle des fichiers + 20 tests de logique. `npm run test:all` : en plus, 22 parcours utilisateur automatisés dans Chromium et le test de migration (nécessite Python + Playwright).
- Le catalogue est généré : `npm run data` (ingrédients dans `tools/kb.py`, recettes dans `tools/gen_*.py`, audit strict dans `tools/build.py`).
- Aucune recette n'a été testée en cuisine : elles sont signalées comme telles dans l'app.
