// Les écrans de l'application (design v2).
import { h, btn, chip, seg, empty, clear, toast, confirmSheet, stepper, haptic, openSheet, plate, meta, tint } from './ui.js';
import { icon } from './icons.js';
import { S, set, setPref, mutate, ctx, exportAll, resetAll, VERSION } from './state.js';
import * as A from './actions.js';
import { ZONES, status, statusText, expiringSoon, sortStock } from './stock.js';
import { score, allowed, search, seasonal, MOMENTS, inMoment, cuisineFamily, missingEquip } from './recipes.js';
import { SLOTS, clearFridge, dishEmoji } from './plan.js';
import { fmtQty, toGrams } from './units.js';
import { todayISO, fmtDateLong, fmtDateShort, money, daysBetween, norm } from './util.js';
import { nav, RUI, resetRUI, SUI, PUI } from './nav.js';
import { pantryEditor, pantryNow, pantrySummary, openPantry, PANTRY_HELP } from './pantry.js';
import { kitchenView } from './kitchen.js';
import { equipEditor, equipSummary, openEquipment, withArticle, EQUIP_HELP } from './equipment.js';
import { seasonSection } from './season.js';
import { meButton, profileCard, cuisineEmoji as kitchenEmoji } from './profile.js';
import { enableNotifications, checkExpiry } from './notify.js';
import { AMBS, MODES, SEASONS, seasonOf, swatch, current as themeNow, tx, greeting, tagline, celebrate, homeScene, sceneTap, pageBand, sunTimes, lightWindow, hhmm } from './theme.js';
import { learnSkip, habitualProducts, forgetAll, learnBought } from './habits.js';
import { openAssistant, learnedLines } from './assistant.js';
import { mascotEl } from './mascot.js';
import { openGuide } from './guide.js';
import { openImport, openOnboarding, restorePre } from './onboarding.js';
import { openQuickMeal, openSlotMenu } from './plan-sheets.js';
import { openReceiptScan } from './receipt-sheets.js';
import { openCook, openCustomRecipe, openFilters, openHistoryEntry, openRecipe } from './recipe-sheets.js';
import { openAddShop, openShopItem, openShopToStock } from './shop-sheets.js';
import { openAddStock, openExportStock, openQuickAdd, openStockItem } from './stock-sheets.js';

// iPhone ou iPad (l'installation se fait par Safari → Partager → Sur l'écran d'accueil)
const IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const kb = S.kb;
const RAYONS = [['Fruits & légumes', '🥕'], ['Viandes & poissons', '🥩'], ['Crèmerie & œufs', '🧀'], ['Boulangerie', '🥖'], ['Épicerie', '🥫'], ['Condiments & épices', '🧂'], ['Surgelés', '❄️'], ['Divers', '🛍️']];
// avant 10 h : petits-déjeuners ; ensuite : vrais repas (pas de dessert ni de petit-déjeuner)
const mealOk = (r, morning) => morning ? r.mt.includes('Petit-déjeuner') : (r.c !== 'Desserts' && r.c !== 'Petit-déjeuner' && r.mt.some(x => x === 'Déjeuner' || x === 'Dîner'));
const shortStatus = (it, t) => { const s = status(it, t); if (s.key === 'none') return ['Sans date', 'none']; if (s.days < 0) return ['Expiré', 'expired']; if (s.days === 0) return ["Aujourd'hui", 'urgent']; if (s.days === 1) return ['Demain', 'urgent']; return [s.days <= 30 ? `${s.days} jours` : fmtDateShort(it.expiry), s.key]; };
const emo = it => (it.ing && kb.get(it.ing) ? kb.get(it.ing).emoji : it.unit === 'portion' ? '🥡' : '🍽️');
const meBtn = () => meButton(nav.tab === 'me');
const searchBtn = () => h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Rechercher', onclick: openGlobalSearch }, icon('search', 22));
export function head(title, sub, ...actions) {
  const band = pageBand(), el = h('header', { class: 'head' + (band ? ' banded' : '') }, h('div', { class: 'titles' }, h('h1', null, title), sub ? h('p', { class: 'sub' }, sub) : null), h('div', { class: 'head-actions' }, ...actions, meBtn()));
  if (band) { const b = h('div', { class: 'page-band' }); b.innerHTML = band; el.prepend(b); }
  return el;
}
function secHead(title, action) { return h('div', { class: 'sec-head' }, h('h2', null, title), action || null); }

function topRecipes(n = 8) {
  const c = ctx(), p = S.data.prefs, morning = new Date().getHours() < 10;
  return S.cat.list.filter(r => allowed(r, p, kb) && mealOk(r, morning)).map(r => ({ r, sc: score(r, p.people || 2, c) })).sort((a, b) => b.sc.score - a.sc.score).slice(0, n);
}
function randomRecipe() { const top = topRecipes(15); if (!top.length) { toast('Aucune recette ne correspond à tes réglages'); return; } const x = top[Math.floor(Math.random() * top.length)]; haptic(10); openRecipe(x.r.id); }
function exportBackup() {
  const data = exportAll(); const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `mon-frigo-${todayISO()}.json` }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  mutate('meta', m => ({ ...m, lastBackup: todayISO() })); toast('Sauvegarde téléchargée');
}

// ================= ACCUEIL =================
let heroIdx = 0;
// saison du thème « Saisons », écrite dans la ligne de la date avec un petit dessin assorti
const SEASON_ICON = { spring: '<circle cx="8" cy="4.5" r="2.6"/><circle cx="11.3" cy="7" r="2.6"/><circle cx="10" cy="11" r="2.6"/><circle cx="6" cy="11" r="2.6"/><circle cx="4.7" cy="7" r="2.6"/><circle cx="8" cy="8" r="1.8" fill="#fff8d0"/>',
  summer: '<circle cx="8" cy="8" r="3.4"/><path d="M8 1v2.2M8 12.8V15M1 8h2.2M12.8 8H15M3 3l1.6 1.6M11.4 11.4L13 13M3 13l1.6-1.6M11.4 4.6L13 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  autumn: '<path d="M8 1.5c1 2 3.6 2.2 5.2 1.6-.4 2 .4 3.6 1.6 4.6-1.8.6-2.4 2-2.2 3.8-1.8-.8-3.2-.4-4 .8L8 15l-.6-2.7c-.8-1.2-2.2-1.6-4-.8.2-1.8-.4-3.2-2.2-3.8 1.2-1 2-2.6 1.6-4.6 1.6.6 4.2.4 5.2-1.6z"/>',
  winter: '<path d="M8 1v14M1.9 4.5l12.2 7M1.9 11.5l12.2-7M6 2.5L8 4.2 10 2.5M6 13.5L8 11.8 10 13.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>' };
