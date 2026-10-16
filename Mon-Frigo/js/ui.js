// Composants d'interface : construction DOM sûre (jamais d'innerHTML avec du texte utilisateur), feuilles, toasts.
import { icon } from './icons.js';
import { hash } from './util.js';

export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'style' && typeof v === 'object') { for (const [sk, sv] of Object.entries(v)) sk.startsWith('--') ? el.style.setProperty(sk, sv) : (el.style[sk] = sv); }
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'value') el.value = v; else if (k === 'checked') el.checked = !!v; else if (k === 'disabled') el.disabled = !!v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  add(el, kids); return el;
}
function add(el, kids) { for (const k of kids.flat(Infinity)) { if (k == null || k === false) continue; el.append(k.nodeType ? k : document.createTextNode(String(k))); } }
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const clear = el => { while (el.firstChild) el.firstChild.remove(); return el; };
export const btn = (label, props = {}, ic) => h('button', { type: 'button', ...props }, ic ? icon(ic, 18) : null, label != null && label !== '' ? h('span', null, label) : null);
export function haptic(ms = 12) { try { navigator.vibrate && navigator.vibrate(ms); } catch {} }

// ---------- toasts ----------
export function toast(msg, { undo, action, ms = 2800 } = {}) {
  const root = $('#toasts'); const el = h('div', { class: 'toast', role: 'status' }, h('span', null, msg));
  let timer;
  const dismiss = () => { clearTimeout(timer); el.classList.remove('show'); setTimeout(() => el.remove(), 250); };
  if (undo) el.append(h('button', { type: 'button', class: 'toast-undo', onclick: () => { dismiss(); undo(); } }, 'Annuler'));
  if (action) el.append(h('button', { type: 'button', class: 'toast-undo', onclick: () => { dismiss(); action.fn(); } }, action.label));
  for (const old of [...root.children]) if (!old.querySelector('.toast-undo') || undo || action) old.remove(); // un seul message à la fois (sauf une annulation encore utile)
  root.append(el); requestAnimationFrame(() => el.classList.add('show')); timer = setTimeout(dismiss, undo || action ? Math.max(ms, 5000) : ms);
  while (root.children.length > 2) root.firstChild.remove();
  return dismiss;
}

// ---------- feuilles (bottom sheets) avec gestion du bouton retour Android ----------
const stack = []; let pendingBack = 0; const afterBack = [];
function flushAfter() { while (!pendingBack && afterBack.length) afterBack.shift()(); }
addEventListener('popstate', e => {
  if (pendingBack > 0) { pendingBack--; flushAfter(); return; }
  const target = (e.state && e.state.sheet) || 0;
  while (stack.length > target) remove(stack[stack.length - 1], false);
});
function remove(ctrl, viaClose) {
  const i = stack.indexOf(ctrl); if (i < 0) return;
  stack.splice(i, 1); ctrl.el.classList.remove('open'); ctrl.back.classList.remove('open');
  setTimeout(() => { ctrl.wrap.remove(); }, 220);
  if (!stack.length) document.body.classList.remove('noscroll');
  if (viaClose) { pendingBack++; history.back(); }
  try { ctrl.onClose && ctrl.onClose(); } catch (e) { console.error(e); }
}
export function openSheet({ title, content, footer, size = '', onClose, headerRight } = {}) {
  const wrap = h('div', { class: 'sheet-wrap' });
  const back = h('div', { class: 'backdrop' });
  const body = h('div', { class: 'sheet-body' });
  const foot = h('div', { class: 'sheet-foot' });
  const ctrl = { wrap, back, body, foot, onClose, el: null, close: () => remove(ctrl, ctrl === stack[stack.length - 1]), setContent(c) { clear(body); add(body, [c]); }, setFooter(f) { clear(foot); add(foot, [f]); foot.hidden = !f; } };
  const head = h('div', { class: 'sheet-head' }, h('h2', null, title || ''), headerRight || null, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Fermer', onclick: () => ctrl.close() }, icon('x', 20)));
  const el = h('div', { class: 'sheet ' + size, role: 'dialog', 'aria-modal': 'true', 'aria-label': title || 'Fenêtre' }, h('div', { class: 'grab' }), head, body, foot);
  ctrl.el = el; ctrl.setContent(content); ctrl.setFooter(footer);
  back.addEventListener('click', () => ctrl.close());
  wrap.append(back, el); $('#sheets').append(wrap);
  document.body.classList.add('noscroll');
  stack.push(ctrl);
  const n = stack.length;
  const push = () => { history.pushState({ sheet: n }, ''); };
  if (pendingBack) afterBack.push(push); else push();
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); back.classList.add('open'); }));
  return ctrl;
}
export const topSheet = () => stack[stack.length - 1] || null;
export const sheetCount = () => stack.length;
addEventListener('keydown', e => { if (e.key === 'Escape' && stack.length) stack[stack.length - 1].close(); });

