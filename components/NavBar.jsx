// import React, { useContext, useEffect } from "react";
// import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
// import Svg, { Path, Defs, LinearGradient as SVGGradient, Stop } from "react-native-svg";
// import Animated, {
//   useSharedValue,
//   withRepeat,
//   withTiming,
//   useAnimatedProps,
// } from "react-native-reanimated";
// import { AuthContext } from "../app/context/AuthContext";
// import Add from "./Add";
// import { useNavigation } from "@react-navigation/native";
// import Logout from "./Logout";
// import Home from "./Home";

// const AnimatedPath = Animated.createAnimatedComponent(Path);

// export default function Navbar() {
//   const navigation = useNavigation();
//   const { logout } = useContext(AuthContext);
//   const offset = useSharedValue(0);
//   useEffect(() => {
//     offset.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
//   }, []);
//   const animatedProps = useAnimatedProps(() => {
//     return {
//       strokeDashoffset: offset.value * 500, 
//     };
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.lightGlow} />
//       <Svg width="100%" height="130" viewBox="0 0 400 130" style={styles.svg}>
//         <Defs>
//           <SVGGradient id="spark" x1="0" y1="0" x2="1" y2="0">
           
//       <Stop offset="0.3" stopColor="#4D8BFF" stopOpacity={1} />   
//       <Stop offset="0.6" stopColor="rgba(9, 174, 69, 1)" stopOpacity={1} />  
     
//           </SVGGradient>
//         </Defs>
//         <Path
//     d="
//       M0 70
//       Q100 70 150 35
//       Q200 -5 250 35
//       Q300 70 400 70
//     "
//     fill="none"
//     stroke="#CDD7E1"  
//     strokeWidth={3}   
//   />
//         <AnimatedPath
//           animatedProps={animatedProps}
//           d="
//             M0 70
//             Q100 70 150 35
//             Q200 -5 250 35
//             Q300 70 400 70
//           "
//           fill="none"
//           stroke="url(#spark)"
//           strokeWidth="4"
//           strokeDasharray="120 300"
//         />
//         <Path
//           d="
//             M0 70
//             Q100 70 150 35
//             Q200 -5 250 35
//             Q300 70 400 70
//             L400 130
//             L0 130
//             Z
//           "
//           fill="#FFFFFF"
//         />
//       </Svg>
//       <TouchableOpacity
//         style={styles.leftItem}
//       >
//         <View style={styles.iconWrapper}>
//           {/* <Image source={require("../app/uivideos/home.png")} style={styles.icon} /> */}
//           <Home />
//           <Text style={styles.iconText}>Home</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.centerWrapper}
//          onPress={() => navigation.navigate("SuccessScreen")}
//       >
//         <View style={styles.centerCircle}>
         
//                <Add  width={24} height={24} stroke="white"/>
         
         
          
