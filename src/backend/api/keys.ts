export const queryKeys = {
  carousel: ['carousel'] as const,
  latestVideos: ['videos', 'latest'] as const,
  latestAudios: ['audios', 'latest'] as const,
  audioSearch: (query: string, page: number, size: number) =>
    ['audios', 'search', query, page, size] as const,
  testimonies: ['testimonies'] as const,
};
