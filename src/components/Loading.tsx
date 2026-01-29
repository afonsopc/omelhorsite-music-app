import { View, Text, StyleSheet } from "react-native";

export const Loading = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading Music App...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
