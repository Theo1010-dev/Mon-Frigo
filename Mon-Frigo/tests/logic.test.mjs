import fs from 'node:fs';
import { KB } from '../js/kb.js';
import { convert, fmtQty, canonUnit } from '../js/units.js';
import { addOrMerge, consume, available, status } from '../js/stock.js';
import { Catalogue, coverage, score, allowed, search, scaleIngredients } from '../js/recipes.js';
import { buildShopping, needsFor, mergeShopping, autoPlan, weekDays, weekStart } from '../js/plan.js';
import { fmtNum, addDays } from '../js/util.js';

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
console.log(`\n${pass} tests réussis, ${fail} échecs`); process.exit(fail ? 1 : 0);
