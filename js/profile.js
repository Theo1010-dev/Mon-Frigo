// Profil « jeu » : ton personnage, ton niveau, tes récompenses, tes succès et ton passeport gourmand.
// Règle d'or : tout vient de l'usage normal de l'app. Rien à faire « pour monter », aucune consigne, aucun défi.
import { h, btn, openSheet, toast, clear, haptic, achievement } from './ui.js';
import { icon } from './icons.js';
import { S, setPref, mutate } from './state.js';
import { stats as rpgStats, BADGES, BADGE_GOAL, BADGE_GROUPS, TITLES, earnedIds, xpFor, XP } from './rpg.js';
import { PARTS, TABS, COLORS, SLOT_NAMES, DEFAULT_AVATAR, item, unlocked, rewardsAt, rewardOfBadge, unlockedKeys, safeAvatar, avatarSVG, previewWith, randomAvatar } from './avatar.js';
import { celebrate } from './theme.js';
import { nav, resetRUI, RUI } from './nav.js';
import { allowed } from './recipes.js';
import { plural } from './util.js';

const svgEl = (markup, cls) => { const d = h('span', { class: cls }); d.innerHTML = markup; return d; };
const myAvatar = () => S.data.prefs.avatar || DEFAULT_AVATAR;
const howText = how => how[0] === 'lvl' ? `Niveau ${how[1]}` : `Succès « ${(BADGES.find(b => b[0] === how[1]) || [, , '?'])[2]} »`;
// nouveautés à découvrir : objets débloqués pas encore vus, ou personnage jamais créé
function freshItems(st = rpgStats()) { const seen = new Set(S.data.meta.seenItems || []); return unlockedKeys(st, earnedIds(st)).filter(k => !seen.has(k)); }
const hasNews = st => !S.data.prefs.avatar || freshItems(st).length > 0;

// ---------- petit bouton du profil (en haut à droite) : ton personnage dans un anneau qui se remplit avec l'XP du niveau ; un point orange seulement s'il y a du nouveau ----------
export function meButton(active) {
  const r = rpgStats(), news = hasNews(r);
  const pct = r.level >= 25 ? 100 : Math.round(Math.max(0, Math.min(1, (r.xp - r.base) / Math.max(1, r.next - r.base))) * 100);
  const b = h('button', { type: 'button', class: 'avatar tier-' + r.tier.id + (active ? ' on' : ''), id: 'meBtn', style: { '--xp': pct + '%' },
    'aria-label': `Mon profil, niveau ${r.level}, ${pct} % vers le niveau suivant${news ? ', du nouveau pour ton personnage' : ''}`, onclick: () => nav.go('me') });
  b.append(svgEl(avatarSVG(myAvatar(), { mini: true }), 'av-in'));
  if (news) b.append(h('span', { class: 'av-dot', 'aria-hidden': 'true' })); // la seule pastille : « du nouveau pour ton personnage »
  return b;
}
// ce qui rapporte de l'XP (affiché tel quel, pour que ce soit clair)
const XP_RULES = [['🍳', 'Cuisiner une recette', XP.cook], ['📖', 'Bonus : une recette que tu n’avais jamais faite', XP.newRecipe], ['⭐', 'Noter un repas', XP.rate],
  ['♻️', 'Utiliser un produit qui allait périmer', XP.saved], ['📆', 'Utiliser l’app dans la journée (ajouter, acheter, planifier), une fois par jour', XP.activeDay],
  ['🧾', 'Scanner un ticket de caisse, une fois par jour', XP.receiptDay], ['🗓️', 'Une semaine avec au moins 10 repas prévus', XP.plannedWeek], ['✍️', 'Créer ta propre recette', XP.custom],
  ['✨', 'Trouver un petit secret caché dans l’app', XP.egg], ['🌿', 'Un mois entier sans rien jeter (8 repas ou plus)', XP.zeroWaste]];
function xpHelp() {
  return h('div', { class: 'xp-help' }, h('h3', { class: 'group-title' }, 'Comment gagner de l’XP'),
    h('ul', { class: 'xp-rules' }, XP_RULES.map(([e, t, v]) => h('li', null, h('span', { class: 'e' }, e), h('span', { class: 'grow' }, t), h('span', { class: 'xp-v' }, `+${v}`)))),
    h('p', { class: 'hint' }, 'Rien à faire exprès : l’XP arrive en utilisant l’app normalement. Chaque niveau demande un peu plus d’XP que le précédent.'));
}
function openXpHelp() { openSheet({ title: 'Gagner de l’XP', content: xpHelp() }); }

