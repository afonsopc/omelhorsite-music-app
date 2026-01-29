import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PlayerControlsProps {
  isPlaying: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  hasNext,
  hasPrevious,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  return (
    <View style={styles.controlsContainer}>
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
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
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
});
