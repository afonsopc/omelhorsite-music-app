import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { RandomSongsSection } from "../components/HomeScreen/RandomSongsSection";
import { RandomArtistsSection } from "../components/HomeScreen/RandomArtistsSection";
import { RandomAlbumsSection } from "../components/HomeScreen/RandomAlbumsSection";

export const HomeScreen = ({}: {}) => {
  const router = useRouter();

  return (
    <View style={[styles.container, styles.darkBackground]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
          </Text>
          <Text style={styles.headerSubtitle}>Welcome back to your music</Text>
        </View>

        <RandomSongsSection />
        <RandomArtistsSection
          onArtistPress={(artistName) =>
            router.push({
              pathname: "/artist/[name]",
              params: { name: artistName },
            })
          }
        />
        <RandomAlbumsSection
          onAlbumPress={(albumName, artist) =>
            router.push({
              pathname: "/album/[name]",
              params: { name: albumName, artist },
            })
          }
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
});
