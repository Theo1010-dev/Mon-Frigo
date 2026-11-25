// Fenêtres du stock : ajouter un produit (une fois ou plusieurs), fiche produit, utiliser / jeter, scanner, export.
import * as A from './actions.js';
import { h, btn, openSheet, toast, seg, chip, field, clear, haptic } from './ui.js';
import { icon } from './icons.js';
import { S, set, ensureIng } from './state.js';
import { ZONES, status, statusText, zoneLabel } from './stock.js';
import { UNITS_UI, fmtQty, canonUnit, unitLabel } from './units.js';
import { todayISO, addDays, norm, fmtDateShort, daysBetween } from './util.js';
import { nav, resetRUI, SUI, num } from './nav.js';
import { sizeFromName, stripSize } from './receipt.js';
import { fromOFF } from './off.js';
import { TYPES, guessType } from './types.js';
import { productMemo, learnProduct } from './habits.js';
import { tx } from './theme.js';
import { stockToText, stockToCSV } from './export.js';

const kb = S.kb;

const ZSHORT = { frigo: 'Frigo', congelateur: 'Congélo', placard: 'Placard', autre: 'Autre' };

export const unitSelect = (value, id) => { const sel = h('select', { id, class: 'input', 'aria-label': 'Unité' }, UNITS_UI.map(u => h('option', { value: u, selected: u === canonUnit(value) }, u))); if (!UNITS_UI.includes(canonUnit(value))) sel.append(h('option', { value: canonUnit(value), selected: true }, canonUnit(value))); return sel; };

// ---------- ajout au stock ----------
const COUNT_UNITS = ['pièce', 'pot', 'tranche', 'boîte', 'sachet', 'paquet', 'bouteille', 'bouquet', 'gousse', 'portion'];

const fmtIn = n => String(Math.round(n * 1000) / 1000).replace('.', ',');

// « 6 œufs », « Moutarde 260 g », « Yaourts x4 » : quantité écrite dans le nom
function qtyInName(name) {
  const lead = String(name).trim().match(/^(\d{1,2})\s+(?=\D)/), { size, pack } = sizeFromName(name);
  return { size, pack: pack || (lead && !size ? parseInt(lead[1]) : null), lead: !!lead };
}

function cleanTypedName(name) {
  const st = stripSize(String(name).replace(/^\s*\d{1,2}\s+(?=\D)/, '')).replace(/\s*[-–,]\s*$/, '').trim();
  return st ? st[0].toUpperCase() + st.slice(1) : String(name).trim();
}

// quantité proposée : écrite dans le nom > tes habitudes > quantité d'achat habituelle > 1 pièce
function defaultQty(name, k, learned) {
  const { size, pack } = qtyInName(name);
  if (size) return { qty: size.qty * (pack || 1), unit: canonUnit(size.unit), fromName: true };
  if (pack) return { qty: pack, unit: k && k.buy && COUNT_UNITS.includes(k.buy[1]) ? k.buy[1] : 'pièce', fromName: true };
  if (learned && learned.qty > 0 && learned.unit) return { qty: learned.qty, unit: learned.unit };
  if (k && k.buy) return { qty: k.buy[0], unit: canonUnit(k.buy[1]) };
  return { qty: 1, unit: 'pièce' };
}

// liste « Pour les recettes » : produit reconnu, autres produits proches, ou produit à part avec un type
const sumOf = (sel, el) => { const o = sel.options[sel.selectedIndex]; el.textContent = 'Pour les recettes : ' + (o ? o.textContent : '—'); return el; };

