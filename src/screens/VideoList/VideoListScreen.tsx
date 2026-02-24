import React from 'react';
import { FlatList } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import styles from './styles';

const PLACEHOLDER_COUNT = 10;

export default function VideoListScreen({ navigation }: any) {
  const { data, isLoading } = useGetTestimonyVideosQuery({
    maxResults: 50, // load more for list page
  });

  const videoItems = data?.items ?? [];

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Video Section"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        data={
          isLoading && videoItems.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : videoItems
        }
        keyExtractor={(item: any, index) =>
          item?.snippet?.resourceId?.videoId ?? `placeholder-${index}`
        }
        renderItem={({ item }) => {
          if (!item?.snippet) {
            return <VideoCard full />;
          }

          const videoId = item.snippet.resourceId.videoId;
          const thumbnail =
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url;

          return (
            <VideoCard
              full
              title={item.snippet.title}
              thumbnail={thumbnail}
              onPress={() => navigation.navigate('VideoPlayer', { videoId })}
            />
          );
        }}
        contentContainerStyle={styles.list}
      />
    </ScreenWrapper>
  );
}
