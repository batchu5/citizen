import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LikeButton from "../../components/LikeButton";
import ImageScrollView from "./ImageScrollView";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,

} from "react-native-reanimated";
import { Video } from "expo-av";
import MyReportsButton from "../../components/SlideButton";
import Toggler from "../../components/Toggler";

import { Button, Text, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { G } from "react-native-svg";
import Navbar from "../../components/NavBar";
import AnimatedDropdown from "../../components/AnimatedDropdown";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { logout, user } = useContext(AuthContext);
  const [selectedCard, setSelectedCard] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value * 260,
        },
      ],
    };
  });


  const issueOptions = [
    "All",
    "Sanitation",
    "Roads & Infrastructure",
    "Electricity",
    "Water Supply",
    "Green Spaces",
    "Traffic Management",
  ];

  useEffect(() => {
    const loadReports = async () => {
      await fetchReports(selectedType);
    };
    loadReports();
  }, [selectedType]);

  const fetchReports = async (mode) => {
  try {
    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return alert("Permission denied!");

    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    const res = await axios.get(`${BASE_URL}/issues/nearby`, {
      params: {
        lat: latitude,
        lng: longitude,
        mode,          // "high" or "recent"
        issueType: selectedType,
      },
    });

    setReports(res.data.issues);
  } catch (err) {
    console.log("Error fetching:", err);
  } finally {
    setLoading(false);
  }
};


  const handleLike = async (issueId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const currentReport = reports.find(issue => issue._id === issueId);
      const userLiked = currentReport?.likes?.includes(user?._id || user?.id);

      let res;

      if (userLiked) {
        res = await axios.post(
          `${BASE_URL}/issues/${issueId}/unlike`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        res = await axios.post(
          `${BASE_URL}/issues/${issueId}/like`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      const updatedLikes = Array.isArray(res.data.likes)
        ? res.data.likes
        : new Array(res.data.likesCount).fill("temp");

      setReports((prev) =>
        prev.map((issue) =>
          issue._id === issueId
            ? { ...issue, likes: updatedLikes }
            : issue
        )
      );

      setSelectedCard((prev) =>
        prev && prev._id === issueId
          ? { ...prev, likes: updatedLikes }
          : prev
      );
    } catch (err) {
      console.log("Like error:", err);
      alert("Error updating like. Please try again.");
    }
  };


  const hasUserLiked = (report) => {
    return report.likes?.includes(user?._id || user?.id);
  };

  const renderReport = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => setSelectedCard(item)}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <View style={{ width: "100%", marginBottom: 4 }}>
         <View style={styles.borderWrapper}>


        </View> 
      </View>
      <View style={{ transform: [{ translateY: -90 }], flexDirection: "row", justifyContent: "space-between", zIndex: 10000  }}>
        <AnimatedDropdown
          options={issueOptions}
          selected={selectedType}
          onSelect={setSelectedType}
        />
        <MyReportsButton />
      </View>
      <View style={{ backgroundColor: "#F6F8F7", transform: [{ translateY: -70 }] }}>
        <ImageScrollView />
      </View>
      <View style={{transform: [{ translateY: -34 }] }}>
         <Toggler onToggle={(mode) => fetchReports(mode)} />

      </View>
     
     
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator animating size="large" color="#2563EB" />
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 19,
            }}
            renderItem={renderReport}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
        <View style={styles.navbarWrapper}>
          <Navbar navigation={navigation} />
        </View>

      </View>
      {selectedCard && (
        <TouchableWithoutFeedback onPress={() => setSelectedCard(null)}>
          <View style={styles.modalOverlay}>

            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalBox}>
                {selectedCard.image && (
                  <Image
                    source={{ uri: selectedCard.image }}
                    style={styles.modalImage}
                  />
                )}
                <Text style={styles.modalType}>{selectedCard.issueType}</Text>
                <Text style={styles.modalDesc}>{selectedCard.description}</Text>

                <View style={styles.modalActions}>
                  <LikeButton
                    isLiked={hasUserLiked(selectedCard)}
                    onToggleLike={() => handleLike(selectedCard._id)}
                  />

                  <Text style={styles.reactionText}>
                    {selectedCard.likes?.length || 0}
                  </Text>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleLike(selectedCard._id)}
                  >
                    <Image
                      source={require("../uivideos/thumbs-down-.png")}
                      style={[
                        styles.reactionIcon,
                        !hasUserLiked(selectedCard)
                          ? { tintColor: "#DC2626" }
                          : { tintColor: "#313030ff" }
                      ]}
                    />
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      )}

    </View>
  );
}

const BORDER_THICKNESS = 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F7",
    // paddingTop: 40,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 80,
  },
  iconCircleFAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8566cfff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleFMy: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7688eeff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleFL: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#65dfb0ff",
    justifyContent: "center",
    alignItems: "center",
  },

  iconImage: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },
  leftButtons: {
    transform: [{ translateY: -13 }],
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 13
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  actionBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
  pickerContainer: {
    transform: [
      { translateY: -40 },
      { translateX: 40 }
    ],
    marginHorizontal: 20,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: "#201D16",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 12,
    width: 300,
    height: 55,
    color: "white",
    justifyContent: "center",
    backgroundColor: "#212123",
  },

  picker: {
    color: "white",
    height: 80,
    paddingHorizontal: 10,
  },

  logoutContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },

  logoutBtnBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  cardContainer: { alignItems: "center", },
  card: {
    width: width * 0.44,
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    color: "#1e1d1dff",
    padding: 8,
    marginVertical: 10,
   borderWidth: 1,
    borderColor: "#CDD7E1",
    borderRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
  },
  desc: {
    color: "#181818ff",
    fontSize: 12,
    fontWeight: "500",


  },

  likeBtn: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  likedBtn: {
    backgroundColor: "#FECACA",
    borderColor: "#DC2626",
  },
  notLikedBtn: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3d52ddff",
  },
  likeText: {
    fontWeight: "700",
  },
  likedText: {
    color: "#DC2626",
  },
  navbarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  }
  ,
  notLikedText: {
    color: "#3d52ddff",
  },
  likesContainer: {
    position: "absolute",
    bottom: 1,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactionText: {
    color: "#181818ff",
    fontSize: 16,
  },
  reactionIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  iconButton: {
    padding: 4,
  },

  logoutBtn: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    fontWeight: "700",
  },
  Gradcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  borderWrapper: {
    width: 800,
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
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
  picker: {
    width: "100%",
    height: "100%",
    color: "white"
  },
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    width: 26,
    height: 26,
    tintColor: "white",
  },
  navText: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 999,

  },
  modalBox: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    elevation: 10,
    position: "relative",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#CDD7E1",
    borderColor: "#444",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 10,
  },
  modalDesc: {
    color: "#1e1d1dff",
    fontSize: 14,
    justifyContent: "flex-start",
    fontWeight: "500",
    marginBottom: 20,

  },

  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  modalType: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color:"black"

  },
});