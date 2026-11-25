// Utilitaires purs (utilisables dans le navigateur ET dans Node pour les tests)
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function norm(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/[’`´]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function pad(n) { return String(n).padStart(2, '0'); }
function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
export function todayISO() { return toISO(new Date()); }
export function parseISO(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); }
export function addDays(iso, n) { const d = parseISO(iso); d.setDate(d.getDate() + n); return toISO(d); }
export function daysBetween(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
export function weekStart(iso) { const d = parseISO(iso); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return toISO(d); }
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export function dayName(iso) { return JOURS[(parseISO(iso).getDay() + 6) % 7]; }
export function fmtDateLong(iso) { const d = parseISO(iso); return `${dayName(iso)} ${d.getDate()} ${MOIS[d.getMonth()]}`; }
export function fmtDateShort(iso) { const d = parseISO(iso); return `${d.getDate()} ${MOIS[d.getMonth()].slice(0, 4)}.`; }

export function round(n, p = 2) { const f = 10 ** p; return Math.round((n + Number.EPSILON) * f) / f; }
export function fmtNum(n) {
  if (n == null || isNaN(n)) return '';
  const w = Math.floor(n + 1e-9), f = n - w;
  const frac = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  for (const k of [0.25, 0.5, 0.75]) if (Math.abs(f - k) < 0.02) return (w ? w + ' ' : '') + frac[k];
  if (Math.abs(f) < 0.02) return String(w);
  if (Math.abs(f - 1) < 0.02) return String(w + 1);
  return String(round(n, n < 10 ? 2 : 1)).replace('.', ',');
}
export function money(n) { return (Math.round(n * 100) / 100).toFixed(2).replace('.', ',').replace(',00', '') + ' €'; }
export function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
export function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
export function plural(n, one, many) { return n > 1 ? many : one; }

