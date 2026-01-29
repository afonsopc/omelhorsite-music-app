import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../src/contexts/AuthContext";
import { AuthScreen } from "../src/screens/AuthScreen";

export default function Auth() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    router.replace("/(tabs)");
  }, [isAuthenticated, router]);

  return <AuthScreen />;
}
