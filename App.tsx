import React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { AppProviders } from './src/app/AppProviders';
import { AppBootstrap } from './src/app/AppBootstrap';

const App = () => {
  return (
    <AppProviders>
      <AppBootstrap>
            <RootNavigator />
            <Toast />
      </AppBootstrap>
    </AppProviders>
  );
};

export default App;
