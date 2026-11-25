// Ton personnage : un petit chef dessiné (illustrations originales en SVG), que tu composes toi-même.
// Classique, fantastique ou futuriste : beaucoup de choix sont libres dès le départ,
// d'autres se débloquent tout seuls avec les niveaux et les succès (rien à faire « pour » les obtenir).

// ---------- couleurs ----------
const SKINS = [['#ffe3cc', 'Porcelaine'], ['#f5c8a0', 'Clair'], ['#e2a676', 'Doré'], ['#c58a5c', 'Caramel'], ['#985f3c', 'Cacao'], ['#68412a', 'Ébène'],
  ['#9fe0a6', 'Vert alien'], ['#9cc8f5', 'Bleu glacier'], ['#c9b2f2', 'Lilas'], ['#d7dde4', 'Argent'], ['#f7c6dd', 'Rose bonbon'], ['#7d8fa3', 'Ardoise']];
const HAIRC = [['#2b2321', 'Noir'], ['#5a3a24', 'Brun'], ['#8a5a35', 'Châtain'], ['#c3562a', 'Roux'], ['#e2b65a', 'Blond'], ['#b8b2aa', 'Gris'], ['#f1ece3', 'Blanc'], ['#e8789f', 'Rose'], ['#4f7fd6', 'Bleu'], ['#45a167', 'Vert'], ['#8a5cd6', 'Violet'], ['#21c5e8', 'Cyan néon']];
const EYEC = [['#6b4226', 'Brun'], ['#9a6b2f', 'Noisette'], ['#3d7fd9', 'Bleu'], ['#3f9a5a', 'Vert'], ['#7d8a96', 'Gris'], ['#8a5cd6', 'Violet'], ['#e0a92e', 'Doré'], ['#d9363e', 'Rubis'], ['#21d4fd', 'Cyan néon']];
const CLOTHC = [['#f7f4ee', 'Blanc'], ['#d9473b', 'Rouge'], ['#2f4a7a', 'Marine'], ['#3f8a4e', 'Vert'], ['#f0b93a', 'Moutarde'], ['#e77aa8', 'Rose'], ['#2b2b2f', 'Noir'], ['#7fb6e6', 'Ciel'], ['#7a4fd0', 'Violet'], ['#e07a2f', 'Orange'], ['#20c2d8', 'Turquoise']];
const rgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const hx = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const dk = (c, k = .78) => hx(rgb(c).map(v => v * k));
const lt = (c, k = .35) => hx(rgb(c).map(v => v + (255 - v) * k));
const pale = c => rgb(c).reduce((a, b) => a + b) > 640;

// ---------- catalogue : [id, nom, déblocage] (absent = libre ; ['lvl', n] ; ['badge', id]) ----------
const L = n => ['lvl', n], B = id => ['badge', id];
export const PARTS = {
  kind: [['human', 'Humain'], ['elf', 'Elfe'], ['cat', 'Félin'], ['robot', 'Robot'], ['alien', 'Extraterrestre'], ['dragon', 'Dragon', L(10)]],
  hair: [['court', 'Court'], ['boucles', 'Bouclés'], ['long', 'Longs'], ['chignon', 'Chignon'], ['carre', 'Carré'], ['couettes', 'Couettes'], ['queue', 'Queue-de-cheval'], ['crete', 'Crête'], ['epi', 'En bataille'], ['chauve', 'Sans cheveux']],
  eyes: [['dots', 'Doux'], ['big', 'Grands yeux'], ['wink', 'Clin d’œil'], ['sleepy', 'Rêveur'], ['slit', 'Félins'], ['led', 'Néon'], ['happy', 'Rieurs', L(6)], ['fierce', 'Déterminés', B('streak3')], ['hearts', 'Cœurs', L(21)], ['stars', 'Étoilés', L(22)]],
  mouth: [['smile', 'Sourire'], ['grin', 'Grand sourire'], ['o', 'Étonné'], ['cat', 'Malicieux'], ['fangs', 'Petits crocs'], ['tongue', 'Gourmand', L(18)]],
  beard: [['none', 'Aucune'], ['moustache', 'Moustache'], ['goatee', 'Bouc'], ['short', 'Barbe courte'], ['full', 'Grande barbe'], ['handlebar', 'Moustache en guidon', L(14)]],
  hat: [['none', 'Aucun'], ['toque', 'Toque'], ['bandana', 'Bandana'], ['cap', 'Casquette'], ['neon', 'Bandeau néon'], ['wizard', 'Chapeau de mage', L(2)], ['straw', 'Chapeau de paille', L(5)], ['horns', 'Cornes', L(8)],
    ['beanie', 'Bonnet à pompon', L(9)], ['flowers', 'Couronne de fleurs', L(12)], ['gold', 'Toque dorée', L(15)], ['helmet', 'Casque spatial', L(18)], ['crown', 'Couronne de chef', L(20)], ['crystal', 'Couronne de cristal', L(24)], ['halo', 'Auréole de légende', L(25)],
    ['tall', 'Grande toque', B('toque')], ['cupcake', 'Chapeau cupcake', B('pastry')], ['leaves', 'Couronne de feuilles', B('green')], ['explorer', 'Chapeau d’explorateur', B('explorer')]],
  outfit: [['chef', 'Veste de chef'], ['apron', 'Tablier'], ['tee', 'T-shirt'], ['hoodie', 'Sweat à capuche'], ['space', 'Combinaison spatiale'], ['mariniere', 'Marinière', L(7)], ['cyber', 'Veste néon', L(9)], ['mage', 'Robe de mage', L(13)],
    ['armor', 'Armure', L(16)], ['starry', 'Veste étoilée', L(24)], ['checked', 'Tablier vichy', B('allround')], ['painter', 'Tablier d’artiste', B('creator')], ['cape', 'Cape anti-gaspi', B('hero')], ['black', 'Veste noire de brigade', B('brigade')]],
  back: [['none', 'Rien'], ['fairy', 'Ailes de fée', L(5)], ['dragonw', 'Ailes de dragon', L(15)], ['jetpack', 'Jetpack', L(19)], ['angel', 'Ailes d’ange', L(25)]],
  acc: [['none', 'Aucun'], ['spoon', 'Cuillère en bois'], ['visor', 'Visière holo'], ['glasses', 'Lunettes rondes', L(3)], ['wand', 'Baguette magique', L(6)], ['laserwhisk', 'Fouet laser', L(11)], ['sunglasses', 'Lunettes de soleil', L(13)],
    ['potion', 'Potion', L(17)], ['cybereye', 'Œil bionique', L(23)], ['whisk', 'Fouet', B('first')], ['scarf', 'Foulard bleu', B('bleu')], ['pencil', 'Crayon sur l’oreille', B('planner')], ['goggles', 'Lunettes d’aviateur', B('curious')], ['monocle', 'Monocle', B('critic')]],
  bg: [['theme', 'Mon ambiance'], ['peche', 'Pêche'], ['menthe', 'Menthe'], ['ciel', 'Ciel'], ['lavande', 'Lavande'], ['citron', 'Citron'], ['rose', 'Rose'], ['sauge', 'Sauge'], ['nuit', 'Nuit'], ['space', 'Espace'],
    ['nebula', 'Nébuleuse', L(3)], ['vichy', 'Nappe vichy', L(4)], ['neon', 'Ville néon', L(7)], ['castle', 'Château', L(10)], ['stars', 'Nuit étoilée', L(11)], ['garden', 'Potager', L(17)], ['enchanted', 'Forêt enchantée', L(20)], ['aurora', 'Aurore boréale', L(21)], ['legend', 'Rayons dorés', L(25)],
    ['confetti', 'Confettis', B('receipt')], ['slate', 'Ardoise', B('organized')], ['pantry', 'Garde-manger', B('pantry')], ['globe', 'Tour du monde', B('world')], ['forest', 'Forêt', B('zero')], ['flames', 'Flammes', B('streak7')], ['seasons', 'Quatre saisons', B('season')]],
  pet: [['none', 'Aucun'], ['cat', 'Chat'], ['ufo', 'Mini-soucoupe'], ['chick', 'Poussin', L(4)], ['dog', 'Chien', L(8)], ['dragon', 'Bébé dragon', L(12)], ['robot', 'Robot-chien', L(14)], ['hedgehog', 'Hérisson', L(16)], ['fox', 'Renard', L(19)],
    ['unicorn', 'Licorne', L(22)], ['phoenix', 'Phénix', L(23)], ['turtle', 'Tortue', B('saver')], ['rabbit', 'Lapin', B('regular')], ['ghost', 'Petit fantôme', B('secret')]],
};
// onglets de l'éditeur : [id, nom, emoji, [[partie ou $couleur, titre]]]
export const TABS = [
  ['body', 'Corps', '🧬', [['kind', 'Type'], ['$skin', 'Couleur de peau']]],
  ['face', 'Visage', '🙂', [['eyes', 'Yeux'], ['$eyeC', 'Couleur des yeux'], ['mouth', 'Bouche'], ['beard', 'Barbe et moustache']]],
  ['hair', 'Cheveux', '💇', [['hair', 'Coiffure'], ['$hairC', 'Couleur']]],
  ['hat', 'Tête', '🎩', [['hat', 'Chapeau, couronne…']]],
  ['outfit', 'Tenue', '👕', [['outfit', 'Tenue'], ['$clothC', 'Couleur'], ['back', 'Dans le dos']]],
  ['acc', 'Objet', '🪄', [['acc', 'Objet ou lunettes']]],
  ['bg', 'Fond', '🌌', [['bg', 'Fond']]],
  ['pet', 'Compagnon', '🐾', [['pet', 'Compagnon']]],
];
export const COLORS = { skin: SKINS, hairC: HAIRC, eyeC: EYEC, clothC: CLOTHC };
export const SLOT_NAMES = { kind: 'Type', hair: 'Coiffure', eyes: 'Yeux', mouth: 'Bouche', beard: 'Barbe', hat: 'Chapeau', outfit: 'Tenue', back: 'Dos', acc: 'Objet', bg: 'Fond', pet: 'Compagnon' };
export const DEFAULT_AVATAR = { kind: 'human', skin: 1, hair: 'court', hairC: 1, eyes: 'dots', eyeC: 0, mouth: 'smile', beard: 'none', hat: 'toque', outfit: 'chef', clothC: 0, back: 'none', acc: 'none', bg: 'theme', pet: 'none' };
export const item = (slot, id) => (PARTS[slot] || []).find(x => x[0] === id);
const allItems = () => Object.entries(PARTS).flatMap(([slot, list]) => list.filter(x => x[2]).map(x => ({ slot, id: x[0], name: x[1], how: x[2], key: slot + ':' + x[0] })));
export function unlocked(slot, id, st, badges) { const x = item(slot, id); if (!x) return false; const w = x[2]; if (!w) return true; if (!st) return false; return w[0] === 'lvl' ? st.level >= w[1] : badges.has(w[1]); }
export const rewardsAt = lvl => allItems().filter(x => x.how[0] === 'lvl' && x.how[1] === lvl);
export const rewardOfBadge = id => allItems().find(x => x.how[0] === 'badge' && x.how[1] === id);
export const unlockedKeys = (st, badges) => allItems().filter(x => unlocked(x.slot, x.id, st, badges)).map(x => x.key);
// avatar sûr : chaque partie existe (et est débloquée si on le précise), sinon choix de base
export function safeAvatar(a, st, badges) {
  const o = { ...DEFAULT_AVATAR, ...(a || {}) };
  for (const slot of Object.keys(PARTS)) if (!item(slot, o[slot]) || (st && !unlocked(slot, o[slot], st, badges))) o[slot] = DEFAULT_AVATAR[slot];
  for (const [k, list] of Object.entries(COLORS)) o[k] = Math.max(0, Math.min(list.length - 1, Number.isInteger(o[k]) ? o[k] : DEFAULT_AVATAR[k]));
  return o;
}

