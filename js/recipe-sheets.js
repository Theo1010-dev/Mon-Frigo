// Fenêtres des recettes : fiche recette, mode cuisine (minuteurs), fin de cuisson, historique, recette perso, filtres.
import * as A from './actions.js';
import { h, btn, openSheet, confirmSheet, toast, stepper, seg, chip, field, plate, meta, tint, clear, haptic, recipeEmoji } from './ui.js';
import { icon } from './icons.js';
import { S, mutate, set, ensureIng, rebuildCatalogue } from './state.js';
import { coverage, scaleIngredients, CUISINES, missingEquip, EQUIP, EQUIP_EMOJI, equipName, equipPlan, lockText } from './recipes.js';
import { withArticle, addEquip } from './equipment.js';
import { fmtQty, UNITS_UI, canonUnit } from './units.js';
import { todayISO, addDays, dayName, fmtDateShort, money, uid } from './util.js';
import { SLOTS } from './plan.js';
import { num, RUI, resetRUI, nav } from './nav.js';
import { tx, celebrate } from './theme.js';
import { explainStep } from './explain.js';
// appareils de la recette, dans l'ordre de « Mon équipement » : « Four, plaques », « Cookeo », « Sans cuisson »
const appliances = r => { const l = EQUIP.filter(([k]) => (r.e || []).includes(k)).map(([k]) => equipName(k)); return l.length ? l.map((x, i) => i ? x.toLowerCase().replace('cookeo', 'Cookeo').replace('thermomix', 'Thermomix') : x).join(', ') : 'Sans cuisson'; };

const kb = S.kb;
// « **gras** » → texte en gras
const rich = t => String(t).split(/\*\*/).map((x, i) => i % 2 ? h('strong', null, x) : x);
// l'étape expliquée : petites actions, ce qu'il faut pour cette étape, les mots de cuisine, le thermostat
function stepHelp(ex) {
  const out = [];
  if (ex.parts.length > 1) out.push(h('p', { class: 'sh-t' }, 'En plus simple :'), h('ol', null, ex.parts.map(p => h('li', null, p))));
  if (ex.ings.length) out.push(h('p', { class: 'sh-t' }, 'Ce qu’il te faut pour cette étape :'), h('ul', null, ex.ings.map(([n, q]) => h('li', null, `${n} : ${q}`))));
  for (const d of ex.terms) out.push(h('p', null, ...rich(d)));
  for (const t of ex.temps) out.push(h('p', null, '🌡️ ', t));
  if (!out.length) out.push(h('p', null, 'Cette étape se fait en un seul geste : lis-la jusqu’au bout, prépare ce qu’il faut à côté, et prends ton temps. Tu peux lancer un minuteur juste en dessous.'));
  out.push(h('button', { type: 'button', class: 'linkish sh-ask', onclick: () => nav.ask() }, 'Toujours pas clair ? Demande à l’assistant, il sait où tu en es.'));
  return out;
}
// en mode cuisine, le conseil de remplacement s'affiche à l'étape qui utilise l'appareil
const STEP_KEY = { four: /four|°C/i, air_fryer: /air fryer|panier/i, cookeo: /dorer|pression|cookeo|cuve/i, thermomix: /vitesse|\bbol\b|thermomix/i, 'micro-ondes': /micro-ondes/i, mixeur: /mix/i, barbecue: /braises|barbecue|grille|plancha|grill/i, raclette: /raclette|poêlon/i };

const ingName = id => kb.name(id, id);

const SOURCE_LABEL = { classique: 'Classique', compose: 'Idée composée', perso: 'Ma recette' };

