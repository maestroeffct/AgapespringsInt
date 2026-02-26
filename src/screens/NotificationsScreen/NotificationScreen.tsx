import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { NotificationCard } from '../../components/NotificationCard/NotificationCard';
import { AppText } from '../../components/AppText/AppText';
import { NotificationItem } from '../../types/types';

const MOCK_DATA: NotificationItem[] = [
  {
    id: '1',
    title: 'New Sermon Available',
    message: 'Faith & Finances Part 2 is now available.',
    createdAt: '2h ago',
    read: false,
  },
  {
    id: '2',
    title: 'Weekly Devotional',
    message: 'Your weekly devotional is ready.',
    createdAt: 'Yesterday',
    read: true,
  },
];

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_DATA);

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Notifications"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
        rightType="none"
      />

      {notifications.length === 0 ? (
        <View style={{ padding: 24 }}>
          <AppText variant="body">You have no notifications yet.</AppText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NotificationCard item={item} />}
        />
      )}
    </ScreenWrapper>
  );
}
