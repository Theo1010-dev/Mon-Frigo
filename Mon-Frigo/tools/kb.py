# -*- coding: utf-8 -*-
"""Base de connaissances ingrédients de Mon Frigo (source unique -> data/ingredients.json).
Format d'une ligne :
 id|Nom affiché|alias,alias|rayon|zone|rôle|qté pour 2 + unité|durée conservation (j, 0=aucune)|prix €/kg ou €/l|drapeaux|emoji
Drapeaux : S=produit de base · m/f/mp/fp=genre/nombre · H=h aspiré · l=liquide (base ml)
 pg=g par pièce · gou/tr/pot/bo/sa = g par unité · d=densité · meat fish pork dairy egg gluten nuts shell (régimes/allergènes)
"""
import json

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
emmental|Emmental|comte,tranche de fromage,fromage|Crèmerie & œufs|F|cheese|80 g|20|11|m dairy|🧀
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
tofu|Tofu|tofu ferme,tofu nature|Crèmerie & œufs|F|tofu|200 g|20|9|m|🧈
tomate-concassee|Tomates concassées|tomate concassee,coulis de tomate,passata,tomates pelees,sauce tomate|Épicerie|P|sauce|400 g|0|2|fp|🥫
bouillon|Bouillon|bouillon de legumes,bouillon de volaille,bouillon cube,cube de bouillon,fond de volaille|Épicerie|P|sauce|50 cl|0|1|m l|🍲
lait-coco|Lait de coco|lait coco,creme de coco|Épicerie|P|sauce|20 cl|0|4|m l|🥥
sauce-soja|Sauce soja|soja,sauce de soja,teriyaki,sauce teriyaki|Condiments & épices|P|condiment|2 c. à soupe|0|6|f l|🥢
vin-rouge|Vin rouge|vin|Divers|P|sauce|15 cl|0|6|m l|🍷
vin-blanc|Vin blanc||Divers|P|sauce|10 cl|0|6|m l|🍷
huile-olive|Huile d'olive|huile olive,huile,huile de tournesol|Épicerie|P|fat|2 c. à soupe|0|9|f l S|🫒
vinaigre|Vinaigre|vinaigre balsamique,vinaigre de vin,vinaigre de cidre|Condiments & épices|P|acid|1 c. à soupe|0|4|m l S|🍶
moutarde|Moutarde|moutarde a l'ancienne,moutarde de dijon|Condiments & épices|F|condiment|1 c. à soupe|0|6|f S|🟡
miel|Miel||Épicerie|P|sweet|1 c. à soupe|0|12|m|🍯
sucre|Sucre|sucre en poudre,sucre roux,cassonade|Épicerie|P|sweet|60 g|0|1.4|m S|🧂
farine|Farine|farine de ble,farine t55|Épicerie|P|flour|120 g|0|1.2|f gluten d=0.55|🌾
levure|Levure chimique|levure,sachet de levure|Épicerie|P|flour|1 sachet|0|10|f sa=11|🧁
chocolat|Chocolat|chocolat noir,chocolat patissier,pepites de chocolat|Épicerie|P|sweet|100 g|0|10|m|🍫
vanille|Vanille|sucre vanille,extrait de vanille|Épicerie|P|sweet|1 c. à café|0|40|f S|🍨
cannelle|Cannelle||Condiments & épices|P|spice|1 c. à café|0|30|f S|🫚
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
poivre|Poivre|poivre noir,poivre concasse,poivre du moulin|Condiments & épices|P|spice|1 pincée|0|40|m S|🧂
paprika|Paprika|paprika fume,piment d'espelette,piment|Condiments & épices|P|spice|1 c. à café|0|30|m S|🌶️
cumin|Cumin|cumin moulu|Condiments & épices|P|spice|1 c. à café|0|30|m S|🫚
curry|Curry|poudre de curry,pate de curry|Condiments & épices|P|spice|1 c. à soupe|0|25|m S|🍛
garam-masala|Garam masala||Condiments & épices|P|spice|1 c. à café|0|40|m S|🫚
curcuma|Curcuma||Condiments & épices|P|spice|1 c. à café|0|30|m S|🫚
herbes-provence|Herbes de Provence|herbes de provence,thym,romarin,laurier,origan,herbes seches|Condiments & épices|P|spice|1 c. à café|0|30|fp S|🌿
epices|Épices|epices douces,epices couscous,ras el hanout,quatre epices,cinq epices|Condiments & épices|P|spice|1 c. à café|0|40|fp S|🫚
ketchup|Ketchup||Condiments & épices|F|condiment|1 c. à soupe|0|3|m|🍅
mayonnaise|Mayonnaise|mayo|Condiments & épices|F|condiment|1 c. à soupe|0|6|f|🥚
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
""".strip()

UNIT_FLAGS = {"pg": "pièce", "gou": "gousse", "tr": "tranche", "pot": "pot", "bo": "boîte", "sa": "sachet"}


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
            diet=[t for t in fl if t in ("meat", "fish", "pork", "dairy", "egg", "gluten", "nuts", "shell")],
            emoji=emoji))
    return out


if __name__ == "__main__":
    kb = build()
    json.dump(kb, open("../data/ingredients.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(len(kb), "ingrédients")
