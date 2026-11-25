// Onglet Semaine : les jours en haut, les repas du jour choisi en grand, le bilan de la semaine.
// Ajouter un repas = une petite fenêtre avec un champ texte (n'importe quel plat, même sans recette).
import { h, btn, toast, haptic, openSheet, plate, meta } from './ui.js';
import { icon } from './icons.js';
import { S, set, ctx } from './state.js';
import * as A from './actions.js';
import { SLOTS, weekDays, weekStart, autoPlan, needsFor, buildShopping, dishEmoji } from './plan.js';
import { todayISO, addDays, parseISO, dayName, fmtDateLong, MOIS, plural } from './util.js';
import { nav, PUI } from './nav.js';
import { freePattern } from './habits.js';
import { tx } from './theme.js';
import { head, openClearFridge } from './views.js';
import { openQuickMeal, openSlotMenu } from './plan-sheets.js';
import { openRecipe } from './recipe-sheets.js';

const kb = S.kb;
const freePlate = e => h('div', { class: 'plate md', style: { '--pl': '#e6e1ea', '--pd': '#2f2a33' }, 'aria-hidden': 'true' }, e.leftover ? '🥡' : dishEmoji(e.note || ''));

export function viewPlan() {
  const t = todayISO(); PUI.start = PUI.start || weekStart(t); const days = weekDays(PUI.start), el = h('div', { class: 'view' });
  if (!PUI.day || !days.includes(PUI.day)) PUI.day = days.includes(t) ? t : days[0];
  const m0 = parseISO(days[0]), m6 = parseISO(days[6]);
  const label = m0.getMonth() === m6.getMonth() ? `Du ${m0.getDate()} au ${m6.getDate()} ${MOIS[m6.getMonth()]}` : `Du ${m0.getDate()} ${MOIS[m0.getMonth()]} au ${m6.getDate()} ${MOIS[m6.getMonth()]}`;
  const goWeek = s => { PUI.start = s; PUI.day = null; nav.render(); };
  el.append(head('Semaine', label, h('div', { class: 'week-nav' },
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Semaine précédente', onclick: () => goWeek(addDays(PUI.start, -7)) }, icon('left', 22)),
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Semaine suivante', onclick: () => goWeek(addDays(PUI.start, 7)) }, icon('right', 22)))));
  const plan = S.data.plan;
  if (PUI.start !== weekStart(t)) el.append(h('button', { type: 'button', class: 'back-week', onclick: () => goWeek(weekStart(t)) }, icon('undo', 16), 'Revenir à cette semaine'));
  el.append(h('div', { class: 'daystrip', role: 'tablist', 'aria-label': 'Jours de la semaine' }, days.map(d => {
    const e = plan[d] || {}, cls = ['day-cell', d === PUI.day ? 'sel' : '', d === t ? 'today' : '', d < t ? 'past' : ''].join(' ');
    return h('button', { type: 'button', role: 'tab', 'aria-selected': String(d === PUI.day), 'aria-label': fmtDateLong(d), class: cls, onclick: () => { PUI.day = d; nav.render(); } }, h('span', { class: 'd' }, dayName(d).slice(0, 3)), h('span', { class: 'n' }, parseISO(d).getDate()), h('span', { class: 'dots' }, h('i', { class: e.lunch ? 'on' : '' }), h('i', { class: e.dinner ? 'on' : '' })));
  })));
  const d = PUI.day;
  el.append(h('section', { class: 'sec' }, h('h2', null, d === t ? `Aujourd'hui, ${fmtDateLong(d).split(' ').slice(1).join(' ')}` : fmtDateLong(d)), h('div', { class: 'slots' }, SLOTS.map(([k, l]) => {
    const e = plan[d] && plan[d][k], r = e && e.rid && S.cat.get(e.rid);
    if (!e) return h('button', { type: 'button', class: 'slot-add', onclick: () => openQuickMeal(d, k) }, h('span', { class: 'plus' }, icon('plus', 20)), h('span', null, `Ajouter un repas pour le ${l.toLowerCase()}`));
    return h('div', { class: 'slot' + (e.done ? ' done' : ''), role: 'button', tabindex: '0', onclick: () => r ? openRecipe(r.id, { serv: e.serv }) : openSlotMenu(d, k), onkeydown: ev => { if (ev.key === 'Enter' && ev.target === ev.currentTarget) ev.currentTarget.click(); } }, r ? plate(r, kb, 'md') : freePlate(e),
      h('div', { class: 'grow' }, h('div', { class: 'when' }, l + (e.done ? (e.leftover ? ', mangé' : ', cuisiné') : e.leftover ? ', restes' : e.note ? ', sans recette' : '')), h('div', { class: 't clamp2' }, r ? r.t : e.note || 'Recette supprimée'), meta([['users', `${e.serv} pers.`], r ? ['clock', `${r.m} min`] : null])),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Options du repas', onclick: ev => { ev.stopPropagation(); openSlotMenu(d, k); } }, icon('more', 22)));
  }))));
  let n = 0, rec = 0, cost = 0;
  for (const x of days) for (const [k] of SLOTS) { const e = plan[x] && plan[x][k]; if (!e) continue; n++; const r = e.rid && S.cat.get(e.rid); if (r) { rec++; cost += r.costPer * (e.serv || 2); } }
  const future = days.filter(x => x >= t), toBuy = buildShopping(needsFor(plan, future, S.cat, kb), S.data.stock, kb, t).length;
  el.append(h('section', { class: 'sec' }, h('h2', null, tx('week')), h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('span', { class: 'v' }, `${n}/14`), h('span', { class: 'l' }, 'repas prévus')), h('div', { class: 'stat' }, h('span', { class: 'v' }, rec ? `${Math.round(cost)} €` : '–'), h('span', { class: 'l' }, 'coût estimé')), h('div', { class: 'stat' }, h('span', { class: 'v' }, toBuy), h('span', { class: 'l' }, plural(toBuy, 'produit à acheter', 'produits à acheter')))),
    h('div', { class: 'week-actions' },
      future.length ? btn('Proposer des repas', { class: 'btn tonal', onclick: () => openPropose(days, future) }, 'wand') : null,
      n || days.some(x => plan[x]) ? btn('Vider', { class: 'btn tonal', 'aria-label': 'Vider la semaine', onclick: () => { const r = A.planClear(days); toast(`Semaine vidée (${r.n} repas)`, { undo: () => set('plan', r.before) }); } }, 'trash') : null),
    btn('Faire les courses', { class: 'btn primary block', disabled: !rec, onclick: () => { const r = A.generateShoppingFromPlan(PUI.start); toast(r.generated ? `${r.generated} produit${r.generated > 1 ? 's' : ''} dans ta liste` : 'Tu as déjà tout ce qu’il faut'); nav.go('shop'); } }, 'cart')));
  return el;
}

function openPropose(days, future) {
  const s = openSheet({ title: 'Proposer des repas', size: 'small', content: h('div', { class: 'form' },
    h('button', { type: 'button', class: 'choice', 'aria-label': 'Compléter la semaine', onclick: () => { s.close();
      const before = JSON.parse(JSON.stringify(S.data.plan)); const res = autoPlan(S.data.plan, future, ctx(), S.cat, { free: freePattern() }); set('plan', res.plan);
      toast(res.added ? `${res.added} repas ajoutés` : 'La semaine est déjà complète', res.added ? { undo: () => set('plan', before) } : {}); } },
      h('span', { class: 'e' }, '🧩'), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, 'Remplir les cases vides'), h('span', { class: 'muted sm' }, 'Garde tout ce que tu as déjà prévu et complète le reste avec les meilleures idées pour ton stock.'))),
    h('button', { type: 'button', class: 'choice', 'aria-label': 'Nouvelle semaine au hasard', onclick: () => { s.close(); const r = A.planRandom(days); haptic(10); toast(`Nouvelle semaine : ${r.added} repas tirés au hasard`, { undo: () => set('plan', r.before) }); } },
      h('span', { class: 'e' }, '🎲'), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, 'Tout retirer au sort'), h('span', { class: 'muted sm' }, 'Remplace les recettes prévues (sauf repas libres et repas déjà cuisinés) par de nouvelles idées, pour changer.'))),
    h('button', { type: 'button', class: 'choice', 'aria-label': 'Vider le frigo', onclick: () => { s.close(); setTimeout(openClearFridge, 260); } },
      h('span', { class: 'e' }, '♻️'), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, 'Vider le frigo'), h('span', { class: 'muted sm' }, 'Quelques recettes qui, ensemble, utilisent un maximum de produits qui vont bientôt périmer.')))) });
}
