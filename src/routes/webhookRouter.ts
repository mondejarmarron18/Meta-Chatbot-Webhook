import { Router } from 'express';
import config from '../utils/config';
import api from '../utils/api';

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
      entry.messaging.forEach(async (event: any) => {
        const psid = event.sender.id;

        console.log(entry);

        // await api.post(
        //   `/me/messages`,
        //   {
        //     recipient: {
        //       id: psid,
        //     },
        //     message: {
        //       attachment: {
        //         type: 'template',
        //         payload: {
        //           template_type: 'button',
        //           text: `Hi ${event?.postback}, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.`,
        //           buttons: [
        //             {
        //               type: 'postback',
        //               title: 'About Us',
        //               payload: 'about_us',
        //             },
        //             {
        //               type: 'postback',
        //               title: 'Our Services',
        //               payload: 'our_services',
        //             },
        //             {
        //               type: 'postback',
        //               title: 'Inquiry',
        //               payload: 'inquiry',
        //             },
        //           ],
        //         },
        //       },
        //     },
        //   },
        //   {
        //     params: {
        //       access_token: config.FB_PAGE_ACCESS_TOKEN,
        //     },
        //   }
        // );
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

export default webhookRouter;
