import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LanToggler({ selectedLang, onToggle }) {
  const handleToggle = async (lang) => {
    try {
      await AsyncStorage.setItem("lang", lang);
    } catch (e) {
      console.log("Failed to save lang", e);
    }
    onToggle(lang);
  };

  return (
    <View style={styles.container}>

      {/* EN Button */}
      <Pressable
        style={[
          styles.button,
          selectedLang === "en" && styles.activeButton
        ]}
        onPress={() => handleToggle("en")}
      >
        <Text
          style={
            selectedLang === "en" ? styles.activeText : styles.inactiveText
          }
        >
          EN
        </Text>
      </Pressable>

      {/* HI Button */}
      <Pressable
        style={[
          styles.button,
          selectedLang === "hi" && styles.activeButton
        ]}
        onPress={() => handleToggle("hi")}
      >
        <Text
          style={
            selectedLang === "hi" ? styles.activeText : styles.inactiveText
          }
        >
          हिंदी
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#E0E0E0",
    padding: 4,
    borderRadius: 20,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: "#2563EB",
  },
  activeText: {
    color: "white",
    fontWeight: "700",
  },
  inactiveText: {
    color: "#333",
    fontWeight: "600",
  },
});
