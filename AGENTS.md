# AGENTS.md

Configuration and instructions for AI agents working with this codebase.

## Project Identity

**Name:** omelhorsite Music App  
**Type:** React Native (Expo) mobile application  
**Purpose:** Music streaming app with full background playback support  
**Backend:** omelhorsite.pt REST API  
**Primary Technologies:** React Native, Expo Router, react-native-track-player, TanStack Query

## Quick Start

```bash
npm start              # Development server
npm run ios            # iOS simulator
npm run android        # Android emulator
npm run web            # Web browser
```

## Critical Architecture Rules

### DO
- ✅ Use TanStack Query hooks from `src/lib/queries/music.ts` for all API calls
- ✅ Navigate with `router.push({ pathname, params })` pattern
- ✅ Access playback controls via `useMusicActions()` hook
- ✅ Wrap async operations in try/catch blocks
- ✅ Use type guards (`.is()` methods) for API response validation
- ✅ Invalidate queries after mutations: `queryClient.invalidateQueries()`
- ✅ Put screens in `src/screens/` and their UI sections in `src/components/{ScreenName}/`

### DON'T
- ❌ Never call `MusicService` methods directly in components (use query hooks)
- ❌ Never modify provider hierarchy order (QueryProvider must be outermost)
- ❌ Never bypass authentication checks (use `useAuth()` hook)
- ❌ Never modify TrackPlayer setup outside `MusicProvider` or `TrackPlayerService`
- ❌ Never use `function` keyword - use arrow functions with `const` instead
- ❌ Never use `React.FC` type annotation
- ❌ Never use `interface` - use `type` keyword instead
- ❌ Avoid explicit return types on functions (let TypeScript infer them)

## System Architecture Map

### Data Flow
```
User Interaction
  ↓
Screen Component (uses query hooks)
  ↓
TanStack Query (src/lib/queries/music.ts)
  ↓
Service Layer (MusicService.ts)
  ↓
Backend API (BackendService.ts)
  ↓
omelhorsite.pt/backend
```

### Playback Flow
```
User Action
  ↓
Music Provider Actions (useMusicActions)
  ↓
TrackPlayerService
  ↓
react-native-track-player
  ↓
Native Audio System
```

### Provider Stack (Outer → Inner)
```
QueryProvider (TanStack Query)
  └─ AuthProvider (token + AsyncStorage)
      └─ MusicProvider (TrackPlayer state)
          └─ TabBarProvider (UI visibility)
              └─ App Content
```

## Navigation Structure

**File-based routing via Expo Router:**

- `app/_layout.tsx` - Root layout with providers + floating player modal
- `app/index.tsx` - Entry point with auth redirect logic
- `app/(tabs)/_layout.tsx` - Tab navigation (Home, Search, Playlists, Profile)
- `app/(tabs)/home.tsx` - Home screen
- `app/(tabs)/search.tsx` - Search screen
- `app/(tabs)/playlists.tsx` - Playlists screen
- `app/(tabs)/profile.tsx` - Profile screen
- `app/album/[name].tsx` - Album detail page
- `app/artist/[name].tsx` - Artist detail page
- `app/auth.tsx` - Login/authentication screen

**Navigation pattern:**
```typescript
router.push({ 
  pathname: '/album/[name]', 
  params: { name: albumName } 
});

// In target screen:
const { name } = useLocalSearchParams<{ name: string }>();
```

## State Management Guide

### Server State (TanStack Query)

**Location:** `src/lib/queries/music.ts`

**Configuration:**
- Stale time: 25 seconds
- No automatic retries
- No refetch on window focus

**Available Hooks:**
- `useSongsQuery()` - List songs with optional filters
- `useSongQuery(id)` - Get single song
- `useArtistsQuery()` - List all artists
- `useAlbumsQuery()` - List all albums
- `usePlaylistsQuery()` - List playlists
- `usePlaylistQuery(id)` - Get playlist with songs
- `usePlaylistSongsQuery(playlistId)` - Get playlist songs only

