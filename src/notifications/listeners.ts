import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { showSuccess } from '../helpers/toast';
import { NavigationContainerRef } from '@react-navigation/native';

import { store } from '../utils/store';
import {
  addNotification,
  hydrateNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../features/notifications/notificationsSlice';
import { displayLocalNotification, ensureNotificationChannel } from './notifee';
import {
  buildNotificationItem,
  loadStoredNotifications,
  markStoredNotificationsRead,
  upsertStoredNotification,
} from './store';

function toStringRecord(data?: FirebaseMessagingTypes.RemoteMessage['data']) {
  if (!data) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, String(value ?? '')]),
  );
}

function toOptionalString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

export function buildRemoteNotificationItem(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  return buildNotificationItem({
    id: remoteMessage.messageId,
    title:
      remoteMessage.notification?.title ??
      toOptionalString(remoteMessage.data?.title),
    message:
      remoteMessage.notification?.body ??
      toOptionalString(remoteMessage.data?.body),
    data: toStringRecord(remoteMessage.data),
  });
}

export async function hydrateNotificationsFromStorage() {
  const stored = await loadStoredNotifications();
  store.dispatch(hydrateNotifications(stored));
}

export async function persistAndDispatchRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  const item = buildRemoteNotificationItem(remoteMessage);
  await upsertStoredNotification(item);
  store.dispatch(addNotification(item));
  return item;
}

export async function triggerTestNotification() {
  const item = buildNotificationItem({
    title: 'Test Notification',
    message: 'This is a local test notification.',
    data: {
      source: 'dev-test',
    },
  });

  await upsertStoredNotification(item);
  store.dispatch(addNotification(item));
  showSuccess(item.title, item.message);

  await displayLocalNotification({
    title: item.title,
    body: item.message,
    data: item.data,
  });

  return item;
}

export async function handleForegroundRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  const item = await persistAndDispatchRemoteMessage(remoteMessage);

  showSuccess(item.title, item.message);

  await displayLocalNotification({
    title: item.title,
    body: item.message,
    data: item.data,
  });
}

export async function handleBackgroundRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  const item = buildRemoteNotificationItem(remoteMessage);
  await upsertStoredNotification(item);

  if (!remoteMessage.notification) {
    await displayLocalNotification({
      title: item.title,
      body: item.message,
      data: item.data,
    });
  }
}

export async function markAllNotificationsAsRead() {
  const next = await markStoredNotificationsRead();
  store.dispatch(markAllNotificationsRead());
  store.dispatch(hydrateNotifications(next));
}

export async function markNotificationAsRead(id: string) {
  const next = await markStoredNotificationsRead([id]);
  store.dispatch(markNotificationRead(id));
  store.dispatch(hydrateNotifications(next));
}

export function navigateFromNotificationData(
  nav: NavigationContainerRef<any>,
  data?: Record<string, string>,
  item?: { title?: string; message?: string; imageUrl?: string; createdAt?: string },
) {
  const type = data?.type;
  const screen = data?.screen;

  if (screen === 'DevotionalByDate' || type === 'devotional') {
    nav.navigate('DevotionalByDate', { date: data?.date });
    return;
  }
  if (type === 'live_stream') {
    nav.navigate('Main');
    return;
  }

  // No specific target — show notification detail bottom sheet
  const title = item?.title ?? data?.title ?? 'Notification';
  const message = item?.message ?? data?.body ?? data?.message ?? '';
  const imageUrl = item?.imageUrl ?? data?.imageUrl;
  const createdAt = item?.createdAt;

  nav.navigate('NotificationDetail', { title, message, imageUrl, createdAt });
}

export async function setupNotificationListeners() {
  await ensureNotificationChannel();
  await hydrateNotificationsFromStorage();

  const unsubscribeForeground = messaging().onMessage(handleForegroundRemoteMessage);

  return () => {
    unsubscribeForeground();
  };
}
