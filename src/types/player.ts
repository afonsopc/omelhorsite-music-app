import { Song } from "../services/MusicService";

export enum RepeatMode {
  Off = "off",
  All = "all",
  One = "one",
}

export type PlaybackSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0;

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [
  0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0,
];

export type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  queue: Song[];
  currentIndex: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackSpeed: PlaybackSpeed;
};
