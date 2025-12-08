import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

import { SQLiteProvider } from "expo-sqlite";

import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";

import { migrateDbIfNeeded } from "./db";
import { registerBackgroundTask } from "./db/backgroundSync";

export default function App() {
  useEffect(() => {
    registerBackgroundTask();
  }, []);

  return (
    <SQLiteProvider databaseName="civix" onInit={migrateDbIfNeeded}>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}
