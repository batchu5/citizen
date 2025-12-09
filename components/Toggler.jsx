import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

export default function Toggler({ onToggle }) {
  const [selected, setSelected] = useState("high");
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleToggle = (option) => {
    setSelected(option);

    Animated.spring(animatedValue, {
      toValue: option === "high" ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    onToggle(option);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>

        <Animated.View style={[styles.slider, { transform: [{ translateX }] }]} />

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleToggle("high")}
        >
          <Text style={[styles.optionText, selected === "high" && styles.selectedText]}>
            High Priority
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleToggle("low")}
        >
          <Text style={[styles.optionText, selected === "low" && styles.selectedText]}>
            Recent
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDD7E1",
    borderRadius: 14,
    padding: 4,
    position: "relative",
    width: 300,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  slider: {
    position: "absolute",
    width: 150,
    height: 34,
    backgroundColor: "#4e7dfeff",
    borderRadius: 10,
    top: 4,
    left: 4,
  },
  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d2c2eff",
  },
  selectedText: {
    color: "#ffffff",
  },
  resultText: {
    marginTop: 30,
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});
