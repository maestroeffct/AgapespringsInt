import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from './SkeletonBlock';

export function VideoCardSkeleton() {
  return (
    <View style={{ width: 220, marginLeft: 16 }}>
      <SkeletonBlock height={120} radius={12} />
      <SkeletonBlock height={14} style={{ marginTop: 8 }} />
      <SkeletonBlock height={14} width="70%" style={{ marginTop: 6 }} />
    </View>
  );
}
