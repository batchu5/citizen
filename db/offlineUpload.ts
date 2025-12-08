import * as FileSystem from "expo-file-system/legacy";
import axios from "axios";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from "react-native-uuid";
import {createIssue} from "../src/api/issueApi"

interface ImageRow {
  id: string;
  description: string,
  issueType:string,
  location: string,
  geoLocation: string,
  uri: string;
  is_synced: number;
  is_deleted: number;
}


export const saveImageOffline = async ({db, imageUri, issueType, description,location, geoLocation} : {db:SQLiteDatabase, imageUri: string| undefined, issueType: string, description: string, geoLocation: string, location: string}) => {

  console.log("saveImageOffline");

  if(!imageUri){
    console.log("imageuri is null ");
    return;
  }
  const filename = imageUri.split("/").pop();

  let baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  if (!baseDir) {
    throw new Error("No directory available for saving files.");
  }

  const localUri = baseDir + filename;

  await FileSystem.copyAsync({
    from: imageUri,
    to: localUri,
  });

  const id = uuid.v4().toString();

  await db.runAsync(
    `INSERT INTO images (id, issueType, description, location, geoLocation, is_synced, is_deleted, uri, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, 0, ?, datetime('now'), datetime('now'))`,
    [id, issueType, description, location, geoLocation, localUri]
  );

  return id;
};
let isSyncing = false;

export const  syncWithBackend = async (db: SQLiteDatabase, token: string) => {
  
  if (isSyncing) {
    console.log("⏳ Sync already running, skipping...");
    return;
  }
  isSyncing = true;
  
  try {
    let pr = ""
    const unsynced = await db.getAllAsync<ImageRow>(
      "SELECT * FROM images WHERE is_synced = 0"
    );

    if (unsynced.length === 0) {
      console.log("Everything synced.");
      return;
    }

    for (const item of unsynced) {
      pr = await uploadToBackend(item, token);

      await db.runAsync(
        "UPDATE images SET is_synced = 1 WHERE id = ?",
        [item.id]
      );
    }

    console.log("Synced", unsynced.length, "images");
    console.log("priority from syncwithbackend", pr);
    return pr;
    
  } catch (error) {
    console.log("Sync failed:", error);
  } finally {
    // 🔓 Release lock so future syncs can run
    isSyncing = false;
  }

};

const uploadToBackend = async (item: ImageRow, token: string) => {
  const data = new FormData();
  console.log("uploading to the backend");

  data.append("description", item.description);
  data.append("location", item.location);
  data.append("issueType", item.issueType);  
  data.append("geoLocation", item.geoLocation);
  data.append("image", {
    uri: item.uri,
    name: `${item.id}.jpg`,
    type: "image/jpeg",
  } as any);

  console.log("data", data);
  const resultData = await createIssue(data, token);
   console.log("priority is from upload to backend", resultData.data.priority);

   return resultData.data.priority;

};

