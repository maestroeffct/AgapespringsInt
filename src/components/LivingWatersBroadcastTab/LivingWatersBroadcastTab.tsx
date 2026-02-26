import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import { SearchBar } from '../SearchBar/SearchBar';

const PLACEHOLDER_COUNT = 10;

export function LivingWatersBroadcastTab() {
  const { data, isLoading } = useGetTestimonyVideosQuery({
    maxResults: 50,
  });
  const [q, setQ] = useState('');

  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it: any) =>
      (it?.snippet?.title ?? '').toLowerCase().includes(s),
    );
  }, [q, items]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={q}
        onChangeText={setQ}
        placeholder="Search Broadcast..."
      />

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
          if (!item?.snippet) return <VideoCard full />;

          const thumbnail =
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url;

          return (
            <VideoCard full title={item.snippet.title} thumbnail={thumbnail} />
          );
        }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
