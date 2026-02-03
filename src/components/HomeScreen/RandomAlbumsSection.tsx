import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Album } from "../../services/MusicService";
import { GlassCard } from "../ui/GlassContainer";
import { useListAlbumsQuery } from "../../lib/queries/music";
import { FsNode } from "../../services/FsNodeService";
import { AlbumCardSkeleton } from "../Skeletons/AlbumCardSkeleton";

export type AlbumCard = {
  album: Album;
  artworkUrl?: string | null;
};

export const RandomAlbumsSection = ({
  onAlbumPress,
}: {
  onAlbumPress: (albumName: string, artist: string) => void;
}) => {
  const randomAlbumsQuery = useListAlbumsQuery({
    modifiers: {
      random: true,
      page: "1:30",
    },
  });

  if (randomAlbumsQuery.isLoading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Albums for You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={styles.albumItem}>
              <AlbumCardSkeleton />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!randomAlbumsQuery.data || randomAlbumsQuery.data.length === 0)
    return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Albums for You</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {randomAlbumsQuery.data.map((entry) => {
          const albumName = entry.name || "Unknown Album";
          return (
            <TouchableOpacity
              key={`${albumName}-${entry.artist || ""}`}
              style={styles.albumItem}
              onPress={() => onAlbumPress(albumName, entry.artist || "")}
            >
              <GlassCard style={styles.albumCard}>
                {entry.artwork_fs_node_id ? (
                  <Image
                    source={{ uri: FsNode.dataUrl(entry.artwork_fs_node_id) }}
                    style={styles.albumArtwork}
                    contentFit="cover"
                    cachePolicy="disk"
                    transition={200}
                  />
                ) : (
                  <View style={styles.albumArtworkPlaceholder}>
                    <Text style={styles.albumArtworkText}>
                      {albumName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.albumName} numberOfLines={1}>
                  {albumName}
                </Text>
                <Text style={styles.albumArtist} numberOfLines={1}>
                  {entry.artist || "Unknown Artist"}
                </Text>
              </GlassCard>
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
  albumItem: {
    marginRight: 16,
  },
  albumCard: {
    width: 150,
    padding: 12,
  },
  albumArtwork: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  albumArtworkPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  albumArtworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  albumName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
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
