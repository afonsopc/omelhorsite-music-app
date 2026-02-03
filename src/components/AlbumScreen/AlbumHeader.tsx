import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../ui/Card";

export const AlbumHeader = ({
  albumName,
  artistName,
  songCount,
  artworkUrl,
  onPlayAll,
}: {
  albumName: string;
  artistName: string;
  songCount: number;
  artworkUrl?: string | null;
  onPlayAll: () => void;
}) => {
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
            <Text style={styles.heroPlaceholderText}>
              {albumName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.albumName}>{albumName}</Text>
      <Text style={styles.albumMeta}>
        {artistName} · {songCount} songs
      </Text>

      <Button style={styles.playAllButton} onPress={onPlayAll}>
        <Ionicons name="play" size={20} color="#00f2ff" />
        <Text style={styles.playAllText}>Play</Text>
      </Button>
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
  heroPlaceholderText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  albumName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  albumMeta: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  playAllButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playAllText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
