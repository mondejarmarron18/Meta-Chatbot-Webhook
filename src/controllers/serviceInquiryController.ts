import SGMail from "@sendgrid/mail";
import config from "../utils/config";

export type TServiceInquiry = {
  id: number;
  serviceName: string;
  name: string;
  companyName: string;
  designation: string;
  email: string;
  phone: string;
  conernsAndInquiry: string;
};

const serviceInquiryController = {
  sendEmail: async (serviceInquiry: Omit<TServiceInquiry, "id">) => {
    SGMail.setApiKey(`${config.SENDGRID_API_KEY}`);

    const message = {
      to: `${config.SENDGRID_RECEIVER_EMAIL}`, // Change to your recipient
      from: `${config.SENDGRID_SENDER_EMAIL}`, // Change to your verified sender
      subject: "Service Inquiry",
      html: `
            <p><b>Service Name: </b>${serviceInquiry.serviceName}</p>
            <p><b>Name: </b>${serviceInquiry.name}</p>
            <p><b>Company Name: </b>${serviceInquiry.companyName}</p> 
            <p><b>Designation: </b>${serviceInquiry.designation}</p>
            <p><b>Email: </b>${serviceInquiry.email}</p>
            <p><b>Phone: </b>${serviceInquiry.phone}</p>
            <p><b>Concerns/Inquiry: </b>${serviceInquiry.conernsAndInquiry}</p>
            `,
    };

    return SGMail.send(message);
  },
};

export default serviceInquiryController;
