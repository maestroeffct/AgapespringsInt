export type AudioQueueItem = {
  id: string;
  audioUrl: string;
  title?: string;
  author?: string;
  artwork?: string;
  lyrics?: string;
  source?: 'onesound' | 'livingwaters';
};

export type DevotionalDetailsItem = {
  id: string;
  title: string;
  author?: string;
  date?: string;
  thumbnail?: string;
  memoryVerse?: string;
  bibleReading?: string;
  body?: string;
  furtherStudy?: string;
  prayer?: string;
  sections?: Record<string, string>;
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
  DevotionalDetails: {
    item: DevotionalDetailsItem;
  };
  DevotionalByDate: {
    date?: string;
  };

  NotificationDetail: {
    title: string;
    message: string;
    imageUrl?: string;
    createdAt?: string;
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
    lyrics?: string;
    source?: 'onesound' | 'livingwaters';
    queue?: AudioQueueItem[];
    startIndex?: number;
  };

  VideoPlayer:
    | {
        videoId?: string;
        title?: string;
        source?: 'latest' | 'testimony' | 'broadcast';
      }
    | undefined;
};
