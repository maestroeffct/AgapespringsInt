import React from 'react';
import { FlatList, View } from 'react-native';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';

export function DevotionalFavouritesTab() {
  const { theme } = useTheme();

  // later: load from storage or API
  const favourites: any[] = [];

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={favourites}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          flexGrow: 1,
        }}
        renderItem={() => null}
        ListEmptyComponent={
          <AppText style={{ color: theme.colors.textSecondary, marginTop: 18 }}>
            No favourites yet.
          </AppText>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
