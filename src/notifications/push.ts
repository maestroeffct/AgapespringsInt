import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export async function requestPushPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export async function getFcmToken(): Promise<string | null> {
  // iOS needs APNs token before FCM token sometimes
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
  }

  const token = await messaging().getToken();
  return token ?? null;
}

// optional: token refresh (send to backend again)
export function listenToTokenRefresh(onToken: (token: string) => void) {
  return messaging().onTokenRefresh(onToken);
}
