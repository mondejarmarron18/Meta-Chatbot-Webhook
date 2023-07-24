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

    await postGetStarted();

    res.status(200).send(challenge);
  }
});

webhookRouter.post('/', async (req, res) => {
  const body = req.body;

  if (body.object !== 'page') return res.sendStatus(404);

  body.entry.forEach((entry: any) => {
    entry.messaging.forEach((event: any) => {
      const psid = event.sender.id;

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
          case webhookPostbackPayload.issuesOrMaintenance:
            return api.post(
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
                      text: `✍ *Information Summary*
                
                First Name: ${req.body.first_name}
                Last Name: ${req.body.last_name}
                Mobile Number: ${req.body.mobile_number}
                Email: ${req.body.email ? req.body.email : 'N/A'}
              
                
                Is the information above correct?
                
                Hit "I'm Done" if it's all good or else "Edit" if you need to change something!`,

                      buttons: [
                        {
                          type: 'web_url',
                          url: `https://lws-fb-chat-1c47aa033775.herokuapp.com/registration?psid=${
                            req.body.psid
                          }&promo=${req.body.promo}${
                            req.body.bar ? `&bar=${req.body.bar}` : ''
                          }${req.body.batch ? `&batch=${req.body.batch}` : ''}`,
                          title: 'Edit',
                          webview_height_ratio: 'tall',
                          messenger_extensions: true,
                        },
                        {
                          type: 'postback',
                          title: "I'm Done",
                          payload: `spin_now without_receipt?bar=${req.body.bar}&batch=${req.body.batch}`,
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
        }
      }
    });
  });

  res.status(200).send('EVENT_RECEIVED');
});

export default webhookRouter;
