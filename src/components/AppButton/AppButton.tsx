import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../../components/AppText/AppText';
import { styles } from './styles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const isDisabled = disabled || loading;

  /* ================= VARIANT COLORS ================= */
  const backgroundColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
      ? colors.surface
      : 'transparent';

  const borderColor = variant === 'outline' ? colors.primary : 'transparent';

  const textColor = variant === 'primary' ? colors.background : colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[size],
        styles[variant],
        {
          backgroundColor,
          borderColor,
        },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <AppText font="inter" variant="body" style={{ color: textColor }}>
        {title}
      </AppText>

      {loading && (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
        />
      )}
    </TouchableOpacity>
  );
}
