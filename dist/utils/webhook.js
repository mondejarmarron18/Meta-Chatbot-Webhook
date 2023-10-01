"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postServiceInquirySummaryConfirmation = exports.postServiceInquirySummary = exports.postTicket = exports.postScheduleMeeting = exports.postOtherInquiry = exports.postInquiries = exports.postOurServices = exports.postAboutUs = exports.postGreeting = exports.postGetStarted = void 0;
const api_1 = __importDefault(require("./api"));
const config_1 = __importDefault(require("./config"));
const services_1 = require("./data/services");
const webhookPayload_1 = __importDefault(require("./webhookPayload"));
const postGetStarted = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post("/me/messenger_profile", {
        get_started: { payload: webhookPayload_1.default.getStarted },
        greeting: [
            {
                locale: "default",
                text: "Hi {{user_first_name}}, Welcome to Lightweight Solutions Page!",
            },
        ],
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postGetStarted = postGetStarted;
const postGreeting = (psid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`/me/messages`, {
        recipient: {
            id: psid,
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: `😊 Please choose from the options below to learn more.`,
                    buttons: [
                        {
                            type: "postback",
                            title: "About Us",
                            payload: webhookPayload_1.default.aboutUs,
                        },
                        {
                            type: "postback",
                            title: "Our Services",
                            payload: webhookPayload_1.default.ourServices,
                        },
                        {
                            type: "postback",
                            title: "Inquiry",
                            payload: webhookPayload_1.default.inquiries,
                        },
                    ],
                },
            },
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postGreeting = postGreeting;
const postAboutUs = (psid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`/me/messages`, {
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
                            payload: webhookPayload_1.default.goBack,
                        },
                    ],
                },
            },
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postAboutUs = postAboutUs;
const postOurServices = (psid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post("/me/messages", {
        recipient: {
            id: psid,
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: services_1.services.map((service) => ({
                        title: service.title,
                        subtitle: service.description,
                        image_url: service.image,
                        buttons: [
                            {
                                type: "web_url",
                                title: "Inquire",
                                url: `${config_1.default.FB_WEBVIEW_URL}/service-inquiry/${psid}/${service.id}`,
                                webview_height_ratio: "tall",
                                messenger_extensions: true,
                            },
                        ],
                    })),
                },
            },
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postOurServices = postOurServices;
const postInquiries = (psid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`/me/messages`, {
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
                            payload: webhookPayload_1.default.scheduleMeeting,
                        },
                        {
                            type: "web_url",
                            title: "Issues/Maintenance",
                            url: `${config_1.default.FB_WEBVIEW_URL}/issues-maintenance/${psid}`,
                            webview_height_ratio: "tall",
                            messenger_extensions: true,
                        },
                        {
                            type: "postback",
                            title: "Other Inquiry",
                            payload: webhookPayload_1.default.otherInquiry,
                        },
                    ],
                },
            },
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postInquiries = postInquiries;
const postOtherInquiry = (psid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`${config_1.default.FB_PAGE_ID}/messages`, {
        recipient: {
            id: psid,
        },
        message_type: "RESPONSE",
        message: {
            text: "Have other questions or concerns not listed? Feel free to message here and our agent will get back to you with a response 😊",
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postOtherInquiry = postOtherInquiry;
const postScheduleMeeting = (psid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`/me/messages`, {
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
                    payload: webhookPayload_1.default.goBack,
                },
            ],
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postScheduleMeeting = postScheduleMeeting;
const postTicket = (psid, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketLength = ticket.id.toString().length;
    const ticketNumber = [...Array(5 - ticketLength).fill(0), ticket.id].join("");
    return yield api_1.default.post(`/me/messages`, {
        recipient: {
            id: psid,
        },
        messaging_type: "RESPONSE",
        message: {
            text: `
          Thank you for contacting us. Your ticket number for your concerns is: LWS${ticketNumber}. Our team will be in touch with you within the next 24 hours. For any follow-ups or other concerns, you can also reach us via email at pmteam@lightweightsolutions.me.

          We appreciate your patience and look forward to assisting you further.`,
            quick_replies: [
                {
                    content_type: "text",
                    title: "Go Back",
                    payload: webhookPayload_1.default.goBack,
                },
            ],
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postTicket = postTicket;
const postServiceInquirySummary = (psid, serviceInquiry) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`${config_1.default.FB_PAGE_ID}/messages`, {
        recipient: {
            id: psid,
        },
        message_type: "RESPONSE",
        message: {
            text: `✍ Information Summary:
            
        Name: ${serviceInquiry.name}
        Company Name: ${serviceInquiry.companyName}
        Designation: ${serviceInquiry.designation}
        Email: ${serviceInquiry.email}
        Mobile Number: ${serviceInquiry.phone}
        Concerns and Inquiry: ${serviceInquiry.conernsAndInquiry}`,
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postServiceInquirySummary = postServiceInquirySummary;
const postServiceInquirySummaryConfirmation = (psid, serviceInquiry) => __awaiter(void 0, void 0, void 0, function* () {
    return yield api_1.default.post(`/me/messages`, {
        recipient: {
            id: psid,
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: `
            Is  the information above correct? 
            
            Hit I’M DONE  if it's all good or click EDIT if you need to change something. 😊`,
                    buttons: [
                        {
                            type: "postback",
                            title: "I'm Done",
                            payload: `${webhookPayload_1.default.serviceInquiryConfirmed}_${serviceInquiry.id}`,
                        },
                        // {
                        //   type: "web_url",
                        //   title: "Edit",
                        //   url: `${config.FB_WEBVIEW_URL}/service-inquiry/edit/${psid}`,
                        //   webview_height_ratio: "tall",
                        //   messenger_extensions: true,
                        // },
                    ],
                },
            },
        },
    }, {
        params: {
            access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
        },
    });
});
exports.postServiceInquirySummaryConfirmation = postServiceInquirySummaryConfirmation;
