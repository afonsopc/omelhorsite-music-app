import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Song } from "../services/MusicService";
import { useMusicActions } from "../providers/MusicProvider";
import { usePlaylistSongsQuery } from "../lib/queries/music";
import { usePlaylist } from "../providers/AddToPlaylistProvider";
import { PlaylistHeader } from "../components/PlaylistScreen/PlaylistHeader";
import { PlaylistTracksSection } from "../components/PlaylistScreen/PlaylistTracksSection";
import { SongListItemSkeleton } from "../components/Skeletons/SongListItemSkeleton";
import {
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useRemoveSongFromPlaylistMutation,
} from "../lib/queries/music";
import { Playlist } from "../services/MusicService";

export const PlaylistScreen = () => {
  const router = useRouter();
  const { id, name, from, query } = useLocalSearchParams<{
    id?: string | string[];
    name?: string | string[];
    from?: string | string[];
    query?: string | string[];
  }>();

  const playlistId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    return raw ? parseInt(raw, 10) : 0;
  }, [id]);

  const playlistName = useMemo(() => {
    if (Array.isArray(name)) return name[0] || "Playlist";
    return name || "Playlist";
  }, [name]);

  const origin = useMemo(() => {
    if (Array.isArray(from)) return from[0] || "";
    return from || "";
  }, [from]);

  const searchQuery = useMemo(() => {
    if (Array.isArray(query)) return query[0] || "";
    return query || "";
  }, [query]);

  const { loadAndPlay } = useMusicActions();
  const { openAddToPlaylist, openCreatePlaylist } = usePlaylist();

  const playlistSongsQuery = usePlaylistSongsQuery(playlistId);
  const deletePlaylistMutation = useDeletePlaylistMutation();
  const updatePlaylistMutation = useUpdatePlaylistMutation();
  const removeSongMutation = useRemoveSongFromPlaylistMutation();

  const [currentPlaylistName, setCurrentPlaylistName] = useState(playlistName);

  const playlistSongs = playlistSongsQuery.data ?? [];
  const allSongs = useMemo(
    () => playlistSongs.map((ps) => ps.song),
    [playlistSongs],
  );

  const playlist: Playlist = useMemo(
    () => ({
      id: playlistId,
      name: currentPlaylistName,
      user_id: "",
      created_at: "",
      updated_at: "",
    }),
    [playlistId, currentPlaylistName],
  );

  const handlePlayAll = useCallback(async () => {
    if (allSongs.length === 0) return;
    try {
      await loadAndPlay(allSongs[0], allSongs);
    } catch (error) {
      console.error("Failed to play playlist:", error);
    }
  }, [loadAndPlay, allSongs]);

  const handleShuffle = useCallback(async () => {
    if (allSongs.length === 0) return;
    try {
      const shuffled = [...allSongs].sort(() => Math.random() - 0.5);
      await loadAndPlay(shuffled[0], shuffled);
    } catch (error) {
      console.error("Failed to shuffle playlist:", error);
    }
  }, [loadAndPlay, allSongs]);

  const handlePlaySong = useCallback(
    async (song: Song) => {
      try {
        await loadAndPlay(song, allSongs);
      } catch (error) {
        console.error("Failed to play song:", error);
      }
    },
    [loadAndPlay, allSongs],
  );

  const handleSongLongPress = useCallback(
    (song: Song, playlistSongId: number) => {
      Alert.alert(song.title, undefined, [
        {
          text: "Remove from Playlist",
          style: "destructive",
          onPress: async () => {
            try {
              await removeSongMutation.mutateAsync(playlistSongId);
            } catch (error) {
              console.error("Failed to remove song:", error);
            }
          },
        },
        {
          text: "Add to Another Playlist",
          onPress: () => openAddToPlaylist(song),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [removeSongMutation, openAddToPlaylist],
  );

  const handleEdit = useCallback(() => {
    Alert.prompt(
      "Rename Playlist",
      "Enter a new name for this playlist",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: async (newName?: string) => {
            if (!newName?.trim()) return;
            try {
              await updatePlaylistMutation.mutateAsync({
                id: playlistId,
                data: { name: newName.trim() },
              });
              setCurrentPlaylistName(newName.trim());
            } catch (error) {
              console.error("Failed to rename playlist:", error);
            }
          },
        },
      ],
      "plain-text",
      currentPlaylistName,
    );
  }, [playlistId, currentPlaylistName, updatePlaylistMutation]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Playlist",
      `Are you sure you want to delete "${currentPlaylistName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlaylistMutation.mutateAsync(playlistId);
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/playlists");
              }
            } catch (error) {
              console.error("Failed to delete playlist:", error);
            }
          },
        },
      ],
    );
  }, [playlistId, currentPlaylistName, deletePlaylistMutation, router]);

  const handleBackPress = useCallback(() => {
    if (origin === "search") {
      router.replace({
        pathname: "/(tabs)/search",
        params: { q: searchQuery },
      });
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/playlists");
  }, [origin, searchQuery, router]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <PlaylistHeader
          playlist={playlist}
          songCount={allSongs.length}
          onPlayAll={handlePlayAll}
          onShuffle={handleShuffle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {playlistSongsQuery.isLoading ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tracks</Text>
            {Array.from({ length: 10 }).map((_, i) => (
              <SongListItemSkeleton key={i} />
            ))}
          </View>
        ) : (
          <PlaylistTracksSection
            playlistSongs={playlistSongs}
            onSongPress={handlePlaySong}
            onSongLongPress={handleSongLongPress}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
});
