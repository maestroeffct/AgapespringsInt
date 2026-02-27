import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { SegmentedTabs } from '../../components/SegmentedTabs/SegmentedTabs';

// import styles from './styles';
import { LatestTabContent } from './LatestTabContent';
import { ResourcesTabContent } from './ResourcesTabContent';
import { PullToRefresh } from '../../components/PullToRefresh/PullToRefresh';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../backend/api/keys';

export default function HomeScreen() {
  const [tab, setTab] = useState<'latest' | 'resources'>('latest');

  const queryClient = useQueryClient();

  const navigation = useNavigation<any>();
  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        badgeCount={10}
        onLeftPress={() => navigation.openDrawer()}
        onRightPress={() => navigation.navigate('Notifications')}
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

// <PullToRefresh
//   contentContainerStyle={styles.content}
//   showsVerticalScrollIndicator={false}
//   onRefresh={async () => {
//     console.log('Refreshing latest...');
//     await new Promise(res => setTimeout(res, 1500)); // mock
//     // await new Promise<void>(resolve => setTimeout(resolve, 1500)); // mock
//   }}
// >
//   <View style={{ display: tab === 'latest' ? 'flex' : 'none' }}>
//     <LatestTabContent />
//   </View>

//   <View style={{ display: tab === 'resources' ? 'flex' : 'none' }}>
//     <ResourcesTabContent />
//   </View>
// </PullToRefresh>;