function seasonTag() {
  const c = themeNow(); if (c.amb !== 'season') return null; const se = SEASONS.find(x => x[0] === c.season);
  const ic = h('span', { class: 'season-ic', 'aria-hidden': 'true' }); ic.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor">${SEASON_ICON[c.season]}</svg>`;
  return h('span', { class: 'season-tag' }, ic, se[1]);
}
export function viewHome() {
  const t = todayISO(), d = S.data, el = h('div', { class: 'view' });
  const hello = greeting();
  const scene = homeScene(), hd = h('header', { class: 'home-head' + (scene ? ' scened' : '') });
  if (scene) { const sc = h('div', { class: 'home-scene' }); sc.innerHTML = scene; hd.append(sc);
    hd.addEventListener('click', e => { const r = sceneTap(e, sc); if (!r) return; haptic(12); toast(r.text); const found = new Set(S.data.meta.eggs || []); if (!found.has(r.id)) { found.add(r.id); mutate('meta', m => ({ ...m, eggs: [...found] })); } }); }
  el.append(hd); hd.append(h('div', { class: 'titles' }, h('h1', { onclick: logoTap }, hello), h('p', { class: 'home-date' }, fmtDateLong(t), seasonTag())), h('div', { class: 'head-actions' }, h('button', { type: 'button', class: 'icon-btn ask-btn', 'aria-label': 'Demander à mon assistant', title: 'Frigo, ton assistant', onclick: () => openAssistant() }, mascotEl({ size: 34 })), searchBtn(), meBtn()));
  const tg = tagline();
  if (tg && !(tg.q && d.meta.tagHidden === t)) el.append(h('div', { class: 'tagline' + (tg.q ? ' special' : '') }, tg.emoji ? h('span', { class: 'e' }, tg.emoji) : null, h('span', { class: 'grow' }, tg.text),
    tg.q ? btn('Idées', { class: 'btn link sm', onclick: () => { Object.keys(RUI.quick).forEach(k => RUI.quick[k] = false); RUI.cats.clear(); RUI.q = tg.q; nav.go('recipes'); } }) : null));
  if (d.cook && S.cat.get(d.cook.rid)) {
    const r = S.cat.get(d.cook.rid);
    el.append(h('button', { type: 'button', class: 'resume', onclick: () => openCook(r.id, d.cook.serv, { resume: true }) }, h('span', { class: 'pulse' }), h('span', { class: 'grow' }, h('span', { class: 'block strong' }, 'Cuisson en cours'), h('span', { class: 'block s ellipsis' }, `${r.t}, étape ${d.cook.step + 1} sur ${r.p.length}`)), h('span', { class: 'resume-x', role: 'button', tabindex: '0', 'aria-label': 'Arrêter cette cuisson', onclick: async ev => { ev.stopPropagation(); if (await confirmSheet({ title: 'Arrêter la cuisson ?', text: 'Rien ne sera retiré de ton stock.', ok: 'Arrêter' })) { set('cook', null); toast('Cuisson arrêtée'); } } }, icon('x', 18))));
  }
  // --- l'assiette du moment ---
  const slot = A.currentMealSlot(), slotTxt = new Date().getHours() < 10 ? 'ce matin' : slot === 'lunch' ? 'ce midi' : 'ce soir', planned = d.plan[t] && d.plan[t][slot];
  if (planned && !planned.done && S.cat.get(planned.rid)) {
    const r = S.cat.get(planned.rid);
    el.append(h('section', { class: 'hero', style: tint(r) }, h('div', { class: 'hero-top' }, h('div', { class: 'grow' }, h('p', { class: 'kicker' }, tx('planned', { moment: slotTxt })), h('h2', null, r.t)), plate(r, kb, 'lg')),
      meta([['clock', `${r.m} min`], ['users', `${planned.serv} pers.`]]),
      h('div', { class: 'hero-actions' }, btn('Cuisiner', { class: 'btn primary grow', onclick: () => openCook(r.id, planned.serv) }, 'flame'), btn('Voir', { class: 'btn soft', onclick: () => openRecipe(r.id, { serv: planned.serv }) }))));
  } else {
    const top = topRecipes(6);
    if (top.length) {
      const { r, sc } = top[heroIdx % top.length];
      el.append(h('section', { class: 'hero', style: tint(r) },
        h('button', { type: 'button', class: 'hero-top', onclick: () => openRecipe(r.id), 'aria-label': `Voir la recette ${r.t}` }, h('div', { class: 'grow' }, h('p', { class: 'kicker' }, tx('idea', { moment: slotTxt })), h('h2', null, r.t)), plate(r, kb, 'lg')),
        meta([['clock', `${r.m} min`], r.costKnown && r.costPer > 0 ? ['coin', `≈ ${money(r.costPer)} par pers.`] : null]),
        sc.why.length ? h('ul', { class: 'why' }, sc.why.slice(0, 2).map(w => h('li', null, icon('check', 16), h('span', null, w)))) : null,
        h('div', { class: 'hero-actions' }, btn('Voir la recette', { class: 'btn primary grow', onclick: () => openRecipe(r.id) }), btn('', { class: 'btn soft', 'aria-label': 'Autre idée', title: 'Autre idée', onclick: () => { learnSkip(r.id); heroIdx++; haptic(6); nav.render(); } }, 'swap'))));
    }
  }
  // --- raccourcis ---
  const left = d.shop.filter(x => !x.done).length;
  const sc = (ic, label, fn) => h('button', { type: 'button', class: 'sc', onclick: fn }, h('span', { class: 'ring' }, icon(ic, 24)), h('span', null, label));
  el.append(h('div', { class: 'shortcuts' }, sc('plus', 'Ajouter', () => openAddStock()), sc('cart', left ? `Courses (${left})` : 'Courses', () => nav.go('shop')), sc('receipt', 'Scanner un ticket', openReceiptScan), sc('dice', 'Au hasard', randomRecipe)));
  // --- stock ---
  const soon = expiringSoon(d.stock, t, 3);
  // stock vide : rien de plus ici, le raccourci « Ajouter » juste au-dessus suffit
  if (soon.length) el.append(h('section', { class: 'sec' }, secHead(tx('soon'), btn('Idées anti-gaspi', { class: 'btn link', onclick: () => { resetRUI(); RUI.quick.anti = true; nav.go('recipes'); } })),
    h('div', { class: 'hscroll' }, soon.slice(0, 12).map(it => { const [txt, cls] = shortStatus(it, t); return h('button', { type: 'button', class: 'label-card', onclick: () => openStockItem(it.id) }, h('span', { class: 'e' }, emo(it)), h('span', { class: 't ellipsis' }, it.name), h('span', { class: 'tag ' + cls }, txt)); }))));
  // --- aujourd'hui ---
  const today = d.plan[t] || {};
  el.append(h('section', { class: 'sec' }, secHead(tx('today'), btn('Ma semaine', { class: 'btn link', onclick: () => { PUI.start = null; nav.go('plan'); } })), h('div', { class: 'list' }, SLOTS.map(([k, label]) => {
    const e = today[k], r = e && S.cat.get(e.rid);
    const free = e && e.note;
    return h('button', { type: 'button', class: 'mini-slot', onclick: () => r ? openRecipe(r.id, { serv: e.serv }) : free ? openSlotMenu(t, k) : openQuickMeal(t, k) }, h('span', { class: 'when' }, label), r ? plate(r, kb, 'xs') : free ? h('div', { class: 'plate xs', style: { '--pl': '#e6e1ea', '--pd': '#2f2a33' } }, e.leftover ? '🥡' : dishEmoji(e.note)) : null, h('span', { class: 'grow ' + (r || free ? 'strong ellipsis' : 'faint') }, r ? r.t : free ? e.note : 'Rien de prévu'), e && e.done ? h('span', { class: 'tag ok' }, 'Fait') : icon(r || free ? 'right' : 'plus', 18));
  }))));
  // --- de saison ---
  const sea = seasonSection(tx('seasonal')); if (sea) el.append(sea);
  const hint = d.meta.installHint;
  if (!nav.standalone && matchMedia('(pointer: coarse)').matches && !(hint && daysBetween(hint, t) < 30)) {
    const later = () => mutate('meta', m => ({ ...m, installHint: t }));
    el.append(h('div', { class: 'note-card install-card' }, h('span', { class: 'e' }, '📲'), h('div', { class: 'grow stack' }, h('div', null, h('h3', null, 'Installe la vraie application'), h('p', { class: 'muted sm' }, nav.installPrompt
        ? 'Elle s’ouvrira en plein écran, sans Chrome autour, comme Mon Budget.'
        : IOS ? 'Sur iPhone : touche ⋯ à droite de l’adresse (ou le bouton Partager, le carré avec une flèche), puis Partager → « Sur l’écran d’accueil », laisse « Ouvrir comme app web » activé et touche Ajouter. L’app aura son icône et marchera sans internet.'
        : 'Tu utilises Mon Frigo dans Chrome. Menu ⋮ puis « Installer l’application » (pas « Ajouter à l’écran d’accueil », qui crée un simple raccourci). Si Chrome dit qu’elle est déjà installée : Paramètres → Applications → Mon Frigo → Désinstaller, puis recommence.')),
      h('div', { class: 'row gap' }, nav.installPrompt ? btn('Installer', { class: 'btn primary sm', onclick: async () => { nav.installPrompt.prompt(); const c = await nav.installPrompt.userChoice.catch(() => null); nav.installPrompt = null; if (c && c.outcome === 'accepted') later(); nav.render(); } }, 'download') : null, btn(nav.installPrompt ? 'Plus tard' : 'Compris', { class: 'btn soft sm', onclick: later })))));
  }
  const lb = d.meta.lastBackup; if ((d.stock.length + d.history.length + d.custom.length) > 5 && daysBetween(d.meta.created || t, t) >= 7 && (!lb || daysBetween(lb, t) > 30)) el.append(h('div', { class: 'note-card' }, h('span', { class: 'e' }, '💾'), h('div', { class: 'grow stack' }, h('div', null, h('h3', null, 'Pense à sauvegarder'), h('p', { class: 'muted sm' }, 'Tes données ne sont que sur ce téléphone. Une sauvegarde te protège si tu en changes.')), btn('Télécharger une sauvegarde', { class: 'btn soft sm', onclick: exportBackup }, 'download'))));
  return el;
}

