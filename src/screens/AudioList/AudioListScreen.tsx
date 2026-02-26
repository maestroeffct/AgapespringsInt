import React, { useMemo } from 'react';
import { FlatList } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { useAudioSermon } from '../../backend/api/hooks/useAudioSermon';
import type { AudioQueueItem } from '../../navigation/types';

const PLACEHOLDER_COUNT = 10;

export default function AudioListScreen({ navigation }: any) {
  const { data, isLoading } = useAudioSermon();

  const audioItems = useMemo(() => data ?? [], [data]);
  const audioQueue = useMemo<AudioQueueItem[]>(
    () =>
      audioItems.map(item => ({
        id: String(item.id),
        audioUrl: item.audio_url,
        title: item.title,
        author: item.author,
        artwork: item.thumbnail_url,
      })),
    [audioItems],
  );

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Audio Section"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
      />

      <FlatList
        data={
          isLoading && audioItems.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : audioItems
        }
        keyExtractor={(item: any, index) => item?.id ?? `placeholder-${index}`}
        renderItem={({ item, index }) => {
          // Placeholder state
          if (!item?.id) {
            return <AudioCard full />;
          }

          return (
            <AudioCard
              full
              title={item.title}
              author={item.author}
              thumbnail={item.thumbnail_url}
              onPress={() =>
                navigation.navigate('AudioPlayer', {
                  id: item.id,
                  audioUrl: item.audio_url,
                  title: item.title,
                  author: item.author,
                  artwork: item.thumbnail_url,
                  queue: audioQueue,
                  startIndex: index,
                })
              }
            />
          );
        }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}
