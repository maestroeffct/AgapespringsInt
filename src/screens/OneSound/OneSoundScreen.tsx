import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import styles from './styles';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useInfiniteOneSound } from '../../backend/api/hooks/useOneSound';
import { useTheme } from '../../theme/ThemeProvider';
import type { AudioQueueItem } from '../../navigation/types';

const PLACEHOLDER_COUNT = 8;
const PAGE_SIZE = 20;

export default function OneSoundScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteOneSound(PAGE_SIZE);

  const items = useMemo(
    () => data?.pages.flatMap(page => page) ?? [],
    [data?.pages],
  );

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.author.toLowerCase().includes(keyword),
    );
  }, [items, search]);

  const showPlaceholders = isLoading && items.length === 0;
  const queueItems = useMemo<AudioQueueItem[]>(
    () =>
      filteredData.map(item => ({
        id: item.id,
        audioUrl: item.audio_url,
        title: item.title,
        author: item.author,
        artwork: item.cover_url,
      })),
    [filteredData],
  );

  return (
    <ScreenWrapper padded={false}>
      <AppHeader showLogo onLeftPress={() => navigation.openDrawer()} />

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search OneSound music..."
      />

      {/* List */}
      <FlatList
        data={
          showPlaceholders ? Array.from({ length: PLACEHOLDER_COUNT }) : filteredData
        }
        keyExtractor={(item: any, index) => item?.id ?? `placeholder-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => {
          if (!item?.id) return <AudioCard full layout="horizontal" />;

          return (
            <AudioCard
              full
              layout="horizontal"
              title={item.title}
              author={item.author}
              thumbnail={item.cover_url}
              onPress={() =>
                navigation.navigate('AudioPlayer', {
                  id: item.id,
                  audioUrl: item.audio_url,
                  title: item.title,
                  author: item.author,
                  artwork: item.cover_url,
                  queue: queueItems,
                  startIndex: index,
                })
              }
            />
          );
        }}
      />
    </ScreenWrapper>
  );
}
