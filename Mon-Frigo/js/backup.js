// Validation / fusion / remplacement des sauvegardes JSON (logique pure).
import { uid } from './util.js';

const ARR = ['stock', 'shop', 'history', 'waste', 'custom', 'customIng', 'fav'];
export function validate(obj) {
  const errors = [];
  if (!obj || typeof obj !== 'object') return { ok: false, errors: ['Fichier illisible.'], counts: {} };
  if (obj.app !== 'mon-frigo') errors.push("Ce fichier n'est pas une sauvegarde Mon Frigo.");
  const d = obj.data; if (!d || typeof d !== 'object') errors.push('Aucune donnée dans le fichier.');
  else {
    for (const k of ARR) if (d[k] !== undefined && !Array.isArray(d[k])) errors.push(`« ${k} » est invalide.`);
    for (const k of ['plan', 'ratings', 'prefs', 'meta']) if (d[k] !== undefined && (typeof d[k] !== 'object' || Array.isArray(d[k]) || d[k] === null)) errors.push(`« ${k} » est invalide.`);
    for (const it of d.stock || []) if (!it || typeof it.name !== 'string' || !(Number(it.qty) >= 0)) { errors.push('Un produit du stock est invalide.'); break; }
  }
  const c = d || {};
  return { ok: !errors.length, errors, counts: { stock: (c.stock || []).length, shop: (c.shop || []).length, history: (c.history || []).length, custom: (c.custom || []).length, fav: (c.fav || []).length, plan: Object.keys(c.plan || {}).length } };
}
function unionById(a, b) {
  const ids = new Set(a.map(x => x.id)); const out = [...a];
  for (const x of b) { if (!x || typeof x !== 'object') continue; out.push(ids.has(x.id) && JSON.stringify(a.find(y => y.id === x.id)) !== JSON.stringify(x) ? { ...x, id: uid() } : x); if (!ids.has(x.id)) ids.add(x.id); }
  const seen = new Set(); return out.filter(x => { const k = x.id + JSON.stringify(x); if (seen.has(k)) return false; seen.add(k); return true; });
}
export function merge(cur, inc) {
  const out = { ...cur };
  for (const k of ['stock', 'shop', 'history', 'waste', 'custom', 'customIng']) out[k] = unionById(cur[k] || [], inc[k] || []);
  out.fav = [...new Set([...(cur.fav || []), ...(inc.fav || [])])];
  out.ratings = { ...(inc.ratings || {}), ...(cur.ratings || {}) };
  const plan = JSON.parse(JSON.stringify(cur.plan || {}));
  for (const [d, slots] of Object.entries(inc.plan || {})) for (const [s, e] of Object.entries(slots || {})) { plan[d] = plan[d] || {}; if (!plan[d][s]) plan[d][s] = e; }
  out.plan = plan;
  const p = cur.prefs || {}, q = inc.prefs || {}; const un = (a, b) => [...new Set([...(a || []), ...(b || [])])];
  out.prefs = { ...q, ...p, likes: un(p.likes, q.likes), dislikes: un(p.dislikes, q.dislikes), equip: un(p.equip, q.equip), outStaples: un(p.outStaples, q.outStaples) };
  out.meta = { ...(inc.meta || {}), ...(cur.meta || {}) };
  out.cook = cur.cook || inc.cook || null;
  return out;
}
export function normalize(inc, defaults) {
  const out = { ...defaults };
  for (const k of Object.keys(defaults)) if (inc[k] !== undefined && inc[k] !== null) out[k] = k === 'prefs' ? { ...defaults.prefs, ...inc[k] } : (k === 'meta' ? { ...defaults.meta, ...inc[k] } : inc[k]);
  return out;
}
