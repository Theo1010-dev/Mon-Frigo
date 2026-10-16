// Feuilles : stock, courses, planning, ajout rapide, scanner.
import { h, btn, openSheet, confirmSheet, toast, stepper, seg, chip, field, empty, tile, clear, haptic, topSheet } from './ui.js';
import { icon } from './icons.js';
import { S, mutate, ctx } from './state.js';
import * as A from './actions.js';
import { ZONES, status, statusText, zoneLabel } from './stock.js';
import { UNITS_UI, fmtQty, canonUnit } from './units.js';
import { todayISO, addDays, fmtDateLong, norm, dayName, fmtDateShort } from './util.js';
import { score, allowed, search, coverage } from './recipes.js';
import { SLOTS } from './plan.js';
import { nav, RUI, num } from './nav.js';
import { openRecipe } from './sheets2.js';

const kb = S.kb;
const ZSHORT = { frigo: 'Frigo', congelateur: 'Congél.', placard: 'Placard', autre: 'Autre' };
const unitSelect = (value, id) => { const sel = h('select', { id, class: 'input', 'aria-label': 'Unité' }, UNITS_UI.map(u => h('option', { value: u, selected: u === canonUnit(value) }, u))); if (!UNITS_UI.includes(canonUnit(value))) sel.append(h('option', { value: canonUnit(value), selected: true }, canonUnit(value))); return sel; };
const stepFor = u => ({ g: 50, kg: 0.25, ml: 50, cl: 5, l: 0.25 }[canonUnit(u)] || 1);

// ---------- ajout au stock ----------
export function openAddStock({ name = '', onDone } = {}) {
  let zone = 'frigo', ingId = null, expiryAuto = false;
  const nameIn = h('input', { class: 'input', id: 'as-name', placeholder: 'Ex. lait, poulet, courgettes…', autocomplete: 'off', value: name, enterkeyhint: 'next' });
  const sugg = h('div', { class: 'chips scroll' });
  const qty = h('input', { class: 'input', id: 'as-qty', inputmode: 'decimal', placeholder: 'Quantité', value: '1', 'aria-label': 'Quantité' });
  const unit = unitSelect('pièce', 'as-unit');
  const exp = h('input', { class: 'input', id: 'as-exp', type: 'date', 'aria-label': 'Date limite' });
  const none = h('input', { type: 'checkbox', id: 'as-none' });
  const hint = h('div', { class: 'hint', id: 'as-hint' });
  const zoneSeg = h('div'); const drawZone = () => { clear(zoneSeg); zoneSeg.append(seg(ZONES.map(z => [z.id, ZSHORT[z.id]]), zone, v => { zone = v; autoExpiry(); })); };
  function autoExpiry() { const d = A.suggestExpiry(ingId, zone); if (d && (!exp.value || expiryAuto)) { exp.value = d; expiryAuto = true; none.checked = false; hint.textContent = 'Date estimée selon le produit : vérifie l’emballage.'; } else if (!d && expiryAuto) { exp.value = ''; hint.textContent = ''; expiryAuto = false; } sync(); }
  function sync() { exp.disabled = none.checked; if (none.checked) { exp.value = ''; hint.textContent = ''; } }
  function pick(i) { ingId = i.id; nameIn.value = i.n; unit.value = i.u; qty.value = String(i.q2 > 0 && i.u !== 'g' && i.u !== 'cl' ? i.q2 : (i.u === 'g' ? i.q2 * 2 : i.q2)); zone = i.zone; drawZone(); expiryAuto = true; exp.value = ''; autoExpiry(); clear(sugg); haptic(8); qty.focus(); qty.select(); }
  function refreshSugg() {
    clear(sugg); ingId = kb.resolve(nameIn.value) === ingId ? ingId : null; const list = kb.suggest(nameIn.value, 6);
    for (const i of list) if (norm(i.n) !== norm(nameIn.value)) sugg.append(h('button', { type: 'button', class: 'chip', onclick: () => pick(i) }, i.emoji + ' ' + i.n));
  }
  nameIn.addEventListener('input', refreshSugg);
  nameIn.addEventListener('change', () => { const id = kb.resolve(nameIn.value); if (id && id !== ingId) { const i = kb.get(id); ingId = id; if (unit.value === 'pièce' && i.u !== 'pièce') { unit.value = i.u; } zone = i.zone; drawZone(); autoExpiry(); } });
  exp.addEventListener('input', () => { expiryAuto = false; hint.textContent = ''; }); none.addEventListener('change', sync);
  function submit(keep) {
    const nm = nameIn.value.trim(), q = num(qty.value);
    if (!nm) { toast('Indique le nom du produit'); nameIn.focus(); return; }
    if (!(q > 0)) { toast('Indique une quantité supérieure à 0'); qty.focus(); return; }
    const id = ingId || kb.resolve(nm);
    A.addStock({ name: nm, ing: id || undefined, qty: q, unit: unit.value, zone, expiry: none.checked ? null : (exp.value || null) });
    haptic(15); toast(`${nm} ajouté au ${zoneLabel(zone).toLowerCase()}`);
    onDone && onDone();
    if (keep) { nameIn.value = ''; qty.value = '1'; ingId = null; exp.value = ''; hint.textContent = ''; clear(sugg); nameIn.focus(); } else s.close();
  }
  drawZone();
  const body = h('div', { class: 'form' },
    field('Produit', nameIn), sugg,
    h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Où le ranges-tu ?'), zoneSeg),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Date limite'), exp, h('label', { class: 'check' }, none, h('span', null, 'Aucune date limite')), hint));
  const s = openSheet({ title: 'Ajouter au stock', content: body,
    headerRight: ('BarcodeDetector' in window && navigator.mediaDevices) ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Scanner un code-barres', onclick: () => openScanner(r => { if (r.name) { nameIn.value = r.name; const id = kb.resolve(r.name); if (id) pick(kb.get(id)); } }) }, icon('scan', 20)) : null,
    footer: h('div', { class: 'row gap' }, btn('Ajouter et continuer', { class: 'btn ghost grow', onclick: () => submit(true) }), btn('Ajouter', { class: 'btn primary grow', onclick: () => submit(false) })) });
  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const l = kb.suggest(nameIn.value, 1); if (l[0] && !ingId) pick(l[0]); else qty.focus(); } });
  qty.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(false); } });
  if (name) { refreshSugg(); const id = kb.resolve(name); if (id) pick(kb.get(id)); } else setTimeout(() => nameIn.focus(), 300);
  return s;
}

