import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

export default function BeautifulGradient() {
  const offset = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const shimmerAnimation = useSharedValue(0);

  useEffect(() => {
    // Sparkle border animation
    offset.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      false
    );

    // Gentle pulse animation
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Shimmer animation
    shimmerAnimation.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value * 260,
        },
      ],
    };
  });

  // Gentle breathing effect
  const breathingStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.03]);
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.9, 1]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Shimmer overlay effect
  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerAnimation.value,
      [0, 1],
      [-200, 500]
    );
    
    return {
      transform: [{ translateX }, { rotate: '25deg' }],
    };
  });

  // Floating orbs effect
  const orb1Style = useAnimatedStyle(() => {
    const translateX = interpolate(pulseAnimation.value, [0, 1], [0, 30]);
    const translateY = interpolate(pulseAnimation.value, [0, 1], [0, -20]);
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.2]);
    
    return {
      transform: [{ translateX }, { translateY }, { scale }],
    };
  });

  const orb2Style = useAnimatedStyle(() => {
    const translateX = interpolate(pulseAnimation.value, [0, 1], [0, -25]);
    const translateY = interpolate(pulseAnimation.value, [0, 1], [0, 15]);
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.15]);
    
    return {
      transform: [{ translateX }, { translateY }, { scale }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Sparkle border at top */}
      <View style={styles.borderWrapper}>
        <Animated.View style={[styles.sparkContainer, sparkleStyle]}>
          <LinearGradient
            colors={[
              "rgba(230, 225, 220, 0)",
              "rgba(52, 96, 242, 1)",
              "rgba(9, 174, 69, 1)",
              "rgba(241, 239, 235, 0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sparkLine}
            pointerEvents="none"
          />
        </Animated.View>
      </View>

      {/* Main gradient with breathing effect */}
      <Animated.View style={[StyleSheet.absoluteFillObject, breathingStyle]}>
        <LinearGradient
          colors={[
            "rgba(83, 121, 247, 0.61)",
            "rgba(0,0,0,0.15)",
            "rgba(144, 238, 164, 0.25)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
        />
      </Animated.View>

      {/* Floating orb 1 - Blue */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient
          colors={["rgba(83, 121, 247, 0.4)", "rgba(83, 121, 247, 0)"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      {/* Floating orb 2 - Green */}
      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient
          colors={["rgba(144, 238, 164, 0.35)", "rgba(144, 238, 164, 0)"]}
          style={styles.orbGradient}
        />
      </Animated.View>

      {/* Shimmer effect */}
      <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.1)",
            "rgba(255, 255, 255, 0.2)",
            "rgba(255, 255, 255, 0.1)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>

      {/* Edge overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "transparent", "rgba(0,0,0,0.1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
        pointerEvents="none"
      />
    </View>
  );
}

const BORDER_THICKNESS = 2;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    transform: [{ translateY:-100}],
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 4,
    overflow: 'hidden',
    backgroundColor: '#0B0B0B',
    borderColor: '#201D16',
  },
  borderWrapper: {
    width: 800,
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  sparkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: BORDER_THICKNESS,
    width: 120,
  },
  sparkLine: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  orb: {
    position: 'absolute',
    borderRadius: 100,
    overflow: 'hidden',
  },
  orb1: {
    width: 120,
    height: 120,
    top: -30,
    left: 50,
  },
  orb2: {
    width: 100,
    height: 100,
    bottom: -20,
    right: 60,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  shimmerContainer: {
    position: 'absolute',
    width: 150,
    height: '300%',
    top: '-100%',
    left: 0,
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
});