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
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";

import {
  useMusicState,
  useMusicPosition,
  useMusicActions,
} from "../../providers/MusicProvider";
import { Song } from "../../services/MusicService";
import { CompactProgressSlider } from "./CompactProgressSlider";
import { VolumeSlider } from "./VolumeSlider";
import { RepeatMode, PLAYBACK_SPEEDS } from "../../types/player";

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
    setPlaybackSpeed,
  } = useMusicActions();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [hoveredTitle, setHoveredTitle] = useState(false);
  const [hoveredArtist, setHoveredArtist] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [localSpeed, setLocalSpeed] = useState<number>(playbackSpeed);
  const [displayPosition, setDisplayPosition] = useState(position);

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
        return "repeat";
      case RepeatMode.All:
        return "repeat";
      case RepeatMode.Off:
      default:
        return "repeat-outline";
    }
  };

  const isRepeatActive = repeatMode !== RepeatMode.Off;

  const handleSpeedPress = () => {
    setLocalSpeed(playbackSpeed);
    setShowSpeedModal(true);
  };

  const handleSpeedChange = async (speed: number) => {
    setLocalSpeed(speed);
    await setPlaybackSpeed(speed as any);
  };

  const handleSpeedSelect = async (speed: number) => {
    setLocalSpeed(speed);
    await setPlaybackSpeed(speed as any);
    setShowSpeedModal(false);
  };

  if (isDesktop) {
    return (
      <View style={[styles.desktopContainer, style]}>
        <View style={styles.desktopContent}>
          <View style={styles.desktopLeft}>
            <View style={styles.desktopArtworkContainer}>
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
            </View>

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
                  styles.repeatButton,
                ]}
                onPress={toggleRepeat}
              >
                <Ionicons
                  name={RepeatMode.Off ? "repeat-outline" : "repeat"}
                  size={20}
                  color={
                    isRepeatActive ? "#00f2ff" : "rgba(255, 255, 255, 0.7)"
                  }
                />
                {repeatMode === RepeatMode.One && (
                  <View style={styles.repeatOneBadge}>
                    <Text style={styles.repeatOneText}>1</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.desktopProgressRow}>
              <Text style={styles.desktopTimeText}>
                {formatTime(displayPosition)}
              </Text>
              <View style={styles.progressSliderWrapper}>
                <CompactProgressSlider
                  position={position}
                  duration={duration}
                  onSeek={seek}
                  onDisplayPositionChange={setDisplayPosition}
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
              onPress={handleSpeedPress}
            >
              <Text style={styles.desktopSpeedText}>{playbackSpeed}x</Text>
            </Pressable>

            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </View>
        </View>

        <Modal
          visible={showSpeedModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSpeedModal(false)}
        >
          <Pressable
            style={styles.speedModalOverlay}
            onPress={() => setShowSpeedModal(false)}
          >
            <Pressable
              style={styles.speedModalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.speedModalTitle}>Playback Speed</Text>

              <Text style={styles.speedValueText}>
                {localSpeed.toFixed(2)}x
              </Text>

              <Slider
                style={styles.speedSlider}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.01}
                value={localSpeed}
                onValueChange={(value) => handleSpeedChange(value)}
                onSlidingComplete={(value) => handleSpeedChange(value)}
                minimumTrackTintColor="#00f2ff"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor="#00f2ff"
              />

              <View style={styles.speedButtonsRow}>
                {PLAYBACK_SPEEDS.map((speed) => (
                  <Pressable
                    key={speed}
                    style={[
                      styles.speedButton,
                      Math.abs(speed - localSpeed) < 0.01 &&
                        styles.speedButtonActive,
                    ]}
                    onPress={() => handleSpeedSelect(speed)}
                  >
                    <Text
                      style={[
                        styles.speedButtonText,
                        Math.abs(speed - localSpeed) < 0.01 &&
                          styles.speedButtonTextActive,
                      ]}
                    >
                      {speed}x
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
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
          <Text style={styles.mobileTitle} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.mobileArtist} numberOfLines={1}>
            {currentSong.artist || "Unknown Artist"}
          </Text>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    width: "100%",
    height: 72,
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
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    height: "100%",
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
  repeatButton: {
    position: "relative",
  },
  repeatOneBadge: {
    position: "absolute",
    top: 8,
    right: 4,
    backgroundColor: "#00f2ff",
    borderRadius: 6,
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  repeatOneText: {
    color: "#000",
    fontSize: 8,
    fontWeight: "bold",
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
  speedModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  speedModalContent: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    borderRadius: 16,
    padding: 24,
    minWidth: 320,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  speedModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  speedValueText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#00f2ff",
    textAlign: "center",
    marginBottom: 16,
  },
  speedSlider: {
    width: "100%",
    height: 50,
    marginBottom: 20,
  },
  speedButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  speedButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  speedButtonActive: {
    backgroundColor: "rgba(0, 242, 255, 0.2)",
    borderColor: "#00f2ff",
  },
  speedButtonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  speedButtonTextActive: {
    color: "#00f2ff",
    fontWeight: "700",
  },
});
