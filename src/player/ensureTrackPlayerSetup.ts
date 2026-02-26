import TrackPlayer, { Capability } from 'react-native-track-player';

let setupDone = false;
let setupPromise: Promise<void> | null = null;

function isAlreadyInitializedError(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error ?? '');
  const lower = message.toLowerCase();

  return (
    lower.includes('already been initialized') ||
    lower.includes('already initialized')
  );
}

export async function ensureTrackPlayerSetup() {
  if (setupDone) return;
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      if (!isAlreadyInitializedError(error)) {
        throw error;
      }
    }

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });

    setupDone = true;
  })();

  try {
    await setupPromise;
  } finally {
    if (!setupDone) {
      setupPromise = null;
    }
  }
}
