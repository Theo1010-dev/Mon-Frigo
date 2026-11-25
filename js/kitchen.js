// Vue « Ma cuisine » : le stock rangé dans une cuisine dessinée (frigo américain ouvert, congélateur, placard, plan de travail).
// Même données que la liste : c'est juste une autre façon de voir. Toucher un produit ouvre sa fiche.
// Les étagères sont une seule zone qui passe à la ligne : la largeur de l'écran décide du nombre d'articles par rayon.
import { h, haptic } from './ui.js';
import { S } from './state.js';
import { status, sortStock } from './stock.js';
import { todayISO } from './util.js';
import { fmtQty } from './units.js';
import { EQUIP, EQUIP_EMOJI } from './recipes.js';

const emoOf = it => (it.ing && S.kb.get(it.ing) ? S.kb.get(it.ing).emoji : it.unit === 'portion' ? '🥡' : '🍽️');
const SAY = { urgent: ', à consommer vite', expired: ', périmé', soon: ', bientôt' };
function token(it, t, onOpen) {
  const st = status(it, t).key;
  return h('button', { type: 'button', class: 'k-item st-' + st, 'aria-label': `${it.name}, ${fmtQty(it.qty, it.unit)}${SAY[st] || ''}`, onclick: () => { haptic(6); onOpen(it.id); } },
    h('span', { class: 'k-e', 'aria-hidden': 'true' }, emoOf(it)), h('span', { class: 'k-n', 'aria-hidden': 'true' }, it.name),
    st === 'urgent' || st === 'expired' ? h('span', { class: 'k-flag', 'aria-hidden': 'true' }, st === 'expired' ? '×' : '!') : null);
}
const shelves = (items, min, t, onOpen) => h('div', { class: 'k-shelves', style: { '--min': min } }, items.map(it => token(it, t, onOpen)));
const label = (name, n) => h('span', { class: 'k-count' }, name, h('b', null, String(n)));
const doors = (cls, bins) => [h('i', { class: `${cls} l`, 'aria-hidden': 'true' }, ...Array.from({ length: bins }, () => h('i', { class: 'k-bin' }))), h('i', { class: `${cls} r`, 'aria-hidden': 'true' }, ...Array.from({ length: bins }, () => h('i', { class: 'k-bin' })))];

export function kitchenView(onOpen, onPantry, onEquip) {
  const t = todayISO(), st = S.data.stock.slice().sort(sortStock), by = z => st.filter(x => x.zone === z);
  const fridge = by('frigo'), freezer = by('congelateur'), cup = by('placard'), other = st.filter(x => !['frigo', 'congelateur', 'placard'].includes(x.zone));
  const pantry = (S.data.prefs.pantry || []).filter(id => id !== 'eau' && S.kb.get(id));
  const appl = EQUIP.filter(([k]) => (S.data.prefs.equip || []).includes(k));
  return h('div', { class: 'kitchen', role: 'region', 'aria-label': 'Ma cuisine' },
    // frigo américain : deux portes ouvertes, rayons en verre, tiroirs du congélateur en bas
    h('div', { class: 'k-fridge' }, label('Frigo', fridge.length),
      h('div', { class: 'k-inside' }, h('i', { class: 'k-light', 'aria-hidden': 'true' }), shelves(fridge, 2, t, onOpen)),
      h('div', { class: 'k-freezer' }, label('Congélo', freezer.length), shelves(freezer, 1, t, onOpen)),
      ...doors('k-door', 3)),
    // placard (garde-manger), portes ouvertes ; l'étagère du haut = « toujours chez toi »
    h('div', { class: 'k-cup' }, label('Placard', cup.length),
      h('div', { class: 'k-cup-in' },
        h('button', { type: 'button', class: 'k-always', onclick: onPantry, 'aria-label': `Toujours chez toi : ${pantry.length} produits, modifier` },
          h('span', { class: 'k-always-t' }, 'Toujours là'),
          h('span', { class: 'k-jars', 'aria-hidden': 'true' }, pantry.length ? pantry.slice(0, 9).map(id => h('span', { class: 'k-jar' }, S.kb.get(id).emoji)) : h('span', { class: 'k-more' }, '＋ choisir'), pantry.length > 9 ? h('span', { class: 'k-more' }, `+${pantry.length - 9}`) : null)),
        shelves(cup, 1, t, onOpen)),
      ...doors('k-cdoor', 0)),
    // plan de travail : le reste (fruits, pain…), et au fond les appareils (four, mixeur…)
    h('div', { class: 'k-counter' }, label('Plan de travail', other.length),
      h('button', { type: 'button', class: 'k-appl', onclick: onEquip, 'aria-label': `Mon équipement : ${appl.map(x => x[1].toLowerCase()).join(', ') || 'aucun appareil'}, modifier` },
        h('span', { class: 'k-always-t' }, 'Appareils'),
        h('span', { class: 'k-jars', 'aria-hidden': 'true' }, appl.map(([k]) => h('span', { class: 'k-jar' }, EQUIP_EMOJI[k])), h('span', { class: 'k-more' }, appl.length ? 'modifier' : '＋ choisir'))),
      other.length ? shelves(other, 1, t, onOpen) : h('p', { class: 'k-empty' }, 'Rien sur le plan de travail')),
    h('div', { class: 'k-legend', 'aria-hidden': 'true' }, h('span', null, h('i', { class: 'k-dot urgent' }), 'à consommer vite'), h('span', null, h('i', { class: 'k-dot soon' }), 'bientôt'), h('span', null, h('i', { class: 'k-dot expired' }), 'périmé')));
}
