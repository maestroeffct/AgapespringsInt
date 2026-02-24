import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import styles from './styles';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';

export function AppHeader({
  title,
  showLogo = true,

  leftType = 'menu',
  onLeftPress,

  rightType = 'notification',
  badgeCount = 0,
  onRightPress,

  rightElement,
}: any) {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 🔔 Animate badge when count changes
  useEffect(() => {
    if (badgeCount > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [badgeCount, scaleAnim]);

  // 🔁 Theme-aware logo
  const logo = isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* LEFT */}
        <View style={styles.left}>
          {leftType !== 'none' && (
            <TouchableOpacity onPress={onLeftPress} style={styles.iconBtn}>
              <Ionicons
                name={leftType === 'menu' ? 'menu-outline' : 'arrow-back'}
                size={26}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {showLogo ? (
            <View style={styles.logoWrap}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
          ) : (
            title && (
              <AppText variant="h2" style={{ color: theme.colors.textPrimary }}>
                {title}
              </AppText>
            )
          )}
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          {rightType === 'custom' && rightElement}

          {rightType === 'notification' && (
            <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.colors.textPrimary}
              />

              {badgeCount > 0 && (
                <Animated.View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: theme.colors.primary,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <AppText
                    variant="caption"
                    style={[styles.badgeText, { color: theme.colors.surface }]}
                  >
                    {badgeCount}
                  </AppText>
                </Animated.View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
