import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GlassCard } from "../components/ui/GlassContainer";
import { Song } from "../services/MusicService";
import { useMusicActions } from "../providers/MusicProvider";
import {
  useListSongsByArtistQuery,
  useListAlbumsByArtistQuery,
} from "../lib/queries/music";
import { ArtistHeader } from "../components/ArtistScreen/ArtistHeader";
import { AlbumsSection } from "../components/ArtistScreen/AlbumsSection";
import { SongsSection } from "../components/ArtistScreen/SongsSection";

export const ArtistScreen = () => {
  const router = useRouter();
  const { name, from, query } = useLocalSearchParams<{
    name?: string | string[];
    from?: string | string[];
    query?: string | string[];
  }>();

  const artistName = useMemo(() => {
    if (Array.isArray(name)) return name[0] || "Unknown Artist";
    return name || "Unknown Artist";
  }, [name]);

  const origin = useMemo(() => {
    if (Array.isArray(from)) return from[0] || "";
    return from || "";
  }, [from]);

  const searchQuery = useMemo(() => {
    if (Array.isArray(query)) return query[0] || "";
    return query || "";
  }, [query]);

  const { loadAndPlay } = useMusicActions();

  const songsQuery = useListSongsByArtistQuery(artistName);
  const albumsQuery = useListAlbumsByArtistQuery(artistName);

  const orderedSongs = useMemo(() => {
    if (!songsQuery.data) return [];
    return [...songsQuery.data].sort((a, b) => a.position - b.position);
  }, [songsQuery.data]);

  const handlePlayAll = useCallback(async () => {
    if (orderedSongs.length === 0) return;
    try {
      await loadAndPlay(orderedSongs[0], orderedSongs);
    } catch (error) {
      console.error("Failed to play artist:", error);
    }
  }, [loadAndPlay, orderedSongs]);

  const handlePlaySong = useCallback(
    async (song: Song) => {
      try {
        await loadAndPlay(song, orderedSongs);
      } catch (error) {
        console.error("Failed to play song:", error);
      }
    },
    [loadAndPlay, orderedSongs],
  );

  const handleAlbumPress = useCallback(
    (albumName: string, artist: string) => {
      router.push({
        pathname: "/album/[name]",
        params: { name: albumName, artist },
      });
    },
    [router],
  );

  const handleBackPress = useCallback(() => {
    if (origin === "search") {
      router.replace({
        pathname: "/(tabs)/search",
        params: { q: searchQuery },
      });
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)");
  }, [origin, searchQuery, router]);

  const firstSongArtwork =
    orderedSongs.length > 0 ? Song.artworkUrl(orderedSongs[0]) : null;

  return (
    <View style={[styles.container, styles.darkBackground]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <ArtistHeader
          artistName={artistName}
          songCount={orderedSongs.length}
          albumCount={albumsQuery.data?.length || 0}
          firstSongArtwork={firstSongArtwork}
          onPlayAll={handlePlayAll}
        />

        {songsQuery.isLoading || albumsQuery.isLoading ? (
          <GlassCard style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading artist...</Text>
          </GlassCard>
        ) : (
          <>
            <AlbumsSection
              albums={albumsQuery.data || []}
              artistName={artistName}
              onAlbumPress={handleAlbumPress}
            />
            <SongsSection songs={orderedSongs} onSongPress={handlePlaySong} />
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 4,
  },
  loadingCard: {
    marginHorizontal: 24,
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
