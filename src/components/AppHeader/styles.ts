import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: {
    backgroundColor: '#fff',
  },

  container: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 40,
    justifyContent: 'flex-end',
  },

  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveIconWrap: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveRipple: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
  },

  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },

  logo: {
    width: 128,
    height: 38,
  },

  logoText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },

  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D21F3C', // Agapesprings red
  },

  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C81D4F', // brand red
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    fontSize: 10,
    // color: '#fff',
  },
});
