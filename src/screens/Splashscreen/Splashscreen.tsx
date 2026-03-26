import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

import { AppText } from '../../components/AppText/AppText';
// import { ScreenWrapper } from '@/components/Screenwrapper/Screenwrapper';
import styles from './styles';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getItem, StorageKeys } from '../../helpers/storage';
import { getInstalledAppVersion, compareVersions } from '../../helpers/appVersion';
import { getAppConfig } from '../../backend/api/config';
import { Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { isDark } = useTheme();

  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      await new Promise<void>(resolve => {
        setTimeout(resolve, 5000);
      });

      const onboardingDone = await getItem<boolean>(StorageKeys.ONBOARDING_DONE);
      const fallbackRoute: 'Main' | 'Onboarding' = onboardingDone
        ? 'Main'
        : 'Onboarding';
      let updateParams: RootStackParamList['UpdateRequired'] | undefined;

      try {
        const [appConfig, installedVersion] = await Promise.all([
          getAppConfig(),
          getInstalledAppVersion(),
        ]);

        const minimumVersion =
          Platform.OS === 'ios'
            ? appConfig.minVersion.ios
            : appConfig.minVersion.android;
        const storeUrl =
          Platform.OS === 'ios'
            ? appConfig.storeUrls.ios
            : appConfig.storeUrls.android;

        if (minimumVersion && compareVersions(installedVersion, minimumVersion) < 0) {
          updateParams = {
            currentVersion: installedVersion,
            minimumVersion,
            storeUrl,
          };
        }
      } catch (error) {
        console.log('App config check failed at splash:', error);
      }

      if (!isMounted) {
        return;
      }

      if (updateParams) {
        navigation.replace('UpdateRequired', updateParams);
        return;
      }

      navigation.replace(fallbackRoute);
    };

    boot();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <ScreenWrapper padded={false}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <AppText
          font="poppins"
          variant="h2"
          style={[styles.tagline, isDark ? styles.taglineDark : styles.taglineLight]}
        >
          Grace | Mindset | Profit
        </AppText>
      </View>
    </ScreenWrapper>
  );
}
