# -*- coding: utf-8 -*-
"""Base de connaissances ingrédients de Mon Frigo (source unique -> data/ingredients.json).
Lancer : python3 tools/data/ingredients.py   (ou npm run data, qui fait aussi les recettes)
Format d'une ligne :
 id|Nom affiché|alias,alias|rayon|zone|rôle|qté pour 2 + unité|durée conservation (j, 0=aucune)|prix €/kg ou €/l|drapeaux|emoji
Drapeaux : S=produit de base · m/f/mp/fp=genre/nombre · H=h aspiré · l=liquide (base ml)
 pg=g par pièce · gou/tr/pot/bo/sa = g par unité · d=densité · meat fish pork dairy egg gluten nuts shell (régimes/allergènes)
"""
import json, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "data", "ingredients.json")

RAYONS = ["Fruits & légumes","Viandes & poissons","Crèmerie & œufs","Boulangerie","Épicerie","Condiments & épices","Surgelés","Divers"]
Z = {"F":"frigo","C":"congelateur","P":"placard","A":"autre"}

RAW = """
poulet|Poulet|blanc de poulet,filet de poulet,escalope de poulet,poulet roti,cuisse de poulet|Viandes & poissons|F|meat|250 g|2|9|m meat pg=150|🍗
dinde|Dinde|escalope de dinde,filet de dinde|Viandes & poissons|F|meat|250 g|2|10|f meat|🦃
boeuf-hache|Bœuf haché|boeuf hache,viande hachee,steak hache,haché|Viandes & poissons|F|meat|250 g|2|11|m meat|🥩
boeuf|Bœuf|boeuf,steak,rumsteck,paleron,boeuf a mijoter,bavette,onglet|Viandes & poissons|F|meat|300 g|3|14|m meat|🥩
porc|Porc|filet de porc,roti de porc,escalope de porc,echine|Viandes & poissons|F|meat|280 g|3|8|m meat pork|🐖
agneau|Agneau|gigot,epaule d'agneau,souris d'agneau|Viandes & poissons|F|meat|300 g|3|18|m meat|🐑
jambon|Jambon|jambon blanc,jambon cuit,tranche de jambon|Viandes & poissons|F|meat|100 g|5|14|m meat pork tr=40|🥓
lardons|Lardons|lardon,poitrine fumee,bacon|Viandes & poissons|F|meat|100 g|7|11|mp meat pork|🥓
saucisses|Saucisses|saucisse,saucisse de toulouse,chipolata|Viandes & poissons|F|meat|280 g|3|9|fp meat pork pg=70|🌭
merguez|Merguez|merguez|Viandes & poissons|F|meat|250 g|3|11|fp meat pg=60|🌭
chorizo|Chorizo|chorizo|Viandes & poissons|F|meat|80 g|14|16|m meat pork|🌶️
saumon|Saumon|pave de saumon,saumon frais,filet de saumon|Viandes & poissons|F|fish|250 g|2|22|m fish pg=125|🐟
cabillaud|Cabillaud|dos de cabillaud,morue fraiche|Viandes & poissons|F|fish|250 g|2|20|m fish pg=125|🐟
colin|Colin|lieu,filet de colin|Viandes & poissons|F|fish|250 g|2|14|m fish pg=125|🐟
merlu|Merlu|filet de merlu|Viandes & poissons|F|fish|250 g|2|14|m fish pg=125|🐟
dorade|Dorade|filet de dorade|Viandes & poissons|F|fish|250 g|2|16|f fish pg=125|🐟
truite|Truite|filet de truite|Viandes & poissons|F|fish|250 g|2|15|f fish pg=125|🐟
poisson-blanc|Poisson blanc|filet de poisson blanc,poisson|Viandes & poissons|F|fish|250 g|2|14|m fish pg=125|🐟
thon|Thon en boîte|thon,thon en boite,thon au naturel,thon boite|Épicerie|P|fish|140 g|0|13|m fish bo=140|🐟
crevettes|Crevettes|crevette,crevettes decortiquees,gambas|Viandes & poissons|F|fish|200 g|2|22|fp fish shell|🦐
oeufs|Œufs|oeuf,oeufs,œuf,œufs|Crèmerie & œufs|F|egg|4 pièce|21|6.4|mp egg pg=55|🥚
lait|Lait|lait demi-ecreme,lait entier,lait ecreme|Crèmerie & œufs|F|dairy|20 cl|6|1.1|m l dairy|🥛
creme|Crème fraîche|creme,creme fraiche,creme epaisse,creme liquide,creme entiere|Crèmerie & œufs|F|dairy|10 cl|14|5|f l dairy|🥛
beurre|Beurre|beurre doux,beurre demi-sel|Crèmerie & œufs|F|fat|20 g|30|11|m dairy|🧈
fromage-rape|Fromage râpé|fromage rape,gruyere rape,emmental rape,gruyere|Crèmerie & œufs|F|cheese|60 g|20|9|m dairy|🧀
emmental|Emmental|comte,emmental rape|Crèmerie & œufs|F|cheese|80 g|20|11|m dairy|🧀
parmesan|Parmesan|grana padano,parmigiano|Crèmerie & œufs|F|cheese|40 g|45|22|m dairy|🧀
mozzarella|Mozzarella|boule de mozzarella|Crèmerie & œufs|F|cheese|125 g|10|8|f dairy pg=125|🧀
feta|Feta|fromage de brebis|Crèmerie & œufs|F|cheese|100 g|20|10|f dairy|🧀
chevre|Fromage de chèvre|chevre,fromage de chevre,buche de chevre,chèvre|Crèmerie & œufs|F|cheese|100 g|14|14|m dairy|🧀
cheddar|Cheddar||Crèmerie & œufs|F|cheese|80 g|20|12|m dairy|🧀
ricotta|Ricotta||Crèmerie & œufs|F|cheese|125 g|7|7|f dairy|🧀
halloumi|Halloumi||Crèmerie & œufs|F|cheese|200 g|20|13|m dairy|🧀
fromage-bleu|Fromage bleu|roquefort,gorgonzola,bleu|Crèmerie & œufs|F|cheese|80 g|20|16|m dairy|🧀
yaourt|Yaourt nature|yaourt,yogourt|Crèmerie & œufs|F|dairy|2 pot|20|2.5|m dairy pot=125|🥛
mascarpone|Mascarpone||Crèmerie & œufs|F|dairy|100 g|14|9|m dairy|🥛
bechamel|Béchamel|sauce bechamel|Crèmerie & œufs|F|sauce|25 cl|4|4|f l dairy gluten|🥣
oignon|Oignon|oignons,oignon jaune,echalote,oignon blanc|Fruits & légumes|P|aromatic|1 pièce|20|1.8|m pg=150|🧅
oignon-rouge|Oignon rouge|oignons rouges|Fruits & légumes|P|aromatic|1 pièce|20|2.2|m pg=150|🧅
ail|Ail|gousse d'ail,gousses d'ail,tete d'ail|Fruits & légumes|P|aromatic|2 gousse|40|9|m gou=5|🧄
carotte|Carottes|carotte|Fruits & légumes|F|veg|300 g|14|1.5|fp pg=100|🥕
courgette|Courgette|courgettes|Fruits & légumes|F|veg|300 g|7|2.8|f pg=250|🥒
tomate|Tomates|tomate,tomate fraiche|Fruits & légumes|A|veg|300 g|6|3.5|fp pg=120|🍅
tomate-cerise|Tomates cerises|tomate cerise|Fruits & légumes|F|veg|200 g|7|6|fp|🍅
poivron|Poivron|poivrons,poivron rouge,poivron vert,poivron jaune|Fruits & légumes|F|veg|200 g|8|3.8|m pg=170|🫑
aubergine|Aubergine|aubergines|Fruits & légumes|F|veg|300 g|8|3.2|f pg=300|🍆
brocoli|Brocoli|brocolis|Fruits & légumes|F|veg|300 g|6|3.5|m pg=350|🥦
chou-fleur|Chou-fleur|chou fleur|Fruits & légumes|F|veg|400 g|7|3|m pg=800|🥦
epinards|Épinards|epinard,jeunes pousses d'epinards,epinards frais|Fruits & légumes|F|leaf|200 g|4|4.5|mp|🥬
salade|Salade verte|salade,laitue,mesclun,roquette,batavia|Fruits & légumes|F|leaf|100 g|5|5|f pg=250|🥬
champignons|Champignons|champignon,champignons de paris,champignon de paris|Fruits & légumes|F|veg|250 g|5|6|mp|🍄
poireau|Poireau|poireaux,blanc de poireau|Fruits & légumes|F|veg|300 g|10|2.8|m pg=200|🥬
pomme-de-terre|Pommes de terre|pomme de terre,patate,patates|Fruits & légumes|P|starch|500 g|30|1.6|fp pg=150|🥔
patate-douce|Patate douce|patates douces|Fruits & légumes|P|starch|400 g|20|3.2|f pg=300|🍠
potimarron|Potimarron|courge,butternut,potiron|Fruits & légumes|P|veg|600 g|30|2.5|m pg=1000|🎃
haricots-verts|Haricots verts|haricot vert|Fruits & légumes|F|veg|250 g|5|4.5|mp H|🫛
petits-pois|Petits pois|petit pois|Fruits & légumes|F|veg|200 g|4|4|mp|🫛
concombre|Concombre|concombres|Fruits & légumes|F|veg|1 pièce|8|2|m pg=300|🥒
fenouil|Fenouil|bulbe de fenouil|Fruits & légumes|F|veg|300 g|8|4|m pg=250|🥬
asperges|Asperges|asperge|Fruits & légumes|F|veg|250 g|4|9|fp|🥬
artichaut|Artichaut|artichauts,coeur d'artichaut|Fruits & légumes|F|veg|250 g|5|8|m|🥬
mais|Maïs|mais en boite,mais doux|Épicerie|P|veg|140 g|0|4|m|🌽
avocat|Avocat|avocats|Fruits & légumes|A|veg|1 pièce|5|6|m pg=200|🥑
citron|Citron|citrons,jus de citron|Fruits & légumes|F|acid|1 pièce|20|3|m pg=100|🍋
citron-vert|Citron vert|citrons verts,lime|Fruits & légumes|F|acid|1 pièce|20|5|m pg=70|🍋
gingembre|Gingembre|gingembre frais|Fruits & légumes|F|spice|10 g|20|9|m|🫚
persil|Persil|persil frais|Fruits & légumes|F|herb|10 g|7|20|m|🌿
basilic|Basilic|basilic frais|Fruits & légumes|F|herb|10 g|5|30|m|🌿
menthe|Menthe|menthe fraiche|Fruits & légumes|F|herb|10 g|5|30|f|🌿
coriandre|Coriandre|coriandre fraiche|Fruits & légumes|F|herb|10 g|5|30|f|🌿
ciboulette|Ciboulette||Fruits & légumes|F|herb|5 g|5|30|f|🌿
aneth|Aneth||Fruits & légumes|F|herb|5 g|5|30|m|🌿
herbes-fraiches|Herbes fraîches|herbes fraiches,herbes|Fruits & légumes|F|herb|10 g|5|30|fp|🌿
pomme|Pommes|pomme|Fruits & légumes|A|fruit|2 pièce|20|2.8|fp pg=150|🍎
poire|Poires|poire|Fruits & légumes|A|fruit|2 pièce|10|3|fp pg=150|🍐
banane|Bananes|banane|Fruits & légumes|A|fruit|2 pièce|6|1.9|fp pg=120|🍌
fraises|Fraises|fraise|Fruits & légumes|F|fruit|250 g|3|8|fp|🍓
fruits-rouges|Fruits rouges|framboises,myrtilles,fruits rouges surgeles|Fruits & légumes|F|fruit|150 g|3|12|mp|🫐
abricots|Abricots|abricot|Fruits & légumes|A|fruit|250 g|5|5|mp pg=50|🍑
prunes|Prunes|prune|Fruits & légumes|A|fruit|250 g|5|5|fp pg=40|🍑
mangue|Mangue||Fruits & légumes|A|fruit|1 pièce|5|4|f pg=350|🥭
orange|Orange|oranges,jus d'orange|Fruits & légumes|A|fruit|2 pièce|14|2.2|f pg=200|🍊
riz|Riz|riz basmati,riz long,riz thai,riz blanc|Épicerie|P|starch|150 g|0|2.2|m|🍚
riz-risotto|Riz à risotto|riz arborio,riz rond,arborio|Épicerie|P|starch|160 g|0|4|m|🍚
pates|Pâtes|pates,spaghetti,penne,tagliatelles,fusilli,coquillettes,macaroni,farfalle|Épicerie|P|starch|200 g|0|1.8|fp gluten|🍝
semoule|Semoule|couscous,semoule de ble|Épicerie|P|starch|160 g|0|1.8|f gluten|🍚
gnocchis|Gnocchis|gnocchi|Épicerie|P|starch|400 g|30|3.5|mp gluten|🥟
quinoa|Quinoa||Épicerie|P|starch|150 g|0|6|m|🌾
boulgour|Boulgour|bulgur|Épicerie|P|starch|160 g|0|3|m gluten|🌾
polenta|Polenta|semoule de mais|Épicerie|P|starch|150 g|0|3|f|🌽
lasagnes|Pâtes à lasagnes|lasagnes,feuilles de lasagne,plaques de lasagne|Épicerie|P|starch|200 g|0|3|fp gluten|🍝
lentilles|Lentilles vertes|lentille,lentilles,lentilles brunes,lentilles cuites|Épicerie|P|legume|200 g|0|3|fp|🫘
lentilles-corail|Lentilles corail|lentille corail|Épicerie|P|legume|200 g|0|3.5|fp|🫘
pois-chiches|Pois chiches|pois chiche,pois chiches cuits,pois chiches en boite|Épicerie|P|legume|240 g|0|3|mp|🫘
haricots-rouges|Haricots rouges|haricot rouge,haricots rouges cuits,haricots noirs|Épicerie|P|legume|240 g|0|3|mp H|🫘
haricots-blancs|Haricots blancs|haricot blanc,flageolets,cocos|Épicerie|P|legume|240 g|0|3|mp H|🫘
tofu|Tofu|tofu ferme,tofu nature|Crèmerie & œufs|F|tofu|200 g|20|9|m|🍱
tomate-concassee|Tomates concassées|tomate concassee,coulis de tomate,passata,tomates pelees,sauce tomate|Épicerie|P|sauce|400 g|0|2|fp|🥫
bouillon|Bouillon|bouillon de legumes,bouillon de volaille,bouillon cube,cube de bouillon,fond de volaille|Épicerie|P|sauce|50 cl|0|1|m l|🍲
lait-coco|Lait de coco|lait coco,creme de coco|Épicerie|P|sauce|20 cl|0|4|m l|🥥
sauce-soja|Sauce soja|soja,sauce de soja,teriyaki,sauce teriyaki|Condiments & épices|P|condiment|2 c. à soupe|0|6|f l|🥢
vin-rouge|Vin rouge|vin|Divers|P|sauce|15 cl|0|6|m l|🍷
vin-blanc|Vin blanc||Divers|P|sauce|10 cl|0|6|m l|🍷
huile-olive|Huile d'olive|huile olive,huile,huile de tournesol|Épicerie|P|fat|2 c. à soupe|0|9|f l S|🫒
vinaigre|Vinaigre|vinaigre balsamique,vinaigre de vin,vinaigre de cidre|Condiments & épices|P|acid|1 c. à soupe|0|4|m l S|🍶
moutarde|Moutarde|moutarde a l'ancienne,moutarde de dijon|Condiments & épices|F|condiment|1 c. à soupe|0|6|f S|🫙
miel|Miel||Épicerie|P|sweet|1 c. à soupe|0|12|m|🍯
sucre|Sucre|sucre en poudre,sucre roux,cassonade|Épicerie|P|sweet|60 g|0|1.4|m S|🍬
farine|Farine|farine de ble,farine t55|Épicerie|P|flour|120 g|0|1.2|f gluten d=0.55|🌾
levure|Levure chimique|levure,sachet de levure|Épicerie|P|flour|1 sachet|0|10|f sa=11|🧁
chocolat|Chocolat|chocolat noir,chocolat patissier,pepites de chocolat|Épicerie|P|sweet|100 g|0|10|m|🍫
vanille|Vanille|sucre vanille,extrait de vanille|Épicerie|P|sweet|1 c. à café|0|40|f S|🌼
cannelle|Cannelle||Condiments & épices|P|spice|1 c. à café|0|30|f S|🪵
cacahuete|Beurre de cacahuète|beurre de cacahuete|Épicerie|P|sweet|2 c. à soupe|0|8|m nuts|🥜
pate-brisee|Pâte brisée|pate brisee|Crèmerie & œufs|F|dough|1 pièce|20|6|f gluten pg=230|🥧
pate-feuilletee|Pâte feuilletée|pate feuilletee|Crèmerie & œufs|F|dough|1 pièce|20|6|f gluten pg=230|🥧
pate-pizza|Pâte à pizza|pate a pizza,pate fine,pâte fine|Crèmerie & œufs|F|dough|1 pièce|20|5|f gluten pg=260|🍕
pain|Pain|baguette,tartine,pain complet,pain de campagne|Boulangerie|A|bread|4 tranche|3|4|m gluten tr=30|🍞
pain-mie|Pain de mie||Boulangerie|P|bread|4 tranche|14|3.5|m gluten tr=25|🍞
bagel|Bagels|bagels|Boulangerie|P|bread|2 pièce|10|6|mp gluten pg=90|🥯
wrap|Wraps|wraps,tortilla,tortillas,galette de ble|Boulangerie|P|bread|4 pièce|30|5|mp gluten pg=60|🌯
pita|Pains pita|pains pita,pain pita|Boulangerie|P|bread|2 pièce|10|5|mp gluten pg=60|🫓
chapelure|Chapelure||Épicerie|P|flour|50 g|0|4|f gluten|🍞
pesto|Pesto|pesto vert,pesto rouge|Épicerie|F|sauce|40 g|30|12|m nuts|🌿
houmous|Houmous|hummus|Crèmerie & œufs|F|sauce|100 g|7|8|m|🧆
falafels|Falafels|falafel|Épicerie|F|legume|200 g|7|10|mp|🧆
olives|Olives|olive,olives noires,olives vertes|Épicerie|P|condiment|50 g|0|9|fp|🫒
amandes|Amandes|amande,amandes effilees|Épicerie|P|nut|30 g|0|14|fp nuts|🌰
noix|Noix|noix de grenoble,cerneaux de noix|Épicerie|P|nut|40 g|0|14|fp nuts|🌰
noisettes|Noisettes|noisette|Épicerie|P|nut|40 g|0|14|fp nuts|🌰
pignons|Pignons de pin|pignon|Épicerie|P|nut|20 g|0|60|mp nuts|🌰
sesame|Graines de sésame|graines de sesame|Épicerie|P|nut|1 c. à soupe|0|12|fp|🌰
raisins-secs|Raisins secs|raisin sec|Épicerie|P|fruit|40 g|0|7|mp|🍇
flocons-avoine|Flocons d'avoine|flocons avoine,avoine,muesli,granola|Épicerie|P|flour|80 g|0|3|mp gluten|🥣
sel|Sel|sel fin,gros sel,fleur de sel|Condiments & épices|P|spice|1 pincée|0|1|m S|🧂
poivre|Poivre|poivre noir,poivre concasse,poivre du moulin|Condiments & épices|P|spice|1 pincée|0|40|m S|⚫
paprika|Paprika|paprika fume,piment d'espelette,piment|Condiments & épices|P|spice|1 c. à café|0|30|m S|🌶️
cumin|Cumin|cumin moulu|Condiments & épices|P|spice|1 c. à café|0|30|m S|🫙
curry|Curry|poudre de curry,pate de curry|Condiments & épices|P|spice|1 c. à soupe|0|25|m S|🍛
garam-masala|Garam masala||Condiments & épices|P|spice|1 c. à café|0|40|m S|🫙
curcuma|Curcuma||Condiments & épices|P|spice|1 c. à café|0|30|m S|🫙
herbes-provence|Herbes de Provence|herbes de provence,thym,romarin,laurier,origan,herbes seches|Condiments & épices|P|spice|1 c. à café|0|30|fp S|🌿
epices|Épices|epices douces,epices couscous,ras el hanout,quatre epices,cinq epices|Condiments & épices|P|spice|1 c. à café|0|40|fp S|🫙
ketchup|Ketchup||Condiments & épices|F|condiment|1 c. à soupe|0|3|m|🍅
mayonnaise|Mayonnaise|mayo|Condiments & épices|F|condiment|1 c. à soupe|0|6|f|🫙
cornichons|Cornichons|cornichon|Condiments & épices|F|condiment|40 g|0|6|mp|🥒
eau|Eau||Divers|A|other|20 cl|0|0|f l S|💧
cafe|Café|café|Divers|P|other|1 c. à café|0|20|m|☕
the|Thé|thé,tisane|Divers|P|other|1 c. à café|0|40|m|🍵
jus-fruits|Jus de fruits|jus de pomme|Divers|F|other|20 cl|7|2|m l|🧃
compote|Compote|compote de pommes|Épicerie|P|fruit|200 g|0|3|f|🍎
glace|Glace|creme glacee|Surgelés|C|sweet|250 g|0|8|f|🍨
legumes-surgeles|Légumes surgelés|legumes surgeles,poelee de legumes,legumes|Surgelés|C|veg|300 g|0|3|mp|🥦
frites|Frites surgelées|frites,frites surgelees|Surgelés|C|starch|400 g|0|3|fp|🍟
pizza-surgelee|Pizza surgelée|pizza surgelee|Surgelés|C|other|1 pièce|0|6|f pg=350|🍕
nouilles|Nouilles|nouilles chinoises,nouilles de riz,ramen,udon,vermicelles de riz|Épicerie|P|starch|200 g|0|4|fp gluten|🍜
cacahuetes|Cacahuètes|cacahuete,arachides|Épicerie|P|nut|30 g|0|8|fp nuts|🥜
reblochon|Reblochon|tomme|Crèmerie & œufs|F|cheese|250 g|20|14|m dairy|🧀
endives|Endives|endive,chicons|Fruits & légumes|F|veg|300 g|7|4|fp pg=100|🥬
farine-sarrasin|Farine de sarrasin|farine de ble noir,sarrasin|Épicerie|P|flour|150 g|0|4|f d=0.55|🌾
maizena|Maïzena|fecule de mais|Épicerie|P|flour|30 g|0|4|f|🌽
biscuits|Biscuits|boudoirs,petits beurre,speculoos,biscuits secs|Épicerie|P|sweet|100 g|0|6|mp gluten|🍪
fromage-frais|Fromage frais|philadelphia,st moret,cream cheese,carre frais|Crèmerie & œufs|F|cheese|100 g|10|10|m dairy|🧀
saumon-fume|Saumon fumé|truite fumee|Viandes & poissons|F|fish|100 g|5|30|m fish tr=25|🐟
betterave|Betterave|betteraves,betterave cuite|Fruits & légumes|F|veg|250 g|5|3|f pg=150|🟣
chou|Chou|chou blanc,chou rouge,chou vert,chou chinois|Fruits & légumes|F|veg|300 g|14|2|m pg=1000|🥬
radis|Radis|radis rose|Fruits & légumes|F|veg|150 g|5|6|mp|🥗
moules|Moules|moule,moules de bouchot|Viandes & poissons|F|fish|500 g|2|6|fp fish shell|🦪
sardines|Sardines en boîte|sardine,sardines a l'huile|Épicerie|P|fish|115 g|0|12|fp fish bo=115|🐟
celeri|Céleri|celeri branche,celeri-rave,celeri rave|Fruits & légumes|F|veg|150 g|10|2.5|m pg=300|🥬
cerises|Cerises|cerise|Fruits & légumes|F|fruit|250 g|4|8|fp|🍒
peches|Pêches|peche,nectarine,nectarines,brugnon|Fruits & légumes|A|fruit|2 pièce|5|4|fp pg=150|🍑
melon|Melon|melons|Fruits & légumes|A|fruit|1 pièce|5|3|m pg=1000|🍈
ananas|Ananas|ananas frais|Fruits & légumes|A|fruit|1 pièce|5|3|m pg=1200|🍍
choux-bruxelles|Choux de Bruxelles|chou de bruxelles|Fruits & légumes|F|veg|300 g|7|4|mp|🥬
kiwi|Kiwis|kiwi|Fruits & légumes|A|fruit|2 pièce|14|4|mp pg=80|🥝
raisin|Raisin|raisin frais,grappe de raisin,raisins blancs,raisins noirs|Fruits & légumes|F|fruit|250 g|7|4|m|🍇
harissa|Harissa|pate de piment|Condiments & épices|F|condiment|1 c. à café|60|20|f|🌶️
jambon-cru|Jambon cru|jambon sec,jambon sec italien,jambon italien,prosciutto,jambon de parme,jambon serrano,serrano,jambon de bayonne,jambon fume,speck,jambon cru italien|Viandes & poissons|F|meat|80 g|10|25|m meat pork tr=15|🥓
saucisson|Saucisson|saucisson sec,rosette,fuet,salami|Viandes & poissons|F|meat|100 g|30|18|m meat pork|🥓
brie|Camembert|brie,camembert,coulommiers,caprice des dieux,chaource,saint marcellin,saint felicien,carre de l'est,brillat savarin,munster,maroilles,pont l'eveque,livarot,fromage a pate molle|Crèmerie & œufs|F|cheese|125 g|14|14|m dairy pg=250|🧀
raclette|Fromage à raclette|raclette,fromage a raclette,morbier|Crèmerie & œufs|F|cheese|200 g|14|15|m dairy|🧀
lait-vegetal|Lait végétal|lait d'amande,lait d'avoine,lait de soja,boisson vegetale,lait de riz,boisson avoine|Crèmerie & œufs|F|dairy|20 cl|7|2.5|m l|🥛
oignon-nouveau|Oignon nouveau|oignons nouveaux,cebette,cebettes,oignon vert,ciboule|Fruits & légumes|F|aromatic|2 pièce|7|8|m pg=30|🧅
pate-sablee|Pâte sablée|pate sablee|Crèmerie & œufs|F|dough|1 pièce|20|6|f gluten pg=230|🥧
cacao|Cacao en poudre|cacao,chocolat en poudre|Épicerie|P|sweet|20 g|0|15|m|🍫
veau|Veau|escalope de veau,blanquette de veau,veau a mijoter,epaule de veau,tendron de veau|Viandes & poissons|F|meat|300 g|3|22|m meat|🥩
canard|Canard|magret,magret de canard,cuisse de canard|Viandes & poissons|F|meat|350 g|3|22|m meat pg=350|🦆
pruneaux|Pruneaux|pruneau|Épicerie|P|fruit|80 g|0|10|mp|🍑
noix-coco|Noix de coco râpée|noix de coco,coco rapee,noix de coco rapee|Épicerie|P|sweet|40 g|0|9|f|🥥
confiture|Confiture|confiture de fraises,confiture d abricots,confiture de framboises,confiture de cerises|Épicerie|P|sweet|60 g|0|6|f pot=370|🍓
pate-tartiner|Pâte à tartiner|nutella,pate a tartiner au chocolat,pate a tartiner aux noisettes|Épicerie|P|sweet|60 g|0|8|f nuts pot=400|🍫
surimi|Surimi|batonnets de surimi,batonnets de crabe|Viandes & poissons|F|fish|120 g|10|9|m fish|🦀
gelatine|Gélatine|feuilles de gelatine,agar agar,agar-agar|Épicerie|P|other|4 g|0|60|f|🍮
""".strip()

