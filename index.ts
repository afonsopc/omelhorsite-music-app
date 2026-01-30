import TrackPlayer from "react-native-track-player";
import { playbackService } from "./src/services/TrackPlayerService";

TrackPlayer.registerPlaybackService(() => playbackService);

import "expo-router/entry";
