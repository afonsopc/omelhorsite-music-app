import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Album } from "../../services/MusicService";
import { Card } from "../ui/Card";
import { FsNode } from "../../services/FsNodeService";

export const AlbumsSection = ({
  albums,
  artistName,
  onAlbumPress,
}: {
  albums: Album[];
  artistName: string;
  onAlbumPress: (albumName: string, artist: string) => void;
}) => {
  if (albums.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Albums</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {albums.map((album, index) => (
          <TouchableOpacity
            key={`album-${index}`}
            style={styles.albumItem}
            onPress={() =>
              onAlbumPress(
                album.name || "Unknown Album",
                album.artist || artistName,
              )
            }
          >
            <Card style={styles.albumCard}>
              {album.artwork_fs_node_id ? (
                <Image
                  source={{
                    uri: FsNode.dataUrl(album.artwork_fs_node_id),
                  }}
                  style={styles.albumArtwork}
                  contentFit="cover"
                  cachePolicy="disk"
                  transition={200}
                />
              ) : (
                <View style={styles.albumArtworkPlaceholder}>
                  <Text style={styles.albumArtworkText}>
                    {(album.name || "A").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.albumName} numberOfLines={1}>
                {album.name || "Unknown Album"}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  albumItem: {
    marginRight: 16,
  },
  albumCard: {
    width: 150,
    padding: 12,
  },
  albumArtwork: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  albumArtworkPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  albumArtworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  albumName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
