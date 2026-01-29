import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard, GlassInput } from "../components/ui/GlassContainer";
import { Song, Playlist, search, Album } from "../services/MusicService";

export const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    songs: Song[];
    artists: string[];
    albums: Album[];
    playlists: Playlist[];
  }>({ songs: [], artists: [], albums: [], playlists: [] });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      return;
    }

    setIsSearching(true);

    try {
      const results = await search(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const SearchResultItem: React.FC<{
    item: Song | string | Album | Playlist;
    type: "song" | "artist" | "album" | "playlist";
  }> = ({ item, type }) => {
    let name: string;
    let subtitle: string = "";

    switch (type) {
      case "song":
        const song = item as Song;
        name = song.title;
        subtitle = song.artist || "Unknown Artist";
        break;
      case "album":
        const album = item as Album;
        name = album.name || "Unknown Album";
        subtitle = album.artist || "";
        break;
      case "playlist":
        const playlist = item as Playlist;
        name = playlist.name;
        subtitle = "";
        break;
      case "artist":
        name = item as string;
        subtitle = "";
        break;
    }

    return (
      <TouchableOpacity style={styles.resultItem}>
        <GlassCard style={styles.resultCard}>
          <View style={styles.resultContent}>
            <View style={styles.resultIcon}>
              <Ionicons
                name={
                  type === "song"
                    ? "musical-note"
                    : type === "artist"
                      ? "person"
                      : type === "album"
                        ? "disc"
                        : "list"
                }
                size={24}
                color="#FF6B6B"
              />
            </View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle} numberOfLines={1}>
                {name}
              </Text>
              {subtitle ? (
                <Text style={styles.resultSubtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <GlassCard style={styles.emptyStateCard}>
      <Text style={styles.emptyStateTitle}>Start Searching</Text>
      <Text style={styles.emptyStateText}>
        Search for songs, artists, albums, or playlists
      </Text>
    </GlassCard>
  );

  const NoResultsState = () => (
    <GlassCard style={styles.emptyStateCard}>
      <Text style={styles.emptyStateTitle}>No Results Found</Text>
      <Text style={styles.emptyStateText}>
        Try searching with different keywords
      </Text>
    </GlassCard>
  );

  return (
    <View style={[styles.container, styles.darkBackground]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search</Text>
          <Text style={styles.headerSubtitle}>Find your favorite music</Text>
        </View>

        <GlassInput
          placeholder="Search songs, artists, albums..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          children={undefined}
        />

        {isSearching && (
          <GlassCard style={styles.searchingCard}>
            <Text style={styles.searchingText}>Searching...</Text>
          </GlassCard>
        )}

        {searchQuery.trim().length === 0 && <EmptyState />}

        {searchQuery.trim().length >= 2 && !isSearching && (
          <>
            {searchResults.songs.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Songs</Text>
                {searchResults.songs.map((song) => (
                  <SearchResultItem
                    key={`song-${song.id}`}
                    item={song}
                    type="song"
                  />
                ))}
              </View>
            )}

            {searchResults.artists.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Artists</Text>
                {searchResults.artists.map((artist, index) => (
                  <SearchResultItem
                    key={`artist-${index}`}
                    item={artist}
                    type="artist"
                  />
                ))}
              </View>
            )}

            {searchResults.albums.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Albums</Text>
                {searchResults.albums.map((album, index) => (
                  <SearchResultItem
                    key={`album-${index}`}
                    item={album}
                    type="album"
                  />
                ))}
              </View>
            )}

            {searchResults.playlists.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Playlists</Text>
                {searchResults.playlists.map((playlist) => (
                  <SearchResultItem
                    key={`playlist-${playlist.id}`}
                    item={playlist}
                    type="playlist"
                  />
                ))}
              </View>
            )}

            {searchResults.songs.length === 0 &&
              searchResults.artists.length === 0 &&
              searchResults.albums.length === 0 &&
              searchResults.playlists.length === 0 && <NoResultsState />}
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
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  resultItem: {
    marginHorizontal: 24,
    marginBottom: 8,
  },
  resultCard: {
    padding: 16,
  },
  resultContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultIconText: {
    fontSize: 18,
    color: "#FF6B6B",
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  emptyStateCard: {
    marginHorizontal: 24,
    marginTop: 40,
    padding: 40,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});
