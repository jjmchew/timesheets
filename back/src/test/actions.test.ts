import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { clearTestDb } from "../db/getDatabase.js";
import { dbActions } from "../models/actions.js";
import { UserInfo, ProjectInfo, TimerInfo } from "../types/types.js";

beforeAll(async () => {
  await dbActions.addUser({
    username: "jc",
    hashedPW: `123`,
  });

  await dbActions.addProject({
    username: "jc",
    projectName: "LSBot",
  });

  await dbActions.addProject({
    username: "jc",
    projectName: "Personal projects",
  });

  await dbActions.addProject({
    username: "jc",
    projectName: "LS210",
  });
});

afterAll(async () => {
  await clearTestDb();
});

describe("dbActions", async () => {
  describe("fetchUsersProjects", () => {
    test("username with projects returns appropriate list", async () => {
      const projects: ProjectInfo[] = await dbActions.fetchUsersProjects({
        username: "jc",
      });

      console.dir(projects);
      expect(projects.length).toBe(3);
      expect(projects[0].project_name).toBe("LSBot");
      expect(projects[1].project_name).toBe("Personal projects");
      expect(projects[2].project_name).toBe("LS210");
    });
  });

  describe("fetchUsersProjects", () => {
    test("user id with projects returns appropriate list", async () => {
      const projects: ProjectInfo[] = await dbActions.fetchUsersProjects({
        id: 1,
      });

      console.dir(projects);
      expect(projects.length).toBe(3);
      expect(projects[0].project_name).toBe("LSBot");
      expect(projects[1].project_name).toBe("Personal projects");
      expect(projects[2].project_name).toBe("LS210");
    });
  });

  describe("fetchUsersProjects", () => {
    test("non-existent user returns empty list", async () => {
      const projects: ProjectInfo[] = await dbActions.fetchUsersProjects({
        username: "INVALID",
      });

      expect(projects.length).toBe(0);
    });
  });

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
      expect(projects[projects.length - 1].project_name).toBe(newProjectName);
    });
  });

  describe("startTimer", () => {
    test("added timer is retrievable", async () => {
      const startTime = new Date(Date.now()).toISOString();
      await dbActions.startTimer({
        projectName: "LSBot",
        startTime,
      });

      const timers: TimerInfo[] = await dbActions.fetchAllTimers();

      expect(timers[timers.length - 1].start_time).toBe(startTime);
      expect(timers[timers.length - 1].project_id).toBe(1);
    });
  });

  describe("endTimer", () => {
    test("endTime can be added to previously started timer", async () => {
      const startMs = Date.now();
      const startTime = new Date(startMs).toISOString();
      await dbActions.startTimer({
        projectName: "Personal projects",
        startTime,
      });

      const endTime = new Date(startMs + 100000).toISOString();
      await dbActions.endTimer({
        projectName: "Personal projects",
        endTime,
      });

      const timers: TimerInfo[] = await dbActions.fetchAllTimers();
      expect(timers[timers.length - 1].start_time).toBe(startTime);
      expect(timers[timers.length - 1].end_time).toBe(endTime);
      expect(timers[timers.length - 1].project_id).toBe(2);
    });
  });

  describe("hasNullTimer", () => {
    test("checking hasNullTimer matches changing timer status", async () => {
      const projectName = "LS210";

      // check DB before
      const hasNullTimerBefore = await dbActions.hasNullTimer({
        projectName,
      });
      expect(hasNullTimerBefore).toBeFalsy();

      // Test change in DB
      const startTime = new Date(Date.now()).toISOString();
      await dbActions.startTimer({
        projectName,
        startTime,
      });

      // re-assert change
      const hasNullTimerAfter = await dbActions.hasNullTimer({
        projectName,
      });
      expect(hasNullTimerAfter).toBeTruthy();

      // clean-up for this test to ensure no null timers
      const endTime = new Date(Date.now()).toISOString();
      await dbActions.endTimer({
        projectName,
        endTime,
      });

      // check DB after clean-up
      const hasNullTimerAfterCleanup = await dbActions.hasNullTimer({
        projectName,
      });
      expect(hasNullTimerAfterCleanup).toBeFalsy();
    });
  });
});
