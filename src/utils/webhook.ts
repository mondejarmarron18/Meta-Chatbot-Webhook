import { TServiceInquiry } from "../controllers/serviceInquiryController";
import { TTicket } from "../controllers/ticketController";
import api from "./api";
import config from "./config";
import { services } from "./data/services";
import webhookPayload from "./webhookPayload";

export const postGetStarted = async () => {
  console.log("Get Started is Running...");
  return await api.post(
    "/me/messenger_profile",
    {
      get_started: { payload: webhookPayload.getStarted },
      greeting: [
        {
          locale: "default",
          text: "",
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
  const userProfile = await getUserProfile(psid, ["first_name"]);

  return await api.post(
    `/me/messages`,
    {
      recipient: {
        id: psid,
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `Hi ${
              userProfile.first_name || ""
            }, Welcome to Lightweight Solutions Page!😊 Please choose from the options below to learn more.`,
            buttons: [
              {
                type: "postback",
                title: "About Us",
                payload: webhookPayload.aboutUs,
              },
              {
                type: "postback",
                title: "Our Services",
                payload: webhookPayload.ourServices,
              },
              {
                type: "postback",
                title: "Inquiry",
                payload: webhookPayload.inquiries,
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
          type: "template",
          payload: {
            template_type: "button",
            text: `Lightweight Solutions founded in 2008 is an expert in the field of IT and has worked with many multinational and leading enterprises in the country.\n\nThe company has developed innovations, software solutions and technology products in the areas of healthcare, finance, FMCG, real estate, education, entertainment and electrification among others.\n\nWe envision a world that is smarter, better and more enjoyable through simplified technology while making it sustainable for future generations as well`,
            buttons: [
              {
                type: "web_url",
                title: "Learn More",
                url: "https://lightweightsolutions.co",
              },
              {
                type: "postback",
                title: "Go Back",
                payload: webhookPayload.goBack,
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
    "/me/messages",
    {
      recipient: {
        id: psid,
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: services.map((service) => ({
              title: service.title,
              subtitle: service.description,
              image_url: service.image,
              buttons: [
                {
                  type: "web_url",
                  title: "Inquire",
                  url: `${config.FB_WEBVIEW_URL}/service-inquiry/${psid}/${service.id}`,
                  webview_height_ratio: "tall",
                  messenger_extensions: true,
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
          type: "template",
          payload: {
            template_type: "button",
            text: `Please select your inquiry below:`,
            buttons: [
              {
                type: "postback",
                title: "Schedule a Meeting",
                payload: webhookPayload.scheduleMeeting,
              },
              {
                type: "web_url",
                title: "Issues/Maintenance",
                url: `${config.FB_WEBVIEW_URL}/issues-maintenance/${psid}`,
                webview_height_ratio: "tall",
                messenger_extensions: true,
              },
              {
                type: "postback",
                title: "Other Inquiry",
                payload: webhookPayload.otherInquiry,
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
      message_type: "RESPONSE",
      message: {
        text: "Have other questions or concerns not listed? Feel free to message here and our agent will get back to you with a response 😊",
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
      messaging_type: "RESPONSE",
      message: {
        text: "Please let us know your availability so that we can arrange a meeting to discuss your requirements.\n\nSchedule  https://calendly.com/marcmedina",
        quick_replies: [
          {
            content_type: "text",
            title: "Go Back",
            payload: webhookPayload.goBack,
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

export const postTicket = async (psid: string, ticket: TTicket) => {
  const ticketLength = ticket.id.toString().length;
  const ticketNumber = [...Array(5 - ticketLength).fill(0), ticket.id].join("");

  return await api.post(
    `/me/messages`,
    {
      recipient: {
        id: psid,
      },
      messaging_type: "RESPONSE",
      message: {
        text: `Thank you for contacting us. Your ticket number for your concerns is: LWS${ticketNumber}. Our team will be in touch with you within the next 24 hours. For any follow-ups or other concerns, you can also reach us via email at pmteam@lightweightsolutions.me.\n\nWe appreciate your patience and look forward to assisting you further.`,
        quick_replies: [
          {
            content_type: "text",
            title: "Go Back",
            payload: webhookPayload.goBack,
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

export const postServiceInquirySummary = async (
  psid: string,
  serviceInquiry: TServiceInquiry
) => {
  return await api.post(
    `${config.FB_PAGE_ID}/messages`,
    {
      recipient: {
        id: psid,
      },
      message_type: "RESPONSE",
      message: {
        text: `✍ Information Summary:\n\nName: ${serviceInquiry.name}\nCompany Name: ${serviceInquiry.companyName}\nDesignation: ${serviceInquiry.designation}\nEmail: ${serviceInquiry.email}\nMobile Number: ${serviceInquiry.phone}\nConcerns and Inquiry: ${serviceInquiry.conernsAndInquiry}`,
      },
    },
    {
      params: {
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );
};

export const postServiceInquirySummaryConfirmation = async (
  psid: string,
  serviceInquiry: TServiceInquiry
) => {
  return await api.post(
    `/me/messages`,
    {
      recipient: {
        id: psid,
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `Is  the information above correct?\n\nHit I’M DONE  if it's all good or click EDIT if you need to change something. 😊`,
            buttons: [
              {
                type: "postback",
                title: "I'm Done",
                payload: `${webhookPayload.serviceInquiryConfirmed}_${serviceInquiry.id}`,
              },
              {
                type: "web_url",
                title: "Edit",
                url: `${config.FB_WEBVIEW_URL}/service-inquiry/update/${psid}/${serviceInquiry.id}`,
                webview_height_ratio: "tall",
                messenger_extensions: true,
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

type TUserProfile = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  locale: string;
  timezone: string;
  gender: string;
};

type TUserProfileFieds = Array<
  | "id"
  | "name"
  | "first_name"
  | "lastname"
  | "profile_pic"
  | "locale"
  | "timezone"
  | "gender"
>;

export const getUserProfile = async (
  psid: string,
  fields: TUserProfileFieds
): Promise<Partial<TUserProfile>> => {
  try {
    return await api.get(`/${psid}`, {
      params: {
        fields: fields.join(","),
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    });
  } catch (error) {
    console.log(error);
    return {};
  }
};
