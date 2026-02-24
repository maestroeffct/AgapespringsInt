import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
  },

  iconWrap: {
    marginRight: 12,
    marginTop: 2,
  },

  content: {
    flex: 1,
  },

  title: {
    fontWeight: '600',
    marginBottom: 2,
  },

  time: {
    marginTop: 6,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 6,
  },
});
