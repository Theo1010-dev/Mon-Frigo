// Actions métier : toutes les modifications de données passent par ici.
import { S, set, mutate, ensureIng, ctx } from './state.js';
import { addOrMerge, consume } from './stock.js';
import { scaleIngredients, findSub } from './recipes.js';
import { SPOONISH } from './kb.js';
import { needsFor, buildShopping, mergeShopping, weekDays, weekStart, autoPlan } from './plan.js';
import { canonUnit, convert, toGrams } from './units.js';
import { todayISO, addDays, uid, norm, round, daysBetween } from './util.js';
import { learnProduct, learnBought, freePattern } from './habits.js';
import { bump } from './rpg.js';
import { toast } from './ui.js';

const today = todayISO;

export function suggestExpiry(ingId, zone) {
  const k = ingId && S.kb.get(ingId);
  if (zone === 'congelateur') return addDays(today(), 90);
  if (k && k.life > 0 && zone !== 'placard') return addDays(today(), k.life);
  if (k && k.life > 0 && ['Fruits & légumes'].includes(k.cat)) return addDays(today(), k.life);
  return null;
}

const cleanName = n => { const t = String(n || '').trim(); return t ? t[0].toUpperCase() + t.slice(1) : t; };
export function addStock({ name, qty, unit, zone, expiry, ing, type }) {
  const id = ing === null ? null : (ing || ensureIng(name, type));
  const lot = { ing: id, name: cleanName(name), qty: Number(qty), unit: canonUnit(unit), zone, expiry: expiry || null, added: today() };
  mutate('stock', s => addOrMerge(s, lot)); bump('added'); return lot;
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

export function discardExpired() {
  const t = today(), exp = S.data.stock.filter(x => x.expiry && x.expiry < t); if (!exp.length) return null;
  const before = { stock: S.data.stock, waste: S.data.waste };
  mutate('waste', w => [...w, ...exp.map(it => ({ id: uid(), ing: it.ing, name: it.name, qty: it.qty, unit: it.unit, reason: 'Périmé', date: t }))]);
  const ids = new Set(exp.map(x => x.id)); mutate('stock', s => s.filter(x => !ids.has(x.id)));
  return { n: exp.length, undo: () => { set('stock', before.stock); set('waste', before.waste); } };
}
export function toggleFav(rid) { mutate('fav', f => f.includes(rid) ? f.filter(x => x !== rid) : [...f, rid]); }
function rate(rid, n) { mutate('ratings', r => ({ ...r, [rid]: n })); }

// ---------- planning ----------
export function planSet(date, slot, rid, serv) { mutate('plan', p => ({ ...p, [date]: { ...(p[date] || {}), [slot]: { rid, serv: serv || S.data.prefs.people || 2, done: false } } })); bump('planned'); }
export function planSetFree(date, slot, note, serv, extra = {}) { mutate('plan', p => ({ ...p, [date]: { ...(p[date] || {}), [slot]: { note: String(note).trim(), serv: serv || S.data.prefs.people || 2, done: false, ...extra } } })); bump('planned'); }
export function eatLeftover(date, slot) { const e = S.data.plan[date] && S.data.plan[date][slot]; if (!e) return; if (e.leftover && S.data.stock.some(x => x.id === e.leftover)) useStock(e.leftover, e.serv || 1); mutate('plan', p => ({ ...p, [date]: { ...p[date], [slot]: { ...p[date][slot], done: true } } })); }
// place des recettes dans les prochains créneaux libres (à partir du repas en cours)
export function planInNextSlots(rids) {
  const t = today(), first = currentMealSlot(); let placed = 0, i = 0; const before = JSON.parse(JSON.stringify(S.data.plan));
  for (let d = 0; d < 14 && i < rids.length; d++) { const date = addDays(t, d); for (const slot of ['lunch', 'dinner']) { if (d === 0 && slot === 'lunch' && first === 'dinner') continue; if (i >= rids.length) break; if (!(S.data.plan[date] && S.data.plan[date][slot])) { planSet(date, slot, rids[i++]); placed++; } } }
  return { placed, before };
}
export function planClear(days) {
  const before = JSON.parse(JSON.stringify(S.data.plan)); let n = 0;
  mutate('plan', p => { const q = { ...p }; for (const d of days) if (q[d]) { n += Object.keys(q[d]).length; delete q[d]; } return q; });
  return { before, n };
}
export function planRandom(days) {
  const before = JSON.parse(JSON.stringify(S.data.plan)); const t = today();
  const cleared = JSON.parse(JSON.stringify(S.data.plan));
  for (const d of days) if (d >= t && cleared[d]) { for (const k of Object.keys(cleared[d])) if (cleared[d][k].rid && !cleared[d][k].done) delete cleared[d][k]; if (!Object.keys(cleared[d]).length) delete cleared[d]; }
  const res = autoPlan(cleared, days.filter(d => d >= t), ctx(), S.cat, { random: true, free: freePattern() });
  set('plan', res.plan); return { before, added: res.added };
}
export function planRemove(date, slot) { mutate('plan', p => { const d = { ...(p[date] || {}) }; delete d[slot]; const n = { ...p, [date]: d }; if (!Object.keys(d).length) delete n[date]; return n; }); }
// déplace un repas vers un autre créneau ; s'il y en a déjà un, les deux sont échangés
export function planMove(date, slot, date2, slot2) {
  if (date === date2 && slot === slot2) return;
  mutate('plan', p => {
    const a = p[date] && p[date][slot], b = p[date2] && p[date2][slot2], n = { ...p, [date]: { ...(p[date] || {}) } };
    n[date2] = date2 === date ? n[date] : { ...(p[date2] || {}) };
    if (b) n[date][slot] = b; else delete n[date][slot];
    if (a) n[date2][slot2] = a;
    for (const x of [date, date2]) if (n[x] && !Object.keys(n[x]).length) delete n[x];
    return n;
  });
}
export function planServ(date, slot, serv) { mutate('plan', p => ({ ...p, [date]: { ...p[date], [slot]: { ...p[date][slot], serv } } })); }
export function currentMealSlot() { const h = new Date().getHours(); return h < 15 ? 'lunch' : 'dinner'; }

// ---------- courses ----------
export function addShop({ name, qty, unit, ing, src = 'manual', price }) {
  const id = ing || ensureIng(name); const k = id && S.kb.get(id);
  const item = { id: uid(), ing: id, name: cleanName(name), qty: qty || null, unit: unit ? canonUnit(unit) : (k ? k.u : 'pièce'), cat: k ? k.cat : 'Divers', done: false, src, price: price > 0 ? round(price, 2) : null };
  let res = 'added';
  mutate('shop', l => {
    const dup = l.find(x => !x.done && norm(x.name) === norm(item.name));
    if (!dup) return [...l, item];
    const price2 = item.price ? round((dup.price || 0) + item.price, 2) : dup.price;
    if (item.qty == null) { res = item.price ? 'merged' : 'exists'; return item.price ? l.map(x => x === dup ? { ...x, price: price2 } : x) : l; }
    if (dup.qty == null) { res = 'merged'; return l.map(x => x === dup ? { ...x, qty: item.qty, unit: item.unit, price: price2 } : x); }
    const conv = convert(k, item.qty, item.unit, dup.unit);
    if (conv != null) { res = 'merged'; return l.map(x => x === dup ? { ...x, qty: round(dup.qty + conv, 2), price: price2 } : x); }
    return [...l, item];
  }); item.result = res; return item;
}
export function addMissingToShop(rows) {
  let n = 0;
  for (const m of rows) { const k = S.kb.get(m.id); const stored = S.data.shop.some(x => !x.done && x.ing === m.id); const pot = k && ['spice', 'condiment', 'herb'].includes(k.role) && SPOONISH.includes(canonUnit(m.missing.unit));
    addShop({ ing: m.id, name: k ? k.n : m.id, qty: pot ? 1 : m.missing.qty, unit: pot ? (k.role === 'herb' ? 'bouquet' : 'pot') : m.missing.unit, src: 'recipe' }); if (!stored) n++; }
  return n;
}
export function generateShoppingFromPlan(startIso) {
  const days = weekDays(startIso || weekStart(today())).filter(d => d >= today());
  const needs = needsFor(S.data.plan, days, S.cat, S.kb);
  const gen = buildShopping(needs, S.data.stock, S.kb, today(), S.data.prefs.outStaples);
  mutate('shop', l => mergeShopping(l, gen, 'plan'));
  return { generated: gen.length, meals: days.reduce((n, d) => n + Object.keys(S.data.plan[d] || {}).length, 0) };
}
export function shopToStock(entries) { // entries: [{item, qty, unit, zone, expiry}]
  for (const e of entries) { addStock({ name: e.item.name, ing: e.item.ing, qty: e.qty, unit: e.unit, zone: e.zone, expiry: e.expiry }); learnProduct(e.item.name, { ing: e.item.ing, unit: e.unit, qty: e.qty, zone: e.zone, life: e.expiry ? daysBetween(today(), e.expiry) : null }); }
  learnBought(entries.map(e => ({ name: e.item.name, ing: e.item.ing, qty: e.qty, unit: e.unit, price: e.item.price }))); bump('bought', entries.length);
  const ids = new Set(entries.map(e => e.item.id)); mutate('shop', l => l.filter(x => !ids.has(x.id)));
}

// ---------- cuisson ----------
// retire un ingrédient du stock ; s'il manque, utilise un remplaçant de la même famille
function consumeRow(stock, id, q, u) {
  const k = S.kb.get(id); let res = consume(stock, k, id, q, u, today()), sub = null;
  if (res.missing > 1e-6) {
    const s = findSub(res.stock, S.kb, id, res.missing, u, today()), g = s && toGrams(k, res.missing, u);
    if (s && g != null) { const r2 = consume(res.stock, S.kb.get(s.id), s.id, g, 'g', today()); if (r2.taken.length) { sub = s.name; res = { stock: r2.stock, taken: [...res.taken, ...r2.taken], missing: r2.missing > 1e-6 ? res.missing : 0 }; } }
  }
  return { ...res, sub };
}
export function cookPreview(r, serv) {
  let stock = S.data.stock.map(s => ({ ...s })); const rows = [];
  for (const [id, q, u] of scaleIngredients(r, serv)) {
    const k = S.kb.get(id); if (S.kb.isPantry(id)) continue;
    const res = consumeRow(stock, id, q, u); stock = res.stock;
    rows.push({ id, name: k ? k.n : id, need: { qty: q, unit: u }, missing: res.missing, usedAny: res.taken.length > 0, taken: res.taken, sub: res.sub });
  }
  return rows;
}
export function applyCook(r, serv, selectedIds) {
  const before = S.data.stock; let stock = before.map(s => ({ ...s }));
  for (const [id, q, u] of scaleIngredients(r, serv)) {
    if (!selectedIds.includes(id)) continue; if (S.kb.isPantry(id)) continue;
    stock = consumeRow(stock, id, q, u).stock;
  }
  set('stock', stock);
  const after = new Map(stock.map(s => [s.id, s.qty]));
  return before.map(b => ({ ...b, qty: round(b.qty - (after.get(b.id) || 0), 3) })).filter(x => x.qty > 1e-6); // ce qui a été retiré, lot par lot
}
export function logCooked(r, serv, rating, extra = {}) {
  const entry = { id: uid(), rid: r.id, title: r.t, date: today(), serv, rating: rating || null, ...extra };
  mutate('history', h => [...h, entry]); if (rating) rate(r.id, rating); return entry;
}
export function markPlanDone(rid, ref) {
  const t = today(); const p = S.data.plan;
  const found = ref && p[ref.date] && p[ref.date][ref.slot] ? ref : (p[t] ? Object.keys(p[t]).filter(k => p[t][k].rid === rid && !p[t][k].done).map(slot => ({ date: t, slot }))[0] : null);
  if (!found) return null;
  mutate('plan', q => ({ ...q, [found.date]: { ...q[found.date], [found.slot]: { ...q[found.date][found.slot], done: true } } })); return found;
}
// annule un repas cuisiné : retire de l'historique, remet les ingrédients et enlève les restes
export function undoCooked(id, restoreStock = true) {
  const h = S.data.history.find(x => x.id === id); if (!h) return false;
  mutate('history', l => l.filter(x => x.id !== id));
  if (restoreStock && h.restore && h.restore.length) { let s = S.data.stock; for (const lot of h.restore) s = addOrMerge(s, { ing: lot.ing, name: lot.name, qty: lot.qty, unit: lot.unit, zone: lot.zone, expiry: lot.expiry, added: lot.added }); set('stock', s); }
  if (h.leftoverId) mutate('stock', s => s.filter(x => x.id !== h.leftoverId));
  if (h.planRef) mutate('plan', p => { const e = p[h.planRef.date] && p[h.planRef.date][h.planRef.slot]; return e ? { ...p, [h.planRef.date]: { ...p[h.planRef.date], [h.planRef.slot]: { ...e, done: false } } } : p; });
  return true;
}
export function addLeftovers(title, portions) {
  const name = `Reste : ${title}`; const before = new Set(S.data.stock.map(x => x.id));
  addStock({ name, ing: null, qty: portions, unit: 'portion', zone: 'frigo', expiry: addDays(today(), 3) });
  const lot = S.data.stock.find(x => !before.has(x.id) && x.name === name); return lot ? lot.id : null;
}
