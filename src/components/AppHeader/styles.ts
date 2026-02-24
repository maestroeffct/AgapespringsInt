import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safe: {
    backgroundColor: '#fff',
  },

  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    padding: 6,
  },

  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  logo: {
    width: 128,
    height: 128,
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
