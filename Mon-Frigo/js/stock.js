// Logique du stock : statuts, disponibilité, consommation FIFO. Fonctions pures sur des tableaux.
import { daysBetween, norm, uid, round } from './util.js';
import { toGrams, fromGrams, canonUnit, convert } from './units.js';

export const ZONES = [
  { id: 'frigo', label: 'Frigo', emoji: '🧊' },
  { id: 'congelateur', label: 'Congélateur', emoji: '❄️' },
  { id: 'placard', label: 'Placards', emoji: '🗄️' },
  { id: 'autre', label: 'Autres', emoji: '🧺' },
];
export const zoneLabel = id => (ZONES.find(z => z.id === id) || ZONES[3]).label;

export function status(item, today) {
  if (!item.expiry) return { key: 'none', days: null };
  const d = daysBetween(today, item.expiry);
  if (d < 0) return { key: 'expired', days: d };
  if (d <= 2) return { key: 'urgent', days: d };
  if (d <= 5) return { key: 'soon', days: d };
  return { key: 'ok', days: d };
}
export function statusText(item, today) {
  const s = status(item, today);
  if (s.key === 'none') return 'Aucune date limite';
  if (s.days < -1) return `Expiré depuis ${-s.days} j`;
  if (s.days === -1) return 'Expiré hier';
  if (s.days === 0) return "Expire aujourd'hui";
  if (s.days === 1) return 'Expire demain';
  return `Expire dans ${s.days} j`;
}
export const matchKey = it => it.ing || 'x:' + norm(it.name);

export function lotsOf(stock, key, { includeExpired = false, today } = {}) {
  return stock.filter(it => matchKey(it) === key && (includeExpired || !today || status(it, today).key !== 'expired') && it.qty > 0);
}
// disponibilité d'un ingrédient exprimée dans l'unité demandée
export function available(stock, ing, key, unit, today) {
  const lots = lotsOf(stock, key, { today });
  if (!lots.length) return { have: 0, known: true, present: false, lots };
  let total = 0, known = true;
  for (const l of lots) {
    const q = convert(ing, l.qty, l.unit, unit);
    if (q == null) known = false; else total += q;
  }
  return { have: total, known, present: true, lots };
}
const byExpiry = (a, b) => (a.expiry || '9999') < (b.expiry || '9999') ? -1 : (a.expiry || '9999') > (b.expiry || '9999') ? 1 : 0;

// consomme `qty unit` d'un ingrédient (FIFO sur la date limite) ; ne produit jamais de quantité négative
export function consume(stock, ing, key, qty, unit, today) {
  let left = qty, taken = [];
  const lots = lotsOf(stock, key, { today }).sort(byExpiry);
  const next = stock.map(s => ({ ...s }));
  for (const lot of lots) {
    if (left <= 1e-9) break;
    const inNeedUnit = convert(ing, lot.qty, lot.unit, unit);
    const target = next.find(s => s.id === lot.id);
    if (inNeedUnit == null) { // unité incompatible : on considère le lot entier comme "utilisé" seulement s'il reste un besoin
      continue;
    }
    const use = Math.min(left, inNeedUnit);
    const useInLot = convert(ing, use, unit, lot.unit);
    target.qty = round(Math.max(0, lot.qty - useInLot), 3);
    taken.push({ id: lot.id, qty: round(useInLot, 3), unit: lot.unit });
    left -= use;
  }
  return { stock: next.filter(s => s.qty > 1e-6), taken, missing: Math.max(0, round(left, 3)) };
}
// ajoute un lot ; fusionne avec un lot identique (même produit, zone, date, unité)
export function addOrMerge(stock, lot) {
  const k = matchKey(lot);
  const same = stock.find(s => matchKey(s) === k && s.zone === lot.zone && (s.expiry || '') === (lot.expiry || '') && canonUnit(s.unit) === canonUnit(lot.unit));
  if (same) return stock.map(s => s.id === same.id ? { ...s, qty: round(s.qty + lot.qty, 3) } : s);
  return [...stock, { id: uid(), added: lot.added, note: '', ...lot, unit: canonUnit(lot.unit) }];
}
export function groupByIngredient(stock) {
  const m = new Map();
  for (const it of stock) { const k = matchKey(it); if (!m.has(k)) m.set(k, []); m.get(k).push(it); }
  return m;
}
export function expiringSoon(stock, today, maxDays = 3) {
  return stock.filter(it => it.expiry && daysBetween(today, it.expiry) <= maxDays).sort(byExpiry);
}
export function sortStock(a, b) { return byExpiry(a, b) || a.name.localeCompare(b.name, 'fr'); }
