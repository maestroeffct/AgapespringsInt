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

  fullImage: {
    width: '100%',
    height: 180,
    marginBottom: 8,
    borderRadius: 10,
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
});
