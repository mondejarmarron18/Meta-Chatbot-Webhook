import { Router } from "express";
import config from "../utils/config";
import {
  postAboutUs,
  postGetStarted,
  postInquiries,
  postOtherInquiry,
  postOurServices,
  postScheduleMeeting,
  postWelcome,
} from "../utils/webhook";
import webhookPayload from "../utils/webhookPayload";
import serviceInquiryController from "../controllers/serviceInquiryController";

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

      console.log({ entry: entry?.messaging, event: event });

      if (event?.message) {
        if (event.message?.quick_reply) {
          switch (event.message.quick_reply?.payload) {
            case webhookPayload.goBack:
              return postWelcome(psid);
          }
        }
      } else if (event?.postback) {
        switch (event.postback?.payload) {
          case webhookPayload.getStarted:
            return postWelcome(psid || event.sender?.user_ref);
          case webhookPayload.goBack:
            return postWelcome(psid);
          case webhookPayload.aboutUs:
            return postAboutUs(psid);
          case webhookPayload.ourServices:
            return postOurServices(psid);
          case webhookPayload.inquiries:
            return postInquiries(psid);
          case webhookPayload.scheduleMeeting:
            return postScheduleMeeting(psid);
          case webhookPayload.otherInquiry:
            return postOtherInquiry(psid);
        }

        const payload = event.postback?.payload;
        const serviceInquiryConfirmed = webhookPayload.serviceInquiryConfirmed;

        //Email servince inquiry
        if (payload?.includes(serviceInquiryConfirmed)) {
          const serviceInquiryID = payload
            ?.split(`${serviceInquiryConfirmed}_`)
            .join("");
          return serviceInquiryController.sendEmail(+serviceInquiryID);
        }
      }
    });
  });

  res.status(200).send("EVENT_RECEIVED");
});

webhookRouter.get("/get-started", async (req, res) => {
  try {
    const greetingMessage = req.body.greetingMessage;
    await postGetStarted(greetingMessage);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default webhookRouter;
