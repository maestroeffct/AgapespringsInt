/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';

import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/player/playbackService';
import { handleBackgroundRemoteMessage } from './src/notifications/listeners';

TrackPlayer.registerPlaybackService(() => playbackService);

messaging().setBackgroundMessageHandler(handleBackgroundRemoteMessage);
notifee.onBackgroundEvent(async () => {});

AppRegistry.registerComponent(appName, () => App);
