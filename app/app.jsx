import React, { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import { SQLiteProvider } from "expo-sqlite";
import {registerBackgroundTask} from "../db/backgroundSync"
import {migrateDbIfNeeded} from "../db/index"

export default function App() {
  useEffect(() => {
    registerBackgroundTask();
  }, []);

  return (
    <SQLiteProvider databaseName="civix" onInit={migrateDbIfNeeded}>
      <PaperProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}
