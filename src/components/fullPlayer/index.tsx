import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  useMusicState,
  useMusicPosition,
  useMusicActions,
} from "../../providers/MusicProvider";
import { Song } from "../../services/MusicService";
import { PlaybackSpeed } from "../../types/player";
import { PlayerHeader } from "./PlayerHeader";
import { PlayerArtwork } from "./PlayerArtwork";
import { PlayerSongInfo } from "./PlayerSongInfo";
import { PlayerProgress } from "./PlayerProgress";
import { PlayerControls } from "./PlayerControls";
import { SpeedModal } from "./SpeedModal";
import { DismissibleContainer } from "./DismissibleContainer";

export const FullPlayer = ({ onClose }: { onClose?: () => void }) => {
  const {
    currentSong,
    hasNext,
    hasPrevious,
    repeatMode,
    isShuffled,
    playbackSpeed,
  } = useMusicState();
  const { isPlaying } = useMusicPosition();
  const {
    togglePlay,
    seek,
    next,
    previous,
    toggleRepeat,
    toggleShuffle,
    setPlaybackSpeed,
  } = useMusicActions();

  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const router = useRouter();
  const handleClose = onClose ?? (() => router.back());

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

  const handleSpeedChange = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
  };

  const artworkUrl = Song.artworkUrl(currentSong);

  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <DismissibleContainer onDismiss={handleClose}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <PlayerHeader onBack={handleClose} />

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
      </DismissibleContainer>

      <SpeedModal
        visible={showSpeedModal}
        currentSpeed={playbackSpeed}
        onClose={() => setShowSpeedModal(false)}
        onSpeedChange={handleSpeedChange}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  emptyText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 100,
  },
});
