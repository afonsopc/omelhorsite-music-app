import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../ui/Card";
import { Song, Playlist, Album } from "../../services/MusicService";
import { FALLBACK_IMAGE_URL } from "../../services/BackendService";
import { FsNode } from "../../services/FsNodeService";

type SearchResultItemProps = {
  item: Song | string | Album | Playlist;
  type: "song" | "artist" | "album" | "playlist";
  onPress?: () => void;
  onLongPress?: () => void;
};

export const SearchResultItem = ({
  item,
  type,
  onPress,
  onLongPress,
}: SearchResultItemProps) => {
  let name: string;
  let subtitle: string = "";
  let artworkUrl: string = FALLBACK_IMAGE_URL;

  switch (type) {
    case "song":
      const song = item as Song;
      name = song.title;
      subtitle = song.artist || "Unknown Artist";
      artworkUrl = Song.artworkUrl(song);
      break;
    case "album":
      const album = item as Album;
      name = album.name || "Unknown Album";
      subtitle = album.artist || "";
      if (album.artwork_fs_node_id) {
        artworkUrl = FsNode.dataUrl(album.artwork_fs_node_id);
      }
      break;
    case "playlist":
      const playlist = item as Playlist;
      name = playlist.name;
      subtitle = "";
      artworkUrl = Playlist.artworkUrl(playlist);
      break;
    case "artist":
      name = item as string;
      subtitle = "";
      break;
  }

  return (
    <TouchableOpacity style={styles.resultItem} onPress={onPress} onLongPress={onLongPress}>
      <Card style={styles.resultCard}>
        <View style={styles.resultContent}>
          {type === "artist" ? (
            <View style={styles.resultIcon}>
              <Ionicons name="person" size={24} color="#00f2ff" />
            </View>
          ) : (
            <Image
              source={{ uri: artworkUrl }}
              style={styles.resultArtwork}
              contentFit="cover"
            />
          )}
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
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 54, 138, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
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
});
