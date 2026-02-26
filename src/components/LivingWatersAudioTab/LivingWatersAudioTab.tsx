import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import {
  useInfiniteAudioSermon,
  useInfiniteAudioSermonSearch,
} from '../../backend/api/hooks/useAudioSermon';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import type { AudioQueueItem } from '../../navigation/types';

const PLACEHOLDER_COUNT = 10;
const PAGE_SIZE = 20;

export function LivingWatersAudioTab() {
  const { theme } = useTheme();
  const [q, setQ] = useState('');
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
      })),
    [items],
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

  const showPlaceholders = activeQuery.isLoading && items.length === 0;

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={q}
        onChangeText={setQ}
        placeholder="Search audio messages..."
      />

      <FlatList
        data={
          showPlaceholders ? Array.from({ length: PLACEHOLDER_COUNT }) : items
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
              date={formatDate(item.time_posted)}
              onPress={() =>
                navigation.navigate('AudioPlayer', {
                  id: item.id,
                  audioUrl: item.audio_url,
                  title: item.title,
                  author: item.author,
                  artwork: item.thumbnail_url,
                  queue: queueItems,
                  startIndex: index,
                })
              }
            />
          );
        }}
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
    </View>
  );
}
