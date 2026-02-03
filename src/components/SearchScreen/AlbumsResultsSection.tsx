import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Album } from "../../services/MusicService";
import { SearchResultItem } from "./SearchResultItem";

type AlbumsResultsSectionProps = {
  albums: Album[];
  searchQuery: string;
};

export const AlbumsResultsSection = ({
  albums,
  searchQuery,
}: AlbumsResultsSectionProps) => {
  const router = useRouter();

  if (albums.length === 0) return null;

  return (
    <View style={styles.resultsSection}>
      <Text style={styles.sectionTitle}>Albums</Text>
      {albums.map((album, index) => (
        <SearchResultItem
          key={`album-${index}`}
          item={album}
          type="album"
          onPress={() =>
            router.push({
              pathname: "/album/[name]",
              params: {
                name: album.name || "Unknown Album",
                artist: album.artist || "",
                from: "search",
                query: searchQuery,
              },
            })
          }
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