// ---------- ajout rapide (premiers pas) ----------
const COMMON = [['oeufs', 6, 'pièce'], ['lait', 1, 'l'], ['beurre', 250, 'g'], ['creme', 20, 'cl'], ['fromage-rape', 200, 'g'], ['yaourt', 4, 'pot'], ['poulet', 500, 'g'], ['boeuf-hache', 350, 'g'], ['jambon', 4, 'tranche'], ['lardons', 200, 'g'], ['pates', 500, 'g'], ['riz', 1, 'kg'], ['semoule', 500, 'g'], ['pomme-de-terre', 1, 'kg'], ['oignon', 4, 'pièce'], ['ail', 6, 'gousse'], ['carotte', 500, 'g'], ['courgette', 2, 'pièce'], ['tomate', 500, 'g'], ['poivron', 2, 'pièce'], ['champignons', 250, 'g'], ['epinards', 250, 'g'], ['citron', 2, 'pièce'], ['pomme', 4, 'pièce'], ['banane', 4, 'pièce'], ['tomate-concassee', 400, 'g'], ['lentilles', 500, 'g'], ['pois-chiches', 400, 'g'], ['thon', 2, 'boîte'], ['farine', 1, 'kg']];
export function openQuickAdd() {
  const sel = new Set(); const grid = h('div', { class: 'chips wrap' }); const foot = h('div');
  const upd = () => { clear(foot); foot.append(btn(sel.size ? `Ajouter ${sel.size} produit${sel.size > 1 ? 's' : ''}` : 'Choisis des produits', { class: 'btn primary block', disabled: !sel.size, onclick: go })); };
  const draw = () => { clear(grid); for (const [id] of COMMON) { const k = kb.get(id); grid.append(chip(k.emoji + ' ' + k.n, sel.has(id), () => { sel.has(id) ? sel.delete(id) : sel.add(id); haptic(6); draw(); upd(); })); } };
  function go() { for (const [id, q, u] of COMMON) if (sel.has(id)) { const k = kb.get(id); A.addStock({ name: k.n, ing: id, qty: q, unit: u, zone: k.zone, expiry: A.suggestExpiry(id, k.zone) }); } toast(`${sel.size} produits ajoutés`); s.close(); }
  draw(); upd();
  const s = openSheet({ title: 'Ajout rapide', content: h('div', null, h('p', { class: 'muted' }, 'Touche ce que tu as chez toi. Tu pourras ajuster les quantités et les dates ensuite.'), grid), footer: foot });
}

