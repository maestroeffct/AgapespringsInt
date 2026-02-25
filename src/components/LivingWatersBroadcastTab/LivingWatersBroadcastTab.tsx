import React from 'react';
import { FlatList } from 'react-native';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';

const PLACEHOLDER_COUNT = 10;

export function LivingWatersBroadcastTab() {
  const { data, isLoading } = useGetTestimonyVideosQuery({
    maxResults: 50,
  });

  const items = data?.items ?? [];

  return (
    <FlatList
      data={
        isLoading && items.length === 0
          ? Array.from({ length: PLACEHOLDER_COUNT })
          : items
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
  );
}
