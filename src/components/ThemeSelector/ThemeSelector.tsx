import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import styles from './styles';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type OptionProps = {
  label: string;
  value: 'light' | 'dark' | 'system';
  active: boolean;
  onSelect: () => void;
};

function ThemeOption({ label, active, onSelect }: OptionProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: active ? theme.colors.surface : 'transparent',
        },
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <AppText
        style={[
          styles.label,
          {
            color: active ? theme.colors.primary : theme.colors.textPrimary,
          },
        ]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

export function ThemeSelector({ visible, onClose }: Props) {
  const { theme, mode, setMode } = useTheme();

  const select = (value: 'light' | 'dark' | 'system') => {
    setMode(value);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={[
          styles.backdrop,
          { backgroundColor: theme.colors.textSecondary },
        ]}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <AppText
            variant="h2"
            style={[styles.title, { color: theme.colors.textPrimary }]}
          >
            Select Preferred Theme
          </AppText>

          <ThemeOption
            label="Light"
            value="light"
            active={mode === 'light'}
            onSelect={() => select('light')}
          />

          <ThemeOption
            label="Dark"
            value="dark"
            active={mode === 'dark'}
            onSelect={() => select('dark')}
          />

          <ThemeOption
            label="System Default"
            value="system"
            active={mode === 'system'}
            onSelect={() => select('system')}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
