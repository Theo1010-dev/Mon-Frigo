// Planning de la semaine et génération de la liste de courses (logique pure).
import { addDays, weekStart, norm, uid, round } from './util.js';
import { toGrams, fromGrams, canonUnit, convert } from './units.js';
import { available, matchKey, consume } from './stock.js';
import { scaleIngredients, allowed, score, coverage } from './recipes.js';

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
      const k = kb.get(id); if (k && k.staple) continue;
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
    const k = kb.get(id); const u = friendlyUnit(k, unit);
    const a = available(stock, k, id, 'g', today);
    let missingG = g - (a.known ? a.have : a.have);
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
  const meals = cat.list.filter(r => allowed(r, prefs, kb) && r.mt.some(x => x !== 'Petit-déjeuner' && x !== 'Dessert' && x !== 'Goûter') && r.c !== 'Desserts' && r.c !== 'Petit-déjeuner');
  let added = 0;
  for (const d of days) for (const [slot] of SLOTS) {
    if (next[d] && next[d][slot]) continue;
    const serv = prefs.people || 2; let best = null;
    for (const r of meals) {
      if (used.has(r.id)) continue;
      const sc = score(r, serv, { ...ctx, stock: vstock });
      let v = sc.score - recentCats.slice(-3).filter(c => c === r.c).length * 14;
      if (slot === 'lunch' && r.m > 35) v -= 8;
      if (!best || v > best.v) best = { v, r };
    }
    if (!best) continue;
    (next[d] = next[d] || {})[slot] = { rid: best.r.id, serv, done: false };
    used.add(best.r.id); recentCats.push(best.r.c); added++;
    for (const [id, q, u] of scaleIngredients(best.r, serv)) { const k = kb.get(id); if (k && k.staple) continue; vstock = consume(vstock, k, id, q, u, ctx.today).stock; }
  }
  return { plan: next, added };
}
