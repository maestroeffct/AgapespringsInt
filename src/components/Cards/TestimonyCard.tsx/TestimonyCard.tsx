import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';
import { getRemoteImageUri } from '../../../helpers/imageSource';

type TestimonyCardProps = {
  thumbnail?: any;
  title?: string;
  onPress?: () => void;
  full?: boolean;
};

const FALLBACK = require('../../../assets/images/testimony_cover.png');

export function TestimonyCard({
  thumbnail = require('../../../assets/images/testimony_cover.png'),
  title = 'Patterns',
  onPress,
  full = false,
}: TestimonyCardProps) {
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRenderRemote, setShouldRenderRemote] = useState(false);
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);

  useEffect(() => {
    // reset when thumbnail changes
    remoteOpacity.setValue(0);
    setShouldRenderRemote(false);

    if (!remoteThumbnailUri) return;

    // optional delay BEFORE we even try to show remote
    const timer = setTimeout(() => {
      // render remote layer; fade happens when onLoad fires
      setShouldRenderRemote(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [remoteOpacity, remoteThumbnailUri]);
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View style={[full ? styles.fullCard : styles.card]}>
        {/* Image wrapper keeps size & radius */}
        <View style={styles.imageWrap}>
          {/* Fallback always visible */}
          <Image
            source={FALLBACK}
            style={styles.imageFill}
            resizeMode="cover"
          />

          {/* Remote fades IN over fallback (no fade-out, no blink) */}
          {shouldRenderRemote && !!remoteThumbnailUri && (
            <Animated.Image
              source={{ uri: remoteThumbnailUri }}
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
        <AppText variant="body" numberOfLines={1}>
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
