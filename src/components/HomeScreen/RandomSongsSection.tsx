import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useMusicActions } from "../../providers/MusicProvider";
import { Song } from "../../services/MusicService";
import { Card } from "../ui/Card";
import { useListSongsQuery } from "../../lib/queries/music";
import { SongCardSkeleton } from "../Skeletons/SongCardSkeleton";
import { usePlaylist } from "../../providers/AddToPlaylistProvider";

export const RandomSongsSection: React.FC = () => {
  const { loadAndPlay } = useMusicActions();
  const { openAddToPlaylist } = usePlaylist();
  const randomSongsQuery = useListSongsQuery({
    modifiers: {
      random: true,
      page: "1:10",
    },
  });

  if (randomSongsQuery.isLoading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Random Songs</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.songItem}>
              <SongCardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!randomSongsQuery.data || randomSongsQuery.data.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Random Songs</Text>
        <Card style={styles.emptyStateCard}>
          <Text style={styles.emptyStateText}>No random songs found</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Random Songs</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {randomSongsQuery.data.map((song) => {
          const artworkUrl = Song.artworkUrl(song);

          return (
            <TouchableOpacity
              key={song.id}
              style={styles.songItem}
              onPress={() => loadAndPlay(song, randomSongsQuery.data)}
              onLongPress={() => openAddToPlaylist(song)}
            >
              <Card style={styles.songCard}>
                {artworkUrl ? (
                  <Image
                    source={{ uri: artworkUrl }}
                    style={styles.songArtwork}
                    contentFit="cover"
                    cachePolicy="disk"
                    transition={200}
                  />
                ) : (
                  <View style={styles.songArtworkPlaceholder}>
                    <Text style={styles.songArtworkText}>
                      {song.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.songInfoMini}>
                  <Text style={styles.songTitleMini} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtistMini} numberOfLines={1}>
                    {song.artist || "Unknown Artist"}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
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
  songItem: {
    marginRight: 16,
  },
  songCard: {
    width: 150,
    padding: 12,
  },
  songArtwork: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  songArtworkPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  songArtworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  songInfoMini: {
    flex: 1,
  },
  songTitleMini: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  songArtistMini: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  emptyStateCard: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});
