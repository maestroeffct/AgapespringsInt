import React from 'react';
import {
  createDrawerNavigator,
  // DrawerContentScrollView,
  // DrawerItem,
} from '@react-navigation/drawer';

import { AppTabNavigator } from './AppTabNavigator';
import { useTheme } from '../theme/ThemeProvider';

import { CustomDrawerContent } from './CustomDrawerContent/CustomDrawerContent';
import WebScreen from '../screens/WebScreen/WebScreen';
import ChurchLocatorScreen from '../screens/ChurchLocator/ChurchLocatorScreen';
import PlatformsScreen from '../screens/PlatformsScreen/PlatformsScreen';

export type DrawerParamList = {
  Tabs: undefined;
  Notifications: undefined;
  AboutWeb: { title?: string; url: string } | undefined;
  GiveWeb: { title?: string; url: string } | undefined;
  ChurchLocator: undefined;
  Platforms: undefined;
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
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Tabs" component={AppTabNavigator} />
      <Drawer.Screen
        name="AboutWeb"
        component={WebScreen}
        initialParams={{
          title: 'About Us',
          url: 'https://www.agapespringsint.com/about',
        }}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="GiveWeb"
        component={WebScreen}
        initialParams={{
          title: 'Give - Agapesprings',
          url: 'https://www.agapespringsint.com/give',
        }}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="ChurchLocator"
        component={ChurchLocatorScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="Platforms"
        component={PlatformsScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}
