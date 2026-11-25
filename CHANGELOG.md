# Historique des versions de Mon Frigo

## 1.13.4
- iPhone : consignes d'installation à jour pour iOS 26 (⋯ → Partager → « Sur l'écran d'accueil », « Ouvrir comme app web » activé) et pour Chrome sur iPhone.

## 1.13.3
- iPhone : l'accueil explique comment installer l'app avec Safari (Partager → « Sur l'écran d'accueil ») au lieu des consignes de Chrome ; l'assistant le sait aussi.

## 1.13.2
- **Les 6 appareils sont de retour** dans « Mon équipement » : plaques, four, micro-ondes, mixeur, air fryer et Thermomix, chacun avec le nombre de recettes qui en ont besoin. Chacun compte vraiment : une recette qui demande un appareil que tu n'as pas est grisée (« Il faut des plaques de cuisson », « Il faut un Thermomix »…). Les plaques sont cochées une fois pour toutes à la mise à jour, pour que rien ne change sans toi.
- 15 recettes pour l'air fryer (frites maison, poulet croustillant, légumes rôtis, saumon miel-soja, patates douces, pois chiches croustillants, pommes rôties), le Thermomix (risotto, velouté de potimarron, pâte à crêpes, crème au chocolat, curry de lentilles) et le micro-ondes (pommes de terre, porridge, œufs brouillés), avec les vrais réglages. 1 186 recettes en tout.
- Assistant : « une recette au air fryer », « au Thermomix » ; repères de cuisson au air fryer et gestes de base au Thermomix.
- Une crème dessert n'est plus rangée par erreur dans les entrées.

## 1.13.1
- Recheck : les 60 tampons du passeport correspondent exactement à leur liste (avec et sans four). Les recettes grisées apparaissent aussi quand on tape un plat dans Semaine (« il faut un four »), et « Effacer » dans les filtres garde la cuisine choisie depuis le passeport.

## 1.13
- **Équipement** : rubrique « Mon équipement » dans Moi (sortie des préférences), et « Appareils » sur le plan de travail de « Ma cuisine ». Une recette qui demande un appareil absent n'est plus cachée : elle est grisée, avec « Il faut un four », et un bouton « J'ai un four » dans la recette.
- **Passeport** : toucher une cuisine montre exactement ses recettes (avant : une recherche de texte). Les plats régionaux rangés dans « Française » rejoignent leur région (quiche lorraine → Lorraine, bœuf bourguignon → Bourguignonne…), et les comptes correspondent à la liste.
- **Assistant** bien plus malin : questions de cuisine (cuissons des pâtes, du riz, des œufs, de la viande ; sécurité des restes ; DLC/DDM ; astuces comme une sauce trop salée ou une mayo ratée), conversions (thermostat, cuillères ↔ grammes, cl ↔ ml), quantités par personne, mode d'emploi de l'app, petite conversation. Il comprend les fautes de frappe et les abréviations (« cb de tps pr cuire les pattes »), deux demandes dans la même phrase, et les relances (« et du lait ? », « plus rapide »). Il dit honnêtement quand une question sort de la cuisine.
- 1 171 recettes (37 nouvelles écrites à la main) : bacalhau à Brás, caldo verde, lamingtons, pâté chinois, pouding chômeur, flamiche, garbure, truffade, teurgoule, boulettes suédoises, salade Olivier, blinis, colcannon, spätzle, strudel, chorba, loubia, cari de poulet, lomo saltado, feijoada, japchae, gado-gado, amok, churros, éclairs au chocolat…

## 1.12.1
- Code rangé (aucun changement visible) : les grosses fenêtres sont découpées par thème (stock, semaine, courses, recettes, ticket, premier lancement), le code mort est retiré, les outils de données sont regroupés dans `tools/data/`, et la mise en ligne se fait d'une seule commande (`tools/publish.sh`).

## 1.12
- **Frigo**, la mascotte de l'assistant : un petit frigo à toque de chef (bouton de l'accueil, page Moi, discussion).
- Assistant plus malin : il ouvre la discussion avec ce qui compte (produits à finir, repas du soir, courses), comprend les relances après une idée (« plus rapide », « sans viande », « d'autres »), range tes achats racontés (« j'ai acheté du lait et 6 œufs »), retire ce qui est fini (« j'ai fini le beurre ») et retient tes goûts (« je n'aime pas les champignons », « on est 3 », « je suis végétarien ») ; tout s'annule d'un toucher.
- « Ce que Mon Frigo a appris » : cuisines préférées, rythme en cuisine, jour de courses, produits souvent jetés avec un conseil, goûts.
- Accueil : l'encadré « Remplis ton frigo » est retiré (le raccourci « Ajouter » suffit).

