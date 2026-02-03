import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

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
          contentFit="cover"
          cachePolicy="disk"
          transition={200}
        />
      ) : (
        <LinearGradient
          colors={["#00f2ff", "#4ECDC4"]}
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
