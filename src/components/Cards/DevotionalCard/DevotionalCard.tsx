import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import styles from './styles';
import { getRemoteImageUri } from '../../../helpers/imageSource';
import { withOpacity } from '../../../theme/colors';

type Props = {
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  thumbnail?: string;
  isToday?: boolean;
  onPress?: () => void;
};

const FALLBACK = require('../../../assets/images/devotional_cover.png'); // add any fallback you want

export function DevotionalCard({
  title,
  excerpt,
  author,
  date,
  thumbnail,
  isToday = false,
  onPress,
}: Props) {
  const { theme, isDark } = useTheme();
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);
  const titleColor = isDark ? '#FFFFFF' : '#111111';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View
        style={[
          styles.row,
          {
            borderBottomColor: theme.colors.border,
          },
          isToday
            ? {
                backgroundColor: withOpacity(theme.colors.primary, isDark ? 0.12 : 0.05),
                borderColor: withOpacity(theme.colors.primary, isDark ? 0.34 : 0.18),
              }
            : null,
        ]}
      >
        <View style={styles.left}>
          {isToday ? (
            <View
              style={[
                styles.todayPill,
                {
                  backgroundColor: withOpacity(
                    theme.colors.primary,
                    isDark ? 0.18 : 0.08,
                  ),
                  borderColor: withOpacity(
                    theme.colors.primary,
                    isDark ? 0.38 : 0.22,
                  ),
                },
              ]}
            >
              <AppText
                style={[styles.todayPillText, { color: theme.colors.primary }]}
              >
                Today
              </AppText>
            </View>
          ) : null}

          <AppText
            style={[styles.title, { color: titleColor }]}
            numberOfLines={2}
          >
            {title}
          </AppText>

          {!!excerpt && (
            <AppText
              style={[styles.excerpt, { color: theme.colors.textSecondary }]}
              numberOfLines={3}
            >
              {excerpt}
            </AppText>
          )}

          <View style={styles.metaRow}>
            {!!author && (
              <AppText
                style={[styles.meta, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                By {author}
              </AppText>
            )}

            {!!date && (
              <AppText
                style={[styles.meta2, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {date}
              </AppText>
            )}
          </View>
        </View>

        <Image
          source={remoteThumbnailUri ? { uri: remoteThumbnailUri } : FALLBACK}
          style={styles.thumb}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}
