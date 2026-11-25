// Ce que l'assistant sait sans internet : questions de cuisine (cuissons, conversions, conservation, astuces),
// mode d'emploi de l'app et petite conversation. Pur : texte → réponse. Testé dans tests/logic.test.mjs.
//
// Chaque fiche : g = groupes de mots qui doivent TOUS apparaître (« a|b|c » = au choix, « cuis* » = début de mot),
// a = la réponse (« **gras** » autorisé), act = bouton proposé ([libellé, cible]), x = mots qui écartent la fiche.
import { norm } from './util.js';

const KNOW = [
  // ---------- cuissons ----------
  { g: ['pate|pates|spaghetti|spaghettis|tagliatelle|tagliatelles|penne|coquillette|coquillettes|fusilli|macaroni|macaronis', 'cuire|cuisson|cuit|temps|combien|eau|sel|al dente|colle|collent'], x: ['brisee', 'feuilletee', 'sablee', 'pizza', 'crepe', 'crepes', 'tartiner', 'reste', 'restes', 'garde', 'garder', 'conserver', 'personne', 'personnes'],
    a: ['Pour des pâtes réussies : **1 litre d’eau pour 100 g**, une bonne cuillère de gros sel (10 g par litre) quand l’eau bout, puis les pâtes.', 'Compte le temps écrit sur le paquet (souvent 8 à 11 min) et goûte 1 min avant : **al dente**, elles résistent un peu sous la dent.', 'Pour qu’elles ne collent pas : beaucoup d’eau, remue dans la première minute, et pas d’huile dans l’eau.'] },
  { g: ['riz', 'cuire|cuisson|cuit|temps|combien|eau|colle|gluant'], x: ['reste', 'restes', 'garder', 'conserver', 'rechauffer'],
    a: ['Deux façons simples :', '• **À l’absorption** (riz parfumé, basmati) : rince le riz, puis 1 volume de riz pour 1,5 volume d’eau salée, couvercle, feu doux **12 min**, puis 5 min de repos hors du feu.', '• **Comme des pâtes** (riz long) : grande eau bouillante salée, **10 à 12 min**, égoutte.', 'Risotto : environ 18 min en ajoutant le bouillon petit à petit.'] },
  { g: ['oeuf|oeufs', 'coque|mollet|mollets|dur|durs|poche|poches|cuire|cuisson|minutes|combien'], x: ['frais', 'conserver', 'garder', 'remplacer', 'neige', 'blanc', 'blancs'],
    a: ['Dans l’eau qui bout déjà, œufs sortis du frigo un peu avant :', '• **À la coque** : 3 min', '• **Mollet** : 6 min, puis eau froide', '• **Dur** : 9 à 10 min, puis eau froide (plus, le jaune devient gris)', '• **Poché** : 3 min dans une eau frémissante avec un trait de vinaigre (sans sel)', '• **Au plat** : feu moyen, 3 à 4 min, couvercle si tu veux le blanc bien pris.'] },
  { g: ['pomme de terre|pommes de terre|patate|patates', 'cuire|cuisson|temps|combien|eau|vapeur|four'], x: ['conserver', 'garder', 'germe', 'germes'],
    a: ['• **À l’eau** : départ eau froide salée, **20 à 25 min** après l’ébullition. C’est cuit quand la pointe d’un couteau entre sans résistance.', '• **Vapeur** : 20 à 30 min selon la taille.', '• **Au four** (quartiers) : 200 °C, **35 à 40 min**, en les retournant à mi-cuisson.', '• **Purée** : des pommes de terre farineuses (bintje), écrasées chaudes avec beurre et lait chaud.'] },
  { g: ['steak|boeuf|entrecote|bavette|viande rouge', 'cuire|cuisson|saignant|bleu|a point|combien|temps'], x: ['hache', 'haches'],
    a: ['Pour un steak d’environ 2 cm, poêle **très chaude**, viande sortie du frigo 20 min avant :', '• **Bleu** : 1 min par face', '• **Saignant** : 2 min par face', '• **À point** : 3 à 4 min par face', 'Sale après avoir saisi, et laisse reposer **2 à 3 min** avant de couper : la viande reste juteuse.'] },
  { g: ['steak hache|steaks haches|viande hachee|hache|haches'], x: ['conserver', 'garder', 'congeler'],
    a: ['Un steak haché se mange **bien cuit à cœur** (plus de rose au centre), surtout pour les enfants, les personnes âgées et les femmes enceintes.', 'À la poêle, feu moyen : **3 à 4 min par face** pour un steak de 1,5 cm.'] },
  { g: ['poulet|volaille|dinde|cuisse|cuisses|blanc de poulet|filet de poulet', 'cuire|cuisson|cuit|temps|combien|rose|degres|four'], x: ['conserver', 'garder', 'congeler', 'decongeler'],
    a: ['La volaille se mange **toujours bien cuite** : à cœur au moins **74 °C**, le jus doit être clair et la chair plus rose.', '• Blanc en morceaux à la poêle : 8 à 10 min', '• Cuisses au four : 200 °C, 40 à 45 min', '• Poulet entier (1,5 kg) : 200 °C, environ 1 h 15, en l’arrosant.'] },
  { g: ['porc|cote de porc|cotes de porc|filet mignon|roti de porc', 'cuire|cuisson|cuit|temps|combien|rose'],
    a: ['Le porc se mange cuit à cœur (environ **70 °C**), le jus doit être clair.', '• Côtes à la poêle : 4 à 5 min par face', '• Filet mignon au four : 180 °C, 25 à 30 min, puis 5 min de repos', '• Rôti : compte 45 min à 1 h par kilo à 180 °C.'] },
  { g: ['poisson|saumon|cabillaud|colin|merlu|dorade|truite', 'cuire|cuisson|cuit|temps|combien|four|poele'], x: ['conserver', 'garder', 'congeler'],
    a: ['Le poisson cuit vite : c’est prêt quand la chair devient **opaque et se détache en lamelles**.', '• Pavé à la poêle : 3 à 4 min côté peau, 1 à 2 min de l’autre', '• Au four : 180 °C, **12 à 15 min**', '• En papillote : 200 °C, 15 min.'] },
  { g: ['legume|legumes|brocoli|brocolis|haricot|haricots|carotte|carottes|courgette|courgettes|chou|epinard|epinards', 'vapeur|cuire|cuisson|temps|combien|four|rotis|rotir'], x: ['conserver', 'garder', 'congeler'],
    a: ['À la vapeur (ou à l’eau bouillante salée) :', '• Épinards : 2 à 3 min · Courgettes en rondelles : 5 min · Brocoli en fleurettes : 5 à 7 min', '• Haricots verts : 8 à 10 min · Carottes en rondelles : 12 à 15 min', 'Rôtis au four, c’est encore meilleur : 200 °C, un filet d’huile, sel, 20 à 35 min selon le légume.'] },
  { g: ['four', 'prechauffer|prechauffe|chaleur tournante|tournante|chaleur|grill'],
    a: ['**Préchauffe** le four 10 à 15 min avant d’enfourner : les gâteaux montent mieux et les temps des recettes sont justes.', 'En **chaleur tournante**, baisse de 10 à 20 °C par rapport à une recette en chaleur classique (ou garde la température et surveille). Le **grill** sert à gratiner les 3 à 5 dernières minutes.'] },
  { g: ['air fryer|airfryer|friteuse sans huile', 'temps|combien|temperature|degres|cuire|cuisson|comment|marche|utiliser|astuce|astuces|conseil|conseils'], x: ['recette', 'idee', 'idees', 'regler', 'cocher'],
    a: ['Les repères au **air fryer** (préchauffé 3 min) :', '• Frites maison : 200 °C, 18 à 22 min · Frites surgelées : 200 °C, 12 à 15 min', '• Lanières de poulet panées : 200 °C, 10 à 12 min · Cuisses de poulet : 190 °C, 22 à 25 min', '• Pavé de saumon : 200 °C, 8 à 10 min · Légumes en morceaux : 190 °C, 12 à 15 min', 'Ne surcharge pas le panier et secoue-le à mi-cuisson : c’est ce qui rend tout croustillant. En général : 20 °C de moins et 20 % de temps en moins qu’au four.'], act: ['Une recette au air fryer', 'ask:une recette au air fryer'] },
  { g: ['thermomix|robot cuiseur', 'comment|adapter|utiliser|astuce|astuces|conseil|conseils|vitesse|marche'], x: ['recette', 'idee', 'idees', 'regler', 'cocher'],
    a: ['Les gestes de base au **Thermomix** :', '• Hacher un oignon : 5 s / vitesse 5 · Rissoler : 3 min / 120 °C / vitesse 1', '• Mijoter sans abîmer les morceaux : **sens inverse**, vitesse 1', '• Soupe veloutée : 1 min en montant progressivement de la vitesse 5 à 10', '• Râper du parmesan : 10 s / vitesse 10', 'Pour adapter une recette : hache et rissole d’abord, ajoute les liquides, puis cuis à 100 °C en sens inverse.'], act: ['Une recette au Thermomix', 'ask:une recette au Thermomix'] },
  { g: ['cuit|cuite|cuits|prete|pret', 'savoir|comment|verifier|test'],
    a: ['Quelques tests simples :', '• **Gâteau** : une lame plantée au centre ressort sèche.', '• **Viande ou volaille** : le jus qui sort est clair (pas rosé) pour la volaille et le porc.', '• **Poisson** : la chair est opaque et se détache en lamelles.', '• **Légumes, pommes de terre** : la pointe d’un couteau entre sans forcer.'] },
  // ---------- les bases maison ----------
  { g: ['bechamel'], x: ['acheter', 'garder', 'conserver'],
    a: ['Béchamel pour 4 (un gratin ou des lasagnes) : faire fondre **40 g de beurre**, ajouter **40 g de farine** et remuer 1 min.', 'Verser **50 cl de lait** petit à petit en fouettant, puis cuire 5 min à feu doux sans cesser de remuer, jusqu’à ce qu’elle nappe la cuillère. Sel, poivre, une pincée de muscade.', 'Des grumeaux ? Un coup de fouet énergique ou de mixeur, et c’est rattrapé.'] },
  { g: ['vinaigrette'],
    a: ['La règle : **1 cuillère de vinaigre pour 3 cuillères d’huile**, une pointe de moutarde, sel et poivre. Mélange d’abord le sel avec le vinaigre (il ne fond pas dans l’huile), puis la moutarde et l’huile.', 'Variantes : jus de citron à la place du vinaigre, un peu de miel, des herbes, une échalote hachée.'] },
  { g: ['pate brisee|pate a tarte', 'maison|faire|recette|comment'],
    a: ['Pâte brisée maison : **200 g de farine**, **100 g de beurre** froid en dés et une pincée de sel ; sable du bout des doigts.', 'Ajoute **5 cl d’eau** froide (ou un jaune d’œuf + un peu d’eau), forme une boule sans trop travailler, et laisse 30 min au frais avant d’étaler.'] },
  { g: ['sauce tomate', 'maison|faire|recette|comment'],
    a: ['Sauce tomate express : fais revenir un oignon et une gousse d’ail hachés dans l’huile d’olive, ajoute une boîte de tomates concassées, sel, poivre, une pincée de sucre et des herbes.', 'Laisse mijoter **15 à 20 min** à feu doux. Elle se congèle très bien.'] },
  // ---------- conversions ----------
  { g: ['cuillere a soupe|cuilleres a soupe|cas|cs|c a s|cuillere a cafe|cuilleres a cafe|cac|cc|c a c|verre|tasse|gramme|grammes|ml|cl|dl|litre'], x: [],
    conv: true,
    a: ['Les repères utiles :', '• **1 cuillère à soupe** = 15 ml ≈ 10 g de farine, 15 g de sucre ou de beurre, 20 g de miel', '• **1 cuillère à café** = 5 ml ≈ 3 g de farine, 5 g de sucre ou de sel', '• **1 verre** ≈ 20 cl ≈ 110 g de farine ou 170 g de sucre', '• 1 cl = 10 ml · 1 dl = 100 ml · 1 litre = 100 cl', '• 1 œuf ≈ 50 g sans la coquille · 1 noix de beurre ≈ 10 g'] },
  { g: ['thermostat|th|degres|degre|temperature'], x: [], therm: true,
    a: ['Thermostat ↔ degrés : **thermostat × 30 = °C**.', '• Th 3 = 90 °C · Th 4 = 120 °C · Th 5 = 150 °C', '• **Th 6 = 180 °C** (la plupart des gâteaux) · Th 7 = 210 °C · Th 8 = 240 °C'] },
  { g: ['combien|quantite|quantites|portion|portions|grammes|par personne|pour', 'par personne|personne|personnes|pers|portion|portions'], x: ['recette', 'semaine'],
    a: ['Les quantités habituelles **par personne** (plat principal) :', '• Pâtes ou riz crus : 80 à 100 g (riz : 70 à 80 g)', '• Viande : 120 à 150 g · Poisson : 150 g', '• Pommes de terre : 200 à 250 g · Légumes : 200 g', '• Lentilles ou pois chiches secs : 60 à 80 g', 'Dans une recette, le bouton « Pour … personnes » recalcule tout tout seul.'] },
  // ---------- sécurité et conservation ----------
  { g: ['reste|restes|plat cuisine|plats cuisines|tupperware|boite', 'garder|conserver|combien|jours|frigo|tient|congeler'],
    a: ['Un plat cuisiné se garde **2 à 3 jours au frigo**, dans une boîte fermée.', 'Mets-le au frais **dans les 2 heures** après la cuisson (pas toute la nuit sur la plaque). Au congélateur : 2 à 3 mois.', 'Réchauffe-le une seule fois, bien chaud partout.'] },
  { g: ['riz', 'reste|restes|garder|conserver|rechauffer|veille|lendemain'],
    a: ['Le **riz cuit** est à manipuler avec soin : refroidis-le vite (étalé dans un plat), mets-le au frigo dans l’heure, et mange-le **dans les 24 h**.', 'Réchauffe-le **une seule fois**, jusqu’à ce qu’il soit bien chaud partout. Le riz de la veille est parfait pour un riz sauté.'] },
  { g: ['recongeler|recongele|recongelee'],
    a: ['Un produit décongelé **cru** ne se recongèle pas tel quel.', 'Par contre, tu peux le **cuisiner puis congeler le plat cuit** : par exemple, de la viande hachée décongelée → une bolognaise → au congélateur.'] },
  { g: ['decongeler|decongele|decongelation|decongelee'],
    a: ['Le mieux : **au frigo**, la veille (12 à 24 h selon la taille).', 'Pressé : au micro-ondes en mode décongélation, puis cuisine aussitôt. Évite de laisser décongeler à température ambiante.', 'Les légumes surgelés se cuisent directement, sans décongeler.'] },
  { g: ['dlc|ddm|dluo|date limite|date de peremption|de preference|consommer jusqu|consommer de preference'],
    a: ['Il y a deux dates différentes :', '• **« À consommer jusqu’au »** (DLC) : produits frais (viande, poisson, laitages). Après cette date, on ne mange plus.', '• **« À consommer de préférence avant »** (DDM) : pâtes, riz, conserves, biscuits… Après la date, ça reste mangeable si l’emballage est intact ; le goût peut juste baisser.'] },
  { g: ['oeuf|oeufs', 'frais|fraicheur|perime|perimes|savoir|bon|bons|flotte'],
    a: ['Le test du verre d’eau : un œuf **frais coule et reste à plat**. S’il se redresse, il est plus vieux (bon cuit dur). **S’il flotte, jette-le.**', 'Les œufs se gardent environ 4 semaines après la ponte, de préférence au frigo.'] },
  { g: ['lait', 'ouvert|ouverte|combien|garder|conserver|jours'],
    a: ['Une bouteille de lait **ouverte se garde 3 à 4 jours au frigo**, bien fermée. Fermé, le lait UHT se garde au placard jusqu’à la date.'] },
  { g: ['herbe|herbes|persil|coriandre|basilic|ciboulette|menthe', 'garder|conserver|fraiche|fraiches|fanent|flétrir|longtemps'],
    a: ['Mets les herbes fraîches **comme un bouquet** dans un verre d’eau (au frigo, sauf le basilic qui préfère la cuisine), ou roulées dans un papier essuie-tout humide dans une boîte.', 'Astuce anti-gaspi : hache le reste et congèle-le dans un bac à glaçons avec un peu d’huile.'] },
  { g: ['pain', 'rassis|dur|sec|reste|restes|garder|conserver|congeler'],
    a: ['Le pain se garde dans un sac en tissu ou une boîte à pain, **pas au frigo** (il rassit plus vite). Il se **congèle très bien** tranché.', 'Pain rassis : pain perdu, croûtons, chapelure, soupe à l’oignon, panzanella…'], act: ['Une recette de pain perdu', 'ask:recette pain perdu'] },
  { g: ['banane|bananes', 'mure|mures|noire|noires|trop|tachee|reste|restes'],
    a: ['Des bananes bien mûres, c’est parfait pour un **banana bread**, des pancakes, un smoothie ou une glace minute (congelées en rondelles puis mixées).'], act: ['Une idée avec des bananes', 'ask:une idée avec des bananes'] },
  { g: ['avocat|avocats|fruit|fruits|kiwi|kiwis|mangue|poire|poires', 'murir|mur|mure|dur|durs'],
    a: ['Pour faire mûrir plus vite : dans un **sac en papier avec une pomme ou une banane**, à température ambiante, 1 à 3 jours. Une fois mûr, au frigo pour le garder quelques jours de plus.'] },
  // ---------- astuces ----------
  { g: ['trop sale|trop salee|trop de sel|trop salees|trop sales'],
    a: ['Allonge avec un liquide **non salé** : eau, crème, lait, bouillon maison ou lait de coco. Ajoute des pommes de terre, du riz ou des pâtes non salés pour répartir le sel.', 'Une pointe de citron ou de sucre atténue aussi la sensation de sel.'] },
  { g: ['trop epice|trop epicee|trop piquant|trop piquante|trop fort|trop pimente|trop relevee|trop releve'],
    a: ['Calme le feu avec du **gras ou du laitage** : yaourt, crème, lait de coco, beurre. Un peu de sucre ou de citron aide aussi.', 'Sers avec du riz, du pain ou des pommes de terre, et un yaourt nature à côté.'] },
  { g: ['mayonnaise|mayo', 'ratee|rate|tranche|tranchee|monte pas|liquide|faire|maison'],
    a: ['Mayonnaise maison : jaune d’œuf + 1 cuillère de moutarde **à température ambiante**, puis l’huile en filet en fouettant sans arrêt (25 cl d’huile par jaune). Sel, poivre, vinaigre à la fin.', 'Ratée ? Dans un bol propre, mets une cuillère de moutarde (ou un jaune) et verse la mayo ratée petit à petit en fouettant : elle repart.'] },
  { g: ['blanc|blancs', 'neige|monter|montent|ferme'],
    a: ['Blancs en neige : bol **bien propre et sec**, pas une trace de jaune, une pincée de sel. Fouette doucement puis plus vite. Ils sont prêts quand ils tiennent dans le bol retourné.', 'Incorpore-les à la fin, délicatement, en soulevant avec une spatule.'] },
  { g: ['crepe|crepes', 'pate|grumeau|grumeaux|repos|reposer|colle|collent|rate|ratee'],
    a: ['Pour une pâte sans grumeaux : verse le lait **petit à petit** sur la farine et les œufs en fouettant. Si c’est trop tard, un coup de mixeur ou une passoire.', 'Le repos (30 min à 1 h) n’est pas obligatoire, mais les crêpes sont plus souples. Poêle bien chaude et légèrement graissée pour qu’elles n’accrochent pas.'], act: ['Voir la recette des crêpes', 'ask:recette crêpes'] },
  { g: ['chocolat', 'fondre|fondu|bain marie|micro'],
    a: ['Au **bain-marie** (bol posé sur une casserole d’eau frémissante, sans toucher l’eau) en remuant, ou au **micro-ondes par tranches de 30 s** en remuant entre chaque. Pas une goutte d’eau dedans : il deviendrait granuleux.'] },
  { g: ['caramel'],
    a: ['Caramel : du sucre (avec 2 cuillères d’eau, c’est plus facile) dans une casserole, **feu moyen, sans remuer** ; fais juste tourner la casserole. Arrête dès qu’il est blond-ambré : il continue de cuire.', 'Attention aux brûlures : le caramel est bien plus chaud que l’eau bouillante.'] },
  { g: ['oignon|oignons', 'pleurer|pleure|larmes|yeux'],
    a: ['Couteau **bien aiguisé**, oignon passé 15 min au frigo avant, et coupe la racine en dernier : beaucoup moins de larmes.'] },
  { g: ['levure', 'boulangere|chimique|difference|remplacer|quelle'],
    a: ['• **Levure chimique** (sachet) : pour les gâteaux, elle agit à la cuisson.', '• **Levure de boulanger** : pour le pain, la pâte à pizza, la brioche ; elle a besoin de temps pour faire lever la pâte (1 à 2 h).', 'Elles ne se remplacent pas l’une par l’autre.'] },
  { g: ['proteine|proteines', 'vege|vegetarien|vegetarienne|sans viande|viande|vegan|ou trouver|manger'],
    a: ['Sans viande, les protéines se trouvent dans les **lentilles, pois chiches, haricots secs**, le **tofu**, les **œufs**, les **laitages et fromages**, le quinoa et les fruits à coque.', 'Associer céréales + légumineuses (riz + lentilles, semoule + pois chiches) donne un repas bien complet.'], act: ['Une idée végé', 'ask:une idée végé'] },
  { g: ['calorie|calories|kcal|regime|maigrir|perdre du poids'],
    a: ['Je ne compte pas les calories, mais chaque recette a un **indice d’équilibre** (légumes, protéines, gras). Pour manger plus léger, demande-moi « une idée légère » ou utilise les salades, soupes et poissons.'], act: ['Une idée légère', 'ask:une idée légère pour ce soir'] },
  { g: ['batch|batch cooking|avance|a l avance|meal prep|lunch|lunchbox|gamelle|tupperware', 'cuisin|prepar|faire|idee|idees|comment'],
    a: ['Pour cuisiner à l’avance : choisis 2 ou 3 plats qui se gardent bien (mijotés, currys, gratins, soupes, salades de lentilles), cuisine-les le dimanche et range-les en boîtes : **3 jours au frigo**, le reste au congélateur.', 'Dans l’onglet Semaine, « Proposer des repas » peut remplir la semaine pour toi.'], act: ['Ouvrir ma semaine', 'tab:plan'] },
  { g: ['gaspillage|gaspiller|gaspi|jeter moins|jette trop|anti gaspi'],
    a: ['Les bons réflexes : **devant ce qui périme en premier**, une liste de courses faite depuis la semaine, et le congélateur avant qu’il soit trop tard (pain, viande, herbes, bananes…).', 'Dans l’app : les produits « à consommer vite » sont en tête de l’accueil, et « Vider le frigo » propose des recettes avec eux.'], act: ['Qu’est-ce qui va périmer ?', 'ask:qu’est-ce qui va périmer ?'] },
  // ---------- mode d'emploi de l'app ----------
  { g: ['ajouter|ajoute|rentrer|enregistrer|mettre', 'produit|produits|stock|frigo|article'], x: ['courses', 'liste'], app: true,
    a: ['Onglet **Stock**, bouton **+** en bas : un produit, l’**ajout rapide** (plusieurs d’un coup), le **scanner de code-barres** ou le **ticket de caisse**.', 'Tu peux aussi me le dire : « j’ai acheté du lait et 6 œufs ».'], act: ['Ouvrir mon stock', 'tab:stock'] },
  { g: ['scanner|scan|code barre|code barres|ticket|photo'], app: true,
    a: ['• **Code-barres** : Stock → + → Scanner (si ton téléphone le permet).', '• **Ticket de caisse** : Accueil → « Scanner un ticket », ou Stock → + → Ticket. Je lis les articles, tu vérifies, et tout part dans ton stock.'], act: ['Ouvrir mon stock', 'tab:stock'] },
  { g: ['date|dates|peremption|dlc', 'changer|modifier|corriger|mettre'], app: true,
    a: ['Touche le produit dans ton **Stock** : sa fiche s’ouvre et tu peux changer la date, la quantité, le rangement, ou le congeler.'], act: ['Ouvrir mon stock', 'tab:stock'] },
  { g: ['liste|courses', 'partager|envoyer|ranger|cocher|faire|comment'], app: true,
    a: ['Onglet **Courses** : la liste est rangée par rayon, tu coches en faisant tes courses, puis **« Ranger »** met tout dans ton stock avec les dates. Le bouton partager l’envoie par message.', 'Depuis ta semaine, « Faire les courses » ajoute tout ce qui manque.'], act: ['Ouvrir mes courses', 'tab:shop'] },
  { g: ['planifier|planning|semaine|programmer', 'comment|marche|faire|ajouter|repas'], app: true,
    a: ['Onglet **Semaine** : touche un jour, puis **+** sur le midi ou le soir, et tape n’importe quel plat. Les **…** d’un repas permettent de le déplacer, le remplacer ou dire que tu l’as cuisiné.', 'Ou dis-le moi : « mets des lasagnes demain soir ».'], act: ['Ouvrir ma semaine', 'tab:plan'] },
  { g: ['equipement|appareil|appareils|four|mixeur|micro ondes|micro onde|plaques|air fryer|airfryer|thermomix', 'ou|regler|changer|ajouter|j ai|grisee|grisees|cocher|mon'], app: true, x: ['cuire', 'cuisson', 'temps', 'prechauffer', 'tournante', 'recette', 'idee'],
    a: ['Ton équipement se règle dans **Moi → Mon équipement**, ou en touchant « Appareils » sur le plan de travail de « Ma cuisine » (onglet Stock) : plaques, four, micro-ondes, mixeur, air fryer et Thermomix.', 'Les recettes qui demandent un appareil que tu n’as pas restent visibles, **grisées**, avec « Il faut un four ».'], act: ['Mon équipement', 'equip'] },
  { g: ['toujours chez moi|placard|base|bases|sel|poivre|huile', 'toujours|regler|cocher|compte|courses|manque'], app: true, x: ['combien', 'garder', 'conserver', 'remplacer', 'trop'],
    a: ['**« Toujours chez moi »** (Moi, ou l’étagère « Toujours là » dans Ma cuisine) : ce que tu as en permanence, comme le sel, le poivre ou l’huile. Ces produits comptent toujours comme disponibles et ne partent jamais dans les courses.'], act: ['Toujours chez moi', 'pantry'] },
  { g: ['recette', 'creer|ajouter|ma propre|mes propres|perso|personnelle|modifier|adapter'], app: true,
    a: ['Onglet **Recettes**, bouton **+** en haut : tu crées ta recette (ingrédients, étapes). Pour partir d’une recette existante, ouvre-la et touche **« Adapter »**.'], act: ['Ouvrir les recettes', 'tab:recipes'] },
  { g: ['sauvegarde|sauvegarder|telephone|changer de telephone|nouveau telephone|transferer|exporter|perdre|donnees'], app: true, x: ['code barre'],
    a: ['Tes données sont **sur ton téléphone**, rien n’est envoyé sur internet. Une mise à jour de l’app ne les efface jamais.', '**Moi → Sauvegarde** : télécharge une copie de temps en temps, ou « Envoyer vers un autre téléphone ». N’utilise jamais « Effacer les données du site » dans Chrome.'], act: ['Ouvrir Moi', 'tab:me'] },
  { g: ['theme|ambiance|couleur|couleurs|sombre|nuit|clair|chaumiere'], app: true,
    a: ['**Moi → Apparence** : choisis ton ambiance (Classique, Saisons, Chaumière, Bord de mer, Bistrot, Zen) et le mode clair, sombre ou automatique.'], act: ['Ouvrir Moi', 'tab:me'] },
  { g: ['notification|notifications|alerte|alertes|prevenir|rappel'], app: true,
    a: ['**Moi → Alertes de péremption** : une notification par jour au maximum quand des produits expirent aujourd’hui ou demain.'], act: ['Ouvrir Moi', 'tab:me'] },
  { g: ['personnage|avatar|tenue|chapeau|perso'], app: true, x: ['recette'],
    a: ['Touche **ton portrait** en haut à droite : tu composes ton personnage, et chaque niveau débloque de nouveaux objets (le point orange veut dire qu’il y a du nouveau).'], act: ['Ouvrir Moi', 'tab:me'] },
  { g: ['passeport|tampon|tampons'], app: true,
    a: ['Le **passeport gourmand** (Moi) : chaque recette cuisinée tamponne sa cuisine. Touche une cuisine pour voir toutes ses recettes (les grisées demandent un appareil que tu n’as pas).'], act: ['Ouvrir Moi', 'tab:me'] },
  { g: ['installer|installation|ecran d accueil|icone|application|iphone|ipad'], app: true, x: ['donnees', 'recette', 'cuire'],
    a: ['• **Android** : dans Chrome, menu ⋮ → **« Installer l’application »**.', '• **iPhone** : dans Safari, touche **⋯** à droite de l’adresse (ou le bouton Partager), puis Partager → **« Sur l’écran d’accueil »**, laisse « Ouvrir comme app web » activé, puis Ajouter. Dans Chrome sur iPhone : bouton Partager dans la barre d’adresse → « Sur l’écran d’accueil ».', 'Ensuite Mon Frigo s’ouvre comme une vraie appli, avec son icône, et marche sans internet. Les données restent sur chaque téléphone.'] },
  { g: ['hors ligne|sans internet|internet|connexion|wifi|reseau'], app: true,
    a: ['Tout marche **sans internet** : stock, recettes, semaine, courses et moi. Seules la dictée vocale et la recherche de code-barres en ont besoin.'] },
  { g: ['mise a jour|mettre a jour|nouvelle version|version'], app: true,
    a: ['La nouvelle version s’installe **toute seule** quand tu ouvres l’app avec internet. Tes données sont gardées : surtout ne désinstalle pas l’app. Ta version est écrite dans Moi → Application.'] },
  // ---------- petite conversation ----------
  { g: ['qui es tu|t es qui|tu es qui|c est quoi ton nom|comment tu t appelles|ton nom|presente toi'], small: true,
    a: ['Moi c’est **Frigo**, le petit assistant de ton app 🧑‍🍳 Je connais ton stock, tes recettes, ta semaine et tes courses, et je réponds aux questions de cuisine. Tout se passe sur ton téléphone.'] },
  { g: ['ia|intelligence artificielle|chatgpt|robot|humain|vrai'], small: true, x: ['recette'],
    a: ['Je suis un assistant **qui tourne entièrement sur ton téléphone**, sans internet : je comprends les questions de cuisine et de ton frigo, mais je ne suis pas un ChatGPT qui sait tout. Pour le reste du monde, je n’ai pas de réponse 😊'] },
  { g: ['ca va|comment vas tu|comment tu vas|la forme|tu vas bien'], small: true, x: ['recette', 'four'],
    a: ['Ça va très bien, merci ! Mon frigo intérieur est à 4 °C 😄 Et toi, on cuisine quoi aujourd’hui ?'] },
  { g: ['blague|drole|rigoler|fais moi rire'], small: true,
    jokes: ['Pourquoi les tomates rougissent ? Parce qu’elles ont vu la salade se déshabiller 🍅', 'Que dit un oignon quand il se cogne ? Aïe-ail ! 🧅', 'Quel est le comble pour un cuisinier ? Avoir un cœur d’artichaut et ne pas savoir le cuire 💚', 'Pourquoi le citron est-il toujours stressé ? Parce qu’on le presse tout le temps 🍋'] },
  { g: ['je m ennuie|ennui|quoi faire|occupe moi'], small: true,
    a: ['Et si on cuisinait un truc nouveau ? Demande-moi « une recette jamais faite » ou « un dessert rapide » 😉'], act: ['Une idée au hasard', 'ask:surprends-moi'] },
  { g: ['bonne nuit|a demain|au revoir|bye|a plus|ciao'], small: true,
    a: ['À bientôt ! Pense à jeter un œil à ce qui périme demain 😉'] },
  { g: ['je t aime|t es genial|tu es genial|t es top|tu es top|bravo|trop fort'], small: true,
    a: ['Oh, merci ! 😊 Moi aussi j’aime bien cuisiner avec toi.'] },
];

