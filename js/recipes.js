// Catalogue, recherche, couverture du stock et recommandations explicables (logique pure).
import { norm, daysBetween, clamp, round, hash } from './util.js';
import { toGrams, canonUnit } from './units.js';
import { available, status, lotsOf } from './stock.js';

// chaque appareil compte : une recette qui en demande un que tu n'as pas est grisée
const EQUIP_NEEDED = { plaques: 1, four: 1, 'micro-ondes': 1, mixeur: 1, air_fryer: 1, thermomix: 1, cookeo: 1, barbecue: 1, raclette: 1, gaufrier: 1 };
export const EQUIP = [['plaques', 'Plaques'], ['four', 'Four'], ['micro-ondes', 'Micro-ondes'], ['mixeur', 'Mixeur'], ['air_fryer', 'Air fryer'], ['thermomix', 'Thermomix'], ['cookeo', 'Cookeo'], ['barbecue', 'Barbecue'], ['raclette', 'Raclette'], ['gaufrier', 'Gaufrier']];
export const EQUIP_EMOJI = { plaques: '🔥', four: '♨️', 'micro-ondes': '⏲️', mixeur: '🥤', air_fryer: '🍟', thermomix: '🥣', cookeo: '🍲', barbecue: '🍖', raclette: '🧀', gaufrier: '🧇' };
export const equipName = k => (EQUIP.find(e => e[0] === k) || [k, k])[1];
// dans une phrase : « des plaques de cuisson », « un four », « un Thermomix », « un appareil à raclette »
const EQUIP_TXT = { plaques: ['des', 'plaques de cuisson'], four: ['un', 'four'], 'micro-ondes': ['un', 'micro-ondes'], mixeur: ['un', 'mixeur'], air_fryer: ['un', 'air fryer'], thermomix: ['un', 'Thermomix'], cookeo: ['un', 'Cookeo'], barbecue: ['un', 'barbecue'], raclette: ['un', 'appareil à raclette'], gaufrier: ['un', 'gaufrier'] };
export const equipText = k => (EQUIP_TXT[k] || ['', k])[1];
export const equipWithArticle = k => (EQUIP_TXT[k] || ['un', k]).join(' ');
const DEFAULT_EQ = new Set(['plaques', 'four', 'micro-ondes']), EQ_SET = new WeakMap();
const equipSet = prefs => { const l = prefs && prefs.equip; if (!l) return DEFAULT_EQ; let s = EQ_SET.get(l); if (!s) { s = new Set(l); EQ_SET.set(l, s); } return s; };
// un appareil qu'on n'a pas peut souvent être remplacé : un burger au barbecue se fait aussi à la poêle, des frites au air fryer au four…
// chaque remplacement est une liste d'appareils à avoir ensemble ; la recette peut préciser les siens (r.x, ex. four → air fryer si le plat tient dans le panier)
const ALT = { air_fryer: [['four']], cookeo: [['plaques']], thermomix: [['plaques', 'mixeur']], 'micro-ondes': [['plaques'], ['four']], mixeur: [['thermomix']], barbecue: [['plaques'], ['four']], raclette: [['four']] };
const altsOf = (r, k) => (r.x && r.x[k]) || ALT[k] || [];
// comment faire sans l'appareil prévu, avec celui qu'on a (affiché dans la recette et le mode cuisine)
const SWAP_TIP = {
  'four>air_fryer': 'Sans four, au air fryer : baisse la température de 20 °C et compte environ 20 % de temps en moins, dans un plat qui tient dans le panier. Surveille la fin de cuisson.',
  'air_fryer>four': 'Sans air fryer, au four : même température en chaleur tournante (20 °C de plus sinon), sur une plaque, en une seule couche. Compte environ 1,5 fois le temps et retourne à mi-cuisson.',
  'cookeo>plaques': 'Sans Cookeo, dans une cocotte sur les plaques : « Dorer » = faire revenir à feu vif ; la cuisson sous pression devient une cuisson à couvert à feu doux, environ 3 fois plus longue (riz 15 à 18 min, pâtes : le temps du paquet, poulet 30 min, bœuf 2 h à 2 h 30). Ajoute un peu de liquide si ça attache.',
  'thermomix>plaques': 'Sans Thermomix : hache au couteau, fais revenir dans une casserole, puis cuis à feu doux en remuant souvent, avec les mêmes temps.',
  'thermomix>plaques+mixeur': 'Sans Thermomix : hache au couteau, fais revenir dans une casserole, cuis à feu doux en remuant (mêmes temps), puis passe au mixeur quand la recette dit de mixer.',
  'thermomix>mixeur': 'Sans Thermomix : tout se fait au mixeur, en mixant 1 à 2 min jusqu’à ce que ce soit bien lisse.',
  'micro-ondes>plaques': 'Sans micro-ondes : à la casserole, à feu doux et à couvert, en remuant (un peu plus long).',
  'micro-ondes>four': 'Sans micro-ondes : au four à 180 °C, en comptant environ 3 fois le temps indiqué (vérifie la cuisson avec la pointe d’un couteau).',
  'mixeur>thermomix': 'Ton Thermomix fait le mixeur : 30 s à 1 min en montant progressivement jusqu’à la vitesse 10.',
  'barbecue>plaques': 'Sans barbecue : à la poêle-gril ou dans une poêle bien chaude, avec les mêmes temps de cuisson.',
  'barbecue>four': 'Sans barbecue : sous le grill du four, à 10 cm de la résistance, en retournant à mi-cuisson.',
  'raclette>four': 'Sans appareil à raclette : pose les tranches de fromage sur les pommes de terre dans un plat et fais gratiner 8 à 10 min sous le grill du four.',
};
// en deux mots, pour les cartes : « à la poêle », « en cocotte », « au four »
const SWAP_SHORT = { 'four>air_fryer': 'au air fryer', 'air_fryer>four': 'au four', 'cookeo>plaques': 'en cocotte', 'thermomix>plaques': 'en casserole', 'thermomix>plaques+mixeur': 'en casserole', 'thermomix>mixeur': 'au mixeur',
  'micro-ondes>plaques': 'en casserole', 'micro-ondes>four': 'au four', 'mixeur>thermomix': 'au Thermomix', 'barbecue>plaques': 'à la poêle', 'barbecue>four': 'au four', 'raclette>four': 'au four' };
