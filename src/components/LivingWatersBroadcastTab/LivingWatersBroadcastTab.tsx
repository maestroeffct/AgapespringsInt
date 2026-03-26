import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetSermonVideosQuery } from '../../backend/api/youtube';
import { SearchBar } from '../SearchBar/SearchBar';
import { useTheme } from '../../theme/ThemeProvider';

export function LivingWatersBroadcastTab() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const [q, setQ] = useState('');
  const { data, isLoading } = useGetSermonVideosQuery({
    maxResults: 150,
  });

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
      <SearchBar
        value={q}
        onChangeText={setQ}
        placeholder="Search Broadcast..."
      />

      {isLoading && items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item: any, index) =>
            getVideoId(item) ?? `broadcast-${index}`
          }
          renderItem={({ item }) => {
            const videoId = getVideoId(item);
            const thumbnail =
              item?.snippet?.thumbnails?.high?.url ??
              item?.snippet?.thumbnails?.medium?.url;

            return (
              <VideoCard
                full
                layout="horizontal"
                title={item?.snippet?.title}
                thumbnail={thumbnail}
                onPress={() =>
                  navigation.navigate('VideoPlayer', {
                    videoId,
                    title: item?.snippet?.title,
                    source: 'broadcast',
                  })
                }
                date={
                  item?.snippet?.publishedAt
                    ? formatDate(item.snippet.publishedAt)
                    : undefined
                }
              />
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
