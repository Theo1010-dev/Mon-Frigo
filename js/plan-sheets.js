// Fenêtres de la semaine : ajout express d’un repas, choix d’une recette, menu d’un repas, déplacement, repas libre.
import * as A from './actions.js';
import { h, btn, openSheet, toast, stepper, seg, chip, field, empty, tile, clear, haptic, recipeEmoji } from './ui.js';
import { icon } from './icons.js';
import { S, mutate, set, ctx } from './state.js';
import { todayISO, addDays, norm, dayName } from './util.js';
import { score, allowed, search, missingEquip } from './recipes.js';
import { withArticle } from './equipment.js';
import { slotName, myDishes, dishEmoji } from './plan.js';
import { openCustomRecipe, openFinishCook, openRecipe } from './recipe-sheets.js';

const kb = S.kb;

// ---------- planning ----------
// « · il faut un four » à côté d'une recette grisée faute d'appareil
const lockTxt = r => { const m = r.custom ? [] : missingEquip(r, S.data.prefs); return m.length ? ` · il faut ${withArticle(m)}` : ''; };
const FREE_IDEAS = ['Restes', 'Restaurant', 'Chez des amis', 'Plat préparé', 'Livraison', 'Sandwich', 'Pizza', 'Raclette', 'Barbecue', 'Je saute ce repas'];

function openFreeMeal(date, slot, current) {
  const e = current || {}; let serv = e.serv || S.data.prefs.people || 2;
  const inp = h('input', { class: 'input', placeholder: 'Ex. pizza maison, resto, restes…', value: e.note || '', 'aria-label': 'Nom du repas', maxlength: '60' });
  const s = openSheet({ title: `${dayName(date)} ${slot === 'lunch' ? 'midi' : 'soir'}`, size: 'small',
    content: h('div', { class: 'form' }, h('p', { class: 'muted' }, 'Un repas sans recette : il apparaît dans ta semaine, sans toucher au stock ni aux courses.'), field('Repas', inp),
      h('div', { class: 'chips wrap' }, FREE_IDEAS.map(t => h('button', { type: 'button', class: 'chip', onclick: () => { inp.value = t; inp.focus(); } }, t))),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Pour'), stepper(serv, { min: 1, max: 12, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => { serv = v; } }))),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => { const v = inp.value.trim(); if (!v) { toast('Écris le nom du repas'); inp.focus(); return; } A.planSetFree(date, slot, v, serv); toast(`Ajouté à ta semaine : ${v}`); s.close(); } }) });
  setTimeout(() => !e.note && inp.focus(), 300);
}

// ajout express : on tape n'importe quel plat (Entrée = c'est planifié), ou un raccourci, ou une recette de l'app
const STARTERS = ['Restes', 'Resto', 'Pizza', 'Raclette', 'Sandwich', 'Plat préparé'];

export function openQuickMeal(date, slot) {
  const serv = S.data.prefs.people || 2, plan = S.data.plan;
  const inp = h('input', { class: 'input', type: 'text', enterkeyhint: 'done', autocomplete: 'off', maxlength: '60', placeholder: 'Un plat, une recette, « resto »…', 'aria-label': 'Qu’est-ce qu’on mange ?' });
  const sug = h('div', { class: 'qp-sug' });
  const add = (what, name) => {
    const before = JSON.parse(JSON.stringify(S.data.plan));
    if (what.rid) A.planSet(date, slot, what.rid, serv); else A.planSetFree(date, slot, what.note, serv, what.leftover ? { leftover: what.leftover } : {});
    haptic(12); s.close(); toast(`Ajouté à ta semaine : ${name}`, { undo: () => set('plan', before) });
  };
  const browse = () => { s.close(); setTimeout(() => openPlanPicker(date, slot), 260); };
  const row = (e, title, sub, fn, cls = '') => h('button', { type: 'button', class: 'qp-row ' + cls, onclick: fn }, h('span', { class: 'qp-e', 'aria-hidden': 'true' }, e), h('span', { class: 'grow' }, h('span', { class: 'strong block clamp2' }, title), sub ? h('span', { class: 'muted sm block' }, sub) : null), icon('plus', 18));
  const draw = () => {
    clear(sug); const q = inp.value.trim(), qn = norm(q);
    if (!q) {
      const left = S.data.stock.filter(x => x.unit === 'portion' && x.name.startsWith('Reste'));
      const mine = myDishes(plan, 10).map(x => x.name), seen = new Set(mine.map(norm));
      const ideas = [...mine, ...STARTERS.filter(x => !seen.has(norm(x)))].slice(0, Math.max(6, mine.length));
      if (left.length) sug.append(h('span', { class: 'lab' }, 'Tes restes'), h('div', { class: 'chips wrap qp-ideas' }, left.map(l => chip(`🥡 ${l.name.replace(/^Reste : /, '')}`, false, () => add({ note: l.name, leftover: l.id }, l.name)))));
      sug.append(h('span', { class: 'lab' }, mine.length ? 'Tes plats habituels' : 'En un toucher'), h('div', { class: 'chips wrap qp-ideas' }, ideas.map(n => chip(`${dishEmoji(n)} ${n}`, false, () => add({ note: n }, n)))));
      return;
    }
    const recs = search(S.cat, q).filter(r => r.custom || allowed(r, S.data.prefs, kb, true)).slice(0, 5), exact = recs.find(r => norm(r.t) === qn);
    sug.append(row(dishEmoji(q), `« ${q} »`, exact ? 'la recette de l’app' + lockTxt(exact) : 'tel quel, sans recette', () => exact ? add({ rid: exact.id }, exact.t) : add({ note: q }, q), 'first'));
    for (const x of myDishes(plan, 40).filter(x => norm(x.name) !== qn && norm(x.name).includes(qn)).slice(0, 3)) sug.append(row(dishEmoji(x.name), x.name, `tes plats, ${x.n} fois`, () => add({ note: x.name }, x.name)));
    for (const r of recs.filter(r => r !== exact)) sug.append(row(recipeEmoji(r, kb), r.t, `recette, ${r.m} min${lockTxt(r)}`, () => add({ rid: r.id }, r.t)));
  };
  inp.addEventListener('input', draw);
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const first = sug.querySelector('.qp-row.first'); if (first) first.click(); } });
  const s = openSheet({ title: `${dayName(date)} ${slot === 'lunch' ? 'midi' : 'soir'}`, size: 'small',
    content: h('div', { class: 'form qp' }, inp, sug, btn('Choisir une recette de l’app', { class: 'btn soft block', onclick: browse }, 'utensils')) });
  draw(); setTimeout(() => inp.focus(), 300);
}