export const swapLabel = (r, prefs) => { const s = r.custom ? null : equipPlan(r, prefs).swaps[0]; return s ? SWAP_SHORT[s.k + '>' + s.by.join('+')] || null : null; };
// pour une recette : les appareils vraiment manquants, et ceux qu'on remplace par ce qu'on a ({ k: 'four', by: ['air_fryer'] })
export function equipPlan(r, prefs) {
  const out = { missing: [], swaps: [] }; if (!r.e || !r.e.length) return out;
  const eq = equipSet(prefs);
  for (const k of r.e) {
    if (!EQUIP_NEEDED[k] || eq.has(k)) continue;
    const by = altsOf(r, k).find(set => set.every(a => eq.has(a)));
    if (by) out.swaps.push({ k, by, tip: SWAP_TIP[k + '>' + by.join('+')] || '' }); else out.missing.push(k);
  }
  return out;
}
// appareils qui manquent pour faire cette recette, même en remplaçant (four, mixeur…)
export function missingEquip(r, prefs) {
  if (!r.e || !r.e.length) return [];
  return equipPlan(r, prefs).missing;
}
// « Il faut un Thermomix ou un mixeur » : l'appareil prévu, ou ce qui le remplacerait (seulement ce qui manque encore)
export function lockText(r, prefs) {
  const eq = equipSet(prefs), miss = missingEquip(r, prefs);
  return 'Il faut ' + miss.map(k => [equipWithArticle(k), ...altsOf(r, k).map(set => set.filter(a => !eq.has(a)).map(equipWithArticle).join(' et ')).filter(Boolean)].join(' ou ')).join(', et ');
}

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
    return { ...r, i: ing, flags, veg, vegan, pork: flags.has('pork'), gluten: flags.has('gluten'), nuts: flags.has('nuts'), shell: flags.has('shell'),
      cost: round(cost, 2), costPer: round(cost / (r.s || 2), 2), costKnown, tags: [...tags], bal: balance(r, ing, kb), custom: !!r.custom };
  }
  get(id) { return this.byId.get(id); }
  // texte normalisé pour la recherche, calculé la première fois qu'on cherche
  textOf(r) { if (r.text === undefined) { r.text = norm([r.t, r.c, r.k, ...r.i.map(x => this.kb.name(x[0], x[0])), ...(r.g || []), ...(r.e || []).map(equipName)].join(' ')); r.titleN = norm(r.t); } return r.text; }
}

