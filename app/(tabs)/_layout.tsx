import { useState } from "react";
import { View, Modal, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { MusicPlayerBar } from "../../src/components/player/MusicPlayerBar";
import { useMusicState } from "../../src/providers/MusicProvider";
import { FullPlayer } from "../../src/components/fullPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { currentSong } = useMusicState();
  const [showPlayer, setShowPlayer] = useState(false);
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.select({ ios: 49, android: 56, default: 56 });
  const playerBottomOffset = (tabBarHeight ?? 56) + insets.bottom + 8;

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
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: playerBottomOffset,
          }}
        >
          <MusicPlayerBar onPress={() => setShowPlayer(true)} />
        </View>
      )}

      <Modal
        visible={showPlayer}
        transparent
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setShowPlayer(false)}
      >
        <FullPlayer onClose={() => setShowPlayer(false)} />
      </Modal>
    </View>
  );
}
