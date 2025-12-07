import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import HomeHeader from "../../components/HomeHeader";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import HomeScreen from "../screens/HomeScreen";
import ReportIssueScreen from "../screens/ReportIssueScreen";
import MyReportsScreen from "../screens/MyReportScreen";
import SuccessScreen from "../screens/SuccessScreen";
import CommunityScreen from "../screens/CommunityScreen";
import Chat from "../screens/ChatScreen";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsub();
  }, []);

  const { user } = useContext(AuthContext);

 
  const OfflineStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="ReportIssue"
        component={ReportIssueScreen}
        options={{
          title: "ReportIssue",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
  
  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );

  const AppStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: (props) => <HomeHeader {...props} />,
          title: "Home",
        }}
      />
      <Stack.Screen
        name="ReportIssue"
        component={ReportIssueScreen}
        options={{
          title: "ReportIssue",
          headerStyle: {
            backgroundColor: "black",
          },
          headerTitleStyle: {
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: "My Reports",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTitleStyle: {
            color: "black",
            fontSize: 22,
            fontWeight: "bold",
          },
          headerTintColor: "black",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );

   if (!user) {
    return <AuthStack />;
  }
  
  if (!isOnline) {
    return <OfflineStack />;
  }

  return <AppStack />;
}
