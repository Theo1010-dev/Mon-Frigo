// Les écrans de l'application (design v2).
import { h, btn, chip, seg, empty, clear, toast, confirmSheet, stepper, haptic, openSheet, plate, meta, tint } from './ui.js';
import { icon } from './icons.js';
import { S, set, setPref, mutate, ctx, exportAll, resetAll, VERSION } from './state.js';
import * as A from './actions.js';
import { ZONES, status, statusText, expiringSoon, sortStock } from './stock.js';
import { score, allowed, search, EQUIP } from './recipes.js';
import { SLOTS, weekDays, weekStart, autoPlan, needsFor, buildShopping } from './plan.js';
import { fmtQty, toGrams } from './units.js';
import { todayISO, addDays, fmtDateLong, dayName, fmtDateShort, money, parseISO, daysBetween, norm, MOIS, plural } from './util.js';
import { nav, RUI, SUI, PUI } from './nav.js';
import * as S1 from './sheets1.js';
import * as S2 from './sheets2.js';

const kb = S.kb;
const RAYONS = [['Fruits & légumes', '🥕'], ['Viandes & poissons', '🥩'], ['Crèmerie & œufs', '🧀'], ['Boulangerie', '🥖'], ['Épicerie', '🥫'], ['Condiments & épices', '🧂'], ['Surgelés', '❄️'], ['Divers', '🛍️']];
const mealOk = (r, morning) => morning ? true : (r.c !== 'Desserts' && r.c !== 'Petit-déjeuner');
const shortStatus = (it, t) => { const s = status(it, t); if (s.key === 'none') return ['Sans date', 'none']; if (s.days < 0) return ['Expiré', 'expired']; if (s.days === 0) return ["Aujourd'hui", 'urgent']; if (s.days === 1) return ['Demain', 'urgent']; return [s.days <= 30 ? `${s.days} jours` : fmtDateShort(it.expiry), s.key]; };
const emo = it => (it.ing && kb.get(it.ing) ? kb.get(it.ing).emoji : it.unit === 'portion' ? '🥡' : '🍽️');
const meBtn = () => h('button', { type: 'button', class: 'avatar' + (nav.tab === 'me' ? ' on' : ''), id: 'meBtn', 'aria-label': 'Mon profil et réglages', onclick: () => nav.go('me') }, icon('user', 21));
const searchBtn = () => h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Rechercher', onclick: openGlobalSearch }, icon('search', 22));
function head(title, sub, ...actions) {
  return h('header', { class: 'head' }, h('div', { class: 'titles' }, h('h1', null, title), sub ? h('p', { class: 'sub' }, sub) : null), h('div', { class: 'head-actions' }, ...actions, meBtn()));
}
function secHead(title, action) { return h('div', { class: 'sec-head' }, h('h2', null, title), action || null); }

export function topRecipes(n = 8) {
  const c = ctx(), p = S.data.prefs, morning = new Date().getHours() < 10;
  return S.cat.list.filter(r => allowed(r, p, kb) && mealOk(r, morning)).map(r => ({ r, sc: score(r, p.people || 2, c) })).sort((a, b) => b.sc.score - a.sc.score).slice(0, n);
}
export function randomRecipe() { const top = topRecipes(15); if (!top.length) { toast('Aucune recette ne correspond à tes réglages'); return; } const x = top[Math.floor(Math.random() * top.length)]; haptic(10); S2.openRecipe(x.r.id); }
export function exportBackup() {
  const data = exportAll(); const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `mon-frigo-${todayISO()}.json` }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  mutate('meta', m => ({ ...m, lastBackup: todayISO() })); toast('Sauvegarde téléchargée');
}

