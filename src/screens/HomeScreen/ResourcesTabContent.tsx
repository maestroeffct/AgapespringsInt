import React, { memo, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const RESOURCES_SOURCE = {uri: 'https://www.agapespringsint.com/resources'};

export const ResourcesTabContent = memo(function ResourcesTabContent() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <ActivityIndicator />
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
      />
    </View>
  );
});
