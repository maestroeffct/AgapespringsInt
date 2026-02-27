import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../../theme/ThemeProvider';
import { DevotionalLatestTab } from '../Tabs/DevotionalLatestTab';
import { DevotionalFavouritesTab } from '../Tabs/DevotionalFavouritesTab';

const Tab = createMaterialTopTabNavigator();

export function DevotionalTopTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarPressColor: 'transparent',
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,

        tabBarLabelStyle: {
          fontWeight: '600',
          textTransform: 'none',
          fontSize: 14,
        },

        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 2.5,
        },

        tabBarStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen name="Latest" component={DevotionalLatestTab} />
      <Tab.Screen name="Favourites" component={DevotionalFavouritesTab} />
    </Tab.Navigator>
  );
}
