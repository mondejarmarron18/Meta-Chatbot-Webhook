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
const servinceInquiryRouter = (0, express_1.Router)();
servinceInquiryRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield serviceInquiryController_1.default.createServiceInquiry(req.body);
}));
servinceInquiryRouter.post("/:psid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = servinceInquiryRouter;