# Familles de remplacement : un produit peut en remplacer un autre de la même famille dans une recette.
SUB = {
    'fromage': ['emmental', 'fromage-rape', 'cheddar', 'mozzarella', 'reblochon', 'brie', 'raclette', 'chevre', 'feta', 'fromage-bleu', 'parmesan', 'halloumi'],
    'fromage-frais': ['ricotta', 'fromage-frais', 'mascarpone'],
    'volaille': ['poulet', 'dinde'], 'viande-rouge': ['boeuf', 'agneau', 'veau'], 'saucisse': ['saucisses', 'merguez'],
    'charcuterie': ['jambon', 'jambon-cru', 'lardons', 'chorizo', 'saucisson'],
    'poisson-blanc': ['cabillaud', 'colin', 'merlu', 'dorade', 'poisson-blanc', 'truite'], 'poisson-gras': ['saumon', 'truite'],
    'cereale': ['semoule', 'boulgour', 'quinoa'], 'legumineuse': ['pois-chiches', 'haricots-rouges', 'haricots-blancs'],
    'oignon': ['oignon', 'oignon-rouge', 'oignon-nouveau'], 'agrume': ['citron', 'citron-vert'],
    'herbe': ['persil', 'coriandre', 'basilic', 'ciboulette', 'aneth', 'herbes-fraiches'],
    'noix': ['noix', 'noisettes', 'amandes', 'pignons', 'cacahuetes'], 'fruit-rouge': ['fraises', 'fruits-rouges'],
    'fruit-verger': ['pomme', 'poire'], 'fruit-noyau': ['abricots', 'prunes', 'peches'], 'pain': ['pain', 'pain-mie'], 'galette': ['wrap', 'pita'],
    'pate-tarte': ['pate-brisee', 'pate-feuilletee'], 'lait': ['lait', 'lait-vegetal'], 'tomate': ['tomate', 'tomate-cerise'],
}
SUB_OF = {i: g for g, ids in SUB.items() for i in ids}

