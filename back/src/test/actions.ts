import { dbActions } from "../models/actions.js";

async function test() {
  // await dbActions.addUser({
  //   username: `jc`,
  //   hashedPW: `123`,
  // }),
  await dbActions.addUser({
    username: `jc ${Math.random()}`,
    hashedPW: `123`,
  }),
    console.log(await dbActions.fetchAllUsers());
  console.log(await dbActions.fetchUserInfo("jc122"));
  console.log(await dbActions.fetchAllProjects());
  console.log(
    await dbActions.addTimer({
      projectName: "LSBot",
      startTime: Date.now(),
    }),
  );
  console.log(await dbActions.fetchAllTimers());
}

test();
