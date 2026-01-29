import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

export const PlayerArtwork = ({
  artworkUrl,
  title,
}: {
  artworkUrl: string | null;
  title: string;
}) => {
  return (
    <View style={styles.artworkContainer}>
      {artworkUrl ? (
        <Image
          source={{ uri: artworkUrl }}
          style={styles.artwork}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={["#FF6B6B", "#4ECDC4"]}
          style={styles.artworkPlaceholder}
        >
          <Text style={styles.artworkText}>
            {title.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  artworkContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 16,
  },
  artworkPlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
