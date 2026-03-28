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
  full?: boolean;
  author?: string;
  date?: string;
  sizeLabel?: string;
  onDownloadPress?: () => void;
  downloadState?: 'idle' | 'downloading' | 'downloaded';
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
  sizeLabel,
  onDownloadPress,
  downloadState = 'idle',
  layout = 'vertical',
  imageHeight,
  containerStyle,
}: AudioCardProps) {
  const { theme, isDark } = useTheme();
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const [shouldRenderRemote, setShouldRenderRemote] = useState(false);
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);

  const isHorizontal = layout === 'horizontal';

  useEffect(() => {
    remoteOpacity.setValue(0);
    setShouldRenderRemote(!!remoteThumbnailUri);
  }, [remoteOpacity, remoteThumbnailUri]);

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
  );
}
