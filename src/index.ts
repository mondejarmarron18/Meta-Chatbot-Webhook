import express from "express";
import config from "./utils/config";
import cors from "cors";
import webhookRouter from "./routes/webhookRouter";
import ticketRouter from "./routes/ticketRouter";
import { services } from "./utils/data/services";
import serviceRouter from "./routes/serviceRouter";
import bodyParser from "body-parser";

const app = express();

app.set("views", "src/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/webhook", webhookRouter);
app.use("/tickets", ticketRouter);
app.use("/serviceInquiry", serviceRouter);

//Pages
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/service-inquiry/:psid/:serviceID/", (req, res) => {
  const { serviceID, psid } = req.params;

  const service = services.find((service) => {
    return service.id.toString() === serviceID;
  });

  res.render("service", {
    serviceTitle: service?.title,
    psid,
  });
});

app.get("/issues-maintenance/:psid", (req, res) => {
  const psid = req.params.psid;

  res.render("issues-maintenance", {
    psid,
  });
});

app.listen(config.PORT, () => {
  console.log(`Listening to port ${config.PORT}`);
});
