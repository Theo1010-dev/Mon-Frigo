# Installer Mon Frigo sur ton téléphone (10 minutes)

## 1. Remplacer l'ancienne version sur GitHub
1. Ouvre ton dépôt **github.com/Theo1010-dev/Mon-Frigo**.
2. Supprime tous les anciens fichiers (l'ancien `app.js`, le dossier `data/recipe-chunks`, etc.).
   Le plus simple depuis un ordinateur : GitHub Desktop, ou `git rm -r .` puis commit.
3. Glisse-dépose **tout le contenu** du dossier `Mon-Frigo` de ce zip à la racine du dépôt
   (on doit voir directement `index.html`, `sw.js`, `js/`, `data/`, `assets/`…).
4. Valide (« Commit changes »).
5. Si ce n'est pas déjà fait : **Settings → Pages → Deploy from a branch → main → / (root) → Save**.

## 2. Sur ton téléphone Android
1. Ouvre **https://theo1010-dev.github.io/Mon-Frigo/** dans Chrome.
2. Si l'ancienne version s'affiche encore : ferme l'onglet ou l'app, attends 10 secondes, rouvre-la (une à deux fois suffit).
3. Menu ⋮ → **Installer l'application** (ou « Ajouter à l'écran d'accueil »).
4. Tes produits de l'ancienne version sont récupérés automatiquement au premier lancement.

## 3. À tester toi-même (impossible à vérifier sans ton téléphone)
- le bouton retour Android ;
- le scanner de code-barres et la permission caméra ;
- l'écran qui reste allumé en mode cuisine ;
- l'installation et l'ouverture hors ligne (mode avion).

## Bon à savoir
- Tes données ne quittent jamais ton téléphone. Pense à faire **Moi → Télécharger une sauvegarde** de temps en temps.
- Pour publier une nouvelle version : `python3 tools/release.py 1.0.1`, puis remets les fichiers sur GitHub.
