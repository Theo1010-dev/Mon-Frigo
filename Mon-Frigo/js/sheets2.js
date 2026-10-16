// Feuilles : fiche recette, mode cuisine, fin de cuisson, recettes perso, onboarding, import.
import { h, btn, openSheet, confirmSheet, toast, stepper, seg, chip, field, tile, plate, meta, tint, clear, haptic } from './ui.js';
import { icon } from './icons.js';
import { S, mutate, set, setPref, ctx, ensureIng, rebuildCatalogue, DEFAULT_PREFS, KEYS, db } from './state.js';
import * as A from './actions.js';
import { coverage, scaleIngredients, EQUIP } from './recipes.js';
import { fmtQty, UNITS_UI, canonUnit } from './units.js';
import { todayISO, addDays, dayName, fmtDateShort, money, uid, norm } from './util.js';
import { SLOTS } from './plan.js';
import { nav, num } from './nav.js';
import { openPlanPicker } from './sheets1.js';
import * as Backup from './backup.js';

const kb = S.kb;
const ingName = id => kb.name(id, id);
const SOURCE_LABEL = { classique: 'Classique', compose: 'Idée composée', perso: 'Ma recette' };

// ---------- fiche recette ----------
export function openRecipe(rid, opts = {}) {
  const r = S.cat.get(rid); if (!r) { toast('Recette introuvable'); return; }
  let serv = opts.serv || S.data.prefs.people || r.s || 2;
  const ingBox = h('div', { class: 'stack' });
  const favBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Favori', onclick: () => { A.toggleFav(rid); paintFav(); haptic(10); } }, icon('heart', 22));
  const paintFav = () => { const on = S.data.fav.includes(rid); favBtn.classList.toggle('on', on); favBtn.setAttribute('aria-pressed', String(on)); favBtn.querySelector('svg').setAttribute('fill', on ? 'currentColor' : 'none'); };
  function drawIng() {
    clear(ingBox); const cov = coverage(r, serv, S.data.stock, kb, todayISO(), { outStaples: S.data.prefs.outStaples });
    const stateIc = { full: ['check', 'ok'], partial: ['alert', 'soon'], none: ['x', 'urgent'], staple: ['check', 'muted'], unknown: ['check', 'ok'] };
    if (cov.total) ingBox.append(h('div', { class: 'cov-line ' + (cov.all ? 'good' : '') }, icon(cov.all ? 'check' : 'cart', 18), cov.all ? 'Tu as tous les ingrédients' : `Il te manque ${cov.missing.length} ingrédient${cov.missing.length > 1 ? 's' : ''}`));
    const ul = h('ul', { class: 'ings' });
    for (const row of cov.rows) {
      const [ic, cls] = stateIc[row.state], k = kb.get(row.id);
      const sub = row.state === 'partial' ? `Tu en as ${fmtQty(row.have, row.need.unit)}, il en manque ${fmtQty(row.missing.qty, row.missing.unit)}` : row.state === 'none' ? 'Pas dans ton stock' : row.state === 'staple' ? 'Produit de base' : row.state === 'unknown' ? 'Dans ton stock' : (row.expiring !== false && row.expiring <= 3 ? 'À consommer vite' : 'Dans ton stock');
      ul.append(h('li', { class: 'ing ' + row.state }, h('span', { class: 'e' }, k ? k.emoji : '•'), h('span', { class: 'grow' }, h('span', { class: 'strong block' }, ingName(row.id)), h('span', { class: 'muted sm' }, sub)), h('span', { class: 'qty' }, fmtQty(row.need.qty, row.need.unit)), h('span', { class: 'st ' + cls, title: sub }, icon(ic, 14))));
    }
    ingBox.append(ul);
    if (cov.missing.length) ingBox.append(btn(`Ajouter ${cov.missing.length > 1 ? `les ${cov.missing.length} produits manquants` : 'le produit manquant'} aux courses`, { class: 'btn soft block', onclick: () => { const n = A.addMissingToShop(cov.missing); toast(n ? `${n} produit${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''} aux courses` : 'Déjà dans tes courses'); } }, 'cart'));
  }
  const top = h('div', { class: 'r-top', style: tint(r) }, plate(r, kb, 'xxl'), h('h1', null, r.t),
    meta([['clock', `${r.m} min`], ['utensils', r.d], r.costKnown && r.costPer > 0 ? ['coin', `≈ ${money(r.costPer)} par pers.`] : null]),
    h('div', { class: 'badges' }, h('span', { class: 'badge' }, SOURCE_LABEL[r.o] || 'Recette'), h('span', { class: 'badge' }, r.c), r.veg ? h('span', { class: 'badge ok' }, 'Végétarien') : null, h('span', { class: 'badge', title: 'Indice d’équilibre indicatif, pas un avis nutritionnel' }, r.bal.label)));
  const servRow = h('div', { class: 'serv-row' }, h('h2', null, 'Pour'), stepper(serv, { min: 1, max: 12, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => { serv = v; drawIng(); } }));
  const actions = h('div', { class: 'r-actions' }, favBtn, btn('Planifier', { class: 'btn soft', onclick: () => openPlanFromRecipe(r, () => serv) }, 'calendar'),
    r.custom ? btn('Modifier', { class: 'btn soft', onclick: () => { s.close(); setTimeout(() => openCustomRecipe({ id: rid }), 260); } }, 'edit') : btn('Adapter', { class: 'btn soft', onclick: () => { s.close(); setTimeout(() => openCustomRecipe({ from: rid, serv }), 260); } }, 'copy'));
  const steps = h('ol', { class: 'steps' }, r.p.map(t => h('li', null, t)));
  const body = h('div', { class: 'recipe' }, top, h('div', { class: 'r-body' }, servRow, actions, h('h2', null, 'Ingrédients'), ingBox, h('h2', null, 'Préparation'), steps,
    r.custom ? null : h('p', { class: 'note' }, 'Recette non testée en conditions réelles : goûte et ajuste l’assaisonnement et les cuissons.')));
  const s = openSheet({ title: r.t, size: 'full r-sheet', content: body, footer: btn('Cuisiner', { class: 'btn primary block big', onclick: () => { s.close(); setTimeout(() => openCook(rid, serv), 260); } }, 'flame') });
  paintFav(); drawIng(); return s;
}
export function openPlanFromRecipe(r, getServ) {
  const t = todayISO(); let date = t, slot = A.currentMealSlot();
  const days = Array.from({ length: 14 }, (_, i) => addDays(t, i)); const box = h('div');
  const draw = () => { clear(box); box.append(h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quel jour ?'), h('div', { class: 'chips scroll' }, days.map((d, i) => chip(i === 0 ? "Aujourd'hui" : i === 1 ? 'Demain' : `${dayName(d).slice(0, 3)}. ${fmtDateShort(d)}`, d === date, () => { date = d; draw(); })))), h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Quel repas ?'), seg(SLOTS.map(([k, l]) => [k, l]), slot, v => { slot = v; })), (S.data.plan[date] || {})[slot] ? h('p', { class: 'note warn' }, 'Ce créneau est déjà occupé : il sera remplacé.') : null); };
  draw();
  const s = openSheet({ title: 'Planifier', size: 'small', content: box, footer: btn('Ajouter au planning', { class: 'btn primary block', onclick: () => { A.planSet(date, slot, r.id, getServ()); toast(`Ajouté : ${dayName(date)} ${slot === 'lunch' ? 'midi' : 'soir'}`); s.close(); } }) });
}

// ---------- mode cuisine ----------
export function detectTimers(text) {
  const out = [], re = /(\d+)(?:\s*(?:à|-|–)\s*(\d+))?\s*(h(?:eures?)?|min(?:utes?)?)(?![a-zà-ü])/gi; let m;
  while ((m = re.exec(text))) { const a = +m[1], b = m[2] ? +m[2] : a, mins = (/^h/i.test(m[3]) ? 60 : 1) * Math.max(a, b); if (mins >= 1 && mins <= 240 && !out.some(o => o.sec === mins * 60)) out.push({ sec: mins * 60, label: mins >= 60 ? `${Math.floor(mins / 60)} h${mins % 60 ? ' ' + (mins % 60) : ''}` : `${mins} min` }); }
  return out;
}
let audioCtx; function beep() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); [0, 0.35, 0.7].forEach(t => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(0.2, audioCtx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + 0.25); o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + 0.3); }); } catch {} }
const fmtClock = sec => { sec = Math.max(0, Math.ceil(sec)); const m = Math.floor(sec / 60), s2 = sec % 60; return `${m}:${String(s2).padStart(2, '0')}`; };

