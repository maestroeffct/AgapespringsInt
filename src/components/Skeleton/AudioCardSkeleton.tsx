import React from 'react';
import { View } from 'react-native';
import { SkeletonBlock } from './SkeletonBlock';

export function AudioCardSkeleton() {
  return (
    <View
      style={{
        width: 140,
        marginLeft: 16,
        alignItems: 'center',
      }}
    >
      <SkeletonBlock height={120} width={120} radius={12} />
      <SkeletonBlock height={14} style={{ marginTop: 8 }} />
      <SkeletonBlock height={14} width="60%" style={{ marginTop: 6 }} />
    </View>
  );
}
