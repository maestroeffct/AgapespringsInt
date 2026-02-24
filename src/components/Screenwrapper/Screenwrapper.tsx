import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type ScreenWrapperProps = {
  children: React.ReactNode;
  padded?: boolean;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;

  /** NEW */
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarBackground?: string;
  statusBarTranslucent?: boolean;
};

export function ScreenWrapper({
  children,
  padded = true,
  scrollable = false,
  style,

  statusBarStyle,
  statusBarBackground,
  statusBarTranslucent = false,
}: ScreenWrapperProps) {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaProvider
      style={[
        styles.container,
        {
          backgroundColor: statusBarTranslucent
            ? 'transparent'
            : theme.colors.background,
        },
      ]}
    >
      <StatusBar
        translucent={statusBarTranslucent}
        barStyle={statusBarStyle ?? (isDark ? 'light-content' : 'dark-content')}
        backgroundColor={statusBarBackground ?? theme.colors.background}
      />

      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={[styles.container, padded && styles.padded, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, padded && styles.padded, style]}>
          {children}
        </View>
      )}
    </SafeAreaProvider>
  );
}
