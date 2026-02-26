import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { apiGet } from './client';
import { queryKeys } from './keys';

type CarouselApiItem = {
  id: number;
  url: string;
  s3Key: string;
};

type CarouselApiResponse = {
  data: CarouselApiItem[];
};

export type CarouselItem = {
  id: string;
  file_path: string;
};

export const carouselQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.carousel,
    queryFn: async (): Promise<CarouselItem[]> => {
      const res = await apiGet<CarouselApiResponse>('/carousel/files');

      return res.data.map(item => ({
        id: String(item.id),
        file_path: item.url,
      }));
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

type AudioSermonApiItem = {
  id: number;
  title: string;
  author: string;
  audioUrl: string;
  thumbnailUrl: string;
  timePosted: string;
};

type AudioSermonApiResponse = {
  success: boolean;
  data: AudioSermonApiItem[];
};

export type AudioSermonItem = {
  id: string;
  title: string;
  author: string;
  audio_url: string;
  thumbnail_url: string;
  time_posted: string;
};

type AudioSermonSearchParams = {
  query: string;
  page?: number;
  size?: number;
};

const DEFAULT_AUDIO_PAGE_SIZE = 20;

const mapAudioSermonItem = (item: AudioSermonApiItem): AudioSermonItem => ({
  id: String(item.id),
  title: item.title,
  author: item.author,
  audio_url: item.audioUrl,
  thumbnail_url: item.thumbnailUrl,
  time_posted: item.timePosted,
});

const fetchAudioSermonPage = async (
  page: number,
): Promise<AudioSermonItem[]> => {
  const res = await apiGet<AudioSermonApiResponse>(
    `/admin/audioSermon/files/${page}`,
  );

  return res.data.map(mapAudioSermonItem);
};

const fetchAudioSermonSearchPage = async (
  query: string,
  page: number,
  size: number,
): Promise<AudioSermonItem[]> => {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `/audioSermon/search/${encodedQuery}/${page}/${size}`;
  const res = await apiGet<AudioSermonApiResponse>(endpoint);

  return res.data.map(mapAudioSermonItem);
};

export const audioSermonQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.latestAudios,
    queryFn: async (): Promise<AudioSermonItem[]> => {
      return fetchAudioSermonPage(1);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

export const audioSermonInfiniteQueryOptions = (
  size = DEFAULT_AUDIO_PAGE_SIZE,
) =>
  infiniteQueryOptions({
    queryKey: queryKeys.latestAudiosInfinite(size),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchAudioSermonPage(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length + 1,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

export const audioSermonSearchQueryOptions = ({
  query,
  page = 1,
  size = DEFAULT_AUDIO_PAGE_SIZE,
}: AudioSermonSearchParams) => {
  const trimmedQuery = query.trim();

  return queryOptions({
    queryKey: queryKeys.audioSearch(trimmedQuery, page, size),
    queryFn: () => fetchAudioSermonSearchPage(trimmedQuery, page, size),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const audioSermonSearchInfiniteQueryOptions = ({
  query,
  size = DEFAULT_AUDIO_PAGE_SIZE,
}: Omit<AudioSermonSearchParams, 'page'>) => {
  const trimmedQuery = query.trim();

  return infiniteQueryOptions({
    queryKey: queryKeys.audioSearchInfinite(trimmedQuery, size),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchAudioSermonSearchPage(trimmedQuery, pageParam, size),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < size ? undefined : allPages.length + 1,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

/**
 * Add any new API query options here so they are prefetched at startup.
 */
export const startupQueryOptions = [
  carouselQueryOptions,
  audioSermonQueryOptions,
];
