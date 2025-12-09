// CommunityScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddIcon from "../icons/AddIcon";
export const COMMUNITY_LANG = {
  en: {
    alerts: "Alerts",
    communities: "Communities",
    createCommunity: "Create Community",
    communityName: "Community Name",
    description: "Description",
    cancel: "Cancel",
    create: "Create",
    accessDenied: "Access Denied",
    notMember: "You are not a member of this community.",
    errorUser: "User not logged in",
    errorCreateTitle: "Error",
    errorCreateMsg: "Community name is required",
    successCreate: "Community created!",
    Shkjn: "Shkjn"
  },

  hi: {
    alerts: "सूचनाएँ",
    communities: "समुदाय",
    createCommunity: "समुदाय बनाएं",
    communityName: "समुदाय का नाम",
    description: "विवरण",
    cancel: "रद्द करें",
    create: "बनाएं",
    accessDenied: "पहुँच अस्वीकृत",
    notMember: "आप इस समुदाय के सदस्य नहीं हैं।",
    errorUser: "उपयोगकर्ता लॉगिन नहीं है",
    errorCreateTitle: "त्रुटि",
    errorCreateMsg: "समुदाय का नाम आवश्यक है",
    successCreate: "समुदाय बनाया गया!",
    Shkjn: "Shkjn"
  }
};


export default function CommunityScreen() {
  const navigation = useNavigation();

  const [communities, setCommunities] = useState([]);

  const [alerts, setAlerts] = useState([]);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem("lang");

      const currentLang = stored || "en";
      setLang(currentLang);
      console.log("stored", stored);
    };

    loadLang();
  }, []);

  async function loadAlerts() {
    try {
      const res = await axios.get(`${BASE_URL}/alerts/all`, {params: {lang: lang}});
      setAlerts(res.data.alerts);
      console.log("res of alerts", res.data.alerts);
    } catch (err) {
      console.log("Error fetching alerts:", err);
    }
  }

  useEffect(() => {
    getCommunities();
    loadAlerts();
  }, [lang]);

  const t = COMMUNITY_LANG[lang];

  const [showModal, setShowModal] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDesc, setCommunityDesc] = useState("");

  const createCommunity = async () => {
    if (!communityName.trim()) {
      Alert.alert("Error", "Community name is required");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      const body = {
        name: communityName,
        description: communityDesc,
        members: [userId],
      };

      const res = await axios.post(`${BASE_URL}/community/create`, body);

      Alert.alert("Success", "Community created!");

      setCommunities((prev) => [...prev, res.data.community]);

      setCommunityName("");
      setCommunityDesc("");
      setShowModal(false);
    } catch (err) {
      console.log("Create community error:", err);
      Alert.alert("Error", "Could not create community");
    }
  };

  const getCommunities = async () => {
    try {
      console.log("getting community details");
      const res = await axios.get(`${BASE_URL}/community/allcom`, {params: {lang:lang}});
      setCommunities(res.data.communities);
    } catch (err) {
      console.log("Error fetching communities:", err);
    }
  };

  const openCommunityChat = async (community) => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/community/${community._id}/check-member/${userId}`
      );

      if (res.data.isMember) {
        navigation.navigate("Chat", { communityId: community._id });
      } else {
        Alert.alert("Access Denied", "You are not a member of this community.");
      }
    } catch (err) {
      console.log("Membership check error:", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headingRow}>
        <Text style={styles.heading}>
          <View style={{ alignSelf: "flex-end", flex: 1 }}>
            <Image
              source={require("../icons/image.png")}
              style={{
                width: 40,
                height: 40,
                alignSelf: "flex-end",
              }}
            />
          </View>

          <View style={{ fontSize: 24, flex: 1, flexDirection: "column" }}>
            <Text style={{ fontSize: 24 }}> {t.alerts}</Text>

            <View style={{ height: 5 }}>
              <Text>Shkjn</Text>
            </View>
          </View>
        </Text>

        <TouchableOpacity onPress={() => setShowModal(true)}>
          <View style={{ flex: 1, marginTop: 16 }}>
            <AddIcon />
          </View>
        </TouchableOpacity>
      </View>
      {/* ALERTS SECTION */}

      <View>
        <FlatList
          data={alerts}
          keyExtractor={(item, idx) => "a-" + idx}
          renderItem={({ item }) => (
            <View style={styles.alertCard}>
              <Text style={styles.alertTitle}>{typeof item.title === "object"
                    ? item.title[lang]
                    : item.title}</Text>
              <Text style={styles.alertMsg}>{typeof item.message === "object"
                    ? item.message[lang]
                    : item.message}</Text>
              <Text style={styles.alertDept}>~ {typeof item.department === "object"
                    ? item.department[lang]
                    : item.department}</Text>
            </View>
          )}
        />
      </View>

      {/* COMMUNITY LIST */}
      <Text style={styles.section}>
        <Text style={styles.heading}>
          <View style={{ fontSize: 24, flex: 1, flexDirection: "column" }}>
            <Text style={{ fontSize: 22 }}> {t.communities} </Text>
          </View>
        </Text>
      </Text>
      <FlatList
        data={communities}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.communityCard}
            onPress={() => openCommunityChat(item)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../icons/community.png")}
                style={{ width: 48, height: 48 }}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.communityName}>
                  {typeof item.name === "object" ? item.name[lang] : item.name}
                </Text>
                <Text style={styles.desc}>
                  {typeof item.description === "object"
                    ? item.description[lang]
                    : item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.createCommunity}</Text>

            <TextInput
              value={communityName}
              onChangeText={setCommunityName}
              placeholder={t.communityName}
              style={styles.input}
            />

            <TextInput
              value={communityDesc}
              onChangeText={setCommunityDesc}
              placeholder={t.description}
              style={styles.input}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>{t.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={createCommunity}
              >
                <Text style={styles.saveText}>{t.create}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f4ff" },

  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 38,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    padding: 12,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },

  createBtn: {
    backgroundColor: "#4e7dfeff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },

  createBtnText: {
    backgroundColor: "#4e7dfeff",
    fontWeight: "700",
    color: "#fff",
  },

  communityCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    marginBottom: 12,
  },

  communityName: { fontSize: 18, fontWeight: "600" },
  desc: { marginTop: 4, color: "#555" },

  badge: {
    marginLeft: 10,
    backgroundColor: "red",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: { color: "white", fontWeight: "700", fontSize: 12 },

  section: { fontSize: 22, fontWeight: "700", marginVertical: 14, height: 44 },

  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    marginBottom: 10,
  },
  alertTitle: { fontSize: 16, fontWeight: "700" },
  alertMsg: { marginTop: 4, color: "#444" },
  alertDept: {
    marginTop: 6,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#009",
    alignSelf: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },

  cancelText: { color: "red", fontWeight: "600" },

  saveBtn: {
    backgroundColor: "blue",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  saveText: { color: "white", fontWeight: "700" },
});
