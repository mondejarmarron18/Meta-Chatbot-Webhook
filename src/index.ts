import express from 'express';
import config from './utils/config';
import cors from 'cors';
import webhookRouter from './routes/webhookRouter';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('LWS FB Chat');
});

app.use('/webhook', webhookRouter);

app.listen(config.PORT, () => {
  console.log(`Listening to port ${config.PORT}`);
});
