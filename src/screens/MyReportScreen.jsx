import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, Image, StyleSheet, Animated } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import API from "../api/api";
import { BASE_URL } from "../utils/constants";
import QuotationCard from "../../components/QuotationCard";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Progress Tracker Component
const ProgressTracker = ({ currentStatus }) => {
  const stages = [
    { key: "pending", label: "Pending" },
    { key: "assigned", label: "Assigned" },
    { key: "in-progress", label: "Active" },
    { key: "resolved", label: "Resolved" },
  ];

  const getCurrentStageIndex = () => {
    const index = stages.findIndex((s) => s.key === currentStatus.toLowerCase());
    return index !== -1 ? index : 0;
  };

  const currentIndex = getCurrentStageIndex();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [currentStatus]);

  return (
    <View style={trackStyles.container}>
      <View style={trackStyles.stagesRow}>
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <React.Fragment key={stage.key}>
              {/* Circle with Icon */}
              <View style={trackStyles.stageContainer}>
                <Animated.View
                  style={[
                    trackStyles.circle,
                    isCompleted && trackStyles.circleCompleted,
                    isCurrent && {
                      ...trackStyles.circleCurrent,
                      transform: [{ scale: scaleAnim }],
                    },
                    isUpcoming && trackStyles.circleUpcoming,
                  ]}
                >
                  {isCompleted ? (
                    <MaterialCommunityIcons name="check" size={14} color="#fff" />
                  ) : isCurrent ? (
                    <View style={trackStyles.currentDot} />
                  ) : (
                    <View style={trackStyles.upcomingDot} />
                  )}
                </Animated.View>

                {/* Label */}
                <Text
                  style={[
                    trackStyles.label,
                    (isCompleted || isCurrent) && trackStyles.labelActive,
                  ]}
                  numberOfLines={2}
                >
                  {stage.label}
                </Text>
              </View>

              {/* Connecting Line */}
              {index < stages.length - 1 && (
                <View style={trackStyles.lineContainer}>
                  <View
                    style={[
                      trackStyles.line,
                      index < currentIndex && trackStyles.lineCompleted,
                    ]}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const trackStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 4,
     backgroundColor: "#f3f5f4ff",
    borderRadius: 12,
    marginTop: 16,
  },
  stagesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  stageContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 2,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor:  "#f3f5f4ff",
    backgroundColor: "#2a2a2c",
  },
  circleCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  circleCurrent: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  circleUpcoming: {
    backgroundColor: "#fdfdfdff",
    borderColor: "#78787bff",
  },
  currentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  upcomingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4a4a4c",
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    color: "#6b6b6d",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 12,
  },
  labelActive: {
    color: "#10B981",
    fontWeight: "700",
  },
  lineContainer: {
    flex: 0.8,
    height: 1,
    marginTop: 13,
    marginHorizontal: -4,
    justifyContent: "center",
  },
  line: {
    height: 2,
    backgroundColor: "#b7b7bcff",
    transform: [{ translateY: -3 }],
  },
  lineCompleted: {
    backgroundColor: "#10B981",
  },
});

export default function MyReportsScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await API.get(`${BASE_URL}/issues/my`);
      setReports(res.data);
    } catch (err) {
      console.log(" Error fetching reports:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          backgroundColor: "#FEE2E2",
          borderColor: "#DC2626",
          textColor: "#B91C1C",
        };
      case "assigned":
        return {
          backgroundColor: "#DCFCE7",
          borderColor: "#7577d6ff",
          textColor: "#2e0b98ff",
        };
      case "resolved":
        return {
          backgroundColor: "#D1FAE5",
          borderColor: "#059669",
          textColor: "#065F46",
        };
      case "in-progress":
        return {
          backgroundColor: "#DBEAFE",
          borderColor: "#1D4ED8",
          textColor: "#1E3A8A",
        };
      default:
        return {
          backgroundColor: "#F3F4F6",
          borderColor: "#9CA3AF",
          textColor: "#4B5563",
        };
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#1E90FF" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchReports} />}
        renderItem={({ item }) => {
          const { backgroundColor, borderColor, textColor } = getStatusStyle(item.status);
          return (
            <Card style={styles.card} elevation={4}>
              {/* Image */}
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              )}

              <Card.Content style={styles.cardContent}>
                <View style={styles.header}>
                  <Text style={styles.issueType}>{item.issueType}</Text>
                </View>

                <Text style={styles.description}>{item.description}</Text>

                {/* Progress Tracker */}
                <ProgressTracker currentStatus={item.status} />
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
       backgroundColor: "#F6F8F7",
    padding: 20
  },
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
     borderWidth: 1,
    borderColor: "#CDD7E1",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  issueType: {
    fontWeight: "700",
    fontSize: 20,
    color: "#242424ff",
    flexShrink: 1,
    maxWidth: "70%",
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  description: {
    // marginTop: 8,
    // fontSize: 16,
    // color: "#d2d3d4ff",
    // lineHeight: 20,
    color: "#1e1d1dff",
    fontSize: 14,
    justifyContent: "flex-start",
    fontWeight: "500",
    marginBottom: 20,
    marginTop:10
  },
});