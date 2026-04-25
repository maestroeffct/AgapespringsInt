import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

export const DEFAULT_NOTIFICATION_CHANNEL_ID = 'default';
export const LIVE_STREAM_CHANNEL_ID = 'live_stream';

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

export async function ensureLiveStreamChannel() {
  if (Platform.OS !== 'android') {
    return LIVE_STREAM_CHANNEL_ID;
  }

  return notifee.createChannel({
    id: LIVE_STREAM_CHANNEL_ID,
    name: 'Live Streams',
    importance: AndroidImportance.HIGH,
    sound: 'live_alert',
  });
}

export async function displayLiveStreamNotification(title?: string) {
  const channelId = await ensureLiveStreamChannel();

  await notifee.displayNotification({
    title: '🔴 Live Stream',
    body: title ?? 'A live stream is now ongoing. Tap to join.',
    data: { type: 'live_stream' },
    android: {
      channelId,
      pressAction: { id: 'default' },
      sound: 'live_alert',
    },
    ios: {
      sound: 'live_alert.mp3',
    },
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
    ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
}
