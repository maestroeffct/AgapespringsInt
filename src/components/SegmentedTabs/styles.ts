import { StyleSheet } from 'react-native';
import type { lightTheme } from '../../theme/lightTheme';
import { palette, withOpacity } from '../../theme/colors';

type SegmentedTabColors = typeof lightTheme.colors;

export const createStyles = (
  colors: SegmentedTabColors,
  isDark: boolean,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 6,
      backgroundColor: isDark ? palette.gray900 : colors.surface,
      overflow: 'hidden',
      marginBottom: 12,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? withOpacity(palette.white, 0.08) : colors.border,
    },

    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
    },

    activeTab: {
      backgroundColor: colors.primary,
    },

    text: {
      color: colors.textSecondary,
    },

    activeText: {
      color: colors.primaryText,
      fontWeight: '600',
    },
  });
