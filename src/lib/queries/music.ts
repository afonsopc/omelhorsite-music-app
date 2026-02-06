import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Song, search } from "../../services/MusicService";
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
    async () => {
      const songs = await Song.list(filters);
      console.log(
        "useListSongsByAlbumQuery - fetched songs:",
        {
          albumName,
          artistName,
          filters,
          songsLength: songs.length,
        },
        songs,
      );
      return songs;
    },
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

export const useSearchQuery = (
  searchTerm: string,
  options?: { enabled?: boolean },
) => {
  return query([SEARCH, searchTerm], () => search(searchTerm), options);
};
