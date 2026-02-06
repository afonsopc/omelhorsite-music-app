import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlaylistsQuery } from "../lib/queries/music";
import { usePlaylist } from "../providers/AddToPlaylistProvider";
import { Playlist } from "../services/MusicService";
import { Card, Button } from "../components/ui/Card";
import { PlaylistListItem } from "../components/PlaylistsScreen/PlaylistListItem";
import { PlaylistItemSkeleton } from "../components/Skeletons/PlaylistItemSkeleton";

export const PlaylistsScreen = () => {
  const router = useRouter();
  const playlistsQuery = usePlaylistsQuery();
  const { openCreatePlaylist } = usePlaylist();

  const playlists = playlistsQuery.data ?? [];

  const handlePlaylistPress = (playlist: Playlist) => {
    router.push({
      pathname: "/playlist/[id]",
      params: { id: playlist.id.toString(), name: playlist.name },
    });
  };

  const handleCreatePlaylist = () => {
    openCreatePlaylist();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Playlists</Text>
          <Text style={styles.headerSubtitle}>Your music collections</Text>
        </View>

        <View style={styles.createSection}>
          <Button style={styles.createPlaylistButton} onPress={handleCreatePlaylist}>
            <Ionicons name="add-circle-outline" size={22} color="#00f2ff" />
            <Text style={styles.createPlaylistButtonText}>Create Playlist</Text>
          </Button>
        </View>

        {playlistsQuery.isLoading ? (
          <View>
            {Array.from({ length: 6 }).map((_, i) => (
              <PlaylistItemSkeleton key={i} />
            ))}
          </View>
        ) : playlists.length === 0 ? (
          <Card style={styles.emptyStateCard}>
            <Ionicons
              name="musical-notes-outline"
              size={48}
              color="rgba(255, 255, 255, 0.4)"
            />
            <Text style={styles.emptyStateTitle}>No playlists yet</Text>
            <Text style={styles.emptyStateText}>
              Create a playlist to organize your favorite music
            </Text>
            <Button style={styles.createButton} onPress={handleCreatePlaylist}>
              <Text style={styles.createButtonText}>Create Your First Playlist</Text>
            </Button>
          </Card>
        ) : (
          <View style={styles.playlistsSection}>
            {playlists.map((playlist) => (
              <PlaylistListItem
                key={playlist.id}
                playlist={playlist}
                onPress={handlePlaylistPress}
              />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createPlaylistButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  playlistsSection: {},
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
    marginTop: 16,
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
});
