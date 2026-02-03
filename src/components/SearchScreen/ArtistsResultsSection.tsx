import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SearchResultItem } from "./SearchResultItem";

type ArtistsResultsSectionProps = {
  artists: string[];
  searchQuery: string;
};

export const ArtistsResultsSection = ({
  artists,
  searchQuery,
}: ArtistsResultsSectionProps) => {
  const router = useRouter();

  if (artists.length === 0) return null;

  return (
    <View style={styles.resultsSection}>
      <Text style={styles.sectionTitle}>Artists</Text>
      {artists.map((artist, index) => (
        <SearchResultItem
          key={`artist-${index}`}
          item={artist}
          type="artist"
          onPress={() =>
            router.push({
              pathname: "/artist/[name]",
              params: {
                name: artist,
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
