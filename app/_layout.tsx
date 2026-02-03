import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/providers/AuthProvider";
import { MusicProvider } from "../src/providers/MusicProvider";
import { QueryProvider } from "../src/providers/QueryProvider";
import { useState, useEffect } from "react";
import { View, Modal, Platform } from "react-native";
import { MusicPlayerBar } from "../src/components/player/MusicPlayerBar";
import { useMusicState } from "../src/providers/MusicProvider";
import { FullPlayer } from "../src/components/fullPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarProvider, useTabBar } from "../src/providers/TabBarProvider";
import { initializeImageCache } from "../src/config/imageCache";

const MusicPlayerModal = () => {
  const { currentSong } = useMusicState();
  const [showPlayer, setShowPlayer] = useState(false);
  const insets = useSafeAreaInsets();
  const { hasTabBar } = useTabBar();
  const tabBarHeight = hasTabBar
    ? Platform.select({ ios: 49, android: 56, default: 5 })
    : 0;
  const playerBottomOffset = (tabBarHeight ?? 56) + insets.bottom + 8;

  return (
    <>
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
    </>
  );
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize image cache on app startup
    initializeImageCache();
  }, []);

  return (
    <QueryProvider>
      <AuthProvider>
        <MusicProvider>
          <TabBarProvider>
            <StatusBar style="light" />
            <Slot />
            <MusicPlayerModal />
          </TabBarProvider>
        </MusicProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
