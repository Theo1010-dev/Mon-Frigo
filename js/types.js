// Types de produits pour les articles inconnus : permettent aux recettes de les utiliser comme remplaçants.
import { norm } from './util.js';

export const TYPES = {
  fromage: { label: 'Fromage', role: 'cheese', cat: 'Crèmerie & œufs', zone: 'frigo', life: 14, sub: 'fromage', units: { 'pièce': 200, tranche: 25, paquet: 200 }, diet: ['dairy'], emoji: '🧀' },
  'fromage-frais': { label: 'Yaourt, fromage frais', role: 'dairy', cat: 'Crèmerie & œufs', zone: 'frigo', life: 10, sub: 'fromage-frais', units: { pot: 125, 'pièce': 125 }, diet: ['dairy'], emoji: '🥛' },
  charcuterie: { label: 'Charcuterie', role: 'meat', cat: 'Viandes & poissons', zone: 'frigo', life: 10, sub: 'charcuterie', units: { 'pièce': 250, tranche: 20, paquet: 150 }, diet: ['meat'], emoji: '🥓' },
  viande: { label: 'Viande', role: 'meat', cat: 'Viandes & poissons', zone: 'frigo', life: 3, sub: null, units: { 'pièce': 150, paquet: 400 }, diet: ['meat'], emoji: '🥩' },
  poisson: { label: 'Poisson, fruits de mer', role: 'fish', cat: 'Viandes & poissons', zone: 'frigo', life: 2, sub: 'poisson-blanc', units: { 'pièce': 125, 'boîte': 140 }, diet: ['fish'], emoji: '🐟' },
  legume: { label: 'Légume', role: 'veg', cat: 'Fruits & légumes', zone: 'frigo', life: 7, sub: null, units: { 'pièce': 200 }, diet: [], emoji: '🥬' },
  fruit: { label: 'Fruit', role: 'fruit', cat: 'Fruits & légumes', zone: 'autre', life: 7, sub: null, units: { 'pièce': 150 }, diet: [], emoji: '🍎' },
  feculent: { label: 'Féculent (pâtes, riz…)', role: 'starch', cat: 'Épicerie', zone: 'placard', life: 0, sub: null, units: { paquet: 500 }, diet: [], emoji: '🍚' },
  sauce: { label: 'Sauce, condiment', role: 'condiment', cat: 'Condiments & épices', zone: 'placard', life: 0, sub: null, units: {}, diet: [], emoji: '🫙' },
  sucre: { label: 'Sucré, goûter', role: 'sweet', cat: 'Épicerie', zone: 'placard', life: 0, sub: null, units: {}, diet: [], emoji: '🍪' },
  boisson: { label: 'Boisson', role: 'other', cat: 'Divers', zone: 'autre', life: 0, sub: null, units: {}, diet: [], emoji: '🥤' },
  autre: { label: 'Autre', role: 'other', cat: 'Divers', zone: 'frigo', life: 0, sub: null, units: {}, diet: [], emoji: '🛒' },
};
const KEYS = [ // l'ordre compte : du plus précis au plus large
  ['fromage-frais', ['yaourt', 'skyr', 'faisselle', 'petit suisse', 'fromage blanc', 'st moret', 'philadelphia', 'boursin', 'kiri', 'tartare']],
  ['fromage', ['fromage', 'brie', 'camembert', 'comte', 'gruyere', 'tomme', 'raclette', 'cantal', 'roquefort', 'munster', 'maroilles', 'reblochon', 'chevre', 'mozza', 'burrata', 'gorgonzola', 'emmental', 'mimolette', 'beaufort', 'abondance', 'ossau', 'manchego', 'pecorino', 'gouda', 'edam', 'morbier', 'vacherin', 'epoisses', 'chaource', 'neufchatel', 'caprice', 'babybel', 'cancoillotte', 'parmesan', 'feta', 'halloumi', 'cheddar', 'bleu d', 'saint nectaire', 'pont l', 'coulommiers', 'vache qui rit']],
  ['charcuterie', ['saucisson', 'jambon', 'coppa', 'bresaola', 'pancetta', 'lardon', 'bacon', 'rosette', 'salami', 'chorizo', 'andouille', 'rillettes', 'terrine', 'mortadelle', 'speck', 'lard ']],
  ['poisson', ['poisson', 'saumon', 'thon', 'cabillaud', 'colin', 'sardine', 'maquereau', 'truite', 'crevette', 'moule', 'calamar', 'surimi', 'crabe', 'hareng', 'sole', 'lieu', 'merlu', 'dorade', 'anchois', 'gambas', 'bar ']],
  ['viande', ['poulet', 'boeuf', 'porc', 'veau', 'agneau', 'dinde', 'canard', 'lapin', 'steak', 'cote de', 'roti', 'escalope', 'filet', 'entrecote', 'bavette', 'merguez', 'saucisse', 'cordon bleu', 'nugget', 'burger', 'kebab', 'viande']],
  ['fruit', ['pomme', 'poire', 'banane', 'orange', 'clementine', 'mandarine', 'kiwi', 'raisin', 'fraise', 'framboise', 'myrtille', 'cerise', 'peche', 'abricot', 'prune', 'melon', 'pasteque', 'ananas', 'mangue', 'pamplemousse', 'figue', 'grenade', 'litchi', 'fruit']],
  ['legume', ['salade', 'tomate', 'carotte', 'courgette', 'poivron', 'chou', 'haricot vert', 'petit pois', 'epinard', 'brocoli', 'navet', 'radis', 'concombre', 'aubergine', 'poireau', 'celeri', 'fenouil', 'asperge', 'betterave', 'champignon', 'echalote', 'potiron', 'courge', 'artichaut', 'endive', 'mache', 'roquette', 'legume', 'panais', 'patate']],
  ['feculent', ['pates', 'riz', 'semoule', 'quinoa', 'boulgour', 'lentille', 'pois chiche', 'gnocchi', 'nouille', 'ravioli', 'tortellini', 'polenta', 'farine', 'biscotte', 'cereale', 'muesli', 'spaghetti', 'macaroni', 'pomme de terre']],
  ['sucre', ['chocolat', 'biscuit', 'gateau', 'confiture', 'miel', 'bonbon', 'glace', 'pate a tartiner', 'nutella', 'compote', 'creme dessert', 'cookie', 'brioche', 'madeleine', 'gaufre', 'sucre', 'cereales']],
  ['sauce', ['sauce', 'ketchup', 'mayo', 'moutarde', 'pesto', 'vinaigrette', 'huile', 'vinaigre', 'bouillon', 'epice', 'condiment', 'tapenade', 'harissa', 'cornichon']],
  ['boisson', ['jus', 'soda', 'biere', 'vin ', 'sirop', 'the ', 'cafe', 'coca', 'limonade', 'boisson', 'smoothie', 'eau ']],
];
export function guessType(name) {
  const n = ' ' + norm(name) + ' ';
  for (const [type, words] of KEYS) if (words.some(w => n.includes(w.endsWith(' ') ? ' ' + w : w))) return type;
  return 'autre';
}