function assocSelect(name, current) {
  const sel = h('select', { class: 'input assoc-sel', 'aria-label': 'Pour les recettes, ce produit compte comme' });
  const fill = (nm, cur) => {
    clear(sel); const opts = [], seen = new Set(); const add = i => { if (i && !i.custom && !seen.has(i.id)) { seen.add(i.id); opts.push(i); } };
    const learned = productMemo(nm), clean = cleanTypedName(nm);
    add(cur && !String(cur).startsWith('type:') && kb.get(cur)); add(kb.get(kb.resolve(nm))); add(kb.get(kb.resolve(clean))); if (learned && learned.ing) add(kb.get(learned.ing)); kb.suggest(clean, 5).forEach(add);
    if (opts.length) sel.append(h('optgroup', { label: 'Produit connu' }, opts.map(i => h('option', { value: i.id }, `${i.emoji} ${i.n}`))));
    sel.append(h('optgroup', { label: 'Produit à part, de type…' }, Object.entries(TYPES).map(([k, t]) => h('option', { value: 'type:' + k }, `${t.emoji} ${t.label}`))));
    const custom = cur && String(cur).startsWith('c-') ? kb.get(cur) : null;
    sel.value = cur && !String(cur).startsWith('c-') ? cur : custom ? 'type:' + (custom.type || 'autre') : learned && learned.assocManual && learned.assoc ? learned.assoc : kb.resolve(nm) || kb.resolve(clean) || 'type:' + guessType(clean);
    if (!sel.value) sel.value = 'type:autre';
  };
  fill(name, current); sel.refill = fill; return sel;
}

