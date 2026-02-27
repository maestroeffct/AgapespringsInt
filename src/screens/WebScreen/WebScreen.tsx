import React, { useMemo, useRef, useState } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../theme/ThemeProvider';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  route: { params?: { title?: string; url: string } };
  navigation: any;
};

export default function WebScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const exitingRef = useRef(false);

  const title = route?.params?.title ?? 'Web';
  const url = route?.params?.url ?? 'https://www.agapespringsint.com';
  const webSource = useMemo(() => ({uri: url}), [url]);

  useFocusEffect(
    React.useCallback(() => {
      exitingRef.current = false;
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }, [opacity]),
  );

  React.useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e: any) => {
      if (exitingRef.current) return;

      e.preventDefault();
      exitingRef.current = true;
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start(() => {
        navigation.dispatch(e.data.action);
      });
    });

    return unsub;
  }, [navigation, opacity]);

  return (
    <ScreenWrapper padded={false}>
      <Animated.View style={{flex: 1, opacity}}>
        <AppHeader
          title={title}
          showLogo={false}
          leftType="back"
          onLeftPress={() => navigation.goBack()}
        />

        <View style={{flex: 1, backgroundColor: theme.colors.background}}>
          <WebView
            ref={webRef}
            source={webSource}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState
            cacheEnabled
            cacheMode="LOAD_DEFAULT"
            javaScriptEnabled
            domStorageEnabled
            allowsBackForwardNavigationGestures
            style={{flex: 1}}
          />

          {loading ? (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null}
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
}