// ---------- fiche d'un produit du stock ----------
export function openStockItem(id) {
  const get = () => S.data.stock.find(x => x.id === id); if (!get()) return;
  const body = h('div', { class: 'form' }); const today = todayISO();
  const draw = () => {
    const it = get(); if (!it) { s.close(); return; } clear(body);
    const st = status(it, today); const k = it.ing && kb.get(it.ing);
    const qs = stepper(it.qty, { min: 0.001, step: stepFor(it.unit), fmt: v => fmtQty(v, it.unit), onChange: v => A.updateStock(id, { qty: v }) });
    const exp = h('input', { type: 'date', class: 'input', value: it.expiry || '', 'aria-label': 'Date limite', onchange: e => { A.updateStock(id, { expiry: e.target.value || null }); draw(); } });
    body.append(
      h('div', { class: 'item-head' }, h('div', { class: 'bullet' }, k ? k.emoji : it.unit === 'portion' ? '🥡' : '🍽️'), h('div', null, h('div', { class: 't' }, it.name), h('span', { class: 'tag ' + st.key }, statusText(it, today)))),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quantité'), qs),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Rangé dans'), seg(ZONES.map(z => [z.id, ZSHORT[z.id]]), it.zone, v => { A.updateStock(id, { zone: v }); toast('Déplacé : ' + zoneLabel(v)); })),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Date limite'), exp, it.expiry ? btn('Retirer la date', { class: 'btn link', onclick: () => { A.updateStock(id, { expiry: null }); draw(); } }) : null),
      h('div', { class: 'grid2' },
        btn('J’en ai utilisé', { class: 'btn tonal', onclick: () => openUse(id, s) }, 'check'),
        btn('Jeter', { class: 'btn tonal', onclick: () => openDiscard(id, s) }, 'trash'),
        btn('Aux courses', { class: 'btn tonal', onclick: () => { A.addShop({ ing: it.ing || undefined, name: it.name, qty: null, unit: it.unit }); toast('Ajouté aux courses'); } }, 'cart'),
        btn('Idées recettes', { class: 'btn tonal', onclick: () => { RUI.q = k ? k.n : it.name; RUI.cats.clear(); Object.keys(RUI.quick).forEach(x => RUI.quick[x] = false); s.close(); setTimeout(() => nav.go('recipes'), 260); } }, 'utensils')),
      btn('Supprimer ce produit', { class: 'btn link danger-text', onclick: () => { A.removeStock(id); s.close(); } }));
  };
  const s = openSheet({ title: 'Produit', content: body }); draw(); return s;
}
function openUse(id, parent) {
  const it = S.data.stock.find(x => x.id === id); if (!it) return;
  const qs = stepper(it.qty, { min: 0.001, max: it.qty, step: stepFor(it.unit), fmt: v => fmtQty(v, it.unit) });
  const s = openSheet({ title: 'Quantité utilisée', size: 'small', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, `Combien de « ${it.name} » as-tu utilisé ?`), qs),
    footer: btn('Retirer du stock', { class: 'btn primary block', onclick: () => { A.useStock(id, qs.get()); toast('Stock mis à jour'); s.close(); if (!S.data.stock.some(x => x.id === id)) parent.close(); } }) });
}
export function openDiscard(id, parent) {
  const it = S.data.stock.find(x => x.id === id); if (!it) return; let reason = A.WASTE_REASONS[0];
  const qs = stepper(it.qty, { min: 0.001, max: it.qty, step: stepFor(it.unit), fmt: v => fmtQty(v, it.unit) });
  const rs = h('div'); const dr = () => { clear(rs); rs.append(h('div', { class: 'chips wrap' }, A.WASTE_REASONS.map(r => chip(r, r === reason, () => { reason = r; dr(); })))); }; dr();
  const s = openSheet({ title: 'Jeter un produit', size: 'small', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, 'Ça arrive ! Noter la raison t’aide à gaspiller moins.'), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quantité jetée'), qs), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Raison'), rs)),
    footer: btn('Jeter et noter', { class: 'btn danger block', onclick: () => { A.discardStock(id, qs.get(), reason); toast('Noté dans ton journal anti-gaspi'); s.close(); if (parent && !S.data.stock.some(x => x.id === id)) parent.close(); } }) });
}