// ================= STOCK =================
export function viewStock() {
  const t = todayISO(), el = h('div', { class: 'view' }), list = h('div', { class: 'stack' });
  const st = S.data.stock, nSoon = st.filter(x => ['urgent', 'soon'].includes(status(x, t).key)).length, nExp = st.filter(x => status(x, t).key === 'expired').length;
  const sub = st.length ? `${st.length} ${st.length > 1 ? tx('stock.many') : tx('stock.one')}${nSoon ? `, ${nSoon} à consommer vite` : ''}` : 'Ton frigo est vide pour l’instant';
  el.append(head('Stock', sub, st.length ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Exporter mon stock', title: 'Exporter mon stock', onclick: openExportStock }, icon('download', 22)) : null, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Scanner un ticket de caisse', title: 'Scanner un ticket', onclick: openReceiptScan }, icon('receipt', 22))));
  // deux façons de voir le même stock : la liste détaillée, ou ta cuisine dessinée
  const view = S.data.prefs.stockView === 'kitchen' && st.length ? 'kitchen' : 'list';
  if (st.length) el.append(h('div', { class: 'stock-switch' }, seg([['list', '📋 Liste'], ['kitchen', '🏠 Ma cuisine']], view, v => { haptic(6); setPref({ stockView: v }); })));
  if (view === 'kitchen') {
    el.append(kitchenView(openStockItem, openPantry, () => openEquipment()));
    el.classList.add('has-fab'); el.append(h('button', { type: 'button', class: 'fab', 'aria-label': 'Ajouter un produit', onclick: () => openAddStock() }, icon('plus', 26)));
    return el;
  }
  if (st.length) {
    const q = h('input', { class: 'input search', type: 'search', placeholder: 'Chercher un produit', value: SUI.q, 'aria-label': 'Rechercher dans le stock' }); q.addEventListener('input', () => { SUI.q = q.value; draw(); });
    const cnt = z => st.filter(x => z === 'all' || x.zone === z).length;
    const tabs = h('div', { class: 'tabs', role: 'tablist' }, [['all', 'Tout'], ...ZONES.map(z => [z.id, ({ congelateur: 'Congélo' })[z.id] || z.label])].map(([id, l]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(SUI.zone === id), class: SUI.zone === id ? 'on' : '', onclick: () => { SUI.zone = id; nav.render(); } }, l, cnt(id) ? h('span', { class: 'n' }, cnt(id)) : null)));
    el.append(h('div', { class: 'stack' }, q, tabs));
    const sortSel = h('select', { class: 'chip chip-select', 'aria-label': 'Trier le stock', onchange: e => setPref({ stockSort: e.target.value }) },
      [['zone', 'Trier : par zone'], ['date', 'Trier : date limite'], ['name', 'Trier : nom (A → Z)'], ['added', 'Trier : ajout récent']].map(([v, l]) => h('option', { value: v, selected: v === (S.data.prefs.stockSort || 'zone') }, l)));
    el.append(h('div', { class: 'chips scroll' }, sortSel, nSoon ? chip(`À consommer vite`, SUI.chip === 'soon', () => { SUI.chip = SUI.chip === 'soon' ? '' : 'soon'; nav.render(); }) : null, nExp ? chip(`Expirés (${nExp})`, SUI.chip === 'exp', () => { SUI.chip = SUI.chip === 'exp' ? '' : 'exp'; nav.render(); }) : null));
  }
  if (SUI.chip === 'exp' && nExp) el.append(btn(`Tout jeter (${nExp} périmé${nExp > 1 ? 's' : ''})`, { class: 'btn soft block danger-text', onclick: () => { const r = A.discardExpired(); if (r) { SUI.chip = ''; toast(`${r.n} produit${r.n > 1 ? 's' : ''} jeté${r.n > 1 ? 's' : ''}, noté${r.n > 1 ? 's' : ''} dans le journal`, { undo: r.undo }); } } }, 'trash'));
  el.append(list);
  el.append(h('button', { type: 'button', class: 'pan-card', onclick: openPantry }, h('span', { class: 'pan-card-e' }, '🧂'), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, 'Toujours chez toi'), h('span', { class: 'muted sm block ellipsis' }, pantrySummary())), h('span', { class: 'btn link sm' }, 'Modifier')));
  function draw() {
    clear(list); let items = st.slice();
    if (SUI.q.trim()) { const n = norm(SUI.q); items = items.filter(x => norm(x.name).includes(n)); }
    if (SUI.zone !== 'all') items = items.filter(x => x.zone === SUI.zone);
    if (SUI.chip === 'soon') items = items.filter(x => ['urgent', 'soon'].includes(status(x, t).key)); if (SUI.chip === 'exp') items = items.filter(x => status(x, t).key === 'expired');
    if (!st.length) { list.append(empty('🧺', tx('stock.empty.t'), tx('stock.empty.s'), h('div', { class: 'row gap' }, btn('Ajout rapide', { class: 'btn primary', onclick: openQuickAdd }, 'wand'), btn('Un produit', { class: 'btn soft', onclick: () => openAddStock() }, 'plus')))); return; }
    if (!items.length) { list.append(empty('🔍', 'Aucun produit ici', SUI.q ? `Rien ne correspond à « ${SUI.q} ».` : 'Cette zone est vide.', SUI.q ? btn(`Ajouter « ${SUI.q} »`, { class: 'btn soft', onclick: () => openAddStock({ name: SUI.q }) }, 'plus') : null)); return; }
    const sort = S.data.prefs.stockSort || 'zone';
    const row = (it, showZone) => { const [txt, cls] = shortStatus(it, t); const z = ZONES.find(x => x.id === it.zone);
      return h('button', { type: 'button', class: 'item', onclick: () => openStockItem(it.id) }, h('span', { class: 'bullet' }, emo(it)), h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, it.name), h('span', { class: 's' }, fmtQty(it.qty, it.unit) + (showZone && z ? `, ${z.label.toLowerCase()}` : ''))), h('span', { class: 'tag ' + cls, title: statusText(it, t) }, txt)); };
    if (sort !== 'zone') {
      const cmp = sort === 'name' ? (a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base', numeric: true })
        : sort === 'added' ? (a, b) => (b.added || '').localeCompare(a.added || '') || st.indexOf(b) - st.indexOf(a)
        : (a, b) => sortStock(a, b);
      list.append(h('div', { class: 'list' }, items.sort(cmp).map(it => row(it, SUI.zone === 'all')))); return;
    }
    const zones = SUI.zone === 'all' ? ZONES : ZONES.filter(z => z.id === SUI.zone);
    for (const z of zones) {
      const zi = items.filter(x => x.zone === z.id).sort(sortStock); if (!zi.length) continue;
      if (SUI.zone === 'all') list.append(h('h3', { class: 'group-title' }, z.label, h('span', { class: 'n' }, zi.length)));
      list.append(h('div', { class: 'list' }, zi.map(it => row(it, false))));
    }
  }
  draw();
  el.classList.add('has-fab'); el.append(h('button', { type: 'button', class: 'fab', 'aria-label': 'Ajouter un produit', onclick: () => openAddStock() }, icon('plus', 26)));
  return el;
}

