import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { DevotionalCard } from '../../components/Cards/DevotionalCard/DevotionalCard';
import { useTheme } from '../../theme/ThemeProvider';

type DevotionalItem = {
  id: string;
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  category?: string;
  thumbnail?: string;
};

export function DevotionalLatestTab() {
  const { theme } = useTheme();

  const data = useMemo<DevotionalItem[]>(
    () => [
      {
        id: '1',
        title: "Wisdom: Heaven's Strategy In Adversity",
        excerpt:
          'Psalm 119:97-98 (NLT): “Oh, how I love your instructions! I think about them all day long...”',
        author: 'Apostle Grace Lubega',
        date: 'Thursday, 26 Feb',
        category: 'Wisdom',
        thumbnail: '', // add url if you have
      },
      {
        id: '2',
        title: 'Marriage Series: What God Wants For You',
        excerpt: 'Isaiah 34:16 (KJV): “Seek ye out of the book of the Lord...”',
        author: 'Apostle Grace Lubega',
        date: 'Wednesday, 25 Feb',
        category: 'Marriage Series',
      },
    ],
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <DevotionalCard
            title={item.title}
            excerpt={item.excerpt}
            author={item.author}
            date={item.date}
            category={item.category}
            thumbnail={item.thumbnail}
            onPress={() => {
              // navigation.navigate('DevotionalDetails', { id: item.id })
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
