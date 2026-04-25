import React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { AppProviders } from './src/app/AppProviders';
import { AppBootstrap } from './src/app/AppBootstrap';
import { AppAlertHost } from './src/components/AppAlert/AppAlertHost';

const App = () => {
  return (
    <AppProviders>
      <AppBootstrap>
            <RootNavigator />
            <Toast />
            <AppAlertHost />
      </AppBootstrap>
    </AppProviders>
  );
};

export default App;
