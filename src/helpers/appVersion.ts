import { NativeModules, Platform } from 'react-native';

type AppInfoModule = {
  getVersion?: () => Promise<string>;
  getBuildNumber?: () => Promise<string>;
};

const nativeAppInfo = NativeModules.AppInfo as AppInfoModule | undefined;

export async function getInstalledAppVersion() {
  const fallbackVersion = Platform.OS === 'ios' ? '1.7' : '1.0';

  try {
    const version = await nativeAppInfo?.getVersion?.();
    return version?.trim() || fallbackVersion;
  } catch {
    return fallbackVersion;
  }
}

export async function getInstalledBuildNumber() {
  try {
    return (await nativeAppInfo?.getBuildNumber?.())?.trim() || '0';
  } catch {
    return '0';
  }
}

function normalizeVersionPart(part: string) {
  const digits = part.replace(/\D+/g, '');
  return digits ? Number(digits) : 0;
}

export function compareVersions(currentVersion: string, minimumVersion: string) {
  const currentParts = currentVersion.split('.');
  const minimumParts = minimumVersion.split('.');
  const length = Math.max(currentParts.length, minimumParts.length);

  for (let index = 0; index < length; index += 1) {
    const current = normalizeVersionPart(currentParts[index] ?? '0');
    const minimum = normalizeVersionPart(minimumParts[index] ?? '0');

    if (current > minimum) {
      return 1;
    }

    if (current < minimum) {
      return -1;
    }
  }

  return 0;
}
