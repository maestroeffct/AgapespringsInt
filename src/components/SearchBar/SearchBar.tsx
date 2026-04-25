import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import styles from './styles';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onFilterPress,
  filterActive = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.wrap,
          onFilterPress && styles.wrapWithFilter,
          {
            borderColor: theme.colors.accent2,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
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

      {onFilterPress ? (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.75}
          style={[
            styles.filterBtn,
            {
              borderColor: filterActive
                ? theme.colors.primary
                : theme.colors.accent2,
              backgroundColor: filterActive
                ? theme.colors.primary
                : theme.colors.background,
            },
          ]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterActive ? theme.colors.primaryText : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
