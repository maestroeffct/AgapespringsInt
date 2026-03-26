import { StyleSheet } from 'react-native';

type ThemeColors = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryText: string;
};

export default function createStyles(colors: ThemeColors, isDark: boolean) {
  const readerBackground = isDark ? '#030303' : colors.background;
  const readerSurface = isDark ? '#0B0B0B' : colors.surface;
  const readerText = isDark ? '#FFFFFF' : '#111111';
  const readerSubtext = isDark
    ? 'rgba(255,255,255,0.72)'
    : colors.textSecondary;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: readerBackground,
    },
    topRightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    topIconBtn: {
      minWidth: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: {
      flex: 1,
      backgroundColor: readerBackground,
    },
    content: {
      paddingTop: 12,
      paddingBottom: 138,
      paddingHorizontal: 18,
    },
    hero: {
      width: '100%',
      height: 182,
      marginBottom: 18,
      backgroundColor: readerSurface,
      borderRadius: 0,
      overflow: 'hidden',
    },
    heroImage: {
      borderRadius: 0,
    },
    heroOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 14,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    heroBadge: {
      backgroundColor: '#F4A51C',
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 6,
    },
    heroBadgeText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    titleBlock: {
      marginBottom: 18,
    },
    title: {
      color: readerText,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
      marginBottom: 10,
    },
    author: {
      color: readerSubtext,
      fontSize: 14,
      marginBottom: 6,
    },
    date: {
      color: readerSubtext,
      fontSize: 13,
    },
    sectionBlock: {
      marginBottom: 18,
    },
    sectionLabel: {
      color: readerText,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    memoryVerse: {
      color: readerText,
      lineHeight: 22,
      fontWeight: '800',
    },
    sectionBody: {
      color: readerText,
      lineHeight: 20,
    },
    inlineSectionLabel: {
      color: readerText,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    inlineSectionBody: {
      color: readerText,
      lineHeight: 23,
      fontStyle: 'italic',
    },
    bottomActions: {
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 56,
      alignItems: 'center',
    },
    bottomAction: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    bottomActionText: {
      color: readerSubtext,
      fontSize: 14,
    },
    floatingFontControls: {
      position: 'absolute',
      right: 18,
      bottom: 18,
      flexDirection: 'row',
      gap: 10,
      zIndex: 30,
    },
    floatingFontBtn: {
      width: 32,
      height: 32,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    floatingFontText: {
      color: colors.primaryText,
      fontSize: 16,
      fontWeight: '800',
    },
  });
}
