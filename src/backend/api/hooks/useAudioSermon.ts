import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  audioSermonInfiniteQueryOptions,
  audioSermonQueryOptions,
  audioSermonSearchInfiniteQueryOptions,
} from '../queries';

export { type AudioSermonItem } from '../queries';

export function useAudioSermon() {
  return useQuery(audioSermonQueryOptions());
}

export function useInfiniteAudioSermon(size?: number) {
  return useInfiniteQuery(audioSermonInfiniteQueryOptions(size));
}

export function useInfiniteAudioSermonSearch(query: string, size?: number) {
  const trimmedQuery = query.trim();

  return useInfiniteQuery({
    ...audioSermonSearchInfiniteQueryOptions({ query: trimmedQuery, size }),
    enabled: trimmedQuery.length > 0,
  });
}
