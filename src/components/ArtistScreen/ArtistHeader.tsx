import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../ui/Card";
import { useArtitstPictureQuery } from "../../lib/queries/music";

export const ArtistHeader = ({
  artistName,
  songCount,
  albumCount,
  firstSongArtwork,
  onPlayAll,
}: {
  artistName: string;
  songCount: number;
  albumCount: number;
  firstSongArtwork?: string | null;
  onPlayAll: () => void;
}) => {
  const artistPictureQuery = useArtitstPictureQuery(artistName);
  const heroImage = artistPictureQuery.data || firstSongArtwork;

  return (
    <View style={styles.header}>
      <View style={styles.heroContainer}>
        {heroImage ? (
          <Image
            source={{ uri: heroImage }}
            style={styles.heroImage}
            contentFit="cover"
            cachePolicy="disk"
            transition={200}
          />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroPlaceholderText}>
              {artistName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.artistName}>{artistName}</Text>
      <Text style={styles.artistMeta}>
        {songCount} songs · {albumCount} albums
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
    borderRadius: 90,
  },
  heroPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(0, 54, 138, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroPlaceholderText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  artistName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  artistMeta: {
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