export function openAddStock({ name = '', onDone } = {}) {
  const T = { qty: false, unit: false, zone: false, date: false, assoc: false }; // ce que l'utilisateur a modifié lui-même
  let zone = 'frigo', learned = null, tm = null;
  const nameIn = h('input', { class: 'input', id: 'as-name', placeholder: 'Ex. lait, poulet, comté…', autocomplete: 'off', autocapitalize: 'sentences', value: name, enterkeyhint: 'next', maxlength: '60' });
  const sugg = h('div', { class: 'chips scroll' }), habit = h('div', { class: 'hint habit' });
  const qty = h('input', { class: 'input', id: 'as-qty', inputmode: 'decimal', value: '1', 'aria-label': 'Quantité', enterkeyhint: 'done' });
  const unit = unitSelect('pièce', 'as-unit');
  const exp = h('input', { class: 'input', id: 'as-exp', type: 'date', 'aria-label': 'Date limite' });
  const expHint = h('span', { class: 'hint', id: 'as-hint' });
  const noDate = h('button', { type: 'button', class: 'btn link sm', 'aria-label': 'Sans date limite', onclick: () => { exp.value = ''; T.date = true; syncDate(); } }, 'Sans date');
  const assoc = assocSelect(name, null), assocSum = h('summary', null);
  const zoneSeg = h('div');
  const drawZone = () => { clear(zoneSeg); zoneSeg.append(seg(ZONES.map(z => [z.id, ZSHORT[z.id]]), zone, v => { zone = v; T.zone = true; applyDate(); })); };
  const ingOf = () => assoc.value.startsWith('type:') ? null : assoc.value;
  const typeOf = () => assoc.value.startsWith('type:') ? TYPES[assoc.value.slice(5)] : null;
  const setUnit = u => { if (![...unit.options].some(o => o.value === u)) unit.append(h('option', { value: u }, u)); unit.value = u; };
  function syncDate() {
    noDate.hidden = !exp.value;
    if (T.date) expHint.textContent = exp.value ? '' : 'Sans date limite.';
  }
  function applyDate() {
    if (T.date) return syncDate();
    const id = ingOf(), t = typeOf(), m = learned; let d = null, why = '';
    if (m && m.life != null && m.zone === zone) { d = m.life > 0 ? addDays(todayISO(), m.life) : null; why = 'd’après tes habitudes'; }
    else if (id) { d = A.suggestExpiry(id, zone); why = 'estimée pour ce produit'; }
    else if (zone === 'congelateur') { d = addDays(todayISO(), 90); why = 'estimée au congélateur'; }
    else if (t && t.life) { d = addDays(todayISO(), t.life); why = 'estimée pour ce type de produit'; }
    exp.value = d || '';
    expHint.textContent = d ? `Date ${why} : vérifie l’emballage.` : 'Pas de date à prévoir pour ce produit (tu peux en mettre une).';
    syncDate();
  }
  function applyDefaults() {
    const id = ingOf(), k = id && kb.get(id), t = typeOf(); sumOf(assoc, assocSum);
    if (!T.qty && !T.unit) { const d = defaultQty(nameIn.value, k, learned); qty.value = fmtIn(d.qty); setUnit(d.unit); }
    if (!T.zone) { zone = (learned && learned.zone) || (k ? k.zone : t ? t.zone : 'frigo'); drawZone(); }
    applyDate();
  }
  function analyse() {
    clearTimeout(tm); learned = productMemo(cleanTypedName(nameIn.value)) || productMemo(nameIn.value);
    if (!T.assoc) assoc.refill(nameIn.value, null);
    clear(habit); if (learned && learned.count) habit.append(icon('sparkle', 14), ` Prérempli d’après tes habitudes (ajouté ${learned.count} fois)`);
    applyDefaults();
  }
  function drawSugg() {
    clear(sugg); const v = norm(cleanTypedName(nameIn.value)); if (!v) return;
    const dupOfKb = i => i.custom && kb.resolve(i.n) && !kb.get(kb.resolve(i.n)).custom;
    for (const i of kb.suggest(v, 6).filter(i => !dupOfKb(i))) { if (norm(i.n) === v) continue; sugg.append(h('button', { type: 'button', class: 'chip', onclick: () => pick(i) }, i.emoji + ' ' + i.n)); }
  }
  function pick(i) { nameIn.value = i.n; assoc.refill(i.n, i.id); T.assoc = true; learned = productMemo(i.n); clear(sugg); clear(habit); applyDefaults(); haptic(8); qty.focus(); qty.select(); }
  nameIn.addEventListener('input', () => { drawSugg(); clearTimeout(tm); tm = setTimeout(analyse, 220); });
  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); analyse(); qty.focus(); qty.select(); } });
  qty.addEventListener('input', () => { T.qty = true; }); qty.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
  qty.addEventListener('focus', () => qty.select());
  unit.addEventListener('change', () => { T.unit = true; });
  assoc.addEventListener('change', () => { T.assoc = true; applyDefaults(); });
  const userDate = () => { T.date = true; syncDate(); }; exp.addEventListener('input', userDate); exp.addEventListener('change', userDate);
  function submit() {
    if (tm) analyse(); // le nom vient d'être tapé : on le relit avant d'enregistrer
    let nm = nameIn.value.trim(); const q = num(qty.value);
    if (!nm) { toast('Indique le nom du produit'); nameIn.focus(); return; }
    if (!(q > 0)) { toast('Indique une quantité supérieure à 0'); qty.focus(); qty.select(); return; }
    if (defaultQty(nm, null, null).fromName) nm = cleanTypedName(nm) || nm; // « Moutarde 260 g » -> « Moutarde », 260 g
    const isType = assoc.value.startsWith('type:'), expiry = exp.value || null;
    const before = S.data.stock.filter(x => norm(x.name) === norm(nm)).length;
    const lot = A.addStock({ name: nm, ing: isType ? undefined : assoc.value, type: isType ? assoc.value.slice(5) : undefined, qty: q, unit: unit.value, zone, expiry });
    learnProduct(nm, { assoc: T.assoc ? assoc.value : undefined, assocManual: T.assoc || undefined, ing: lot.ing, unit: unit.value, qty: q, zone, life: expiry ? daysBetween(todayISO(), expiry) : (T.date ? 0 : undefined) });
    if (SUI.q && !norm(nm).includes(norm(SUI.q))) SUI.q = ''; if (SUI.zone !== 'all' && SUI.zone !== zone) SUI.zone = 'all'; SUI.chip = '';
    const merged = S.data.stock.filter(x => norm(x.name) === norm(nm)).length === before && before > 0;
    haptic(15); toast(merged ? `Quantité ajoutée à ton « ${nm} »` : tx('add.toast', { nm, zone: zoneLabel(zone).toLowerCase() })); onDone && onDone(); s.close();
  }
  drawZone();
  const body = h('div', { class: 'form' },
    field('Produit', nameIn), sugg, habit,
    h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Où le ranges-tu ?'), zoneSeg),
    h('div', { class: 'field' }, h('span', { class: 'lab row between' }, 'Date limite', noDate), exp, expHint),
    h('details', { class: 'more' }, assocSum, h('div', { class: 'field' }, assoc, h('span', { class: 'hint' }, 'Ton nom reste tel quel : ceci sert juste à trouver les recettes qui peuvent l’utiliser.'))),
    btn('Ajouter plusieurs produits courants d’un coup', { class: 'btn link quick-link', onclick: () => { s.close(); setTimeout(openQuickAdd, 260); } }, 'wand'));
  const s = openSheet({ title: 'Ajouter au stock', content: body,
    headerRight: ('BarcodeDetector' in window && navigator.mediaDevices) ? h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Scanner un code-barres', onclick: () => openScanner(r => {
      if (!r.name) return; nameIn.value = r.name; clear(sugg); learned = productMemo(r.name);
      if (r.ing) assoc.refill(r.name, r.ing); else { assoc.refill(r.name, null); assoc.value = 'type:' + (r.type || 'autre'); } T.assoc = true;
      if (r.qty) { qty.value = fmtIn(r.qty); setUnit(canonUnit(r.unit)); T.qty = T.unit = true; }
      applyDefaults(); toast('Produit trouvé : vérifie et ajoute'); }) }, icon('scan', 20)) : null,
    footer: btn('Ajouter', { class: 'btn primary block', onclick: () => submit() }) });
  if (name) { drawSugg(); analyse(); } else { applyDefaults(); setTimeout(() => nameIn.focus(), 300); }
  return s;
}

