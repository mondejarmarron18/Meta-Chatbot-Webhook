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
const serviceInquiryController_1 = __importDefault(require("../controllers/serviceInquiryController"));
const webhook_1 = require("../utils/webhook");
const serviceInquiryRouter = (0, express_1.Router)();
serviceInquiryRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceInquiry = yield serviceInquiryController_1.default.createServiceInquiry(req.body);
        res.status(201).send(serviceInquiry);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    return;
}));
serviceInquiryRouter.post("/:psid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const psid = req.params.psid;
    try {
        const serviceInquiry = yield serviceInquiryController_1.default.createServiceInquiry(req.body);
        yield (0, webhook_1.postServiceInquirySummary)(psid, serviceInquiry);
        yield (0, webhook_1.postServiceInquirySummaryConfirmation)(psid, serviceInquiry);
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
serviceInquiryRouter.get("/:serviceInquiryID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceInquiryID = req.params.serviceInquiryID;
        const serviceInquiry = yield serviceInquiryController_1.default.getServiceInquiry(+serviceInquiryID);
        res.status(200).send(serviceInquiry);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
serviceInquiryRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceInquiries = yield serviceInquiryController_1.default.getServiceInquiries();
        res.status(200).send(serviceInquiries);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(200);
    }
}));
serviceInquiryRouter.put("/:psid/:serviceInquiryID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { psid, serviceInquiryID } = req.params;
    try {
        const serviceInquiry = yield serviceInquiryController_1.default.updateServiceInquiry(Object.assign(Object.assign({}, req.body), { id: +serviceInquiryID }));
        yield (0, webhook_1.postServiceInquirySummary)(psid, Object.assign(Object.assign({}, serviceInquiry), { id: +serviceInquiryID }));
        yield (0, webhook_1.postServiceInquirySummaryConfirmation)(psid, serviceInquiry);
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
serviceInquiryRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield serviceInquiryController_1.default.deleteInquiries();
        res.status(200).send(count);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
exports.default = serviceInquiryRouter;
