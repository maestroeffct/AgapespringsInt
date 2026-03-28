import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logo: {
    width: 210,
    height: 64,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
    marginVertical: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
  },
  version: {
    textAlign: 'center',
    opacity: 0.6,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    alignItems: 'center',
    gap: 6,
  },
  footerLogo: {
    width: 140,
    height: 38,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetCard: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 14,
  },
  sheetCardLight: {
    backgroundColor: '#FFFFFF',
  },
  sheetCardDark: {
    backgroundColor: '#12151B',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sheetDivider: {
    height: 1,
    opacity: 0.9,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOptionCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 132,
    paddingHorizontal: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default styles;
