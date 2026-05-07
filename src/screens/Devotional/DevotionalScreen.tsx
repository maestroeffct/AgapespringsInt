import React from 'react';
import { View } from 'react-native';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { DevotionalTopTabs } from '../../components/DevotionalTabs/DevotionalTopTabs';

export default function DevotionalScreen({ navigation }: any) {
  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        showLogo
        logoVariant="compact"
        title="Devotional"
        onLeftPress={() => navigation.openDrawer()}
        rightType="none"
      />

      <View style={{ flex: 1 }}>
        <DevotionalTopTabs />
      </View>
    </ScreenWrapper>
  );
}
