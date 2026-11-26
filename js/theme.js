// Thèmes : couleurs, décor animé et petits textes.
// Automatique / Clair / Sombre / Saisons (selon la date ou choisie) / Chaumière (thème original, campagne douillette).
import { S } from './state.js';
import { addDays } from './util.js';

export const SEASONS = [['spring', 'Printemps', '🌸'], ['summer', 'Été', '☀️'], ['autumn', 'Automne', '🍂'], ['winter', 'Hiver', '❄️']];
// une ambiance = couleurs + paysage + petits textes ; chacune existe en clair et en sombre
export const AMBS = [
  { id: 'classic', name: 'Classique', desc: 'Net et sobre, sans décor' },
  { id: 'season', name: 'Saisons', desc: 'Paysage, couleurs et textes qui suivent la saison' },
  { id: 'cottage', name: 'Chaumière', desc: 'Collines, cheminée qui fume, lucioles le soir' },
  { id: 'sea', name: 'Bord de mer', desc: 'Phare, voilier, cabine de plage et vent iodé' },
  { id: 'bistro', name: 'Bistrot', desc: 'Auvent rayé, ardoise du jour, guirlande le soir' },
  { id: 'zen', name: 'Zen', desc: 'Montagnes, cerisier en fleur, tout en douceur' },
];
export const MODES = [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']];
// couleurs principales de chaque ambiance (pour les aperçus du sélecteur)
const SW = { classic: [['#f3f5f7', '#e2017b'], ['#151118', '#ff3d9e']], cottage: [['#f6f0e1', '#3d7a35'], ['#16130c', '#8fcf6f']], sea: [['#f1f6f8', '#1f6fb8'], ['#0c1520', '#5fb0ff']],
  bistro: [['#f7f1e8', '#a3283a'], ['#151012', '#ff6b7d']], zen: [['#f4f2ec', '#c45038'], ['#121413', '#ff8a6f']], spring: [['#f3f7f1', '#d1457f'], ['#121714', '#ff7fb3']],
  summer: [['#fdf6e8', '#e0601a'], ['#17130d', '#ff9a4d']], autumn: [['#f8f1ea', '#bf400c'], ['#18110d', '#ff8a4c']], winter: [['#eef3f8', '#2a64c8'], ['#0f141b', '#6aa8ff']] };
export const swatch = (amb, season, dark) => { const [paper, accent] = SW[amb === 'season' ? season : amb][dark ? 1 : 0]; return { paper, accent }; };
// réglages d'apparence (reprend l'ancien réglage « theme » pour ne rien perdre)
function looks(p = S.data.prefs) {
  const t = p.theme;
  const amb = AMBS.some(a => a.id === p.amb) ? p.amb : (t === 'season' || t === 'cottage' ? t : 'classic');
  const mode = ['auto', 'light', 'dark'].includes(p.mode) ? p.mode : (t === 'light' || t === 'dark' ? t : 'auto');
  return { amb, mode };
}
// saison astronomique (à un jour près)
export function seasonOf(date = new Date()) {
  const md = (date.getMonth() + 1) * 100 + date.getDate();
  return md >= 320 && md < 621 ? 'spring' : md >= 621 && md < 923 ? 'summer' : md >= 923 && md < 1221 ? 'autumn' : 'winter';
}
// ---------- mode Auto : clair le jour, sombre le soir ----------
// lever et coucher du soleil (formule de la NOAA), pour l'ouest de la France ; à quelques minutes près
export function sunTimes(date = new Date(), lat = 46.9, lon = -1.3) {
  const rad = Math.PI / 180, start = new Date(date.getFullYear(), 0, 0), day = Math.floor((date - start) / 864e5);
  const g = 2 * Math.PI / 365 * (day - 1 + .5);
  const eqt = 229.18 * (.000075 + .001868 * Math.cos(g) - .032077 * Math.sin(g) - .014615 * Math.cos(2 * g) - .040849 * Math.sin(2 * g));
  const decl = .006918 - .399912 * Math.cos(g) + .070257 * Math.sin(g) - .006758 * Math.cos(2 * g) + .000907 * Math.sin(2 * g) - .002697 * Math.cos(3 * g) + .00148 * Math.sin(3 * g);
  const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl)) / rad;
  const off = -date.getTimezoneOffset();
  return { rise: Math.round(720 - 4 * (lon + ha) - eqt + off), set: Math.round(720 - 4 * (lon - ha) - eqt + off) };
}
const toMin = t => { const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
export const hhmm = m => `${Math.floor(((m % 1440) + 1440) % 1440 / 60)} h ${String(((m % 60) + 60) % 60).padStart(2, '0')}`;
// fenêtre « clair » du jour : du lever (un peu avant) au coucher (un peu après), ou tes horaires
export function lightWindow(p = S.data.prefs, now = new Date()) {
  if ((p.autoBy || 'sun') === 'hours') return { on: toMin(p.lightFrom) ?? 450, off: toMin(p.lightTo) ?? 1170 };
  const t = sunTimes(now); return { on: t.rise - 15, off: t.set + 20 };
}
function autoDark(p = S.data.prefs, now = new Date()) {
  if (p.autoBy === 'phone') return matchMedia('(prefers-color-scheme: dark)').matches;
  const { on, off } = lightWindow(p, now), m = now.getHours() * 60 + now.getMinutes();
  return on <= off ? !(m >= on && m < off) : !(m >= on || m < off);
}
export function current(prefs = S.data.prefs) {
  const { amb, mode } = looks(prefs);
  const season = amb === 'season' ? (prefs.season && prefs.season !== 'auto' ? prefs.season : seasonOf()) : null;
  const dark = mode === 'dark' || (mode === 'auto' && autoDark(prefs));
  return { amb, theme: amb, mode, season, dark, motion: prefs.motion !== false && !matchMedia('(prefers-reduced-motion: reduce)').matches };
}

// ---------- petits textes ----------
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const BASE = {
  'greet.morning': 'Bonjour', 'greet.afternoon': 'Bon après-midi', 'greet.evening': 'Bonsoir', 'greet.night': 'Bonsoir',
  soon: 'À consommer vite', seasonal: 'De saison en {mois}', week: 'Ta semaine', idea: 'Une idée pour {moment}', planned: 'Au menu {moment}',
  'stock.empty.t': 'Rien dans le stock', 'stock.empty.s': 'Ajoute tes produits pour recevoir des idées de repas avec ce que tu as.',
  'shop.empty': 'Ta liste est vide', 'shop.done': 'Tout est dans le panier', 'cook.done': 'Bon appétit ! 🎉', 'cook.toast': 'Repas enregistré, stock mis à jour',
  'stock.one': 'produit', 'stock.many': 'produits', secret: 'Tu as trouvé un petit secret ✨', taglines: [],
  today: 'Aujourd’hui', 'shop.todo': '{n} produit{s} à acheter', 'add.toast': 'Rangé ({zone}) : {nm}', 'me.sub': 'Ton profil, tes réglages et tes données', 'week.sub': '{n}/14 repas prévus',
};
const PACKS = {
  spring: { seasonal: 'Le marché de printemps', 'cook.done': 'Bon appétit ! 🌸', 'shop.empty': 'Le panier attend les premières fraises',
    'stock.empty.s': 'Le printemps est là : ajoute tes produits et je te propose des idées fraîches.', secret: 'Un pétale de chance pour toi 🌸',
    taglines: ['Les jours rallongent, les assiettes reverdissent 🌱', 'Radis, asperges, petits pois : le marché se réveille', 'Il fait doux : une salade croquante ce midi ?', 'Le printemps, la saison des herbes fraîches 🌿'] },
  summer: { seasonal: 'Le marché d’été', 'cook.done': 'Bon appétit ! ☀️', 'shop.empty': 'Le panier est vide, le marché est plein',
    'stock.empty.s': 'Il fait beau : ajoute tes produits et je te trouve des idées légères.', secret: 'Un rayon de soleil rien que pour toi ☀️',
    taglines: ['Grand soleil : salades et grillades au menu ☀️', 'Tomates, courgettes, abricots : c’est le moment', 'On mange dehors ce soir ?', 'Pense à garder le frigo bien frais 🧊'] },
  autumn: { seasonal: 'Le marché d’automne', 'cook.done': 'Bon appétit ! 🍂', 'shop.empty': 'Le panier attend courges et champignons',
    'stock.empty.s': 'Les soupes reviennent : ajoute tes produits et je te propose de quoi te réchauffer.', secret: 'Une feuille d’or pour toi 🍂',
    taglines: ['Les soupes reviennent 🍂', 'Potimarron, champignons, pommes : l’automne est gourmand', 'Un plat qui mijote, la maison sent bon', 'Les jours raccourcissent, les gratins dorent'] },
  winter: { seasonal: 'Le marché d’hiver', 'cook.done': 'Bon appétit, et au chaud ! ❄️', 'shop.empty': 'Le panier est vide, comme un jardin en hiver',
    'stock.empty.s': 'Il fait froid dehors : ajoute tes produits et je te trouve des plats qui réchauffent.', secret: 'Un flocon unique, comme toi ❄️',
    taglines: ['Il fait froid dehors, gratin dedans ❄️', 'Poireaux, choux, agrumes : l’hiver a du goût', 'Rien de tel qu’un plat qui mijote', 'Une soupe fumante ce soir ?'] },
  cottage: { 'greet.morning': 'Bien le bonjour', 'greet.afternoon': 'Bel après-midi', 'greet.evening': 'Douce soirée', 'greet.night': 'Bonne veillée',
    soon: 'À croquer sans tarder', seasonal: 'Du potager en {mois}', week: 'Les repas de la semaine', idea: 'Ce qui te ferait plaisir {moment}', planned: 'À table {moment}',
    'stock.empty.t': 'Le garde-manger est vide', 'stock.empty.s': 'Allons remplir les étagères : ajoute ce que tu as, et je te souffle des idées de festins.',
    'shop.empty': 'Le panier est vide', 'shop.done': 'Tout est dans le panier, en route !', 'cook.done': 'Quel festin ! 🎉', 'cook.toast': 'Festin noté, garde-manger à jour',
    'stock.one': 'provision', 'stock.many': 'provisions', secret: 'Tu as trouvé le secret de la chaumière ✨',
    today: 'La table du jour', 'shop.todo': '{n} emplette{s} à rapporter du marché', 'add.toast': 'Rangé au garde-manger ({zone}) : {nm}', 'me.sub': 'Ta fiche de cuisinier et tes réglages',
    taglines: ['La bouilloire chante, la journée peut commencer', 'Un bon repas, et tout va mieux', 'Rien ne vaut une table bien garnie', 'Le potager a donné, la cuisine attend',
      'On prend le temps, aujourd’hui', 'Du pain, du beurre, et le bonheur est simple', 'Les meilleures histoires se racontent à table', 'Une tartine et un bon livre ?'] },
  sea: { 'greet.afternoon': 'Bel après-midi', 'greet.evening': 'Bonne soirée', 'greet.night': 'Bonne nuit', soon: 'À croquer avant la marée', seasonal: 'Le marché du port en {mois}', week: 'Le cap de la semaine',
    'stock.empty.t': 'La cale est vide', 'stock.empty.s': 'Ajoute ce que tu as à bord, et je te propose des idées de repas.', 'shop.empty': 'Rien à embarquer pour l’instant', 'shop.done': 'Tout est à bord, on lève l’ancre !',
    'cook.done': 'Bon appétit, moussaillon ! ⚓', 'cook.toast': 'Repas noté, la cale est à jour', 'stock.one': 'provision', 'stock.many': 'provisions', secret: 'Tu as trouvé le trésor de la plage 💎',
    today: 'Le cap du jour', 'shop.todo': '{n} produit{s} à embarquer', 'add.toast': 'Rangé à bord ({zone}) : {nm}', 'me.sub': 'Ton carnet de bord et tes réglages',
    taglines: ['Un vent iodé souffle sur la cuisine 🌊', 'Ce soir, moules ou poisson grillé ?', 'Le phare veille sur tes courses', 'Marée haute dans le frigo : on cuisine ?', 'Une crêpe face à la mer ?', 'Le marché du port est ouvert ⛵'] },
  bistro: { soon: 'À servir vite', seasonal: 'Le marché de {mois}', week: 'Le menu de la semaine', idea: 'La suggestion du chef pour {moment}',
    'stock.empty.t': 'La réserve est vide', 'stock.empty.s': 'Ajoute ce que tu as en réserve, et je t’écris l’ardoise du jour.', 'shop.empty': 'Rien à rapporter du marché', 'shop.done': 'Tout est dans le cabas !',
    'cook.done': 'Et voilà, c’est servi ! 🍽️', 'cook.toast': 'C’est servi, la réserve est à jour', secret: 'Tu as trouvé la recette secrète du patron ✨',
    today: 'L’ardoise du jour', 'shop.todo': '{n} produit{s} à rapporter du marché', 'add.toast': 'Rangé en réserve ({zone}) : {nm}', 'me.sub': 'Ta fiche de chef et tes réglages',
    taglines: ['Le plat du jour t’attend 🥖', 'Service continu dans ta cuisine', 'Une table, un bon plat, et c’est la fête', 'Un petit café après ? ☕', 'Ce soir, on dresse une belle assiette', 'Fait maison, comme au bistrot'] },
  zen: { 'greet.afternoon': 'Bel après-midi', 'greet.evening': 'Bonne soirée', 'greet.night': 'Douce nuit', soon: 'À savourer bientôt', seasonal: 'Les saveurs de {mois}', week: 'La semaine, en douceur', idea: 'Une idée simple pour {moment}',
    'stock.empty.t': 'Un frigo vide, un esprit libre', 'stock.empty.s': 'Ajoute tes produits, et je te propose des repas simples et justes.', 'shop.empty': 'Rien à acheter, tout est calme', 'shop.done': 'Tout est dans le panier 🍃',
    'cook.done': 'Bon appétit 🍵', secret: 'Un petit secret, en toute discrétion 🌸', 'me.sub': 'Ton profil et tes réglages',
    taglines: ['Respire, cuisine, savoure 🍵', 'Moins de gaspillage, plus de sérénité', 'Un bol de soupe, l’esprit tranquille', 'Cuisiner, c’est prendre soin de soi', 'Des produits simples, un repas juste', 'Le cerisier fleurit, la cuisine aussi 🌸'] },
};
const pack = () => { const c = current(); return c.amb === 'season' ? PACKS[c.season] : PACKS[c.amb] || null; };
export function tx(key, vars = {}) {
  const p = pack(); let s = p && p[key] != null ? p[key] : BASE[key]; if (s == null) return key;
  if (typeof s === 'string') s = s.replace('{mois}', MOIS[new Date().getMonth()]).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  return s;
}
export function greeting(date = new Date()) {
  const hr = date.getHours(); return tx(hr < 5 ? 'greet.night' : hr < 12 ? 'greet.morning' : hr < 18 ? 'greet.afternoon' : hr < 22 ? 'greet.evening' : 'greet.night');
}
// petite phrase du jour (thèmes décorés), ou moment spécial (goûter, fêtes)
export function tagline(date = new Date()) {
  const sp = specialDay(date); if (sp) return sp;
  const c = current(), hr = date.getHours();
  if (c.theme === 'cottage' && hr === 16) return { emoji: '🍪', text: 'Seize heures : c’est l’heure du goûter !', q: 'gâteau' };
  if (c.theme === 'cottage' && (hr >= 23 || hr < 5)) return { emoji: '🕯️', text: 'Encore debout ? Une tisane et au lit', q: '' };
  const list = tx('taglines'); if (!Array.isArray(list) || !list.length) return null;
  const day = Math.floor(date.getTime() / 864e5); return { text: list[day % list.length] };
}
// fêtes gourmandes du calendrier (pour tous les thèmes)
function easter(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1; return new Date(y, month - 1, day); }
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function specialDay(date = new Date()) {
  const md = iso(date).slice(5), y = date.getFullYear(), e = iso(easter(y)), mg = addDays(e, -47), t = iso(date);
  const S2 = { '01-01': ['🥂', 'Bonne année ! Une année gourmande commence', 'soupe'], '01-06': ['👑', 'C’est l’Épiphanie : qui aura la fève ?', 'galette des rois'], '02-02': ['🥞', 'C’est la Chandeleur : à vos crêpes !', 'crêpes'],
    '02-14': ['❤️', 'Saint-Valentin : un dîner à deux ?', 'chocolat'], '06-21': ['🎶', 'Fête de la musique : on grille quelque chose ?', 'brochettes'], '10-31': ['🎃', 'Halloween : une soupe de potiron ?', 'potimarron'],
    '12-24': ['🎄', 'Réveillon : un repas de fête ?', 'rôti'], '12-25': ['🎁', 'Joyeux Noël !', 'chocolat'], '12-31': ['🎆', 'Dernier jour de l’année : un bon repas pour finir', 'fondant'] };
  if (t === e) return { emoji: '🥚', text: 'Joyeuses Pâques : chasse aux œufs en cuisine !', q: 'agneau' };
  if (t === mg) return { emoji: '🎭', text: 'Mardi gras : beignets, crêpes et gaufres', q: 'gaufres' };
  const s = S2[md]; return s ? { emoji: s[0], text: s[1], q: s[2] } : null;
}

// ---------- application ----------
export function applyTheme() {
  const c = current(), root = document.documentElement;
  root.setAttribute('data-amb', c.amb); root.toggleAttribute('data-dark', c.dark);
  if (c.season) root.setAttribute('data-season', c.season); else root.removeAttribute('data-season');
  root.toggleAttribute('data-still', !c.motion);
  const paper = getComputedStyle(root).getPropertyValue('--paper').trim() || '#f3f5f7';
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', paper);
  renderDeco(c);
}
let decoKey = '';
function renderDeco(c) {
  let el = document.getElementById('deco');
  if (!el) { el = document.createElement('div'); el.id = 'deco'; el.setAttribute('aria-hidden', 'true'); document.body.prepend(el); }
  const key = `${c.amb}|${c.season}|${c.dark}|${c.motion}`; if (key === decoKey) return; decoKey = key;
  el.innerHTML = ''; const kind = particleKind(c); if (c.motion && kind) el.append(particles(kind));
}
// petites particules qui flottent dans le fond, selon l'ambiance
const particleKind = c => ({ cottage: c.dark ? 'firefly' : 'seed', season: { spring: 'petal', summer: 'pollen', autumn: 'leaf', winter: 'snow' }[c.season], sea: c.dark ? 'glimmer' : 'bubble', zen: 'petal' })[c.amb] || null;
const rnd = (a, b, i) => a + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * (b - a); // pseudo-aléatoire stable
function particles(kind) {
  const box = document.createElement('div'); box.className = 'deco-fall';
  const n = kind === 'snow' ? 14 : kind === 'firefly' || kind === 'glimmer' ? 10 : 8, floaty = ['firefly', 'glimmer'].includes(kind);
  for (let i = 1; i <= n; i++) {
    const p = document.createElement('i'); p.className = 'p ' + kind;
    p.style.cssText = `left:${rnd(2, 96, i).toFixed(1)}%;animation-duration:${rnd(floaty ? 6 : 12, floaty ? 11 : 22, i + 7).toFixed(1)}s;animation-delay:-${rnd(0, 18, i + 3).toFixed(1)}s;--s:${rnd(.7, 1.3, i + 5).toFixed(2)};--x:${rnd(-40, 40, i + 9).toFixed(0)}px;--h:${rnd(0, 360, i).toFixed(0)}`;
    if (floaty) p.style.top = rnd(30, 92, i + 2).toFixed(1) + '%';
    box.append(p);
  }
  return box;
}

// ---------- paysage illustré en haut de l'accueil (dessins originaux) ----------
const stars = n => Array.from({ length: n }, (_, i) => `<circle class="st" cx="${rnd(10, 390, i + 1).toFixed(0)}" cy="${rnd(8, 90, i + 21).toFixed(0)}" r="${i % 4 ? 1.1 : 1.7}" style="animation-delay:-${(i * .53).toFixed(2)}s"/>`).join('');
let gid = 0;
const sky = (id0, top, mid, id = id0 + (++gid).toString(36)) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".72" stop-color="${mid}"/><stop offset="1" style="stop-color:var(--paper)"/></linearGradient></defs><rect width="400" height="190" fill="url(#${id})"/>`;
const front = '<path d="M0 176 C90 160 170 168 250 172 S360 162 400 166 V190 H0Z" style="fill:var(--paper)"/>';
const sunG = (x, y, col, rays) => `<g class="sun" data-egg="sun" style="transform-origin:${x}px ${y}px">${rays ? Array.from({ length: 12 }, (_, i) => `<rect x="${x - 2}" y="${y - 30}" width="4" height="10" rx="2" fill="${col}" transform="rotate(${i * 30} ${x} ${y})"/>`).join('') : `<circle cx="${x}" cy="${y}" r="26" fill="${col}" opacity=".22"/>`}<circle cx="${x}" cy="${y}" r="15" fill="${col}"/></g>`;
const moonG = (x, y, col, bg) => `<g class="moon" data-egg="moon"><circle cx="${x}" cy="${y}" r="24" fill="${col}" opacity=".12"/><circle cx="${x}" cy="${y}" r="13" fill="${col}"/><circle cx="${x + 6}" cy="${y - 4}" r="11" fill="${bg}"/></g>`;
const cloud = (x, y, k, op) => `<g class="cloud ${k}" opacity="${op}"><ellipse cx="${x}" cy="${y}" rx="24" ry="8" fill="#fff"/><ellipse cx="${x + 12}" cy="${y - 6}" rx="13" ry="9" fill="#fff"/></g>`;
const tree = (x, y, trunk, crown, r = 14) => `<g data-egg="tree" class="tree" style="transform-origin:${x}px ${y + r}px"><rect x="${x - 2}" y="${y}" width="4" height="${r}" rx="2" fill="${trunk}"/><circle cx="${x}" cy="${y - r * .35}" r="${r}" fill="${crown}"/><circle cx="${x - r * .7}" cy="${y + 2}" r="${r * .62}" fill="${crown}"/><circle cx="${x + r * .7}" cy="${y + 1}" r="${r * .66}" fill="${crown}"/></g>`;
const pine = (x, y, col, snow) => `<path d="M${x} ${y - 30} L${x - 13} ${y} H${x + 13}Z" fill="${col}"/><path d="M${x} ${y - 40} L${x - 10} ${y - 16} H${x + 10}Z" fill="${col}"/>${snow ? `<path d="M${x} ${y - 40} L${x - 5} ${y - 28} H${x + 5}Z" fill="#fff"/>` : ''}<rect x="${x - 2}" y="${y}" width="4" height="6" fill="#6b4a32"/>`;
const flowers = (cols, n, y0) => Array.from({ length: n }, (_, i) => `<circle cx="${rnd(6, 394, i + 41).toFixed(0)}" cy="${rnd(y0, y0 + 12, i + 61).toFixed(0)}" r="${i % 3 ? 1.6 : 2.2}" fill="${cols[i % cols.length]}"/>`).join('');
function house(x, y, dark) {
  const roof = dark ? '#6b5530' : '#d9a85a', wall = dark ? '#57493a' : '#f4ead6', door = dark ? '#3b2d20' : '#9b6b45';
  return `<g class="house" data-egg="house">
    <g class="smoke"><circle cx="${x + 24}" cy="${y - 34}" r="4"/><circle cx="${x + 24}" cy="${y - 34}" r="5"/><circle cx="${x + 24}" cy="${y - 34}" r="3.5"/></g>
    <rect x="${x + 19}" y="${y - 32}" width="9" height="18" rx="2" fill="${dark ? '#4a3a2c' : '#9a6b46'}"/>
    <rect x="${x - 26}" y="${y - 6}" width="54" height="30" rx="4" fill="${wall}"/>
    <path d="M${x - 34} ${y - 2} Q${x} ${y - 46} ${x + 36} ${y - 2} Z" fill="${roof}"/><path d="M${x - 30} ${y - 6} Q${x} ${y - 40} ${x + 32} ${y - 6}" fill="none" stroke="${dark ? '#57441f' : '#b9853d'}" stroke-width="1.6"/>
    <rect x="${x - 18}" y="${y + 2}" width="12" height="10" rx="2" fill="${dark ? '#ffd36b' : '#a8d0e0'}" class="win${dark ? ' lit' : ''}"/><path d="M${x - 12} ${y + 2} V${y + 12}" stroke="${dark ? '#8a6a2c' : wall}" stroke-width=".9"/>
    <rect x="${x + 5}" y="${y + 2}" width="12" height="22" rx="6" fill="${door}"/><circle cx="${x + 14}" cy="${y + 14}" r="1.2" fill="#f1c24f"/>
    <path d="M${x - 40} ${y + 24} H${x + 46}" stroke="${dark ? '#2b3d25' : '#7aa95a'}" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}
