import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Community from "./Community";
import { useNavigation } from "@react-navigation/native";

export default function HomeHeader() {
  const navigation = useNavigation(); 
  return (
    <View style={styles.container}>
      {/* TITLE + X IMAGE */}
      <View style={styles.titleWrapper}>
        <Text style={styles.titleText}>Civic</Text>

        <Image
          source={require("../app/uivideos/x.png")}
          style={styles.xIcon}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 20,
          right: 90,
          transform: [{ translateY: 14 }],
        }}
      >
      
      <TouchableOpacity onPress={() => {navigation.navigate("Community")}}>
        <Image
          source={require("../app/uivideos/community.png")}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />


      </TouchableOpacity>
        
        <Image
          source={require("../app/uivideos/user.png")}
          style={{
            width: 34,
            height: 34,
            tintColor: "#303030",
            borderRadius: 20,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: "100%",
    flexDirection: "row", // important if you want horizontal layout
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F6F8F7",
  },

  titleWrapper: {
    top: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    marginRight: -2,
  },

  xIcon: {
    width: 38,
    height: 38,
    marginTop: 6,
  },
  profileIcon: {
    width: 30,
    height: 30,
    top: 18,
  },
});
