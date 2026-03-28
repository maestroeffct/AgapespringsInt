import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  skeleton: {
    width,
    height: 250,
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
  },
  slide: {
    width,
    height: 250,
    overflow: 'hidden',
  },
  imageFrame: {
    flex: 1,
  },
  image: {
    width: width + 80, // extra width for parallax
    height: '100%',
    marginLeft: -40,
  },
  remoteImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#B3123C',
    opacity: 1,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D1D5DB',
    opacity: 1,
  },
});