//         </View>
//         <Text style={styles.iconText}>My Reports</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.rightItem} onPress={logout}>
//         <View style={styles.iconWrapper}>
//           <Logout />
//           <Text style={styles.iconText}>Logout</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     height: 70,
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   lightGlow: {
//     position: "absolute",
//     bottom: 60,
//     width: "100%",
//     height: 80,
//     backgroundColor: "white",
//     opacity: 0.12,
//     filter: "blur(30px)",
//   },

//   svg: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },

//   leftItem: { position: "absolute", left: 35, bottom: 5 },
//   rightItem: { position: "absolute", right: 35, bottom: 5 },

//   iconWrapper: { alignItems: "center" },

//   icon: { width: 28, height: 28, tintColor: "#1a1919ff" },

//   iconText: { color: "white", fontSize: 12, marginTop: 2 },

//   centerWrapper: { position: "absolute", bottom: 5, alignItems: "center" },

//   centerCircle: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "rgba(9, 174, 69, 1)",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 10,
//   },
//   centerIcon: {
//     width: 32,
//     height: 32,
//     tintColor: "white",
//   },
// });




import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import Svg, { Path, Defs, LinearGradient as SVGGradient, Stop } from "react-native-svg";
import { useRoute } from "@react-navigation/native";

import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AuthContext } from "../src/context/AuthContext";
import Add from "./Add";
import { useNavigation } from "@react-navigation/native";
import Logout from "./Logout";
import Home from "./Home";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Animated Icon Wrapper Component
const AnimatedIconButton = ({ children, onPress, style }) => {
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const translateY = useSharedValue(0);
  



  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotateZ.value}deg` },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.15, { damping: 8, stiffness: 200 });
    translateY.value = withSpring(-5, { damping: 8, stiffness: 200 });
    rotateZ.value = withSpring(5, { damping: 8, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 8, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 8, stiffness: 200 });
    rotateZ.value = withSpring(0, { damping: 8, stiffness: 200 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      activeOpacity={0.9}
    >
      {children}
    </AnimatedTouchable>
  );
};

// Animated Center Button Component
const AnimatedCenterButton = ({ onPress, children }) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.1, { damping: 10, stiffness: 150 });
    rotate.value = withSpring(90, { damping: 12, stiffness: 180 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
    rotate.value = withSpring(0, { damping: 12, stiffness: 180 });
  };

  return (
    <AnimatedTouchable
      style={styles.centerWrapper}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <AnimatedView style={[styles.centerCircle, animatedStyle]}>
        {children}
      </AnimatedView>
      <Text style={styles.iconText}>My Reports</Text>
    </AnimatedTouchable>
  );
};

export default function Navbar() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const offset = useSharedValue(0);
  const route = useRoute();
  const currentRoute = route.name;
  const isHomeActive = currentRoute === "Home";

  useEffect(() => {
    offset.value = withRepeat(withTiming(1, { duration: 3000 }), -1, false);
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: offset.value * 500,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.lightGlow} />
      <Svg width="100%" height="130" viewBox="0 0 400 130" style={styles.svg}>
        <Defs>
          <SVGGradient id="spark" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0.3" stopColor="#4D8BFF" stopOpacity={1} />
            <Stop offset="0.6" stopColor="rgba(9, 174, 69, 1)" stopOpacity={1} />
          </SVGGradient>
        </Defs>
        <Path
          d="
            M0 70
            Q100 70 150 35
            Q200 -5 250 35
            Q300 70 400 70
          "
          fill="none"
          stroke="#CDD7E1"
          strokeWidth={3}
        />
        <AnimatedPath
          animatedProps={animatedProps}
          d="
            M0 70
            Q100 70 150 35
            Q200 -5 250 35
            Q300 70 400 70
          "
          fill="none"
          stroke="url(#spark)"
          strokeWidth="4"
          strokeDasharray="120 300"
        />
        <Path
          d="
            M0 70
            Q100 70 150 35
            Q200 -5 250 35
            Q300 70 400 70
            L400 130
            L0 130
            Z
          "
          fill="#FFFFFF"
        />
      </Svg>

      <AnimatedIconButton style={styles.leftItem}>
        <View style={styles.iconWrapper}>
          <Home color={ isHomeActive ? "#4D8BFF" : "black"} />
          <Text style={styles.iconText}>Home</Text>
        </View>
      </AnimatedIconButton>

      <AnimatedCenterButton onPress={() => navigation.navigate("ReportIssue")}>
        <Add width={24} height={24} stroke="white" />
      </AnimatedCenterButton>

      <AnimatedIconButton style={styles.rightItem} onPress={logout}>
        <View style={styles.iconWrapper}>
          <Logout />
          <Text style={styles.iconText}>Logout</Text>
        </View>
      </AnimatedIconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  lightGlow: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    height: 80,
    backgroundColor: "white",
    opacity: 0.12,
    filter: "blur(30px)",
  },

  svg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  leftItem: { position: "absolute", left: 35, bottom: 5 },
  rightItem: { position: "absolute", right: 35, bottom: 5 },

  iconWrapper: { alignItems: "center" },

  icon: { width: 28, height: 28, tintColor: "#1a1919ff" },

  iconText: { color: "white", fontSize: 12, marginTop: 2 },

  centerWrapper: { position: "absolute", bottom: 5, alignItems: "center" },

  centerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(9, 174, 69, 1)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  centerIcon: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
});