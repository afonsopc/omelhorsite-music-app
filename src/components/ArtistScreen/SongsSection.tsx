import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Song } from "../../services/MusicService";
import { GlassCard } from "../ui/GlassContainer";

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const SongsSection = ({
  songs,
  onSongPress,
}: {
  songs: Song[];
  onSongPress: (song: Song) => void;
}) => {
  if (songs.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Songs</Text>
        <GlassCard style={styles.emptyStateCard}>
          <Text style={styles.emptyStateText}>
            No songs found for this artist.
          </Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Songs</Text>
      {songs.map((song) => {
        const artworkUrl = Song.artworkUrl(song);
        return (
          <TouchableOpacity
            key={`song-${song.id}`}
            style={styles.songItem}
            onPress={() => onSongPress(song)}
          >
            <GlassCard style={styles.songCard}>
              <View style={styles.songContent}>
                {artworkUrl ? (
                  <Image
                    source={{ uri: artworkUrl }}
                    style={styles.songArtwork}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.songArtworkPlaceholder}>
                    <Text style={styles.songArtworkText}>
                      {song.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songSubtitle} numberOfLines={1}>
                    {song.album || "Unknown Album"}
                  </Text>
                </View>
                <Text style={styles.songDuration}>
                  {formatDuration(song.duration)}
                </Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        );
      })}
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
  emptyStateCard: {
    marginHorizontal: 24,
    padding: 24,
    alignItems: "center",
  },
  emptyStateText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    textAlign: "center",
  },
  songItem: {
    marginHorizontal: 24,
    marginBottom: 12,
  },
  songCard: {
    padding: 12,
  },
  songContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  songArtwork: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 12,
  },
  songArtworkPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  songArtworkText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  songSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
  },
  songDuration: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
