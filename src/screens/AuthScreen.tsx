import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  GlassContainer,
  GlassCard,
  GlassInput,
  GlassButton,
} from "../components/ui/GlassContainer";
import { useAuth } from "../providers/AuthProvider";

export const AuthScreen = ({}: {}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, styles.darkBackground]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🎵</Text>
            <Text style={styles.appTitle}>Music App</Text>
            <Text style={styles.appSubtitle}>Your personal music library</Text>
          </View>

          <GlassCard style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome Back</Text>
            <Text style={styles.loginSubtitle}>
              Sign in to access your music
            </Text>

            <View style={styles.formContainer}>
              <GlassInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                children={undefined}
              />

              <GlassInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                children={undefined}
              />

              <GlassButton
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
                tint="accent"
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </GlassButton>
            </View>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </GlassCard>

          <GlassContainer style={styles.demoInfoCard} intensity="subtle">
            <Text style={styles.demoInfoTitle}>Demo Mode</Text>
            <Text style={styles.demoInfoText}>
              Use your existing account credentials from the web app
            </Text>
          </GlassContainer>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: "#000000",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 64,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  loginCard: {
    padding: 32,
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  forgotPasswordButton: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  demoInfoCard: {
    padding: 16,
    alignItems: "center",
  },
  demoInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  demoInfoText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  statusCard: {
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  errorCard: {
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: "flex-end",
  },
  retryText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  successCard: {
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "600",
  },
});
