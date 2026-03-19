import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NotificationItem } from '../../types/types';

type NotificationsState = {
  items: NotificationItem[];
};

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    hydrateNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
    },
    addNotification(state, action: PayloadAction<NotificationItem>) {
      const incoming = action.payload;
      state.items = [
        incoming,
        ...state.items.filter(item => item.id !== incoming.id),
      ];
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      state.items = state.items.map(item =>
        item.id === action.payload ? { ...item, read: true } : item,
      );
    },
    markAllNotificationsRead(state) {
      state.items = state.items.map(item => ({ ...item, read: true }));
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  hydrateNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
