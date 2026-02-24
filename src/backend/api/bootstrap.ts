import {
  dehydrate,
  hydrate,
  type DehydratedState,
  type QueryClient,
} from '@tanstack/react-query';

import { getItem, setItem, StorageKeys } from '@/helpers/storage';

import { startupQueryOptions } from './queries';

const STARTUP_PREFETCH_TIMEOUT_MS = 8000;
const CACHE_PERSIST_DEBOUNCE_MS = 1000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>(resolve => {
      setTimeout(() => resolve(null), timeoutMs);
    }),
  ]);
}

async function persistQueryCache(queryClient: QueryClient): Promise<void> {
  const dehydrated = dehydrate(queryClient, {
    shouldDehydrateQuery: query => query.state.status === 'success',
  });

  await setItem(StorageKeys.QUERY_CACHE, dehydrated);
}

export async function restoreQueryCache(queryClient: QueryClient): Promise<void> {
  const dehydrated = await getItem<DehydratedState>(StorageKeys.QUERY_CACHE);
  if (!dehydrated) return;

  hydrate(queryClient, dehydrated);
}

export async function prefetchStartupQueries(
  queryClient: QueryClient,
): Promise<void> {
  const prefetchTask = Promise.allSettled(
    startupQueryOptions.map(buildQuery => queryClient.prefetchQuery(buildQuery() as any)),
  );

  await withTimeout(prefetchTask, STARTUP_PREFETCH_TIMEOUT_MS);
  await persistQueryCache(queryClient);
}

export function startQueryCachePersistence(queryClient: QueryClient): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const unsubscribe = queryClient.getQueryCache().subscribe(event => {
    if (!event || event.type !== 'updated' || !event.query) return;
    if (event.query.state.status !== 'success') return;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      persistQueryCache(queryClient).catch(error => {
        console.warn('[Bootstrap] Failed to persist query cache:', error);
      });
      timer = null;
    }, CACHE_PERSIST_DEBOUNCE_MS);
  });

  return () => {
    if (timer) {
      clearTimeout(timer);
    }

    unsubscribe();
  };
}