// ---------- dessin ----------
let N = 0;
const star4 = (x, y, r, f) => `<path d="M${x} ${y - r}Q${x + r * .2} ${y - r * .2} ${x + r} ${y}Q${x + r * .2} ${y + r * .2} ${x} ${y + r}Q${x - r * .2} ${y + r * .2} ${x - r} ${y}Q${x - r * .2} ${y - r * .2} ${x} ${y - r}Z" fill="${f}"/>`;
const dots = (n, seed, col, ymax = 70, r = 1.2) => Array.from({ length: n }, (_, i) => `<circle cx="${(i * 37 + seed * 13) % 116 + 2}" cy="${(i * 53 + seed * 7) % ymax + 3}" r="${i % 3 ? r * .7 : r}" fill="${col}" opacity="${i % 2 ? .6 : 1}"/>`).join('');
const BGC = { peche: '#ffd9c2', menthe: '#cdeedd', ciel: '#cfe3f7', lavande: '#e2d7f5', citron: '#fbefb5', rose: '#fbd3e0', sauge: '#d9e4cc', nuit: '#26304a' };
function background(id, u) {
  const rad = (a, b) => `<defs><radialGradient id="bg${u}" cx=".5" cy=".38" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs><rect width="120" height="120" fill="url(#bg${u})"/>`;
  if (id === 'theme') return '<rect width="120" height="120" style="fill:var(--accent-tint)"/><circle cx="60" cy="48" r="44" style="fill:var(--surface);opacity:.55"/><circle cx="60" cy="150" r="74" style="fill:var(--accent);opacity:.2"/>';
  if (BGC[id]) return rad(lt(BGC[id], .45), BGC[id]) + (id === 'nuit' ? dots(9, 3, '#fff', 60) : '');
  const P = {
    space: rad('#2a2f6b', '#0b0d24') + dots(16, 1, '#fff', 116, 1) + `<circle cx="96" cy="26" r="11" fill="#f0a35e"/><circle cx="92" cy="22" r="3" fill="#ffc48a" opacity=".7"/><ellipse cx="96" cy="26" rx="19" ry="4.5" fill="none" stroke="#ffd9a8" stroke-width="1.6" transform="rotate(-18 96 26)"/>`,
    nebula: rad('#a55bd6', '#2a1446') + `<circle cx="30" cy="30" r="30" fill="#ff7ac8" opacity=".25"/><circle cx="96" cy="80" r="34" fill="#5bc8ff" opacity=".22"/>` + dots(14, 5, '#fff', 116, 1),
    vichy: `<defs><pattern id="v${u}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#fff"/><rect width="8" height="16" fill="#e45b55" opacity=".42"/><rect width="16" height="8" fill="#e45b55" opacity=".42"/></pattern></defs><rect width="120" height="120" fill="url(#v${u})"/>`,
    neon: `<defs><linearGradient id="n${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset="1" stop-color="#d1386b"/></linearGradient></defs><rect width="120" height="120" fill="url(#n${u})"/><circle cx="60" cy="74" r="22" fill="#ffb347" opacity=".75"/>` +
      [[0, 60, 18], [16, 48, 14], [28, 66, 20], [46, 56, 12], [70, 50, 16], [84, 62, 14], [96, 44, 24]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${120 - y}" fill="#1a0b33"/>` + Array.from({ length: 4 }, (_, i) => `<rect x="${x + 3 + (i % 2) * (w / 2 - 2)}" y="${y + 5 + Math.floor(i / 2) * 9}" width="3" height="3" fill="${i % 3 ? '#21d4fd' : '#ff4fd8'}"/>`).join('')).join(''),
    castle: rad('#fbe3f0', '#b9c8f2') + `<path d="M14 120 V74 h8 v-6 h4 v6 h4 v-6 h4 v6 h8 V58 h6 v-6 h4 v6 h4 v-6 h4 v6 h6 V120Z" fill="#7d78b8"/><path d="M62 120 V66 h8 v-6 h4 v6 h4 v-6 h4 v6 h8 V50 l8 -14 l8 14 V120Z" fill="#6a65a8"/><path d="M96 36 v-8 l8 3 l-8 3" fill="#ff7a8a"/><rect x="40" y="96" width="10" height="24" rx="5" fill="#4b4680"/>` + dots(4, 2, '#fff', 30),
    stars: rad('#34407a', '#141a38') + [[18, 20], [40, 12], [92, 18], [106, 40], [12, 52], [30, 36], [78, 8], [100, 64]].map(([x, y], i) => star4(x, y, 3.2, i % 3 ? '#fff' : '#ffd66b')).join(''),
    garden: '<rect width="120" height="120" fill="#cde9f6"/><circle cx="98" cy="22" r="9" fill="#ffd34d"/><path d="M0 70 C30 60 80 64 120 58 V120 H0Z" fill="#9fd37f"/>' + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${10 + i * 20}" cy="80" r="5" fill="#4f9a3d"/><rect x="${9 + i * 20}" y="80" width="2" height="6" fill="#e2672e"/>`).join(''),
    enchanted: rad('#1f5a5a', '#0b2023') + [[12, 40, 30], [34, 30, 36], [92, 34, 34], [112, 44, 28]].map(([x, y, h]) => `<path d="M${x} ${y} L${x - 13} ${y + h} H${x + 13}Z" fill="#123a3a"/>`).join('') + [[22, 104, '#ff6fb1'], [98, 108, '#7affd4'], [86, 98, '#ffd36b']].map(([x, y, c]) => `<rect x="${x - 1}" y="${y}" width="2.4" height="7" fill="#e8e0c8"/><path d="M${x - 6} ${y + 1} Q${x} ${y - 7} ${x + 6} ${y + 1}Z" fill="${c}"/><circle cx="${x}" cy="${y - 2}" r="9" fill="${c}" opacity=".18"/>`).join('') + dots(10, 4, '#d8ff8a', 90, 1.1),
    aurora: rad('#1c2b55', '#070b1c') + dots(10, 6, '#fff', 116, .9) + `<path d="M-10 46 C20 20 50 54 80 30 S120 30 130 20 V48 C110 58 90 46 70 62 S20 64 -10 72Z" fill="#3cf2a5" opacity=".38"/><path d="M-10 60 C30 40 60 70 90 50 S120 48 130 40 V56 C100 70 70 62 40 78 S0 80 -10 84Z" fill="#a06bff" opacity=".3"/>`,
    legend: '<rect width="120" height="120" fill="#ffe7a3"/>' + Array.from({ length: 12 }, (_, i) => `<path d="M60 60 L${(60 + 90 * Math.cos(i * Math.PI / 6)).toFixed(1)} ${(60 + 90 * Math.sin(i * Math.PI / 6)).toFixed(1)} L${(60 + 90 * Math.cos(i * Math.PI / 6 + .26)).toFixed(1)} ${(60 + 90 * Math.sin(i * Math.PI / 6 + .26)).toFixed(1)}Z" fill="#ffd24a" opacity=".7"/>`).join(''),
    confetti: '<rect width="120" height="120" fill="#fff4f8"/>' + Array.from({ length: 22 }, (_, i) => `<rect x="${(i * 37) % 112 + 2}" y="${(i * 53) % 110 + 4}" width="5" height="2.6" rx="1" fill="${['#ff5c8a', '#ffc53d', '#3fb7f2', '#6ccf6b', '#a77bf3'][i % 5]}" transform="rotate(${(i * 47) % 180} ${(i * 37) % 112 + 4} ${(i * 53) % 110 + 5})"/>`).join(''),
    slate: '<rect width="120" height="120" fill="#2f3a36"/><g fill="none" stroke="#e9efe9" stroke-width="1.4" opacity=".55" stroke-linecap="round"><path d="M14 22 q6 -6 12 0 q6 6 12 0"/><path d="M86 18 l8 8 m0 -8 l-8 8"/><circle cx="100" cy="56" r="6"/><path d="M12 60 h14 m-7 -7 v14"/></g>',
    pantry: '<rect width="120" height="120" fill="#f1dfc0"/><g fill="#b98a55"><rect y="34" width="120" height="4"/><rect y="74" width="120" height="4"/></g>' + [[8, '#e45b55'], [26, '#f0b93a'], [92, '#6cae5a'], [108, '#e07a2f']].map(([x, c]) => `<rect x="${x}" y="18" width="12" height="16" rx="3" fill="${c}"/><rect x="${x}" y="15" width="12" height="4" rx="1" fill="#8a6a45"/>`).join(''),
    globe: '<rect width="120" height="120" fill="#bfe3f5"/><circle cx="60" cy="60" r="56" fill="#7cc3e8"/><path d="M20 40 q14 -14 30 -6 q6 10 -6 16 q-14 4 -24 -10Z M70 24 q20 0 30 14 q-6 12 -20 8 q-14 -6 -10 -22Z M78 70 q16 -4 22 10 q-8 16 -22 10 q-6 -10 0 -20Z" fill="#8fd17a"/>',
    forest: '<rect width="120" height="120" fill="#d6efd9"/>' + [[10, 70, 26], [34, 62, 30], [92, 64, 30], [112, 72, 24]].map(([x, y, h]) => `<path d="M${x} ${y - h} L${x - 12} ${y} H${x + 12}Z" fill="#3f8a55"/><path d="M${x} ${y - h - 12} L${x - 9} ${y - h + 10} H${x + 9}Z" fill="#4fa266"/>`).join(''),
    flames: `<defs><linearGradient id="f${u}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff6a3d"/><stop offset="1" stop-color="#ffd36b"/></linearGradient></defs><rect width="120" height="120" fill="#fff0d9"/>` + [8, 30, 90, 112].map(x => `<path d="M${x} 120 C${x - 14} 96 ${x - 2} 86 ${x} 70 C${x + 4} 86 ${x + 14} 96 ${x} 120Z" fill="url(#f${u})"/>`).join(''),
    seasons: '<rect width="60" height="60" fill="#fbdbe8"/><rect x="60" width="60" height="60" fill="#fff0b8"/><rect y="60" width="60" height="60" fill="#f8d2b0"/><rect x="60" y="60" width="60" height="60" fill="#dbe8f6"/>',
  };
  return P[id] || background('theme', u);
}
// ailes, jetpack : derrière le corps
function back(id, u) {
  return {
    fairy: `<g opacity=".9"><ellipse cx="30" cy="80" rx="22" ry="13" transform="rotate(-30 30 80)" fill="#bfe8ff" fill-opacity=".55" stroke="#8fd0f5" stroke-width="1.2"/><ellipse cx="90" cy="80" rx="22" ry="13" transform="rotate(30 90 80)" fill="#bfe8ff" fill-opacity=".55" stroke="#8fd0f5" stroke-width="1.2"/><ellipse cx="32" cy="100" rx="14" ry="8" transform="rotate(25 32 100)" fill="#f5c6ff" fill-opacity=".55" stroke="#e0a6f0" stroke-width="1.2"/><ellipse cx="88" cy="100" rx="14" ry="8" transform="rotate(-25 88 100)" fill="#f5c6ff" fill-opacity=".55" stroke="#e0a6f0" stroke-width="1.2"/></g>${star4(14, 66, 3, '#fff')}${star4(106, 70, 2.6, '#fff')}`,
    dragonw: `<path d="M44 92 C30 70 14 64 2 70 C10 74 12 80 8 86 C14 86 18 90 16 96 C22 94 28 96 30 102Z" fill="#6b3fa0" stroke="#3f2066" stroke-width="1.3"/><path d="M76 92 C90 70 106 64 118 70 C110 74 108 80 112 86 C106 86 102 90 104 96 C98 94 92 96 90 102Z" fill="#6b3fa0" stroke="#3f2066" stroke-width="1.3"/><path d="M40 90 L10 76 M80 90 L110 76" stroke="#3f2066" stroke-width="1" opacity=".6"/>`,
    angel: [[-1, 30], [1, 90]].map(([s, x]) => [0, 1, 2].map(i => `<ellipse cx="${x - s * i * 7}" cy="${80 + i * 7}" rx="${20 - i * 3}" ry="${8 - i}" transform="rotate(${s * (35 - i * 12)} ${x - s * i * 7} ${80 + i * 7})" fill="#fff" stroke="#d7dbe6" stroke-width="1.2"/>`).join('')).join(''),
    jetpack: `<defs><linearGradient id="jp${u}" x1="0" x2="1"><stop offset="0" stop-color="#e9edf2"/><stop offset="1" stop-color="#8e99a8"/></linearGradient></defs>${[24, 84].map(x => `<rect x="${x}" y="74" width="12" height="30" rx="6" fill="url(#jp${u})" stroke="#5d6878" stroke-width="1.2"/><path d="M${x + 2} 104 Q${x + 6} 120 ${x + 10} 104Z" fill="#ffb02e"/><path d="M${x + 4} 104 Q${x + 6} 114 ${x + 8} 104Z" fill="#fff1a8"/><rect x="${x + 2}" y="80" width="8" height="3" rx="1.5" fill="#ff5c5c"/>`).join('')}`,
  }[id] || '';
}
function hairBack(st, f, o) {
  return {
    long: `<path d="M31 54 C27 24 93 24 89 54 L94 96 C80 102 40 102 26 96 Z" fill="${f}" ${o}/>`,
    carre: `<path d="M31 56 C28 26 92 26 89 56 L90 74 C82 78 38 78 30 74 Z" fill="${f}" ${o}/>`,
    couettes: `<circle cx="28" cy="66" r="10" fill="${f}" ${o}/><circle cx="92" cy="66" r="10" fill="${f}" ${o}/><rect x="31" y="56" width="6" height="4" rx="2" fill="#e8574c"/><rect x="83" y="56" width="6" height="4" rx="2" fill="#e8574c"/>`,
    queue: `<path d="M84 44 C104 48 104 80 92 92 C96 76 92 60 82 54 Z" fill="${f}" ${o}/>`,
    boucles: `<circle cx="34" cy="64" r="8" fill="${f}" ${o}/><circle cx="86" cy="64" r="8" fill="${f}" ${o}/>`,
    chignon: `<circle cx="60" cy="23" r="10" fill="${f}" ${o}/>`,
  }[st] || '';
}
function hairFront(st, f, o, hl) {
  const shine = `<path d="M44 32 Q52 26 60 26" stroke="${hl}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>`;
  return ({
    court: `<path d="M33 52 C30 28 46 22 60 22 C76 22 91 28 87 52 C84 42 76 37 66 38 C56 33 42 38 33 52 Z" fill="${f}" ${o}/>` + shine,
    boucles: [[38, 36], [48, 28], [60, 25], [72, 28], [82, 36], [34, 46], [86, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${f}" ${o}/>`).join('') + `<path d="M44 28 q4 -3 8 0 M64 24 q4 -3 8 0" stroke="${hl}" stroke-width="1.8" fill="none" opacity=".7"/>`,
    long: `<path d="M33 54 C30 28 46 22 60 22 C76 22 90 28 87 54 C82 40 72 34 60 36 C50 34 38 40 33 54 Z" fill="${f}" ${o}/>` + shine,
    chignon: `<path d="M33 52 C31 30 46 24 60 24 C74 24 89 30 87 52 C80 40 70 36 60 36 C50 36 40 40 33 52 Z" fill="${f}" ${o}/>` + shine,
    carre: `<path d="M33 52 C30 28 46 22 60 22 C76 22 91 28 87 52 L86 46 C76 44 68 40 64 36 C58 42 44 46 34 48 Z" fill="${f}" ${o}/>` + shine,
    couettes: `<path d="M33 52 C30 28 46 22 60 22 C76 22 91 28 87 52 C80 44 70 42 60 42 C50 42 40 44 33 52 Z" fill="${f}" ${o}/>` + shine,
    queue: `<path d="M33 52 C30 28 46 22 60 22 C76 22 91 28 87 52 C82 40 72 34 62 36 C52 32 40 38 33 52 Z" fill="${f}" ${o}/>` + shine,
    crete: `<path d="M52 36 L46 16 L56 25 L60 8 L64 25 L74 16 L68 36 Z" fill="${f}" ${o}/>`,
    epi: `<path d="M33 52 C30 30 40 20 52 22 L50 13 L58 21 L62 11 L66 22 L75 15 L74 24 C84 26 90 34 87 52 C82 42 74 38 66 40 L62 34 L56 40 C48 38 38 42 33 52 Z" fill="${f}" ${o}/>` + shine,
    chauve: `<ellipse cx="50" cy="34" rx="7" ry="3" fill="#fff" opacity=".35"/>`,
  }[st] || '');
}
function eyes(e, ic, hc, u) {
  const bc = dk(hc, .8);
  const brow = (y = 47) => `<path d="M45 ${y} Q50 ${y - 3.2} 55 ${y}" stroke="${bc}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M65 ${y} Q70 ${y - 3.2} 75 ${y}" stroke="${bc}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const eye = (x, rx = 3.6, ry = 4.4) => `<ellipse cx="${x}" cy="56" rx="${rx}" ry="${ry}" fill="#2a1f1d"/><ellipse cx="${x}" cy="${56 + ry * .28}" rx="${rx * .78}" ry="${ry * .62}" fill="${ic}"/><ellipse cx="${x}" cy="${56 + ry * .3}" rx="${rx * .38}" ry="${ry * .38}" fill="#1a1312"/><circle cx="${x + rx * .35}" cy="${56 - ry * .38}" r="${rx * .36}" fill="#fff"/><circle cx="${x - rx * .4}" cy="${56 + ry * .46}" r="${rx * .16}" fill="#fff" opacity=".85"/>`;
  const arc = (x, up = true) => `<path d="M${x - 4.4} 57 Q${x} ${up ? 50.6 : 61.4} ${x + 4.4} 57" stroke="#2a1f1d" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const star = x => `<path d="M${x} 50.6 L${x + 1.7} 54.4 L${x + 5.6} 54.8 L${x + 2.6} 57.4 L${x + 3.5} 61.4 L${x} 59.4 L${x - 3.5} 61.4 L${x - 2.6} 57.4 L${x - 5.6} 54.8 L${x - 1.7} 54.4Z" fill="#ffc21a" stroke="#a36a00" stroke-width=".8"/>`;
  const heart = x => `<path d="M${x} 61 C${x - 7} 56 ${x - 5} 50 ${x} 53.6 C${x + 5} 50 ${x + 7} 56 ${x} 61Z" fill="#ff4f7e" stroke="#b81d48" stroke-width=".8"/><circle cx="${x - 2}" cy="54.6" r=".9" fill="#fff"/>`;
  return ({
    dots: brow() + eye(50) + eye(70),
    big: brow(45) + eye(50, 4.6, 5.6) + eye(70, 4.6, 5.6),
    wink: brow() + eye(50) + arc(70),
    sleepy: brow(48) + `<path d="M45.6 56 Q50 59.6 54.4 56 M65.6 56 Q70 59.6 74.4 56" stroke="#2a1f1d" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M46 55.4 l-1.6 -1.4 M74 55.4 l1.6 -1.4" stroke="#2a1f1d" stroke-width="1.2"/>`,
    slit: brow() + [50, 70].map(x => `<ellipse cx="${x}" cy="56" rx="4" ry="4.6" fill="${ic}" stroke="#2a1f1d" stroke-width="1.2"/><ellipse cx="${x}" cy="56" rx="1" ry="3.6" fill="#1a1312"/><circle cx="${x + 1.6}" cy="54" r="1" fill="#fff"/>`).join(''),
    led: [50, 70].map(x => `<rect x="${x - 5}" y="53" width="10" height="5" rx="2.5" fill="${ic}" filter="url(#gl${u})" opacity=".9"/><rect x="${x - 4.4}" y="53.6" width="8.8" height="3.8" rx="1.9" fill="${lt(ic, .55)}"/>`).join(''),
    happy: brow(46) + arc(50) + arc(70),
    fierce: `<path d="M45 45.6 L55 49 M75 45.6 L65 49" stroke="${bc}" stroke-width="2.6" stroke-linecap="round"/>` + eye(50, 3.4, 3.8) + eye(70, 3.4, 3.8),
    hearts: brow(46) + heart(50) + heart(70),
    stars: brow(45) + star(50) + star(70),
  }[e] || '');
}
function mouth(m) {
  return ({
    smile: '<path d="M53 66 Q60 72.6 67 66" stroke="#7a3328" stroke-width="2.3" fill="none" stroke-linecap="round"/>',
    grin: '<path d="M52 65 Q60 77 68 65 Z" fill="#6e2a22"/><path d="M55 70.6 Q60 74.6 65 70.6 Q60 71.6 55 70.6Z" fill="#f07a7a"/><path d="M53 65.6 H67" stroke="#fff" stroke-width="1.8"/>',
    o: '<ellipse cx="60" cy="68" rx="3.4" ry="4" fill="#6e2a22"/><ellipse cx="60" cy="69.6" rx="2" ry="1.6" fill="#f07a7a"/>',
    cat: '<path d="M53 66 Q56.5 70.4 60 66 Q63.5 70.4 67 66" stroke="#7a3328" stroke-width="2.1" fill="none" stroke-linecap="round"/>',
    fangs: '<path d="M52.6 65.6 Q60 73 67.4 65.6" stroke="#7a3328" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M55.4 67.6 L56.6 71 L57.8 68.4Z M62.2 68.4 L63.4 71 L64.6 67.6Z" fill="#fff" stroke="#c9c2bb" stroke-width=".5"/>',
    tongue: '<path d="M52 65 Q60 74 68 65" stroke="#7a3328" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="M60 69 Q60 76.6 65 75.4 Q68.4 72 66 67Z" fill="#f07a7a" stroke="#c4525a" stroke-width=".6"/>',
  }[m] || '');
}
function beard(b, f, o) {
  return ({
    moustache: `<path d="M50 64 Q55 59 60 63 Q65 59 70 64 Q65 66.4 60 64.4 Q55 66.4 50 64Z" fill="${f}" ${o}/>`,
    goatee: `<path d="M55 74 Q60 83 65 74 Q60 76.4 55 74Z" fill="${f}" ${o}/><path d="M52 64 Q60 60 68 64 Q60 63 52 64Z" fill="${f}"/>`,
    short: `<path d="M34 58 C36 76 48 84 60 84 C72 84 84 76 86 58 C82 66 76 70 70 70 Q60 64 50 70 C44 70 38 66 34 58Z" fill="${f}" ${o} opacity=".95"/>`,
    full: `<path d="M33 56 C33 84 46 97 60 97 C74 97 87 84 87 56 C82 66 76 72 70 72 Q60 64 50 72 C44 72 38 66 33 56Z" fill="${f}" ${o}/>`,
    handlebar: `<path d="M60 63 C55 58 48 60 46 64 C44 60 40 60 40 64 C44 62 46 68 52 66 C56 66 58 65 60 64 C62 65 64 66 68 66 C74 68 76 62 80 64 C80 60 76 60 74 64 C72 60 65 58 60 63Z" fill="${f}" ${o}/>`,
  }[b] || '');
}
function body(o, cc, u) {
  const c = cc, f = `url(#cl${u})`, ol = `stroke="${dk(c, .6)}" stroke-width="1.3" stroke-linejoin="round"`;
  const base = (fill = f, stroke = ol) => `<path d="M14 121 C14 100 32 89 60 89 C88 89 106 100 106 121 Z" fill="${fill}" ${stroke}/>`;
  const fixed = (a, b, id) => `<defs><linearGradient id="${id}${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  const neonC = pale(c) ? '#21d4fd' : c;
  return ({
    chef: base() + `<path d="M48 89 Q60 98 72 89 L72 94 Q60 103 48 94Z" fill="${dk(c, .93)}" ${ol}/><path d="M60 96 L76 121" stroke="${dk(c, .78)}" stroke-width="1.4" fill="none"/>${[102, 110, 118].map(y => `<circle cx="${62 + (y - 96) * .5}" cy="${y}" r="1.9" fill="${dk(c, .66)}"/><circle cx="${48 + (y - 96) * .2}" cy="${y}" r="1.9" fill="${dk(c, .66)}"/>`).join('')}`,
    apron: base('#ebe8e1', 'stroke="#b9b4aa" stroke-width="1.3"') + `<path d="M40 98 H80 L84 121 H36Z" fill="${f}" ${ol}/><path d="M42 98 L50 89 M78 98 L70 89" stroke="${dk(c, .8)}" stroke-width="2.4"/><rect x="52" y="106" width="16" height="9" rx="2" fill="${dk(c, .88)}"/>`,
    tee: base() + `<path d="M50 89 Q60 97 70 89" stroke="${dk(c, .75)}" stroke-width="2" fill="none"/>`,
    hoodie: base() + `<path d="M40 92 Q60 108 80 92 Q76 86 70 86 Q60 96 50 86 Q44 86 40 92Z" fill="${dk(c, .85)}" ${ol}/><path d="M55 98 V110 M65 98 V110" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M44 121 Q60 112 76 121" fill="${dk(c, .9)}"/>`,
    space: fixed('#ffffff', '#c9d2dd', 'sp') + base(`url(#sp${u})`, 'stroke="#8c97a6" stroke-width="1.3"') + `<path d="M24 104 Q30 96 40 93 M96 104 Q90 96 80 93" stroke="${c === '#f7f4ee' ? '#ff7a3d' : c}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="91" rx="15" ry="4.6" fill="#c3ccd8" stroke="#8c97a6" stroke-width="1.2"/><rect x="49" y="101" width="22" height="13" rx="3" fill="#3a4656" stroke="#2a3340" stroke-width="1"/>${[['#ff5c5c', 54], ['#ffd34d', 60], ['#4fe08a', 66]].map(([k, x]) => `<circle cx="${x}" cy="107.5" r="2" fill="${k}"/><circle cx="${x}" cy="107.5" r="3.6" fill="${k}" opacity=".3"/>`).join('')}`,
    mariniere: base('#fbfaf6', 'stroke="#c9c4ba" stroke-width="1.3"') + [97, 104, 111, 118].map(y => `<path d="M${y < 100 ? 26 : 16} ${y} H${y < 100 ? 94 : 104}" stroke="${c === '#f7f4ee' ? '#2f4a7a' : c}" stroke-width="3"/>`).join('') + '<path d="M48 89 Q60 94 72 89" stroke="#2f4a7a" stroke-width="2" fill="none"/>',
    cyber: fixed('#2c2d44', '#14141f', 'cy') + base(`url(#cy${u})`, 'stroke="#0b0b12" stroke-width="1.3"') + `<g stroke="${neonC}" stroke-width="2" fill="none" stroke-linecap="round"><path d="M47 90 L56 104 L58 121 M73 90 L64 104 L62 121"/><path d="M24 108 H38 M82 108 H96"/></g><g stroke="${neonC}" stroke-width="5" fill="none" opacity=".35" filter="url(#gl${u})"><path d="M47 90 L56 104 L58 121 M73 90 L64 104 L62 121"/></g>`,
    mage: fixed(pale(c) ? '#6d4bc4' : lt(c, .1), pale(c) ? '#3b2475' : dk(c, .7), 'mg') + base(`url(#mg${u})`, 'stroke="#2a1856" stroke-width="1.3"') + `<path d="M44 86 L52 96 L60 90 L68 96 L76 86" fill="${pale(c) ? '#5a3aa8' : dk(c, .8)}" stroke="#e3b53a" stroke-width="1.6"/><path d="M46 92 L60 112 L74 92" stroke="#e3b53a" stroke-width="2.4" fill="none"/>${[[28, 108], [90, 110], [40, 116], [80, 118]].map(([x, y]) => star4(x, y, 3, '#ffd66b')).join('')}`,
    armor: fixed('#eef2f6', '#7d8896', 'ar') + base(`url(#ar${u})`, 'stroke="#4f5a68" stroke-width="1.3"') + `<rect x="52" y="96" width="16" height="25" fill="${f}" ${ol}/><path d="M60 100 v8 m-4 -4 h8" stroke="#e3b53a" stroke-width="2"/>${[22, 98].map(x => `<ellipse cx="${x}" cy="104" rx="14" ry="9" fill="url(#ar${u})" stroke="#4f5a68" stroke-width="1.3"/><circle cx="${x}" cy="104" r="1.6" fill="#4f5a68"/>`).join('')}<path d="M40 96 Q60 106 80 96" stroke="#4f5a68" stroke-width="1.2" fill="none"/>`,
    checked: base('#ebe8e1', 'stroke="#b9b4aa" stroke-width="1.3"') + `<defs><pattern id="ck${u}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><rect width="4" height="8" fill="${pale(c) ? '#d9473b' : c}" opacity=".55"/><rect width="8" height="4" fill="${pale(c) ? '#d9473b' : c}" opacity=".55"/></pattern></defs><path d="M40 98 H80 L84 121 H36Z" fill="url(#ck${u})" stroke="#b9b4aa" stroke-width="1.2"/><path d="M42 98 L50 89 M78 98 L70 89" stroke="#8a6a45" stroke-width="2.4"/>`,
    painter: base() + `<path d="M40 98 H80 L84 121 H36Z" fill="#f4efe4" stroke="#c9c2b4" stroke-width="1.2"/>${[[46, 104, '#e45b55'], [70, 108, '#3fb7f2'], [58, 114, '#f0b93a'], [76, 116, '#6ccf6b'], [50, 116, '#a77bf3']].map(([x, y, k]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${k}"/>`).join('')}<path d="M42 98 L50 89 M78 98 L70 89" stroke="#8a6a45" stroke-width="2.4"/>`,
    cape: '<path d="M8 121 C10 98 30 86 60 86 C90 86 110 98 112 121Z" fill="#3f8a4e" stroke="#25563a" stroke-width="1.3"/>' + base() + '<circle cx="60" cy="106" r="8" fill="#fff" stroke="#25563a" stroke-width="1.2"/><path d="M57 109 Q55 102 62 101 Q63 107 57 109Z M57 109 L61 104" fill="#3f8a4e" stroke="#3f8a4e" stroke-width=".8"/>',
    black: base('#2a2a2e', 'stroke="#0f0f12" stroke-width="1.3"') + `<path d="M48 89 Q60 98 72 89 L72 94 Q60 103 48 94Z" fill="#3a3a40"/><path d="M48 94 Q60 103 72 94" stroke="#e3b53a" stroke-width="1.2" fill="none"/>${[102, 110, 118].map(y => `<circle cx="${62 + (y - 96) * .5}" cy="${y}" r="1.9" fill="#e3b53a"/><circle cx="${48 + (y - 96) * .2}" cy="${y}" r="1.9" fill="#e3b53a"/>`).join('')}`,
    starry: base('#24346a', 'stroke="#141d40" stroke-width="1.3"') + `<path d="M48 89 Q60 98 72 89 L72 94 Q60 103 48 94Z" fill="#e3b53a"/>${[[30, 108], [44, 114], [80, 104], [94, 114], [66, 116]].map(([x, y]) => star4(x, y, 3.6, '#ffd66b')).join('')}`,
  }[o] || base());
}
function hat(id, u) {
  const T = 'stroke="#cfcac0" stroke-width="1.3" stroke-linejoin="round"';
  return ({
    toque: `<path d="M37 42 C27 26 40 10 50 18 C52 6 68 6 70 18 C80 10 93 26 83 42 Z" fill="#fff" ${T}/><path d="M52 20 C51 28 51 34 52 40 M68 20 C69 28 69 34 68 40" stroke="#e6e2da" stroke-width="1.4" fill="none"/><rect x="36" y="36" width="48" height="11" rx="4" fill="#fff" ${T}/>`,
    tall: `<path d="M38 42 C30 24 38 -4 52 6 C54 -6 66 -6 68 6 C82 -4 90 24 82 42 Z" fill="#fff" ${T}/><path d="M52 8 V40 M60 2 V40 M68 8 V40" stroke="#ebe8e1" stroke-width="1.4"/><rect x="36" y="36" width="48" height="11" rx="4" fill="#fff" ${T}/>`,
    gold: `<defs><linearGradient id="gd${u}" x1="0" x2="1"><stop offset="0" stop-color="#f6d365"/><stop offset=".5" stop-color="#fff0b0"/><stop offset="1" stop-color="#e0a92e"/></linearGradient></defs><path d="M37 42 C27 26 40 10 50 18 C52 6 68 6 70 18 C80 10 93 26 83 42 Z" fill="url(#gd${u})" stroke="#c8902a" stroke-width="1.3"/><rect x="36" y="36" width="48" height="11" rx="4" fill="url(#gd${u})" stroke="#c8902a" stroke-width="1.3"/>${star4(48, 22, 3.4, '#fff')}`,
    bandana: '<path d="M32 48 C32 24 88 24 88 48 C76 40 44 40 32 48Z" fill="#d9473b" stroke="#9e2d25" stroke-width="1.3"/><path d="M86 44 L100 38 L96 50 Z M86 46 L98 54 L88 54Z" fill="#c23b30" stroke="#9e2d25" stroke-width="1"/>' + [[44, 36], [56, 31], [70, 33], [80, 40], [50, 43]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join(''),
    cap: '<path d="M33 44 C33 18 87 18 87 44 Z" fill="#2f6fd0" stroke="#1d4a91" stroke-width="1.3"/><path d="M60 42 Q92 38 100 46 Q80 48 60 46Z" fill="#245aa8" stroke="#1d4a91" stroke-width="1.2"/><circle cx="60" cy="21" r="2.4" fill="#245aa8"/><path d="M44 28 Q50 24 56 24" stroke="#7fb0ff" stroke-width="2" fill="none" stroke-linecap="round"/>',
    neon: `<path d="M33 41 Q60 29 87 41" stroke="#ff4fd8" stroke-width="7" fill="none" opacity=".35" filter="url(#gl${u})"/><path d="M33 41 Q60 29 87 41" stroke="#ff4fd8" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M33 41 Q60 29 87 41" stroke="#ffd0f4" stroke-width="1.1" fill="none"/><path d="M60 29 l4 5 l-4 5 l-4 -5Z" fill="#21d4fd" stroke="#0a8bb0" stroke-width=".8"/>`,
    wizard: '<ellipse cx="60" cy="39" rx="40" ry="8" fill="#4b2d93" stroke="#2a1856" stroke-width="1.3"/><path d="M36 39 C46 30 50 12 76 -4 C70 10 74 26 84 39 Z" fill="#5b3aa8" stroke="#2a1856" stroke-width="1.3"/><path d="M38 35 Q60 40 82 35 L83 39 Q60 44 37 39Z" fill="#e3b53a"/>' + star4(58, 22, 4, '#ffd66b') + star4(68, 10, 2.6, '#ffd66b') + '<circle cx="50" cy="30" r="1.3" fill="#fff"/>',
    straw: '<ellipse cx="60" cy="40" rx="46" ry="9" fill="#e9c676" stroke="#b89443" stroke-width="1.3"/><path d="M38 40 C38 18 82 18 82 40 Z" fill="#f0d389" stroke="#b89443" stroke-width="1.3"/><path d="M38 36 Q60 40 82 36 L82 40 Q60 44 38 40Z" fill="#d9473b"/>',
    horns: '<path d="M42 34 C34 26 33 14 41 6 C41 16 46 24 51 29Z" fill="#f2e6cf" stroke="#9c8a6a" stroke-width="1.3"/><path d="M78 34 C86 26 87 14 79 6 C79 16 74 24 69 29Z" fill="#f2e6cf" stroke="#9c8a6a" stroke-width="1.3"/><path d="M40 16 l4 2 M38 22 l5 2 M80 16 l-4 2 M82 22 l-5 2" stroke="#c9b894" stroke-width="1.2"/>',
    beanie: '<path d="M33 46 C31 18 89 18 87 46 Z" fill="#e8574c" stroke="#a8362d" stroke-width="1.3"/><rect x="31" y="40" width="58" height="10" rx="5" fill="#c9443a" stroke="#a8362d" stroke-width="1.2"/>' + [38, 46, 54, 62, 70, 78].map(x => `<path d="M${x} 41 V49" stroke="#a8362d" stroke-width="1.2"/>`).join('') + '<circle cx="60" cy="16" r="7" fill="#fff" stroke="#d7d2c8" stroke-width="1.2"/>',
    flowers: [[36, 42, '#ff8fb1'], [43, 33, '#ffd34d'], [52, 28, '#ffffff'], [62, 27, '#ff8fb1'], [72, 29, '#b48cff'], [80, 35, '#ffd34d'], [85, 43, '#ffffff']].map(([x, y, c]) => `<g>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 3}" rx="2.4" ry="3.4" fill="${c}" stroke="${dk(c, .75)}" stroke-width=".5" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="1.8" fill="#f0a020"/></g>`).join(''),
    helmet: `<defs><radialGradient id="hm${u}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".45"/><stop offset=".6" stop-color="#bfe6ff" stop-opacity=".12"/><stop offset="1" stop-color="#7fc8ff" stop-opacity=".35"/></radialGradient></defs><circle cx="60" cy="56" r="37" fill="url(#hm${u})" stroke="#d6efff" stroke-width="2.2"/><path d="M34 40 A30 30 0 0 1 56 24" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><ellipse cx="60" cy="92" rx="24" ry="6" fill="#d3dbe5" stroke="#8c97a6" stroke-width="1.3"/>`,
    crown: '<path d="M38 40 L36 18 L48 30 L60 12 L72 30 L84 18 L82 40 Z" fill="#f2c94c" stroke="#b07a1a" stroke-width="1.3"/><rect x="38" y="36" width="44" height="7" rx="2" fill="#e3b53a" stroke="#b07a1a" stroke-width="1.1"/><circle cx="60" cy="27" r="3" fill="#d9283f"/><circle cx="46" cy="33" r="2" fill="#3fb7f2"/><circle cx="74" cy="33" r="2" fill="#6ccf6b"/>',
    crystal: `<g filter="url(#gl${u})" opacity=".55">${[[46, 38, 12], [60, 36, 20], [74, 38, 12]].map(([x, y, h]) => `<path d="M${x - 5} ${y} L${x} ${y - h} L${x + 5} ${y}Z" fill="#7fe8ff"/>`).join('')}</g>` + [[46, 38, 12, '#8fe9ff'], [60, 36, 20, '#c3a6ff'], [74, 38, 12, '#8fe9ff'], [38, 40, 7, '#c3a6ff'], [82, 40, 7, '#c3a6ff']].map(([x, y, h, c]) => `<path d="M${x - 5} ${y} L${x} ${y - h} L${x + 5} ${y}Z" fill="${c}" stroke="${dk(c, .6)}" stroke-width="1"/><path d="M${x} ${y - h} L${x - 1.4} ${y}" stroke="#fff" stroke-width="1" opacity=".7"/>`).join('') + '<path d="M34 40 Q60 34 86 40" stroke="#b07a1a" stroke-width="3" fill="none"/>',
    halo: '<ellipse cx="60" cy="16" rx="22" ry="6" fill="none" stroke="#ffd24a" stroke-width="4"/><ellipse cx="60" cy="16" rx="22" ry="6" fill="none" stroke="#fff6c8" stroke-width="1.4"/>',
    cupcake: '<path d="M40 44 L44 30 H76 L80 44Z" fill="#f2c18a" stroke="#c98f4f" stroke-width="1.2"/><path d="M38 32 C36 20 48 18 50 22 C52 12 68 12 70 22 C74 16 86 22 82 32 Z" fill="#f7a8c8" stroke="#d27aa0" stroke-width="1.2"/><circle cx="60" cy="12" r="4.5" fill="#d9283f"/>' + [[48, 26, '#3fb7f2'], [66, 22, '#f0b93a'], [74, 28, '#6ccf6b']].map(([x, y, k]) => `<rect x="${x}" y="${y}" width="3.4" height="1.6" rx=".8" fill="${k}"/>`).join(''),
    leaves: [-60, -40, -20, 0, 20, 40, 60].map(a => `<ellipse cx="60" cy="16" rx="5" ry="9" fill="${a % 40 === 0 ? '#4fa266' : '#6cc07a'}" stroke="#2f6b3f" stroke-width=".8" transform="rotate(${a} 60 50)"/>`).join(''),
    explorer: '<ellipse cx="60" cy="40" rx="40" ry="8" fill="#b89a62" stroke="#7d6538" stroke-width="1.3"/><path d="M38 40 C38 20 82 20 82 40 Z" fill="#cdb27a" stroke="#7d6538" stroke-width="1.3"/><path d="M38 34 Q60 38 82 34 L82 39 Q60 43 38 39Z" fill="#6b5330"/>',
  }[id] || '');
}
function accessory(a, u) {
  return ({
    spoon: '<path d="M96 121 L86 92" stroke="#b07a45" stroke-width="4" stroke-linecap="round"/><ellipse cx="84" cy="86" rx="6" ry="8.5" fill="#c58c52" stroke="#8a5a2c" stroke-width="1.1" transform="rotate(-20 84 86)"/>',
    whisk: '<path d="M96 121 L90 100" stroke="#7a7a80" stroke-width="4" stroke-linecap="round"/><g fill="none" stroke="#b9bcc4" stroke-width="1.6"><ellipse cx="86" cy="86" rx="5" ry="13" transform="rotate(-20 86 86)"/><ellipse cx="86" cy="86" rx="2.4" ry="13" transform="rotate(-20 86 86)"/></g>',
    laserwhisk: `<path d="M96 121 L90 100" stroke="#3a3f4a" stroke-width="4.4" stroke-linecap="round"/><g fill="none" stroke="#ff4fd8" stroke-width="4" opacity=".4" filter="url(#gl${u})"><ellipse cx="86" cy="86" rx="5" ry="13" transform="rotate(-20 86 86)"/></g><g fill="none" stroke="#ff8ae6" stroke-width="1.6"><ellipse cx="86" cy="86" rx="5" ry="13" transform="rotate(-20 86 86)"/><ellipse cx="86" cy="86" rx="2.4" ry="13" transform="rotate(-20 86 86)"/></g>`,
    wand: `<path d="M98 121 L86 90" stroke="#3a2a4a" stroke-width="3.4" stroke-linecap="round"/><circle cx="85" cy="86" r="9" fill="#ffd66b" opacity=".3" filter="url(#gl${u})"/>${star4(85, 86, 6.5, '#ffd24a')}${star4(96, 78, 2.4, '#fff')}${star4(76, 76, 2, '#fff')}`,
    potion: `<circle cx="88" cy="106" r="11" fill="#5de39a" opacity=".3" filter="url(#gl${u})"/><path d="M85 88 h6 v6 Q100 100 98 110 Q96 118 88 118 Q80 118 78 110 Q76 100 85 94Z" fill="#e8f6ff" fill-opacity=".7" stroke="#7d8fa3" stroke-width="1.2"/><path d="M79 106 Q88 102 97 106 Q96 117 88 117 Q80 117 79 106Z" fill="#45d98a"/><rect x="84" y="85" width="8" height="4" rx="1" fill="#a06a3a"/><circle cx="85" cy="110" r="1.4" fill="#d9ffe8"/><circle cx="90" cy="107" r="1" fill="#d9ffe8"/>`,
    glasses: '<g fill="none" stroke="#3a2f2a" stroke-width="2"><circle cx="50" cy="56" r="7.4"/><circle cx="70" cy="56" r="7.4"/><path d="M57.4 56 Q60 53 62.6 56 M42.6 55 L35 52 M77.4 55 L85 52"/></g><path d="M45 52 l3 -2 M65 52 l3 -2" stroke="#fff" stroke-width="1.2" opacity=".7"/>',
    sunglasses: '<path d="M41 52 H58 Q58 62 49.5 62 Q41 62 41 52Z M62 52 H79 Q79 62 70.5 62 Q62 62 62 52Z" fill="#1f2430"/><path d="M58 53 H62 M41 52 L35 50 M79 52 L85 50" stroke="#1f2430" stroke-width="2"/><path d="M44 54 l4 4 M65 54 l4 4" stroke="#fff" stroke-width="1.3" opacity=".55"/>',
    visor: `<rect x="37" y="49" width="46" height="13" rx="6.5" fill="#21d4fd" opacity=".35" filter="url(#gl${u})"/><rect x="38" y="50" width="44" height="11" rx="5.5" fill="#21d4fd" fill-opacity=".38" stroke="#8ff0ff" stroke-width="1.3"/><path d="M42 53 H62" stroke="#fff" stroke-width="1.4" opacity=".75" stroke-linecap="round"/><path d="M38 55.5 L33 55 M82 55.5 L87 55" stroke="#6b7a8a" stroke-width="2.2"/>`,
    cybereye: `<circle cx="70" cy="56" r="8" fill="none" stroke="#7d8896" stroke-width="2.6"/><circle cx="70" cy="56" r="3" fill="#ff3b3b"/><circle cx="70" cy="56" r="6" fill="#ff3b3b" opacity=".35" filter="url(#gl${u})"/><path d="M78 56 H86 M76 62 L82 68 H86" stroke="#7d8896" stroke-width="1.4" fill="none"/>`,
    monocle: '<circle cx="70" cy="56" r="7.4" fill="rgba(255,255,255,.25)" stroke="#c8902a" stroke-width="2"/><path d="M76 60 Q84 74 78 90" stroke="#c8902a" stroke-width="1.2" fill="none"/>',
    goggles: '<rect x="38" y="30" width="44" height="6" rx="3" fill="#6b4a32"/><circle cx="50" cy="32" r="6.5" fill="#7fc8e8" stroke="#a5743f" stroke-width="2.4"/><circle cx="70" cy="32" r="6.5" fill="#7fc8e8" stroke="#a5743f" stroke-width="2.4"/><path d="M47 30 l3 -2 M67 30 l3 -2" stroke="#fff" stroke-width="1.2"/>',
    pencil: '<path d="M26 44 L40 64" stroke="#f0b93a" stroke-width="4" stroke-linecap="round"/><path d="M40 64 L42 68 L38 66Z" fill="#3a2f2a"/><path d="M26 44 L28 46" stroke="#e77aa8" stroke-width="4" stroke-linecap="round"/>',
    scarf: '<path d="M46 88 Q60 98 74 88 L70 96 L60 112 L50 96Z" fill="#2f6fd0" stroke="#1d4a91" stroke-width="1.2"/>',
  }[a] || '');
}
function pet(p) {
  const eye = (x, y, r = 1.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2b2220"/><circle cx="${x + .5}" cy="${y - .5}" r="${r * .35}" fill="#fff"/>`;
  const s = ({
    cat: '<path d="M106 116 Q118 104 110 96" stroke="#e8923f" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="96" cy="112" rx="13" ry="9" fill="#f0a04b" stroke="#b8702c" stroke-width="1.1"/><circle cx="96" cy="98" r="10" fill="#f0a04b" stroke="#b8702c" stroke-width="1.1"/><path d="M87 94 L88 84 L94 90Z M105 94 L104 84 L98 90Z" fill="#f0a04b" stroke="#b8702c" stroke-width="1"/><path d="M89 92 L89.5 87 L92 90Z M103 92 L102.5 87 L100 90Z" fill="#f7c7a0"/>' + eye(92, 98) + eye(100, 98) + '<path d="M95 101 h2 l-1 1.2Z" fill="#d9574c"/><path d="M84 101 h6 M84 104 h6 M102 101 h6 M102 104 h6" stroke="#b8702c" stroke-width=".7"/>',
    ufo: `<path d="M96 104 L84 121 H108Z" fill="#9ff6ff" opacity=".28"/><ellipse cx="96" cy="100" rx="16" ry="6" fill="#aab6c4" stroke="#5d6b7a" stroke-width="1.2"/><path d="M86 98 Q96 82 106 98Z" fill="#8fe9ff" fill-opacity=".75" stroke="#5d6b7a" stroke-width="1.1"/>` + eye(93, 93, 1.2) + eye(99, 93, 1.2) + [84, 90, 96, 102, 108].map((x, i) => `<circle cx="${x}" cy="101.5" r="1.3" fill="${['#ff5c5c', '#ffd34d', '#4fe08a'][i % 3]}"/>`).join(''),
    chick: '<circle cx="96" cy="106" r="12" fill="#ffd23f" stroke="#d9a200" stroke-width="1.1"/><path d="M84 106 Q80 100 86 102 M108 106 Q112 100 106 102" stroke="#f0b400" stroke-width="2" fill="none"/>' + eye(92, 102) + eye(100, 102) + '<path d="M94 106 L98 106 L96 109Z" fill="#f08a24"/><path d="M96 94 Q95 90 98 91" stroke="#f0b400" stroke-width="1.6" fill="none"/>',
    dog: '<ellipse cx="96" cy="112" rx="13" ry="9" fill="#d9b48a" stroke="#9c7650" stroke-width="1.1"/><circle cx="96" cy="98" r="10" fill="#e6c49b" stroke="#9c7650" stroke-width="1.1"/><ellipse cx="86" cy="98" rx="4" ry="8" fill="#8a5a35" transform="rotate(15 86 98)"/><ellipse cx="106" cy="98" rx="4" ry="8" fill="#8a5a35" transform="rotate(-15 106 98)"/>' + eye(92, 97) + eye(100, 97) + '<ellipse cx="96" cy="102" rx="2.6" ry="2" fill="#2b2220"/>',
    dragon: '<path d="M84 104 C74 92 72 86 78 84 C80 90 84 94 88 98Z M108 104 C118 92 120 86 114 84 C112 90 108 94 104 98Z" fill="#8a5cd6" stroke="#4f2f8a" stroke-width="1"/><ellipse cx="96" cy="111" rx="12" ry="9" fill="#5fc27a" stroke="#2f7a46" stroke-width="1.1"/><ellipse cx="96" cy="113" rx="6" ry="5.4" fill="#d9f2b0"/><circle cx="96" cy="97" r="10" fill="#5fc27a" stroke="#2f7a46" stroke-width="1.1"/><path d="M90 89 L88 82 L93 87Z M102 89 L104 82 L99 87Z" fill="#f2e6cf" stroke="#9c8a6a" stroke-width=".8"/>' + eye(92, 96) + eye(100, 96) + '<circle cx="94.4" cy="101.6" r=".8" fill="#2f7a46"/><circle cx="97.6" cy="101.6" r=".8" fill="#2f7a46"/>',
    robot: '<rect x="84" y="104" width="24" height="13" rx="4" fill="#c7d0db" stroke="#5d6b7a" stroke-width="1.1"/><rect x="86" y="88" width="20" height="16" rx="5" fill="#dde4ec" stroke="#5d6b7a" stroke-width="1.1"/><rect x="89" y="91" width="14" height="9" rx="3" fill="#1d2b3a"/><rect x="91" y="94" width="3" height="3" rx="1" fill="#4ff0ff"/><rect x="98" y="94" width="3" height="3" rx="1" fill="#4ff0ff"/><path d="M96 88 V82" stroke="#5d6b7a" stroke-width="1.4"/><circle cx="96" cy="81" r="2" fill="#ff5c5c"/><rect x="86" y="116" width="5" height="4" rx="1" fill="#5d6b7a"/><rect x="101" y="116" width="5" height="4" rx="1" fill="#5d6b7a"/>',
    hedgehog: '<path d="M80 116 L82 104 L86 108 L88 96 L92 104 L95 94 L98 103 L102 95 L104 104 L108 98 L108 108 L112 106 L110 116Z" fill="#6b4a32" stroke="#432c1c" stroke-width="1"/><ellipse cx="88" cy="110" rx="9" ry="7" fill="#e8cba4"/>' + eye(86, 108) + '<circle cx="80" cy="111" r="1.6" fill="#2b2220"/>',
    fox: '<ellipse cx="96" cy="112" rx="13" ry="9" fill="#e8742f" stroke="#a84f1a" stroke-width="1.1"/><path d="M86 100 C86 90 106 90 106 100 L96 108Z" fill="#e8742f" stroke="#a84f1a" stroke-width="1.1"/><path d="M87 94 L86 82 L94 90Z M105 94 L106 82 L98 90Z" fill="#e8742f" stroke="#a84f1a" stroke-width="1"/><path d="M90 101 L96 108 L102 101 Q96 104 90 101Z" fill="#fff"/>' + eye(91, 97) + eye(101, 97) + '<circle cx="96" cy="107" r="1.4" fill="#2b2220"/>',
    unicorn: '<path d="M106 106 C114 100 116 92 110 88" stroke="#ff9ad5" stroke-width="3" fill="none"/><path d="M107 108 C116 104 118 96 113 92" stroke="#9ad6ff" stroke-width="2.4" fill="none"/><ellipse cx="96" cy="112" rx="13" ry="8.5" fill="#fff" stroke="#c9c2d6" stroke-width="1.1"/><circle cx="94" cy="98" r="9.5" fill="#fff" stroke="#c9c2d6" stroke-width="1.1"/><path d="M92 89 L95 76 L98 89Z" fill="#ffd24a" stroke="#c8902a" stroke-width=".9"/><path d="M98 90 C104 90 106 96 104 102" stroke="#c3a6ff" stroke-width="3" fill="none"/>' + eye(91, 98) + '<ellipse cx="88" cy="102" rx="2" ry="1.4" fill="#ffc6dd"/>',
    phoenix: `<path d="M84 112 C76 118 70 112 74 106 C76 112 80 110 84 106Z M108 112 C116 118 122 112 118 106 C116 112 112 110 108 106Z" fill="#ffb02e"/><path d="M96 121 C88 120 84 114 88 108 C90 114 94 112 96 108 C98 112 102 114 104 108 C108 114 104 120 96 121Z" fill="#ff7a2e"/><circle cx="96" cy="106" r="10" fill="#ff5a3c" stroke="#b8321c" stroke-width="1.1"/><path d="M92 97 Q94 88 98 92 Q100 86 102 96" fill="#ffd24a"/>` + eye(93, 104) + eye(99, 104) + '<path d="M95 108 L97 108 L96 111Z" fill="#ffd24a"/>',
    turtle: '<ellipse cx="96" cy="112" rx="15" ry="5" fill="#8fbf6a"/><path d="M82 112 C82 96 110 96 110 112Z" fill="#4f9a3d" stroke="#2f6b25" stroke-width="1.1"/><path d="M90 104 l6 -4 l6 4 l-2 6 h-8Z" fill="none" stroke="#3a7a2d" stroke-width="1.2"/><circle cx="114" cy="108" r="5" fill="#8fbf6a" stroke="#4f8a3a" stroke-width="1"/>' + eye(115, 107),
    rabbit: '<ellipse cx="96" cy="112" rx="12" ry="9" fill="#f1ede6" stroke="#c9c2b6" stroke-width="1.1"/><circle cx="96" cy="100" r="9" fill="#f7f4ef" stroke="#c9c2b6" stroke-width="1.1"/><ellipse cx="91" cy="86" rx="3.4" ry="10" fill="#f7f4ef" stroke="#c9c2b6" stroke-width="1"/><ellipse cx="101" cy="86" rx="3.4" ry="10" fill="#f7f4ef" stroke="#c9c2b6" stroke-width="1"/><ellipse cx="91" cy="86" rx="1.6" ry="7" fill="#f6c6d2"/><ellipse cx="101" cy="86" rx="1.6" ry="7" fill="#f6c6d2"/>' + eye(92, 99) + eye(100, 99) + '<path d="M95 103 h2 l-1 1Z" fill="#e77aa8"/>',
    ghost: '<path d="M84 120 V102 C84 88 108 88 108 102 V120 L104 116 L100 120 L96 116 L92 120 L88 116Z" fill="#fbfbff" fill-opacity=".92" stroke="#c9cde0" stroke-width="1.1"/>' + eye(92, 102, 1.8) + eye(100, 102, 1.8) + '<ellipse cx="96" cy="108" rx="2" ry="2.4" fill="#2b2220"/><ellipse cx="89" cy="106" rx="2" ry="1.2" fill="#ffc6dd"/><ellipse cx="103" cy="106" rx="2" ry="1.2" fill="#ffc6dd"/>',
  })[p];
  return s ? `<g transform="translate(91 100) scale(1.05) translate(-96 -104)">${s}</g>` : '';
}
// tête selon le type (humain, elfe, félin, robot, extraterrestre, dragon)
function head(kind, sk, s, u) {
  const o = `stroke="${dk(s, .62)}" stroke-width="1.3"`;
  const ears = { human: `<circle cx="33" cy="57" r="5.5" fill="${sk}" ${o}/><circle cx="87" cy="57" r="5.5" fill="${sk}" ${o}/><circle cx="33" cy="57" r="2.4" fill="${dk(s, .85)}"/><circle cx="87" cy="57" r="2.4" fill="${dk(s, .85)}"/>`,
    elf: `<path d="M36 53 L18 40 L34 63Z" fill="${sk}" ${o} stroke-linejoin="round"/><path d="M84 53 L102 40 L86 63Z" fill="${sk}" ${o} stroke-linejoin="round"/><path d="M33 54 L23 45" stroke="${dk(s, .82)}" stroke-width="1.6"/><path d="M87 54 L97 45" stroke="${dk(s, .82)}" stroke-width="1.6"/>`,
    dragon: `<path d="M35 52 L20 46 L26 54 L18 58 L34 63Z" fill="${dk(s, .9)}" ${o} stroke-linejoin="round"/><path d="M85 52 L100 46 L94 54 L102 58 L86 63Z" fill="${dk(s, .9)}" ${o} stroke-linejoin="round"/>`,
    robot: `<rect x="27" y="50" width="8" height="14" rx="3" fill="#8e99a8" stroke="#4f5a68" stroke-width="1.2"/><rect x="85" y="50" width="8" height="14" rx="3" fill="#8e99a8" stroke="#4f5a68" stroke-width="1.2"/><circle cx="31" cy="57" r="1.6" fill="#4ff0ff"/><circle cx="89" cy="57" r="1.6" fill="#4ff0ff"/>` };
  const face = kind === 'robot' ? `<rect x="33" y="27" width="54" height="55" rx="17" fill="${sk}" stroke="${dk(s, .55)}" stroke-width="1.4"/><path d="M38 40 H82" stroke="${dk(s, .8)}" stroke-width="1" opacity=".6"/><circle cx="40" cy="74" r="1.3" fill="${dk(s, .6)}"/><circle cx="80" cy="74" r="1.3" fill="${dk(s, .6)}"/>`
    : kind === 'alien' ? `<path d="M60 26 C80 26 89 40 87 58 C85 74 74 82 60 82 C46 82 35 74 33 58 C31 40 40 26 60 26Z" fill="${sk}" ${o}/>`
      : `<ellipse cx="60" cy="54" rx="27" ry="27.5" fill="${sk}" ${o}/>`;
  return (ears[kind] || (kind === 'cat' || kind === 'alien' ? '' : ears.human)) + face;
}
function headTop(kind, s) {
  // éléments au-dessus des cheveux : oreilles de félin, antennes, cornes de dragon, antenne de robot
  const o = `stroke="${dk(s, .62)}" stroke-width="1.3" stroke-linejoin="round"`;
  return ({
    cat: `<path d="M36 40 L36 18 L54 30Z" fill="${s}" ${o}/><path d="M84 40 L84 18 L66 30Z" fill="${s}" ${o}/><path d="M39 34 L39 24 L48 30Z M81 34 L81 24 L72 30Z" fill="#ffb3c6"/>`,
    alien: `<path d="M50 28 Q44 16 40 10 M70 28 Q76 16 80 10" stroke="${dk(s, .7)}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="40" cy="10" r="3.6" fill="#ffd24a" stroke="#c8902a" stroke-width="1"/><circle cx="80" cy="10" r="3.6" fill="#ffd24a" stroke="#c8902a" stroke-width="1"/>`,
    dragon: '<path d="M44 32 C38 24 38 14 44 8 C44 16 48 24 52 28Z" fill="#f2e6cf" stroke="#9c8a6a" stroke-width="1.2"/><path d="M76 32 C82 24 82 14 76 8 C76 16 72 24 68 28Z" fill="#f2e6cf" stroke="#9c8a6a" stroke-width="1.2"/>',
    robot: '<path d="M60 27 V16" stroke="#4f5a68" stroke-width="2"/><circle cx="60" cy="14" r="3.6" fill="#ff5c5c" stroke="#a83232" stroke-width="1"/>',
  }[kind] || '');
}
// rendu complet ; mini = pour le petit bouton (sans compagnon)
export function avatarSVG(a, { mini = false, title = '' } = {}) {
  const o = safeAvatar(a), u = 'a' + (++N).toString(36), s = SKINS[o.skin][0], hc = HAIRC[o.hairC][0], cc = CLOTHC[o.clothC][0], ic = EYEC[o.eyeC][0];
  const metal = o.kind === 'robot';
  const defs = `<defs><radialGradient id="sk${u}" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="${lt(s, metal ? .5 : .2)}"/><stop offset=".6" stop-color="${s}"/><stop offset="1" stop-color="${dk(s, metal ? .78 : .9)}"/></radialGradient>
    <linearGradient id="hr${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt(hc, .16)}"/><stop offset="1" stop-color="${dk(hc, .84)}"/></linearGradient>
    <linearGradient id="cl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lt(cc, .14)}"/><stop offset="1" stop-color="${dk(cc, .84)}"/></linearGradient>
    <radialGradient id="bl${u}"><stop offset="0" stop-color="#ff6f86" stop-opacity=".45"/><stop offset="1" stop-color="#ff6f86" stop-opacity="0"/></radialGradient>
    <radialGradient id="vg${u}" cx=".5" cy=".42" r=".72"><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></radialGradient>
    <filter id="gl${u}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2"/></filter></defs>`;
  const hatOn = !['none', 'halo', 'leaves', 'flowers', 'neon', 'horns', 'helmet'].includes(o.hat);
  // sous un chapeau, les cheveux hauts (crête, épis, chignon, boucles) sont rangés en coupe courte
  const hf = hatOn && ['crete', 'epi', 'chignon', 'boucles'].includes(o.hair) ? 'court' : o.hair;
  const hO = `stroke="${dk(hc, .62)}" stroke-width="1.2" stroke-linejoin="round"`, hF = `url(#hr${u})`, sk = `url(#sk${u})`;
  const faceAcc = ['glasses', 'sunglasses', 'monocle', 'pencil', 'goggles', 'visor', 'cybereye'], handAcc = ['spoon', 'whisk', 'scarf', 'wand', 'laserwhisk', 'potion'];
  const parts = [
    defs, background(o.bg, u), `<rect width="120" height="120" fill="url(#vg${u})"/>`,
    back(o.back, u),
    hatOn && o.hair === 'chignon' ? '' : hairBack(o.hair, hF, hO),
    body(o.outfit, cc, u),
    `<path d="M51 74 H69 V92 Q60 97 51 92Z" fill="${dk(s, .86)}" stroke="${dk(s, .62)}" stroke-width="1.2"/>`,
    head(o.kind, sk, s, u),
    metal ? `<rect x="40" y="61" width="7" height="3.4" rx="1.7" fill="#4ff0ff" opacity=".5"/><rect x="73" y="61" width="7" height="3.4" rx="1.7" fill="#4ff0ff" opacity=".5"/>`
      : `<ellipse cx="43" cy="64" rx="6" ry="4" fill="url(#bl${u})"/><ellipse cx="77" cy="64" rx="6" ry="4" fill="url(#bl${u})"/>`,
    o.kind === 'dragon' ? `<path d="M42 46 q3 -3 6 0 M72 46 q3 -3 6 0 M38 66 q2 -2 4 0" stroke="${dk(s, .7)}" stroke-width="1.2" fill="none"/>` : '',
    o.kind === 'cat' ? `<path d="M36 64 H44 M36 67.4 L44 66 M76 64 H84 M76 66 L84 67.4" stroke="${dk(s, .55)}" stroke-width=".9"/>` : '',
    metal ? '' : `<path d="M58.4 61 Q60 62.8 61.6 61" stroke="${dk(s, .7)}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
    eyes(o.eyes, ic, hc, u), beard(o.beard, hF, hO), mouth(o.mouth),
    hairFront(hf, hF, hO, lt(hc, .45)), headTop(o.kind, s),
    faceAcc.includes(o.acc) ? accessory(o.acc, u) : '',
    hat(o.hat, u),
    handAcc.includes(o.acc) ? accessory(o.acc, u) : '',
    mini ? '' : pet(o.pet),
  ];
  return `<svg viewBox="0 0 120 120" class="av-svg" role="img" aria-label="${title || 'Mon personnage'}">${parts.join('')}</svg>`;
}
// le personnage actuel avec un seul élément changé (vignettes de l'éditeur, récompenses)
export function previewWith(a, slot, val, opts) { return avatarSVG({ ...safeAvatar(a), [slot]: val }, opts); }
export function randomAvatar(st, badges) {
  const pick = slot => { const ok = PARTS[slot].filter(x => unlocked(slot, x[0], st, badges)).map(x => x[0]); return ok[Math.floor(Math.random() * ok.length)]; };
  const r = n => Math.floor(Math.random() * n);
  const kind = pick('kind'), fantasy = kind !== 'human' && kind !== 'elf';
  return { kind, skin: fantasy && Math.random() < .6 ? 6 + r(6) : r(6), hairC: r(HAIRC.length), eyeC: r(EYEC.length), clothC: r(CLOTHC.length),
    hair: pick('hair'), eyes: pick('eyes'), mouth: pick('mouth'), beard: Math.random() < .7 ? 'none' : pick('beard'), hat: pick('hat'), outfit: pick('outfit'),
    back: Math.random() < .5 ? 'none' : pick('back'), acc: Math.random() < .4 ? 'none' : pick('acc'), bg: pick('bg'), pet: pick('pet') };
}
