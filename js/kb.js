// Base d'ingrédients : résolution de noms libres vers un ingrédient connu.
import { norm } from './util.js';

// Ce que l'utilisateur a toujours chez lui : jamais dans les courses, ne bloque pas une recette.
export const DEFAULT_PANTRY = ['sel', 'poivre', 'huile-olive', 'eau'];
export const SPOONISH = ['c. à café', 'c. à soupe', 'pincée'];
export class KB {
  constructor(list = []) {
    this.pantry = new Set(DEFAULT_PANTRY);
    this.list = list; this.byId = new Map(); this.idx = new Map(); this.alias = [];
    for (const i of list) {
      this.byId.set(i.id, i);
      for (const a of [i.n, ...i.al, i.id.replace(/-/g, ' ')]) {
        const k = norm(a); if (!k) continue;
        if (!this.idx.has(k)) this.idx.set(k, i.id);
        if (k.length >= 3) this.alias.push([k, i.id]);
      }
    }
    this.alias.sort((a, b) => b[0].length - a[0].length); // alias les plus longs d'abord
  }
  add(i) {
    if (this.byId.has(i.id)) return;
    this.list.push(i); this.byId.set(i.id, i); this._groups = null;
    for (const a of [i.n, ...i.al]) { const k = norm(a); if (k && !this.idx.has(k)) this.idx.set(k, i.id); }
  }
  get(id) { return this.byId.get(id) || null; }
  isPantry(id) { return id === 'eau' || this.pantry.has(id); }
  setPantry(list) { this.pantry = new Set([...(list || []), 'eau']); this.pantryV = (this.pantryV || 0) + 1; }
  subsOf(id) {
    const k = this.byId.get(id); if (!k || !k.sub) return [];
    if (!this._groups) { this._groups = new Map(); for (const i of this.list) if (i.sub) { if (!this._groups.has(i.sub)) this._groups.set(i.sub, []); this._groups.get(i.sub).push(i.id); } }
    return this._groups.get(k.sub).filter(x => x !== id);
  }
  resolve(text) {
    const n = norm(text); if (!n) return null;
    if (this.idx.has(n)) return this.idx.get(n);
    for (const v of [n.replace(/s$/, ''), n + 's', n.replace(/x$/, ''), n.replace(/aux$/, 'al')]) if (this.idx.has(v)) return this.idx.get(v);
    // alias contenu comme mot entier ("poulet fermier" -> poulet)
    const padded = ' ' + n + ' ';
    for (const [k, id] of this.alias) {
      if (padded.includes(' ' + k + ' ') || padded.includes(' ' + k + 's ')) return id;
    }
    return null;
  }
  suggest(text, limit = 8) {
    const n = norm(text); if (!n) return [];
    const out = [];
    for (const i of this.list) {
      const nm = norm(i.n), al = i.al.map(norm); let s = null;
      if (nm === n) s = 0; else if (nm.startsWith(n)) s = 1; else if (al.includes(n)) s = 2;
      else if (nm.split(' ').some(w => w.startsWith(n))) s = 3; else if (al.some(a => a.startsWith(n))) s = 4;
      else if (n.length >= 5 && (nm.includes(n) || al.some(a => a.includes(n)))) s = 5;
      if (s !== null) out.push([s, i]);
    }
    const exact = out.some(x => x[0] === 0 || x[0] === 2); // un produit correspond exactement : pas de rapprochement lointain
    return out.filter(x => !exact || x[0] <= 3).sort((a, b) => a[0] - b[0] || a[1].n.length - b[1].n.length).slice(0, limit).map(x => x[1]);
  }
  name(id, fallback = '') { return (this.byId.get(id) || {}).n || fallback; }
}
export const kb = new KB();
export function loadKB(list) { const k = new KB(list); Object.assign(kb, k); return kb; }