// ---------- fiche recette ----------
export function openRecipe(rid, opts = {}) {
  const r = S.cat.get(rid); if (!r) { toast('Recette introuvable'); return; }
  // une tarte, une pizza ou un gâteau se fait en entier : on l'affiche pour sa taille d'origine (pas « ¼ de pâte »)
  const whole = r.c === 'Desserts' || r.i.some(([id]) => { const k = S.kb.get(id); return k && k.role === 'dough'; });
  const people = S.data.prefs.people || 2;
  let serv = opts.serv || (whole && r.s > people ? r.s : people) || r.s || 2;
  const ingBox = h('div', { class: 'stack' });
  const favBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Favori', onclick: () => { A.toggleFav(rid); paintFav(); haptic(10); } }, icon('heart', 22));
  const paintFav = () => { const on = S.data.fav.includes(rid); favBtn.classList.toggle('on', on); favBtn.setAttribute('aria-pressed', String(on)); favBtn.querySelector('svg').setAttribute('fill', on ? 'currentColor' : 'none'); };
  function drawIng() {
    clear(ingBox); const cov = coverage(r, serv, S.data.stock, kb, todayISO());
    const stateIc = { full: ['check', 'ok'], partial: ['alert', 'soon'], none: ['x', 'urgent'], staple: ['check', 'ok'], unknown: ['check', 'ok'], sub: ['swap', 'ok'] };
    if (cov.total) ingBox.append(h('div', { class: 'cov-line ' + (cov.all ? 'good' : '') }, icon(cov.all ? 'check' : 'cart', 18), cov.all ? (cov.subs ? `Tu as tout, avec ${cov.subs} remplacement${cov.subs > 1 ? 's' : ''}` : 'Tu as tous les ingrédients') : `Il te manque ${cov.missing.length} ingrédient${cov.missing.length > 1 ? 's' : ''}`));
    const ul = h('ul', { class: 'ings' });
    for (const row of cov.rows) {
      const [ic, cls] = stateIc[row.state], k = kb.get(row.id);
      const sub = row.state === 'sub' ? `Remplacé par ton « ${row.sub.name} »` : row.state === 'partial' ? `Tu en as ${fmtQty(row.have, row.need.unit)}, il en manque ${fmtQty(row.missing.qty, row.missing.unit)}` : row.state === 'none' ? 'Pas dans ton stock' : row.state === 'staple' ? 'Toujours chez toi' : row.state === 'unknown' ? 'Dans ton stock' : (row.expiring !== false && row.expiring <= 3 ? 'À consommer vite' : 'Dans ton stock');
      ul.append(h('li', { class: 'ing ' + row.state }, h('span', { class: 'e' }, k ? k.emoji : '•'), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, ingName(row.id)), h('span', { class: 'muted sm' }, sub)), h('span', { class: 'qty' }, fmtQty(row.need.qty, row.need.unit)), h('span', { class: 'st ' + cls, title: sub }, icon(ic, 14))));
    }
    ingBox.append(ul);
    if (cov.missing.length) ingBox.append(btn(`Ajouter ${cov.missing.length > 1 ? `les ${cov.missing.length} produits manquants` : 'le produit manquant'} aux courses`, { class: 'btn soft block', onclick: () => { const n = A.addMissingToShop(cov.missing); toast(n ? `${n} produit${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''} aux courses` : 'Déjà dans tes courses'); } }, 'cart'));
  }
  const top = h('div', { class: 'r-top', style: tint(r) }, plate(r, kb, 'xxl'), h('h1', null, r.t),
    meta([['clock', `${r.m} min`], ['utensils', r.d], r.costKnown && r.costPer > 0 ? ['coin', `≈ ${money(r.costPer)} par pers.`] : null, r.custom && !(r.e || []).length ? null : ['flame', appliances(r)]]),
    h('div', { class: 'badges' }, h('span', { class: 'badge' }, SOURCE_LABEL[r.o] || 'Recette'), h('span', { class: 'badge' }, r.c), r.veg ? h('span', { class: 'badge ok' }, 'Végétarien') : null, h('span', { class: 'badge', title: 'Indice d’équilibre indicatif, pas un avis nutritionnel' }, r.bal.label)));
  const servRow = h('div', { class: 'serv-row' }, h('h2', null, 'Pour'), stepper(serv, { min: 1, max: 12, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => { serv = v; drawIng(); } }));
  const share = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Partager la recette', onclick: async () => {
    const txt = `${r.t} (${serv} pers., ${r.m} min)\n\nIngrédients :\n` + scaleIngredients(r, serv).map(([id, q, u]) => `- ${ingName(id)} : ${fmtQty(q, u)}`).join('\n') + '\n\nPréparation :\n' + r.p.map((x, i) => `${i + 1}. ${x}`).join('\n') + '\n\nRecette Mon Frigo';
    try { if (navigator.share) { await navigator.share({ title: r.t, text: txt }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(txt); toast('Recette copiée : colle-la dans un message'); } catch { toast('Partage indisponible sur ce navigateur'); } } }, icon('share', 21));
  const actions = h('div', { class: 'r-actions' }, favBtn, share, btn('Planifier', { class: 'btn soft', onclick: () => openPlanFromRecipe(r, () => serv) }, 'calendar'),
    r.custom ? btn('Modifier', { class: 'btn soft', onclick: () => { s.close(); setTimeout(() => openCustomRecipe({ id: rid }), 260); } }, 'edit') : btn('Adapter', { class: 'btn soft', onclick: () => { s.close(); setTimeout(() => openCustomRecipe({ from: rid, serv }), 260); } }, 'copy'));
  const steps = h('ol', { class: 'steps' }, r.p.map(t => h('li', null, t)));
  // recette grisée faute d'appareil : on le dit, et on peut corriger d'un geste
  const lockKeys = r.custom ? [] : missingEquip(r, S.data.prefs);
  const lockEl = lockKeys.length ? h('div', { class: 'lock-note' }, icon('lock', 18), h('span', { class: 'grow' }, `${lockText(r, S.data.prefs)} pour cette recette.`),
    btn(`J’ai ${withArticle(lockKeys)}`, { class: 'btn soft sm', onclick: () => { addEquip(lockKeys); lockEl.remove(); } })) : null;
  // appareil remplacé par un que tu as (frites au four, burger à la poêle…) : comment faire, en une ligne
  const swapEls = r.custom ? [] : equipPlan(r, S.data.prefs).swaps.filter(x => x.tip).map(x => h('p', { class: 'swap-note' }, icon('swap', 16), h('span', null, x.tip)));
  const body = h('div', { class: 'recipe' }, top, h('div', { class: 'r-body' }, lockEl, ...swapEls, servRow, actions, h('h2', null, 'Ingrédients'), ingBox, h('h2', null, 'Préparation'), steps,
    btn('Déjà cuisiné ? Retirer les ingrédients du stock', { class: 'btn link wrap', onclick: () => { s.close(); setTimeout(() => openFinishCook(rid, serv, { title: 'Repas cuisiné' }), 260); } })));
  const s = openSheet({ title: r.t, size: 'full r-sheet', content: body, footer: btn('Cuisiner', { class: 'btn primary block big', onclick: () => { s.close(); setTimeout(() => openCook(rid, serv), 260); } }, 'flame') });
  s.body.addEventListener('scroll', () => s.el.classList.toggle('scrolled', s.body.scrollTop > 170), { passive: true });
  paintFav(); drawIng(); return s;
}

