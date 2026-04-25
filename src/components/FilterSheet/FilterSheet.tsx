import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { AppText } from '../AppText/AppText';
import { AppButton } from '../AppButton/AppButton';
import { useTheme } from '../../theme/ThemeProvider';
import { withOpacity } from '../../theme/colors';

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterSection = {
  key: string;
  title: string;
  options: FilterOption[];
  multi?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  sections: FilterSection[];
  values: Record<string, string | string[]>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  onApply: () => void;
};

export function FilterSheet({
  visible,
  onClose,
  sections,
  values,
  onChange,
  onReset,
  onApply,
}: Props) {
  const { theme, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const isSelected = (key: string, value: string) => {
    const current = values[key];
    if (Array.isArray(current)) return current.includes(value);
    return current === value;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[styles.backdrop, { opacity: fadeAnim }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.background,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* handle */}
        <View style={styles.handleWrap}>
          <View
            style={[styles.handle, { backgroundColor: theme.colors.border }]}
          />
        </View>

        {/* header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: theme.colors.border },
          ]}
        >
          <AppText
            font="poppins"
            variant="h3"
            style={{ color: isDark ? '#FFFFFF' : '#0B0B0B' }}
          >
            Filter
          </AppText>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons
              name="close"
              size={22}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* options */}
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {sections.map((section, si) => (
            <View
              key={section.key}
              style={[
                styles.section,
                si < sections.length - 1 && {
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <AppText
                variant="caption"
                style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}
              >
                {section.title.toUpperCase()}
              </AppText>

              <View style={styles.optionList}>
                {section.options.map(opt => {
                  const selected = isSelected(section.key, opt.value);
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      activeOpacity={0.75}
                      onPress={() => onChange(section.key, opt.value)}
                      style={[
                        styles.optionRow,
                        {
                          backgroundColor: selected
                            ? withOpacity(theme.colors.primary, 0.08)
                            : theme.colors.surface,
                          borderColor: selected
                            ? theme.colors.primary
                            : theme.colors.border,
                        },
                      ]}
                    >
                      <AppText
                        variant="body"
                        style={{
                          color: selected
                            ? theme.colors.primary
                            : isDark
                            ? '#FFFFFF'
                            : '#0B0B0B',
                          fontWeight: selected ? '600' : '400',
                        }}
                      >
                        {opt.label}
                      </AppText>

                      {selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* footer */}
        <View
          style={[
            styles.footer,
            { borderTopColor: theme.colors.border },
          ]}
        >
          <AppButton
            title="Reset"
            variant="outline"
            size="md"
            onPress={onReset}
            style={styles.footerBtn}
          />
          <AppButton
            title="Apply"
            variant="primary"
            size="md"
            onPress={() => {
              onApply();
              onClose();
            }}
            style={styles.footerBtn}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 18,
  },
  sectionTitle: {
    letterSpacing: 0.8,
    marginBottom: 12,
    fontSize: 11,
  },
  optionList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerBtn: {
    flex: 1,
  },
});
