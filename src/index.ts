import express from 'express';
import config from './utils/config';
import cors from 'cors';
import webhookRouter from './routes/webhookRouter';
import ticketRouter from './routes/ticketRouter';

const app = express();

app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());

app.use('/webhook', webhookRouter);
app.use('/tickets', ticketRouter);

//Pages
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/service', (req, res) => {
  res.render('service');
});

app.listen(config.PORT, () => {
  console.log(`Listening to port ${config.PORT}`);
});
