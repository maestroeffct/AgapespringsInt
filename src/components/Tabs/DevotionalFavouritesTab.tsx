import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { SearchBar } from '../../components/SearchBar/SearchBar';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { createDevotionalLatestTabStyles } from './styles';

export function DevotionalFavouritesTab() {
  const { theme } = useTheme();
  const styles = createDevotionalLatestTabStyles(theme.colors);
  const [search, setSearch] = useState('');

  // later: load from storage or API
  const favourites = useMemo<
    Array<{ id: string; title?: string; excerpt?: string }>
  >(() => [], []);

  const filteredFavourites = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return favourites;

    return favourites.filter(item =>
      [item.title, item.excerpt]
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
        renderItem={() => null}
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
