import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import styles from './styles';
import { useCarousel } from '../../backend/api/hooks/useCarousel';

const { width } = Dimensions.get('window');
const AUTO_SCROLL_INTERVAL = 4000;

const FALLBACK_SLIDES = [{ id: 'fallback-1', file_path: undefined }];

export function HeroCarousel() {
  const { data } = useCarousel();

  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Always have something to render
   */
  const slides = useMemo(() => {
    return data && data.length > 0 ? data : FALLBACK_SLIDES;
  }, [data]);

  /**
   * Auto-scroll ONLY when real data exists
   */
  useEffect(() => {
    if (!data || data.length <= 1) return;

    const timer = setInterval(() => {
      const next = activeIndex === data.length - 1 ? 0 : activeIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });

      setActiveIndex(next);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex, data]);

  return (
    <View>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }, // 👈 change this
        )}
        onMomentumScrollEnd={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(i);
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-40, 0, 40],
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
          });

          return (
            <View style={styles.slide}>
              <Animated.Image
                source={
                  item.file_path
                    ? { uri: item.file_path }
                    : require('../../assets/images/hero1.png')
                }
                style={[
                  styles.image,
                  {
                    transform: [{ translateX }],
                    opacity,
                  },
                ]}
                resizeMode="cover"
              />
            </View>
          );
        }}
      />

      {/* DOTS */}
      <View style={styles.dots}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 2.5, 1],
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
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
