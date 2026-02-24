import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

import { useTypography } from '../../helpers/useTypography';

type FontVariant = 'inter' | 'satoshi' | 'geomanist' | 'poppins';
type TextVariant = 'h1' | 'h2' | 'body' | 'caption';

type AppTextProps = TextProps & {
  children: React.ReactNode;
  font?: FontVariant;
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
};

export function AppText({
  children,
  font = 'inter',
  variant = 'body',
  style,
  ...rest
}: AppTextProps) {
  const typography = useTypography();

  const textStyle = typography[font][variant];

  return (
    <Text {...rest} style={[textStyle, style]} allowFontScaling={false}>
      {children}
    </Text>
  );
}