const birds = () => `<g class="birds"><path d="M288 72 q5 -5 10 0 q5 -5 10 0" /><path d="M310 64 q4 -4 8 0 q4 -4 8 0" /></g>`;
function garden(d) {
  const path = `<path d="M308 146 C300 158 286 166 270 178" stroke="${d ? '#4b3f2a' : '#e8d3a6'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  const fence = [214, 226, 238, 250].map(x => `<rect x="${x}" y="138" width="3" height="12" rx="1" fill="${d ? '#5a4a36' : '#b98a5a'}"/>`).join('') + `<path d="M212 142 H254 M212 147 H254" stroke="${d ? '#5a4a36' : '#b98a5a'}" stroke-width="1.6"/>`;
  const rows = [0, 1, 2].map(r => Array.from({ length: 6 }, (_, i) => `<circle cx="${150 + i * 10 + r * 4}" cy="${148 + r * 6}" r="2.6" fill="${d ? '#3d5a30' : ['#5c9e45', '#e8572f', '#6fb052'][r]}"/>`).join('')).join('');
  return path + fence + rows;
}
const flies = n => Array.from({ length: n }, (_, i) => `<circle class="ff" cx="${rnd(20, 380, i + 81).toFixed(0)}" cy="${rnd(110, 160, i + 91).toFixed(0)}" r="1.8" style="animation-delay:-${(i * .9).toFixed(1)}s"/>`).join('');
// bandeau discret en haut des autres pages : ciel et collines lointaines, sans détails qui gênent la lecture
export function pageBand(c = current()) {
  if (NEW[c.amb]) return NEW[c.amb].band(c.dark);
  if (c.theme !== 'cottage' && c.theme !== 'season') return '';
  const d = c.dark, s = c.season;
  const K = c.theme === 'cottage' ? { sky: d ? ['#0b1424', '#1b2230'] : ['#cfe6f3', '#eaf1e2'], h: d ? ['#1d2a1b', '#243520'] : ['#d6e8bf', '#b7d699'] }
    : { spring: { sky: d ? ['#101a22', '#1a2420'] : ['#e0f0fb', '#eef6ea'], h: d ? ['#1c2a22', '#22342a'] : ['#dcefd0', '#c3e2b2'] },
        summer: { sky: d ? ['#141019', '#221b13'] : ['#ffe8b8', '#fdf2dc'], h: d ? ['#2a2416', '#33291a'] : ['#f6e3a8', '#efd384'] },
        autumn: { sky: d ? ['#1a1210', '#241913'] : ['#fde6cf', '#f8eee4'], h: d ? ['#2a1d14', '#332318'] : ['#f2d6b8', '#e8bb92'] },
        winter: { sky: d ? ['#0a1220', '#182231'] : ['#dbe8f6', '#eef3f8'], h: d ? ['#1a2230', '#202a3a'] : ['#e9f1f9', '#ffffff'] } }[s];
  return `<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${sky('pb', K.sky[0], K.sky[1])}${d ? `<g class="stars">${stars(10).replace(/cy="(\d+)"/g, (m, y) => `cy="${Math.round(y * .6)}"`)}</g>` : ''}
    <path d="M0 92 C80 74 160 80 240 88 S350 70 400 80 V120 H0Z" fill="${K.h[0]}"/><path d="M0 104 C90 92 180 98 260 102 S360 92 400 96 V120 H0Z" fill="${K.h[1]}"/>
    ${c.amb === 'season' ? bandMark(s, d) : ''}<path d="M0 112 C100 106 200 110 280 112 S370 106 400 108 V120 H0Z" style="fill:var(--paper)"/></svg>`;
}
export function homeScene(c = current()) {
  if (NEW[c.amb]) return `<svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${NEW[c.amb].scene(c.dark)}</svg>`;
  if (c.theme !== 'cottage' && c.theme !== 'season') return '';
  const d = c.dark;
  let body = '';
  if (c.theme === 'cottage') {
    body = d ? sky('sk', '#0b1424', '#1b2230') + `<g class="stars">${stars(22)}</g>` + moonG(246, 84, '#f4e7b5', '#121a27')
             : sky('sk', '#bfe0f0', '#e7f0e0') + sunG(246, 82, '#f1c24f') + cloud(120, 92, 'c1', .9) + cloud(330, 74, 'c2', .7) + birds();
    const [h1, h2, h3] = d ? ['#1d2a1b', '#243520', '#2c4127'] : ['#cfe3b4', '#a9cf8a', '#8cbf6c'];
    body += `<path d="M0 118 C70 92 140 98 210 112 S330 86 400 100 V190 H0Z" fill="${h1}"/>` + tree(52, 112, '#6b4a32', d ? '#22331f' : '#7fb35f', 12) + tree(150, 110, '#6b4a32', d ? '#26391f' : '#8cbd69', 9)
      + `<path d="M0 146 C80 124 170 136 250 140 S350 122 400 132 V190 H0Z" fill="${h2}"/>` + garden(d) + house(300, 120, d)
      + `<path d="M0 160 C100 148 190 156 270 158 S360 150 400 154 V190 H0Z" fill="${h3}"/>` + flowers(d ? ['#3c5a33'] : ['#f6c445', '#f08aa6', '#ffffff'], 18, 150) + (d ? `<g class="flies">${flies(8)}</g>` : '') + front;
  } else body = seasonScene(c.season, d);
  return `<svg viewBox="0 0 400 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${body}</svg>`;
}


