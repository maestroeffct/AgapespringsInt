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
  image: {
    width: width + 80, // extra width for parallax
    height: '100%',
    marginLeft: -40,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B3123C', // brand color
    marginHorizontal: 4,
  },
});
