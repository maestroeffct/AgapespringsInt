import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AppTabNavigator } from './AppTabNavigator';
import { useTheme } from '../theme/ThemeProvider';

export type DrawerParamList = {
  Tabs: undefined;
  Notifications: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export function AppDrawerNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Drawer.Screen name="Tabs" component={AppTabNavigator} />
    </Drawer.Navigator>
  );
}
