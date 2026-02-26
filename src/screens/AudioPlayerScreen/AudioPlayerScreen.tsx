import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
  Alert,
  Animated,
} from 'react-native';

import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppText } from '../../components/AppText/AppText';
import { getItem, setItem, StorageKeys } from '../../helpers/storage';

type AudioPlayerParams = {
  audioUrl?: string;
  title?: string;
  author?: string;
  artwork?: string;
  id?: string; // unique id for favorites/download name
};

// Temporary local toggle for UI testing without navigation params.
const USE_DUMMY_AUDIO = false;

const DUMMY_AUDIO: Required<AudioPlayerParams> = {
  id: 'dummy-1',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  title: 'Dummy Audio Title',
  author: 'Dummy Author',
  artwork: 'https://picsum.photos/700/700',
};

const LOCAL_BACKGROUND = require('../../assets/images/audio_cover.png');
const LOCAL_COVER_ARTWORK = require('../../assets/images/audio_cover.png');

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const mm = String(m).padStart(1, '0');
  const rr = String(r).padStart(2, '0');
  return `${mm}:${rr}`;
}

function safeFilename(name: string) {
  return name.replace(/[\/\\?%*:|"<>]/g, '-').trim();
}

export default function AudioPlayerScreen({ route, navigation }: any) {
  const routeParams: AudioPlayerParams = route?.params ?? {};

  const data = USE_DUMMY_AUDIO
    ? DUMMY_AUDIO
    : {
        id: routeParams.id ?? routeParams.audioUrl ?? 'audio',
        audioUrl: routeParams.audioUrl ?? DUMMY_AUDIO.audioUrl,
        title: routeParams.title ?? DUMMY_AUDIO.title,
        author: routeParams.author ?? DUMMY_AUDIO.author,
        artwork: routeParams.artwork ?? DUMMY_AUDIO.artwork,
      };

  const { id, audioUrl, title, author, artwork } = data;

  const playbackState = usePlaybackState();
  const progress = useProgress(250); // updates every 250ms
  const [ready, setReady] = useState(false);

  // Repeat: off -> one -> all
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  // Favorite
  const [isFav, setIsFav] = useState(false);

  // Download
  const [downloading, setDownloading] = useState(false);
  const [downloadedPath, setDownloadedPath] = useState<string | null>(null);
  const artworkOpacity = useRef(new Animated.Value(0)).current;
  const [showRemoteArtwork, setShowRemoteArtwork] = useState(false);

  // waveform animation
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const hasRemoteArtwork =
    typeof artwork === 'string' &&
    (artwork.startsWith('http://') || artwork.startsWith('https://'));

  const bars = useMemo(() => {
    // deterministic “fake waveform” bars
    const count = 60;
    const out = Array.from({ length: count }).map((_, i) => {
      const v = (Math.sin(i * 0.55) + Math.sin(i * 0.19) + 2) / 4; // 0..1
      return 10 + Math.floor(v * 42); // 10..52
    });
    return out;
  }, []);

  const setup = useCallback(async () => {
    // Setup only once per screen entry
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });

    await TrackPlayer.reset();

    await TrackPlayer.add({
      id: String(id),
      url: audioUrl,
      title: title,
      artist: author,
      artwork: artwork,
    });

    await TrackPlayer.setRepeatMode(RepeatMode.Off);

    setRepeatMode(RepeatMode.Off);
    setReady(true);
  }, [audioUrl, title, author, artwork, id]);

  useEffect(() => {
    setup();
  }, [setup]);

  useEffect(() => {
    artworkOpacity.setValue(0);
    setShowRemoteArtwork(false);

    if (!hasRemoteArtwork) return;
    setShowRemoteArtwork(true);
  }, [artwork, hasRemoteArtwork, artworkOpacity]);

  // Load favorite state
  useEffect(() => {
    (async () => {
      const favMap = (await getItem<Record<string, boolean>>(
        StorageKeys.FAVORITES,
      )) as Record<string, boolean> | null;

      setIsFav(!!favMap?.[String(id)]);
    })();
  }, [id]);

  // Animate waveform fill smoothly based on progress ratio
  useEffect(() => {
    const ratio =
      progress.duration > 0 ? progress.position / progress.duration : 0;

    Animated.timing(scaleAnim, {
      toValue: ratio,
      duration: 220,
      useNativeDriver: true, // we animate scaleX (supported)
    }).start();
  }, [progress.position, progress.duration, scaleAnim]);

  const isPlaying = playbackState.state === State.Playing;

  const togglePlay = async () => {
    if (!ready) return;

    if (isPlaying) await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  const seekBy = async (delta: number) => {
    const pos = await TrackPlayer.getPosition();
    const dur = await TrackPlayer.getDuration();
    const next = Math.min(Math.max(0, pos + delta), Math.max(0, dur));
    await TrackPlayer.seekTo(next);
  };

  const cycleRepeat = async () => {
    const next =
      repeatMode === RepeatMode.Off
        ? RepeatMode.Track
        : repeatMode === RepeatMode.Track
        ? RepeatMode.Queue
        : RepeatMode.Off;

    setRepeatMode(next);
    await TrackPlayer.setRepeatMode(next);
  };

  const toggleFavorite = async () => {
    const prev = (await getItem<Record<string, boolean>>(
      StorageKeys.FAVORITES,
    )) as Record<string, boolean> | null;

    const map = { ...(prev ?? {}) };
    const next = !isFav;
    map[String(id)] = next;

    setIsFav(next);
    await setItem(StorageKeys.FAVORITES, map);
  };

  const doShare = async () => {
    try {
      await Share.share({
        message: `${title}\n${author ?? ''}\n${audioUrl}`,
      });
    } catch {}
  };

  const downloadAudio = async () => {
    if (!audioUrl) return;
    if (downloading) return;

    try {
      setDownloading(true);

      const fileName = safeFilename(`${title || 'audio'}.mp3`);
      const dir = RNFS.DocumentDirectoryPath + '/downloads'; // app sandbox downloads
      const path = `${dir}/${fileName}`;

      const existsDir = await RNFS.exists(dir);
      if (!existsDir) await RNFS.mkdir(dir);

      const exists = await RNFS.exists(path);
      if (exists) {
        setDownloadedPath(path);
        Alert.alert('Downloaded', 'This audio is already downloaded.');
        setDownloading(false);
        return;
      }

      const task = RNFS.downloadFile({
        fromUrl: audioUrl,
        toFile: path,
      });

      const res = await task.promise;

      if (res.statusCode === 200) {
        setDownloadedPath(path);
        Alert.alert('Downloaded', 'Saved inside app storage (Documents).');
      } else {
        Alert.alert('Download failed', `Status: ${res.statusCode}`);
      }
    } catch (e: any) {
      Alert.alert('Download failed', e?.message ?? 'Unknown error');
    } finally {
      setDownloading(false);
    }
  };

  const repeatIcon =
    repeatMode === RepeatMode.Off
      ? 'repeat-outline'
      : repeatMode === RepeatMode.Track
      ? 'repeat'
      : 'repeat';

  const repeatLabel =
    repeatMode === RepeatMode.Off
      ? 'Repeat'
      : repeatMode === RepeatMode.Track
      ? 'Repeat One'
      : 'Repeat All';

  return (
    <ImageBackground
      source={LOCAL_BACKGROUND}
      blurRadius={24}
      style={styles.bg}
    >
      {/* Dark overlay gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.75)']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.container}>
        {/* Top */}
        <View style={styles.topRow}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.95} onPress={doShare}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.headerText}>
          <AppText style={styles.title} numberOfLines={2}>
            {title}
          </AppText>
          <AppText style={styles.author} numberOfLines={1}>
            {author}
          </AppText>
        </View>

        {/* Cover */}
        <View style={styles.coverWrap}>
          <Image source={LOCAL_COVER_ARTWORK} style={styles.cover} />
          {showRemoteArtwork ? (
            <Animated.Image
              source={{ uri: artwork }}
              style={[
                styles.cover,
                styles.coverOverlay,
                { opacity: artworkOpacity },
              ]}
              onLoad={() => {
                Animated.timing(artworkOpacity, {
                  toValue: 1,
                  duration: 450,
                  useNativeDriver: true,
                }).start();
              }}
              onError={() => {
                artworkOpacity.setValue(0);
                setShowRemoteArtwork(false);
              }}
            />
          ) : null}
        </View>

        {/* Waveform + time */}
        <View style={styles.waveWrap}>
          <View style={styles.waveRow}>
            {/* base bars */}
            <View style={styles.waveBars}>
              {bars.map((h, i) => (
                <View
                  key={i}
                  style={[styles.waveBar, { height: h, opacity: 0.28 }]}
                />
              ))}
            </View>

            {/* filled overlay bars (scaleX) */}
            <Animated.View
              style={[
                styles.waveFill,
                {
                  transform: [
                    { scaleX: scaleAnim },
                    { translateX: 0 }, // keep simple
                  ],
                },
              ]}
            >
              <View style={styles.waveBars}>
                {bars.map((h, i) => (
                  <View key={i} style={[styles.waveBar, { height: h }]} />
                ))}
              </View>
            </Animated.View>
          </View>

          <View style={styles.timeRow}>
            <AppText style={styles.timeText}>
              {formatTime(progress.position)}
            </AppText>
            <AppText style={styles.timeText}>
              {formatTime(progress.duration)}
            </AppText>
          </View>

          {/* Scrubber */}
          <Slider
            style={styles.slider}
            value={progress.position}
            minimumValue={0}
            maximumValue={Math.max(1, progress.duration)}
            onSlidingComplete={(v: number) => TrackPlayer.seekTo(v)}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.25)"
            thumbTintColor="#ffffff"
          />
        </View>

        {/* Actions row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.actionBtn}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color="#fff"
            />
            <AppText style={styles.actionLabel}>Favorite</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.actionBtn}
            onPress={cycleRepeat}
          >
            <Ionicons name={repeatIcon as any} size={22} color="#fff" />
            <AppText style={styles.actionLabel}>{repeatLabel}</AppText>
            {repeatMode === RepeatMode.Track ? (
              <View style={styles.repeatOneBadge}>
                <AppText style={styles.repeatOneText}>1</AppText>
              </View>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.actionBtn}
            onPress={downloadAudio}
            disabled={downloading}
          >
            <Ionicons
              name={downloadedPath ? 'checkmark-circle' : 'download-outline'}
              size={22}
              color="#fff"
            />
            <AppText style={styles.actionLabel}>
              {downloading ? 'Downloading' : 'Download'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Transport controls */}
        <View style={styles.controls}>
          <TouchableOpacity activeOpacity={0.95} onPress={() => seekBy(-30)}>
            <Ionicons name="play-skip-back" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => seekBy(-10)}
            style={styles.seekBtn}
          >
            <Ionicons name="play-back" size={28} color="#fff" />
            <AppText style={styles.seekText}>10</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.playBtn}
            onPress={togglePlay}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={34}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => seekBy(10)}
            style={styles.seekBtn}
          >
            <Ionicons name="play-forward" size={28} color="#fff" />
            <AppText style={styles.seekText}>10</AppText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.95} onPress={() => seekBy(30)}>
            <Ionicons name="play-skip-forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, paddingHorizontal: 18 },
  container: { flex: 1, paddingHorizontal: 18 },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },

  headerText: {
    marginTop: 18,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 320,
  },
  author: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  coverWrap: {
    alignItems: 'center',
    marginTop: 22,
  },
  cover: {
    width: 290,
    height: 290,
    borderRadius: 18,
  },
  coverOverlay: {
    position: 'absolute',
  },

  waveWrap: {
    marginTop: 22,
  },
  waveRow: {
    height: 64,
    justifyContent: 'center',
  },
  waveBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  waveFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    transformOrigin: 'left',
  },

  timeRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },

  slider: {
    marginTop: 6,
  },

  actionRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 6,
    width: 95,
  },
  actionLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    textAlign: 'center',
  },

  repeatOneBadge: {
    position: 'absolute',
    right: 18,
    top: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  controls: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  playBtn: {
    backgroundColor: '#fff',
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekText: {
    position: 'absolute',
    bottom: 6,
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
