import { View, Text, StyleSheet } from "react-native";
import { Song } from "../../services/MusicService";
import { SearchResultItem } from "./SearchResultItem";

type SongsResultsSectionProps = {
  songs: Song[];
  onSongPress: (song: Song, songs: Song[]) => void;
};

export const SongsResultsSection = ({
  songs,
  onSongPress,
}: SongsResultsSectionProps) => {
  if (songs.length === 0) return null;

  return (
    <View style={styles.resultsSection}>
      <Text style={styles.sectionTitle}>Songs</Text>
      {songs.map((song) => (
        <SearchResultItem
          key={`song-${song.id}`}
          item={song}
          type="song"
          onPress={() => onSongPress(song, songs)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
});
