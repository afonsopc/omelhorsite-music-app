import { Track } from "react-native-track-player";
import {
  backend,
  FALLBACK_IMAGE_URL,
  getAuthenticatedBackendUrl,
  ListFilters,
} from "./BackendService";
import { FsNode } from "./FsNodeService";

export type Song = {
  id: number;
  title: string;
  album: string | null;
  artist: string | null;
  duration: number;
  track_number: number | null;
  disc_number: number | null;
  year: number | null;
  position: number;
  audio_fs_node_id: string;
  user_id: string;
  artwork_fs_node_id?: string;
  compressed_artwork_fs_node_id?: string;
  compressed_audio_fs_node_id?: string;
  created_at: string;
  updated_at: string;
};

export type Playlist = {
  id: number;
  name: string;
  user_id: string;
  artwork_fs_node_id?: string;
  song_count?: number;
  total_duration?: number;
  created_at: string;
  updated_at: string;
};

export type PlaylistSong = {
  id: number;
  playlist_id: number;
  song_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  song: Song;
};

export type Album = {
  name: string | null;
  artist: string | null;
  artwork_fs_node_id: string | null;
};

export const Song = {
  list: (filters: ListFilters<Song> = {}) =>
    backend<Song[]>("songs", "GET", filters).then((response) => {
      console.log("Song.list response:", response);
      return response.data;
    }),
  get: (id: Song["id"]) =>
    backend<Song>(`songs/${id}`, "GET").then((response) => response.data),
  update: (id: Song["id"], data: Partial<Song>) =>
    backend<Song>(`songs/${id}`, "PATCH", data).then(
      (response) => response.data,
    ),
  delete: (id: Song["id"]) =>
    backend<void>(`songs/${id}`, "DELETE").then((response) => response.data),
  listArtists: (filters: ListFilters<Song> = {}) =>
    backend<string[]>("songs/artists", "GET", filters).then(
      (response) => response.data,
    ),
  listAlbums: (filters: ListFilters<Song> = {}) =>
    backend<Album[]>("songs/albums", "GET", filters).then(
      (response) => response.data,
    ),
  getArtistPictures: (artistName: string) =>
    backend<{
      pictures: {
        picture?: string;
        picture_big?: string;
        picture_medium?: string;
        picture_small?: string;
        picture_xl?: string;
      }[];
    }>(
      `songs/artist_pictures?name=${encodeURIComponent(artistName)}`,
      "GET",
    ).then((response) => response.data.pictures),
  getArtistPicture: (artistName: string) =>
    Song.getArtistPictures(artistName).then(
      (pictures) =>
        pictures[0]?.picture_xl ||
        pictures[0]?.picture_big ||
        pictures[0]?.picture_medium ||
        pictures[0]?.picture_small ||
        pictures[0]?.picture ||
        FALLBACK_IMAGE_URL,
    ),
  audioUrl: (song: Song) =>
    FsNode.dataUrl(song.compressed_audio_fs_node_id || song.audio_fs_node_id),
  artworkUrl: (song: Song) => {
    const fileId =
      song.compressed_artwork_fs_node_id || song.artwork_fs_node_id;
    if (!fileId) return FALLBACK_IMAGE_URL;
    return FsNode.dataUrl(fileId);
  },
  toTrack: (song: Song): Track => ({
    id: song.id.toString(),
    url: Song.audioUrl(song),
    artwork: Song.artworkUrl(song),
    title: song.title || "Unknown Title",
    artist: song.artist || "Unknown Artist",
    album: song.album || "Unknown Album",
    duration: song.duration,
    isLiveStream: false,
  }),
  is: (variable: any): variable is Song => {
    return (
      !!variable &&
      typeof variable === "object" &&
      "title" in variable &&
      "artist" in variable &&
      "album" in variable
    );
  },
};

export const Playlist = {
  list: (filters: ListFilters<Playlist> = {}) =>
    backend<Playlist[]>("playlists", "GET", filters).then(
      (response) => response.data,
    ),
  get: (id: Playlist["id"]) =>
    backend<Playlist>(`playlists/${id}`, "GET").then(
      (response) => response.data,
    ),
  create: (name: string, artworkFsNodeId?: Playlist["artwork_fs_node_id"]) =>
    backend<Playlist>("playlists", "POST", {
      name,
      artwork_fs_node_id: artworkFsNodeId,
    }).then((response) => response.data),
  update: (id: Playlist["id"], data: Partial<Playlist>) =>
    backend<Playlist>(`playlists/${id}`, "PATCH", data).then(
      (response) => response.data,
    ),
  delete: (id: Playlist["id"]) =>
    backend<void>(`playlists/${id}`, "DELETE").then(
      (response) => response.data,
    ),
  reorder: (id: Playlist["id"], songIds: number[]) =>
    backend<void>(`playlists/${id}/reorder`, "POST", {
      song_ids: songIds,
    }).then((response) => response.data),
  artworkUrl: (playlist: Playlist) => {
    if (!playlist.artwork_fs_node_id) return FALLBACK_IMAGE_URL;
    return FsNode.dataUrl(playlist.artwork_fs_node_id);
  },
  is: (variable: any): variable is Playlist => {
    return (
      !!variable &&
      typeof variable === "object" &&
      "name" in variable &&
      "user_id" in variable
    );
  },
};

export const PlaylistSong = {
  list: (playlistId: Playlist["id"]) =>
    backend<PlaylistSong[]>(
      `playlist_songs?playlist_id=${playlistId}`,
      "GET",
    ).then((response) => response.data),
  create: (playlistId: Playlist["id"], songId: Song["id"]) =>
    backend<PlaylistSong>("playlist_songs", "POST", {
      playlist_id: playlistId,
      song_id: songId,
    }).then((response) => response.data),
  delete: (id: PlaylistSong["id"]) =>
    backend<void>(`playlist_songs/${id}`, "DELETE").then(
      (response) => response.data,
    ),
  is: (variable: any): variable is PlaylistSong => {
    return (
      !!variable &&
      typeof variable === "object" &&
      "playlist_id" in variable &&
      "song_id" in variable
    );
  },
};

export const search = async (query: string) => {
  const [songsData, songsByArtist, songsByAlbum, playlistsData] =
    await Promise.all([
      Song.list({ search: { title: query } }),
      Song.list({ search: { artist: query } }),
      Song.list({ search: { album: query } }),
      Playlist.list({ search: { name: query } }),
    ]);

  const artistSet = new Set<string>();
  songsByArtist?.forEach((song) => {
    if (song.artist) artistSet.add(song.artist);
  });

  const albumMap = new Map<string, Album>();
  songsByAlbum?.forEach((song) => {
    if (song.album) {
      const key = `${song.album}-${song.artist}`;
      if (!albumMap.has(key)) {
        albumMap.set(key, {
          name: song.album,
          artist: song.artist,
          artwork_fs_node_id: song.artwork_fs_node_id || null,
        });
      }
    }
  });

  return {
    songs: songsData || [],
    artists: Array.from(artistSet),
    albums: Array.from(albumMap.values()),
    playlists: playlistsData || [],
  };
};
