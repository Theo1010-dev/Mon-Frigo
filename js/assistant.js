// Assistant « Mon Frigo » : on lui écrit comme à quelqu'un, il répond avec ton stock, tes recettes, ta semaine et tes habitudes.
// Tout est calculé sur le téléphone (aucune donnée n'est envoyée nulle part). La compréhension du texte est dans brain.js.
import { h, chip, clear, haptic, openSheet, plate } from './ui.js';
import { icon } from './icons.js';
import { S, set, ctx, setPref } from './state.js';
import * as A from './actions.js';
import { score, allowed, search, inMoment, seasonal, missingEquip } from './recipes.js';
import { clearFridge, myDishes, slotName } from './plan.js';
import { expiringSoon, status, statusText, zoneLabel } from './stock.js';
import { fmtQty } from './units.js';
import { todayISO, addDays, fmtDateLong, norm, plural } from './util.js';
import { nav, resetRUI, RUI } from './nav.js';
import { learnedSummary, forgetAll } from './habits.js';
import { stats as rpgStats, XP } from './rpg.js';
import { seasonalItems } from './season.js';
import { intent, findIngs, findWhen, findWish, leftover, shopItems, flat, dishWords, isFollowUp, findPeople, findDiet, prefWords, chatNorm, fixTypos, makeVocab, splitRequests, BRAIN_WORDS } from './brain.js';
import { know, KNOW_WORDS } from './know.js';
import { openEquipment, withArticle } from './equipment.js';
import { openPantry } from './pantry.js';
import { mascotEl } from './mascot.js';
import { openGuide } from './guide.js';
import { openQuickMeal } from './plan-sheets.js';
import { openRecipe } from './recipe-sheets.js';
import { openQuickAdd } from './stock-sheets.js';

const kb = S.kb;
const LOG = []; // conversation de la session (rien n'est enregistré)
let CTX = { kind: null, text: '', offset: 0, last: null }; // dernière demande (idées, stock…), pour comprendre « plus rapide », « d'autres », « et du beurre ? »
const STARTERS = ['On mange quoi ce soir ?', 'Qu’est-ce qui va périmer ?', 'Un dessert rapide', 'Combien de temps cuire le riz ?', 'Qu’as-tu appris sur moi ?', 'Comment ça marche ?'];
const BOT = 'Frigo';
const later = fn => () => { closeChat(); setTimeout(fn, 260); };
let sheet = null, feed = null;
const closeChat = () => sheet && sheet.close();

// ---------- briques de réponse ----------
const P = (...k) => h('p', null, ...k);
const B = t => h('strong', null, t);
const list = items => h('ul', { class: 'bot-list' }, items.map(x => h('li', null, ...[].concat(x))));
const actions = (...bs) => h('div', { class: 'bot-acts' }, bs.filter(Boolean));
const act = (label, fn, ic, cls = 'chip') => h('button', { type: 'button', class: cls + ' bot-act', onclick: fn }, ic ? icon(ic, 16) : null, label);
function recCard(r, why) {
  return h('button', { type: 'button', class: 'bot-rec', onclick: later(() => openRecipe(r.id)) }, plate(r, kb, 'xs'),
    h('span', { class: 'grow' }, h('span', { class: 'strong block clamp2' }, r.t), h('span', { class: 'muted sm block' }, why)), icon('right', 18));
}
// articles : « le poulet », « la crème », « l’huile », « les œufs » ; « du poulet », « de la crème », « des œufs »
const VOW = /^[aeiouyhéèêàâîôûœ]/i;
function art(id, name, partitive = false) {
  const k = id && kb.get(id), n = (name || (k ? k.n : '')).toLowerCase(), g = k ? k.g : 'm';
  if (g.endsWith('p')) return (partitive ? 'des ' : 'les ') + n;
  if (VOW.test(n) && !(k && k.hasp)) return (partitive ? 'de l’' : 'l’') + n;
  return (g === 'f' ? (partitive ? 'de la ' : 'la ') : (partitive ? 'du ' : 'le ')) + n;
}
const zoneTxt = z => z === 'autre' ? 'hors du frigo' : zoneLabel(z).toLowerCase();
const covWhy = (r, sc) => { const m = r.custom ? [] : missingEquip(r, S.data.prefs); return `${r.m} min · ${m.length ? `il faut ${withArticle(m)}` : sc.cov.total && sc.cov.all ? 'tu as tout' : sc.cov.missing.length ? `il manque ${sc.cov.missing.length}` : 'à vérifier'}${sc.cov.expiringUsed.length && !m.length ? ' · anti-gaspi' : ''}`; };

