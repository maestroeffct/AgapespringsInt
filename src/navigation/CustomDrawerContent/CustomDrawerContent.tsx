import React from 'react';
import { View, TouchableOpacity, Share, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import Ionicons from '@react-native-vector-icons/ionicons';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme, isDark, mode, setMode } = useTheme();
  const logo = isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  const shareApp = async () => {
    await Share.share({
      message:
        'Download AgapeSprings App and stay connected with sermons and devotionals.',
    });
  };

  const cycleThemeMode = () => {
    if (mode === 'system') {
      setMode('light');
      return;
    }

    if (mode === 'light') {
      setMode('dark');
      return;
    }

    setMode('system');
  };

  const readableMode =
    mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {/* LOGO HEADER */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.divider} />

        {/* MENU ITEMS */}
        <DrawerItem
          icon="information-circle-outline"
          label="About Us"
          onPress={() => {}}
          theme={theme}
        />

        <DrawerItem
          icon="gift-outline"
          label="Give"
          onPress={() => {}}
          theme={theme}
        />

        <DrawerItem
          icon="location-outline"
          label="Church Locator"
          onPress={() => {}}
          theme={theme}
        />

        <DrawerItem
          icon="albums-outline"
          label="Platforms"
          onPress={() => {}}
          theme={theme}
        />

        <View style={styles.divider} />

        <DrawerItem
          icon="color-palette-outline"
          label={`App Theme · ${readableMode}`}
          onPress={cycleThemeMode}
          theme={theme}
        />

        <DrawerItem
          icon="share-social-outline"
          label="Share App"
          onPress={shareApp}
          theme={theme}
        />

        <View style={styles.divider} />

        <AppText style={styles.version}>Version 1.2.0</AppText>
      </DrawerContentScrollView>
    </View>
  );
}

function DrawerItem({ icon, label, onPress, theme }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />

      <AppText style={[styles.itemText, { color: theme.colors.textPrimary }]}>
        {label}
      </AppText>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
}
