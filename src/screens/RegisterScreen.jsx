import React, { useState } from "react";
import { View, TouchableOpacity,StyleSheet, KeyboardAvoidingView, Platform,Pressable,Animated ,Image} from "react-native";
import { TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen({ navigation }) {

  const navifat = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [isGooglePressed, setIsGooglePressed] = useState(false); 

  const handleRegister = async () => {
    if ( !email || !password || !name || !phoneNumber) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${BASE_URL}/auth/signup`, {  email, password, name, phoneNumber });

      const { token } = res.data;
      await AsyncStorage.setItem("token", token);

      navifat.navigate("login")
    } catch (err) {
      console.log("Registration error:", err.message);
      setError(err.response?.data?.message || "Registration failed");
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
                  source={require("../uivideos/Sign-removebg-preview.png")}
                  style={{
                    width: "100%",
                    height: 250,
                    borderRadius: 75,
                    resizeMode: "contain",
                  }}
                />
        </View>
      <Text  style={styles.title}>
        Register Account
      </Text>

      <TextInput
          label="name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
          placeholder="Enter your Name"
          outlineColor="#000"
          activeOutlineColor="#2c2727ff"
          textColor="#000"
          placeholderTextColor="#c7c4c4ff"
          outlineStyle={{ borderWidth: 1 }}
          activeOutlineStyle={{ borderWidth: 1 }}
      />

      <TextInput
          label="phoneNumber"
          value={phoneNumber}
          onChangeText={setPhonenumber}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
          placeholder="Enter your phoneNumber"
          outlineColor="#000"
          activeOutlineColor="#2c2727ff"
          textColor="#000"
          placeholderTextColor="#c7c4c4ff"
          outlineStyle={{ borderWidth: 1 }}
          activeOutlineStyle={{ borderWidth: 1 }}
      />

      <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
          placeholder="Enter your email"
          outlineColor="#000"
          activeOutlineColor="#2c2727ff"
          textColor="#000"
          placeholderTextColor="#c7c4c4ff"
          outlineStyle={{ borderWidth: 1 }}
          activeOutlineStyle={{ borderWidth: 1 }}
      />

      <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          placeholder="Enter your password"
          outlineColor="#000"
          activeOutlineColor="#2c2727ff"
          textColor="#000"
          placeholderTextColor="#c7c4c4ff"
          outlineStyle={{ borderWidth: 1 }}
          activeOutlineStyle={{ borderWidth: 1 }}
      />


      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
          mode="contained"
          onPress={handleRegister}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 4 }}
          labelStyle={{ color: "#000000", fontWeight: "600" }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            {loading && <ActivityIndicator animating={true} color="#000" style={{ marginRight: 8 }} />}
            <Text style={{ color: "#ffffffff", fontWeight: "600",fontSize:16 }}>Register</Text>
          </View>
      </Button>

      <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
      >
        <View style={{ alignItems: "center", marginTop: 0 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>
              <Text style={{ color: "#000" }}>Already have an account? </Text>
              <Text style={{ color: "#1E90FF", fontWeight: "600" }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
       {/* OR Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
       <Pressable
          onPressIn={() => setIsGooglePressed(true)}
          onPressOut={() => setIsGooglePressed(false)}
          onPress={() => console.log("Google Login")}
          style={{ width: "100%" }}
        >
          <Animated.View
            style={{
              transform: [{ scale: isGooglePressed ? 0.96 : 1 }],
              opacity: isGooglePressed ? 0.75 : 1,
            }}
          >
            <View style={styles.googleButton}>
              <Image
                source={require("../uivideos/newGoogle-removebg-preview.png")}
                style={styles.googleIcon}
              />
              <Text
                style={[
                  styles.googleText,
                  { opacity: isGooglePressed ? 0.7 : 1 }
                ]}
              >
                Continue with Google
              </Text>
            </View>
          </Animated.View>
        </Pressable>
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
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 5 },
    // elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0e0e0dff",
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    fontSize: 14,
    textAlign: "center",
  },
   dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: "#d3d3d3",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#777",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#1E90FF", // blue background
    borderRadius: 10,
    marginTop: 0,
  },
  videoWrapper: {
    backgroundColor: "#fffcfcff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  loginButton: {
    textAlign: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 0,
  },
  loginText: {
    textAlign: "center",
    fontSize: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginTop: 5,
    marginBottom: 16,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: "contain",
  },

  googleText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },

});
