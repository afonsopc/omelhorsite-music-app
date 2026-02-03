import { View, Text, StyleSheet } from "react-native";
import { Playlist } from "../../services/MusicService";
import { SearchResultItem } from "./SearchResultItem";

type PlaylistsResultsSectionProps = {
  playlists: Playlist[];
};

export const PlaylistsResultsSection = ({
  playlists,
}: PlaylistsResultsSectionProps) => {
  if (playlists.length === 0) return null;

  return (
    <View style={styles.resultsSection}>
      <Text style={styles.sectionTitle}>Playlists</Text>
      {playlists.map((playlist) => (
        <SearchResultItem
          key={`playlist-${playlist.id}`}
          item={playlist}
          type="playlist"
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
