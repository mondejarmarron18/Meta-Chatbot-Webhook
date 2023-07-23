import { Router } from 'express';
import config from '../utils/config';
import api from '../utils/api';
import {
  postAboutUs,
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

    await api.post(
      '/me/messenger_profile',
      {
        whitelisted_domains: ['https://lws-fb-chat-1c47aa033775.herokuapp.com'],
        get_started: {
          payload: 'greeting',
        },
      },
      {
        params: {
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
      }
    );

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
          console.log(event.message);
          postWelcome(psid);
        } else if (event?.postback) {
          switch (event.postback?.payload) {
            case webhookPostbackPayload.goBack:
              return postWelcome(psid);
            case webhookPostbackPayload.aboutUs:
              return postAboutUs(psid);
            case webhookPostbackPayload.visitWebsite:
              return (window.location.href = 'https://lightweightsolutions.co');
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
