import { useQuery } from '@tanstack/react-query';

import { carouselQueryOptions } from '../queries';

export { type CarouselItem } from '../queries';

export function useCarousel() {
  return useQuery(carouselQueryOptions());
}
