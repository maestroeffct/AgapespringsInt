import { FontFamily } from './fonts';

type Colors = {
  textPrimary: string;
  textSecondary: string;
};

export function createTypography(colors: Colors) {
  return {
    satoshi: {
      h1: {
        fontFamily: FontFamily.inter.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      h3: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 18,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 14,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 5,
        color: colors.textSecondary,
      },
    },

    geomanist: {
      h1: {
        fontFamily: FontFamily.inter.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      h3: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 18,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 14,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 5,
        color: colors.textSecondary,
      },
    },

    inter: {
      h1: {
        fontFamily: FontFamily.inter.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      h3: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 18,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 14,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 5,
        color: colors.textSecondary,
      },
    },

    poppins: {
      h1: {
        fontFamily: FontFamily.inter.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      h3: {
        fontFamily: FontFamily.inter.semibold,
        fontSize: 18,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 14,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 5,
        color: colors.textSecondary,
      },
    },
  };
}
