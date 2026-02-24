import React from 'react';
import { FlatList } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { useAudioSermon } from '../../backend/api/hooks/useAudioSermon';

const PLACEHOLDER_COUNT = 10;

export default function AudioListScreen({ navigation }: any) {
  const { data, isLoading } = useAudioSermon();

  const audioItems = data ?? [];

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
        renderItem={({ item }) => {
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
                  audioUrl: item.audio_url,
                  title: item.title,
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
