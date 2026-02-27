import React from 'react';
import { View, TouchableOpacity, Linking, Alert } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

import { AppText } from '../AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';

type Props = {
  title: string;
  url: string;
  leftIcon: string; // ionicon name (simple)
};

export function PlatformRow({ title, url, leftIcon }: Props) {
  const { theme } = useTheme();

  const open = async () => {
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert('Invalid link', url);
    Linking.openURL(url);
  };

  const copy = () => {
    Clipboard.setString(url);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={open}
      style={[
        styles.row,
        {
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View style={styles.left}>
        <Ionicons
          name={leftIcon as any}
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.middle}>
        <AppText style={[styles.title, { color: theme.colors.textPrimary }]}>
          {title}
        </AppText>
        <AppText
          style={[styles.url, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {url}
        </AppText>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={copy}
        style={styles.right}
      >
        <Ionicons
          name="link-outline"
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
