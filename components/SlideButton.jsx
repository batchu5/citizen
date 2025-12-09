import React, { useState } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
export default function MyReportsButton({value}){
  const [scaleValue] = useState(new Animated.Value(1));
  const [shimmerAnim] = useState(new Animated.Value(0));
  const [shimmerPosition, setShimmerPosition] = useState({ x: 0, y: 0 });
  const navigation = useNavigation();
    const handlePress = () => {
    navigation.navigate("MyReports"); // use the correct navigation object
  };
  const handlePressIn = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setShimmerPosition({ x: locationX, y: locationY });
    
    // Scale up animation
    Animated.spring(scaleValue, {
      toValue: 1.1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Shimmer animation
    shimmerAnim.setValue(0);
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Scale down animation
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const shimmerScale = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{value}</Text>
        
        <Animated.View
          style={[
            styles.shimmer,
            {
              left: shimmerPosition.x,
              top: shimmerPosition.y,
              opacity: shimmerOpacity,
              transform: [{ scale: shimmerScale }],
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4e7dfeff', // Purple color
    paddingVertical: 13,
    marginRight: 2,
    right:4,
    paddingHorizontal: 14,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignSelf: "center",
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  shimmer: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(14, 110, 244, 0.6)', // Blue shimmer matching button color
    marginLeft: -50,
    marginTop: -50,
  },
});

