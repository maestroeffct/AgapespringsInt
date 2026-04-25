import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppText } from '../../components/AppText/AppText';
import { AppButton } from '../../components/AppButton/AppButton';
import { useTheme } from '../../theme/ThemeProvider';
import { RootStackParamList } from '../../navigation/types';
import { withOpacity } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateRequired'>;

export default function UpdateRequiredScreen({ route }: Props) {
  const { theme, isDark } = useTheme();
  const { currentVersion, minimumVersion, storeUrl } = route.params;

  const logo = isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  const handleUpdate = async () => {
    if (!storeUrl) return;
    await Linking.openURL(storeUrl);
  };

  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

  return (
    <ScreenWrapper padded={false}>
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>

        {/* ── Brand header ── */}
        <LinearGradient
          colors={[
            withOpacity(theme.colors.primary, isDark ? 0.18 : 0.08),
            withOpacity(theme.colors.background, 0),
          ]}
          style={styles.heroGradient}
        >
          {/* decorative ring */}
          <View
            style={[
              styles.decorRing,
              { borderColor: withOpacity(theme.colors.primary, 0.12) },
            ]}
          />
          <View
            style={[
              styles.decorRingInner,
              { borderColor: withOpacity(theme.colors.primary, 0.08) },
            ]}
          />

          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </LinearGradient>

        {/* ── Content ── */}
        <View style={styles.content}>

          {/* icon badge */}
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: withOpacity(theme.colors.primary, 0.1) },
            ]}
          >
            <View
              style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}
            >
              <Ionicons name="arrow-up" size={28} color="#FFFFFF" />
            </View>
          </View>

          {/* label pill */}
          <View
            style={[
              styles.pill,
              { backgroundColor: withOpacity(theme.colors.primary, 0.1) },
            ]}
          >
            <View
              style={[styles.pillDot, { backgroundColor: theme.colors.primary }]}
            />
            <AppText
              font="poppins"
              variant="caption"
              style={[styles.pillText, { color: theme.colors.primary }]}
            >
              Update Required
            </AppText>
          </View>

          <AppText
            font="poppins"
            variant="h2"
            style={[styles.title, { color: isDark ? '#FFFFFF' : '#0B0B0B' }]}
          >
            A new version is{'\n'}available
          </AppText>

          <AppText
            variant="body"
            style={[styles.message, { color: theme.colors.textSecondary }]}
          >
            To keep using Agapesprings, please update to the latest version on
            the {storeName}.
          </AppText>

          {/* version chips */}
          <View
            style={[
              styles.versionRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.versionItem}>
              <AppText
                variant="caption"
                style={[styles.versionLabel, { color: theme.colors.textSecondary }]}
              >
                Installed
              </AppText>
              <AppText
                font="poppins"
                variant="body"
                style={[styles.versionValue, { color: isDark ? '#FFFFFF' : '#0B0B0B' }]}
              >
                v{currentVersion}
              </AppText>
            </View>

            <View
              style={[styles.versionDivider, { backgroundColor: theme.colors.border }]}
            />

            <View style={styles.versionItem}>
              <AppText
                variant="caption"
                style={[styles.versionLabel, { color: theme.colors.textSecondary }]}
              >
                Required
              </AppText>
              <AppText
                font="poppins"
                variant="body"
                style={[styles.versionValue, { color: theme.colors.primary }]}
              >
                v{minimumVersion}
              </AppText>
            </View>
          </View>
        </View>

        {/* ── CTA ── */}
        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <AppButton
            title={`Update on ${storeName}`}
            size="lg"
            onPress={handleUpdate}
            disabled={!storeUrl}
            style={styles.button}
          />
          <AppText
            variant="caption"
            style={[styles.footerNote, { color: theme.colors.textSecondary }]}
          >
            You will be redirected to the {storeName}
          </AppText>
        </View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // hero
  heroGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 56,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  decorRing: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 1,
    top: -80,
  },
  decorRingInner: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    top: -40,
  },
  logo: {
    width: 180,
    height: 60,
  },

  // content
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    gap: 16,
  },

  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  title: {
    lineHeight: 36,
  },

  message: {
    lineHeight: 22,
  },

  versionRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  versionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 2,
  },
  versionDivider: {
    width: 1,
  },
  versionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 10,
  },
  versionValue: {
    fontWeight: '600',
  },

  // footer
  footer: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  footerNote: {
    textAlign: 'center',
  },
});
