import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../../theme/ThemeProvider';

import { LivingWatersVideoTab } from '../../components/LivingWatersVideoTab/LivingWatersVideoTab';
import { LivingWatersAudioTab } from '../../components/LivingWatersAudioTab/LivingWatersAudioTab';
import { LivingWatersBroadcastTab } from '../../components/LivingWatersBroadcastTab/LivingWatersBroadcastTab';

const Tab = createMaterialTopTabNavigator();

export function LivingWatersTopTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
        },
        // 👇 THIS fixes the grey background behind screens
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
        // 👇 Also make navigator container themed

        swipeEnabled: true,
      }}
    >
      <Tab.Screen name="Video" component={LivingWatersVideoTab} />
      <Tab.Screen name="Audio" component={LivingWatersAudioTab} />
      <Tab.Screen name="Edify Broadcast" component={LivingWatersBroadcastTab} />
    </Tab.Navigator>
  );
}
