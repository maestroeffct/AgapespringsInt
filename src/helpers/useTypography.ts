import { useTheme } from '../theme/ThemeProvider';
import { createTypography } from './typography';

export function useTypography() {
  const { theme } = useTheme();
  return createTypography(theme.colors);
}
