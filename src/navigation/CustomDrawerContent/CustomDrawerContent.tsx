import React, { useState } from 'react';
import { View, TouchableOpacity, Share, Image, Modal } from 'react-native';
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
  const [themeSheetVisible, setThemeSheetVisible] = useState(false);
  const logo = isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  const shareApp = async () => {
    await Share.share({
      message:
        'Download AgapeSprings App and stay connected with sermons and devotionals.',
    });
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
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('AboutWeb');
          }}
          theme={theme}
        />

        <DrawerItem
          icon="gift-outline"
          label="Give"
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('GiveWeb');
          }}
          theme={theme}
        />

        <DrawerItem
          icon="location-outline"
          label="Church Locator"
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('ChurchLocator');
          }}
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
          onPress={() => setThemeSheetVisible(true)}
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

      <Modal
        transparent
        animationType="fade"
        visible={themeSheetVisible}
        onRequestClose={() => setThemeSheetVisible(false)}
      >
        <View style={styles.sheetRoot}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sheetBackdrop}
            onPress={() => setThemeSheetVisible(false)}
          />

          <View
            style={[
              styles.sheetCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <AppText
              style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}
            >
              Select App Theme
            </AppText>

            <ThemeOption
              label="System"
              active={mode === 'system'}
              onPress={() => {
                setMode('system');
                setThemeSheetVisible(false);
              }}
              theme={theme}
            />
            <ThemeOption
              label="Light"
              active={mode === 'light'}
              onPress={() => {
                setMode('light');
                setThemeSheetVisible(false);
              }}
              theme={theme}
            />
            <ThemeOption
              label="Dark"
              active={mode === 'dark'}
              onPress={() => {
                setMode('dark');
                setThemeSheetVisible(false);
              }}
              theme={theme}
            />
          </View>
        </View>
      </Modal>
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

function ThemeOption({ label, active, onPress, theme }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.themeOption,
        {
          borderColor: active ? theme.colors.primary : theme.colors.border,
          backgroundColor: active
            ? `${theme.colors.primary}20`
            : theme.colors.background,
        },
      ]}
      onPress={onPress}
    >
      <AppText style={{ color: theme.colors.textPrimary }}>{label}</AppText>
      {active ? (
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={theme.colors.primary}
        />
      ) : null}
    </TouchableOpacity>
  );
}
