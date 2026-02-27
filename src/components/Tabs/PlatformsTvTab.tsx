import React from 'react';
import { FlatList } from 'react-native';
import { PlatformRow } from '../../components/PlatformRow/PlatformRow';

const TV_ITEMS = [
  // put your real tv links here
  {
    title: 'Agapesprings TV',
    url: 'https://www.agapespringsint.com/tv',
    leftIcon: 'tv-outline',
  },
];

export function PlatformsTvTab() {
  return (
    <FlatList
      data={TV_ITEMS}
      keyExtractor={it => it.title}
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
