import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ThankYouScreen() {
  const videoRef = useRef(null);
  const navigation = useNavigation();

  const route = useRoute();
  const { priority } = route.params;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 16,
          color: "#333",
          alignSelf: "center",
          borderColor: "#F5EFE6",
          borderRadius: 12,
          borderWidth: 2,
          padding: 4,
        }}
      >
        Priority: {priority}
      </Text>

      <Video
        ref={videoRef}
        source={require("../uivideos/final-vmake.mp4")}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
      />

      <Text style={styles.thankYou}>Thank You!</Text>
      <Text style={styles.sentText}>Your Report submission has been done.</Text>

      {/* Continue Button */}
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={{ color: "white", fontSize: 18 }}
        onPress={() => navigation.navigate("Home")}
      >
        Continue
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 120,
  },

  video: {
    width: "100%",
    height: 500,
    borderRadius: 10,
  },

  thankYou: {
    fontSize: 36,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },

  button: {
    color: "white",
    marginTop: 50,
    width: "70%",
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "black",
  },
  videoWrapper: {
    width: "100%",
    height: 500,
    borderRadius: 10,
    overflow: "hidden", // 🔥 This removes the unwanted border
  },
  sentText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "normal",
  },
});
