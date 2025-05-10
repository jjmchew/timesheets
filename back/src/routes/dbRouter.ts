import { Router } from "express";

const dbRouter = Router();

dbRouter.get("/", (req, res) => {
  console.log("/db", req);
  res.status(200).json({ message: "dbrouter" });
});

export default dbRouter;
