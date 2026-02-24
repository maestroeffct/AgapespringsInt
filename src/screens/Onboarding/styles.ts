// src/screens/onboarding/styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)', // subtle, like screenshot
  },

  // Wrapper inside ImageBackground
  container: {
    flex: 1,
  },

  // Skip top-right
  skip: {
    position: 'absolute',
    top: 58,
    right: 20,
    zIndex: 10,
  },

  skipBold: {
    fontWeight: '600',
    color: '#F5B301',
  },

  // Text block placement (matches screenshot)
  textBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '60%', // adjust 52% - 58% to match perfectly
    alignItems: 'center',
  },

  title: {
    textTransform: 'capitalize',
    letterSpacing: 2,
    color: '#fff',
    alignItems: 'center',
    textAlign: 'center',
  },

  highlight: {
    marginTop: 8,
  },

  // Footer: dots + button
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
  },

  dots: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  buttonWrapper: {
    width: '88%',
  },
});

export default styles;
