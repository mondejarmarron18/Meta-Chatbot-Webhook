import api from './api';
import config from './config';
import { services } from './data/services';

export enum webhookPostbackPayload {
  'getStarted' = 'get_started',
  'aboutUs' = 'about_us',
  'ourServices' = 'our_services',
  'inquiries' = 'inquiries',
  'goBack' = 'go_back',
  'visitWebsite' = 'visit_website',
  'scheduleMeeting' = 'schedule_meeting',
  'issuesOrMaintenance' = 'issues_or_maintenance',
  'otherInquiry' = 'other_inquiry',
}

export const postGetStarted = async () => {
  return await api.post(
    '/me/messenger_profile',
    {
      whitelisted_domains: 'https://lws-fb-chat-1c47aa033775.herokuapp.com',
      get_started: { payload: webhookPostbackPayload.getStarted },
    },
    {
      params: {
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );
};

export const postGreeting = async () => {
  return await api.post(
    '/me/messenger_profile',
    {
      greeting: [
        {
          locale: 'default',
          text: 'Hi {{user_first_name}}!',
        },
        {
          locale: 'en_US',
          text: 'Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.',
        },
      ],
    },
    {
      params: {
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );
};

export const postWelcome = async (psid: string) => {
  return await api.post(
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
            text: `Hi, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.`,
            buttons: [
              {
                type: 'postback',
                title: 'About Us',
                payload: webhookPostbackPayload.aboutUs,
              },
              {
                type: 'postback',
                title: 'Our Services',
                payload: webhookPostbackPayload.ourServices,
              },
              {
                type: 'postback',
                title: 'Inquiry',
                payload: webhookPostbackPayload.inquiries,
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
};

export const postAboutUs = async (psid: string) => {
  return await api.post(
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
            text: `Lightweight Solutions founded in 2008 is an expert in the field of IT and has worked with many multinational and leading enterprises in the country.\n\nThe company has developed innovations, software solutions and technology products in the areas of healthcare, finance, FMCG, real estate, education, entertainment and electrification among others.\n\nWe envision a world that is smarter, better and more enjoyable through simplified technology while making it sustainable for future generations as well`,
            buttons: [
              {
                type: 'web_url',
                title: 'Learn More',
                url: 'https://lightweightsolutions.co',
              },
              {
                type: 'postback',
                title: 'Go Back',
                payload: webhookPostbackPayload.goBack,
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
};

export const postOurServices = async (psid: string) => {
  return await api.post(
    '/me/messages',
    {
      recipient: {
        id: psid,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: services.map((service) => ({
              title: service.title,
              subtitle: service.description,
              image_url: service.image,
              buttons: [
                {
                  type: 'postback',
                  title: 'Inquire Service',
                  payload: service.payload,
                },
              ],
            })),
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
};

export const postInquiries = async (psid: string) => {
  return await api.post(
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
            text: `Please select your inquiry below:`,
            buttons: [
              {
                type: 'postback',
                title: 'Schedule a Meeting',
                payload: webhookPostbackPayload.scheduleMeeting,
              },
              {
                type: 'postback',
                title: 'Issues/Maintenance',
                payload: webhookPostbackPayload.issuesOrMaintenance,
              },
              {
                type: 'postback',
                title: 'Other Inquiry',
                payload: webhookPostbackPayload.otherInquiry,
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
};

export const postOtherInquiry = async (psid: string) => {
  return await api.post(
    `${config.FB_PAGE_ID}/messages`,
    {
      recipient: {
        id: psid,
      },
      message_type: 'RESPONSE',
      message: {
        text: 'Have other questions or concerns not listed? Feel free to message here and our agent will get back to you with a response 😊',
      },
    },
    {
      params: {
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );
};

export const postScheduleMeeting = async (psid: string) => {
  return await api.post(
    `/me/messages`,
    {
      recipient: {
        id: psid,
      },
      messaging_type: 'RESPONSE',
      message: {
        text: 'Please let us know your availability so that we can arrange a meeting to discuss your requirements.\n\nSchedule  https://calendly.com/marcmedina',
        quick_replies: [
          {
            content_type: 'text',
            title: 'Go Back',
            payload: webhookPostbackPayload.goBack,
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
};

export const postIssuesOrMaintenanceTicket = async (psid: string) => {
  const id = Math.floor(Math.random() * 899) + 100;

  return await api.post(
    `${config.FB_PAGE_ID}/messages`,
    {
      recipient: {
        id: psid,
      },
      message_type: 'RESPONSE',
      message: {
        text: `Thank you for contacting us. Your ticket number for your concerns is: LWS${id}. Our team will be in touch with you within the next 24 hours. For any follow-ups or other concerns, you can also reach us via email at pmteam@lightweightsolutions.me.\n\nWe appreciate your patience and look forward to assisting you further.`,
      },
    },
    {
      params: {
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );
};
