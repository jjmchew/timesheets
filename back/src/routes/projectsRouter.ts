import { Router } from "express";
import { assertIsDefined } from "../utils/assertIsDefined.js";
import { dbActions } from "../models/actions.js";
import { layout } from "../views/layout.js";
import { projectsList } from "../views/projectsList.js";
import type { ProjectInfo } from "../types/types.js";

export const projectsRouter = Router();

projectsRouter.get("/", async (req, res) => {
  console.log("/projectsRouter: displaying /projects");
  assertIsDefined(req.session.user?.id);

  const userId = req.session.user.id;
  const projects = await dbActions.fetchUsersProjects({ id: userId });
  const projectsListString: string = await projectsList({ projects });
  res.send(layout({ title: "Projects" }, projectsListString));
});

projectsRouter.post("/:project_id/start", async (req, res) => {
  const project_id = Number(req.params.project_id);
  await dbActions.startTimer({
    projectId: project_id,
    startTime: new Date(Date.now()).toISOString(),
  });
  console.log(`/${project_id}/start: timer started`);
  res.redirect("/projects");
});

projectsRouter.post("/:project_id/stop", async (req, res) => {
  const project_id = Number(req.params.project_id);
  await dbActions.endTimer({
    projectId: project_id,
    endTime: new Date(Date.now()).toISOString(),
  });
  console.log(`/${project_id}/stop: timer stopped`);
  res.redirect("/projects");
});

projectsRouter.get("/all", async (req, res) => {
  assertIsDefined(req.session.user?.id);
  const projects: ProjectInfo[] = await dbActions.fetchUsersProjects({
    id: req.session.user.id,
  });
  res.status(200).json(projects);
});