**Query Keys (exported constants):**
```typescript
QUERY_KEYS.songs
QUERY_KEYS.song(id)
QUERY_KEYS.artists
QUERY_KEYS.albums
QUERY_KEYS.playlists
QUERY_KEYS.playlist(id)
QUERY_KEYS.playlistSongs(playlistId)
```

### App State (React Context)

**Auth Context:**
```typescript
const { token, login, logout } = useAuth();
```

**Music Context (choose the right hook):**
```typescript
// Full context (use sparingly - causes re-renders)
const { state, actions } = useMusic();

// Read-only state
const { isPlaying, currentTrack, queue } = useMusicState();

// Actions only (no re-renders on state changes)
const { play, pause, next, previous, seek } = useMusicActions();

// Position tracking (updates frequently)
const { position, duration } = useMusicPosition();
```

**Tab Bar Context:**
```typescript
const { isTabBarVisible, setTabBarVisible } = useTabBar();
```

## Service Layer Reference

### BackendService (`src/services/BackendService.ts`)

**Base URL:** `https://omelhorsite.pt/backend`

**Auth:** Bearer token from AsyncStorage

**Special behavior:** Converts `null` filter values to `\b` marker

**Usage:**
```typescript
import { backend } from '@/services/BackendService';

const response = await backend('/api/songs', {
  method: 'GET',
  params: { artist: 'Queen' }
});
```

### MusicService (`src/services/MusicService.ts`)

**Models:**
- `Song` - Song entity with audio/artwork URLs
- `Album` - Album grouping
- `Playlist` - User-created playlists
- `PlaylistSong` - Junction table for playlist songs

**Common Methods:**
```typescript
// Lists
const songs = await Song.list({ artist: 'Queen', limit: 50 });
const artists = await Song.listArtists();
const albums = await Song.listAlbums({ artist: 'Queen' });
const playlists = await Playlist.list();

// Single entity
const song = await Song.get(songId);
const playlist = await Playlist.get(playlistId);

// CRUD
await Playlist.update(playlistId, { name: 'New Name' });
await Playlist.delete(playlistId);

// Helpers
const audioUrl = Song.audioUrl(song);
const artworkUrl = Song.artworkUrl(song);
```

### FsNodeService (`src/services/FsNodeService.ts`)

**Purpose:** Generate authenticated URLs for media files

**Features:**
- Automatically uses compressed versions when available
- Appends auth token as query parameter

### TrackPlayerService (`src/services/TrackPlayerService.ts`)

**Capabilities:**
- Queue management (add, remove, clear)
- Playback control (play, pause, skip)
- Repeat modes (off, track, queue)
- Shuffle
- Playback speed (0.5x-2.0x)
- Seek
- Hardware media controls

**Initialization:** Done in `index.ts` before app mounts

**Track Conversion:**
```typescript
import { Song } from '@/services/MusicService';

const track = Song.toTrack(song); // Converts API song to TrackPlayer format
await TrackPlayerService.addTrack(track);
```

## Component Architecture

### Screen Pattern

**Screens** (`src/screens/`) are data containers:
```typescript
// src/screens/HomeScreen.tsx
export function HomeScreen() {
  const { data: songs, isLoading } = useSongsQuery();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <View>
      <FeaturedSection songs={songs} />
      <RecentlyPlayedSection />
    </View>
  );
}
```

**Section components** (`src/components/{ScreenName}/`) handle UI:
```typescript
// src/components/Home/FeaturedSection.tsx
export function FeaturedSection({ songs }: { songs: Song[] }) {
  return (
    <GlassContainer>
      {songs.map(song => (
        <SongCard key={song.id} song={song} />
      ))}
    </GlassContainer>
  );
}
```

### Player Components

- `MusicPlayerBar` - Compact bar above tab navigation
- `FullPlayer/` - Modal full-screen player with sub-components:
  - `FullPlayerHeader` - Title and close button
  - `FullPlayerArtwork` - Album art
  - `FullPlayerControls` - Play/pause/skip buttons
  - `FullPlayerProgress` - Seek bar and time

## Performance Guidelines

### Image Caching
- 1GB disk cache via `expo-image`
- Configured in `src/config/imageCache.ts`
- Automatically handles compressed artwork from backend

