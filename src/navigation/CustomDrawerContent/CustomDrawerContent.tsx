import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Share,
  Image,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { AppAlert } from '../../components/AppAlert/AppAlert';
import InAppReview from 'react-native-in-app-review';

const STORE_URLS = {
  android: 'market://details?id=com.maestro_effect.agapesprings',
  androidFallback: 'https://play.google.com/store/apps/details?id=com.maestro_effect.agapesprings',
  ios: 'itms-apps://itunes.apple.com/app/id6754452681?action=write-review',
  iosFallback: 'https://apps.apple.com/app/id6754452681?action=write-review',
};

async function handleRateApp() {
  const isAvailable = InAppReview.isAvailable();
  if (isAvailable) {
    try {
      await InAppReview.RequestInAppReview();
      return;
    } catch {}
  }
  const primary = Platform.OS === 'ios' ? STORE_URLS.ios : STORE_URLS.android;
  const fallback = Platform.OS === 'ios' ? STORE_URLS.iosFallback : STORE_URLS.androidFallback;
  try {
    await Linking.openURL(primary);
  } catch {
    await Linking.openURL(fallback);
  }
}
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import Ionicons from '@react-native-vector-icons/ionicons';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';
import { getInstalledAppVersion } from '../../helpers/appVersion';
import { palette } from '../../theme/colors';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme, isDark, mode, setMode } = useTheme();
  const [themeSheetVisible, setThemeSheetVisible] = useState(false);
  const [appVersion, setAppVersion] = useState('...');
  const logo = isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  React.useEffect(() => {
    getInstalledAppVersion()
      .then(setAppVersion)
      .catch(() => {});
  }, []);

  const shareApp = async () => {
    const storeUrl =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id6754452681'
        : 'https://play.google.com/store/apps/details?id=com.maestro_effect.agapesprings';

    await Share.share({
      message: `Download the AgapeSprings Int. app and stay connected with sermons, devotionals and more.\n\n${storeUrl}`,
    });
  };

  const readableMode =
    mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark';
  // const handleComingSoon = (label: string) => {
  //   AppAlert.alert(label, 'Coming soon.');
  // };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
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
          isDark={isDark}
        />

        <DrawerItem
          icon="gift-outline"
          label="Give"
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('GiveWeb');
          }}
          theme={theme}
          isDark={isDark}
        />

        <DrawerItem
          icon="location-outline"
          label="Church Locator"
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('ChurchLocator');
          }}
          theme={theme}
          isDark={isDark}
        />

        <DrawerItem
          icon="albums-outline"
          label="Platforms"
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Platforms');
          }}
          theme={theme}
          isDark={isDark}
        />

        <View style={styles.divider} />

        <DrawerItem
          icon="color-palette-outline"
          label={`App Theme · ${readableMode}`}
          onPress={() => setThemeSheetVisible(true)}
          theme={theme}
          isDark={isDark}
        />

        {/* <DrawerItem
          icon="chatbubble-ellipses-outline"
          label="App Feedback"
          onPress={() => handleComingSoon('App Feedback')}
          theme={theme}
          isDark={isDark}
          comingSoon
        /> */}

        {/* <DrawerItem
          icon="bulb-outline"
          label="Feature Request"
          onPress={() => handleComingSoon('Feature Request')}
          theme={theme}
          isDark={isDark}
          comingSoon
        /> */}

        <DrawerItem
          icon="star-outline"
          label="Rate the App"
          onPress={() =>
            handleRateApp().catch(() =>
              AppAlert.alert('Error', 'Could not open the store. Please try again.'),
            )
          }
          theme={theme}
          isDark={isDark}
        />

        <DrawerItem
          icon="share-social-outline"
          label="Share App"
          onPress={shareApp}
          theme={theme}
          isDark={isDark}
        />

        <View style={styles.divider} />
      </DrawerContentScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <Image source={logo} style={styles.footerLogo} resizeMode="contain" />
        <AppText
          style={[styles.version, { color: theme.colors.textSecondary }]}
        >
          Version {appVersion}
        </AppText>
      </View>

      <Modal
        transparent
        animationType="slide"
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
              isDark ? styles.sheetCardDark : styles.sheetCardLight,
              {
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.sheetHeaderRow}>
              <AppText
                style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}
              >
                Appearance
              </AppText>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setThemeSheetVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons
                  name="close-outline"
                  size={22}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.sheetDivider,
                { backgroundColor: theme.colors.border },
              ]}
            />

            <View style={styles.themeGrid}>
              <ThemeOptionCard
                label="System"
                icon="phone-portrait-outline"
                active={mode === 'system'}
                onPress={() => {
                  setMode('system');
                  setThemeSheetVisible(false);
                }}
                theme={theme}
              />
              <ThemeOptionCard
                label="Dark"
                icon="moon-outline"
                active={mode === 'dark'}
                onPress={() => {
                  setMode('dark');
                  setThemeSheetVisible(false);
                }}
                theme={theme}
              />
              <ThemeOptionCard
                label="Light"
                icon="sunny-outline"
                active={mode === 'light'}
                onPress={() => {
                  setMode('light');
                  setThemeSheetVisible(false);
                }}
                theme={theme}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function DrawerItem({
  icon,
  label,
  onPress,
  theme,
  isDark,
  comingSoon = false,
}: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />

      <AppText
        style={[
          styles.itemText,
          { color: isDark ? palette.white : palette.black },
        ]}
      >
        {label}
      </AppText>

      {comingSoon ? (
        <AppText
          style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}
        >
          Coming Soon
        </AppText>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
}

function ThemeOptionCard({ label, icon, active, onPress, theme }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.themeOptionCard,
        {
          borderColor: active ? theme.colors.primary : theme.colors.border,
          backgroundColor: active
            ? `${theme.colors.primary}18`
            : theme.colors.surface,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={30}
        color={active ? theme.colors.primary : theme.colors.textPrimary}
      />
      <AppText
        style={[styles.themeLabel, { color: theme.colors.textPrimary }]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