function openPlanPicker(date, slot) {
  let tab = 'sugg', q = ''; const list = h('div', { class: 'list' }); const searchIn = h('input', { class: 'input search', type: 'search', placeholder: 'Une recette, un ingrédient…', 'aria-label': 'Rechercher' });
  const serv = S.data.prefs.people || 2; const c = ctx();
  const choose = r => { A.planSet(date, slot, r.id, serv); haptic(12); toast(`Ajouté à ta semaine : ${r.t}`); s.close(); };
  const row = (r, why) => h('button', { type: 'button', class: 'rec-row', onclick: () => choose(r) }, tile(r, kb, 'sm'), h('div', { class: 'grow' }, h('div', { class: 't' }, r.t), h('div', { class: 'muted sm' }, `${r.m} min, ${r.c.toLowerCase()}${lockTxt(r)}`), why ? h('div', { class: 'why-line' }, why) : null), icon('plus', 20));
  const draw = () => {
    clear(list); let items = [];
    if (tab === 'sugg') items = S.cat.list.filter(r => allowed(r, S.data.prefs, kb) && r.c !== 'Desserts' && r.c !== 'Petit-déjeuner' && r.mt.some(x => x === 'Déjeuner' || x === 'Dîner')).map(r => [score(r, serv, c), r]).sort((a, b) => b[0].score - a[0].score).slice(0, 12).map(([sc, r]) => [r, sc.why[0]]);
    else if (tab === 'fav') items = S.data.fav.map(id => S.cat.get(id)).filter(Boolean).map(r => [r]);
    else if (tab === 'mine') items = S.cat.list.filter(r => r.custom).map(r => [r]);
    else items = search(S.cat, q).filter(r => r.custom || allowed(r, S.data.prefs, kb, true)).slice(0, 40).map(r => [r]);
    if (!items.length) list.append(empty(tab === 'fav' ? '💗' : tab === 'mine' ? '👩‍🍳' : '🔍', tab === 'fav' ? 'Aucun favori' : tab === 'mine' ? 'Aucune recette perso' : 'Aucun résultat', tab === 'fav' ? 'Touche le cœur sur une recette pour la retrouver ici.' : tab === 'mine' ? 'Crée la tienne avec le bouton « Ma recette » ci-dessus.' : 'Essaie un autre mot, ou ajoute un repas libre.'));
    for (const [r, why] of items) list.append(row(r, why));
  };
  searchIn.addEventListener('input', () => { q = searchIn.value; tab = q.trim() ? 'search' : 'sugg'; tabs.replaceWith(tabs = mkTabs()); draw(); });
  const mkTabs = () => seg([['sugg', 'Idées'], ['fav', 'Favoris'], ['mine', 'Les miennes']], tab, v => { tab = v; searchIn.value = ''; q = ''; draw(); });
  let tabs = mkTabs();
  const leftovers = S.data.stock.filter(x => x.unit === 'portion' && x.name.startsWith('Reste'));
  const restes = leftovers.length ? h('div', { class: 'stack' }, h('span', { class: 'lab' }, 'Tes restes'), h('div', { class: 'chips scroll' }, leftovers.map(l => h('button', { type: 'button', class: 'chip', onclick: () => { A.planSetFree(date, slot, l.name, Math.min(l.qty, S.data.prefs.people || 2), { leftover: l.id }); toast('Restes ajoutés à ta semaine'); s.close(); } }, '🥡 ' + l.name.replace(/^Reste : /, ''), h('span', { class: 'n' }, ` ${l.qty} part${l.qty > 1 ? 's' : ''}`))))) : null;
  const extra = h('div', { class: 'grid2' },
    btn('Écrire un plat', { class: 'btn tonal', onclick: () => { s.close(); setTimeout(() => openQuickMeal(date, slot), 260); } }, 'edit'),
    btn('Ma recette', { class: 'btn tonal', onclick: () => { s.close(); setTimeout(() => openCustomRecipe({ onSaved: rec => { A.planSet(date, slot, rec.id, serv); toast(`Ajouté à ta semaine : ${rec.t}`); } }), 260); } }, 'plus'));
  const s = openSheet({ title: `${dayName(date)} ${slot === 'lunch' ? 'midi' : 'soir'}`, size: 'tall', content: h('div', { class: 'form' }, restes, extra, searchIn, tabs, list) }); draw();
}

