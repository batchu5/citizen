import { View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import Svg, { Path } from "react-native-svg";

export default function AlertIcon() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([

        Animated.delay(500),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 120,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -1,
        duration: 120,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 120,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-30deg", "30deg"], 
  });

  return (
    <View style={{marginTop: 54}}>
         <Animated.View style={{ transform: [{ rotate }] }}>
      <Svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        color="currentColor"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M19 18V9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5V18" />
        <Path d="M20.5 18H3.5" />
        <Path d="M13.5 20C13.5 20.8284 12.8284 21.5 12 21.5M10.5 20C10.5 20.8284 11.1716 21.5 12 21.5M12 21.5V20" />
      </Svg>
    </Animated.View>
        
    </View>
   
  );
}
