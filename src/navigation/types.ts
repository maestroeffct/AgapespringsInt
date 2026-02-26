export type AudioQueueItem = {
  id: string;
  audioUrl: string;
  title?: string;
  author?: string;
  artwork?: string;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Notifications: undefined;

  VideoList: undefined;
  AudioList: undefined;
  TestimonyList: undefined;

  AudioPlayer: {
    id?: string;
    audioUrl?: string;
    title?: string;
    author?: string;
    artwork?: string;
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
