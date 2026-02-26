import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useNavigation } from '@react-navigation/native';

const PLACEHOLDER_COUNT = 10;

export function LivingWatersVideoTab() {
  const navigation = useNavigation<any>();
  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const [q, setQ] = useState('');
  const { data, isLoading } = useGetTestimonyVideosQuery({ maxResults: 50 });

  const items = useMemo(() => data?.items ?? [], [data]);

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
          getVideoId(item) ?? `placeholder-${index}`
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

          const videoId = getVideoId(item);
          const thumbnail =
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url;

          return (
            <VideoCard
              full
              layout="horizontal"
              title={item.snippet.title}
              thumbnail={thumbnail}
              onPress={() =>
                navigation.navigate('VideoPlayer', {
                  videoId,
                  title: item.snippet.title,
                })
              }
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
