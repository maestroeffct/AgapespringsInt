import { getItem, setItem, StorageKeys } from './storage';

export type DownloadedAudioItem = {
  id: string;
  title: string;
  author: string;
  artwork?: string;
  localPath: string;
  source: 'onesound' | 'livingwaters';
  downloadedAt: string;
};

type DownloadedAudioMap = Record<string, DownloadedAudioItem>;

export function toFileUrl(localPath: string) {
  return localPath.startsWith('file://') ? localPath : `file://${localPath}`;
}

export async function getDownloadedAudioMap() {
  return (
    (await getItem<DownloadedAudioMap>(StorageKeys.DOWNLOADED_AUDIOS)) ?? {}
  );
}

export async function getDownloadedAudioItems(
  source?: DownloadedAudioItem['source'],
) {
  const map = await getDownloadedAudioMap();

  return Object.values(map)
    .filter(item => (source ? item.source === source : true))
    .sort((a, b) => b.downloadedAt.localeCompare(a.downloadedAt));
}

export async function upsertDownloadedAudio(item: DownloadedAudioItem) {
  const map = await getDownloadedAudioMap();
  map[item.id] = item;
  await setItem(StorageKeys.DOWNLOADED_AUDIOS, map);
}