// ================= ACCUEIL =================
let heroIdx = 0;
export function viewHome() {
  const t = todayISO(), d = S.data, el = h('div', { class: 'view' });
  const hr = new Date().getHours(), hello = hr < 5 ? 'Bonsoir' : hr < 12 ? 'Bonjour' : hr < 18 ? 'Bon après-midi' : 'Bonsoir';
  el.append(h('header', { class: 'home-head' }, h('img', { class: 'logo', src: 'assets/icon-192.png', alt: '' }), h('div', { class: 'titles' }, h('h1', null, hello), h('p', { class: 'muted' }, fmtDateLong(t))), h('div', { class: 'head-actions' }, searchBtn(), meBtn())));
  if (d.cook && S.cat.get(d.cook.rid)) {
    const r = S.cat.get(d.cook.rid);
    el.append(h('button', { type: 'button', class: 'resume', onclick: () => S2.openCook(r.id, d.cook.serv, { resume: true }) }, h('span', { class: 'pulse' }), h('span', { class: 'grow' }, h('span', { class: 'block strong' }, 'Cuisson en cours'), h('span', { class: 'block s ellipsis' }, `${r.t}, étape ${d.cook.step + 1} sur ${r.p.length}`)), icon('right', 20)));
  }
  // --- l'assiette du moment ---
  const slot = A.currentMealSlot(), slotTxt = slot === 'lunch' ? 'ce midi' : 'ce soir', planned = d.plan[t] && d.plan[t][slot];
  if (planned && !planned.done && S.cat.get(planned.rid)) {
    const r = S.cat.get(planned.rid);
    el.append(h('section', { class: 'hero', style: tint(r) }, h('div', { class: 'hero-top' }, h('div', { class: 'grow' }, h('p', { class: 'kicker' }, `Au menu ${slotTxt}`), h('h2', null, r.t)), plate(r, kb, 'lg')),
      meta([['clock', `${r.m} min`], ['users', `${planned.serv} pers.`]]),
      h('div', { class: 'hero-actions' }, btn('Cuisiner', { class: 'btn primary grow', onclick: () => S2.openCook(r.id, planned.serv) }, 'flame'), btn('Voir', { class: 'btn soft', onclick: () => S2.openRecipe(r.id, { serv: planned.serv }) }))));
  } else {
    const top = topRecipes(6);
    if (top.length) {
      const { r, sc } = top[heroIdx % top.length];
      el.append(h('section', { class: 'hero', style: tint(r) },
        h('button', { type: 'button', class: 'hero-top', onclick: () => S2.openRecipe(r.id), 'aria-label': `Voir la recette ${r.t}` }, h('div', { class: 'grow' }, h('p', { class: 'kicker' }, `Une idée pour ${slotTxt}`), h('h2', null, r.t)), plate(r, kb, 'lg')),
        meta([['clock', `${r.m} min`], r.costKnown && r.costPer > 0 ? ['coin', `≈ ${money(r.costPer)} par pers.`] : null]),
        sc.why.length ? h('ul', { class: 'why' }, sc.why.slice(0, 2).map(w => h('li', null, icon('check', 16), h('span', null, w)))) : null,
        h('div', { class: 'hero-actions' }, btn('Voir la recette', { class: 'btn primary grow', onclick: () => S2.openRecipe(r.id) }), btn('Autre idée', { class: 'btn soft', onclick: () => { heroIdx++; haptic(6); nav.render(); } }, 'swap'))));
    }
  }
  // --- stock ---
  const soon = expiringSoon(d.stock, t, 3);
  if (!d.stock.length) el.append(h('div', { class: 'note-card' }, h('span', { class: 'e' }, '🧊'), h('div', { class: 'grow stack' }, h('div', null, h('h3', null, 'Remplis ton frigo'), h('p', { class: 'muted sm' }, 'Ajoute ce que tu as chez toi : les idées s’adapteront à ce qui est vraiment dans ton frigo.')), h('div', { class: 'row gap' }, btn('Ajout rapide', { class: 'btn primary sm', onclick: S1.openQuickAdd }, 'wand'), btn('Un produit', { class: 'btn soft sm', onclick: () => S1.openAddStock() }, 'plus')))));
  else if (soon.length) el.append(h('section', { class: 'sec' }, secHead('À consommer vite', btn('Idées anti-gaspi', { class: 'btn link', onclick: () => { Object.keys(RUI.quick).forEach(k => RUI.quick[k] = false); RUI.quick.anti = true; RUI.q = ''; nav.go('recipes'); } })),
    h('div', { class: 'hscroll' }, soon.slice(0, 12).map(it => { const [txt, cls] = shortStatus(it, t); return h('button', { type: 'button', class: 'label-card', onclick: () => S1.openStockItem(it.id) }, h('span', { class: 'e' }, emo(it)), h('span', { class: 't ellipsis' }, it.name), h('span', { class: 'tag ' + cls }, txt)); }))));
  // --- aujourd'hui ---
  const today = d.plan[t] || {};
  el.append(h('section', { class: 'sec' }, secHead("Aujourd'hui", btn('Ma semaine', { class: 'btn link', onclick: () => { PUI.day = t; nav.go('plan'); } })), h('div', { class: 'list' }, SLOTS.map(([k, label]) => {
    const e = today[k], r = e && S.cat.get(e.rid);
    return h('button', { type: 'button', class: 'mini-slot', onclick: () => r ? S2.openRecipe(r.id, { serv: e.serv }) : S1.openPlanPicker(t, k) }, h('span', { class: 'when' }, label), r ? plate(r, kb, 'xs') : null, h('span', { class: 'grow ' + (r ? 'strong ellipsis' : 'faint') }, r ? r.t : 'Rien de prévu'), e && e.done ? h('span', { class: 'tag ok' }, 'Fait') : icon(r ? 'right' : 'plus', 18));
  }))));
  // --- raccourcis ---
  const left = d.shop.filter(x => !x.done).length;
  const sc = (ic, label, fn) => h('button', { type: 'button', class: 'sc', onclick: fn }, h('span', { class: 'ring' }, icon(ic, 24)), h('span', null, label));
  el.append(h('div', { class: 'shortcuts' }, sc('plus', 'Ajouter', () => S1.openAddStock()), sc('cart', left ? `Courses (${left})` : 'Courses', () => nav.go('shop')), sc('calendar', 'Semaine', () => nav.go('plan')), sc('dice', 'Au hasard', randomRecipe)));
  // --- bilan + sauvegarde ---
  const m = t.slice(0, 7), cooked = d.history.filter(x => x.date.startsWith(m)).length, wasted = d.waste.filter(x => x.date.startsWith(m)).length;
  if (cooked || wasted) el.append(h('section', { class: 'sec' }, secHead('Ce mois-ci'), h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('span', { class: 'v' }, cooked), h('span', { class: 'l' }, plural(cooked, 'repas cuisiné', 'repas cuisinés'))), h('div', { class: 'stat' }, h('span', { class: 'v' }, wasted), h('span', { class: 'l' }, plural(wasted, 'produit jeté', 'produits jetés'))), h('div', { class: 'stat' }, h('span', { class: 'v' }, d.fav.length), h('span', { class: 'l' }, plural(d.fav.length, 'favori', 'favoris'))))));
  const lb = d.meta.lastBackup; if ((d.stock.length + d.history.length + d.custom.length) > 5 && daysBetween(d.meta.created || t, t) >= 7 && (!lb || daysBetween(lb, t) > 30)) el.append(h('div', { class: 'note-card' }, h('span', { class: 'e' }, '💾'), h('div', { class: 'grow stack' }, h('div', null, h('h3', null, 'Pense à sauvegarder'), h('p', { class: 'muted sm' }, 'Tes données ne sont que sur ce téléphone. Une sauvegarde te protège si tu en changes.')), btn('Télécharger une sauvegarde', { class: 'btn soft sm', onclick: exportBackup }, 'download'))));
  return el;
}

