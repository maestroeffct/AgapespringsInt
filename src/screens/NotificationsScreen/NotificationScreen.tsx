import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AppButton } from '../../components/AppButton/AppButton';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { NotificationCard } from '../../components/NotificationCard/NotificationCard';
import { AppText } from '../../components/AppText/AppText';
import { RootState } from '../../utils/store';
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  navigateFromNotificationData,
  triggerTestNotification,
} from '../../notifications/listeners';

export default function NotificationsScreen({ navigation }: any) {
  const notifications = useSelector(
    (state: RootState) => state.notifications.items,
  );

  useFocusEffect(
    React.useCallback(() => {
      markAllNotificationsAsRead().catch(() => {});
    }, []),
  );

  const items = useMemo(
    () =>
      notifications.map(item => ({
        ...item,
        createdAt: formatNotificationTime(item.createdAt),
      })),
    [notifications],
  );

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Notifications"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
        rightType="none"
      />

      {__DEV__ ? (
        <View style={styles.devTools}>
          <AppButton
            title="Trigger Test Notification"
            onPress={() => {
              triggerTestNotification().catch(() => {});
            }}
          />
        </View>
      ) : null}

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <AppText variant="body">You have no notifications yet.</AppText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NotificationCard
              item={item}
              onPress={() => {
                markNotificationAsRead(item.id).catch(() => {});
                navigateFromNotificationData(navigation, item.data, {
                  title: item.title,
                  message: item.message,
                  imageUrl: item.data?.imageUrl,
                  createdAt: item.createdAt,
                });
              }}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}

function formatNotificationTime(value: string) {
  const createdAt = new Date(value);
  const now = Date.now();
  const diffMs = now - createdAt.getTime();

  if (Number.isNaN(createdAt.getTime())) {
    return value;
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days === 1) {
    return 'Yesterday';
  }

  return createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  devTools: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  emptyState: {
    padding: 24,
  },
});
