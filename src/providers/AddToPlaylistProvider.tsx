import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Song, Playlist } from "../services/MusicService";
import {
  usePlaylistsQuery,
  useCreatePlaylistMutation,
  useAddSongToPlaylistMutation,
} from "../lib/queries/music";

type PlaylistContextType = {
  openAddToPlaylist: (song: Song) => void;
  openCreatePlaylist: (onCreated?: (playlist: Playlist) => void) => void;
};

const PlaylistContext = createContext<PlaylistContextType | null>(null);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within an AddToPlaylistProvider");
  }
  return context;
};

const CreatePlaylistModal = ({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated?: (playlist: Playlist) => void;
}) => {
  const [name, setName] = useState("");
  const createPlaylistMutation = useCreatePlaylistMutation();

  const handleCreate = useCallback(async () => {
    if (!name.trim()) return;
    try {
      const playlist = await createPlaylistMutation.mutateAsync({
        name: name.trim(),
      });
      setName("");
      onClose();
      onCreated?.(playlist);
    } catch (error) {
      console.error("Failed to create playlist:", error);
      Alert.alert("Error", "Failed to create playlist. Please try again.");
    }
  }, [name, createPlaylistMutation, onClose, onCreated]);

  const handleClose = useCallback(() => {
    setName("");
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Pressable
          style={styles.createModalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.createModalTitle}>New Playlist</Text>
          <TextInput
            style={styles.createModalInput}
            placeholder="Playlist name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
          />
          <View style={styles.createModalActions}>
            <TouchableOpacity
              style={styles.createModalCancelButton}
              onPress={handleClose}
            >
              <Text style={styles.createModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.createModalCreateButton,
                !name.trim() && styles.createModalCreateButtonDisabled,
              ]}
              onPress={handleCreate}
              disabled={!name.trim() || createPlaylistMutation.isPending}
            >
              {createPlaylistMutation.isPending ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.createModalCreateText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const AddToPlaylistModal = ({
  visible,
  song,
  onClose,
  onOpenCreate,
}: {
  visible: boolean;
  song: Song | null;
  onClose: () => void;
  onOpenCreate: () => void;
}) => {
  const playlistsQuery = usePlaylistsQuery();
  const addSongMutation = useAddSongToPlaylistMutation();

  const playlists = playlistsQuery.data ?? [];

  const handleAddToPlaylist = useCallback(
    async (playlist: Playlist) => {
      if (!song) return;
      try {
        await addSongMutation.mutateAsync({
          playlistId: playlist.id,
          songId: song.id,
        });
        onClose();
      } catch (error: any) {
        const isDuplicate =
          error?.data?.errors || error?.message?.includes("taken");
        if (isDuplicate) {
          Alert.alert("Already Added", "This song is already in the playlist.");
        } else {
          console.error("Failed to add song to playlist:", error);
          Alert.alert("Error", "Failed to add song. Please try again.");
        }
      }
    },
    [song, addSongMutation, onClose],
  );

  const handleCreateNew = useCallback(() => {
    onClose();
    onOpenCreate();
  }, [onClose, onOpenCreate]);

  if (!song) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.addModalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>Add to Playlist</Text>
            <Text style={styles.addModalSongName} numberOfLines={1}>
              {song.title} - {song.artist}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.createNewRow}
            onPress={handleCreateNew}
          >
            <View style={styles.createNewIcon}>
              <Ionicons name="add" size={24} color="#00f2ff" />
            </View>
            <Text style={styles.createNewText}>Create New Playlist</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {playlistsQuery.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : playlists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No playlists yet</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.playlistsList}
              showsVerticalScrollIndicator={false}
            >
              {playlists.map((playlist) => {
                const artworkUrl = playlist.artwork_fs_node_id
                  ? Playlist.artworkUrl(playlist)
                  : null;
                return (
                  <TouchableOpacity
                    key={playlist.id}
                    style={styles.playlistRow}
                    onPress={() => handleAddToPlaylist(playlist)}
                    disabled={addSongMutation.isPending}
                  >
                    {artworkUrl ? (
                      <Image
                        source={{ uri: artworkUrl }}
                        style={styles.playlistRowArtwork}
                        contentFit="cover"
                        cachePolicy="disk"
                        transition={200}
                      />
                    ) : (
                      <View style={styles.playlistRowPlaceholder}>
                        <Ionicons
                          name="musical-notes"
                          size={16}
                          color="#FFFFFF"
                        />
                      </View>
                    )}
                    <Text style={styles.playlistRowName} numberOfLines={1}>
                      {playlist.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const AddToPlaylistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [addToPlaylistSong, setAddToPlaylistSong] = useState<Song | null>(null);
  const [addToPlaylistVisible, setAddToPlaylistVisible] = useState(false);
  const [createPlaylistVisible, setCreatePlaylistVisible] = useState(false);
  const [onPlaylistCreated, setOnPlaylistCreated] = useState<
    ((playlist: Playlist) => void) | undefined
  >(undefined);
  const [pendingSong, setPendingSong] = useState<Song | null>(null);

  const openAddToPlaylist = useCallback((song: Song) => {
    setAddToPlaylistSong(song);
    setAddToPlaylistVisible(true);
  }, []);

  const closeAddToPlaylist = useCallback(() => {
    setAddToPlaylistVisible(false);
    setAddToPlaylistSong(null);
  }, []);

  const openCreatePlaylist = useCallback(
    (onCreated?: (playlist: Playlist) => void) => {
      setOnPlaylistCreated(() => onCreated);
      setCreatePlaylistVisible(true);
    },
    [],
  );

  const closeCreatePlaylist = useCallback(() => {
    setCreatePlaylistVisible(false);
    setOnPlaylistCreated(undefined);
  }, []);

  const handleOpenCreateFromAdd = useCallback(() => {
    setPendingSong(addToPlaylistSong);
    closeAddToPlaylist();
    openCreatePlaylist();
  }, [addToPlaylistSong, closeAddToPlaylist, openCreatePlaylist]);

  const addSongMutation = useAddSongToPlaylistMutation();

  const handlePlaylistCreated = useCallback(
    async (playlist: Playlist) => {
      onPlaylistCreated?.(playlist);
      if (pendingSong) {
        try {
          await addSongMutation.mutateAsync({
            playlistId: playlist.id,
            songId: pendingSong.id,
          });
        } catch (error) {
          console.error("Failed to add song to new playlist:", error);
        }
        setPendingSong(null);
      }
    },
    [onPlaylistCreated, pendingSong, addSongMutation],
  );

  const contextValue = useMemo(
    () => ({
      openAddToPlaylist,
      openCreatePlaylist,
    }),
    [openAddToPlaylist, openCreatePlaylist],
  );

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
      <AddToPlaylistModal
        visible={addToPlaylistVisible}
        song={addToPlaylistSong}
        onClose={closeAddToPlaylist}
        onOpenCreate={handleOpenCreateFromAdd}
      />
      <CreatePlaylistModal
        visible={createPlaylistVisible}
        onClose={closeCreatePlaylist}
        onCreated={handlePlaylistCreated}
      />
    </PlaylistContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  createModalContent: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    borderRadius: 16,
    padding: 24,
    minWidth: 320,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  createModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  createModalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  createModalActions: {
    flexDirection: "row",
    gap: 12,
  },
  createModalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  createModalCancelText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  createModalCreateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#00f2ff",
  },
  createModalCreateButtonDisabled: {
    opacity: 0.4,
  },
  createModalCreateText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
  addModalContent: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    borderRadius: 16,
    paddingTop: 24,
    paddingBottom: 8,
    minWidth: 320,
    maxWidth: 400,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  addModalHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  addModalSongName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  createNewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createNewIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0, 242, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  createNewText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00f2ff",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 24,
    marginVertical: 8,
  },
  loadingContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
  playlistsList: {
    maxHeight: 300,
  },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  playlistRowArtwork: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  playlistRowPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  playlistRowName: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
});