// ---------- carte de profil ----------
function nextReward(level) { for (let l = level + 1; l <= 25; l++) { const r = rewardsAt(l); if (r.length) return { level: l, items: r }; } return null; }
export function profileCard() {
  const r = rpgStats(), p = S.data.prefs, got = earnedIds(r), pct = Math.max(0, Math.min(100, (r.xp - r.base) / Math.max(1, r.next - r.base) * 100)), a = myAvatar();
  const nx = nextReward(r.level), pass = passportData(), news = freshItems(r).length;
  const editName = () => { const inp = h('input', { class: 'input', value: p.name || '', placeholder: 'Ton nom de chef', maxlength: '24', 'aria-label': 'Ton nom de chef' });
    const sh = openSheet({ title: 'Ton nom de chef', size: 'small', content: h('div', { class: 'form' }, inp), footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => { setPref({ name: inp.value.trim() }); sh.close(); } }) }); setTimeout(() => inp.focus(), 300); };
  const stat = (e, v, l) => h('div', { class: 'pc-stat' }, h('span', { class: 'pc-v' }, e, ' ', String(v)), h('span', { class: 'pc-l' }, l));
  const rwPrev = nx ? svgEl(previewWith(a, nx.items[0].slot, nx.items[0].id, { mini: nx.items[0].slot !== 'pet' }), 'mini-av') : h('span', { class: 'pc-g-e' }, '🏆');
  return h('section', { class: 'profile-card' },
    h('div', { class: 'pc-top' },
      h('button', { type: 'button', class: 'pc-av tier-' + r.tier.id, 'aria-label': !p.avatar ? 'Créer mon personnage' : news ? `Personnaliser mon personnage, ${news} nouvel${news > 1 ? 's' : ''} objet${news > 1 ? 's' : ''}` : 'Personnaliser mon personnage', onclick: () => openAvatarEditor() }, svgEl(avatarSVG(a, { title: 'Mon personnage' }), 'pc-av-in'), h('span', { class: 'pc-av-edit' }, icon('wand', 15), !p.avatar || news ? h('i', { class: 'av-dot', 'aria-hidden': 'true' }) : null)),
      h('div', { class: 'grow' }, h('button', { type: 'button', class: 'pc-name', onclick: editName, 'aria-label': 'Modifier ton nom de chef' }, p.name || 'Chef sans nom', icon('edit', 15)),
        h('div', { class: 'pc-title' }, `${r.title.emoji} Niveau ${r.level} · ${r.title.name}`), h('div', { class: 'pc-tier tier-' + r.tier.id }, `Palier ${r.tier.name}`))),
    h('button', { type: 'button', class: 'pc-xp', onclick: openXpHelp, 'aria-label': 'Comment gagner de l’XP' }, h('span', { class: 'row between' }, h('span', { class: 'pc-xpn' }, `${r.xp - r.base} / ${r.next - r.base} XP`), h('span', { class: 'faint sm' }, r.level >= 25 ? 'niveau maximum' : `vers le niveau ${r.level + 1}`)),
      h('span', { class: 'bar' }, h('i', { style: { width: pct + '%' } })), h('span', { class: 'pc-xp-help' }, icon('info', 14), 'Comment gagner de l’XP ?')),
    h('div', { class: 'pc-stats' }, stat('🍳', r.cooked, 'repas'), stat('📖', r.recipes, plural(r.recipes, 'recette', 'recettes')), stat('♻️', r.saved, plural(r.saved, 'sauvé', 'sauvés')), stat('🔥', r.current, r.current > 1 ? 'jours actifs' : 'jour actif')),
    h('div', { class: 'pc-grid' },
      h('button', { type: 'button', class: 'pc-g', onclick: openBadges }, h('span', { class: 'pc-g-e' }, '🏅'), h('span', { class: 'pc-g-t' }, 'Mes succès'), h('span', { class: 'pc-g-s' }, `${got.size} / ${BADGES.length}`)),
      h('button', { type: 'button', class: 'pc-g', onclick: openPassport }, h('span', { class: 'pc-g-e' }, '🗺️'), h('span', { class: 'pc-g-t' }, 'Passeport'), h('span', { class: 'pc-g-s' }, `${pass.done} / ${pass.list.length}`)),
      h('button', { type: 'button', class: 'pc-g', onclick: openRewards }, rwPrev, h('span', { class: 'pc-g-t' }, 'Récompenses'), h('span', { class: 'pc-g-s' }, nx ? `niv. ${nx.level} : ${nx.items[0].name}` : 'tout est gagné'))));
}

