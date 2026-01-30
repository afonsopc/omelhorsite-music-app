import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/providers/AuthProvider";
import { MusicProvider } from "../src/providers/MusicProvider";
import { QueryProvider } from "../src/providers/QueryProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <MusicProvider>
          <StatusBar style="light" />
          <Slot />
        </MusicProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
