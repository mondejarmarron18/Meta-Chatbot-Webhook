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
const webhook_1 = require("../utils/webhook");
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
    getServiceInquiries: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.serviceInquiry.findMany();
    }),
    sendEmail: (params) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const serviceInquiry = (yield prisma.serviceInquiry.findUnique({
                where: {
                    id: params.serviceInquiryID,
                },
            }));
            mail_1.default.setApiKey(`${config_1.default.SENDGRID_API_KEY}`);
            const message = {
                to: `${config_1.default.SENDGRID_RECEIVER_EMAIL}`,
                from: `${config_1.default.SENDGRID_SENDER_EMAIL}`,
                subject: `Service Inquiry - ${serviceInquiry.serviceName}`,
                html: `
          <p><b>Name: </b>${serviceInquiry.name}</p>
          <p><b>Company Name: </b>${serviceInquiry.companyName}</p> 
          <p><b>Designation: </b>${serviceInquiry.designation}</p>
          <p><b>Email: </b>${serviceInquiry.email}</p>
          <p><b>Phone: </b>${serviceInquiry.phone}</p>
          <p><b>Concerns/Inquiry: </b>${serviceInquiry.conernsAndInquiry}</p>`,
            };
            yield mail_1.default.send(message);
            return (0, webhook_1.postWelcome)(params.psid);
        }
        catch (error) {
            console.log(error);
        }
    }),
    updateServiceInquiry: (serviceInquiry) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.serviceInquiry.update({
            where: {
                id: serviceInquiry.id,
            },
            data: serviceInquiry,
        });
    }),
    deleteInquiries: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.serviceInquiry.deleteMany();
    }),
};
exports.default = serviceInquiryController;
