// « Comment ça marche » : le mode d'emploi de l'app, onglet par onglet, en quelques lignes.
import { h, openSheet } from './ui.js';
import { icon } from './icons.js';

const SECTIONS = [
  ['🏠', 'Accueil', ['Une idée de repas adaptée à l’heure et à ton frigo : « Voir la recette » ou le bouton d’à côté pour une autre idée.', 'Les produits « à consommer vite » sont en tête, avec des idées anti-gaspi.', '« Aujourd’hui » montre tes repas prévus ; touche « + » pour en ajouter un.']],
  ['🧊', 'Stock', ['Bouton « + » : un produit, l’ajout rapide (plusieurs d’un coup), le scanner de code-barres ou le ticket de caisse.', 'La date limite est estimée toute seule ; tu peux la corriger dans la fiche du produit.', 'Touche un produit pour sa fiche : « J’en ai utilisé », congeler, jeter, ajouter aux courses.', '« Liste » ou « Ma cuisine » : la même chose, en liste ou rangée dans un frigo dessiné.', '« Toujours chez moi » : ce que tu as en permanence (sel, huile…). Ça compte toujours comme disponible.', 'Dans « Ma cuisine », touche « Appareils » sur le plan de travail pour cocher tes appareils : plaques, four, micro-ondes, mixeur, air fryer, Thermomix, Cookeo, barbecue, raclette, gaufrier. Dans Recettes → Filtres, « Appareil » montre les recettes d’un appareil précis.']],
  ['🍽️', 'Recettes', ['En haut : Plats, Entrées, Apéro, Desserts, P’tit déj. Puis des filtres rapides (faisable, anti-gaspi, rapide, végé…).', '« Filtres » pour le temps, la cuisine du monde, le type de plat, le budget et le tri.', 'La pastille verte « Tout est là » veut dire que tu as tous les ingrédients. Une recette grisée demande un appareil que tu n’as pas et qu’aucun des tiens ne remplace (« Il faut un four ») ; quand un de tes appareils fait l’affaire (burger à la poêle, frites au four…), la fiche explique comment. Règle tes appareils dans Moi → Mon équipement.', 'Dans une recette : change le nombre de personnes, ajoute ce qui manque aux courses, ou lance le mode cuisine (étapes en grand, minuteurs, stock mis à jour à la fin).', '« + » en haut pour créer ta propre recette ; 🎲 pour une idée au hasard.']],
  ['📅', 'Semaine', ['Touche un jour en haut, puis « + » sur le midi ou le soir.', 'Tape n’importe quel plat (« raclette », « resto »…) puis Entrée : c’est planifié. Tes plats habituels deviennent des raccourcis.', 'Les « … » d’un repas : voir la recette, j’ai cuisiné, déplacer, remplacer, retirer.', '« Proposer des repas » remplit les cases vides ; « Faire les courses » prépare la liste avec ce qui manque.']],
  ['🛒', 'Courses', ['La liste se range par rayon. Coche en faisant tes courses.', 'En rentrant, « Ranger » met les produits cochés dans ton stock, avec leurs dates.', 'Tu peux partager la liste par message.']],
  ['💬', 'Assistant', ['Le petit frigo à toque, en haut de l’accueil, c’est Frigo, ton assistant (aussi dans Moi).', 'Écris-lui comme à quelqu’un, même avec des fautes ou en abrégé : « on mange quoi ce soir ? », « ajoute du lait aux courses et mets des lasagnes demain soir », « j’ai fini le beurre », « je n’aime pas les champignons ».', 'Il répond aussi aux questions de cuisine : cuissons (« œuf mollet ? », « combien de temps cuire le riz ? »), conversions (« 180 °C c’est quel thermostat ? »), conservation, astuces (« ma sauce est trop salée ») et mode d’emploi de l’app.', 'Après une idée, tu peux préciser : « plus rapide », « sans viande », « d’autres ».', 'Tu peux aussi lui parler avec le micro (la dictée a besoin d’internet).', 'Il répond avec ton stock et tes habitudes. Tout reste sur ton téléphone.']],
  ['🧙', 'Profil, XP et personnage', ['L’anneau autour de ton personnage se remplit avec l’XP du niveau.', 'Le point orange veut dire qu’un nouvel objet est débloqué : touche ton portrait pour l’essayer.', 'L’XP se gagne en utilisant l’app normalement : cuisiner, sauver un produit, planifier, noter un repas…']],
  ['💾', 'Tes données', ['Tout est enregistré sur ton téléphone et marche sans internet.', 'Moi → Sauvegarde : télécharge une copie de temps en temps, ou envoie tout vers un autre téléphone.', 'Une mise à jour de l’app ne touche jamais à tes données. N’utilise pas « Effacer les données du site » dans Chrome.']],
];

export function openGuide(start) {
  const body = h('div', { class: 'guide' }, h('p', { class: 'muted' }, 'L’essentiel de chaque onglet en quelques lignes. Touche une rubrique pour l’ouvrir.'),
    ...SECTIONS.map(([e, t, lines], i) => {
      const open = start ? t === start : i === 0;
      const box = h('div', { class: 'g-sec' + (open ? ' open' : '') });
      const head = h('button', { type: 'button', class: 'g-head', 'aria-expanded': String(open), onclick: () => { const o = !box.classList.contains('open'); box.classList.toggle('open', o); head.setAttribute('aria-expanded', String(o)); } },
        h('span', { class: 'g-e', 'aria-hidden': 'true' }, e), h('span', { class: 'grow strong' }, t), icon('down', 18));
      box.append(head, h('ul', { class: 'g-body' }, lines.map(l => h('li', null, l))));
      return box;
    }));
  openSheet({ title: 'Comment ça marche', size: 'tall', content: body });
}