// ================= RECETTES =================
// une seule ligne de « moments » (plats, entrées, apéro…), quelques puces rapides, le reste dans « Filtres »
const QUICK = [['cook', 'Faisable maintenant'], ['anti', 'Anti-gaspi'], ['fast', 'Rapide'], ['veg', 'Végé'], ['season', 'De saison'], ['fav', 'Favoris']];
const filterCount = () => RUI.cats.size + RUI.cuis.size + (RUI.maxTime ? 1 : 0) + (RUI.sort !== 'perso' ? 1 : 0) + ['chef', 'mine', 'cheap', 'never'].filter(k => RUI.quick[k]).length;
function computeRecipes() {
  const p = S.data.prefs, c = ctx(); let list = RUI.q.trim() ? search(S.cat, RUI.q) : S.cat.list.slice();
  // une recette qui demande un appareil absent reste dans la liste, grisée et rangée à la fin
  list = list.filter(r => r.custom || allowed(r, p, kb, true));
  if (RUI.kitchen) list = list.filter(r => r.k === RUI.kitchen);
  const Q = RUI.quick;
  if (RUI.moment !== 'all') list = list.filter(r => inMoment(r, RUI.moment));
  if (Q.fast) list = list.filter(r => r.m <= 20); if (Q.chef) list = list.filter(r => r.d !== 'Facile' || (r.g || []).includes('week-end')); if (Q.season) { const mo = parseInt(todayISO().slice(5, 7)); list = list.filter(r => seasonal(r, kb, mo)); } if (Q.veg) list = list.filter(r => r.veg); if (Q.fav) list = list.filter(r => S.data.fav.includes(r.id)); if (Q.mine) list = list.filter(r => r.custom);
  if (Q.cheap) list = list.filter(r => r.costKnown && r.costPer <= 1.5);
  if (Q.never) { const done = new Set(S.data.history.map(x => x.rid)); list = list.filter(r => !done.has(r.id)); }
  if (RUI.cats.size) list = list.filter(r => RUI.cats.has(r.c)); if (RUI.cuis.size) list = list.filter(r => RUI.cuis.has(cuisineFamily(r))); if (RUI.maxTime) list = list.filter(r => r.m <= RUI.maxTime);
  let sc = list.map(r => ({ r, sc: score(r, p.people || 2, c), lock: r.custom ? [] : missingEquip(r, p) }));
  if (Q.cook) sc = sc.filter(x => !x.lock.length && x.sc.cov.all && x.sc.cov.total > 0); if (Q.anti) sc = sc.filter(x => !x.lock.length && x.sc.cov.expiringUsed.length > 0);
  if (RUI.sort === 'rapide') sc.sort((a, b) => a.r.m - b.r.m); else if (RUI.sort === 'eco') sc.sort((a, b) => a.r.costPer - b.r.costPer); else if (RUI.sort === 'az') sc.sort((a, b) => a.r.t.localeCompare(b.r.t, 'fr')); else if (!RUI.q.trim()) sc.sort((a, b) => b.sc.score - a.sc.score);
  return [...sc.filter(x => !x.lock.length), ...sc.filter(x => x.lock.length)];
}
function recCard({ r, sc, lock }) {
  const cov = sc.cov, fav = S.data.fav.includes(r.id);
  let covEl = null;
  if (lock && lock.length) covEl = h('div', { class: 'cov lock' }, icon('lock', 13), `Il faut ${withArticle(lock)}`);
  else if (cov.expiringUsed.length && !cov.all) covEl = h('div', { class: 'cov anti' }, h('span', { class: 'dot' }), 'Anti-gaspi');
  else if (cov.total && cov.all) covEl = h('div', { class: 'cov good' }, h('span', { class: 'dot' }), cov.subs ? `Tout est là (${cov.subs} remplacé${cov.subs > 1 ? 's' : ''})` : 'Tout est là');
  else if (cov.total && cov.ok > 0) covEl = h('div', { class: 'cov ' + (cov.missing.length <= 2 ? 'mid' : '') }, h('span', { class: 'dot' }), cov.missing.length === 1 ? `Il manque ${kb.name(cov.missing[0].id, '').toLowerCase()}` : `Il manque ${cov.missing.length} ingrédients`);
  const heart = h('button', { type: 'button', class: 'heart' + (fav ? ' on' : ''), 'aria-label': fav ? 'Retirer des favoris' : 'Ajouter aux favoris', 'aria-pressed': String(fav), onclick: e => { e.stopPropagation(); A.toggleFav(r.id); haptic(8); } }, icon('heart', 20));
  if (fav) heart.querySelector('svg').setAttribute('fill', 'currentColor');
  return h('div', { class: 'rec' + (lock && lock.length ? ' locked' : ''), role: 'button', tabindex: '0', onclick: () => openRecipe(r.id), onkeydown: e => { if (e.key === 'Enter') openRecipe(r.id); } }, plate(r, kb, 'lg'), heart,
    h('div', { class: 'strong clamp3' }, r.t), meta([['clock', `${r.m} min`], r.custom ? ['edit', 'Perso'] : null]), covEl);
}
export function viewRecipes() {
  const el = h('div', { class: 'view' }), list = h('div', { class: 'rgrid' }), countEl = h('p', { class: 'count-line' });
  el.append(head('Recettes', null, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Je ne sais pas quoi manger : une recette au hasard', title: 'Au hasard', onclick: randomRecipe }, icon('dice', 22)), h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Créer ma recette', title: 'Créer ma recette', onclick: () => openCustomRecipe() }, icon('plus', 24))));
  const q = h('input', { class: 'input search', type: 'search', placeholder: 'Un plat, un ingrédient…', value: RUI.q, 'aria-label': 'Rechercher une recette' });
  let tm; q.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { RUI.q = q.value; RUI.shown = 30; draw(); }, 120); });
  const moments = h('div', { class: 'moments', role: 'radiogroup', 'aria-label': 'Moment du repas' }, MOMENTS.map(([k, e, l]) => h('button', { type: 'button', role: 'radio', 'aria-checked': String(RUI.moment === k), class: 'mo' + (RUI.moment === k ? ' on' : ''), onclick: () => { RUI.moment = k; RUI.shown = 30; haptic(5); nav.render(); } }, h('span', { class: 'mo-e', 'aria-hidden': 'true' }, e), h('span', { class: 'mo-l' }, l))));
  const nf = filterCount();
  const chips = h('div', { class: 'chips scroll' }, RUI.kitchen ? h('button', { type: 'button', class: 'chip on', 'aria-label': `Cuisine ${RUI.kitchen}, retirer ce filtre`, onclick: () => { RUI.kitchen = ''; RUI.shown = 30; nav.render(); } }, `${kitchenEmoji(RUI.kitchen)} ${RUI.kitchen} ✕`) : null, btn(nf ? `Filtres (${nf})` : 'Filtres', { class: 'chip' + (nf ? ' on' : ''), onclick: () => openFilters(() => { RUI.shown = 30; nav.render(); }) }, 'filter'), QUICK.map(([k, l]) => chip(l, RUI.quick[k], () => { RUI.quick[k] = !RUI.quick[k]; RUI.shown = 30; nav.render(); })));
  const more = h('div');
  el.append(h('div', { class: 'stack' }, q, moments, chips), countEl, list, more);
  let io;
  function draw() {
    clear(list); clear(more); const all = computeRecipes(), any = RUI.q || RUI.kitchen || RUI.moment !== 'all' || nf || Object.values(RUI.quick).some(Boolean);
    const locked = all.filter(x => x.lock.length), ok = all.length - locked.length, miss = [...new Set(locked.flatMap(x => x.lock))];
    clear(countEl);
    if (ok || !locked.length) countEl.append(`${ok} recette${ok > 1 ? 's' : ''}${RUI.quick.cook && !S.data.stock.length ? ' : ajoute des produits pour voir ce qui est faisable' : ''}`);
    if (locked.length) countEl.append(`${ok ? ' · ' : ''}${locked.length} grisée${locked.length > 1 ? 's' : ''} : il faut ${withArticle(miss)} (`, h('button', { type: 'button', class: 'linkish', onclick: () => openEquipment() }, 'mon équipement'), ')');
    if (any) countEl.append(' · ', h('button', { type: 'button', class: 'linkish', onclick: () => { resetRUI(); nav.render(); } }, 'tout effacer'));
    if (!all.length) { list.replaceWith(list); more.append(empty('🍳', 'Aucune recette', RUI.quick.cook ? 'Rien n’est faisable à 100 % avec ton stock. Essaie « Anti-gaspi » ou retire « Faisable ».' : 'Change ta recherche ou tes filtres.', btn('Tout réinitialiser', { class: 'btn soft', onclick: () => { resetRUI(); nav.render(); } }))); return; }
    for (const x of all.slice(0, RUI.shown)) list.append(recCard(x));
    if (all.length > RUI.shown) { const b = btn(`Voir plus de recettes (${all.length - RUI.shown})`, { class: 'btn soft block more', onclick: () => { RUI.shown += 30; draw(); } }); more.append(b); if ('IntersectionObserver' in window) { io && io.disconnect(); io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); RUI.shown += 30; draw(); } }, { rootMargin: '400px' }); io.observe(b); } }
  }
  draw(); return el;
}