function openPlanFromRecipe(r, getServ) {
  const t = todayISO(); let date = t, slot = A.currentMealSlot();
  const days = Array.from({ length: 14 }, (_, i) => addDays(t, i)); const box = h('div');
  const draw = () => { clear(box); box.append(h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quel jour ?'), h('div', { class: 'chips scroll' }, days.map((d, i) => chip(i === 0 ? "Aujourd'hui" : i === 1 ? 'Demain' : `${dayName(d).slice(0, 3)}. ${fmtDateShort(d)}`, d === date, () => { date = d; draw(); })))), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quel repas ?'), seg(SLOTS.map(([k, l]) => [k, l]), slot, v => { slot = v; })), (S.data.plan[date] || {})[slot] ? h('p', { class: 'note warn' }, 'Ce créneau est déjà occupé : il sera remplacé.') : null); };
  draw();
  const s = openSheet({ title: 'Planifier', size: 'small', content: box, footer: btn('Ajouter au planning', { class: 'btn primary block', onclick: () => { A.planSet(date, slot, r.id, getServ()); toast(`Ajouté : ${dayName(date)} ${slot === 'lunch' ? 'midi' : 'soir'}`); s.close(); } }) });
}

// ---------- mode cuisine ----------
function detectTimers(text) {
  const out = [], re = /(\d+)(?:\s*(?:à|-|–)\s*(\d+))?\s*(h(?:eures?)?|min(?:utes?)?)(?![a-zà-ü])/gi; let m;
  while ((m = re.exec(text))) { const a = +m[1], b = m[2] ? +m[2] : a, mins = (/^h/i.test(m[3]) ? 60 : 1) * Math.max(a, b); if (mins >= 1 && mins <= 240 && !out.some(o => o.sec === mins * 60)) out.push({ sec: mins * 60, label: mins >= 60 ? `${Math.floor(mins / 60)} h${mins % 60 ? ' ' + (mins % 60) : ''}` : `${mins} min` }); }
  return out;
}

let audioCtx; function beep() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); [0, 0.35, 0.7].forEach(t => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(0.2, audioCtx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + 0.25); o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + 0.3); }); } catch {} }

const fmtClock = sec => { sec = Math.max(0, Math.ceil(sec)); const m = Math.floor(sec / 60), s2 = sec % 60; return `${m}:${String(s2).padStart(2, '0')}`; };

