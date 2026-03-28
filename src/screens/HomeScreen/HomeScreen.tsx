import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { SegmentedTabs } from '../../components/SegmentedTabs/SegmentedTabs';
import { LatestTabContent } from './LatestTabContent';
import { ResourcesTabContent } from './ResourcesTabContent';
import { PullToRefresh } from '../../components/PullToRefresh/PullToRefresh';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../backend/api/keys';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import {
  SpotlightTourProvider,
  TourBox,
  TourStep,
} from 'react-native-spotlight-tour';
import { getItem, setItem, StorageKeys } from '../../helpers/storage';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../../components/AppText/AppText';
import { useGetActiveLiveStreamQuery } from '../../backend/api/youtube';

export default function HomeScreen() {
  const { theme } = useTheme();
  const steps = useMemo<TourStep[]>(
    () => [
      {
        render: props => (
          <TourBox
            title="Open The Menu"
            hideBack
            nextText="Next"
            style={{ backgroundColor: theme.colors.background }}
            titleStyle={{ color: theme.colors.textPrimary }}
            {...props}
          >
            <View>
              <AppText style={{ color: theme.colors.textSecondary }}>
                Open the menu to access About, Give, Platforms, Church Locator,
                and more.
              </AppText>
            </View>
          </TourBox>
        ),
      },
      {
        render: props => (
          <TourBox
            title="View Notifications"
            hideBack
            nextText="Done"
            style={{ backgroundColor: theme.colors.background }}
            titleStyle={{ color: theme.colors.textPrimary }}
            {...props}
          >
            <View>
              <AppText style={{ color: theme.colors.textSecondary }}>
                Tap here to see ministry updates and notifications.
              </AppText>
            </View>
          </TourBox>
        ),
      },
    ],
    [theme.colors.background, theme.colors.textPrimary, theme.colors.textSecondary],
  );

  return (
    <SpotlightTourProvider
      steps={steps}
      overlayColor="#000000"
      overlayOpacity={0.7}
      onBackdropPress="continue"
      onStop={() => {
        setItem(StorageKeys.HOME_TOUR_DONE, true).catch(() => {});
      }}
    >
      {({ start }) => <HomeScreenContent startTour={start} />}
    </SpotlightTourProvider>
  );
}

function HomeScreenContent({ startTour }: { startTour: () => void }) {
  const [tab, setTab] = useState<'latest' | 'resources'>('latest');
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const unreadCount = useSelector((state: RootState) =>
    state.notifications.items.filter(item => !item.read).length,
  );
  const { data: liveData } = useGetActiveLiveStreamQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const liveItem = liveData?.items?.[0];
  const liveVideoId =
    liveItem?.id?.videoId ??
    liveItem?.snippet?.resourceId?.videoId ??
    liveItem?.contentDetails?.videoId;
  const hasLiveStream = Boolean(liveVideoId);

  useEffect(() => {
    let active = true;

    (async () => {
      const done = await getItem<boolean>(StorageKeys.HOME_TOUR_DONE);
      if (active && !done) {
        setTimeout(() => {
          if (active) startTour();
        }, 450);
      }
    })();

    return () => {
      active = false;
    };
  }, [startTour]);

  const handleLiveInfoPress = () => {
    if (!hasLiveStream || !liveVideoId) {
      Alert.alert(
        'No Live Stream',
        'There is no live YouTube stream at the moment. Check back shortly.',
      );
      return;
    }

    Alert.alert(
      'Live Stream Ongoing',
      'A live YouTube stream is currently ongoing. Do you want to join now?',
      [
        {
          text: 'Not Now',
          style: 'cancel',
        },
        {
          text: 'Join',
          onPress: () =>
            navigation.navigate('VideoPlayer', {
              videoId: liveVideoId,
              title: liveItem?.snippet?.title ?? 'Live Stream',
              source: 'live',
            }),
        },
      ],
    );
  };

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        badgeCount={unreadCount}
        showInfoIcon
        infoIsActive={hasLiveStream}
        onInfoPress={handleLiveInfoPress}
        onLeftPress={() => navigation.openDrawer()}
        onRightPress={() => navigation.navigate('Notifications')}
        leftTourIndex={0}
        rightTourIndex={1}
      />
      <SegmentedTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'latest', label: 'Latest' },
          { key: 'resources', label: 'Resources' },
        ]}
      />
      <View style={styles.contentHost}>
        <View
          style={styles.layer}
          pointerEvents={tab === 'latest' ? 'auto' : 'none'}
        >
          <View style={tab === 'latest' ? styles.visible : styles.hidden}>
            <PullToRefresh
              onRefresh={async () => {
                await Promise.all([
                  queryClient.invalidateQueries({ queryKey: queryKeys.carousel }),
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.latestVideos,
                  }),
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.latestAudios,
                  }),
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.testimonies,
                  }),
                ]);
              }}
            >
              <LatestTabContent />
            </PullToRefresh>
          </View>
        </View>

        <View
          style={styles.layer}
          pointerEvents={tab === 'resources' ? 'auto' : 'none'}
        >
          <View style={tab === 'resources' ? styles.visible : styles.hidden}>
            <ResourcesTabContent />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  contentHost: {
    flex: 1,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  visible: {
    flex: 1,
    opacity: 1,
  },
  hidden: {
    flex: 1,
    opacity: 0,
  },
});