// ================= STOCK =================
export function viewStock() {
  const t = todayISO(), el = h('div', { class: 'view' }), list = h('div', { class: 'stack' });
  const st = S.data.stock, nSoon = st.filter(x => ['urgent', 'soon'].includes(status(x, t).key)).length, nExp = st.filter(x => status(x, t).key === 'expired').length;
  const sub = st.length ? `${st.length} produit${st.length > 1 ? 's' : ''}${nSoon ? `, dont ${nSoon} à consommer vite` : ''}` : 'Ton frigo est vide pour l’instant';
  el.append(head('Stock', sub, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Ajout rapide', title: 'Ajout rapide', onclick: S1.openQuickAdd }, icon('wand', 22))));
  if (st.length) {
    const q = h('input', { class: 'input search', type: 'search', placeholder: 'Chercher un produit', value: SUI.q, 'aria-label': 'Rechercher dans le stock' }); q.addEventListener('input', () => { SUI.q = q.value; draw(); });
    const cnt = z => st.filter(x => z === 'all' || x.zone === z).length;
    const tabs = h('div', { class: 'tabs', role: 'tablist' }, [['all', 'Tout'], ...ZONES.map(z => [z.id, ({ congelateur: 'Congél.', placard: 'Placard', autre: 'Autres' })[z.id] || z.label])].map(([id, l]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(SUI.zone === id), class: SUI.zone === id ? 'on' : '', onclick: () => { SUI.zone = id; nav.render(); } }, l, cnt(id) ? h('span', { class: 'n' }, cnt(id)) : null)));
    el.append(h('div', { class: 'stack' }, q, tabs));
    if (nSoon || nExp) el.append(h('div', { class: 'chips scroll' }, nSoon ? chip(`À consommer vite`, SUI.chip === 'soon', () => { SUI.chip = SUI.chip === 'soon' ? '' : 'soon'; nav.render(); }) : null, nExp ? chip(`Expirés (${nExp})`, SUI.chip === 'exp', () => { SUI.chip = SUI.chip === 'exp' ? '' : 'exp'; nav.render(); }) : null));
  }
  el.append(list);
  function draw() {
    clear(list); let items = st.slice();
    if (SUI.q.trim()) { const n = norm(SUI.q); items = items.filter(x => norm(x.name).includes(n)); }
    if (SUI.zone !== 'all') items = items.filter(x => x.zone === SUI.zone);
    if (SUI.chip === 'soon') items = items.filter(x => ['urgent', 'soon'].includes(status(x, t).key)); if (SUI.chip === 'exp') items = items.filter(x => status(x, t).key === 'expired');
    if (!st.length) { list.append(empty('🧺', 'Rien dans le stock', 'Ajoute tes produits pour recevoir des idées de repas avec ce que tu as.', h('div', { class: 'row gap' }, btn('Ajout rapide', { class: 'btn primary', onclick: S1.openQuickAdd }, 'wand'), btn('Un produit', { class: 'btn soft', onclick: () => S1.openAddStock() }, 'plus')))); return; }
    if (!items.length) { list.append(empty('🔍', 'Aucun produit ici', SUI.q ? `Rien ne correspond à « ${SUI.q} ».` : 'Cette zone est vide.', SUI.q ? btn(`Ajouter « ${SUI.q} »`, { class: 'btn soft', onclick: () => S1.openAddStock({ name: SUI.q }) }, 'plus') : null)); return; }
    const zones = SUI.zone === 'all' ? ZONES : ZONES.filter(z => z.id === SUI.zone);
    for (const z of zones) {
      const zi = items.filter(x => x.zone === z.id).sort(sortStock); if (!zi.length) continue;
      if (SUI.zone === 'all') list.append(h('h3', { class: 'group-title' }, z.label, h('span', { class: 'n' }, zi.length)));
      list.append(h('div', { class: 'list' }, zi.map(it => { const [txt, cls] = shortStatus(it, t); return h('button', { type: 'button', class: 'item', onclick: () => S1.openStockItem(it.id) }, h('span', { class: 'bullet' }, emo(it)), h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, it.name), h('span', { class: 's' }, fmtQty(it.qty, it.unit))), h('span', { class: 'tag ' + cls, title: statusText(it, t) }, txt)); })));
    }
  }
  draw();
  el.append(h('button', { type: 'button', class: 'fab', 'aria-label': 'Ajouter un produit', onclick: () => S1.openAddStock() }, icon('plus', 26)));
  return el;
}

