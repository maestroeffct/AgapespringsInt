import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChurchLocationItem } from '../backend/api/queries';

const STORAGE_KEY = '@giving_selected_location';

type UseSelectedGivingLocationResult = {
  location: ChurchLocationItem | null;
  loaded: boolean;
  saveLocation: (loc: ChurchLocationItem | null) => Promise<void>;
};

export function useSelectedGivingLocation(): UseSelectedGivingLocationResult {
  const [location, setLocation] = useState<ChurchLocationItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (val) setLocation(JSON.parse(val));
      })
      .finally(() => setLoaded(true));
  }, []);

  const saveLocation = useCallback(async (loc: ChurchLocationItem | null) => {
    setLocation(loc);
    if (loc) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { location, loaded, saveLocation };
}