# Saisonnalité en France (mois de pleine saison). Les produits disponibles toute l'année ne sont pas listés.
SEASON = {
    'courgette': [6, 7, 8, 9], 'tomate': [7, 8, 9], 'tomate-cerise': [6, 7, 8, 9], 'poivron': [7, 8, 9], 'aubergine': [7, 8, 9],
    'brocoli': [6, 7, 8, 9, 10, 11], 'chou-fleur': [1, 2, 3, 9, 10, 11, 12], 'epinards': [3, 4, 5, 9, 10, 11], 'poireau': [1, 2, 3, 4, 9, 10, 11, 12],
    'potimarron': [9, 10, 11, 12, 1], 'haricots-verts': [6, 7, 8, 9], 'petits-pois': [5, 6, 7], 'concombre': [5, 6, 7, 8, 9], 'fenouil': [6, 7, 8, 9, 10, 11],
    'asperges': [4, 5, 6], 'artichaut': [5, 6, 7, 8, 9], 'mais': [8, 9], 'endives': [10, 11, 12, 1, 2, 3, 4], 'chou': [9, 10, 11, 12, 1, 2, 3],
    'radis': [4, 5, 6, 7, 8, 9], 'betterave': [7, 8, 9, 10, 11, 12, 1, 2, 3], 'patate-douce': [10, 11, 12, 1, 2, 3], 'salade': [4, 5, 6, 7, 8, 9, 10],
    'pomme': [9, 10, 11, 12, 1, 2, 3, 4], 'poire': [8, 9, 10, 11, 12, 1, 2], 'fraises': [4, 5, 6, 7], 'fruits-rouges': [6, 7, 8, 9], 'abricots': [6, 7, 8],
    'prunes': [7, 8, 9], 'orange': [12, 1, 2, 3, 4], 'citron': [11, 12, 1, 2, 3, 4], 'avocat': [11, 12, 1, 2, 3, 4], 'champignons': [9, 10, 11],
    'carotte': [1, 2, 3, 4, 7, 8, 9, 10, 11, 12], 'oignon-nouveau': [4, 5, 6, 7],
    'celeri': [9, 10, 11, 12, 1, 2, 3], 'cerises': [6, 7], 'peches': [6, 7, 8, 9], 'melon': [6, 7, 8, 9], 'choux-bruxelles': [10, 11, 12, 1, 2], 'kiwi': [11, 12, 1, 2, 3, 4], 'raisin': [8, 9, 10],
}


