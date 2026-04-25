import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '../AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { AppAlert, AppAlertConfig, AppAlertButton } from './AppAlert';

export function AppAlertHost() {
  const { theme, isDark } = useTheme();
  const [config, setConfig] = useState<AppAlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AppAlert.setHandler(cfg => {
      setConfig(cfg);
      setVisible(true);
    });
    return () => AppAlert.setHandler(() => {});
  }, []);

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 260 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  const dismiss = useCallback((onPress?: () => void) => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 120, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      setConfig(null);
      onPress?.();
    });
  }, [scaleAnim, opacityAnim]);

  if (!config) return null;

  const buttons: AppAlertButton[] = config.buttons?.length
    ? config.buttons
    : [{ text: 'OK', style: 'default' }];

  const cancelBtn = buttons.find(b => b.style === 'cancel');
  const otherBtns = buttons.filter(b => b.style !== 'cancel');
  const ordered = cancelBtn ? [...otherBtns, cancelBtn] : otherBtns;

  const isRow = ordered.length === 2;

  const surface = isDark ? '#1E1E1E' : '#FFFFFF';
  const divider = isDark ? '#2E2E2E' : '#E8E8E8';
  const titleColor = isDark ? '#FFFFFF' : '#111111';
  const messageColor = isDark ? '#AAAAAA' : '#555555';

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={() => dismiss()}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: surface,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable>
            {/* Content */}
            <View style={styles.content}>
              <AppText style={[styles.title, { color: titleColor }]}>
                {config.title}
              </AppText>
              {!!config.message && (
                <AppText style={[styles.message, { color: messageColor }]}>
                  {config.message}
                </AppText>
              )}
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: divider }]} />

            {/* Buttons */}
            <View style={[styles.btnRow, isRow && styles.btnRowHorizontal]}>
              {ordered.map((btn, i) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                const isLast = i === ordered.length - 1;

                const btnBg = isCancel
                  ? 'transparent'
                  : isDestructive
                  ? '#D21F3C'
                  : theme.colors.primary;

                const btnText = isCancel
                  ? (isDark ? '#AAAAAA' : '#666666')
                  : '#FFFFFF';

                return (
                  <React.Fragment key={i}>
                    {isRow && i > 0 && (
                      <View style={[styles.btnDividerV, { backgroundColor: divider }]} />
                    )}
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => dismiss(btn.onPress)}
                      style={[
                        styles.btn,
                        isRow && styles.btnFlex,
                        !isRow && !isLast && { borderBottomWidth: 1, borderBottomColor: divider },
                        !isCancel && { backgroundColor: btnBg },
                        isCancel && styles.btnCancel,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.btnText,
                          { color: isCancel ? (isDark ? '#AAAAAA' : '#666666') : btnText },
                          isCancel && styles.btnTextCancel,
                          !isRow && !isCancel && styles.btnTextMain,
                        ]}
                      >
                        {btn.text}
                      </AppText>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 20,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
  },
  btnRow: {
    flexDirection: 'column',
  },
  btnRowHorizontal: {
    flexDirection: 'row',
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFlex: {
    flex: 1,
  },
  btnCancel: {
    backgroundColor: 'transparent',
  },
  btnDividerV: {
    width: 1,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnTextCancel: {
    fontWeight: '400',
    fontSize: 14,
  },
  btnTextMain: {
    fontWeight: '700',
  },
});
