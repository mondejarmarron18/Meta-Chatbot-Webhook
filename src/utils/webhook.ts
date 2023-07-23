import api from './api';
import config from './config';

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
            text: `Hi ${psid}, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.`,
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
};

export const postAboutUs = async (psid: string) => {
  return await api
    .post(
      `/${config.FB_PAGE_ID}/messages`,
      {
        recipient: {
          id: psid,
        },
        messaging_type: 'RESPONSE',
        message: {
          text: 'Lightweight Solutions founded in 2008 is an expert in the field of IT and has worked with many multinational and leading enterprises in the country.\n\nThe company has developed innovations, software solutions and technology products in the areas of healthcare, finance, FMCG, real estate, education, entertainment and electrification among others.\n\nWe envision a world that is smarter, better and more enjoyable through simplified technology while making it sustainable for future generations as well. We believe in innovations and smart solutions that create valuable impact to improve lifestyle and businesses while making a better world.\n\nWe simplify technology for you. Let us help you reach your goals.\n\nLet us build a smart and sustainable world TOGETHER',
        },
      },
      {
        params: {
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
      }
    )
    .then(async (res) => {
      const recepientId = await res.data.recipient_id;

      return api.post(
        `/me/messages`,
        {
          recipient: {
            id: recepientId,
          },
          message: {
            attachment: {
              type: 'template',
              text: '',
              payload: {
                template_type: 'button',
                buttons: [
                  {
                    type: 'web_url',
                    title: 'Learn More',
                    url: 'https://lightweightsolutions.co',
                  },
                  {
                    type: 'postback',
                    title: 'Go Back',
                    payload: 'go_back',
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
    });
};
