import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#8B1538', // brand wine
  },

  text: {
    color: '#777',
  },

  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
