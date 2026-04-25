import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import styles from './styles';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { FilterSheet } from '../../components/FilterSheet/FilterSheet';
import { useInfiniteOneSound } from '../../backend/api/hooks/useOneSound';
import { useTheme } from '../../theme/ThemeProvider';
import type { AudioQueueItem } from '../../navigation/types';
import { downloadAudioToAppStorage } from '../../helpers/audioDownload';
import { AppText } from '../../components/AppText/AppText';
import { AppAlert } from '../../components/AppAlert/AppAlert';
import { showSuccess } from '../../helpers/toast';

const PAGE_SIZE = 20;

const FILTER_SECTIONS = [
  {
    key: 'sort',
    title: 'Sort by',
    options: [
      { label: 'A – Z', value: 'az' },
      { label: 'Z – A', value: 'za' },
    ],
  },
];

const DEFAULT_FILTERS = { sort: 'az' };

type ViewMode = 'list' | 'grid';

export default function OneSoundScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const gridCardWidth = (width - 48) / 2; // 16px padding × 2 + 16px gap

  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteOneSound(PAGE_SIZE);

  // ── Now-playing state ──────────────────────────────────────────
  const activeTrack = useActiveTrack();
  const { state: playerState } = usePlaybackState();
  const isPlayerPlaying = playerState === State.Playing;
  const nowPlayingUrl = activeTrack?.url as string | undefined;

  // ── Data ───────────────────────────────────────────────────────
  const items = useMemo(
    () => data?.pages.flatMap(page => page) ?? [],
    [data?.pages],
  );

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );
    return activeFilters.sort === 'za' ? sorted.reverse() : sorted;
  }, [items, activeFilters.sort]);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return sortedItems;
    return sortedItems.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.author.toLowerCase().includes(keyword),
    );
  }, [search, sortedItems]);

  const isFilterActive = activeFilters.sort !== DEFAULT_FILTERS.sort;

  const queueItems = useMemo<AudioQueueItem[]>(
    () =>
      filteredData.map(item => ({
        id: item.id,
        audioUrl: item.audio_url,
        title: item.title,
        author: item.author,
        artwork: item.cover_url,
        lyrics: item.lyrics,
        source: 'onesound',
      })),
    [filteredData],
  );

  // ── Actions ────────────────────────────────────────────────────
  const handlePlayAll = useCallback(() => {
    if (!queueItems.length) return;
    navigation.navigate('AudioPlayer', {
      id: queueItems[0].id,
      audioUrl: queueItems[0].audioUrl,
      title: queueItems[0].title,
      author: queueItems[0].author,
      artwork: queueItems[0].artwork,
      lyrics: queueItems[0].lyrics,
      source: 'onesound',
      queue: queueItems,
      startIndex: 0,
    });
  }, [navigation, queueItems]);

  const handleShuffle = useCallback(() => {
    if (!queueItems.length) return;
    const shuffled = [...queueItems].sort(() => Math.random() - 0.5);
    navigation.navigate('AudioPlayer', {
      id: shuffled[0].id,
      audioUrl: shuffled[0].audioUrl,
      title: shuffled[0].title,
      author: shuffled[0].author,
      artwork: shuffled[0].artwork,
      lyrics: shuffled[0].lyrics,
      source: 'onesound',
      queue: shuffled,
      startIndex: 0,
    });
  }, [navigation, queueItems]);

  const handleAddToQueue = useCallback(
    async (itemId: string, index: number) => {
      const item = filteredData.find(d => d.id === itemId);
      if (!item) return;
      try {
        const queue = await TrackPlayer.getQueue();
        if (queue.length === 0) {
          navigation.navigate('AudioPlayer', {
            id: item.id,
            audioUrl: item.audio_url,
            title: item.title,
            author: item.author,
            artwork: item.cover_url,
            source: 'onesound',
            queue: queueItems,
            startIndex: index,
          });
          return;
        }
        await TrackPlayer.add({
          id: item.id,
          url: item.audio_url,
          title: item.title,
          artist: item.author,
          artwork: item.cover_url,
        });
        showSuccess('Added to Queue', item.title);
      } catch {
        showSuccess('Added to Queue', item.title);
      }
    },
    [filteredData, navigation, queueItems],
  );

  // ── Download All ───────────────────────────────────────────────
  const [downloadProgress, setDownloadProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const cancelRef = useRef(false);

  const handleDownloadAll = () => {
    if (downloadProgress) return;
    const targets = filteredData.filter(item => !!item.audio_url);
    if (!targets.length) return;

    AppAlert.alert(
      'Download All',
      `Download ${targets.length} track${targets.length !== 1 ? 's' : ''} for offline listening?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            cancelRef.current = false;
            setDownloadProgress({ done: 0, total: targets.length });
            let done = 0;
            for (const item of targets) {
              if (cancelRef.current) break;
              try {
                await downloadAudioToAppStorage({
                  id: item.id,
                  title: item.title,
                  author: item.author,
                  artwork: item.cover_url,
                  lyrics: item.lyrics,
                  audioUrl: item.audio_url,
                  source: 'onesound',
                });
              } catch {
                // skip failed tracks
              }
              done += 1;
              setDownloadProgress({ done, total: targets.length });
            }
            setDownloadProgress(null);
          },
        },
      ],
    );
  };

  // ── Render item ────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item, index }: { item: (typeof filteredData)[0]; index: number }) => {
      const playing = item.audio_url === nowPlayingUrl && isPlayerPlaying;
      const isGrid = viewMode === 'grid';

      return (
        <AudioCard
          full={!isGrid}
          layout={isGrid ? 'vertical' : 'horizontal'}
          title={item.title}
          author={item.author}
          thumbnail={item.cover_url}
          isPlaying={playing}
          containerStyle={isGrid ? { width: gridCardWidth } : undefined}
          imageHeight={isGrid ? gridCardWidth : undefined}
          onPress={() =>
            navigation.navigate('AudioPlayer', {
              id: item.id,
              audioUrl: item.audio_url,
              title: item.title,
              author: item.author,
              artwork: item.cover_url,
              lyrics: item.lyrics,
              source: 'onesound',
              queue: queueItems,
              startIndex: index,
            })
          }
          onLongPress={() => handleAddToQueue(item.id, index)}
        />
      );
    },
    [
      filteredData,
      gridCardWidth,
      handleAddToQueue,
      isPlayerPlaying,
      navigation,
      nowPlayingUrl,
      queueItems,
      viewMode,
    ],
  );

  const numColumns = viewMode === 'grid' ? 2 : 1;
  const primary = theme.colors.primary;
  const border = primary + '40';
  const bg = primary + '15';
  const textSecondary = theme.colors.textSecondary;

  const ListHeader = useMemo(() => {
    if (!filteredData.length) return null;
    return (
      <>
        {/* Song count + download icon + view toggle */}
        <View style={styles.infoRow}>
          <AppText style={[styles.songCount, { color: textSecondary }]}>
            {filteredData.length} song{filteredData.length !== 1 ? 's' : ''}
          </AppText>

          <View style={styles.infoRowRight}>
            {/* Download All — compact icon button */}
            <TouchableOpacity
              onPress={downloadProgress ? () => { cancelRef.current = true; } : handleDownloadAll}
              hitSlop={8}
              style={[styles.downloadIconBtn, { borderColor: border, backgroundColor: bg }]}
            >
              {downloadProgress ? (
                <>
                  <ActivityIndicator size="small" color={primary} style={{ marginRight: 4 }} />
                  <AppText style={[styles.downloadIconBtnText, { color: primary }]}>
                    {downloadProgress.done}/{downloadProgress.total}
                  </AppText>
                  <AppText style={[styles.downloadIconBtnText, { color: primary, marginLeft: 4 }]}>
                    ✕
                  </AppText>
                </>
              ) : (
                <Ionicons name="cloud-download-outline" size={16} color={primary} />
              )}
            </TouchableOpacity>

            {/* List / Grid toggle */}
            <TouchableOpacity
              style={styles.viewToggle}
              onPress={() => setViewMode(v => (v === 'list' ? 'grid' : 'list'))}
              hitSlop={8}
            >
              <Ionicons
                name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
                size={20}
                color={textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Play All / Shuffle */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={handlePlayAll}
            activeOpacity={0.75}
            style={[styles.actionBtn, { backgroundColor: primary, borderColor: primary }]}
          >
            <Ionicons name="play" size={14} color="#fff" />
            <AppText style={[styles.actionBtnText, { color: '#fff' }]}>Play All</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShuffle}
            activeOpacity={0.75}
            style={[styles.actionBtn, { backgroundColor: bg, borderColor: border }]}
          >
            <Ionicons name="shuffle" size={15} color={primary} />
            <AppText style={[styles.actionBtnText, { color: primary }]}>Shuffle</AppText>
          </TouchableOpacity>
        </View>
      </>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData.length, viewMode, downloadProgress, primary, bg, border, textSecondary]);

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        showLogo
        onLeftPress={() => navigation.openDrawer()}
        rightType="icon"
        rightIconName="save"
        rightIconSize={22}
        onRightPress={() =>
          navigation.navigate('DownloadedAudioList', {
            source: 'onesound',
            title: 'Saved OneSound',
          })
        }
      />
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search OneSound music..."
        onFilterPress={() => {
          setPendingFilters(activeFilters);
          setFilterOpen(true);
        }}
        filterActive={isFilterActive}
      />

      {isLoading && items.length === 0 ? (
        <View style={styles.initialLoaderWrap}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          key={viewMode}
          data={filteredData}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContent : styles.listContent}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={refetch}
              tintColor={primary}
              colors={[primary]}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage && !isLoading) {
              fetchNextPage();
            }
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={primary} />
              </View>
            ) : null
          }
          renderItem={renderItem}
        />
      )}

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        sections={FILTER_SECTIONS}
        values={pendingFilters}
        onChange={(key, value) =>
          setPendingFilters(prev => ({ ...prev, [key]: value }))
        }
        onReset={() => setPendingFilters(DEFAULT_FILTERS)}
        onApply={() => setActiveFilters(pendingFilters)}
      />
    </ScreenWrapper>
  );
}
