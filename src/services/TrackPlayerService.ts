import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode as TPRepeatMode,
  Event,
} from "react-native-track-player";
import { Song } from "./MusicService";

export const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      autoUpdateMetadata: true,
      autoHandleInterruptions: true,
    });

    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
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
    console.error("Error setting up TrackPlayer:", error);
    throw error;
  }
};

export const addTrack = async (song: Song) => {
  await TrackPlayer.add(Song.toTrack(song));
};

export const addTracks = async (songs: Song[]) => {
  await TrackPlayer.add(songs.map(Song.toTrack));
};

export const resetAndAddTracks = async (songs: Song[]) => {
  await TrackPlayer.reset();
  await addTracks(songs);
};

export const convertRepeatMode = (mode: TPRepeatMode): string =>
  ({
    [TPRepeatMode.Off]: "off",
    [TPRepeatMode.Queue]: "all",
    [TPRepeatMode.Track]: "one",
  })[mode] || "off";

export const convertToTPRepeatMode = (mode: string): TPRepeatMode =>
  ({
    off: TPRepeatMode.Off,
    all: TPRepeatMode.Queue,
    one: TPRepeatMode.Track,
  })[mode] || TPRepeatMode.Off;

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play);
  TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause);
  TrackPlayer.addEventListener(Event.RemoteNext, TrackPlayer.skipToNext);
  TrackPlayer.addEventListener(Event.RemoteStop, TrackPlayer.pause);
  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    TrackPlayer.skipToPrevious,
  );
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) =>
    TrackPlayer.seekTo(event.position),
  );
};