// ================= RECETTES =================
const QUICK = [['cook', 'Faisable maintenant'], ['anti', 'Anti-gaspi'], ['fast', 'Rapide'], ['veg', 'Végé'], ['fav', 'Favoris'], ['mine', 'Mes recettes']];
function computeRecipes() {
  const p = S.data.prefs, c = ctx(); let list = RUI.q.trim() ? search(S.cat, RUI.q) : S.cat.list.slice();
  list = list.filter(r => r.custom || allowed(r, p, kb));
  const Q = RUI.quick;
  if (Q.fast) list = list.filter(r => r.m <= 20); if (Q.veg) list = list.filter(r => r.veg); if (Q.fav) list = list.filter(r => S.data.fav.includes(r.id)); if (Q.mine) list = list.filter(r => r.custom);
  if (RUI.cats.size) list = list.filter(r => RUI.cats.has(r.c)); if (RUI.maxTime) list = list.filter(r => r.m <= RUI.maxTime);
  let sc = list.map(r => ({ r, sc: score(r, p.people || 2, c) }));
  if (Q.cook) sc = sc.filter(x => x.sc.cov.all && x.sc.cov.total > 0); if (Q.anti) sc = sc.filter(x => x.sc.cov.expiringUsed.length > 0);
  if (RUI.sort === 'rapide') sc.sort((a, b) => a.r.m - b.r.m); else if (RUI.sort === 'eco') sc.sort((a, b) => a.r.costPer - b.r.costPer); else if (!RUI.q.trim()) sc.sort((a, b) => b.sc.score - a.sc.score);
  return sc;
}
function recCard({ r, sc }) {
  const cov = sc.cov, fav = S.data.fav.includes(r.id);
  let covEl = null;
  if (cov.expiringUsed.length && !cov.all) covEl = h('div', { class: 'cov anti' }, h('span', { class: 'dot' }), 'Anti-gaspi');
  else if (cov.total && cov.all) covEl = h('div', { class: 'cov good' }, h('span', { class: 'dot' }), 'Tout est là');
  else if (cov.total && cov.ok > 0) covEl = h('div', { class: 'cov ' + (cov.missing.length <= 2 ? 'mid' : '') }, h('span', { class: 'dot' }), cov.missing.length === 1 ? `Il manque ${kb.name(cov.missing[0].id, '').toLowerCase()}` : `Il manque ${cov.missing.length} ingrédients`);
  const heart = h('button', { type: 'button', class: 'heart' + (fav ? ' on' : ''), 'aria-label': fav ? 'Retirer des favoris' : 'Ajouter aux favoris', 'aria-pressed': String(fav), onclick: e => { e.stopPropagation(); A.toggleFav(r.id); haptic(8); } }, icon('heart', 20));
  if (fav) heart.querySelector('svg').setAttribute('fill', 'currentColor');
  return h('div', { class: 'rec', role: 'button', tabindex: '0', onclick: () => S2.openRecipe(r.id), onkeydown: e => { if (e.key === 'Enter') S2.openRecipe(r.id); } }, plate(r, kb, 'lg'), heart,
    h('div', { class: 'strong clamp3' }, r.t), meta([['clock', `${r.m} min`], r.custom ? ['edit', 'Perso'] : null]), covEl);
}
export function viewRecipes() {
  const el = h('div', { class: 'view' }), list = h('div', { class: 'rgrid' }), countEl = h('p', { class: 'count-line' });
  el.append(head('Recettes', null, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Je ne sais pas quoi manger : une recette au hasard', title: 'Au hasard', onclick: randomRecipe }, icon('dice', 22)), h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Créer ma recette', title: 'Créer ma recette', onclick: () => S2.openCustomRecipe() }, icon('plus', 24))));
  const q = h('input', { class: 'input search', type: 'search', placeholder: 'Un plat, un ingrédient…', value: RUI.q, 'aria-label': 'Rechercher une recette' });
  let tm; q.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { RUI.q = q.value; RUI.shown = 30; draw(); }, 120); });
  const nf = RUI.cats.size + (RUI.maxTime ? 1 : 0) + (RUI.sort !== 'perso' ? 1 : 0);
  const chips = h('div', { class: 'chips scroll' }, btn(nf ? `Filtres (${nf})` : 'Filtres', { class: 'chip' + (nf ? ' on' : ''), onclick: () => S1.openFilters(() => { RUI.shown = 30; nav.render(); }) }, 'filter'), QUICK.map(([k, l]) => chip(l, RUI.quick[k], () => { RUI.quick[k] = !RUI.quick[k]; RUI.shown = 30; nav.render(); })));
  const more = h('div');
  el.append(h('div', { class: 'stack' }, q, chips), countEl, list, more);
  let io;
  function draw() {
    clear(list); clear(more); const all = computeRecipes();
    countEl.textContent = `${all.length} recette${all.length > 1 ? 's' : ''}${RUI.quick.cook && !S.data.stock.length ? ' : ajoute des produits pour voir ce qui est faisable' : ''}`;
    if (!all.length) { list.replaceWith(list); more.append(empty('🍳', 'Aucune recette', RUI.quick.cook ? 'Rien n’est faisable à 100 % avec ton stock. Essaie « Anti-gaspi » ou retire « Faisable ».' : 'Change ta recherche ou tes filtres.', btn('Tout réinitialiser', { class: 'btn soft', onclick: () => { RUI.q = ''; RUI.cats.clear(); RUI.maxTime = 0; Object.keys(RUI.quick).forEach(k => RUI.quick[k] = false); nav.render(); } }))); return; }
    for (const x of all.slice(0, RUI.shown)) list.append(recCard(x));
    if (all.length > RUI.shown) { const b = btn(`Voir plus de recettes (${all.length - RUI.shown})`, { class: 'btn soft block more', onclick: () => { RUI.shown += 30; draw(); } }); more.append(b); if ('IntersectionObserver' in window) { io && io.disconnect(); io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); RUI.shown += 30; draw(); } }, { rootMargin: '400px' }); io.observe(b); } }
  }
  draw(); return el;
}

