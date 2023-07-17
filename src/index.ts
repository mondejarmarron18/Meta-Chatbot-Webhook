import express from 'express';
import config from './utils/config';
import axios from 'axios';

const app = express();

app.use(express.json());
app.use(express.static('public'));

const baseURL = 'https://graph.facebook.com/v15.0';

app.get('/', (req, res) => {
  res.send('Working');
});

app.post('/webhook', (req, res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  if (body.object === 'page') {
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
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

app.post('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const result = await axios.post(
      `${baseURL}/${config.FB_PAGE_ID}/messages`,
      {
        params: {
          recipient: { id },
          message: { text: body.message },
          messaging_type: 'RESPONSE',
          access_token: config.FB_PAGE_ACCESS_TOKEN,
        },
      }
    );
    const data = await result.data;

    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.listen(config.APP_PORT, () => {
  console.log(`Listening to port ${config.APP_PORT}`);
});

module.exports = app;