// ---------- ajout rapide ----------
const COMMON = ['oeufs', 'lait', 'beurre', 'creme', 'fromage-rape', 'yaourt', 'poulet', 'boeuf-hache', 'jambon', 'lardons', 'pates', 'riz', 'semoule', 'pomme-de-terre', 'oignon', 'ail', 'carotte', 'tomate', 'courgette', 'salade', 'pomme', 'banane', 'citron', 'tomate-concassee', 'thon', 'farine', 'sucre', 'pain', 'chocolat', 'moutarde', 'huile-olive'];

export function openQuickAdd() {
  const sel = new Set(); const grid = h('div', { class: 'chips wrap' }); const foot = h('div');
  const items = COMMON.map(id => kb.get(id)).filter(Boolean);
  const upd = () => { clear(foot); foot.append(btn(sel.size ? `Ajouter ${sel.size} produit${sel.size > 1 ? 's' : ''}` : 'Choisis des produits', { class: 'btn primary block', disabled: !sel.size, onclick: go })); };
  const draw = () => { clear(grid); for (const k of items) grid.append(chip(k.emoji + ' ' + k.n, sel.has(k.id), () => { sel.has(k.id) ? sel.delete(k.id) : sel.add(k.id); haptic(6); draw(); upd(); }, { title: k.buy ? fmtQty(k.buy[0], k.buy[1]) : '' })); };
  function go() {
    for (const k of items) if (sel.has(k.id)) { const m = productMemo(k.n), d = defaultQty(k.n, k, m), z = (m && m.zone) || k.zone; A.addStock({ name: k.n, ing: k.id, qty: d.qty, unit: d.unit, zone: z, expiry: A.suggestExpiry(k.id, z) }); }
    toast(`${sel.size} produit${sel.size > 1 ? 's' : ''} ajouté${sel.size > 1 ? 's' : ''}`); s.close();
  }
  draw(); upd();
  const s = openSheet({ title: 'Ajout rapide', content: h('div', { class: 'stack' }, h('p', { class: 'muted' }, 'Touche ce que tu as chez toi : j’ajoute la quantité habituelle (6 œufs, 1 l de lait, 500 g de pâtes…). Tu pourras l’ajuster ensuite.'), grid), footer: foot });
}

// ---------- fiche d'un produit du stock ----------
const stepOf = (u, v) => { u = canonUnit(u); if (u === 'g' || u === 'ml') return v > 1000 ? 100 : v > 200 ? 50 : 10; if (u === 'cl') return v > 50 ? 10 : 5; if (u === 'kg' || u === 'l') return 0.25; return 1; };

// quantité modifiable : − [nombre] + (le nombre se tape directement)
function qtyEditor(value, unit, { onChange, max = Infinity, showUnit = true } = {}) {
  let v = value;
  const inp = h('input', { class: 'step-input', inputmode: 'decimal', value: fmtIn(v), 'aria-label': 'Quantité' });
  const lab = h('span', { class: 'step-unit', hidden: !showUnit }, unitLabel(unit, v));
  const set = (n, fire = true) => { if (!(n > 0)) return; v = Math.min(max, Math.round(n * 1000) / 1000); inp.value = fmtIn(v); lab.textContent = unitLabel(unit, v); minus.disabled = v - stepOf(unit, v) <= 1e-9; plus.disabled = v >= max - 1e-9; fire && onChange && onChange(v); };
  const minus = h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Moins', onclick: () => { const n = v - stepOf(unit, v); if (n > 1e-9) set(n); } }, icon('minus', 18));
  const plus = h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Plus', onclick: () => set(v + stepOf(unit, v)) }, icon('plus', 18));
  inp.addEventListener('focus', () => inp.select());
  inp.addEventListener('change', () => { const n = num(inp.value); if (n > 0) set(n); else { inp.value = fmtIn(v); toast('Quantité supérieure à 0, ou utilise « Jeter » / « Supprimer »'); } });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } });
  set(v, false);
  const el = h('div', { class: 'stepper qty-editor' }, minus, h('label', { class: 'step-mid' }, inp, lab), plus); el.get = () => v; el.set = set; return el;
}

