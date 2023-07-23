import { Router } from 'express';
import config from '../utils/config';
import api from '../utils/api';
import {
  postAboutUs,
  postOurServices,
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

    res.status(200).send(challenge);
  }
});

webhookRouter.post('/', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      entry.messaging.forEach((event: any) => {
        const psid = event.sender.id;

        if (event?.message) {
          if (event.message?.quick_reply) {
            console.log(event.message);
            switch (event.quick_reply?.payload) {
              case webhookPostbackPayload.goBack:
                return postWelcome(psid);
              case webhookPostbackPayload.visitWebsite:
                return res.redirect(302, 'https://lightweightsolutions.co');
            }
          } else {
            postWelcome(psid);
          }
        } else if (event?.postback) {
          switch (event.postback?.payload) {
            case webhookPostbackPayload.aboutUs:
              return postAboutUs(psid);
            case webhookPostbackPayload.ourServices:
              return postOurServices(psid);
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
