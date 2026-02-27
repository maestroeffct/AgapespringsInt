import { StyleSheet } from 'react-native';

const CARD_BG = '#F3F4F6';
const CARD_BORDER = '#E3E5E8';
const ADDRESS = '#4B5563';
const PHONE = '#B5336D';

export default StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 68,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    color: '#1F2937',
  },
  headerRightSpace: {
    width: 40,
    height: 40,
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderColor: CARD_BORDER,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nameText: {
    color: '#111827',
    fontSize: 18,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  addressText: {
    color: ADDRESS,
    fontSize: 14,
    textTransform: 'uppercase',
    lineHeight: 21,
    marginBottom: 8,
  },
  phoneText: {
    color: PHONE,
    fontSize: 16,
    textTransform: 'none',
  },
});
