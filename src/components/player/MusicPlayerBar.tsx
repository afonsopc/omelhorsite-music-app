import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
  useMusicState,
  useMusicPosition,
  useMusicActions,
} from "../../providers/MusicProvider";
import { Song } from "../../services/MusicService";
import { CompactProgressSlider } from "./CompactProgressSlider";
import { VolumeSlider } from "./VolumeSlider";
import { RepeatMode } from "../../types/player";

const DESKTOP_BREAKPOINT = 768;

export const MusicPlayerBar = ({
  onPress,
  style,
}: {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const { currentSong, repeatMode, isShuffled, playbackSpeed, volume } =
    useMusicState();
  const { isPlaying, position, duration } = useMusicPosition();
  const {
    togglePlay,
    seek,
    next,
    previous,
    toggleRepeat,
    toggleShuffle,
    setVolume,
  } = useMusicActions();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [hoveredTitle, setHoveredTitle] = useState(false);
  const [hoveredArtist, setHoveredArtist] = useState(false);

  if (!currentSong) {
    return null;
  }

  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const artworkUrl = Song.artworkUrl(currentSong);

  const handleAlbumPress = (e?: any) => {
    if (e?.stopPropagation) e.stopPropagation();
    if (currentSong.album) {
      router.push({
        pathname: "/album/[name]",
        params: { name: currentSong.album },
      });
    }
  };

  const handleArtistPress = (e?: any) => {
    if (e?.stopPropagation) e.stopPropagation();
    if (currentSong.artist) {
      router.push({
        pathname: "/artist/[name]",
        params: { name: currentSong.artist },
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case RepeatMode.One:
        return "repeat-one";
      case RepeatMode.All:
        return "repeat";
      case RepeatMode.Off:
      default:
        return "repeat-outline";
    }
  };

  const isRepeatActive = repeatMode !== RepeatMode.Off;

  if (isDesktop) {
    return (
      <View style={[styles.desktopContainer, style]}>
        <View style={styles.desktopContent}>
          <View style={styles.desktopLeft}>
            <TouchableOpacity
              style={styles.desktopArtworkContainer}
              onPress={onPress}
              activeOpacity={0.8}
            >
              {artworkUrl ? (
                <Image
                  source={{ uri: artworkUrl }}
                  style={styles.desktopArtwork}
                  contentFit="cover"
                  cachePolicy="disk"
                  transition={200}
                />
              ) : (
                <View style={styles.artworkPlaceholder}>
                  <Text style={styles.artworkText}>
                    {currentSong.title.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.desktopInfo}>
              <Pressable
                onPress={handleAlbumPress}
                onHoverIn={() => setHoveredTitle(true)}
                onHoverOut={() => setHoveredTitle(false)}
              >
                <Text
                  style={[
                    styles.desktopTitle,
                    hoveredTitle && styles.textHovered,
                  ]}
                  numberOfLines={1}
                >
                  {currentSong.title}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleArtistPress}
                onHoverIn={() => setHoveredArtist(true)}
                onHoverOut={() => setHoveredArtist(false)}
              >
                <Text
                  style={[
                    styles.desktopArtist,
                    hoveredArtist && styles.textHovered,
                  ]}
                  numberOfLines={1}
                >
                  {currentSong.artist || "Unknown Artist"}
                </Text>
              </Pressable>
              <Text style={styles.desktopStreaming}>Streaming</Text>
            </View>
          </View>

          <View style={styles.desktopCenter}>
            <View style={styles.desktopControlsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.desktopSecondaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={toggleShuffle}
              >
                <Ionicons
                  name={isShuffled ? "shuffle" : "shuffle-outline"}
                  size={20}
                  color={isShuffled ? "#00f2ff" : "rgba(255, 255, 255, 0.7)"}
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.desktopControlButton,
                  pressed && styles.pressed,
                ]}
                onPress={previous}
              >
                <Ionicons name="play-skip-back" size={24} color="#FFFFFF" />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.desktopPlayButton,
                  pressed && styles.desktopPlayButtonPressed,
                ]}
                onPress={togglePlay}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={28}
                  color="#00f2ff"
                />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.desktopControlButton,
                  pressed && styles.pressed,
                ]}
                onPress={next}
              >
                <Ionicons name="play-skip-forward" size={24} color="#FFFFFF" />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.desktopSecondaryButton,
                  pressed && styles.pressed,
                ]}
                onPress={toggleRepeat}
              >
                <Ionicons
                  name={getRepeatIcon() as any}
                  size={20}
                  color={
                    isRepeatActive ? "#00f2ff" : "rgba(255, 255, 255, 0.7)"
                  }
                />
              </Pressable>
            </View>

            <View style={styles.desktopProgressRow}>
              <Text style={styles.desktopTimeText}>{formatTime(position)}</Text>
              <View style={styles.progressSliderWrapper}>
                <CompactProgressSlider
                  position={position}
                  duration={duration}
                  onSeek={seek}
                />
              </View>
              <Text style={styles.desktopTimeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          <View style={styles.desktopRight}>
            <Pressable
              style={({ pressed }) => [
                styles.desktopSpeedButton,
                pressed && styles.pressed,
              ]}
              onPress={onPress}
            >
              <Text style={styles.desktopSpeedText}>{playbackSpeed}x</Text>
            </Pressable>

            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.mobileContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.mobileContent}>
        <View style={styles.mobileTopRow}>
          <View style={styles.mobileArtworkContainer}>
            {artworkUrl ? (
              <Image
                source={{ uri: artworkUrl }}
                style={styles.mobileArtwork}
                contentFit="cover"
                cachePolicy="disk"
                transition={200}
              />
            ) : (
              <View style={styles.artworkPlaceholder}>
                <Text style={styles.artworkText}>
                  {currentSong.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.mobileInfoContainer}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleAlbumPress();
              }}
            >
              <Text style={styles.mobileTitle} numberOfLines={1}>
                {currentSong.title}
              </Text>
            </Pressable>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleArtistPress();
              }}
            >
              <Text style={styles.mobileArtist} numberOfLines={1}>
                {currentSong.artist || "Unknown Artist"}
              </Text>
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.mobilePlayButton}
            onPress={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#00f2ff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.mobileProgressRow}>
          <CompactProgressSlider
            position={position}
            duration={duration}
            onSeek={seek}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    width: "100%",
    height: 102,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  mobileContent: {
    flexDirection: "column",
    padding: 12,
    height: "100%",
  },
  mobileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  mobileArtworkContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  mobileArtwork: {
    width: "100%",
    height: "100%",
  },
  artworkPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 54, 138, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  artworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  mobileInfoContainer: {
    flex: 1,
    marginRight: 12,
  },
  mobileTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  mobileArtist: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  mobilePlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  mobileProgressRow: {
    width: "100%",
  },
  desktopContainer: {
    width: "100%",
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  desktopContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    height: "100%",
  },
  desktopLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 260,
    marginRight: 24,
  },
  desktopArtworkContainer: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 12,
  },
  desktopArtwork: {
    width: "100%",
    height: "100%",
  },
  desktopInfo: {
    flex: 1,
    justifyContent: "center",
  },
  desktopTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  desktopArtist: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  desktopStreaming: {
    fontSize: 12,
    color: "#A855F7",
    fontWeight: "500",
  },
  desktopCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 600,
    marginRight: 24,
  },
  desktopControlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    gap: 20,
  },
  desktopProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
  },
  progressSliderWrapper: {
    flex: 1,
    marginHorizontal: 12,
  },
  desktopControlButton: {
    padding: 8,
  },
  desktopSecondaryButton: {
    padding: 8,
  },
  desktopPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0, 54, 138, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00f2ff",
  },
  desktopPlayButtonPressed: {
    opacity: 0.7,
    backgroundColor: "rgba(0, 54, 138, 0.3)",
  },
  pressed: {
    opacity: 0.5,
  },
  desktopTimeText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    minWidth: 38,
    textAlign: "center",
  },
  desktopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  desktopSpeedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  desktopSpeedText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  textHovered: {
    textDecorationLine: "underline",
  },
});
