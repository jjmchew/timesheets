import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { clearTestDb } from "../db/getDatabase.js";
import { dbActions } from "../models/actions.js";
import { UserInfo, ProjectInfo } from "../types/types.js";

beforeAll(async () => {
  await dbActions.addUser({
    username: "jc",
    hashedPW: `123`,
  });

  await dbActions.addProject({
    username: "jc",
    projectName: "LSBot",
  });
});

afterAll(async () => {
  await clearTestDb();
});

describe("dbActions", async () => {
  describe("addUser", () => {
    test("added username is retrievable", async () => {
      const newUserId = `jc${Math.random()}`;

      await dbActions.addUser({
        username: newUserId,
        hashedPW: `123`,
      });

      const users: UserInfo[] = await dbActions.fetchAllUsers();

      expect(users[users.length - 1].username).toBe(newUserId);
    });
  });

  describe("addProject", () => {
    test("added project is retrievable", async () => {
      const newProjectName = `LSBot${Math.random()}`;

      await dbActions.addProject({
        username: "jc",
        projectName: newProjectName,
      });

      const projects: ProjectInfo[] = await dbActions.fetchAllProjects();
      console.dir(projects);
      expect(projects[projects.length - 1].project_name).toBe(newProjectName);
    });
  });

  describe("startTimer", () => {
    test("added timer is retrievable", async () => {
      await dbActions.startTimer({
        projectName: "LSBot",
        startTime: Date.now(),
      });

      const timers = await dbActions.fetchAllTimers();
      console.dir(timers);
      expect(timers).toBeDefined();
    });
  });
  describe("endTimer", () => {
    test("endTime can be added to previously started timer", async () => {
      await dbActions.startTimer({
        projectName: "LSBot",
        startTime: Date.now(),
      });

      await dbActions.endTimer({
        projectName: "LSBot",
        endTime: Date.now() + 10000,
      });

      const timers = await dbActions.fetchAllTimers();
      console.dir(timers);
      expect(timers).toBeDefined();
    });
  });
});

// console.log(await dbActions.fetchAllUsers());
// console.log(await dbActions.fetchAllProjects());
// console.log(await dbActions.fetchAllTimers());
