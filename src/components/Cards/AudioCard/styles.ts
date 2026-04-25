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
    fontWeight: '600',
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

  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'nowrap',
  },

  metaText: {
    fontSize: 12,
    opacity: 0.72,
  },

  downloadBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
  },

  date: {
    marginTop: 20,
    fontSize: 12,
    opacity: 0.6,
  },

  nowPlayingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 18,
  },

  playingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
