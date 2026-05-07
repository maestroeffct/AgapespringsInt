import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';

type SubscribeFn = (cb: (keys: ReadonlySet<string>) => void) => () => void;
import Ionicons from '@react-native-vector-icons/ionicons';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import { palette } from '../../../theme/colors';
import { getRemoteImageUri } from '../../../helpers/imageSource';

const FALLBACK = require('../../../assets/images/audio_cover.png');

type AudioCardProps = {
  thumbnail?: string;
  title?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  full?: boolean;
  author?: string;
  date?: string;
  sizeLabel?: string;
  onDownloadPress?: () => void;
  downloadState?: 'idle' | 'downloading' | 'downloaded';
  layout?: 'vertical' | 'horizontal';
  imageHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  isPlaying?: boolean;
  index?: number;
  visibilityKey?: string;
  subscribe?: SubscribeFn;
};

// ── Wave bar (one bar of the now-playing animation) ──────────────
function WaveBar({ index, color }: { index: number; color: string }) {
  const h = useRef(new Animated.Value(3 + index * 3)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(h, { toValue: 14, duration: 380, useNativeDriver: false }),
        Animated.timing(h, { toValue: 3, duration: 380, useNativeDriver: false }),
      ]),
    );
    timer = setTimeout(() => anim.start(), index * 130);
    return () => {
      clearTimeout(timer);
      anim.stop();
    };
  }, [h, index]);

  // eslint-disable-next-line react-native/no-inline-styles
  return <Animated.View style={{ width: 3, height: h, backgroundColor: color, borderRadius: 1.5, alignSelf: 'flex-end' }} />;
}

export function AudioCard({
  thumbnail,
  title = 'Faith, Money, Offerings & your Future...',
  onPress,
  onLongPress,
  full = false,
  author,
  date,
  sizeLabel,
  onDownloadPress,
  downloadState = 'idle',
  layout = 'vertical',
  imageHeight,
  containerStyle,
  isPlaying = false,
  index = 0,
  visibilityKey,
  subscribe,
}: AudioCardProps) {
  const { theme, isDark } = useTheme();

  // Entrance animation
  const translateY = useRef(new Animated.Value(subscribe ? 36 : 0)).current;
  const opacity = useRef(new Animated.Value(subscribe ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(subscribe ? 0.93 : 1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const wasVisibleRef = useRef(false);
  const hasAnimatedRef = useRef(false);

  const animate = useRef(() => {
    animRef.current?.stop();
    translateY.setValue(36);
    opacity.setValue(0);
    scale.setValue(0.93);
    const delay = (index % 4) * 55;
    animRef.current = Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 340, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 290, delay, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, delay, useNativeDriver: true, damping: 16, stiffness: 130 }),
    ]);
    animRef.current.start();
  }).current;

  useEffect(() => {
    if (!subscribe || !visibilityKey) return;
    const unsub = subscribe(keys => {
      const nowVisible = keys.has(visibilityKey);
      if (nowVisible && !wasVisibleRef.current && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        animate();
      }
      wasVisibleRef.current = nowVisible;
    });
    return unsub;
  }, [subscribe, visibilityKey, animate]);
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRenderRemote, setShouldRenderRemote] = useState(false);
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);

  const isHorizontal = layout === 'horizontal';

  useEffect(() => {
    remoteOpacity.setValue(0);
    setShouldRenderRemote(!!remoteThumbnailUri);
  }, [remoteOpacity, remoteThumbnailUri]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale }] }}>
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
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

          {shouldRenderRemote && remoteThumbnailUri ? (
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
              onError={() => {
                setShouldRenderRemote(false);
              }}
            />
          ) : null}

          {/* Now-playing overlay */}
          {isPlaying && (
            <View style={styles.nowPlayingOverlay}>
              <View style={styles.waveRow}>
                <WaveBar index={0} color="#fff" />
                <WaveBar index={1} color="#fff" />
                <WaveBar index={2} color="#fff" />
              </View>
            </View>
          )}
        </View>

        {/* Text Section */}
        <View style={isHorizontal && styles.horizontalTextWrap}>
          <View style={isPlaying ? styles.playingTitleRow : null}>
            <AppText
              variant="body"
              numberOfLines={2}
              style={[
                styles.title,
                { color: isPlaying ? theme.colors.primary : isDark ? palette.white : palette.gray900 },
              ]}
            >
              {title}
            </AppText>
          </View>

          {author ? (
            <AppText variant="caption" style={styles.author}>
              {author}
            </AppText>
          ) : null}

          {layout === 'horizontal' && (sizeLabel || date) ? (
            <View style={styles.metaRow}>
              {!!sizeLabel && (
                <AppText
                  variant="caption"
                  numberOfLines={1}
                  style={[
                    styles.metaText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {sizeLabel}
                </AppText>
              )}

              {onDownloadPress ? (
                <TouchableOpacity
                  onPress={onDownloadPress}
                  hitSlop={8}
                  style={styles.downloadBtn}
                >
                  {downloadState === 'downloading' ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.textSecondary}
                    />
                  ) : (
                    <Ionicons
                      name={
                        downloadState === 'downloaded'
                          ? 'checkmark-circle'
                          : 'download-outline'
                      }
                      size={18}
                      color={
                        downloadState === 'downloaded'
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <Ionicons
                  name="download-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              )}

              {!!date && (
                <AppText
                  variant="caption"
                  numberOfLines={1}
                  style={[
                    styles.metaText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {date}
                </AppText>
              )}
            </View>
          ) : date ? (
            <AppText variant="caption" style={styles.date}>
              {date}
            </AppText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
}
