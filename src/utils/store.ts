import { configureStore } from '@reduxjs/toolkit';
import { youtubeApi } from '../backend/api/youtube';
import { notificationsReducer } from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(youtubeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
