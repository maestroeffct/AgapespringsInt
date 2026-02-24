import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText/AppText';
import styles from './styles';

export function SegmentedTabs({ tabs, active, onChange }: any) {
  return (
    <View style={styles.container}>
      {tabs.map((tab: any) => {
        const isActive = tab.key === active;

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(tab.key)}
          >
            <AppText
              variant="body"
              style={isActive ? styles.activeText : styles.text}
            >
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
