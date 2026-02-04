import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useMusicPosition } from "../../providers/MusicProvider";

export const PlayerProgress = ({
  onSeek,
}: {
  onSeek: (position: number) => Promise<void>;
}) => {
  const { position, duration } = useMusicPosition();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSeekTargetRef = useRef<number | null>(null);

  const displayPosition = isSeeking
    ? seekPosition
    : lastSeekTargetRef.current !== null
      ? lastSeekTargetRef.current
      : position;

  useEffect(() => {
    if (!isSeeking && lastSeekTargetRef.current !== null) {
      const diff = Math.abs(position - lastSeekTargetRef.current);
      if (diff < 1) {
        lastSeekTargetRef.current = null;
      }
    }
  }, [position, isSeeking]);

  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
    setSeekPosition(position);
  };

  const handleValueChange = (value: number) => {
    setSeekPosition(value);
  };

  const handleSlidingComplete = async (value: number) => {
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }

    lastSeekTargetRef.current = value;

    try {
      await onSeek(value);
    } catch (error) {
      console.error("Seek error:", error);
      lastSeekTargetRef.current = null;
    }

    seekTimeoutRef.current = setTimeout(() => {
      setIsSeeking(false);
    }, 1000);
  };

  return (
    <View style={styles.progressContainer}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration || 1}
        value={displayPosition}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#00f2ff"
        maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        thumbTintColor="#FFFFFF"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatDuration(displayPosition)}</Text>
        <Text style={styles.timeText}>{formatDuration(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