// ================= SEMAINE =================
export function viewPlan() {
  const t = todayISO(); PUI.start = PUI.start || weekStart(t); const days = weekDays(PUI.start), el = h('div', { class: 'view' });
  if (!PUI.day || !days.includes(PUI.day)) PUI.day = days.includes(t) ? t : days[0];
  const m0 = parseISO(days[0]), m6 = parseISO(days[6]);
  const label = m0.getMonth() === m6.getMonth() ? `Du ${m0.getDate()} au ${m6.getDate()} ${MOIS[m6.getMonth()]}` : `Du ${m0.getDate()} ${MOIS[m0.getMonth()]} au ${m6.getDate()} ${MOIS[m6.getMonth()]}`;
  el.append(head('Semaine', label, h('div', { class: 'week-nav' },
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Semaine précédente', onclick: () => { PUI.start = addDays(PUI.start, -7); PUI.day = null; nav.render(); } }, icon('left', 22)),
    h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Semaine suivante', onclick: () => { PUI.start = addDays(PUI.start, 7); PUI.day = null; nav.render(); } }, icon('right', 22)))));
  const plan = S.data.plan;
  el.append(h('div', { class: 'daystrip', role: 'tablist', 'aria-label': 'Jours de la semaine' }, days.map(d => {
    const e = plan[d] || {}, cls = ['day-cell', d === PUI.day ? 'sel' : '', d === t ? 'today' : '', d < t ? 'past' : ''].join(' ');
    return h('button', { type: 'button', role: 'tab', 'aria-selected': String(d === PUI.day), 'aria-label': fmtDateLong(d), class: cls, onclick: () => { PUI.day = d; nav.render(); } }, h('span', { class: 'd' }, dayName(d).slice(0, 3)), h('span', { class: 'n' }, parseISO(d).getDate()), h('span', { class: 'dots' }, h('i', { class: e.lunch ? 'on' : '' }), h('i', { class: e.dinner ? 'on' : '' })));
  })));
  const d = PUI.day;
  el.append(h('section', { class: 'sec' }, h('h2', null, d === t ? `Aujourd'hui, ${fmtDateLong(d).split(' ').slice(1).join(' ')}` : fmtDateLong(d)), h('div', { class: 'slots' }, SLOTS.map(([k, l]) => {
    const e = plan[d] && plan[d][k], r = e && S.cat.get(e.rid);
    if (!e) return h('button', { type: 'button', class: 'slot-add', onclick: () => S1.openPlanPicker(d, k) }, h('span', { class: 'plus' }, icon('plus', 20)), h('span', null, `Ajouter un repas pour le ${l.toLowerCase()}`));
    return h('div', { class: 'slot' + (e.done ? ' done' : ''), role: 'button', tabindex: '0', onclick: () => r ? S2.openRecipe(r.id, { serv: e.serv }) : S1.openSlotMenu(d, k) }, r ? plate(r, kb, 'md') : h('div', { class: 'plate md' }, '❔'),
      h('div', { class: 'grow' }, h('div', { class: 'when' }, l + (e.done ? ', cuisiné' : '')), h('div', { class: 't clamp2' }, r ? r.t : 'Recette supprimée'), meta([['users', `${e.serv} pers.`], r ? ['clock', `${r.m} min`] : null])),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Options du repas', onclick: ev => { ev.stopPropagation(); S1.openSlotMenu(d, k); } }, icon('more', 22)));
  }))));
  let n = 0, cost = 0;
  for (const x of days) for (const [k] of SLOTS) { const e = plan[x] && plan[x][k]; const r = e && S.cat.get(e.rid); if (r) { n++; cost += r.costPer * (e.serv || 2); } }
  const future = days.filter(x => x >= t), toBuy = buildShopping(needsFor(plan, future, S.cat, kb), S.data.stock, kb, t).length;
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Ta semaine'), h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('span', { class: 'v' }, `${n}/14`), h('span', { class: 'l' }, 'repas prévus')), h('div', { class: 'stat' }, h('span', { class: 'v' }, n ? `${Math.round(cost)} €` : '–'), h('span', { class: 'l' }, 'coût estimé')), h('div', { class: 'stat' }, h('span', { class: 'v' }, toBuy), h('span', { class: 'l' }, plural(toBuy, 'produit à acheter', 'produits à acheter')))),
    h('div', { class: 'row gap' }, future.length ? btn('Compléter la semaine', { class: 'btn soft grow', onclick: () => {
      const before = JSON.parse(JSON.stringify(S.data.plan)); const res = autoPlan(S.data.plan, future, ctx(), S.cat); set('plan', res.plan);
      toast(res.added ? `${res.added} repas ajoutés` : 'La semaine est déjà complète', res.added ? { undo: () => set('plan', before) } : {}); } }, 'wand') : null),
    btn('Faire les courses', { class: 'btn primary block', disabled: !n, onclick: () => { const r = A.generateShoppingFromPlan(PUI.start); toast(r.generated ? `${r.generated} produit${r.generated > 1 ? 's' : ''} dans ta liste` : 'Tu as déjà tout ce qu’il faut'); nav.go('shop'); } }, 'cart')));
  return el;
}

// ================= COURSES =================
function shopPrice(x) { const k = x.ing && kb.get(x.ing); if (!k || !k.price || !x.qty) return null; const g = toGrams(k, x.qty, x.unit); return g == null ? null : g / 1000 * k.price; }
export function viewShop() {
  const el = h('div', { class: 'view' }), list = S.data.shop, todo = list.filter(x => !x.done), done = list.filter(x => x.done);
  const est = todo.reduce((s, x) => s + (shopPrice(x) || 0), 0), budget = S.data.prefs.budget;
  el.append(head('Courses', todo.length ? `${todo.length} produit${todo.length > 1 ? 's' : ''} à acheter` : (done.length ? 'Tout est dans le panier' : 'Ta liste est vide'), todo.length ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Partager la liste', title: 'Partager', onclick: shareList }, icon('share', 22)) : null));
  if (todo.length && est > 0) el.append(h('div', { class: 'panel budget' }, h('div', { class: 'budget-top' }, h('span', { class: 'big-num' }, `≈ ${Math.round(est)} €`), budget ? h('span', { class: 'muted sm' }, `budget ${budget} € / semaine`) : null), budget ? h('div', { class: 'bar' }, h('i', { class: est > budget ? 'over' : '', style: { width: Math.min(100, est / budget * 100) + '%' } })) : null, h('span', { class: 'faint sm' }, 'Estimation à partir de prix moyens')));
  el.append(btn('Remplir depuis ma semaine', { class: 'btn soft block', onclick: () => { const r = A.generateShoppingFromPlan(); if (!r.meals) { toast('Aucun repas prévu cette semaine'); return; } toast(r.generated ? `${r.generated} produit${r.generated > 1 ? 's' : ''} ajouté${r.generated > 1 ? 's' : ''} ou mis à jour` : 'Ton stock couvre déjà la semaine'); } }, 'calendar'));
  el.append(h('button', { type: 'button', class: 'fab' + (done.length ? ' raised' : ''), 'aria-label': 'Ajouter un article', onclick: () => S1.openAddShop() }, icon('plus', 26)));
  if (!list.length) { el.append(empty('🛒', 'Rien à acheter', 'Ajoute des produits, ou remplis la liste depuis ta semaine : ce que tu as déjà est déduit automatiquement.')); return el; }
  const toggle = x => { haptic(8); mutate('shop', l => l.map(y => y.id === x.id ? { ...y, done: !y.done } : y)); };
  const row = x => h('div', { class: 'shop-item' + (x.done ? ' done' : '') }, h('button', { type: 'button', class: 'cb' + (x.done ? ' on' : ''), role: 'checkbox', 'aria-checked': String(x.done), 'aria-label': (x.done ? 'Décocher ' : 'Cocher ') + x.name, onclick: () => toggle(x) }, x.done ? icon('check', 16) : null),
    h('button', { type: 'button', class: 'grow txt', onclick: () => S1.openShopItem(x.id) }, h('span', { class: 't block' }, x.name, x.src === 'plan' ? h('span', { class: 'tag src' }, 'semaine') : x.src === 'recipe' ? h('span', { class: 'tag src' }, 'recette') : null), x.qty ? h('span', { class: 'muted sm' }, fmtQty(x.qty, x.unit)) : null));
  for (const [ray, e] of RAYONS) { const items = todo.filter(x => (x.cat || 'Divers') === ray); if (items.length) el.append(h('section', { class: 'stack' }, h('h3', { class: 'group-title' }, `${e} ${ray}`, h('span', { class: 'n' }, items.length)), h('div', { class: 'list' }, items.map(row)))); }
  const known = RAYONS.map(r => r[0]), other = todo.filter(x => !known.includes(x.cat || 'Divers')); if (other.length) el.append(h('div', { class: 'list' }, other.map(row)));
  if (done.length) {
    el.append(h('section', { class: 'stack' }, h('h3', { class: 'group-title' }, 'Dans le panier', h('span', { class: 'n' }, done.length)), h('div', { class: 'list' }, done.map(row))));
    el.append(h('div', { class: 'sticky-bar' }, btn(`Ranger ${done.length} produit${done.length > 1 ? 's' : ''}`, { class: 'btn primary grow', 'aria-label': `Ranger ${done.length} produit${done.length > 1 ? 's' : ''} dans le stock`, onclick: () => S1.openShopToStock(done) }, 'box'), h('button', { type: 'button', class: 'btn tonal', 'aria-label': 'Retirer les articles cochés sans les ranger', title: 'Retirer sans ranger', onclick: () => { const old = S.data.shop.slice(); mutate('shop', l => l.filter(x => !x.done)); toast('Articles retirés de la liste', { undo: () => set('shop', old) }); } }, icon('trash', 20))));
  }
  return el;
}
async function shareList() {
  const todo = S.data.shop.filter(x => !x.done); let txt = 'Liste de courses\n';
  for (const [ray] of RAYONS) { const it = todo.filter(x => (x.cat || 'Divers') === ray); if (it.length) txt += `\n${ray}\n` + it.map(x => `- ${x.name}${x.qty ? ' (' + fmtQty(x.qty, x.unit) + ')' : ''}`).join('\n') + '\n'; }
  try { if (navigator.share) { await navigator.share({ title: 'Liste de courses', text: txt }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(txt); toast('Liste copiée, colle-la dans un message'); } catch { toast('Le partage n’est pas disponible sur ce navigateur'); }
}

// ================= MOI =================
export function viewMe() {
  const d = S.data, p = d.prefs, t = todayISO(), el = h('div', { class: 'view' });
  el.append(head('Moi', 'Tes réglages et tes données'));
  const m = t.slice(0, 7);
  el.append(h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('span', { class: 'v' }, d.history.length), h('span', { class: 'l' }, plural(d.history.length, 'repas cuisiné', 'repas cuisinés'))), h('div', { class: 'stat' }, h('span', { class: 'v' }, d.fav.length), h('span', { class: 'l' }, plural(d.fav.length, 'favori', 'favoris'))), h('div', { class: 'stat' }, h('span', { class: 'v' }, d.waste.filter(x => x.date.startsWith(m)).length), h('span', { class: 'l' }, 'jetés ce mois-ci'))));
  const recent = d.history.slice(-20).map(x => S.cat.get(x.rid)).filter(Boolean);
  if (recent.length >= 5) {
    const avgT = recent.reduce((s, r) => s + r.m, 0) / recent.length, vegS = recent.filter(r => r.veg).length / recent.length, avgC = recent.reduce((s, r) => s + r.costPer, 0) / recent.length, cats = new Set(recent.map(r => r.c)).size;
    const prof = [avgT <= 25 && '⚡ Cuisine express', vegS >= 0.6 && '🌱 Plutôt végétal', avgC <= 2 && '💶 Pratique et économique', d.waste.length <= Math.floor(d.history.length / 10) && d.history.length >= 10 && '♻️ Anti-gaspi organisé', cats >= 6 && '🧭 Gourmand curieux'].filter(Boolean);
    if (prof.length) el.append(h('section', { class: 'sec' }, h('h2', null, 'Ton profil cuisine'), h('div', { class: 'panel' }, h('div', { class: 'chips wrap' }, prof.map(l => h('span', { class: 'chip' }, l))), h('p', { class: 'muted sm' }, `D’après tes ${recent.length} derniers repas. Il évolue avec toi.`))));
  }
  const tog = (key, label) => h('label', { class: 'switch-row' }, h('span', null, label), h('input', { type: 'checkbox', class: 'switch', checked: !!p[key], onchange: e => setPref({ [key]: e.target.checked }) }));
  const tagEditor = (key, ph) => { const inp = h('input', { class: 'input', placeholder: ph, 'aria-label': ph }); const add = () => { const v = inp.value.split(',').map(x => x.trim()).filter(Boolean); if (v.length) setPref({ [key]: [...new Set([...(p[key] || []), ...v])] }); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    return h('div', { class: 'stack' }, (p[key] || []).length ? h('div', { class: 'chips wrap' }, (p[key] || []).map(v => h('button', { type: 'button', class: 'chip on', 'aria-label': 'Retirer ' + v, onclick: () => setPref({ [key]: p[key].filter(x => x !== v) }) }, v, icon('x', 14)))) : null, h('div', { class: 'row gap' }, inp, h('button', { type: 'button', class: 'btn tonal', style: { flex: 'none' }, 'aria-label': 'Ajouter', onclick: add }, icon('plus', 20)))); };
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Cuisine'), h('div', { class: 'panel form' },
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Nombre de personnes par défaut'), stepper(p.people, { min: 1, max: 12, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => setPref({ people: v }) })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Budget courses par semaine'), h('div', { class: 'row gap' }, h('input', { class: 'input', inputmode: 'numeric', value: p.budget, 'aria-label': 'Budget en euros', onchange: e => setPref({ budget: Math.max(0, parseInt(e.target.value) || 0) }) }), h('span', { class: 'muted' }, '€'))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Régime'), seg([['omni', 'Tout'], ['pesco', 'Pesco'], ['veg', 'Végé'], ['vegan', 'Végan']], p.diet, v => setPref({ diet: v }))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Équipement'), h('div', { class: 'chips wrap' }, EQUIP.map(([k, l]) => chip(l, p.equip.includes(k), () => setPref({ equip: p.equip.includes(k) ? p.equip.filter(x => x !== k) : [...p.equip, k] }))))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'J’aime'), tagEditor('likes', 'Ex. poulet, fromage')),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Je n’en mange pas'), h('span', { class: 'hint' }, 'Les recettes qui en contiennent sont masquées.'), tagEditor('dislikes', 'Ex. champignons')))));
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Allergies et restrictions'), h('div', { class: 'list' }, tog('noPork', 'Sans porc'), tog('noGluten', 'Sans gluten'), tog('noNuts', 'Sans fruits à coque'), tog('noShell', 'Sans crustacés'))));
  const staples = kb.list.filter(i => i.staple && i.id !== 'eau');
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Produits de base'), h('div', { class: 'panel' }, h('p', { class: 'muted sm' }, 'Je considère que tu les as toujours : ils ne bloquent pas les recettes et ne vont pas dans les courses. Désélectionne ceux qui te manquent.'),
    h('div', { class: 'chips wrap' }, staples.map(i => { const out = (p.outStaples || []).includes(i.id); return chip(i.emoji + ' ' + i.n, !out, () => setPref({ outStaples: out ? p.outStaples.filter(x => x !== i.id) : [...(p.outStaples || []), i.id] })); })))));
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Apparence'), seg([['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']], p.theme, v => setPref({ theme: v }))));
  const w = d.waste.slice().reverse().slice(0, 6);
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Journal anti-gaspi'), w.length ? h('div', { class: 'list' }, w.map(x => h('div', { class: 'item static' }, h('span', { class: 'bullet' }, (x.ing && kb.get(x.ing) ? kb.get(x.ing).emoji : '🗑️')), h('span', { class: 'grow' }, h('span', { class: 't block' }, x.name), h('span', { class: 's' }, `${fmtQty(x.qty, x.unit)}, ${x.reason.toLowerCase()}`)), h('span', { class: 'faint sm' }, fmtDateShort(x.date))))) : h('p', { class: 'muted' }, 'Rien de jeté pour l’instant.')));
  const hist = d.history.slice().reverse().slice(0, 6);
  if (hist.length) el.append(h('section', { class: 'sec' }, h('h2', null, 'Derniers repas'), h('div', { class: 'list' }, hist.map(x => { const r = S.cat.get(x.rid); return h('button', { type: 'button', class: 'item', onclick: () => r ? S2.openRecipe(x.rid) : null }, r ? plate(r, kb, 'xs') : null, h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, x.title), h('span', { class: 's' }, `${fmtDateShort(x.date)}${x.rating ? ', ' + '★'.repeat(x.rating) : ''}`))); }))));
  const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: '', onchange: e => { const f = e.target.files[0]; if (f) S2.openImport(f); e.target.value = ''; } });
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Sauvegarde'), h('div', { class: 'panel form' }, h('p', { class: 'muted sm' }, `Tes données restent sur ce téléphone, rien n’est envoyé sur internet.${d.meta.lastBackup ? ` Dernière sauvegarde le ${fmtDateShort(d.meta.lastBackup)}.` : ''}`),
    btn('Télécharger une sauvegarde', { class: 'btn soft block', onclick: exportBackup }, 'download'), btn('Importer une sauvegarde', { class: 'btn soft block', onclick: () => file.click() }, 'upload'), file,
    btn('Annuler le dernier import', { class: 'btn link', onclick: () => S2.restorePre() }))));
  el.append(h('section', { class: 'sec' }, h('h2', null, 'Application'), h('div', { class: 'panel form' },
    nav.installPrompt ? btn('Installer l’application', { class: 'btn primary block', onclick: async () => { nav.installPrompt.prompt(); await nav.installPrompt.userChoice.catch(() => {}); nav.installPrompt = null; nav.render(); } }, 'download') : null,
    h('p', { class: 'muted sm' }, `Mon Frigo ${VERSION}, ${S.cat.list.filter(r => !r.custom).length} recettes. Les recettes « Classique » sont écrites à la main, les « Idées composées » assemblées à partir de vrais temps de cuisson. Aucune n’a été testée en cuisine : goûte et ajuste. L’indice d’équilibre est indicatif.`),
    btn('Revoir l’accueil de bienvenue', { class: 'btn link', onclick: () => S2.openOnboarding() }),
    btn('Effacer toutes mes données', { class: 'btn link danger-text', onclick: async () => { if (await confirmSheet({ title: 'Tout effacer ?', text: 'Stock, courses, planning, historique, favoris et recettes perso seront supprimés de ce téléphone. Télécharge une sauvegarde avant si tu veux les garder.', ok: 'Tout effacer', danger: true })) { await resetAll(); toast('Données effacées'); nav.go('home'); setTimeout(() => S2.openOnboarding(), 400); } } }))));
  return el;
}

