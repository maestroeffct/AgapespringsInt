import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { DevotionalCard } from '../../components/Cards/DevotionalCard/DevotionalCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { AppText } from '../../components/AppText/AppText';
import { getDevotionalFavouriteItems } from '../../helpers/devotionalFavourites';
import { useTheme } from '../../theme/ThemeProvider';
import { createDevotionalLatestTabStyles } from './styles';

export function DevotionalFavouritesTab() {
  const { theme } = useTheme();
  const styles = createDevotionalLatestTabStyles(theme.colors);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [favourites, setFavourites] = useState<
    Awaited<ReturnType<typeof getDevotionalFavouriteItems>>
  >([]);

  const loadFavourites = useCallback(() => {
    let active = true;

    (async () => {
      const items = await getDevotionalFavouriteItems();
      if (active) {
        setFavourites(items);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(loadFavourites);

  const filteredFavourites = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return favourites;

    return favourites.filter(item =>
      [
        item.title,
        item.memoryVerse,
        item.bibleReading,
        item.author,
        item.date,
      ]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(keyword)),
    );
  }, [favourites, search]);

  return (
    <View style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search favourites..."
      />

      <FlatList
        data={filteredFavourites}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <DevotionalCard
            title={item.title}
            excerpt={item.memoryVerse || item.bibleReading}
            author={item.author}
            date={item.date}
            thumbnail={item.thumbnail}
            onPress={() => navigation.navigate('DevotionalDetails', { item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.stateWrap}>
            <View style={styles.stateCard}>
              <AppText font="poppins" variant="h2" style={styles.stateTitle}>
                {search.trim() ? 'No Matches' : 'No Favourites Yet'}
              </AppText>
              <AppText variant="body" style={styles.stateMessage}>
                {search.trim()
                  ? 'No favourite devotionals matched your search.'
                  : 'No favourites yet.'}
              </AppText>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
