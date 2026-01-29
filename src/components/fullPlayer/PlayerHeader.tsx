import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface PlayerHeaderProps {
  onBack: () => void;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({ onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
        <Text style={styles.backButton}>⌄</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Now Playing</Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
