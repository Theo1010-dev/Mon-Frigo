// Construit dist/ : la SEULE chose à mettre sur GitHub, avec TOUS les fichiers à plat (aucun dossier).
// Pourquoi à plat : l'envoi de fichiers par le site GitHub perd souvent les dossiers. Ici il n'y a rien à perdre.
//   ->  npm run build
import { build, transform } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const VERSION = rd('js/state.js').match(/export const VERSION = '([^']+)'/)[1];
const v = u => `${u}?v=${VERSION}`;
const flat = s => s.replace(/assets\/fonts\//g, '').replace(/assets\//g, '');   // chemins à plat

fs.rmSync(DIST, { recursive: true, force: true }); fs.mkdirSync(DIST, { recursive: true });
const put = (name, content) => { if (fs.existsSync(path.join(DIST, name))) throw new Error('doublon : ' + name); fs.writeFileSync(path.join(DIST, name), content); };
const copyFlat = dir => { for (const f of fs.readdirSync(path.join(ROOT, dir))) { const p = path.join(ROOT, dir, f); if (fs.statSync(p).isDirectory()) copyFlat(path.join(dir, f)); else if (!f.endsWith('.txt')) put(f, fs.readFileSync(p)); } };

await build({ entryPoints: [path.join(ROOT, 'js/app.js')], bundle: true, minify: true, format: 'iife', target: ['es2020', 'chrome90', 'safari15'], outfile: path.join(DIST, 'app.js'), legalComments: 'none', define: { __BUILD__: 'true' } });
put('styles.css', flat((await transform(rd('styles.css'), { loader: 'css', minify: true })).code));
copyFlat('assets'); copyFlat('data');
let html = flat(rd('index.html')).replace('href="styles.css"', `href="${v('styles.css')}"`).replace('<script type="module" src="js/app.js"></script>', `<script src="${v('app.js')}" defer></script>`)
  .replace('<link rel="modulepreload" href="js/app.js">', `<link rel="preload" href="${v('recipes.json')}" as="fetch" crossorigin>\n<link rel="preload" href="${v('ingredients.json')}" as="fetch" crossorigin>`);
if (html.includes('js/app.js') || html.includes('assets/')) throw new Error('index.html : chemin non converti');
put('index.html', html);
put('404.html', rd('404.html'));
put('manifest.webmanifest', flat(rd('manifest.webmanifest')));
put('version.json', JSON.stringify({ app: 'Mon Frigo', version: VERSION }) + '\n');
const files = fs.readdirSync(DIST);
const isOcr = f => /^(ocr-|tesseract-core|fra\.traineddata)/.test(f);
const core = ['./', ...files.filter(f => !['sw.js', '404.html', 'version.json'].includes(f) && !isOcr(f)).map(f => ['app.js', 'styles.css', 'recipes.json', 'ingredients.json'].includes(f) ? v(f) : f)];
put('sw.js', rd('sw.js').replace("const VERSION = 'dev';", `const VERSION = '${VERSION}';`).replace('const CORE = [];', `const CORE = ${JSON.stringify(core)};`));
for (const f of fs.readdirSync(DIST)) if (fs.statSync(path.join(DIST, f)).isDirectory()) throw new Error('dossier interdit dans dist : ' + f);
console.log(`dist/ v${VERSION} : ${fs.readdirSync(DIST).length} fichiers, tous à plat (app.js ${(fs.statSync(path.join(DIST, 'app.js')).size / 1024).toFixed(0)} Ko)`);
