import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';

import {
  requestNotificationPermission,
  ensureNotificationChannel,
} from '../notifications/notifee';
import { setupNotificationListeners } from '../notifications/listeners';
import { registerPushToken } from '../notifications/push';
import {
  restoreQueryCache,
  startQueryCachePersistence,
} from '../backend/api/bootstrap';
import { queryClient } from './queryClient';
import { showError, showSuccess } from '../helpers/toast';

type Props = {
  children: React.ReactNode;
};

function maskToken(token: string) {
  if (token.length <= 16) {
    return token;
  }

  return `${token.slice(0, 8)}...${token.slice(-8)}`;
}

export function AppBootstrap({ children }: Props) {
  const [isQueryCacheReady, setIsQueryCacheReady] = useState(false);
  const connectivityRef = useRef<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    let stopPersistence: undefined | (() => void);

    const setupQueryCache = async () => {
      try {
        await restoreQueryCache(queryClient);
      } finally {
        stopPersistence = startQueryCachePersistence(queryClient);
        if (isMounted) {
          setIsQueryCacheReady(true);
        }
      }
    };

    setupQueryCache();

    return () => {
      isMounted = false;
      stopPersistence?.();
    };
  }, []);

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

          console.log('APNs token available on iOS device.');
        }

        const token = await messaging().getToken();
        console.log(`FCM token fetched successfully: ${maskToken(token)}`);
        const response = await registerPushToken(token);
        console.log('Push token registered with backend successfully.', response);
      } catch (error) {
        console.log('Push setup error:', error);
      }
    };

    setup();

    const unsub = messaging().onTokenRefresh(t => {
      console.log(`FCM token refreshed: ${maskToken(t)}`);
      registerPushToken(t)
        .catch(error => {
          console.log('Push token refresh registration error:', error);
        })
        .then(() => {
          console.log(
            'Refreshed push token registered with backend successfully.',
          );
        });
    });

    return () => {
      teardownNotifications?.();
      unsub();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const hasInternet = Boolean(
        state.isConnected && state.isInternetReachable !== false,
      );
      const previous = connectivityRef.current;

      connectivityRef.current = hasInternet;

      if (previous === null) {
        if (!hasInternet) {
          showError(
            'No Internet Connection',
            'Check your network and try again.',
          );
        }
        return;
      }

      if (previous && !hasInternet) {
        showError(
          'You Are Offline',
          'Some parts of the app may not update until internet returns.',
        );
      } else if (!previous && hasInternet) {
        showSuccess('Back Online', 'Internet connection restored.');
      }
    });

    return unsubscribe;
  }, []);

  if (!isQueryCacheReady) {
    return <View style={styles.cacheBootstrapScreen} />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  cacheBootstrapScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