// ================= SEMAINE : voir week.js =================
export function openClearFridge() {
  const res = clearFridge(S.cat, ctx(), 3);
  const intro = !S.data.stock.length ? 'Ton stock est vide : ajoute des produits pour que je puisse t’aider à le vider.'
    : !res.urgent ? 'Rien ne presse dans ton frigo. Voici ce que tu peux cuisiner avec ce que tu as déjà.'
    : !res.covered ? `Aucune recette n’utilise ${res.urgent > 1 ? 'tes produits qui vont périmer' : 'ton produit qui va périmer'} (${res.urgentNames.join(', ').toLowerCase()}). Voici ce que tu peux cuisiner avec ce que tu as déjà.`
    : res.urgent === 1 ? `${res.chosen.length > 1 ? 'Ces recettes utilisent' : 'Cette recette utilise'} ton produit qui va périmer dans les 5 jours (${res.urgentNames[0].toLowerCase()}).`
    : `Ces recettes utilisent ${res.covered} de tes ${res.urgent} produits qui vont périmer dans les 5 jours.`;
  const rows = res.chosen.map(({ r, uses, missing }) => h('button', { type: 'button', class: 'rec-row', onclick: () => { s.close(); setTimeout(() => openRecipe(r.id), 260); } }, plate(r, kb, 'sm'),
    h('div', { class: 'grow' }, h('div', { class: 't' }, r.t), uses.length ? h('div', { class: 'why-line' }, 'Utilise : ' + uses.join(', ').toLowerCase()) : null, h('div', { class: 'muted sm' }, `${r.m} min` + (missing ? `, il manque ${missing} produit${missing > 1 ? 's' : ''}` : ', tu as tout'))), icon('right', 18)));
  const s = openSheet({ title: 'Vider le frigo', size: 'tall', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, intro), h('div', { class: 'picker-list' }, rows.length ? rows : empty('🧊', 'Aucune idée', 'Ajoute quelques produits à ton stock.'))),
    footer: res.chosen.length ? btn('Ajouter ces repas à ma semaine', { class: 'btn primary block', onclick: () => { const r = A.planInNextSlots(res.chosen.map(x => x.r.id)); s.close(); toast(`${r.placed} repas ajoutés dans tes prochains créneaux libres`, { undo: () => set('plan', r.before) }); } }, 'calendar') : null });
}

