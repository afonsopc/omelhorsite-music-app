import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Playlist } from "../../services/MusicService";
import { Button } from "../ui/Card";

export const PlaylistHeader = ({
  playlist,
  songCount,
  onPlayAll,
  onShuffle,
  onEdit,
  onDelete,
}: {
  playlist: Playlist;
  songCount: number;
  onPlayAll: () => void;
  onShuffle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const artworkUrl = playlist.artwork_fs_node_id
    ? Playlist.artworkUrl(playlist)
    : null;

  return (
    <View style={styles.header}>
      <View style={styles.heroContainer}>
        {artworkUrl ? (
          <Image
            source={{ uri: artworkUrl }}
            style={styles.heroImage}
            contentFit="cover"
            cachePolicy="disk"
            transition={200}
          />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Ionicons name="musical-notes" size={64} color="#FFFFFF" />
          </View>
        )}
      </View>

      <Text style={styles.playlistName}>{playlist.name}</Text>
      <Text style={styles.playlistMeta}>{songCount} songs</Text>

      <View style={styles.actionsRow}>
        <Button style={styles.playButton} onPress={onPlayAll}>
          <Ionicons name="play" size={20} color="#00f2ff" />
          <Text style={styles.playButtonText}>Play</Text>
        </Button>
        <Button style={styles.shuffleButton} onPress={onShuffle}>
          <Ionicons name="shuffle" size={20} color="#00f2ff" />
          <Text style={styles.playButtonText}>Shuffle</Text>
        </Button>
      </View>

      <View style={styles.managementRow}>
        <Button style={styles.iconButton} onPress={onEdit}>
          <Ionicons name="pencil" size={18} color="rgba(255, 255, 255, 0.7)" />
        </Button>
        <Button style={styles.iconButton} onPress={onDelete}>
          <Ionicons
            name="trash-outline"
            size={18}
            color="rgba(255, 100, 100, 0.8)"
          />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroContainer: {
    marginBottom: 16,
  },
  heroImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
  },
  heroPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  playlistName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  playlistMeta: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  playButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shuffleButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  managementRow: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
