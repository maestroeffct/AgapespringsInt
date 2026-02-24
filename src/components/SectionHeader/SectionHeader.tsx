import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';

type Props = {
  title: string;
  onViewAll?: () => void;
};

export function SectionHeader({ title, onViewAll }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <AppText
        variant="body"
        style={[styles.title, { color: theme.colors.textPrimary }]}
      >
        {title}
      </AppText>

      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <AppText
            variant="body"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            View all
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
