import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/providers/AuthProvider";
import { MusicProvider } from "../src/providers/MusicProvider";
import { QueryProvider } from "../src/providers/QueryProvider";
import { useEffect, useRef, useCallback } from "react";
import { View, Platform } from "react-native";
import { MusicPlayerBar } from "../src/components/player/MusicPlayerBar";
import { useMusicState } from "../src/providers/MusicProvider";
import { FullPlayer } from "../src/components/fullPlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBarProvider, useTabBar } from "../src/providers/TabBarProvider";
import { initializeImageCache } from "../src/config/imageCache";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

const MusicPlayerModal = () => {
  const { currentSong } = useMusicState();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { hasTabBar } = useTabBar();
  const tabBarHeight = hasTabBar
    ? Platform.select({ ios: 49, android: 56, default: 5 })
    : 0;
  const playerBottomOffset = (tabBarHeight ?? 56) + insets.bottom + 8;

  const handleOpenPlayer = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClosePlayer = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  if (!currentSong) return null;

  return (
    <>
      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: playerBottomOffset,
        }}
      >
        <MusicPlayerBar onPress={handleOpenPlayer} />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["95%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "transparent" }}
        handleIndicatorStyle={{ display: "none" }}
      >
        <FullPlayer onClose={handleClosePlayer} />
      </BottomSheet>
    </>
  );
};

export default function RootLayout() {
  useEffect(() => {
    initializeImageCache();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
