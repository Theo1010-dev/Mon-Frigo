// Lecture d'un ticket de caisse (texte issu de la reconnaissance) -> articles proposés à vérifier.
import { norm } from './util.js';
import { guessType } from './types.js';

const NOT_ITEM = /(sous[- ]?total|total|t\.?v\.?a|tva|carte|\bcb\b|visa|mastercard|esp[eè]ces|rendu|monnaie|remise|r[eé]duction|fid[eé]lit|avantage|cagnotte|ticket|caisse|merci|siret|t[eé]l[eé]?phone|\btel\b|date|heure|\bqt[eé]\b|montant|avoir|bon d.achat|a payer|à payer|net a|paiement|sans contact|client|magasin|horaires|www\.|http|transaction|terminal|autoris|nombre d.articles|articles?\s*:|vente|n[o°]\s*\d|euros?\s*$)/i;
const NON_FOOD = /(sac|lessive|papier|essuie|mouchoir|dentifrice|shampo|gel douche|savon|eponge|liquide vaisselle|javel|piles?|ampoule|sopalin|deodorant|rasoir|couche|litiere|consigne)/;
const num = s => parseFloat(String(s).replace(',', '.'));
const PRICE_END = /(-?\d{1,4}[.,]\d{2})\s*(?:€|eur)?\s*[A-Z*]{0,2}\s*$/i;

function cleanName(raw) {
  let n = raw.replace(/^[\d\s*#.-]{4,}/, '').replace(/[*#_|]+/g, ' ').replace(/\s+/g, ' ').trim();
  n = n.toLowerCase(); return n ? n[0].toUpperCase() + n.slice(1) : n;
}
// quantité lue dans le nom : 1L, 50CL, 500G, 1,5KG, X4, 6X…
export function sizeFromName(n) {
  const tr = n.match(/\b(\d{1,2})\s*(tr|tranches?)\b/i); if (tr) return { size: { qty: parseInt(tr[1]), unit: 'tranche' }, pack: null };
  const m = n.match(/(\d+(?:[.,]\d+)?)\s*(kg|g|l|cl|ml)\b/i);
  const pack = n.match(/\b[x×](\d{1,2})\b/i) || n.match(/\b(\d{1,2})\s*[x×]\s*\d/i);
  return { size: m ? { qty: num(m[1]), unit: m[2].toLowerCase() } : null, pack: pack ? parseInt(pack[1]) : null };
}
export const stripSize = n => n.replace(/\b\d{1,2}\s*(tr|tranches?)\b/ig, ' ').replace(/(\d+(?:[.,]\d+)?)\s*(kg|g|l|cl|ml)\b/ig, ' ').replace(/\b[x×]\d{1,2}\b/ig, ' ').replace(/\b\d{1,2}\s*[x×]\s*\d+\w*/ig, ' ').replace(/\s+/g, ' ').trim();

export function parseReceipt(text) {
  const lines = String(text || '').split(/\r?\n/).map(l => l.replace(/(\d)\s*([.,])\s*(\d{2})(?!\d)/g, '$1$2$3').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const out = []; let pending = null; // ligne « 2 x 1,35 » en attente de son article
  const attach = (item, c) => { item.count = c.count; };
  for (const l of lines) {
    const letters = (l.match(/[a-zà-ü]/gi) || []).length;
    const qx = l.match(/^(\d{1,2})\s*[x×*]\s*(\d+[.,]\d{2})/i);
    if (qx && letters <= 3) {
      const c = { count: parseInt(qx[1]), total: parseInt(qx[1]) * num(qx[2]) }, prev = out[out.length - 1];
      if (prev && !prev.count && Math.abs(prev.price - c.total) < 0.02) attach(prev, c); else pending = c;
      continue;
    }
    const w = l.match(/(\d+[.,]\d{1,3})\s*kg\b/i);
    if (w && (l.replace(/kg|eur|€|x/gi, '').match(/[a-zà-ü]/gi) || []).length <= 2 && /[x×*]|€\s*\/|\/\s*kg/i.test(l)) { if (out.length) out[out.length - 1].weightKg = num(w[1]); continue; }
    if (NOT_ITEM.test(l)) continue;
    const pm = l.match(PRICE_END); if (!pm) continue;
    const price = num(pm[1]); if (!(price > 0) || price > 300) continue;
    const raw = l.slice(0, pm.index).trim(); if ((raw.match(/[a-zà-ü]/gi) || []).length < 3) continue;
    const item = { raw: l, name: cleanName(raw), price };
    if (pending && Math.abs(price - pending.total) < 0.02) { attach(item, pending); pending = null; }
    out.push(item);
  }
  return out.map(x => {
    const { size, pack } = sizeFromName(x.name); const name = stripSize(x.name) || x.name;
    let qty = 1, unit = null;
    if (x.weightKg) { qty = Math.round(x.weightKg * 1000); unit = 'g'; }
    else if (size) { qty = size.qty * (pack || x.count || 1); unit = size.unit; }
    else if (pack) { qty = pack * (x.count || 1); unit = 'pièce'; }
    else if (x.count) { qty = x.count; unit = 'pièce'; }
    const n = norm(name), food = !NON_FOOD.test(n);
    return { raw: x.raw, name, price: x.price, qty, unit, food, type: food ? guessType(name) : 'autre' };
  });
}
