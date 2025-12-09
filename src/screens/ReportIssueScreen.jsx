import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import { createIssue } from "../api/issueApi";
import { BASE_URL } from "../utils/constants";
import DropDownPicker from "react-native-dropdown-picker";
import { saveImageOffline } from "../../db/offlineUpload";
import { useSQLiteContext } from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import { syncWithBackend } from "../../db/offlineUpload";

export default function ReportIssueScreen({ navigation }) {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [issueType, setIssueType] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const STRINGS = {
    en: {
      title: "Report an Issue",
      subtitle: "Your feedback helps improve your community",

      capturePhoto: "Capture Photo",
      locationCaptured: "Location Captured",
      getLocation: "Get Location",

      selectIssueType: "Select Issue Type",
      descriptionLabel: "Description",
      submitIssue: "Submit Issue",

      duplicateTitle: "Similar Issue Detected",
      differentBtn: "It's Different",
      sameBtn: "No, It's Same",
    },
    hi: {
      title: "समस्या की रिपोर्ट करें",
      subtitle: "आपका फीडबैक आपके समुदाय को बेहतर बनाने में मदद करता है",

      capturePhoto: "फोटो कैप्चर करें",
      locationCaptured: "स्थान कैप्चर हो गया",
      getLocation: "स्थान प्राप्त करें",

      selectIssueType: "समस्या का प्रकार चुनें",
      descriptionLabel: "विवरण",
      submitIssue: "समस्या सबमिट करें",

      duplicateTitle: "मिलती-जुलती समस्या मिली",
      differentBtn: "यह अलग है",
      sameBtn: "नहीं, यह वही है",
    },
  };

  const [lang, setLang] = useState("en");

  useEffect(() => {
    const loadLang = async () => {
      try {
        const stored = await AsyncStorage.getItem("lang");
        if (stored === "hi" || stored === "en") {
          setLang(stored);
        }
      } catch (e) {
        console.log("Failed to load lang", e);
      }
    };
    loadLang();
  }, []);
   const t = STRINGS[lang] || STRINGS.en;

  const ISSUE_TYPES = {
  en: [
    { label: "Sanitation", value: "Sanitation" },
    { label: "Roads & Infrastructure", value: "Roads & Infrastructure" },
    { label: "Electricity", value: "Electricity" },
    { label: "Water Supply", value: "Water Supply" },
    { label: "Green Spaces", value: "Green Spaces" },
    { label: "Traffic Management", value: "Traffic Management" },
    { label: "Other", value: "Other" }
  ],

  hi: [
    { label: "स्वच्छता", value: "Sanitation" },
    { label: "सड़कें और अवसंरचना", value: "Roads & Infrastructure" },
    { label: "बिजली", value: "Electricity" },
    { label: "जल आपूर्ति", value: "Water Supply" },
    { label: "हरित क्षेत्र", value: "Green Spaces" },
    { label: "यातायात प्रबंधन", value: "Traffic Management" },
    { label: "अन्य", value: "Other" }
  ]
};

  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem("lang");
      const currentLang = stored || "en";
      setLang(currentLang);

      // SET DROPDOWN LABELS BASED ON LANGUAGE
      setDropdownItems(ISSUE_TYPES[currentLang]);
    };

    loadLang();
  }, []);


  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [existingIssue, setExistingIssue] = useState(null);
  const db = useSQLiteContext();
  console.log("🟡 DB instance:", db);
  // const imageRef = useRef<View>(null);

  useEffect(() => {
    console.log("image");
  }, [image]);

  useEffect(() => {
    (async () => {
      const rows = await db.getAllAsync("SELECT * FROM images");
      console.log("DB CONTENT:", rows);
    })();
  }, []);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(async(state) => {
      console.log("internet is connected now");
      const token = await AsyncStorage.getItem("token");
      if (state.isConnected) {
        await syncWithBackend(db, token);
      }
    });
    return () => unsub();
  }, []);

  const checkOfflineDuplicate = async (db, { issueType, geoLocation }) => {
    const rows = await db.getAllAsync(
      "SELECT * FROM images WHERE is_synced = 1"
    );
    console.log("geo Location from checkofflineDuplicate", geoLocation);

    if (!rows.length) return null;

    const [lng, lat] = geoLocation.coordinates;

    let closest = null;

    for (const row of rows) {
      const savedGeo = JSON.parse(row.geoLocation);
      const [sLng, sLat] = savedGeo.coordinates;
      const dist = Math.sqrt((lng - sLng) ** 2 + (lat - sLat) ** 2);

      if (row.issueType === issueType && dist < 0.00005) {
        closest = row;
        break;
      }
    }
    console.log("closest", closest);
    setExistingIssue(closest);

    return closest;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return alert("Permission denied!");
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const submitIssue = async () => {
    if (!issueType) return alert("Please select an issue type");
    if (!location) return alert("Please capture your location");

    console.log("inside the submit issue");
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const geoLocation = {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      };

      await uploadNewIssue(token, geoLocation);
    } catch (err) {
      console.log("Issue submission error:", err);
      alert("Failed to submit issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalUpload = async (token, geoLocation) => {
    await saveImageOffline({
      db,
      imageUri: image,
      issueType,
      description,
      location: JSON.stringify(location),
      geoLocation: JSON.stringify(geoLocation),
    });

    const state = await NetInfo.fetch();
    if (state.isConnected) {
      const result = await syncWithBackend(db, token);
      console.log("result from handlefileupload", result);
      navigation.navigate("SuccessScreen", {priority: result} );
      return;
    }

    alert("Saved offline. Will upload when internet comes.");
  };

  const createIssue = async (token, geoLocation) => {
    console.log("create Issue");
    const dup = await checkOfflineDuplicate(db, { issueType, geoLocation });

    if (dup) {
      console.log("duplicate issue exists from the database (SQLITE)");
      setExistingIssue(dup);
      setShowDuplicateModal(true);
      return;
    }

    await handleFinalUpload(token, geoLocation);
  };

  const uploadNewIssue = async (token, geoLocation) => {
    try {
      console.log("upload new Issue");

      if (image) {
        console.log("selected IMage", image);
        await createIssue(token, geoLocation);
      }
    } catch (e) {
      console.log("error: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>
          {t.subtitle}
        </Text>

        <Button
          mode="outlined"
          icon="camera"
          onPress={pickImage}
          textColor="black"
          style={styles.outlinedButton}
        >
          {t.capturePhoto}
        </Button>

        {image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </View>
        )}

        <Button
          mode="outlined"
          icon={location ? null : "map-marker"}
          onPress={getLocation}
          textColor={location ? "green" : "black"}
          style={styles.outlinedButton}
        >
          {location ? t.locationCaptured : t.getLocation}
        </Button>

        <View style={{ marginVertical: 12, zIndex: 1000 }}>
          <DropDownPicker
            open={open}
            value={dropdownValue}
            items={dropdownItems}
            setOpen={setOpen}
            setValue={(val) => {
              setDropdownValue(val());
              setIssueType(val());
            }}
            setItems={setDropdownItems}
            placeholder={t.selectIssueType}
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#9FA6AD",
              borderRadius: 12,
              elevation: 3,
              minHeight: 55,
            }}
            dropDownContainerStyle={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#9FA6AD",
              borderRadius: 12,
              elevation: 3,
              fontSize: 16,
            }}
            placeholderStyle={{
              color: "black",
              fontSize: 16,
            }}
            labelStyle={{
              color: "black",
              fontSize: 16,
            }}
            listItemLabelStyle={{
              color: "black",
            }}
            arrowIconStyle={{
              tintColor: "black",
            }}
            textStyle={{
              color: "black",
            }}
          />
        </View>

        <TextInput
          label={<Text style={{ color: "black" }}>{t.descriptionLabel}</Text>}
          value={description}
          onChangeText={setDescription}
          multiline
          mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: "black",
              outline: "#9FA6AD",
              onSurface: "white",
              text: "black",
            },
          }}
          outlineColor="#E0E0E0"
          activeOutlineColor="#9FA6AD"
          textColor="black"
          placeholderTextColor="black"
        />

        <Button
          mode="contained"
          onPress={submitIssue}
          disabled={loading}
          style={styles.submitButton}
          contentStyle={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 8,
          }}
        >
          {loading ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: 1 }}>
              {t.submitIssue}
            </Text>
          )}
        </Button>

        <Modal
          visible={showDuplicateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDuplicateModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.duplicateTitle}</Text>

              {existingIssue?.uri && (
                <Image
                  source={{ uri: existingIssue.uri }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              )}

              <Text style={styles.modalDescription}>
                {existingIssue?.description}
              </Text>

              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  buttonColor="#2563EB"
                  textColor="white"
                  onPress={async() => {
                    const token = await AsyncStorage.getItem("token");
                    const geoLocation = {
                      type: "Point",
                      coordinates: [location.longitude, location.latitude],
                    };
                    setShowDuplicateModal(false);
                    handleFinalUpload(token, geoLocation);
                  }}
                >
                  {t.differentBtn}
                </Button>

                <Button
                  mode="outlined"
                  textColor="#2563EB"
                  style={{
                    borderColor: "#2563EB",
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    setShowDuplicateModal(false);
                  }}
                >
                  {t.sameBtn}
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F7",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#4e7dfeff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#838893ff",
    textAlign: "center",
    marginBottom: 20,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: "#9FA6AD",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 8,
    borderRadius: 12,
  },
  previewContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  imagePreview: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginBottom: 6,
  },
  successText: {
    color: "#16A34A",
    textAlign: "center",
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "#202022",
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#444",
    marginVertical: 12,
    overflow: "hidden",
  },
  picker: {
    height: 60,
    color: "white",
    fontSize: 16,
    borderRadius: 16,
  },
  input: {
    marginVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    minHeight: 140,
  },
  submitButton: {
    backgroundColor: "#329a4cff",
    borderRadius: 12,
    color: "white",
    marginTop: 12,
  },
  confirmationText: {
    textAlign: "center",
    color: "#16A34A",
    marginTop: 15,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 2,
  },
});
