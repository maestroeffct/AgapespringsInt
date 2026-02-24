import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    borderRadius: 14,
    padding: 20,
  },

  title: {
    marginBottom: 16,
    fontWeight: '600',
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },

  label: {
    fontSize: 16,
  },
});
