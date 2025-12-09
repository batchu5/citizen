import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Community from "./Community";
import { useNavigation } from "@react-navigation/native";

export default function HomeHeader() {
  const navigation = useNavigation(); 
  return (
    <View style={styles.headercontainer}>
      {/* TITLE + X IMAGE */}
      <View style={styles.headertitleWrapper}>
        <Text style={styles.headertitleText}>Civic</Text>

        <Image
          source={require("../src/uivideos/x.png")}
          style={styles.headerxIcon}
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
          source={require("../src/uivideos/community.png")}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />


      </TouchableOpacity>
        
        <Image
          source={require("../src/uivideos/user.png")}
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
  headercontainer: {
    height: 90,
    width: "100%",
    flexDirection: "row", // important if you want horizontal layout
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F6F8F7",
  },

  headertitleWrapper: {
    top: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  headertitleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    marginRight: -2,
  },

  headerxIcon: {
    width: 38,
    height: 38,
    marginTop: 6,
  },
  headerprofileIcon: {
    width: 30,
    height: 30,
    top: 18,
  },
});
