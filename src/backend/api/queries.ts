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

type ChurchLocationApiItem = {
  id: number;
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
};

type ChurchLocationApiResponse = {
  success: boolean;
  data: ChurchLocationApiItem[];
};

export type ChurchLocationItem = {
  id: string;
  name: string;
  address: string;
  phone: string;
  map_url: string;
};

type DevotionalApiItem = {
  id: number;
  devotionDate: string;
  dayName: string;
  monthNumber: number;
  yearNumber: number;
  title: string;
  bibleReading: string;
  memoryVerse: string;
  body: string;
  furtherStudy: string;
  prayer: string;
  sections?: Record<string, string>;
  rawText?: string;
  coverImageUrl?: string | null;
};

type DevotionalTodayApiResponse = {
  success: boolean;
  data: DevotionalApiItem;
  message?: string;
};

export type DevotionalTodayItem = {
  id: string;
  devotion_date: string;
  day_name: string;
  month_number: number;
  year_number: number;
  title: string;
  bible_reading: string;
  memory_verse: string;
  body: string;
  further_study: string;
  prayer: string;
  sections: Record<string, string>;
  raw_text: string;
  thumbnail?: string;
};

type DevotionalMonthlyApiResponse = {
  success: boolean;
  data: DevotionalApiItem[];
  message?: string;
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

export const churchLocationsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.churchLocations,
    queryFn: async (): Promise<ChurchLocationItem[]> => {
      const res = await apiGet<ChurchLocationApiResponse>('/location/list');

      return [...(res.data ?? [])].reverse().map(item => ({
        id: String(item.id),
        name: item.name,
        address: item.address,
        phone: item.phone ?? '',
        map_url: item.mapUrl ?? '',
      }));
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

const mapDevotionalItem = (
  item: DevotionalApiItem,
): DevotionalTodayItem => ({
  id: String(item.id),
  devotion_date: item.devotionDate,
  day_name: item.dayName,
  month_number: item.monthNumber,
  year_number: item.yearNumber,
  title: item.title ?? '',
  bible_reading: item.bibleReading ?? '',
  memory_verse: item.memoryVerse ?? '',
  body: item.body ?? '',
  further_study: item.furtherStudy ?? '',
  prayer: item.prayer ?? '',
  sections: item.sections ?? {},
  raw_text: item.rawText ?? '',
  thumbnail: item.coverImageUrl ?? undefined,
});

export const devotionalTodayQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.devotionalToday,
    queryFn: async (): Promise<DevotionalTodayItem> => {
      const res = await apiGet<DevotionalTodayApiResponse>('/devotion/daily/today');

      return mapDevotionalItem(res.data);
    },
    staleTime: 1000 * 60 * 60 * 6,      // 6 hours — fresh all day
    gcTime: 1000 * 60 * 60 * 20,         // 20 hours — keeps presigned URLs alive
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

export const devotionalMonthlyQueryOptions = (year: number, month: number) =>
  queryOptions({
    queryKey: queryKeys.devotionalMonthly(year, month),
    queryFn: async (): Promise<DevotionalTodayItem[]> => {
      const res = await apiGet<DevotionalMonthlyApiResponse>(
        `/devotion/monthly/${year}/${month}`,
      );

      return (res.data ?? []).map(mapDevotionalItem);
    },
    staleTime: 1000 * 60 * 60 * 6,      // 6 hours
    gcTime: 1000 * 60 * 60 * 20,         // 20 hours — same presigned URL reused all day
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
  audioSizeBytes?: number;
  audioSizeLabel?: string;
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
  audio_size_bytes?: number;
  audio_size_label?: string;
};

type AudioSermonSearchParams = {
  query: string;
  page?: number;
  size?: number;
};

const DEFAULT_AUDIO_PAGE_SIZE = 20;
const DEFAULT_ONESOUND_PAGE_SIZE = 20;

const mapAudioSermonItem = (item: AudioSermonApiItem): AudioSermonItem => ({
  id: String(item.id),
  title: item.title,
  author: item.author,
  audio_url: item.audioUrl,
  thumbnail_url: item.thumbnailUrl,
  time_posted: item.timePosted,
  audio_size_bytes: item.audioSizeBytes,
  audio_size_label: item.audioSizeLabel,
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

type OneSoundApiItem = {
  id: number;
  title: string;
  artist: string;
  lyrics: string;
  audioUrl: string;
  coverUrl: string;
  createdAt: string;
};

type OneSoundApiResponse = {
  success: boolean;
  data: OneSoundApiItem[];
};

export type OneSoundItem = {
  id: string;
  title: string;
  artist: string;
  author: string;
  lyrics: string;
  audio_url: string;
  cover_url: string;
  created_at: string;
};

const mapOneSoundItem = (item: OneSoundApiItem): OneSoundItem => ({
  id: String(item.id),
  title: item.title,
  artist: item.artist,
  author: item.artist,
  lyrics: item.lyrics,
  audio_url: item.audioUrl,
  cover_url: item.coverUrl,
  created_at: item.createdAt,
});

const fetchOneSoundPage = async (
  page: number,
  size: number,
): Promise<OneSoundItem[]> => {
  const res = await apiGet<OneSoundApiResponse>(`/oneSound/files/${page}/${size}`);

  return res.data.map(mapOneSoundItem);
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

export const oneSoundQueryOptions = (size = DEFAULT_ONESOUND_PAGE_SIZE) =>
  queryOptions({
    queryKey: queryKeys.oneSound(size),
    queryFn: async (): Promise<OneSoundItem[]> => fetchOneSoundPage(1, size),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

export const oneSoundInfiniteQueryOptions = (
  size = DEFAULT_ONESOUND_PAGE_SIZE,
) =>
  infiniteQueryOptions({
    queryKey: queryKeys.oneSoundInfinite(size),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchOneSoundPage(pageParam, size),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < size ? undefined : allPages.length + 1,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

/**
 * Add any new API query options here so they are prefetched at startup.
 */
export const startupQueryOptions = [
  carouselQueryOptions,
  audioSermonQueryOptions,
  oneSoundQueryOptions,
  churchLocationsQueryOptions,
];