export function openCook(rid, serv, { resume } = {}) {
  const r = S.cat.get(rid); if (!r) return;
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
    const det = detectTimers(txt); if (det.length) stepBox.append(h('div', { class: 'chips wrap' }, det.map(d => btn(`Minuteur ${d.label}`, { class: 'chip timer', onclick: () => addTimer(d.sec, d.label) }, 'timer'))));
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
  ingPanel.append(h('ul', { class: 'ings' }, scaleIngredients(r, serv).map(([id, q, u]) => h('li', { class: 'ing' }, h('span', { class: 'e' }, kb.get(id) ? kb.get(id).emoji : '•'), h('span', { class: 'grow strong' }, ingName(id)), h('span', { class: 'qty' }, fmtQty(q, u))))));
  const s = openSheet({ title: r.t, size: 'full', onClose: () => { clearInterval(iv); document.removeEventListener('visibilitychange', vis); try { wake && wake.release(); } catch {} wake = null; },
    content: h('div', { class: 'cook' }, prog, stepBox, timersBox, ingBtn, ingPanel),
    footer: h('div', { class: 'row gap' }, prevBtn, nextBtn) });
  drawStep(); drawTimers(); tick();
  return s;
}

// ---------- fin de cuisson : stock, restes, note ----------
export function openFinishCook(rid, serv) {
  const r = S.cat.get(rid); if (!r) return; const rows = A.cookPreview(r, serv); const sel = new Set(rows.filter(x => x.usedAny).map(x => x.id));
  let leftovers = 0, rating = 0; const list = h('div'); const stars = h('div', { class: 'stars' });
  const drawStars = () => { clear(stars); for (let i = 1; i <= 5; i++) stars.append(h('button', { type: 'button', class: 'star' + (i <= rating ? ' on' : ''), 'aria-label': `${i} étoile${i > 1 ? 's' : ''}`, onclick: () => { rating = rating === i ? 0 : i; drawStars(); } }, icon('star', 28))); };
  const drawList = () => { clear(list); if (!rows.length) list.append(h('p', { class: 'muted' }, 'Rien à retirer : tu n’avais que des produits de base.')); for (const x of rows) { const can = x.usedAny; list.append(h('label', { class: 'check row-check' + (can ? '' : ' off') }, h('input', { type: 'checkbox', checked: sel.has(x.id), disabled: !can, onchange: e => { e.target.checked ? sel.add(x.id) : sel.delete(x.id); } }), h('span', { class: 'grow' }, h('span', { class: 'strong' }, x.name), h('span', { class: 'muted sm block' }, !can ? 'Pas en stock' : x.missing > 0 ? 'Stock insuffisant : tout sera retiré' : 'Sera retiré du stock')), h('span', { class: 'qty' }, fmtQty(x.need.qty, x.need.unit)))); } };
  drawList(); drawStars();
  const s = openSheet({ title: 'Bon appétit ! 🎉', size: 'tall', content: h('div', { class: 'form' }, h('p', { class: 'muted' }, 'Je retire du stock ce que tu as utilisé. Décoche ce qui ne correspond pas.'), list,
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Portions restantes (mises au frigo 3 jours)'), stepper(0, { min: 0, max: serv, onChange: v => { leftovers = v; } })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ta note (facultatif)'), stars)),
    footer: btn('Terminer', { class: 'btn primary block big', onclick: () => {
      const before = JSON.parse(JSON.stringify(S.data.stock)), histBefore = S.data.history.slice(), planBefore = JSON.parse(JSON.stringify(S.data.plan));
      A.applyCook(r, serv, [...sel]); const entry = A.logCooked(r, serv, rating); A.markPlanDone(rid); if (leftovers > 0) A.addLeftovers(r.t, leftovers); set('cook', null); haptic(25); s.close();
      toast('Stock mis à jour', { undo: () => { set('stock', before); set('history', histBefore); set('plan', planBefore); } }); } }),
    onClose: () => {} });
}

