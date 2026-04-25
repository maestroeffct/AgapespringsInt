import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import {
  useInfiniteAudioSermon,
  useInfiniteAudioSermonSearch,
} from '../../backend/api/hooks/useAudioSermon';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { FilterSheet } from '../../components/FilterSheet/FilterSheet';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import type { AudioQueueItem } from '../../navigation/types';
import { getDownloadedAudioItems } from '../../helpers/downloadedAudio';
import { downloadAudioToAppStorage } from '../../helpers/audioDownload';
import { AppAlert } from '../AppAlert/AppAlert';

const PLACEHOLDER_COUNT = 10;
const PAGE_SIZE = 20;

const FILTER_SECTIONS = [
  {
    key: 'sort',
    title: 'Sort by',
    options: [
      { label: 'Newest First', value: 'newest' },
      { label: 'Oldest First', value: 'oldest' },
    ],
  },
];

const DEFAULT_FILTERS = { sort: 'newest' };

export function LivingWatersAudioTab() {
  const { theme } = useTheme();
  const [q, setQ] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [downloadedIds, setDownloadedIds] = useState<Record<string, true>>({});
  const [downloadingIds, setDownloadingIds] = useState<Record<string, true>>(
    {},
  );
  const trimmedQuery = q.trim();
  const isSearching = trimmedQuery.length > 0;
  const navigation = useNavigation<any>();

  const baseQuery = useInfiniteAudioSermon(PAGE_SIZE);
  const searchQuery = useInfiniteAudioSermonSearch(trimmedQuery, PAGE_SIZE);

  const activeQuery = isSearching ? searchQuery : baseQuery;

  const items = useMemo(
    () => activeQuery.data?.pages.flatMap(page => page) ?? [],
    [activeQuery.data],
  );
  const queueItems = useMemo<AudioQueueItem[]>(
    () =>
      items.map(item => ({
        id: String(item.id),
        audioUrl: item.audio_url,
        title: item.title,
        author: item.author,
        artwork: item.thumbnail_url,
        source: 'livingwaters',
      })),
    [items],
  );

  const loadDownloaded = useCallback(async () => {
    const downloadedItems = await getDownloadedAudioItems('livingwaters');
    const nextMap = downloadedItems.reduce<Record<string, true>>(
      (acc, item) => {
        acc[item.id] = true;
        return acc;
      },
      {},
    );
    setDownloadedIds(nextMap);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDownloaded();
    }, [loadDownloaded]),
  );

  function formatDate(dateString?: string) {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const displayItems = useMemo(() => {
    if (activeFilters.sort === 'oldest') return [...items].reverse();
    return items;
  }, [items, activeFilters.sort]);

  const showPlaceholders = activeQuery.isLoading && items.length === 0;
  const isFilterActive = activeFilters.sort !== DEFAULT_FILTERS.sort;

  const handleDownloadPress = async (item: (typeof items)[number]) => {
    if (downloadingIds[item.id]) return;

    try {
      setDownloadingIds(prev => ({ ...prev, [item.id]: true }));

      const result = await downloadAudioToAppStorage({
        id: String(item.id),
        title: item.title,
        author: item.author,
        artwork: item.thumbnail_url,
        audioUrl: item.audio_url,
        source: 'livingwaters',
      });

      setDownloadedIds(prev => ({ ...prev, [item.id]: true }));
      AppAlert.alert(
        'Downloaded',
        result.alreadyExisted
          ? 'This audio is already downloaded.'
          : 'Saved inside app storage (Documents).',
      );
    } catch (error: any) {
      AppAlert.alert('Download failed', error?.message ?? 'Unknown error');
    } finally {
      setDownloadingIds(prev => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={q}
        onChangeText={setQ}
        placeholder="Search audio messages..."
        onFilterPress={() => {
          setPendingFilters(activeFilters);
          setFilterOpen(true);
        }}
        filterActive={isFilterActive}
      />

      <FlatList
        data={
          showPlaceholders ? Array.from({ length: PLACEHOLDER_COUNT }) : displayItems
        }
        keyExtractor={(item: any, index) => item?.id ?? `placeholder-${index}`}
        renderItem={({ item, index }) => {
          if (!item?.id) return <AudioCard full layout="horizontal" />;

          return (
            <AudioCard
              full
              layout="horizontal"
              title={item.title}
              author={item.author}
              thumbnail={item.thumbnail_url}
              sizeLabel={item.audio_size_label}
              date={formatDate(item.time_posted)}
              onDownloadPress={() => handleDownloadPress(item)}
              downloadState={
                downloadingIds[item.id]
                  ? 'downloading'
                  : downloadedIds[item.id]
                  ? 'downloaded'
                  : 'idle'
              }
              onPress={() =>
                navigation.navigate('AudioPlayer', {
                  id: item.id,
                  audioUrl: item.audio_url,
                  title: item.title,
                  author: item.author,
                  artwork: item.thumbnail_url,
                  source: 'livingwaters',
                  queue: queueItems,
                  startIndex: index,
                })
              }
            />
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={!activeQuery.isLoading && activeQuery.isRefetching}
            onRefresh={() => activeQuery.refetch()}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (
            activeQuery.hasNextPage &&
            !activeQuery.isFetchingNextPage &&
            !activeQuery.isLoading
          ) {
            activeQuery.fetchNextPage();
          }
        }}
        ListFooterComponent={
          activeQuery.isFetchingNextPage ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

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
    </View>
  );
}
