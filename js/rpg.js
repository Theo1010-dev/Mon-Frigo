// Profil façon jeu de rôle : niveau, titre, XP et succès.
// Tout vient de l'usage normal de l'app (cuisiner, sauver des produits, planifier, tenir son stock) :
// aucun objectif imposé, rien à faire « pour monter ». Un jour d'activité ne compte qu'une fois (pas de triche possible).
import { S, mutate } from './state.js';
import { daysBetween, todayISO, weekStart } from './util.js';

export const TITLES = [[1, 'Petit marmiton', '🥄'], [2, 'Commis', '🧅'], [3, 'Commis confirmé', '🔪'], [4, 'Cuisinier du dimanche', '🍳'], [5, 'Chef de partie', '🍲'],
  [7, 'Saucier', '🥘'], [9, 'Sous-chef', '🧑‍🍳'], [12, 'Chef de cuisine', '🥇'], [15, 'Chef étoilé', '⭐'], [20, 'Grand chef', '👑'], [25, 'Légende des fourneaux', '🏆']];
const TIERS = [[1, 'bronze', 'Bronze'], [5, 'silver', 'Argent'], [10, 'gold', 'Or'], [15, 'emerald', 'Émeraude']];
// XP total pour atteindre le niveau n : 0, 60, 180, 360, 600, 900… (environ 1 an d'usage régulier pour le niveau 25)
export const xpFor = n => n <= 1 ? 0 : Math.round(30 * (n - 1) * n);
const levelOf = xp => { let n = 1; while (xp >= xpFor(n + 1)) n++; return n; };
const titleOf = lvl => { let t = TITLES[0]; for (const x of TITLES) if (lvl >= x[0]) t = x; return { name: t[1], emoji: t[2] }; };
const tierOf = lvl => { let t = TIERS[0]; for (const x of TIERS) if (lvl >= x[0]) t = x; return { id: t[1], name: t[2] }; };
export const XP = { cook: 25, newRecipe: 10, rate: 3, saved: 8, activeDay: 5, receiptDay: 10, plannedWeek: 20, custom: 15, egg: 15, zeroWaste: 40 };

// ---------- journal d'activité (un jour actif ne compte qu'une fois) ----------
let pending = null;
export function bump(key, n = 1) {
  if (!pending) { pending = {}; queueMicrotask(flush); } // plusieurs ajouts d'un coup = une seule écriture
  pending[key] = (pending[key] || 0) + n;
}
function flush() {
  const add = pending; pending = null; const t = todayISO();
  mutate('meta', m => {
    const stats = { ...(m.stats || {}) }, act = { ...(m.act || {}) }, day = { ...(act[t] || {}) };
    const wasActive = !!(day.a || day.b || day.r || day.p), hadReceipt = !!day.r;
    for (const [k, v] of Object.entries(add)) { stats[k] = (stats[k] || 0) + v; const short = { added: 'a', bought: 'b', receipts: 'r', planned: 'p' }[k]; if (short) day[short] = (day[short] || 0) + v; }
    if (!wasActive && (day.a || day.b || day.r || day.p)) stats.activeDays = (stats.activeDays || 0) + 1;
    if (!hadReceipt && day.r) stats.receiptDays = (stats.receiptDays || 0) + 1;
    act[t] = day; for (const d of Object.keys(act)) if (daysBetween(d, t) > 70) delete act[d];
    return { ...m, stats, act };
  });
}