// ---------- idées de recettes ----------
function ideas(text, offset = 0) {
  const w = findWish(text), { found, excl } = findIngs(text, kb), c = ctx(), p = S.data.prefs;
  const need = found.filter(id => !['sel', 'poivre', 'sucre', 'huile-olive', 'eau'].includes(id) || flat(text).includes(' du ' + norm(kb.name(id))));
  const hasIng = (r, id) => r.i.some(([x]) => x === id || kb.subsOf(id).includes(x));
  const meal = /\b(soir|midi|diner|dejeuner|repas|plat)\b/.test(norm(text)), moment = w.moment || (need.length ? null : !meal && new Date().getHours() < 10 ? 'matin' : 'plat');
  CTX = { kind: 'ideas', text, offset };
  // un appareil demandé (« au air fryer ») : ses recettes, même si tu ne l'as pas encore coché (elles le disent)
  let L = S.cat.list.filter(r => (r.custom || allowed(r, p, kb, !!w.equip)) && (!moment || (w.equip && !w.moment) || inMoment(r, moment)));
  if (w.equip) L = L.filter(r => (r.e || []).includes(w.equip));
  if (w.maxTime) L = L.filter(r => r.m <= w.maxTime);
  if (w.veg) L = L.filter(r => r.veg);
  if (w.nocook) L = L.filter(r => !(r.e || []).some(e => e === 'four' || e === 'plaques' || e === 'micro-ondes'));
  if (w.cheap) L = L.filter(r => r.costKnown && r.costPer <= 1.5);
  if (w.light) L = L.filter(r => (r.g || []).some(g => ['léger', 'équilibré', 'salade', 'soupe'].includes(g)) || ['Salades', 'Soupes', 'Poisson'].includes(r.c));
  if (need.length) L = L.filter(r => need.every(id => hasIng(r, id)));
  if (excl.length) L = L.filter(r => !excl.some(id => hasIng(r, id)));
  let sc = L.map(r => ({ r, sc: score(r, p.people || 2, c) }));
  if (w.have) sc = sc.filter(x => x.sc.cov.total && x.sc.cov.all);
  sc.sort((a, b) => b.sc.score - a.sc.score);
  if (w.random) sc = sc.slice(0, 30).sort(() => Math.random() - 0.5);
  const page = sc.slice(offset, offset + 4);
  const bits = [moment === 'dessert' ? 'de dessert' : moment === 'apero' ? 'pour l’apéro' : moment === 'entree' ? 'd’entrée' : moment === 'matin' ? 'pour le petit-déj ou le goûter' : null,
    w.equip ? 'avec ' + withArticle([w.equip]) : null, w.maxTime ? `en ${w.maxTime} min max` : null, w.veg ? 'végé' : null, w.cheap ? 'pas chères' : null, w.light ? 'légères' : null, w.nocook ? 'sans cuisson' : null,
    need.length ? 'avec ' + need.map(id => art(id, null, true)).join(' et ') : null, excl.length ? 'sans ' + excl.map(id => kb.name(id).toLowerCase()).join(' ni ') : null, w.have ? 'avec ce que tu as' : null].filter(Boolean);
  if (!page.length) return [P(offset ? 'Je n’ai pas d’autres idées avec ces critères.' : `Je n’ai rien trouvé${bits.length ? ' ' + bits.join(', ') : ''}. Essaie avec moins de critères.`), actions(act('Voir toutes les recettes', later(() => nav.go('recipes')), 'utensils'))];
  return [P(offset ? 'D’autres idées :' : `Voici ${plural(page.length, 'une idée', 'quelques idées')}${bits.length ? ' ' + bits.join(', ') : ''} :`), h('div', { class: 'bot-recs' }, page.map(x => recCard(x.r, covWhy(x.r, x.sc)))),
    actions(sc.length > offset + 4 ? act('D’autres idées', () => { push('me', [P('D’autres idées')]); reply(ideas(text, offset + 4)); }, 'dice') : null,
      // un appareil demandé : toutes ses recettes dans l'onglet Recettes (filtre « Appareil »)
      w.equip && sc.length > 4 ? act(`Voir les ${sc.length} recettes`, later(() => { resetRUI(); RUI.equip.add(w.equip); nav.go('recipes'); }), 'utensils') : act('Planifier un repas', later(() => nav.go('plan')), 'calendar'))];
}

function byName(q) {
  const res = search(S.cat, q).filter(r => r.custom || allowed(r, S.data.prefs, kb, true)).slice(0, 4);
  const lock = r => { const m = r.custom ? [] : missingEquip(r, S.data.prefs); return m.length ? ` · il faut ${withArticle(m)}` : ''; };
  return res.length ? [P('Voici ce que j’ai trouvé :'), h('div', { class: 'bot-recs' }, res.map(r => recCard(r, `${r.m} min · ${r.c.toLowerCase()}${lock(r)}`))), actions(act('Voir dans les recettes', later(() => { resetRUI(q); nav.go('recipes'); }), 'utensils'))] : null;
}

// remplacements de cuisine courants (en plus des familles de la base : fromages, volailles…)
const SWAPS = {
  creme: [['lait-coco', 'yaourt', 'fromage-frais', 'mascarpone', 'lait'], 'Pour une sauce, du lait + 1 cuillère de maïzena épaissit très bien ; en dessert, le mascarpone ou le yaourt grec font l’affaire.'],
  beurre: [['huile-olive'], 'En cuisson salée, l’huile d’olive remplace le beurre. En pâtisserie, compte 80 g d’huile pour 100 g de beurre.'],
  lait: [['lait-vegetal', 'creme'], 'Une crème allongée d’eau (moitié-moitié) dépanne aussi.'],
  oeufs: [['banane', 'compote', 'yaourt'], 'En gâteau : ½ banane écrasée ou 60 g de compote par œuf. Pour lier une farce, un peu de chapelure mouillée.'],
  'vin-blanc': [['bouillon', 'citron'], 'Du bouillon avec un trait de citron ou de vinaigre remplace le vin blanc dans une sauce.'],
  'vin-rouge': [['bouillon'], 'Du bouillon de bœuf avec une cuillère de vinaigre et un peu de concentré de tomate.'],
  sucre: [['miel'], 'Le miel sucre plus : compte environ 2/3 de la quantité de sucre.'],
  farine: [['maizena', 'flocons-avoine'], 'Pour épaissir une sauce, 1 cuillère de maïzena vaut 2 cuillères de farine.'],
  maizena: [['farine'], 'Deux fois plus de farine que de maïzena, à cuire un peu plus longtemps.'],
  chapelure: [['biscuits', 'flocons-avoine', 'pain'], 'Du pain sec mixé ou des biscottes écrasées font une très bonne chapelure.'],
  parmesan: [['fromage-rape', 'emmental'], null],
  citron: [['citron-vert', 'vinaigre'], 'Pour une vinaigrette ou un poisson, un trait de vinaigre dépanne.'],
  'pate-brisee': [['pate-feuilletee', 'pate-sablee'], null],
  levure: [[], 'Sans levure, monte les blancs en neige et incorpore-les à la fin : le gâteau sera plus léger.'],
  mascarpone: [['fromage-frais', 'ricotta', 'creme'], null],
  'tomate-concassee': [['tomate'], 'Des tomates fraîches pelées et coupées, avec 10 min de cuisson en plus.'],
  bouillon: [[], 'Un fond d’eau avec un peu de sauce soja, des herbes et une noix de beurre fait un bouillon express.'],
  mayonnaise: [['yaourt', 'fromage-frais'], 'Un yaourt avec un peu de moutarde fait une sauce plus légère.'],
};

