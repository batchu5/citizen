import { useEffect, useRef } from "react";
import { Animated, View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function QuotationCard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 45,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <View style={styles.container}>

        {/* Horizontal Gradient: Blue (left) → Black (right) - FASTER fade */}
        <LinearGradient
          colors={[
            "rgba(87, 235, 166, 0.48)",
            "rgba(87, 235, 146, 0.3)",
            "rgba(0,0,0,1)",
          ]}
          locations={[0, 0.25, 0.6]}  // Blue fades much faster
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.horizontalGradient}
        />

        {/* Vertical Gradient: Transparent (top) → Black (bottom) - FASTER fade */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0.5)",
            "rgba(0,0,0,1)",
          ]}
          locations={[0, 0.3, 0.65]}  // Black appears much sooner
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.verticalGradient}
        />

        {/* CARD CONTENT */}
        <View style={styles.content}>
          <View style={{ flexShrink: 1, paddingRight: 12 }}>
            <Text style={styles.text}>
              Your reports shape a brighter future for all.
            
            </Text>
            {/* <Text style={{color:"blue",fontSize:24,paddingTop:15}}>Thank You</Text> */}
          </View>

          <Animated.Image
            source={require("../src/uivideos/smile.png")}
            style={{
              width: 200,
              height: 130,
              borderRadius: 14,
              transform: [{ translateY: floatAnim }],
            }}
          />
        

        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },

  horizontalGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  verticalGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    zIndex: 2,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 30,
  },
});