export function openStockItem(id) {
  const get = () => S.data.stock.find(x => x.id === id); if (!get()) return;
  const body = h('div', { class: 'form' }); const today = todayISO();
  const draw = () => {
    const it = get(); if (!it) { s.close(); return; } clear(body);
    const st = status(it, today), k = it.ing && kb.get(it.ing);
    s.setTitle && s.setTitle(it.name);
    const exp = h('input', { type: 'date', class: 'input', value: it.expiry || '', 'aria-label': 'Date limite', onchange: e => { A.updateStock(id, { expiry: e.target.value || null }); draw(); } });
    const nameIn = h('input', { class: 'input', value: it.name, 'aria-label': 'Nom du produit', maxlength: '60', onchange: e => { const v = e.target.value.trim(); if (v && v !== it.name) { A.updateStock(id, { name: v[0].toUpperCase() + v.slice(1) }); toast('Nom modifié'); draw(); } else e.target.value = it.name; } });
    nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); nameIn.blur(); } });
    const unitSel = unitSelect(it.unit); unitSel.setAttribute('aria-label', 'Unité'); unitSel.addEventListener('change', () => { A.updateStock(id, { unit: canonUnit(unitSel.value) }); draw(); });
    const assoc = assocSelect(it.name, it.ing); assoc.addEventListener('change', () => { const v = assoc.value; const ing = v.startsWith('type:') ? ensureIng(it.name, v.slice(5)) : v; A.updateStock(id, { ing }); learnProduct(it.name, { assoc: v, assocManual: true, ing }); toast('Association mise à jour'); });
    const moveTo = z => {
      const old = it.zone; A.updateStock(id, { zone: z });
      const est = it.ing ? A.suggestExpiry(it.ing, z) : z === 'congelateur' ? addDays(today, 90) : null;
      if (z === 'congelateur' && est && (!it.expiry || it.expiry < est)) { const prev = it.expiry; A.updateStock(id, { expiry: est }); toast(`Rangé au congélateur, se garde jusqu’au ${fmtDateShort(est)}`, { undo: () => A.updateStock(id, { zone: old, expiry: prev }) }); }
      else toast('Rangé : ' + zoneLabel(z).toLowerCase(), { undo: () => A.updateStock(id, { zone: old }) });
      draw();
    };
    body.append(
      h('div', { class: 'item-status' }, h('span', { class: 'bullet' }, k ? k.emoji : it.unit === 'portion' ? '🥡' : '🍽️'), h('span', { class: 'tag ' + st.key }, statusText(it, today))),
      field('Nom', nameIn),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quantité'), h('div', { class: 'row gap' }, qtyEditor(it.qty, it.unit, { showUnit: false, onChange: v => A.updateStock(id, { qty: v }) }), h('div', { class: 'unit-mini' }, unitSel))),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Rangé dans'), seg(ZONES.map(z => [z.id, ZSHORT[z.id]]), it.zone, moveTo)),
      h('div', { class: 'field' }, h('span', { class: 'lab row between' }, 'Date limite', it.expiry ? h('button', { type: 'button', class: 'btn link sm', onclick: () => { A.updateStock(id, { expiry: null }); draw(); } }, 'Sans date') : null), exp),
      h('div', { class: 'grid2' },
        btn('J’en ai utilisé', { class: 'btn tonal', onclick: () => openUse(id, s) }, 'check'),
        btn('Jeter', { class: 'btn tonal', onclick: () => openDiscard(id, s) }, 'trash'),
        btn('Aux courses', { class: 'btn tonal', onclick: () => openStockToShop(it) }, 'cart'),
        btn('Idées recettes', { class: 'btn tonal', onclick: () => { resetRUI(k && !k.custom ? k.n : it.name); s.close(); setTimeout(() => nav.go('recipes'), 260); } }, 'utensils')),
      h('details', { class: 'more' }, sumOf(assoc, h('summary', null)), h('div', { class: 'field' }, assoc)),
      btn('Supprimer ce produit', { class: 'btn link danger-text', onclick: () => { A.removeStock(id); s.close(); } }));
  };
  const s = openSheet({ title: get().name, content: body }); draw(); return s;
}

