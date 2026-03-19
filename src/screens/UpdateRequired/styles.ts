import { StyleSheet } from 'react-native';

export const createStyles = (colors: {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryText: string;
  border: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 24,
      paddingVertical: 32,
      gap: 12,
    },
    eyebrow: {
      color: colors.primary,
      textAlign: 'center',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    title: {
      color: colors.textPrimary,
      textAlign: 'center',
    },
    message: {
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    versionMeta: {
      marginTop: 4,
      alignItems: 'center',
      gap: 4,
    },
    versionText: {
      color: colors.textSecondary,
      textAlign: 'center',
    },
    button: {
      marginTop: 24,
    },
  });
