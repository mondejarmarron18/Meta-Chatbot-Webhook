"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    PORT: process.env.PORT,
    FB_PAGE_ID: process.env.FB_PAGE_ID,
    FB_APP_ID: process.env.FB_APP_ID,
    FB_PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN,
    FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN,
    FB_WEBVIEW_URL: process.env.FB_WEBVIEW_URL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_SENDER_EMAIL: process.env.SENDGRID_SENDER_EMAIL,
    SENDGRID_RECEIVER_EMAIL: process.env.SENDGRID_RECEIVER_EMAIL,
};
exports.default = config;
