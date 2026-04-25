import React, { useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';

import { AppText } from '../../components/AppText/AppText';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import {
  useGetLatestFromChannelQuery,
  useGetSermonVideosQuery,
  useGetTestimonyVideosQuery,
  useGetVideoCommentsQuery,
} from '../../backend/api/youtube';
import { ScreenWrapper } from '../../components/Screenwrapper/Screenwrapper';
import { AppHeader } from '../../components/AppHeader/AppHeader';

type Props = {
  route: any;
  navigation: any;
};

type Tab = 'related' | 'comments';

export default function VideoPlayerScreen({ route, navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const routeVideoId: string | undefined = route?.params?.videoId;
  const routeTitle: string | undefined = route?.params?.title;
  const routeSource: 'latest' | 'testimony' | 'broadcast' | 'live' | undefined =
    route?.params?.source;

  const [playing, setPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('related');

  const { data: latestData, isLoading: latestLoading } =
    useGetLatestFromChannelQuery({ maxResults: 50 });
  const { data: testimonyData, isLoading: testimonyLoading } =
    useGetTestimonyVideosQuery({ maxResults: 50 });
  const { data: broadcastData, isLoading: broadcastLoading } =
    useGetSermonVideosQuery({ maxResults: 50 });

  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const items = useMemo(() => {
    if (routeSource === 'testimony') return testimonyData?.items ?? [];
    if (routeSource === 'broadcast') return broadcastData?.items ?? [];
    return latestData?.items ?? [];
  }, [broadcastData?.items, latestData?.items, routeSource, testimonyData?.items]);

  const isLoading = useMemo(() => {
    if (routeSource === 'testimony') return testimonyLoading;
    if (routeSource === 'broadcast') return broadcastLoading;
    return latestLoading;
  }, [broadcastLoading, latestLoading, routeSource, testimonyLoading]);

  const fallbackVideoId = useMemo(
    () => items.map(getVideoId).find(Boolean) as string | undefined,
    [items],
  );
  const selectedVideoId = routeVideoId ?? fallbackVideoId;

  const playerHeight = useMemo(
    () => Math.round((windowWidth * 9) / 16),
    [windowWidth],
  );

  const current = useMemo(() => {
    if (!selectedVideoId) return null;
    return items.find((it: any) => getVideoId(it) === selectedVideoId) ?? null;
  }, [items, selectedVideoId]);

  const currentTitle = current?.snippet?.title ?? routeTitle ?? 'Video';

  const related = useMemo(
    () => items.filter((it: any) => getVideoId(it) && getVideoId(it) !== selectedVideoId),
    [items, selectedVideoId],
  );

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useGetVideoCommentsQuery(
    { videoId: selectedVideoId ?? '', maxResults: 30 },
    { skip: !selectedVideoId || activeTab !== 'comments' },
  );

  const comments: any[] = commentsData?.items ?? [];

  const textColor = isDark ? theme.colors.textPrimary : '#000000';
  const subColor = theme.colors.textSecondary;
  const borderColor = theme.colors.border;

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        showLogo={false}
        title={currentTitle.length > 30 ? currentTitle.slice(0, 30).trimEnd() + '…' : currentTitle}
        leftType="back"
        onLeftPress={() => navigation.goBack()}
        rightType="none"
      />
      <View style={styles.container}>
        {/* Player */}
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
              <AppText style={styles.placeholderText}>No video selected</AppText>
            </View>
          )}
        </View>

        {/* Title row */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setPlaying(p => !p)}
          style={styles.titleRow}
        >
          <AppText style={[styles.videoTitle, { color: textColor }]} numberOfLines={2}>
            {currentTitle}
          </AppText>
          <Ionicons name="chevron-down" size={18} color={subColor} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* Tab switcher */}
        <View style={[styles.tabBar, { borderBottomColor: borderColor }]}>
          {(['related', 'comments'] as Tab[]).map(tab => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, active && { borderBottomColor: theme.colors.primary }, active && styles.tabActive]}
              >
                <AppText
                  style={[
                    styles.tabLabel,
                    { color: active ? theme.colors.primary : subColor },
                  ]}
                >
                  {tab === 'related' ? 'Related' : 'Comments'}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Related tab */}
        {activeTab === 'related' && (
          <FlatList
            data={isLoading ? [] : related}
            keyExtractor={(item: any, index) => getVideoId(item) ?? `row-${index}`}
            contentContainerStyle={styles.listContent}
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
                    imageHeight={130}
                    title={item?.snippet?.title}
                    date={dateText}
                    thumbnail={thumb}
                    onPress={() =>
                      navigation.replace('VideoPlayer', {
                        videoId,
                        title: item?.snippet?.title,
                        source: routeSource,
                      })
                    }
                  />
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Comments tab */}
        {activeTab === 'comments' && (
          commentsLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : commentsError ? (
            <View style={styles.centerState}>
              <Ionicons name="chatbubble-outline" size={36} color={subColor} />
              <AppText style={[styles.stateText, { color: subColor }]}>
                Comments are disabled for this video.
              </AppText>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.centerState}>
              <AppText style={[styles.stateText, { color: subColor }]}>No comments yet.</AppText>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item: any) => item?.id ?? Math.random().toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const snippet = item?.snippet?.topLevelComment?.snippet;
                const avatar = snippet?.authorProfileImageUrl;
                const author = snippet?.authorDisplayName ?? 'Anonymous';
                const text = snippet?.textDisplay ?? '';
                const likes: number = snippet?.likeCount ?? 0;
                const date = snippet?.publishedAt
                  ? new Date(snippet.publishedAt).toLocaleDateString()
                  : '';
                return (
                  <View style={[styles.commentRow, { borderBottomColor: borderColor }]}>
                    {avatar ? (
                      <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: theme.colors.primary + '33' }]}>
                        <AppText style={[styles.avatarInitial, { color: theme.colors.primary }]}>
                          {author.charAt(0).toUpperCase()}
                        </AppText>
                      </View>
                    )}
                    <View style={styles.commentBody}>
                      <View style={styles.commentMeta}>
                        <AppText style={[styles.commentAuthor, { color: textColor }]}>
                          {author}
                        </AppText>
                        <AppText style={[styles.commentDate, { color: subColor }]}>
                          {date}
                        </AppText>
                      </View>
                      <AppText style={[styles.commentText, { color: textColor }]}>
                        {text}
                      </AppText>
                      {likes > 0 && (
                        <View style={styles.likeRow}>
                          <Ionicons name="thumbs-up-outline" size={12} color={subColor} />
                          <AppText style={[styles.likeCount, { color: subColor }]}>{likes}</AppText>
                        </View>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          )
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  playerWrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  playerWebview: { flex: 1 },
  playerPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#fff' },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  videoTitle: { flex: 1, fontSize: 15, fontWeight: '600' },

  divider: { height: 1, width: '100%' },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabLabel: { fontSize: 13, fontWeight: '600' },

  listContent: { paddingBottom: 40 },
  relatedRow: { paddingHorizontal: 14 },

  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 60,
  },
  stateText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },

  commentRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginTop: 2,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 15, fontWeight: '700' },
  commentBody: { flex: 1, gap: 4 },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentAuthor: { fontSize: 13, fontWeight: '600' },
  commentDate: { fontSize: 11 },
  commentText: { fontSize: 13, lineHeight: 19 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  likeCount: { fontSize: 11 },
});