// ---------- correspondance texte ↔ fiche ----------
const prep = s => ' ' + norm(s).replace(/['’-]/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
const alt = (t, a) => a.split('|').some(w => w.endsWith('*') ? t.includes(' ' + w.slice(0, -1)) : t.includes(' ' + w + ' '));
const GROUPS = KNOW.map(e => ({ e, g: e.g, x: e.x || [] }));
// la meilleure fiche : tous les groupes trouvés, aucun mot qui l'écarte ; les fiches les plus précises (plus de groupes, plus de mots) gagnent
export function knowMatch(text) {
  const t = prep(text); let best = null;
  for (const { e, g, x } of GROUPS) {
    if (!g.every(a => alt(t, a)) || x.some(w => t.includes(' ' + w + ' '))) continue;
    const sc = g.length * 10 + g.reduce((n, a) => n + Math.max(...a.split('|').filter(w => t.includes(' ' + w.replace('*', ''))).map(w => w.length)), 0) / 10;
    if (!best || sc > best.sc) best = { e, sc };
  }
  return best;
}

// ---------- conversions précises ----------
const PER_TBSP = { farine: 10, sucre: 15, 'sucre glace': 10, beurre: 15, huile: 14, miel: 20, sel: 15, cacao: 8, maizena: 10, riz: 15, eau: 15, lait: 15, creme: 15, levure: 10, 'poudre d amande': 8, semoule: 12 };
const num = s => parseFloat(String(s).replace(',', '.'));
export function convert(text) {
  const t = prep(text);
  // thermostat → degrés et degrés → thermostat
  let m = t.match(/ (?:thermostat|th) ?(\d{1,2}(?:[.,]5)?) /);
  if (m) { const th = num(m[1]); if (th >= 1 && th <= 10) return `Thermostat ${String(th).replace('.', ',')} = **${Math.round(th * 30)} °C**.`; }
  m = t.match(/ (\d{2,3}) ?(?:degres|degre|c) /);
  if (m && / (thermostat|th) /.test(t)) { const c = num(m[1]); return `${c} °C ≈ **thermostat ${String(Math.round(c / 15) / 2).replace('.', ',')}**.`; }
  // cuillères ↔ grammes : « combien de grammes dans 2 cuillères à soupe de farine », « 100 g de sucre en cuillères »
  const ing = Object.keys(PER_TBSP).sort((a, b) => b.length - a.length).find(k => t.includes(' ' + k + ' ') || t.includes(' ' + k + 's '));
  const tbsp = / (cuilleres? a soupe|cas|cs|c a s) /.test(t), tsp = / (cuilleres? a cafe|cac|cc|c a c) /.test(t);
  if (ing && (tbsp || tsp)) {
    const per = PER_TBSP[ing] / (tsp && !tbsp ? 3 : 1), unit = tsp && !tbsp ? 'cuillère à café' : 'cuillère à soupe';
    const g = t.match(/ (\d+(?:[.,]\d+)?) ?(?:g|gr|grammes|gramme) /), n = t.match(/ (\d+(?:[.,]\d+)?|une|un|deux|trois|quatre|cinq) (?:cuillere|cuilleres|cas|cs|cac|cc|c a)/);
    const NB = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5 };
    const pl = k => k > 1 ? unit.replace('cuillère', 'cuillères') : unit;
    if (g) { const q = num(g[1]), k = Math.round(q / per * 2) / 2; return `${q} g de ${ing} ≈ **${String(k).replace('.', ',')} ${pl(k)}** (≈ ${Math.round(per)} g par ${unit}).`; }
    const k = n ? (NB[n[1]] || num(n[1])) : 1;
    return `${k} ${pl(k)} de ${ing} ≈ **${Math.round(k * per)} g**.`;
  }
  // volumes
  m = t.match(/ (\d+(?:[.,]\d+)?) ?(cl|ml|dl|l|litre|litres) (?:en|=|c est combien de|combien de|ca fait combien de)? ?(cl|ml|dl|l|litre|litres) /);
  if (m) { const F = { ml: 1, cl: 10, dl: 100, l: 1000, litre: 1000, litres: 1000 }, v = num(m[1]) * F[m[2]] / F[m[3]]; return `${m[1]} ${m[2]} = **${String(Math.round(v * 100) / 100).replace('.', ',')} ${m[3]}**.`; }
  return null;
}

// une réponse prête : { lines: [...], act, app, small } ou null
export function know(text) {
  const c = convert(text); if (c) return { lines: [c], conv: true };
  const m = knowMatch(text); if (!m) return null;
  const e = m.e;
  const lines = e.jokes ? [e.jokes[Math.floor(Math.random() * e.jokes.length)]] : e.a;
  return { lines, act: e.act || null, app: !!e.app, small: !!e.small, score: m.sc };
}
// tous les mots connus (pour corriger les fautes de frappe)
export const KNOW_WORDS = [...new Set(KNOW.flatMap(e => [...e.g, ...(e.x || [])].flatMap(a => a.split('|')).flatMap(w => w.replace('*', '').split(' '))).filter(w => w.length >= 4))];
