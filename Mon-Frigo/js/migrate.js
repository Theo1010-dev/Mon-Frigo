// Récupère automatiquement les données de l'ancienne version (v0.9, base « mon-frigo-local ») au premier lancement.
import { S, set, ensureIng } from './state.js';
import { canonUnit } from './units.js';
import { uid, todayISO } from './util.js';

const OLD = 'mon-frigo-local';
const ZONES = ['frigo', 'congelateur', 'placard', 'autre'];
const isDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const numOr = (v, d) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? d : n; };

function readAll(db, store) {
  return new Promise(res => {
    try { if (!db.objectStoreNames.contains(store)) return res([]); const rq = db.transaction(store, 'readonly').objectStore(store).getAll(); rq.onsuccess = () => res(rq.result || []); rq.onerror = () => res([]); } catch { res([]); }
  });
}
export async function migrateFromV09() {
  const d = S.data;
  if (d.meta.migrated || d.stock.length || d.shop.length || d.history.length) return null;
  try {
    if (indexedDB.databases) { const list = await indexedDB.databases(); if (!list.some(x => x.name === OLD)) { set('meta', { ...d.meta, migrated: 'none' }); return null; } }
    const db = await new Promise((res, rej) => { const rq = indexedDB.open(OLD); rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); rq.onupgradeneeded = () => { rq.transaction.abort(); rej(new Error('absente')); }; });
    const [stock, shop, waste, meta] = await Promise.all(['stock', 'shopping', 'waste', 'meta'].map(s => readAll(db, s))); db.close();
    const t = todayISO();
    const nStock = stock.filter(x => x && x.name && numOr(x.qty, 0) > 0).map(x => ({ id: uid(), ing: ensureIng(x.name), name: String(x.name).trim(), qty: numOr(x.qty, 1), unit: canonUnit(x.unit || 'pièce'), zone: ZONES.includes(x.zone) ? x.zone : 'frigo', expiry: isDate(x.expiry) ? x.expiry : null, added: isDate(x.purchasedAt) ? x.purchasedAt : t, note: '' }));
    const nShop = shop.filter(x => x && x.name).map(x => { const ing = ensureIng(x.name), k = S.kb.get(ing); const q = numOr(x.qty, NaN); return { id: uid(), ing, name: String(x.name).trim(), qty: q > 0 ? q : null, unit: canonUnit(x.unit || 'pièce'), cat: k ? k.cat : 'Divers', done: !!x.done, src: 'manual' }; });
    const nWaste = waste.filter(x => x && x.name).map(x => ({ id: uid(), ing: S.kb.resolve(x.name), name: String(x.name), qty: numOr(x.qty, 1), unit: canonUnit(x.unit || 'pièce'), reason: String(x.reason || 'Autre'), date: isDate(x.date) ? x.date : (isDate(String(x.createdAt || '').slice(0, 10)) ? String(x.createdAt).slice(0, 10) : t) }));
    const prefsRow = meta.find(m => m && m.id === 'prefs'); const op = (prefsRow && (prefsRow.value || prefsRow.data)) || {};
    const prefs = { ...d.prefs };
    if (numOr(op.defaultServings, 0) > 0) prefs.people = Math.min(12, Math.round(numOr(op.defaultServings, 2)));
    if (numOr(op.budget, 0) > 0) prefs.budget = Math.round(numOr(op.budget, 60));
    const list = v => Array.isArray(v) ? v.map(String).filter(Boolean) : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (list(op.likes).length) prefs.likes = list(op.likes); if (list(op.dislikes).length) prefs.dislikes = list(op.dislikes);
    if (nStock.length) set('stock', nStock); if (nShop.length) set('shop', nShop); if (nWaste.length) set('waste', nWaste); set('prefs', prefs);
    set('meta', { ...S.data.meta, migrated: t });
    return { stock: nStock.length, shop: nShop.length, waste: nWaste.length };
  } catch { set('meta', { ...S.data.meta, migrated: 'error' }); return null; }
}
