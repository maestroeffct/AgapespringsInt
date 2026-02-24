import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tab: {
    alignItems: 'center',
    paddingVertical: 14,
  },

  label: {
    color: '#777',
    fontWeight: '500',
  },

  activeLabel: {
    color: '#d2a40cff', // your wine brand color
    fontWeight: '600',
  },

  underline: {
    marginTop: 6,
    height: 3,
    width: 30,
    backgroundColor: '#8B0E2F',
    borderRadius: 2,
  },
});
