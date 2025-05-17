import { Database } from "sqlite3";
import { getDatabase } from "../db/getDatabase.js";
import { run, exec, fetch, close } from "../db/sqlite.js";
import { UserInfo, ProjectInfo, TimerInfo } from "../types/types.js";

export class DbActions {
  private db: Database | null = null;

  constructor() {}

  /*
    Timers
   */

  async startTimer({
    projectName,
    startTime,
  }: {
    projectName: string;
    startTime: number;
  }) {
    const projectInfo: ProjectInfo[] = await this.fetchProjectInfo(projectName);
    if (projectInfo.length !== 1)
      throw new Error(`Problem with retrieving project ${projectName}`);
    return await this.run(
      "INSERT INTO timers (project_id, start_time) VALUES (?, ?);",
      projectInfo[0].id,
      startTime,
    );
  }

  async endTimer({
    projectName,
    endTime,
  }: {
    projectName: string;
    endTime: number;
  }) {
    const projectInfo: ProjectInfo[] = await this.fetchProjectInfo(projectName);

    const lastTimer = await this.fetchLastTimer(projectName);
    console.dir(lastTimer);
    return await this.run(
      "UPDATE timers SET end_time = ? WHERE project_id=? AND id=?;",
      endTime,
      projectInfo[0].id,
      lastTimer[0].id,
    );
  }

  async fetchAllTimers() {
    return await this.fetch("SELECT * from timers;");
  }

  async fetchLastTimer(projectName: string): Promise<TimerInfo[]> {
    const projectInfo: ProjectInfo[] = await this.fetchProjectInfo(projectName);
    return (await this.fetch(
      "SELECT * from timers WHERE end_time IS NULL and project_id=?;",
      projectInfo[0].id,
    )) as TimerInfo[];
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
    console.log(username, hashedPW);
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
    console.log("params:  ", params);
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
