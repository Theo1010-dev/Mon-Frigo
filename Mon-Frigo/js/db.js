// Stockage local : IndexedDB (clé/valeur) avec repli sur localStorage. Tout reste sur l'appareil.
const DB = 'mon-frigo', STORE = 'kv', LS = 'mon-frigo:';
let db = null, mode = 'idb';

function openDB() {
  return new Promise((res, rej) => {
    if (!('indexedDB' in globalThis)) return rej(new Error('no idb'));
    const rq = indexedDB.open(DB, 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore(STORE);
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); rq.onblocked = () => rej(new Error('blocked'));
  });
}
export async function loadAll() {
  try { db = await openDB(); } catch { mode = 'ls'; }
  const out = {};
  if (mode === 'idb') {
    await new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly'), st = tx.objectStore(STORE), rq = st.openCursor();
      rq.onsuccess = () => { const c = rq.result; if (c) { out[c.key] = c.value; c.continue(); } else res(); };
      rq.onerror = () => rej(rq.error);
    }).catch(() => { mode = 'ls'; });
  }
  if (mode === 'ls') for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(LS)) { try { out[k.slice(LS.length)] = JSON.parse(localStorage.getItem(k)); } catch {} } }
  return out;
}
const pending = new Map(); let timer = null;
export function put(key, value) { pending.set(key, value); clearTimeout(timer); timer = setTimeout(flush, 120); }
export function flush() {
  clearTimeout(timer); const items = [...pending.entries()]; pending.clear(); if (!items.length) return Promise.resolve();
  if (mode === 'idb') return new Promise(res => {
    try { const tx = db.transaction(STORE, 'readwrite'), st = tx.objectStore(STORE); for (const [k, v] of items) st.put(JSON.parse(JSON.stringify(v)), k); tx.oncomplete = () => res(true); tx.onerror = tx.onabort = () => { writeLS(items); res(false); }; } catch { writeLS(items); res(false); }
  });
  writeLS(items); return Promise.resolve(true);
}
function writeLS(items) { for (const [k, v] of items) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {} } }
export async function clearAll() {
  pending.clear();
  if (mode === 'idb' && db) await new Promise(res => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).clear(); tx.oncomplete = tx.onerror = () => res(); });
  Object.keys(localStorage).filter(k => k.startsWith(LS)).forEach(k => localStorage.removeItem(k));
}
export const storageMode = () => mode;
// demande au navigateur de ne pas effacer les données en cas de manque de place (important sur Android)
export async function requestPersistence() { try { return navigator.storage && navigator.storage.persist ? await navigator.storage.persist() : false; } catch { return false; } }
addEventListener('pagehide', () => { flush(); }); addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
