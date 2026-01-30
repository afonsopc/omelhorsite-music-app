import { Redirect } from "expo-router";
import { useAuth } from "../src/providers/AuthProvider";
import { Loading } from "../src/components/Loading";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth" />;
}