## 1.11
- **Mon assistant** (bouton ✨ de l'accueil, ou Moi) : on lui écrit (ou on lui parle) comme à quelqu'un. « On mange quoi ce soir ? », « un dessert rapide », « qu'est-ce qui va périmer ? », « est-ce qu'il me reste des œufs ? », « ajoute du lait aux courses », « mets des lasagnes demain soir », « combien de temps se garde le poulet ? », « par quoi remplacer la crème ? », « qu'as-tu appris sur moi ? ». Tout est calculé sur le téléphone ; chaque action peut s'annuler.
- **Ce que Mon Frigo a appris** enrichi : recettes préférées, plats habituels, repas récurrents, achats réguliers, avec un accès direct à l'assistant.
- **Comment ça marche** : le guide de l'app, onglet par onglet (Moi → Comment ça marche).
- **Anneau d'XP** de retour autour du personnage (il se remplit avec le niveau) ; le point orange reste réservé aux nouveautés.
- Semaine : flèches mieux espacées, « Revenir à cette semaine » sous l'en-tête.
- 1 134 recettes (51 nouvelles écrites à la main : French tacos, poulet général Tao, gyudon, souvlaki, burger végé, parmentier de poisson, waterzoi, panna cotta, mille-feuille, banoffee, pastéis de nata, bûche, falafels au four, cheese naan…).

## 1.10
- **Semaine** : même écran qu'avant, mais « + » ouvre un champ texte. On tape n'importe quel plat (« raclette », « resto »…), Entrée, et c'est planifié. Les plats habituels deviennent des raccourcis en un toucher, les recettes de l'app restent proposées. Nouveau : « Déplacer » un repas (échange si le créneau est pris) et « En faire une recette ».
- **Stock** : vue « Ma cuisine » en plus de la liste. Frigo américain ouvert, congélateur, placard (avec « Toujours là »), plan de travail ; les produits urgents sont entourés. Un toucher ouvre la fiche.
- **Recettes** : 1 083 recettes (68 nouvelles écrites à la main) : apéro et tapas, entrées, desserts, gâteaux, goûters et plats. Filtres refaits : une ligne « moments » (Plats, Entrées, Apéro, Desserts, P'tit déj), six filtres rapides, et dans « Filtres » le temps, la cuisine (France, Italie, Asie…), le type de plat, petit budget, jamais cuisinées, plus élaborées, mes recettes et le tri.
- **Thème Auto** : clair le jour et sombre la nuit, au choix avec le soleil (lever et coucher calculés chaque jour), avec tes horaires, ou comme le téléphone.
- **Accueil** : date bien lisible sur toutes les ambiances, nom de la saison avec une icône, plus de logo inutile (la surprise se trouve en touchant le bonjour).
- **Profil** : plus de gros bouton « Personnaliser » ni d'encadré : on touche son portrait (petite pastille orange s'il y a du nouveau). « Comment gagner de l'XP ? » explique tout. Les récompenses sont regroupées dans une seule tuile.
- Nouveaux produits connus : noix de coco râpée, confiture, pâte à tartiner, surimi.

## 1.9
- v1.9.1 : emojis corrigés pour les produits de base (sucre, poivre, épices, moutarde, mayonnaise, vanille, cannelle, tofu), logo aux couleurs de l'ambiance, le personnage est gardé même si on ferme sans « Enregistrer », bouton « Annuler » des messages aux couleurs de l'ambiance en sombre.
- **Ton personnage** : un petit chef dessiné que tu composes (type humain, elfe, félin, robot, extraterrestre, dragon ; coiffure, yeux, bouche, barbe, chapeau, tenue, objet, ailes ou jetpack, fond, compagnon). Classique, fantastique ou futuriste.
- **Jeu** : le bouton du profil montre ton personnage dans un anneau d'XP (plus de chiffre qui ressemble à une notification ; un point seulement s'il y a du nouveau). Chaque niveau et chaque succès débloque un objet. « +XP » qui s'envole à chaque geste utile, écran de montée de niveau avec les récompenses, chemin des récompenses, succès groupés avec leur avancement, passeport gourmand (un tampon par cuisine goûtée). Toujours aucun défi imposé.
- **Ambiances** : le clair/sombre se règle à part et vaut pour toutes. Six ambiances dessinées : Classique, Saisons, Chaumière, et trois nouvelles (Bord de mer, Bistrot, Zen), chacune en clair et en sombre, avec paysage, bandeau des pages, petits textes et animations.
- **Saisons** redessinées pour se reconnaître d'un coup d'œil (arbre en fleurs et tulipes, tournesols et blé, arbres roux et citrouilles, neige et bonhomme de neige) et nom de la saison sous la date.
- **Toujours chez moi** (ex-« placards ») : produits classés par famille, deux réglages rapides, n'importe quel autre produit ajoutable, rappel en bas du stock ; ces produits ont maintenant la coche verte dans les recettes.

