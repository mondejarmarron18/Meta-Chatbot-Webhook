import { Router } from 'express';
import config from '../utils/config';
import {
  postAboutUs,
  postGetStarted,
  postInquiries,
  postOtherInquiry,
  postOurServices,
  postScheduleMeeting,
  postWelcome,
  webhookPostbackPayload,
} from '../utils/webhook';

const webhookRouter = Router();

webhookRouter.get('/', async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode !== 'subscribe' && token !== config.FB_VERIFY_TOKEN) {
      res.sendStatus(403);
    }

    await postGetStarted();

    res.status(200).send(challenge);
  }
});

webhookRouter.post('/', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      entry.messaging.forEach((event: any) => {
        const psid = event.sender.id;

        console.log(`Message`, event?.message);
        console.log(`Postback`, event?.postback);

        if (event?.message) {
          if (event.message?.quick_reply) {
            switch (event.message.quick_reply?.payload) {
              case webhookPostbackPayload.goBack:
                return postWelcome(psid);
            }
          } else {
            postWelcome(psid);
          }
        } else if (event?.postback) {
          switch (event.postback?.payload) {
            case webhookPostbackPayload.getStarted:
              return postGetStarted();
            case webhookPostbackPayload.aboutUs:
              return postAboutUs(psid);
            case webhookPostbackPayload.ourServices:
              return postOurServices(psid);
            case webhookPostbackPayload.inquiries:
              return postInquiries(psid);
            case webhookPostbackPayload.scheduleMeeting:
              return postScheduleMeeting(psid);
            case webhookPostbackPayload.otherInquiry:
              return postOtherInquiry(psid);
            case webhookPostbackPayload.goBack:
              return postWelcome(psid);
          }
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

export default webhookRouter;
