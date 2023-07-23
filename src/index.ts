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
app.get('/webhook', (req, res) => {
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const body = req.body;

  console.log(body?.entry);

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === config.FB_VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      res.status(200).send(challenge);

      axios.post(`${baseURL}/me/messenger_profile`, {
        params: {
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
        data: {
          get_started: {
            payload: 'greeting',
          },
          greeting: [
            {
              locale: 'default',
              text: 'Hi {{user_first_name}}, Welcome to Lightweight Solutions Page! 😊 Please choose from the options below to learn more.',
            },
          ],
          // persistent_menu: [
          //   {
          //     locale: 'default',
          //     composer_input_disabled: false,
          //     call_to_actions: [
          //       {
          //         type: 'postback',
          //         title: 'Restart Bot',
          //         payload: 'restart',
          //       },
          //       {
          //         type: 'postback',
          //         title: 'Read Full Mechanics',
          //         payload: 'mechanics',
          //       },
          //       {
          //         type: 'postback',
          //         title: 'Send an Inquiry',
          //         payload: 'inquiries',
          //       },
          //     ],
          //   },
          // ],
        },
      });
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.get('/conversations', async (req, res) => {
  try {
    const result = await axios.get(
      `${baseURL}/${config.FB_PAGE_ID}/conversations`,
      {
        params: {
          fields: 'participants',
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
      }
    );

    res.send(await result.data);
  } catch (error) {
    res.send(error);
  }
});

app.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await axios.get(`${baseURL}/${id}`, {
      params: {
        fields: 'messages{message}',
        access_token: config.FB_PAGE_ACCESS_TOKEN,
      },
    });
    const data = await result.data;

    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.post('/conversations/:psid', async (req, res) => {
  try {
    const { psid } = req.params;
    const body = req.body;

    const result = await axios.post(
      `${baseURL}/${config.FB_PAGE_ID}/messages`,
      {
        params: {
          recipient: { id: psid },
          message: { text: body?.message },
          messaging_type: 'RESPONSE',
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
      }
    );

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

app.listen(config.PORT, () => {
  console.log(`Listening to port ${config.PORT}`);
});
