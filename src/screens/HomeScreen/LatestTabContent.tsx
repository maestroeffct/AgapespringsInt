import React from 'react';
import { ScrollView } from 'react-native';

import { HeroCarousel } from '../../components/HeroCarousel/HeroCarousel';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { VideoCard } from '../../components/Cards/VideoCard/VideoCard';
import { AudioCard } from '../../components/Cards/AudioCard/AudioCard';
import { TestimonyCard } from '../../components/Cards/TestimonyCard.tsx/TestimonyCard';
import { useNavigation } from '@react-navigation/native';
import type { AudioQueueItem } from '../../navigation/types';

import { useGetTestimonyVideosQuery } from '../../backend/api/youtube';
import { useAudioSermon } from '../../backend/api/hooks/useAudioSermon';

const PLACEHOLDER_COUNT = 10;

export function LatestTabContent() {
  const navigation = useNavigation<any>();
  const getVideoId = (item: any): string | undefined =>
    item?.snippet?.resourceId?.videoId ??
    item?.contentDetails?.videoId ??
    item?.id?.videoId;

  const { data: videoData, isLoading: videosLoading } =
    useGetTestimonyVideosQuery({
      maxResults: 10,
    });

  const { data: testimonyData, isLoading: testimoniesLoading } =
    useGetTestimonyVideosQuery({ maxResults: 10 });

  const videoItems = videoData?.items ?? [];
  const testimonyItems = testimonyData?.items ?? [];

  const { data: audioData, isLoading: audiosLoading } = useAudioSermon();

  const audioItems = audioData ?? [];
  const displayedAudioItems = audioItems.slice(0, PLACEHOLDER_COUNT);
  const audioQueue = displayedAudioItems.map<AudioQueueItem>(item => ({
    id: String(item.id),
    audioUrl: item.audio_url,
    title: item.title,
    author: item.author,
    artwork: item.thumbnail_url,
  }));

  return (
    <>
      <HeroCarousel />

      {/* Latest Video Sermon */}
      <SectionHeader
        title="Latest Video Sermon"
        onViewAll={() => navigation.navigate('VideoList')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {videosLoading && videoItems.length === 0
          ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <VideoCard key={`video-placeholder-${i}`} />
            ))
          : videoItems.map((item: any) => {
              const videoId = getVideoId(item);
              const thumbnail =
                item?.snippet?.thumbnails?.high?.url ??
                item?.snippet?.thumbnails?.medium?.url;
              const cardKey = videoId ?? item?.snippet?.title;

              return (
                <VideoCard
                  key={cardKey}
                  title={item?.snippet?.title}
                  thumbnail={thumbnail}
                  onPress={() =>
                    navigation.navigate('VideoPlayer', {
                      videoId,
                      title: item?.snippet?.title,
                    })
                  }
                />
              );
            })}
      </ScrollView>

      {/* Latest Audio Sermon */}
      <SectionHeader
        title="Latest Audio Sermon"
        onViewAll={() => navigation.navigate('AudioList')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {audiosLoading && audioItems.length === 0
          ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <AudioCard key={`audio-placeholder-${i}`} />
            ))
          : displayedAudioItems.map((item, index) => (
              <AudioCard
                key={item.id}
                title={item.title}
                author={item.author}
                thumbnail={item.thumbnail_url}
                onPress={() =>
                  navigation.navigate('AudioPlayer', {
                    id: item.id,
                    audioUrl: item.audio_url,
                    title: item.title,
                    author: item.author,
                    artwork: item.thumbnail_url,
                    queue: audioQueue,
                    startIndex: index,
                  })
                }
              />
            ))}
      </ScrollView>

      {/* Testimonies */}
      <SectionHeader
        title="Testimonies"
        onViewAll={() => navigation.navigate('TestimonyList')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {testimoniesLoading && testimonyItems.length === 0
          ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <TestimonyCard key={`testimony-placeholder-${i}`} />
            ))
          : testimonyItems.map((item: any) => {
              const videoId = getVideoId(item);
              const thumbnail =
                item?.snippet?.thumbnails?.high?.url ??
                item?.snippet?.thumbnails?.medium?.url;
              const cardKey = videoId ?? item?.snippet?.title;

              return (
                <TestimonyCard
                  key={cardKey}
                  title={item?.snippet?.title}
                  thumbnail={thumbnail}
                  onPress={() =>
                    navigation.navigate('VideoPlayer', {
                      videoId,
                      title: item?.snippet?.title,
                    })
                  }
                />
              );
            })}
      </ScrollView>
    </>
  );
}
