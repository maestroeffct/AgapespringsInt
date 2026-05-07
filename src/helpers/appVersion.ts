import { Platform } from 'react-native';

// Keep these in sync with:
// iOS: ios/AgapespringsInt.xcodeproj/project.pbxproj → MARKETING_VERSION
// Android: android/app/build.gradle → versionName
const APP_VERSION = {
  ios: '1.9.2',
  android: '1.7',
};

export async function getInstalledAppVersion() {
  return Platform.OS === 'ios' ? APP_VERSION.ios : APP_VERSION.android;
}

export async function getInstalledBuildNumber() {
  return '0';
}

function normalizeVersionPart(part: string) {
  const digits = part.replace(/\D+/g, '');
  return digits ? Number(digits) : 0;
}

export function compareVersions(
  currentVersion: string,
  minimumVersion: string,
) {
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
