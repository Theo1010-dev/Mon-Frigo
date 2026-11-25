// Fruits et légumes de saison : tuiles sur l'accueil, fiche produit, calendrier mois par mois.
import { h, btn, openSheet, toast, chip, clear, haptic, tile } from './ui.js';
import { icon } from './icons.js';
import { S, ctx } from './state.js';
import * as A from './actions.js';
import { score, allowed } from './recipes.js';
import { fmtQty } from './units.js';
import { nav, resetRUI } from './nav.js';
import { MOIS } from './util.js';
import { zoneLabel } from './stock.js';
import { openRecipe } from './recipe-sheets.js';
import { openAddStock } from './stock-sheets.js';

const kb = S.kb;
const M1 = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const isFruit = k => k.role === 'fruit' || ['pomme', 'poire', 'banane', 'fraises', 'fruits-rouges', 'abricots', 'prunes', 'mangue', 'orange', 'citron', 'citron-vert', 'avocat'].includes(k.id);
export const seasonalItems = month => kb.list.filter(i => i.season && i.season.includes(month) && !i.custom);
// où en est la saison de ce produit ce mois-ci : « arrive », « pleine saison », « dernières semaines »
function phase(k, month) {
  const s = k.season || []; if (!s.includes(month)) return null;
  const prev = ((month + 10) % 12) + 1, next = (month % 12) + 1;
  return !s.includes(prev) ? 'start' : !s.includes(next) ? 'end' : 'full';
}
const PHASE = { start: ['Arrive', 'ph-start'], full: ['En saison', 'ph-full'], end: ['Bientôt fini', 'ph-end'] };
// « de juin à septembre », en gérant les saisons à cheval sur l'année (octobre à mars)
function rangeText(season) {
  const s = [...new Set(season)].sort((a, b) => a - b); if (!s.length) return '';
  if (s.length === 12) return 'toute l’année';
  let start = s.find(m => !s.includes(((m + 10) % 12) + 1)); let end = start; while (s.includes((end % 12) + 1)) end = (end % 12) + 1;
  const de = m => /^[aeiouéèêâîôû]/.test(m) ? `d’${m}` : `de ${m}`; // « d’octobre », « d’avril », « d’août »
  return start === end ? `en ${MOIS[start - 1]}` : `${de(MOIS[start - 1])} à ${MOIS[end - 1]}`;
}
const inStock = id => S.data.stock.filter(x => x.ing === id);
function tileEl(k, month, onOpen) {
  const ph = phase(k, month), have = inStock(k.id).length > 0;
  return h('button', { type: 'button', class: 'sea-tile', 'aria-label': `${k.n}${ph ? ', ' + PHASE[ph][0].toLowerCase() : ''}${have ? ', en stock' : ''}`, onclick: () => onOpen(k) },
    h('span', { class: 'sea-plate' + (isFruit(k) ? ' fruit' : '') }, k.emoji, have ? h('span', { class: 'sea-have', title: 'En stock' }, icon('check', 11)) : null),
    h('span', { class: 'sea-name' }, k.n), ph ? h('span', { class: 'sea-ph ' + PHASE[ph][1] }, PHASE[ph][0]) : null);
}
// ---------- section de l'accueil ----------
export function seasonSection(title) {
  const month = new Date().getMonth() + 1, items = seasonalItems(month);
  if (!items.length) return null;
  const order = { start: 0, full: 1, end: 2 }; // ce qui arrive d'abord, puis le reste
  const veg = items.filter(k => !isFruit(k)), fruit = items.filter(isFruit);
  const pick = list => list.sort((a, b) => order[phase(a, month)] - order[phase(b, month)] || a.n.localeCompare(b.n, 'fr'));
  const row = [...pick(veg).slice(0, 8), ...pick(fruit).slice(0, 5)];
  return h('section', { class: 'sec' },
    h('div', { class: 'sec-head' }, h('h2', null, title), btn('Calendrier', { class: 'btn link', onclick: () => openSeasonCalendar(month) })),
    h('div', { class: 'sea-row', role: 'list' }, row.map(k => tileEl(k, month, openSeasonItem))));
}
// ---------- fiche d'un produit de saison ----------
function openSeasonItem(k) {
  const month = new Date().getMonth() + 1, ph = phase(k, month), lots = inStock(k.id), c = ctx();
  const recs = S.cat.list.filter(r => !r.custom && r.i.some(x => x[0] === k.id) && allowed(r, S.data.prefs, kb)).map(r => [score(r, S.data.prefs.people || 2, c).score, r]).sort((a, b) => b[0] - a[0]).map(x => x[1]);
  const months = h('div', { class: 'sea-months', role: 'img', 'aria-label': `De saison ${rangeText(k.season)}` }, M1.map((l, i) => h('span', { class: (k.season.includes(i + 1) ? 'on' : '') + (i + 1 === month ? ' now' : '') }, l)));
  const s = openSheet({ title: `${k.emoji} ${k.n}`, size: 'tall', content: h('div', { class: 'form' },
    h('div', { class: 'stack' }, months, h('p', { class: 'muted' }, `De saison ${rangeText(k.season)}.` + (ph === 'start' ? ' Elle arrive tout juste sur les étals.' : ph === 'end' ? ' Profites-en, c’est bientôt fini.' : ph === 'full' ? ' C’est le meilleur moment, et souvent le moins cher.' : ''))),
    h('div', { class: 'sea-stock' }, lots.length ? [icon('check', 16), h('span', null, `Tu en as : ${lots.map(l => `${fmtQty(l.qty, l.unit)} (${zoneLabel(l.zone).toLowerCase()})`).join(', ')}`)] : [icon('box', 16), h('span', null, 'Pas dans ton stock')]),
    h('div', { class: 'grid2' },
      btn('Aux courses', { class: 'btn tonal', onclick: () => { const r = A.addShop({ ing: k.id, name: k.n, qty: k.buy ? k.buy[0] : null, unit: k.buy ? k.buy[1] : k.u }); haptic(8); toast(r.result === 'added' ? `Ajouté aux courses : ${k.n}` : 'Déjà dans tes courses'); } }, 'cart'),
      btn('J’en ai acheté', { class: 'btn tonal', onclick: () => { s.close(); setTimeout(() => openAddStock({ name: k.n }), 260); } }, 'plus')),
    recs.length ? h('div', { class: 'stack' }, h('h3', { class: 'group-title' }, `Recettes avec ${k.n.toLowerCase()}`, h('span', { class: 'n' }, recs.length)),
      h('div', { class: 'list' }, recs.slice(0, 4).map(r => h('button', { type: 'button', class: 'item', onclick: () => { s.close(); setTimeout(() => openRecipe(r.id), 260); } },
        tile(r, kb, 'sm'), h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, r.t), h('span', { class: 's' }, `${r.m} min, ${r.c.toLowerCase()}`)), icon('right', 18)))),
      recs.length > 4 ? btn(`Voir les ${recs.length} recettes`, { class: 'btn link', onclick: () => { s.close(); resetRUI(k.n); setTimeout(() => nav.go('recipes'), 260); } }) : null) : null) });
}
// ---------- calendrier mois par mois ----------
function openSeasonCalendar(start) {
  let month = start || new Date().getMonth() + 1; const body = h('div', { class: 'form' }), monthsRow = h('div', { class: 'chips scroll sea-cal-months' });
  const draw = () => {
    clear(monthsRow); MOIS.forEach((m, i) => monthsRow.append(chip(m[0].toUpperCase() + m.slice(1), i + 1 === month, () => { month = i + 1; draw(); })));
    clear(body); const items = seasonalItems(month), veg = items.filter(k => !isFruit(k)).sort((a, b) => a.n.localeCompare(b.n, 'fr')), fruit = items.filter(isFruit).sort((a, b) => a.n.localeCompare(b.n, 'fr'));
    const grid = (t, list) => list.length ? h('div', { class: 'stack' }, h('h3', { class: 'group-title' }, t, h('span', { class: 'n' }, list.length)), h('div', { class: 'sea-grid' }, list.map(k => tileEl(k, month, kk => { s.close(); setTimeout(() => openSeasonItem(kk), 260); })))) : null;
    body.append(grid('Légumes', veg), grid('Fruits', fruit), h('p', { class: 'hint' }, 'Calendrier indicatif pour la France. Les produits disponibles toute l’année (oignon, pomme de terre…) ne sont pas listés.'));
    requestAnimationFrame(() => { const on = monthsRow.querySelector('.chip.on'); on && on.scrollIntoView({ inline: 'center', block: 'nearest' }); });
  };
  draw();
  const s = openSheet({ title: 'Calendrier des saisons', size: 'tall', content: h('div', { class: 'stack' }, monthsRow, body) });
}
