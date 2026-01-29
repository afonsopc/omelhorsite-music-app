import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Song, Playlist, PlaylistSong } from "../../services/MusicService";
import { ListFilters } from "../../services/BackendService";

export const LIST_SONGS = "listSongs";
export const GET_SONG = "getSong";
export const LIST_ARTISTS = "listArtists";
export const LIST_ALBUMS = "listAlbums";
export const LIST_PLAYLISTS = "listPlaylists";
export const GET_PLAYLIST = "getPlaylist";
export const LIST_PLAYLIST_SONGS = "listPlaylistSongs";
export const LIST_ARTIST_PICTURES = "listArtistPictures";

export const useListSongsQuery = (filters: ListFilters<Song> = {}) => {
  return useQuery({
    queryKey: [LIST_SONGS, filters],
    queryFn: async () => {
      return Song.list(filters);
    },
  });
};

export const useGetSongQuery = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [GET_SONG, id],
    queryFn: async () => {
      return Song.get(id);
    },
    enabled: options?.enabled,
  });
};

export const useListArtistsQuery = () => {
  return useQuery({
    queryKey: [LIST_ARTISTS],
    queryFn: async () => {
      return Song.listArtists();
    },
  });
};

export const useListAlbumsQuery = () => {
  return useQuery({
    queryKey: [LIST_ALBUMS],
    queryFn: async () => {
      return Song.listAlbums();
    },
  });
};

export const useArtistPicturesQuery = (artistName: string) => {
  return useQuery({
    queryKey: [LIST_ARTIST_PICTURES, artistName],
    queryFn: async () => {
      return Song.getArtistPictures(artistName);
    },
  });
};

export const useUpdateSongMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Song> }) => {
      return Song.update(id, data);
    },
    onSuccess: (song) => {
      queryClient.invalidateQueries({ queryKey: [LIST_SONGS] });
      queryClient.invalidateQueries({ queryKey: [GET_SONG, song.id] });
      queryClient.invalidateQueries({ queryKey: [LIST_ARTISTS] });
      queryClient.invalidateQueries({ queryKey: [LIST_ALBUMS] });
    },
  });
};

export const useDeleteSongMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return Song.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_SONGS] });
      queryClient.invalidateQueries({ queryKey: [LIST_ARTISTS] });
      queryClient.invalidateQueries({ queryKey: [LIST_ALBUMS] });
    },
  });
};

export const useListPlaylistsQuery = () => {
  return useQuery({
    queryKey: [LIST_PLAYLISTS],
    queryFn: async () => {
      return Playlist.list();
    },
  });
};

export const useGetPlaylistQuery = (
  id: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [GET_PLAYLIST, id],
    queryFn: async () => {
      return Playlist.get(id);
    },
    enabled: options?.enabled,
  });
};

export const useListPlaylistSongsQuery = (
  playlistId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [LIST_PLAYLIST_SONGS, playlistId],
    queryFn: async () => {
      return PlaylistSong.list(playlistId);
    },
    enabled: options?.enabled,
  });
};

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      artworkFsNodeId,
    }: {
      name: string;
      artworkFsNodeId?: string;
    }) => {
      return Playlist.create(name, artworkFsNodeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
    },
  });
};

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Playlist>;
    }) => {
      return Playlist.update(id, data);
    },
    onSuccess: (playlist) => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
      queryClient.invalidateQueries({ queryKey: [GET_PLAYLIST, playlist.id] });
    },
  });
};

export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return Playlist.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
    },
  });
};

export const useReorderPlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, songIds }: { id: number; songIds: number[] }) => {
      return Playlist.reorder(id, songIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [LIST_PLAYLIST_SONGS, variables.id],
      });
    },
  });
};

export const useAddSongToPlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playlistId,
      songId,
    }: {
      playlistId: number;
      songId: number;
    }) => {
      return PlaylistSong.create(playlistId, songId);
    },
    onSuccess: (playlistSong) => {
      queryClient.invalidateQueries({
        queryKey: [LIST_PLAYLIST_SONGS, playlistSong.playlist_id],
      });
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
    },
  });
};

export const useRemoveSongFromPlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      playlistId,
    }: {
      id: number;
      playlistId: number;
    }) => {
      return PlaylistSong.delete(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [LIST_PLAYLIST_SONGS, variables.playlistId],
      });
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
    },
  });
};
