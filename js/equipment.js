// « Mon équipement » : les appareils de ta cuisine (plaques, four, micro-ondes, mixeur, air fryer, Thermomix, Cookeo, barbecue, raclette, gaufrier).
// Une recette qui demande un appareil que tu n'as pas reste visible, grisée, avec « Il faut un four ».
import { h, btn, openSheet, toast, clear, haptic } from './ui.js';
import { icon } from './icons.js';
import { S, setPref } from './state.js';
import { EQUIP, EQUIP_EMOJI, equipName, equipText, equipWithArticle, allowed } from './recipes.js';

export const equipNow = () => S.data.prefs.equip || [];
export function equipSummary(list = equipNow()) {
  const names = EQUIP.filter(([k]) => list.includes(k)).map(([k]) => equipText(k));
  return names.length ? names.join(', ').replace(/^./, c => c.toUpperCase()) : 'Aucun appareil';
}
// « un four », « des plaques de cuisson et un mixeur »
export const withArticle = keys => keys.map(equipWithArticle).join(' et ');
const needing = k => S.cat.list.filter(r => !r.custom && (r.e || []).includes(k) && allowed(r, S.data.prefs, S.kb, true)).length;

// éditeur réutilisé dans « Moi », l’accueil de bienvenue et la fenêtre dédiée : tous les appareils, avec le nombre de recettes qui en ont besoin
export function equipEditor(get, set) {
  const box = h('div', { class: 'pan-grid eq' });
  const draw = () => {
    clear(box); const list = get();
    for (const [k] of EQUIP) {
      const on = list.includes(k), n = needing(k);
      box.append(h('button', { type: 'button', class: 'pan-tile' + (on ? ' on' : ''), 'aria-pressed': String(on), 'aria-label': `${equipName(k)}${on ? ', je l’ai' : ''}, ${n} recette${n > 1 ? 's' : ''}`,
        onclick: () => { haptic(6); set(on ? list.filter(x => x !== k) : [...list, k]); draw(); } },
      h('span', { class: 'pan-e' }, EQUIP_EMOJI[k]), h('span', { class: 'pan-n' }, equipName(k)), h('span', { class: 'pan-s' }, `${n} recette${n > 1 ? 's' : ''}`),
      on ? h('span', { class: 'pan-ck' }, icon('check', 12)) : null));
    }
  };
  draw(); return box;
}
export const EQUIP_HELP = 'Coche les appareils que tu as. Une recette prévue pour un autre appareil reste faisable si un des tiens le remplace (un burger à la poêle, des frites au four) ; sinon, elle est grisée.';

// fenêtre dédiée (depuis « Ma cuisine », les recettes ou l'assistant)
export function openEquipment(onDone) {
  let draft = equipNow().slice();
  const s = openSheet({ title: 'Mon équipement', content: h('div', { class: 'stack' }, h('p', { class: 'muted' }, EQUIP_HELP), equipEditor(() => draft, l => { draft = l; })),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => { setPref({ equip: draft }); s.close(); toast('C’est noté'); onDone && onDone(); } }) });
}
// ajoute un appareil d'un geste (« J'ai un four » dans une recette grisée)
export function addEquip(keys) { setPref({ equip: [...new Set([...equipNow(), ...keys])] }); haptic(10); toast(`C’est noté : tu as ${withArticle(keys)}`); }
