// Ce que l'assistant sait sans internet : questions de cuisine (cuissons, conversions, conservation, astuces),
// mode d'emploi de l'app et petite conversation. Pur : texte → réponse. Testé dans tests/logic.test.mjs.
//
// Chaque fiche : g = groupes de mots qui doivent TOUS apparaître (« a|b|c » = au choix, « cuis* » = début de mot),
// a = la réponse (« **gras** » autorisé), act = bouton proposé ([libellé, cible]), x = mots qui écartent la fiche.
import { norm } from './util.js';

// petit lexique : [mots (« a|b »), définition] ; sert aux questions « c'est quoi déglacer ? » et aux explications d'étapes
export const GLOSSARY = [
    ['bain marie', 'Le **bain-marie** : faire chauffer doucement un récipient posé dans une casserole d’eau frémissante, sans qu’il touche l’eau. Parfait pour faire fondre le chocolat ou cuire une crème sans la brûler.'],
    ['blanchir', '**Blanchir** : plonger un légume quelques minutes dans l’eau bouillante salée, puis dans l’eau froide. Pour les légumes, ça garde leur couleur ; « blanchir des jaunes et du sucre », c’est les fouetter jusqu’à ce que le mélange pâlisse.'],
    ['deglacer', '**Déglacer** : verser un peu de liquide (vin, bouillon, eau) dans la poêle chaude après avoir saisi une viande, et gratter le fond : les sucs donnent une sauce pleine de goût.'],
    ['reduire|faire reduire', '**Réduire** : laisser bouillir une sauce ou un bouillon à découvert pour que l’eau s’évapore : la sauce épaissit et prend du goût.'],
    ['monter en neige|blancs en neige', '**Monter en neige** : fouetter les blancs d’œufs (sans aucune trace de jaune) avec une pincée de sel jusqu’à ce qu’ils soient fermes : ils doivent tenir dans le bol retourné.'],
    ['julienne', 'Une **julienne** : des légumes taillés en fins bâtonnets, comme des allumettes (carottes, poireaux…).'],
    ['emincer', '**Émincer** : couper en tranches fines (oignon, champignons, poulet…).'],
    ['ciseler', '**Ciseler** : couper très finement des herbes (aux ciseaux ou au couteau), ou tailler un oignon en tout petits dés.'],
    ['abaisser|etaler la pate', '**Abaisser** une pâte : l’étaler au rouleau à l’épaisseur voulue (souvent 3 à 4 mm pour une tarte).'],
    ['foncer|foncer un moule', '**Foncer** un moule : y déposer la pâte étalée en la faisant bien épouser les bords.'],
    ['napper', '**Napper** : recouvrir d’une sauce. « La crème nappe la cuillère » : elle reste sur le dos de la cuillère et le doigt y laisse une trace nette.'],
    ['zester|zeste', 'Le **zeste**, c’est la peau colorée d’un agrume (citron, orange), sans la partie blanche amère. Râpe-le finement : il parfume énormément.'],
    ['roux', 'Un **roux** : beurre fondu + farine cuits 1 à 2 min en remuant. C’est la base de la béchamel : on y ajoute ensuite le lait petit à petit.'],
    ['al dente', '**Al dente** : des pâtes cuites mais qui résistent encore un peu sous la dent. Goûte 1 min avant le temps du paquet.'],
    ['papillote', 'Une **papillote** : un aliment enfermé dans du papier cuisson (ou d’aluminium) bien fermé, qui cuit dans sa vapeur. Idéal pour le poisson : 15 à 20 min à 200 °C.'],
    ['braiser', '**Braiser** : cuire longtemps à couvert, à feu doux, avec un peu de liquide, après avoir fait dorer. Pour les viandes à mijoter et certains légumes (endives, fenouil).'],
    ['mijoter', '**Mijoter** : cuire doucement à petits frémissements, souvent à couvert, longtemps. C’est ce qui rend tendres les plats en sauce.'],
    ['saisir', '**Saisir** : faire cuire à feu très vif quelques instants pour colorer l’extérieur (viande, poisson) et garder le jus à l’intérieur.'],
    ['flamber', '**Flamber** : verser un alcool chaud sur un plat et l’enflammer, pour garder le goût sans l’alcool. Hotte éteinte et cheveux attachés !'],
    ['chemiser', '**Chemiser** un moule : le tapisser de papier cuisson, ou le beurrer et le fariner, pour démouler facilement.'],
    ['beurre pommade', 'Du **beurre pommade** : beurre ramolli à température ambiante, qui a la texture d’une crème. Sors-le 1 h avant (ou 10 s au micro-ondes).'],
    ['sabler', '**Sabler** : mélanger du beurre froid et de la farine du bout des doigts jusqu’à obtenir une texture de sable. C’est le début d’une pâte brisée ou d’un crumble.'],
    ['pocher', '**Pocher** : cuire dans un liquide qui frémit sans bouillir (eau, bouillon, sirop). Pour les œufs pochés : 3 min dans l’eau frémissante avec un filet de vinaigre.'],
    ['revenir|faire revenir|rissoler', '**Faire revenir** : cuire dans un peu de matière grasse, à feu moyen, en remuant, jusqu’à ce que ce soit doré (oignons, lardons…).'],
    ['suer|faire suer', '**Faire suer** : cuire doucement des légumes (oignons, échalotes) dans un peu de matière grasse, sans les colorer, pour qu’ils rendent leur eau et deviennent tendres.'],
    ['singer', '**Singer** : saupoudrer de farine une viande déjà dorée, mélanger 1 min, puis mouiller avec le liquide : ça épaissit la sauce d’un ragoût.'],
    ['mirepoix', 'Une **mirepoix** : carotte, oignon et céleri coupés en petits dés, revenus ensemble pour donner du goût à une sauce ou un plat mijoté.'],
    ['bouquet garni', 'Un **bouquet garni** : thym, laurier et queues de persil ficelés ensemble, qu’on met dans un plat mijoté et qu’on retire à la fin.'],
    ['fond de veau|fond blanc|fumet', 'Un **fond** (de veau, de volaille) ou un **fumet** (de poisson) : un bouillon concentré qui sert de base aux sauces. En poudre, délaye 1 cuillère dans 25 cl d’eau chaude.'],
    ['ruban|faire le ruban', '**Faire le ruban** : fouetter jaunes et sucre jusqu’à ce que le mélange coule de la cuillère comme un ruban qui se plie sans se casser.'],
    ['crème anglaise|creme anglaise', 'La **crème anglaise** : lait vanillé chaud versé sur des jaunes fouettés avec du sucre, puis cuit à feu doux sans bouillir en remuant, jusqu’à ce qu’elle nappe la cuillère (83 °C).'],
    ['caraméliser|caramelise|caramelisee|caramelises', '**Caraméliser** : cuire avec du sucre (ou laisser le sucre naturel d’un aliment, comme l’oignon) jusqu’à une belle couleur dorée et un goût légèrement grillé.'],
    ['detendre', '**Détendre** une préparation : la rendre plus fluide en ajoutant un peu de liquide (lait, crème, bouillon).'],
    ['concasser|concasse|concassee', '**Concasser** : couper grossièrement (tomates, noix, herbes). Des « tomates concassées », ce sont des tomates pelées en petits morceaux.'],
  ];
