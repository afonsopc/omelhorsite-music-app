import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface PlayerSongInfoProps {
  title: string;
  artist: string;
  album: string;
  onArtistPress?: () => void;
  onAlbumPress?: () => void;
}

export const PlayerSongInfo: React.FC<PlayerSongInfoProps> = ({
  title,
  artist,
  album,
  onArtistPress,
  onAlbumPress,
}) => {
  return (
    <View style={styles.songInfo}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Pressable onPress={onArtistPress} disabled={!onArtistPress}>
        <Text style={styles.artist} numberOfLines={1}>
          {artist || "Unknown Artist"}
        </Text>
      </Pressable>
      <Pressable onPress={onAlbumPress} disabled={!onAlbumPress}>
        <Text style={styles.album} numberOfLines={1}>
          {album || "Unknown Album"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  songInfo: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  artist: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 4,
  },
  album: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});
