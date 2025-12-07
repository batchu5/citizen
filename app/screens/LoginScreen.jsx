import React, { useState, useContext } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Pressable, 
  Animated 
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [isGooglePressed, setIsGooglePressed] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
         <View style={styles.videoWrapper}>
          <Image
             source={require("../uivideos/ll-removebg-preview.png")}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 75,
              resizeMode: "contain",
            }}
          />
        </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>
      

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        style={styles.input}
        placeholder="Enter your email"
        outlineColor="#2c2727ff"
        activeOutlineColor="#2c2727ff"
        textColor="#222121ff"
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
        outlineColor="#2c2727ff"
        activeOutlineColor="#2c2727ff"
        textColor="#222121ff"
        placeholderTextColor="#c7c4c4ff"
        outlineStyle={{ borderWidth: 1 }}
        activeOutlineStyle={{ borderWidth: 1 }}
      />
      {/* <Button
          mode="contained"
          onPress={() => login(email, password)}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
      >
        Login
      </Button> */}
      {/* LOGIN BUTTON WITH ANIMATION */}
        <Pressable
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => login(email, password)}
        >
          <Animated.View
            style={{
              transform: [{ scale: isPressed ? 0.95 : 1 }],
            }}
          >
            <Button
              mode="contained"
              style={[
                styles.button,
                { backgroundColor: isPressed ? "#1376e0ff" : "#1e78d8ff" }
              ]}
              contentStyle={{ paddingVertical: 6 }}
              labelStyle={{ color: "#ffffff", fontSize: 16 }}
            >
              Login
            </Button>
          </Animated.View>
        </Pressable>

      <Text
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.forgotLink}
      >
        Forgot Password?
      </Text>

      <Text
          onPress={() => navigation.navigate("Register")}
          style={styles.link}
      >
          Don't have an account?{" "}
          <Text style={styles.linkHighlight}>Register</Text>
      </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
   button: {
    borderRadius: 10,
    marginTop: 10,
  },
  forgotLink: {
    textAlign: "center",
    marginTop: 15,
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 15,
  },
  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  videoWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
   dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
