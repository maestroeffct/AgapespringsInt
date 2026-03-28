import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '../theme/ThemeProvider';
import { store } from '../utils/store';
import { queryClient } from './queryClient';

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}
