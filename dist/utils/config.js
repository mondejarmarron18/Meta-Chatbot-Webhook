"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    APP_PORT: process.env.APP_PORT,
    FB_PAGE_ID: process.env.FB_PAGE_ID,
    FB_APP_ID: process.env.FB_APP_ID,
    FB_PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN,
};
exports.default = config;
