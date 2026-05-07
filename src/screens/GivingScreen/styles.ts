import { StyleSheet } from 'react-native';

type ThemeColors = {
  primary: string;
  textSecondary: string;
  border: string;
};

export default function createStyles(_colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    safe: { flex: 1 },
    scrollView: { flex: 1 },
    scroll: { padding: 20, paddingBottom: 40 },
    flex1: { flex: 1 },
    loader: { marginTop: 24 },
    listTopMargin: { marginTop: 12 },
    tabIcon: { marginRight: 4 },
    tabLoader: { marginVertical: 24 },
    searchResults: { marginBottom: 20, gap: 10 },
    tabRow: {
      flexDirection: 'row',
      margin: 10,
      borderRadius: 12,
      padding: 4,
      gap: 2,
      backgroundColor: isDark ? '#0a0a0a' : '#e5e5e5',
    },
    modalHandleBg: { backgroundColor: isDark ? '#333' : '#ddd' },
    payIconMC: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: '#EB001B' },
    payIconPS: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: '#00c3f7' },
    payIconVISA: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: '#1A1F71' },

    // Branch selector
    branchSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      marginBottom: 16,
    },
    branchIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    branchLabel: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
    branchName: { fontSize: 14, fontWeight: '600' },

    // Search
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 14,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 11,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      padding: 0,
    },

    // Main card
    mainCard: {
      borderRadius: 18,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: 28,
    },

    // Tabs
    tabBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      borderRadius: 9,
    },
    tabLabel: { fontSize: 13, fontWeight: '500' },
    tabLabelActive: { fontWeight: '700', color: '#fff' },

    // Accounts
    accountsContainer: {
      paddingHorizontal: 12,
      paddingBottom: 4,
      gap: 10,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 32,
      gap: 8,
    },
    emptyText: { fontSize: 13, fontWeight: '500' },

    // Bank card
    bankCard: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 14,
      gap: 4,
    },
    bankCardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    bankPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },
    bankPillText: { fontSize: 12, fontWeight: '700' },
    currencyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
    },
    currencyText: { fontSize: 11, fontWeight: '600' },
    accountName: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
    accountNumberWrap: { marginTop: 4, marginBottom: 2 },
    accountNumber: { fontSize: 22, fontWeight: '700', letterSpacing: 1 },
    sortCode: { fontSize: 12, marginTop: 1 },
    copyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      alignSelf: 'flex-end',
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
    },
    copyText: { fontSize: 12, fontWeight: '600' },

    // Give Online
    giveOnlineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
      marginTop: 4,
      borderTopWidth: 1,
    },
    giveOnlineLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    comingSoon: { fontSize: 12, fontWeight: '400', fontStyle: 'italic' },
    paymentIcons: { flexDirection: 'row', gap: 6 },
    payIcon: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
    payIconText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

    // Other ways
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, letterSpacing: -0.3 },
    otherList: { gap: 12, paddingBottom: 4 },
    otherCard: { width: 148, borderRadius: 16, borderWidth: 1, padding: 14 },
    otherCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    otherIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    otherCardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
    otherCardSub: { fontSize: 12, lineHeight: 17 },
    otherAccountsWrap: { marginTop: 16, gap: 10 },

    // Location picker modal
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      maxHeight: '70%',
    },
    modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    modalSub: { fontSize: 13, marginBottom: 4 },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderRadius: 8,
      marginBottom: 2,
    },
    locationName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
    locationAddress: { fontSize: 12 },
    clearBtn: {
      marginTop: 12,
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
    },
    clearBtnText: { fontSize: 13, fontWeight: '500' },
  });
}
