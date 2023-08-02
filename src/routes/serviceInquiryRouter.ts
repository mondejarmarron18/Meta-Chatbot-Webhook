import { Router } from "express";
import SGMail from "@sendgrid/mail";
import config from "../utils/config";
import serviceInquiryController from "../controllers/serviceInquiryController";
import {
  postServiceInquirySummary,
  postServiceInquirySummaryConfirmation,
} from "../utils/webhook";

const servinceInquiryRouter = Router();

servinceInquiryRouter.post("/", async (req, res) => {
  return await serviceInquiryController.createServiceInquiry(req.body);
});

servinceInquiryRouter.post("/:psid", async (req, res) => {
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

servinceInquiryRouter.get("/:serviceInquiryID", async (req, res) => {
  const serviceInquiryID = req.params.serviceInquiryID;

  return await serviceInquiryController.getServiceInquiry(+serviceInquiryID);
});
servinceInquiryRouter.get("/", async () => {
  return await serviceInquiryController.getServiceInquiries();
});

export default servinceInquiryRouter;
