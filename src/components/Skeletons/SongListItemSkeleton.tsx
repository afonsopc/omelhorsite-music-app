import ContentLoader, { Rect } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";

export const SongListItemSkeleton = () => (
  <View style={styles.container}>
    <ContentLoader
      speed={1.2}
      width={340}
      height={52}
      viewBox="0 0 340 52"
      backgroundColor="rgba(255, 255, 255, 0.05)"
      foregroundColor="rgba(255, 255, 255, 0.1)"
    >
      <Rect x="0" y="0" rx="8" ry="8" width="52" height="52" />
      <Rect x="64" y="12" rx="4" ry="4" width="180" height="16" />
      <Rect x="64" y="34" rx="3" ry="3" width="120" height="13" />
      <Rect x="300" y="20" rx="3" ry="3" width="40" height="12" />
    </ContentLoader>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