// indice d'équilibre INDICATIF (pas un Nutri-Score)
function balance(r, ing, kb) {
  if (r.c === 'Desserts') return { label: 'Gourmand', level: 0 };
  let veg = 0, prot = 0, starch = 0, rich = 0;
  for (const [id, q, u] of ing) {
    const k = kb.get(id); if (!k) continue; const g = (toGrams(k, q, u) || 0) * 2 / (r.s || 2); // ramené à 2 personnes
    if (['veg', 'leaf', 'fruit'].includes(k.role)) veg += g;
    else if (['meat', 'fish', 'egg', 'legume', 'tofu'].includes(k.role)) prot += g;
    else if (k.role === 'starch' || k.role === 'bread' || k.role === 'dough') starch += g;
    if (['cheese', 'fat'].includes(k.role) || id === 'creme' || id === 'lardons' || id === 'chorizo' || id === 'saucisses') rich += g;
  }
  let s = 30;
  if (veg >= 200) s += 28; else if (veg >= 100) s += 18; else if (veg > 0) s += 8;
  if (prot >= 150) s += 22; else if (prot > 0) s += 12;
  if (starch > 0) s += 8;
  if (rich > 150) s -= 15; else if (rich > 90) s -= 6;
  s = clamp(s, 0, 100);
  return s >= 70 ? { label: 'Équilibré', level: 2 } : s >= 48 ? { label: 'Correct', level: 1 } : { label: 'Gourmand', level: 0 };
}

// saison : produits de pleine saison / hors saison dans la recette, pour un mois donné (1-12)
function seasonOf(r, kb, month) {
  const inS = [], outS = [];
  for (const [id] of r.i) { const k = kb.get(id); if (!k || !k.season) continue; (k.season.includes(month) ? inS : outS).push(id); }
  return { inS, outS };
}
export const seasonal = (r, kb, month) => { const s = seasonOf(r, kb, month); return s.inS.length > 0 && s.outS.length === 0; };
export function scaleIngredients(r, servings) {
  const f = servings / (r.s || 2);
  return r.i.map(([id, q, u]) => [id, scaleQty(q * f, u), u]);
}
function scaleQty(v, u) { const c = canonUnit(u); if (c === 'g' || c === 'ml') return v >= 20 ? Math.round(v / 5) * 5 : Math.round(v); if (c === 'cl') return Math.round(v); return Math.round(v * 4) / 4; }

// couverture : pour chaque ingrédient -> full | partial | none | unknown | staple
// remplaçant de la même famille présent dans le stock (ex. Caprice des dieux pour de l'emmental)
export function findSub(stock, kb, id, needQty, unit, today) {
  const k = kb.get(id); if (!k) return null;
  const needG = toGrams(k, needQty, unit); let best = null;
  for (const sid of kb.subsOf(id)) {
    const ks = kb.get(sid), lots = lotsOf(stock, sid, { today }); if (!lots.length) continue;
    let haveG = 0, unknown = false;
    for (const l of lots) { const g = toGrams(ks, l.qty, l.unit); if (g == null) unknown = true; else haveG += g; }
    const cand = { id: sid, name: lots[0].name, lots, enough: needG == null || unknown || haveG + 1e-6 >= needG };
    if (cand.enough) return cand; if (!best) best = cand;
  }
  return null;
}
// couverture : pour chaque ingrédient -> full | partial | none | unknown | staple | sub (remplacé)
const COV = new WeakMap();
export function coverage(r, servings, stock, kb, today, opts = {}) {
  let memo = COV.get(stock); const mk = `${kb.pantryV || 0}|${today}`;
  if (!memo || memo.k !== mk) { memo = { k: mk, m: new Map() }; COV.set(stock, memo); }
  const key = r.id + '|' + servings + '|' + r.i.length; const hit = memo.m.get(key); if (hit) return hit;
  const res = coverageRaw(r, servings, stock, kb, today); memo.m.set(key, res); return res;
}
function coverageRaw(r, servings, stock, kb, today) {
  const rows = [];
  for (const [id, q, u] of scaleIngredients(r, servings)) {
    const k = kb.get(id);
    const need = { qty: q, unit: u };
    if (kb.isPantry(id)) { rows.push({ id, need, state: 'staple', expiring: false }); continue; }
    const a = available(stock, k, id, u, today);
    let state, missing = null, expiring = false, sub = null, lots = a.lots;
    if (!a.present) { state = 'none'; missing = need; }
    else if (!a.known && a.have <= 0) state = 'unknown';
    else if (a.have + 1e-6 >= q) state = 'full';
    else { state = 'partial'; missing = { qty: round(q - a.have, 3), unit: u }; }
    if (state === 'none' || state === 'partial') {
      const s = findSub(stock, kb, id, state === 'none' ? q : q - a.have, u, today);
      if (s) { state = 'sub'; sub = { id: s.id, name: s.name }; missing = null; lots = [...lots, ...s.lots]; }
    }
    for (const l of lots) { const st = status(l, today); if (st.key === 'urgent' || st.key === 'soon') expiring = st.days; }
    rows.push({ id, need, state, have: a.have, missing, sub, expiring: expiring === false ? false : expiring });
  }
  const real = rows.filter(x => x.state !== 'staple');
  const ok = real.filter(x => x.state === 'full' || x.state === 'unknown').length, subs = real.filter(x => x.state === 'sub').length;
  const missing = real.filter(x => x.state === 'none' || x.state === 'partial');
  return { rows, ratio: real.length ? (ok + subs * 0.75) / real.length : 1, missing, ok: ok + subs, subs, total: real.length, all: missing.length === 0, expiringUsed: real.filter(x => x.expiring !== false && x.state !== 'none') };
}

