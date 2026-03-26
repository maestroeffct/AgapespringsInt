import { StyleSheet } from 'react-native';

import type { lightTheme } from '../../theme/lightTheme';

type ResourceColors = typeof lightTheme.colors;

export const createStyles = (colors: ResourceColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      backgroundColor: colors.background,
    },
  });
