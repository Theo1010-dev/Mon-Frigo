// Point d'entrée : chargement, navigation, thème, service worker.
import { S, init, subscribe, setPref, VERSION } from './state.js';
import { h, clear, toast, $, $$, sheetCount } from './ui.js';
import { icon } from './icons.js';
import { nav } from './nav.js';
import * as V from './views.js';
import { openOnboarding } from './sheets2.js';
import { migrateFromV09 } from './migrate.js';

const VIEWS = { home: V.viewHome, stock: V.viewStock, recipes: V.viewRecipes, plan: V.viewPlan, shop: V.viewShop, me: V.viewMe };
const TABS = [['home', 'Accueil', 'home'], ['stock', 'Stock', 'fridge'], ['recipes', 'Recettes', 'utensils'], ['plan', 'Semaine', 'calendar'], ['shop', 'Courses', 'cart']];
let lastTab = null;

function render() {
  if (!S.ready) return;
  const view = $('#view'), same = lastTab === nav.tab, y = window.scrollY;
  const active = document.activeElement, keepFocus = same && active && view.contains(active) && active.matches('input,textarea') ? { ph: active.getAttribute('placeholder'), pos: active.selectionStart } : null;
  clear(view);
  try { view.append(VIEWS[nav.tab]()); } catch (e) { console.error(e); view.append(h('div', { class: 'empty' }, h('div', { class: 'em' }, '😕'), h('h3', null, 'Oups, un souci d’affichage'), h('p', { class: 'muted' }, String(e.message || e)))); }
  for (const b of $$('#tabbar button')) { const on = b.dataset.tab === nav.tab; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); }
  const shopN = S.data.shop.filter(x => !x.done).length, badge = $('#tabbar [data-tab="shop"] .badge-n'); badge.textContent = shopN > 99 ? '99+' : shopN; badge.hidden = !shopN;
  if (same) window.scrollTo(0, y); else window.scrollTo(0, 0);
  if (keepFocus) { const el = [...view.querySelectorAll('input,textarea')].find(x => x.getAttribute('placeholder') === keepFocus.ph); if (el) { el.focus(); try { el.setSelectionRange(keepFocus.pos, keepFocus.pos); } catch {} } }
  lastTab = nav.tab;
}
function route() { const t = location.hash.replace(/^#\/?/, ''); nav.tab = VIEWS[t] ? t : 'home'; render(); }
nav.render = render;
nav.go = tab => { if (location.hash !== '#/' + tab) location.hash = '#/' + tab; else render(); };

function applyTheme() {
  const t = S.data.prefs.theme, root = document.documentElement;
  if (t === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  $('meta[name="theme-color"]').setAttribute('content', dark ? '#151118' : '#f3f5f7');
}

function shell() {
  const tabbar = $('#tabbar'); clear(tabbar);
  for (const [k, l, ic] of TABS) tabbar.append(h('button', { type: 'button', 'data-tab': k, onclick: () => nav.go(k) }, h('span', { class: 'ti' }, icon(ic, 24), k === 'shop' ? h('span', { class: 'badge-n', hidden: '' }) : null), h('span', { class: 'tl' }, l)));
}

async function start() {
  shell();
  try { await init(); }
  catch (e) { console.error(e); $('#view').append(h('div', { class: 'empty' }, h('div', { class: 'em' }, '📡'), h('h3', null, 'Impossible de charger l’application'), h('p', { class: 'muted' }, 'Vérifie ta connexion pour le premier lancement, puis réessaie.'), h('button', { class: 'btn primary', onclick: () => location.reload() }, 'Réessayer'))); return; }
  document.body.classList.remove('loading');
  applyTheme(); matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  let lastTheme = S.data.prefs.theme;
  subscribe(() => { if (S.data.prefs.theme !== lastTheme) { lastTheme = S.data.prefs.theme; applyTheme(); } render(); });
  const mig = await migrateFromV09();
  addEventListener('hashchange', route); route();
  if (mig && (mig.stock || mig.shop)) setTimeout(() => toast(`Données de l’ancienne version récupérées : ${mig.stock} produit(s), ${mig.shop} article(s) de courses`, { ms: 7000 }), 900);
  if (!S.data.prefs.onboarded) setTimeout(openOnboarding, 350);
  // hors ligne
  const net = () => document.body.classList.toggle('offline', !navigator.onLine);
  addEventListener('online', () => { net(); toast('Connexion rétablie'); }); addEventListener('offline', () => { net(); toast('Hors ligne : tout continue de fonctionner'); }); net();
  // installation PWA
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); nav.installPrompt = e; if (nav.tab === 'me') render(); });
  // retour au premier plan après minuit : rafraîchir les dates
  let day = new Date().toDateString(); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && new Date().toDateString() !== day) { day = new Date().toDateString(); render(); } });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const t0 = Date.now(); let reloaded = false;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      if (Date.now() - t0 < 8000 && sheetCount() === 0) { reloaded = true; location.reload(); }
      else toast('Une nouvelle version est prête', { action: { label: 'Recharger', fn: () => { reloaded = true; location.reload(); } }, ms: 10000 });
    });
  }
  window.__monFrigo = { S, VERSION };
}
start();
