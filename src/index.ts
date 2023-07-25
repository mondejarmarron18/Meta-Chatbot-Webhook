import express from 'express';
import config from './utils/config';
import cors from 'cors';
import webhookRouter from './routes/webhookRouter';
import ticketRouter from './routes/ticketRouter';
import { services } from './utils/data/services';

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

app.get('/service/:serviceID', (req, res) => {
  const { serviceID } = req.params;

  const service = services.find((service) => {
    return service.id.toString() === serviceID;
  });

  res.render('service', {
    serviceTitle: service?.title,
  });
});

app.get('/issues-maintenance', (req, res) => {
  res.render('issues-maintenance');
});

app.listen(config.PORT, () => {
  console.log(`Listening to port ${config.PORT}`);
});
