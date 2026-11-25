// Apprentissage des habitudes (100 % sur le téléphone) : produits, achats, recettes passées, repas libres récurrents.
import { S, mutate } from './state.js';
import { norm, todayISO, daysBetween, parseISO } from './util.js';

const memo = () => S.data.memo || { products: {}, skips: {}, bought: [] };
const save = fn => mutate('memo', m => fn({ products: {}, skips: {}, bought: [], ...(m || {}) }));

// ---------- produits : quantité, unité, zone, conservation, prix, association ----------
export function learnProduct(name, data) {
  const k = norm(name); if (!k) return;
  save(m => { const p = m.products[k] || { count: 0 }; m.products = { ...m.products, [k]: { ...p, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v != null && v !== '')), name: String(name).trim(), count: (p.count || 0) + 1, last: todayISO() } }; return m; });
}
export function productMemo(name) { return memo().products[norm(name)] || null; }

// ---------- achats ----------
export function learnBought(items) {
  if (!items.length) return; const d = todayISO();
  save(m => { m.bought = [...(m.bought || []), ...items.map(x => ({ n: x.name, ing: x.ing || null, d, qty: x.qty || null, unit: x.unit || null, price: x.price || null }))].slice(-400); return m; });
  for (const x of items) if (x.price > 0) learnProduct(x.name, { price: x.price });
}
// produits achetés au moins 2 fois ces 60 derniers jours, absents de la liste et du stock
export function habitualProducts(limit = 8) {
  const t = todayISO(), groups = new Map();
  for (const b of memo().bought || []) { if (daysBetween(b.d, t) > 60) continue; const k = norm(b.n); const g = groups.get(k) || { name: b.n, ing: b.ing, n: 0, last: b }; g.n++; g.last = b; groups.set(k, g); }
  const inList = new Set(S.data.shop.filter(x => !x.done).map(x => norm(x.name)));
  const inStock = new Set(S.data.stock.map(x => norm(x.name)));
  return [...groups.entries()].filter(([k, g]) => g.n >= 2 && !inList.has(k) && !inStock.has(k)).sort((a, b) => b[1].n - a[1].n).slice(0, limit)
    .map(([, g]) => ({ name: g.name, ing: g.ing, qty: g.last.qty, unit: g.last.unit, price: (productMemo(g.name) || {}).price || null, times: g.n }));
}

// ---------- recettes ----------
export function learnSkip(rid) { save(m => { m.skips = { ...(m.skips || {}), [rid]: Math.min(5, ((m.skips || {})[rid] || 0) + 1) }; return m; }); }
let cache = { key: '', val: null };
// affinités calculées à partir des repas cuisinés (les plus récents comptent plus)
export function affinity() {
  const h = S.data.history, key = h.length + ':' + (h[h.length - 1] || {}).id + ':' + Object.keys(memo().skips || {}).length;
  if (cache.key === key) return cache.val;
  const t = todayISO(), cats = new Map(), ings = new Map(); let n = 0;
  for (const e of h) {
    const r = S.cat.get(e.rid); if (!r) continue; const age = Math.max(0, daysBetween(e.date, t)); const w = age > 90 ? 0.3 : age > 30 ? 0.6 : 1; n += w;
    cats.set(r.c, (cats.get(r.c) || 0) + w * (e.rating ? e.rating / 3 : 1));
    for (const [id] of r.i) { const k = S.kb.get(id); if (k && !S.kb.isPantry(id)) ings.set(id, (ings.get(id) || 0) + w); }
  }
  cache = { key, val: { cats, ings, n, skips: memo().skips || {} } }; return cache.val;
}

// ---------- semaine : repas libres récurrents (ex. « Restaurant » le vendredi soir) ----------
export function freePattern() {
  const t = todayISO(), counts = new Map();
  for (const [d, slots] of Object.entries(S.data.plan)) {
    const age = daysBetween(d, t); if (age <= 0 || age > 35) continue;
    const wd = (parseISO(d).getDay() + 6) % 7;
    for (const [slot, e] of Object.entries(slots)) if (e && e.note) { const k = `${wd}-${slot}`, nk = norm(e.note); const m = counts.get(k) || new Map(); const c = m.get(nk) || { note: e.note, n: 0 }; c.n++; m.set(nk, c); counts.set(k, m); }
  }
  const out = new Map();
  for (const [k, m] of counts) { const best = [...m.values()].sort((a, b) => b.n - a.n)[0]; if (best && best.n >= 2) out.set(k, best.note); }
  return out;
}

export function learnedSummary() {
  const a = affinity(), m = memo();
  return {
    products: Object.values(m.products || {}).filter(p => p.count >= 2).sort((x, y) => y.count - x.count).slice(0, 8),
    habitual: habitualProducts(8),
    cats: [...a.cats.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3).map(x => x[0]),
    free: [...freePattern().entries()],
  };
}
export function forgetAll() { mutate('memo', () => ({ products: {}, skips: {}, bought: [] })); cache = { key: '', val: null }; }
