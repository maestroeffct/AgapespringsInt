import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import type { AudioQueueItem } from '../../navigation/types';
import {
  getDownloadedAudioItems,
  toFileUrl,
  type DownloadedAudioItem,
} from '../../helpers/downloadedAudio';
import { AppText } from '../../components/AppText/AppText';
import styles from './styles';

export default function DownloadedAudioListScreen({ navigation, route }: any) {
  const source = route?.params?.source as
    | 'onesound'
    | 'livingwaters'
    | undefined;
  const headerTitle = route?.params?.title ?? 'Saved Audio';
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<DownloadedAudioItem[]>([]);

  const loadItems = useCallback(async () => {
    const nextItems = await getDownloadedAudioItems(source);
    setItems(nextItems);
  }, [source]);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [loadItems]),
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query),
    );
  }, [items, search]);

  const queue = useMemo<AudioQueueItem[]>(
    () =>
      filteredItems.map(item => ({
        id: item.id,
        audioUrl: toFileUrl(item.localPath),
        title: item.title,
        author: item.author,
        artwork: item.artwork,
      })),
    [filteredItems],
  );

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title={headerTitle}
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
        rightType="none"
      />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search saved audio..."
      />

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredItems.length === 0 ? styles.emptyListContent : null,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText style={styles.emptyTitle}>No saved audio yet</AppText>
            <AppText style={styles.emptyBody}>
              Download audio from OneSound and it will appear here.
            </AppText>
          </View>
        }
        renderItem={({ item, index }) => (
          <AudioCard
            full
            layout="horizontal"
            title={item.title}
            author={item.author}
            thumbnail={item.artwork}
            onPress={() =>
              navigation.navigate('AudioPlayer', {
                id: item.id,
                audioUrl: toFileUrl(item.localPath),
                title: item.title,
                author: item.author,
                artwork: item.artwork,
                source: item.source,
                queue,
                startIndex: index,
              })
            }
          />
        )}
      />
    </ScreenWrapper>
  );
}
