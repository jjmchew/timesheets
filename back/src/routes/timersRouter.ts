import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { assertIsDefined } from "../utils/assertIsDefined.js";
import { dbActions } from "../models/actions.js";

export const timersRouter = Router();

timersRouter.get("/", isAuthenticated, async (req, res) => {
  console.log("/timersRouter");
  // assertIsDefined(req.session.user?.id);
  // const userId = req.session.user.id;
  const timers = await dbActions.fetchAllTimers();
  res.status(200).json(timers);
});
