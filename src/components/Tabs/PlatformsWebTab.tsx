import React from 'react';
import { FlatList } from 'react-native';
import { PlatformRow } from '../../components/PlatformRow/PlatformRow';
import { useTheme } from '../../theme/ThemeProvider';

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
  const { theme } = useTheme();

  return (
    <FlatList
      data={WEB_ITEMS}
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
