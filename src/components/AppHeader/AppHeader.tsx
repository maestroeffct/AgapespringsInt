import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AttachStep } from 'react-native-spotlight-tour';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';

export function AppHeader({
  title,
  showLogo = true,
  leftType = 'menu',
  onLeftPress,
  showInfoIcon = false,
  onInfoPress,
  infoIconName = 'information-circle-outline',
  infoIsActive = false,
  rightType = 'notification',
  rightIconName = 'notifications-outline',
  rightIconSize = 24,
  badgeCount = 0,
  onRightPress,

  rightElement,
  leftTourIndex,
  rightTourIndex,
}: any) {
  const { theme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const ripple2Scale = useRef(new Animated.Value(1)).current;
  const ripple2Opacity = useRef(new Animated.Value(0)).current;
  const headerIconColor = isDark ? theme.colors.textPrimary : '#000000';

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

  useEffect(() => {
    if (!infoIsActive) {
      rippleScale.stopAnimation();
      rippleOpacity.stopAnimation();
      ripple2Scale.stopAnimation();
      ripple2Opacity.stopAnimation();
      rippleScale.setValue(1);
      rippleOpacity.setValue(0);
      ripple2Scale.setValue(1);
      ripple2Opacity.setValue(0);
      return;
    }

    const DURATION = 1600;

    const ring1 = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(rippleOpacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
          Animated.timing(rippleOpacity, { toValue: 0, duration: DURATION - 200, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(rippleScale, { toValue: 2.0, duration: DURATION, useNativeDriver: true }),
          Animated.timing(rippleScale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );

    const ring2 = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(DURATION / 2),
          Animated.timing(ripple2Opacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
          Animated.timing(ripple2Opacity, { toValue: 0, duration: DURATION - 200, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(DURATION / 2),
          Animated.timing(ripple2Scale, { toValue: 2.0, duration: DURATION, useNativeDriver: true }),
          Animated.timing(ripple2Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );

    ring1.start();
    ring2.start();
    return () => { ring1.stop(); ring2.stop(); };
  }, [infoIsActive, rippleOpacity, rippleScale, ripple2Opacity, ripple2Scale]);

  // 🔁 Theme-aware logo
  const logo = isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  const showRightBadge = rightType === 'notification' && badgeCount > 0;

  const leftButton = (
    <TouchableOpacity onPress={onLeftPress} style={styles.iconBtn}>
      <Ionicons
        name={leftType === 'menu' ? 'menu-outline' : 'arrow-back'}
        size={26}
        color={headerIconColor}
      />
    </TouchableOpacity>
  );

  const shouldShowInfoIcon = showInfoIcon && infoIsActive;

  const infoButton = (
    <TouchableOpacity onPress={onInfoPress} style={styles.iconBtn}>
      <View style={styles.liveIconWrap}>
        {infoIsActive ? (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.liveRipple,
                {
                  borderColor: theme.colors.primary,
                  opacity: rippleOpacity,
                  transform: [{ scale: rippleScale }],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.liveRipple,
                {
                  borderColor: theme.colors.primary,
                  opacity: ripple2Opacity,
                  transform: [{ scale: ripple2Scale }],
                },
              ]}
            />
          </>
        ) : null}

        <Ionicons
          name={infoIconName}
          size={24}
          color={infoIsActive ? theme.colors.primary : headerIconColor}
        />

        {infoIsActive ? (
          <View style={styles.liveBadge}>
            <AppText style={styles.liveBadgeText}>LIVE</AppText>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const notificationButton = (
    <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
      <Ionicons
        name="notifications-outline"
        color={headerIconColor}
        size={rightIconSize}
      />

      {showRightBadge && (
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
            style={[
              styles.badgeText,
              { color: theme.colors.primaryText ?? '#FFFFFF' },
            ]}
          >
            {badgeCount}
          </AppText>
        </Animated.View>
      )}
    </TouchableOpacity>
  );

  const iconButton = (
    <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
      <Ionicons
        name={rightIconName}
        size={rightIconSize}
        color={headerIconColor}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safe,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* LEFT */}
        <View style={styles.left}>
          {leftType !== 'none' && (
            typeof leftTourIndex === 'number' ? (
              <AttachStep index={leftTourIndex}>{leftButton}</AttachStep>
            ) : (
              leftButton
            )
          )}

          {showLogo ? (
            <View style={styles.logoWrap}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
          ) : (
            title && (
              <AppText variant="h3" style={{ color: headerIconColor }}>
                {title}
              </AppText>
            )
          )}
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          {shouldShowInfoIcon ? infoButton : null}

          {rightType === 'custom' && rightElement}

          {rightType === 'notification' && (
            typeof rightTourIndex === 'number' ? (
              <AttachStep index={rightTourIndex}>{notificationButton}</AttachStep>
            ) : (
              notificationButton
            )
          )}

          {rightType === 'icon' && (
            typeof rightTourIndex === 'number' ? (
              <AttachStep index={rightTourIndex}>{iconButton}</AttachStep>
            ) : (
              iconButton
            )
          )}

          {rightType === 'none' && <View style={styles.iconBtn} />}
        </View>
      </View>
    </SafeAreaView>
  );
}
