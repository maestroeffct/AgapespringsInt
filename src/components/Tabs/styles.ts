import { StyleSheet } from 'react-native';

export const createDevotionalLatestTabStyles = (colors: {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  imageOverlay: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      backgroundColor: colors.background,
    },
    listContent: {
      flexGrow: 1,
      backgroundColor: colors.background,
      paddingBottom: 24,
    },
    stateWrap: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    stateCard: {
      width: '100%',
      maxWidth: 320,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 24,
      paddingVertical: 28,
      alignItems: 'center',
    },
    stateTitle: {
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    stateMessage: {
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
