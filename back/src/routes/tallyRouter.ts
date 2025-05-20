import { Router } from "express";
import { assertIsDefined } from "../utils/assertIsDefined.js";
import { dbActions } from "../models/actions.js";
import { tally } from "../models/tally.js";

export const tallyRouter = Router();

tallyRouter.get("/", async (req, res) => {
  console.log("/tallyRouter");
  const timers = await dbActions.fetchAllTimers();
  res.status(200).send({ timers });
});

tallyRouter.get("/:project_id", async (req, res) => {
  const projectId = Number(req.params.project_id);
  const timers = await dbActions.fetchTimersForProject({ projectId });
  const tallyResult: any = tally(timers);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(tallyResult);
});