// ---------- planning ----------
export function openPlanPicker(date, slot) {
  let tab = 'sugg', q = ''; const list = h('div', { class: 'list' }); const searchIn = h('input', { class: 'input search', type: 'search', placeholder: 'Une recette, un ingrédient…', 'aria-label': 'Rechercher' });
  const serv = S.data.prefs.people || 2; const c = ctx();
  const choose = r => { A.planSet(date, slot, r.id, serv); haptic(12); toast(`${r.t} ajoutée`); s.close(); };
  const row = (r, why) => h('button', { type: 'button', class: 'rec-row', onclick: () => choose(r) }, tile(r, kb, 'sm'), h('div', { class: 'grow' }, h('div', { class: 't' }, r.t), h('div', { class: 'muted sm' }, `${r.m} min, ${r.c.toLowerCase()}`), why ? h('div', { class: 'why-line' }, why) : null), icon('plus', 20));
  const draw = () => {
    clear(list); let items = [];
    if (tab === 'sugg') items = S.cat.list.filter(r => allowed(r, S.data.prefs, kb) && r.c !== 'Desserts' && r.c !== 'Petit-déjeuner').map(r => [score(r, serv, c), r]).sort((a, b) => b[0].score - a[0].score).slice(0, 12).map(([sc, r]) => [r, sc.why[0]]);
    else if (tab === 'fav') items = S.data.fav.map(id => S.cat.get(id)).filter(Boolean).map(r => [r]);
    else items = search(S.cat, q).filter(r => allowed(r, S.data.prefs, kb)).slice(0, 40).map(r => [r]);
    if (!items.length) list.append(empty(tab === 'fav' ? '💗' : '🔍', tab === 'fav' ? 'Aucun favori' : 'Aucun résultat', tab === 'fav' ? 'Touche le cœur sur une recette pour la retrouver ici.' : 'Essaie un autre mot.'));
    for (const [r, why] of items) list.append(row(r, why));
  };
  searchIn.addEventListener('input', () => { q = searchIn.value; tab = q.trim() ? 'search' : 'sugg'; tabs.replaceWith(tabs = mkTabs()); draw(); });
  const mkTabs = () => seg([['sugg', 'Idées'], ['fav', 'Favoris'], ['search', 'Recherche']], tab, v => { tab = v; if (v === 'search') searchIn.focus(); draw(); });
  let tabs = mkTabs();
  const s = openSheet({ title: `${dayName(date)} ${slot === 'lunch' ? 'midi' : 'soir'}`, size: 'tall', content: h('div', { class: 'form' }, searchIn, tabs, list) }); draw();
}
export function openSlotMenu(date, slot) {
  const e = S.data.plan[date] && S.data.plan[date][slot]; if (!e) return; const r = S.cat.get(e.rid);
  const qs = stepper(e.serv, { min: 1, max: 12, onChange: v => A.planServ(date, slot, v), fmt: v => `${v} personne${v > 1 ? 's' : ''}` });
  const s = openSheet({ title: r ? r.t : 'Repas', size: 'small', content: h('div', { class: 'form' }, h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Portions'), qs),
    r ? btn('Voir la recette', { class: 'btn soft block', onclick: () => { s.close(); setTimeout(() => openRecipe(r.id, { serv: S.data.plan[date][slot].serv }), 250); } }, 'utensils') : null,
    btn('Remplacer', { class: 'btn soft block', onclick: () => { s.close(); setTimeout(() => openPlanPicker(date, slot), 250); } }, 'swap'),
    btn('Retirer du planning', { class: 'btn soft block danger-text', onclick: () => { const old = e; A.planRemove(date, slot); s.close(); toast('Repas retiré', { undo: () => mutate('plan', p => ({ ...p, [date]: { ...(p[date] || {}), [slot]: old } })) }); } }, 'trash')) });
}

