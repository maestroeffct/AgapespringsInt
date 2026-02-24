import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Animated, Image } from 'react-native';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';

type VideoCardProps = {
  thumbnail?: string;
  title?: string;
  onPress?: () => void;
  full?: boolean;
  layout?: 'vertical' | 'horizontal';
};

const FALLBACK = require('../../../assets/images/video_cover.png');

export function VideoCard({
  thumbnail,
  title = 'PASTORAL TRAINING PROGRAM (PTP)...',
  onPress,
  full = false,
  layout = 'vertical',
}: VideoCardProps) {
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRenderRemote, setShouldRenderRemote] = useState(false);

  useEffect(() => {
    remoteOpacity.setValue(0);
    setShouldRenderRemote(false);

    if (!thumbnail) return;

    const timer = setTimeout(() => {
      setShouldRenderRemote(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [thumbnail, remoteOpacity]);

  const isHorizontal = layout === 'horizontal';

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        style={[
          full ? styles.fullCard : styles.card,
          isHorizontal && styles.horizontalCard,
        ]}
      >
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

        <View style={isHorizontal && styles.horizontalTextWrap}>
          <AppText variant="body" style={styles.text} numberOfLines={2}>
            {title}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
