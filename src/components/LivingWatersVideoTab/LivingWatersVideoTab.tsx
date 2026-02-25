import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import { SearchBar } from '../../components/SearchBar/SearchBar';

const PLACEHOLDER_COUNT = 10;

export function LivingWatersVideoTab() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useGetTestimonyVideosQuery({ maxResults: 50 });

  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it: any) =>
      (it?.snippet?.title ?? '').toLowerCase().includes(s),
    );
  }, [q, items]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchBar value={q} onChangeText={setQ} placeholder="Search videos..." />

      <FlatList
        data={
          isLoading && items.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : filtered
        }
        keyExtractor={(item: any, index) =>
          item?.snippet?.resourceId?.videoId ?? `placeholder-${index}`
        }
        renderItem={({ item }) => {
          if (!item?.snippet)
            return (
              <VideoCard
                full
                layout="horizontal"
                thumbnail={require('../../assets/images/video_cover.png')}
              />
            );

          const thumbnail =
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url;

          return (
            <VideoCard
              full
              layout="horizontal"
              title={item.snippet.title}
              thumbnail={thumbnail}
              date={
                item.snippet.publishedAt
                  ? formatDate(item.snippet.publishedAt)
                  : undefined
              }
            />
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
