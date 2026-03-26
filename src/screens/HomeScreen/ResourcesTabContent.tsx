import React, { memo, useMemo, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../theme/ThemeProvider';
import { createStyles } from './resourcesStyles';

const RESOURCES_SOURCE = {uri: 'https://www.agapespringsint.com/resources'};

export const ResourcesTabContent = memo(function ResourcesTabContent() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      <WebView
        ref={webRef}
        source={RESOURCES_SOURCE}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
      />
    </View>
  );
});
