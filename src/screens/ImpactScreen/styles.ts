import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = Math.round(SCREEN_WIDTH * (966 / 2180));

type ThemeColors = {
  background: string;
  primary: string;
  textSecondary: string;
  border: string;
};

export default function createStyles(colors: ThemeColors, isDark: boolean) {
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';
  const textPrimary = isDark ? '#FFFFFF' : '#0B0B0B';

  return StyleSheet.create({
    root: { flex: 1 },
    scroll: { paddingBottom: 48 },

    // Hero image
    heroImage: {
      width: SCREEN_WIDTH,
      height: HERO_HEIGHT,
    },

    // Gradient hero (fallback)
    hero: {
      paddingHorizontal: 24,
      paddingTop: 36,
      paddingBottom: 32,
      overflow: 'hidden',
      position: 'relative',
    },
    decor1: {
      position: 'absolute', width: 320, height: 320,
      borderRadius: 160, borderWidth: 1,
      top: -120, right: -80,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    decor2: {
      position: 'absolute', width: 200, height: 200,
      borderRadius: 100, borderWidth: 1,
      top: -60, right: -20,
      borderColor: 'rgba(255,255,255,0.07)',
    },
    globeWrap: { position: 'absolute', top: 16, right: 24 },

    // Ribbon
    ribbonWrap: {
      flexDirection: 'row',
      alignItems: 'stretch',
      marginBottom: 28,
      alignSelf: 'flex-start',
    },
    ribbonLeft: {
      width: 10,
      backgroundColor: '#8B0000',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    ribbonRight: {
      width: 10,
      backgroundColor: '#8B0000',
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    ribbonBody: {
      backgroundColor: '#9B0012',
      paddingHorizontal: 16,
      paddingVertical: 10,
      alignItems: 'center',
    },
    ribbonTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
    ribbonSub: { fontSize: 11, fontWeight: '700', color: '#FFD700', letterSpacing: 1.5, marginTop: 2 },

    // Stat
    statWrap: { alignItems: 'center', marginBottom: 20 },
    statText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
    statEquals: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
    statLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
    statEqualsText: { fontSize: 22, fontWeight: '900', color: '#FFD700' },
    statValue: { fontSize: 24, fontWeight: '900', color: '#FFD700', letterSpacing: 0.5 },

    // Desc pill
    descPill: {
      backgroundColor: '#FFD700',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      alignSelf: 'center',
    },
    descPillText: { fontSize: 12, fontWeight: '700', color: '#0B0B0B', textAlign: 'center' },

    // CTA banner
    ctaBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: '#1B0B6B',
    },
    ctaIcon: { marginRight: 8 },
    ctaText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.3, flex: 1, textAlign: 'center' },

    // Section card
    section: {
      margin: 16,
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      gap: 10,
      backgroundColor: cardBg,
      borderColor,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionIconWrap: {
      width: 36, height: 36, borderRadius: 18,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.primary + '18',
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: textPrimary },
    sectionBody: { fontSize: 14, lineHeight: 22, color: colors.textSecondary },

    // Accounts
    accountsTitle: {
      fontSize: 17,
      fontWeight: '700',
      marginHorizontal: 16,
      marginBottom: 12,
      color: textPrimary,
    },
    accountCard: {
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      gap: 4,
      backgroundColor: cardBg,
      borderColor,
    },
    accountCardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    bankPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: colors.primary + '18',
    },
    bankPillText: { fontSize: 12, fontWeight: '700', color: colors.primary },
    currencyBadge: {
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: colors.primary + '12',
      borderColor: colors.primary + '30',
    },
    currencyText: { fontSize: 11, fontWeight: '600', color: colors.primary },
    accountLabel: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
    accountNumber: { fontSize: 24, fontWeight: '800', letterSpacing: 1, marginTop: 4, color: textPrimary },
    accountHolder: { fontSize: 12, marginTop: 2, color: colors.textSecondary },
    copyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-end',
      marginTop: 10,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    copyText: { fontSize: 12, fontWeight: '600', color: colors.primary },

    // Empty
    loader: { marginVertical: 24 },

    emptyCard: {
      marginHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      padding: 32,
      alignItems: 'center',
      gap: 8,
      backgroundColor: cardBg,
      borderColor,
    },
    emptyText: { fontSize: 13, color: colors.textSecondary },

    // Give online
    giveOnlineBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginHorizontal: 16,
      marginTop: 8,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: colors.primary,
    },
    giveOnlineBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    footerNote: {
      textAlign: 'center',
      fontSize: 12,
      marginTop: 10,
      marginHorizontal: 16,
      color: colors.textSecondary,
    },
  });
}
