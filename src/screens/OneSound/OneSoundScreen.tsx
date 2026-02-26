import React, { useMemo, useState } from 'react';
import { View, FlatList, TextInput } from 'react-native';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import styles from './styles';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';

type AudioItem = {
  id: string;
  title: string;
  author: string;
  thumbnail?: string;
};

const MOCK_DATA: AudioItem[] = [
  { id: '1', title: 'Amazing God', author: 'Onesound Worship' },
  { id: '2', title: 'Blameless', author: 'Onesound Worship' },
  { id: '3', title: 'Complete in You', author: 'Onesound Worship' },
  { id: '4', title: 'He Reigns', author: 'Onesound Worship' },
  { id: '5', title: 'I’m a Wonder', author: 'Onesound Worship' },
];

export default function OneSoundScreen({ navigation }: any) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return MOCK_DATA;

    return MOCK_DATA.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <ScreenWrapper padded={false}>
      <AppHeader showLogo onLeftPress={() => navigation.openDrawer()} />

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search OneSound Musics..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AudioCard
            layout="horizontal"
            title={item.title}
            author={item.author}
            onPress={() => navigation.navigate('AudioPlayer', { item })}
          />
        )}
      />
    </ScreenWrapper>
  );
}
