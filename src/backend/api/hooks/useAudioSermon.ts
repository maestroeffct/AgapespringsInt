import { useQuery } from '@tanstack/react-query';

import { audioSermonQueryOptions } from '../queries';

export { type AudioSermonItem } from '../queries';

export function useAudioSermon() {
  return useQuery(audioSermonQueryOptions());
}
