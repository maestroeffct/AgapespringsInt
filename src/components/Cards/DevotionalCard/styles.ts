import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 16,
    marginBottom: 10,
  },
  left: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
  },
  todayPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
  },
  todayPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  excerpt: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 8,
    gap: 4,
  },
  meta: {
    fontSize: 12,
  },
  meta2: {
    fontSize: 12,
  },
  thumb: {
    width: 78,
    height: 78,
    borderRadius: 12,
  },
});
