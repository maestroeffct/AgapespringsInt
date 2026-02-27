import React from 'react';
import { FlatList } from 'react-native';
import { PlatformRow } from '../../components/PlatformRow/PlatformRow';

const WEB_ITEMS = [
  {
    title: 'YouTube',
    url: 'https://youtube.com/@agapespringsint',
    leftIcon: 'logo-youtube',
  },
  {
    title: 'Facebook',
    url: 'https://www.facebook.com/agapespringsint',
    leftIcon: 'logo-facebook',
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/agapesprings_global',
    leftIcon: 'logo-instagram',
  },
];

export function PlatformsWebTab() {
  return (
    <FlatList
      data={WEB_ITEMS}
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
