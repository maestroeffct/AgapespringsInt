import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type SkeletonBlockProps = {
  width?: number | string;
  height: number;
  radius?: number;
  style?: ViewStyle;
};

export function SkeletonBlock({
  width = '100%',
  height,
  radius = 8,
  style,
}: SkeletonBlockProps) {
  const { theme, isDark } = useTheme();

  const backgroundColor = isDark ? theme.colors.surface : '#E6E6E6';

  const blockStyle: ViewStyle = {
    height,
    borderRadius: radius,
    backgroundColor,
  };

  // width can be a number or a string like "100%"; cast to any for compatibility with ViewStyle's typing here
  if (typeof width === 'number') {
    blockStyle.width = width;
  } else {
    blockStyle.width = width as any;
  }

  return <View style={[blockStyle, style]} />;
}
