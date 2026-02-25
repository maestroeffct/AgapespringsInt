import React from 'react';
import { View, TextInput } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import styles from './styles';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor: theme.colors.accent,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      {/* 🔍 Search Icon */}
      <Ionicons
        name="search"
        size={18}
        color={theme.colors.textSecondary}
        style={styles.icon}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search...'}
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, { color: theme.colors.textPrimary }]}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
    </View>
  );
}
