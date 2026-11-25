// Produit Open Food Facts (code-barres) -> nom propre, quantité, et association fiable grâce à sa catégorie.
import { sizeFromName, stripSize } from './receipt.js';
import { guessType } from './types.js';

// catégories OFF (de la plus générale à la plus précise) -> ingrédient de l'app
const CAT = {
  'en:mayonnaises': 'mayonnaise', 'en:mustards': 'moutarde', 'en:dijon-mustards': 'moutarde', 'en:ketchup': 'ketchup', 'en:pastas': 'pates', 'en:dry-pastas': 'pates', 'en:rices': 'riz', 'en:basmati-rices': 'riz',
  'en:milks': 'lait', 'en:semi-skimmed-milks': 'lait', 'en:yogurts': 'yaourt', 'en:plain-yogurts': 'yaourt', 'en:butters': 'beurre', 'en:creams': 'creme', 'en:fresh-creams': 'creme', 'en:eggs': 'oeufs', 'en:chicken-eggs': 'oeufs',
  'en:hams': 'jambon', 'en:cooked-hams': 'jambon', 'en:white-hams': 'jambon', 'en:dry-hams': 'jambon-cru', 'en:cured-hams': 'jambon-cru', 'en:prosciutto': 'jambon-cru', 'en:bacon': 'lardons', 'en:lardons': 'lardons',
  'en:sausages': 'saucisses', 'en:dry-sausages': 'saucisson', 'en:chorizos': 'chorizo', 'en:grated-cheese': 'fromage-rape', 'en:grated-cheeses': 'fromage-rape', 'en:camemberts': 'brie', 'en:bries': 'brie',
  'en:soft-cheeses-with-bloomy-rind': 'brie', 'en:emmentals': 'emmental', 'en:emmental': 'emmental', 'en:comte': 'emmental', 'en:mozzarella': 'mozzarella', 'en:goat-cheeses': 'chevre', 'en:feta': 'feta',
  'en:parmigiano-reggiano': 'parmesan', 'en:parmesan': 'parmesan', 'en:blue-cheeses': 'fromage-bleu', 'en:ricotta': 'ricotta', 'en:mascarpone': 'mascarpone', 'en:cream-cheeses': 'fromage-frais', 'en:raclette-cheeses': 'raclette',
  'en:tomato-sauces': 'tomate-concassee', 'en:crushed-tomatoes': 'tomate-concassee', 'en:canned-tomatoes': 'tomate-concassee', 'en:tomato-pastes': 'tomate-concassee', 'en:canned-tunas': 'thon', 'en:tunas': 'thon',
  'en:smoked-salmons': 'saumon-fume', 'en:salmons': 'saumon', 'en:chickpeas': 'pois-chiches', 'en:lentils': 'lentilles', 'en:red-lentils': 'lentilles-corail', 'en:kidney-beans': 'haricots-rouges', 'en:white-beans': 'haricots-blancs',
  'en:flours': 'farine', 'en:wheat-flours': 'farine', 'en:sugars': 'sucre', 'en:honeys': 'miel', 'en:chocolates': 'chocolat', 'en:dark-chocolates': 'chocolat', 'en:olive-oils': 'huile-olive', 'en:vegetable-oils': 'huile-olive',
  'en:vinegars': 'vinaigre', 'en:soy-sauces': 'sauce-soja', 'en:coconut-milks': 'lait-coco', 'en:breads': 'pain', 'en:sliced-breads': 'pain-mie', 'en:tortillas': 'wrap', 'en:wraps': 'wrap', 'en:pizza-doughs': 'pate-pizza',
  'en:puff-pastries': 'pate-feuilletee', 'en:shortcrust-pastries': 'pate-brisee', 'en:frozen-vegetables': 'legumes-surgeles', 'en:frozen-fried-potatoes': 'frites', 'en:french-fries': 'frites', 'en:frozen-pizzas': 'pizza-surgelee',
  'en:ice-creams': 'glace', 'en:fruit-juices': 'jus-fruits', 'en:coffees': 'cafe', 'en:teas': 'the', 'en:compotes': 'compote', 'en:applesauces': 'compote', 'en:rolled-oats': 'flocons-avoine', 'en:mueslis': 'flocons-avoine',
  'en:gnocchi': 'gnocchis', 'en:noodles': 'nouilles', 'en:couscous': 'semoule', 'en:quinoa': 'quinoa', 'en:bulgur': 'boulgour', 'en:plant-based-milks': 'lait-vegetal', 'en:hummus': 'houmous', 'en:pestos': 'pesto',
  'en:olives': 'olives', 'en:gherkins': 'cornichons', 'en:pickles': 'cornichons', 'en:sweet-corn': 'mais', 'en:paprika': 'paprika', 'en:cumin': 'cumin', 'en:curry-powders': 'curry', 'en:cinnamon': 'cannelle',
  'en:baking-powders': 'levure', 'en:breadcrumbs': 'chapelure', 'en:bouillon-cubes': 'bouillon', 'en:broths': 'bouillon', 'en:tofu': 'tofu', 'en:falafels': 'falafels', 'en:corn-starches': 'maizena', 'en:biscuits': 'biscuits',
};
const TYPE_TAG = [['en:cheeses', 'fromage'], ['en:dairies', 'fromage-frais'], ['en:charcuteries', 'charcuterie'], ['en:meats', 'viande'], ['en:fishes', 'poisson'], ['en:seafood', 'poisson'], ['en:fruits', 'fruit'],
  ['en:vegetables', 'legume'], ['en:cereals-and-potatoes', 'feculent'], ['en:sauces', 'sauce'], ['en:condiments', 'sauce'], ['en:spices', 'sauce'], ['en:sweet-snacks', 'sucre'], ['en:snacks', 'sucre'], ['en:beverages', 'boisson']];
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function fromOFF(p, kb) {
  const raw = String(p.product_name_fr || p.product_name || p.generic_name_fr || p.generic_name || '').trim();
  const brand = String(p.brands || '').split(',')[0].trim();
  // quantité : champ « quantity » (« 4 x 125 g », « 260 g », « 1 L »), sinon dans le nom
  let qty = null, unit = null; const qs = String(p.quantity || '');
  const multi = qs.match(/(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(kg|g|l|cl|ml)\b/i);
  if (multi) { qty = parseInt(multi[1]) * parseFloat(multi[2].replace(',', '.')); unit = multi[3].toLowerCase(); }
  else { const sz = sizeFromName(qs).size || sizeFromName(raw).size; if (sz) { qty = sz.qty; unit = sz.unit; } }
  let name = stripSize(raw).replace(/\s*[-–,]\s*$/, '').trim();
  if (brand) name = name.replace(new RegExp('\\b' + esc(brand) + '\\b', 'i'), '').replace(/\s{2,}/g, ' ').trim();
  if (!name) name = raw;
  name = name ? name[0].toUpperCase() + name.slice(1) : '';
  const tags = p.categories_tags || []; let ing = null, type = null;
  for (const t of tags) if (CAT[t] && kb.get(CAT[t])) ing = CAT[t]; // la dernière catégorie reconnue est la plus précise
  if (!ing) ing = kb.resolve(name) || kb.resolve(raw);
  if (!ing) { for (const [t, ty] of TYPE_TAG) if (tags.includes(t)) type = ty; type = type || guessType(name); }
  return { name: brand ? `${name} ${brand}` : name, qty, unit, ing, type };
}
