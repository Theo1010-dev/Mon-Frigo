// La mascotte de l'assistant : un petit frigo avec une toque de chef (couleurs de l'ambiance pour les joues).
function mascotSVG({ size = 30, title = '' } = {}) {
  return `<svg class="mascot" viewBox="0 -1.5 48 49.5" width="${size}" height="${size}" ${title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"'} xmlns="http://www.w3.org/2000/svg">
  <g class="m-hat"><g fill="#fff" stroke="#2b3541" stroke-width="2"><circle cx="18.5" cy="8.5" r="4.5"/><circle cx="29.5" cy="8.5" r="4.5"/><circle cx="24" cy="6" r="5.5"/></g>
    <g fill="#fff"><circle cx="18.5" cy="8.5" r="3.5"/><circle cx="29.5" cy="8.5" r="3.5"/><circle cx="24" cy="6" r="4.5"/></g>
    <rect x="16" y="9.5" width="16" height="5" rx="1.5" fill="#fff" stroke="#2b3541" stroke-width="2"/></g>
  <rect x="11.5" y="14" width="25" height="30" rx="6" fill="#eef6fc" stroke="#2b3541" stroke-width="2"/>
  <path d="M11.5 22.5h25" stroke="#2b3541" stroke-width="1.6"/>
  <rect x="31" y="16.5" width="2.2" height="3.6" rx="1.1" fill="#9fb3c4"/><rect x="31" y="25" width="2.2" height="7" rx="1.1" fill="#9fb3c4"/>
  <path d="M17 17.2l2.4 2.4M19.4 17.2L17 19.6M18.2 16.6v3.6" stroke="#8ec5ea" stroke-width="1" stroke-linecap="round"/>
  <g class="m-eyes"><circle cx="19.3" cy="30" r="2.8" fill="#2b3541"/><circle cx="26.7" cy="30" r="2.8" fill="#2b3541"/><circle cx="20.2" cy="29" r="1" fill="#fff"/><circle cx="27.6" cy="29" r="1" fill="#fff"/></g>
  <circle cx="16.4" cy="34" r="1.7" fill="var(--accent, #e2017b)" opacity=".38"/><circle cx="29.6" cy="34" r="1.7" fill="var(--accent, #e2017b)" opacity=".38"/>
  <path d="M20.2 34.6q2.8 2.8 5.6 0" fill="none" stroke="#2b3541" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M15.5 44v1.8M32.5 44v1.8" stroke="#2b3541" stroke-width="2" stroke-linecap="round"/>
</svg>`;
}
// élément prêt à insérer
export function mascotEl(opts) { const t = document.createElement('template'); t.innerHTML = mascotSVG(opts).trim(); return t.content.firstChild; }