// listes de goûts normalisées une fois (mêmes tableaux d'un rendu à l'autre), noms d'ingrédients normalisés une fois
const NL = new WeakMap(), EMPTY = [];
const normList = l => { if (!l || !l.length) return EMPTY; let x = NL.get(l); if (!x) { x = l.map(norm).filter(Boolean); NL.set(l, x); } return x; };
const NAMES = new WeakMap();
const nameN = (kb, id) => { let m = NAMES.get(kb); if (!m) { m = new Map(); NAMES.set(kb, m); } let n = m.get(id); if (n === undefined) { n = norm(kb.name(id, id)); m.set(id, n); } return n; };
// dernière date où chaque recette a été cuisinée (recalculé seulement quand l'historique change)
const LAST = new WeakMap();
const lastCooked = history => { let m = LAST.get(history); if (!m) { m = new Map(); for (const x of history) if (!m.has(x.rid) || x.date > m.get(x.rid)) m.set(x.rid, x.date); LAST.set(history, m); } return m; };
// filtres durs : régime, aliments évités, équipement
// la recette respecte-t-elle le régime, les allergies, les goûts… et l'équipement (sauf si ignoreEquip) ?
export function allowed(r, prefs, kb, ignoreEquip = false) {
  const p = prefs || {};
  if (p.diet === 'veg' && !r.veg) return false;
  if (p.diet === 'vegan' && !r.vegan) return false;
  if (p.diet === 'pesco' && r.flags.has('meat')) return false;
  if (p.noPork && r.pork) return false;
  if (p.noGluten && r.gluten) return false;
  if (p.noNuts && r.nuts) return false;
  if (p.noShell && r.shell) return false;
  const bad = normList(p.dislikes);
  if (bad.length && r.i.some(([id]) => { const n = nameN(kb, id); return bad.some(b => n.includes(b) || b.includes(n) || id === b); })) return false;
  if (bad.includes('epice') && (r.g || []).includes('épicé')) return false;
  return ignoreEquip || !missingEquip(r, p).length;
}

// score + raisons ; ctx = { stock, prefs, history, fav, ratings, today, kb, habits }
// mémorisé tant que rien ne change (mêmes stock, réglages, historique… : l'état n'est jamais modifié sur place)
const SC = { deps: [], m: new Map() };
export function score(r, servings, ctx) {
  const deps = [ctx.stock, ctx.prefs, ctx.history, ctx.fav, ctx.ratings, ctx.today, ctx.habits, ctx.kb, ctx.kb && ctx.kb.pantryV];
  if (deps.some((d, i) => d !== SC.deps[i])) { SC.deps = deps; SC.m = new Map(); }
  let byR = SC.m.get(servings); if (!byR) { byR = new WeakMap(); SC.m.set(servings, byR); }
  let res = byR.get(r); if (!res) { res = scoreRaw(r, servings, ctx); byR.set(r, res); }
  return res;
}
function scoreRaw(r, servings, ctx) {
  const { stock, prefs = {}, history = [], fav = [], ratings = {}, today, kb } = ctx;
  const cov = coverage(r, servings, stock, kb, today);
  let s = 0; const why = [];
  s += cov.ratio * 60;
  if (cov.all && cov.total > 0) why.push([cov.subs ? `Tu as tout, avec ${cov.subs} remplacement${cov.subs > 1 ? 's' : ''}` : 'Tu as tous les ingrédients', 3]);
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
  const last = lastCooked(history).get(r.id);
  if (last) { const d = daysBetween(last, today); if (d < 7) { s -= 28; } else if (d < 14) s -= 12; else if (d > 28 && (rt || 0) >= 4) { s += 4; why.push(['Pas cuisinée depuis un moment', 1]); } }
  const likes = normList(prefs.likes);
  if (likes.length) { const n = r.i.filter(([id]) => likes.some(l => nameN(kb, id).includes(l))).length; if (n) { s += Math.min(12, n * 4); why.push(['Contient des aliments que tu aimes', 1]); } }
  if (prefs.budget && r.costKnown) { const perMeal = prefs.budget / Math.max(1, (prefs.people || 2) * 7 / 2 * 1.4); if (r.costPer * (prefs.people || 2) > perMeal * 1.6) s -= 8; }
  const hb = ctx.habits;
  if (hb && hb.n >= 3) {
    const cw = (hb.cats.get(r.c) || 0) / hb.n; if (cw > 0.2) { s += Math.min(10, cw * 25); why.push([`Proche de ce que tu cuisines souvent`, 1]); }
    let iw = 0; for (const [id] of r.i) iw += (hb.ings.get(id) || 0) / hb.n; s += Math.min(8, iw * 4);
  }
  if (hb && hb.skips[r.id]) s -= hb.skips[r.id] * 5;
  const month = parseInt(today.slice(5, 7)), ss = seasonOf(r, kb, month);
  if (ss.inS.length) { s += Math.min(6, ss.inS.length * 3); if (!ss.outS.length) why.push(['De saison', 1]); }
  const outMissing = ss.outS.filter(id => !cov.rows.some(x => x.id === id && x.state !== 'none')); s -= outMissing.length * 5;
  if (r.o === 'classique') s += 3;
  s += (hash(r.id + today) % 100) / 50; // petit aléa stable dans la journée pour varier
  return { score: s, why: why.sort((a, b) => b[1] - a[1]).map(x => x[0]).slice(0, 3), cov };
}

