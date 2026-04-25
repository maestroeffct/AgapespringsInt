import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import { AppText } from '../../../components/AppText/AppText';
import { useTheme } from '../../../theme/ThemeProvider';
import { palette } from '../../../theme/colors';
import { getRemoteImageUri } from '../../../helpers/imageSource';

type VideoCardProps = {
  thumbnail?: string;
  title?: string;
  date?: string;
  onPress?: () => void;
  full?: boolean;
  layout?: 'vertical' | 'horizontal';
  imageHeight?: number;
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
}: VideoCardProps) {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const remoteThumbnailUri = getRemoteImageUri(thumbnail);

  const isHorizontal = layout === 'horizontal';
  const wrapHeight = imageHeight ?? (isHorizontal ? 100 : 160);
  const showRemote = !!remoteThumbnailUri && !imgError;

  return (
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
          {/* Fallback visible until remote is ready */}
          {!imgReady && (
            <Image source={FALLBACK} style={styles.imageMain} resizeMode="cover" />
          )}
          {showRemote && (
            <Image
              source={{ uri: remoteThumbnailUri }}
              style={[styles.imageMain, !imgReady && { position: 'absolute', opacity: 0 }]}
              resizeMode="cover"
              onLoad={() => setImgReady(true)}
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
  );
}