// racheter un produit du stock : quantité et prix préremplis (habitudes, sinon quantité d'achat habituelle)
function openStockToShop(it) {
  const k = it.ing && kb.get(it.ing), m = productMemo(it.name), d = defaultQty(it.name, k && !k.custom ? k : null, m);
  const already = S.data.shop.find(x => !x.done && norm(x.name) === norm(it.name));
  const qty = h('input', { class: 'input', inputmode: 'decimal', value: fmtIn(d.qty), 'aria-label': 'Quantité à acheter' }); const unit = unitSelect(d.unit);
  const price = h('input', { class: 'input', inputmode: 'decimal', placeholder: 'Facultatif', value: m && m.price > 0 ? fmtIn(m.price) : '', 'aria-label': 'Prix en euros' });
  qty.addEventListener('focus', () => qty.select());
  const s = openSheet({ title: 'Ajouter aux courses', size: 'small', content: h('div', { class: 'form' },
    h('p', { class: 'muted' }, already ? `« ${it.name} » est déjà dans ta liste : la quantité sera ajoutée.` : `« ${it.name} » sera ajouté à ta liste de courses.`),
    h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit))), field('Prix (€)', price, m && m.price > 0 ? 'Prix de ton dernier achat' : null)),
    footer: btn('Ajouter à la liste', { class: 'btn primary block', onclick: () => {
      const q = num(qty.value), p = num(price.value); if (!(q > 0)) { toast('Indique une quantité'); qty.focus(); return; } if (price.value.trim() && !(p >= 0)) { toast('Prix invalide'); price.focus(); return; }
      const r = A.addShop({ ing: it.ing || undefined, name: it.name, qty: q, unit: unit.value, price: p > 0 ? p : null }); if (p > 0) learnProduct(it.name, { price: p });
      haptic(10); toast(r.result === 'added' ? 'Ajouté aux courses' : 'Liste de courses mise à jour'); s.close(); } }) });
}

// combien en as-tu utilisé / jeté : Tout, la moitié, ou une quantité précise
function amountPicker(it) {
  let v = it.qty; const ed = qtyEditor(it.qty, it.unit, { max: it.qty, onChange: n => { v = n; mark(); } });
  const opts = [['Tout', it.qty], ['La moitié', it.qty / 2]]; if (COUNT_UNITS.includes(canonUnit(it.unit)) && it.qty > 1) opts.splice(1, 1, ['1 ' + canonUnit(it.unit), 1]);
  const chips = h('div', { class: 'chips' }); const mark = () => { clear(chips); for (const [l, q] of opts) chips.append(chip(l, Math.abs(q - v) < 1e-6, () => { ed.set(q); })); };
  mark(); const el = h('div', { class: 'stack' }, chips, ed); el.get = () => v; return el;
}

function openUse(id, parent) {
  const it = S.data.stock.find(x => x.id === id); if (!it) return; const pk = amountPicker(it);
  const s = openSheet({ title: 'J’en ai utilisé', size: 'small', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, `Combien de « ${it.name} » as-tu utilisé ? Il t’en reste ${fmtQty(it.qty, it.unit)}.`), pk),
    footer: btn('Retirer du stock', { class: 'btn primary block', onclick: () => { const before = S.data.stock; A.useStock(id, pk.get()); s.close(); const gone = !S.data.stock.some(x => x.id === id); toast(gone ? `${it.name} : plus rien en stock` : 'Stock mis à jour', { undo: () => set('stock', before) }); if (gone) parent.close(); } }) });
}

