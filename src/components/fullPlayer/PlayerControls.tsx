import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RepeatMode } from "../../types/player";

interface PlayerControlsProps {
  isPlaying: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onSpeedPress: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  hasNext,
  hasPrevious,
  repeatMode,
  isShuffled,
  playbackSpeed,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleRepeat,
  onToggleShuffle,
  onSpeedPress,
}) => {
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

  return (
    <View style={styles.container}>
      {/* Top row: Shuffle and Repeat */}
      <View style={styles.secondaryControls}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
          onPress={onToggleShuffle}
        >
          <Ionicons
            name={isShuffled ? "shuffle" : "shuffle-outline"}
            size={24}
            color={isShuffled ? "#FF6B6B" : "#FFFFFF"}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
          onPress={onToggleRepeat}
        >
          <Ionicons
            name={getRepeatIcon() as any}
            size={24}
            color={isRepeatActive ? "#FF6B6B" : "#FFFFFF"}
          />
        </Pressable>
      </View>

      {/* Main controls: Previous, Play/Pause, Next */}
      <View style={styles.mainControls}>
        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.pressed,
          ]}
          onPress={onPrevious}
          disabled={!hasPrevious}
        >
          <Ionicons
            name="play-skip-back"
            size={32}
            color={hasPrevious ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)"}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}
          onPress={onPlayPause}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={36}
            color="#FF6B6B"
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.pressed,
          ]}
          onPress={onNext}
          disabled={!hasNext}
        >
          <Ionicons
            name="play-skip-forward"
            size={32}
            color={hasNext ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)"}
          />
        </Pressable>
      </View>

      {/* Speed control */}
      <View style={styles.speedControl}>
        <Pressable
          style={({ pressed }) => [
            styles.speedButton,
            pressed && styles.pressed,
          ]}
          onPress={onSpeedPress}
        >
          <Text style={styles.speedText}>{playbackSpeed}x</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
    alignItems: "center",
  },
  secondaryControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  secondaryButton: {
    padding: 10,
  },
  mainControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  controlButton: {
    padding: 20,
    marginHorizontal: 20,
  },
  pressed: {
    opacity: 0.5,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    marginHorizontal: 30,
  },
  playButtonPressed: {
    opacity: 0.7,
    backgroundColor: "rgba(255, 107, 107, 0.3)",
  },
  speedControl: {
    alignItems: "center",
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  speedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
