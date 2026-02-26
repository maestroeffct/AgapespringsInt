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
  Alert,
  Animated,
  Modal,
  ScrollView,
} from 'react-native';

import TrackPlayer, {
  RepeatMode,
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import type { Track } from 'react-native-track-player';

import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppText } from '../../components/AppText/AppText';
import { getItem, setItem, StorageKeys } from '../../helpers/storage';
import { ensureTrackPlayerSetup } from '../../player/ensureTrackPlayerSetup';
import type { AudioQueueItem } from '../../navigation/types';

type AudioPlayerParams = {
  audioUrl?: string;
  title?: string;
  author?: string;
  artwork?: string;
  id?: string; // unique id for favorites/download name
  queue?: AudioQueueItem[];
  startIndex?: number;
};

const LOCAL_BACKGROUND = require('../../assets/images/audio_cover.png');
const LOCAL_COVER_ARTWORK = require('../../assets/images/audio_cover.png');
const MIN_PLAYBACK_RATE = 0.5;
const MAX_PLAYBACK_RATE = 2;
const PLAYBACK_RATE_STEP = 0.25;

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const mm = String(m).padStart(1, '0');
  const rr = String(r).padStart(2, '0');
  return `${mm}:${rr}`;
}

function safeFilename(name: string) {
  return name.replace(/[/?%*:|"<>\\]/g, '-').trim();
}

function queuesAreSame(existingQueue: Track[], incomingQueue: Track[]) {
  if (existingQueue.length !== incomingQueue.length) return false;

  return existingQueue.every((existingTrack, index) => {
    const incomingTrack = incomingQueue[index];
    const existingId = String(existingTrack?.id ?? '');
    const incomingId = String(incomingTrack?.id ?? '');
    const existingUrl =
      typeof existingTrack?.url === 'string' ? existingTrack.url : '';
    const incomingUrl =
      typeof incomingTrack?.url === 'string' ? incomingTrack.url : '';

    return existingId === incomingId && existingUrl === incomingUrl;
  });
}

export default function AudioPlayerScreen({ route, navigation }: any) {
  const routeParams: AudioPlayerParams = route?.params ?? {};

  const fallbackTrack = useMemo<AudioQueueItem>(
    () => ({
      id: String(routeParams.id ?? routeParams.audioUrl ?? 'audio'),
      audioUrl: routeParams.audioUrl ?? '',
      title: routeParams.title ?? 'Audio',
      author: routeParams.author ?? '',
      artwork: routeParams.artwork,
    }),
    [
      routeParams.id,
      routeParams.audioUrl,
      routeParams.title,
      routeParams.author,
      routeParams.artwork,
    ],
  );

  const incomingQueue = useMemo<AudioQueueItem[]>(() => {
    const fromParams = Array.isArray(routeParams.queue)
      ? routeParams.queue.filter(item => item?.audioUrl)
      : [];

    if (fromParams.length > 0) {
      return fromParams.map((item, index) => ({
        id: String(item.id ?? `audio-${index}`),
        audioUrl: item.audioUrl,
        title: item.title,
        author: item.author,
        artwork: item.artwork,
      }));
    }

    return fallbackTrack.audioUrl ? [fallbackTrack] : [];
  }, [routeParams.queue, fallbackTrack]);

  const initialQueueIndex = useMemo(() => {
    const queueSize = incomingQueue.length;
    if (queueSize <= 1) return 0;

    const paramIndex = routeParams.startIndex;
    if (typeof paramIndex === 'number' && Number.isFinite(paramIndex)) {
      return Math.min(Math.max(0, Math.floor(paramIndex)), queueSize - 1);
    }

    const routeId = routeParams.id ? String(routeParams.id) : undefined;
    if (routeId) {
      const foundIndex = incomingQueue.findIndex(item => item.id === routeId);
      if (foundIndex >= 0) return foundIndex;
    }

    return 0;
  }, [incomingQueue, routeParams.startIndex, routeParams.id]);

  const activeTrack = useActiveTrack();
  const activeId = String(activeTrack?.id ?? fallbackTrack.id);
  const activeAudioUrl =
    typeof activeTrack?.url === 'string'
      ? activeTrack.url
      : fallbackTrack.audioUrl;
  const activeTitle = activeTrack?.title ?? fallbackTrack.title ?? 'Audio';
  const activeAuthor = activeTrack?.artist ?? fallbackTrack.author ?? '';
  const activeArtwork =
    typeof activeTrack?.artwork === 'string'
      ? activeTrack.artwork
      : fallbackTrack.artwork;

  const playbackState = usePlaybackState();
  const progress = useProgress(250); // updates every 250ms
  const [ready, setReady] = useState(false);

  // Repeat: off -> one -> all
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Favorite
  const [isFav, setIsFav] = useState(false);

  // Download
  const [downloading, setDownloading] = useState(false);
  const [downloadedPath, setDownloadedPath] = useState<string | null>(null);
  const artworkOpacity = useRef(new Animated.Value(0)).current;
  const [showRemoteArtwork, setShowRemoteArtwork] = useState(false);
  const [queueVisible, setQueueVisible] = useState(false);
  const [queueTracks, setQueueTracks] = useState<Track[]>([]);
  const [activeQueueIndex, setActiveQueueIndex] = useState<number | null>(null);
  const [loadingQueue, setLoadingQueue] = useState(false);

  // waveform animation
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const hasRemoteArtwork =
    typeof activeArtwork === 'string' &&
    (activeArtwork.startsWith('http://') ||
      activeArtwork.startsWith('https://'));

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
    // Setup player + queue for the route that opened this screen.
    await ensureTrackPlayerSetup();

    if (incomingQueue.length === 0) {
      setReady(false);
      Alert.alert('Audio Player', 'No audio source was provided for playback.');
      return;
    }

    const tracks: Track[] = incomingQueue.map((item, index) => ({
      id: String(item.id ?? `audio-${index}`),
      url: item.audioUrl,
      title: item.title,
      artist: item.author,
      artwork: item.artwork,
    }));

    const [existingQueue, existingActiveIndex, currentRepeatMode, currentRate] =
      await Promise.all([
        TrackPlayer.getQueue(),
        TrackPlayer.getActiveTrackIndex(),
        TrackPlayer.getRepeatMode().catch(() => RepeatMode.Off),
        TrackPlayer.getRate().catch(() => 1),
      ]);

    const hasSameQueue = queuesAreSame(existingQueue, tracks);

    if (hasSameQueue) {
      const currentIndex =
        typeof existingActiveIndex === 'number' ? existingActiveIndex : 0;

      if (currentIndex !== initialQueueIndex && initialQueueIndex >= 0) {
        await TrackPlayer.skip(initialQueueIndex);
      }

      const latestIndex = await TrackPlayer.getActiveTrackIndex();
      setActiveQueueIndex(
        typeof latestIndex === 'number' ? latestIndex : initialQueueIndex,
      );
      setRepeatMode(currentRepeatMode);
      setPlaybackRate(currentRate);
      setReady(true);
      return;
    }

    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);

    if (initialQueueIndex > 0) {
      await TrackPlayer.skip(initialQueueIndex);
    }

    await TrackPlayer.setRepeatMode(RepeatMode.Off);
    await TrackPlayer.setRate(1);

    setActiveQueueIndex(initialQueueIndex);
    setRepeatMode(RepeatMode.Off);
    setPlaybackRate(1);
    setReady(true);
  }, [incomingQueue, initialQueueIndex]);

  useEffect(() => {
    setup().catch(error => {
      console.error('AudioPlayer setup failed:', error);
      Alert.alert(
        'Audio Player Error',
        'Unable to initialize player. Please try again.',
      );
    });
  }, [setup]);

  useEffect(() => {
    artworkOpacity.setValue(0);
    setShowRemoteArtwork(false);

    if (!hasRemoteArtwork) return;
    setShowRemoteArtwork(true);
  }, [activeArtwork, hasRemoteArtwork, artworkOpacity]);

  // Load favorite state
  useEffect(() => {
    (async () => {
      const favMap = (await getItem<Record<string, boolean>>(
        StorageKeys.FAVORITES,
      )) as Record<string, boolean> | null;

      setIsFav(!!favMap?.[activeId]);
    })();
  }, [activeId]);

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

  const changePlaybackRate = async (delta: number) => {
    const nextRate = Math.min(
      MAX_PLAYBACK_RATE,
      Math.max(
        MIN_PLAYBACK_RATE,
        Math.round((playbackRate + delta) * 100) / 100,
      ),
    );

    if (nextRate === playbackRate) return;

    setPlaybackRate(nextRate);
    await TrackPlayer.setRate(nextRate);
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
    map[activeId] = next;

    setIsFav(next);
    await setItem(StorageKeys.FAVORITES, map);
  };

  const downloadAudio = async () => {
    if (!activeAudioUrl) return;
    if (downloading) return;

    try {
      setDownloading(true);

      const fileName = safeFilename(`${activeTitle || 'audio'}.mp3`);
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
        fromUrl: activeAudioUrl,
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

  const openQueueList = async () => {
    try {
      setLoadingQueue(true);
      await ensureTrackPlayerSetup();
      const [queue, activeIndex] = await Promise.all([
        TrackPlayer.getQueue(),
        TrackPlayer.getActiveTrackIndex(),
      ]);
      setQueueTracks(queue);
      setActiveQueueIndex(typeof activeIndex === 'number' ? activeIndex : null);
      setQueueVisible(true);
    } catch (e: any) {
      Alert.alert('Queue failed', e?.message ?? 'Unable to open queue.');
    } finally {
      setLoadingQueue(false);
    }
  };

  const playFromQueue = async (index: number) => {
    try {
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      setActiveQueueIndex(index);
      setQueueVisible(false);
    } catch (e: any) {
      Alert.alert('Play failed', e?.message ?? 'Unable to play this track.');
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

          <TouchableOpacity activeOpacity={0.95} onPress={openQueueList}>
            <Ionicons name="list-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.headerText}>
          <AppText style={styles.title} numberOfLines={2}>
            {activeTitle}
          </AppText>
          <AppText style={styles.author} numberOfLines={1}>
            {activeAuthor}
          </AppText>
        </View>

        {/* Cover */}
        <View style={styles.coverWrap}>
          <Image source={LOCAL_COVER_ARTWORK} style={styles.cover} />
          {showRemoteArtwork ? (
            <Animated.Image
              source={{ uri: activeArtwork as string }}
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
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => TrackPlayer.skipToPrevious().catch(() => {})}
          >
            <Ionicons name="play-skip-back" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => changePlaybackRate(-PLAYBACK_RATE_STEP)}
            style={styles.speedBtn}
          >
            <Ionicons name="play-back" size={28} color="#fff" />
            <AppText style={styles.speedLabel}>Slower</AppText>
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
            onPress={() => changePlaybackRate(PLAYBACK_RATE_STEP)}
            style={styles.speedBtn}
          >
            <Ionicons name="play-forward" size={28} color="#fff" />
            <AppText style={styles.speedLabel}>Faster</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => TrackPlayer.skipToNext().catch(() => {})}
          >
            <Ionicons name="play-skip-forward" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <AppText style={styles.rateLabel}>
          Playback Speed: {Number(playbackRate.toFixed(2))}x
        </AppText>
      </SafeAreaView>

      <Modal
        visible={queueVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQueueVisible(false)}
      >
        <View style={styles.queueRoot}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.queueBackdrop}
            onPress={() => setQueueVisible(false)}
          />

          <View style={styles.queueSheet}>
            <View style={styles.queueHeader}>
              <AppText style={styles.queueTitle}>Now Playing Queue</AppText>
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => setQueueVisible(false)}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {loadingQueue ? (
              <AppText style={styles.queueMeta}>Loading queue...</AppText>
            ) : queueTracks.length === 0 ? (
              <AppText style={styles.queueMeta}>Queue is empty.</AppText>
            ) : (
              <ScrollView
                style={styles.queueList}
                contentContainerStyle={styles.queueListContent}
                showsVerticalScrollIndicator={false}
              >
                {queueTracks.map((track, index) => {
                  const isActive = index === activeQueueIndex;
                  return (
                    <TouchableOpacity
                      key={`${String(track.id ?? index)}-${index}`}
                      activeOpacity={0.95}
                      style={[
                        styles.queueItem,
                        isActive ? styles.queueItemActive : null,
                      ]}
                      onPress={() => playFromQueue(index)}
                    >
                      <View style={styles.queueItemTextWrap}>
                        <AppText
                          style={styles.queueItemTitle}
                          numberOfLines={1}
                        >
                          {track.title ?? 'Untitled Track'}
                        </AppText>
                        <AppText style={styles.queueItemArtist} numberOfLines={1}>
                          {track.artist ?? 'Unknown Artist'}
                        </AppText>
                      </View>
                      {isActive ? (
                        <Ionicons name="volume-high" size={18} color="#FFD700" />
                      ) : (
                        <Ionicons name="play-outline" size={18} color="#fff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  speedBtn: {
    width: 54,
    height: 66,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  speedLabel: {
    color: '#fff',
    fontSize: 11,
  },
  rateLabel: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    textAlign: 'center',
  },

  queueRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  queueBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  queueSheet: {
    maxHeight: '65%',
    backgroundColor: '#111111',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  queueTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  queueMeta: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  queueList: {
    width: '100%',
  },
  queueListContent: {
    paddingBottom: 10,
    gap: 10,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  queueItemActive: {
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  queueItemTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  queueItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  queueItemArtist: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    marginTop: 3,
  },
});
