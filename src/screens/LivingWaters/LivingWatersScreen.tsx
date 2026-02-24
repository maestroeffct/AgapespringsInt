import React, { useState } from 'react';
import { View } from 'react-native';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';

// import { LivingWatersVideoTab } from './LivingWatersVideoTab';
// import { LivingWatersAudioTab } from './LivingWatersAudioTab';
// import { LivingWatersBroadcastTab } from './LivingWatersBroadcastTab';
import { TopTextTabs } from '../../components/TopTextTabs/TopTextTabs';
import { LivingWatersVideoTab } from '../../components/LivingWatersVideoTab/LivingWatersVideoTab';

export default function LivingWatersScreen({ navigation }: any) {
  const [tab, setTab] = useState<'video' | 'audio' | 'broadcast'>('video');

  return (
    <ScreenWrapper padded={false}>
      <AppHeader showLogo onLeftPress={() => navigation.openDrawer()} />

      <TopTextTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'video', label: 'Video' },
          { key: 'audio', label: 'Audio' },
          { key: 'broadcast', label: 'Edify Broadcast' },
        ]}
      />

      <View style={{ flex: 1 }}>
        {tab === 'video' && <LivingWatersVideoTab />}
        {/* {tab === 'audio' && <LivingWatersAudioTab />} */}
        {/* {tab === 'broadcast' && <LivingWatersBroadcastTab />} */}
      </View>
    </ScreenWrapper>
  );
}
