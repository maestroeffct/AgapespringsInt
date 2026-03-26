import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import styles from './styles';
import { getRemoteImageUri } from '../../../helpers/imageSource';

type Props = {
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  thumbnail?: string;
  onPress?: () => void;
};

const FALLBACK = require('../../../assets/images/devotional_cover.png'); // add any fallback you want

export function DevotionalCard({
  title,
  excerpt,
  author,
  date,
  thumbnail,
  onPress,
}: Props) {
  const { theme, isDark } = useTheme();
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.left}>
          <AppText
            style={[styles.title, { color: isDark ? '#FFFFFF' : '#111111' }]}
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
