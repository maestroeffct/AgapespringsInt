import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';

const FALLBACK = require('../../../assets/images/audio_cover.png');

export function AudioCard({
  thumbnail,
  title = 'Faith, Money, Offerings & your Future...',
  onPress,
  full = false,
  author,
  date,
  layout = 'vertical',
}: AudioCardProps) {
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRenderRemote, setShouldRenderRemote] = useState(false);

  const isHorizontal = layout === 'horizontal';

  useEffect(() => {
    remoteOpacity.setValue(0);
    setShouldRenderRemote(false);

    if (!thumbnail) return;

    const timer = setTimeout(() => {
      setShouldRenderRemote(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [thumbnail, remoteOpacity]);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        style={[
          full ? styles.fullCard : styles.card,
          isHorizontal && styles.horizontalCard,
        ]}
      >
        {/* Image */}
        <View
          style={[styles.imageWrap, isHorizontal && styles.horizontalImageWrap]}
        >
          <Image
            source={FALLBACK}
            style={styles.imageFill}
            resizeMode="cover"
          />

          {shouldRenderRemote && !!thumbnail && (
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
            />
          )}
        </View>

        {/* Text Section */}
        <View style={isHorizontal && styles.horizontalTextWrap}>
          <AppText variant="body" numberOfLines={2} style={styles.title}>
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
