import React from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import styles from './styles';
import { AppText } from '../AppText/AppText';

type TabItem = {
  key: string;
  label: string;
};

type Props = {
  tabs: TabItem[];
  active: string;
  onChange: (key: any) => void;
};

export function TopTextTabs({ tabs, active, onChange }: Props) {
  const activeIndex = tabs.findIndex(t => t.key === active);

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = tab.key === active;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.7}
          >
            <AppText
              variant="body"
              style={[styles.label, isActive && styles.activeLabel]}
            >
              {tab.label}
            </AppText>

            {isActive && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
