import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export function AppIcon({ name, size = 24, color = '#000' }: Props) {
  return <Ionicons name={name as any} size={size} color={color} />;
}
