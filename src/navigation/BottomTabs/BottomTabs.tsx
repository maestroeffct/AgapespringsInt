import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import { useTheme } from '../../theme/ThemeProvider';

// Screens
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
// import LivingWatersScreen from '../../screens/LivingWaters/LivingWatersScreen';
// import DevotionalScreen from '../../screens/Devotional/DevotionalScreen';
// import OneSoundScreen from '../../screens/OneSound/OneSoundScreen';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,

        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },

        tabBarIcon: ({ color, focused, size }) => {
          let iconName: string = '';

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;

            case 'LivingWatersTab':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;

            case 'DevotionalTab':
              iconName = focused ? 'book' : 'book-outline';
              break;

            case 'OneSoundTab':
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
              break;
          }

          return <Ionicons name={iconName as any} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />

      <Tab.Screen
        name="LivingWatersTab"
        component={HomeScreen}
        options={{ title: 'Livingwaters' }}
      />

      <Tab.Screen
        name="DevotionalTab"
        component={HomeScreen}
        options={{ title: 'Devotional' }}
      />

      <Tab.Screen
        name="OneSoundTab"
        component={HomeScreen}
        options={{ title: 'OneSound' }}
      />
    </Tab.Navigator>
  );
}
