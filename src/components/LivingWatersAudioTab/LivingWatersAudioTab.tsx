import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { useAudioSermon } from '../../backend/api/hooks/useAudioSermon';
import { SearchBar } from '../../components/SearchBar/SearchBar';

const PLACEHOLDER_COUNT = 10;

export function LivingWatersAudioTab() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useAudioSermon();

  const items = data ?? [];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(it => {
      const title = (it.title ?? '').toLowerCase();
      const author = (it.author ?? '').toLowerCase();
      return title.includes(s) || author.includes(s);
    });
  }, [q, items]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={q}
        onChangeText={setQ}
        placeholder="Search audio messages..."
      />

      <FlatList
        data={
          isLoading && items.length === 0
            ? Array.from({ length: PLACEHOLDER_COUNT })
            : filtered
        }
        keyExtractor={(item: any, index) => item?.id ?? `placeholder-${index}`}
        renderItem={({ item }) => {
          if (!item?.id) return <AudioCard full layout="horizontal" />;

          return (
            <AudioCard
              full
              layout="horizontal"
              title={item.title}
              author={item.author}
              thumbnail={item.thumbnail_url}
              date={item.time_posted ? formatDate(item.time_posted) : undefined}
            />
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
