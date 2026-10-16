// Catalogue, recherche, couverture du stock et recommandations explicables (logique pure).
import { norm, daysBetween, clamp, round, hash } from './util.js';
import { toGrams, convert, canonUnit } from './units.js';
import { available, status, matchKey } from './stock.js';

const EQUIP_NEEDED = { four: 'four', mixeur: 'mixeur', air_fryer: 'air_fryer', thermomix: 'thermomix' };
export const EQUIP = [['plaques', 'Plaques'], ['four', 'Four'], ['micro-ondes', 'Micro-ondes'], ['mixeur', 'Mixeur'], ['air_fryer', 'Air fryer'], ['thermomix', 'Thermomix']];

export class Catalogue {
  constructor(list, kb) { this.kb = kb; this.setList(list); }
  setList(list) {
    this.list = list.map(r => this.prepare(r));
    this.byId = new Map(this.list.map(r => [r.id, r]));
  }
  prepare(r) {
    const kb = this.kb; const ings = new Map();
    for (const [id, q, u] of r.i) { const k = ings.get(id); if (k && canonUnit(k[2]) === canonUnit(u)) k[1] += q; else ings.set(id + (k ? '#' + ings.size : ''), [id, q, u]); }
    const ing = [...ings.values()];
    const flags = new Set(); let cost = 0, costKnown = true;
    for (const [id, q, u] of ing) {
      const k = kb.get(id); if (!k) { costKnown = false; continue; }
      k.diet.forEach(d => flags.add(d));
      const g = toGrams(k, q, u); if (g != null) cost += g / 1000 * k.price; else costKnown = false;
    }
    const meat = flags.has('meat') || flags.has('fish') || flags.has('shell');
    const veg = !meat; const vegan = veg && !flags.has('dairy') && !flags.has('egg') && !ing.some(x => x[0] === 'miel');
    const tags = new Set(r.g || []); if (veg) tags.add('végétarien'); if (vegan) tags.add('végétalien');
    const text = norm([r.t, r.c, r.k, ...ing.map(x => kb.name(x[0], x[0])), ...(r.g || [])].join(' '));
    return { ...r, i: ing, flags, veg, vegan, pork: flags.has('pork'), gluten: flags.has('gluten'), nuts: flags.has('nuts'), shell: flags.has('shell'),
      cost: round(cost, 2), costPer: round(cost / (r.s || 2), 2), costKnown, tags: [...tags], text, titleN: norm(r.t), bal: balance(r, ing, kb), custom: !!r.custom };
  }
  get(id) { return this.byId.get(id); }
}

// indice d'équilibre INDICATIF (pas un Nutri-Score)
function balance(r, ing, kb) {
  if (r.c === 'Desserts') return { label: 'Gourmand', level: 0 };
  let veg = 0, prot = 0, starch = 0, rich = 0, tot = 0;
  for (const [id, q, u] of ing) {
    const k = kb.get(id); if (!k) continue; const g = toGrams(k, q, u) || 0;
    if (['veg', 'leaf', 'fruit'].includes(k.role)) veg += g;
    else if (['meat', 'fish', 'egg', 'legume', 'tofu'].includes(k.role)) prot += g;
    else if (k.role === 'starch' || k.role === 'bread' || k.role === 'dough') starch += g;
    if (['cheese', 'fat'].includes(k.role) || id === 'creme' || id === 'lardons' || id === 'chorizo' || id === 'saucisses') rich += g;
    tot += g;
  }
  let s = 30;
  if (veg >= 200) s += 28; else if (veg >= 100) s += 18; else if (veg > 0) s += 8;
  if (prot >= 150) s += 22; else if (prot > 0) s += 12;
  if (starch > 0) s += 8;
  if (rich > 150) s -= 15; else if (rich > 90) s -= 6;
  s = clamp(s, 0, 100);
  return s >= 70 ? { label: 'Équilibré', level: 2 } : s >= 48 ? { label: 'Correct', level: 1 } : { label: 'Gourmand', level: 0 };
}

export function scaleIngredients(r, servings) {
  const f = servings / (r.s || 2);
  return r.i.map(([id, q, u]) => [id, scaleQty(q * f, u), u]);
}
function scaleQty(v, u) { const c = canonUnit(u); if (c === 'g' || c === 'ml') return v >= 20 ? Math.round(v / 5) * 5 : Math.round(v); if (c === 'cl') return Math.round(v); return Math.round(v * 4) / 4; }

// couverture : pour chaque ingrédient -> full | partial | none | unknown | staple
export function coverage(r, servings, stock, kb, today, opts = {}) {
  const rows = [];
  for (const [id, q, u] of scaleIngredients(r, servings)) {
    const k = kb.get(id);
    const need = { qty: q, unit: u };
    if (k && k.staple && !(opts.outStaples || []).includes(id)) { rows.push({ id, need, state: 'staple', expiring: false }); continue; }
    const a = available(stock, k, id, u, today);
    let state, missing = null, expiring = false;
    if (!a.present) { state = 'none'; missing = need; }
    else if (!a.known && a.have <= 0) state = 'unknown';
    else if (a.have + 1e-6 >= q) state = 'full';
    else { state = 'partial'; missing = { qty: round(q - a.have, 3), unit: u }; }
    for (const l of a.lots) { const s = status(l, today); if (s.key === 'urgent' || s.key === 'soon') expiring = s.days; }
    rows.push({ id, need, state, have: a.have, missing, expiring: expiring === false ? false : expiring });
  }
  const real = rows.filter(x => x.state !== 'staple');
  const ok = real.filter(x => x.state === 'full' || x.state === 'unknown').length;
  const missing = real.filter(x => x.state === 'none' || x.state === 'partial');
  return { rows, ratio: real.length ? ok / real.length : 1, missing, ok, total: real.length, all: missing.length === 0, expiringUsed: real.filter(x => x.expiring !== false && x.state !== 'none') };
}

