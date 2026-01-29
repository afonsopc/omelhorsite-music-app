import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/contexts/AuthContext";
import { MusicProvider } from "../src/contexts/MusicContext";
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
