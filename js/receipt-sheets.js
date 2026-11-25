// Scan du ticket de caisse : photo (ou texte collé) -> articles à vérifier -> stock.
import * as A from './actions.js';
import { h, btn, openSheet, toast, haptic } from './ui.js';
import { S, mutate } from './state.js';
import { ZONES } from './stock.js';
import { UNITS_UI, canonUnit } from './units.js';
import { norm, todayISO, addDays, daysBetween, money } from './util.js';
import { parseReceipt } from './receipt.js';
import { bump } from './rpg.js';
import { TYPES } from './types.js';
import { learnProduct, learnBought } from './habits.js';

const kb = S.kb;

const COUNTISH = ['pièce', 'pot', 'tranche', 'gousse', 'sachet', 'boîte'];

export function openReceiptScan() {
  const status = h('div', { class: 'scan-status', hidden: '' }), bar = h('div', { class: 'bar' }, h('i', { style: { width: '0%' } })), label = h('p', { class: 'muted sm' });
  status.append(label, bar);
  const pick = capture => { const inp = h('input', { type: 'file', accept: 'image/*', ...(capture ? { capture: 'environment' } : {}), hidden: '', onchange: e => { const f = e.target.files[0]; if (f) run(f); } }); document.body.append(inp); inp.click(); setTimeout(() => inp.remove(), 60000); };
  async function run(file) {
    status.hidden = false; choices.hidden = true; label.textContent = 'Préparation…';
    try {
      const { readReceiptImage } = await import('./ocr.js');
      const text = await readReceiptImage(file, (p, t) => { bar.firstChild.style.width = Math.round(p * 100) + '%'; label.textContent = `${t} ${Math.round(p * 100)} %`; });
      const items = parseReceipt(text);
      if (!items.length) { label.textContent = 'Je n’ai trouvé aucun article lisible. Essaie une photo plus nette, à plat et bien éclairée, ou colle le texte.'; choices.hidden = false; return; }
      s.close(); setTimeout(() => openReceiptReview(items), 260);
    } catch (e) { label.textContent = 'Lecture impossible : ' + (e.message || e); choices.hidden = false; }
  }
  const choices = h('div', { class: 'form' },
    btn('Prendre le ticket en photo', { class: 'btn primary block', onclick: () => pick(true) }, 'scan'),
    btn('Choisir une photo', { class: 'btn soft block', onclick: () => pick(false) }, 'upload'),
    btn('Coller le texte du ticket', { class: 'btn link', onclick: () => { s.close(); setTimeout(openPasteText, 260); } }));
  const s = openSheet({ title: 'Scanner un ticket', size: 'small', content: h('div', { class: 'form' },
    h('p', { class: 'muted' }, 'Pose le ticket bien à plat, éclairé, et cadre-le en entier. Je lis les articles et je te les montre pour que tu vérifies avant de les ajouter.'),
    h('p', { class: 'note' }, 'La lecture n’est jamais parfaite : tu pourras tout corriger. La première fois, le lecteur se télécharge (environ 5 Mo).'), choices, status) });
}

function openPasteText() {
  const ta = h('textarea', { class: 'input', rows: 10, placeholder: 'LAIT DEMI ECREME 1L   1,05\nPATES 500G   0,89\n…', 'aria-label': 'Texte du ticket' });
  const s = openSheet({ title: 'Coller le texte du ticket', content: h('div', { class: 'form' }, h('p', { class: 'muted sm' }, 'Pratique si ton téléphone sait déjà copier le texte d’une photo (Google Lens par exemple).'), ta),
    footer: btn('Lire ce texte', { class: 'btn primary block', onclick: () => { const items = parseReceipt(ta.value); if (!items.length) { toast('Aucun article reconnu dans ce texte'); return; } s.close(); setTimeout(() => openReceiptReview(items), 260); } }) });
}

const unitSel = v => { const s = h('select', { class: 'input', 'aria-label': 'Unité' }, UNITS_UI.map(u => h('option', { value: u, selected: u === v }, u))); if (!UNITS_UI.includes(v)) s.append(h('option', { value: v, selected: true }, v)); return s; };

