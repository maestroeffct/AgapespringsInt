import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

import { AppText } from '../../components/AppText/AppText';
// import { ScreenWrapper } from '@/components/Screenwrapper/Screenwrapper';
import styles from './styles';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getItem, StorageKeys } from '../../helpers/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    let isMounted = true;

    const boot = async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const onboardingDone = await getItem<boolean>(StorageKeys.ONBOARDING_DONE);

      if (!isMounted) {
        return;
      }

      navigation.replace(onboardingDone ? 'Main' : 'Onboarding');
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

        <AppText font="poppins" variant="h2" style={styles.tagline}>
          Grace | Mindset | Profit
        </AppText>
      </View>
    </ScreenWrapper>
  );
}
