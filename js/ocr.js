// Lecture de la photo d'un ticket (Tesseract, chargé seulement au premier scan, puis gardé en mémoire).
import { asset, VERSION } from './state.js';

const abs = f => new URL(asset(f), location.href).href;
let libPromise = null;
function loadLib() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return libPromise = libPromise || new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = abs('ocr-lib.js') + '?v=' + VERSION;
    s.onload = () => res(window.Tesseract); s.onerror = () => { libPromise = null; rej(new Error('Le module de lecture ne s’est pas chargé. Il faut internet la toute première fois.')); };
    document.head.append(s);
  });
}
// photo -> image nette en niveaux de gris, à une taille adaptée à la lecture
async function prepare(file) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(2, Math.max(1, 1400 / bmp.width), 2000 / bmp.width);
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(bmp, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height), p = d.data; let min = 255, max = 0;
  for (let i = 0; i < p.length; i += 4) { const g = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]; p[i] = g; if (g < min) min = g; if (g > max) max = g; }
  const k = 255 / Math.max(1, max - min);
  for (let i = 0; i < p.length; i += 4) { const g = Math.max(0, Math.min(255, (p[i] - min) * k)); p[i] = p[i + 1] = p[i + 2] = g; }
  x.putImageData(d, 0, 0); return c;
}
export async function readReceiptImage(file, onProgress = () => {}) {
  onProgress(0.02, 'Préparation…');
  const T = await loadLib(); const img = await prepare(file);
  onProgress(0.08, 'Chargement du lecteur…');
  const worker = await T.createWorker('fra', 1, {
    workerPath: abs('ocr-worker.js'), corePath: new URL(asset('x'), location.href).href.replace(/x$/, ''), langPath: new URL(asset('x'), location.href).href.replace(/x$/, ''), gzip: true,
    logger: m => { if (m.status === 'recognizing text') onProgress(0.15 + m.progress * 0.85, 'Lecture du ticket…'); },
  });
  try { await worker.setParameters({ tessedit_pageseg_mode: '6', preserve_interword_spaces: '1' }); const { data } = await worker.recognize(img); return data.text; }
  finally { await worker.terminate(); }
}
