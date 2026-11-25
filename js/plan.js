// Planning de la semaine et génération de la liste de courses (logique pure).
import { addDays, weekStart, norm, uid, daysBetween } from './util.js';
import { toGrams, fromGrams, canonUnit } from './units.js';
import { available, matchKey, consume } from './stock.js';
import { scaleIngredients, allowed, score, coverage, findSub } from './recipes.js';
import { SPOONISH } from './kb.js';

export const SLOTS = [['lunch', 'Midi'], ['dinner', 'Soir']];
export const weekDays = start => Array.from({ length: 7 }, (_, i) => addDays(start, i));
export { weekStart };

// besoins agrégés d'un ensemble de repas (somme par ingrédient, en grammes quand c'est possible)
export function needsFor(plan, days, cat, kb, { skipDone = true } = {}) {
  const m = new Map();
  for (const d of days) for (const [slot] of SLOTS) {
    const e = plan[d] && plan[d][slot]; if (!e || (skipDone && e.done)) continue;
    const r = cat.get(e.rid); if (!r) continue;
    for (const [id, q, u] of scaleIngredients(r, e.serv || 2)) {
      const k = kb.get(id); if (kb.isPantry(id)) continue;
      const g = toGrams(k, q, u);
      const key = id; if (!m.has(key)) m.set(key, { id, g: 0, loose: [], unit: u });
      const x = m.get(key);
      if (g != null) { x.g += g; x.unit = x.unit || u; } else x.loose.push([q, u]);
    }
  }
  return m;
}

function friendlyUnit(k, recipeUnit) {
  // privilégie l'unité du stock/recette pour l'achat : pièces pour les œufs, g sinon
  const u = canonUnit(recipeUnit);
  if (k && k.liquid) return 'cl';
  if (['pièce', 'gousse', 'tranche', 'pot', 'sachet', 'boîte'].includes(u) && k && k.units && k.units[u]) return u;
  return 'g';
}

// calcule ce qu'il faut acheter après déduction du stock (sans double comptage entre repas)
export function buildShopping(needs, stock, kb, today, outStaples = []) {
  const out = [];
  for (const { id, g, loose, unit } of needs.values()) {
    const k = kb.get(id);
    if (k && ['spice', 'condiment', 'herb'].includes(k.role) && (SPOONISH.includes(canonUnit(unit)) || g < 40)) { if (!available(stock, k, id, unit, today).present) out.push({ ing: id, name: k.n, qty: 1, unit: k.role === 'herb' ? 'bouquet' : 'pot', cat: k.cat }); continue; }
    const u = friendlyUnit(k, unit);
    const a = available(stock, k, id, 'g', today);
    let missingG = g - (a.known ? a.have : a.have);
    if (g > 0 && missingG > 1e-6 && findSub(stock, kb, id, missingG, 'g', today)) missingG = 0;
    if (g > 0 && missingG > 1e-6) {
      let qty = fromGrams(k, missingG, u);
      if (qty == null) { qty = missingG; }
      const rounded = ['g'].includes(u) ? Math.ceil(qty / 10) * 10 : u === 'cl' ? Math.ceil(qty) : Math.ceil(qty - 1e-6);
      out.push({ ing: id, name: k ? k.n : id, qty: rounded, unit: ['g'].includes(u) && !fromGrams(k, 1, u) ? 'g' : u, cat: k ? k.cat : 'Divers' });
    }
    for (const [q, lu] of loose) { if (!available(stock, k, id, lu, today).present) out.push({ ing: id, name: k ? k.n : id, qty: q, unit: lu, cat: k ? k.cat : 'Divers' }); }
  }
  return out;
}

// fusionne la liste générée avec la liste existante : garde le manuel et le coché, remplace l'auto non coché
export function mergeShopping(existing, generated, src = 'plan') {
  const kept = existing.filter(x => x.src !== src || x.done);
  const list = [...kept];
  for (const g of generated) {
    const dup = list.find(x => !x.done && (x.ing ? x.ing === g.ing : norm(x.name) === norm(g.name)));
    if (dup) { if (dup.src === src) continue; continue; } // déjà présent (ajouté à la main) : on ne double pas
    list.push({ id: uid(), done: false, src, ...g });
  }
  return list;
}

