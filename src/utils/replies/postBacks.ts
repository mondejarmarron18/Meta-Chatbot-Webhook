import serviceInquiryController from "../../controllers/serviceInquiryController";
import {
  postWelcome,
  postAboutUs,
  postOurServices,
  postInquiries,
  postScheduleMeeting,
  postOtherInquiry,
} from "../webhook";
import webhookPayload from "../webhookPayload";

const postBacks = (event: any, psid: string) => {
  switch (event.postback?.payload) {
    case webhookPayload.getStarted:
      return postWelcome(psid || event.sender?.user_ref);
    case webhookPayload.goBack:
      return postWelcome(psid);
    case webhookPayload.aboutUs:
      return postAboutUs(psid);
    case webhookPayload.ourServices:
      return postOurServices(psid);
    case webhookPayload.inquiries:
      return postInquiries(psid);
    case webhookPayload.scheduleMeeting:
      return postScheduleMeeting(psid);
    case webhookPayload.otherInquiry:
      return postOtherInquiry(psid);
  }

  const payload = event.postback?.payload;
  const serviceInquiryConfirmed = webhookPayload.serviceInquiryConfirmed;

  //Email service inquiry
  if (payload?.includes(serviceInquiryConfirmed)) {
    const serviceInquiryID = payload
      ?.split(`${serviceInquiryConfirmed}_`)
      .join("");
    return serviceInquiryController.sendEmail({
      serviceInquiryID: +serviceInquiryID,
      psid,
    });
  }
};

export default postBacks;