// ---------- éditeur du personnage ----------
let EDIT = { tab: 'body' };
function openAvatarEditor(startTab, focus) {
  const st = rpgStats(), badges = earnedIds(st), fresh = new Set(freshItems(st));
  let draft = safeAvatar(myAvatar(), st, badges), saved = false; const original = JSON.stringify(draft);
  if (startTab) EDIT.tab = startTab;
  const markSeen = () => { const st2 = rpgStats(); mutate('meta', m => ({ ...m, seenItems: [...new Set([...(m.seenItems || []), ...unlockedKeys(st2, earnedIds(st2))])] })); };
  markSeen(); // le point disparaît dès l'ouverture (et encore à la fermeture, si quelque chose s'est débloqué entre-temps)
  const prev = h('div', { class: 'av-stage tier-' + st.tier.id }), tabs = h('div', { class: 'chips scroll av-tabs', role: 'tablist' }), body = h('div', { class: 'av-body' });
  const drawPrev = () => { prev.innerHTML = avatarSVG(draft, { title: 'Aperçu de mon personnage' }); };
  const lockMsg = how => how[0] === 'lvl' ? `Se débloque au niveau ${how[1]}. Ça vient tout seul en utilisant l’app.` : `Se débloque avec le succès « ${(BADGES.find(b => b[0] === how[1]) || [])[2]} » (${(BADGES.find(b => b[0] === how[1]) || [])[4] || ''}).`;
  const drawBody = () => {
    clear(body); const tab = TABS.find(t => t[0] === EDIT.tab) || TABS[0];
    for (const [key, label] of tab[3]) {
      body.append(h('h3', { class: 'group-title' }, label));
      if (key[0] === '$') { // couleurs
        const ck = key.slice(1);
        body.append(h('div', { class: 'av-swatches' }, COLORS[ck].map(([col, name], i) => h('button', { type: 'button', class: 'av-sw' + (draft[ck] === i ? ' on' : ''), style: { background: col }, 'aria-label': name, 'aria-pressed': String(draft[ck] === i), title: name, onclick: () => { draft = { ...draft, [ck]: i }; haptic(6); redraw(); } }))));
        continue;
      }
      body.append(h('div', { class: 'av-grid' }, PARTS[key].map(([id, name, how]) => {
        const ok = unlocked(key, id, st, badges), on = draft[key] === id, isNew = how && fresh.has(key + ':' + id);
        const thumb = svgEl(previewWith(draft, key, id, { mini: key !== 'pet' }), 'av-thumb');
        return h('button', { type: 'button', class: 'av-opt' + (on ? ' on' : '') + (ok ? '' : ' locked') + (focus === key + ':' + id ? ' focus' : ''), 'aria-pressed': String(on), 'aria-label': ok ? name : `${name}, verrouillé (${howText(how).toLowerCase()})`,
          onclick: () => { if (!ok) { toast(lockMsg(how), { ms: 4200 }); return; } draft = { ...draft, [key]: id }; haptic(6); redraw(); } },
          thumb, h('span', { class: 'av-n' }, name), !ok ? h('span', { class: 'av-lock' }, '🔒 ', how[0] === 'lvl' ? `Niv. ${how[1]}` : 'Succès') : null, isNew ? h('span', { class: 'av-new' }, 'Nouveau') : null);
      })));
    }
  };
  const drawTabs = () => { clear(tabs); for (const [id, name, e] of TABS) tabs.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (EDIT.tab === id ? ' on' : ''), 'aria-selected': String(EDIT.tab === id), onclick: () => { EDIT.tab = id; drawTabs(); drawBody(); body.scrollIntoView({ block: 'nearest' }); } }, `${e} ${name}`)); requestAnimationFrame(() => { const on = tabs.querySelector('.chip.on'); on && on.scrollIntoView({ inline: 'center', block: 'nearest' }); }); };
  const redraw = () => { drawPrev(); drawBody(); };
  const tools = h('div', { class: 'av-tools' },
    btn('Au hasard', { class: 'btn soft sm', onclick: () => { draft = safeAvatar(randomAvatar(st, badges), st, badges); haptic(10); redraw(); } }, 'dice'),
    btn('Annuler', { class: 'btn soft sm', onclick: () => { draft = JSON.parse(original); redraw(); } }, 'undo'));
  drawTabs(); redraw();
  const s = openSheet({ title: 'Mon personnage', size: 'tall', content: h('div', { class: 'av-editor' }, h('div', { class: 'av-head' }, h('div', { class: 'av-top' }, prev, tools), tabs), body),
    onClose: () => { markSeen(); if (!saved && JSON.stringify(draft) !== original) setPref({ avatar: draft }); }, // fermer garde ce que tu vois (le bouton Annuler sert à revenir en arrière)
    footer: btn('Enregistrer', { class: 'btn primary block big', onclick: () => { const first = !S.data.prefs.avatar; saved = true; setPref({ avatar: draft }); s.close(); celebrate({ n: 16 }); toast(first ? 'Ton personnage est prêt !' : 'Personnage enregistré'); } }) });
  if (focus) setTimeout(() => { const f = s.el && s.el.querySelector('.av-opt.focus'); f && f.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 350);
}

