import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/Splashscreen/Splashscreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { AppDrawerNavigator } from './AppDrawerNavigator';
import VideoListScreen from '../screens/VideoList/VideoListScreen';
import AudioListScreen from '../screens/AudioList/AudioListScreen';
import TestimonyListScreen from '../screens/TestimonyList/TestimonyListScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen/AudioPlayerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}

        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={AppDrawerNavigator} />
        <Stack.Screen name="VideoList" component={VideoListScreen} />
        <Stack.Screen name="AudioList" component={AudioListScreen} />
        <Stack.Screen name="TestimonyList" component={TestimonyListScreen} />
        <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
