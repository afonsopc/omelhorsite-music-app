import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMusicState, useMusicActions } from "../providers/MusicProvider";
import { Song, Playlist, PlaylistSong } from "../services/MusicService";
import { GlassButton, GlassCard } from "../components/ui/GlassContainer";

export const HomeScreen = ({}: {}) => {
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadAndPlay } = useMusicActions();

  const recentSongsRef = useRef<Song[]>([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const songsData = await Song.list({
        modifiers: {
          order: "updated_at:desc",
          page: "1:10",
        },
      });

      if (songsData) {
        const songs = songsData || [];
        setRecentSongs(songs);
        recentSongsRef.current = songs;

        if (songs && songs.length > 0) {
          setCurrentlyPlaying(songs[0]);
        }
      } else {
        setRecentSongs([]);
        recentSongsRef.current = [];
      }

      const playlistsData = await Playlist.list();

      if (playlistsData) {
        const playlists = playlistsData || [];
        setPlaylists(playlists);
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      console.error("Failed to load home data:", error);
      setRecentSongs([]);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSongPress = useCallback(
    async (song: Song) => {
      try {
        await loadAndPlay(song, recentSongsRef.current);
        setCurrentlyPlaying(song);
      } catch (error) {
        console.error("Failed to play song:", error);
      }
    },
    [loadAndPlay],
  );

  const handlePlaylistPress = useCallback(
    async (playlist: Playlist) => {
      try {
        const data = await PlaylistSong.list(playlist.id);

        if (data && data.length > 0) {
          const songs = data
            .map((ps) => ps.song)
            .filter(
              (song): song is Song => song !== null && song !== undefined,
            );

          if (songs.length > 0) {
            await loadAndPlay(songs[0], songs);
          }
        } else {
          console.log("Failed to load playlist songs or playlist is empty");
        }
      } catch (error) {
        console.error("Failed to play playlist:", error);
      }
    },
    [loadAndPlay],
  );

  const NowPlayingSection = () => {
    const { currentSong, isPlaying, play, pause } = useMusicState();
    const songToDisplay = currentSong || currentlyPlaying;
    if (!songToDisplay) return null;

    const artworkUrl = Song.artworkUrl(songToDisplay);

    return (
      <GlassCard style={styles.nowPlayingCard}>
        <TouchableOpacity style={styles.nowPlayingContent} activeOpacity={0.9}>
          <View style={styles.albumArtContainer}>
            {artworkUrl ? (
              <Image
                source={{ uri: artworkUrl }}
                style={styles.albumArt}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.albumArtPlaceholder}>
                <Text style={styles.albumArtText}>
                  {songToDisplay.title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {songToDisplay.title}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {songToDisplay.artist || "Unknown Artist"}
            </Text>
            <Text style={styles.songAlbum} numberOfLines={1}>
              {songToDisplay.album || "Unknown Album"}
            </Text>
            <Text style={styles.songDuration}>
              {formatDuration(songToDisplay.duration)}
            </Text>
          </View>

          <GlassButton
            style={styles.playButton}
            tint="accent"
            onPress={async () => {
              try {
                isPlaying ? pause() : play();
              } catch (error) {
                console.error("Failed to toggle playback:", error);
              }
            }}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#FF6B6B"
            />
          </GlassButton>
        </TouchableOpacity>
      </GlassCard>
    );
  };

  const RecentSongsSection = () => {
    if (!recentSongs || recentSongs.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <GlassCard style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>No recent songs found</Text>
          </GlassCard>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {recentSongs.map((song) => {
            const artworkUrl = Song.artworkUrl(song);

            return (
              <TouchableOpacity
                key={song.id}
                style={styles.songItem}
                onPress={() => handleSongPress(song)}
              >
                <GlassCard style={styles.songCard}>
                  {artworkUrl ? (
                    <Image
                      source={{ uri: artworkUrl }}
                      style={styles.songArtwork}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.songArtworkPlaceholder}>
                      <Text style={styles.songArtworkText}>
                        {song.title.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.songInfoMini}>
                    <Text style={styles.songTitleMini} numberOfLines={1}>
                      {song.title}
                    </Text>
                    <Text style={styles.songArtistMini} numberOfLines={1}>
                      {song.artist || "Unknown Artist"}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const PlaylistsSection = () => {
    if (playlists.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Playlists</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {playlists.map((playlist) => {
            const artworkUrl = Playlist.artworkUrl(playlist);

            return (
              <TouchableOpacity
                key={playlist.id}
                style={styles.playlistItem}
                onPress={() => handlePlaylistPress(playlist)}
              >
                <GlassCard style={styles.playlistCard}>
                  {artworkUrl ? (
                    <Image
                      source={{ uri: artworkUrl }}
                      style={styles.playlistArtwork}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.playlistArtworkPlaceholder}>
                      <Text style={styles.playlistArtworkText}>
                        {playlist.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName} numberOfLines={1}>
                      {playlist.name}
                    </Text>
                    <Text style={styles.playlistMeta}>
                      {playlist.song_count || 0} songs
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading your music...</Text>
        </View>
      </View>
    );
  }

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

        <NowPlayingSection />
        <RecentSongsSection />
        <PlaylistsSection />

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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  nowPlayingCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 20,
  },
  nowPlayingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  albumArtContainer: {
    marginRight: 16,
  },
  albumArt: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  albumArtPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 107, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  albumArtText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  songInfo: {
    flex: 1,
    marginRight: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
  },
  songDuration: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
    marginLeft: 2,
  },
  songItem: {
    marginRight: 16,
  },
  songCard: {
    width: 150,
    padding: 12,
  },
  songArtwork: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  songArtworkPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  songArtworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  songInfoMini: {
    flex: 1,
  },
  songTitleMini: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  songArtistMini: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  playlistItem: {
    marginRight: 16,
  },
  playlistCard: {
    width: 150,
    padding: 12,
  },
  playlistArtwork: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  playlistArtworkPlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(240, 147, 251, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  playlistArtworkText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  playlistMeta: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  emptyStateCard: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});
