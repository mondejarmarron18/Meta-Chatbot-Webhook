import { Router } from 'express';
import config from '../utils/config';
import api from '../utils/api';

const webhookRouter = Router();

webhookRouter.post('/', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      entry.messaging.forEach(async (event: any) => {
        const psid = event.sender.id;

        console.log(event);
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

webhookRouter.get('/', async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode !== 'subscribe' && token !== config.FB_VERIFY_TOKEN) {
      res.sendStatus(403);
    }

    res.send(challenge);
  }
});

export default webhookRouter;
