import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Song } from "../../services/MusicService";
import { Card } from "../ui/Card";

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const TracksSection = ({
  songs,
  onSongPress,
}: {
  songs: Song[];
  onSongPress: (song: Song) => void;
}) => {
  if (songs.length === 0) {
    return (
      <Card style={styles.emptyStateCard}>
        <Text style={styles.emptyStateText}>
          No songs found for this album.
        </Text>
      </Card>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tracks</Text>
      {songs.map((song) => (
        <TouchableOpacity
          key={`song-${song.id}`}
          style={styles.songItem}
          onPress={() => onSongPress(song)}
        >
          <Card style={styles.songCard}>
            <View style={styles.songContent}>
              <View style={styles.trackNumber}>
                <Text style={styles.trackNumberText}>
                  {song.position || "-"}
                </Text>
              </View>
              <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={styles.songSubtitle} numberOfLines={1}>
                  {song.artist || "Unknown Artist"}
                </Text>
              </View>
              <Text style={styles.songDuration}>
                {formatDuration(song.duration)}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
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
  trackNumber: {
    width: 28,
    alignItems: "center",
    marginRight: 12,
  },
  trackNumberText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
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
