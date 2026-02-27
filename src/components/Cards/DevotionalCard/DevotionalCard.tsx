import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import styles from './styles';

type Props = {
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  category?: string;
  thumbnail?: string;
  onPress?: () => void;
};

const FALLBACK = require('../../../assets/images/devotional_cover.png'); // add any fallback you want

export function DevotionalCard({
  title,
  excerpt,
  author,
  date,
  category,
  thumbnail,
  onPress,
}: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.left}>
          <AppText
            style={[styles.title, { color: theme.colors.textPrimary }]}
            numberOfLines={2}
          >
            {title}
          </AppText>

          {!!excerpt && (
            <AppText
              style={[styles.excerpt, { color: theme.colors.textSecondary }]}
              numberOfLines={2}
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

            {(!!date || !!category) && (
              <AppText
                style={[styles.meta2, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {date ? `${date}` : ''}
                {date && category ? '  •  ' : ''}
                {category ? category : ''}
              </AppText>
            )}
          </View>
        </View>

        <Image
          source={thumbnail ? { uri: thumbnail } : FALLBACK}
          style={styles.thumb}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}
