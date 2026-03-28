import React from 'react';
import { Alert, Linking, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import createStyles from './platformsRadioStyles';

const RADIO_URL = 'https://adaba889.fm/';

const RADIO_SCHEDULE = [
  { day: 'Wednesday', time: '2:30 PM WAT' },
  { day: 'Friday', time: '4:00 PM WAT' },
  { day: 'Saturday', time: '4:00 PM WAT' },
];

export function PlatformsRadioTab() {
  const { theme, isDark } = useTheme();
  const styles = React.useMemo(
    () => createStyles(theme.colors, isDark),
    [theme.colors, isDark],
  );

  const openLive = async () => {
    const canOpen = await Linking.canOpenURL(RADIO_URL);
    if (!canOpen) {
      Alert.alert('Invalid link', RADIO_URL);
      return;
    }

    await Linking.openURL(RADIO_URL);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons
            name="radio-outline"
            size={22}
            color={theme.colors.primary}
          />
          <AppText variant="h3" style={styles.headerTitle}>
            Agapesprings Radio
          </AppText>
        </View>

        {RADIO_SCHEDULE.map(item => (
          <View key={item.day} style={styles.scheduleRow}>
            <View style={styles.dayWrap}>
              <AppText style={styles.bullet}>{'\u2022'}</AppText>
              <AppText style={styles.dayText}>{item.day}</AppText>
            </View>

            <AppText style={styles.timeText}>{item.time}</AppText>

            <TouchableOpacity activeOpacity={0.85} onPress={openLive}>
              <AppText style={styles.listenText}>Listen Live</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
