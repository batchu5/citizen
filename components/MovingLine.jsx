import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

export default function MovingLine() {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animation]);

  const widthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.lineContainer}>
      <Animated.View
        style={[
          styles.line,
          { width: widthInterpolate }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lineContainer: {
    height: 4,
    width: "100%",
    backgroundColor: "#FFA500", // orange background
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  line: {
    height: "100%",
    backgroundColor: "#22C55E", // green moving line
    borderRadius: 2,
  },
});