export function search(cat, query) {
  const t = norm(query).split(' ').filter(Boolean);
  if (!t.length) return cat.list.slice();
  const out = [];
  for (const r of cat.list) {
    const text = cat.textOf(r); if (!t.every(w => text.includes(w))) continue;
    let s = 0; for (const w of t) { if (r.titleN.startsWith(w)) s += 3; else if (r.titleN.includes(w)) s += 2; else s += 1; }
    out.push([s, r]);
  }
  return out.sort((a, b) => b[0] - a[0] || a[1].m - b[1].m).map(x => x[1]);
}

// ---------- moments du repas et familles de cuisine (filtres de l'onglet Recettes) ----------
export const MOMENTS = [['all', '🍽️', 'Tout'], ['plat', '🍲', 'Plats'], ['entree', '🥗', 'Entrées'], ['apero', '🫒', 'Apéro'], ['dessert', '🍰', 'Desserts'], ['matin', '🥐', 'P’tit déj']];
export function inMoment(r, m) {
  const mt = r.mt || [];
  if (m === 'plat') return mt.some(x => x === 'Déjeuner' || x === 'Dîner') && r.c !== 'Desserts' && r.c !== 'Petit-déjeuner';
  if (m === 'entree') return mt.includes('Entrée');
  if (m === 'apero') return mt.includes('Apéritif');
  if (m === 'dessert') return r.c === 'Desserts' || mt.includes('Dessert');
  if (m === 'matin') return mt.includes('Petit-déjeuner') || r.c === 'Petit-déjeuner';
  return true;
}
const FAM = {
  france: ['Française', 'Provençale', 'Savoyarde', 'Bretonne', 'Basque', 'Alsacienne', 'Lyonnaise', 'Niçoise', 'Bourguignonne', 'Limousine', 'Périgourdine', 'Normande', 'Picarde', 'Auvergnate', 'Sud-Ouest', 'Lorraine'],
  italie: ['Italienne'],
  medit: ['Méditerranéenne', 'Orientale', 'Grecque', 'Marocaine', 'Turque', 'Libanaise', 'Espagnole', 'Maghrébine'],
  asie: ['Asiatique', 'Japonaise', 'Thaïlandaise', 'Chinoise', 'Vietnamienne', 'Indonésienne', 'Coréenne', 'Cambodgienne'],
  inde: ['Indienne'],
  ameriques: ['Américaine', 'Mexicaine', 'Tex-Mex', 'Argentine', 'Québécoise', 'Péruvienne', 'Brésilienne', 'Latino-américaine'],
};
const FAM_OF = new Map(Object.entries(FAM).flatMap(([f, l]) => l.map(k => [k, f])));
export const CUISINES = [['france', '🥖 France'], ['italie', '🍕 Italie'], ['medit', '🫒 Méditerranée et Orient'], ['asie', '🥢 Asie'], ['inde', '🍛 Inde'], ['ameriques', '🌮 Amériques'], ['ailleurs', '🌍 Ailleurs']];
export const cuisineFamily = r => (!r.k ? 'france' : FAM_OF.get(r.k) || 'ailleurs');
