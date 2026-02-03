import { createContext, useContext } from "react";
import { Song } from "../services/MusicService";
import { RepeatMode, PlaybackSpeed } from "../types/player";

type MusicStateContextType = {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackSpeed: PlaybackSpeed;
};

export const MusicStateContext = createContext<MusicStateContextType | undefined>(undefined);

export const useMusicState = () => {
  const context = useContext(MusicStateContext);
  if (!context) {
    throw new Error("useMusicState must be used within a MusicProvider");
  }
  return context;
};
