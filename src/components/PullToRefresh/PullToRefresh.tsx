import React, { useState } from 'react';
import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

type PullToRefreshProps = ScrollViewProps & {
  onRefresh: () => Promise<void> | void;
  refreshing?: boolean;
};

export function PullToRefresh({
  children,
  onRefresh,
  refreshing: refreshingProp,
  ...rest
}: PullToRefreshProps) {
  const { theme } = useTheme();
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const refreshing =
    refreshingProp !== undefined ? refreshingProp : internalRefreshing;

  const handleRefresh = async () => {
    if (refreshingProp === undefined) {
      setInternalRefreshing(true);
    }

    try {
      await onRefresh();
    } finally {
      if (refreshingProp === undefined) {
        setInternalRefreshing(false);
      }
    }
  };

  return (
    <ScrollView
      {...rest}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary} // iOS spinner
          colors={[theme.colors.primary]} // Android spinner
          progressBackgroundColor={theme.colors.background}
        />
      }
    >
      {children}
    </ScrollView>
  );
}
