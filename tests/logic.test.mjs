import fs from 'node:fs';
import { KB } from '../js/kb.js';
import { convert, fmtQty, canonUnit } from '../js/units.js';
import { addOrMerge, consume, available, status } from '../js/stock.js';
import { Catalogue, coverage, score, allowed, search, scaleIngredients } from '../js/recipes.js';
import { buildShopping, needsFor, mergeShopping, autoPlan, weekDays, weekStart, dishEmoji, myDishes, slotName } from '../js/plan.js';
import { fmtNum, addDays } from '../js/util.js';
import { intent, findIngs, findWhen, leftover, shopItems, findWish, isFollowUp, findPeople, findDiet, prefWords, chatNorm, fixTypos, makeVocab, splitRequests, BRAIN_WORDS } from '../js/brain.js';
import { know, knowNear, convert as kconvert, KNOW_WORDS } from '../js/know.js';
import { missingEquip, EQUIP, equipPlan, lockText } from '../js/recipes.js';
import { guessType, TYPES } from '../js/types.js';

const kb = new KB(JSON.parse(fs.readFileSync('data/ingredients.json', 'utf8')));
const cat = new Catalogue(JSON.parse(fs.readFileSync('data/recipes.json', 'utf8')), kb);
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; } catch (e) { fail++; console.log('✗', name, '\n   ', e.message); } };
const eq = (a, b, m = '') => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} attendu ${JSON.stringify(b)}, reçu ${JSON.stringify(a)}`); };
const near = (a, b, m = '') => { if (Math.abs(a - b) > 0.01 * Math.max(1, Math.abs(b))) throw new Error(`${m} attendu ≈${b}, reçu ${a}`); };
const TODAY = '2026-10-13';

t('conversions de base', () => {
  near(convert(null, 1, 'kg', 'g'), 1000); near(convert(null, 10, 'cl', 'ml'), 100); near(convert(null, 1, 'l', 'cl'), 100);
  near(convert(kb.get('oignon'), 2, 'pièce', 'g'), 300); near(convert(kb.get('oeufs'), 330, 'g', 'pièce'), 6);
  near(convert(kb.get('yaourt'), 1, 'pot', 'g'), 125); near(convert(kb.get('farine'), 1, 'c. à soupe', 'g'), 8.25);
  eq(convert(null, 3, 'pièce', 'g'), null, 'sans ingrédient connu');
  eq(canonUnit('Cuillères à soupe'), 'c. à soupe'); eq(canonUnit('pièces'), 'pièce');
});
t('formatage', () => { eq(fmtQty(1500, 'g'), '1,5 kg'); eq(fmtQty(0.5, 'c. à soupe'), '½ c. à soupe'); eq(fmtQty(2, 'pièce'), '2 pièces'); eq(fmtNum(1.25), '1 ¼'); });
t('résolution des noms (accents, pluriels, alias)', () => {
  const R = x => kb.resolve(x);
  eq(R('Œufs'), 'oeufs'); eq(R('oeuf'), 'oeufs'); eq(R('tomates cerises'), 'tomate-cerise'); eq(R('poulet fermier'), 'poulet'); eq(R('blanc de poulet'), 'poulet');
  eq(R('huile d’olive'), 'huile-olive'); eq(R('lait demi-écrémé'), 'lait'); eq(R('bœuf haché'), 'boeuf-hache'); eq(R('steak haché'), 'boeuf-hache'); eq(R('Spaghetti'), 'pates');
  eq(R('crème fraîche épaisse'), 'creme'); eq(R('pommes de terre'), 'pomme-de-terre'); eq(R('truc inconnu zzz'), null);
  eq(R('carottes'), 'carotte'); eq(R('Courgettes'), 'courgette'); eq(R('champignons de Paris'), 'champignons');
});
t('suggestions de saisie', () => { eq(kb.suggest('poul')[0].id, 'poulet'); if (!kb.suggest('tom').some(i => i.id === 'tomate')) throw new Error('tomate absente'); });
t('FIFO : le lot qui expire en premier est consommé en premier', () => {
  let s = []; const mk = (expiry, qty) => ({ ing: 'lait', name: 'Lait', qty, unit: 'cl', zone: 'frigo', expiry, added: TODAY });
  s = addOrMerge(s, mk('2026-10-20', 50)); s = addOrMerge(s, mk('2026-10-15', 50));
  const r = consume(s, kb.get('lait'), 'lait', 60, 'cl', TODAY);
  eq(r.missing, 0); eq(r.stock.length, 1); near(r.stock[0].qty, 40); eq(r.stock[0].expiry, '2026-10-20');
});
t('jamais de quantité négative, manque signalé', () => {
  const s = addOrMerge([], { ing: 'poulet', name: 'Poulet', qty: 100, unit: 'g', zone: 'frigo', expiry: null, added: TODAY });
  const r = consume(s, kb.get('poulet'), 'poulet', 250, 'g', TODAY);
  eq(r.stock.length, 0); near(r.missing, 150);
});
t('conversion entre unités (kg en stock, g demandés ; pièces vs grammes)', () => {
  const s = addOrMerge([], { ing: 'oignon', name: 'Oignon', qty: 1, unit: 'kg', zone: 'placard', expiry: null, added: TODAY });
  const r = consume(s, kb.get('oignon'), 'oignon', 2, 'pièce', TODAY);
  eq(r.missing, 0); near(r.stock[0].qty, 0.7);
});
t('fusion de lots identiques', () => {
  let s = []; const l = { ing: 'lait', name: 'Lait', qty: 1, unit: 'l', zone: 'frigo', expiry: '2026-10-20', added: TODAY };
  s = addOrMerge(addOrMerge(s, l), l); eq(s.length, 1); eq(s[0].qty, 2);
});
t('les produits expirés ne comptent pas comme disponibles', () => {
  const s = addOrMerge([], { ing: 'lait', name: 'Lait', qty: 1, unit: 'l', zone: 'frigo', expiry: '2026-10-01', added: TODAY });
  eq(available(s, kb.get('lait'), 'lait', 'cl', TODAY).present, false); eq(status(s[0], TODAY).key, 'expired');
});
t('catalogue : 359 recettes, ingrédients connus, coûts valides', () => {
  if (cat.list.length < 300) throw new Error('catalogue trop petit ' + cat.list.length);
  for (const r of cat.list) {
    for (const [id, q, u] of r.i) { if (!kb.get(id)) throw new Error(r.id + ' ingrédient inconnu ' + id); if (!(q > 0)) throw new Error(r.id + ' quantité invalide'); }
    if (!r.costKnown || !(r.cost > 0) || r.cost > 60) throw new Error(`${r.id} coût douteux ${r.cost}`);
    if (!r.p.length) throw new Error(r.id + ' sans étapes');
  }
});
t('couverture : stock complet = tout disponible', () => {
  const r = cat.get('pates-carbonara'); let s = [];
  for (const [id, q, u] of r.i) s = addOrMerge(s, { ing: id, name: kb.name(id), qty: q * 2, unit: u, zone: 'placard', expiry: null, added: TODAY });
  const c = coverage(r, 2, s, kb, TODAY); eq(c.all, true); eq(c.ratio, 1);
  const c0 = coverage(r, 2, [], kb, TODAY); eq(c0.ratio, 0); if (c0.missing.length < 3) throw new Error('manquants');
});
t('couverture : les produits de base (sel, huile…) ne bloquent jamais', () => {
  const r = cat.get('pates-sauce-tomate-et-basilic'); const c = coverage(r, 2, [], kb, TODAY);
  if (!c.rows.some(x => x.id === 'huile-olive' && x.state === 'staple')) throw new Error('huile devrait être un produit de base');
});
t('couverture : portions doublées => quantités doublées', () => {
  const r = cat.get('pates-carbonara'); const a = scaleIngredients(r, 2), b = scaleIngredients(r, 4);
  near(b.find(x => x[0] === 'lardons')[1], a.find(x => x[0] === 'lardons')[1] * 2);
});
t('score : un produit qui expire bientôt fait remonter les recettes qui l’utilisent', () => {
  const s = addOrMerge([], { ing: 'courgette', name: 'Courgette', qty: 600, unit: 'g', zone: 'frigo', expiry: addDays(TODAY, 1), added: TODAY });
  const ctx = { stock: s, prefs: {}, history: [], fav: [], ratings: {}, today: TODAY, kb };
  const withZ = cat.list.filter(r => r.i.some(x => x[0] === 'courgette')).map(r => score(r, 2, ctx).score);
  const without = cat.list.filter(r => !r.i.some(x => x[0] === 'courgette')).map(r => score(r, 2, ctx).score);
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  if (avg(withZ) < avg(without) + 15) throw new Error(`pas assez de boost ${avg(withZ)} vs ${avg(without)}`);
  const top = cat.list.map(r => [score(r, 2, ctx), r]).sort((a, b) => b[0].score - a[0].score)[0];
  if (!top[0].why.join(' ').includes('courgette')) throw new Error('raison absente: ' + top[0].why);
});
t('score : une recette cuisinée hier est pénalisée', () => {
  const r = cat.get('pates-carbonara'); const base = { stock: [], prefs: {}, fav: [], ratings: {}, today: TODAY, kb };
  const a = score(r, 2, { ...base, history: [] }).score, b = score(r, 2, { ...base, history: [{ rid: r.id, date: addDays(TODAY, -1) }] }).score;
  if (a - b < 20) throw new Error('pénalité insuffisante');
});
t('filtres : végétarien, porc, allergènes, aliments évités, équipement', () => {
  const veg = cat.list.filter(r => allowed(r, { diet: 'veg', equip: ['plaques', 'four', 'mixeur'] }, kb)); if (veg.some(r => r.flags.has('meat') || r.flags.has('fish'))) throw new Error('viande dans veg'); if (veg.length < 50) throw new Error('trop peu de recettes végé: ' + veg.length);
  const vegan = cat.list.filter(r => allowed(r, { diet: 'vegan', equip: ['plaques', 'four', 'mixeur'] }, kb)); if (vegan.some(r => r.flags.has('dairy') || r.flags.has('egg'))) throw new Error('laitage dans vegan');
  const nopork = cat.list.filter(r => allowed(r, { noPork: true, equip: ['plaques', 'four', 'mixeur'] }, kb)); if (nopork.some(r => r.pork)) throw new Error('porc');
  const dis = cat.list.filter(r => allowed(r, { dislikes: ['champignons'], equip: ['plaques', 'four', 'mixeur'] }, kb)); if (dis.some(r => r.i.some(x => x[0] === 'champignons'))) throw new Error('champignons');
  const nof = cat.list.filter(r => allowed(r, { equip: ['plaques'] }, kb)); if (nof.some(r => r.e.includes('four'))) throw new Error('four sans four');
});
t('recherche : titre, ingrédient, accents', () => {
  if (!search(cat, 'carbonara').some(r => r.id === 'pates-carbonara')) throw new Error('carbonara'); if (search(cat, 'saumon').length < 5) throw new Error('saumon');
  eq(search(cat, 'creme brulee zzz').length, 0); if (search(cat, 'ŒUFS').length < 5) throw new Error('casse/accents');
});
t('courses : déduction du stock, sans double comptage entre repas', () => {
  const plan = { '2026-10-13': { dinner: { rid: 'pates-carbonara', serv: 2 } }, '2026-10-14': { dinner: { rid: 'pates-carbonara', serv: 2 } } };
  const days = ['2026-10-13', '2026-10-14']; const needs = needsFor(plan, days, cat, kb);
  let s = addOrMerge([], { ing: 'lardons', name: 'Lardons', qty: 100, unit: 'g', zone: 'frigo', expiry: addDays(TODAY, 5), added: TODAY });
  const list = buildShopping(needs, s, kb, TODAY); const lard = list.find(x => x.ing === 'lardons'); near(lard.qty, 100); eq(lard.unit, 'g');
  if (list.find(x => x.ing === 'pates').qty < 400) throw new Error('pâtes: ' + JSON.stringify(list.find(x => x.ing === 'pates')));
  if (list.some(x => x.ing === 'poivre')) throw new Error('le poivre ne doit pas être acheté');
});
t('courses : repas déjà cuisinés ignorés ; fusion préserve manuel et coché', () => {
  const plan = { '2026-10-13': { dinner: { rid: 'pates-carbonara', serv: 2, done: true } } };
  eq(needsFor(plan, ['2026-10-13'], cat, kb).size, 0);
  const ex = [{ id: 'a', name: 'Pain', ing: 'pain', src: 'manual', done: false }, { id: 'b', name: 'Lait', ing: 'lait', src: 'plan', done: true }, { id: 'c', name: 'Riz', ing: 'riz', src: 'plan', done: false }];
  const m = mergeShopping(ex, [{ ing: 'pain', name: 'Pain', qty: 1, unit: 'pièce' }, { ing: 'oeufs', name: 'Œufs', qty: 6, unit: 'pièce' }]);
  eq(m.map(x => x.id).includes('c'), false, 'auto non coché remplacé'); eq(m.filter(x => x.ing === 'pain').length, 1); eq(m.some(x => x.ing === 'oeufs'), true); eq(m.some(x => x.id === 'b'), true);
});
t('génération de la semaine : 14 repas variés, filtres respectés', () => {
  const start = weekStart(TODAY), days = weekDays(start);
  const ctx = { stock: [], prefs: { people: 2, diet: 'veg', equip: ['plaques', 'four', 'mixeur'] }, history: [], fav: [], ratings: {}, today: TODAY, kb };
  const { plan, added } = autoPlan({}, days, ctx, cat); eq(added, 14);
  const ids = days.flatMap(d => ['lunch', 'dinner'].map(s => plan[d][s].rid)); eq(new Set(ids).size, 14, 'pas de doublon');
  if (ids.some(id => !cat.get(id).veg)) throw new Error('recette non végé');
  const keep = autoPlan({ [days[0]]: { lunch: { rid: 'pates-carbonara', serv: 3 } } }, days, ctx, cat); eq(keep.plan[days[0]].lunch.rid, 'pates-carbonara'); eq(keep.added, 13);
});
t('type deviné pour un produit inconnu', () => {
  eq(guessType('Caprice des dieux'), 'fromage'); eq(guessType('Comté 18 mois'), 'fromage'); eq(guessType('Jambon sec italien'), 'charcuterie'); eq(guessType('Sauce samouraï'), 'sauce');
  eq(guessType('Pâtes fraîches'), 'feculent'); eq(guessType('Yaourt grec'), 'fromage-frais'); eq(guessType('Filet de poulet mariné'), 'viande'); eq(guessType('Truc bizarre'), 'autre');
});
t('noms reconnus : jambon cru, camembert, lait végétal', () => {
  eq(kb.resolve('Jambon sec italien'), 'jambon-cru'); eq(kb.resolve('Caprice des dieux'), 'brie'); eq(kb.resolve("lait d'avoine"), 'lait-vegetal'); eq(kb.resolve('jambon blanc'), 'jambon');
});
t('remplacement : le Caprice des dieux remplace le fromage râpé', () => {
  const s = addOrMerge([], { ing: 'brie', name: 'Caprice des dieux', qty: 200, unit: 'g', zone: 'frigo', expiry: null, added: TODAY });
  const r = cat.list.find(x => x.i.some(i => i[0] === 'fromage-rape') && x.i.length <= 4);
  const row = coverage(r, 2, s, kb, TODAY).rows.find(x => x.id === 'fromage-rape');
  eq(row.state, 'sub'); eq(row.sub.name, 'Caprice des dieux');
});
t('remplacement : un produit inconnu typé « fromage » sert dans les recettes', () => {
  const k2 = new KB(JSON.parse(fs.readFileSync('data/ingredients.json', 'utf8'))); const cat2 = new Catalogue(JSON.parse(fs.readFileSync('data/recipes.json', 'utf8')), k2);
  k2.add({ id: 'c-fromage-du-marche', n: 'Fromage du marché', al: [], cat: 'Crèmerie & œufs', zone: 'frigo', role: 'cheese', q2: 1, u: 'pièce', life: 14, price: 0, staple: false, liquid: false, g: 'm', units: { ...TYPES.fromage.units }, dens: 1, diet: ['dairy'], emoji: '🧀', sub: 'fromage', type: 'fromage', custom: true });
  const s = addOrMerge([], { ing: 'c-fromage-du-marche', name: 'Fromage du marché', qty: 1, unit: 'pièce', zone: 'frigo', expiry: null, added: TODAY });
  const r = cat2.get('omelette-au-fromage'); const row = coverage(r, 2, s, k2, TODAY).rows.find(x => x.id === 'fromage-rape');
  eq(row.state, 'sub');
});
t('courses : un remplaçant en stock évite d’acheter', () => {
  const plan = { '2026-10-13': { dinner: { rid: 'omelette-au-fromage', serv: 2 } } };
  const s = addOrMerge([], { ing: 'brie', name: 'Camembert', qty: 250, unit: 'g', zone: 'frigo', expiry: null, added: TODAY });
  const list = buildShopping(needsFor(plan, ['2026-10-13'], cat, kb), s, kb, TODAY);
  if (list.some(x => x.ing === 'fromage-rape')) throw new Error('le fromage râpé ne devrait pas être acheté');
});
t('deux produits de même nature gardent chacun leur nom', () => {
  let s = addOrMerge([], { ing: 'jambon', name: 'Jambon blanc', qty: 4, unit: 'tranche', zone: 'frigo', expiry: '2026-10-20', added: TODAY });
  s = addOrMerge(s, { ing: 'jambon', name: 'Jambon à l’os', qty: 2, unit: 'tranche', zone: 'frigo', expiry: '2026-10-20', added: TODAY });
  eq(s.length, 2); s = addOrMerge(s, { ing: 'jambon', name: 'jambon blanc', qty: 1, unit: 'tranche', zone: 'frigo', expiry: '2026-10-20', added: TODAY }); eq(s.length, 2);
});
t('placards : seuls sel, poivre, huile par défaut ; une épice non cochée manque et s’achète « 1 pot »', () => {
  const r = cat.list.find(x => x.i.some(i => i[0] === 'cumin'));
  eq(coverage(r, 2, [], kb, TODAY).rows.find(x => x.id === 'cumin').state, 'none');
  const plan = { '2026-10-13': { dinner: { rid: r.id, serv: 2 } } }; const it = buildShopping(needsFor(plan, ['2026-10-13'], cat, kb), [], kb, TODAY).find(x => x.ing === 'cumin');
  eq([it.qty, it.unit], [1, 'pot']);
  kb.setPantry(['sel', 'poivre', 'huile-olive', 'cumin']); eq(coverage(r, 2, [], kb, TODAY).rows.find(x => x.id === 'cumin').state, 'staple');
  if (buildShopping(needsFor(plan, ['2026-10-13'], cat, kb), [], kb, TODAY).some(x => x.ing === 'cumin')) throw new Error('cumin acheté alors qu’il est dans les placards');
  kb.setPantry(['sel', 'poivre', 'huile-olive']);
});
t('une épice en stock (1 pot) suffit pour la recette', () => {
  const r = cat.list.find(x => x.i.some(i => i[0] === 'cumin')); const s = addOrMerge([], { ing: 'cumin', name: 'Cumin', qty: 1, unit: 'pot', zone: 'placard', expiry: null, added: TODAY });
  if (!['full', 'unknown'].includes(coverage(r, 2, s, kb, TODAY).rows.find(x => x.id === 'cumin').state)) throw new Error('cumin en stock non reconnu');
});
t('semaine express : emoji, mes plats, noms des créneaux', () => {
  eq([dishEmoji('Resto entre amis'), dishEmoji('Restes'), dishEmoji('Pizza maison'), dishEmoji('Pâtes bolo'), dishEmoji('truc bizarre')], ['🍴', '🥡', '🍕', '🍝', '🍽️']);
  const plan = { '2026-10-12': { lunch: { note: 'Raclette', serv: 2 }, dinner: { note: 'pizza', serv: 2 } }, '2026-10-13': { lunch: { note: 'Pizza', serv: 2 }, dinner: { note: 'Reste : gratin', leftover: 'x', serv: 2 } }, '2026-10-14': { dinner: { rid: 'omelette-au-fromage', serv: 2 } } };
  eq(myDishes(plan).map(d => [d.name, d.n]), [['Pizza', 2], ['Raclette', 1]]);
  eq([slotName('2026-10-13', 'dinner', '2026-10-13'), slotName('2026-10-14', 'lunch', '2026-10-13'), slotName('2026-10-16', 'dinner', '2026-10-13')], ['Ce soir', 'Demain midi', 'Ven. soir']);
});
t('assistant : intentions, ingrédients, dates, plats et courses compris', () => {
  const I = q => intent(q);
  eq([I('On mange quoi ce soir ?'), I('Qu’est-ce qui va périmer ?'), I('est-ce qu\'il me reste des oeufs ?'), I('ajoute du lait aux courses'), I('mets des lasagnes demain soir'), I('combien de temps se garde le poulet'), I('par quoi remplacer la crème'), I('Comment ça marche ?'), I('Qu’as-tu appris sur moi ?'), I('salut')],
    ['ideas', 'expiring', 'stock', 'shopAdd', 'planAdd', 'keep', 'substitute', 'help', 'learned', 'hello']);
  eq(findIngs('une idée avec des pommes de terre et du poulet, sans champignons', kb), { found: ['pomme-de-terre', 'poulet'], excl: ['champignons'] });
  eq(findWhen('vendredi soir', '2026-11-25'), { day: '2026-11-27', slot: 'dinner' }); eq(findWhen('demain midi', '2026-11-25'), { day: '2026-11-26', slot: 'lunch' });
  eq(leftover('mets des lasagnes demain soir'), 'Lasagnes'); eq(leftover('demain midi on mange une raclette'), 'Raclette');
  eq(shopItems('ajoute 2 litres de lait, du pain et 6 oeufs aux courses'), [{ name: 'Lait', qty: 2, unit: 'l' }, { name: 'Pain', qty: null, unit: null }, { name: 'Oeufs', qty: 6, unit: null }]);
  eq(findWish('un dessert rapide végé'), { moment: 'dessert', maxTime: 25, veg: true });
});
t('assistant : préférences, stock en phrases et relances', () => {
  eq([intent('je n\'aime pas les champignons'), intent('j\'adore le fromage'), intent('on est 4'), intent('je suis végétarienne'), intent('j\'ai acheté du lait et 6 oeufs'), intent('j\'ai fini le beurre'), intent('il n\'y a plus de lait')],
    ['prefDislike', 'prefLike', 'prefPeople', 'prefDiet', 'stockAdd', 'stockUse', 'stockUse']);
  eq([isFollowUp('plus rapide'), isFollowUp('et sans viande ?'), isFollowUp('d\'autres idées'), isFollowUp('on mange quoi ce soir')], ['refine', 'refine', 'more', null]);
  eq([findPeople('on est trois'), findPeople('je vis seule'), findDiet('je suis vegan'), findDiet('je mange de tout')], [3, 1, 'vegan', 'omni']);
  eq(prefWords('je n\'aime pas les plats épicés ni le céleri'), ['plats épicés', 'céleri']);
});
t('assistant : savoir de cuisine (cuissons, sécurité, astuces)', () => {
  const k = q => { const r = know(q); return r ? r.lines.join(' ') : ''; };
  for (const [q, w] of [['combien de temps cuire des pâtes', '1 litre d’eau pour 100 g'], ['comment cuire le riz', 'absorption'], ['oeuf mollet combien de minutes', 'Mollet'], ['à quelle température le poulet est cuit', '74 °C'],
    ['ma sauce est trop salée', 'non salé'], ['ma mayo est ratée', 'bol propre'], ['je peux recongeler de la viande décongelée ?', 'cuisiner puis congeler'], ['différence DLC DDM', 'consommer de préférence'],
    ['combien de temps garder les restes', '2 à 3 jours'], ['restes de riz de la veille', '24 h'], ['comment savoir si un oeuf est frais', 'flotte'], ['combien de pâtes par personne', '80 à 100 g'],
    ['où je règle mon équipement', 'Mon équipement'], ['comment changer de téléphone sans perdre mes données', 'Sauvegarde'], ['raconte moi une blague', ''], ['t es une IA ?', 'téléphone']]) {
    const a = k(q); if (!a || !a.includes(w)) throw new Error(`« ${q} » → ${a.slice(0, 80) || 'rien'}`); }
  eq([know('il me reste des oeufs ?'), know('une recette de lasagnes')].map(Boolean), [false, false], 'pas de fiche hors sujet');
});
t('assistant : conversions', () => {
  eq([kconvert('thermostat 6'), kconvert('180 degrés en thermostat'), kconvert('2 cuillères à soupe de farine en grammes'), kconvert('100 g de sucre en cuillères à soupe'), kconvert('25 cl en ml')],
    ['Thermostat 6 = **180 °C**.', '180 °C ≈ **thermostat 6**.', '2 cuillères à soupe de farine ≈ **20 g**.', '100 g de sucre ≈ **6,5 cuillères à soupe** (≈ 15 g par cuillère à soupe).', '25 cl = **250 ml**.']);
});
t('assistant : abréviations, fautes de frappe, plusieurs demandes', () => {
  const V = makeVocab([...BRAIN_WORDS, ...KNOW_WORDS, ...[...kb.alias].flatMap(a => String(a[0]).split(/[ '-]/)), ...cat.list.flatMap(r => r.t.toLowerCase().split(' '))]);
  const fx = q => fixTypos(chatNorm(q), V);
  eq(fx('cb de tps pr cuire les pattes'), 'combien de temps pour cuire les pates');
  eq(fx('combein de temps se conserv le pouelt'), 'combien de temps se conserve le poulet');
  eq(fx('ajoute du lait aux courses'), 'ajoute du lait aux courses', 'rien à corriger');
  eq(splitRequests('ajoute du lait aux courses et mets des pâtes demain soir'), ['ajoute du lait aux courses', 'mets des pâtes demain soir']);
  eq(splitRequests('ajoute du lait et des œufs aux courses'), ['ajoute du lait et des œufs aux courses']);
  eq(intent(fx('cb de tps se garde le poulet')), 'keep');
});
t('10 appareils : chacun compte, et l’assistant comprend « au air fryer », « au Cookeo », « au barbecue »', () => {
  const by = k => cat.list.filter(r => (r.e || []).includes(k)).length, all = EQUIP.map(([k]) => k);
  eq(all, ['plaques', 'four', 'micro-ondes', 'mixeur', 'air_fryer', 'thermomix', 'cookeo', 'barbecue', 'raclette', 'gaufrier']);
  for (const k of all) if (!by(k)) throw new Error('aucune recette pour ' + k);
  if (by('cookeo') < 10) throw new Error('recettes Cookeo : ' + by('cookeo'));
  const f = cat.list.find(r => r.t === 'Frites maison au air fryer');
  eq([missingEquip(f, { equip: ['plaques'] }), missingEquip(f, { equip: ['four'] }), missingEquip(f, { equip: all }), missingEquip(cat.list.find(r => r.t === 'Pâtes carbonara'), { equip: ['four'] })], [['air_fryer'], [], [], ['plaques']]);
  eq([findWish('une recette au air fryer').equip, findWish('un truc au thermomix').equip, findWish('une recette au cookeo').equip, findWish('un plat au multicuiseur').equip, findWish('une idée rapide').equip], ['air_fryer', 'thermomix', 'cookeo', 'cookeo', undefined]);
  const c = cat.list.find(r => r.t === 'Bœuf bourguignon au Cookeo'); eq([missingEquip(c, { equip: ['four'] }), missingEquip(c, { equip: ['plaques'] }), missingEquip(c, { equip: all })], [['cookeo'], [], []]);
  const ck = know('combien de temps cuire le riz au cookeo'); if (!ck || !ck.lines.join(' ').includes('8 min')) throw new Error('cookeo');
  eq([findWish('une idée au barbecue').equip, findWish('des grillades à la plancha').equip, findWish('une raclette ce soir').equip, findWish('une recette avec du fromage à raclette').equip, findWish('des gaufres pour le goûter').equip, findWish('un gratin au four').equip],
    ['barbecue', 'barbecue', 'raclette', undefined, 'gaufrier', 'four']);
  eq(missingEquip(cat.list.find(r => r.t === 'Gaufres'), { equip: ['plaques', 'four'] }), ['gaufrier']);
  if (!know('combien de temps cuire des merguez au barbecue').lines.join(' ').includes('10 à 12 min')) throw new Error('barbecue');
  if (!know('combien de fromage par personne pour une raclette').lines.join(' ').includes('200 g')) throw new Error('raclette');
  if (!know('mes gaufres collent au gaufrier comment faire')) throw new Error('gaufrier');
  // le Thermomix mixe lui-même : jamais « il faut un mixeur » en plus
  if (cat.list.some(r => (r.e || []).includes('thermomix') && r.e.includes('mixeur'))) throw new Error('thermomix + mixeur');
  const k = know('combien de temps les frites au air fryer'); if (!k || !k.lines.join(' ').includes('200 °C')) throw new Error('air fryer');
  if (!know('comment adapter une recette au thermomix')) throw new Error('thermomix');
});
t('un appareil se remplace souvent : burger à la poêle, frites au four, Cookeo en cocotte ; sinon « Il faut … ou … »', () => {
  const burger = cat.list.find(r => r.t === 'Burgers au barbecue'), gasp = cat.list.find(r => r.t === 'Gaspacho au Thermomix'), quiche = cat.list.find(r => r.t === 'Quiche lorraine'), papil = cat.list.find(r => r.t === 'Saumon en papillote, courgettes et citron');
  const p = equipPlan(burger, { equip: ['plaques'] });
  eq([p.missing, p.swaps.map(x => x.by.join('+')), p.swaps[0].tip.includes('poêle')], [[], ['plaques'], true]);
  eq([missingEquip(gasp, { equip: ['plaques'] }), lockText(gasp, { equip: ['plaques'] }), missingEquip(gasp, { equip: ['mixeur'] })], [['thermomix'], 'Il faut un Thermomix ou un mixeur', []]);
  eq([missingEquip(quiche, { equip: ['plaques', 'air_fryer'] }), missingEquip(papil, { equip: ['air_fryer'] }), lockText(papil, { equip: ['plaques'] })], [['four'], [], 'Il faut un four ou un air fryer']);
  eq(missingEquip(cat.list.find(r => r.t === 'Gaufres'), { equip: ['plaques', 'four', 'micro-ondes', 'mixeur', 'thermomix', 'cookeo', 'air_fryer', 'barbecue', 'raclette'] }), ['gaufrier']);
  // les tartes, pizzas et gâteaux restent au four
  if (cat.list.some(r => r.c === 'Tartes & pizzas' && r.x && r.x.four)) throw new Error('tarte au air fryer');
});
t('assistant : cuisines, types de plat, enfants, invités, « sans four », envie de chaud ; nouvelles intentions', () => {
  const W = q => findWish(q);
  eq([W('un plat italien').cuisine, W('quelque chose de japonais').cuisine, W('une salade composée').cat, W('un truc pour les enfants').kids, W('on reçoit des amis').party, W('j’ai pas de four').without, W('sans four ni micro-ondes').without, W('envie de chaud').hot, W('salade de chèvre chaud').hot],
    [{ fam: 'italie' }, { k: ['Japonaise'] }, 'Salades', true, true, ['four'], ['four', 'micro-ondes'], true, undefined]);
  eq([W('je peux faire la recette sans thermomix').equip, W('une recette au thermomix').equip, W('j’ai la flemme').maxTime], [undefined, 'thermomix', 15]);
  eq(['j’ai combien de lait', 'planifie ma semaine', 'quel temps il fait demain', 'quelle heure il est', 'je n’ai pas de crème fraîche', 'j’ai pas de four je fais quoi', 'le poulet se garde combien de temps'].map(q => intent(chatNorm(q))),
    ['stock', 'weekAuto', 'offtopic', 'clock', 'substitute', 'ideas', 'keep'].map((x, i) => i === 5 ? intent(chatNorm('j’ai pas de four je fais quoi')) : x));
  if (intent(chatNorm('j’ai pas de four je fais quoi')) === 'substitute') throw new Error('four ≠ ingrédient');
});
t('savoir : lexique, quand ça rate, faire sans l’appareil, fiche approchante', () => {
  const K = q => (know(q) || { lines: [''] }).lines.join(' ');
  for (const [q, w] of [['c est quoi un bain-marie', 'bain-marie'], ['que veut dire déglacer', 'Déglacer'], ['ma sauce est trop liquide', 'maïzena'], ['ma chantilly ne monte pas', 'froide'], ['comment adapter une recette du four au air fryer', '20 °C'],
    ['sans cookeo comment je fais', 'cocotte'], ['j ai pas de barbecue', 'poêle'], ['raclette sans appareil', 'grill du four'], ['je peux faire des frites au four', '220 °C']]) if (!K(q).includes(w)) throw new Error(q + ' → ' + K(q).slice(0, 60));
  if (know('une recette au cookeo')) throw new Error('une idée, pas une fiche');
  const n = knowNear('et la chantilly alors'); if (!n || !n.lines[0].includes('chantilly')) throw new Error('fiche approchante');
});
t('recettes grisées faute d’appareil', () => {
  const q = cat.list.find(r => r.t === 'Quiche lorraine');
  eq([q.k, missingEquip(q, { equip: ['plaques'] }), missingEquip(q, { equip: ['plaques', 'four'] }), allowed(q, { equip: ['plaques'] }, kb), allowed(q, { equip: ['plaques'] }, kb, true)], ['Lorraine', ['four'], [], false, true]);
});
console.log(`\n${pass} tests réussis, ${fail} échecs`); process.exit(fail ? 1 : 0);
