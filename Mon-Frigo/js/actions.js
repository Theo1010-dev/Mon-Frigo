// Actions métier : toutes les modifications de données passent par ici.
import { S, set, mutate, ensureIng, ctx, rebuildCatalogue } from './state.js';
import { addOrMerge, consume, matchKey, status } from './stock.js';
import { scaleIngredients } from './recipes.js';
import { needsFor, buildShopping, mergeShopping, weekDays, weekStart } from './plan.js';
import { canonUnit, convert } from './units.js';
import { todayISO, addDays, uid, norm, round } from './util.js';
import { toast } from './ui.js';

const today = todayISO;
export const kb = S.kb;

export function suggestExpiry(ingId, zone) {
  const k = ingId && S.kb.get(ingId);
  if (zone === 'congelateur') return addDays(today(), 90);
  if (k && k.life > 0 && zone !== 'placard') return addDays(today(), k.life);
  if (k && k.life > 0 && ['Fruits & légumes'].includes(k.cat)) return addDays(today(), k.life);
  return null;
}
export function defaultUnit(ingId) { const k = ingId && S.kb.get(ingId); return k ? k.u : 'pièce'; }
export function defaultZone(ingId) { const k = ingId && S.kb.get(ingId); return k ? k.zone : 'frigo'; }

export function addStock({ name, qty, unit, zone, expiry, ing }) {
  const id = ing === null ? null : (ing || ensureIng(name)); const k = id && S.kb.get(id);
  const lot = { ing: id, name: k && !k.custom ? k.n : String(name).trim(), qty: Number(qty), unit: canonUnit(unit), zone, expiry: expiry || null, added: today() };
  mutate('stock', s => addOrMerge(s, lot)); return lot;
}
export function updateStock(id, patch) { mutate('stock', s => s.map(x => x.id === id ? { ...x, ...patch } : x)); }
export function removeStock(id, { silent } = {}) {
  const item = S.data.stock.find(x => x.id === id); if (!item) return;
  mutate('stock', s => s.filter(x => x.id !== id));
  if (!silent) toast(`« ${item.name} » supprimé`, { undo: () => mutate('stock', s => s.some(x => x.id === id) ? s : [...s, item]) });
}
export function useStock(id, qty) { // consommation manuelle
  const it = S.data.stock.find(x => x.id === id); if (!it) return;
  const left = round(Math.max(0, it.qty - qty), 3);
  if (left <= 0) removeStock(id, { silent: true }); else updateStock(id, { qty: left });
}
export const WASTE_REASONS = ['Périmé', 'Pas aimé / trop cuisiné', 'Oublié au fond du frigo', 'Abîmé', 'Autre'];
export function discardStock(id, qty, reason) {
  const it = S.data.stock.find(x => x.id === id); if (!it) return;
  const q = Math.min(qty, it.qty);
  mutate('waste', w => [...w, { id: uid(), ing: it.ing, name: it.name, qty: q, unit: it.unit, reason, date: today() }]);
  useStock(id, q);
}

export function toggleFav(rid) { mutate('fav', f => f.includes(rid) ? f.filter(x => x !== rid) : [...f, rid]); }
export function rate(rid, n) { mutate('ratings', r => ({ ...r, [rid]: n })); }

// ---------- planning ----------
export function planSet(date, slot, rid, serv) { mutate('plan', p => ({ ...p, [date]: { ...(p[date] || {}), [slot]: { rid, serv: serv || S.data.prefs.people || 2, done: false } } })); }
export function planRemove(date, slot) { mutate('plan', p => { const d = { ...(p[date] || {}) }; delete d[slot]; const n = { ...p, [date]: d }; if (!Object.keys(d).length) delete n[date]; return n; }); }
export function planServ(date, slot, serv) { mutate('plan', p => ({ ...p, [date]: { ...p[date], [slot]: { ...p[date][slot], serv } } })); }
export function currentMealSlot() { const h = new Date().getHours(); return h < 15 ? 'lunch' : 'dinner'; }

