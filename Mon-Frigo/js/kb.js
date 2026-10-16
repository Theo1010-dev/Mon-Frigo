// Base d'ingrédients : résolution de noms libres vers un ingrédient connu.
import { norm } from './util.js';

export class KB {
  constructor(list = []) {
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
    this.list.push(i); this.byId.set(i.id, i);
    for (const a of [i.n, ...i.al]) { const k = norm(a); if (k && !this.idx.has(k)) this.idx.set(k, i.id); }
  }
  get(id) { return this.byId.get(id) || null; }
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
    const out = [], seen = new Set();
    const push = (i, s) => { if (!seen.has(i.id)) { seen.add(i.id); out.push([s, i]); } };
    for (const i of this.list) {
      const names = [i.n, ...i.al].map(norm);
      if (names.some(x => x === n)) push(i, 0);
      else if (names.some(x => x.startsWith(n))) push(i, 1);
      else if (names.some(x => x.split(' ').some(w => w.startsWith(n)))) push(i, 2);
      else if (n.length >= 3 && names.some(x => x.includes(n))) push(i, 3);
    }
    return out.sort((a, b) => a[0] - b[0] || a[1].n.length - b[1].n.length).slice(0, limit).map(x => x[1]);
  }
  name(id, fallback = '') { return (this.byId.get(id) || {}).n || fallback; }
}
export const kb = new KB();
export function loadKB(list) { const k = new KB(list); Object.assign(kb, k); return kb; }
