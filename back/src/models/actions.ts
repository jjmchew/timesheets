import { Database } from "sqlite3";
import { getDatabase } from "../db/getDatabase.js";
import { run, fetch, close } from "../db/sqlite.js";
import { UserInfo, ProjectInfo, TimerInfo } from "../types/types.js";

export class DbActions {
  private db: Database | null = null;

  constructor() {}

  /*
    Timers
   */

  async hasNullTimer({
    projectName,
    projectId,
  }: {
    projectName?: string;
    projectId?: number;
  }): Promise<boolean> {
    try {
      await this.fetchNullTimer({ projectName, projectId });
      return true;
    } catch (err) {
      return false;
    }
  }

  async startTimer({
    projectName,
    projectId,
    startTime,
  }: {
    projectName?: string;
    projectId?: number;
    startTime: string;
  }) {
    let projectId_lookup = projectId;

    if (projectName) {
      const projectInfo: ProjectInfo[] =
        await this.fetchProjectInfo(projectName);
      if (projectInfo.length !== 1)
        throw new Error(
          `startTimer: Problem with retrieving project ${projectName}`,
        );
      projectId_lookup = projectInfo[0].id;
    }

    const hasNullTimer = await this.hasNullTimer({ projectName });
    if (hasNullTimer)
      throw new Error(
        `startTimer: An existing NullTimer exists for ${projectName}`,
      );

    return await this.run(
      "INSERT INTO timers (project_id, start_time) VALUES (?, ?);",
      projectId_lookup,
      startTime,
    );
  }

  async endTimer({
    projectName,
    projectId,
    endTime,
  }: {
    projectName?: string;
    projectId?: number;
    endTime: string;
  }) {
    let projectId_lookup = projectId;

    if (projectName) {
      const projectInfo: ProjectInfo[] =
        await this.fetchProjectInfo(projectName);
      projectId_lookup = projectInfo[0].id;
    }

    const nullTimer = await this.fetchNullTimer({ projectName, projectId });
    return await this.run(
      "UPDATE timers SET end_time = ? WHERE project_id=? AND id=?;",
      endTime,
      projectId_lookup,
      nullTimer[0].id,
    );
  }

  async fetchTimersForProject({ projectId }: { projectId: number }) {
    return (await this.fetch(
      "SELECT * from timers WHERE project_id=?;",
      projectId,
    )) as TimerInfo[];
  }

  async fetchAllTimers() {
    return (await this.fetch("SELECT * from timers;")) as TimerInfo[];
  }

  async fetchNullTimer({
    projectName,
    projectId,
  }: {
    projectName?: string;
    projectId?: number;
  }): Promise<TimerInfo[]> {
    let projectId_lookup = projectId;

    if (projectName) {
      const projectInfo: ProjectInfo[] =
        await this.fetchProjectInfo(projectName);
      projectId_lookup = projectInfo[0].id;
    }

    const nullTimer = (await this.fetch(
      "SELECT * from timers WHERE end_time IS NULL and project_id=?;",
      projectId_lookup,
    )) as TimerInfo[];

    if (nullTimer.length === 0)
      throw new Error(
        `fetchNullTimer: could not find a null timer (i.e., no end time) for project "${projectName}`,
      );

    return nullTimer;
  }

  /*
    Projects
   */

  async addProject({
    username,
    projectName,
  }: {
    username: string;
    projectName: string;
  }) {
    const userInfo: UserInfo[] = await this.fetchUserInfo(username);
    if (userInfo.length !== 1)
      throw new Error("Problem with retrieving username");
    return await this.run(
      "INSERT INTO projects (project_name, user_id) VALUES (?, ?);",
      projectName,
      userInfo[0].id,
    );
  }

  async fetchAllProjects(): Promise<ProjectInfo[]> {
    return (await this.fetch("SELECT * from projects;")) as ProjectInfo[];
  }

  async fetchUsersProjects({
    username,
    id,
  }: {
    username?: string;
    id?: number;
  }): Promise<ProjectInfo[]> {
    let userId = id;

    if (username) {
      const userInfo: UserInfo[] = await this.fetchUserInfo(username);
      if (userInfo.length === 0) return [] as ProjectInfo[];
      if (userInfo.length > 1)
        throw new Error("Problem with retrieving username");
      userId = userInfo[0].id;
    }

    if (!userId) return [] as ProjectInfo[];

    return (await this.fetch(
      "SELECT * from projects WHERE user_id=?",
      userId,
    )) as ProjectInfo[];
  }

  async fetchProjectInfo<ProjectInfo>(
    projectName: string,
  ): Promise<ProjectInfo[]> {
    const projectInfo = (await this.fetch(
      "SELECT * from projects where project_name=?;",
      [projectName],
    )) as ProjectInfo[];
    if (projectInfo.length !== 1)
      throw new Error(
        `fetchProjectInfo: Problem with retrieving ${projectName}`,
      );
    return projectInfo;
  }

  /*
    Users
   */

  async addUser({
    username,
    hashedPW,
  }: {
    username: string;
    hashedPW: string;
  }) {
    return await this.run(
      "INSERT INTO users (username, pw) VALUES (?, ?);",
      username,
      hashedPW,
    );
  }

  async fetchAllUsers(): Promise<UserInfo[]> {
    return (await this.fetch("SELECT * from users;")) as UserInfo[];
  }

  async fetchUserInfo<UserInfo>(username: string): Promise<UserInfo[]> {
    return (await this.fetch("SELECT * from users where username=?;", [
      username,
    ])) as UserInfo[];
  }

  async close() {
    const db = await this.getDb();
    close(db);
  }

  /*
    Helper functions
   */

  private async getDb() {
    if (this.db) return this.db;
    this.db = await getDatabase();
    return this.db;
  }

  private async run(sqlString: string, ...params: any[]) {
    const db = await this.getDb();
    const results = await run(db, sqlString, params);
    return results;
  }

  private async fetch(sqlString: string, ...params: any[]) {
    const db = await this.getDb();
    const results = await fetch(db, sqlString, ...params);
    return results;
  }
}

export const dbActions = new DbActions();
