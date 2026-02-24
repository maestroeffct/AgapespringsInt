import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from './SkeletonBlock';

export function TestimonyCardSkeleton() {
  return (
    <View style={{ width: 200, marginLeft: 16 }}>
      <SkeletonBlock height={120} radius={12} />
      <SkeletonBlock height={14} width="80%" style={{ marginTop: 8 }} />
    </View>
  );
}
