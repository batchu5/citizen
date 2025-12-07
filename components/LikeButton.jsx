



import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);

export default function LikeButton({ size = 47, isLiked, onToggleLike }) {
  // Animation values
  const handScale = useRef(new Animated.Value(1)).current;
  const handRotate = useRef(new Animated.Value(0)).current;
  const handColor = useRef(new Animated.Value(0)).current;

  const line1Dash = useRef(new Animated.Value(40)).current;
  const line2Dash = useRef(new Animated.Value(40)).current;
  const line3Dash = useRef(new Animated.Value(40)).current;
  const line4Dash = useRef(new Animated.Value(40)).current;
  const line5Dash = useRef(new Animated.Value(40)).current;
  const line6Dash = useRef(new Animated.Value(40)).current;
  const line7Dash = useRef(new Animated.Value(40)).current;

  const circle1Opacity = useRef(new Animated.Value(0)).current;
  const circle2Opacity = useRef(new Animated.Value(0)).current;
  const circle3Opacity = useRef(new Animated.Value(0)).current;

  const flower1Opacity = useRef(new Animated.Value(0)).current;
  const flower2Opacity = useRef(new Animated.Value(0)).current;
  const flower3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLiked) startAnimation();
    else resetAnimation();
  }, [isLiked]);

  const handlePress = () => {
    if (!isLiked) startAnimation();
    else resetAnimation();
    onToggleLike();
  };

  const startAnimation = () => {
    const duration = 1500;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(handScale, {
          toValue: 1.3,
          duration: duration * 0.2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(handRotate, {
          toValue: -15,
          duration: duration * 0.2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(handColor, {
          toValue: 1,
          duration: duration * 0.2,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(handRotate, {
          toValue: -30,
          duration: duration * 0.2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(handColor, {
          toValue: 2,
          duration: duration * 0.2,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(handScale, {
          toValue: 1,
          duration: duration * 0.27,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(handRotate, {
          toValue: 0,
          duration: duration * 0.27,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(handColor, {
          toValue: 5,
          duration: duration * 0.27,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    animateLine(line1Dash, 0.2, 0.4, duration);
    animateLine(line2Dash, 0.2, 0.4, duration);
    animateLine(line3Dash, 0.3, 0.4, duration);
    animateLine(line4Dash, 0.3, 0.4, duration);
    animateLine(line5Dash, 0.35, 0.4, duration);
    animateLine(line6Dash, 0.35, 0.4, duration);
    animateLine(line7Dash, 0.35, 0.4, duration);

    animateCircle(circle1Opacity, duration);
    animateCircle(circle2Opacity, duration);
    animateCircle(circle3Opacity, duration);

    animateFlower(flower1Opacity, 0.5, 0.55, 0.7, duration);
    animateFlower(flower2Opacity, 0.55, 0.65, 0.8, duration);
    animateFlower(flower3Opacity, 0.5, 0.55, 0.7, duration);
  };

  const animateLine = (animValue, startTime, endTime, duration) => {
    Animated.sequence([
      Animated.delay(duration * startTime),
      Animated.timing(animValue, {
        toValue: 0,
        duration: duration * (endTime - startTime),
        easing: Easing.ease,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 40,
        duration: duration * 0.1,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animateCircle = (animValue, duration) => {
    Animated.sequence([
      Animated.delay(duration * 0.5),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.delay(duration * 0.1),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateFlower = (animValue, start, peak, end, duration) => {
    Animated.sequence([
      Animated.delay(duration * start),
      Animated.timing(animValue, {
        toValue: 1,
        duration: duration * (peak - start),
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.delay(duration * (end - peak)),
      Animated.timing(animValue, {
        toValue: 0,
        duration: duration * 0.1,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetAnimation = () => {
    handScale.setValue(1);
    handRotate.setValue(0);
    handColor.setValue(0);

    [line1Dash, line2Dash, line3Dash, line4Dash, line5Dash, line6Dash, line7Dash].forEach(v => v.setValue(40));
    [circle1Opacity, circle2Opacity, circle3Opacity, flower1Opacity, flower2Opacity, flower3Opacity].forEach(v => v.setValue(0));
  };

  const handFill = handColor.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5],
    outputRange: ['#fff', '#cbfcc9', '#ab71f7', '#ddd926', '#f28032', '#fe443b'],
  });


  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 40 40">
          {isLiked ? (
            <G origin={`${size/2}, ${size/2}`}>
              <AnimatedCircle cx="8.85" cy="7.44" r="1.5" fill="#dec83c" opacity={circle1Opacity} />
              <AnimatedCircle cx="33.2" cy="33.67" r="1" fill="#fb493f" opacity={circle2Opacity} />
              <AnimatedCircle cx="32.08" cy="8.25" r=".75" fill="#cbfcc9" opacity={circle3Opacity} />
              <AnimatedCircle cx="8.33" cy="35.38" r=".75" fill="#cbfcc9" opacity={circle3Opacity} />

              <AnimatedPath d="m9.1,5.37c-.24.14-.54.06-.68-.18s-.06-.54.18-.68.54-.06.68.18.06.54-.18.68Zm-2.42.32c-.28,0-.5.22-.5.5,0,.28.22.5.5.5s.5-.22.5-.5c0-.28-.22-.5-.5-.5Zm-.43,2.75c-.14.24-.06.54.18.68s.54.06.68-.18.06-.54-.18-.68-.54-.06-.68.18Zm2.17,1.75c.14.24.44.32.68.18s.32-.44.18-.68-.44-.32-.68-.18-.32.44-.18.68Zm2.6-1c.28,0,.5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5Zm.43-2.75c.14-.24.06-.54-.18-.68s-.54-.06-.68.18-.06.54.18.68.54.06.68-.18Z" fill="#dec83c" opacity={flower1Opacity} />
              <AnimatedPath d="m7.83,33.13c0-.28.22-.5.5-.5s.5.22.5.5c0,.28-.22.5-.5.5s-.5-.22-.5-.5Zm-1.02,1.38c.14-.24.06-.54-.18-.68s-.54-.06-.68.18-.06.54.18.68.54.06.68-.18Zm0,1.75c-.14-.24-.44-.32-.68-.18s-.32.44-.18.68.44.32.68.18.32-.44.18-.68Zm1.52.88c-.28,0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5Zm1.52-.87c-.14.24-.06.54.18.68s.54.06.68-.18.06-.54-.18-.68-.54-.06-.68.18Zm0-1.75c.14.24.44.32.68.18s.32-.44.18-.68-.44-.32-.68-.18-.32.44-.18.68Z" fill="#cbfcc9" opacity={flower2Opacity} />
              <AnimatedPath d="m32.7,36.17c0-.28.22-.5.5-.5s.5.22.5.5c0,.28-.22.5-.5.5s-.5-.22-.5-.5Zm3.1-1c.14-.24.06-.54-.18-.68s-.54-.06-.68.18-.06.54.18.68.54.06.68-.18Zm0-3c-.14-.24-.44-.32-.68-.18s-.32.44-.18.68.44.32.68.18.32-.44.18-.68Zm-2.6-1.5c-.28,0-.5.22-.5.5,0,.28.22.5.5.5s.5-.22.5-.5-.22-.5-.5-.5Zm-2.6,1.5c-.14.24-.06.54.18.68s.54.06.68-.18.06-.54-.18-.68-.54-.06-.68.18Zm0,3c.14.24.44.32.68.18s.32-.44.18-.68-.44-.32-.68-.18-.32.44-.18.68Z" fill="#fb493f" opacity={flower3Opacity} />
              <AnimatedPath d="m32.58,6c0,.28-.22.5-.5.5s-.5-.22-.5-.5.22-.5.5-.5.5.22.5.5Zm-2.88.87c-.14.24-.06.54.18.68s.54.06.68-.18.06-.54-.18-.68-.54-.06-.68.18Zm0,2.75c.14.24.44.32.68.18s.32-.44.18-.68-.44-.32-.68-.18-.32.44-.18.68Zm2.38,1.38c.28,0,.5-.22.5-.5,0-.28-.22-.5-.5-.5s-.5.22-.5.5c0,.28.22.5.5.5Zm2.38-1.37c.14-.24.06-.54-.18-.68s-.54-.06-.68.18-.06.54.18.68.54.06.68-.18Zm0-2.75c-.14-.24-.44-.32-.68-.18s-.32.44-.18.68.44.32.68.18.32-.44.18-.68Z" fill="#cbfcc9" opacity={flower2Opacity} />

              <AnimatedLine x1="33.2" y1="33.67" x2="37.16" y2="37.63" stroke="#fb493f" strokeWidth="2" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line1Dash} />
              <AnimatedLine x1="32.08" y1="8.25" x2="36.74" y2="3.59" stroke="#cbfcc9" strokeWidth="2" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line4Dash} />
              <AnimatedLine x1="8.73" y1="7.3" x2="4.63" y2="3.2" stroke="#dec83c" strokeWidth="3" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line3Dash} />
              <AnimatedLine x1="8.33" y1="35.38" x2="5.72" y2="37.99" stroke="#cbfcc9" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line2Dash} />
              <AnimatedPath d="m24.47,8.03c-1.32-1.84,1.6-5.11,2.06-2.97.37,1.74-4.2,0-2.68-2.97" stroke="#cbfcc9" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line2Dash} />
              <AnimatedPath d="m27.15,32.66c.75,1.37-2.07,5.62-2.82,3.96-.64-1.42,3.02-1.3,3.76,1.36" stroke="#ab71f7" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line6Dash} />
              <AnimatedLine x1="33.46" y1="29.71" x2="37.97" y2="29.71" stroke="#dec83c" strokeWidth="2" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line7Dash} />
              <AnimatedLine x1="7.56" y1="13.99" x2="2.91" y2="13.99" stroke="#fb493f" strokeWidth="2" strokeLinecap="round" strokeDasharray="40" strokeDashoffset={line5Dash} />

              <G scale={handScale} rotation={handRotate} origin="20, 20">
                <AnimatedPath d="m17.5,29.71c-.55,0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41v-10.18c0-.27.05-.52.16-.76.11-.24.25-.45.44-.64l5.43-5.4c.25-.23.55-.38.89-.42.34-.05.67,0,.99.17.32.17.55.4.69.7.14.3.17.61.09.92l-1.12,4.6h5.45c.53,0,1,.2,1.4.6.4.4.6.87.6,1.4v2c0,.12-.01.24-.04.38-.02.13-.06.26-.11.38l-3,7.05c-.15.33-.4.62-.75.85-.35.23-.72.35-1.1.35h-8Zm-6,0c-.55,0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41v-9c0-.55.2-1.02.59-1.41.39-.39.86-.59,1.41-.59s1.02.2,1.41.59c.39.39.59.86.59,1.41v9c0,.55-.2,1.02-.59,1.41-.39.39-.86.59-1.41.59Z" fill={handFill} />
              </G>
            </G>
          ) : (
            <Path d="m17.5,29.71c-.55,0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41v-10.18c0-.27.05-.52.16-.76.11-.24.25-.45.44-.64l5.43-5.4c.25-.23.55-.38.89-.42.34-.05.67,0,.99.17.32.17.55.4.69.7.14.3.17.61.09.92l-1.12,4.6h5.45c.53,0,1,.2,1.4.6.4.4.6.87.6,1.4v2c0,.12-.01.24-.04.38-.02.13-.06.26-.11.38l-3,7.05c-.15.33-.4.62-.75.85-.35.23-.72.35-1.1.35h-8Zm-6,0c-.55,0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41v-9c0-.55.2-1.02.59-1.41.39-.39.86-.59,1.41-.59s1.02.2,1.41.59c.39.39.59.86.59,1.41v9c0,.55-.2,1.02-.59,1.41-.39.39-.86.59-1.41.59Z" stroke="#313030ff" strokeWidth="0.8" fill="none" />
          )}
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});





