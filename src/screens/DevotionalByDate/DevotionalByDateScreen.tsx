import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../../components/AppText/AppText';
import { apiGet } from '../../backend/api/client';
import { useTheme } from '../../theme/ThemeProvider';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DevotionalByDate'>;

type DevotionalApiItem = {
  id: number;
  devotionDate: string;
  dayName: string;
  monthNumber: number;
  yearNumber: number;
  title: string;
  bibleReading: string;
  memoryVerse: string;
  body: string;
  furtherStudy: string;
  prayer: string;
  sections?: Record<string, string>;
  coverImageUrl?: string | null;
};

export default function DevotionalByDateScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const date = route.params?.date;

  useEffect(() => {
    if (!date) {
      navigation.replace('Main');
      return;
    }

    const [year, month] = date.split('-').map(Number);
    if (!year || !month) {
      navigation.replace('Main');
      return;
    }

    apiGet<{ success: boolean; data: DevotionalApiItem[] }>(
      `/devotion/monthly/${year}/${month}`,
    )
      .then(res => {
        const found = res.data?.find(d => d.devotionDate === date);
        if (found) {
          navigation.replace('DevotionalDetails', {
            item: {
              id: String(found.id),
              title: found.title,
              date: found.devotionDate,
              thumbnail: found.coverImageUrl ?? undefined,
              memoryVerse: found.memoryVerse,
              bibleReading: found.bibleReading,
              body: found.body,
              furtherStudy: found.furtherStudy,
              prayer: found.prayer,
              sections: found.sections ?? {},
            },
          });
        } else {
          navigation.replace('Main');
        }
      })
      .catch(() => {
        navigation.replace('Main');
      });
  }, [date, navigation]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <AppText style={styles.label}>Opening devotional…</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
  },
});
