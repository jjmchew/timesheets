import sqlite3 from "sqlite3";
import { config } from "../config.js";
import fs from "fs";
import { resolveProjectPath, projectRoot } from "../utils/paths.js";
import path from "path";
import { exec } from "./sqlite.js";

export function dbExists() {
  const dbPath = path.resolve(projectRoot, config.db.filename);
  return fs.existsSync(dbPath);
}

export async function getDatabase(): Promise<sqlite3.Database> {
  const isDbExists = dbExists();

  // Create a promise for the database connection
  const db = await new Promise<sqlite3.Database>((resolve, reject) => {
    const database = new sqlite3.Database(config.db.filename, (err) => {
      if (err) reject(err);
      else resolve(database);
    });
  });

  if (isDbExists) return db;

  // initialize new db
  const schemaPath = resolveProjectPath("db", "timesheetsSchema.sql");
  const dataSql = fs.readFileSync(schemaPath).toString();
  await exec(db, dataSql);

  return db;
}