// ---------- chemin des récompenses ----------
function openRewards() {
  const r = rpgStats(), got = earnedIds(r), a = myAvatar();
  const titleAt = l => { const t = TITLES.find(x => x[0] === l); return t ? `${t[2]} ${t[1]}` : null; };
  const chipOf = x => h('button', { type: 'button', class: 'rw-item', onclick: () => { s.close(); setTimeout(() => openAvatarEditor(tabOf(x.slot), x.key), 260); } }, svgEl(previewWith(a, x.slot, x.id, { mini: x.slot !== 'pet' }), 'mini-av'), h('span', null, x.name));
  const rows = []; for (let l = 2; l <= 25; l++) {
    const items = rewardsAt(l), t = titleAt(l), done = r.level >= l, cur = l === r.level + 1;
    if (!items.length && !t) continue;
    rows.push(h('div', { class: 'rw-row' + (done ? ' done' : '') + (cur ? ' cur' : '') }, h('span', { class: 'rw-lvl' }, done ? icon('check', 16) : String(l)),
      h('div', { class: 'grow' }, h('div', { class: 'rw-head' }, h('span', { class: 'strong' }, `Niveau ${l}`), t ? h('span', { class: 'rw-title' }, t) : null, cur ? h('span', { class: 'rw-xp' }, `encore ${xpFor(l) - r.xp} XP`) : null),
        h('div', { class: 'rw-items' }, items.map(chipOf)))));
  }
  const byBadge = BADGES.map(b => [b, rewardOfBadge(b[0])]).filter(x => x[1]);
  const s = openSheet({ title: 'Récompenses', size: 'tall', content: h('div', { class: 'stack' },
    h('p', { class: 'muted' }, `Tu as ${r.xp} XP. Chaque niveau et chaque succès débloque quelque chose pour ton personnage.`), xpHelp(),
    h('h3', { class: 'group-title' }, 'Par niveau'),
    h('div', { class: 'rw-list' }, rows),
    h('h3', { class: 'group-title' }, 'Avec les succès'),
    h('div', { class: 'rw-badges' }, byBadge.map(([b, x]) => h('div', { class: 'rw-b' + (got.has(b[0]) ? ' done' : '') }, svgEl(previewWith(a, x.slot, x.id, { mini: x.slot !== 'pet' }), 'mini-av'), h('span', { class: 'grow' }, h('span', { class: 'strong sm block' }, x.name), h('span', { class: 'faint sm block' }, `${b[1]} ${b[2]}`)), got.has(b[0]) ? icon('check', 16) : h('span', { class: 'faint sm' }, '🔒'))))) });
}
const tabOf = slot => (TABS.find(t => t[3].some(([k]) => k === slot)) || TABS[0])[0];

