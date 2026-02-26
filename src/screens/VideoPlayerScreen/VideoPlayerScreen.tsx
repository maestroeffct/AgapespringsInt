import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
// import { AppHeader } from '../../components/AppHeader/AppHeader';

type Props = {
  route: any;
  navigation: any;
};

export default function VideoPlayerScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const routeVideoId: string | undefined = route?.params?.videoId;
  const routeTitle: string | undefined = route?.params?.title;

  const [playing, setPlaying] = useState(true);

  const { data, isLoading } = useGetTestimonyVideosQuery({ maxResults: 50 });
  const items = useMemo(() => data?.items ?? [], [data]);
  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;
  const fallbackVideoId = useMemo(
    () => items.map(getVideoId).find(Boolean) as string | undefined,
    [items],
  );
  const selectedVideoId = routeVideoId ?? fallbackVideoId;

  const playerHeight = useMemo(
    () => Math.max(220, Math.round((windowWidth * 9) / 16)),
    [windowWidth],
  );

  const current = useMemo(() => {
    if (!selectedVideoId) return null;
    return items.find((it: any) => getVideoId(it) === selectedVideoId) ?? null;
  }, [items, selectedVideoId]);

  const currentTitle = current?.snippet?.title ?? routeTitle ?? 'Video';

  const related = useMemo(() => {
    return items.filter(
      (it: any) => getVideoId(it) && getVideoId(it) !== selectedVideoId,
    );
  }, [items, selectedVideoId]);

  return (
    <ScreenWrapper padded={false}>
      {/* <AppHeader showLogo onLeftPress={() => navigation.openDrawer()} /> */}
      <View style={styles.container}>
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

          <View style={styles.rightSpacer} />
        </View>

        <View style={[styles.playerWrap, { height: playerHeight }]}>
          {selectedVideoId ? (
            <YoutubePlayer
              height={playerHeight}
              play={playing}
              videoId={selectedVideoId}
              initialPlayerParams={{
                controls: true,
                rel: false,
                modestbranding: true,
                playsinline: true,
              }}
              webViewStyle={styles.playerWebview}
            />
          ) : (
            <View style={styles.playerPlaceholder}>
              <AppText style={styles.placeholderText}>
                No video selected
              </AppText>
            </View>
          )}
        </View>

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

        <FlatList
          data={isLoading ? [] : related}
          keyExtractor={(item: any, index) =>
            getVideoId(item) ?? `row-${index}`
          }
          contentContainerStyle={styles.relatedContent}
          renderItem={({ item }) => {
            const videoId = getVideoId(item);
            const thumb =
              item?.snippet?.thumbnails?.high?.url ??
              item?.snippet?.thumbnails?.medium?.url ??
              item?.snippet?.thumbnails?.default?.url;

            const dateText = item?.snippet?.publishedAt
              ? new Date(item.snippet.publishedAt).toDateString()
              : undefined;

            return (
              <View style={styles.relatedRow}>
                <VideoCard
                  layout="horizontal"
                  full
                  title={item?.snippet?.title}
                  date={dateText}
                  thumbnail={thumb}
                  onPress={() =>
                    navigation.replace('VideoPlayer', {
                      videoId,
                      title: item?.snippet?.title,
                    })
                  }
                />
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // root: { flex: 1 },

  container: {
    paddingTop: 50,
  },

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
    backgroundColor: '#000',
  },
  playerWebview: {
    flex: 1,
  },
  playerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#fff',
  },
  rightSpacer: {
    width: 36,
  },
  relatedContent: {
    paddingBottom: 300,
  },
  relatedRow: {
    paddingHorizontal: 14,
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
