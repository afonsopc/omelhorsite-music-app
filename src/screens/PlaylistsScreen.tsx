import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard, GlassButton } from "../components/ui/GlassContainer";
import { Playlist } from "../services/MusicService";
import { useListPlaylistsQuery } from "../lib/queries/music";

export const PlaylistsScreen: React.FC = () => {
  const { data, isLoading, error } = useListPlaylistsQuery();

  const playlists = data || [];

  const EmptyState = () => (
    <GlassCard style={styles.emptyStateCard}>
      <Text style={styles.emptyStateTitle}>No Playlists Yet</Text>
      <Text style={styles.emptyStateText}>
        Create your first playlist to start organizing your music
      </Text>
      <GlassButton style={styles.createButton}>
        <Text style={styles.createButtonText}>Create Playlist</Text>
      </GlassButton>
    </GlassCard>
  );

  const PlaylistItem: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
    const artworkUrl = Playlist.artworkUrl(playlist);

    return (
      <TouchableOpacity style={styles.playlistItem}>
        <GlassCard style={styles.playlistCard}>
          <View style={styles.playlistContent}>
            {artworkUrl ? (
              <Image
                source={{ uri: artworkUrl }}
                style={styles.playlistArtwork}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.playlistArtworkPlaceholder}
              >
                <Text style={styles.playlistArtworkText}>
                  {playlist.name.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            )}

            <View style={styles.playlistInfo}>
              <Text style={styles.playlistName} numberOfLines={1}>
                {playlist.name}
              </Text>
              <Text style={styles.playlistMeta}>
                {playlist.song_count || 0} songs
              </Text>
              <Text style={styles.playlistDate}>
                Created {new Date(playlist.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading playlists...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Playlists</Text>
          <Text style={styles.headerSubtitle}>Your music collections</Text>
        </View>

        <View style={styles.createSection}>
          <GlassButton style={styles.createPlaylistButton}>
            <Text style={styles.createPlaylistButtonText}>
              + Create New Playlist
            </Text>
          </GlassButton>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load playlists</Text>
          </View>
        ) : !playlists || playlists.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.playlistsSection}>
            {playlists.map((playlist) => (
              <PlaylistItem key={playlist.id} playlist={playlist} />
            ))}
          </View>
        )}

        {/* Add some bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  createSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  createPlaylistButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  createPlaylistButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  playlistsSection: {
    paddingHorizontal: 16,
  },
  playlistItem: {
    marginBottom: 12,
  },
  playlistCard: {
    padding: 16,
  },
  playlistContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  playlistArtwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  playlistArtworkPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  playlistArtworkText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  playlistMeta: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 2,
  },
  playlistDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
  },
  emptyStateCard: {
    marginHorizontal: 24,
    marginTop: 60,
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
    marginBottom: 24,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: "rgba(255, 100, 100, 0.8)",
    textAlign: "center",
  },
});
