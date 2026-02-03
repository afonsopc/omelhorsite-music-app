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
import { Card, Button } from "../components/ui/Card";
import { Playlist } from "../services/MusicService";

export const PlaylistsScreen: React.FC = () => {
  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Playlists</Text>
          <Text style={styles.headerSubtitle}>Your music collections</Text>
          <Text style={styles.headerSubtitle}>NOT IMPLEMENTED</Text>
        </View>
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
