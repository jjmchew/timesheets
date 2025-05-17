import { Database } from "sqlite3";
import { getDatabase } from "../db/getDatabase.js";
import { run, exec, fetch, close } from "../db/sqlite.js";
import { UserInfo, ProjectInfo } from "../types/types.js";

export class DbActions {
  private db: Database | null = null;

  constructor() {}

  /*
    Timers
   */

  async addTimer({
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

  async fetchAllTimers() {
    return await this.fetch("SELECT * from timers;");
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

  async fetchAllProjects() {
    return await this.fetch("SELECT * from projects;");
  }

  async fetchProjectInfo<ProjectInfo>(
    projectName: string,
  ): Promise<ProjectInfo[]> {
    return (await this.fetch("SELECT * from projects where project_name=?;", [
      projectName,
    ])) as ProjectInfo[];
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

  async fetchAllUsers() {
    return await this.fetch("SELECT * from users;");
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