export function openCook(rid, serv, { resume } = {}) {
  const r = S.cat.get(rid); if (!r) return;
  const swaps = r.custom ? [] : equipPlan(r, S.data.prefs).swaps;
  let c = S.data.cook && S.data.cook.rid === rid ? S.data.cook : null;
  if (!resume || !c) c = { rid, serv, step: 0, timers: [], started: Date.now() };
  serv = c.serv; set('cook', c);
  const save = () => set('cook', { ...c });
  let wake = null; const lock = async () => { try { if ('wakeLock' in navigator && !wake) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => { wake = null; }); } } catch {} };
  lock(); const vis = () => { if (document.visibilityState === 'visible') { lock(); tick(); } }; document.addEventListener('visibilitychange', vis);
  const stepBox = h('div', { class: 'cook-step' }), prog = h('div', { class: 'segs', role: 'progressbar' }), timersBox = h('div', { class: 'timers' }), ingPanel = h('div', { class: 'cardlet', hidden: '' }), nextBtn = h('button', { type: 'button', class: 'btn primary grow big' }), prevBtn = h('button', { type: 'button', class: 'btn soft big', 'aria-label': 'Étape précédente' }, icon('left', 22));
  const addTimer = (sec, label) => { c.timers.push({ id: uid(), label: label || fmtClock(sec), end: Date.now() + sec * 1000, fired: false }); save(); drawTimers(); haptic(15); toast(`Minuteur ${label || ''} lancé`); };
  function drawStep() {
    clear(stepBox); const total = r.p.length, txt = r.p[c.step];
    clear(prog); for (let i = 0; i < total; i++) prog.append(h('i', { class: i <= c.step ? 'on' : '' })); prog.setAttribute('aria-label', `Étape ${c.step + 1} sur ${total}`); prog.setAttribute('aria-valuenow', String(c.step + 1)); prog.setAttribute('aria-valuemax', String(total));
    stepBox.append(h('div', { class: 'step-num' }, `Étape ${c.step + 1} sur ${total}`), h('p', { class: 'step-text' }, txt));
    for (const x of swaps) if (x.tip && STEP_KEY[x.k] && STEP_KEY[x.k].test(txt)) stepBox.append(h('p', { class: 'swap-note' }, icon('swap', 16), h('span', null, x.tip)));
    const det = detectTimers(txt); if (det.length) stepBox.append(h('div', { class: 'chips wrap' }, det.map(d => btn(`Minuteur ${d.label}`, { class: 'chip timer', onclick: () => addTimer(d.sec, d.label) }, 'timer'))));
    // « Je ne comprends pas » et « C'est bon quand ? » : l'étape en plus simple, et à quoi ça ressemble quand c'est bon
    const ex = explainStep(r, c.step, serv, kb), help = h('div', { class: 'step-help', hidden: '' }), cuesBox = h('div', { class: 'step-help', hidden: '' });
    const toggle = (box, other, chipEl) => { box.hidden = !box.hidden; other.hidden = true; for (const b of stepBox.querySelectorAll('.step-asks .chip')) b.classList.toggle('on', b === chipEl && !box.hidden); haptic(5); if (!box.hidden) requestAnimationFrame(() => box.scrollIntoView({ block: 'nearest', behavior: 'smooth' })); };
    help.append(...stepHelp(ex)); cuesBox.append(...ex.cues.map(x => h('p', null, ...rich(x))));
    const askHelp = chip('🤔 Je ne comprends pas', false, e => toggle(help, cuesBox, e.currentTarget)), askCues = ex.cues.length ? chip('👀 C’est bon quand ?', false, e => toggle(cuesBox, help, e.currentTarget)) : null;
    stepBox.append(h('div', { class: 'chips wrap step-asks' }, askHelp, askCues), help, cuesBox);
    prevBtn.disabled = c.step === 0; clear(nextBtn); nextBtn.append(c.step === total - 1 ? 'Terminer 🎉' : 'Étape suivante');
  }
  function drawTimers() {
    clear(timersBox); for (const t of c.timers) { const left = (t.end - Date.now()) / 1000; timersBox.append(h('div', { class: 'timer-pill' + (left <= 0 ? ' done' : '') }, icon('timer', 16), h('span', { class: 'strong' }, left <= 0 ? 'Terminé !' : fmtClock(left)), h('span', { class: 'muted sm' }, t.label), h('button', { type: 'button', class: 'x', 'aria-label': 'Supprimer le minuteur', onclick: () => { c.timers = c.timers.filter(x => x.id !== t.id); save(); drawTimers(); } }, icon('x', 14)))); }
    if (!c.timers.length) timersBox.append(h('div', { class: 'row gap wrap quick-timers' }, [1, 5, 10, 15].map(m => btn(`${m} min`, { class: 'chip', onclick: () => addTimer(m * 60, `${m} min`) }, 'timer'))));
  }
  function tick() { let ch = false; for (const t of c.timers) if (!t.fired && t.end <= Date.now()) { t.fired = true; ch = true; beep(); try { navigator.vibrate && navigator.vibrate([300, 150, 300, 150, 300]); } catch {} toast(`⏱ Minuteur « ${t.label} » terminé`, { ms: 8000 }); } if (ch) save(); if (c.timers.length) drawTimers(); }
  const iv = setInterval(tick, 500);
  prevBtn.addEventListener('click', () => { if (c.step > 0) { c.step--; save(); drawStep(); } });
  nextBtn.addEventListener('click', () => { if (c.step < r.p.length - 1) { c.step++; save(); drawStep(); haptic(8); } else { s.close(); setTimeout(() => openFinishCook(rid, serv), 260); } });
  const ingBtn = btn('Voir les ingrédients', { class: 'btn tonal', onclick: () => { ingPanel.hidden = !ingPanel.hidden; ingBtn.querySelector('span:last-child').textContent = ingPanel.hidden ? 'Voir les ingrédients' : 'Masquer les ingrédients'; } }, 'utensils');
  // un ingrédient qui manque en pleine recette : l'assistant propose de quoi le remplacer
  ingPanel.append(h('ul', { class: 'ings' }, scaleIngredients(r, serv).map(([id, q, u]) => h('li', { class: 'ing' }, h('span', { class: 'e' }, kb.get(id) ? kb.get(id).emoji : '•'), h('span', { class: 'grow strong' }, ingName(id)), h('span', { class: 'qty' }, fmtQty(q, u)),
    kb.isPantry(id) ? null : h('button', { type: 'button', class: 'icon-btn sm ing-swap', 'aria-label': `Je n’ai pas de ${ingName(id).toLowerCase()}`, title: 'Je n’en ai pas', onclick: () => nav.ask(`je n'ai pas de ${ingName(id).toLowerCase()}`) }, icon('swap', 17))))));
  const stop = async () => { if (await confirmSheet({ title: 'Arrêter la cuisson ?', text: 'Rien ne sera retiré de ton stock et la recette ne sera pas comptée comme cuisinée.', ok: 'Arrêter' })) { set('cook', null); s.close(); toast('Cuisson arrêtée'); } };
  const s = openSheet({ title: r.t, size: 'full', headerRight: h('button', { type: 'button', class: 'btn link', onclick: () => stop() }, 'Arrêter'), onClose: () => { clearInterval(iv); document.removeEventListener('visibilitychange', vis); try { wake && wake.release(); } catch {} wake = null; },
    content: h('div', { class: 'cook' }, prog, stepBox, timersBox, ingBtn, ingPanel),
    footer: h('div', { class: 'row gap' }, prevBtn, nextBtn) });
  drawStep(); drawTimers(); tick();
  return s;
}

