export const palette = {
  wine: '#c40936',
  wineDark: '#c40936',

  gold: '#C40936',
  goldSoft: '#F5B301',

  white: '#FFFFFF',
  black: '#0B0B0B',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray300: '#D1D5DB',
  gray600: '#4B5563',
  gray900: '#111827',
  glass: '#efcfcfff',
};

export function withOpacity(hex: string, opacity: number) {
  const normalized = hex.replace('#', '');
  const isShortHex = normalized.length === 3;

  const expanded = isShortHex
    ? normalized
        .split('')
        .map(char => char + char)
        .join('')
    : normalized;

  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
