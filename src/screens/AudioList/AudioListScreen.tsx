import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { useAudioSermon } from '../../backend/api/hooks/useAudioSermon';
import type { AudioQueueItem } from '../../navigation/types';
import styles from './styles';

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
        rightType={'none'}
      />

      <FlatList
        data={
          isLoading && audioItems.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : audioItems
        }
        numColumns={2}
        keyExtractor={(item: any, index) => item?.id ?? `placeholder-${index}`}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
            <AudioListItem
              item={item}
              index={index}
              navigation={navigation}
              audioQueue={audioQueue}
            />
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

function AudioListItem({
  item,
  index,
  navigation,
  audioQueue,
}: {
  item: any;
  index: number;
  navigation: any;
  audioQueue: AudioQueueItem[];
}) {
  return (
    <>
      {!item?.id ? (
        <AudioCard
          full
          imageHeight={170}
          title=""
          author=""
          thumbnail={undefined}
          onPress={undefined}
        />
      ) : (
        <AudioCard
          full
          imageHeight={170}
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
      )}
    </>
  );
}
