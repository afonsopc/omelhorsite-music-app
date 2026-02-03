import { Text, StyleSheet } from "react-native";
import { Card } from "../ui/Card";

export const EmptyState = () => (
  <Card style={styles.emptyStateCard}>
    <Text style={styles.emptyStateTitle}>Start Searching</Text>
    <Text style={styles.emptyStateText}>
      Search for songs, artists, albums, or playlists
    </Text>
  </Card>
);

const styles = StyleSheet.create({
  emptyStateCard: {
    marginHorizontal: 24,
    marginTop: 40,
    padding: 40,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});
