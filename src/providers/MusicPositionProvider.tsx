import { createContext, useContext } from "react";

type MusicPositionContextType = {
  position: number;
  duration: number;
  isPlaying: boolean;
};

export const MusicPositionContext = createContext<MusicPositionContextType | undefined>(undefined);

export const useMusicPosition = () => {
  const context = useContext(MusicPositionContext);
  if (!context) {
    throw new Error("useMusicPosition must be used within a MusicProvider");
  }
  return context;
};
