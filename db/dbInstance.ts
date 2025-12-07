import * as SQLite from "expo-sqlite";

// must match the name used in SQLiteProvider
const DB_NAME = "civix";

let db: SQLite.SQLiteDatabase | null = null;

export function getDBInstance() {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}
