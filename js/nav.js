// Navigation + état d'interface partagé entre vues et feuilles (évite les imports circulaires).
export const nav = { go: () => {}, tab: 'home' };
export const RUI = { q: '', moment: 'all', kitchen: '', cats: new Set(), cuis: new Set(), equip: new Set(), quick: { cook: false, fast: false, chef: false, season: false, anti: false, veg: false, fav: false, mine: false, cheap: false, never: false, myEquip: false }, sort: 'perso', maxTime: 0, shown: 30 };
// remet tous les filtres de l'onglet Recettes à zéro (avec une recherche éventuelle)
export function resetRUI(q = '') { RUI.q = q; RUI.moment = 'all'; RUI.kitchen = ''; RUI.cats.clear(); RUI.cuis.clear(); RUI.equip.clear(); for (const k of Object.keys(RUI.quick)) RUI.quick[k] = false; RUI.maxTime = 0; RUI.sort = 'perso'; RUI.shown = 30; }
export const SUI = { q: '', zone: 'all', chip: '' };
export const PUI = { start: null };
export const num = v => { const n = parseFloat(String(v).replace(',', '.').replace(/\s/g, '')); return isNaN(n) ? NaN : n; };
