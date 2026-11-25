// Alertes de péremption : notification (une fois par jour au plus) quand des produits expirent aujourd'hui ou demain.
// Sans serveur : vérification à l'ouverture de l'app + vérification en arrière-plan (Chrome Android, app installée).
import { S, setPref, db } from './state.js';
import { todayISO, daysBetween } from './util.js';

const notifySupported = () => 'Notification' in window && 'serviceWorker' in navigator;
function expiringSummary(stock, today) {
  const t = [], tm = [], ex = [];
  for (const it of stock) { if (!it.expiry) continue; const d = daysBetween(today, it.expiry); if (d < 0) ex.push(it.name); else if (d === 0) t.push(it.name); else if (d === 1) tm.push(it.name); }
  if (!t.length && !tm.length) return null;
  const parts = []; if (t.length) parts.push(`Aujourd'hui : ${t.join(', ')}`); if (tm.length) parts.push(`Demain : ${tm.join(', ')}`);
  const n = t.length + tm.length;
  return { title: `${n} produit${n > 1 ? 's' : ''} à consommer vite`, body: parts.join('\n') + '\nTouche pour voir des idées de recettes.' };
}
export async function enableNotifications() {
  if (!notifySupported()) return 'unsupported';
  const p = await Notification.requestPermission();
  if (p !== 'granted') { setPref({ notify: false }); return p; }
  setPref({ notify: true }); await registerBackgroundCheck(); await checkExpiry({ force: true }); return 'granted';
}
export async function registerBackgroundCheck() {
  try {
    const reg = await navigator.serviceWorker.ready;
    if (reg.periodicSync) { const st = await navigator.permissions.query({ name: 'periodic-background-sync' }).catch(() => null); if (!st || st.state === 'granted') await reg.periodicSync.register('peremption', { minInterval: 12 * 3600 * 1000 }); }
  } catch { /* non disponible : la vérification à l'ouverture suffit */ }
}
export async function checkExpiry({ force = false } = {}) {
  if (!S.data.prefs.notify || !notifySupported() || Notification.permission !== 'granted') return false;
  const today = todayISO(), all = await db.loadAll().catch(() => ({}));
  if (!force && all.notifyDay === today) return false;
  const msg = expiringSummary(S.data.stock, today); if (!msg) return false;
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification(msg.title, { body: msg.body, icon: 'icon-192.png', badge: 'favicon.png', tag: 'peremption', data: { url: './#/home' } });
  db.put('notifyDay', today); return true;
}
