import React, { useEffect } from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './src/utils/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  getFcmToken,
  listenToTokenRefresh,
  requestPushPermission,
} from './src/notifications/push';

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
  // useEffect(() => {
  //   (async () => {
  //     const allowed = await requestPushPermission();
  //     if (!allowed) return;

  //     const token = await getFcmToken();
  //     if (token) {
  //       // TODO: send token to your backend and save under userId/vendorId/riderId
  //       console.log('FCM token:', token);
  //     }
  //   })();

  //   const unsubRefresh = listenToTokenRefresh(t => {
  //     // TODO: send updated token to backend
  //     console.log('FCM token refreshed:', t);
  //   });

  //   return () => {
  //     unsubRefresh();
  //   };
  // }, []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
