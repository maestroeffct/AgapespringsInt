import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = 'AIzaSyBxHACG4JGurUzoHPSLQgUv0NZTj-k-VQQ'; // ideally not in app (proxy it)
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';

// Replace with your real IDs
export const YT = {
  sermonPlaylistId: 'PLr5e61cKjvGwgdVXrOCR2rONZaEpCRLHl',
  testimonyPlaylistId: 'PLY4ek2J_EXar8qISmjtcB-dyVz3YF7SqX',
  channelId: 'UCLaOIZ7aOxWqIHdhWu8AIlw',
};

type PlaylistFeedArgs = {
  playlistId: string;
  maxResults?: number;
  pageToken?: string;
};

type VideoDetailsArgs = {
  ids: string[]; // up to 50 per request
};

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    // 1) Generic playlist feed
    getPlaylistFeed: builder.query<any, PlaylistFeedArgs>({
      query: ({ playlistId, maxResults = 20, pageToken }) => {
        let url =
          `playlistItems?part=snippet&maxResults=${maxResults}` +
          `&playlistId=${playlistId}&key=${API_KEY}`;

        if (pageToken) url += `&pageToken=${pageToken}`;
        return url;
      },
    }),

    // 2) Fetch details for multiple videos (duration, stats)
    getVideoDetails: builder.query<any, VideoDetailsArgs>({
      query: ({ ids }) => {
        const joined = ids.join(',');
        return `videos?part=snippet,contentDetails,statistics&id=${joined}&key=${API_KEY}`;
      },
    }),

    // 3) Latest videos from channel — uses uploads playlist (1 quota unit vs 100 for search)
    getLatestFromChannel: builder.query<
      any,
      { maxResults?: number; pageToken?: string }
    >({
      query: ({ maxResults = 10, pageToken }) => {
        // Uploads playlist ID = channel ID with UC→UU prefix swap
        const uploadsPlaylistId = 'UU' + YT.channelId.slice(2);
        let url =
          `playlistItems?part=snippet&maxResults=${maxResults}` +
          `&playlistId=${uploadsPlaylistId}&key=${API_KEY}`;
        if (pageToken) url += `&pageToken=${pageToken}`;
        return url;
      },
    }),

    // Live stream status is served from our backend cache (free — no quota cost)
    // The backend scheduler checks YouTube every 15 min and caches the result
    getActiveLiveStream: builder.query<any, void>({
      queryFn: async () => {
        try {
          const res = await fetch(
            'https://api.agapespringsint.com/live-stream/status',
          );
          const json = await res.json();
          const d = json?.data;
          if (!d?.isLive) return { data: { items: [] } };
          return {
            data: {
              items: [
                {
                  id: { videoId: d.videoId },
                  snippet: { title: d.title },
                },
              ],
            },
          };
        } catch {
          return { data: { items: [] } };
        }
      },
    }),

    // Convenience wrappers (nice for home sections)
    getSermonVideos: builder.query<
      any,
      { maxResults?: number; pageToken?: string }
    >({
      queryFn: async (args, api, _extra, baseQuery) => {
        const res = await baseQuery(
          `playlistItems?part=snippet&maxResults=${args?.maxResults ?? 20}` +
            `&playlistId=${YT.sermonPlaylistId}&key=${API_KEY}` +
            (args?.pageToken ? `&pageToken=${args.pageToken}` : ''),
        );
        return res as any;
      },
    }),

    getTestimonyVideos: builder.query<
      any,
      { maxResults?: number; pageToken?: string }
    >({
      queryFn: async (args, api, _extra, baseQuery) => {
        const res = await baseQuery(
          `playlistItems?part=snippet&maxResults=${args?.maxResults ?? 20}` +
            `&playlistId=${YT.testimonyPlaylistId}&key=${API_KEY}` +
            (args?.pageToken ? `&pageToken=${args.pageToken}` : ''),
        );
        return res as any;
      },
    }),

    getVideoComments: builder.query<
      any,
      { videoId: string; maxResults?: number; pageToken?: string }
    >({
      query: ({ videoId, maxResults = 30, pageToken }) => {
        let url =
          `commentThreads?part=snippet&videoId=${videoId}` +
          `&maxResults=${maxResults}&order=relevance&key=${API_KEY}`;
        if (pageToken) url += `&pageToken=${pageToken}`;
        return url;
      },
    }),
  }),
});

export const {
  useGetPlaylistFeedQuery,
  useGetVideoDetailsQuery,
  useGetActiveLiveStreamQuery,
  useGetLatestFromChannelQuery,
  useGetSermonVideosQuery,
  useGetTestimonyVideosQuery,
  useGetVideoCommentsQuery,
} = youtubeApi;
