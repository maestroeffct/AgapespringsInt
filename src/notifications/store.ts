import { getItem, setItem, StorageKeys } from '../helpers/storage';
import { NotificationItem } from '../types/types';

export async function loadStoredNotifications() {
  return (await getItem<NotificationItem[]>(StorageKeys.NOTIFICATIONS)) ?? [];
}

export async function saveStoredNotifications(items: NotificationItem[]) {
  await setItem(StorageKeys.NOTIFICATIONS, items);
}

export function buildNotificationItem(params: {
  id?: string;
  title?: string;
  message?: string;
  data?: Record<string, string>;
}) {
  const timestamp = new Date().toISOString();

  return {
    id: params.id ?? `${Date.now()}`,
    title: params.title?.trim() || 'New Notification',
    message: params.message?.trim() || 'You have a new update.',
    createdAt: timestamp,
    read: false,
    data: params.data,
  };
}

export async function upsertStoredNotification(item: NotificationItem) {
  const existing = await loadStoredNotifications();
  const next = [item, ...existing.filter(entry => entry.id !== item.id)];
  await saveStoredNotifications(next);
  return next;
}

export async function markStoredNotificationsRead(ids?: string[]) {
  const existing = await loadStoredNotifications();
  const next = existing.map(item =>
    !ids || ids.includes(item.id) ? { ...item, read: true } : item,
  );
  await saveStoredNotifications(next);
  return next;
}
