import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  left: {
    flex: 1,
    paddingRight: 4,
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
