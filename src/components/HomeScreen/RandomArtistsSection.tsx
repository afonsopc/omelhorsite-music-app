import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Card } from "../ui/Card";
import {
  useArtitstPictureQuery,
  useListArtistsQuery,
} from "../../lib/queries/music";
import { ArtistCardSkeleton } from "../Skeletons/ArtistCardSkeleton";

export type ArtistCard = {
  name: string;
  artworkUrl?: string | null;
};

const ArtistCard = ({
  artist,
  onArtistPress,
}: {
  artist: string;

  onArtistPress: (artistName: string) => void;
}) => {
  const artistPicturesQuery = useArtitstPictureQuery(artist);

  return (
    <TouchableOpacity
      key={artist}
      style={styles.artistItem}
      onPress={() => onArtistPress(artist)}
    >
      <Card style={styles.artistCard}>
        {artistPicturesQuery.data && artistPicturesQuery.data[0] ? (
          <Image
            source={{ uri: artistPicturesQuery.data }}
            style={styles.artistArtwork}
            contentFit="cover"
            cachePolicy="disk"
            transition={200}
          />
        ) : (
          <View style={styles.artistArtworkPlaceholder}>
            <Text style={styles.artistArtworkText}>
              {artist.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.artistName} numberOfLines={1}>
          {artist}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export const RandomArtistsSection = ({
  onArtistPress,
}: {
  onArtistPress: (artistName: string) => void;
}) => {
  const randomArtistsQuery = useListArtistsQuery({
    modifiers: {
      page: "1:30",
    },
  });

  if (randomArtistsQuery.isLoading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artists for You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={styles.artistItem}>
              <ArtistCardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!randomArtistsQuery.data || randomArtistsQuery.data.length === 0)
    return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Artists for You</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {randomArtistsQuery.data.map((artist) => (
          <ArtistCard
            key={artist}
            artist={artist || "Unknown Artist"}
            onArtistPress={onArtistPress}
          />
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
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  artistItem: {
    marginRight: 16,
  },
  artistCard: {
    width: 130,
    padding: 12,
    alignItems: "center",
  },
  artistArtwork: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  artistArtworkPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    backgroundColor: "rgba(0, 54, 138, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  artistArtworkText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  artistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  loadingCard: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});
