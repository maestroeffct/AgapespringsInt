import { useQuery } from '@tanstack/react-query';

import { devotionalTodayQueryOptions } from '../queries';

export { type DevotionalTodayItem } from '../queries';

export function useTodayDevotional() {
  return useQuery(devotionalTodayQueryOptions());
}
