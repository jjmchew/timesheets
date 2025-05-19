import sqlite3 from "sqlite3";
import { config, testDbFilename, isTest } from "../config.js";
import fs from "fs";
import { resolveProjectPath, projectRoot } from "../utils/paths.js";
import path from "path";
import { exec } from "./sqlite.js";
import { insertInitialData } from "../utils/insertInitialData.js";

export function dbExists() {
  const dbPath = path.resolve(projectRoot, config.db.filename);
  console.log(dbPath);
  return fs.existsSync(dbPath);
}

export async function clearTestDb() {
  return new Promise((res, rej) => {
    const dbPath = path.resolve(projectRoot, testDbFilename);
    if (fs.existsSync(dbPath)) {
      fs.unlink(dbPath, (err) => {
        if (err) {
          console.error("clearTestDb error: ", err);
          rej(err);
        } else {
          console.log(`${dbPath} deleted`);
          res(true);
        }
      });
    }
  });
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

  console.log("initializing new db", config.db.filename);
  // get path to schema file
  const schemaPath = resolveProjectPath("db", "timesheetsSchema.sql");
  // read schema file
  const dataSql = fs.readFileSync(schemaPath).toString();
  // create tables
  await exec(db, dataSql);
  if (!isTest) await insertInitialData();

  return db;
}
