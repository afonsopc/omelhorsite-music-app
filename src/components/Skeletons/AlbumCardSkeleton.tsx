import ContentLoader, { Rect } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";

export const AlbumCardSkeleton = () => (
  <View style={styles.container}>
    <ContentLoader
      speed={1.2}
      width={126}
      height={188}
      viewBox="0 0 126 188"
      backgroundColor="rgba(255, 255, 255, 0.05)"
      foregroundColor="rgba(255, 255, 255, 0.1)"
    >
      <Rect x="0" y="0" rx="8" ry="8" width="126" height="120" />
      <Rect x="0" y="132" rx="4" ry="4" width="100" height="14" />
      <Rect x="0" y="154" rx="3" ry="3" width="75" height="12" />
    </ContentLoader>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
