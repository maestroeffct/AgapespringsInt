import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LivingWatersScreen from '../screens/LivingWaters/LivingWatersScreen';
import DevotionalScreen from '../screens/Devotional/DevotionalScreen';
import OneSoundScreen from '../screens/OneSound/OneSoundScreen';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  APP_TAB_BAR_HEIGHT,
  APP_TAB_BAR_PADDING_BOTTOM,
  APP_TAB_BAR_PADDING_TOP,
  ANDROID_TAB_BAR_EXTRA_BOTTOM,
} from './bottomTabMetrics';
// import AudioPlayerScreen from '../screens/AudioPlayerScreen/AudioPlayerScreen';

// import { LivingWatersScreen } from '../screens/LivingWaters/LivingWatersScreen';
// import { DevotionalScreen } from '../screens/Devotional/DevotionalScreen';
// import { OneSoundScreen } from '../screens/OneSound/OneSoundScreen';

export type TabParamList = {
  Home: undefined;
  LivingWaters: undefined;
  Devotional: undefined;
  OneSound: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export function AppTabNavigator() {
  const { theme } = useTheme();
  const androidBottomInset =
    Platform.OS === 'android' ? ANDROID_TAB_BAR_EXTRA_BOTTOM : 0;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: APP_TAB_BAR_HEIGHT + androidBottomInset,
          paddingTop: APP_TAB_BAR_PADDING_TOP,
          paddingBottom: APP_TAB_BAR_PADDING_BOTTOM + androidBottomInset,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: any;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'LivingWaters':
              iconName = focused ? 'water' : 'water-outline';
              break;
            case 'Devotional':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'OneSound':
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="LivingWaters" component={LivingWatersScreen} />
      <Tab.Screen name="Devotional" component={DevotionalScreen} />
      <Tab.Screen name="OneSound" component={OneSoundScreen} />
    </Tab.Navigator>
  );
}
