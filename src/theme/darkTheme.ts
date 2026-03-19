import { palette, withOpacity } from './colors';

export const darkTheme = {
  isDark: true,

  colors: {
    background: palette.black,
    splashBackground: palette.wine,
    surface: palette.wineDark,

    textPrimary: palette.white,
    textSecondary: palette.gray300,

    primary: palette.gold,
    primaryText: palette.white,
    accent: palette.goldSoft,
    accent2: palette.gold,
    imageOverlay: withOpacity(palette.black, 0.44),

    border: palette.wineDark,
  },
};
