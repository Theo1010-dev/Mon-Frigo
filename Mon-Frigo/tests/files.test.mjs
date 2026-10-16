// Contrôle de cohérence du déploiement : cache hors ligne complet, icônes présentes, versions alignées.
import fs from 'node:fs';
const sw = fs.readFileSync('sw.js', 'utf8'), state = fs.readFileSync('js/state.js', 'utf8'), pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const core = JSON.parse('[' + sw.match(/const CORE = \[([\s\S]*?)\];/)[1].replace(/'/g, '"') + ']');
const errs = [];
for (const f of core) if (f !== './' && !fs.existsSync(f)) errs.push('fichier du cache introuvable : ' + f);
for (const f of fs.readdirSync('js')) if (f.endsWith('.js') && !core.includes('js/' + f)) errs.push('absent du cache hors ligne : js/' + f);
for (const i of JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8')).icons) if (!fs.existsSync(i.src)) errs.push('icône manquante : ' + i.src);
const v1 = sw.match(/const VERSION = '([^']+)'/)[1], v2 = state.match(/VERSION = '([^']+)'/)[1];
if (v1 !== v2 || v1 !== pkg.version) errs.push(`versions différentes : sw ${v1}, app ${v2}, package ${pkg.version}`);
for (const f of ['data/recipes.json', 'data/ingredients.json']) JSON.parse(fs.readFileSync(f, 'utf8'));
for (const f of fs.readdirSync('js')) { const src = fs.readFileSync('js/' + f, 'utf8'); for (const m of src.matchAll(/from '\.\/([^']+)'/g)) if (!fs.existsSync('js/' + m[1])) errs.push(`${f} importe un fichier absent : ${m[1]}`); }
if (errs.length) { console.log(errs.join('\n')); process.exit(1); } else console.log(`fichiers OK (${core.length} en cache, version ${v1})`);