// ---------- Saisons : chaque saison doit se reconnaître au premier coup d'œil ----------
const tulip = (x, y, c, k = 1.35) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})"><path d="M${x} ${y} V${y - 12}" stroke="#4f9a3d" stroke-width="1.6"/><path d="M${x - 4} ${y - 17} Q${x - 4.6} ${y - 10} ${x} ${y - 10} Q${x + 4.6} ${y - 10} ${x + 4} ${y - 17} L${x + 2} ${y - 14.6} L${x} ${y - 18} L${x - 2} ${y - 14.6}Z" fill="${c}"/></g>`;
const sunflower = (x, y, d, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 V-22" stroke="${d ? '#3a4a24' : '#4f8a3d'}" stroke-width="2.2"/><ellipse cx="5" cy="-10" rx="5" ry="2.4" fill="${d ? '#3a4a24' : '#5fa04a'}" transform="rotate(-25 5 -10)"/>${Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="-30.5" rx="2.3" ry="5" fill="${d ? '#8a6a1a' : '#ffc21a'}" transform="rotate(${i * 30} 0 -24)"/>`).join('')}<circle cx="0" cy="-24" r="4.4" fill="${d ? '#3a2a14' : '#6b3f1a'}"/></g>`;
const bale = (x, y, d) => `<circle cx="${x}" cy="${y}" r="9" fill="${d ? '#6b5a2a' : '#e6c25a'}"/><path d="M${x - 5} ${y} a5 5 0 1 1 5 5 a3 3 0 1 1 -3 -3" stroke="${d ? '#4a3e1c' : '#c49a35'}" stroke-width="1.2" fill="none"/>`;
const pumpkin = (x, y, d, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse rx="10" ry="7.5" fill="${d ? '#a3501a' : '#ec7a1c'}"/><ellipse rx="4" ry="7.5" fill="${d ? '#b85e22' : '#f59331'}"/><path d="M-5 -6 Q-7.6 0 -5 6 M5 -6 Q7.6 0 5 6" stroke="${d ? '#7a3a10' : '#c85f10'}" stroke-width="1" fill="none"/><path d="M0 -7 q1 -4 4 -5" stroke="#5a7a2a" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
const mushroom = (x, y, d, k = 1.5) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})"><rect x="${x - 2}" y="${y - 8}" width="4" height="8" rx="1.6" fill="${d ? '#bdb29a' : '#f3ead6'}"/><path d="M${x - 8} ${y - 7} Q${x} ${y - 18} ${x + 8} ${y - 7}Z" fill="${d ? '#8a2a22' : '#d9382c'}"/><circle cx="${x - 3}" cy="${y - 11}" r="1.3" fill="#fff"/><circle cx="${x + 3}" cy="${y - 10}" r="1.1" fill="#fff"/></g>`;
const leafAt = (x, y, r, c) => `<path d="M${x} ${y} q4 -6 9 0 q-5 6 -9 0Z" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`;
const flake = (x, y, c, k = 4) => `<path d="M${x} ${y - k}V${y + k}M${x - k} ${y}H${x + k}M${x - k * .7} ${y - k * .7}L${x + k * .7} ${y + k * .7}M${x + k * .7} ${y - k * .7}L${x - k * .7} ${y + k * .7}" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`;
function bloomTree(x, y, d, k = 1) {
  const pink = d ? '#7a4a60' : '#f7b6cf', pink2 = d ? '#8e5670' : '#fbcfe0';
  return `<g data-egg="tree" class="tree" style="transform-origin:${x}px ${y + 18 * k}px"><path d="M${x} ${y + 18 * k} V${y - 4 * k} M${x} ${y + 4 * k} L${x - 9 * k} ${y - 7 * k} M${x} ${y} L${x + 10 * k} ${y - 9 * k}" stroke="#6b4a32" stroke-width="${3.4 * k}" stroke-linecap="round"/>`
    + [[0, -15, 13], [-13, -8, 10], [13, -10, 11], [-7, -22, 9], [8, -23, 9]].map(([dx, dy, r], i) => `<circle cx="${x + dx * k}" cy="${y + dy * k}" r="${r * k}" fill="${i % 2 ? pink2 : pink}"/>`).join('')
    + [[-10, -12], [4, -20], [12, -6], [-4, -6], [16, -16], [-14, -18]].map(([dx, dy]) => `<circle cx="${x + dx * k}" cy="${y + dy * k}" r="${1.6 * k}" fill="${d ? '#c9a0b4' : '#fff'}"/>`).join('') + '</g>';
}
function autumnTree(x, y, d, k = 1) {
  const cs = d ? ['#7a3a1a', '#8a4a1e', '#6b2e18'] : ['#e0772e', '#f0a030', '#c9452a'];
  return `<g data-egg="tree" class="tree" style="transform-origin:${x}px ${y + 16 * k}px"><rect x="${x - 2 * k}" y="${y}" width="${4 * k}" height="${16 * k}" rx="2" fill="#6b4a32"/>` + [[0, -6, 13, 0], [-10, 1, 9, 1], [10, 0, 10, 2], [-3, -14, 8, 1]].map(([dx, dy, r, c]) => `<circle cx="${x + dx * k}" cy="${y + dy * k}" r="${r * k}" fill="${cs[c]}"/>`).join('') + '</g>';
}
function snowman(x, y, d) {
  const w = d ? '#dfe7f2' : '#ffffff', o = d ? '#9fb2c8' : '#c9d6e6';
  return `<g data-egg="snowman" class="tree" style="transform-origin:${x}px ${y + 12}px"><path d="M${x - 10} ${y - 20} L${x - 22} ${y - 28} M${x + 10} ${y - 20} L${x + 22} ${y - 30} M${x + 18} ${y - 28} l3 -5" stroke="#6b4a32" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="13" fill="${w}" stroke="${o}" stroke-width="1.2"/><circle cx="${x}" cy="${y - 20}" r="10" fill="${w}" stroke="${o}" stroke-width="1.2"/><circle cx="${x}" cy="${y - 36}" r="7.5" fill="${w}" stroke="${o}" stroke-width="1.2"/>
    <rect x="${x - 8}" y="${y - 30}" width="16" height="4" rx="2" fill="#d9473b"/><rect x="${x + 3}" y="${y - 30}" width="4" height="10" rx="1.6" fill="#d9473b"/>
    <circle cx="${x - 2.6}" cy="${y - 38}" r="1" fill="#2b2220"/><circle cx="${x + 2.6}" cy="${y - 38}" r="1" fill="#2b2220"/><path d="M${x} ${y - 35.6} l7 1.6 l-7 1.4Z" fill="#f08a24"/><circle cx="${x}" cy="${y - 18}" r="1.2" fill="#2b2220"/><circle cx="${x}" cy="${y - 13}" r="1.2" fill="#2b2220"/>
    <rect x="${x - 6}" y="${y - 52}" width="12" height="10" rx="1.4" fill="#2b2b33"/><rect x="${x - 9}" y="${y - 43}" width="18" height="3" rx="1.2" fill="#2b2b33"/></g>`;
}
const butterfly = (x, y, c) => `<g class="bfly" style="transform-origin:${x}px ${y}px"><ellipse cx="${x - 3}" cy="${y}" rx="3.4" ry="2.4" fill="${c}"/><ellipse cx="${x + 3}" cy="${y}" rx="3.4" ry="2.4" fill="${c}"/><path d="M${x} ${y - 2} V${y + 2}" stroke="#3a2a2a" stroke-width="1"/></g>`;
const rainbow = () => `<g opacity=".34" fill="none" stroke-width="5">${['#ff6b6b', '#ffa94d', '#ffe066', '#69db7c', '#4dabf7', '#9775fa'].map((c, i) => `<path d="M${276 + i * 5} 150 A${68 - i * 5} ${68 - i * 5} 0 0 1 ${412 - i * 5} 150" stroke="${c}"/>`).join('')}</g>`;
function seasonScene(s, d) {
  const hillsP = (a, b, c2) => [`<path d="M0 118 C70 92 140 98 210 112 S330 86 400 100 V190 H0Z" fill="${a}"/>`, `<path d="M0 146 C80 124 170 136 250 140 S350 122 400 132 V190 H0Z" fill="${b}"/>`, `<path d="M0 160 C100 148 190 156 270 158 S360 150 400 154 V190 H0Z" fill="${c2}"/>`];
  if (s === 'spring') {
    const [h1, h2, h3] = hillsP(...(d ? ['#1c2a22', '#22342a', '#2a3f32'] : ['#cdebbd', '#a9dc8e', '#8ccf72']));
    return sky('sk', d ? '#101a22' : '#cfe8fb', d ? '#1a2420' : '#effaf0') + (d ? `<g class="stars">${stars(16)}</g>` + moonG(250, 74, '#eef0f7', '#16201f') : rainbow() + sunG(250, 76, '#ffe08a') + cloud(196, 102, 'c1', .85) + birds())
      + h1 + bloomTree(66, 104, d, .95) + bloomTree(356, 104, d, .8) + h2 + h3
      + (d ? `<g class="flies">${flies(6)}</g>` : butterfly(160, 128, '#ff9ad5') + butterfly(236, 120, '#ffd34d'))
      + [20, 34, 48, 120, 134, 206, 220, 290, 304, 318, 380].map((x, i) => tulip(x, 170 - (i % 2) * 3, d ? ['#7a3a3a', '#8a7a3a', '#7a4a60'][i % 3] : ['#ef4f5f', '#ffc21a', '#ff8fb1'][i % 3])).join('') + front;
  }
  if (s === 'summer') {
    const [h1, h2, h3] = hillsP(...(d ? ['#2a2416', '#33291a', '#3b301e'] : ['#f4de96', '#ecc96a', '#e0b44e']));
    return sky('sk', d ? '#141019' : '#9fd4f5', d ? '#221b13' : '#fff1cf') + (d ? `<g class="stars">${stars(18)}</g>` + moonG(250, 74, '#f6efd0', '#1d1714') : sunG(250, 72, '#ffb703', true))
      + h1 + `<g stroke="${d ? '#3b301e' : '#d9b44c'}" stroke-width="1" opacity=".6">${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 30 + 6} ${118 - (i % 3) * 3} l4 -6"/>`).join('')}</g>` + bale(150, 132, d) + bale(176, 135, d) + bale(330, 112, d)
      + h2 + h3 + [24, 62, 100, 296, 336, 374].map((x, i) => sunflower(x, 178 - (i % 2) * 4, d, i % 3 === 1 ? .9 : 1)).join('') + (d ? `<g class="flies">${flies(8)}</g>` : '') + front;
  }
  if (s === 'autumn') {
    const [h1, h2, h3] = hillsP(...(d ? ['#2a1d14', '#332318', '#3d2a1c'] : ['#efcca9', '#e2ab7c', '#d08f5a']));
    const lc = d ? ['#7a3a1a', '#8a5a1e'] : ['#e0772e', '#f0a030', '#c9452a'];
    return sky('sk', d ? '#1a1210' : '#fbd9b8', d ? '#241913' : '#f8ece0') + (d ? `<g class="stars">${stars(14)}</g><g class="moon" data-egg="moon"><circle cx="250" cy="76" r="26" fill="#f0a65a" opacity=".16"/><circle cx="250" cy="76" r="17" fill="#f2b06a"/></g>` : sunG(250, 80, '#f0a65a') + cloud(196, 102, 'c1', .9) + cloud(330, 60, 'c2', .7) + birds())
      + h1 + autumnTree(60, 108, d) + autumnTree(92, 116, d, .7) + autumnTree(350, 104, d, 1.05) + h2 + h3
      + [[30, 160, 20], [140, 166, 120], [210, 150, 60], [250, 170, 200], [380, 164, 300], [170, 132, 40], [300, 120, 150], [228, 104, 90]].map(([x, y, r], i) => leafAt(x, y, r, lc[i % lc.length])).join('')
      + pumpkin(284, 166, d, 1.45) + pumpkin(314, 172, d, 1.05) + pumpkin(342, 164, d, 1.25) + mushroom(40, 174, d) + mushroom(58, 176, d, 1.15) + front;
  }
  const [h1, h2, h3] = hillsP(...(d ? ['#1a2230', '#202a3a', '#283447'] : ['#e9f1fa', '#dbe7f4', '#ffffff']));
  return sky('sk', d ? '#0a1220' : '#cddff3', d ? '#182231' : '#eef3f8') + (d ? `<g class="stars">${stars(16)}</g>` + moonG(250, 74, '#e8eef7', '#141d2b') : sunG(250, 80, '#fff3c4') + cloud(196, 102, 'c1', .95))
    + [[40, 76], [120, 64], [210, 90], [330, 50], [376, 84], [170, 40]].map(([x, y]) => flake(x, y, d ? '#cfdcee' : '#9fb8d6', 4)).join('')
    + h1 + pine(48, 116, '#2f5a44', true) + pine(72, 120, '#2f5a44', true) + pine(366, 112, '#355f49', true) + h2
    + `<path d="M0 146 C80 124 170 136 250 140" stroke="${d ? '#3a4a60' : '#c3d4e8'}" stroke-width="2" fill="none" opacity=".6"/>` + h3 + snowman(300, 166, d) + front;
}
// petit symbole dans le bandeau des pages pour reconnaître la saison partout
function bandMark(s, d) {
  if (s === 'spring') return `<g transform="translate(0 -14) scale(1 .85)">${[[300, 46], [282, 50], [318, 40], [340, 34], [360, 30], [380, 26]].map(([x, y], i) => blossom(x, y, d, i % 2 ? 4 : 5)).join('')}</g>`;
  if (s === 'summer') return (d ? '' : `<g transform="translate(250 -6) scale(.75)">${sunG(120, 40, '#ffb703', true)}</g>`) + [40, 110, 330].map(x => sunflower(x, 112, d, .55)).join('');
  if (s === 'autumn') return [[60, 40, 30], [150, 26, 120], [250, 52, 200], [330, 30, 60], [380, 60, 300]].map(([x, y, r], i) => leafAt(x, y, r, d ? '#8a4a1e' : ['#e0772e', '#c9452a', '#f0a030'][i % 3])).join('');
  return [[40, 30], [110, 50], [190, 24], [270, 44], [340, 28], [380, 56]].map(([x, y]) => flake(x, y, d ? '#cfdcee' : '#9fb8d6', 4)).join('');
}

// ---------- nouvelles ambiances : Bord de mer, Bistrot, Zen (dessins originaux) ----------
const qpts = (x0, y0, cx, cy, x1, y1, n) => Array.from({ length: n }, (_, i) => { const t = (i + .5) / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; return [a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1]; });
function garland(d, y = 30) {
  const pts = [...qpts(0, y, 100, y + 24, 200, y + 4, 8), ...qpts(200, y + 4, 300, y + 26, 400, y + 2, 8)];
  return `<path d="M0 ${y} Q100 ${y + 24} 200 ${y + 4} T400 ${y + 2}" stroke="${d ? '#4a3a40' : '#6b5548'}" stroke-width="1" fill="none"/>` + pts.map(([x, yy], i) => `<circle class="bulb" cx="${x.toFixed(0)}" cy="${(yy + 4).toFixed(0)}" r="3" fill="${d ? '#ffd36b' : '#fff1c4'}" style="animation-delay:-${(i * .4).toFixed(1)}s"/>`).join('');
}
const waves = (col, n = 6, y0 = 124) => `<g class="waves" stroke="${col}" stroke-width="1.6" fill="none" stroke-linecap="round">${Array.from({ length: n }, (_, i) => `<path d="M${rnd(10, 370, i + 11).toFixed(0)} ${rnd(y0, y0 + 30, i + 17).toFixed(0)} q7 -4 14 0 q7 4 14 0"/>`).join('')}</g>`;
function lighthouse(x, d) {
  const L = (y) => x - 12 + (136 - y) * 4 / 60, R = (y) => x + 12 - (136 - y) * 4 / 60;
  const band = (a, b) => `<path d="M${L(a).toFixed(1)} ${a} L${L(b).toFixed(1)} ${b} H${R(b).toFixed(1)} L${R(a).toFixed(1)} ${a}Z" fill="${d ? '#8a3a33' : '#d9473b'}"/>`;
  return `<g data-egg="lighthouse">${d ? `<g class="beam" style="transform-origin:${x}px 66px"><path d="M${x} 66 L${x + 110} 44 L${x + 110} 88Z" fill="#fff3b0" opacity=".22"/><path d="M${x} 66 L${x - 110} 44 L${x - 110} 88Z" fill="#fff3b0" opacity=".14"/></g>` : ''}
    <path d="M${x - 40} 160 C${x - 36} 140 ${x - 22} 134 ${x - 6} 136 C${x + 8} 130 ${x + 30} 136 ${x + 38} 160Z" fill="${d ? '#2a2c33' : '#857f74'}"/>
    <path d="M${x - 12} 136 L${x - 8} 76 H${x + 8} L${x + 12} 136Z" fill="${d ? '#c9ced8' : '#fbfaf6'}"/>${band(116, 104)}${band(94, 86)}
    <rect x="${x - 12}" y="72" width="24" height="4" rx="1" fill="#3a3f4a"/><rect x="${x - 8}" y="60" width="16" height="12" rx="2" fill="${d ? '#ffd66b' : '#ffe9a6'}" class="glow"/><path d="M${x - 10} 60 L${x} 50 L${x + 10} 60Z" fill="#3a3f4a"/>
    <rect x="${x - 3}" y="122" width="6" height="14" rx="3" fill="${d ? '#3a3f4a' : '#5b6470'}"/></g>`;
}
function sailboat(x, y, d) {
  return `<g class="boat" data-egg="boat" style="transform-origin:${x}px ${y}px"><path d="M${x - 20} ${y} H${x + 20} L${x + 14} ${y + 8} H${x - 14}Z" fill="${d ? '#5a2e26' : '#c0503a'}"/><path d="M${x} ${y} V${y - 34}" stroke="${d ? '#8a8f99' : '#5b4a3a'}" stroke-width="1.6"/>
    <path d="M${x + 1} ${y - 32} L${x + 1} ${y - 2} L${x + 24} ${y - 2}Z" fill="${d ? '#cfd6e0' : '#fff'}"/><path d="M${x - 1} ${y - 26} L${x - 1} ${y - 2} L${x - 16} ${y - 2}Z" fill="${d ? '#a9b3c2' : '#f4efe4'}"/><path d="M${x} ${y - 34} l8 3 l-8 3Z" fill="#e8574c"/>${d ? `<circle cx="${x}" cy="${y - 35}" r="2" fill="#ffd66b" class="glow"/>` : ''}</g>`;
}
function hut(x, d) {
  const w = d ? '#7d8596' : '#ffffff', b = d ? '#2f4a6a' : '#3d8fc4';
  return `<g data-egg="hut"><rect x="${x - 15}" y="134" width="30" height="24" fill="${w}"/>${[0, 8, 16, 24].map(i => `<rect x="${x - 15 + i}" y="134" width="4" height="24" fill="${b}"/>`).join('')}<path d="M${x - 19} 136 L${x} 121 L${x + 19} 136Z" fill="${d ? '#7a2c27' : '#e8574c'}"/><rect x="${x - 4}" y="144" width="9" height="14" rx="1" fill="${d ? '#1d2a3a' : '#2a5f8c'}"/></g>`;
}
function bistroFront(d) {
  const stone = d ? '#3a2e2a' : '#f1e4cc', shop = d ? '#4a1620' : '#7a2232', win = d ? '#ffcf7a' : '#f6dca8', glass = d ? '#ffd88a' : '#a9c9dc', red = d ? '#9a2b3a' : '#c83a48';
  const awn = Array.from({ length: 9 }, (_, i) => { const x0 = 150 + i * 16; return `<path d="M${x0} 110 H${x0 + 16} L${x0 + 18} 124 H${x0 - 2}Z" fill="${i % 2 ? '#fff' : red}"/>`; }).join('');
  const scal = Array.from({ length: 9 }, (_, i) => `<circle cx="${157 + i * 16}" cy="124" r="7" fill="${i % 2 ? '#fff' : red}"/>`).join('');
  return `<rect x="140" y="66" width="270" height="106" fill="${stone}"/><path d="M136 66 H410" stroke="${d ? '#2a2226' : '#d9c7ae'}" stroke-width="4"/>${[176, 236, 296, 356].map((x, i) => `<rect x="${x}" y="74" width="24" height="24" rx="3" fill="${d && i % 2 ? '#ffcf7a' : glass}" class="${d && i % 2 ? 'win lit' : ''}"/><rect x="${x - 6}" y="74" width="5" height="24" rx="1" fill="${d ? '#2f4a3a' : '#5f8a6a'}"/><rect x="${x + 25}" y="74" width="5" height="24" rx="1" fill="${d ? '#2f4a3a' : '#5f8a6a'}"/><rect x="${x - 2}" y="98" width="28" height="3" rx="1" fill="${d ? '#2a2226' : '#6b5548'}"/>${[0, 1, 2].map(k => `<circle cx="${x + 5 + k * 7}" cy="97" r="2.6" fill="#e8574c"/>`).join('')}`).join('')}
    <rect x="140" y="108" width="270" height="64" fill="${shop}"/><rect x="156" y="130" width="126" height="34" rx="3" fill="${win}" class="win${d ? ' lit' : ''}"/><path d="M219 130 V164" stroke="${shop}" stroke-width="3"/><rect x="298" y="122" width="34" height="50" rx="3" fill="${d ? '#2a0d14' : '#4a1620'}"/><circle cx="326" cy="148" r="1.8" fill="#e3b53a"/>
    <g data-egg="awning">${awn}${scal}</g>`;
}
function cafeTable(d) {
  const m = d ? '#8a8f99' : '#3a3a3a';
  return `<g data-egg="cup"><ellipse cx="74" cy="148" rx="18" ry="4" fill="${m}"/><path d="M74 152 V170 M66 172 H82" stroke="${m}" stroke-width="2.4"/>
    <path d="M44 172 V150 Q44 140 52 140" stroke="${m}" stroke-width="2.4" fill="none"/><path d="M44 156 H56 V172" stroke="${m}" stroke-width="2.4" fill="none"/><path d="M104 172 V150 Q104 140 96 140" stroke="${m}" stroke-width="2.4" fill="none"/><path d="M104 156 H92 V172" stroke="${m}" stroke-width="2.4" fill="none"/>
    <rect x="70" y="139" width="9" height="8" rx="2" fill="#fff"/><path d="M79 141 q4 1 0 4" stroke="#fff" stroke-width="1.4" fill="none"/><g class="smoke"><circle cx="74" cy="134" r="2.4"/><circle cx="74" cy="134" r="3"/><circle cx="74" cy="134" r="2"/></g></g>
    <g data-egg="board"><path d="M114 172 L120 136 H136 L142 172" stroke="#8a6a45" stroke-width="2.4" fill="none"/><rect x="117" y="138" width="22" height="26" rx="2" fill="#2f3a36" stroke="#8a6a45" stroke-width="1.6"/><path d="M121 145 h14 M121 151 h10 M121 157 h12" stroke="#e9efe9" stroke-width="1.3" opacity=".75"/></g>`;
}
function blossom(x, y, d, r = 4) { const c = d ? '#8a5468' : '#f7b6c8'; return [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - r * .9}" rx="${r * .62}" ry="${r * .9}" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="${r * .35}" fill="${d ? '#d9b36a' : '#fff4c9'}"/>`; }
function branch(d) {
  const br = d ? '#3a2c2a' : '#5a4038';
  return `<g data-egg="branch" class="branch" style="transform-origin:400px 20px"><path d="M402 16 C370 26 340 22 312 40 C300 48 286 50 270 48 M340 26 C334 14 326 10 316 10 M312 40 C314 52 308 60 300 64" stroke="${br}" stroke-width="3.4" fill="none" stroke-linecap="round"/>${[[300, 46], [282, 50], [270, 46], [318, 12], [330, 18], [302, 62], [352, 28], [292, 40], [364, 22]].map(([x, y], i) => blossom(x, y, d, i % 3 ? 4 : 5)).join('')}</g>`;
}
function bamboo(d) {
  const g = d ? '#2f4630' : '#7fa36a', k = d ? '#253a27' : '#5f8a4e';
  return [[18, 40], [34, 58], [8, 74]].map(([x, top]) => `<rect x="${x}" y="${top}" width="6" height="${190 - top}" rx="3" fill="${g}"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${x} ${top + 22 + i * 26} h6" stroke="${k}" stroke-width="2"/>`).join('')}<ellipse cx="${x + 14}" cy="${top + 18}" rx="12" ry="3" fill="${g}" transform="rotate(-24 ${x + 14} ${top + 18})"/><ellipse cx="${x - 6}" cy="${top + 44}" rx="11" ry="3" fill="${g}" transform="rotate(28 ${x - 6} ${top + 44})"/>`).join('');
}
const NEW = {
  sea: {
    scene: d => sky('sk', d ? '#0b1830' : '#bfe2f2', d ? '#16263c' : '#eaf5f8') + (d ? `<g class="stars">${stars(18)}</g>` + moonG(250, 86, '#e9eef8', '#122238') : sunG(250, 88, '#ffd45e') + cloud(120, 86, 'c1', .9) + cloud(330, 50, 'c2', .7) + birds())
      + `<path d="M0 112 H400 V164 H0Z" fill="${d ? '#163a5a' : '#4f9fd0'}"/><path d="M0 112 H400" stroke="${d ? '#2a5478' : '#9fd2ee'}" stroke-width="2"/><path d="M240 118 h22 M244 126 h14 M238 134 h26" stroke="${d ? '#e9eef8' : '#fff3c4'}" stroke-width="2" opacity=".55" stroke-linecap="round"/>`
      + waves(d ? '#3d6f96' : '#e6f5ff') + sailboat(140, 128, d) + lighthouse(322, d)
      + `<path d="M0 156 C80 148 170 154 250 158 S360 150 400 154 V190 H0Z" fill="${d ? '#2a2a26' : '#f1dfb8'}"/>` + hut(56, d)
      + `<path d="M100 160 q2 -10 4 0 M106 160 q3 -12 5 0 M250 162 q2 -9 4 0 M256 162 q3 -11 5 0" stroke="${d ? '#4a5a3a' : '#9aa86a'}" stroke-width="1.6" fill="none"/>` + front,
    band: d => `<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${sky('pb', d ? '#0b1830' : '#cfe8f5', d ? '#16263c' : '#eef7f9')}${d ? `<g class="stars">${stars(10).replace(/cy="(\d+)"/g, (m, y) => `cy="${Math.round(y * .6)}"`)}</g>` : ''}
      <path d="M0 80 H400 V104 H0Z" fill="${d ? '#163a5a' : '#b4daf0'}"/>${waves(d ? '#3d6f96' : '#ffffff', 4, 84)}<path d="M0 98 C90 92 180 96 260 98 S360 92 400 94 V120 H0Z" fill="${d ? '#2a2a26' : '#f1dfb8'}"/>
      <path d="M0 112 C100 106 200 110 280 112 S370 106 400 108 V120 H0Z" style="fill:var(--paper)"/></svg>`,
  },
  bistro: {
    scene: d => sky('sk', d ? '#1a1322' : '#f6dcc0', d ? '#2b1d24' : '#fbefe0') + (d ? `<g class="stars">${stars(10)}</g>` + moonG(60, 40, '#f4e7c5', '#21171f') : '')
      + `<path d="M0 96 V84 h22 v-8 h10 v8 h30 v-12 h14 v12 h40 V96Z" fill="${d ? '#2a2230' : '#c9b9a8'}"/><path d="M0 96 H140 V172 H0Z" fill="${d ? '#2e2428' : '#e8d8bf'}"/>`
      + bistroFront(d) + garland(d, 52)
      + `<g><rect x="16" y="108" width="4" height="64" fill="${d ? '#4a4a52' : '#3a3a3a'}"/><path d="M10 108 H26 L22 96 H14Z" fill="${d ? '#ffd36b' : '#3a3a3a'}" class="${d ? 'glow' : ''}"/></g>` + cafeTable(d)
      + `<path d="M0 170 H400 V190 H0Z" fill="${d ? '#231c1f' : '#d8cdbf'}"/>${Array.from({ length: 16 }, (_, i) => `<circle cx="${i * 26 + 10}" cy="${178 + (i % 2) * 4}" r="2" fill="${d ? '#2e2528' : '#c6b9a8'}"/>`).join('')}` + front,
    band: d => `<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${sky('pb', d ? '#1a1322' : '#f6e3cc', d ? '#2b1d24' : '#fbf3e8')}
      <path d="M0 98 V80 h30 v-10 h14 v10 h50 v-18 h18 v18 h60 v-8 h20 v8 h70 v-14 h16 v14 h122 V98Z" fill="${d ? '#2a2230' : '#e2d3c2'}"/>${garland(d, 10).replace(/r="3"/g, 'r="2.4"')}
      <path d="M0 104 C90 100 180 102 260 104 S360 100 400 102 V120 H0Z" style="fill:var(--paper)"/></svg>`,
  },
  zen: {
    scene: d => sky('sk', d ? '#10131a' : '#f6e7da', d ? '#1a1f27' : '#f4f1ea') + (d ? `<g class="stars">${stars(14)}</g><g class="moon" data-egg="moon"><circle cx="240" cy="92" r="28" fill="#ece6d6" opacity=".14"/><circle cx="240" cy="92" r="20" fill="#ece6d6"/></g>` : `<g class="sun" data-egg="sun" style="transform-origin:240px 92px"><circle cx="240" cy="92" r="32" fill="#f39a80" opacity=".18"/><circle cx="240" cy="92" r="22" fill="#ef7f62"/></g>`)
      + `<path d="M0 124 L50 92 L92 112 L150 66 L214 116 L270 86 L330 110 L400 90 V190 H0Z" fill="${d ? '#1e2430' : '#d9ddd5'}"/><rect class="mist" x="-40" y="112" width="480" height="16" fill="${d ? '#2a3140' : '#ffffff'}" opacity=".45"/>`
      + `<path d="M0 142 C60 122 100 132 150 126 S260 110 320 128 S380 122 400 124 V190 H0Z" fill="${d ? '#232b33' : '#b9c6bd'}"/>`
      + `<path d="M0 158 H400 V190 H0Z" fill="${d ? '#1a2129' : '#d3ddd7'}"/><g stroke="${d ? '#2f3a46' : '#ffffff'}" stroke-width="1.4" opacity=".7" fill="none" class="waves"><path d="M100 166 h40 M230 172 h56 M150 180 h30 M300 164 h24"/></g>`
      + `<ellipse cx="210" cy="164" rx="16" ry="4" fill="${d ? '#2f3640' : '#9aa59f'}"/><ellipse cx="236" cy="168" rx="10" ry="3" fill="${d ? '#2f3640' : '#aab3ad'}"/>` + bamboo(d) + branch(d) + front,
    band: d => `<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${sky('pb', d ? '#10131a' : '#f8ece2', d ? '#1a1f27' : '#f6f4ee')}
      <path d="M0 96 L60 70 L110 88 L170 58 L230 92 L290 72 L350 90 L400 76 V120 H0Z" fill="${d ? '#1e2430' : '#dfe3db'}"/><rect class="mist" x="-40" y="90" width="480" height="10" fill="${d ? '#2a3140' : '#fff'}" opacity=".5"/>
      <g transform="translate(0 -6) scale(1 .8)">${branch(d)}</g><path d="M0 108 C100 102 200 106 280 108 S370 102 400 104 V120 H0Z" style="fill:var(--paper)"/></svg>`,
  },
};

// ---------- célébration (fin de recette, niveau, secret) ----------
export function celebrate({ x, y, n = 26 } = {}) {
  const c = current(); if (!c.motion) return;
  const kind = c.amb === 'cottage' ? 'star' : c.amb === 'season' ? { spring: 'petal', summer: 'pollen', autumn: 'leaf', winter: 'snow' }[c.season] : c.amb === 'sea' ? 'drop' : c.amb === 'zen' ? 'petal' : 'confetti';
  const box = document.createElement('div'); box.className = 'burst' + (x != null ? ' at' : ''); box.setAttribute('aria-hidden', 'true'); if (x != null) { box.style.left = x + 'px'; box.style.top = y + 'px'; box.style.bottom = 'auto'; }
  for (let i = 1; i <= n; i++) { const p = document.createElement('i'); p.className = 'b ' + kind; p.style.cssText = `--dx:${rnd(-170, 170, i + 1).toFixed(0)}px;--dy:${rnd(-420, -180, i + 2).toFixed(0)}px;--r:${rnd(-260, 260, i + 3).toFixed(0)}deg;--h:${rnd(0, 360, i).toFixed(0)};animation-delay:${rnd(0, 120, i).toFixed(0)}ms`; box.append(p); }
  document.body.append(box); setTimeout(() => box.remove(), 2000);
}

// ---------- surprises cachées dans le paysage ----------
const EGGS = {
  house: ['Toc toc ! Ça sent bon par ici 🍲', 'La bouilloire siffle, entre donc ☕', 'Une tarte refroidit sur le rebord de la fenêtre 🥧', 'Chut… le chat fait la sieste près du feu 🐈', 'Le garde-manger est bien rangé, bravo 🧺'],
  sun: ['Un peu de soleil dans ta journée ☀️', 'Le soleil te fait un clin d’œil 😉', 'Il fait bon, profites-en 🌻'],
  moon: ['La lune veille sur ton frigo 🌙', 'Une étoile filante : fais un vœu ✨', 'Bonne nuit, à demain pour de bons petits plats 💤'],
  tree: ['Une pomme vient de tomber 🍎', 'Un oiseau fait son nid là-haut 🐦', 'Les feuilles chuchotent des recettes 🍃'],
  lighthouse: ['Le phare veille sur ton frigo 🌊', 'Tout va bien à bord, capitaine ⚓', 'Au loin, un bateau rentre au port'],
  boat: ['Cap sur le marché ⛵', 'Hissez la grand-voile !', 'Une petite brise, parfait pour naviguer'],
  hut: ['Une cabine de plage : pique-nique ?', 'Il reste du sable dans les chaussures 🏖️', 'Serviette, crème solaire, sandwichs : prêt'],
  awning: ['Bienvenue au bistrot de ta cuisine 🥖', 'Une table pour un, s’il vous plaît', 'Le service commence !'],
  cup: ['Un petit café ? ☕', 'Le croissant est encore chaud 🥐', 'Une tasse, et on refait le monde'],
  board: ['Plat du jour : ce qui te fait envie 😋'],
  branch: ['Les pétales s’envolent 🌸', 'Le cerisier est en fleur', 'Respire… et souris'],
  snowman: ['Brrr… il fait froid dehors ⛄', 'Le bonhomme de neige te salue', 'Une soupe bien chaude ce soir ?'],
};
let eggN = 0;
export function sceneTap(e, scene) {
  if (!scene || e.target.closest('button, a, input, select')) return null;
  for (const g of scene.querySelectorAll('[data-egg]')) {
    const r = g.getBoundingClientRect(); if (e.clientX < r.left - 8 || e.clientX > r.right + 8 || e.clientY < r.top - 8 || e.clientY > r.bottom + 8) continue;
    const id = g.dataset.egg, list = EGGS[id]; g.classList.remove('tapped'); void g.getBBox(); g.classList.add('tapped');
    if (id === 'moon') { const st = scene.querySelector('svg'); const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path'); ln.setAttribute('d', 'M60 20 l60 26'); ln.setAttribute('class', 'shoot'); st.append(ln); setTimeout(() => ln.remove(), 1400); }
    if (id === 'house') { const sm = g.querySelector('.smoke'); if (sm) { sm.classList.remove('puff'); void g.getBBox(); sm.classList.add('puff'); } }
    if (['tree', 'sun', 'branch', 'boat', 'snowman'].includes(id)) celebrate({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, n: 10 });
    return { id, text: list[eggN++ % list.length] };
  }
  return null;
}
