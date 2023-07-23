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

        api.post(
          `/me/messages`,
          {
            recipient: {
              id: psid,
            },
            message: {
              attachment: {
                type: 'image',
                payload: {
                  url: 'https://images.unsplash.com/photo-1689427190696-3391324b1ef3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                  is_reusable: true,
                },
              },
            },
          },
          {
            params: {
              access_token: config.FB_PAGE_ACCESS_TOKEN,
            },
          }
        );
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

    try {
      await api.post(
        '/me/messenger_profile',
        {
          greeting: [
            {
              locale: 'default',
              text: 'Hi {{user_first_name}}, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.',
            },
          ],
        },
        {
          params: {
            access_token: config.FB_PAGE_ACCESS_TOKEN,
          },
        }
      );
      res.send(challenge);
    } catch (error) {
      console.log(error);
    }
  }
});

export default webhookRouter;