// ---------- courses ----------
export function openAddShop(prefill = '') {
  const nameIn = h('input', { class: 'input', placeholder: 'Ex. lait, pain, courgettes…', autocomplete: 'off', value: prefill });
  const qty = h('input', { class: 'input', inputmode: 'decimal', placeholder: 'Facultatif' }); const unit = unitSelect('pièce'); const sugg = h('div', { class: 'chips scroll' }); let ingId = null, unitTouched = false;
  unit.addEventListener('change', () => { unitTouched = true; });
  const pick = i => { ingId = i.id; nameIn.value = i.n; unit.value = i.u; clear(sugg); qty.focus(); };
  nameIn.addEventListener('input', () => { clear(sugg); ingId = null; for (const i of kb.suggest(nameIn.value, 6)) if (norm(i.n) !== norm(nameIn.value)) sugg.append(h('button', { type: 'button', class: 'chip', onclick: () => pick(i) }, i.emoji + ' ' + i.n)); });
  const submit = keep => { const n = nameIn.value.trim(); if (!n) { toast('Indique un article'); return; } const q = num(qty.value); const rid = ingId || kb.resolve(n); const u = rid && !unitTouched && !ingId ? kb.get(rid).u : unit.value; const res = A.addShop({ name: n, ing: rid || undefined, qty: q > 0 ? q : null, unit: u }); haptic(10); toast(res.result === 'exists' ? `${n} est déjà dans ta liste` : res.result === 'merged' ? `Quantité de ${n} mise à jour` : `${n} ajouté`); if (keep) { nameIn.value = ''; qty.value = ''; ingId = null; unitTouched = false; unit.value = 'pièce'; clear(sugg); nameIn.focus(); } else s.close(); };
  const s = openSheet({ title: 'Ajouter à la liste', content: h('div', { class: 'form' }, field('Article', nameIn), sugg, h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit)))),
    footer: h('div', { class: 'row gap' }, btn('Ajouter et continuer', { class: 'btn ghost grow', onclick: () => submit(true) }), btn('Ajouter', { class: 'btn primary grow', onclick: () => submit(false) })) });
  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(true); } });
  setTimeout(() => nameIn.focus(), 300);
}
export function openShopItem(id) {
  const it = S.data.shop.find(x => x.id === id); if (!it) return;
  const qty = h('input', { class: 'input', inputmode: 'decimal', value: it.qty ?? '', placeholder: 'Quantité' }); const unit = unitSelect(it.unit);
  const s = openSheet({ title: it.name, size: 'small', content: h('div', { class: 'form' }, h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit))),
    btn('Supprimer de la liste', { class: 'btn link danger-text', onclick: () => { mutate('shop', l => l.filter(x => x.id !== id)); s.close(); toast('Article supprimé', { undo: () => mutate('shop', l => [...l, it]) }); } })),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => { const q = num(qty.value); mutate('shop', l => l.map(x => x.id === id ? { ...x, qty: q > 0 ? q : null, unit: unit.value } : x)); s.close(); } }) });
}
export function openShopToStock(items) {
  if (!items.length) return;
  const rows = items.map(it => {
    const k = it.ing && kb.get(it.ing); const zone = k ? k.zone : 'frigo';
    const o = { it, qty: h('input', { class: 'input sm', inputmode: 'decimal', value: it.qty ?? 1, 'aria-label': 'Quantité ' + it.name }), unit: unitSelect(it.unit), zone: h('select', { class: 'input', 'aria-label': 'Zone ' + it.name }, ZONES.map(z => h('option', { value: z.id, selected: z.id === zone }, z.emoji + ' ' + z.label))), exp: h('input', { type: 'date', class: 'input', value: A.suggestExpiry(it.ing, zone) || '', 'aria-label': 'Date limite ' + it.name }) };
    o.zone.addEventListener('change', () => { o.exp.value = A.suggestExpiry(it.ing, o.zone.value) || ''; });
    return o;
  });
  const body = h('div', { class: 'form' }, h('p', { class: 'muted' }, 'Vérifie les quantités, la zone et les dates (estimées : regarde l’emballage).'),
    rows.map(o => h('div', { class: 'cardlet' }, h('div', { class: 'strong' }, (o.it.ing && kb.get(o.it.ing) ? kb.get(o.it.ing).emoji + ' ' : '') + o.it.name), h('div', { class: 'row gap' }, h('div', { style: { flex: '1' } }, o.qty), h('div', { style: { flex: '1.4' } }, o.unit)), h('div', { class: 'row gap' }, h('div', { class: 'grow' }, o.zone), h('div', { class: 'grow' }, o.exp)))));
  const s = openSheet({ title: `Ranger ${items.length} produit${items.length > 1 ? 's' : ''}`, size: 'tall', content: body,
    footer: btn('Ranger dans le stock', { class: 'btn primary block', onclick: () => {
      const entries = []; for (const o of rows) { const q = num(o.qty.value); if (!(q > 0)) { toast(`Quantité invalide pour ${o.it.name}`); o.qty.focus(); return; } entries.push({ item: o.it, qty: q, unit: o.unit.value, zone: o.zone.value, expiry: o.exp.value || null }); }
      A.shopToStock(entries); haptic(20); toast(`${entries.length} produit${entries.length > 1 ? 's' : ''} rangé${entries.length > 1 ? 's' : ''} dans le stock`); s.close(); } }) });
}

