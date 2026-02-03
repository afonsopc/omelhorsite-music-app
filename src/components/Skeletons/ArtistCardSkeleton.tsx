import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";

export const ArtistCardSkeleton = () => (
  <View style={styles.container}>
    <ContentLoader
      speed={1.2}
      width={106}
      height={122}
      viewBox="0 0 106 122"
      backgroundColor="rgba(255, 255, 255, 0.05)"
      foregroundColor="rgba(255, 255, 255, 0.1)"
    >
      <Circle cx="53" cy="48" r="48" />
      <Rect x="18" y="108" rx="4" ry="4" width="70" height="14" />
    </ContentLoader>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 130,
    padding: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
