const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  fridge: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M6 10.5h12M9.5 6v1.5M9.5 13.5V17"/>',
  utensils: '<path d="M7 3v7M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17.5 3c-2.2 1.800-3 4-3 7h3M17.5 3v18"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.500 10h17M8 3v4M16 3v4"/>',
  cart: '<path d="M3 4h2.200l2.300 11h10.300l2-8H6.200"/><circle cx="9.500" cy="19.500" r="1.300"/><circle cx="17" cy="19.500" r="1.300"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.500-6 8-6s8 2 8 6"/>',
  search: '<circle cx="11" cy="11" r="6.500"/><path d="m20 20-4.200-4.200"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', check: '<path d="m20 6-11 11-5-5"/>',
  heart: '<path d="M20.800 4.600a5.500 5.500 0 0 0-7.800 0L12 5.700l-1-1.100a5.500 5.500 0 0 0-7.800 7.800l1 1.100L12 21l7.800-7.500 1-1.100a5.500 5.500 0 0 0 0-7.800z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trash: '<path d="M3.500 6h17M9 6V4h6v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/>',
  edit: '<path d="M4 20h4L19.500 8.500l-4-4L4 16z"/>',
  right: '<path d="m9 6 6 6-6 6"/>', left: '<path d="m15 6-6 6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>',
  moon: '<path d="M21 12.800A9 9 0 1 1 11.200 3 7 7 0 0 0 21 12.800z"/>',
  share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
  alert: '<path d="M12 3 2 20h20L12 3zM12 10v4.500M12 17.500v.01"/>',
  undo: '<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>', upload: '<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>',
  snow: '<path d="M12 2v20M4.900 7l14.200 10M4.900 17 19.100 7"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-4-2-7-4-9 0 4-4 6-4 12 0 4 3 8 7 8z"/>',
  timer: '<circle cx="12" cy="13.500" r="8"/><path d="M12 9v4.500l2.500 1.500M9.500 2h5"/>',
  more: '<circle cx="5" cy="12" r="1.200" fill="currentColor"/><circle cx="12" cy="12" r="1.200" fill="currentColor"/><circle cx="19" cy="12" r="1.200" fill="currentColor"/>',
  star: '<path d="m12 3 2.800 5.800 6.200.9-4.500 4.400 1.100 6.200L12 17.300 6.400 20.300l1.100-6.200L3 9.700l6.200-.9z"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  wand: '<path d="m4 20 11-11M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 12l.7 1.300L21 14l-1.300.7L19 16l-.7-1.300L17 14l1.300-.7z"/>',
  box: '<path d="M3 7.500 12 3l9 4.500v9L12 21l-9-4.500zM3 7.500 12 12l9-4.500M12 12v9"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M18.6 14.7c1.9.7 3.4 2.4 3.4 5.3"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M15.2 8.6a4.2 4.2 0 1 0 0 6.8M7.5 10.8h6M7.5 13.2h6"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
};
export function icon(name, size = 22) {
  const s = document.createElement('span'); s.className = 'ic'; s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[name] || ''}</svg>`;
  return s;
}
export const hasIcon = n => n in P;
