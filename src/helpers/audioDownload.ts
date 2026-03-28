import RNFS from 'react-native-fs';

import { upsertDownloadedAudio } from './downloadedAudio';

type DownloadAudioParams = {
  id: string;
  title: string;
  author: string;
  artwork?: string;
  audioUrl: string;
  source: 'onesound' | 'livingwaters';
};

function safeFilename(name: string) {
  return name.replace(/[/?%*:|"<>\\]/g, '-').trim();
}

export async function downloadAudioToAppStorage({
  id,
  title,
  author,
  artwork,
  audioUrl,
  source,
}: DownloadAudioParams) {
  const fileName = safeFilename(`${title || 'audio'}.mp3`);
  const dir = `${RNFS.DocumentDirectoryPath}/downloads`;
  const path = `${dir}/${fileName}`;

  const existsDir = await RNFS.exists(dir);
  if (!existsDir) {
    await RNFS.mkdir(dir);
  }

  const exists = await RNFS.exists(path);
  if (exists) {
    await upsertDownloadedAudio({
      id,
      title,
      author,
      artwork,
      localPath: path,
      source,
      downloadedAt: new Date().toISOString(),
    });

    return {
      path,
      alreadyExisted: true,
    };
  }

  const task = RNFS.downloadFile({
    fromUrl: audioUrl,
    toFile: path,
  });

  const res = await task.promise;

  if (res.statusCode !== 200) {
    throw new Error(`Status: ${res.statusCode}`);
  }

  await upsertDownloadedAudio({
    id,
    title,
    author,
    artwork,
    localPath: path,
    source,
    downloadedAt: new Date().toISOString(),
  });

  return {
    path,
    alreadyExisted: false,
  };
}
