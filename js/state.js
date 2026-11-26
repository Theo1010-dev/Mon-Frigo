// État global : données utilisateur persistées + catalogue + base d'ingrédients.
import { kb, loadKB, DEFAULT_PANTRY } from './kb.js';
import { Catalogue } from './recipes.js';
import * as db from './db.js';
import { todayISO, norm } from './util.js';
import { TYPES, guessType } from './types.js';

export const VERSION = '1.17.0';
// Version en ligne : tous les fichiers à plat (aucun dossier à envoyer sur GitHub). Code source : dossiers assets/ et data/.
const BUILT = typeof __BUILD__ !== 'undefined';
export const asset = f => (BUILT ? '' : 'assets/') + f;
const DATA_BASES = BUILT ? ['', 'data/'] : ['data/', ''];
export const DEFAULT_PREFS = { people: 2, budget: 60, equip: ['plaques', 'four', 'micro-ondes'], likes: [], dislikes: [], diet: 'omni', noPork: false, noGluten: false, noNuts: false, noShell: false, theme: 'auto', onboarded: false, outStaples: [], notify: false, pantry: null, stockSort: 'zone', season: 'auto', motion: true, name: '' };
const DEFAULTS = () => ({ stock: [], shop: [], plan: {}, fav: [], ratings: {}, history: [], waste: [], prefs: { ...DEFAULT_PREFS }, custom: [], customIng: [], cook: null, memo: { products: {}, skips: {}, bought: [] }, meta: { created: todayISO(), lastBackup: null, flagged: [] } });
export const KEYS = Object.keys(DEFAULTS());

export const S = { data: DEFAULTS(), cat: null, kb, ready: false };
const subs = new Set(); let queued = false;
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
function emit() { if (queued) return; queued = true; queueMicrotask(() => { queued = false; subs.forEach(f => f()); }); }

async function getJSON(name) {
  let detail = '';
  for (const base of DATA_BASES) {
    try { const r = await fetch(`${base}${name}?v=${VERSION}`); if (r.ok) return await r.json(); detail = `erreur ${r.status}`; }
    catch (e) { detail = navigator.onLine === false ? 'hors ligne' : String(e.message || e); }
  }
  const err = new Error(`Fichier introuvable : ${name} (${detail})`); err.missing = name; err.offline = detail === 'hors ligne'; throw err;
}
export async function init() {
  const [ings, recs, saved] = await Promise.all([
    getJSON('ingredients.json'), getJSON('recipes.json'), db.loadAll()]);
  loadKB(ings);
  const d = DEFAULTS();
  for (const k of KEYS) if (saved[k] !== undefined) d[k] = k === 'prefs' ? { ...DEFAULT_PREFS, ...saved[k] } : (k === 'meta' ? { ...d.meta, ...saved[k] } : saved[k]);
  S.data = d;
  for (const ci of d.customIng) kb.add(ci);
  if (relinkCustom(d)) for (const k of ['customIng', 'stock', 'shop']) db.put(k, d[k]);
  // 1.13.2 : les plaques et le micro-ondes comptent désormais ; on garde exactement ce qui était proposé avant (une seule fois)
  if (!d.meta.equip6) { if (!(d.prefs.equip || []).includes('plaques')) d.prefs.equip = ['plaques', ...(d.prefs.equip || [])]; d.meta.equip6 = true; db.put('prefs', d.prefs); db.put('meta', d.meta); }
  if (!Array.isArray(d.prefs.pantry)) { d.prefs.pantry = DEFAULT_PANTRY.filter(x => x !== 'eau' && !(d.prefs.outStaples || []).includes(x)); db.put('prefs', d.prefs); }
  kb.setPantry(d.prefs.pantry);
  S.cat = new Catalogue([...recs, ...d.custom], kb);
  S.ready = true;
  db.requestPersistence();
  return S;
}
export function set(key, value) { S.data[key] = value; db.put(key, value); emit(); }
export function mutate(key, fn) { set(key, fn(S.data[key])); }
export function setPref(patch) { if (patch.pantry) kb.setPantry(patch.pantry); set('prefs', { ...S.data.prefs, ...patch }); }
let habitsProvider = null; export function setHabitsProvider(f) { habitsProvider = f; }
export const ctx = () => ({ stock: S.data.stock, prefs: S.data.prefs, history: S.data.history, fav: S.data.fav, ratings: S.data.ratings, today: todayISO(), kb, habits: habitsProvider ? habitsProvider() : null });

// trouve ou crée un ingrédient pour un nom libre (pour que stock, courses et recettes restent cohérents)
function customItem(cid, name, type) {
  const t = TYPES[type] || TYPES.autre;
  return { id: cid, n: name[0].toUpperCase() + name.slice(1), al: [], cat: t.cat, zone: t.zone, role: t.role, q2: 1, u: 'pièce', life: t.life, price: 0, staple: false, liquid: false, g: 'm', hasp: false, units: { ...t.units }, dens: 1, diet: t.diet.slice(), emoji: t.emoji, sub: t.sub, type, custom: true };
}
// trouve ou crée un ingrédient pour un nom libre. type : forcer un type de produit inconnu (fromage, charcuterie…)
export function ensureIng(name, type) {
  const clean = String(name || '').trim(); if (!clean) return null;
  if (!type) { const id = kb.resolve(clean); if (id) return id; }
  const cid = 'c-' + norm(clean).replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  const ty = type || guessType(clean), cur = kb.get(cid);
  if (!cur) { const item = customItem(cid, clean, ty); kb.add(item); mutate('customIng', a => [...a.filter(x => x.id !== cid), item]); }
  else if (cur.type !== ty) { const item = customItem(cid, cur.n, ty); Object.assign(cur, item); mutate('customIng', a => a.map(x => x.id === cid ? item : x)); }
  return cid;
}
// au démarrage : relie à la base les produits qu'une ancienne version ne connaissait pas, et type les autres
function relinkCustom(d) {
  let changed = false;
  d.customIng = d.customIng.map(ci => { if (ci.type) return ci; changed = true; const item = customItem(ci.id, ci.n, guessType(ci.n)); const k = kb.get(ci.id); if (k) Object.assign(k, item); return item; });
  const fix = it => { if (it.ing && it.ing.startsWith('c-')) { const r = kb.resolve(it.name); if (r && !kb.get(r).custom) { changed = true; return { ...it, ing: r }; } } return it; };
  d.stock = d.stock.map(fix); d.shop = d.shop.map(fix);
  return changed;
}
export function rebuildCatalogue() {
  const recs = S.cat.list.filter(r => !r.custom).map(r => { return { id: r.id, t: r.t, c: r.c, d: r.d, m: r.m, s: r.s, e: r.e, g: r.g, k: r.k, mt: r.mt, i: r.i, p: r.p, o: r.o }; });
  S.cat.setList([...recs, ...S.data.custom]);
}
export function exportAll() {
  return { app: 'mon-frigo', version: VERSION, exported: new Date().toISOString(), data: Object.fromEntries(KEYS.map(k => [k, S.data[k]])) };
}
export async function resetAll() { await db.clearAll(); S.data = DEFAULTS(); S.cat.setList(S.cat.list.filter(r => !r.custom).map(r => ({ id: r.id, t: r.t, c: r.c, d: r.d, m: r.m, s: r.s, e: r.e, g: r.g, k: r.k, mt: r.mt, i: r.i, p: r.p, o: r.o }))); emit(); }
export { db, kb };
