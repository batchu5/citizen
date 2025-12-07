import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ImageScrollView() {
  const screenWidth = 390 + 20; // card width + margin
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    { src: require("../uivideos/sanitation.webp"), title: "Sanitation" },
    { src: require("../uivideos/water1.jpg"), title: "Water Issue" },
    { src: require("../uivideos/roads.webp"), title: "Road Damage" },
    { src: require("../uivideos/elecricity1.png"), title: "Electricity" },
    { src: require("../uivideos/traffic.jpg"), title: "Traffic Issue" },
  ];

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= images.length) nextIndex = 0;

      scrollRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Detect index when user manually scrolls
  const onScrollEnd = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {images.map((item, index) => (
          <View
            key={index}
            style={{
              marginRight: 20,
              borderRadius: 20,
              width: 390,
              height: 210,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 15,
              overflow: "hidden",
              backgroundColor: "#141414",
            }}
          >
            <TouchableOpacity style={{ borderRadius: 20, overflow: "hidden" }}>
              <Image
                source={item.src}
                style={{ width: "100%", height: "100%" }}
              />

              {/* Bottom Gradient */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: 45,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
                  {item.title}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Circles */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        {images.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 50,
              marginHorizontal: 5,
              backgroundColor: i === activeIndex ? "#007BFF" : "#BEE3F8",
            }}
          />
        ))}
      </View>
    </View>
  );
}