export function confirmSheet({ title, text, ok = 'Confirmer', cancel = 'Annuler', danger = false }) {
  return new Promise(res => {
    let done = false; const fin = v => { if (!done) { done = true; res(v); } };
    const s = openSheet({ title, size: 'small', onClose: () => fin(false), content: h('p', { class: 'muted pre' }, text || ''),
      footer: h('div', { class: 'row gap' }, btn(cancel, { class: 'btn ghost grow', onclick: () => s.close() }), btn(ok, { class: 'btn grow ' + (danger ? 'danger' : 'primary'), onclick: () => { fin(true); s.close(); } })) });
  });
}

// ---------- petits composants ----------
export function stepper(value, { min = 0, max = 9999, step = 1, onChange, fmt = v => v } = {}) {
  let v = value; const out = h('span', { class: 'step-val', 'aria-live': 'polite' }, fmt(v));
  const set = n => { v = Math.min(max, Math.max(min, Math.round(n * 1000) / 1000)); out.textContent = fmt(v); minus.disabled = v <= min; plus.disabled = v >= max; onChange && onChange(v); };
  const minus = h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Moins', onclick: () => set(v - step) }, icon('minus', 18));
  const plus = h('button', { type: 'button', class: 'step-btn', 'aria-label': 'Plus', onclick: () => set(v + step) }, icon('plus', 18));
  const el = h('div', { class: 'stepper' }, minus, out, plus); minus.disabled = v <= min; plus.disabled = v >= max;
  el.get = () => v; el.set = set; return el;
}
export function seg(options, value, onChange) {
  const el = h('div', { class: 'seg', role: 'tablist' });
  const draw = () => { clear(el); for (const [v, label] of options) el.append(h('button', { type: 'button', role: 'tab', 'aria-selected': String(v === value), class: v === value ? 'on' : '', onclick: () => { value = v; draw(); onChange(v); } }, label)); };
  draw(); return el;
}
export function chip(label, on, onclick, extra = {}) { return h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': String(!!on), onclick, ...extra }, label); }
export function field(label, input, hint) { return h('label', { class: 'field' }, h('span', { class: 'lab' }, label), input, hint ? h('span', { class: 'hint' }, hint) : null); }
export function empty(emoji, title, text, action) { return h('div', { class: 'empty' }, h('div', { class: 'em' }, emoji), h('h3', null, title), text ? h('p', { class: 'muted' }, text) : null, action || null); }
export function section(title, right, ...kids) { return h('section', { class: 'sec' }, h('div', { class: 'sec-head' }, h('h2', null, title), right || null), ...kids); }

export const CAT_TINT = {
  'Pâtes': ['#f4e4c1', '#3b3122'], 'Riz': ['#ece6d8', '#34302a'], 'Poêlées': ['#fbd9c4', '#3e2a20'], 'Curry': ['#f9e19f', '#3b321a'], 'Soupes': ['#f9d5bb', '#3e2a1f'],
  'Salades': ['#d8ebcf', '#22331f'], 'Gratins & four': ['#f5dfb4', '#3a2f1c'], 'Tartes & pizzas': ['#f7d3cb', '#3c2422'], 'Œufs': ['#fdedb5', '#3a341c'], 'Sandwichs': ['#eddcc6', '#352c22'],
  'Poisson': ['#d1e6ee', '#1c2e35'], 'Plats mijotés': ['#e9d0c7', '#352421'], 'Desserts': ['#f6d5e3', '#3a2230'], 'Petit-déjeuner': ['#fbe4c3', '#3a3022'], 'Mes recettes': ['#e2dbf1', '#2b2538'] };
const CAT_EMO = { 'Pâtes': '🍝', 'Riz': '🍚', 'Poêlées': '🍳', 'Curry': '🍛', 'Soupes': '🍲', 'Salades': '🥗', 'Gratins & four': '🧀', 'Tartes & pizzas': '🥧', 'Œufs': '🥚', 'Sandwichs': '🥪', 'Poisson': '🐟', 'Plats mijotés': '🥘', 'Desserts': '🍰', 'Petit-déjeuner': '🥞', 'Mes recettes': '👩‍🍳' };
const ROLE_PRI = ['fish', 'meat', 'legume', 'tofu', 'egg', 'dough', 'starch', 'cheese', 'veg', 'fruit', 'leaf'];
export function recipeEmoji(r, kb) {
  if (CAT_EMO[r.c] && ['Pâtes', 'Soupes', 'Salades', 'Desserts', 'Sandwichs', 'Tartes & pizzas', 'Petit-déjeuner', 'Curry'].includes(r.c)) return CAT_EMO[r.c];
  for (const role of ROLE_PRI) { const f = r.i.map(x => kb.get(x[0])).find(k => k && k.role === role); if (f) return f.emoji; }
  return CAT_EMO[r.c] || '🍽️';
}
export function tint(r) { const [l, d] = CAT_TINT[r && r.c] || ['#ece6dc', '#3a3029']; return { '--pl': l, '--pd': d }; }
export function plate(r, kb, size = 'md') { return h('div', { class: 'plate ' + size, style: tint(r), 'aria-hidden': 'true' }, recipeEmoji(r, kb)); }
export const tile = plate;
export function meta(pairs, cls = '') { return h('div', { class: 'meta ' + cls }, pairs.filter(Boolean).map(([ic, t]) => h('span', null, icon(ic, 15), t))); }
