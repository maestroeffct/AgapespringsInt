import { StyleSheet } from 'react-native';

type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

export default function createStyles(colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 18,
    },
    card: {
      backgroundColor: isDark ? colors.background : colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 18,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
      gap: 10,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: '700',
    },
    scheduleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 9,
      gap: 10,
    },
    dayWrap: {
      flex: 1.1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    bullet: {
      color: colors.textSecondary,
      marginRight: 8,
      fontSize: 16,
      lineHeight: 18,
    },
    dayText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    timeText: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
    listenText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });
}