### Query Optimization
- TanStack Query prevents duplicate requests automatically
- Use `enabled` option for conditional queries
- Invalidate only specific query keys after mutations

### Render Optimization
- Modal player prevents main UI re-renders during playback
- Use `useMusicActions()` instead of `useMusic()` to avoid unnecessary re-renders
- Use `useMusicPosition()` only in components that need position updates

## TypeScript Conventions

**Strict mode enabled** - All files must satisfy strict type checking

**Function and Component Style:**
```typescript
// ✅ Arrow functions with const (let TypeScript infer return type)
const playSong = async (songId: string) => {
  await TrackPlayerService.addTrack(track);
  // Return type Promise<void> is inferred
};

// ❌ Never use function keyword
function playSong(songId: string): Promise<void> { }

// ❌ Avoid explicit return types (only use when necessary)
const playSong = async (songId: string): Promise<void> => { };

// ✅ Inline props for single-use components
export const SongCard = ({ song, onPress }: { song: Song; onPress?: () => void }) => {
  return <Pressable onPress={onPress}>...</Pressable>;
};

// ✅ Use "type" keyword for named props (never "interface")
type SongCardProps = {
  song: Song;
  onPress?: () => void;
};
export const SongCard = ({ song, onPress }: SongCardProps) => {
  return <Pressable onPress={onPress}>...</Pressable>;
};

// ❌ Never use interface keyword
interface SongCardProps {
  song: Song;
}

// ❌ Never use React.FC
const SongCard: React.FC<SongCardProps> = ({ song }) => { };

// API responses (use type guards)
if (Song.is(response.data)) {
  // TypeScript knows this is a Song
}
```

## Error Handling Patterns

```typescript
// Async operations
try {
  const song = await Song.get(songId);
  await TrackPlayerService.addTrack(Song.toTrack(song));
} catch (error) {
  console.error('Failed to load song:', error);
  // Show user-friendly error
}

// Missing data fallbacks
const artworkUrl = song.artwork_fs_node_id 
  ? Song.artworkUrl(song) 
  : FALLBACK_IMAGE_URL;
```

## Authentication Flow

1. App starts → `AuthProvider` checks AsyncStorage for token
2. `app/index.tsx` checks auth state
3. If no token → redirect to `/auth`
4. Login → token stored in AsyncStorage + AuthContext
5. All API calls automatically include Bearer token
6. Logout → clear AsyncStorage + AuthContext + redirect to `/auth`

## Key Files Reference

**Core Infrastructure:**
- `app/_layout.tsx` - Provider setup + floating player
- `index.ts` - TrackPlayer initialization

**State Management:**
- `src/providers/MusicProvider.tsx` - Playback state + TrackPlayer integration
- `src/providers/AuthProvider.tsx` - Authentication state
- `src/lib/queries/music.ts` - TanStack Query hooks

**Services:**
- `src/services/BackendService.ts` - HTTP client
- `src/services/MusicService.ts` - API models
- `src/services/TrackPlayerService.ts` - Audio player wrapper
- `src/services/FsNodeService.ts` - File URL generator

**Configuration:**
- `src/config/imageCache.ts` - Image caching setup
- `tsconfig.json` - TypeScript strict mode

## Common Tasks

### Add a new screen
1. Create file: `app/my-screen.tsx`
2. Create screen component: `src/screens/MyScreen.tsx`
3. Create section components: `src/components/MyScreen/*.tsx`
4. Add navigation: `router.push('/my-screen')`

### Add a new API endpoint
1. Add method to appropriate model in `src/services/MusicService.ts`
2. Create query hook in `src/lib/queries/music.ts`
3. Export query key constant
4. Use hook in screen component

### Modify playback behavior
1. Update logic in `src/providers/MusicProvider.tsx` for state
2. Update logic in `src/services/TrackPlayerService.ts` for TrackPlayer interaction
3. Expose action via `useMusicActions()` if needed

### Add a new provider
1. Create provider in `src/providers/`
2. Add to provider stack in `app/_layout.tsx` (mind the order!)
3. Export custom hook for consumption
