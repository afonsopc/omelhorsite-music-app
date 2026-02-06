import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Playlist } from "../../services/MusicService";
import { SearchResultItem } from "./SearchResultItem";

type PlaylistsResultsSectionProps = {
  playlists: Playlist[];
  searchQuery: string;
};

export const PlaylistsResultsSection = ({
  playlists,
  searchQuery,
}: PlaylistsResultsSectionProps) => {
  const router = useRouter();

  if (playlists.length === 0) return null;

  const handlePlaylistPress = (playlist: Playlist) => {
    router.push({
      pathname: "/playlist/[id]",
      params: {
        id: playlist.id.toString(),
        name: playlist.name,
        from: "search",
        query: searchQuery,
      },
    });
  };

  return (
    <View style={styles.resultsSection}>
      <Text style={styles.sectionTitle}>Playlists</Text>
      {playlists.map((playlist) => (
        <SearchResultItem
          key={`playlist-${playlist.id}`}
          item={playlist}
          type="playlist"
          onPress={() => handlePlaylistPress(playlist)}
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
