export type AudioQueueItem = {
  id: string;
  audioUrl: string;
  title?: string;
  author?: string;
  artwork?: string;
  source?: 'onesound' | 'livingwaters';
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Notifications: undefined;
  UpdateRequired: {
    currentVersion: string;
    minimumVersion: string;
    storeUrl: string;
  };

  VideoList: undefined;
  AudioList: undefined;
  DownloadedAudioList:
    | {
        source?: 'onesound' | 'livingwaters';
        title?: string;
      }
    | undefined;
  TestimonyList: undefined;

  AudioPlayer: {
    id?: string;
    audioUrl?: string;
    title?: string;
    author?: string;
    artwork?: string;
    source?: 'onesound' | 'livingwaters';
    queue?: AudioQueueItem[];
    startIndex?: number;
  };

  VideoPlayer:
    | {
        videoId?: string;
        title?: string;
      }
    | undefined;
};
