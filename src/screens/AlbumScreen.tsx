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
import { useListSongsByAlbumQuery } from "../lib/queries/music";
import { AlbumHeader } from "../components/AlbumScreen/AlbumHeader";
import { TracksSection } from "../components/AlbumScreen/TracksSection";

export const AlbumScreen = () => {
  const router = useRouter();
  const { name, artist, from, query } = useLocalSearchParams<{
    name?: string | string[];
    artist?: string | string[];
    from?: string | string[];
    query?: string | string[];
  }>();

  const albumName = useMemo(() => {
    if (Array.isArray(name)) return name[0] || "Unknown Album";
    return name || "Unknown Album";
  }, [name]);

  const artistName = useMemo(() => {
    if (Array.isArray(artist)) return artist[0] || "";
    return artist || "";
  }, [artist]);

  const origin = useMemo(() => {
    if (Array.isArray(from)) return from[0] || "";
    return from || "";
  }, [from]);

  const searchQuery = useMemo(() => {
    if (Array.isArray(query)) return query[0] || "";
    return query || "";
  }, [query]);

  const { loadAndPlay } = useMusicActions();

  const songsQuery = useListSongsByAlbumQuery(albumName, artistName);

  const orderedSongs = useMemo(() => {
    if (!songsQuery.data) return [];
    return [...songsQuery.data].sort((a, b) => a.position - b.position);
  }, [songsQuery.data]);

  const handlePlayAll = useCallback(async () => {
    if (orderedSongs.length === 0) return;
    try {
      await loadAndPlay(orderedSongs[0], orderedSongs);
    } catch (error) {
      console.error("Failed to play album:", error);
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

  const artworkUrl =
    orderedSongs.length > 0 ? Song.artworkUrl(orderedSongs[0]) : null;
  const displayArtist =
    artistName || orderedSongs[0]?.artist || "Unknown Artist";

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

        <AlbumHeader
          albumName={albumName}
          artistName={displayArtist}
          songCount={orderedSongs.length}
          artworkUrl={artworkUrl}
          onPlayAll={handlePlayAll}
        />

        {songsQuery.isLoading ? (
          <GlassCard style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading album...</Text>
          </GlassCard>
        ) : (
          <TracksSection songs={orderedSongs} onSongPress={handlePlaySong} />
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