// ---------- fin de cuisson : stock, restes, note ----------
export function openFinishCook(rid, serv, { planRef, title = tx('cook.done') } = {}) {
  const r = S.cat.get(rid); if (!r) return; const rows = A.cookPreview(r, serv); const sel = new Set(rows.filter(x => x.usedAny).map(x => x.id));
  let leftovers = 0, rating = 0; const list = h('div'); const stars = h('div', { class: 'stars' });
  const drawStars = () => { clear(stars); for (let i = 1; i <= 5; i++) stars.append(h('button', { type: 'button', class: 'star' + (i <= rating ? ' on' : ''), 'aria-label': `${i} étoile${i > 1 ? 's' : ''}`, onclick: () => { rating = rating === i ? 0 : i; drawStars(); } }, icon('star', 28))); };
  const drawList = () => { clear(list); if (!rows.length) list.append(h('p', { class: 'muted' }, 'Rien à retirer : tu n’avais que des produits de base.')); for (const x of rows) { const can = x.usedAny; list.append(h('label', { class: 'check row-check' + (can ? '' : ' off') }, h('input', { type: 'checkbox', checked: sel.has(x.id), disabled: !can, onchange: e => { e.target.checked ? sel.add(x.id) : sel.delete(x.id); } }), h('span', { class: 'grow' }, h('span', { class: 'strong' }, x.name), h('span', { class: 'muted sm block' }, !can ? 'Pas en stock' : x.sub ? `Remplacé par « ${x.sub} », qui sera retiré` : x.missing > 0 ? 'Stock insuffisant : tout sera retiré' : 'Sera retiré du stock')), h('span', { class: 'qty' }, fmtQty(x.need.qty, x.need.unit)))); } };
  drawList(); drawStars();
  const s = openSheet({ title, size: 'tall', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, 'Je retire du stock ce que tu as utilisé. Décoche ce qui ne correspond pas.'), list,
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Portions restantes (mises au frigo 3 jours)'), stepper(0, { min: 0, max: serv, onChange: v => { leftovers = v; } })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ta note (facultatif)'), stars)),
    footer: btn('Terminer', { class: 'btn primary block big', onclick: () => {
      const restore = A.applyCook(r, serv, [...sel]); const ref = A.markPlanDone(rid, planRef); const leftoverId = leftovers > 0 ? A.addLeftovers(r.t, leftovers) : null;
      const entry = A.logCooked(r, serv, rating, { restore, leftoverId, planRef: ref }); if (S.data.cook && S.data.cook.rid === rid) set('cook', null); haptic(25); s.close();
      celebrate(); toast(tx('cook.toast'), { undo: () => A.undoCooked(entry.id, true) }); } }), // l'XP gagnée s'envole du bouton profil
    onClose: () => {} });
}

