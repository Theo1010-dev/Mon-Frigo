// « Toujours chez moi » : les produits qu'on a en permanence (placard ou frigo).
// Ils comptent toujours comme disponibles : ils ne bloquent jamais une recette et ne vont jamais dans les courses.
import { h, btn, openSheet, toast, clear, haptic } from './ui.js';
import { icon } from './icons.js';
import { S, setPref } from './state.js';

const PANTRY_GROUPS = [
  ['🧂', 'Assaisonnement', ['sel', 'poivre', 'huile-olive', 'vinaigre', 'moutarde']],
  ['🌶️', 'Épices et herbes', ['paprika', 'cumin', 'curry', 'curcuma', 'garam-masala', 'cannelle', 'herbes-provence', 'epices', 'vanille']],
  ['🧁', 'Pâtisserie', ['farine', 'sucre', 'levure', 'maizena', 'miel']],
  ['🥫', 'Épicerie', ['pates', 'riz', 'bouillon', 'sauce-soja', 'ketchup', 'mayonnaise', 'chapelure']],
  ['🧄', 'Frais du quotidien', ['ail', 'oignon', 'beurre', 'lait', 'oeufs']],
];
const PANTRY_PRESETS = [
  ['Le strict minimum', ['sel', 'poivre', 'huile-olive']],
  ['Cuisine bien équipée', ['sel', 'poivre', 'huile-olive', 'vinaigre', 'moutarde', 'farine', 'sucre', 'levure', 'paprika', 'cumin', 'curry', 'herbes-provence', 'bouillon', 'ail', 'oignon']],
];
const grouped = new Set(PANTRY_GROUPS.flatMap(g => g[2]));
export const pantryNow = () => (S.data.prefs.pantry || []).filter(id => id !== 'eau' && S.kb.get(id));
export function pantrySummary(list = pantryNow()) {
  if (!list.length) return 'Rien pour l’instant';
  const names = list.map(id => S.kb.get(id).n);
  return `${list.length} produit${list.length > 1 ? 's' : ''} : ${names.slice(0, 4).join(', ')}${names.length > 4 ? '…' : ''}`;
}
// éditeur réutilisé dans « Moi », l'accueil de bienvenue et le stock
// get() renvoie la liste actuelle, set(liste) l'enregistre (ou la garde en brouillon)
export function pantryEditor(get, set) {
  const kb = S.kb, box = h('div', { class: 'pan' });
  const draw = () => {
    clear(box); const list = get(), on = new Set(list);
    const tile = id => { const k = kb.get(id); if (!k) return null; const sel = on.has(id);
      return h('button', { type: 'button', class: 'pan-tile' + (sel ? ' on' : ''), 'aria-pressed': String(sel), 'aria-label': `${k.n}${sel ? ', toujours chez moi' : ''}`,
        onclick: () => { haptic(6); set(sel ? list.filter(x => x !== id) : [...list, id]); draw(); } },
        h('span', { class: 'pan-e' }, k.emoji), h('span', { class: 'pan-n' }, k.n), sel ? h('span', { class: 'pan-ck' }, icon('check', 12)) : null); };
    box.append(h('div', { class: 'chips scroll pan-presets' },
      ...PANTRY_PRESETS.map(([l, ids]) => h('button', { type: 'button', class: 'chip', onclick: () => { set([...new Set([...list, ...ids])]); draw(); toast(`${l} : coché`); } }, '＋ ', l)),
      list.length ? h('button', { type: 'button', class: 'chip', onclick: () => { set([]); draw(); } }, 'Tout décocher') : null));
    for (const [e, name, ids] of PANTRY_GROUPS) { const n = ids.filter(i => on.has(i)).length;
      box.append(h('h3', { class: 'group-title' }, `${e} ${name}`, n ? h('span', { class: 'n' }, String(n)) : null), h('div', { class: 'pan-grid' }, ids.map(tile))); }
    const extra = list.filter(id => !grouped.has(id));
    if (extra.length) box.append(h('h3', { class: 'group-title' }, '✨ Ajoutés par toi'), h('div', { class: 'pan-grid' }, extra.map(tile)));
    // n'importe quel autre produit connu
    const inp = h('input', { class: 'input', placeholder: 'Un autre produit (ex. crème, citron…)', 'aria-label': 'Ajouter un autre produit toujours chez moi', autocomplete: 'off' }), sug = h('div', { class: 'chips wrap' });
    const suggest = () => { clear(sug); const q = inp.value.trim(); if (!q) return; const res = kb.suggest(q, 6).filter(i => i.id !== 'eau' && !on.has(i.id));
      if (!res.length) { sug.append(h('span', { class: 'hint' }, 'Aucun produit connu à ce nom.')); return; }
      for (const i of res) sug.append(h('button', { type: 'button', class: 'chip', onclick: () => { set([...list, i.id]); draw(); toast(`${i.n} : toujours chez toi`); } }, `${i.emoji} ${i.n}`)); };
    inp.addEventListener('input', suggest);
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const first = sug.querySelector('button'); if (first) first.click(); } });
    box.append(h('h3', { class: 'group-title' }, '➕ Autre chose'), inp, sug);
  };
  draw(); return box;
}
export const PANTRY_HELP = 'Ce que tu as en permanence, au placard ou au frigo. Ces produits comptent toujours comme disponibles : ils ne bloquent jamais une recette et ne partent jamais dans les courses. Coche seulement ce qui ne manque vraiment jamais chez toi.';
// fenêtre dédiée (depuis le stock ou une recette)
export function openPantry() {
  let draft = pantryNow();
  const s = openSheet({ title: 'Toujours chez moi', size: 'tall', content: h('div', { class: 'stack' }, h('p', { class: 'muted' }, PANTRY_HELP), pantryEditor(() => draft, l => { draft = l; })),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => { setPref({ pantry: draft }); s.close(); toast('C’est noté'); } }) });
}
