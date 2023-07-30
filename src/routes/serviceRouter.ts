import { Router } from "express";

const serviceRouter = Router();

serviceRouter.post("/inquire", (req, res) => {
  res.send("Hello World");
});

export default serviceRouter;