// ---------- un repas de l'historique ----------
export function openHistoryEntry(id) {
  const e = S.data.history.find(x => x.id === id); if (!e) return; const r = S.cat.get(e.rid);
  const canRestore = !!(e.restore && e.restore.length); const box = h('input', { type: 'checkbox', checked: canRestore, disabled: !canRestore });
  const s = openSheet({ title: e.title, size: 'small', content: h('div', { class: 'form' },
    h('p', { class: 'muted' }, `Cuisiné le ${fmtDateShort(e.date)} pour ${e.serv} personne${e.serv > 1 ? 's' : ''}${e.rating ? `, noté ${e.rating}/5` : ''}.`),
    canRestore ? h('label', { class: 'check' }, box, h('span', null, 'Remettre les ingrédients utilisés dans le stock')) : h('p', { class: 'note' }, 'Ce repas a été noté avant cette version : je ne connais pas les quantités utilisées, le stock ne sera pas modifié.'),
    r ? btn('Voir la recette', { class: 'btn soft block', onclick: () => { s.close(); setTimeout(() => openRecipe(r.id), 260); } }, 'utensils') : null),
    footer: btn('Annuler ce repas', { class: 'btn danger block', onclick: () => { A.undoCooked(id, box.checked); s.close(); toast(box.checked ? 'Repas annulé, ingrédients remis dans le stock' : 'Repas retiré de l’historique'); } }, 'undo') });
}

// ---------- recette personnelle ----------
// ce qu'on peut choisir pour sa recette, comme pour celles du catalogue : icône, moment, type de plat, cuisine, appareils, difficulté
const RECIPE_EMOJIS = ['🍝', '🍕', '🍔', '🌮', '🌯', '🥪', '🥗', '🍲', '🥘', '🍛', '🍜', '🍣', '🍱', '🥟', '🍚', '🍙', '🥣', '🍳', '🥚', '🥞', '🧇', '🥐', '🥖', '🧀', '🥩', '🍗', '🍖', '🥓', '🐟', '🦐', '🍤',
  '🥦', '🥕', '🍆', '🍄', '🥔', '🌽', '🍅', '🧅', '🥑', '🍰', '🎂', '🧁', '🍪', '🍩', '🍫', '🍮', '🍨', '🥧', '🍎', '🍌', '🍓', '🍒', '🍋', '🍑', '🥥', '🥜', '☕', '🍹', '🍷'];