# Quantité habituelle à l'achat (préremplie quand on ajoute un produit au stock)
BUY = dict(x.split('=') for x in """
poulet=500 g;dinde=400 g;boeuf-hache=500 g;boeuf=500 g;porc=500 g;agneau=600 g;veau=500 g;canard=1 pièce;jambon=4 tranche;jambon-cru=6 tranche;lardons=200 g;saucisses=6 pièce;merguez=6 pièce;chorizo=200 g;saucisson=250 g
saumon=2 pièce;cabillaud=2 pièce;colin=2 pièce;merlu=2 pièce;dorade=2 pièce;truite=2 pièce;poisson-blanc=2 pièce;thon=1 boîte;crevettes=300 g;saumon-fume=4 tranche
oeufs=6 pièce;lait=1 l;creme=20 cl;beurre=250 g;fromage-rape=200 g;emmental=250 g;parmesan=150 g;mozzarella=1 pièce;feta=200 g;chevre=180 g;cheddar=200 g;ricotta=250 g;halloumi=250 g;fromage-bleu=150 g;yaourt=4 pot;mascarpone=250 g;bechamel=50 cl;reblochon=450 g;brie=1 pièce;raclette=400 g;fromage-frais=300 g;lait-vegetal=1 l
oignon=3 pièce;oignon-rouge=2 pièce;oignon-nouveau=5 pièce;ail=10 gousse;carotte=1 kg;courgette=2 pièce;tomate=4 pièce;tomate-cerise=250 g;poivron=2 pièce;aubergine=1 pièce;brocoli=1 pièce;chou-fleur=1 pièce;epinards=400 g;salade=1 pièce;champignons=250 g;poireau=2 pièce;pomme-de-terre=2 kg;patate-douce=2 pièce;potimarron=1 pièce;haricots-verts=500 g;petits-pois=500 g;concombre=1 pièce;fenouil=2 pièce;asperges=500 g;artichaut=500 g;mais=285 g;avocat=2 pièce;citron=2 pièce;citron-vert=2 pièce;gingembre=50 g;endives=4 pièce;betterave=500 g;chou=1 pièce;radis=250 g
persil=1 bouquet;basilic=1 bouquet;menthe=1 bouquet;coriandre=1 bouquet;ciboulette=1 bouquet;aneth=1 bouquet;herbes-fraiches=1 bouquet
pomme=6 pièce;poire=4 pièce;cerises=500 g;peches=4 pièce;melon=1 pièce;ananas=1 pièce;kiwi=6 pièce;raisin=500 g;choux-bruxelles=500 g;celeri=1 pièce;moules=1 kg;sardines=1 boîte;harissa=1 pot;banane=5 pièce;fraises=250 g;fruits-rouges=250 g;abricots=500 g;prunes=500 g;mangue=1 pièce;orange=4 pièce;pruneaux=250 g;noix-coco=100 g;confiture=1 pot;pate-tartiner=1 pot;surimi=250 g;gelatine=10 g
riz=1 kg;riz-risotto=500 g;pates=500 g;semoule=500 g;gnocchis=500 g;quinoa=500 g;boulgour=500 g;polenta=500 g;lasagnes=500 g;lentilles=500 g;lentilles-corail=500 g;pois-chiches=400 g;haricots-rouges=400 g;haricots-blancs=400 g;tofu=200 g;nouilles=250 g;farine=1 kg;farine-sarrasin=500 g;flocons-avoine=500 g;maizena=250 g
tomate-concassee=400 g;bouillon=1 paquet;lait-coco=40 cl;sauce-soja=1 bouteille;vin-rouge=75 cl;vin-blanc=75 cl;huile-olive=1 l;vinaigre=1 bouteille;moutarde=1 pot;miel=1 pot;sucre=1 kg;levure=5 sachet;chocolat=200 g;vanille=1 bouteille;cacao=250 g;cacahuete=1 pot
pate-brisee=1 pièce;pate-feuilletee=1 pièce;pate-pizza=1 pièce;pate-sablee=1 pièce;pain=1 pièce;pain-mie=1 paquet;bagel=4 pièce;wrap=6 pièce;pita=4 pièce;chapelure=200 g;biscuits=200 g
pesto=190 g;houmous=200 g;falafels=250 g;olives=200 g;amandes=200 g;noix=200 g;noisettes=200 g;pignons=100 g;sesame=100 g;raisins-secs=250 g;cacahuetes=200 g;cornichons=1 pot;ketchup=1 bouteille;mayonnaise=1 pot
sel=1 paquet;poivre=1 pot;paprika=1 pot;cumin=1 pot;curry=1 pot;garam-masala=1 pot;curcuma=1 pot;herbes-provence=1 pot;epices=1 pot;cannelle=1 pot
eau=1 bouteille;cafe=1 paquet;the=1 boîte;jus-fruits=1 l;compote=4 pot;glace=1 pot;legumes-surgeles=1 kg;frites=1 kg;pizza-surgelee=1 pièce
""".replace('\n', ';').strip(';').split(';'))
EXTRA_UNITS = {'pain': {'pièce': 250}, 'pain-mie': {'paquet': 500}, 'compote': {'pot': 100}, 'bechamel': {}}

