import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    width: 120,
    marginLeft: 16,
    alignItems: 'center',
  },

  fullCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: 20,
  },

  fullImage: {
    width: '100%',
    height: 180,
    marginBottom: 8,
    borderRadius: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },

  title: {
    textAlign: 'left',
  },

  imageWrap: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#111827',
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
    width: 110,
    height: 110,
    marginRight: 12,
  },

  horizontalTextWrap: {
    flex: 1,
  },

  author: {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.8,
  },

  date: {
    marginTop: 20,
    fontSize: 12,
    opacity: 0.6,
  },
});
