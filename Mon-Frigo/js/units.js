// Unités et conversions. Pivot = grammes (les liquides utilisent leur densité, 1 g = 1 ml par défaut).
import { fmtNum, round } from './util.js';

const FACT = { g: ['m', 1], kg: ['m', 1000], ml: ['v', 1], cl: ['v', 10], dl: ['v', 100], l: ['v', 1000], 'c. à soupe': ['v', 15], 'c. à café': ['v', 5] };
const ALIAS = {
  'cuillère à soupe': 'c. à soupe', 'cuillères à soupe': 'c. à soupe', 'cuillere a soupe': 'c. à soupe', 'c. a soupe': 'c. à soupe', 'c à soupe': 'c. à soupe', 'cas': 'c. à soupe', 'cs': 'c. à soupe', 'c.s.': 'c. à soupe', 'càs': 'c. à soupe', 'c. à s.': 'c. à soupe',
  'cuillère à café': 'c. à café', 'cuillères à café': 'c. à café', 'cuillere a cafe': 'c. à café', 'c. a cafe': 'c. à café', 'c à café': 'c. à café', 'cac': 'c. à café', 'cc': 'c. à café', 'c.c.': 'c. à café', 'càc': 'c. à café',
  'litre': 'l', 'litres': 'l', 'gramme': 'g', 'grammes': 'g', 'gr': 'g', 'kilo': 'kg', 'kilos': 'kg', 'kilogramme': 'kg',
  'pièces': 'pièce', 'piece': 'pièce', 'pieces': 'pièce', 'pce': 'pièce', 'pcs': 'pièce', 'pc': 'pièce', 'unité': 'pièce', 'unités': 'pièce', 'u': 'pièce',
  'gousses': 'gousse', 'tranches': 'tranche', 'pots': 'pot', 'boîtes': 'boîte', 'boites': 'boîte', 'boite': 'boîte', 'sachets': 'sachet', 'pincées': 'pincée', 'pincee': 'pincée',
  'portions': 'portion', 'bouquets': 'bouquet', 'bottes': 'botte', 'paquets': 'paquet', 'bouteilles': 'bouteille', 'briques': 'brique', 'barquettes': 'barquette', 'sacs': 'sac', 'feuilles': 'feuille', 'cubes': 'cube', 'pavés': 'pavé',
};
export const UNITS_UI = ['g', 'kg', 'ml', 'cl', 'l', 'pièce', 'gousse', 'tranche', 'pot', 'boîte', 'sachet', 'paquet', 'bouteille', 'portion', 'c. à soupe', 'c. à café'];

export function canonUnit(u) {
  const x = String(u ?? '').trim().toLowerCase();
  if (!x) return 'pièce';
  if (FACT[x]) return x;
  return ALIAS[x] || x;
}
export function family(u) { const f = FACT[canonUnit(u)]; return f ? f[0] : 'c'; }

const dens = ing => (ing && ing.dens) || 1;
export function toGrams(ing, qty, unit) {
  const u = canonUnit(unit), f = FACT[u];
  if (f) return f[0] === 'm' ? qty * f[1] : qty * f[1] * dens(ing);
  if (u === 'pincée') return qty * 0.5;
  const per = ing && ing.units && ing.units[u];
  return per ? qty * per : null;
}
export function fromGrams(ing, g, unit) {
  const u = canonUnit(unit), f = FACT[u];
  if (f) return f[0] === 'm' ? g / f[1] : g / (f[1] * dens(ing));
  if (u === 'pincée') return g / 0.5;
  const per = ing && ing.units && ing.units[u];
  return per ? g / per : null;
}
// convertit une quantité vers une autre unité ; null si impossible
export function convert(ing, qty, from, to) {
  const a = canonUnit(from), b = canonUnit(to);
  if (a === b) return qty;
  const g = toGrams(ing, qty, a);
  return g == null ? null : fromGrams(ing, g, b);
}

const PLUR = { 'pièce': 'pièces', gousse: 'gousses', tranche: 'tranches', pot: 'pots', 'boîte': 'boîtes', sachet: 'sachets', 'pincée': 'pincées', portion: 'portions', bouquet: 'bouquets', botte: 'bottes', paquet: 'paquets', bouteille: 'bouteilles', brique: 'briques', barquette: 'barquettes', sac: 'sacs', feuille: 'feuilles', cube: 'cubes', 'pavé': 'pavés' };
export function unitLabel(unit, qty) { const u = canonUnit(unit); return qty > 1.0001 && PLUR[u] ? PLUR[u] : u; }

// affichage "naturel" d'une quantité : 1500 g -> 1,5 kg ; 150 cl -> 1,5 l
export function niceQty(qty, unit) {
  let q = qty, u = canonUnit(unit);
  if (u === 'g' && q >= 1000) { q /= 1000; u = 'kg'; }
  else if (u === 'ml' && q >= 1000) { q /= 1000; u = 'l'; }
  else if (u === 'ml' && q >= 100) { q /= 10; u = 'cl'; }
  else if (u === 'cl' && q >= 100) { q /= 100; u = 'l'; }
  else if (u === 'kg' && q < 1) { q *= 1000; u = 'g'; }
  else if (u === 'l' && q < 1) { q *= 100; u = 'cl'; }
  return { qty: q, unit: u };
}
export function fmtQty(qty, unit, { short = false } = {}) {
  if (qty == null || isNaN(qty)) return '';
  const { qty: q, unit: u } = niceQty(qty, unit);
  const n = ['g', 'ml', 'cl'].includes(u) ? String(q >= 20 ? Math.round(q) : round(q, 1)).replace('.', ',') : ['kg', 'l'].includes(u) ? String(round(q, 2)).replace('.', ',') : fmtNum(q);
  const lab = unitLabel(u, q);
  const compact = ['g', 'kg', 'ml', 'cl', 'l'].includes(u);
  return compact ? `${n} ${lab}` : (short && u === 'pièce' ? n : `${n} ${lab}`);
}