export function openSlotMenu(date, slot) {
  const e = S.data.plan[date] && S.data.plan[date][slot]; if (!e) return; const r = e.rid && S.cat.get(e.rid);
  const go = fn => () => { s.close(); setTimeout(fn, 260); };
  const remove = btn('Retirer de la semaine', { class: 'btn soft block danger-text', onclick: () => { const old = e; A.planRemove(date, slot); s.close(); toast('Repas retiré', { undo: () => mutate('plan', p => ({ ...p, [date]: { ...(p[date] || {}), [slot]: old } })) }); } }, 'trash');
  const qs = stepper(e.serv, { min: 1, max: 12, onChange: v => A.planServ(date, slot, v), fmt: v => `${v} personne${v > 1 ? 's' : ''}` });
  const s = openSheet({ title: r ? r.t : (e.note || 'Repas'), size: 'small', content: h('div', { class: 'form' }, h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Portions'), qs),
    e.leftover && !e.done ? btn('C’est mangé', { class: 'btn soft block', onclick: () => { A.eatLeftover(date, slot); s.close(); toast('Restes retirés du stock'); } }, 'check') : null,
    e.note && !e.leftover ? btn('Modifier', { class: 'btn soft block', onclick: go(() => openFreeMeal(date, slot, S.data.plan[date][slot])) }, 'edit') : null,
    r ? btn('Voir la recette', { class: 'btn soft block', onclick: go(() => openRecipe(r.id, { serv: S.data.plan[date][slot].serv })) }, 'utensils') : null,
    r && !e.done ? btn('J’ai cuisiné ce repas', { class: 'btn soft block', onclick: go(() => openFinishCook(r.id, S.data.plan[date][slot].serv, { planRef: { date, slot }, title: 'Repas cuisiné' })) }, 'check') : null,
    !e.done ? btn('Déplacer', { class: 'btn soft block', onclick: go(() => openMoveSlot(date, slot)) }, 'calendar') : null,
    btn(e.note ? 'Choisir une recette à la place' : 'Remplacer', { class: 'btn soft block', onclick: go(() => openPlanPicker(date, slot)) }, 'swap'),
    e.note && !e.leftover ? btn('En faire une recette', { class: 'btn soft block', onclick: go(() => openCustomRecipe({ title: e.note, serv: e.serv, onSaved: rec => { A.planSet(date, slot, rec.id, e.serv); toast(`Recette créée : ${rec.t}`); } })) }, 'plus') : null,
    remove) });
}

// déplacer un repas (ou l'échanger avec un autre) dans les jours qui viennent
function openMoveSlot(date, slot) {
  const e = S.data.plan[date] && S.data.plan[date][slot]; if (!e) return;
  const t = todayISO(), r = e.rid && S.cat.get(e.rid), now = A.currentMealSlot(), name = r ? r.t : e.note;
  const days = Array.from({ length: 10 }, (_, i) => addDays(t, i)), opts = [];
  for (const d of days) for (const k of ['lunch', 'dinner']) { if ((d === t && k === 'lunch' && now === 'dinner') || (d === date && k === slot)) continue; opts.push({ d, k }); }
  const label = (x, y) => { const o = S.data.plan[x] && S.data.plan[x][y]; const or = o && o.rid && S.cat.get(o.rid); return o ? (or ? or.t : o.note) : null; };
  const s = openSheet({ title: 'Déplacer', size: 'tall', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, `« ${name} » : choisis le nouveau créneau. S’il est déjà pris, les deux repas sont échangés.`),
    h('div', { class: 'move-grid' }, opts.map(({ d, k }) => { const busy = label(d, k);
      return h('button', { type: 'button', class: 'move-opt' + (busy ? ' busy' : ''), onclick: () => { const before = JSON.parse(JSON.stringify(S.data.plan)); A.planMove(date, slot, d, k); haptic(10); s.close(); toast(busy ? `Échangé avec ${busy}` : `Déplacé : ${slotName(d, k, t).toLowerCase()}`, { undo: () => set('plan', before) }); } },
        h('span', { class: 'strong' }, slotName(d, k, t)), h('span', { class: 'muted sm ellipsis' }, busy ? `⇄ ${busy}` : 'libre')); }))) });
}
