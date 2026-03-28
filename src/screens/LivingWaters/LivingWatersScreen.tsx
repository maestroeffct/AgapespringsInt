import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import {
  SpotlightTourProvider,
  TourBox,
  TourStep,
} from 'react-native-spotlight-tour';

import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { LivingWatersTopTabs } from '../../navigation/LivingWaterTopTabsNavigator/LivingWatersTopTabs';
import { getItem, setItem, StorageKeys } from '../../helpers/storage';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';

export default function LivingWatersScreen({ navigation }: any) {
  const { theme } = useTheme();
  const steps = useMemo<TourStep[]>(
    () => [
      {
        render: props => (
          <TourBox
            title="Saved Audio"
            hideBack
            nextText="Done"
            style={{ backgroundColor: theme.colors.background }}
            titleStyle={{ color: theme.colors.textPrimary }}
            {...props}
          >
            <View>
              <AppText style={{ color: theme.colors.textSecondary }}>
                Use this to open your saved Living Waters audio downloads.
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
        setItem(StorageKeys.LIVING_WATERS_TOUR_DONE, true).catch(() => {});
      }}
    >
      {({ start }) => (
        <LivingWatersScreenContent navigation={navigation} startTour={start} />
      )}
    </SpotlightTourProvider>
  );
}

function LivingWatersScreenContent({
  navigation,
  startTour,
}: {
  navigation: any;
  startTour: () => void;
}) {
  useEffect(() => {
    let active = true;

    (async () => {
      const done = await getItem<boolean>(StorageKeys.LIVING_WATERS_TOUR_DONE);
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

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        showLogo
        onLeftPress={() => navigation.openDrawer()}
        rightType="icon"
        rightIconName="save"
        rightIconSize={22}
        onRightPress={() =>
          navigation.navigate('DownloadedAudioList', {
            source: 'livingwaters',
            title: 'Saved Living Waters',
          })
        }
        rightTourIndex={0}
      />

      <View style={{ flex: 1 }}>
        <LivingWatersTopTabs />
      </View>
    </ScreenWrapper>
  );
}
