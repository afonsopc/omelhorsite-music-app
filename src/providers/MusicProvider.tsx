import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  useActiveTrack,
  State,
  Event,
  RepeatMode as TPRepeatMode,
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";
import { Song } from "../services/MusicService";
import { RepeatMode, PlaybackSpeed } from "../types/player";
import {
  resetAndAddTracks,
  convertToTPRepeatMode,
} from "../services/TrackPlayerService";

type MusicContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  queue: Song[];
  currentIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;

  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackSpeed: PlaybackSpeed;

  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  loadAndPlay: (song: Song, queue?: Song[]) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;

  toggleRepeat: () => Promise<void>;
  toggleShuffle: () => Promise<void>;
  setPlaybackSpeed: (speed: PlaybackSpeed) => Promise<void>;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

export const useMusicState = useMusic;
export const useMusicPosition = () => {
  const { position, duration } = useMusic();
  return { position, duration };
};
export const useMusicActions = () => {
  const {
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
  } = useMusic();
  return {
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
  };
};

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
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);

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

  const loadAndPlay = useCallback(async (song: Song, newQueue?: Song[]) => {
    try {
      const songsToPlay = newQueue && newQueue.length > 0 ? newQueue : [song];
      const songIndex = songsToPlay.findIndex((s) => s.id === song.id);
      const startIndex = songIndex >= 0 ? songIndex : 0;

      setIsShuffled(false);
      setOriginalQueue(songsToPlay);
      setQueue(songsToPlay);

      await resetAndAddTracks(songsToPlay);

      const currentTrack = await TrackPlayer.getTrack(startIndex);
      console.log("Track metadata after adding:", {
        id: currentTrack?.id,
        title: currentTrack?.title,
        artist: currentTrack?.artist,
        artwork: currentTrack?.artwork,
        url: currentTrack?.url,
      });

      if (startIndex > 0) {
        await TrackPlayer.skip(startIndex);
      }

      await TrackPlayer.play();
    } catch (error) {
      console.error("Failed to load and play:", error);
    }
  }, []);

  const play = useCallback(async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error("Failed to play:", error);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error("Failed to pause:", error);
    }
  }, []);

  const togglePlay = useCallback(async () => {
    await (isPlaying ? pause() : play());
  }, [isPlaying, play, pause]);

  const seek = useCallback(async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error("Failed to seek:", error);
    }
  }, []);

  const next = useCallback(async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("Failed to skip to next:", error);
    }
  }, []);

  const previous = useCallback(async () => {
    try {
      if (progress.position > 3) {
        await TrackPlayer.seekTo(0);
      } else {
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error("Failed to skip to previous:", error);
    }
  }, [progress.position]);

  const toggleRepeat = useCallback(async () => {
    const modes = [RepeatMode.Off, RepeatMode.All, RepeatMode.One];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode]);

  const toggleShuffle = useCallback(async () => {
    try {
      if (!isShuffled) {
        const currentSongId = currentSong?.id;
        const otherSongs = queue.filter((s) => s.id !== currentSongId);

        const shuffled = [...otherSongs].sort(() => Math.random() - 0.5);

        const newQueue = currentSong ? [currentSong, ...shuffled] : shuffled;

        setOriginalQueue(queue);
        setQueue(newQueue);
        setIsShuffled(true);

        await resetAndAddTracks(newQueue);
        await TrackPlayer.play();
      } else {
        const currentSongId = currentSong?.id;
        const currentIndexInOriginal = originalQueue.findIndex(
          (s) => s.id === currentSongId,
        );

        setQueue(originalQueue);
        setIsShuffled(false);

        await resetAndAddTracks(originalQueue);

        if (currentIndexInOriginal >= 0) {
          await TrackPlayer.skip(currentIndexInOriginal);
        }

        await TrackPlayer.play();
      }
    } catch (error) {
      console.error("Failed to toggle shuffle:", error);
    }
  }, [isShuffled, queue, originalQueue, currentSong]);

  const setPlaybackSpeed = useCallback(async (speed: PlaybackSpeed) => {
    try {
      await TrackPlayer.setRate(speed);
      setPlaybackSpeedState(speed);
    } catch (error) {
      console.error("Failed to set playback speed:", error);
    }
  }, []);

  const hasNext = currentIndex < queue.length - 1;
  const hasPrevious = currentIndex > 0;

  const value = useMemo<MusicContextType>(
    () => ({
      currentSong,
      isPlaying,
      duration: progress.duration,
      position: progress.position,
      queue,
      currentIndex,
      hasNext,
      hasPrevious,
      repeatMode,
      isShuffled,
      playbackSpeed,
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
    }),
    [
      currentSong,
      isPlaying,
      progress.duration,
      progress.position,
      queue,
      currentIndex,
      hasNext,
      hasPrevious,
      repeatMode,
      isShuffled,
      playbackSpeed,
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
    ],
  );

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
};
