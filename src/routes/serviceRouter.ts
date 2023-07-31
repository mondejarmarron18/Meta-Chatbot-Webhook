import { Router } from "express";
import SGMail from "@sendgrid/mail";
import config from "../utils/config";

const serviceRouter = Router();

serviceRouter.post("/", async (req, res) => {
  const {
    serviceName,
    name,
    companyName,
    designation,
    email,
    phone,
    conernsAndInquiry,
  } = req.body;

  SGMail.setApiKey(`${config.SENDGRID_API_KEY}`);

  const message = {
    to: "mondejarmarron18@gmail.com", // Change to your recipient
    from: "marvin.r@lightweightsolutions.me", // Change to your verified sender
    subject: "Service Inquiry",
    html: `
            <p><b>Service Name: </b>${serviceName}</p>
            <p><b>Name: </b>${name}</p>
            <p><b>Company Name: </b>${companyName}</p> 
            <p><b>Designation: </b>${designation}</p>
            <p><b>Email: </b>${email}</p>
            <p><b>Phone: </b>${phone}</p>
            <p><b>Concerns/Inquiry: </b>${conernsAndInquiry}</p>
            `,
  };

  try {
    await SGMail.send(message);

    res.status(200).send("Sent!");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default serviceRouter;
