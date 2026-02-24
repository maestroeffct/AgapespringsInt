import { useQuery } from '@tanstack/react-query';

import { audioSermonSearchQueryOptions } from '../queries';

export { type AudioSermonItem } from '../queries';

export function useAudioSermonSearch(query: string, page = 1, size = 20) {
  const trimmedQuery = query.trim();

  return useQuery({
    ...audioSermonSearchQueryOptions({ query: trimmedQuery, page, size }),
    enabled: trimmedQuery.length > 0,
  });
}
