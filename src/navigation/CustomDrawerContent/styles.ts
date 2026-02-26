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
});

export default styles;