function openReceiptReview(items) {
  const rows = items.map(it => {
    const ing = kb.resolve(it.name), k = ing && kb.get(ing), t = TYPES[it.type] || TYPES.autre;
    let unit = it.unit ? canonUnit(it.unit) : (k ? (COUNTISH.includes(k.u) ? k.u : 'paquet') : 'pièce');
    if (k && unit === 'pièce' && COUNTISH.includes(k.u)) unit = k.u;
    const zone = k ? k.zone : t.zone;
    const suggest = z => ing ? A.suggestExpiry(ing, z) : (z === 'congelateur' ? addDays(todayISO(), 90) : t.life ? addDays(todayISO(), t.life) : null);
    const o = { it, ing, check: h('input', { type: 'checkbox', checked: it.food, 'aria-label': 'Ajouter ' + it.name }),
      name: h('input', { class: 'input sm', value: it.name, 'aria-label': 'Nom' }), qty: h('input', { class: 'input sm', inputmode: 'decimal', value: String(it.qty).replace('.', ','), 'aria-label': 'Quantité' }), unit: unitSel(unit),
      price: h('input', { class: 'input sm', inputmode: 'decimal', value: String(it.price).replace('.', ','), 'aria-label': 'Prix' }),
      zone: h('select', { class: 'input sm', 'aria-label': 'Rangement' }, ZONES.map(z => h('option', { value: z.id, selected: z.id === zone }, z.label))),
      exp: h('input', { type: 'date', class: 'input sm', value: suggest(zone) || '', 'aria-label': 'Date limite' }), expTouched: false };
    const mark = () => { o.expTouched = true; }; o.exp.addEventListener('input', mark); o.exp.addEventListener('change', mark);
    o.zone.addEventListener('change', () => { if (!o.expTouched) o.exp.value = suggest(o.zone.value) || ''; });
    o.el = h('div', { class: 'cardlet rr' + (it.food ? '' : ' off') }, h('div', { class: 'row gap' }, o.check, h('div', { class: 'grow' }, o.name), k ? h('span', { class: 'e' }, k.emoji) : null),
      h('div', { class: 'rr-grid' }, o.qty, o.unit, h('div', { class: 'price-in' }, o.price, h('span', null, '€'))), h('div', { class: 'rr-grid2' }, o.zone, o.exp), h('p', { class: 'faint sm raw' }, 'Lu : ' + it.raw));
    o.check.addEventListener('change', () => { o.el.classList.toggle('off', !o.check.checked); upd(); });
    return o;
  });
  const shopMatches = () => S.data.shop.filter(x => !x.done && rows.some(o => o.check.checked && (norm(o.name.value) === norm(x.name) || (o.ing && o.ing === x.ing))));
  const rmShop = h('input', { type: 'checkbox', checked: true }), rmLabel = h('span'), rmRow = h('label', { class: 'check' }, rmShop, rmLabel);
  const go = btn('', { class: 'btn primary block', onclick: submit }, 'box');
  function upd() { const n = rows.filter(o => o.check.checked).length, m = shopMatches().length; go.querySelector('span:last-child').textContent = `Ajouter ${n} produit${n > 1 ? 's' : ''} au stock`; go.disabled = !n; rmLabel.textContent = `Retirer de ma liste de courses ce que j’ai retrouvé (${m})`; rmRow.hidden = !m; }
  function submit() {
    const chosen = rows.filter(o => o.check.checked); const bad = chosen.find(o => !(parseFloat(o.qty.value.replace(',', '.')) > 0) || !o.name.value.trim());
    if (bad) { toast('Vérifie le nom et la quantité de chaque produit coché'); bad.qty.focus(); return; }
    const matches = rmShop.checked ? shopMatches() : [];
    for (const o of chosen) {
      const name = o.name.value.trim(), ing = kb.resolve(name), qty = parseFloat(o.qty.value.replace(',', '.')), unit = o.unit.value, zone = o.zone.value;
      const expiry = o.exp.value || null;
      const lot = A.addStock({ name, ing: ing || undefined, type: ing ? undefined : o.it.type, qty, unit, zone, expiry });
      const price = parseFloat(o.price.value.replace(',', '.'));
      learnProduct(name, { ing: lot.ing, unit, qty, zone, price: price > 0 ? price : null, life: expiry ? daysBetween(todayISO(), expiry) : null });
    }
    learnBought(chosen.map(o => ({ name: o.name.value.trim(), ing: kb.resolve(o.name.value), qty: parseFloat(o.qty.value.replace(',', '.')), unit: o.unit.value, price: parseFloat(o.price.value.replace(',', '.')) || null })));
    if (matches.length) { const ids = new Set(matches.map(x => x.id)); mutate('shop', l => l.filter(x => !ids.has(x.id))); }
    bump('receipts');
    haptic(20); toast(`${chosen.length} produit${chosen.length > 1 ? 's' : ''} ajouté${chosen.length > 1 ? 's' : ''} au stock` + (matches.length ? `, ${matches.length} retiré${matches.length > 1 ? 's' : ''} des courses` : '')); s.close();
  }
  const total = items.reduce((a, x) => a + x.price, 0);
  const s = openSheet({ title: 'Vérifie ton ticket', size: 'tall', content: h('div', { class: 'form' },
    h('p', { class: 'muted' }, `J’ai lu ${items.length} article${items.length > 1 ? 's' : ''} (${money(total)}). Corrige ce qui est faux et décoche ce qui ne va pas dans ton stock.`), rows.map(o => o.el)),
    footer: h('div', { class: 'stack' }, rmRow, go) });
  upd();
}