// ---------- réponses ----------
const R = {
  hello() {
    const hgt = new Date().getHours(), name = S.data.prefs.name, t = todayISO(), d = S.data;
    const soon = expiringSoon(d.stock, t, 2), slot = hgt < 15 ? 'lunch' : 'dinner', e = d.plan[t] && d.plan[t][slot], r = e && e.rid && S.cat.get(e.rid), left = d.shop.filter(x => !x.done).length;
    const lines = [];
    if (soon.length) lines.push(['⏰ À finir vite : ', B(soon.slice(0, 3).map(x => x.name.toLowerCase()).join(', ')), soon.length > 3 ? ` et ${soon.length - 3} autres` : '']);
    lines.push([hgt < 15 ? '🍽️ Ce midi : ' : '🍽️ Ce soir : ', e ? B(r ? r.t : e.note) : 'rien de prévu pour l’instant']);
    if (left) lines.push([`🛒 ${left} ${plural(left, 'article', 'articles')} sur ta liste de courses`]);
    // un appareil « à part » que tu as coché (Cookeo, air fryer, barbecue…) : une idée rien que pour lui
    const special = (d.prefs.equip || []).find(k => APPL_IDEA[k]);
    const chips = [soon.length ? `Que faire avec ${art(soon[0].ing, soon[0].name)} ?` : null, !e ? (hgt < 15 ? 'On mange quoi ce midi ?' : 'On mange quoi ce soir ?') : null, special ? APPL_IDEA[special] : null, 'Un dessert rapide', 'Combien de temps cuire le riz ?', 'Qu’as-tu appris sur moi ?', 'Comment ça marche ?'].filter(Boolean).slice(0, 6);
    return [P(`${hgt < 18 ? 'Salut' : 'Bonsoir'}${name ? ' ' + name : ''} 👋 Moi c’est ${BOT}, ton assistant. Je connais ton stock, tes recettes, ta semaine, tes courses et plein d’astuces de cuisine : écris-moi comme à quelqu’un.`), list(lines), starters(chips)];
  },
  thanks: () => [P('Avec plaisir 😊')],
  help() {
    return [P('Écris-moi comme tu parles (même avec des fautes ou en abrégé). Par exemple :'), list(['🍽️ « On mange quoi ce soir ? », « une idée rapide avec du poulet », « un dessert sans four »', '🧊 « Qu’est-ce qui va périmer ? », « il me reste des œufs ? », « j’ai fini le beurre »', '🛒 « Ajoute du lait aux courses et mets des lasagnes demain soir »', '👩‍🍳 « Combien de temps cuire le riz ? », « œuf mollet ? », « ma sauce est trop salée »', '📏 « 180 °C c’est quel thermostat ? », « 2 cuillères à soupe de farine en grammes »', '🥫 « Combien de temps se garde le poulet ? », « par quoi remplacer la crème ? »', '📱 « Où je règle mon équipement ? », « comment partager ma liste ? »', '🧠 « Je n’aime pas les champignons », « on est 3 », « qu’as-tu appris sur moi ? »']),
      actions(act('Lire le guide de l’app', later(openGuide), 'info'))];
  },
  learned: () => learnedView(),
  level() {
    const r = rpgStats();
    return [P('Tu es ', B(`niveau ${r.level}`), ` (${r.title.name}), avec ${r.xp - r.base} XP sur ${r.next - r.base} pour passer au suivant.`), P('Le plus rentable : cuisiner une recette (+' + XP.cook + ' XP), surtout une nouvelle (+' + XP.newRecipe + ' de bonus), et utiliser un produit qui allait périmer (+' + XP.saved + ').'),
      actions(act('Voir mon profil', later(() => nav.go('me')), 'user'))];
  },
  expiring() {
    const t = todayISO(), st = S.data.stock, exp = st.filter(x => status(x, t).key === 'expired'), soon = expiringSoon(st, t, 3);
    if (!st.length) return [P('Ton stock est vide : ajoute tes produits et je te dirai ce qui presse.'), actions(act('Ajout rapide', later(openQuickAdd), 'wand'))];
    if (!soon.length && !exp.length) return [P('Rien ne presse 👌 Aucun produit ne périme dans les 3 prochains jours.')];
    const out = [];
    if (soon.length) out.push(P(`${plural(soon.length, 'Ce produit est', 'Ces produits sont')} à consommer vite :`), list(soon.slice(0, 8).map(x => [B(x.name), ' — ', statusText(x, t).toLowerCase()])));
    if (exp.length) out.push(P(`${plural(exp.length, 'Un produit est', exp.length + ' produits sont')} déjà ${plural(exp.length, 'périmé', 'périmés')} : ${exp.slice(0, 5).map(x => x.name.toLowerCase()).join(', ')}.`));
    const res = clearFridge(S.cat, ctx(), 3);
    if (res.chosen.length) out.push(P('Pour les utiliser :'), h('div', { class: 'bot-recs' }, res.chosen.map(({ r, uses }) => recCard(r, uses.length ? 'utilise ' + uses.join(', ').toLowerCase() : `${r.m} min`))));
    out.push(actions(act('Voir mon stock', later(() => nav.go('stock')), 'fridge')));
    return out;
  },
  keep(text) {
    const { found } = findIngs(text, kb); const k = found.length && kb.get(found[0]);
    if (!k) return [P('Dis-moi de quel produit tu parles, par exemple « combien de temps se garde le poulet ? ».')];
    const fr = k.life > 0 ? k.life : null, zone = k.zone;
    const lines = [];
    const noFreeze = ['salade', 'concombre', 'tomate', 'tomate-cerise', 'avocat', 'banane', 'yaourt', 'mayonnaise', 'oeufs', 'radis', 'melon', 'fraises'].includes(k.id);
    if (zone === 'placard') lines.push(['Ça se range au ', B('placard'), ' et ça se garde longtemps : fie-toi à la date de l’emballage, et referme bien après ouverture.']);
    else if (fr) lines.push(['Au ', B('frigo'), ', compte environ ', B(fr + ' jour' + (fr > 1 ? 's' : '')), ' après l’achat (moins une fois ouvert).']);
    if (zone !== 'placard' && !noFreeze) lines.push(['Au ', B('congélateur'), ', environ 3 mois.']);
    if (noFreeze) lines.push(['Ça ne supporte pas bien la congélation.']);
    return [P(`${k.emoji} ${k.n}`), ...lines.map(l => P(...l)), P(h('span', { class: 'muted sm' }, 'Ce sont des durées indicatives : fie-toi à l’odeur, à l’aspect et à la date de l’emballage.'))];
  },
  substitute(text) {
    const { found } = findIngs(text, kb); const k = found.length && kb.get(found[0]);
    if (!k) return [P('Dis-moi quel produit tu veux remplacer, par exemple « par quoi remplacer la crème ? ».')];
    const tip = SWAPS[k.id], ids = [...new Set([...(tip ? tip[0] : []), ...kb.subsOf(k.id)])], subs = ids.map(id => kb.get(id)).filter(Boolean), have = new Set(S.data.stock.map(x => x.ing).concat([...kb.pantry]));
    if (!subs.length && !tip) return [P(`Je n’ai pas de remplaçant sûr pour ${k.n.toLowerCase()}. Les recettes te le signalent quand un produit de la même famille fait l’affaire.`)];
    return [P('À la place de ', B(k.n.toLowerCase()), ', tu peux prendre :'), subs.length ? list(subs.map(s => [s.emoji + ' ' + s.n, have.has(s.id) ? h('span', { class: 'tag ok sm-tag' }, 'tu en as') : null])) : null, tip && tip[1] ? P('💡 ', tip[1]) : null].filter(Boolean);
  },
  stats() {
    const r = rpgStats(), mo = todayISO().slice(0, 7), waste = S.data.waste.filter(w => w.date.slice(0, 7) === mo).length;
    return [list([`🍳 ${r.cooked} ${plural(r.cooked, 'repas cuisiné', 'repas cuisinés')} (${r.recipes} ${plural(r.recipes, 'recette différente', 'recettes différentes')})`, `♻️ ${r.saved} ${plural(r.saved, 'produit sauvé', 'produits sauvés')} de la poubelle`, `🗑️ ${waste} ${plural(waste, 'produit jeté', 'produits jetés')} ce mois-ci`, `🔥 ${r.current} ${plural(r.current, 'jour actif', 'jours actifs')} d’affilée`]),
      waste ? null : P('Zéro gaspillage ce mois-ci, bravo 🌿')].filter(Boolean);
  },
  stock(text) {
    const t = todayISO(), st = S.data.stock, { found } = findIngs(text, kb);
    if (!found.length) {
      const words = flat(text).trim().split(' ').filter(w => w.length >= 4 && !['reste', 'encore', 'stock', 'frigo', 'placard', 'congelateur', 'est', 'que'].includes(w));
      const byName = st.filter(x => words.some(w => norm(x.name).includes(w)));
      if (byName.length) return [list(byName.slice(0, 6).map(x => [B(x.name), ` : ${fmtQty(x.qty, x.unit)}, ${zoneTxt(x.zone)}${x.expiry ? ', ' + statusText(x, t).toLowerCase() : ''}`]))];
      if (!st.length) return [P('Ton stock est vide pour l’instant.'), actions(act('Ajout rapide', later(openQuickAdd), 'wand'))];
      const zones = ['frigo', 'congelateur', 'placard'].map(z => [z, st.filter(x => x.zone === z).length]).filter(x => x[1]);
      return [P('Tu as ', B(st.length + ' ' + plural(st.length, 'produit', 'produits')), ` : ${zones.map(([z, n]) => `${n} au ${zoneLabel(z).toLowerCase()}`).join(', ')}.`), actions(act('Ouvrir « Ma cuisine »', later(() => { setPref({ stockView: 'kitchen' }); nav.go('stock'); }), 'fridge'))];
    }
    const out = [];
    for (const id of found.slice(0, 4)) {
      const k = kb.get(id), lots = st.filter(x => x.ing === id), subs = st.filter(x => x.ing && kb.subsOf(id).includes(x.ing));
      if (lots.length) out.push(P('✅ ', B(k.n), ' : ', lots.map(x => `${fmtQty(x.qty, x.unit)} (${zoneTxt(x.zone)}${x.expiry ? ', ' + statusText(x, t).toLowerCase() : ''})`).join(' ; ')));
      else if (kb.isPantry(id)) out.push(P('✅ ', B(k.n), ' : c’est dans tes produits « toujours chez moi ».'));
      else out.push(P('❌ ', B(k.n), ' : tu n’en as pas', subs.length ? `, mais tu as ${subs.map(x => x.name.toLowerCase()).join(', ')} qui peut le remplacer.` : '.'),
        actions(act(`Ajouter ${k.n.toLowerCase()} aux courses`, () => { const it = A.addShop({ name: k.n, ing: id }); haptic(10); reply([P(it.result === 'exists' ? `${k.n} était déjà sur ta liste.` : `C’est noté : ${k.n.toLowerCase()} est sur ta liste de courses 🛒`)]); }, 'cart')));
    }
    return out;
  },
  shop() {
    const l = S.data.shop.filter(x => !x.done);
    if (!l.length) return [P('Ta liste de courses est vide.'), actions(act('Préparer depuis ma semaine', later(() => nav.go('plan')), 'calendar'))];
    return [P('Il te reste ', B(l.length + ' ' + plural(l.length, 'article', 'articles')), ' à acheter :'), list(l.slice(0, 10).map(x => x.qty ? `${x.name} (${fmtQty(x.qty, x.unit)})` : x.name)), l.length > 10 ? P(`… et ${l.length - 10} autres.`) : null, actions(act('Ouvrir mes courses', later(() => nav.go('shop')), 'cart'))].filter(Boolean);
  },
  shopAdd(text) {
    const items = shopItems(text);
    if (!items.length) return [P('Que veux-tu ajouter ? Par exemple « ajoute du lait et 6 œufs aux courses ».')];
    const before = S.data.shop, added = items.map(it => A.addShop({ name: it.name, qty: it.qty, unit: it.unit }));
    haptic(10);
    return [P(`C’est noté 🛒 ${added.map(x => x.name.toLowerCase()).join(', ')} ${plural(added.length, 'est', 'sont')} sur ta liste.`), actions(act('Annuler', () => { set('shop', before); reply([P('Annulé : ta liste est revenue comme avant.')]); }, 'undo'), act('Ouvrir mes courses', later(() => nav.go('shop')), 'cart'))];
  },
  planAdd(text) {
    const t = todayISO(), { day, slot } = findWhen(text, t, A.currentMealSlot()), dish = leftover(text);
    if (!day || !dish) return [P('Dis-moi quoi et quand, par exemple « mets des lasagnes demain soir ».')];
    const k = slot || (S.data.plan[day] && S.data.plan[day].lunch ? 'dinner' : 'lunch'), cur = S.data.plan[day] && S.data.plan[day][k];
    const r = S.cat.list.find(x => norm(x.t) === norm(dish)), before = JSON.parse(JSON.stringify(S.data.plan)), serv = S.data.prefs.people || 2;
    if (r) A.planSet(day, k, r.id, serv); else A.planSetFree(day, k, dish, serv);
    haptic(10);
    const curName = cur && (cur.rid && S.cat.get(cur.rid) ? S.cat.get(cur.rid).t : cur.note);
    return [P('C’est prévu 📅 ', B(r ? r.t : dish), ` pour ${slotName(day, k, t).toLowerCase()}${curName ? ` (à la place de ${curName.toLowerCase()})` : ''}.`), actions(act('Annuler', () => { set('plan', before); reply([P('Annulé.')]); }, 'undo'), act('Voir ma semaine', later(() => nav.go('plan')), 'calendar'))];
  },
  week(text) {
    const t = todayISO(), w = findWhen(text, t, A.currentMealSlot()), days = w.day ? [w.day] : [t, addDays(t, 1)], out = [];
    for (const d of days) {
      const e = S.data.plan[d] || {};
      out.push(P(B(d === t ? 'Aujourd’hui' : d === addDays(t, 1) ? 'Demain' : fmtDateLong(d))));
      out.push(list([['lunch', 'Midi'], ['dinner', 'Soir']].filter(([k]) => !w.slot || k === w.slot).map(([k, l]) => { const x = e[k], r = x && x.rid && S.cat.get(x.rid);
        return x ? `${l} : ${r ? r.t : x.note}${x.done ? ' ✓' : ''}` : [`${l} : rien de prévu `, h('button', { type: 'button', class: 'linkish', onclick: later(() => openQuickMeal(d, k)) }, 'ajouter')]; })));
    }
    return out;
  },
  season() {
    const mo = new Date().getMonth() + 1, items = seasonalItems(mo).slice(0, 12), c = ctx(), p = S.data.prefs;
    const recs = S.cat.list.filter(r => allowed(r, p, kb) && inMoment(r, 'plat') && seasonal(r, kb, mo)).map(r => ({ r, sc: score(r, p.people || 2, c) })).sort((a, b) => b.sc.score - a.sc.score).slice(0, 3);
    return [P('En ce moment, c’est la saison de :'), P(items.map(i => i.emoji + ' ' + i.n.toLowerCase()).join(', ') + '.'), recs.length ? P('À cuisiner :') : null, recs.length ? h('div', { class: 'bot-recs' }, recs.map(x => recCard(x.r, covWhy(x.r, x.sc)))) : null].filter(Boolean);
  },
  prefDislike(text) {
    const { found } = findIngs(text, kb), spicy = /epice|piquant|piment|relev/.test(norm(text));
    const words = [...found.map(id => kb.name(id)), ...(spicy ? ['épicé'] : []), ...(!found.length && !spicy ? prefWords(text) : [])];
    if (!words.length) return [P('Qu’est-ce que tu n’aimes pas ? Par exemple « je n’aime pas les champignons ».')];
    const before = S.data.prefs.dislikes || [], add = words.filter(w => !before.some(b => norm(b) === norm(w)));
    setPref({ dislikes: [...before, ...add] }); haptic(8);
    return [P('C’est noté 👍 Je ne te proposerai plus de recettes avec ', B(words.join(', ').toLowerCase()), '.'), actions(act('Annuler', () => { setPref({ dislikes: before }); reply([P('Annulé.')]); }, 'undo'), act('Mes préférences', later(() => nav.go('me')), 'user'))];
  },
  prefLike(text) {
    const { found } = findIngs(text, kb), words = found.length ? found.map(id => kb.name(id)) : prefWords(text);
    if (!words.length) return [P('Dis-moi ce que tu aimes, par exemple « j’adore le fromage ».')];
    const before = S.data.prefs.likes || [], add = words.filter(w => !before.some(b => norm(b) === norm(w)));
    setPref({ likes: [...before, ...add] }); haptic(8);
    return [P('Super, noté 😋 Je mettrai plus souvent en avant les recettes avec ', B(words.join(', ').toLowerCase()), '.'), actions(act('Annuler', () => { setPref({ likes: before }); reply([P('Annulé.')]); }, 'undo'), act('Une idée avec ça', () => ask('une idée avec ' + (found.length ? art(found[0], null, true) : words[0].toLowerCase())), 'utensils'))];
  },
  prefPeople(text) {
    const n = findPeople(text); if (!n) return [P('Combien êtes-vous ? Dis par exemple « on est 3 ».')];
    const before = S.data.prefs.people; setPref({ people: n });
    return [P('Noté : les recettes et les courses sont maintenant calculées pour ', B(n + ' ' + plural(n, 'personne', 'personnes')), '.'), actions(act('Annuler', () => { setPref({ people: before }); reply([P('Annulé.')]); }, 'undo'))];
  },
  prefDiet(text) {
    const d = findDiet(text); if (!d) return [P('Je n’ai pas compris ton régime. Tu peux le régler dans Moi → Mes préférences.')];
    const before = S.data.prefs.diet; setPref({ diet: d });
    const label = { omni: 'tu manges de tout', veg: 'végétarien', vegan: 'végétalien', pesco: 'pescétarien' }[d];
    return [P('C’est noté : ', B(label), d === 'omni' ? '. Toutes les recettes sont de nouveau proposées.' : '. Je ne te proposerai plus que des recettes qui conviennent.'), actions(act('Annuler', () => { setPref({ diet: before }); reply([P('Annulé.')]); }, 'undo'))];
  },
  stockAdd(text) {
    const t = flat(text), zone = /congel/.test(t) ? 'congelateur' : / placard /.test(t) ? 'placard' : / frigo /.test(t) ? 'frigo' : null;
    const items = shopItems(text.replace(/(j['’ ]ai|je viens d['’ ]|on a|j['’ ]ai re)\s*(achet[ée]|pris|reçu|recu)/gi, ' ').replace(/\b(au|dans le|dans mon|dans la|au fond du)\s+(frigo|stock|placard|congélateur|congelateur|congel|congélo|congelo)\b/gi, ' ').replace(/\b(range|ranger)\b/gi, ' '));
    if (!items.length) return [P('Qu’as-tu acheté ? Par exemple « j’ai acheté du lait et 6 œufs ».')];
    const before = S.data.stock, done = [];
    for (const it of items) {
      const id = kb.resolve(it.name), k = id && kb.get(id), z = zone || (k ? k.zone : 'frigo');
      const qty = it.qty || (k && k.buy ? k.buy[0] : 1), unit = it.qty ? (it.unit || (k ? k.u : 'pièce')) : (k && k.buy ? k.buy[1] : (k ? k.u : 'pièce'));
      const lot = A.addStock({ name: k ? k.n : it.name, qty, unit, zone: z, expiry: A.suggestExpiry(id, z), ing: id || undefined });
      done.push(`${lot.name} (${fmtQty(lot.qty, lot.unit)}, ${zoneTxt(z)})`);
    }
    haptic(10);
    return [P('C’est rangé dans ton stock 🧺'), list(done), P(h('span', { class: 'muted sm' }, 'Dates limites estimées : tu peux les corriger dans la fiche de chaque produit.')),
      actions(act('Annuler', () => { set('stock', before); reply([P('Annulé : ton stock est revenu comme avant.')]); }, 'undo'), act('Voir mon stock', later(() => nav.go('stock')), 'fridge'))];
  },
  stockUse(text) {
    const { found } = findIngs(text, kb), st = S.data.stock, before = st;
    const words = !found.length ? flat(text).trim().split(' ').filter(w => w.length >= 4 && !['fini', 'termine', 'plus', 'jete', 'tout'].includes(w)) : [];
    const gone = st.filter(x => (x.ing && found.includes(x.ing)) || (words.length && words.some(w => norm(x.name).includes(w))));
    const names = found.length ? found.map(id => kb.name(id)) : gone.map(x => x.name);
    if (!names.length) return [P('Qu’est-ce qui est fini ? Par exemple « j’ai fini le lait ».')];
    if (gone.length) set('stock', st.filter(x => !gone.includes(x)));
    haptic(8);
    return [P(gone.length ? 'C’est noté, j’ai retiré du stock : ' : 'Ce n’était déjà plus dans ton stock : ', B(names.join(', ').toLowerCase()), '.'),
      actions(gone.length ? act('Annuler', () => { set('stock', before); reply([P('Annulé.')]); }, 'undo') : null,
        act(`Ajouter aux courses`, () => { names.forEach(n => A.addShop({ name: n })); reply([P('C’est sur ta liste de courses 🛒')]); }, 'cart'))];
  },
  ideas(text) {
    // un plat précis (« une recette de crêpes ») : on cherche d'abord dans le catalogue
    const words = dishWords(text), { found, excl } = findIngs(text, kb);
    if (words.length && !found.length && !excl.length && !Object.keys(findWish(text)).length) { const res = byName(words.join(' ')); if (res) return res; }
    return ideas(text);
  },
  unknown(text) {
    const { found, excl } = findIngs(text, kb), w = findWish(text);
    // juste un produit (« les courgettes ? ») : tout ce que je sais dessus
    if (found.length === 1 && !excl.length && !Object.keys(w).length && dishWords(text).length <= 1) return aboutIng(found[0]);
    const exact = byName(text); if (exact) return exact;
    if (found.length || excl.length || Object.keys(w).length) return ideas(text);
    const res = dishWords(text).length ? byName(dishWords(text).join(' ')) : null; if (res) return res;
    return [P('Je ne suis pas sûr de comprendre 🤔 Je connais bien la cuisine, tes recettes et ton frigo, mais pas tout le reste : je fonctionne sans internet.'), P('Essaie par exemple :'), starters(['Combien de temps cuire le riz ?', '180 °C, c’est quel thermostat ?', 'Que faire avec des restes de pain ?', 'On mange quoi ce soir ?'])];
  },
};

// tout sur un produit : ce que j'en ai, comment le garder, quoi en faire
function aboutIng(id) {
  const k = kb.get(id), t = todayISO(), lots = S.data.stock.filter(x => x.ing === id), out = [P(`${k.emoji} `, B(k.n))];
  out.push(lots.length ? P('Tu en as : ', lots.map(x => `${fmtQty(x.qty, x.unit)} (${zoneTxt(x.zone)}${x.expiry ? ', ' + statusText(x, t).toLowerCase() : ''})`).join(' ; '), '.') : kb.isPantry(id) ? P('C’est dans tes produits « toujours chez moi ».') : P('Tu n’en as pas en stock.'));
  out.push(...R.keep(k.n).slice(1, -1));
  const p = S.data.prefs, c = ctx(), recs = S.cat.list.filter(r => allowed(r, p, kb) && r.i.some(([x]) => x === id)).map(r => ({ r, sc: score(r, p.people || 2, c) })).sort((a, b) => b.sc.score - a.sc.score).slice(0, 3);
  if (recs.length) out.push(P('À cuisiner avec :'), h('div', { class: 'bot-recs' }, recs.map(x => recCard(x.r, covWhy(x.r, x.sc)))));
  out.push(actions(!lots.length ? act(`Ajouter ${k.n.toLowerCase()} aux courses`, () => { const it = A.addShop({ name: k.n, ing: id }); reply([P(it.result === 'exists' ? `${k.n} était déjà sur ta liste.` : 'C’est sur ta liste de courses 🛒')]); }, 'cart') : null, act('D’autres idées avec', () => ask('une idée avec ' + art(id, null, true)), 'utensils')));
  return out;
}
// une fiche « savoir » (cuisson, conversion, astuce, mode d'emploi) : **gras** et listes à puces
function rich(line) { return line.split(/\*\*(.+?)\*\*/).map((x, i) => i % 2 ? B(x) : x); }
function knowView(kn) {
  const out = [], bullets = [];
  const flush = () => { if (bullets.length) { out.push(list(bullets.splice(0).map(rich))); } };
  for (const l of kn.lines) { if (l.startsWith('• ')) bullets.push(l.slice(2)); else { flush(); out.push(P(...rich(l))); } }
  flush();
  if (kn.act) { const [label, to] = kn.act;
    const fn = to.startsWith('ask:') ? () => ask(to.slice(4)) : to.startsWith('tab:') ? later(() => nav.go(to.slice(4))) : to === 'equip' ? later(() => openEquipment()) : to === 'pantry' ? later(openPantry) : null;
    if (fn) out.push(actions(act(label, fn, to.startsWith('ask:') ? 'sparkle' : 'right'))); }
  return out;
}
// quand la réponse « savoir » passe avant l'intention trouvée
const ACTIONS = new Set(['empty', 'thanks', 'hello', 'learned', 'level', 'prefDislike', 'prefLike', 'prefPeople', 'prefDiet', 'stockAdd', 'stockUse', 'shopAdd', 'planAdd', 'expiring', 'stats', 'shop', 'season', 'stock', 'week']);
function useKnow(k, kn, text) {
  const how = / (comment|ou est|ou se|ou sont|ou trouver|ou je|ou regler|ou changer|ou mettre|explique|a quoi sert|ca sert) /.test(flat(text));
  if (kn.conv || (kn.app && how)) return true;
  if (kn.small) return k === 'unknown';
  if (ACTIONS.has(k)) return false;
  if (k === 'unknown' || k === 'help') return !kn.app || how || k === 'unknown';
  return kn.score >= 20 && !kn.app;   // idées, conservation, remplacement : seulement une fiche bien précise
}
// vocabulaire du correcteur : mots des intentions, des fiches, des produits et des recettes
let VOCAB = null;
function vocab() {
  if (!VOCAB) VOCAB = makeVocab([...BRAIN_WORDS, ...KNOW_WORDS, ...[...kb.alias].flatMap(a => String(a[0]).split(/[ '-]/)), ...S.cat.list.flatMap(r => norm(r.t).split(' '))]);
  return VOCAB;
}
function answer(q) {
  const k = intent(q), fu = isFollowUp(q), kn = know(q), t = flat(q);
  if (CTX.kind === 'ideas' && fu === 'more' && (k === 'ideas' || k === 'unknown') && !kn) return ideas(CTX.text, CTX.offset + 4);
  if (CTX.kind === 'ideas' && fu === 'refine' && (k === 'ideas' || k === 'unknown') && !(kn && kn.score >= 20)) {
    // « plus rapide » quand c'était déjà rapide : on resserre le temps
    const prev = findWish(CTX.text).maxTime, faster = / (plus rapide|plus vite|moins long|encore plus) /.test(t);
    return ideas(CTX.text + ' ' + q + (faster && prev ? ` ${Math.max(10, prev - 10)} min` : ''));
  }
  // « et du beurre ? » juste après une question sur le stock, la conservation, un remplacement ou la semaine
  if (/^ et /.test(t) && (k === 'unknown' || k === 'ideas') && ['stock', 'keep', 'substitute', 'week'].includes(CTX.last)) return R[CTX.last](q);
  if (kn && useKnow(k, kn, q)) { CTX.last = 'know'; return knowView(kn); }
  if (k !== 'ideas' && k !== 'unknown') CTX = { kind: null, text: '', offset: 0, last: k }; else CTX.last = k;
  return (R[k] || R.unknown)(q);
}

// ---------- ce que l'app a appris (affiché ici et dans Moi) ----------
export function learnedLines() {
  const L = learnedSummary(), d = S.data, p = d.prefs, lines = [], cnt = new Map(), cuis = new Map();
  let mins = 0, nm = 0;
  for (const e of d.history) { cnt.set(e.rid, (cnt.get(e.rid) || 0) + 1); const r = S.cat.get(e.rid); if (r) { mins += r.m; nm++; if (r.k && r.k !== 'Française' && r.k !== 'Cuisine du monde') cuis.set(r.k, (cuis.get(r.k) || 0) + 1); } }
  const top = [...cnt.entries()].filter(([id, n]) => n >= 2 && S.cat.get(id)).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => S.cat.get(id).t);
  if (top.length) lines.push(['❤️', 'Tes recettes préférées', top.join(', ')]);
  if (L.cats.length) lines.push(['🍽️', 'Tu cuisines souvent', L.cats.join(', ').toLowerCase()]);
  const cu = [...cuis.entries()].filter(x => x[1] >= 2).sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0].toLowerCase());
  if (cu.length) lines.push(['🌍', 'Tes cuisines du monde préférées', cu.join(', ')]);
  if (nm >= 4) { const avg = Math.round(mins / nm / 5) * 5; lines.push(['⏱️', 'Ton rythme en cuisine', avg <= 25 ? `plutôt rapide : ${avg} min en moyenne` : avg <= 45 ? `${avg} min en moyenne` : `tu prends ton temps : ${avg} min en moyenne`]); }
  const dishes = myDishes(d.plan, 4).filter(x => x.n >= 2).map(x => x.name);
  if (dishes.length) lines.push(['✍️', 'Tes plats habituels', dishes.join(', ')]);
  for (const [k, note] of L.free) { const [wd, slot] = k.split('-'); lines.push(['📅', `Souvent le ${['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][wd]} ${slot === 'lunch' ? 'midi' : 'soir'}`, note]); }
  if (L.habitual.length) lines.push(['🛒', 'Tu achètes régulièrement', L.habitual.map(x => x.name).join(', ')]);
  const days = new Map(); for (const b of (d.memo && d.memo.bought) || []) days.set(b.d, 1);
  if (days.size >= 3) { const wd = new Map(); for (const k of days.keys()) { const n = (new Date(k + 'T12:00').getDay() + 6) % 7; wd.set(n, (wd.get(n) || 0) + 1); } const [best, n] = [...wd.entries()].sort((a, b) => b[1] - a[1])[0]; if (n >= 2) lines.push(['🗓️', 'Ton jour de courses', `le plus souvent le ${['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][best]}`]); }
  const waste = new Map(); for (const w of d.waste) { const k = norm(w.name); const g = waste.get(k) || { name: w.name, n: 0 }; g.n++; waste.set(k, g); }
  const often = [...waste.values()].filter(x => x.n >= 2).sort((a, b) => b.n - a.n).slice(0, 3);
  if (often.length) lines.push(['🗑️', 'Ce que tu jettes le plus', often.map(x => `${x.name.toLowerCase()} (${x.n} fois)`).join(', ') + ' : achète-en un peu moins, ou congèle-le plus tôt']);
  if ((p.likes || []).length) lines.push(['😋', 'Tu aimes', p.likes.join(', ')]);
  if ((p.dislikes || []).length) lines.push(['🙅', 'Tu évites', p.dislikes.join(', ')]);
  if (L.products.length) lines.push(['🧊', 'Produits dont je retiens la quantité et le rangement', L.products.map(x => x.name).join(', ')]);
  return lines;
}
function learnedView() {
  const lines = learnedLines();
  if (!lines.length) return [P('Pas encore grand-chose 🙂 Plus tu ajoutes de produits, cuisines et fais tes courses avec l’app, plus je retiens tes habitudes : quantités, rangement, plats préférés, repas du vendredi soir…')];
  return [P('Voici ce que j’ai retenu de tes habitudes :'), h('div', { class: 'bot-learn' }, lines.map(([e, t, v]) => h('div', { class: 'learn-line' }, h('span', { class: 'e' }, e), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, t), h('span', { class: 'muted sm' }, v))))),
    P(h('span', { class: 'muted sm' }, 'Ça me sert à préremplir les quantités, proposer des repas qui te ressemblent et rappeler ce que tu achètes souvent.')),
    actions(act('Tout oublier', () => { forgetAll(); reply([P('C’est fait : j’ai oublié tes habitudes. Ton stock, tes courses et ton historique ne bougent pas.')]); }, 'trash'))];
}

// ---------- fenêtre de discussion ----------
const APPL_IDEA = { cookeo: 'Une idée au Cookeo', air_fryer: 'Une idée au air fryer', thermomix: 'Une idée au Thermomix', barbecue: 'Une idée au barbecue', raclette: 'Une idée de raclette', gaufrier: 'Une idée au gaufrier' };
function starters(list = STARTERS) { return h('div', { class: 'chips wrap bot-starters' }, list.map(s => chip(s, false, () => ask(s)))); }
function bubble(who, kids) {
  const m = h('div', { class: 'msg ' + who }, who === 'bot' ? h('span', { class: 'msg-av', 'aria-hidden': 'true' }, mascotEl({ size: 26 })) : null, h('div', { class: 'msg-b' }, ...[].concat(kids).filter(Boolean)));
  return m;
}
function push(who, kids) { const m = bubble(who, kids); LOG.push(m); if (LOG.length > 40) LOG.shift(); if (feed) { feed.append(m); requestAnimationFrame(() => m.scrollIntoView({ block: 'end', behavior: 'smooth' })); } }
function reply(kids) { push('bot', kids); }
function ask(text) {
  const q = String(text || '').trim(); if (!q) return;
  push('me', [P(q)]);
  // abréviations et fautes de frappe corrigées, puis une réponse par demande (« ajoute du lait et mets des pâtes demain »)
  let outs;
  try { outs = splitRequests(fixTypos(chatNorm(q), vocab())).map(answer); } catch (e) { console.error(e); outs = [[P('Oups, je me suis emmêlé les pinceaux. Reformule ta question ?')]]; }
  const typing = bubble('bot', [h('span', { class: 'typing' }, h('i'), h('i'), h('i'))]); if (feed) { feed.append(typing); typing.scrollIntoView({ block: 'end' }); }
  setTimeout(() => { typing.remove(); outs.forEach(reply); }, 280);
}
export function openAssistant(question) {
  feed = h('div', { class: 'chat', role: 'log', 'aria-live': 'polite' });
  if (!LOG.length) LOG.push(bubble('bot', R.hello()));
  feed.append(...LOG);
  const inp = h('input', { class: 'input', type: 'text', enterkeyhint: 'send', autocomplete: 'off', maxlength: '200', placeholder: 'Pose ta question…', 'aria-label': 'Ta question' });
  const send = () => { const v = inp.value; inp.value = ''; ask(v); };
  // dictée vocale (Chrome sur Android, demande internet) : on parle, la question s'écrit et part toute seule
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let mic = null;
  if (SR) mic = h('button', { type: 'button', class: 'btn soft chat-mic', 'aria-label': 'Parler', onclick: () => {
    if (!navigator.onLine) { reply([P('La dictée vocale a besoin d’internet. Tu peux écrire ta question.')]); return; }
    try { const rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = false; rec.maxAlternatives = 1; mic.classList.add('on');
      rec.onresult = e => { const t = e.results[0][0].transcript; inp.value = ''; ask(t); };
      rec.onerror = () => { mic.classList.remove('on'); }; rec.onend = () => mic.classList.remove('on'); rec.start(); haptic(8);
    } catch { mic.classList.remove('on'); }
  } }, icon('mic', 22));
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
  sheet = openSheet({ title: `${BOT}, ton assistant`, size: 'tall', content: h('div', { class: 'chat-wrap' }, h('p', { class: 'chat-note' }, icon('info', 14), 'Tout reste sur ton téléphone.'), feed),
    footer: h('div', { class: 'chat-bar' }, mic, inp, h('button', { type: 'button', class: 'btn primary chat-send', 'aria-label': 'Envoyer', onclick: send }, icon('right', 22))),
    headerRight: LOG.length > 1 ? h('button', { type: 'button', class: 'btn link sm', onclick: () => { LOG.length = 0; CTX = { kind: null, text: '', offset: 0, last: null }; LOG.push(bubble('bot', R.hello())); clear(feed); feed.append(...LOG); } }, 'Effacer') : null,
    onClose: () => { feed = null; sheet = null; } });
  setTimeout(() => { const last = feed && feed.lastChild; if (last) last.scrollIntoView({ block: 'end' }); }, 60);
  if (question) setTimeout(() => ask(question), 200);
}
