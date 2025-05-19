import { dbActions } from "../models/actions.js";
import { hashPassword } from "./userAuth.js";
import { config } from "../config.js";

/**
 * Helper script
 * - initializes an empty DB with basic projects for 'jc'
 */

export async function insertInitialData() {
  console.log("insertInitialData: running");
  await dbActions.addUser({
    username: config.username,
    hashedPW: hashPassword(config.pw),
  });

  await dbActions.addProject({
    username: "jc",
    projectName: "LSBot",
  });
}
