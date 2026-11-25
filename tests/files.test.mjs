// Contrôle du dossier dist/ (ce qui part sur GitHub) : fichiers présents, versions alignées, pas de fichier oublié.
import fs from 'node:fs';
const errs = [], D = 'dist/';
if (!fs.existsSync(D + 'index.html')) { console.log('dist/ absent : lance npm run build'); process.exit(1); }
const sw = fs.readFileSync(D + 'sw.js', 'utf8'), html = fs.readFileSync(D + 'index.html', 'utf8');
const version = fs.readFileSync('js/state.js', 'utf8').match(/VERSION = '([^']+)'/)[1], pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const core = JSON.parse(sw.match(/const CORE = (\[.*?\]);/)[1]);
for (const u of core) { const f = u.split('?')[0]; if (f !== './' && !fs.existsSync(D + f)) errs.push('absent de dist : ' + f); }
if (!sw.includes(`const VERSION = '${version}'`)) errs.push('version du service worker différente');
if (pkg.version !== version) errs.push(`package.json ${pkg.version} ≠ app ${version}`);
for (const m of html.matchAll(/(?:href|src)="([^"#:]+)"/g)) { const f = m[1].split('?')[0]; if (f && !fs.existsSync(D + f)) errs.push('index.html référence un fichier absent : ' + f); }
if (!html.includes(`app.js?v=${version}`) || !html.includes(`styles.css?v=${version}`)) errs.push('index.html ne pointe pas vers les fichiers versionnés');
if (/type="module"/.test(html)) errs.push('index.html charge encore des modules séparés');
for (const i of JSON.parse(fs.readFileSync(D + 'manifest.webmanifest', 'utf8')).icons) if (!fs.existsSync(D + i.src)) errs.push('icône manquante : ' + i.src);
for (const f of fs.readdirSync(D)) if (fs.statSync(D + f).isDirectory()) errs.push('dossier dans dist (interdit, tout doit être à plat) : ' + f);
const css = fs.readFileSync(D + 'styles.css', 'utf8'); for (const m of css.matchAll(/url\("?([^")]+)"?\)/g)) if (!m[1].startsWith('data:') && !fs.existsSync(D + m[1])) errs.push('styles.css référence un fichier absent : ' + m[1]);
for (const f of ['recipes.json', 'ingredients.json']) JSON.parse(fs.readFileSync(D + f, 'utf8'));
for (const f of fs.readdirSync('js')) { const src = fs.readFileSync('js/' + f, 'utf8'); for (const m of src.matchAll(/from '\.\/([^']+)'/g)) if (!fs.existsSync('js/' + m[1])) errs.push(`${f} importe un fichier absent : ${m[1]}`); }
if (errs.length) { console.log(errs.join('\n')); process.exit(1); } else console.log(`dist OK (version ${version}, ${core.length} fichiers en cache hors ligne)`);
