// Compréhension des questions de l'assistant (100 % sur le téléphone, sans internet ni IA distante).
// Pur : texte + base d'ingrédients → intention et détails. Testé dans tests/logic.test.mjs.
import { norm, addDays, parseISO } from './util.js';

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
// texte « à plat » : minuscules, sans accents, apostrophes et tirets remplacés par des espaces, entouré d'espaces
export const flat = s => ' ' + norm(s).replace(/'/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
const has = (t, ...w) => w.some(x => t.includes(' ' + x + ' '));
const starts = (t, ...w) => w.some(x => t.includes(' ' + x));

// ingrédients cités (les noms les plus longs d'abord : « pomme de terre » avant « pomme ») ; « sans X » → exclus
export function findIngs(text, kb) {
  let t = flat(text); const found = [], excl = [];
  for (const [k0, id] of kb.alias) {
    if (id === 'eau' || found.includes(id) || excl.includes(id)) continue;
    const k = k0.replace(/'/g, ' ');
    for (const v of [k, k + 's', k + 'x']) {
      const i = t.indexOf(' ' + v + ' '); if (i < 0) continue;
      (/ sans (de |d )?$/.test(t.slice(Math.max(0, i - 9), i + 1)) ? excl : found).push(id);
      t = t.slice(0, i + 1) + '#'.repeat(v.length) + t.slice(i + 1 + v.length); break;
    }
  }
  return { found, excl };
}

// jour et repas cités (« demain soir », « vendredi midi », « ce soir »)
export function findWhen(text, today, nowSlot = 'lunch') {
  const t = flat(text); let day = null, slot = null;
  if (has(t, 'apres demain')) day = addDays(today, 2);
  else if (has(t, 'demain')) day = addDays(today, 1);
  else if (has(t, 'aujourd hui', 'ce soir', 'ce midi', 'ce matin', 'tout a l heure', 'tantot')) day = today;
  else { const wd = parseISO(today).getDay(); for (let i = 0; i < 7; i++) if (has(t, JOURS[i])) { day = addDays(today, (i - wd + 7) % 7); break; } }
  if (has(t, 'midi', 'dejeuner', 'dej', 'ce midi')) slot = 'lunch'; else if (has(t, 'soir', 'diner', 'ce soir')) slot = 'dinner';
  if (day && !slot && day === today) slot = nowSlot;
  return { day, slot };
}

// ce qu'il reste du texte une fois retirés les mots de commande et de date (pour « mets des lasagnes demain soir »)
const DROP = new Set(['mets', 'met', 'mettre', 'planifie', 'planifier', 'prevois', 'prevoit', 'prevoir', 'programme', 'note', 'noter', 'ajoute', 'ajouter', 'rajoute', 'rajouter', 'inscris',
  'on', 'je', 'j', 'mange', 'mangera', 'mangerai', 'manger', 'mangeons', 'fait', 'fais', 'ferai', 'fera', 'faire', 'va', 'vais', 'vas', 'veux', 'voudrais', 'aimerais', 'stp', 'svp', 'plait', 'te', 's', 'il',
  'ce', 'cette', 'soir', 'midi', 'demain', 'apres', 'aujourd', 'hui', 'dejeuner', 'diner', 'dej', 'menu', 'semaine', 'planning', 'dans', 'ma', 'mon', 'prochain', 'prochaine', 'au', 'aux', ...JOURS]);
const EDGE = new Set(['le', 'la', 'les', 'l', 'un', 'une', 'des', 'du', 'de', 'd', 'a', 'pour', 'et', 'en', 'au', 'aux']);
export function leftover(text) {
  const words = String(text).replace(/\b([ldjtnmcs]|qu)['’]/gi, '$1 ').replace(/[?!.]/g, ' ').split(/\s+/).filter(Boolean);
  let kept = words.filter(w => !DROP.has(norm(w)));
  while (kept.length && EDGE.has(norm(kept[0]))) kept.shift();
  while (kept.length && EDGE.has(norm(kept[kept.length - 1]))) kept.pop();
  const s = kept.join(' ').trim();
  return s ? s[0].toUpperCase() + s.slice(1) : '';
}

// articles à ajouter aux courses : « ajoute du lait, 6 œufs et du pain aux courses »
const UNITS = { kg: 'kg', g: 'g', l: 'l', litre: 'l', litres: 'l', cl: 'cl', ml: 'ml', boite: 'boîte', boites: 'boîte', paquet: 'paquet', paquets: 'paquet', pot: 'pot', pots: 'pot', piece: 'pièce', pieces: 'pièce', tranche: 'tranche', tranches: 'tranche', sachet: 'sachet', sachets: 'sachet' };
export function shopItems(text) {
  let s = ' ' + String(text).replace(/\b([ldjtnmcs]|qu)['’]/gi, '$1 ') + ' ';
  s = s.replace(/\b(aux|à mes|a mes|dans mes|sur mes|à la|a la|sur la|dans la|sur ma|dans ma|à ma|a ma)\s+(courses|liste( de courses)?)\b/gi, ' ')
    .replace(/\b(ajoute|ajouter|rajoute|rajouter|mets|mettre|met|note|noter|il faut|il me faut|faut|pense à|pense a|penser à|penser a|acheter|achète|achete|prendre|stp|svp|s'il te plait|s'il te plaît|courses|liste)\b/gi, ' ');
  return s.split(/,|\bet\b|\+|;/i).map(x => x.trim()).map(x => {
    const words = x.split(/\s+/).filter(Boolean); while (words.length && EDGE.has(norm(words[0]))) words.shift(); while (words.length && EDGE.has(norm(words[words.length - 1]))) words.pop();
    let qty = null, unit = null;
    if (words.length && /^\d+([.,]\d+)?$/.test(words[0])) { qty = parseFloat(words.shift().replace(',', '.')); if (words.length && UNITS[norm(words[0])]) unit = UNITS[norm(words.shift())]; while (words.length && EDGE.has(norm(words[0]))) words.shift(); }
    const name = words.join(' ').trim(); return name ? { name: name[0].toUpperCase() + name.slice(1), qty, unit } : null;
  }).filter(Boolean).slice(0, 12);
}

// moment du repas, temps, régime, budget…
// cuisines du monde dites en mots → famille du filtre « Cuisine », ou cuisines exactes
const CUISINE_WORDS = [[['italien', 'italienne', 'italiens', 'italiennes'], { fam: 'italie' }], [['japonais', 'japonaise'], { k: ['Japonaise'] }], [['chinois', 'chinoise'], { k: ['Chinoise', 'Asiatique'] }],
  [['thai', 'thailandais', 'thailandaise'], { k: ['Thaïlandaise', 'Asiatique'] }], [['asiatique', 'asiatiques'], { fam: 'asie' }], [['indien', 'indienne'], { fam: 'inde' }],
  [['mexicain', 'mexicaine', 'tex mex'], { k: ['Mexicaine', 'Tex-Mex'] }], [['americain', 'americaine'], { k: ['Américaine'] }], [['espagnol', 'espagnole'], { k: ['Espagnole'] }],
  [['grec', 'grecque'], { k: ['Grecque'] }], [['marocain', 'marocaine', 'oriental', 'orientale', 'libanais', 'libanaise', 'turc', 'turque'], { fam: 'medit' }], [['francais', 'francaise', 'terroir', 'traditionnel', 'traditionnelle'], { fam: 'france' }]];
// types de plat dits en mots → catégorie de recettes
const DISH_CATS = [[['une salade', 'des salades', 'salade composee', 'salades composees', 'une grosse salade', 'salade complete'], 'Salades'], [['une soupe', 'des soupes', 'un veloute', 'un potage', 'une soupe chaude'], 'Soupes'],
  [['un gratin', 'des gratins'], 'Gratins & four'], [['une tarte', 'une tarte salee', 'des tartes'], 'Tartes & pizzas'],
  [['un sandwich', 'des sandwichs'], 'Sandwichs'], [['un plat mijote', 'des plats mijotes', 'un mijote', 'un ragout'], 'Plats mijotés']];
export function findWish(text) {
  const t = flat(text), w = {};
  if (has(t, 'dessert', 'desserts', 'sucre', 'sucree', 'gateau', 'gateaux', 'patisserie', 'cake', 'cookie', 'cookies', 'gourmandise', 'douceur')) w.moment = 'dessert';
  else if (has(t, 'apero', 'aperitif', 'tapas', 'grignoter', 'amuse bouche', 'amuse bouches')) w.moment = 'apero';
  else if (has(t, 'entree', 'entrees')) w.moment = 'entree';
  else if (has(t, 'petit dej', 'petit dejeuner', 'ptit dej', 'p tit dej', 'brunch', 'gouter', 'quatre heures', 'matin')) w.moment = 'matin';
  const mins = [...t.matchAll(/ (\d{1,3}) ?(min|minutes|mn) /g)].map(x => +x[1]); if (mins.length) w.maxTime = Math.min(...mins);
  else if (has(t, 'rapide', 'rapidement', 'vite', 'presse', 'pressee', 'express', 'pas le temps', 'pas trop long', 'simple', 'facile')) w.maxTime = 25;
  if (has(t, 'vege', 'vegetarien', 'vegetarienne', 'sans viande', 'veggie')) w.veg = true;
  if (has(t, 'pas cher', 'economique', 'petit budget', 'fin de mois', 'pas chere', 'budget', 'moins cher', 'moins chere')) w.cheap = true;
  if (has(t, 'avec ce que j ai', 'sans courses', 'sans faire de courses', 'faisable', 'tout ce qu il faut', 'avec mon stock', 'avec mon frigo', 'avec ce qu il y a')) w.have = true;
  if (has(t, 'hasard', 'surprends moi', 'surprise', 'n importe quoi')) w.random = true;
  if (has(t, 'sans cuisson', 'sans cuire', 'sans rien cuire', 'pas de cuisson')) w.nocook = true;
  // un appareil qu'on n'a pas : « j'ai pas de four », « sans micro-ondes »
  const no = [['four', 'four'], ['micro-ondes', 'micro ondes', 'micro onde', 'microondes'], ['plaques', 'plaque', 'plaques', 'gaz', 'feu']].filter(([, ...ws]) => ws.some(x => has(t, 'sans ' + x, 'pas de ' + x, 'pas d ' + x, 'plus de ' + x, 'ni ' + x, 'ni de ' + x))).map(x => x[0]);
  if (no.length) w.without = no;
  if (has(t, 'leger', 'legere', 'light', 'healthy', 'equilibre', 'sain')) w.light = true;
  // une cuisine (« un plat italien », « quelque chose de japonais »)
  for (const [ws, c] of CUISINE_WORDS) if (ws.some(x => has(t, x))) { w.cuisine = c; break; }
  // un type de plat (« une soupe », « une salade composée », « un gratin »)
  for (const [ws, c] of DISH_CATS) if (ws.some(x => has(t, x))) { w.cat = c; break; }
  if (has(t, 'chaud', 'chaude', 'qui rechauffe', 'rechauffe', 'reconfortant', 'reconfortante', 'reconfort') && !has(t, 'chevre chaud', 'chocolat chaud')) w.hot = true;
  if (has(t, 'flemme', 'fleme', 'pas envie de cuisiner', 'pas le courage', 'creve', 'crevee', 'epuise', 'epuisee', 'fatigue', 'fatiguee')) w.maxTime = Math.min(w.maxTime || 99, 15);
  if (has(t, 'enfant', 'enfants', 'gamin', 'gamins', 'gosses', 'les petits', 'mes petits', 'ado', 'ados')) w.kids = true;
  if (has(t, 'amis', 'potes', 'copains', 'invites', 'recevoir', 'recoit', 'on recoit', 'reception', 'fete', 'soiree', 'anniversaire', 'du monde', 'beaucoup de monde', 'famille')) w.party = true;
  // un appareil précis : « une recette au air fryer », « au Thermomix », « au Cookeo », « au barbecue », « une raclette » (pas « sans Thermomix »)
  const noAppl = / (sans|pas de|pas d) (air fryer|airfryer|cookeo|thermomix|barbecue|bbq|plancha|gaufrier|raclette|appareil a raclette|micro ondes|mixeur|four) /.test(t);
  if (noAppl) return w;
  if (has(t, 'air fryer', 'airfryer', 'air fryers', 'friteuse sans huile')) w.equip = 'air_fryer';
  else if (has(t, 'barbecue', 'barbecues', 'barbec', 'bbq', 'plancha', 'grillade', 'grillades')) w.equip = 'barbecue';
  else if (has(t, 'appareil a raclette', 'une raclette', 'soiree raclette', 'faire une raclette', 'raclette ce soir', 'idee raclette') || (has(t, 'raclette') && !has(t, 'fromage'))) w.equip = 'raclette';
  else if (has(t, 'gaufrier', 'gaufres', 'gaufre')) w.equip = 'gaufrier';
  else if (has(t, 'cookeo', 'cookeos', 'multicuiseur', 'autocuiseur', 'cocotte minute', 'cocotte-minute')) w.equip = 'cookeo';
  else if (has(t, 'thermomix', 'robot cuiseur', 'monsieur cuisine')) w.equip = 'thermomix';
  else if (has(t, 'micro ondes', 'micro onde', 'microondes')) w.equip = 'micro-ondes';
  else if (has(t, 'au four')) w.equip = 'four';
  else if (has(t, 'au mixeur', 'au blender', 'avec le mixeur', 'avec mon mixeur')) w.equip = 'mixeur';
  return w;
}

// intention principale (l'ordre compte)
export function intent(text) {
  const t = flat(text), q = /\?/.test(text) || /^ (qu|quoi|que|quel|quelle|quels|quelles|est ce|c est quoi|combien|comment|pourquoi|dis moi|t as|tu as|y a t il|il y a) /.test(t);
  if (t.trim() === '') return 'empty';
  if (/^ (merci|thanks|top|super|parfait|genial|cool|nickel|ok merci) /.test(t) && t.length < 30) return 'thanks';
  if (/^ (salut|bonjour|bonsoir|coucou|hello|hey|yo|wesh) /.test(t) && t.split(' ').length <= 5) return 'hello';
  if (has(t, 'aide', 'help', 'tuto', 'tutoriel', 'guide', 'mode d emploi') || (has(t, 'comment') && starts(t, 'marche', 'fonctionne', 'utilise', 'utiliser', 'sert')) || has(t, 'tu sers a quoi', 'que sais tu faire', 'tu sais faire quoi', 'qu est ce que tu sais faire')) return 'help';
  if (starts(t, 'appris') || has(t, 'sais sur moi', 'tu me connais', 'mes habitudes', 'me connais', 'mes gouts', 'qui suis je', 'mon profil')) return 'learned';
  if (has(t, 'niveau', 'xp', 'succes', 'badge', 'badges', 'experience')) return 'level';
  // ce que la personne nous apprend sur elle
  if (/ (je n aime pas|j aime pas|je deteste|j ai horreur d?e?s?|je supporte pas|pas fan d|je ne mange pas|je mange pas|je ne mange plus|allergique a|allergique au|allergique aux) /.test(t)) return 'prefDislike';
  if (/ (j adore|j aime bien|j aime beaucoup|je kiffe|je suis fan d|fan de|j aime|on adore|on aime) /.test(t) && !q) return 'prefLike';
  if (/ (on est|nous sommes|on sera|nous serons) (\d+|deux|trois|quatre|cinq|six) /.test(t) || has(t, 'je vis seul', 'je vis seule', 'j habite seul', 'j habite seule', 'en couple', 'je suis seul', 'je suis seule')) return 'prefPeople';
  if (!q && / (je suis|je deviens|on est|nous sommes) (vegetarien|vegetarienne|vegetariens|vege|vegan|vegane|vegans|vegetalien|vegetalienne|pescetarien|pescetarienne) /.test(t) || has(t, 'je mange de tout', 'on mange de tout', 'je mange de la viande')) return 'prefDiet';
  // le stock raconté en phrases : « j'ai acheté du lait », « j'ai fini le beurre »
  if (/ (j ai achete|je viens d acheter|j ai rachete|j ai pris|on a achete|j ai recu|je rentre des courses avec) /.test(t) || (starts(t, 'ajoute', 'rajoute', 'mets', 'range', 'note') && has(t, 'au frigo', 'dans le frigo', 'au stock', 'dans le stock', 'dans mon stock', 'au placard', 'dans le placard', 'au congelateur', 'au congel', 'au congelo', 'dans mon frigo'))) return 'stockAdd';
  if (/ (j ai fini|on a fini|j ai termine|il n y a plus|y a plus|il y a plus|j ai plus|j ai jete|on n a plus|plus du tout) /.test(t) && !q) return 'stockUse';
  if ((has(t, 'courses', 'liste') && starts(t, 'ajout', 'rajout', 'mets', 'met', 'note', 'pense')) || /^ (achete|acheter|il faut acheter|il me faut|ajoute|rajoute) /.test(t) && !has(t, 'semaine', 'soir', 'midi', 'demain')) return 'shopAdd';
  if (!q && !has(t, 'quoi', 'quel', 'quelle', 'qu est ce', 'combien') && starts(t, 'mets', 'met ', 'planifie', 'prevois', 'programme', 'note', 'ajoute', 'rajoute', 'on mange', 'je mange', 'on fait', 'je fais', 'on se fait', 'je me fais', 'mangeons')
    && (has(t, 'demain', 'soir', 'midi', 'aujourd hui', 'dejeuner', 'diner', 'apres demain') || JOURS.some(j => has(t, j)))) return 'planAdd';
  if (!q && (has(t, 'demain', 'ce soir', 'ce midi', 'apres demain') || JOURS.some(j => has(t, j))) && !starts(t, 'idee', 'recette', 'propos', 'quoi', 'suggest', 'inspir') && !Object.keys(findWish(text)).length && leftover(text).length >= 3) return 'planAdd';
  // hors de la cuisine : l'heure et la date, je les ai ; la météo ou l'actualité, non (pas d'internet)
  if (has(t, 'quelle heure', 'l heure qu il est', 'quel jour on est', 'on est quel jour', 'quelle date', 'on est le combien', 'quel jour sommes nous')) return 'clock';
  if (has(t, 'meteo', 'quel temps fait', 'quel temps il fait', 'quel temps va', 'il va pleuvoir', 'va t il pleuvoir', 'il fait beau', 'actualite', 'actualites', 'les infos', 'resultat du match', 'score du match')) return 'offtopic';
  // « combien de lait il me reste », « j'ai combien d'œufs » : le stock, pas la conservation
  if (has(t, 'j ai combien', 'combien j ai', 'combien il me reste', 'combien il reste', 'combien me reste', 'combien en reste', 'combien j en ai', 'il me reste combien') || / combien d?e? ?[a-z ]+ il me reste /.test(t)) return 'stock';
  // « planifie ma semaine » : proposer des repas pour les jours vides
  if (/ (planifie|planifier|organise|organiser|remplis|remplir|prepare|preparer|fais|faire|propose|proposer|genere|compose|composer)( moi)? (ma|la|une|mes|les|des) (semaine|menus|menu de la semaine|repas de la semaine) /.test(t) || has(t, 'menus de la semaine', 'menu de la semaine')) return 'weekAuto';
  // « je n'ai pas de crème » (un ingrédient, pas un appareil) : par quoi le remplacer
  if (/ (je n ai pas|j ai pas|il me manque|j en ai pas|je n en ai pas) (de |d |du |des |la |le )/.test(t) && !has(t, 'quoi', 'idee', 'recette', 'manger', 'cuisiner', 'four', 'micro ondes', 'plaques', 'mixeur', 'cookeo', 'thermomix', 'air fryer', 'barbecue', 'temps', 'courses')) return 'substitute';
  if (starts(t, 'perim', 'perem', 'dlc', 'dluo', 'date limite', 'gaspi', 'gaspill') || has(t, 'a finir', 'consommer vite', 'urgent', 'urgence', 'va pas tarder', 'vont pas tarder', 'bientot perime', 'a manger vite')) return 'expiring';
  if (has(t, 'se conserve', 'se garde', 'conserver', 'garder', 'conservation', 'tient combien', 'combien de temps', 'congeler', 'se congele')) return 'keep';
  if (starts(t, 'remplac', 'substitu') || has(t, 'a la place', 'a la place de', 'pas de', 'plus de') && has(t, 'remplacer', 'mettre a la place')) return 'substitute';
  if (has(t, 'statistiques', 'stats', 'bilan', 'combien j ai cuisine', 'combien de repas', 'combien j ai jete', 'gaspille', 'jete', 'sauve', 'sauves')) return 'stats';
  if (has(t, 'est ce que j ai', 'j ai encore', 'il me reste', 'il reste', 'reste t il', 'en stock', 'dans mon frigo', 'dans le frigo', 'dans mon placard', 'dans le placard', 'au congelateur', 'au congel', 'au congelo', 'qu est ce que j ai', 'mon stock', 'j ai quoi', 'reste quoi')) return 'stock';
  if (has(t, 'courses', 'liste de courses', 'ma liste', 'a acheter', 'acheter')) return 'shop';
  if (has(t, 'saison', 'de saison')) return 'season';
  if (has(t, 'semaine', 'planning', 'prevu', 'prevus', 'au menu', 'programme') || (q && has(t, 'demain', 'apres demain') && !has(t, 'idee', 'recette', 'cuisiner', 'faire'))) return 'week';
  if (starts(t, 'manger', 'mange', 'cuisin', 'recette', 'idee', 'faim', 'repas', 'plat', 'diner', 'dej', 'dessert', 'apero', 'entree', 'gouter', 'petit dej', 'brunch', 'soir', 'midi', 'propose', 'inspire', 'envie', 'faire a manger', 'prepar')) return 'ideas';
  return 'unknown';
}

// les mots qui décrivent un plat précis (« une recette de crêpes » → « crepes »), sans les mots génériques
const GENERIC = new Set(['une', 'un', 'des', 'de', 'du', 'd', 'la', 'le', 'les', 'l', 'recette', 'recettes', 'idee', 'idees', 'pour', 'me', 'moi', 'propose', 'proposes', 'je', 'j', 'veux', 'voudrais', 'aimerais', 'envie',
  'faire', 'cuisiner', 'manger', 'mange', 'truc', 'dessert', 'desserts', 'apero', 'aperitif', 'entree', 'entrees', 'gouter', 'petit', 'dej', 'dejeuner', 'diner', 'brunch', 'vege', 'vegetarien', 'cher', 'pas', 'cuisson', 'leger', 'light', 'four', 'demain', ...JOURS, 'quelque', 'chose', 'plat', 'plats', 'ce', 'soir', 'midi', 'avec', 'sans', 'on', 'quoi', 'que', 'qu', 'est', 'faim', 'ai', 'a', 'au', 'en', 'et', 'comment', 'fait', 'fais', 'donne', 'trouve', 'cherche', 'bonne', 'bon', 'super', 'sympa', 'simple', 'vite', 'rapide', 'facile', 'ton', 'ta', 'tes', 'mon', 'ma', 'mes', 'stp', 'svp', 's', 'il', 'te', 'plait']);
export function dishWords(text) { return flat(text).trim().split(' ').filter(w => w.length >= 3 && !GENERIC.has(w)); }

// relance d'une demande d'idées (« plus rapide », « sans viande », « et avec du riz ? », « d'autres »)
export function isFollowUp(text) {
  const t = flat(text);
  if (has(t, 'd autres', 'autre chose', 'autres idees', 'une autre', 'encore', 'autres')) return 'more';
  if (/^ (et |plutot |plus |moins |sans |avec |pas de |pas trop |mais |version |en |pour )/.test(t) && t.split(' ').length <= 8) return 'refine';
  return null;
}
// nombre de personnes et régime dits en phrase
const NB = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6 };
export function findPeople(text) {
  const t = flat(text), m = t.match(/ (?:on est|nous sommes|on sera|nous serons) (\d+|deux|trois|quatre|cinq|six) /);
  if (m) return Math.max(1, Math.min(12, NB[m[1]] || parseInt(m[1])));
  if (has(t, 'je vis seul', 'je vis seule', 'j habite seul', 'j habite seule', 'je suis seul', 'je suis seule')) return 1;
  if (has(t, 'en couple')) return 2;
  return null;
}
export function findDiet(text) {
  const t = flat(text);
  if (/ (vegan|vegane|vegans|vegetalien|vegetalienne) /.test(t)) return 'vegan';
  if (/ (vegetarien|vegetarienne|vegetariens|vege) /.test(t)) return 'veg';
  if (/ (pescetarien|pescetarienne) /.test(t)) return 'pesco';
  if (has(t, 'je mange de tout', 'on mange de tout', 'je mange de la viande')) return 'omni';
  return null;
}
// ce qui suit « je n'aime pas » / « j'adore » quand ce n'est pas un produit connu (« les plats épicés »)
export function prefWords(text) {
  const m = String(text).replace(/\b([ldjtnmcs]|qu)['’]/gi, '$1 ').match(/(?:aime pas|aime bien|aime beaucoup|adore|deteste|déteste|horreur d[eu]s?|supporte pas|fan d[eu]s?|mange pas|mange plus|allergique (?:a|à|au|aux)|aime)\s+(.+)$/i);
  if (!m) return [];
  return m[1].split(/,|\bet\b|\bni\b/i).map(x => x.replace(/[?!.]/g, '').trim().split(/\s+/).filter(w => !EDGE.has(norm(w))).join(' ')).filter(x => x.length >= 3).slice(0, 4);
}

// ---------- écriture de tous les jours : abréviations, fautes de frappe, plusieurs demandes d'un coup ----------
// abréviations de SMS → mots (« cb de tps pr cuire le riz » → « combien de temps pour cuire le riz »)
const SMS = { koi: 'quoi', kwa: 'quoi', ki: 'qui', jai: 'j\'ai', cb: 'combien', cbn: 'combien', cmb: 'combien', tps: 'temps', pk: 'pourquoi', pq: 'pourquoi', pkoi: 'pourquoi', qd: 'quand', bcp: 'beaucoup',
  dla: 'de la', chui: 'je suis', chuis: 'je suis', ya: 'il y a', jsp: 'je sais pas', mtn: 'maintenant', mnt: 'maintenant', auj: 'aujourd\'hui', ajd: 'aujourd\'hui', ajrd: 'aujourd\'hui', dem: 'demain',
  frigot: 'frigo', bjr: 'bonjour', slt: 'salut', dsl: 'désolé', pr: 'pour', ds: 'dans', ac: 'avec', avc: 'avec', tt: 'tout', tjr: 'toujours', tjrs: 'toujours', qqch: 'quelque chose', qqc: 'quelque chose',
  ptit: 'petit', pti: 'petit', pdj: 'petit-déj', ptidej: 'petit-déj', dej: 'déj', rdv: 'rendez-vous', svp: 'svp', stp: 'stp', mdr: '', lol: '', ptdr: '', oeuf: 'œuf', oeufs: 'œufs', fo: 'faut', fau: 'faut' };
export function chatNorm(text) {
  return String(text).replace(/\by'a\b/gi, 'il y a').replace(/[A-Za-zÀ-ÿ']+/g, w => { const k = w.toLowerCase(); return Object.prototype.hasOwnProperty.call(SMS, k) ? SMS[k] : w; }).replace(/\s+/g, ' ').trim();
}

// distance d'édition (avec une inversion de deux lettres comptée comme une seule faute), arrêtée dès qu'on dépasse max
export function lev(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let p2 = null, p = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const c = [i]; let low = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (p2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
      c.push(v); if (v < low) low = v;
    }
    if (low > max) return max + 1;
    p2 = p; p = c;
  }
  return p[b.length];
}
// mots courants à ne jamais « corriger »
const COMMON = 'alors aussi autre autres avant avoir beaucoup bien bonjour bonsoir cette chez chose combien comme comment dans demain depuis deux dire donc encore entre est-ce etre fais faire fait faut avec ceux elle elles leur leurs maintenant mais merci meme mettre moins notre nous peut peux plus pour pourquoi pouvoir quand quel quelle quelles quels quelque rien sans savoir sais sont suis sur tout toute toutes tous tres trop vais veux voila votre vous voudrais aimerais voir donne donner trouve trouver cherche chercher ajoute ajouter enleve enlever retire retirer acheter achete manger mange cuisiner cuisine preparer prepare reste restes semaine soir midi matin apres avant aujourd hier petit grand gros grosse bonne meilleur mieux quoi parce depuis jamais toujours souvent combien possible besoin envie idee idees recette recettes plat plats repas frigo stock courses liste congelateur placard produit produits'.split(' ');
// les mots trop proches d'un mot connu sont corrigés (« pattes » → « pates », « conserv » → « conserve »…), seulement s'il n'y a qu'un candidat
export function makeVocab(words) {
  const set = new Set(), byLen = new Map();
  for (const w0 of [...COMMON, ...words]) { const w = norm(w0); if (w.length < 3 || /[^a-z]/.test(w) || set.has(w)) continue; set.add(w); if (!byLen.has(w.length)) byLen.set(w.length, []); byLen.get(w.length).push(w); }
  return { set, byLen };
}
export function fixTypos(text, vocab) {
  return String(text).replace(/[A-Za-zÀ-ÿœ]+/g, tok => {
    const w = norm(tok); if (w.length < 5 || /[^a-z]/.test(w) || vocab.set.has(w) || vocab.set.has(w.replace(/[sx]$/, ''))) return tok;
    const single = w.replace(/(.)\1/g, '$1'); if (single !== w && vocab.set.has(single)) return single;   // lettre doublée par erreur : « pattes » → « pates »
    const max = w.length >= 8 ? 2 : 1; let best = null, bd = max + 1, ties = 0;
    for (let L = w.length - max; L <= w.length + max; L++) for (const v of vocab.byLen.get(L) || []) {
      if (v[0] !== w[0] && v[1] !== w[1]) continue;
      const d = lev(w, v, max), same = best && v.replace(/[sx]$/, '') === best.replace(/[sx]$/, '');   // « lasagne » / « lasagnes » : un seul mot
      if (d < bd) { bd = d; best = v; ties = 0; } else if (d === bd && v !== best && !same) ties++; else if (d === bd && same && v.length === w.length) best = v;
    }
    return best && bd <= max && !ties ? best : tok;
  });
}
// « ajoute du lait aux courses et mets des pâtes demain soir » → deux demandes
const VERBS = '(?:ajoute|rajoute|mets|met|note|planifie|prevois|prévois|retire|enlève|enleve|supprime|j[\'’ ]ai fini|j[\'’ ]ai acheté|j[\'’ ]ai achete|dis[- ]moi|donne[- ]moi|propose[- ]moi|qu[\'’ ]est[- ]ce|est[- ]ce|combien|comment)';
export function splitRequests(text) {
  const parts = String(text).split(new RegExp(`\\s*(?:,|;|\\bet\\b|\\bpuis\\b|\\bensuite\\b)\\s+(?=${VERBS}\\b)`, 'i')).map(x => x.trim()).filter(x => x.length >= 3);
  return parts.length > 1 && parts.length <= 4 ? parts : [String(text).trim()];
}
// mots-clés des intentions (pour le correcteur)
export const BRAIN_WORDS = ('airfryer fryer thermomix cookeo multicuiseur autocuiseur barbecue plancha grillade grillades gaufrier gaufres raclette composee composees italien italienne asiatique japonais japonaise chinois chinoise thailandais indien indienne mexicain mexicaine americain espagnol espagnole grecque marocain marocaine libanais oriental orientale francais francaise traditionnel enfants gamins invites anniversaire soiree meteo actualite planifie organise remplis semaine menus flemme epaissir lier deglacer blanchir julienne emincer ciseler abaisser napper zester pocher braiser mijoter saisir flamber chemiser sabler appareil appareils equipement perime perimer peremption conserver conserve garder congeler congelateur remplacer remplace substituer statistiques bilan courses acheter planifier planning programme prevu menu dessert desserts apero aperitif entree entrees gouter petit dejeuner diner brunch rapide rapidement facile vegetarien vegetarienne economique budget hasard surprise cuisson cuire leger legere equilibre healthy saison achete fini termine recette recettes manger cuisiner idee idees propose inspire envie aime adore deteste horreur supporte allergique niveau experience succes badge appris habitudes ' + JOURS.join(' ')).split(' ');
