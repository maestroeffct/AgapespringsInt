import { palette, withOpacity } from './colors';

export const lightTheme = {
  isDark: false,

  colors: {
    background: palette.white,
    splashBackground: palette.white,
    surface: palette.gray50,

    textPrimary: palette.wine,
    textSecondary: palette.gray600,

    primary: palette.wine,
    primaryText: palette.white,
    accent: palette.gold,
    accent2: palette.gold,

    imageOverlay: withOpacity(palette.black, 0.28),

    border: palette.gray300,
  },
};
