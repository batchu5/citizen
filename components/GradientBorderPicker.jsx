// import React, { useEffect } from "react";
// import { View, StyleSheet } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";
// import { LinearGradient } from "expo-linear-gradient";

// export default function GradientBorderPicker() {
//   const offset = useSharedValue(0); // start visible

//   useEffect(() => {
//     offset.value = withRepeat(
//       withTiming(1, { duration: 3000 }),
//       -1, // infinite loop
//       false
//     );
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateX: offset.value * 260, // move spark across the border
//         },
//       ],
//     };
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.borderWrapper}>
        
//         {/* Spark Moving Border */}
//         <Animated.View style={[styles.sparkContainer, animatedStyle]}>
//           <LinearGradient
//             colors={[
//               "rgba(255,140,0,0)",  
//               "rgba(255,140,0,1)",   // orange
//               "rgba(0,177,64,1)",    // green
//               "rgba(255,140,0,0)",   // fade
//             ]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.sparkLine}
//           />
//         </Animated.View>

        
//         <Picker selectedValue={selectedType} onValueChange={(itemValue) => setSelectedType(itemValue)} style={styles.innerBox} >
//            {issueOptions.map((option) => ( <Picker.Item key={option} label={option} value={option} /> ))}
//         </Picker> 
        

//       </View>
//     </View>
//   );
// }

// const BORDER_THICKNESS = 2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   borderWrapper: {
//     width: 300,
//     height: 60,
//     borderRadius: 15,
//     overflow: "hidden",
//     position: "relative",
//   },

//   // Spark line moving only on top border
//   sparkContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: BORDER_THICKNESS,
//     width: 120, // visible spark size
//   },

//   sparkLine: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 50,
//   },

//   // Inner picker box
//   innerBox: {
//     position: "absolute",
//     top: BORDER_THICKNESS,
//     bottom: BORDER_THICKNESS,
//     left: BORDER_THICKNESS,
//     right: BORDER_THICKNESS,
//     backgroundColor: "#212123",
//     borderRadius: 12,
//     justifyContent: "center",
//     color:"white"
//   },

//   picker: {
//     width: "100%",
//     height: "100%",
//     color:"white"
//   },
// });
