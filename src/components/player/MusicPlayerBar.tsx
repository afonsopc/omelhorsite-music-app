import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassContainer } from "../../components/ui/GlassContainer";
import { useMusic } from "../../contexts/MusicContext";
import { Song } from "../../services/MusicService";

export const MusicPlayerBar = ({ onPress }: { onPress?: () => void }) => {
  const { currentSong, isPlaying, togglePlay } = useMusic();

  if (!currentSong) {
    return null;
  }

  const handlePlayPause = () => {
    console.log("MusicPlayerBar: Play/Pause clicked, isPlaying:", isPlaying);
    togglePlay();
  };

  const artworkUrl = Song.artworkUrl(currentSong);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <GlassContainer>
        <View style={styles.content}>
          <View style={styles.artworkContainer}>
            {artworkUrl ? (
              <Image
                source={{ uri: artworkUrl }}
                style={styles.artwork}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.artworkPlaceholder}>
                <Text style={styles.artworkText}>
                  {currentSong.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentSong.artist || "Unknown Artist"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#FF6B6B"
            />
          </TouchableOpacity>
        </View>
      </GlassContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 88,
    left: 16,
    right: 16,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    height: "100%",
  },
  artworkContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  artworkPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 107, 107, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  artworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  artist: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  playButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
});
