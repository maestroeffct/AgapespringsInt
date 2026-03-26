import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AppText } from '../../components/AppText/AppText';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import {
  isDevotionalFavourite,
  toggleDevotionalFavourite,
} from '../../helpers/devotionalFavourites';
import { getRemoteImageUri } from '../../helpers/imageSource';
import type { DevotionalDetailsItem } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import createStyles from './styles';

type Props = {
  route: { params: { item: DevotionalDetailsItem } };
  navigation: any;
};

const FALLBACK = require('../../assets/images/devotional_cover.png');

type ReaderSection = {
  key: string;
  label?: string;
  value: string;
  emphasis?: 'verse' | 'body' | 'inline';
};

export default function DevotionalDetailsScreen({ route, navigation }: Props) {
  const { theme, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(theme.colors, isDark),
    [theme.colors, isDark],
  );
  const headerActionIconColor = isDark ? '#FFFFFF' : '#000000';
  const item = route.params.item;
  const remoteThumbnailUri = getRemoteImageUri(item.thumbnail);

  const [fontScale, setFontScale] = useState(1);
  const [liked, setLiked] = useState(false);

  const increaseFont = () => setFontScale(prev => Math.min(prev + 0.1, 1.5));
  const decreaseFont = () => setFontScale(prev => Math.max(prev - 0.1, 0.85));

  const handleShare = async () => {
    const shareParts = [
      item.title,
      item.memoryVerse,
      item.body,
      item.prayer ? `Prayer: ${item.prayer}` : undefined,
    ].filter(Boolean);

    await Share.share({
      message: shareParts.join('\n\n'),
    });
  };

  const handleReadAloud = () => {
    Alert.alert('Coming Soon', 'Read-aloud is not available yet.');
  };

  const syncLikedState = useCallback(() => {
    let active = true;

    (async () => {
      const nextLiked = await isDevotionalFavourite(item.id);
      if (active) {
        setLiked(nextLiked);
      }
    })();

    return () => {
      active = false;
    };
  }, [item.id]);

  useFocusEffect(syncLikedState);

  const handleToggleFavourite = useCallback(async () => {
    const nextLiked = await toggleDevotionalFavourite(item);
    setLiked(nextLiked);
  }, [item]);

  const sections = useMemo(() => buildReaderSections(item), [item]);

  return (
    <ScreenWrapper
      padded={false}
      statusBarStyle={isDark ? 'light-content' : 'dark-content'}
      style={styles.screen}
    >
      <View style={styles.screen}>
        <AppHeader
          title=""
          showLogo={false}
          leftType="back"
          onLeftPress={() => navigation.goBack()}
          rightType="custom"
          rightElement={
            <View style={styles.topRightActions}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleReadAloud}
                style={styles.topIconBtn}
              >
                <Ionicons
                  name="volume-medium-outline"
                  size={22}
                  color={headerActionIconColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleToggleFavourite}
                style={styles.topIconBtn}
              >
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={liked ? theme.colors.primary : headerActionIconColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleShare}
                style={styles.topIconBtn}
              >
                <Ionicons
                  name="share-social-outline"
                  size={22}
                  color={headerActionIconColor}
                />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={remoteThumbnailUri ? { uri: remoteThumbnailUri } : FALLBACK}
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadge}>
                <AppText style={styles.heroBadgeText}>Read The</AppText>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.titleBlock}>
            <AppText style={styles.title}>{item.title}</AppText>

            {!!item.author && (
              <AppText style={styles.author}>By {item.author}</AppText>
            )}

            {!!item.date && <AppText style={styles.date}>{item.date}</AppText>}
          </View>

          {sections.map(section => (
            <View key={section.key} style={styles.sectionBlock}>
              {section.label ? (
                <AppText
                  style={
                    section.emphasis === 'inline'
                      ? styles.inlineSectionLabel
                      : styles.sectionLabel
                  }
                >
                  {section.label}
                </AppText>
              ) : null}

              <AppText
                selectable
                selectionColor={theme.colors.primary}
                style={[
                  section.emphasis === 'verse'
                    ? styles.memoryVerse
                    : section.emphasis === 'inline'
                    ? styles.inlineSectionBody
                    : styles.sectionBody,
                  { fontSize: getScaledFontSize(section.emphasis, fontScale) },
                ]}
              >
                {section.value}
              </AppText>
            </View>
          ))}

          <View style={styles.bottomActions}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.bottomAction}
              onPress={handleToggleFavourite}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={28}
                color={theme.colors.primary}
              />
              <AppText style={styles.bottomActionText}>Like</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.bottomAction}
              onPress={handleShare}
            >
              <Ionicons
                name="share-social-outline"
                size={28}
                color={theme.colors.primary}
              />
              <AppText style={styles.bottomActionText}>Share</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.floatingFontControls}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={decreaseFont}
            style={styles.floatingFontBtn}
          >
            <AppText style={styles.floatingFontText}>A-</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.92}
            onPress={increaseFont}
            style={styles.floatingFontBtn}
          >
            <AppText style={styles.floatingFontText}>A+</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

function buildReaderSections(item: DevotionalDetailsItem): ReaderSection[] {
  const sections: ReaderSection[] = [];

  if (item.memoryVerse?.trim()) {
    sections.push({
      key: 'memoryVerse',
      value: item.memoryVerse.trim(),
      emphasis: 'verse',
    });
  }

  if (item.body?.trim()) {
    sections.push({
      key: 'body',
      value: item.body.trim(),
      emphasis: 'body',
    });
  }

  if (item.furtherStudy?.trim()) {
    sections.push({
      key: 'furtherStudy',
      label: 'Further Study:',
      value: item.furtherStudy.trim(),
      emphasis: 'inline',
    });
  }

  const extraSections = Object.entries(item.sections ?? {})
    .filter(([key, value]) => {
      if (typeof value !== 'string' || !value.trim()) return false;

      return ![
        'memoryVerse',
        'bibleReading',
        'message',
        'furtherStudy',
        'prayer',
      ].includes(key);
    })
    .map(([key, value]) => ({
      key,
      label: `${formatSectionLabel(key)}:`,
      value: typeof value === 'string' ? value.trim() : '',
      emphasis: 'inline' as const,
    }));

  sections.push(...extraSections);

  if (item.prayer?.trim()) {
    sections.push({
      key: 'prayer',
      label: 'Prayer:',
      value: item.prayer.trim(),
      emphasis: 'inline',
    });
  }

  return sections;
}

function formatSectionLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, char => char.toUpperCase())
    .trim();
}

function getScaledFontSize(
  emphasis: ReaderSection['emphasis'],
  fontScale: number,
) {
  if (emphasis === 'verse') return 15 * fontScale;
  if (emphasis === 'inline') return 13 * fontScale;
  return 14 * fontScale;
}
