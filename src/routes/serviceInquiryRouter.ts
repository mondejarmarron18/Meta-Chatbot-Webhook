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
  try {
    const serviceInquiry = await serviceInquiryController.createServiceInquiry(
      req.body
    );

    res.status(201).send(serviceInquiry);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
  return;
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
  try {
    const serviceInquiryID = req.params.serviceInquiryID;

    const serviceInquiry = await serviceInquiryController.getServiceInquiry(
      +serviceInquiryID
    );

    res.status(200).send(serviceInquiry);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
servinceInquiryRouter.get("/", async (req, res) => {
  try {
    const serviceInquiries =
      await serviceInquiryController.getServiceInquiries();

    res.status(200).send(serviceInquiries);
  } catch (error) {
    console.log(error);
    res.sendStatus(200);
  }
});

export default servinceInquiryRouter;
