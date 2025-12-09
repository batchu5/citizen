import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { BASE_URL, WS_BASE_URL } from "../utils/constants";
import axios from "axios";

export default function Chat({ route }) {
  const { communityId } = route.params;

  const wsRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [communityDet, setCommunityDet] = useState(null);
  const [text, setText] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  // ------------------------------------
  // Load Chat Messages + Community Details
  // ------------------------------------
  useEffect(() => {
    async function loadMessages() {
      const res = await fetch(`${BASE_URL}/chat/messages/${communityId}`);
      const data = await res.json();
      setMessages(data.messages);
    }

    async function getCommunityDetails() {
      const res = await axios.get(`${BASE_URL}/community/${communityId}`);
      setCommunityDet(res.data.community);
    }

    loadMessages();
    getCommunityDetails();
    connectWebSocket();

    return () => wsRef.current?.close();
  }, []);

  // ------------------------------------
  // Load all NON-MEMBER users
  // ------------------------------------
  async function loadNonMembers() {
    try {
      const res = await axios.get(
        `${BASE_URL}/community/${communityId}/non-members`
      );

      setUserList(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (err) {
      console.log("Fetch non-members error:", err);
    }
  }

  // ------------------------------------
  // WebSocket Connection
  // ------------------------------------
  function connectWebSocket() {
    const url = `${WS_BASE_URL}/ws/chat?community=${communityId}`;
    console.log("Connecting WS:", url);

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("WS Connected");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat") {
          setMessages((prev) => [...prev, data.payload]);
        }
      } catch (err) {
        console.log("WS parse error:", err);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WS Closed - Reconnecting...");
      setTimeout(connectWebSocket, 2000);
    };
  }

  // ------------------------------------
  // Search filter
  // ------------------------------------
  function handleSearch(text) {
    setSearchText(text);

    if (!text.trim()) {
      setFilteredUsers(userList);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = userList.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.phoneNumber.includes(lower)
    );

    setFilteredUsers(filtered);
  }

  // ------------------------------------
  // Select/deselect members
  // ------------------------------------
  function toggleSelect(userId) {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  }

  // ------------------------------------
  // Add selected users to community
  // ------------------------------------
  async function addMembersToCommunity() {
    if (selectedUsers.length === 0) return;

    try {
      await axios.post(`${BASE_URL}/community/add-members`, {
        communityId,
        members: selectedUsers,
      });

      Alert.alert("Success", "Members added!");

      setShowAddModal(false);
      setSelectedUsers([]);
    } catch (err) {
      console.log("Add members error:", err);
      Alert.alert("Error", "Couldn't add members");
    }
  }

  // ------------------------------------
  // Send Message
  // ------------------------------------
  function sendMessage() {
    if (!text.trim()) return;

    const msg = {
      type: "chat",
      payload: {
        text,
        sender: "You",
        timestamp: new Date().toISOString(),
      },
    };

    wsRef.current?.send(JSON.stringify(msg));
    setText("");
  }

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.heading}>
            {communityDet?.name.en || "Loading..."}
          </Text>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              loadNonMembers();
              setShowAddModal(true);
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* CHAT MESSAGES */}
        <FlatList
          data={messages}
          style={{ flex: 1 }}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({ item }) => {
            const isMe = item.sender === "You";

            return (
              <View
                style={[
                  styles.msgWrapper,
                  isMe ? styles.myWrapper : styles.otherWrapper,
                ]}
              >
                <View
                  style={[
                    styles.msgBubble,
                    isMe ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  {!isMe && <Text style={styles.msgSender}>{item.sender}</Text>}

                  <Text style={styles.msgText}>{item.text}</Text>

                  <Text style={styles.msgTime}>
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* INPUT BOX */}
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message"
            style={styles.input}
          />

          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Text style={{ color: "white", fontWeight: "700" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ADD PEOPLE MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add People</Text>

            <TextInput
              value={searchText}
              onChangeText={handleSearch}
              placeholder="Search name or phone…"
              style={styles.searchInput}
            />

            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item._id}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => {
                const selected = selectedUsers.includes(item._id);

                return (
                  <TouchableOpacity
                    style={styles.userRow}
                    onPress={() => toggleSelect(item._id)}
                  >
                    <View>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userPhone}>{item.phoneNumber}</Text>
                    </View>

                    <View
                      style={[
                        styles.checkbox,
                        selected && styles.checkboxSelected,
                      ]}
                    />
                  </TouchableOpacity>
                );
              }}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={addMembersToCommunity}
              >
                <Text style={styles.saveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ------------------------------------
// SAME UI STYLES (UNCHANGED)
// ------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
    paddingHorizontal: 10,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: { fontSize: 20, fontWeight: "700" },
  addBtn: {
    backgroundColor: "blue",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  msgWrapper: { width: "100%", marginVertical: 6 },
  myWrapper: { alignItems: "flex-end" },
  otherWrapper: { alignItems: "flex-start" },

  msgBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
  },
  myBubble: {
    backgroundColor: "#bcd6ff",
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  msgSender: {
    fontWeight: "700",
    marginBottom: 4,
    color: "#d9534f",
  },
  msgText: { fontSize: 16 },
  msgTime: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendBtn: {
    backgroundColor: "blue",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },

  searchInput: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  userName: { fontSize: 16, fontWeight: "600" },
  userPhone: { color: "#555" },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: "blue",
    borderColor: "blue",
  },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelBtn: { marginRight: 16 },
  cancelText: { color: "#777", fontSize: 16 },

  saveBtn: {
    backgroundColor: "blue",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: { color: "white", fontWeight: "700", fontSize: 16 },
});
