// État global : données utilisateur persistées + catalogue + base d'ingrédients.
import { kb, loadKB } from './kb.js';
import { Catalogue } from './recipes.js';
import * as db from './db.js';
import { todayISO, norm, uid } from './util.js';

export const VERSION = '1.1.0';
export const DEFAULT_PREFS = { people: 2, budget: 60, equip: ['plaques', 'four', 'micro-ondes'], likes: [], dislikes: [], diet: 'omni', noPork: false, noGluten: false, noNuts: false, noShell: false, theme: 'auto', onboarded: false, outStaples: [] };
const DEFAULTS = () => ({ stock: [], shop: [], plan: {}, fav: [], ratings: {}, history: [], waste: [], prefs: { ...DEFAULT_PREFS }, custom: [], customIng: [], cook: null, meta: { created: todayISO(), lastBackup: null, flagged: [] } });
export const KEYS = Object.keys(DEFAULTS());

export const S = { data: DEFAULTS(), cat: null, kb, ready: false };
const subs = new Set(); let queued = false;
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
export function emit() { if (queued) return; queued = true; queueMicrotask(() => { queued = false; subs.forEach(f => f()); }); }

export async function init() {
  const [ings, recs, saved] = await Promise.all([
    fetch('data/ingredients.json').then(r => r.json()), fetch('data/recipes.json').then(r => r.json()), db.loadAll()]);
  loadKB(ings);
  const d = DEFAULTS();
  for (const k of KEYS) if (saved[k] !== undefined) d[k] = k === 'prefs' ? { ...DEFAULT_PREFS, ...saved[k] } : (k === 'meta' ? { ...d.meta, ...saved[k] } : saved[k]);
  S.data = d;
  for (const ci of d.customIng) kb.add(ci);
  S.cat = new Catalogue([...recs, ...d.custom], kb);
  S.ready = true;
  db.requestPersistence();
  return S;
}
export function set(key, value) { S.data[key] = value; db.put(key, value); emit(); }
export function mutate(key, fn) { set(key, fn(S.data[key])); }
export function setPref(patch) { set('prefs', { ...S.data.prefs, ...patch }); }
export const ctx = () => ({ stock: S.data.stock, prefs: S.data.prefs, history: S.data.history, fav: S.data.fav, ratings: S.data.ratings, today: todayISO(), kb });

// trouve ou crée un ingrédient pour un nom libre (pour que stock, courses et recettes restent cohérents)
export function ensureIng(name) {
  const clean = String(name || '').trim(); if (!clean) return null;
  const id = kb.resolve(clean); if (id) return id;
  const cid = 'c-' + norm(clean).replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  if (!kb.get(cid)) {
    const item = { id: cid, n: clean[0].toUpperCase() + clean.slice(1), al: [], cat: 'Divers', zone: 'frigo', role: 'other', q2: 1, u: 'pièce', life: 0, price: 0, staple: false, liquid: false, g: 'm', hasp: false, units: {}, dens: 1, diet: [], emoji: '🍽️', custom: true };
    kb.add(item); mutate('customIng', a => [...a, item]);
  }
  return cid;
}
export function rebuildCatalogue() {
  const recs = S.cat.list.filter(r => !r.custom).map(r => { const { i, ...rest } = r; return { id: r.id, t: r.t, c: r.c, d: r.d, m: r.m, s: r.s, e: r.e, g: r.g, k: r.k, mt: r.mt, i: r.i, p: r.p, o: r.o }; });
  S.cat.setList([...recs, ...S.data.custom]);
}
export function exportAll() {
  return { app: 'mon-frigo', version: VERSION, exported: new Date().toISOString(), data: Object.fromEntries(KEYS.map(k => [k, S.data[k]])) };
}
export async function resetAll() { await db.clearAll(); S.data = DEFAULTS(); S.cat.setList(S.cat.list.filter(r => !r.custom).map(r => ({ id: r.id, t: r.t, c: r.c, d: r.d, m: r.m, s: r.s, e: r.e, g: r.g, k: r.k, mt: r.mt, i: r.i, p: r.p, o: r.o }))); emit(); }
export { db, kb };