function openDiscard(id, parent) {
  const it = S.data.stock.find(x => x.id === id); if (!it) return; let reason = status(it, todayISO()).key === 'expired' ? A.WASTE_REASONS[0] : A.WASTE_REASONS[3];
  const pk = amountPicker(it);
  const rs = h('div'); const dr = () => { clear(rs); rs.append(h('div', { class: 'chips wrap' }, A.WASTE_REASONS.map(r => chip(r, r === reason, () => { reason = r; dr(); })))); }; dr();
  const s = openSheet({ title: 'Jeter un produit', size: 'small', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, 'Ça arrive ! Noter la raison t’aide à moins gaspiller.'), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quantité jetée'), pk), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Pourquoi ?'), rs)),
    footer: btn('Jeter et noter', { class: 'btn danger block', onclick: () => { const before = { stock: S.data.stock, waste: S.data.waste }; A.discardStock(id, pk.get(), reason); s.close(); toast('Noté dans ton journal anti-gaspi', { undo: () => { set('stock', before.stock); set('waste', before.waste); } }); if (parent && !S.data.stock.some(x => x.id === id)) parent.close(); } }) });
}

// ---------- scanner de code-barres (si le navigateur le permet) ----------
function openScanner(onResult) {
  if (!('BarcodeDetector' in window) || !navigator.mediaDevices) { toast('Le scanner n’est pas disponible sur ce navigateur : saisis le produit à la main.'); return; }
  const video = h('video', { class: 'scan-video', playsinline: '', muted: '', autoplay: '' }); const msg = h('p', { class: 'muted center' }, 'Vise le code-barres du produit…'); let stream, stop = false;
  const s = openSheet({ title: 'Scanner', content: h('div', null, video, msg), onClose: () => { stop = true; stream && stream.getTracks().forEach(t => t.stop()); } });
  (async () => {
    try {
      const det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); video.srcObject = stream; await video.play();
      const loop = async () => { if (stop) return; try { const codes = await det.detect(video); if (codes.length) { stop = true; msg.textContent = 'Recherche du produit…'; let res = null; try { const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${codes[0].rawValue}.json?fields=product_name,product_name_fr,generic_name_fr,generic_name,brands,quantity,categories_tags`); const j = await r.json(); if (j.product) res = fromOFF(j.product, kb); } catch {} haptic(30); s.close(); if (res && res.name) onResult(res); else { toast(navigator.onLine ? 'Produit inconnu : saisis son nom.' : 'Le scanner a besoin d’internet pour trouver le produit.'); onResult({ name: '' }); } return; } } catch {} requestAnimationFrame(loop); };
      loop();
    } catch (err) { msg.textContent = 'Accès à la caméra refusé ou impossible. Tu peux saisir le produit à la main.'; }
  })();
}

// ---------- export du stock ----------
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = h('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function openExportStock() {
  const st = S.data.stock, today = todayISO(), text = stockToText(st, today), base = `mon-stock-${today}`;
  const preview = h('pre', { class: 'export-preview' }, text.split('\n').slice(0, 14).join('\n') + (text.split('\n').length > 14 ? '\n…' : ''));
  const s = openSheet({ title: 'Exporter mon stock', size: 'small', content: h('div', { class: 'form' },
    h('p', { class: 'muted' }, `${st.length} produit${st.length > 1 ? 's' : ''}, rangés par zone, avec quantités et dates.`), preview,
    btn('Télécharger la note (.txt)', { class: 'btn primary block', onclick: () => { download(base + '.txt', text, 'text/plain;charset=utf-8'); toast('Note téléchargée'); } }, 'download'),
    navigator.share ? btn('Envoyer vers une appli (Keep, Notes…)', { class: 'btn soft block', onclick: async () => { try { await navigator.share({ title: 'Mon stock', text }); } catch (e) { if (!e || e.name !== 'AbortError') toast('Partage impossible ici'); } } }, 'share') : null,
    btn('Copier le texte', { class: 'btn soft block', onclick: async () => { try { await navigator.clipboard.writeText(text); toast('Copié : colle-le où tu veux'); } catch { toast('Copie impossible sur ce navigateur'); } } }, 'copy'),
    btn('Tableau pour Excel (.csv)', { class: 'btn link', onclick: () => { download(base + '.csv', stockToCSV(st), 'text/csv;charset=utf-8'); toast('Tableau téléchargé'); } })) });
  return s;
}