const MOMENTS_EDIT = [['🥐 Petit-déj', ['Petit-déjeuner']], ['🥗 Entrée', ['Entrée']], ['🍽️ Plat', ['Déjeuner', 'Dîner']], ['🍰 Dessert', ['Dessert']], ['🍪 Goûter', ['Goûter']], ['🥂 Apéro', ['Apéritif']]];
const LEVELS = ['Facile', 'Intermédiaire', 'Difficile'];
export function openCustomRecipe({ id, from, serv, title, onSaved } = {}) {
  const src = id ? S.cat.get(id) : from ? S.cat.get(from) : null;
  // les réglages de la recette (repris de celle qu'on adapte ou qu'on modifie)
  const M = { emo: src ? src.emo || (from ? recipeEmoji(src, kb) : null) : null, c: src ? src.c : 'Mes recettes', k: src ? src.k || '' : '', e: new Set(src ? src.e || [] : []), d: src && LEVELS.includes(src.d) ? src.d : src && src.d === 'Moyen' ? 'Intermédiaire' : 'Facile',
    mt: new Set(MOMENTS_EDIT.map(([, v], i) => (src ? (src.mt || []).some(x => v.includes(x)) : i === 2) ? i : -1).filter(i => i >= 0)) };
  if (!M.mt.size) M.mt.add(2);
  const nameIn = h('input', { class: 'input', placeholder: 'Nom de la recette', value: src ? (from ? src.t + ' (ma version)' : src.t) : title || '' });
  const time = h('input', { class: 'input', inputmode: 'numeric', value: src ? src.m : 30, 'aria-label': 'Durée en minutes' });
  const servIn = h('input', { class: 'input', inputmode: 'numeric', value: from ? (serv || src.s) : (src ? src.s : serv || 2), 'aria-label': 'Nombre de personnes' });
  const ingBox = h('div', { class: 'ing-edit' }); const rowsData = [];
  const addRow = (nm = '', q = '', u = 'g') => {
    const n = h('input', { class: 'input', placeholder: 'Ingrédient', value: nm, 'aria-label': 'Ingrédient' }), qi = h('input', { class: 'input', inputmode: 'decimal', placeholder: 'Qté', value: q, 'aria-label': 'Quantité' }), un = h('select', { class: 'input', 'aria-label': 'Unité' }, UNITS_UI.map(x => h('option', { value: x, selected: x === canonUnit(u) })), []);
    for (const o of un.options) o.textContent = o.value;
    const row = h('div', { class: 'ing-row' }, n, qi, un, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Retirer', onclick: () => { row.remove(); rowsData.splice(rowsData.indexOf(o), 1); } }, icon('x', 16))); const o = { n, qi, un }; rowsData.push(o); ingBox.append(row);
  };
  if (src) { const f = from ? (serv || src.s) / src.s : 1; for (const [iid, q, u] of src.i) addRow(ingName(iid), Math.round(q * f * 100) / 100, u); } else { addRow(); addRow(); }
  const stepsIn = h('textarea', { class: 'input', rows: 6, placeholder: 'Une étape par ligne' }); stepsIn.value = src ? src.p.join('\n') : '';
  // icône : un aperçu de l'assiette, et la grille pour la changer (« ✨ » = choisie d'après le nom et les ingrédients)
  const preview = () => ({ t: nameIn.value, c: M.c, emo: M.emo, i: rowsData.map(o => [kb.resolve(o.n.value.trim()) || '', 1, 'g']).filter(x => x[0]) });
  // les éléments restent en place (on change juste leur contenu) : un toucher juste après avoir tapé un ingrédient n'est pas perdu
  const plateEl = plate(preview(), kb, 'md'), labT = h('span'), labS = h('span', { class: 'muted sm block' });
  const iconBtn = h('button', { type: 'button', class: 'emo-pick', 'aria-expanded': 'false', onclick: () => { grid.hidden = !grid.hidden; iconBtn.setAttribute('aria-expanded', String(!grid.hidden)); } }, plateEl, h('span', { class: 'emo-lab' }, labT, labS));
  const drawIcon = () => { const pv = preview(); plateEl.textContent = recipeEmoji(pv, kb); for (const [k, v] of Object.entries(tint(pv))) plateEl.style.setProperty(k, v); labT.textContent = M.emo ? 'Changer l’icône' : 'Icône automatique'; labS.textContent = M.emo ? 'Touche ✨ pour revenir à l’automatique' : 'Touche pour en choisir une'; };
  const grid = h('div', { class: 'emo-grid', hidden: '' });
  const drawGrid = () => { clear(grid); grid.append(...[null, ...RECIPE_EMOJIS].map(e => h('button', { type: 'button', class: 'emo' + (M.emo === e ? ' on' : ''), 'aria-label': e ? `Icône ${e}` : 'Icône automatique', 'aria-pressed': String(M.emo === e),
    onclick: () => { M.emo = e; haptic(6); drawGrid(); drawIcon(); grid.hidden = true; iconBtn.setAttribute('aria-expanded', 'false'); } }, e || '✨'))); };
  nameIn.addEventListener('input', () => { if (!M.emo) drawIcon(); }); ingBox.addEventListener('change', () => { if (!M.emo) drawIcon(); });
  drawGrid(); drawIcon();
  // moment, type de plat, cuisine, appareils, difficulté
  const cats = ['Mes recettes', ...new Set(S.cat.list.filter(r => !r.custom).map(r => r.c))].filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => a === 'Mes recettes' ? -1 : b === 'Mes recettes' ? 1 : a.localeCompare(b, 'fr'));
  const kitchens = [...new Set(S.cat.list.filter(r => !r.custom && r.k).map(r => r.k))].sort((a, b) => a.localeCompare(b, 'fr'));
  const catSel = h('select', { class: 'input', 'aria-label': 'Type de plat', onchange: e => { M.c = e.target.value; drawIcon(); } }, cats.map(c => h('option', { value: c, selected: c === M.c }, c === 'Mes recettes' ? 'Autre' : c)));
  const kSel = h('select', { class: 'input', 'aria-label': 'Cuisine', onchange: e => { M.k = e.target.value; } }, h('option', { value: '', selected: !M.k }, '—'), kitchens.map(k => h('option', { value: k, selected: k === M.k }, k)));
  const momentBox = h('div', { class: 'chips wrap' }), equipBox = h('div', { class: 'chips wrap' }), levelBox = h('div', { class: 'chips wrap' });
  const drawChips = () => {
    clear(momentBox); momentBox.append(...MOMENTS_EDIT.map(([l], i) => chip(l, M.mt.has(i), () => { M.mt.has(i) && M.mt.size > 1 ? M.mt.delete(i) : M.mt.add(i); drawChips(); })));
    clear(equipBox); equipBox.append(chip('🧊 Sans cuisson', !M.e.size, () => { M.e.clear(); drawChips(); }), ...EQUIP.map(([k, l]) => chip(`${EQUIP_EMOJI[k]} ${l}`, M.e.has(k), () => { M.e.has(k) ? M.e.delete(k) : M.e.add(k); drawChips(); })));
    clear(levelBox); levelBox.append(...LEVELS.map(l => chip(l, M.d === l, () => { M.d = l; drawChips(); })));
  };
  drawChips();
  const s = openSheet({ title: id ? 'Modifier ma recette' : from ? 'Adapter la recette' : 'Nouvelle recette', size: 'tall',
    content: h('div', { class: 'form' }, field('Nom', nameIn), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Icône'), iconBtn, grid),
      h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Durée (min)', time)), h('div', { class: 'grow' }, field('Personnes', servIn))),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'C’est pour'), momentBox),
      h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Type de plat', catSel)), h('div', { class: 'grow' }, field('Cuisine', kSel))),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ingrédients'), ingBox, btn('Ajouter un ingrédient', { class: 'btn link', onclick: () => addRow() }, 'plus')), field('Étapes', stepsIn),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Appareils'), equipBox), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Difficulté'), levelBox),
      id ? btn('Supprimer cette recette', { class: 'btn link danger-text', onclick: async () => { if (await confirmSheet({ title: 'Supprimer ?', text: 'Cette recette sera définitivement supprimée.', ok: 'Supprimer', danger: true })) { mutate('custom', l => l.filter(x => x.id !== id)); mutate('fav', f => f.filter(x => x !== id)); rebuildCatalogue(); toast('Recette supprimée'); s.close(); } } }) : null),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => {
      const t = nameIn.value.trim(), steps = stepsIn.value.split('\n').map(x => x.trim()).filter(Boolean);
      const ings = rowsData.map(o => ({ n: o.n.value.trim(), q: num(o.qi.value), u: o.un.value })).filter(x => x.n);
      if (!t) { toast('Donne un nom à ta recette'); nameIn.focus(); return; } if (!ings.length) { toast('Ajoute au moins un ingrédient'); return; } if (!steps.length) { toast('Ajoute au moins une étape'); stepsIn.focus(); return; }
      if (ings.some(x => !(x.q > 0))) { toast('Chaque ingrédient doit avoir une quantité'); return; }
      const rec = { id: id || 'perso-' + uid(), t, c: M.c, d: M.d, m: Math.max(1, parseInt(time.value) || 30), s: Math.max(1, parseInt(servIn.value) || 2), e: EQUIP.map(([k]) => k).filter(k => M.e.has(k)), g: [], k: M.k,
        mt: [...new Set([...M.mt].sort().flatMap(i => MOMENTS_EDIT[i][1]))], i: ings.map(x => [ensureIng(x.n), x.q, x.u]), p: steps, o: 'perso', custom: true, ...(M.emo ? { emo: M.emo } : {}) };
      mutate('custom', l => id ? l.map(x => x.id === id ? rec : x) : [...l, rec]); rebuildCatalogue(); toast(id ? 'Recette modifiée' : 'Recette créée'); s.close(); if (onSaved) onSaved(rec); else if (!id) setTimeout(() => openRecipe(rec.id), 260); } }) });
  setTimeout(() => !src && nameIn.focus(), 300);
}

