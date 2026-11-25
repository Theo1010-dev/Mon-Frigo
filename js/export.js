// Export du stock : note texte (.txt) ou tableau (.csv pour Excel / Google Sheets).
import { ZONES, status } from './stock.js';
import { fmtQty } from './units.js';
import { fmtDateLong, daysBetween } from './util.js';

const byDate = (a, b) => (a.expiry || '9999').localeCompare(b.expiry || '9999') || a.name.localeCompare(b.name, 'fr');
const when = (it, today) => {
  if (!it.expiry) return 'sans date';
  const d = daysBetween(today, it.expiry), [y, m, j] = it.expiry.split('-');
  const date = `${j}/${m}/${y}`;
  return d < 0 ? `périmé depuis le ${date}` : d === 0 ? `à consommer aujourd’hui (${date})` : d === 1 ? `à consommer demain (${date})` : `jusqu’au ${date}`;
};
export function stockToText(stock, today) {
  const out = [`MON STOCK — ${fmtDateLong(today)}`, `${stock.length} produit${stock.length > 1 ? 's' : ''}`, ''];
  const soon = stock.filter(it => ['urgent', 'soon', 'expired'].includes(status(it, today).key)).sort(byDate);
  if (soon.length) { out.push('⚠️ À CONSOMMER VITE'); for (const it of soon) out.push(`- ${it.name} : ${fmtQty(it.qty, it.unit)}, ${when(it, today)}`); out.push(''); }
  for (const z of ZONES) {
    const items = stock.filter(it => it.zone === z.id).sort(byDate); if (!items.length) continue;
    out.push(`${z.emoji} ${z.label.toUpperCase()} (${items.length})`);
    for (const it of items) out.push(`- ${it.name} : ${fmtQty(it.qty, it.unit)}, ${when(it, today)}`);
    out.push('');
  }
  out.push('Exporté depuis Mon Frigo');
  return out.join('\n');
}
const cell = v => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
export function stockToCSV(stock) {
  const rows = [['Produit', 'Quantité', 'Unité', 'Rangement', 'Date limite', 'Ajouté le']];
  for (const it of stock.slice().sort(byDate)) rows.push([it.name, String(it.qty).replace('.', ','), it.unit, (ZONES.find(z => z.id === it.zone) || {}).label || it.zone, it.expiry ? it.expiry.split('-').reverse().join('/') : '', it.added ? it.added.split('-').reverse().join('/') : '']);
  return '﻿' + rows.map(r => r.map(cell).join(';')).join('\r\n'); // BOM + « ; » : s'ouvre directement dans Excel en français
}
