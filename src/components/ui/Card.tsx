import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Pressable,
  TextInput,
  TextInputProps,
} from "react-native";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const Card = ({ children, style, onPress }: CardProps) => {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

export const Button = ({ children, onPress, style }: CardProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

type InputProps = TextInputProps & {
  style?: StyleProp<ViewStyle>;
};

export const Input = ({ style, ...props }: InputProps) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="rgba(255, 255, 255, 0.5)"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
  },
  button: {
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  input: {
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
  },
});
