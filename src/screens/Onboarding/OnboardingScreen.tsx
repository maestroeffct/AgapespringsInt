import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';
import { onboardingSlides } from './slides';

import { AppText } from '../../components/AppText/AppText';
import { AppButton } from '../../components/AppButton/AppButton';
import { useTheme } from '../../theme/ThemeProvider';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { setItem, StorageKeys } from '../../helpers/storage';
import { Animated } from 'react-native';

const { width } = Dimensions.get('window');

export function OnboardingScreen({ navigation }: any) {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const isLast = index === onboardingSlides.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await setItem(StorageKeys.ONBOARDING_DONE, true);
      navigation.replace('Main');
    } else {
      flatListRef.current?.scrollToIndex({
        index: index + 1,
        animated: true,
      });
    }
  };

  return (
    <ScreenWrapper
      padded={false}
      statusBarTranslucent
      statusBarStyle="light-content"
      statusBarBackground="transparent"
    >
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            style={[styles.slide, { width }]}
          >
            <View style={styles.overlay} />

            <View style={styles.container}>
              {/* SKIP */}
              {!isLast && (
                <TouchableOpacity
                  style={styles.skip}
                  onPress={async () => {
                    await setItem(StorageKeys.ONBOARDING_DONE, true);
                    navigation.replace('Home');
                  }}
                >
                  <AppText variant="body" style={styles.skipBold}>
                    Skip &gt;
                  </AppText>
                </TouchableOpacity>
              )}

              {/* TEXT BLOCK */}
              <View style={styles.textBlock}>
                <AppText font="poppins" variant="h2" style={styles.title}>
                  {item.title}
                </AppText>

                <AppText
                  font="poppins"
                  variant="h2"
                  style={[styles.highlight, { color: theme.colors.accent }]}
                >
                  {item.highlight}
                </AppText>
              </View>

              {/* FOOTER */}
              <View style={styles.footer}>
                <View style={styles.dots}>
                  {onboardingSlides.map((_, i) => {
                    const inputRange = [
                      (i - 1) * width,
                      i * width,
                      (i + 1) * width,
                    ];

                    const dotWidth = scrollX.interpolate({
                      inputRange,
                      outputRange: [8, 20, 8],
                      extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                      inputRange,
                      outputRange: [0.4, 1, 0.4],
                      extrapolate: 'clamp',
                    });

                    return (
                      <Animated.View
                        key={i}
                        style={[
                          styles.dot,
                          {
                            width: dotWidth,
                            opacity,
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      />
                    );
                  })}
                </View>

                <View style={styles.buttonWrapper}>
                  <AppButton title={item.cta} size="lg" onPress={handleNext} />
                </View>
              </View>
            </View>
          </ImageBackground>
        )}
      />
    </ScreenWrapper>
  );
}