// ================= COURSES =================
function shopPrice(x) { if (x.price > 0) return x.price; const k = x.ing && kb.get(x.ing); if (!k || !k.price || !x.qty) return null; const g = toGrams(k, x.qty, x.unit); return g == null ? null : g / 1000 * k.price; }
export function viewShop() {
  const el = h('div', { class: 'view' }), list = S.data.shop, todo = list.filter(x => !x.done), done = list.filter(x => x.done);
  const est = todo.reduce((s, x) => s + (shopPrice(x) || 0), 0), budget = S.data.prefs.budget;
  el.append(head('Courses', todo.length ? tx('shop.todo', { n: todo.length, s: todo.length > 1 ? 's' : '' }) : (done.length ? tx('shop.done') : tx('shop.empty')), todo.length ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Partager la liste', title: 'Partager', onclick: shareList }, icon('share', 22)) : null,
    list.length ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Vider toute la liste', title: 'Vider la liste', onclick: () => { const old = S.data.shop.slice(); set('shop', []); toast(`Liste vidée (${old.length} article${old.length > 1 ? 's' : ''})`, { undo: () => set('shop', old) }); } }, icon('trash', 21)) : null));
  if (todo.length && est > 0) el.append(h('div', { class: 'panel budget' }, h('div', { class: 'budget-top' }, h('span', { class: 'big-num' }, `≈ ${Math.round(est)} €`), budget ? h('span', { class: 'muted sm' }, `budget ${budget} € / semaine`) : null), budget ? h('div', { class: 'bar' }, h('i', { class: est > budget ? 'over' : '', style: { width: Math.min(100, est / budget * 100) + '%' } })) : null, h('span', { class: 'faint sm' }, todo.some(x => x.price > 0) ? 'Tes prix saisis, et une estimation pour les autres' : 'Estimation à partir de prix moyens. Ajoute tes prix en touchant un article.')));
  const usual = habitualProducts(8);
  if (usual.length) el.append(h('section', { class: 'stack' }, h('h3', { class: 'group-title' }, 'Tes habituels', h('span', { class: 'n' }, 'touche pour ajouter')), h('div', { class: 'chips scroll' }, usual.map(u => h('button', { type: 'button', class: 'chip', onclick: () => { A.addShop({ name: u.name, ing: u.ing || undefined, qty: u.qty, unit: u.unit, price: u.price }); haptic(8); toast(`Ajouté à la liste : ${u.name}`); } }, icon('plus', 14), u.name)))));
  el.append(h('div', { class: 'week-actions' }, btn('Remplir depuis la semaine', { class: 'btn tonal', 'aria-label': 'Remplir depuis ma semaine', onclick: () => { const r = A.generateShoppingFromPlan(); if (!r.meals) { toast('Aucun repas prévu cette semaine'); return; } toast(r.generated ? `${r.generated} produit${r.generated > 1 ? 's' : ''} ajouté${r.generated > 1 ? 's' : ''} ou mis à jour` : 'Ton stock couvre déjà la semaine'); } }, 'calendar'), btn('Scanner le ticket', { class: 'btn tonal', 'aria-label': 'J’ai fait les courses : scanner le ticket', onclick: openReceiptScan }, 'receipt')));
  el.classList.add('has-fab'); el.append(h('button', { type: 'button', class: 'fab' + (done.length ? ' raised' : ''), 'aria-label': 'Ajouter un article', onclick: () => openAddShop() }, icon('plus', 26)));
  if (!list.length) { el.append(empty('🛒', 'Rien à acheter', 'Ajoute des produits, ou remplis la liste depuis ta semaine : ce que tu as déjà est déduit automatiquement.')); return el; }
  const toggle = x => { haptic(8); mutate('shop', l => l.map(y => y.id === x.id ? { ...y, done: !y.done } : y)); };
  const row = x => h('div', { class: 'shop-item' + (x.done ? ' done' : '') }, h('button', { type: 'button', class: 'cb' + (x.done ? ' on' : ''), role: 'checkbox', 'aria-checked': String(x.done), 'aria-label': (x.done ? 'Décocher ' : 'Cocher ') + x.name, onclick: () => toggle(x) }, x.done ? icon('check', 16) : null),
    h('button', { type: 'button', class: 'grow txt', onclick: () => openShopItem(x.id) }, h('span', { class: 't block' }, x.name), x.qty ? h('span', { class: 'muted sm' }, fmtQty(x.qty, x.unit)) : null), x.price > 0 ? h('span', { class: 'price' }, money(x.price)) : null);
  for (const [ray, e] of RAYONS) { const items = todo.filter(x => (x.cat || 'Divers') === ray); if (items.length) el.append(h('section', { class: 'stack' }, h('h3', { class: 'group-title' }, `${e} ${ray}`, h('span', { class: 'n' }, items.length)), h('div', { class: 'list' }, items.map(row)))); }
  const known = RAYONS.map(r => r[0]), other = todo.filter(x => !known.includes(x.cat || 'Divers')); if (other.length) el.append(h('div', { class: 'list' }, other.map(row)));
  if (done.length) {
    el.append(h('section', { class: 'stack' }, h('h3', { class: 'group-title' }, 'Dans le panier', h('span', { class: 'n' }, done.length)), h('div', { class: 'list' }, done.map(row))));
    el.append(h('div', { class: 'sticky-bar' }, btn(`Ranger ${done.length} produit${done.length > 1 ? 's' : ''}`, { class: 'btn primary grow', 'aria-label': `Ranger ${done.length} produit${done.length > 1 ? 's' : ''} dans le stock`, onclick: () => openShopToStock(done) }, 'box'), h('button', { type: 'button', class: 'btn tonal', 'aria-label': 'Retirer les articles cochés sans les ranger', title: 'Retirer sans ranger', onclick: () => { const old = S.data.shop.slice(); learnBought(old.filter(x => x.done)); mutate('shop', l => l.filter(x => !x.done)); toast('Articles retirés de la liste', { undo: () => set('shop', old) }); } }, icon('trash', 20))));
  }
  return el;
}
async function shareList() {
  const todo = S.data.shop.filter(x => !x.done); let txt = 'Liste de courses\n';
  for (const [ray] of RAYONS) { const it = todo.filter(x => (x.cat || 'Divers') === ray); if (it.length) txt += `\n${ray}\n` + it.map(x => `- ${x.name}${x.qty ? ' (' + fmtQty(x.qty, x.unit) + ')' : ''}`).join('\n') + '\n'; }
  try { if (navigator.share) { await navigator.share({ title: 'Liste de courses', text: txt }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(txt); toast('Liste copiée, colle-la dans un message'); } catch { toast('Le partage n’est pas disponible sur ce navigateur'); }
}

// ================= THÈMES =================
let logoTaps = 0, logoTimer = null;
function logoTap() {
  logoTaps++; clearTimeout(logoTimer); logoTimer = setTimeout(() => { logoTaps = 0; }, 1600);
  if (logoTaps >= 5) { logoTaps = 0; celebrate(); haptic(30); toast(tx('secret')); if (!S.data.meta.secret) mutate('meta', m => ({ ...m, secret: true })); }
}
function themeSummary(p) {
  const c = themeNow(p), a = AMBS.find(x => x.id === c.amb), sea = c.amb === 'season' ? ` (${SEASONS.find(x => x[0] === c.season)[1].toLowerCase()})` : '';
  const auto = { sun: 'auto avec le soleil', hours: 'auto à tes horaires', phone: 'comme le téléphone' }[p.autoBy || 'sun'];
  return `${a.name}${sea}, ${({ auto, light: 'clair', dark: 'sombre' })[c.mode]}`;
}
// aperçu fidèle : le vrai paysage de l'ambiance, dans le mode clair ou sombre choisi
function ambPreview(id, c) {
  const season = id === 'season' ? (c.season || seasonOf()) : null, sw = swatch(id, season, c.dark);
  const box = h('div', { class: 'tc-prev', style: { background: sw.paper, '--paper': sw.paper } });
  if (id === 'classic') box.append(h('i', { class: 'tc-bar', style: { background: sw.accent } }), h('i', { class: 'tc-card', style: { background: c.dark ? '#1f1a23' : '#fff' } }), h('i', { class: 'tc-card two', style: { background: c.dark ? '#1f1a23' : '#fff' } }));
  else { const art = h('div', { class: 'tc-art' }); art.innerHTML = homeScene({ amb: id, theme: id, season, dark: c.dark }); box.append(art); }
  box.append(h('i', { class: 'tc-pill', style: { background: sw.accent } }));
  return box;
}
// mode Auto : soleil (par défaut), horaires choisis, ou comme le téléphone
function autoOptions(p) {
  const by = p.autoBy || 'sun', sun = sunTimes(), win = lightWindow(p);
  const time = (key, val, label) => h('label', { class: 'time-f' }, h('span', null, label), h('input', { type: 'time', class: 'input', value: val, 'aria-label': label, onchange: e => { if (e.target.value) setPref({ [key]: e.target.value }); } }));
  return h('div', { class: 'auto-box' },
    h('div', { class: 'chips wrap' }, chip('☀️ Avec le soleil', by === 'sun', () => setPref({ autoBy: 'sun' })), chip('🕒 Mes horaires', by === 'hours', () => setPref({ autoBy: 'hours' })), chip('📱 Comme le téléphone', by === 'phone', () => setPref({ autoBy: 'phone' }))),
    by === 'sun' ? h('span', { class: 'hint' }, `Aujourd’hui : clair de ${hhmm(win.on)} à ${hhmm(win.off)} (lever ${hhmm(sun.rise)}, coucher ${hhmm(sun.set)}). Ça suit les saisons tout seul.`)
      : by === 'hours' ? h('div', { class: 'row gap wrap' }, time('lightFrom', p.lightFrom || '07:30', 'Clair à partir de'), time('lightTo', p.lightTo || '19:30', 'Sombre à partir de'))
        : h('span', { class: 'hint' }, 'Suit le réglage clair/sombre de ton téléphone.'));
}
function themePicker(p) {
  const c = themeNow(p);
  const cards = AMBS.map(a => { const on = c.amb === a.id;
    return h('button', { type: 'button', class: 'theme-card' + (on ? ' on' : ''), 'aria-pressed': String(on), 'aria-label': 'Ambiance ' + a.name, onclick: () => { setPref({ amb: a.id }); haptic(8); } },
      ambPreview(a.id, c), h('span', { class: 'tc-name' }, a.name), h('span', { class: 'tc-desc' }, a.desc), on ? h('span', { class: 'tc-check' }, icon('check', 14)) : null); });
  const sea = c.amb === 'season' ? h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quelle saison ?'), h('div', { class: 'chips wrap' },
    chip(`📅 Selon la date (${SEASONS.find(x => x[0] === seasonOf())[1].toLowerCase()})`, !p.season || p.season === 'auto', () => setPref({ season: 'auto' })),
    SEASONS.map(([id, l, e]) => chip(`${e} ${l}`, p.season === id, () => setPref({ season: id }))))) : null;
  return h('div', { class: 'form' },
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Clair ou sombre'), seg(MODES, c.mode, v => setPref({ mode: v })), c.mode === 'auto' ? autoOptions(p) : h('span', { class: 'hint' }, 'Valable pour toutes les ambiances.')),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ambiance'), h('div', { class: 'theme-grid' }, cards)), sea,
    h('label', { class: 'switch-row bare' }, h('span', null, 'Animations du décor'), h('input', { type: 'checkbox', class: 'switch', checked: p.motion !== false, 'aria-label': 'Animations du décor', onchange: e => setPref({ motion: e.target.checked }) })),
    h('p', { class: 'hint' }, 'Chaque ambiance change les couleurs, le paysage de l’accueil, le bandeau des pages et quelques petits textes.'));
}