// ---------- recette personnelle ----------
export function openCustomRecipe({ id, from, serv } = {}) {
  const src = id ? S.cat.get(id) : from ? S.cat.get(from) : null;
  const nameIn = h('input', { class: 'input', placeholder: 'Nom de la recette', value: src ? (from ? src.t + ' (ma version)' : src.t) : '' });
  const time = h('input', { class: 'input', inputmode: 'numeric', value: src ? src.m : 30, 'aria-label': 'Durée en minutes' });
  const servIn = h('input', { class: 'input', inputmode: 'numeric', value: from ? (serv || src.s) : (src ? src.s : 2), 'aria-label': 'Nombre de personnes' });
  const ingBox = h('div', { class: 'ing-edit' }); const rowsData = [];
  const addRow = (nm = '', q = '', u = 'g') => {
    const n = h('input', { class: 'input', placeholder: 'Ingrédient', value: nm, 'aria-label': 'Ingrédient' }), qi = h('input', { class: 'input', inputmode: 'decimal', placeholder: 'Qté', value: q, 'aria-label': 'Quantité' }), un = h('select', { class: 'input', 'aria-label': 'Unité' }, UNITS_UI.map(x => h('option', { value: x, selected: x === canonUnit(u) })), []);
    for (const o of un.options) o.textContent = o.value;
    const row = h('div', { class: 'ing-row' }, n, qi, un, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Retirer', onclick: () => { row.remove(); rowsData.splice(rowsData.indexOf(o), 1); } }, icon('x', 16))); const o = { n, qi, un }; rowsData.push(o); ingBox.append(row);
  };
  if (src) { const f = from ? (serv || src.s) / src.s : 1; for (const [iid, q, u] of src.i) addRow(ingName(iid), Math.round(q * f * 100) / 100, u); } else { addRow(); addRow(); }
  const stepsIn = h('textarea', { class: 'input', rows: 6, placeholder: 'Une étape par ligne' }); stepsIn.value = src ? src.p.join('\n') : '';
  const s = openSheet({ title: id ? 'Modifier ma recette' : from ? 'Adapter la recette' : 'Nouvelle recette', size: 'tall',
    content: h('div', { class: 'form' }, field('Nom', nameIn), h('div', { class: 'row gap' }, h('div', { class: 'grow' }, field('Durée (min)', time)), h('div', { class: 'grow' }, field('Personnes', servIn))),
      h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ingrédients'), ingBox, btn('Ajouter un ingrédient', { class: 'btn link', onclick: () => addRow() }, 'plus')), field('Étapes', stepsIn),
      id ? btn('Supprimer cette recette', { class: 'btn link danger-text', onclick: async () => { if (await confirmSheet({ title: 'Supprimer ?', text: 'Cette recette sera définitivement supprimée.', ok: 'Supprimer', danger: true })) { mutate('custom', l => l.filter(x => x.id !== id)); mutate('fav', f => f.filter(x => x !== id)); rebuildCatalogue(); toast('Recette supprimée'); s.close(); } } }) : null),
    footer: btn('Enregistrer', { class: 'btn primary block', onclick: () => {
      const t = nameIn.value.trim(), steps = stepsIn.value.split('\n').map(x => x.trim()).filter(Boolean);
      const ings = rowsData.map(o => ({ n: o.n.value.trim(), q: num(o.qi.value), u: o.un.value })).filter(x => x.n);
      if (!t) { toast('Donne un nom à ta recette'); nameIn.focus(); return; } if (!ings.length) { toast('Ajoute au moins un ingrédient'); return; } if (!steps.length) { toast('Ajoute au moins une étape'); stepsIn.focus(); return; }
      if (ings.some(x => !(x.q > 0))) { toast('Chaque ingrédient doit avoir une quantité'); return; }
      const rec = { id: id || 'perso-' + uid(), t, c: 'Mes recettes', d: 'Facile', m: Math.max(1, parseInt(time.value) || 30), s: Math.max(1, parseInt(servIn.value) || 2), e: [], g: [], k: '', mt: ['Déjeuner', 'Dîner'], i: ings.map(x => [ensureIng(x.n), x.q, x.u]), p: steps, o: 'perso', custom: true };
      mutate('custom', l => id ? l.map(x => x.id === id ? rec : x) : [...l, rec]); rebuildCatalogue(); toast(id ? 'Recette modifiée' : 'Recette créée'); s.close(); if (!id) setTimeout(() => openRecipe(rec.id), 260); } }) });
  setTimeout(() => !src && nameIn.focus(), 300);
}

// ---------- premier lancement ----------
export function openOnboarding() {
  const p = { ...S.data.prefs }; const box = h('div', { class: 'form' });
  const draw = () => { clear(box); box.append(
    h('p', { class: 'muted' }, 'Quelques réglages pour des recettes et des courses adaptées. Tu pourras tout changer dans « Moi ».'),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Pour combien de personnes cuisines-tu ?'), stepper(p.people, { min: 1, max: 10, fmt: v => `${v} personne${v > 1 ? 's' : ''}`, onChange: v => { p.people = v; } })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Budget courses par semaine (€)'), h('input', { class: 'input', inputmode: 'numeric', value: p.budget, onchange: e => { p.budget = Math.max(0, parseInt(e.target.value) || 0); } })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Régime'), seg([['omni', 'Tout'], ['pesco', 'Pesco'], ['veg', 'Végé'], ['vegan', 'Végan']], p.diet, v => { p.diet = v; })),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Ton équipement'), h('div', { class: 'chips wrap' }, EQUIP.map(([k, l]) => chip(l, p.equip.includes(k), () => { p.equip = p.equip.includes(k) ? p.equip.filter(x => x !== k) : [...p.equip, k]; draw(); })))),
    h('div', { class: 'field' }, h('span', { class: 'lab' }, 'Aliments que tu évites (séparés par des virgules)'), h('input', { class: 'input', placeholder: 'champignons, poisson…', value: p.dislikes.join(', '), onchange: e => { p.dislikes = e.target.value.split(',').map(x => x.trim()).filter(Boolean); } }))); };
  draw();
  const s = openSheet({ title: 'Bienvenue 👋', size: 'tall', content: box, onClose: () => { if (!S.data.prefs.onboarded) setPref({ onboarded: true }); },
    footer: btn('Commencer', { class: 'btn primary block big', onclick: () => { document.activeElement && document.activeElement.blur(); setPref({ ...p, onboarded: true }); s.close(); } }) });
}

