import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React, { useCallback, useRef, useState } from 'react';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/Splashscreen/Splashscreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { AppDrawerNavigator } from './AppDrawerNavigator';
import VideoListScreen from '../screens/VideoList/VideoListScreen';
import AudioListScreen from '../screens/AudioList/AudioListScreen';
import TestimonyListScreen from '../screens/TestimonyList/TestimonyListScreen';
import AudioPlayerScreen from '../screens/AudioPlayerScreen/AudioPlayerScreen';
import { View } from 'react-native';
import { MiniPlayer } from '../components/MiniPlayer/MiniPlayer';
import TrackPlayer from 'react-native-track-player';

const Stack = createNativeStackNavigator<RootStackParamList>();
type NavState = NavigationState | PartialState<NavigationState> | undefined;
const MINI_PLAYER_VISIBLE_ROUTES = new Set([
  'Main',
  'Tabs',
  'Home',
  'LivingWaters',
  'Devotional',
  'OneSound',
]);

function hasOpenDrawer(state?: NavState): boolean {
  if (!state) return false;

  const navState = state as any;

  if (navState.type === 'drawer' && Array.isArray(navState.history)) {
    const isOpen = navState.history.some(
      (entry: any) => entry?.type === 'drawer' && entry?.status === 'open',
    );
    if (isOpen) return true;
  }

  if (!Array.isArray(navState.routes)) return false;

  return navState.routes.some((route: any) =>
    hasOpenDrawer(route?.state as NavState),
  );
}

export function RootNavigator() {
  const navRef = useRef<NavigationContainerRef<any>>(null);
  const [activeRouteName, setActiveRouteName] = useState<string | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const syncNavigationMeta = useCallback(() => {
    const route = navRef.current?.getCurrentRoute();
    setActiveRouteName(route?.name);

    const rootState = navRef.current?.getRootState();
    setIsDrawerOpen(hasOpenDrawer(rootState));
  }, []);

  const shouldShowMiniPlayer =
    !!activeRouteName &&
    MINI_PLAYER_VISIBLE_ROUTES.has(activeRouteName) &&
    !isDrawerOpen;

  const openFullPlayerFromMini = useCallback(async () => {
    try {
      const [queue, activeIndex] = await Promise.all([
        TrackPlayer.getQueue(),
        TrackPlayer.getActiveTrackIndex(),
      ]);

      const queueItems = queue
        .map((track, index) => ({
          id: String(track.id ?? `audio-${index}`),
          audioUrl: typeof track.url === 'string' ? track.url : '',
          title: track.title,
          author: track.artist,
          artwork:
            typeof track.artwork === 'string' ? track.artwork : undefined,
        }))
        .filter(item => item.audioUrl.length > 0);

      if (queueItems.length > 0) {
        const startIndex =
          typeof activeIndex === 'number' &&
          activeIndex >= 0 &&
          activeIndex < queueItems.length
            ? activeIndex
            : 0;

        navRef.current?.navigate('AudioPlayer', {
          id: queueItems[startIndex]?.id,
          audioUrl: queueItems[startIndex]?.audioUrl,
          title: queueItems[startIndex]?.title,
          author: queueItems[startIndex]?.author,
          artwork: queueItems[startIndex]?.artwork,
          queue: queueItems,
          startIndex,
        });
        return;
      }
    } catch {}

    navRef.current?.navigate('AudioPlayer');
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        ref={navRef}
        onReady={syncNavigationMeta}
        onStateChange={syncNavigationMeta}
      >
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

      {shouldShowMiniPlayer ? (
        <MiniPlayer onPress={openFullPlayerFromMini} />
      ) : null}
    </View>
  );
}