// ================= MOI =================
const MEUI = { open: new Set() };
function acc(id, emoji, title, summary, content) {
  const open = MEUI.open.has(id);
  const head = h('button', { type: 'button', class: 'acc-head', 'aria-expanded': String(open), onclick: () => { open ? MEUI.open.delete(id) : MEUI.open.add(id); nav.render(); } },
    h('span', { class: 'acc-e' }, emoji), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, title), summary ? h('span', { class: 'muted sm block ellipsis' }, summary) : null), icon(open ? 'down' : 'right', 18));
  return h('div', { class: 'acc' + (open ? ' open' : '') }, head, open ? h('div', { class: 'acc-body' }, content()) : null);
}
async function shareBackup() {
  const data = JSON.stringify(exportAll(), null, 1), name = `mon-frigo-${todayISO()}.json`;
  try { const f = new File([data], name, { type: 'application/json' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'Mes données Mon Frigo' }); mutate('meta', m => ({ ...m, lastBackup: todayISO() })); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  exportBackup(); toast('Envoie ce fichier sur l’autre téléphone, puis importe-le dans Mon Frigo');
}
export function viewMe() {
  const d = S.data, p = d.prefs, t = todayISO(), el = h('div', { class: 'view' }), m = t.slice(0, 7);
  el.append(head('Moi', tx('me.sub')));
  el.append(profileCard());
  const tile = (e, t, sub, fn) => h('button', { type: 'button', class: 'me-tile', onclick: fn }, h('span', { class: 'me-tile-e', 'aria-hidden': 'true' }, e), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, t), h('span', { class: 'muted sm block' }, sub)));
  el.append(h('div', { class: 'me-tiles' }, tile(mascotEl({ size: 30 }), 'Frigo, ton assistant', 'Pose-lui une question', () => openAssistant()), tile('📖', 'Comment ça marche', 'Le guide de l’app', () => openGuide())));
  const tog = (key, label) => h('label', { class: 'switch-row' }, h('span', null, label), h('input', { type: 'checkbox', class: 'switch', checked: !!p[key], 'aria-label': label, onchange: e => setPref({ [key]: e.target.checked }) }));
  const tagEditor = (key, ph) => { const inp = h('input', { class: 'input', placeholder: ph, 'aria-label': ph }); const add = () => { const v = inp.value.split(',').map(x => x.trim()).filter(Boolean); if (v.length) setPref({ [key]: [...new Set([...(p[key] || []), ...v])] }); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    return h('div', { class: 'stack' }, (p[key] || []).length ? h('div', { class: 'chips wrap' }, (p[key] || []).map(v => h('button', { type: 'button', class: 'chip on', 'aria-label': 'Retirer ' + v, onclick: () => setPref({ [key]: p[key].filter(x => x !== v) }) }, v, icon('x', 14)))) : null, h('div', { class: 'row gap' }, inp, h('button', { type: 'button', class: 'btn tonal', style: { flex: 'none' }, 'aria-label': 'Ajouter', onclick: add }, icon('plus', 20)))); };
  const groups = [];
  // alertes
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  groups.push(acc('notif', '🔔', 'Alertes de péremption', p.notify && perm === 'granted' ? 'Activées' : 'Désactivées', () => h('div', { class: 'form' },
    h('p', { class: 'muted sm' }, 'Une notification par jour au maximum quand des produits expirent aujourd’hui ou demain : à l’ouverture de l’app, et en arrière-plan quand Chrome le permet (app installée).'),
    perm === 'unsupported' ? h('p', { class: 'note warn' }, 'Ce navigateur ne permet pas les notifications.') : perm === 'denied' ? h('p', { class: 'note warn' }, 'Les notifications sont bloquées : Paramètres du téléphone → Applications → Mon Frigo (ou Chrome) → Notifications → Autoriser.')
      : h('label', { class: 'switch-row bare' }, h('span', null, 'Me prévenir'), h('input', { type: 'checkbox', class: 'switch', checked: !!(p.notify && perm === 'granted'), 'aria-label': 'Me prévenir des produits qui vont périmer', onchange: async e => { if (e.target.checked) { const r = await enableNotifications(); toast(r === 'granted' ? 'Alertes activées' : 'Alertes non autorisées'); } else setPref({ notify: false }); } })),
    p.notify && perm === 'granted' ? btn('Vérifier maintenant', { class: 'btn soft block', onclick: async () => { const sent = await checkExpiry({ force: true }); toast(sent ? 'Alerte envoyée' : 'Rien n’expire aujourd’hui ni demain 👌'); } }, 'bell') : null)));
  groups.push(acc('prefs', '🍽️', 'Mes préférences', `${p.people} pers., ${p.budget} €/semaine, ${({ omni: 'tout', pesco: 'pesco', veg: 'végé', vegan: 'végan' })[p.diet]}`, () => h('div', { class: 'form' },
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Nombre de personnes par défaut'), stepper(p.people, { min: 1, max: 12, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => setPref({ people: v }) })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Budget courses par semaine'), h('div', { class: 'row gap' }, h('input', { class: 'input', inputmode: 'numeric', value: p.budget, 'aria-label': 'Budget en euros', onchange: e => setPref({ budget: Math.max(0, parseInt(e.target.value) || 0) }) }), h('span', { class: 'muted' }, '€'))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Régime'), seg([['omni', 'Tout'], ['pesco', 'Pesco'], ['veg', 'Végé'], ['vegan', 'Végan']], p.diet, v => setPref({ diet: v }))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'J’aime'), tagEditor('likes', 'Ex. poulet, fromage')),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Je n’en mange pas'), h('span', { class: 'hint' }, 'Les recettes qui en contiennent sont masquées.'), tagEditor('dislikes', 'Ex. champignons')))));
  const restr = [['noPork', 'Sans porc'], ['noGluten', 'Sans gluten'], ['noNuts', 'Sans fruits à coque'], ['noShell', 'Sans crustacés']];
  groups.push(acc('allergies', '🚫', 'Allergies et restrictions', restr.filter(([k]) => p[k]).map(x => x[1]).join(', ') || 'Aucune', () => h('div', { class: 'list flat' }, restr.map(([k, l]) => tog(k, l)))));
  groups.push(acc('equip', '🍳', 'Mon équipement', equipSummary(), () => h('div', { class: 'stack' }, h('p', { class: 'muted sm' }, EQUIP_HELP), equipEditor(() => p.equip || [], l => setPref({ equip: l })))));
  groups.push(acc('staples', '🧂', 'Toujours chez moi', pantrySummary(), () => h('div', { class: 'stack' }, h('p', { class: 'muted sm' }, PANTRY_HELP), pantryEditor(() => pantryNow(), l => setPref({ pantry: l })))));
  const lines = learnedLines();
  groups.push(acc('learned', '🧠', 'Ce que Mon Frigo a appris', lines.length ? `${lines.length} habitude${lines.length > 1 ? 's' : ''} retenue${lines.length > 1 ? 's' : ''}` : 'Rien pour l’instant', () => h('div', { class: 'stack' },
    lines.length ? lines.map(([e, ti, v]) => h('div', { class: 'learn-line' }, h('span', { class: 'e' }, e), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, ti), h('span', { class: 'muted sm' }, v)))) : h('p', { class: 'muted sm' }, 'Plus tu utilises l’app (stock, courses, repas cuisinés, semaine), plus ses idées et ses préremplissages te ressembleront.'),
    btn('Discuter avec mon assistant', { class: 'btn soft block', onclick: () => openAssistant() }, 'sparkle'),
    lines.length ? btn('Tout oublier', { class: 'btn link danger-text', onclick: async () => { if (await confirmSheet({ title: 'Tout oublier ?', text: 'Les habitudes apprises (produits, achats, recettes passées) seront effacées. Ton stock, tes courses et ton historique ne bougent pas.', ok: 'Oublier', danger: true })) { forgetAll(); toast('Habitudes oubliées'); } } }) : null)));
  const hist = d.history.slice().reverse().slice(0, 10);
  groups.push(acc('history', '🕘', 'Derniers repas', hist.length ? `${d.history.length} repas cuisiné${d.history.length > 1 ? 's' : ''}` : 'Aucun pour l’instant', () => h('div', { class: 'stack' },
    hist.length ? [h('p', { class: 'muted sm' }, 'Touche un repas pour l’annuler (les ingrédients reviennent dans le stock).'), h('div', { class: 'list flat' }, hist.map(x => { const r = S.cat.get(x.rid); return h('button', { type: 'button', class: 'item', onclick: () => openHistoryEntry(x.id) }, r ? plate(r, kb, 'xs') : null, h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, x.title), h('span', { class: 's' }, `${fmtDateShort(x.date)}${x.rating ? ', ' + '★'.repeat(x.rating) : ''}`))); }))] : h('p', { class: 'muted sm' }, 'Tes repas cuisinés apparaîtront ici.'))));
  const w = d.waste.slice().reverse().slice(0, 8);
  groups.push(acc('waste', '🗑️', 'Journal anti-gaspi', w.length ? `${d.waste.filter(x => x.date.startsWith(m)).length} produit(s) jeté(s) ce mois-ci` : 'Rien de jeté', () => w.length ? h('div', { class: 'list flat' }, w.map(x => h('div', { class: 'item static' }, h('span', { class: 'bullet' }, (x.ing && kb.get(x.ing) ? kb.get(x.ing).emoji : '🗑️')), h('span', { class: 'grow' }, h('span', { class: 't block' }, x.name), h('span', { class: 's' }, `${fmtQty(x.qty, x.unit)}, ${x.reason.toLowerCase()}`)), h('span', { class: 'faint sm' }, fmtDateShort(x.date))))) : h('p', { class: 'muted sm' }, 'Rien de jeté pour l’instant.')));
  const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: '', onchange: e => { const f = e.target.files[0]; if (f) openImport(f); e.target.value = ''; } });
  groups.push(acc('backup', '💾', 'Sauvegarde et autre téléphone', d.meta.lastBackup ? `Dernière sauvegarde le ${fmtDateShort(d.meta.lastBackup)}` : 'Jamais sauvegardé', () => h('div', { class: 'form' },
    h('p', { class: 'muted sm' }, 'Tes données restent sur ce téléphone, rien n’est envoyé sur internet.'),
    btn('Télécharger une sauvegarde', { class: 'btn soft block', onclick: exportBackup }, 'download'),
    btn('Envoyer vers un autre téléphone', { class: 'btn soft block', onclick: shareBackup }, 'share'),
    h('p', { class: 'hint' }, 'Sur l’autre téléphone : installe Mon Frigo, puis Moi → Sauvegarde → Importer, et choisis « Fusionner » pour additionner les deux frigos ou « Remplacer » pour copier celui-ci.'),
    btn('Importer une sauvegarde', { class: 'btn soft block', onclick: () => file.click() }, 'upload'), file,
    btn('Annuler le dernier import', { class: 'btn link', onclick: () => restorePre() }))));
  groups.push(acc('look', '🎨', 'Apparence', themeSummary(p), () => themePicker(p)));
  groups.push(acc('app', '📱', 'Application', `Version ${VERSION}, ${navigator.onLine ? 'en ligne' : 'hors ligne'}`, () => h('div', { class: 'form' },
    h('div', { class: 'net-line' }, h('span', { class: 'dot ' + (navigator.onLine ? 'on' : 'off') }), h('span', null, navigator.onLine ? 'Connecté à internet' : 'Hors ligne : tout fonctionne quand même, tes données sont sur ton téléphone.')),
    nav.installPrompt ? btn('Installer l’application', { class: 'btn primary block', onclick: async () => { nav.installPrompt.prompt(); await nav.installPrompt.userChoice.catch(() => {}); nav.installPrompt = null; nav.render(); } }, 'download') : null,
    h('p', { class: 'muted sm' }, `Mon Frigo ${VERSION}, ${S.cat.list.filter(r => !r.custom).length} recettes. Les recettes « Classique » sont écrites à la main, les « Idées » sont composées à partir de vrais temps de cuisson. L’indice d’équilibre est indicatif.`),
    btn('Revoir l’accueil de bienvenue', { class: 'btn link', onclick: () => openOnboarding() }),
    btn('Réparer l’application', { class: 'btn link', onclick: async () => { if (await confirmSheet({ title: 'Réparer l’application ?', text: 'Je supprime les fichiers gardés en mémoire et je recharge la dernière version. Tes données (stock, courses, recettes…) sont conservées.', ok: 'Réparer' })) { if (window.__frigoRepair) window.__frigoRepair(); else location.reload(); } } }),
    btn('Effacer toutes mes données', { class: 'btn link danger-text', onclick: async () => { if (await confirmSheet({ title: 'Tout effacer ?', text: 'Stock, courses, planning, historique, favoris et recettes perso seront supprimés de ce téléphone. Télécharge une sauvegarde avant si tu veux les garder.', ok: 'Tout effacer', danger: true })) { await resetAll(); toast('Données effacées'); nav.go('home'); setTimeout(() => openOnboarding(), 400); } } }))));
  el.append(h('div', { class: 'acc-list' }, groups));
  return el;
}

