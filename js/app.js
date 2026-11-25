// Point d'entrée : chargement, navigation, thème, service worker.
import { S, init, subscribe, mutate, VERSION } from './state.js';
import { h, clear, toast, $, $$, sheetCount } from './ui.js';
import { icon } from './icons.js';
import { nav } from './nav.js';
import * as V from './views.js';
import { viewPlan } from './week.js';
import { migrateFromV09 } from './migrate.js';
import { affinity } from './habits.js';
import { applyTheme, current as themeNow } from './theme.js';
import { levelUp, badgeBanner, xpFloat } from './profile.js';
import { stats as rpgStats, earned } from './rpg.js';
import { checkExpiry, registerBackgroundCheck } from './notify.js';
import { setHabitsProvider } from './state.js';
import { openOnboarding } from './onboarding.js';

const VIEWS = { home: V.viewHome, stock: V.viewStock, recipes: V.viewRecipes, plan: viewPlan, shop: V.viewShop, me: V.viewMe };
const TABS = [['home', 'Accueil', 'home'], ['stock', 'Stock', 'fridge'], ['recipes', 'Recettes', 'utensils'], ['plan', 'Semaine', 'calendar'], ['shop', 'Courses', 'cart']];
let lastTab = null;

const SCROLL = {}; // position de défilement mémorisée par onglet
function render() {
  if (!S.ready) return;
  const view = $('#view'), same = lastTab === nav.tab, y = window.scrollY;
  if (lastTab && !same) SCROLL[lastTab] = y;
  // on ne remet le curseur que dans un champ de saisie de texte, identifié sans ambiguïté (jamais une case à cocher)
  const active = document.activeElement, textual = active && active.matches('textarea, input:not([type]), input[type=text], input[type=search], input[type=number]');
  const fkey = textual ? (active.getAttribute('aria-label') || active.getAttribute('placeholder')) : null;
  const keepFocus = same && fkey && view.contains(active) ? { key: fkey, pos: active.selectionStart } : null;
  clear(view);
  try { view.append(VIEWS[nav.tab]()); } catch (e) { console.error(e); view.append(h('div', { class: 'empty' }, h('div', { class: 'em' }, '😕'), h('h3', null, 'Oups, un souci d’affichage'), h('p', { class: 'muted' }, String(e.message || e)))); }
  for (const b of $$('#tabbar button')) { const on = b.dataset.tab === nav.tab; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); }
  const shopN = S.data.shop.filter(x => !x.done).length, badge = $('#tabbar [data-tab="shop"] .badge-n'); badge.textContent = shopN > 99 ? '99+' : shopN; badge.hidden = !shopN;
  if (same) window.scrollTo(0, y); else window.scrollTo(0, nav.tab === 'me' ? 0 : SCROLL[nav.tab] || 0);
  if (keepFocus) { const el = [...view.querySelectorAll('input,textarea')].find(x => (x.getAttribute('aria-label') || x.getAttribute('placeholder')) === keepFocus.key); if (el) { el.focus(); try { el.setSelectionRange(keepFocus.pos, keepFocus.pos); } catch {} } }
  lastTab = nav.tab;
}
function route() { const t = location.hash.replace(/^#\/?/, ''); nav.tab = VIEWS[t] ? t : 'home'; render(); }
nav.render = render;
nav.go = tab => { if (location.hash !== '#/' + tab) location.hash = '#/' + tab; else render(); };


function shell() {
  const tabbar = $('#tabbar'); clear(tabbar);
  for (const [k, l, ic] of TABS) tabbar.append(h('button', { type: 'button', 'data-tab': k, onclick: () => { if (nav.tab === k && window.scrollY > 0) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; } nav.go(k); } }, h('span', { class: 'ti' }, icon(ic, 24), k === 'shop' ? h('span', { class: 'badge-n', hidden: '' }) : null), h('span', { class: 'tl' }, l)));
}

// niveau gagné ou succès débloqué : enregistré une fois, fêté une fois (discrètement)
let progBusy = false;
function save(fn) { progBusy = true; try { mutate('meta', fn); } finally { progBusy = false; } }
function checkProgress(silent) {
  if (progBusy || !S.ready) return;
  const m = S.data.meta, r = rpgStats();
  if (m.lvl == null || m.badges == null || m.xpSeen == null) { const ids = earned(r).map(b => b[0]); save(x => ({ ...x, lvl: x.lvl ?? r.level, badges: x.badges ?? ids, xpSeen: r.xp })); return; }
  const fresh = earned(r).filter(b => !(m.badges || []).includes(b[0])), up = r.level > m.lvl, gain = r.xp - m.xpSeen;
  if (up || fresh.length || gain) save(x => ({ ...x, lvl: Math.max(x.lvl || 1, r.level), xpSeen: r.xp, badges: [...new Set([...(x.badges || []), ...earned(r).map(b => b[0])])] }));
  if (silent) return;
  if (gain > 0) setTimeout(() => xpFloat(gain), 250); // chaque geste utile se voit, sans rien demander
  // montée de niveau : un vrai moment (avec ses récompenses) ; succès : un bandeau qui annonce l'objet gagné
  let t = 700; if (up) { const lv = r.level; setTimeout(() => levelUp(lv, r.title), t); t += 600; }
  fresh.forEach((b, k) => setTimeout(() => badgeBanner(b), t + k * 5000 + (up ? 4000 : 0)));
}
async function start() {
  shell();
  try { await init(); }
  catch (e) {
    console.error(e); if (window.__frigoStarted) window.__frigoStarted();
    const view = clear($('#view')); document.body.classList.remove('loading');
    const [title, text] = e.offline ? ['Pas de connexion', 'Le premier lancement a besoin d’internet. Reconnecte-toi puis réessaie.']
      : e.missing ? ['Il manque un fichier sur le site', `Le fichier « ${e.missing} » est introuvable. Vérifie qu’il a bien été envoyé sur GitHub, à côté de index.html.`]
      : ['L’application n’a pas pu démarrer', String(e.message || e)];
    view.append(h('div', { class: 'empty', style: { paddingTop: '22vh' } }, h('div', { class: 'em' }, e.offline ? '📡' : '🧩'), h('h3', null, title), h('p', null, text),
      h('div', { class: 'row gap' }, h('button', { type: 'button', class: 'btn primary', onclick: () => location.reload() }, 'Réessayer'), h('button', { type: 'button', class: 'btn soft', onclick: () => window.__frigoRepair ? window.__frigoRepair() : location.reload() }, 'Réparer'))));
    return;
  }
  document.body.classList.remove('loading');
  applyTheme(); matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { applyTheme(); render(); });
  const themeSig = () => { const p = S.data.prefs; return `${p.amb}|${p.mode}|${p.theme}|${p.season}|${p.motion}|${p.autoBy}|${p.lightFrom}|${p.lightTo}`; }; let lastTheme = themeSig();
  // mode Auto : bascule toute seule au lever / coucher du soleil (ou à tes horaires), même app ouverte
  const autoTick = () => { if (themeNow().dark !== document.documentElement.hasAttribute('data-dark')) { applyTheme(); render(); } };
  setInterval(autoTick, 60000); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') autoTick(); });
  subscribe(() => { if (themeSig() !== lastTheme) { lastTheme = themeSig(); applyTheme(); } render(); checkProgress(); });
  checkProgress(true);
  setHabitsProvider(affinity);
  const mig = await migrateFromV09();
  addEventListener('hashchange', route); route();
  if (mig && (mig.stock || mig.shop)) setTimeout(() => toast(`Données de l’ancienne version récupérées : ${mig.stock} produit(s), ${mig.shop} article(s) de courses`, { ms: 7000 }), 900);
  if (!S.data.prefs.onboarded) setTimeout(openOnboarding, 350);
  // hors ligne
  // pas de badge ni de message : l'app marche pareil sans internet. L'état est simplement indiqué dans « Moi ».
  addEventListener('online', () => { if (nav.tab === 'me') render(); }); addEventListener('offline', () => { if (nav.tab === 'me') render(); });
  // installation PWA
  // installation : vraie application (pas un simple raccourci Chrome)
  nav.standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  matchMedia('(display-mode: standalone)').addEventListener('change', e => { nav.standalone = e.matches; render(); });
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); nav.installPrompt = e; if (nav.tab === 'me' || nav.tab === 'home') render(); });
  addEventListener('appinstalled', () => { nav.installPrompt = null; toast('Mon Frigo est installée sur ton téléphone'); render(); });
  // retour au premier plan après minuit : rafraîchir les dates
  let day = new Date().toDateString(); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { checkExpiry().catch(() => {}); if (new Date().toDateString() !== day) { day = new Date().toDateString(); render(); } } });
  setTimeout(() => { checkExpiry().catch(() => {}); if (S.data.prefs.notify) registerBackgroundCheck(); }, 2500);
  if (typeof __BUILD__ !== 'undefined' && 'serviceWorker' in navigator && location.protocol !== 'file:') {
    const t0 = Date.now(); let reloaded = false;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      if (Date.now() - t0 < 8000 && sheetCount() === 0) { reloaded = true; location.reload(); }
      else toast('Une nouvelle version est prête', { action: { label: 'Recharger', fn: () => { reloaded = true; location.reload(); } }, ms: 10000 });
    });
  }
  window.__monFrigo = { S, VERSION, nav };
  if (window.__frigoStarted) window.__frigoStarted();
}
start();
