import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LanToggler({ selectedLang, onToggle }) {
  const [ishindi, setIshindi] = useState(false);

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
        onPress={() => {
          handleToggle("en")
          setIshindi(false)
        }}
      >
        <Text
          style={
            selectedLang === "en" ? styles.activeText : styles.inactiveText
          }
        >
          {!ishindi ? "EN" : <Image source={require("../assets/images/globe.png")}  style={{width: 25, height: 25}}/>}
        </Text>
      </Pressable>

      {/* HI Button */}
      <Pressable
        style={[
          styles.button,
          selectedLang === "hi" && styles.activeButton
        ]}
        onPress={() => {
          handleToggle("hi")
          setIshindi(true);
        }}
      >
        <Text
          style={
            selectedLang === "hi" ? styles.activeText : styles.inactiveText
          }
        >
          
          {ishindi ? "हिंदी" : <Image source={require("../assets/images/globe.png")}  style={{width: 25, height: 25}}/>}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 0,
    borderRadius: 20,
    borderColor: "#2563EB",
    borderWidth: 1
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignContent: "center"
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
