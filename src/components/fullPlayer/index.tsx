import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMusic } from "../../contexts/MusicContext";
import { Song } from "../../services/MusicService";
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
    play,
    pause,
    seek,
    duration,
    position,
    next,
    previous,
    hasNext,
    hasPrevious,
  } = useMusic();
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

  const handlePlayPause = () => {
    isPlaying ? pause() : play();
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

          <PlayerProgress
            position={position}
            duration={duration}
            onSeek={seek}
          />

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={next}
            onPrevious={previous}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </ScrollView>
      </Animated.View>
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
});
