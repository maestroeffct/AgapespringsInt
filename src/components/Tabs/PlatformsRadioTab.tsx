import React from 'react';
import { FlatList } from 'react-native';
import { PlatformRow } from '../../components/PlatformRow/PlatformRow';

const RADIO_ITEMS = [
  // put your real radio links here
  {
    title: 'Agapesprings Radio',
    url: 'https://www.agapespringsint.com/radio',
    leftIcon: 'radio-outline',
  },
];

export function PlatformsRadioTab() {
  return (
    <FlatList
      data={RADIO_ITEMS}
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
