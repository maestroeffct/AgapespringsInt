import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

export const DEFAULT_NOTIFICATION_CHANNEL_ID = 'default';

export async function requestNotificationPermission() {
  await notifee.requestPermission();
}

export async function ensureNotificationChannel() {
  if (Platform.OS !== 'android') {
    return DEFAULT_NOTIFICATION_CHANNEL_ID;
  }

  return notifee.createChannel({
    id: DEFAULT_NOTIFICATION_CHANNEL_ID,
    name: 'Default',
    importance: AndroidImportance.HIGH,
  });
}

export async function displayLocalNotification({
  title,
  body,
  data,
}: {
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const channelId = await ensureNotificationChannel();

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}