const GLOSSARY_KNOW = () => GLOSSARY.map(([w, d]) => ({ g: [w, 'c est quoi|quoi|definition|ca veut dire|veut dire|signifie|explique|comment|kesako|ca sert|sert a|qu est ce'], a: [d] }));

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
  { g: ['air fryer|airfryer|friteuse sans huile', 'temps|combien|temperature|degres|cuire|cuisson|comment|marche|utiliser|astuce|astuces|conseil|conseils'], x: ['recette', 'idee', 'idees', 'regler', 'cocher', 'sans', 'pas de'],
    a: ['Les repères au **air fryer** (préchauffé 3 min) :', '• Frites maison : 200 °C, 18 à 22 min · Frites surgelées : 200 °C, 12 à 15 min', '• Lanières de poulet panées : 200 °C, 10 à 12 min · Cuisses de poulet : 190 °C, 22 à 25 min', '• Pavé de saumon : 200 °C, 8 à 10 min · Légumes en morceaux : 190 °C, 12 à 15 min', 'Ne surcharge pas le panier et secoue-le à mi-cuisson : c’est ce qui rend tout croustillant. En général : 20 °C de moins et 20 % de temps en moins qu’au four.'], act: ['Une recette au air fryer', 'ask:une recette au air fryer'] },
  { g: ['cookeo|multicuiseur|autocuiseur|cocotte minute', 'comment|adapter|utiliser|astuce|astuces|conseil|conseils|temps|combien|pression|marche'], x: ['idee', 'idees', 'regler', 'cocher', 'sans', 'pas de'],
    a: ['Les bases au **Cookeo** :', '• **Dorer** : fais revenir oignons et viande couvercle ouvert, 3 à 5 min', '• **Cuisson sous pression** : ferme, le temps démarre quand la pression est atteinte', '• Repères sous pression : riz 8 min · pâtes 4 à 5 min · poulet en morceaux 10 à 12 min · bœuf à mijoter 30 à 40 min · lentilles corail 6 min · soupe de légumes 10 min', 'Toujours un peu de liquide (au moins 20 cl), et ne dépasse pas le trait maximum de la cuve.'], act: ['Une recette au Cookeo', 'ask:une recette au Cookeo'] },
  { g: ['barbecue|barbec|bbq|plancha|grillade|grillades', 'comment|temps|combien|cuire|cuisson|astuce|astuces|conseil|conseils|braises|allumer|marche'], x: ['recette', 'idee', 'idees', 'regler', 'cocher', 'sans', 'pas de'],
    a: ['Les repères au **barbecue** (ou à la plancha) :', '• Attends des braises rouges couvertes de cendre blanche, sans flammes', '• Merguez et saucisses : 10 à 12 min en les tournant · Brochettes : 8 à 10 min', '• Côtelettes d’agneau : 3 à 4 min par face · Pilons de poulet : 25 à 30 min, sur le bord', '• Sardines ou poisson entier : 4 à 5 min par face · Épis de maïs : 15 min', 'Sors la viande du frigo 20 min avant, et sale après la cuisson.'], act: ['Une recette au barbecue', 'ask:une recette au barbecue'] },
  { g: ['raclette', 'comment|combien|quantite|quantites|par personne|astuce|astuces|conseil|conseils|prevoir|faut il'], x: ['recette', 'idee', 'idees', 'regler', 'cocher'],
    a: ['Pour une **raclette** réussie :', '• Fromage : 200 g par personne (250 g pour les gros appétits)', '• Pommes de terre : 300 g par personne, cuites à l’eau en robe des champs 20 à 25 min', '• Charcuterie : 100 à 150 g par personne (jambon cru, rosette, coppa…)', '• Avec des cornichons, des petits oignons et une salade verte'], act: ['Une idée de raclette', 'ask:une raclette ce soir'] },
  { g: ['gaufre|gaufres|gaufrier', 'comment|temps|combien|cuire|cuisson|astuce|astuces|conseil|conseils|colle|croustillante|croustillantes|marche'], x: ['recette', 'idee', 'idees', 'regler', 'cocher'],
    a: ['Des **gaufres** réussies :', '• Préchauffe bien le gaufrier (le voyant s’éteint) et graisse-le au premier tour', '• Une petite louche par gaufre, sans remplir jusqu’au bord', '• 3 à 4 min de cuisson, sans ouvrir avant la fin', '• Pour des gaufres croustillantes : laisse reposer la pâte 30 min et ajoute un peu de bière ou d’eau gazeuse'], act: ['Une recette au gaufrier', 'ask:une recette au gaufrier'] },
  { g: ['thermomix|robot cuiseur', 'comment|adapter|utiliser|astuce|astuces|conseil|conseils|vitesse|marche'], x: ['idee', 'idees', 'regler', 'cocher', 'sans', 'pas de'],
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
  { g: ['equipement|appareil|appareils|four|mixeur|micro ondes|micro onde|plaques|air fryer|airfryer|thermomix|cookeo|barbecue|gaufrier', 'ou|regler|changer|ajouter|j ai|grisee|grisees|cocher|mon'], app: true, x: ['cuire', 'cuisson', 'temps', 'prechauffer', 'tournante', 'recette', 'idee', 'quoi', 'manger', 'cuisiner', 'sans', 'pas de'],
    a: ['Ton équipement se règle dans **Moi → Mon équipement**, ou en touchant « Appareils » sur le plan de travail de « Ma cuisine » (onglet Stock) : plaques, four, micro-ondes, mixeur, air fryer, Thermomix, Cookeo, barbecue, appareil à raclette et gaufrier.', 'Si un de tes appareils fait l’affaire (un burger à la poêle, des frites au four, un plat au Cookeo en cocotte), la recette reste faisable et sa fiche explique comment faire. Sinon elle est **grisée**, avec « Il faut un four ». Dans Recettes → Filtres → « Appareil », tu peux voir celles d’un appareil précis.'], act: ['Mon équipement', 'equip'] },
  { g: ['toujours chez moi|placard|base|bases|sel|poivre|huile', 'toujours|regler|cocher|compte|courses|manque'], app: true, x: ['combien', 'garder', 'conserver', 'remplacer', 'trop'],
    a: ['**« Toujours chez moi »** (Moi, ou l’étagère « Toujours là » dans Ma cuisine) : ce que tu as en permanence, comme le sel, le poivre ou l’huile. Ces produits comptent toujours comme disponibles et ne partent jamais dans les courses.'], act: ['Toujours chez moi', 'pantry'] },
  { g: ['recette', 'creer|ajouter|ma propre|mes propres|perso|personnelle|modifier|adapter'], app: true, x: ['air fryer', 'airfryer', 'four', 'cookeo', 'thermomix', 'barbecue', 'micro ondes'],
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
  // ---------- faire sans l'appareil prévu ----------
  { g: ['air fryer|airfryer|friteuse sans huile', 'four'], x: ['idee', 'idees', 'regler', 'cocher'],
    a: ['Passer du **four** au **air fryer** : baisse la température de **20 °C** et compte environ **20 % de temps en moins**, dans un plat qui tient dans le panier (pas collé aux bords pour que l’air circule). Ex. : 200 °C / 25 min au four → 180 °C / 20 min.', 'Dans l’autre sens, du air fryer au four : même température en chaleur tournante (ou 20 °C de plus), sur une plaque en une seule couche, et environ **1,5 fois** le temps.', 'Mon Frigo le fait tout seul : une recette prévue au four n’est pas grisée si tu as un air fryer et que le plat tient dedans.'] },
  { g: ['frite|frites', 'four'], x: ['recette', 'idee', 'idees', 'air fryer', 'airfryer'],
    a: ['Des **frites au four** croustillantes : coupe des bâtonnets de 1 cm, rince-les et sèche-les bien, mélange avec 1 cuillère d’huile, puis 30 à 35 min à **220 °C** en une seule couche, en les retournant à mi-cuisson. Sale à la sortie.', 'Frites surgelées : 200 à 220 °C, le temps indiqué sur le paquet (souvent 20 à 25 min).'], act: ['Frites au air fryer', 'ask:frites au air fryer combien de temps'] },
  { g: ['cookeo|multicuiseur|autocuiseur|cocotte minute', 'sans|pas de|cocotte|casserole|plaques|remplacer|a la place|normale|classique'], x: ['idee', 'idees', 'regler', 'cocher', 'combien de temps'],
    a: ['Sans Cookeo, une **cocotte** sur les plaques fait tout : « Dorer » = faire revenir à feu vif, et la cuisson sous pression devient une cuisson **à couvert à feu doux, environ 3 fois plus longue**.', '• Riz 15 à 18 min · pâtes : le temps du paquet · poulet en morceaux 30 min · bœuf à mijoter 2 h à 2 h 30 · lentilles 25 à 30 min', 'Ajoute un peu de liquide si ça attache. Mon Frigo ne grise pas les recettes au Cookeo si tu as des plaques.'] },
  { g: ['thermomix|robot cuiseur', 'sans|pas de|remplacer|a la place|casserole|mixeur|normal|classique'], x: ['idee', 'idees', 'regler', 'cocher'],
    a: ['Sans Thermomix : **hache au couteau**, fais revenir dans une casserole, puis cuis à feu doux en remuant souvent, avec les mêmes temps.', 'Quand la recette dit « mixer » (soupe, gaspacho), passe au mixeur ou au mixeur plongeant. « Sens inverse » veut juste dire « sans abîmer les morceaux » : remue doucement à la cuillère.'] },
  { g: ['micro ondes|micro onde|microondes', 'sans|pas de|remplacer|a la place|casserole|four'], x: ['idee', 'idees', 'regler', 'cocher', 'decongel*'],
    a: ['Sans micro-ondes : à la **casserole**, à feu doux et à couvert en remuant (pour réchauffer ou cuire), ou au **four à 180 °C** en comptant environ 3 fois le temps (mug cake, pomme cuite, patate douce…).'] },
  { g: ['barbecue|barbec|bbq|plancha', 'sans|pas de|poele|remplacer|a la place|four|interieur'], x: ['idee', 'idees', 'regler', 'cocher'],
    a: ['Sans barbecue : une **poêle-gril** ou une poêle bien chaude fait très bien l’affaire, avec les mêmes temps (burgers, saucisses, brochettes, légumes). Sinon, **sous le grill du four** à 10 cm de la résistance, en retournant à mi-cuisson.', 'Mon Frigo ne grise pas les recettes au barbecue si tu as des plaques.'] },
  { g: ['raclette', 'sans|pas d appareil|pas de|four|remplacer|a la place'], x: ['idee', 'idees', 'regler', 'cocher', 'combien', 'quantite'],
    a: ['Sans appareil à raclette : pose les tranches de fromage sur les pommes de terre chaudes dans un plat et fais gratiner **8 à 10 min sous le grill du four**. Ou fais fondre le fromage à la poêle, couvercle fermé, 2 min.'] },
  { g: ['mixeur|blender|mixer', 'sans|pas de|remplacer|a la place'], x: ['idee', 'idees', 'regler', 'cocher'],
    a: ['Sans mixeur : un **presse-purée** ou une fourchette pour les soupes paysannes et les compotes, un fouet pour les pâtes (crêpes, gâteaux). Un Thermomix fait aussi le mixeur.'] },
  // ---------- quand ça rate ----------
  { g: ['sauce|soupe|creme|jus', 'trop liquide|pas assez epaisse|trop claire|epaissir|lier|liee|epaissit pas'],
    a: ['Pour épaissir : délaye **1 cuillère de maïzena dans un peu d’eau froide**, verse en remuant et laisse bouillir 1 min. Ou laisse **réduire** à découvert quelques minutes.', 'Autres astuces : un peu de crème, un jaune d’œuf hors du feu (sans bouillir ensuite), ou une pomme de terre écrasée dans une soupe.'] },
  { g: ['sauce|soupe|puree|pate', 'trop epaisse|trop epais|trop compacte|trop dure|allonger|detendre'],
    a: ['Pour allonger : ajoute **un peu de liquide chaud** petit à petit (bouillon, lait, eau de cuisson des pâtes) en remuant, jusqu’à la bonne texture. Goûte ensuite le sel.'] },
  { g: ['trop sucre|trop sucree|trop de sucre|trop sucres'],
    a: ['Trop sucré : équilibre avec un peu d’**acidité** (jus de citron, vinaigre, yaourt nature) ou allonge avec la même préparation sans sucre. Pour un dessert, sers-le avec un fruit acide ou un laitage nature.'] },
  { g: ['trop gras|trop grasse|trop d huile|trop de beurre|graisse'], x: ['remplacer'],
    a: ['Sur une soupe ou une sauce : laisse reposer 2 min et retire le gras en surface avec une cuillère, ou passe une feuille d’essuie-tout à la surface. Au frigo, le gras fige et s’enlève tout seul.'] },
  { g: ['brule|brulee|brules|cramé|crame|cramee|attache|attachee|accroche'], x: ['four'],
    a: ['Ça a brûlé au fond ? **Ne gratte pas** : transvase vite ce qui n’a pas brûlé dans une autre casserole, le goût de brûlé reste au fond. Pour décoller la casserole : un fond d’eau avec du bicarbonate (ou du liquide vaisselle), porte à ébullition 5 min.'] },
  { g: ['viande|steak|poulet|boeuf|roti|escalope', 'dure|seche|caoutchouc|trop cuite|pas tendre'],
    a: ['Pour une viande tendre : sors-la du frigo 20 min avant, saisis-la à feu vif sans la piquer, puis laisse-la **reposer** quelques minutes avant de couper.', 'Si elle est déjà trop cuite : coupe-la en fines lamelles et fais-la mijoter quelques minutes dans une sauce (crème, tomate) : elle redevient moelleuse.'] },
  { g: ['gateau|cake|moelleux|fondant|brownie', 'pas cuit|cru|coulant|retombe|retombé|sec|seche|colle au moule|demouler|demoule'],
    a: ['Pour vérifier la cuisson : plante la **pointe d’un couteau** au centre, elle doit ressortir sèche (sauf pour un fondant).', 'Gâteau retombé : four ouvert trop tôt ou trop de levure. Gâteau sec : trop cuit, sers-le avec une crème anglaise ou un sirop.', 'Pour démouler facilement : beurre et farine le moule, et attends 10 min avant de démouler.'] },
  { g: ['chantilly|creme fouettee', 'monte pas|monter|tourne|beurre|liquide|rate'],
    a: ['Une chantilly qui monte : crème **entière à 30 % de matière grasse, très froide** (et le bol aussi, 15 min au congélateur). Fouette d’abord doucement puis plus vite, et ajoute le sucre à la fin. Arrête-toi dès qu’elle tient : trop fouettée, elle tourne en beurre.'] },
  { g: ['pate a pizza|pate a pain|pate|pain|brioche', 'leve pas|monte pas|pas leve|gonfle pas|lever'],
    a: ['Une pâte qui ne lève pas : la **levure de boulanger** a besoin de tiède (eau à 35 °C, pas plus chaude) et d’un endroit sans courant d’air, 1 h à 1 h 30. Le sel ne doit pas toucher directement la levure. Astuce : le four éteint avec juste la lumière allumée.'] },
  { g: ['puree', 'collante|elastique|colle|gluante'],
    a: ['Une purée devient élastique quand on la **mixe** : écrase les pommes de terre au presse-purée ou à la fourchette, et ajoute le lait chaud puis le beurre en remuant doucement.'] },
  { g: ['chocolat', 'graine|grainé|durci|tourne|fige|figé|rate'], x: ['recette', 'idee'],
    a: ['Le chocolat a « grainé » ? Une goutte d’eau ou trop de chaleur. Rattrape-le en ajoutant 1 à 2 cuillères de crème chaude ou de lait chaud et en fouettant. Fais-le toujours fondre doucement, au bain-marie ou 30 s par 30 s au micro-ondes.'] },
  // ---------- petit lexique de cuisine (GLOSSARY, plus bas) ----------
  ...GLOSSARY_KNOW(),
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
  { g: ['je t aime|t es genial|tu es genial|t es top|tu es top|bravo|trop fort|t es le meilleur|tu es le meilleur|trop bien|tu geres|tu es fort|t es fort'], small: true,
    a: ['Oh, merci ! 😊 Moi aussi j’aime bien cuisiner avec toi.'] },
  { g: ['nul|nulle|bete|idiot|debile|inutile|sers a rien|pas terrible|pourri|naze|comprends rien|tu comprends pas|t es lent|tu es lent'], small: true, x: ['recette'],
    a: ['Oups, désolé 😅 Je fonctionne sans internet, alors je connais surtout la cuisine, tes recettes et ton frigo. Redis-moi ce que tu cherchais avec d’autres mots, ou essaie « une idée pour ce soir », « combien de temps cuire le riz », « qu’est-ce que j’ai dans le frigo ».'] },
  { g: ['flemme|pas envie de cuisiner|pas le courage|la fleme|fatigue|creve|epuise|pas le temps'], small: true, x: ['recette'],
    a: ['Je comprends 😴 Voici de quoi manger vite fait, en 15 min max.'], act: ['Une idée en 15 min', 'ask:une idée rapide en 15 min avec ce que j’ai'] },
  { g: ['bon appetit|on passe a table|a table'], small: true,
    a: ['Bon appétit ! 😋 Pense à toucher « Cuisiné » sur ta recette pour mettre ton stock à jour.'] },
  { g: ['merci|thanks'], small: true,
    a: ['Avec plaisir 😊'] },
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
  return { lines, act: e.act || null, app: !!e.app, small: !!e.small, score: m.sc, keep: e.g.some(a => /conserv|garde|frigo|congel/.test(a)) };
}
// une question tournée autrement : la fiche dont le SUJET (premier groupe, mot de 5 lettres ou plus) est cité, quand rien d'autre n'a répondu
export function knowNear(text) {
  const t = prep(text); let best = null;
  for (const { e, g, x } of GROUPS) {
    if (e.small || e.app || x.some(w => t.includes(' ' + w + ' '))) continue;
    const hit = g[0].split('|').filter(w => w.replace('*', '').length >= 5 && t.includes(' ' + w.replace('*', '') + (w.endsWith('*') ? '' : ' '))).map(w => w.length);
    if (!hit.length) continue;
    const sc = Math.max(...hit) + g.slice(1).filter(a => alt(t, a)).length * 10;
    if (!best || sc > best.sc) best = { e, sc };
  }
  if (!best) return null;
  return { lines: best.e.jokes ? [best.e.jokes[0]] : best.e.a, act: best.e.act || null, app: false, small: false, score: best.sc, keep: false };
}
// tous les mots connus (pour corriger les fautes de frappe)
export const KNOW_WORDS = [...new Set(KNOW.flatMap(e => [...e.g, ...(e.x || [])].flatMap(a => a.split('|')).flatMap(w => w.replace('*', '').split(' '))).filter(w => w.length >= 4))];
