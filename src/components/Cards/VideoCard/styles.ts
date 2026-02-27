import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    width: 250,
    marginLeft: 16,
  },

  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },

  text: {
    fontWeight: '600',
  },

  fullCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: 20,
  },

  imageWrap: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },

  imageFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  horizontalImageWrap: {
    width: 200,
    height: 100,
    marginRight: 12,
  },

  horizontalTextWrap: {
    flex: 1,
  },

  date: {
    marginTop: 20,
    fontSize: 12,
    opacity: 0.7,
  },
});