// ---------- import de sauvegarde ----------
export function openImport(file) {
  const rd = new FileReader();
  rd.onerror = () => toast('Impossible de lire ce fichier');
  rd.onload = () => {
    let obj; try { obj = JSON.parse(rd.result); } catch { toast('Ce fichier n’est pas un JSON valide'); return; }
    const v = Backup.validate(obj); if (!v.ok) { toast(v.errors[0]); return; }
    const c = v.counts; const s = openSheet({ title: 'Importer une sauvegarde', size: 'small', content: h('div', { class: 'form' }, h('p', null, `Cette sauvegarde contient ${c.stock} produit(s) en stock, ${c.shop} article(s) de courses, ${c.history} repas cuisinés, ${c.custom} recette(s) perso, ${c.fav} favori(s).`), h('p', { class: 'muted' }, 'Un point de restauration de tes données actuelles est créé automatiquement avant tout import.')),
      footer: h('div', { class: 'row gap' }, btn('Fusionner', { class: 'btn soft grow', onclick: () => apply('merge') }), btn('Remplacer', { class: 'btn danger grow', onclick: () => apply('replace') })) });
    function apply(mode) {
      const cur = Object.fromEntries(KEYS.map(k => [k, S.data[k]])); db.put('preImport', cur);
      const base = Backup.normalize({}, { ...Object.fromEntries(KEYS.map(k => [k, Array.isArray(S.data[k]) ? [] : (typeof S.data[k] === 'object' && S.data[k] ? {} : null)])), prefs: { ...DEFAULT_PREFS }, meta: { created: todayISO(), lastBackup: null, flagged: [] } });
      const inc = obj.data; const next = mode === 'merge' ? Backup.merge(cur, inc) : Backup.normalize(inc, base);
      for (const k of KEYS) { S.data[k] = next[k]; db.put(k, next[k]); } for (const ci of S.data.customIng) kb.add(ci); rebuildCatalogue(); set('prefs', S.data.prefs);
      s.close(); toast(mode === 'merge' ? 'Sauvegarde fusionnée' : 'Sauvegarde restaurée', { undo: () => restorePre() }); }
  };
  rd.readAsText(file);
}
export async function restorePre() {
  const all = await db.loadAll(); const pre = all.preImport; if (!pre) { toast('Aucun point de restauration disponible'); return false; }
  for (const k of KEYS) if (pre[k] !== undefined) { S.data[k] = pre[k]; db.put(k, pre[k]); } for (const ci of S.data.customIng) kb.add(ci); rebuildCatalogue(); set('prefs', S.data.prefs); toast('Données précédentes restaurées'); return true;
}