// ---------- succès (groupés, avec leur avancement et leur récompense) ----------
function openBadges() {
  const r = rpgStats(), got = earnedIds(r), a = myAvatar();
  const card = id => { const b = BADGES.find(x => x[0] === id); if (!b) return null; const on = got.has(id), [key, goal] = BADGE_GOAL[id] || [], v = Math.min(goal || 1, r[key] || 0), rw = rewardOfBadge(id), secret = id === 'secret' && !on;
    return h('div', { class: 'badge' + (on ? ' on' : '') }, h('span', { class: 'b-e' }, on ? b[1] : secret ? '❔' : '🔒'), h('span', { class: 'b-n' }, b[2]), h('span', { class: 'b-h' }, secret ? 'Il y a des petits secrets cachés dans l’app…' : b[4]),
      !on && goal > 1 ? h('span', { class: 'b-prog' }, h('i', { style: { width: (v / goal * 100) + '%' } })) : null, !on && goal > 1 ? h('span', { class: 'b-v' }, `${v} / ${goal}`) : null,
      rw ? h('span', { class: 'b-rw' }, svgEl(previewWith(a, rw.slot, rw.id, { mini: rw.slot !== 'pet' }), 'micro-av'), rw.name) : null); };
  openSheet({ title: 'Mes succès', size: 'tall', content: h('div', { class: 'stack' }, h('p', { class: 'muted' }, `${got.size} sur ${BADGES.length}. Une collection qui se remplit toute seule, au fil de tes repas. Chaque succès t’offre un objet pour ton personnage.`),
    ...BADGE_GROUPS.map(([e, name, ids]) => h('div', { class: 'stack' }, h('h3', { class: 'group-title' }, `${e} ${name}`, h('span', { class: 'n' }, `${ids.filter(i => got.has(i)).length}/${ids.length}`)), h('div', { class: 'badge-grid' }, ids.map(card))))) });
}

// ---------- passeport gourmand : un tampon par cuisine goûtée ----------
const CUI = { 'Française': '🥖', Italienne: '🍝', Espagnole: '🥘', Portugaise: '🐟', Grecque: '🫒', Méditerranéenne: '🌿', Marocaine: '🫖', Maghrébine: '🍲', Orientale: '🧆', Libanaise: '🥙', Turque: '🍢', Indienne: '🍛',
  Thaïlandaise: '🍜', Japonaise: '🍣', Chinoise: '🥡', Vietnamienne: '🥢', Asiatique: '🥢', Coréenne: '🌶️', Indonésienne: '🍤', Mexicaine: '🌮', Américaine: '🍔', 'Latino-américaine': '🌽', Péruvienne: '🍋', Argentine: '🥩',
  Antillaise: '🌴', Réunionnaise: '🌺', Sénégalaise: '🥜', Africaine: '🥜', Anglaise: '☕', Irlandaise: '☘️', Scandinave: '🐟', Suisse: '🧀', Belge: '🍟', Hongroise: '🌶️', Ukrainienne: '🌻', "Européenne de l'Est": '🥟', Allemande: '🥨',
  Provençale: '🌻', Bretonne: '🌊', Alsacienne: '🥨', Lyonnaise: '🦁', Basque: '🌶️', Niçoise: '🫒', Bourguignonne: '🍷', Limousine: '🍒', Périgourdine: '🌰', Normande: '🍏', 'Sud-Ouest': '🦆', Savoyarde: '🏔️', Lorraine: '🥧',
  Québécoise: '🍁', Australienne: '🦘', Suédoise: '🫐', Picarde: '🥞', Auvergnate: '🧀', Cambodgienne: '🛕', Brésilienne: '🥥', Russe: '🪆', 'Tex-Mex': '🌯', Exotique: '🥭', 'Cuisine du monde': '🌍' };
