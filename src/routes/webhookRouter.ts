import { Router } from "express";
import config from "../utils/config";
import { postGetStarted } from "../utils/webhook";
import quickReplies from "../utils/replies/quickReplies";
import postBacks from "../utils/replies/postBacks";

const webhookRouter = Router();

webhookRouter.get("/", async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode !== "subscribe" && token !== config.FB_VERIFY_TOKEN) {
      res.sendStatus(403);
    }

    res.status(200).send(challenge);
  }
});

webhookRouter.post("/", async (req, res) => {
  const body = req.body;

  if (body.object !== "page") return res.sendStatus(404);

  if (body.entry[0].changes && body.entry[0].changes[0].field === "feed") {
    try {
      await postGetStarted();

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  body.entry.forEach((entry: any) => {
    entry.messaging.forEach((event: any) => {
      const psid = event.sender.id;

      if (event?.message) {
        quickReplies(event, psid);
      } else if (event?.postback) {
        postBacks(event, psid);
      }
    });
  });

  res.status(200).send("EVENT_RECEIVED");
});

webhookRouter.get("/get-started", async (req, res) => {
  try {
    await postGetStarted();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default webhookRouter;
