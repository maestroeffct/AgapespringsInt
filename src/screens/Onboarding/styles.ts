// src/screens/onboarding/styles.ts
import { StyleSheet } from 'react-native';

const createStyles = (overlayColor: string) =>
  StyleSheet.create({
    slide: {
      flex: 1,
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: overlayColor,
    },

    container: {
      flex: 1,
    },

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

    textBlock: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '60%',
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

export default createStyles;
