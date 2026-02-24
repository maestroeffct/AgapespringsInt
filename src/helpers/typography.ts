import { FontFamily } from './fonts';

type Colors = {
  textPrimary: string;
  textSecondary: string;
};

export function createTypography(colors: Colors) {
  return {
    satoshi: {
      h1: {
        fontFamily: FontFamily.satoshi.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.satoshi.bold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.satoshi.regular,
        fontSize: 16,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.satoshi.regular,
        fontSize: 12,
        color: colors.textSecondary,
      },
    },

    geomanist: {
      h1: {
        fontFamily: FontFamily.geomanist.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.geomanist.bold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.geomanist.regular,
        fontSize: 16,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.geomanist.medium,
        fontSize: 12,
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
      body: {
        fontFamily: FontFamily.inter.regular,
        fontSize: 16,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.inter.medium,
        fontSize: 12,
        color: colors.textSecondary,
      },
    },

    poppins: {
      h1: {
        fontFamily: FontFamily.poppins.bold,
        fontSize: 32,
        color: colors.textPrimary,
      },
      h2: {
        fontFamily: FontFamily.poppins.semibold,
        fontSize: 24,
        color: colors.textPrimary,
      },
      body: {
        fontFamily: FontFamily.poppins.regular,
        fontSize: 16,
        color: colors.textPrimary,
      },
      caption: {
        fontFamily: FontFamily.poppins.medium,
        fontSize: 12,
        color: colors.textSecondary,
      },
    },
  };
}
