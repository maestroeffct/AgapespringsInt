import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppText } from '@/components/AppText/AppText';
import { useTheme } from '@/theme/ThemeProvider';
import styles from './styles';

type Props = {
  item: {
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
  };
  onPress?: () => void;
};

export function NotificationCard({ item, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        {
          backgroundColor: item.read
            ? theme.colors.background
            : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.content}>
        <AppText
          variant="body"
          style={[styles.title, { color: theme.colors.textPrimary }]}
        >
          {item.title}
        </AppText>

        <AppText
          variant="caption"
          style={{ color: theme.colors.textSecondary }}
          numberOfLines={2}
        >
          {item.message}
        </AppText>

        <AppText
          variant="caption"
          style={[styles.time, { color: theme.colors.textSecondary }]}
        >
          {item.createdAt}
        </AppText>
      </View>

      {!item.read && (
        <View
          style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]}
        />
      )}
    </TouchableOpacity>
  );
}