// remplit les créneaux libres : meilleurs scores, variété, stock simulé après chaque repas
export function autoPlan(plan, days, ctx, cat, opts = {}) {
  const { kb, stock, prefs } = ctx; const next = JSON.parse(JSON.stringify(plan));
  let vstock = stock.map(s => ({ ...s }));
  const used = new Set(); const recentCats = [];
  for (const d of days) for (const [slot] of SLOTS) { const e = next[d] && next[d][slot]; if (e) { used.add(e.rid); const r = cat.get(e.rid); if (r) recentCats.push(r.c); } }
  const meals = cat.list.filter(r => allowed(r, prefs, kb) && r.mt.some(x => x === 'Déjeuner' || x === 'Dîner') && r.c !== 'Desserts' && r.c !== 'Petit-déjeuner');
  let added = 0;
  for (const d of days) for (const [slot] of SLOTS) {
    if (next[d] && next[d][slot]) continue;
    const serv = prefs.people || 2; let best = null;
    const habit = opts.free && opts.free.get(`${(new Date(d + 'T12:00').getDay() + 6) % 7}-${slot}`);
    if (habit) { (next[d] = next[d] || {})[slot] = { note: habit, serv, done: false }; added++; continue; }
    for (const r of meals) {
      if (used.has(r.id)) continue;
      const sc = score(r, serv, { ...ctx, stock: vstock });
      let v = sc.score - recentCats.slice(-3).filter(c => c === r.c).length * 14 + (opts.random ? Math.random() * 40 : 0);
      if (slot === 'lunch' && r.m > 35) v -= 8;
      if (!best || v > best.v) best = { v, r };
    }
    if (!best) continue;
    (next[d] = next[d] || {})[slot] = { rid: best.r.id, serv, done: false };
    used.add(best.r.id); recentCats.push(best.r.c); added++;
    for (const [id, q, u] of scaleIngredients(best.r, serv)) { const k = kb.get(id); if (kb.isPantry(id)) continue; vstock = consume(vstock, k, id, q, u, ctx.today).stock; }
  }
  return { plan: next, added };
}

// « Vider le frigo » : 2 à 3 recettes qui, ensemble, utilisent un maximum de produits qui vont périmer
export function clearFridge(cat, ctx, max = 3) {
  const { stock, prefs, kb, today } = ctx, serv = prefs.people || 2;
  const urgentLots = stock.filter(it => it.expiry && daysBetween(today, it.expiry) >= 0 && daysBetween(today, it.expiry) <= 5);
  const names = new Map(urgentLots.map(it => [matchKey(it), it.name])), urgent = new Set(names.keys());
  const info = cat.list.filter(r => allowed(r, prefs, kb) && r.c !== 'Desserts' && r.c !== 'Petit-déjeuner' && r.mt.some(x => x === 'Déjeuner' || x === 'Dîner')).map(r => {
    const cov = coverage(r, serv, stock, kb, today), uses = new Set();
    for (const row of cov.rows) { if (row.state === 'none' || row.state === 'staple') continue; const key = row.state === 'sub' ? row.sub.id : row.id; if (urgent.has(key)) uses.add(key); }
    return { r, cov, uses };
  });
  const chosen = [], covered = new Set();
  // si aucune recette n'utilise les produits urgents, on propose quand même le mieux faisable avec le stock
  const needGain = urgent.size > 0 && info.some(x => x.uses.size > 0);
  for (let k = 0; k < max; k++) {
    let best = null;
    for (const x of info) {
      if (chosen.includes(x)) continue; const gain = [...x.uses].filter(u => !covered.has(u)).length;
      if (needGain && !gain) continue;
      const v = gain * 10 + x.cov.ratio * 8 - x.cov.missing.length * 4 - (x.r.m > 60 ? 3 : 0) - chosen.filter(c => c.r.c === x.r.c).length * 3;
      if (!best || v > best.v) best = { x, v };
    }
    if (!best) break; chosen.push(best.x); best.x.uses.forEach(u => covered.add(u));
    if (needGain && covered.size >= urgent.size) break;
  }
  return { urgent: urgent.size, covered: covered.size, urgentNames: [...names.values()], chosen: chosen.map(x => ({ r: x.r, uses: [...x.uses].map(u => names.get(u) || u), missing: x.cov.missing.length })) };
}


