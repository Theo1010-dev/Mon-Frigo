// Expliquer une étape plus simplement, et dire à quoi ça ressemble quand c'est bon. Tout hors ligne, à partir du texte de l'étape.
// Utilisé par le mode cuisine (« Je ne comprends pas », « C'est bon quand ? ») et par l'assistant (« j'ai pas compris l'étape 2 »).
import { norm } from './util.js';
import { GLOSSARY } from './know.js';
import { fmtQty } from './units.js';
import { scaleIngredients } from './recipes.js';

const pad = s => ' ' + norm(s).replace(/['’-]/g, ' ') + ' ';
// repères visuels : [mots de l'étape (tous requis, « a|b » au choix), à quoi ça ressemble quand c'est bon]
const CUES = [
  // les plus précis d'abord
  [['oeufs|jaunes|oeuf', 'hors du feu|cremeuse|cremeux'], 'La sauce doit rester **crémeuse** et napper les pâtes. Si les œufs font des grumeaux, c’est que c’est trop chaud : toujours hors du feu, et remue vite.'],
  [['oeuf|oeufs', 'dur|durs|mollet|mollets|coque'], 'Dans l’eau qui bout : **coque 3 min**, **mollet 6 min**, **dur 9 à 10 min**, puis passe-les à l’eau froide.'],
  [['trembler|tremblotant|tremblotante'], 'C’est cuit quand le bord est pris et que le centre **tremble encore un peu** quand tu bouges le plat : ça finit de prendre en refroidissant.'],
  [['oignon|oignons|echalote|echalotes|poireau|poireaux', 'revenir|suer|fondre|faire dorer|rissoler'], 'Les oignons sont prêts quand ils sont **translucides** et tendres (à peine dorés si on les fait revenir). S’ils brunissent, baisse le feu.'],
  [['ebullition|eau bouillante|bouillir|bout'], 'Ébullition : de **grosses bulles** qui agitent toute la surface.'],
  [['fremi|fremissante|fremissant|fremir'], 'Frémissant : de **petites bulles** qui montent doucement, sans gros bouillons.'],
  [['pates|spaghetti|tagliatelles|penne|coquillettes', 'cuire|egoutter|al dente'], 'Goûte une pâte : **tendre mais encore un peu ferme** au centre (al dente).'],
  [['riz', 'cuire|cuisson|absorb'], 'Le riz est cuit quand il a **bu toute l’eau** et que le grain est tendre, sans être pâteux.'],
  [['poulet|volaille|dinde|pilons|cuisses', 'cuire|cuisson|dorer|griller|four|cuit'], 'Le poulet est cuit quand la chair est **blanche à cœur** (plus du tout rose) et que le jus qui coule est clair.'],
  [['boeuf hache|viande hachee|steak hache|hachee', 'cuire|cuisson|revenir|dorer|emiettant|poele'], 'La viande hachée est cuite quand elle n’est **plus rose** du tout et s’émiette bien.'],
  [['boeuf|steak|entrecote|bavette', 'cuire|cuisson|saisir|griller|poele'], 'Bœuf : **saignant** = souple au toucher, **à point** = un peu ferme, **bien cuit** = ferme. Laisse reposer 2 min avant de couper.'],
  [['braises|barbecue|plancha|sur la grille|sur une grille', 'griller|cuire|retourner|chaque cote'], 'Sur la grille : attends des **braises rouges sans flammes**. Retourne quand ça se décolle tout seul (si ça accroche, attends encore une minute).'],
  [['saumon|cabillaud|poisson|colin|dorade|truite|merlu|sardines|sardine', 'cuire|cuisson|four|poele|papillote|griller|grille'], 'Le poisson est cuit quand la chair devient **opaque** et se détache en lamelles à la fourchette.'],
  [['crevettes|gambas', 'cuire|griller|poele|revenir'], 'Les crevettes sont cuites dès qu’elles sont **roses** et forment un C. Trop cuites, elles deviennent caoutchouteuses.'],
  [['oeuf|oeufs|omelette', 'pris|baveuse|baveux|coulant|prendre|sans remuer|plier|plie'], 'Le blanc doit être **pris** (bien blanc, plus transparent) ; le jaune peut rester coulant. Une omelette se plie quand le dessus est encore un peu baveux.'],
  [['gratiner|gratin|gratine|grill du four|sous le grill'], 'C’est prêt quand le dessus est **doré** et fait de petites bulles.'],
  [['moelleux au centre|coulant|fondant au centre|rester moelleux|reste moelleux'], 'La pointe d’un couteau doit ressortir **un peu humide** au centre : c’est ce qui le garde moelleux.'],
  [['gateau|cake|moelleux|muffins|brownie|clafoutis|quatre quarts|biscuit', 'four|cuire|cuisson'], 'Plante la **pointe d’un couteau** au centre : elle doit ressortir sèche (un peu humide pour un brownie).'],
  [['nappe la cuillere|napper la cuillere|nappe le dos|nappante'], 'La crème **nappe la cuillère** : passe ton doigt sur le dos de la cuillère, la trace doit rester nette.'],
  [['reduire|reduit|reduction'], 'La sauce a assez réduit quand elle a perdu à peu près **la moitié** et qu’elle nappe la cuillère.'],
  [['epaissir|epaissit|lier|maizena'], 'C’est bon quand ça **coule lentement**, comme une crème, et que ça nappe la cuillère.'],
  [['caramel'], 'Caramel : couleur **blond doré à ambré**. Retire-le du feu avant qu’il fonce : il continue de cuire.'],
  [['risotto', 'parmesan|melanger|remuer|bouillon|cremeux'], 'Le risotto est prêt quand il est **crémeux** et que le grain reste juste un peu ferme au centre.'],
  [['pression'], 'Le temps sous pression démarre quand la **pression est atteinte**. À la fin, laisse-la retomber avant d’ouvrir (jamais de force).'],
  [['petrir|petrissez|petrie'], 'La pâte est bien pétrie quand elle est **lisse et souple** et ne colle plus aux doigts.'],
  [['chantilly|creme fouettee|fouetter la creme'], 'La chantilly est prête quand elle **tient au bout du fouet**. Arrête-toi là, sinon elle tourne en beurre.'],
  [['lisse|homogene|grumeaux'], 'C’est prêt quand c’est bien **lisse**, sans grumeaux ni morceaux.'],
  [['neige'], 'Les blancs sont fermes quand ils **tiennent dans le bol retourné**.'],
  [['lever|levee|leve|double de volume'], 'La pâte a levé quand elle a **doublé de volume**.'],
  [['croquant|croquante|croquants|croquantes'], 'Ils doivent rester **un peu croquants** : la pointe du couteau entre, mais avec une petite résistance.'],
  [['pommes de terre|carottes|legumes|potimarron|patate|patates|courge|navets|brocoli', 'cuire|cuisson|tendre|bouillir|four'], 'Pique avec la pointe d’un couteau : elle doit **entrer sans résistance**.'],
  [['tendre|fondant|fondante|fondants'], 'Pique avec la pointe d’un couteau : elle doit **entrer sans résistance**.'],
  [['crepe|crepes|pancake|pancakes', 'cuire|cuisson|retourner|poele'], 'Retourne quand les **bords se décollent** et que le dessous est doré (pour les pancakes : quand des bulles apparaissent dessus).'],
  [['saisir|saisi|poele bien chaude|feu vif'], 'La poêle est assez chaude quand ça **grésille** dès que tu poses l’aliment.'],
  [['dorer|dore|doree|dores|dorees'], 'C’est bon quand c’est **bien doré**, couleur pain grillé, pas noir.'],
  [['fondre', 'chocolat'], 'Le chocolat est fondu quand il est **lisse et brillant**. Pas trop chaud : il graine.'],
  [['beurre', 'mousser|mousse'], 'Le beurre **mousse** sans brunir : c’est le bon moment pour verser.'],
  [['fondre', 'beurre'], 'Le beurre est fondu quand il est liquide, sans brunir.'],
  [['mijoter|mijote|braiser|cuire doucement|feu doux|feu tres doux|a couvert|a petit feu'], 'Ça doit faire de **petites bulles** paresseuses, pas bouillir fort. Remue de temps en temps pour que ça n’attache pas.'],
];
// repères à ne pas donner quand l'étape dit le contraire (« doivent rester croquants », « moelleux au centre », viande hachée)
const UNLESS = {};
for (const [, c] of CUES) {
  if (/entrer sans résistance/.test(c)) UNLESS[c] = / (croquant|croquante|croquants|croquantes) /;
  if (/ressortir sèche/.test(c)) UNLESS[c] = / (moelleux au centre|coulant|fondant au centre|rester moelleux|reste moelleux) /;
  if (c.startsWith('Bœuf : ')) UNLESS[c] = / (hache|hachee|haches) /;
}
const has = (t, alt) => alt.split('|').some(w => t.includes(' ' + w));
// les repères de cette étape (2 au plus, les plus précis d'abord)
export function doneCues(text) {
  // « sans la faire bouillir » : c'est l'inverse de bouillir
  const t = pad(text).replace(/ sans (la |le |les |l )?(faire )?bouillir /g, ' fremir '), out = [];
  for (const [groups, cue] of CUES) if (groups.every(g => has(t, g)) && !out.includes(cue) && !(UNLESS[cue] && UNLESS[cue].test(t))) out.push(cue);
  return out.slice(0, 2);
}
// l'étape en petites actions : une idée par ligne
export function simpleParts(text) {
  const out = [];
  for (const sent of String(text).split(/\.\s+/)) for (const p of sent.split(/,? puis |, ensuite |; /i)) {
    const x = p.trim().replace(/\.$/, ''); if (x.length < 3) continue;
    out.push(x[0].toUpperCase() + x.slice(1) + '.');
  }
  return out;
}
// les mots de cuisine de l'étape, avec leur définition
const forms = x => x.endsWith('er') ? [x, ...['e', 'ee', 'ez', 'ant'].map(e => x.slice(0, -2) + e)] : [x];
export function stepTerms(text) {
  const t = pad(text), out = [];
  for (const [w, d] of GLOSSARY) if (w.split('|').some(x => forms(x).some(f => t.includes(' ' + f + ' ')))) out.push(d);
  return out.slice(0, 3);
}
// températures en thermostat (« 180 °C = thermostat 6 »)
export function stepTemps(text) {
  return [...new Set([...String(text).matchAll(/(\d{3}) ?°C/g)].map(m => +m[1]))].filter(c => c >= 90 && c <= 280).map(c => `${c} °C = thermostat ${Math.round(c / 30)}`);
}
// les ingrédients cités dans l'étape, avec la quantité pour le nombre de personnes : [[nom, quantité]]
export function stepIngredients(r, text, serv, kb) {
  const t = pad(text), out = [];
  const meat = / (viande|viandes) /.test(t), fish = / (poisson|poissons) /.test(t);
  for (const [id, q, u] of scaleIngredients(r, serv)) {
    const k = kb.get(id); if (!k) continue;
    // le nom, son premier mot, et les autres noms en entier (« sucre vanillé » ne doit pas faire croire qu'on parle du sucre)
    const n = norm(k.n).replace(/['’-]/g, ' '), keys = [n, n.split(' ')[0], ...(k.al || []).map(x => norm(x).replace(/['’-]/g, ' '))].filter(x => x.length >= 3).map(x => x.replace(/[sx]$/, ''));
    const said = keys.some(x => [' ', 's ', 'x '].some(e => t.includes(' ' + x + e))) || (meat && k.role === 'meat') || (fish && k.role === 'fish');
    if (said) out.push([k.n, fmtQty(q, u)]);
  }
  return out;
}
// tout pour une étape : petites actions, quantités, mots expliqués, températures, repères
export function explainStep(r, idx, serv, kb) {
  const text = r.p[idx] || '';
  return { n: idx + 1, total: r.p.length, text, parts: simpleParts(text), ings: stepIngredients(r, text, serv, kb), terms: stepTerms(text), temps: stepTemps(text), cues: doneCues(text) };
}
