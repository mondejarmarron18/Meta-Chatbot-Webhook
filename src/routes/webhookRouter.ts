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

        console.log('Message', event.message);
        console.log('Payload', event.payload);

        if (event.message) {
          await api.post(
            `/me/messages`,
            {
              recipient: {
                id: psid,
              },
              message: {
                attachment: {
                  type: 'template',
                  payload: {
                    template_type: 'button',
                    text: `Hi ${event?.sender?.first_name}, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.`,
                    buttons: [
                      {
                        type: 'postback',
                        title: 'About Us',
                        payload: 'about_us',
                      },
                      {
                        type: 'postback',
                        title: 'Our Services',
                        payload: 'our_services',
                      },
                      {
                        type: 'postback',
                        title: 'Inquiry',
                        payload: 'inquiry',
                      },
                    ],
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
        } else if (event.postback) {
          switch (event.payload) {
            case 'about_us':
              return await api.post(
                `/me/messages`,
                {
                  recipient: {
                    id: psid,
                  },
                  message: {
                    text: 'Lightweight Solutions founded in 2008 is an expert in the field of IT and has worked with many multinational and leading enterprises in the country.\n\nThe company has developed innovations, software solutions and technology products in the areas of healthcare, finance, FMCG, real estate, education, entertainment and electrification among others.\n\nWe envision a world that is smarter, better and more enjoyable through simplified technology while making it sustainable for future generations as well. We believe in innovations and smart solutions that create valuable impact to improve lifestyle and businesses while making a better world.\n\nWe simplify technology for you. Let us help you reach your goals.\n\nLet us build a smart and sustainable world TOGETHER.',
                    quick_replies: [
                      {
                        content_type: 'text',
                        title: 'Learn More',
                        payload: 'web_url',
                        web_url: 'https://lightweightsolutions.co/',
                      },
                      {
                        content_type: 'text',
                        title: 'Go Back',
                        payload: 'get_started',
                      },
                    ],
                  },
                },
                {
                  params: {
                    access_token: config.FB_PAGE_ACCESS_TOKEN,
                  },
                }
              );
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
