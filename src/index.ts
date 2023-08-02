import express from "express";
import config from "./utils/config";
import cors from "cors";
import webhookRouter from "./routes/webhookRouter";
import ticketRouter from "./routes/ticketRouter";
import { services } from "./utils/data/services";
import serviceInquiryRouter from "./routes/serviceInquiryRouter";
import bodyParser from "body-parser";
import serviceInquiryController from "./controllers/serviceInquiryController";

const app = express();

app.set("views", "src/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/webhook", webhookRouter);
app.use("/tickets", ticketRouter);
app.use("/serviceInquiry", serviceInquiryRouter);

//Pages
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/service-inquiry/:psid/:serviceID", (req, res) => {
  const { serviceID, psid } = req.params;

  const service = services.find((service) => {
    return service.id.toString() === serviceID;
  });

  res.render("service-inquiry", {
    serviceName: service?.title,
    psid,
  });
});

app.get("/service-inquiry/update/:psid/:serviceInquiryID", async (req, res) => {
  const { serviceInquiryID, psid } = req.params;

  try {
    const serviceInquiry = await serviceInquiryController.getServiceInquiry(
      +serviceInquiryID
    );

    res.render("service-inquiry", {
      psid,
      id: serviceInquiry?.id,
      serviceName: serviceInquiry?.serviceName,
      name: serviceInquiry?.name,
      companyName: serviceInquiry?.companyName,
      designation: serviceInquiry?.designation,
      email: serviceInquiry?.email,
      phone: serviceInquiry?.phone,
      concernsAndInquiry: serviceInquiry?.conernsAndInquiry,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
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