// ================= RECHERCHE GLOBALE =================
function openGlobalSearch() {
  const inp = h('input', { class: 'input search', type: 'search', placeholder: 'Recette, produit, ingrédient…', 'aria-label': 'Recherche globale' }); const res = h('div', { class: 'stack' });
  const draw = () => {
    clear(res); const q = inp.value.trim(); if (!q) { res.append(h('p', { class: 'muted sm' }, 'Cherche un ingrédient, par exemple « courgette », pour voir les recettes qui l’utilisent.')); return; }
    const n = norm(q), stock = S.data.stock.filter(x => norm(x.name).includes(n)).slice(0, 5), recs = search(S.cat, q).filter(r => r.custom || allowed(r, S.data.prefs, kb, true)).slice(0, 8), ings = kb.suggest(q, 3);
    if (stock.length) res.append(h('h3', { class: 'group-title' }, 'Dans ton stock'), h('div', { class: 'list' }, stock.map(it => h('button', { type: 'button', class: 'item', onclick: () => { s.close(); setTimeout(() => openStockItem(it.id), 250); } }, h('span', { class: 'bullet' }, emo(it)), h('span', { class: 'grow t' }, it.name), h('span', { class: 'muted sm' }, fmtQty(it.qty, it.unit))))));
    if (recs.length) res.append(h('h3', { class: 'group-title' }, 'Recettes'), h('div', { class: 'list' }, recs.map(r => h('button', { type: 'button', class: 'item', onclick: () => { s.close(); setTimeout(() => openRecipe(r.id), 250); } }, plate(r, kb, 'xs'), h('span', { class: 'grow' }, h('span', { class: 't block ellipsis' }, r.t), h('span', { class: 's' }, `${r.m} min, ${r.c.toLowerCase()}${!r.custom && missingEquip(r, S.data.prefs).length ? ` · il faut ${withArticle(missingEquip(r, S.data.prefs))}` : ''}`))))));
    if (ings.length) res.append(h('h3', { class: 'group-title' }, 'Ajouter'), h('div', { class: 'list' }, ings.map(i => h('div', { class: 'item static' }, h('span', { class: 'bullet' }, i.emoji), h('span', { class: 'grow t' }, i.n), btn('Stock', { class: 'btn tonal sm', onclick: () => { s.close(); setTimeout(() => openAddStock({ name: i.n }), 250); } }), btn('Courses', { class: 'btn tonal sm', onclick: () => { A.addShop({ ing: i.id, name: i.n }); toast(`Ajouté aux courses : ${i.n}`); } })))));
    if (!stock.length && !recs.length && !ings.length) res.append(empty('🔍', 'Aucun résultat', `Rien pour « ${q} ».`, btn(`Ajouter « ${q} » au stock`, { class: 'btn soft', onclick: () => { s.close(); setTimeout(() => openAddStock({ name: q }), 250); } }, 'plus')));
  };
  inp.addEventListener('input', draw); draw();
  const s = openSheet({ title: 'Rechercher', size: 'tall', content: h('div', { class: 'form' }, inp, res) }); setTimeout(() => inp.focus(), 300);
}
