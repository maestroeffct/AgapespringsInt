import React from 'react';
import { FlatList } from 'react-native';
import { PlatformRow } from '../../components/PlatformRow/PlatformRow';
import { useTheme } from '../../theme/ThemeProvider';

const TV_ITEMS = [
  {
    title: 'Agapesprings Mixlr',
    url: 'https://agapespringsglobal.mixlr.com/',
    leftIcon: 'radio-outline',
  },
];

export function PlatformsTvTab() {
  const { theme } = useTheme();

  return (
    <FlatList
      data={TV_ITEMS}
      keyExtractor={it => it.title}
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
        flexGrow: 1,
      }}
      renderItem={({ item }) => (
        <PlatformRow
          title={item.title}
          url={item.url}
          leftIcon={item.leftIcon}
        />
      )}
    />
  );
}
