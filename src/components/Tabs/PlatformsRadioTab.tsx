import React from 'react';
import { FlatList } from 'react-native';
import { PlatformRow } from '../../components/PlatformRow/PlatformRow';
import { useTheme } from '../../theme/ThemeProvider';

const RADIO_ITEMS = [
  // put your real radio links here
  {
    title: 'Agapesprings Radio',
    url: 'https://www.agapespringsint.com/radio',
    leftIcon: 'radio-outline',
  },
];

export function PlatformsRadioTab() {
  const { theme } = useTheme();

  return (
    <FlatList
      data={RADIO_ITEMS}
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
