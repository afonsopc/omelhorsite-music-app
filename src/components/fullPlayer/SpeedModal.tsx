import { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { PLAYBACK_SPEEDS, PlaybackSpeed } from "../../types/player";

type SpeedModalProps = {
  visible: boolean;
  currentSpeed: number;
  onClose: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
};

export const SpeedModal = ({
  visible,
  currentSpeed,
  onClose,
  onSpeedChange,
}: SpeedModalProps) => {
  const [localSpeed, setLocalSpeed] = useState<number>(currentSpeed);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSpeed(currentSpeed);
  }, [currentSpeed, visible]);

  const handleSpeedChange = useCallback(
    (speed: number) => {
      const roundedSpeed = Math.round(speed * 100) / 100;
      setLocalSpeed(roundedSpeed);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onSpeedChange(roundedSpeed as PlaybackSpeed);
      }, 150);
    },
    [onSpeedChange],
  );

  const handleSpeedSelect = (speed: PlaybackSpeed) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setLocalSpeed(speed);
    onSpeedChange(speed);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Playback Speed</Text>

          <Text style={styles.speedValueText}>{localSpeed.toFixed(2)}x</Text>

          <Slider
            minimumValue={0.5}
            maximumValue={1.5}
            step={0.01}
            value={localSpeed}
            onValueChange={handleSpeedChange}
            minimumTrackTintColor="#00f2ff"
            maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
            thumbTintColor="#00f2ff"
          />

          <View style={styles.speedButtonsRow}>
            {PLAYBACK_SPEEDS.map((speed) => (
              <Pressable
                key={speed}
                style={[
                  styles.speedButton,
                  Math.abs(speed - localSpeed) < 0.01 &&
                    styles.speedButtonActive,
                ]}
                onPress={() => handleSpeedSelect(speed)}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    Math.abs(speed - localSpeed) < 0.01 &&
                      styles.speedButtonTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    borderRadius: 16,
    padding: 24,
    minWidth: 320,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  speedValueText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#00f2ff",
    textAlign: "center",
    marginBottom: 16,
  },
  speedButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  speedButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
  },
  speedButtonActive: {
    backgroundColor: "rgba(0, 242, 255, 0.2)",
    borderColor: "#00f2ff",
  },
  speedButtonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  speedButtonTextActive: {
    color: "#00f2ff",
    fontWeight: "700",
  },
});
