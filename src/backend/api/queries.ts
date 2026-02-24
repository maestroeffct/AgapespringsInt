import { queryOptions } from '@tanstack/react-query';

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

export const audioSermonQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.latestAudios,
    queryFn: async (): Promise<AudioSermonItem[]> => {
      const res = await apiGet<AudioSermonApiResponse>(
        '/admin/audioSermon/files/1',
      );

      return res.data.map(item => ({
        id: String(item.id),
        title: item.title,
        author: item.author,
        audio_url: item.audioUrl,
        thumbnail_url: item.thumbnailUrl,
        time_posted: item.timePosted,
      }));
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

export const audioSermonSearchQueryOptions = ({
  query,
  page = 1,
  size = 20,
}: AudioSermonSearchParams) => {
  const trimmedQuery = query.trim();

  return queryOptions({
    queryKey: queryKeys.audioSearch(trimmedQuery, page, size),
    queryFn: async (): Promise<AudioSermonItem[]> => {
      const encodedQuery = encodeURIComponent(trimmedQuery);
      const endpoint = `/audioSermon/search/${encodedQuery}/${page}/${size}`;
      const res = await apiGet<AudioSermonApiResponse>(endpoint);

      return res.data.map(item => ({
        id: String(item.id),
        title: item.title,
        author: item.author,
        audio_url: item.audioUrl,
        thumbnail_url: item.thumbnailUrl,
        time_posted: item.timePosted,
      }));
    },
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
