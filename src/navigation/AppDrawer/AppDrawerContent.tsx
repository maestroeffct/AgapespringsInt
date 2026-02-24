import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeSelector } from '../../components/ThemeSelector/ThemeSelector';
import styles from './styles';

export function AppDrawerContent(props: any) {
  const { theme, mode } = useTheme();
  const [showTheme, setShowTheme] = useState(false);

  const logo = theme.isDark
    ? require('../../assets/images/logo_white.png')
    : require('../../assets/images/logo_name.png');

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* MAIN ITEMS */}
          <Item label="About Us" icon="information-circle-outline" />
          <Item label="Give" icon="gift-outline" />
          <Item label="Church Locator" icon="location-outline" />
          <Item label="Platforms" icon="apps-outline" />

          <View style={styles.divider} />

          {/* THEME */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => setShowTheme(true)}
          >
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={theme.colors.primary}
            />
            <AppText style={styles.label}>
              App Theme · {mode === 'system' ? 'System' : mode}
            </AppText>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <Item label="Share App" icon="share-social-outline" />

          <View style={styles.footer}>
            <AppText variant="caption">Version 1.2.0</AppText>
          </View>
        </View>
      </DrawerContentScrollView>

      <ThemeSelector visible={showTheme} onClose={() => setShowTheme(false)} />
    </>
  );
}

function Item({ label, icon }: any) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.item}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <AppText style={[styles.label, { color: theme.colors.textPrimary }]}>
        {label}
      </AppText>

      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}
