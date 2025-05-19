import express from "express";
import session from "express-session";
import connectLoki from "connect-loki";
import type { Express } from "express";
import { publicPath } from "./utils/paths.js";
import { config } from "./config.js";
import { isAuthenticated } from "./middleware/isAuthenticated.js";

import { userRouter } from "./routes/userRouter.js";
import { projectsRouter } from "./routes/projectsRouter.js";
import { timersRouter } from "./routes/timersRouter.js";
import { tallyRouter } from "./routes/tallyRouter.js";
import { notFound } from "./views/notFound.js";

const app: Express = express();
let server: ReturnType<Express["listen"]>;
const LokiStore = connectLoki(session);

async function startServer(): Promise<void> {
  // Routes
  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
        path: "/",
        secure: false,
      },
      name: "timesheets-session-id",
      resave: false,
      saveUninitialized: true,
      secret: config.sessionSecret,
      store: new LokiStore({}),
    }),
  );

  app.use(express.static(publicPath));
  app.use(express.urlencoded());

  app.use("/user", userRouter);
  app.use("/projects", isAuthenticated, projectsRouter);
  app.use("/timers", isAuthenticated, timersRouter);
  app.use("/tally", isAuthenticated, tallyRouter);

  app.get("/", (_req, res) => {
    res.redirect("/user/login");
  });

  app.all("/:path", (req, res) => {
    const path = req.params.path;
    console.log(req.headers);
    const referer = req.headers.referer || "";
    res.send(notFound({ path, referer }));
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