UNIT_FLAGS = {"pg": "pièce", "gou": "gousse", "tr": "tranche", "pot": "pot", "bo": "boîte", "sa": "sachet"}


def parse_buy(v):
    if not v: return None
    q, u = v.strip().split(' ', 1)
    return [float(q), u]


def build():
    out, seen = [], set()
    for line in RAW.splitlines():
        p = line.split("|")
        assert len(p) == 11, (len(p), line)
        id_, name, aliases, cat, zone, role, q2, life, price, flags, emoji = p
        assert id_ not in seen, id_
        seen.add(id_)
        assert cat in RAYONS, (cat, id_)
        qn, qu = q2.split(" ", 1)
        fl = flags.split()
        un = {}
        for t in fl:
            if "=" in t:
                k, v = t.split("=")
                if k in UNIT_FLAGS:
                    un[UNIT_FLAGS[k]] = float(v)
        out.append(dict(
            id=id_, n=name, al=[a for a in aliases.split(",") if a], cat=cat, zone=Z[zone], role=role,
            q2=float(qn), u=qu, life=int(life), price=float(price),
            staple="S" in fl, liquid="l" in fl,
            g=next((t for t in fl if t in ("m", "f", "mp", "fp")), "m"), hasp="H" in fl,
            units=un, dens=next((float(t[2:]) for t in fl if t.startswith("d=")), 1.0),
            diet=[t for t in fl if t in ("meat", "fish", "pork", "dairy", "egg", "gluten", "nuts", "shell")], sub=SUB_OF.get(id_), season=SEASON.get(id_), buy=parse_buy(BUY.get(id_)),
            emoji=emoji))
    for i in out:
        if i['role'] == 'herb': i['units']['bouquet'] = 30.0
        i['units'].update({k: float(v) for k, v in EXTRA_UNITS.get(i['id'], {}).items()})
    ids = {i['id'] for i in out}
    for x in BUY: assert x in ids, ('achat', x)
    for x in SEASON: assert x in ids, ('saison', x)
    for g, l in SUB.items():
        for x in l: assert x in ids, ('famille', g, x)
    return out


if __name__ == "__main__":
    kb = build()
    json.dump(kb, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(len(kb), "ingrédients")
