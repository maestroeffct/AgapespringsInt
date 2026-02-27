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
        onLeftPress={() => navigation.openDrawer()}
        rightType={'none'}
        // if your AppHeader supports right icon press:
        // onRightPress={() => navigation.navigate('DevotionalDownloads')}
      />

      <View style={{ flex: 1 }}>
        <DevotionalTopTabs />
      </View>
    </ScreenWrapper>
  );
}