## 1.8
- 1 015 recettes (265 de plus), dont 530 classiques écrites à la main : soupes, salades, entrées et apéritif, œufs, sandwichs, petits-déjeuners, pâtes, riz, currys, mijotés, poissons, gratins, tartes et pizzas, desserts et goûters. Aucun doublon, chaque ingrédient est cité dans les étapes.
- 11 nouveaux produits connus (moules, sardines, céleri, cerises, pêches, melon, ananas, choux de Bruxelles, kiwis, raisin, harissa), avec leurs saisons.
- Les recettes d'apéritif (guacamole, tzatziki, tapenade…) ne sont plus proposées comme repas dans la semaine ni sur l'accueil.
- Indice d'équilibre calculé par portion (les recettes pour 4 ou 6 ne sont plus pénalisées), titres corrigés (« gratin d'aubergines »).
- Succès : un succès obtenu reste acquis ; les cuisines régionales françaises comptent comme une seule cuisine pour « Tour du monde ».

## 1.7
- Stock revu de fond en comble : quantités d'achat habituelles (500 g de pâtes, 1 l de lait, 6 œufs…), quantité lue dans le nom, fiche produit avec quantité modifiable, « J'en ai utilisé » (tout, la moitié…), « Aux courses » avec quantité et prix, export en note (.txt) ou tableau (.csv).
- 750 recettes, dont 265 écrites à la main (76 nouvelles, plus élaborées), inspirées de la base fournie (Recipe Box, licence ODC-By) et réécrites en français.
- Thèmes Saisons (selon la date ou choisie) et Chaumière : couleurs, paysage animé, petits textes, surprises cachées.
- Profil façon jeu de rôle : niveau, titre, palier (bronze → émeraude), XP et 24 succès, calculés uniquement à partir de l'usage normal (aucun défi imposé ; un jour d'activité ne compte qu'une fois, pas de triche possible).
- Fruits et légumes de saison : tuiles, fiche produit, calendrier mois par mois.
- Défilement mémorisé par onglet, bandeau décoratif sur chaque page des thèmes Saisons et Chaumière, messages neutres en genre.
- Qualité : 58 parcours de bout en bout, 28 tests de logique, 2 200 actions aléatoires sans erreur, ESLint (npm run lint), un an de données simulées testé.

## 1.6
- Calculs mémorisés et index du stock : écrans 2 à 3 fois plus rapides sur un téléphone moyen.
- « Tout jeter » pour les produits périmés (avec annulation), partage d'une recette par message.
- Audit complet : aucun texte coupé à 360 et 320 px, scanner de code-barres testé de bout en bout.

## 1.5
- Scan du ticket de caisse (lecture sur le téléphone avec Tesseract, puis vérification article par article avec quantité, prix, rangement et date).
- Alertes de péremption (à l'ouverture et en arrière-plan quand Chrome le permet).
- « Vider le frigo », restes simples dans la semaine, fruits et légumes de saison.
- « Toujours dans mes placards » choisi par l'utilisateur (par défaut sel, poivre, huile) : les épices et condiments sont de vrais produits.
- Scanner de code-barres fiabilisé (catégorie Open Food Facts, quantité, nom propre).
- Page « Moi » en rubriques, envoi des données vers un autre téléphone.

## 1.1 (design)
- Chaque recette est servie dans une « assiette » teintée selon sa catégorie (blé pour les pâtes, curcuma pour les currys, basilic pour les salades…).
- Fond blanc émaillé comme un intérieur de frigo, texte couleur aubergine, magenta réservé aux actions principales.
- Statuts aux couleurs des aliments : neutre quand tout va bien, curry quand ça approche, tomate quand c'est urgent.
- Polices embarquées (fonctionnent hors ligne) : Bricolage Grotesque pour les titres, Instrument Sans pour le texte.
- Mode sombre complet, testé de 320 à 620 px de large.
