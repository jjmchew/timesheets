import { Router } from "express";
import { BaseLayout } from "../views/BaseLayout.js";
import { Login } from "../views/Login.js";
import { comparePassword } from "../utils/userAuth.js";
import { dbActions } from "../models/dbActions.js";
import type { UserInfo } from "../types/types.js";
import { config } from "../config.js";

export const userRouter = Router();

userRouter.get("/login", (_req, res) => {
  res.send(BaseLayout({ title: "TS" }, Login()));
});

userRouter.post("/login", async (req, res) => {
  console.log("user/login", req.body.username);
  const { username, pw } = req.body;
  const userInfo: UserInfo[] = await dbActions.fetchUserInfo(username);
  if (userInfo.length === 1 && comparePassword(userInfo[0].pw, pw)) {
    req.session.user = {
      username,
      id: userInfo[0].id,
    };
    res.redirect(`${config.baseUrl}/projects`);
    return;
  }
  res.status(401).send("Invalid credentials");
});

userRouter.post("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});
