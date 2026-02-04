import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Button } from "../components/ui/Card";
import { useGetCurrentSessionQuery } from "../lib/queries/accounts";
import { Session } from "../services/AccountService";
import {
  clearImageCache,
  getCacheSize,
  formatBytes,
} from "../config/imageCache";

export const ProfileScreen: React.FC = () => {
  const { data: session } = useGetCurrentSessionQuery();
  const currentUser = session?.user;
  const [cacheSize, setCacheSize] = useState<number>(-1);
  const [isClearing, setIsClearing] = useState(false);

  const loadCacheSize = async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  };

  // Load cache size on mount
  React.useEffect(() => {
    loadCacheSize();
  }, []);

  const handleLogout = async () => {
    try {
      await Session.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Image Cache",
      `This will clear all cached images${cacheSize >= 0 ? ` (${formatBytes(cacheSize)})` : ""}. Images will be re-downloaded when needed.\n\nDo you want to continue?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Cache",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              const success = await clearImageCache();
              if (success) {
                Alert.alert("Success", "Image cache cleared successfully");
                await loadCacheSize();
              } else {
                Alert.alert("Error", "Failed to clear image cache");
              }
            } catch (error) {
              console.error("Error clearing cache:", error);
              Alert.alert("Error", "An error occurred while clearing cache");
            } finally {
              setIsClearing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Your account settings</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {currentUser?.name?.charAt(0).toUpperCase() ||
                    currentUser?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser?.name || "User"}</Text>
              <Text style={styles.userEmail}>{currentUser?.email}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Card style={styles.settingCard}>
              <Text style={styles.settingTitle}>Audio Quality</Text>
              <Text style={styles.settingDescription}>
                High Quality (320kbps)
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Card style={styles.settingCard}>
              <Text style={styles.settingTitle}>Downloads</Text>
              <Text style={styles.settingDescription}>
                Manage offline music
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Card style={styles.settingCard}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Push and email preferences
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Card style={styles.settingCard}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDescription}>
                Data and privacy settings
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearCache}
            disabled={isClearing}
          >
            <Card style={styles.settingCard}>
              <View style={styles.settingWithAction}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Image Cache</Text>
                  <Text style={styles.settingDescription}>
                    {cacheSize >= 0
                      ? `Currently using ${formatBytes(cacheSize)}`
                      : "Cache size unavailable"}
                  </Text>
                </View>
                {isClearing && (
                  <ActivityIndicator size="small" color="#00f2ff" />
                )}
              </View>
              <Text style={styles.clearCacheHint}>Tap to clear cache</Text>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutSection}>
          <Button style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </Button>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    padding: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 54, 138, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00f2ff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  settingItem: {
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  settingCard: {
    padding: 16,
  },
  settingWithAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  clearCacheHint: {
    fontSize: 12,
    color: "rgba(255, 107, 107, 0.8)",
    marginTop: 4,
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  logoutButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00f2ff",
  },
});
