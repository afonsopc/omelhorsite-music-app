import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";

export interface GlassProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  blur?: number;
  opacity?: number;
  tint?: "light" | "dark" | "accent";
  border?: boolean;
  shadow?: boolean;
  rounded?: boolean;
  intensity?: "subtle" | "normal" | "intense";
  gradient?: boolean;
  gradientColors?: string[];
  onTouchEnd?: () => void;
  disabled?: boolean;
}

export const GlassContainer = ({
  children,
  style,
  blur = 18,
  opacity = 0.08,
  tint = "light",
  border = true,
  shadow = true,
  rounded = true,
  intensity = "normal",
  gradient = false,
  gradientColors,
  onTouchEnd,
  disabled,
}: GlassProps) => {
  const getGlassStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: StyleProp<ViewStyle> = {
      backgroundColor: getBackgroundColor(),
      borderRadius: rounded ? 16 : 0,
      overflow: "hidden",
    };

    if (border) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = getBorderColor();
    }

    if (shadow) {
      baseStyle.shadowColor = "#000";
      baseStyle.shadowOffset = { width: 0, height: 4 };
      baseStyle.shadowOpacity = 0.3;
      baseStyle.shadowRadius = 16;
      baseStyle.elevation = 8;
    }

    return [baseStyle, style];
  };

  const getBackgroundColor = (): string => {
    const intensityMultiplier = {
      subtle: 0.6,
      normal: 1,
      intense: 1.4,
    }[intensity];

    const baseOpacity = opacity * intensityMultiplier;

    switch (tint) {
      case "dark":
        return `rgba(0, 0, 0, ${baseOpacity})`;
      case "accent":
        return `rgba(255, 107, 107, ${baseOpacity * 0.5})`;
      case "light":
      default:
        return `rgba(255, 255, 255, ${baseOpacity})`;
    }
  };

  const getBorderColor = (): string => {
    switch (tint) {
      case "dark":
        return "rgba(255, 255, 255, 0.1)";
      case "accent":
        return "rgba(255, 107, 107, 0.3)";
      case "light":
      default:
        return "rgba(255, 255, 255, 0.2)";
    }
  };

  return (
    <TouchableOpacity
      style={getGlassStyle()}
      onPress={onTouchEnd}
      disabled={disabled || !onTouchEnd}
    >
      {children}
    </TouchableOpacity>
  );
};

export const GlassCard = (props: GlassProps) => {
  return (
    <GlassContainer
      {...props}
      rounded={true}
      shadow={true}
      border={true}
      style={[styles.card, props.style]}
    />
  );
};

export const GlassButton = ({
  children,
  onPress,
  ...props
}: GlassProps & { onPress?: () => void }) => {
  return (
    <GlassContainer
      {...props}
      rounded={true}
      shadow={true}
      border={true}
      intensity="intense"
      style={[styles.button, props.style]}
      onTouchEnd={onPress}
    >
      <View style={styles.buttonContent}>{children}</View>
    </GlassContainer>
  );
};

export const GlassInput = (
  props: GlassProps & {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  },
) => {
  const {
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    autoCapitalize,
    keyboardType,
    ...glassProps
  } = props;

  return (
    <GlassContainer
      {...glassProps}
      rounded={true}
      shadow={false}
      border={true}
      style={[styles.inputContainer, glassProps.style]}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />
      </View>
    </GlassContainer>
  );
};

import { TextInput } from "react-native";

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
