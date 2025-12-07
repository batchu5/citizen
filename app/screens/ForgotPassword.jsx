import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform,Image } from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import API from "../api/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data?.message || "Reset link sent to your email");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <View style={styles.card}>
      <View style={styles.videoWrapper}>
                <Image
                  source={require("../uivideos/ff-removebg-preview.png")}
                  style={{
                    width: "100%",
                    height: 250,
                    borderRadius: 75,
                    resizeMode: "contain",
                  }}
                />
              </View>

      <Text style={styles.title}>
        Forgot Password?
      </Text>


      <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="Enter your registered email"
          outlineColor="#2c2727ff"
          activeOutlineColor="#2c2727ff"
          textColor="#222121ff"
          placeholderTextColor="#c7c4c4ff"
          outlineStyle={{ borderWidth: 1 }}
          activeOutlineStyle={{ borderWidth: 1 }}
      />

      
      <Button
          mode="contained"
          onPress={handleForgotPassword}
          disabled={loading}
          style={styles.button}
          contentStyle={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 6,
          }}
          labelStyle={{ color: "#ffffffff", fontWeight: "600" }}
      >
        {loading && <ActivityIndicator animating={true} color="#000" style={{ marginRight: 8 }} />}
        Send Reset Link
      </Button>

      {message ? (
          <Text style={styles.message}>{message}</Text>
        ) : null}

      <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text>
            <Text style={{ color: "#000" }}>Remembered your password? </Text>
            <Text
              style={{ color: "#1E90FF", fontWeight: "600" }}
              onPress={() => navigation.navigate("Login")}
            >
              Back to Login
            </Text>
          </Text>
        </View>
    </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  videoWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    color: "#0e0e0dff",
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#9480ecff",
    borderRadius: 10,
    marginTop: 5,
  },
  message: {
    marginTop: 15,
    color: "gray",
    fontSize: 14,
    textAlign: "center",
  },
});

