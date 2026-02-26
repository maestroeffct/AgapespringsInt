import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import styles from './styles';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useInfiniteOneSound } from '../../backend/api/hooks/useOneSound';
import { useTheme } from '../../theme/ThemeProvider';
import type { AudioQueueItem } from '../../navigation/types';

const PAGE_SIZE = 20;

export default function OneSoundScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteOneSound(PAGE_SIZE);

  const items = useMemo(
    () => data?.pages.flatMap(page => page) ?? [],
    [data?.pages],
  );
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      ),
    [items],
  );

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return sortedItems;

    return sortedItems.filter(
      item =>
        item.title.toLowerCase().includes(keyword) ||
        item.author.toLowerCase().includes(keyword),
    );
  }, [search, sortedItems]);

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

      {isLoading && items.length === 0 ? (
        <View style={styles.initialLoaderWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
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
      )}

    </ScreenWrapper>
  );
}
