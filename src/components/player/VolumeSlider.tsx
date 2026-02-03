import React from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

export const VolumeSlider = ({
  volume,
  onVolumeChange,
}: {
  volume: number;
  onVolumeChange: (volume: number) => void;
}) => {
  const getVolumeIcon = () => {
    if (volume === 0) return "volume-mute";
    if (volume < 0.5) return "volume-low";
    return "volume-high";
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name={getVolumeIcon()}
        size={18}
        color="rgba(255, 255, 255, 0.7)"
        style={styles.icon}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={onVolumeChange}
        minimumTrackTintColor="#00f2ff"
        maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
        thumbTintColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
  },
  icon: {
    marginRight: 8,
  },
  slider: {
    flex: 1,
    height: 24,
  },
});
