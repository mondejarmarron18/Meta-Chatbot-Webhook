import { Router } from "express";
import SGMail from "@sendgrid/mail";
import config from "../utils/config";
import serviceInquiryController from "../controllers/serviceInquiryController";
import {
  postServiceInquirySummary,
  postServiceInquirySummaryConfirmation,
} from "../utils/webhook";

const serviceRouter = Router();

serviceRouter.post("/", async (req, res) => {
  return await serviceInquiryController.createServiceInquiry(req.body);
});

serviceRouter.post("/:psid", async (req, res) => {
  const psid = req.params.psid;

  try {
    const serviceInquiry = await serviceInquiryController.createServiceInquiry(
      req.body
    );

    await postServiceInquirySummary(psid, serviceInquiry);
    await postServiceInquirySummaryConfirmation(psid, serviceInquiry);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default serviceRouter;
