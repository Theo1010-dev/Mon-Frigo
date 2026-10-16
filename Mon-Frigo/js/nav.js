// Navigation + état d'interface partagé entre vues et feuilles (évite les imports circulaires).
export const nav = { go: () => {}, tab: 'home' };
export const RUI = { q: '', cats: new Set(), quick: { cook: false, fast: false, anti: false, veg: false, fav: false, mine: false }, sort: 'perso', maxTime: 0, shown: 30 };
export const SUI = { q: '', zone: 'all', chip: '' };
export const PUI = { start: null };
export const num = v => { const n = parseFloat(String(v).replace(',', '.').replace(/\s/g, '')); return isNaN(n) ? NaN : n; };
