import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { useTheme } from '../../theme/ThemeProvider';
import { PlatformsWebTab } from '../../components/Tabs/PlatformsWebTab';
import { PlatformsRadioTab } from '../../components/Tabs/PlatformsRadioTab';
import { PlatformsTvTab } from '../../components/Tabs/PlatformsTvTab';

const Tab = createMaterialTopTabNavigator();

export default function PlatformsScreen({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Platforms"
        showLogo={false}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: true,
            sceneStyle: {
              backgroundColor: theme.colors.background,
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarIndicatorStyle: {
              backgroundColor: theme.colors.primary,
              height: 2,
            },
            tabBarLabelStyle: {
              fontWeight: '600',
              textTransform: 'none',
            },
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.border,
              borderBottomWidth: 1,
              elevation: 0,
            },
          }}
        >
          <Tab.Screen name="Web" component={PlatformsWebTab} />
          <Tab.Screen name="Radio" component={PlatformsRadioTab} />
          <Tab.Screen name="TV" component={PlatformsTvTab} />
        </Tab.Navigator>
      </View>
    </ScreenWrapper>
  );
}
