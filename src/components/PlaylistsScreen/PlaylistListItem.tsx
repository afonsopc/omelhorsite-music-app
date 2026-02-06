import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Playlist } from "../../services/MusicService";
import { Card } from "../ui/Card";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const PlaylistListItem = ({
  playlist,
  onPress,
}: {
  playlist: Playlist;
  onPress: (playlist: Playlist) => void;
}) => {
  const artworkUrl = Playlist.artworkUrl(playlist);

  return (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => onPress(playlist)}
    >
      <Card style={styles.playlistCard}>
        <View style={styles.playlistContent}>
          {playlist.artwork_fs_node_id ? (
            <Image
              source={{ uri: artworkUrl }}
              style={styles.playlistArtwork}
              contentFit="cover"
              cachePolicy="disk"
              transition={200}
            />
          ) : (
            <View style={styles.playlistArtworkPlaceholder}>
              <Ionicons name="musical-notes" size={24} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName} numberOfLines={1}>
              {playlist.name}
            </Text>
            <Text style={styles.playlistMeta} numberOfLines={1}>
              Created {formatDate(playlist.created_at)}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="rgba(255, 255, 255, 0.4)"
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playlistItem: {
    marginHorizontal: 24,
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
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
