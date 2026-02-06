import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Song,
  Playlist,
  PlaylistSong,
  search,
} from "../../services/MusicService";
import { ListFilters } from "../../services/BackendService";

export const LIST_SONGS = "listSongs";
export const GET_SONG = "getSong";
export const LIST_ARTISTS = "listArtists";
export const LIST_ALBUMS = "listAlbums";
export const LIST_PLAYLISTS = "listPlaylists";
export const GET_PLAYLIST = "getPlaylist";
export const LIST_PLAYLIST_SONGS = "listPlaylistSongs";
export const LIST_ARTIST_PICTURES = "listArtistPictures";
export const SEARCH = "search";

const query = <T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled,
  });
};

export const useGetSongQuery = (
  id: number,
  options?: Record<string, string>,
) => {
  return query([GET_SONG, id], () => Song.get(id), options);
};

export const useListSongsQuery = (
  filters: ListFilters<Song> = {},
  options?: Record<string, string>,
) => query([LIST_SONGS, filters], () => Song.list(filters), options);

export const useListArtistsQuery = (
  filters: ListFilters<Song> = {},
  options?: Record<string, string>,
) => {
  return query(
    [LIST_ARTISTS, filters],
    () => Song.listArtists(filters),
    options,
  );
};

export const useListAlbumsQuery = (
  filters: ListFilters<Song> = {},
  options?: Record<string, string>,
) => {
  return query([LIST_ALBUMS, filters], () => Song.listAlbums(filters), options);
};

export const useListSongsByArtistQuery = (
  artistName: string,
  options?: Record<string, string>,
) => {
  return query(
    [LIST_SONGS, "byArtist", artistName],
    () => Song.list({ exact_search: { artist: artistName } }),
    options,
  );
};

export const useListAlbumsByArtistQuery = (
  artistName: string,
  options?: Record<string, string>,
) => {
  return query(
    [LIST_ALBUMS, "byArtist", artistName],
    () => Song.listAlbums({ exact_search: { artist: artistName } }),
    options,
  );
};

export const useListSongsByAlbumQuery = (
  albumName: string,
  artistName?: string,
  options?: Record<string, string>,
) => {
  const filters = artistName
    ? { exact_search: { album: albumName, artist: artistName } }
    : { exact_search: { album: albumName, artist: null } };
  return query(
    [LIST_SONGS, "byAlbum", albumName, artistName],
    () => Song.list(filters),
    options,
  );
};

export const useArtitstPictureQuery = (
  artistName: string,
  options?: Record<string, string>,
) => {
  return query(
    [LIST_ARTIST_PICTURES, artistName],
    () => Song.getArtistPicture(artistName),
    options,
  );
};

export const useUpdateSongMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Song> }) => {
      return Song.update(id, data);
    },
    onSuccess: (song) => {
      queryClient.invalidateQueries({ queryKey: [LIST_SONGS] });
      queryClient.invalidateQueries({ queryKey: [GET_SONG] });
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

export const usePlaylistsQuery = () => {
  return query([LIST_PLAYLISTS], () => Playlist.list());
};

export const usePlaylistSongsQuery = (
  playlistId: number,
  options?: { enabled?: boolean },
) => {
  return query(
    [LIST_PLAYLIST_SONGS, playlistId],
    () => PlaylistSong.list(playlistId),
    { enabled: options?.enabled ?? !!playlistId },
  );
};

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      return Playlist.create(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
      queryClient.invalidateQueries({ queryKey: [SEARCH] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
      queryClient.invalidateQueries({ queryKey: [SEARCH] });
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
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLIST_SONGS] });
      queryClient.invalidateQueries({ queryKey: [SEARCH] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLIST_SONGS] });
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
    },
  });
};

export const useRemoveSongFromPlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return PlaylistSong.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLIST_SONGS] });
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLISTS] });
    },
  });
};

export const useReorderPlaylistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      songIds,
    }: {
      id: number;
      songIds: number[];
    }) => {
      return Playlist.reorder(id, songIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LIST_PLAYLIST_SONGS] });
    },
  });
};

export const useSearchQuery = (
  searchTerm: string,
  options?: { enabled?: boolean },
) => {
  return query([SEARCH, searchTerm], () => search(searchTerm), options);
};
