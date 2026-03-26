import React from 'react';
import { FlatList } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { TestimonyCard } from '../../components/Cards/TestimonyCard.tsx/TestimonyCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import styles from './styles';

const PLACEHOLDER_COUNT = 10;

export default function TestimonyListScreen({ navigation }: any) {
  const { data, isLoading } = useGetTestimonyVideosQuery({
    maxResults: 50,
  });

  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const testimonyItems = data?.items ?? [];

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Testimony Section"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
        rightType="none"
      />

      <FlatList
        data={
          isLoading && testimonyItems.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : testimonyItems
        }
        keyExtractor={(item: any, index) =>
          getVideoId(item) ?? `placeholder-${index}`
        }
        renderItem={({ item }) => {
          if (!item?.snippet) {
            return <TestimonyCard full />;
          }

          const videoId = getVideoId(item);
          const thumbnail =
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url;

          return (
            <TestimonyCard
              full
              title={item.snippet.title}
              thumbnail={thumbnail}
              onPress={() =>
                navigation.navigate('VideoPlayer', {
                  videoId,
                  title: item.snippet.title,
                  source: 'testimony',
                })
              }
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}
