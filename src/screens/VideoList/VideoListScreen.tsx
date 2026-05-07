import React from 'react';
import { FlatList } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetLatestFromChannelQuery } from '../../backend/api/youtube';
import { useVisibleItems } from '../../hooks/useVisibleItems';
import styles from './styles';

const PLACEHOLDER_COUNT = 10;

export default function VideoListScreen({ navigation }: any) {
  const { data, isLoading } = useGetLatestFromChannelQuery({
    maxResults: 50,
  });
  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const videoItems = data?.items ?? [];
  const { subscribe, onViewableItemsChanged, viewabilityConfig } = useVisibleItems();

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Video Section"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        windowSize={3}
        initialNumToRender={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        data={
          isLoading && videoItems.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : videoItems
        }
        keyExtractor={(item: any, index) =>
          getVideoId(item) ?? `placeholder-${index}`
        }
        renderItem={({ item, index }) => {
          if (!item?.snippet) {
            return <VideoCard full />;
          }

          const videoId = getVideoId(item);
          const vKey = getVideoId(item) ?? `placeholder-${index}`;
          const thumbnail =
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url;

          return (
            <VideoCard
              full
              index={index}
              visibilityKey={vKey}
              subscribe={subscribe}
              title={item.snippet.title}
              thumbnail={thumbnail}
              onPress={() =>
                navigation.navigate('VideoPlayer', {
                  videoId,
                  title: item.snippet.title,
                  source: 'latest',
                })
              }
            />
          );
        }}
        contentContainerStyle={styles.list}
      />
    </ScreenWrapper>
  );
}
