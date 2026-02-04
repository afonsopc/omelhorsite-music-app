import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

export const CompactProgressSlider = ({
  position,
  duration,
  onSeek,
  onDisplayPositionChange,
}: {
  position: number;
  duration: number;
  onSeek: (position: number) => Promise<void>;
  onDisplayPositionChange?: (displayPosition: number) => void;
}) => {
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
    onDisplayPositionChange?.(displayPosition);
  }, [displayPosition, onDisplayPositionChange]);

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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 24,
    justifyContent: "center",
  },
  slider: {
    width: "100%",
    height: 24,
  },
});
