import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { WebView } from 'react-native-webview';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';

// ✅ change this to the right hook:
// - Sermons: useGetVideosQuery
// - Testimony: useGetTestimonyVideosQuery
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';

type Props = {
  route: any;
  navigation: any;
};

export default function VideoPlayerScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const routeVideoId: string | undefined = route?.params?.videoId;

  const [playing, setPlaying] = useState(true);

  // Pull list so we can show “related” (same playlist)
  const { data, isLoading } = useGetTestimonyVideosQuery({ maxResults: 50 });
  const items = data?.items ?? [];
  const fallbackVideoId = items[0]?.snippet?.resourceId?.videoId as
    | string
    | undefined;
  const selectedVideoId = routeVideoId ?? fallbackVideoId;

  const playerHeight = useMemo(
    () => Math.max(220, Math.round((windowWidth * 9) / 16)),
    [windowWidth],
  );

  const current = useMemo(() => {
    if (!selectedVideoId) return null;
    return (
      items.find(
        (it: any) => it?.snippet?.resourceId?.videoId === selectedVideoId,
      ) ?? null
    );
  }, [items, selectedVideoId]);

  const currentTitle =
    current?.snippet?.title ?? route?.params?.title ?? 'Video';

  const embedUrl = useMemo(() => {
    if (!selectedVideoId) return null;
    // autoplay=1 only when playing=true
    return `https://www.youtube.com/embed/${selectedVideoId}?autoplay=${
      playing ? 1 : 0
    }&playsinline=1&controls=1&modestbranding=1&rel=0`;
  }, [selectedVideoId, playing]);

  const related = useMemo(() => {
    return items.filter(
      (it: any) =>
        it?.snippet?.resourceId?.videoId &&
        it?.snippet?.resourceId?.videoId !== selectedVideoId,
    );
  }, [items, selectedVideoId]);

  return (
    <ScreenWrapper padded={false}>
      <AppHeader showLogo onLeftPress={() => navigation.openDrawer()} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topIconBtn}
          activeOpacity={0.85}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <AppText
          style={[styles.topTitle, { color: theme.colors.textPrimary }]}
          numberOfLines={1}
        >
          {currentTitle}
        </AppText>

        <View style={{ width: 36 }} />
      </View>

      {/* Player */}
      <View
        style={[styles.playerWrap, { backgroundColor: '#000', height: playerHeight }]}
      >
        {embedUrl ? (
          <WebView
            source={{ uri: embedUrl }}
            style={styles.playerWebview}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState
          />
        ) : (
          <View style={styles.playerPlaceholder}>
            <AppText style={{ color: '#fff' }}>No video selected</AppText>
          </View>
        )}
      </View>

      {/* Title row (like screenshot, with dropdown arrow) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setPlaying(p => !p)}
        style={styles.titleRow}
      >
        <AppText
          style={[styles.videoTitle, { color: theme.colors.textPrimary }]}
          numberOfLines={2}
        >
          {currentTitle}
        </AppText>

        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      <View
        style={[styles.divider, { backgroundColor: theme.colors.border }]}
      />

      {/* Related list */}
      <FlatList
        data={isLoading ? [] : related}
        keyExtractor={(item: any, index) =>
          item?.snippet?.resourceId?.videoId ?? `row-${index}`
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const videoId = item?.snippet?.resourceId?.videoId;
          const thumb =
            item?.snippet?.thumbnails?.high?.url ??
            item?.snippet?.thumbnails?.medium?.url ??
            item?.snippet?.thumbnails?.default?.url;

          const dateText = item?.snippet?.publishedAt
            ? new Date(item.snippet.publishedAt).toDateString()
            : undefined;

          return (
            <View style={{ paddingHorizontal: 14 }}>
              <VideoCard
                layout="horizontal"
                full
                title={item?.snippet?.title}
                date={dateText} // ✅ we’ll add this prop below
                thumbnail={thumb}
                onPress={() => navigation.replace('VideoPlayer', { videoId })}
              />
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // root: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  topIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },

  playerWrap: {
    width: '100%',
    overflow: 'hidden',
  },
  playerWebview: {
    flex: 1,
  },
  playerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  videoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    width: '100%',
  },
});
