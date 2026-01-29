import { useRouter } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { MusicPlayerBar } from "../../src/components/player/MusicPlayerBar";
import { useMusicState } from "../../src/contexts/MusicContext";

export default function TabLayout() {
  const { currentSong } = useMusicState();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>Home</Label>
          <Icon sf="house.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Label>Search</Label>
          <Icon sf="magnifyingglass.circle.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="playlists">
          <Label>Playlists</Label>
          <Icon sf="music.note.list" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf="person.crop.circle" />
        </NativeTabs.Trigger>
      </NativeTabs>
      {currentSong && (
        <View style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
          <MusicPlayerBar onPress={() => router.push("/player")} />
        </View>
      )}
    </View>
  );
}