// filtres durs : régime, aliments évités, équipement
export function allowed(r, prefs, kb) {
  const p = prefs || {};
  if (p.diet === 'veg' && !r.veg) return false;
  if (p.diet === 'vegan' && !r.vegan) return false;
  if (p.diet === 'pesco' && r.flags.has('meat')) return false;
  if (p.noPork && r.pork) return false;
  if (p.noGluten && r.gluten) return false;
  if (p.noNuts && r.nuts) return false;
  if (p.noShell && r.shell) return false;
  const bad = (p.dislikes || []).map(norm).filter(Boolean);
  if (bad.length && r.i.some(([id]) => { const n = norm(kb.name(id, id)); return bad.some(b => n.includes(b) || b.includes(n) || id === b); })) return false;
  const eq = new Set(p.equip || ['plaques', 'four']);
  for (const e of r.e || []) if (EQUIP_NEEDED[e] && !eq.has(e)) return false;
  return true;
}

// score + raisons ; ctx = { stock, prefs, history, fav, ratings, today, kb }
export function score(r, servings, ctx) {
  const { stock, prefs = {}, history = [], fav = [], ratings = {}, today, kb } = ctx;
  const cov = coverage(r, servings, stock, kb, today, { outStaples: prefs.outStaples });
  let s = 0; const why = [];
  s += cov.ratio * 60;
  if (cov.all && cov.total > 0) why.push(['Tu as tous les ingrédients', 3]);
  else if (cov.missing.length === 1) why.push(['Il te manque 1 ingrédient', 2]);
  else if (cov.ratio >= 0.6) why.push([`Tu as déjà ${cov.ok} ingrédient${cov.ok > 1 ? 's' : ''} sur ${cov.total}`, 1]);
  const exp = cov.expiringUsed;
  if (exp.length) {
    const urgent = exp.some(x => x.expiring <= 1);
    s += Math.min(34, exp.length * 11 + (urgent ? 12 : 0));
    const first = exp.slice().sort((a, b) => a.expiring - b.expiring)[0];
    const kf = kb.get(first.id), nmf = kb.name(first.id, first.id).toLowerCase(), art = !kf ? '' : kf.g.endsWith('p') ? 'les ' : /^[aeiouyhéèêàâîôûœ]/i.test(nmf) && !kf.hasp ? "l'" : kf.g === 'f' ? 'la ' : 'le ';
    why.push([`Utilise ${art}${nmf} qui ${(kf && kf.g.endsWith('p') ? (first.expiring <= 0 ? "expirent aujourd'hui" : first.expiring === 1 ? 'expirent demain' : 'expirent bientôt') : (first.expiring <= 0 ? "expire aujourd'hui" : first.expiring === 1 ? 'expire demain' : 'expire bientôt'))}`, 4]);
  }
  if (r.m <= 20) { s += 8; why.push([`Rapide (${r.m} min)`, 1]); } else if (r.m <= 30) s += 4; else if (r.m > 75) s -= 6;
  if (prefs.maxTime && r.m > prefs.maxTime) s -= 12;
  if (fav.includes(r.id)) { s += 10; why.push(['Dans tes favoris', 2]); }
  const rt = ratings[r.id]; if (rt) { s += (rt - 3) * 6; if (rt >= 4) why.push([`Tu l'as notée ${rt}/5`, 2]); }
  const last = history.filter(h => h.rid === r.id).map(h => h.date).sort().pop();
  if (last) { const d = daysBetween(last, today); if (d < 7) { s -= 28; } else if (d < 14) s -= 12; else if (d > 28 && (rt || 0) >= 4) { s += 4; why.push(['Pas cuisinée depuis un moment', 1]); } }
  const likes = (prefs.likes || []).map(norm).filter(Boolean);
  if (likes.length) { const n = r.i.filter(([id]) => likes.some(l => norm(kb.name(id, id)).includes(l))).length; if (n) { s += Math.min(12, n * 4); why.push(['Contient des aliments que tu aimes', 1]); } }
  if (prefs.budget && r.costKnown) { const perMeal = prefs.budget / Math.max(1, (prefs.people || 2) * 7 / 2 * 1.4); if (r.costPer * (prefs.people || 2) > perMeal * 1.6) s -= 8; }
  if (r.o === 'classique') s += 3;
  s += (hash(r.id + today) % 100) / 50; // petit aléa stable dans la journée pour varier
  return { score: s, why: why.sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 3), cov };
}

export function search(cat, query) {
  const t = norm(query).split(' ').filter(Boolean);
  if (!t.length) return cat.list.slice();
  const out = [];
  for (const r of cat.list) {
    if (!t.every(w => r.text.includes(w))) continue;
    let s = 0; for (const w of t) { if (r.titleN.startsWith(w)) s += 3; else if (r.titleN.includes(w)) s += 2; else s += 1; }
    out.push([s, r]);
  }
  return out.sort((a, b) => b[0] - a[0] || a[1].m - b[1].m).map(x => x[1]);
}
