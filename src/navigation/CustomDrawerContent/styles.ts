import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    marginVertical: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
  },
  version: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 26,
    gap: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  themeOption: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;