export const cuisineEmoji = k => CUI[k] || '🍽️';
function passportData() {
  // mêmes recettes que la liste ouverte en touchant le tampon : celles qui te conviennent (les grisées faute d'appareil comprises)
  const byK = new Map(); for (const r of S.cat.list) if (!r.custom && r.k && allowed(r, S.data.prefs, S.kb, true)) byK.set(r.k, (byK.get(r.k) || 0) + 1);
  const cooked = new Map(); for (const e of S.data.history) { const r = S.cat.get(e.rid); if (r && r.k) cooked.set(r.k, (cooked.get(r.k) || 0) + 1); }
  const list = [...new Set([...byK.keys(), ...cooked.keys()])].map(k => ({ k, n: byK.get(k) || 0, c: cooked.get(k) || 0, e: CUI[k] || '🍽️' })).sort((a, b) => (b.c > 0) - (a.c > 0) || b.n - a.n);
  return { list, done: list.filter(x => x.c).length };
}
function openPassport() {
  const P = passportData();
  const s = openSheet({ title: 'Passeport gourmand', size: 'tall', content: h('div', { class: 'stack' },
    h('p', { class: 'muted' }, `${P.done} cuisine${P.done > 1 ? 's' : ''} goûtée${P.done > 1 ? 's' : ''} sur ${P.list.length}. Chaque recette cuisinée tamponne ton passeport. Touche une cuisine pour voir ses recettes.`),
    h('div', { class: 'pass-grid' }, P.list.map(x => h('button', { type: 'button', class: 'stamp' + (x.c ? ' on' : ''), 'aria-label': `${x.k} : ${x.c ? `cuisinée ${x.c} fois` : 'à découvrir'}`,
      onclick: () => { s.close(); resetRUI(); RUI.kitchen = x.k; setTimeout(() => nav.go('recipes'), 260); } },
      h('span', { class: 'st-e' }, x.e), h('span', { class: 'st-n' }, x.k), h('span', { class: 'st-c' }, x.c ? `× ${x.c}` : `${x.n} recette${x.n > 1 ? 's' : ''}`))))) });
}

// ---------- montée de niveau : un vrai moment, avec les récompenses ----------
export function levelUp(level, title) {
  const items = rewardsAt(level), a = myAvatar();
  const wrap = h('div', { class: 'lvlup', role: 'dialog', 'aria-label': `Niveau ${level}` });
  const close = () => { removeEventListener('keydown', esc); wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 320); };
  const esc = e => { if (e.key === 'Escape') close(); }; addEventListener('keydown', esc);
  wrap.append(h('div', { class: 'lvl-card' },
    h('div', { class: 'lvl-rays', 'aria-hidden': 'true' }), svgEl(avatarSVG(a, { title: 'Mon personnage' }), 'lvl-av'),
    h('div', { class: 'lvl-n' }, `Niveau ${level} !`), h('div', { class: 'lvl-t' }, `Te voilà « ${title.name} » ${title.emoji}`),
    items.length ? h('div', { class: 'lvl-items' }, h('span', { class: 'faint sm' }, 'Tu débloques'), h('div', { class: 'rw-items center' }, items.map(x => h('div', { class: 'rw-item static' }, svgEl(previewWith(a, x.slot, x.id, { mini: x.slot !== 'pet' }), 'mini-av'), h('span', null, x.name))))) : null,
    h('div', { class: 'lvl-btns' }, items.length ? btn('Essayer', { class: 'btn primary', onclick: () => { close(); setTimeout(() => openAvatarEditor(tabOf(items[0].slot), items[0].key), 200); } }, 'wand') : null,
      btn(items.length ? 'Plus tard' : 'Super !', { class: 'btn soft', onclick: close }))));
  wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
  document.body.append(wrap); requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('in'))); celebrate(); haptic([20, 40, 20]);
}
export function badgeBanner(b) { const rw = rewardOfBadge(b[0]); achievement(b[1], `Succès : ${b[2]}`, rw ? `Tu débloques : ${rw.name}` : b[4], () => openBadges()); }
// petit « +25 XP » qui s'envole du bouton profil
export function xpFloat(n) {
  const anchor = document.getElementById('meBtn'); if (!anchor || n <= 0) return; const r = anchor.getBoundingClientRect();
  const el = h('span', { class: 'xp-float', style: { left: (r.left + r.width / 2) + 'px', top: (r.bottom + 4) + 'px' } }, `+${n} XP`);
  document.body.append(el); anchor.classList.remove('xp-pulse'); void anchor.offsetWidth; anchor.classList.add('xp-pulse'); setTimeout(() => el.remove(), 1700);
}
export { item, SLOT_NAMES };
