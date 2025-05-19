import { Router } from "express";
import { layout } from "../views/layout.js";
import { login } from "../views/login.js";
import { hashPassword, comparePassword } from "../utils/userAuth.js";
import { dbActions } from "../models/actions.js";
import type { UserInfo } from "../types/types.js";

export const userRouter = Router();

userRouter.get("/", (req, res) => {
  console.log("/user", req);
  res.status(200).json({ message: "userRouter" });
});

userRouter.get("/login", (_req, res) => {
  res.send(layout({ title: "TS" }, login()));
});

userRouter.post("/login", async (req, res) => {
  console.log("user/login", req.body);
  const { username, pw } = req.body;
  const userInfo: UserInfo[] = await dbActions.fetchUserInfo(username);
  console.log(userInfo);
  if (userInfo.length === 1 && comparePassword(userInfo[0].pw, pw)) {
    req.session.user = {
      username,
      id: userInfo[0].id,
    };
    res.redirect("/projects");
    return;
  }
  res.status(401).send("Invalid credentials");
});

userRouter.post("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});
