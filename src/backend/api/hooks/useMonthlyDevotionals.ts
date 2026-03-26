import { useQuery } from '@tanstack/react-query';

import { devotionalMonthlyQueryOptions } from '../queries';

export { type DevotionalTodayItem as DevotionalMonthlyItem } from '../queries';

export function useMonthlyDevotionals(year: number, month: number) {
  return useQuery(devotionalMonthlyQueryOptions(year, month));
}
