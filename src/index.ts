import express from 'express';
import config from './utils/config';
import axios from 'axios';
import cors from 'cors';

const baseURL = 'https://graph.facebook.com/v17.0';
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('LWS FB Chat');
});

// Add support for GET requests to our webhook
app.get('/webhook', async (req, res) => {
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  let body = req.body;

  console.log(body?.entry);

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === config.FB_VERIFY_TOKEN) {
      // Respond with the challenge token from the request

      try {
        // await axios.post(`${config.FB_PAGE_ID}/chat_plugin`, {
        //   params: {
        //     welcome_screen_greeting: 'Hello {{user_first_name}}',
        //     access_token: config.FB_PAGE_ACCESS_TOKEN,
        //   },
        // });

        await axios.post(`${baseURL}/me/messenger_profile`, {
          params: {
            access_token: config.FB_PAGE_ACCESS_TOKEN,
          },
          data: {
            whitelisted_domains: [
              'https://lws-fb-chat-1c47aa033775.herokuapp.com',
            ],
            get_started: {
              payload: 'greeting',
            },
            greeting: [
              {
                locale: 'default',
                text: 'Hi {{user_first_name}}, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.',
              },
            ],
            persistent_menu: [
              {
                locale: 'default',
                composer_input_disabled: false,
                call_to_actions: [
                  {
                    type: 'postback',
                    title: 'Restart Bot',
                    payload: 'restart',
                  },
                  {
                    type: 'postback',
                    title: 'Read Full Mechanics',
                    payload: 'mechanics',
                  },
                  {
                    type: 'postback',
                    title: 'Send an Inquiry',
                    payload: 'inquiries',
                  },
                ],
              },
            ],
          },
        });

        res.status(200).send(challenge);
      } catch (error) {
        res.send(error);
      }
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.log('Error with status 403');
      res.sendStatus(403);
    }
  } else {
    console.log('FAiled');
  }
});

app.listen(config.PORT, () => {
  console.log(`Listening to port ${config.PORT}`);
});
