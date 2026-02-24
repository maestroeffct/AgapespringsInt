import React from 'react';
import { ScrollView, View } from 'react-native';

import { VideoCardSkeleton } from '../../components/Skeleton/VideoCardSkeleton';
import { AudioCardSkeleton } from '../../components/Skeleton/AudioCardSkeleton';
import { TestimonyCardSkeleton } from '../../components/Skeleton/TestimonyCardSkeleton';
import { SkeletonBlock } from '../../components/Skeleton/SkeletonBlock';

export function LatestSkeleton() {
  return (
    <>
      {/* Hero carousel skeleton */}
      <View style={{ marginTop: 16 }}>
        <SkeletonBlock
          height={200}
          radius={14}
          style={{ marginHorizontal: 16 }}
        />
      </View>

      {/* Video skeletons */}
      <View style={{ marginTop: 24, marginBottom: 12, paddingHorizontal: 16 }}>
        <SkeletonBlock height={18} width="50%" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2].map(i => (
          <VideoCardSkeleton key={i} />
        ))}
      </ScrollView>

      {/* Audio skeletons */}
      <View style={{ marginTop: 24, marginBottom: 12, paddingHorizontal: 16 }}>
        <SkeletonBlock height={18} width="45%" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map(i => (
          <AudioCardSkeleton key={i} />
        ))}
      </ScrollView>

      {/* Testimony skeletons */}
      <View style={{ marginTop: 24, marginBottom: 12, paddingHorizontal: 16 }}>
        <SkeletonBlock height={18} width="40%" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2].map(i => (
          <TestimonyCardSkeleton key={i} />
        ))}
      </ScrollView>
    </>
  );
}
