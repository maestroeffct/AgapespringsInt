import React, { useState } from 'react';
import { View } from 'react-native';

import { AppHeader } from '../../components/AppHeader/AppHeader';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { SegmentedTabs } from '../../components/SegmentedTabs/SegmentedTabs';

// import styles from './styles';
import { LatestTabContent } from './LatestTabContent';
import { ResourcesTabContent } from './ResourcesTabContent';
import { PullToRefresh } from '../../components/PullToRefresh/PullToRefresh';
import { LatestSkeleton } from './LatestSkeleton';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../backend/api/keys';

export default function HomeScreen() {
  const [tab, setTab] = useState<'latest' | 'resources'>('latest');
  const [refreshing, setRefreshing] = useState(false);

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
      <PullToRefresh
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.carousel }),
            queryClient.invalidateQueries({ queryKey: queryKeys.latestVideos }),
            queryClient.invalidateQueries({ queryKey: queryKeys.latestAudios }),
            queryClient.invalidateQueries({ queryKey: queryKeys.testimonies }),
          ]);
        }}
      >
        <View style={{ display: tab === 'latest' ? 'flex' : 'none' }}>
          {refreshing ? <LatestSkeleton /> : <LatestTabContent />}
        </View>

        <View style={{ display: tab === 'resources' ? 'flex' : 'none' }}>
          <ResourcesTabContent />
        </View>
      </PullToRefresh>
    </ScreenWrapper>
  );
}

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