// les cuisines régionales françaises comptent comme « française » pour le succès Tour du monde
const FR = new Set(['Française', 'Provençale', 'Bretonne', 'Alsacienne', 'Lyonnaise', 'Basque', 'Niçoise', 'Bourguignonne', 'Limousine', 'Périgourdine', 'Normande', 'Sud-Ouest', 'Savoyarde', 'Lorraine', 'Picarde', 'Auvergnate']);
let memo = { key: null, val: null };
export function stats(d = S.data) {
  const t = todayISO();
  // recalcul seulement si l'une des données utilisées a changé (chaque modification crée un nouvel objet)
  const key = [t, d.history, d.plan, d.waste, d.custom, d.meta.stats, d.meta.act, d.meta.eggs, d.meta.secret];
  if (memo.key && memo.key.length === key.length && memo.key.every((x, i) => x === key[i])) return memo.val;
  const hist = d.history, cat = S.cat, kb = S.kb;
  const recipes = new Set(hist.map(x => x.rid)), cats = new Set(), cuisines = new Set(); let desserts = 0, seasonal = 0, breakfast = 0, saved = 0, veg = 0;
  for (const e of hist) {
    const r = cat.get(e.rid);
    if (r) { cats.add(r.c); if (r.k) cuisines.add(FR.has(r.k) ? 'Française' : r.k); if (r.c === 'Desserts') desserts++; if (r.c === 'Petit-déjeuner') breakfast++; if (r.veg) veg++;
      const mo = parseInt(e.date.slice(5, 7)); if (r.i.some(([id]) => { const k = kb.get(id); return k && k.season && k.season.includes(mo); })) seasonal++; }
    for (const l of e.restore || []) if (l.expiry && daysBetween(e.date, l.expiry) <= 2) saved++;
  }
  // série de cuisine (succès) et série d'activité (profil) : jours consécutifs, aujourd'hui ou hier inclus
  const run = days => { let best = 0, r = 0, prev = null; for (const dd of days) { r = prev && daysBetween(prev, dd) === 1 ? r + 1 : 1; best = Math.max(best, r); prev = dd; } return { best, current: prev && daysBetween(prev, t) <= 1 ? r : 0 }; };
  const cookDays = [...new Set(hist.map(x => x.date))].sort(), cookRun = run(cookDays);
  const actDays = [...new Set([...cookDays, ...Object.entries(d.meta.act || {}).filter(([, a]) => a.a || a.b || a.r || a.p).map(([k]) => k)])].sort(), actRun = run(actDays);
  // semaines bien planifiées (au moins 10 repas sur 14)
  const weeks = new Map(); for (const [date, slots] of Object.entries(d.plan)) { const w = weekStart(date); weeks.set(w, (weeks.get(w) || 0) + Object.values(slots).filter(Boolean).length); }
  const plannedWeeks = [...weeks.values()].filter(n => n >= 10).length;
  // mois terminés sans gaspillage avec au moins 8 repas cuisinés
  const byMonth = new Map(); for (const e of hist) byMonth.set(e.date.slice(0, 7), (byMonth.get(e.date.slice(0, 7)) || 0) + 1);
  const wasteMonths = new Set(d.waste.map(w => w.date.slice(0, 7)));
  const zeroWaste = [...byMonth.entries()].filter(([m, n]) => n >= 8 && !wasteMonths.has(m) && m < t.slice(0, 7)).length;
  const st = d.meta.stats || {}, rated = hist.filter(x => x.rating).length, eggs = (d.meta.eggs || []).length + (d.meta.secret ? 1 : 0);
  const v = { cooked: hist.length, recipes: recipes.size, cats: cats.size, cuisines: cuisines.size, desserts, breakfast, seasonal, saved, veg, best: cookRun.best, current: actRun.current, bestActive: actRun.best,
    plannedWeeks, zeroWaste, added: st.added || 0, receipts: st.receipts || 0, activeDays: st.activeDays || 0, receiptDays: st.receiptDays || 0, custom: d.custom.length, rated, eggs, fav: d.fav.length };
  v.xp = v.cooked * XP.cook + v.recipes * XP.newRecipe + v.rated * XP.rate + v.saved * XP.saved + v.activeDays * XP.activeDay + v.receiptDays * XP.receiptDay
    + v.plannedWeeks * XP.plannedWeek + v.custom * XP.custom + v.eggs * XP.egg + v.zeroWaste * XP.zeroWaste;
  v.level = levelOf(v.xp); v.title = titleOf(v.level); v.tier = tierOf(v.level); v.next = xpFor(v.level + 1); v.base = xpFor(v.level);
  memo = { key, val: v }; return v;
}
// succès : [id, emoji, nom, condition, aide]
export const BADGES = [
  ['first', '🍽️', 'Premier repas', s => s.cooked >= 1, 'Cuisine une recette'],
  ['toque', '🥄', 'Toque en herbe', s => s.cooked >= 10, '10 repas cuisinés'],
  ['bleu', '🎖️', 'Cordon bleu', s => s.cooked >= 50, '50 repas cuisinés'],
  ['brigade', '🏅', 'Chef de brigade', s => s.cooked >= 150, '150 repas cuisinés'],
  ['curious', '🧭', 'Curieux', s => s.recipes >= 10, '10 recettes différentes'],
  ['explorer', '🗺️', 'Grand explorateur', s => s.recipes >= 40, '40 recettes différentes'],
  ['world', '🌍', 'Tour du monde', s => s.cuisines >= 8, 'Des plats de 8 cuisines'],
  ['allround', '🎯', 'Touche-à-tout', s => s.cats >= 6, 'Des recettes de 6 familles'],
  ['saver', '♻️', 'Anti-gaspi', s => s.saved >= 5, '5 produits sauvés juste à temps'],
  ['hero', '🦸', 'Héros anti-gaspi', s => s.saved >= 25, '25 produits sauvés'],
  ['zero', '🌿', 'Mois zéro déchet', s => s.zeroWaste >= 1, 'Un mois entier sans rien jeter'],
  ['planner', '📅', 'Planificateur', s => s.plannedWeeks >= 1, 'Une semaine d’au moins 10 repas prévus'],
  ['organized', '🗂️', 'Bien organisé', s => s.plannedWeeks >= 4, '4 semaines bien planifiées'],
  ['streak3', '🔥', 'Sur sa lancée', s => s.best >= 3, 'Cuisiner 3 jours d’affilée'],
  ['streak7', '☄️', 'Inarrêtable', s => s.best >= 7, 'Cuisiner 7 jours d’affilée'],
  ['regular', '📆', 'Fidèle au poste', s => s.bestActive >= 7, 'Utiliser l’app 7 jours d’affilée'],
  ['pastry', '🧁', 'Pâtissier', s => s.desserts >= 5, '5 desserts cuisinés'],
  ['green', '🥦', 'Main verte', s => s.veg >= 10, '10 plats végétariens'],
  ['season', '🍂', 'Au rythme des saisons', s => s.seasonal >= 10, '10 repas avec des produits de saison'],
  ['receipt', '🧾', 'Ticket gagnant', s => s.receipts >= 1, 'Scanner un ticket de caisse'],
  ['pantry', '🧺', 'Garde-manger plein', s => s.added >= 30, '30 produits ajoutés au stock'],
  ['creator', '✍️', 'Créateur', s => s.custom >= 1, 'Créer ta propre recette'],
  ['critic', '⭐', 'Fin gourmet', s => s.rated >= 10, 'Noter 10 repas'],
  ['secret', '✨', 'Chercheur de secrets', s => s.eggs >= 3, 'Trouver 3 petits secrets cachés dans l’app'],
];
export const earned = s => BADGES.filter(b => b[3](s));
// progression de chaque succès (simple information) et familles pour l'affichage
export const BADGE_GOAL = { first: ['cooked', 1], toque: ['cooked', 10], bleu: ['cooked', 50], brigade: ['cooked', 150], curious: ['recipes', 10], explorer: ['recipes', 40], world: ['cuisines', 8], allround: ['cats', 6],
  saver: ['saved', 5], hero: ['saved', 25], zero: ['zeroWaste', 1], planner: ['plannedWeeks', 1], organized: ['plannedWeeks', 4], streak3: ['best', 3], streak7: ['best', 7], regular: ['bestActive', 7],
  pastry: ['desserts', 5], green: ['veg', 10], season: ['seasonal', 10], receipt: ['receipts', 1], pantry: ['added', 30], creator: ['custom', 1], critic: ['rated', 10], secret: ['eggs', 3] };
export const BADGE_GROUPS = [['🍳', 'En cuisine', ['first', 'toque', 'bleu', 'brigade', 'pastry', 'green', 'critic', 'creator']], ['🧭', 'Découvertes', ['curious', 'explorer', 'world', 'allround', 'season']],
  ['♻️', 'Anti-gaspi', ['saver', 'hero', 'zero']], ['🗂️', 'Organisation', ['planner', 'organized', 'receipt', 'pantry']], ['🔥', 'Régularité', ['streak3', 'streak7', 'regular']], ['✨', 'Secrets', ['secret']]];
// un succès obtenu reste acquis (même si un repas est annulé ensuite)
export const earnedIds = (s, d = S.data) => { const kept = new Set((d.meta && d.meta.badges) || []); return new Set(BADGES.filter(b => b[3](s) || kept.has(b[0])).map(b => b[0])); };
