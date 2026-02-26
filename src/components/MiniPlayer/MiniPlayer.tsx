import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

import Ionicons from '@react-native-vector-icons/ionicons';
import { AppText } from '../AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';

const FALLBACK = require('../../assets/images/audio_cover.png');
const TAB_BAR_HEIGHT = 20;
const MINI_PLAYER_GAP = 6;

type Props = {
  onPress?: () => void; // open full player
};

export function MiniPlayer({ onPress }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const track = useActiveTrack();
  const playback = usePlaybackState();
  const { position, duration } = useProgress(500);
  const [dismissedTrackId, setDismissedTrackId] = useState<string | null>(null);

  const isPlaying = playback.state === State.Playing;

  const title = track?.title ?? '';
  const artist = track?.artist ?? '';
  const artwork = useMemo(() => {
    if (typeof track?.artwork === 'string' && track.artwork.startsWith('http'))
      return { uri: track.artwork };
    return FALLBACK;
  }, [track?.artwork]);

  // Only show when we have an active track
  if (!track?.id) return null;
  const currentTrackId = String(track.id);
  if (dismissedTrackId === currentTrackId) return null;

  const ratio = duration > 0 ? position / duration : 0;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,
        { bottom: insets.bottom + TAB_BAR_HEIGHT + MINI_PLAYER_GAP },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {/* Artwork */}
        <Image source={artwork} style={styles.artwork} />

        {/* Text */}
        <View style={styles.textWrap}>
          <AppText
            numberOfLines={1}
            style={[styles.title, { color: theme.colors.textPrimary }]}
          >
            {title || 'Now Playing'}
          </AppText>
          <AppText
            numberOfLines={1}
            style={[styles.artist, { color: theme.colors.textSecondary }]}
          >
            {artist || ' '}
          </AppText>

          {/* Progress bar */}
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.colors.border },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.max(0, Math.min(1, ratio)) * 100}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => TrackPlayer.skipToPrevious().catch(() => {})}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Ionicons
              name="play-skip-back"
              size={20}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              isPlaying ? TrackPlayer.pause() : TrackPlayer.play()
            }
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={22}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => TrackPlayer.skipToNext().catch(() => {})}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Ionicons
              name="play-skip-forward"
              size={20}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.closeBtn,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => setDismissedTrackId(currentTrackId)}
      >
        <Ionicons name="close" size={14} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,

    // a little lift
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    elevation: 8,
  },
  artwork: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  artist: {
    fontSize: 12,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: -6,
    right: 18,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
