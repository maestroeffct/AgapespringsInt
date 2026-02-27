import { useQuery } from '@tanstack/react-query';

import { churchLocationsQueryOptions } from '../queries';

export { type ChurchLocationItem } from '../queries';

export function useChurchLocations() {
  return useQuery(churchLocationsQueryOptions());
}
