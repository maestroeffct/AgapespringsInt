import { useCallback, useRef } from 'react';
import { ViewabilityConfig, ViewToken } from 'react-native';

type Callback = (keys: ReadonlySet<string>) => void;

export function useVisibleItems() {
  const visibleKeysRef = useRef<Set<string>>(new Set());
  const listenersRef = useRef<Set<Callback>>(new Set());

  const subscribe = useCallback((cb: Callback) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 15,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      visibleKeysRef.current = new Set(viewableItems.map(vi => String(vi.key)));
      listenersRef.current.forEach(cb => cb(visibleKeysRef.current));
    },
    [],
  );

  const isVisible = useCallback((key: string) => visibleKeysRef.current.has(key), []);

  return { subscribe, isVisible, onViewableItemsChanged, viewabilityConfig };
}
