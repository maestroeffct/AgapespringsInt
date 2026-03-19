import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import { palette } from '../../../theme/colors';

const FALLBACK = require('../../../assets/images/audio_cover.png');

type AudioCardProps = {
  thumbnail?: string;
  title?: string;
  onPress?: () => void;
  full?: boolean;
  author?: string;
  date?: string;
  layout?: 'vertical' | 'horizontal';
  imageHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AudioCard({
  thumbnail,
  title = 'Faith, Money, Offerings & your Future...',
  onPress,
  full = false,
  author,
  date,
  layout = 'vertical',
  imageHeight,
  containerStyle,
}: AudioCardProps) {
  const { isDark } = useTheme();
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRenderRemote, setShouldRenderRemote] = useState(false);

  const isHorizontal = layout === 'horizontal';

  useEffect(() => {
    remoteOpacity.setValue(0);
    setShouldRenderRemote(!!thumbnail);
  }, [thumbnail, remoteOpacity]);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        style={[
          full ? styles.fullCard : styles.card,
          isHorizontal && styles.horizontalCard,
          containerStyle,
        ]}
      >
        {/* Image */}
        <View
          style={[
            styles.imageWrap,
            isHorizontal && styles.horizontalImageWrap,
            imageHeight ? { height: imageHeight } : null,
          ]}
        >
          <Image
            source={FALLBACK}
            style={styles.imageFill}
            resizeMode="cover"
          />

          {shouldRenderRemote && thumbnail ? (
            <Animated.Image
              source={{ uri: thumbnail }}
              style={[styles.imageFill, { opacity: remoteOpacity }]}
              resizeMode="cover"
              onLoad={() => {
                Animated.timing(remoteOpacity, {
                  toValue: 1,
                  duration: 350,
                  useNativeDriver: true,
                }).start();
              }}
              onError={() => {
                setShouldRenderRemote(false);
              }}
            />
          ) : null}
        </View>

        {/* Text Section */}
        <View style={isHorizontal && styles.horizontalTextWrap}>
          <AppText
            variant="body"
            numberOfLines={2}
            style={[
              styles.title,
              { color: isDark ? palette.white : palette.gray900 },
            ]}
          >
            {title}
          </AppText>

          {author ? (
            <AppText variant="caption" style={styles.author}>
              {author}
            </AppText>
          ) : null}

          {date ? (
            <AppText variant="caption" style={styles.date}>
              {date}
            </AppText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
