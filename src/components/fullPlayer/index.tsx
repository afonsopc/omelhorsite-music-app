import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMusic } from "../../providers/MusicProvider";
import { Song } from "../../services/MusicService";
import { PLAYBACK_SPEEDS, PlaybackSpeed } from "../../types/player";
import { PlayerHeader } from "./PlayerHeader";
import { PlayerArtwork } from "./PlayerArtwork";
import { PlayerSongInfo } from "./PlayerSongInfo";
import { PlayerProgress } from "./PlayerProgress";
import { PlayerControls } from "./PlayerControls";

const DISMISS_THRESHOLD = 150;

export const FullPlayer = ({}: {}) => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    seek,
    next,
    previous,
    hasNext,
    hasPrevious,
    repeatMode,
    isShuffled,
    playbackSpeed,
    toggleRepeat,
    toggleShuffle,
    setPlaybackSpeed,
  } = useMusic();

  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const router = useRouter();

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          const newOpacity = Math.max(
            0.3,
            1 - gestureState.dy / DISMISS_THRESHOLD,
          );
          opacity.setValue(newOpacity);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 1000,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            router.back();
          });
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No song is currently playing</Text>
      </View>
    );
  }

  const handleSpeedPress = () => {
    setShowSpeedModal(true);
  };

  const handleSpeedSelect = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    setShowSpeedModal(false);
  };

  const artworkUrl = Song.artworkUrl(currentSong);

  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <PlayerHeader onBack={() => router.back()} />

          <PlayerArtwork artworkUrl={artworkUrl} title={currentSong.title} />

          <PlayerSongInfo
            title={currentSong.title}
            artist={currentSong.artist || "Unknown Artist"}
            album={currentSong.album || "Unknown Album"}
          />

          <PlayerProgress onSeek={seek} />

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onNext={next}
            onPrevious={previous}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            repeatMode={repeatMode}
            isShuffled={isShuffled}
            playbackSpeed={playbackSpeed}
            onToggleRepeat={toggleRepeat}
            onToggleShuffle={toggleShuffle}
            onSpeedPress={handleSpeedPress}
          />
        </ScrollView>
      </Animated.View>

      {/* Speed Selection Modal */}
      <Modal
        visible={showSpeedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSpeedModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Playback Speed</Text>
            {PLAYBACK_SPEEDS.map((speed) => (
              <Pressable
                key={speed}
                style={[
                  styles.speedOption,
                  speed === playbackSpeed && styles.speedOptionActive,
                ]}
                onPress={() => handleSpeedSelect(speed)}
              >
                <Text
                  style={[
                    styles.speedOptionText,
                    speed === playbackSpeed && styles.speedOptionTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  animatedContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  speedOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  speedOptionActive: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  speedOptionText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  speedOptionTextActive: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
});