// ================= RECHERCHE GLOBALE =================
export function openGlobalSearch() {
  const inp = h('input', { class: 'input search', type: 'search', placeholder: 'Recette, produit, ingrédient…', 'aria-label': 'Recherche globale' }); const res = h('div', { class: 'stack' });
  const draw = () => {
    clear(res); const q = inp.value.trim(); if (!q) { res.append(h('p', { class: 'muted sm' }, 'Cherche un ingrédient, par exemple « courgette », pour voir les recettes qui l’utilisent.')); return; }
    const n = norm(q), stock = S.data.stock.filter(x => norm(x.name).includes(n)).slice(0, 5), recs = search(S.cat, q).filter(r => r.custom || allowed(r, S.data.prefs, kb)).slice(0, 8), ings = kb.suggest(q, 3);
    if (stock.length) res.append(h('h3', { class: 'group-title' }, 'Dans ton stock'), h('div', { class: 'list' }, stock.map(it => h('button', { type: 'button', class: 'item', onclick: () => { s.close(); setTimeout(() => S1.openStockItem(it.id), 250); } }, h('span', { class: 'bullet' }, emo(it)), h('span', { class: 'grow t' }, it.name), h('span', { class: 'muted sm' }, fmtQty(it.qty, it.unit))))));
    if (recs.length) res.append(h('h3', { class: 'group-title' }, 'Recettes'), h('div', { class: 'list' }, recs.map(r => h('button', { type: 'button', class: 'item', onclick: () => { s.close(); setTimeout(() => S2.openRecipe(r.id), 250); } }, plate(r, kb, 'xs'), h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, r.t), h('span', { class: 's' }, `${r.m} min, ${r.c.toLowerCase()}`))))));
    if (ings.length) res.append(h('h3', { class: 'group-title' }, 'Ajouter'), h('div', { class: 'list' }, ings.map(i => h('div', { class: 'item static' }, h('span', { class: 'bullet' }, i.emoji), h('span', { class: 'grow t' }, i.n), btn('Stock', { class: 'btn tonal sm', onclick: () => { s.close(); setTimeout(() => S1.openAddStock({ name: i.n }), 250); } }), btn('Courses', { class: 'btn tonal sm', onclick: () => { A.addShop({ ing: i.id, name: i.n }); toast(`${i.n} ajouté aux courses`); } })))));
    if (!stock.length && !recs.length && !ings.length) res.append(empty('🔍', 'Aucun résultat', `Rien pour « ${q} ».`, btn(`Ajouter « ${q} » au stock`, { class: 'btn soft', onclick: () => { s.close(); setTimeout(() => S1.openAddStock({ name: q }), 250); } }, 'plus')));
  };
  inp.addEventListener('input', draw); draw();
  const s = openSheet({ title: 'Rechercher', size: 'tall', content: h('div', { class: 'form' }, inp, res) }); setTimeout(() => inp.focus(), 300);
}
