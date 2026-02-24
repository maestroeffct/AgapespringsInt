import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
  },

  header: {
    borderBottomWidth: 1,
    borderColor: '#450d0dff',
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 30,
  },

  logo: {
    width: 250,
    height: 100,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },

  label: {
    flex: 1,
    marginLeft: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },

  footer: {
    marginTop: 'auto',
    padding: 20,
    alignItems: 'center',
  },
});
