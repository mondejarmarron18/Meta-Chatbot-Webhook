import SGMail from "@sendgrid/mail";
import config from "../utils/config";
import { PrismaClient } from "@prisma/client";
import { postWelcome } from "../utils/webhook";

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

const prisma = new PrismaClient();

const serviceInquiryController = {
  createServiceInquiry: async (serviceInquiry: Omit<TServiceInquiry, "id">) => {
    return await prisma.serviceInquiry.create({
      data: serviceInquiry,
    });
  },
  getServiceInquiry: async (serviceInquiryID: TServiceInquiry["id"]) => {
    return await prisma.serviceInquiry.findUnique({
      where: {
        id: serviceInquiryID,
      },
    });
  },
  getServiceInquiries: async () => {
    return await prisma.serviceInquiry.findMany();
  },
  sendEmail: async (params: {
    serviceInquiryID: TServiceInquiry["id"];
    psid: string;
  }) => {
    try {
      const serviceInquiry = (await prisma.serviceInquiry.findUnique({
        where: {
          id: params.serviceInquiryID,
        },
      })) as TServiceInquiry;

      SGMail.setApiKey(`${config.SENDGRID_API_KEY}`);

      const message = {
        to: `${config.SENDGRID_RECEIVER_EMAIL}`, // Change to your recipient
        from: `${config.SENDGRID_SENDER_EMAIL}`, // Change to your verified sender
        subject: `Service Inquiry - ${serviceInquiry.serviceName}`,
        html: `
          <p><b>Name: </b>${serviceInquiry.name}</p>
          <p><b>Company Name: </b>${serviceInquiry.companyName}</p> 
          <p><b>Designation: </b>${serviceInquiry.designation}</p>
          <p><b>Email: </b>${serviceInquiry.email}</p>
          <p><b>Phone: </b>${serviceInquiry.phone}</p>
          <p><b>Concerns/Inquiry: </b>${serviceInquiry.conernsAndInquiry}</p>`,
      };

      await SGMail.send(message);

      return postWelcome(params.psid);
    } catch (error) {
      console.log(error);
    }
  },
  updateServiceInquiry: async (serviceInquiry: TServiceInquiry) => {
    return await prisma.serviceInquiry.update({
      where: {
        id: serviceInquiry.id,
      },
      data: serviceInquiry,
    });
  },
  deleteInquiries: async () => {
    return await prisma.serviceInquiry.deleteMany();
  },
};

export default serviceInquiryController;
