import type { DevotionalDetailsItem } from '../navigation/types';
import { getItem, setItem, StorageKeys } from './storage';

export type FavouriteDevotionalItem = DevotionalDetailsItem & {
  savedAt: string;
};

type FavouriteDevotionalMap = Record<string, FavouriteDevotionalItem>;

export async function getDevotionalFavouriteMap() {
  return (
    (await getItem<FavouriteDevotionalMap>(
      StorageKeys.DEVOTIONAL_FAVORITES,
    )) ?? {}
  );
}

export async function getDevotionalFavouriteItems() {
  const map = await getDevotionalFavouriteMap();

  return Object.values(map).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export async function isDevotionalFavourite(id: string) {
  const map = await getDevotionalFavouriteMap();
  return !!map[id];
}

export async function upsertDevotionalFavourite(item: DevotionalDetailsItem) {
  const map = await getDevotionalFavouriteMap();
  map[item.id] = {
    ...item,
    savedAt: new Date().toISOString(),
  };
  await setItem(StorageKeys.DEVOTIONAL_FAVORITES, map);
}

export async function removeDevotionalFavourite(id: string) {
  const map = await getDevotionalFavouriteMap();
  delete map[id];
  await setItem(StorageKeys.DEVOTIONAL_FAVORITES, map);
}

export async function toggleDevotionalFavourite(item: DevotionalDetailsItem) {
  const map = await getDevotionalFavouriteMap();
  const exists = !!map[item.id];

  if (exists) {
    delete map[item.id];
  } else {
    map[item.id] = {
      ...item,
      savedAt: new Date().toISOString(),
    };
  }

  await setItem(StorageKeys.DEVOTIONAL_FAVORITES, map);
  return !exists;
}
