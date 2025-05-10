import express from "express";
import type { Express } from "express";
import { config } from "./config.js";
import dbRouter from "./routes/dbRouter.js";

const app: Express = express();
let server: ReturnType<Express["listen"]>;

async function startServer(): Promise<void> {
  // Routes
  app.use("/db", dbRouter);
  app.use("/check", (req, res) => {
    console.log("/", req);
    res.status(200).json({ status: "ok" });
  });

  // Start server
  server = app.listen({ port: config.port, host: "::" }, () => {
    console.log(`Server listening on [::]${config.port}`);
  });
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log("HTTP server closed");
  });

  process.exit(0);
}

process.on("SIGTERM", async () => await gracefulShutdown("SIGTERM"));
process.on("SIGINT", async () => await gracefulShutdown("SIGINT"));

async function startApp(): Promise<void> {
  try {
    await startServer();
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startApp();

// import { exec, run, fetch } from "./db/sqlite.js";
// import { getDatabase } from "./db/getDatabase.js";
//
// const main = async () => {
//   const db = await getDatabase();
//   console.log("main1");
//   console.log("main2");
//   try {
//     const results = await fetch(db, `SELECT * from users;`);
//     console.log(results);
//   } catch (err) {
//     console.error(err);
//   }
//   db.close();
// };
//
// main();
