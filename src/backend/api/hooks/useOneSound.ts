import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { oneSoundInfiniteQueryOptions, oneSoundQueryOptions } from '../queries';

export { type OneSoundItem } from '../queries';

export function useOneSound(size?: number) {
  return useQuery(oneSoundQueryOptions(size));
}

export function useInfiniteOneSound(size?: number) {
  return useInfiniteQuery(oneSoundInfiniteQueryOptions(size));
}
