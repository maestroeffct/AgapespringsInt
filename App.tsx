import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './src/utils/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {
  requestNotificationPermission,
  ensureNotificationChannel,
} from './src/notifications/notifee';
import { setupNotificationListeners } from './src/notifications/listeners';
import { registerPushToken } from './src/notifications/push';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins fresh
      gcTime: 1000 * 60 * 30, // 30 mins cache
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    let teardownNotifications: undefined | (() => void);

    const setup = async () => {
      try {
        await requestNotificationPermission();
        await ensureNotificationChannel();
        teardownNotifications = await setupNotificationListeners();

        await messaging().registerDeviceForRemoteMessages();
        const authStatus = await messaging().requestPermission();
        const isAuthorized =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!isAuthorized) {
          console.log('Push permission not granted.');
          return;
        }

        if (Platform.OS === 'ios') {
          let apnsToken = await messaging().getAPNSToken();
          let attempts = 0;

          while (!apnsToken && attempts < 8) {
            await new Promise<void>(resolve => setTimeout(resolve, 500));
            apnsToken = await messaging().getAPNSToken();
            attempts += 1;
          }

          if (!apnsToken) {
            console.log(
              'APNs token not available yet (simulator or APNs not configured). Skipping FCM token fetch.',
            );
            return;
          }
        }

        const token = await messaging().getToken();
        console.log('FCM TOKEN:', token);
        await registerPushToken(token);
        console.log('Push token registered with backend successfully.');
      } catch (error) {
        console.log('Push setup error:', error);
      }
    };

    setup();

    const unsub = messaging().onTokenRefresh(t => {
      console.log('FCM TOKEN REFRESH:', t);
      registerPushToken(t).catch(error => {
        console.log('Push token refresh registration error:', error);
      }).then(() => {
        console.log('Refreshed push token registered with backend successfully.');
      });
    });

    return () => {
      teardownNotifications?.();
      unsub();
    };
  }, []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNavigator />
            <Toast />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
