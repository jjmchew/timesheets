import dotenv from "dotenv";

dotenv.config();

// .env validation
if (!process.env.SESSION_SECRET)
  throw new Error("config: session secret must be defined in .env");
if (!process.env.USERNAME)
  throw new Error("config: USERNAME must be defined in .env");
if (!process.env.PW) throw new Error("config: PW must be defined in .env");

// create config
export const isTest = process.env.NODE_ENV === "test";
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const devDbFilename = "timesheets.db";
export const testDbFilename = "test.db";

export const config = {
  env: process.env.NODE_ENV || "development",
  db: {
    filename: isTest ? testDbFilename : devDbFilename,
  },
  port: Number(process.env.PORT) || 4667,
  sessionSecret: process.env.SESSION_SECRET,
  username: process.env.USERNAME,
  pw: process.env.PW,
  baseUrl: isProd ? "/timesheets" : "",
} as const;
