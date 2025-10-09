import { Router } from "express";
import { assertIsDefined } from "../utils/assertIsDefined.js";
import { dbActions } from "../models/dbActions.js";
import { BaseLayout } from "../views/BaseLayout.js";
import { ProjectsList } from "../views/projectsList.js";
import { AddNewProject } from "../views/AddNewProject.js";
import type { ProjectInfo } from "../types/types.js";
import { config } from "../config.js";

export const projectsRouter = Router();

/*
 * Main "projects" page
 * - list all projects
 */
projectsRouter.get("/", async (req, res) => {
  console.log("/projectsRouter: displaying /projects");
  assertIsDefined(req.session.user?.id);

  const userId = req.session.user.id;
  const projects = await dbActions.fetchUsersProjects({ id: userId });
  const projectsListString: string = await ProjectsList({ projects });
  res.send(
    BaseLayout(
      {
        title: "Projects",
        isAuthenticated: true,
        username: req.session.user?.username,
      },
      projectsListString,
    ),
  );
});

/*
 * Start timer
 */
projectsRouter.post("/:project_id/start", async (req, res) => {
  assertIsDefined(req.session.user?.id);
  const project_id = Number(req.params.project_id);
  await dbActions.startTimer({
    projectId: project_id,
    startTime: new Date(Date.now()).toISOString(),
  });
  console.log(`/${project_id}/start: timer started`);
  res.redirect(`${config.baseUrl}/projects`);
});

/*
 * Stop timer
 */
projectsRouter.post("/:project_id/stop", async (req, res) => {
  assertIsDefined(req.session.user?.id);
  const project_id = Number(req.params.project_id);
  await dbActions.endTimer({
    projectId: project_id,
    endTime: new Date(Date.now()).toISOString(),
  });
  console.log(`/${project_id}/stop: timer stopped`);
  res.redirect(`${config.baseUrl}/projects`);
});

/*
 * Display new project screen (GET request)
 */
projectsRouter.get("/new", async (req, res) => {
  assertIsDefined(req.session.user?.id);
  res.send(
    BaseLayout(
      {
        title: "Add new project",
        isAuthenticated: true,
        username: req.session.user?.username,
      },
      AddNewProject(),
    ),
  );
});

/*
 * Add new project (POST request)
 */
projectsRouter.post("/new", async (req, res) => {
  assertIsDefined(req.session.user?.id);
  const username = req.session.user?.username;
  const projectName = req.body.newProjectName;
  console.log("/projects/new POST: ", projectName);
  try {
    await dbActions.addProject({
      username,
      projectName,
    });
  } catch (err) {
    // TODO:  error messaging in UI
    console.error(`/projects/new POST ${projectName} ERROR:`, err);
  }
  res.redirect(`${config.baseUrl}/projects`);
});

/*
 * List all timers
 */
projectsRouter.get("/all", async (req, res) => {
  assertIsDefined(req.session.user?.id);
  const projects: ProjectInfo[] = await dbActions.fetchUsersProjects({
    id: req.session.user.id,
  });
  res.status(200).json(projects);
});