// ---------- filtres de recettes ----------
export function openFilters(onApply) {
  const cats = [...new Set(S.cat.list.filter(r => !r.custom).map(r => r.c))].sort((a, b) => a.localeCompare(b, 'fr')); const body = h('div', { class: 'form' });
  const toggle = (set, v) => { set.has(v) ? set.delete(v) : set.add(v); draw(); };
  const flag = (k, l) => chip(l, RUI.quick[k], () => { RUI.quick[k] = !RUI.quick[k]; draw(); });
  const draw = () => { clear(body); body.append(
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Temps maximum'), h('div', { class: 'chips wrap' }, [[0, 'Peu importe'], [15, '15 min'], [30, '30 min'], [45, '45 min'], [60, '1 h']].map(([v, l]) => chip(l, RUI.maxTime === v, () => { RUI.maxTime = v; draw(); })))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Appareil'), h('div', { class: 'chips wrap' }, chip('🧊 Sans cuisson', RUI.equip.has('none'), () => toggle(RUI.equip, 'none')), EQUIP.map(([k, l]) => chip(`${EQUIP_EMOJI[k]} ${l}`, RUI.equip.has(k), () => toggle(RUI.equip, k)))),
      h('div', { class: 'chips wrap' }, flag('myEquip', '✅ Seulement avec mon équipement'))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Cuisine'), h('div', { class: 'chips wrap' }, CUISINES.map(([k, l]) => chip(l, RUI.cuis.has(k), () => toggle(RUI.cuis, k))))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Type de plat'), h('div', { class: 'chips wrap' }, cats.map(c => chip(c, RUI.cats.has(c), () => toggle(RUI.cats, c))))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Envie de…'), h('div', { class: 'chips wrap' }, flag('cheap', '💰 Petit budget'), flag('never', '✨ Jamais cuisinées'), flag('chef', '👨‍🍳 Plus élaborées'), flag('mine', '📒 Mes recettes'))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Trier par'), h('div', { class: 'chips wrap' }, [['perso', 'Pour moi'], ['rapide', 'Les plus rapides'], ['eco', 'Les moins chères'], ['az', 'De A à Z']].map(([v, l]) => chip(l, RUI.sort === v, () => { RUI.sort = v; draw(); }))))); };
  draw();
  const s = openSheet({ title: 'Filtres', content: body, footer: h('div', { class: 'row gap' }, btn('Effacer', { class: 'btn ghost', onclick: () => { const q = RUI.q, quick = { ...RUI.quick }, m = RUI.moment, kc = RUI.kitchen; resetRUI(q); RUI.moment = m; RUI.kitchen = kc; for (const k of ['cook', 'anti', 'fast', 'veg', 'season', 'fav']) RUI.quick[k] = quick[k]; draw(); } }), btn('Voir les recettes', { class: 'btn primary grow', onclick: () => s.close() })),
    onClose: () => onApply && onApply() });
}
