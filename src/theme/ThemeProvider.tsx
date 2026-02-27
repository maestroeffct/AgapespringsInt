import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { getItem, setItem, StorageKeys } from '../helpers/storage';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: typeof lightTheme;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = Appearance.getColorScheme();

  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName | null>(
    systemScheme ?? null,
  );

  // Load saved theme
  useEffect(() => {
    (async () => {
      const saved = await getItem<ThemeMode>(StorageKeys.APP_THEME);
      if (saved) setModeState(saved);
    })();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const resolvedTheme =
    mode === 'system'
      ? systemTheme === 'dark'
        ? darkTheme
        : lightTheme
      : mode === 'dark'
      ? darkTheme
      : lightTheme;

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await setItem(StorageKeys.APP_THEME, newMode);
  };

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      isDark: resolvedTheme === darkTheme,
      mode,
      setMode,
    }),
    [resolvedTheme, mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
