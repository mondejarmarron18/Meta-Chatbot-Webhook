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
const express_1 = require("express");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = __importDefault(require("../utils/config"));
const serviceRouter = (0, express_1.Router)();
serviceRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceName, name, companyName, designation, email, phone, conernsAndInquiry, } = req.body;
    mail_1.default.setApiKey(`${config_1.default.SENDGRID_API_KEY}`);
    const message = {
        to: "mondejarmarron18@gmail.com",
        from: "marvin.r@lightweightsolutions.me",
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
        yield mail_1.default.send(message);
        res.status(200).send("Sent!");
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
exports.default = serviceRouter;
