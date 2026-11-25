// Fenêtres des courses : ajouter un article, fiche article, ranger les achats dans le stock.
import * as A from './actions.js';
import { h, btn, openSheet, toast, field, clear, haptic } from './ui.js';
import { S, mutate } from './state.js';
import { ZONES } from './stock.js';
import { norm } from './util.js';
import { num } from './nav.js';
import { productMemo, learnProduct } from './habits.js';
import { unitSelect } from './stock-sheets.js';

const kb = S.kb;

// ---------- courses ----------
export function openAddShop(prefill = '') {
  const nameIn = h('input', { class: 'input', placeholder: 'Ex. lait, pain, courgettes…', autocomplete: 'off', value: prefill });
  const qty = h('input', { class: 'input', inputmode: 'decimal', placeholder: 'Facultatif' }); const unit = unitSelect('pièce');
  const price = h('input', { class: 'input', inputmode: 'decimal', placeholder: 'Facultatif', 'aria-label': 'Prix en euros' });
  const sugg = h('div', { class: 'chips scroll' }); const hint = h('span', { class: 'hint' }, 'Astuce : sépare par des virgules pour en ajouter plusieurs d’un coup.');
  let ingId = null, unitTouched = false; unit.addEventListener('change', () => { unitTouched = true; });
  const pick = i => { ingId = i.id; nameIn.value = i.n; if (!unitTouched) unit.value = i.u; clear(sugg); qty.focus(); };
  const refresh = () => {
    clear(sugg); const multi = nameIn.value.includes(','); if (multi) { ingId = null; return; }
    const v = norm(nameIn.value); const exact = kb.list.find(i => norm(i.n) === v || i.al.some(a => norm(a) === v));
    ingId = exact ? exact.id : null; if (exact && !unitTouched) unit.value = exact.u;
    const m = productMemo(nameIn.value); if (m) { if (m.price > 0 && !price.value) price.value = String(m.price).replace('.', ','); if (m.unit && !unitTouched) unit.value = m.unit; }
    for (const i of kb.suggest(nameIn.value, 6)) sugg.append(h('button', { type: 'button', class: 'chip' + (exact && i.id === exact.id ? ' on' : ''), onclick: () => pick(i) }, i.emoji + ' ' + i.n));
  };
  nameIn.addEventListener('input', refresh);
  const submit = () => {
    const raw = nameIn.value.trim(); if (!raw) { toast('Indique un article'); nameIn.focus(); return; }
    const names = raw.split(',').map(x => x.trim()).filter(Boolean);
    if (names.length > 1) { let n = 0; for (const nm of names) { const r = A.addShop({ name: nm, ing: kb.resolve(nm) || undefined }); if (r.result !== 'exists') n++; } haptic(10); toast(`${n} article${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''}`); s.close(); return; }
    const q = num(qty.value), p = num(price.value); if (price.value.trim() && !(p >= 0)) { toast('Prix invalide'); price.focus(); return; }
    const rid = ingId || kb.resolve(raw); const u = rid && !unitTouched && !ingId ? kb.get(rid).u : unit.value;
    const res = A.addShop({ name: raw, ing: rid || (productMemo(raw) || {}).ing || undefined, qty: q > 0 ? q : null, unit: u, price: p > 0 ? p : null }); if (p > 0) learnProduct(raw, { price: p });
    haptic(10); toast(res.result === 'exists' ? `Déjà dans ta liste : ${raw}` : res.result === 'merged' ? `Quantité mise à jour : ${raw}` : `Ajouté à la liste : ${raw}`); s.close();
  };
  const s = openSheet({ title: 'Ajouter à la liste', content: h('div', { class: 'form' }, h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Article'), nameIn, hint), sugg,
    h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit))), field('Prix (€)', price)),
    footer: btn('Ajouter', { class: 'btn primary block', onclick: submit }) });
  nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
  if (prefill) refresh(); setTimeout(() => nameIn.focus(), 300);
}

export function openShopItem(id) {
  const it = S.data.shop.find(x => x.id === id); if (!it) return;
  const nameIn = h('input', { class: 'input', value: it.name, 'aria-label': 'Nom' });
  const qty = h('input', { class: 'input', inputmode: 'decimal', value: it.qty ?? '', placeholder: 'Facultatif' }); const unit = unitSelect(it.unit);
  const price = h('input', { class: 'input', inputmode: 'decimal', value: it.price != null ? String(it.price).replace('.', ',') : '', placeholder: 'Facultatif', 'aria-label': 'Prix en euros' });
  const s = openSheet({ title: it.name, size: 'small', content: h('div', { class: 'form' }, field('Article', nameIn), h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Quantité', qty)), h('div', { class: 'grow' }, field('Unité', unit))), field('Prix (€)', price),
    btn('Supprimer de la liste', { class: 'btn link danger-text', onclick: () => { mutate('shop', l => l.filter(x => x.id !== id)); s.close(); toast('Article supprimé', { undo: () => mutate('shop', l => [...l, it]) }); } })),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => {
      const q = num(qty.value), p = num(price.value), nm = nameIn.value.trim() || it.name; if (price.value.trim() && !(p >= 0)) { toast('Prix invalide'); price.focus(); return; }
      mutate('shop', l => l.map(x => x.id === id ? { ...x, name: nm, qty: q > 0 ? q : null, unit: unit.value, price: p > 0 ? Math.round(p * 100) / 100 : null } : x)); s.close(); } }) });
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
