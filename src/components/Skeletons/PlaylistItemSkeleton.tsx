import ContentLoader, { Rect } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";

export const PlaylistItemSkeleton = () => (
  <View style={styles.container}>
    <ContentLoader
      speed={1.2}
      width={340}
      height={60}
      viewBox="0 0 340 60"
      backgroundColor="rgba(255, 255, 255, 0.05)"
      foregroundColor="rgba(255, 255, 255, 0.1)"
    >
      <Rect x="0" y="0" rx="8" ry="8" width="60" height="60" />
      <Rect x="76" y="10" rx="4" ry="4" width="160" height="16" />
      <Rect x="76" y="34" rx="3" ry="3" width="100" height="13" />
    </ContentLoader>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
