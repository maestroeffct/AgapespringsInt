import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { View } from 'react-native';
import { LivingWatersTopTabs } from '../../navigation/LivingWaterTopTabsNavigator/LivingWatersTopTabs';

export default function LivingWatersScreen({ navigation }: any) {
  return (
    <ScreenWrapper padded={false}>
      <AppHeader showLogo onLeftPress={() => navigation.openDrawer()} />

      <View style={{ flex: 1 }}>
        <LivingWatersTopTabs />
      </View>
    </ScreenWrapper>
  );
}