// ---------- filtres de recettes ----------
export function openFilters(onApply) {
  const cats = [...new Set(S.cat.list.map(r => r.c))].sort((a, b) => a.localeCompare(b, 'fr')); const body = h('div', { class: 'form' });
  const draw = () => { clear(body); body.append(
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Temps maximum'), h('div', { class: 'chips wrap' }, [[0, 'Peu importe'], [15, '15 min'], [30, '30 min'], [45, '45 min'], [60, '1 h']].map(([v, l]) => chip(l, RUI.maxTime === v, () => { RUI.maxTime = v; draw(); })))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Catégories'), h('div', { class: 'chips wrap' }, cats.map(c => chip(c, RUI.cats.has(c), () => { RUI.cats.has(c) ? RUI.cats.delete(c) : RUI.cats.add(c); draw(); })))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Trier par'), seg([['perso', 'Pour moi'], ['rapide', 'Rapide'], ['eco', 'Économique']], RUI.sort, v => { RUI.sort = v; }))); };
  draw();
  const s = openSheet({ title: 'Filtres', content: body, footer: h('div', { class: 'row gap' }, btn('Réinitialiser', { class: 'btn ghost grow', onclick: () => { RUI.cats.clear(); RUI.maxTime = 0; RUI.sort = 'perso'; draw(); } }), btn('Voir les recettes', { class: 'btn primary grow', onclick: () => { s.close(); onApply && onApply(); } })) });
}

// ---------- scanner de code-barres (si le navigateur le permet) ----------
export function openScanner(onResult) {
  if (!('BarcodeDetector' in window) || !navigator.mediaDevices) { toast('Le scanner n’est pas disponible sur ce navigateur : saisis le produit à la main.'); return; }
  const video = h('video', { class: 'scan-video', playsinline: '', muted: '', autoplay: '' }); const msg = h('p', { class: 'muted center' }, 'Vise le code-barres du produit…'); let stream, stop = false;
  const s = openSheet({ title: 'Scanner', content: h('div', null, video, msg), onClose: () => { stop = true; stream && stream.getTracks().forEach(t => t.stop()); } });
  (async () => {
    try {
      const det = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); video.srcObject = stream; await video.play();
      const loop = async () => { if (stop) return; try { const codes = await det.detect(video); if (codes.length) { stop = true; msg.textContent = 'Recherche du produit…'; let name = ''; try { const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${codes[0].rawValue}.json?fields=product_name`); const j = await r.json(); name = (j.product && j.product.product_name) || ''; } catch {} haptic(30); s.close(); if (name) onResult({ name }); else { toast('Produit inconnu : saisis son nom.'); onResult({ name: '' }); } return; } } catch {} requestAnimationFrame(loop); };
      loop();
    } catch (err) { msg.textContent = 'Accès à la caméra refusé ou impossible. Tu peux saisir le produit à la main.'; }
  })();
}
