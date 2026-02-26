import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

import { AppText } from '../../components/AppText/AppText';
// import { ScreenWrapper } from '@/components/Screenwrapper/Screenwrapper';
import styles from './styles';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding'); // replace prevents going back
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // cleanup
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
