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

  const [mode, setModeState] = useState<ThemeMode>('dark');
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

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';

// import { lightTheme } from './lightTheme';
// import { darkTheme } from './darkTheme';
// import { getItem, setItem, StorageKeys } from '@/helpers/storage';

// type ThemeMode = 'light' | 'dark';
// type ThemeType = typeof lightTheme;

// type ThemeContextType = {
//   theme: ThemeType;
//   isDark: boolean;
//   toggleTheme: () => void;
//   setTheme: (mode: ThemeMode) => void;
// };

// const ThemeContext = createContext<ThemeContextType | null>(null);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [mode, setMode] = useState<ThemeMode>('light');
//   const [hydrated, setHydrated] = useState(false);

//   /* ================= RESTORE THEME ================= */
//   useEffect(() => {
//     (async () => {
//       const storedTheme = await getItem<ThemeMode>(StorageKeys.THEME_MODE);

//       if (storedTheme === 'dark' || storedTheme === 'light') {
//         setMode(storedTheme);
//       }

//       setHydrated(true);
//     })();
//   }, []);

//   /* ================= ACTIONS ================= */
//   const setTheme = async (newMode: ThemeMode) => {
//     setMode(newMode);
//     await setItem(StorageKeys.THEME_MODE, newMode);
//   };

//   const toggleTheme = () => {
//     const newMode = mode === 'dark' ? 'light' : 'dark';
//     setTheme(newMode);
//   };

//   /* ================= DERIVED ================= */
//   const theme = useMemo(
//     () => (mode === 'dark' ? darkTheme : lightTheme),
//     [mode],
//   );

//   /* ================= WAIT FOR STORAGE ================= */
//   if (!hydrated) return null;

//   return (
//     <ThemeContext.Provider
//       value={{
//         theme,
//         isDark: mode === 'dark',
//         toggleTheme,
//         setTheme,
//       }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) {
//     throw new Error('useTheme must be used within ThemeProvider');
//   }
//   return ctx;
// }
