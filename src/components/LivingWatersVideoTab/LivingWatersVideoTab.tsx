import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetLatestFromChannelQuery } from '../../backend/api/youtube';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { FilterSheet } from '../../components/FilterSheet/FilterSheet';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';

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

export function LivingWatersVideoTab() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const [q, setQ] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetLatestFromChannelQuery({ maxResults: 50 });
  const refetching = isFetching && !isLoading;

  const items = useMemo(() => data?.items ?? [], [data]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let result = s
      ? items.filter((it: any) =>
          (it?.snippet?.title ?? '').toLowerCase().includes(s),
        )
      : [...items];

    if (activeFilters.sort === 'oldest') {
      result = result.slice().reverse();
    }

    return result;
  }, [q, items, activeFilters.sort]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const isFilterActive = activeFilters.sort !== DEFAULT_FILTERS.sort;
  const showLoader = isLoading && items.length === 0;

  return (
    <View style={styles.root}>
      <SearchBar
        value={q}
        onChangeText={setQ}
        placeholder="Search videos..."
        onFilterPress={() => {
          setPendingFilters(activeFilters);
          setFilterOpen(true);
        }}
        filterActive={isFilterActive}
      />

      {showLoader ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
            Failed to load videos. Pull down to retry.
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
            No videos found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item: any, index) =>
            getVideoId(item) ?? `video-${index}`
          }
          renderItem={({ item }) => {
            const snippet = item?.snippet;
            if (!snippet) return null;
            const videoId = getVideoId(item);
            const thumbnail =
              snippet?.thumbnails?.maxres?.url ??
              snippet?.thumbnails?.high?.url ??
              snippet?.thumbnails?.standard?.url ??
              snippet?.thumbnails?.medium?.url ??
              snippet?.thumbnails?.default?.url;

            return (
              <VideoCard
                full
                layout="horizontal"
                imageHeight={130}
                title={snippet?.title}
                thumbnail={thumbnail}
                onPress={() =>
                  navigation.navigate('VideoPlayer', {
                    videoId,
                    title: snippet?.title,
                    source: 'latest',
                  })
                }
                date={
                  snippet?.publishedAt
                    ? formatDate(snippet.publishedAt)
                    : undefined
                }
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={!isLoading && refetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  stateText: { fontSize: 14, textAlign: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
});
