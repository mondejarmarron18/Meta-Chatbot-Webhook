"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = __importDefault(require("../utils/config"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const serviceInquiryController = {
    createServiceInquiry: (serviceInquiry) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.serviceInquiry.create({
            data: serviceInquiry,
        });
    }),
    getServiceInquiry: (serviceInquiryID) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.serviceInquiry.findUnique({
            where: {
                id: serviceInquiryID,
            },
        });
    }),
    sendEmail: (serviceInquiryID) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const serviceInquiry = prisma.serviceInquiry.findUnique({
                where: {
                    id: serviceInquiryID,
                },
            });
            mail_1.default.setApiKey(`${config_1.default.SENDGRID_API_KEY}`);
            const message = {
                to: `${config_1.default.SENDGRID_RECEIVER_EMAIL}`,
                from: `${config_1.default.SENDGRID_SENDER_EMAIL}`,
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
            return mail_1.default.send(message);
        }
        catch (error) {
            console.log(error);
        }
    }),
};
exports.default = serviceInquiryController;
