export const queryKeys = {
  carousel: ['carousel'] as const,
  latestVideos: ['videos', 'latest'] as const,
  latestAudios: ['audios', 'latest'] as const,
  latestAudiosInfinite: (size: number) =>
    ['audios', 'latest', 'infinite', size] as const,
  audioSearch: (query: string, page: number, size: number) =>
    ['audios', 'search', query, page, size] as const,
  audioSearchInfinite: (query: string, size: number) =>
    ['audios', 'search', query, 'infinite', size] as const,
  testimonies: ['testimonies'] as const,
};
