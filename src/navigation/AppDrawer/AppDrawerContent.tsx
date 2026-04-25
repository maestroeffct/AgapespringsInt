import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from '@react-native-vector-icons/ionicons';
import InAppReview from 'react-native-in-app-review';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeSelector } from '../../components/ThemeSelector/ThemeSelector';
import styles from './styles';

const STORE_URLS = {
  android: 'market://details?id=com.maestro_effect.agapesprings',
  androidFallback:
    'https://play.google.com/store/apps/details?id=com.maestro_effect.agapesprings',
  ios: 'itms-apps://itunes.apple.com/app/id6754452681?action=write-review',
  iosFallback: 'https://apps.apple.com/app/id6754452681?action=write-review',
};

async function openStoreForReview() {
  const primary = Platform.OS === 'ios' ? STORE_URLS.ios : STORE_URLS.android;
  const fallback =
    Platform.OS === 'ios' ? STORE_URLS.iosFallback : STORE_URLS.androidFallback;

  const canOpen = await Linking.canOpenURL(primary);
  await Linking.openURL(canOpen ? primary : fallback);
}

async function handleRateApp() {
  const isAvailable = InAppReview.isAvailable();

  if (isAvailable) {
    try {
      await InAppReview.RequestInAppReview();
    } catch {
      // Native dialog failed — fall back to store
      await openStoreForReview();
    }
  } else {
    // Device doesn't support in-app review — go straight to store
    await openStoreForReview();
  }
}

export function AppDrawerContent(props: any) {
  const { theme, mode } = useTheme();
  const [showTheme, setShowTheme] = useState(false);

  const logo = theme.isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* MAIN ITEMS */}
          <Item label="About Us" icon="information-circle-outline" />
          <Item label="Give" icon="gift-outline" />
          <Item label="Church Locator" icon="location-outline" />
          <Item label="Platforms" icon="apps-outline" />

          <View style={styles.divider} />

          {/* THEME */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => setShowTheme(true)}
          >
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={theme.colors.primary}
            />
            <AppText style={styles.label}>
              App Theme · {mode === 'system' ? 'System' : mode}
            </AppText>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <Item label="Share App" icon="share-social-outline" />

          {/* RATE APP */}
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              handleRateApp().catch(() =>
                Alert.alert(
                  'Error',
                  'Could not open the store. Please try again.',
                ),
              )
            }
          >
            <Ionicons
              name="star-outline"
              size={20}
              color={theme.colors.primary}
            />
            <AppText
              style={[styles.label, { color: theme.colors.textPrimary }]}
            >
              Rate the App
            </AppText>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <View style={styles.footer}>
            <AppText variant="caption">Version 1.4</AppText>
          </View>
        </View>
      </DrawerContentScrollView>

      <ThemeSelector visible={showTheme} onClose={() => setShowTheme(false)} />
    </>
  );
}

function Item({ label, icon }: any) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.item}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <AppText style={[styles.label, { color: theme.colors.textPrimary }]}>
        {label}
      </AppText>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}
