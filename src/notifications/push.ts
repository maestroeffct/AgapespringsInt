import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../backend/api/client';

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

export async function registerPushToken(token: string) {
  const response = await fetch(`${API_BASE_URL}/notifications/registerToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      platform: Platform.OS,
      provider: 'fcm',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to register push token');
  }

  return response.json();
}
