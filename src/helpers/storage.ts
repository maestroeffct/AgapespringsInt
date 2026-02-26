import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Centralized storage keys
 * Keeps AsyncStorage usage consistent across the app
 */
export const StorageKeys = {
  COUNTRIES: 'CACHED_COUNTRIES',
  AUTH_TOKEN: 'AUTH_TOKEN',
  PROFILE_COMPLETE: 'PROFILE_COMPLETE',
  AUTH_USER: 'AUTH_USER',
  THEME_MODE: 'THEME_MODE',
  ONBOARDING_DONE: 'ONBOARDING_DONE',
  APP_THEME: 'APP_THEME',
  QUERY_CACHE: 'QUERY_CACHE',
  FAVORITES: 'FAVORITES',
} as const;

export type StorageKey = keyof typeof StorageKeys;

/**
 * Save a value to AsyncStorage
 */
export async function setItem<T>(
  key: (typeof StorageKeys)[StorageKey],
  value: T,
): Promise<void> {
  if (value === undefined || value === null) {
    throw new Error(`[Storage] Cannot store empty value for key: ${key}`);
  }

  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to set item for key: ${key}`, error);
    throw error;
  }
}

/**
 * Retrieve a value from AsyncStorage
 */
export async function getItem<T>(
  key: (typeof StorageKeys)[StorageKey],
): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[Storage] Failed to get item for key: ${key}`, error);
    return null;
  }
}

/**
 * Remove a single item
 */
export async function removeItem(
  key: (typeof StorageKeys)[StorageKey],
): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to remove item for key: ${key}`, error);
  }
}

/**
 * Optional: Clear everything (use carefully)
 */
export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('[Storage] Failed to clear storage', error);
  }
}
