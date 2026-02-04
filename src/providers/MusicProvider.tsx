import { useState, useEffect, useMemo, useRef } from "react";
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  useActiveTrack,
  State,
  Event,
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";
import { Song } from "../services/MusicService";
import { RepeatMode, PlaybackSpeed } from "../types/player";
import {
  resetAndAddTracks,
  convertToTPRepeatMode,
} from "../services/TrackPlayerService";
import { MusicStateContext, useMusicState } from "./MusicStateProvider";
import { MusicActionsContext, useMusicActions } from "./MusicActionsProvider";
import { MusicPositionContext, useMusicPosition } from "./MusicPositionProvider";

export { useMusicState, useMusicActions, useMusicPosition };

type MusicProviderProps = {
  children: React.ReactNode;
};

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const activeTrack = useActiveTrack();

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1.0);
  const [volume, setVolumeState] = useState<number>(1.0);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);
  
  const currentQueueIdsRef = useRef<string>("");

  const isPlaying =
    playbackState.state === State.Playing ||
    playbackState.state === State.Buffering;

  const currentSong = useMemo(() => {
    if (!activeTrack) return null;
    const trackId = parseInt(activeTrack.id, 10);
    return queue.find((song) => song.id === trackId) || null;
  }, [activeTrack, queue]);

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({
          autoUpdateMetadata: true,
          autoHandleInterruptions: true,
        });

        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.ContinuePlayback,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          progressUpdateEventInterval: 1,
        });
      } catch (error) {
        console.error("Failed to initialize TrackPlayer:", error);
      }
    };
    setupPlayer();
  }, []);

  useEffect(() => {
    if (currentSong) {
      const index = queue.findIndex((song) => song.id === currentSong.id);
      if (index >= 0) {
        setCurrentIndex(index);
      }
    }
  }, [currentSong, queue]);

  useEffect(() => {
    const queueEndedListener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async (event) => {
        if (repeatMode === RepeatMode.All) {
          await TrackPlayer.skip(0);
          await TrackPlayer.play();
        }
      },
    );

    return () => {
      queueEndedListener.remove();
    };
  }, [repeatMode]);

  useEffect(() => {
    const updateRepeatMode = async () => {
      const tpRepeatMode = convertToTPRepeatMode(repeatMode);
      await TrackPlayer.setRepeatMode(tpRepeatMode);
    };
    updateRepeatMode();
  }, [repeatMode]);

  const loadAndPlay = async (song: Song, newQueue?: Song[]) => {
    try {
      const songsToPlay = newQueue && newQueue.length > 0 ? newQueue : [song];
      const songIndex = songsToPlay.findIndex((s) => s.id === song.id);
      const startIndex = songIndex >= 0 ? songIndex : 0;

      const newQueueIds = songsToPlay.map((s) => s.id).join(",");
      const queueHasChanged = currentQueueIdsRef.current !== newQueueIds;

      setIsShuffled(false);
      setOriginalQueue(songsToPlay);
      setQueue(songsToPlay);

      if (queueHasChanged) {
        await TrackPlayer.reset();
        const tracks = songsToPlay.map(Song.toTrack);
        await TrackPlayer.setQueue(tracks);
        currentQueueIdsRef.current = newQueueIds;
      }

      if (startIndex > 0) {
        await TrackPlayer.skip(startIndex);
      }

      await TrackPlayer.play();
    } catch (error) {
      console.error("Failed to load and play:", error);
    }
  };

  const play = async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error("Failed to play:", error);
    }
  };

  const pause = async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error("Failed to pause:", error);
    }
  };

  const togglePlay = async () => {
    try {
      const state = await TrackPlayer.getPlaybackState();
      if (state.state === State.Playing || state.state === State.Buffering) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error("Failed to toggle play:", error);
    }
  };

  const seek = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error("Failed to seek:", error);
    }
  };

  const next = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("Failed to skip to next:", error);
    }
  };

  const previous = async () => {
    try {
      const currentPosition = await TrackPlayer.getProgress();
      if (currentPosition.position > 3) {
        await TrackPlayer.seekTo(0);
      } else {
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error("Failed to skip to previous:", error);
    }
  };

  const toggleRepeat = async () => {
    const modes = [RepeatMode.Off, RepeatMode.All, RepeatMode.One];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const toggleShuffle = async () => {
    try {
      if (!currentSong) return;

      const wasPlaying = playbackState.state === State.Playing || playbackState.state === State.Buffering;
      const currentPosition = await TrackPlayer.getProgress();

      if (!isShuffled) {
        const currentSongId = currentSong.id;
        const otherSongs = queue.filter((s) => s.id !== currentSongId);
        const shuffled = [...otherSongs].sort(() => Math.random() - 0.5);
        const newQueue = [currentSong, ...shuffled];

        setOriginalQueue(queue);
        setQueue(newQueue);
        setIsShuffled(true);

        await resetAndAddTracks(newQueue);
        currentQueueIdsRef.current = newQueue.map((s) => s.id).join(",");
        
        await TrackPlayer.skip(0);
        await TrackPlayer.seekTo(currentPosition.position);
        
        if (wasPlaying) {
          await TrackPlayer.play();
        }
      } else {
        const currentSongId = currentSong.id;
        const currentIndexInOriginal = originalQueue.findIndex(
          (s) => s.id === currentSongId,
        );

        if (currentIndexInOriginal < 0) return;

        setQueue(originalQueue);
        setIsShuffled(false);

        await resetAndAddTracks(originalQueue);
        currentQueueIdsRef.current = originalQueue.map((s) => s.id).join(",");

        await TrackPlayer.skip(currentIndexInOriginal);
        await TrackPlayer.seekTo(currentPosition.position);

        if (wasPlaying) {
          await TrackPlayer.play();
        }
      }
    } catch (error) {
      console.error("Failed to toggle shuffle:", error);
    }
  };

  const setPlaybackSpeed = async (speed: PlaybackSpeed) => {
    try {
      await TrackPlayer.setRate(speed);
      setPlaybackSpeedState(speed);
    } catch (error) {
      console.error("Failed to set playback speed:", error);
    }
  };

  const setVolume = async (newVolume: number) => {
    try {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      await TrackPlayer.setVolume(clampedVolume);
      setVolumeState(clampedVolume);
    } catch (error) {
      console.error("Failed to set volume:", error);
    }
  };

  const hasNext = useMemo(() => currentIndex < queue.length - 1, [currentIndex, queue.length]);
  const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex]);

  const stateValue = useMemo(
    () => ({
      currentSong,
      queue,
      currentIndex,
      hasNext,
      hasPrevious,
      repeatMode,
      isShuffled,
      playbackSpeed,
      volume,
    }),
    [
      currentSong,
      queue,
      currentIndex,
      hasNext,
      hasPrevious,
      repeatMode,
      isShuffled,
      playbackSpeed,
      volume,
    ],
  );

  const actionsValue = useMemo(
    () => ({
      play,
      pause,
      togglePlay,
      seek,
      loadAndPlay,
      next,
      previous,
      toggleRepeat,
      toggleShuffle,
      setPlaybackSpeed,
      setVolume,
    }),
    [repeatMode, isShuffled, queue, originalQueue, currentSong],
  );

  const positionValue = useMemo(
    () => ({
      position: progress.position,
      duration: progress.duration,
      isPlaying,
    }),
    [progress.position, progress.duration, isPlaying],
  );

  return (
    <MusicStateContext.Provider value={stateValue}>
      <MusicActionsContext.Provider value={actionsValue}>
        <MusicPositionContext.Provider value={positionValue}>
          {children}
        </MusicPositionContext.Provider>
      </MusicActionsContext.Provider>
    </MusicStateContext.Provider>
  );
};
