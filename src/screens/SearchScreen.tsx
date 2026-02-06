import { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Input, Card } from "../components/ui/Card";
import { Song } from "../services/MusicService";
import { useMusicActions } from "../providers/MusicProvider";
import { useSearchQuery } from "../lib/queries/music";
import { EmptyState } from "../components/SearchScreen/EmptyState";
import { NoResultsState } from "../components/SearchScreen/NoResultsState";
import { SongsResultsSection } from "../components/SearchScreen/SongsResultsSection";
import { ArtistsResultsSection } from "../components/SearchScreen/ArtistsResultsSection";
import { AlbumsResultsSection } from "../components/SearchScreen/AlbumsResultsSection";
import { PlaylistsResultsSection } from "../components/SearchScreen/PlaylistsResultsSection";

export const SearchScreen = () => {
  const { q } = useLocalSearchParams<{ q?: string | string[] }>();
  const [searchQuery, setSearchQuery] = useState("");

  const { loadAndPlay } = useMusicActions();

  const shouldSearch = searchQuery.trim().length >= 2;

  const searchQueryResult = useSearchQuery(searchQuery.trim(), {
    enabled: shouldSearch,
  });

  const searchResults = searchQueryResult.data || {
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
  };

  const handleSongPress = useCallback(
    async (song: Song, songs: Song[]) => {
      try {
        await loadAndPlay(song, songs);
      } catch (error) {
        console.error("[SearchScreen] Failed to play song from search:", error);
      }
    },
    [loadAndPlay],
  );

  useEffect(() => {
    const queryParam = Array.isArray(q) ? q[0] : q;
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [q]);

  const hasNoResults =
    searchResults.songs.length === 0 &&
    searchResults.artists.length === 0 &&
    searchResults.albums.length === 0 &&
    searchResults.playlists.length === 0;

  return (
    <View style={[styles.container, styles.darkBackground]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
          <Text style={styles.headerSubtitle}>Find your favorite music</Text>
        </View>

        <Input
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {searchQueryResult.isLoading && shouldSearch && (
          <Card style={styles.searchingCard}>
            <Text style={styles.searchingText}>Searching...</Text>
          </Card>
        )}

        {!shouldSearch && <EmptyState />}

        {shouldSearch && !searchQueryResult.isLoading && (
          <>
            <SongsResultsSection
              songs={searchResults.songs}
              onSongPress={handleSongPress}
            />
            <ArtistsResultsSection
              artists={searchResults.artists}
              searchQuery={searchQuery}
            />
            <AlbumsResultsSection
              albums={searchResults.albums}
              searchQuery={searchQuery}
            />
            <PlaylistsResultsSection
              playlists={searchResults.playlists}
              searchQuery={searchQuery}
            />

            {hasNoResults && <NoResultsState />}
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
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  searchInput: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  searchingCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    alignItems: "center",
  },
  searchingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
});
