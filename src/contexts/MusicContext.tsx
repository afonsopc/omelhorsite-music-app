import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";
import { Song } from "../services/MusicService";

type MusicStateType = {
  isPlaying: boolean;
  currentSong: Song | null;
  duration: number;
  queue: Song[];
  currentIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

type MusicPositionType = {
  position: number;
};

type MusicActionsType = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (position: number) => Promise<void>;
  loadAndPlay: (song: Song, queue?: Song[]) => Promise<void>;
  next: () => void;
  previous: () => void;
};

export type MusicContextType = MusicStateType &
  MusicPositionType &
  MusicActionsType;

const MusicStateContext = createContext<MusicStateType | undefined>(undefined);
const MusicPositionContext = createContext<MusicPositionType | undefined>(
  undefined,
);
const MusicActionsContext = createContext<MusicActionsType | undefined>(
  undefined,
);

export const useMusic = () => {
  const state = useContext(MusicStateContext);
  const position = useContext(MusicPositionContext);
  const actions = useContext(MusicActionsContext);
  if (!state || !position || !actions) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return { ...state, ...position, ...actions };
};

export const useMusicState = () => {
  const state = useContext(MusicStateContext);
  const actions = useContext(MusicActionsContext);
  if (!state || !actions) {
    throw new Error("useMusicState must be used within a MusicProvider");
  }
  return { ...state, ...actions };
};

export const useMusicPosition = () => {
  const position = useContext(MusicPositionContext);
  if (!position) {
    throw new Error("useMusicPosition must be used within a MusicProvider");
  }
  return position;
};

export const useMusicActions = () => {
  const actions = useContext(MusicActionsContext);
  if (!actions) {
    throw new Error("useMusicActions must be used within a MusicProvider");
  }
  return actions;
};

type MusicProviderProps = {
  children: React.ReactNode;
};

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [audioSource, setAudioSource] = useState<{ uri: string } | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    const init = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
        });
      } catch (error) {
        console.error("Failed to configure audio mode:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (currentSong && player && status.isLoaded && !status.playing) {
      const artworkUrl = Song.artworkUrl(currentSong);
      try {
        player.setActiveForLockScreen(true, {
          title: currentSong.title,
          artist: currentSong.artist || "Unknown Artist",
          albumTitle: currentSong.album || "",
          artworkUrl: artworkUrl || undefined,
        });
      } catch (error) {
        console.warn("Failed to set lockscreen metadata:", error);
      }

      try {
        player.play();
      } catch (error) {
        console.error("Failed to call play():", error);
      }
    }
  }, [currentSong, status.isLoaded]);

  useEffect(() => {
    if (
      status.isLoaded &&
      status.currentTime > 0 &&
      status.currentTime >= status.duration - 0.5
    ) {
      next();
    }
  }, [status.isLoaded, status.currentTime, status.duration]);

  useEffect(() => {
    if (queue.length > 0 && queueIndex >= 0 && queueIndex < queue.length) {
      const song = queue[queueIndex];
      const audioUrl = Song.audioUrl(song);
      setCurrentSong(song);
      setAudioSource({ uri: audioUrl });
    }
  }, [queueIndex, queue]);
  const loadAndPlay = useCallback(async (song: Song, newQueue?: Song[]) => {
    try {
      if (newQueue && newQueue.length > 0) {
        const songIndex = newQueue.findIndex((s) => s.id === song.id);
        setQueue(newQueue);
        setQueueIndex(songIndex >= 0 ? songIndex : 0);
      } else {
        setQueue([song]);
        setQueueIndex(0);
      }
    } catch (error) {
      console.error("Failed to load song:", error);
    }
  }, []);

  const play = useCallback(() => {
    if (player && status.isLoaded) {
      player.play();
    } else {
      console.warn(
        "Play called but player not ready. isLoaded:",
        status.isLoaded,
      );
    }
  }, [player, status.isLoaded, status.playing]);

  const pause = useCallback(() => {
    if (player && status.isLoaded) {
      player.pause();
    } else {
      console.warn("Pause called but player not ready");
    }
  }, [player, status.isLoaded, status.playing]);

  const togglePlay = useCallback(() => {
    if (status.playing) {
      pause();
    } else {
      play();
    }
  }, [status.playing, pause, play]);

  const seek = useCallback(
    async (position: number) => {
      if (player && status.isLoaded) {
        try {
          await player.seekTo(position);
        } catch (error) {
          console.error("Seek failed:", error);
        }
      } else {
        console.warn("Cannot seek - player not loaded");
      }
    },
    [player, status.isLoaded, status.currentTime, status.duration],
  );

  const next = useCallback(() => {
    if (queue.length === 0) {
      console.warn("Cannot go to next - queue is empty");
      return;
    }

    let nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      nextIndex = 0;
    }

    setQueueIndex(nextIndex);
  }, [queue.length, queueIndex]);

  const previous = useCallback(() => {
    if (queue.length === 0) {
      console.warn("Cannot go to previous - queue is empty");
      return;
    }

    if (status.currentTime > 3) {
      seek(0);
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setQueueIndex(prevIndex);
  }, [queue.length, queueIndex, status.currentTime, seek]);

  const actions = useMemo<MusicActionsType>(
    () => ({
      play,
      pause,
      togglePlay,
      seek,
      loadAndPlay,
      next,
      previous,
    }),
    [play, pause, togglePlay, seek, loadAndPlay, next, previous],
  );

  const hasNext = queue.length > 0 && queueIndex < queue.length - 1;
  const hasPrevious = queue.length > 0 && queueIndex > 0;

  const state = useMemo<MusicStateType>(
    () => ({
      isPlaying: status.playing,
      currentSong,
      duration: status.duration,
      queue,
      currentIndex: queueIndex,
      hasNext,
      hasPrevious,
    }),
    [
      status.playing,
      currentSong,
      queue,
      queueIndex,
      hasNext,
      hasPrevious,
      status.duration,
    ],
  );

  const position = useMemo<MusicPositionType>(
    () => ({
      position: status.currentTime,
    }),
    [status.currentTime],
  );

  return (
    <MusicActionsContext.Provider value={actions}>
      <MusicStateContext.Provider value={state}>
        <MusicPositionContext.Provider value={position}>
          {children}
        </MusicPositionContext.Provider>
      </MusicStateContext.Provider>
    </MusicActionsContext.Provider>
  );
};