// ---------- saisie rapide de la semaine ----------
// emoji d'un repas écrit à la main (« pizza », « resto »…) ; 🍽️ par défaut
const DISH_EMO = [['resto', '🍴'], ['restaurant', '🍴'], ['reste', '🥡'], ['ami', '🏠'], ['famille', '🏠'], ['parent', '🏠'], ['livr', '🛵'], ['uber', '🛵'], ['deliveroo', '🛵'], ['saute', '⏭️'], ['jeun', '⏭️'], ['pizza', '🍕'], ['raclette', '🧀'], ['fondue', '🧀'], ['tartiflette', '🧀'], ['croque', '🥪'], ['sandwich', '🥪'], ['burger', '🍔'], ['hamburger', '🍔'], ['kebab', '🥙'], ['tacos', '🌮'], ['fajita', '🌮'], ['sushi', '🍣'], ['maki', '🍣'], ['ramen', '🍜'], ['nouille', '🍜'], ['pho', '🍜'], ['wok', '🥡'], ['bbq', '🍖'], ['barbecue', '🍖'], ['grillade', '🍖'], ['crepe', '🥞'], ['galette', '🥞'], ['gaufre', '🧇'], ['soupe', '🍲'], ['veloute', '🍲'], ['pot-au-feu', '🍲'], ['salade', '🥗'], ['pate', '🍝'], ['spaghetti', '🍝'], ['lasagne', '🍝'], ['bolo', '🍝'], ['carbo', '🍝'], ['riz', '🍚'], ['risotto', '🍚'], ['curry', '🍛'], ['chili', '🌶️'], ['poisson', '🐟'], ['saumon', '🐟'], ['moule', '🦪'], ['poulet', '🍗'], ['steak', '🥩'], ['boeuf', '🥩'], ['roti', '🥩'], ['frite', '🍟'], ['oeuf', '🍳'], ['omelette', '🍳'], ['quiche', '🥧'], ['tarte', '🥧'], ['gratin', '🧆'], ['hachis', '🥘'], ['couscous', '🥘'], ['paella', '🥘'], ['plat prepare', '🍱'], ['surgele', '🧊'], ['apero', '🥂'], ['tapas', '🫒'], ['brunch', '🥐'], ['cantine', '🍱'], ['self', '🍱'], ['boulot', '💼'], ['travail', '💼']];
export function dishEmoji(text) {
  const n = ' ' + norm(text).replace(/-/g, ' ') + ' ';
  for (const [k, e] of DISH_EMO) if (n.includes(' ' + k.replace(/-/g, ' '))) return e;
  return '🍽️';
}
// « mes plats » : les repas écrits à la main, du plus fréquent au moins fréquent (puis du plus récent)
export function myDishes(plan, max = 12) {
  const by = new Map();
  for (const [date, e] of Object.entries(plan || {})) for (const k of ['lunch', 'dinner']) {
    const x = e && e[k]; if (!x || !x.note || x.leftover) continue;
    const key = norm(x.note); if (!key) continue;
    const cur = by.get(key) || { name: x.note, n: 0, last: '' };
    cur.n++; if (date >= cur.last) { cur.last = date; cur.name = x.note; }
    by.set(key, cur);
  }
  return [...by.values()].sort((a, b) => b.n - a.n || (b.last > a.last ? 1 : b.last < a.last ? -1 : 0)).slice(0, max);
}
// nom court d'un créneau : « Ce soir », « Demain midi », « Jeu. midi »
export function slotName(d, k, today) {
  const dd = daysBetween(today, d), s = k === 'lunch' ? 'midi' : 'soir';
  if (dd === 0) return k === 'lunch' ? 'Ce midi' : 'Ce soir';
  if (dd === 1) return `Demain ${s}`;
  if (dd === -1) return `Hier ${s}`;
  const J = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'], dt = new Date(d + 'T12:00:00');
  return `${J[dt.getDay()]} ${s}`;
}
