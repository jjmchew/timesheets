import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { dbActions } from "../models/dbActions.js";

export const timersRouter = Router();

timersRouter.get("/", isAuthenticated, async (_req, res) => {
  console.log("/timersRouter");
  const timers = await dbActions.fetchAllTimers();
  res.status(200).json(timers);
});
