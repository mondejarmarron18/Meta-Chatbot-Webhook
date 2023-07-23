import { Router } from 'express';
import config from '../utils/config';
import api from '../utils/api';

const webhookRouter = Router();

webhookRouter.post('/', async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    console.log(body.entry);
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

webhookRouter.get('/', async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const entry = req.body.entry;

  if (mode && token) {
    if (mode !== 'subscribe' && token !== config.FB_VERIFY_TOKEN) {
      res.sendStatus(403);
    }

    console.log(entry);

    try {
      await api.post(`/me/messenger_profile`, {
        params: {
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
        data: {
          get_started: {
            payload: 'greeting',
          },
          persistent_menu: [
            {
              locale: 'default',
              composer_input_disabled: false,
              call_to_actions: [
                {
                  type: 'postback',
                  title: 'Restart Bot',
                  payload: 'restart',
                },
                {
                  type: 'postback',
                  title: 'Read Full Mechanics',
                  payload: 'mechanics',
                },
                {
                  type: 'postback',
                  title: 'Send an Inquiry',
                  payload: 'inquiries',
                },
              ],
            },
          ],
        },
      });

      res.send(challenge);
    } catch (error) {
      console.log(error);
    }
  }
});

export default webhookRouter;
