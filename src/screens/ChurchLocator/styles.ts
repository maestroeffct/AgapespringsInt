import { StyleSheet } from 'react-native';

type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

export default function createStyles(colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
    },
    loaderWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginBottom: 14,
      shadowColor: '#000000',
      shadowOpacity: isDark ? 0 : 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: isDark ? 0 : 2,
    },
    nameText: {
      color: colors.textPrimary,
      fontSize: 18,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    addressText: {
      color: colors.textSecondary,
      fontSize: 14,
      textTransform: 'uppercase',
      lineHeight: 21,
      marginBottom: 8,
    },
    phoneText: {
      color: colors.primary,
      fontSize: 16,
      textTransform: 'none',
    },
  });
}
