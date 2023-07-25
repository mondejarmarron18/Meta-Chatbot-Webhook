import 'dotenv/config';

const config = {
  PORT: process.env.PORT,
  FB_PAGE_ID: process.env.FB_PAGE_ID,
  FB_APP_ID: process.env.FB_APP_ID,
  FB_PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN,
  FB_VERIFY_TOKEN: process.env.FB_VERIFY_TOKEN,
  FB_WEBVIEW_URL: process.env.FB_WEBVIEW_URL,
};

export default config;
