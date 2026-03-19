import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { DevotionalCard } from '../../components/Cards/DevotionalCard/DevotionalCard';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { createDevotionalLatestTabStyles } from './styles';

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
  const styles = createDevotionalLatestTabStyles(theme.colors);

  const data = useMemo<DevotionalItem[]>(
    () => [
      {
        id: '1',
        title: "Wisdom: Heaven's Strategy In Adversity",
        excerpt:
          'Psalm 119:97-98 (NLT): “Oh, how I love your instructions! I think about them all day long...”',
        author: 'Rev. Barnabas Alumogie',
        date: 'Thursday, 26 Feb',
        category: 'Wisdom',
        thumbnail: '', // add url if you have
      },
      {
        id: '2',
        title: 'Marriage Series: What God Wants For You',
        excerpt: 'Isaiah 34:16 (KJV): “Seek ye out of the book of the Lord...”',
        author: 'Rev. Barnabas Alumogie',
        date: 'Wednesday, 25 Feb',
        category: 'Marriage Series',
      },
    ],
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
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

      <View style={styles.overlay} pointerEvents="auto">
        <View style={styles.overlayCard}>
          <AppText font="poppins" variant="h2" style={styles.overlayTitle}>
            Coming Soon
          </AppText>
          <AppText variant="body" style={styles.overlayMessage}>
            This devotional section is still under ongoing development.
          </AppText>
        </View>
      </View>
    </View>
  );
}
