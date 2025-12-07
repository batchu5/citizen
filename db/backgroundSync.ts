import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { syncWithBackend } from "./offlineUpload";
import { getDBInstance } from "./dbInstance";
import AsyncStorage from "@react-native-async-storage/async-storage"

const TASK_NAME = "background-sync-task";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log("Background sync triggered");

    const db = getDBInstance();  // <-- FIX: now DB works in background
    const token = await AsyncStorage.getItem("token")||"" ;

    await syncWithBackend(db, token );

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background sync failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 15,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    console.log("Background task registered");
  } catch (e) {
    console.error("Failed to register background task", e);
  }
}
