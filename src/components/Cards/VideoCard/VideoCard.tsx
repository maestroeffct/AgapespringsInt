import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import { palette } from '../../../theme/colors';
import { getRemoteImageUri } from '../../../helpers/imageSource';

type SubscribeFn = (cb: (keys: ReadonlySet<string>) => void) => () => void;

type VideoCardProps = {
  thumbnail?: string;
  title?: string;
  date?: string;
  onPress?: () => void;
  full?: boolean;
  layout?: 'vertical' | 'horizontal';
  imageHeight?: number;
  index?: number;
  visibilityKey?: string;
  subscribe?: SubscribeFn;
};

const FALLBACK = require('../../../assets/images/video_cover.png');

export function VideoCard({
  thumbnail,
  title = 'PASTORAL TRAINING PROGRAM (PTP)...',
  onPress,
  full = false,
  layout = 'vertical',
  date,
  imageHeight,
  index = 0,
  visibilityKey,
  subscribe,
}: VideoCardProps) {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const imgFadeAnim = useRef(new Animated.Value(0)).current;
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);

  const isHorizontal = layout === 'horizontal';
  const wrapHeight = imageHeight ?? (isHorizontal ? 100 : 160);
  const showRemote = !!remoteThumbnailUri && !imgError;

  const translateY = useRef(new Animated.Value(subscribe ? 36 : 0)).current;
  const opacity = useRef(new Animated.Value(subscribe ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(subscribe ? 0.93 : 1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const wasVisibleRef = useRef(false);
  const hasAnimatedRef = useRef(false);

  const animate = useRef(() => {
    animationRef.current?.stop();
    translateY.setValue(36);
    opacity.setValue(0);
    scale.setValue(0.93);
    const delay = (index % 4) * 55;
    animationRef.current = Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 340, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 290, delay, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, delay, useNativeDriver: true, damping: 16, stiffness: 130 }),
    ]);
    animationRef.current.start();
  }).current;

  useEffect(() => {
    if (!subscribe || !visibilityKey) return;

    const unsub = subscribe((keys) => {
      const nowVisible = keys.has(visibilityKey);
      if (nowVisible && !wasVisibleRef.current && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        animate();
      }
      wasVisibleRef.current = nowVisible;
    });

    return unsub;
  }, [subscribe, visibilityKey, animate]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <View
          style={[
            full ? styles.fullCard : styles.card,
            isHorizontal && styles.horizontalCard,
          ]}
        >
          <View
            style={[
              styles.imageWrap,
              isHorizontal && styles.horizontalImageWrap,
              { height: wrapHeight },
            ]}
          >
            {/* Fallback always underneath */}
            <Image source={FALLBACK} style={styles.imageMain} resizeMode="cover" />
            {showRemote && (
              <Animated.Image
                source={{ uri: remoteThumbnailUri }}
                style={[styles.imageMain, { position: 'absolute', opacity: imgFadeAnim }]}
                resizeMode="cover"
                onLoad={() => {
                  setImgReady(true);
                  Animated.timing(imgFadeAnim, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                  }).start();
                }}
                onError={() => setImgError(true)}
              />
            )}
          </View>

          <View style={isHorizontal && styles.horizontalTextWrap}>
            <AppText
              variant="body"
              style={[
                styles.text,
                { color: isDark ? palette.white : palette.gray900 },
              ]}
              numberOfLines={3}
            >
              {title}
            </AppText>

            {date ? (
              <AppText variant="caption" style={styles.date} numberOfLines={1}>
                {date}
              </AppText>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
