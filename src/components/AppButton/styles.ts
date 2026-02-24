import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  /* ================= SIZES ================= */
  sm: {
    height: 40,
    paddingHorizontal: 16,
  },
  md: {
    height: 48,
    paddingHorizontal: 20,
  },
  lg: {
    height: 56,
    paddingHorizontal: 24,
  },

  /* ================= VARIANTS ================= */
  primary: {
    backgroundColor: 'transparent', // resolved at runtime
  },
  secondary: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  disabled: {
    opacity: 0.5,
  },

  loader: {
    marginLeft: 8,
  },
});
