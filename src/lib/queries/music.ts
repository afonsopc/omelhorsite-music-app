import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Song } from "../../services/MusicService";
import { ListFilters } from "../../services/BackendService";

export const LIST_SONGS = "listSongs";
export const GET_SONG = "getSong";
export const LIST_ARTISTS = "listArtists";
export const LIST_ALBUMS = "listAlbums";
export const LIST_PLAYLISTS = "listPlaylists";
export const GET_PLAYLIST = "getPlaylist";
export const LIST_PLAYLIST_SONGS = "listPlaylistSongs";
export const LIST_ARTIST_PICTURES = "listArtistPictures";

const query = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn,
    enabled: options?.enabled,
  });
};

export const useGetSongQuery = (
  id: number,
  options?: Record<string, string>,
) => {
  return query(GET_SONG + id, () => Song.get(id), options);
};

export const useListSongsQuery = (
  filters: ListFilters<Song> = {},
  options?: Record<string, string>,
) => query(LIST_SONGS, () => Song.list(filters), options);

export const useListArtistsQuery = (
  filters: ListFilters<Song> = {},
  options?: Record<string, string>,
) => {
  return query(LIST_ARTISTS, () => Song.listArtists(filters), options);
};

export const useListAlbumsQuery = (
  filters: ListFilters<Song> = {},
  options?: Record<string, string>,
) => {
  return query(LIST_ALBUMS, () => Song.listAlbums(filters), options);
};

export const useListSongsByArtistQuery = (
  artistName: string,
  options?: Record<string, string>,
) => {
  return query(
    LIST_SONGS + artistName,
    () => Song.list({ exact_search: { artist: artistName } }),
    options,
  );
};

export const useListAlbumsByArtistQuery = (
  artistName: string,
  options?: Record<string, string>,
) => {
  return query(
    LIST_ALBUMS + artistName,
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
    : { exact_search: { album: albumName } };
  return query(
    LIST_SONGS + albumName + (artistName || ""),
    () => Song.list(filters),
    options,
  );
};

export const useArtitstPictureQuery = (
  artistName: string,
  options?: Record<string, string>,
) => {
  return query(
    LIST_ARTIST_PICTURES + artistName,
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