// ---------- courses ----------
export function addShop({ name, qty, unit, ing, src = 'manual', rid }) {
  const id = ing || ensureIng(name); const k = id && S.kb.get(id);
  const item = { id: uid(), ing: id, name: k && !k.custom ? k.n : String(name).trim(), qty: qty || null, unit: unit ? canonUnit(unit) : (k ? k.u : 'pièce'), cat: k ? k.cat : 'Divers', done: false, src };
  let res = 'added';
  mutate('shop', l => {
    const dup = l.find(x => !x.done && (item.ing ? x.ing === item.ing : norm(x.name) === norm(item.name)));
    if (!dup) return [...l, item];
    if (item.qty == null) { res = 'exists'; return l; }                       // déjà dans la liste : rien à faire
    if (dup.qty == null) { res = 'merged'; return l.map(x => x === dup ? { ...x, qty: item.qty, unit: item.unit } : x); }
    const conv = convert(k, item.qty, item.unit, dup.unit);                  // même produit, unités compatibles : on additionne
    if (conv != null) { res = 'merged'; return l.map(x => x === dup ? { ...x, qty: round(dup.qty + conv, 2) } : x); }
    return [...l, item];
  }); item.result = res; return item;
}
export function addMissingToShop(rows) {
  let n = 0;
  for (const m of rows) { const k = S.kb.get(m.id); const stored = S.data.shop.some(x => !x.done && x.ing === m.id); addShop({ ing: m.id, name: k ? k.n : m.id, qty: m.missing.qty, unit: m.missing.unit, src: 'recipe' }); if (!stored) n++; }
  return n;
}
export function generateShoppingFromPlan(startIso) {
  const days = weekDays(startIso || weekStart(today())).filter(d => d >= today());
  const needs = needsFor(S.data.plan, days, S.cat, S.kb);
  const gen = buildShopping(needs, S.data.stock, S.kb, today(), S.data.prefs.outStaples);
  const before = S.data.shop.filter(x => !x.done).length;
  mutate('shop', l => mergeShopping(l, gen, 'plan'));
  return { generated: gen.length, meals: days.reduce((n, d) => n + Object.keys(S.data.plan[d] || {}).length, 0) };
}
export function shopToStock(entries) { // entries: [{item, qty, unit, zone, expiry}]
  for (const e of entries) addStock({ name: e.item.name, ing: e.item.ing, qty: e.qty, unit: e.unit, zone: e.zone, expiry: e.expiry });
  const ids = new Set(entries.map(e => e.item.id)); mutate('shop', l => l.filter(x => !ids.has(x.id)));
}

// ---------- cuisson ----------
export function cookPreview(r, serv) {
  let stock = S.data.stock.map(s => ({ ...s })); const rows = [];
  for (const [id, q, u] of scaleIngredients(r, serv)) {
    const k = S.kb.get(id); if (k && k.staple) continue;
    const res = consume(stock, k, id, q, u, today()); stock = res.stock;
    rows.push({ id, name: k ? k.n : id, need: { qty: q, unit: u }, missing: res.missing, usedAny: res.taken.length > 0, taken: res.taken });
  }
  return rows;
}
export function applyCook(r, serv, selectedIds) {
  let stock = S.data.stock.map(s => ({ ...s }));
  for (const [id, q, u] of scaleIngredients(r, serv)) {
    if (!selectedIds.includes(id)) continue; const k = S.kb.get(id); if (k && k.staple) continue;
    stock = consume(stock, k, id, q, u, today()).stock;
  }
  set('stock', stock);
}
export function logCooked(r, serv, rating) {
  const entry = { id: uid(), rid: r.id, title: r.t, date: today(), serv, rating: rating || null };
  mutate('history', h => [...h, entry]); if (rating) rate(r.id, rating); return entry;
}
export function markPlanDone(rid) {
  const t = today(); const e = S.data.plan[t]; if (!e) return;
  for (const slot of Object.keys(e)) if (e[slot].rid === rid && !e[slot].done) { mutate('plan', p => ({ ...p, [t]: { ...p[t], [slot]: { ...p[t][slot], done: true } } })); return; }
}
export function addLeftovers(title, portions) {
  addStock({ name: `Reste : ${title}`, ing: null, qty: portions, unit: 'portion', zone: 'frigo', expiry: addDays(today(), 3) });
}
