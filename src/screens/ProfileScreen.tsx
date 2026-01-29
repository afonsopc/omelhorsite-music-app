import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard, GlassButton } from "../components/ui/GlassContainer";
import { useGetCurrentSessionQuery } from "../lib/queries/accounts";
import { Session } from "../services/AccountService";

export const ProfileScreen: React.FC = () => {
  const { data: session } = useGetCurrentSessionQuery();
  const currentUser = session?.user;

  const handleLogout = async () => {
    try {
      await Session.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
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

        <GlassCard style={styles.profileCard}>
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
        </GlassCard>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <GlassCard style={styles.settingCard}>
              <Text style={styles.settingTitle}>Audio Quality</Text>
              <Text style={styles.settingDescription}>
                High Quality (320kbps)
              </Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <GlassCard style={styles.settingCard}>
              <Text style={styles.settingTitle}>Downloads</Text>
              <Text style={styles.settingDescription}>
                Manage offline music
              </Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <GlassCard style={styles.settingCard}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Push and email preferences
              </Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <GlassCard style={styles.settingCard}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDescription}>
                Data and privacy settings
              </Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutSection}>
          <GlassButton
            style={styles.logoutButton}
            onPress={handleLogout}
            tint="dark"
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </GlassButton>
        </View>

        {/* Add some bottom padding */}
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
    backgroundColor: "rgba(255, 107, 107, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
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
    color: "#FF6B6B",
  },
});
