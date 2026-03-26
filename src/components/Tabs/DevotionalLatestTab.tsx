import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DevotionalCard } from '../../components/Cards/DevotionalCard/DevotionalCard';
import { AppText } from '../../components/AppText/AppText';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { useTheme } from '../../theme/ThemeProvider';
import { useMonthlyDevotionals } from '../../backend/api/hooks/useMonthlyDevotionals';
import { createDevotionalLatestTabStyles } from './styles';

export function DevotionalLatestTab() {
  const { theme } = useTheme();
  const styles = createDevotionalLatestTabStyles(theme.colors);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [today, setToday] = useState(() => new Date());
  const initialDayKeyRef = useRef(getLocalDateKey(today));
  const todayKey = useMemo(() => getLocalDateKey(today), [today]);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const { data, isLoading, isRefetching, refetch, isError } =
    useMonthlyDevotionals(currentYear, currentMonth);

  const syncToday = useCallback(() => {
    setToday(previous => {
      const next = new Date();
      return getLocalDateKey(previous) === getLocalDateKey(next) ? previous : next;
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      syncToday();
    }, [syncToday]),
  );

  useEffect(() => {
    const nextMidnight = new Date(today);
    nextMidnight.setHours(24, 0, 0, 0);

    const timeoutId = setTimeout(() => {
      setToday(new Date());
    }, Math.max(1000, nextMidnight.getTime() - Date.now()));

    return () => clearTimeout(timeoutId);
  }, [today, todayKey]);

  useEffect(() => {
    if (todayKey === initialDayKeyRef.current) {
      return;
    }

    refetch();
  }, [todayKey, refetch]);

  const devotionalItems = useMemo(() => {
    if (!data) return [];

    return [...data]
      .filter(item => getComparableDate(item.devotion_date) <= todayKey)
      .sort((a, b) => b.devotion_date.localeCompare(a.devotion_date))
      .map(item => {
        const memoryVerseSource =
          item.memory_verse ||
          item.sections?.memoryVerse ||
          item.bible_reading;

        return {
          id: item.id,
          title: item.title || `${item.day_name} Devotional`,
          excerpt: memoryVerseSource,
          author: 'Rev. Barnabas Alumogie',
          date: formatDevotionalDate(item.devotion_date, item.day_name),
          thumbnail: '',
          memoryVerse: item.memory_verse || '',
          bibleReading: item.bible_reading || '',
          body: item.body || item.sections?.message || '',
          furtherStudy: item.further_study || '',
          prayer: item.prayer || '',
          sections: item.sections || {},
        };
      });
  }, [data, todayKey]);

  const filteredDevotionalItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return devotionalItems;

    return devotionalItems.filter(item =>
      [
        item.title,
        item.excerpt,
        item.author,
        item.date,
        item.memoryVerse,
        item.bibleReading,
      ]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(keyword)),
    );
  }, [devotionalItems, search]);

  if (isLoading && devotionalItems.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search devotionals..."
        />
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search devotionals..."
      />

      <FlatList
        data={filteredDevotionalItems}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <DevotionalCard
            title={item.title}
            excerpt={item.excerpt}
            author={item.author}
            date={item.date}
            thumbnail={item.thumbnail}
            onPress={() => {
              navigation.navigate('DevotionalDetails', {
                item: {
                  id: item.id,
                  title: item.title,
                  author: item.author,
                  date: item.date,
                  thumbnail: item.thumbnail,
                  memoryVerse: item.memoryVerse,
                  bibleReading: item.bibleReading,
                  body: item.body,
                  furtherStudy: item.furtherStudy,
                  prayer: item.prayer,
                  sections: item.sections,
                },
              });
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.stateWrap}>
            <View style={styles.stateCard}>
              <AppText font="poppins" variant="h2" style={styles.stateTitle}>
                {isError
                  ? 'Unavailable'
                  : search.trim()
                  ? 'No Matches'
                  : 'No Devotionals Yet'}
              </AppText>
              <AppText variant="body" style={styles.stateMessage}>
                {isError
                  ? 'Unable to load this month’s devotionals right now. Pull down to try again.'
                  : search.trim()
                  ? 'No devotionals matched your search. Try another keyword.'
                  : 'No devotionals have been published for this month yet. Pull down to refresh.'}
              </AppText>
            </View>
          </View>
        }
      />
    </View>
  );
}

function formatDevotionalDate(dateValue?: string, dayName?: string) {
  if (!dateValue) return dayName ?? '';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dayName ?? dateValue;
  }

  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return dayName ? `${dayName}, ${formatted}` : formatted;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getComparableDate(dateValue?: string) {
  if (!dateValue) return '';
  return dateValue.slice(0, 10);
}
