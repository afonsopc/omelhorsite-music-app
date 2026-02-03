import { createContext, useContext } from "react";
import { Song } from "../services/MusicService";
import { PlaybackSpeed } from "../types/player";

type MusicActionsContextType = {
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
  setVolume: (volume: number) => Promise<void>;
};

export const MusicActionsContext = createContext<MusicActionsContextType | undefined>(undefined);

export const useMusicActions = () => {
  const context = useContext(MusicActionsContext);
  if (!context) {
    throw new Error("useMusicActions must be used within a MusicProvider");
  }
  return context;
};
