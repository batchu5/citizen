import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { syncWithBackend } from "./offlineUpload";
import { getDBInstance } from "./dbInstance";
import AsyncStorage from "@react-native-async-storage/async-storage"

const TASK_NAME = "background-sync-task";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log("Background sync triggered");

    const db = getDBInstance();  
    const token = await AsyncStorage.getItem("token") || "" ;

    console.log("token from backgroundSync", token);

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
      minimumInterval: 60 * 1,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    console.log("Background task registered");
  } catch (e) {
    console.error("Failed to register background task", e);
  }
}
