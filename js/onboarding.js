// Premier lancement (bienvenue et réglages) et restauration d’une sauvegarde.
import * as Backup from './backup.js';
import { h, btn, openSheet, toast, stepper, seg, clear } from './ui.js';
import { S, set, setPref, rebuildCatalogue, DEFAULT_PREFS, KEYS, db } from './state.js';
import { todayISO } from './util.js';
import { DEFAULT_PANTRY } from './kb.js';
import { pantryEditor } from './pantry.js';
import { equipEditor } from './equipment.js';

const kb = S.kb;

// ---------- premier lancement ----------
export function openOnboarding() {
  const p = { ...S.data.prefs }; const box = h('div', { class: 'form' });
  const draw = () => { clear(box); box.append(
    h('p', { class: 'muted' }, 'Quelques réglages pour des recettes et des courses adaptées. Tu pourras tout changer dans « Moi ».'),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Pour combien de personnes cuisines-tu ?'), stepper(p.people, { min: 1, max: 10, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => { p.people = v; } })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Budget courses par semaine (€)'), h('input', { class: 'input', inputmode: 'numeric', value: p.budget, onchange: e => { p.budget = Math.max(0, parseInt(e.target.value) || 0); } })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Régime'), seg([['omni', 'Tout'], ['pesco', 'Pesco'], ['veg', 'Végé'], ['vegan', 'Végan']], p.diet, v => { p.diet = v; })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ton équipement'), equipEditor(() => p.equip, l => { p.equip = l; })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ce que tu as toujours chez toi'), h('span', { class: 'hint' }, 'Ces produits comptent toujours comme disponibles : ils ne bloquent jamais une recette et ne vont jamais dans les courses.'),
      pantryEditor(() => p.pantry || DEFAULT_PANTRY.filter(x => x !== 'eau'), l => { p.pantry = l; })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Aliments que tu évites (séparés par des virgules)'), h('input', { class: 'input', placeholder: 'champignons, poisson…', value: p.dislikes.join(', '), onchange: e => { p.dislikes = e.target.value.split(',').map(x => x.trim()).filter(Boolean); } }))); };
  draw();
  const s = openSheet({ title: 'Bienvenue 👋', size: 'tall', content: box, onClose: () => { if (!S.data.prefs.onboarded) setPref({ onboarded: true }); },
    footer: btn('Commencer', { class: 'btn primary block big', onclick: () => { document.activeElement && document.activeElement.blur(); setPref({ ...p, pantry: p.pantry || DEFAULT_PANTRY.filter(x => x !== 'eau'), onboarded: true }); s.close(); } }) });
}

// ---------- import de sauvegarde ----------
export function openImport(file) {
  const rd = new FileReader();
  rd.onerror = () => toast('Impossible de lire ce fichier');
  rd.onload = () => {
    let obj; try { obj = JSON.parse(rd.result); } catch { toast('Ce fichier n’est pas un JSON valide'); return; }
    const v = Backup.validate(obj); if (!v.ok) { toast(v.errors[0]); return; }
    const c = v.counts; const s = openSheet({ title: 'Importer une sauvegarde', size: 'small', content: h('div', { class: 'form' }, h('p', null, `Cette sauvegarde contient ${c.stock} produit(s) en stock, ${c.shop} article(s) de courses, ${c.history} repas cuisinés, ${c.custom} recette(s) perso, ${c.fav} favori(s).`), h('p', { class: 'muted' }, 'Un point de restauration de tes données actuelles est créé automatiquement avant tout import.')),
      footer: h('div', { class: 'row gap' }, btn('Fusionner', { class: 'btn soft grow', onclick: () => apply('merge') }), btn('Remplacer', { class: 'btn danger grow', onclick: () => apply('replace') })) });
    function apply(mode) {
      const cur = Object.fromEntries(KEYS.map(k => [k, S.data[k]])); db.put('preImport', cur);
      const base = Backup.normalize({}, { ...Object.fromEntries(KEYS.map(k => [k, Array.isArray(S.data[k]) ? [] : (typeof S.data[k] === 'object' && S.data[k] ? {} : null)])), prefs: { ...DEFAULT_PREFS }, meta: { created: todayISO(), lastBackup: null, flagged: [] } });
      const inc = obj.data; const next = mode === 'merge' ? Backup.merge(cur, inc) : Backup.normalize(inc, base);
      for (const k of KEYS) { S.data[k] = next[k]; db.put(k, next[k]); } for (const ci of S.data.customIng) kb.add(ci); rebuildCatalogue(); set('prefs', S.data.prefs);
      s.close(); toast(mode === 'merge' ? 'Sauvegarde fusionnée' : 'Sauvegarde restaurée', { undo: () => restorePre() }); }
  };
  rd.readAsText(file);
}

export async function restorePre() {
  const all = await db.loadAll(); const pre = all.preImport; if (!pre) { toast('Aucun point de restauration disponible'); return false; }
  for (const k of KEYS) if (pre[k] !== undefined) { S.data[k] = pre[k]; db.put(k, pre[k]); } for (const ci of S.data.customIng) kb.add(ci); rebuildCatalogue(); set('prefs', S.data.prefs); toast('Données précédentes restaurées'); return true;
}
