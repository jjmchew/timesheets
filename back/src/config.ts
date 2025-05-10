import dotenv from "dotenv";

dotenv.config();

export const isTest = process.env.NODE_ENV === "test";
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";

export const config = {
  env: process.env.NODE_ENV || "development",
  db: {
    filename: isTest ? "test.db" : "timesheets.db",
  },
  port: Number(process.env.PORT) || 4667,
} as const;
