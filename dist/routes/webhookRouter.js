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
const config_1 = __importDefault(require("../utils/config"));
const webhook_1 = require("../utils/webhook");
const webhookPayload_1 = __importDefault(require("../utils/webhookPayload"));
const serviceInquiryController_1 = __importDefault(require("../controllers/serviceInquiryController"));
const webhookRouter = (0, express_1.Router)();
webhookRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode !== "subscribe" && token !== config_1.default.FB_VERIFY_TOKEN) {
            res.sendStatus(403);
        }
        res.status(200).send(challenge);
    }
}));
webhookRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (body.object !== "page")
        return res.sendStatus(404);
    if (body.entry[0].changes && body.entry[0].changes[0].field === "feed") {
        try {
            yield (0, webhook_1.postGetStarted)();
            return res.status(200).send("EVENT_RECEIVED");
        }
        catch (error) {
            return res.sendStatus(500);
        }
    }
    body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
            var _a, _b, _c, _d, _e;
            const psid = event.sender.id;
            if (event === null || event === void 0 ? void 0 : event.message) {
                if ((_a = event.message) === null || _a === void 0 ? void 0 : _a.quick_reply) {
                    switch ((_b = event.message.quick_reply) === null || _b === void 0 ? void 0 : _b.payload) {
                        case webhookPayload_1.default.goBack:
                            return (0, webhook_1.postWelcome)(psid);
                    }
                }
            }
            else if (event === null || event === void 0 ? void 0 : event.postback) {
                switch ((_c = event.postback) === null || _c === void 0 ? void 0 : _c.payload) {
                    case webhookPayload_1.default.getStarted:
                        return (0, webhook_1.postWelcome)(psid || ((_d = event.sender) === null || _d === void 0 ? void 0 : _d.user_ref));
                    case webhookPayload_1.default.goBack:
                        return (0, webhook_1.postWelcome)(psid);
                    case webhookPayload_1.default.aboutUs:
                        return (0, webhook_1.postAboutUs)(psid);
                    case webhookPayload_1.default.ourServices:
                        return (0, webhook_1.postOurServices)(psid);
                    case webhookPayload_1.default.inquiries:
                        return (0, webhook_1.postInquiries)(psid);
                    case webhookPayload_1.default.scheduleMeeting:
                        return (0, webhook_1.postScheduleMeeting)(psid);
                    case webhookPayload_1.default.otherInquiry:
                        return (0, webhook_1.postOtherInquiry)(psid);
                }
                const payload = (_e = event.postback) === null || _e === void 0 ? void 0 : _e.payload;
                const serviceInquiryConfirmed = webhookPayload_1.default.serviceInquiryConfirmed;
                //Email servince inquiry
                if (payload === null || payload === void 0 ? void 0 : payload.includes(serviceInquiryConfirmed)) {
                    const serviceInquiryID = payload === null || payload === void 0 ? void 0 : payload.split(`${serviceInquiryConfirmed}_`).join("");
                    return serviceInquiryController_1.default.sendEmail({
                        serviceInquiryID: +serviceInquiryID,
                        psid,
                    });
                }
            }
        });
    });
    res.status(200).send("EVENT_RECEIVED");
}));
webhookRouter.get("/get-started", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, webhook_1.postGetStarted)();
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
exports.default = webhookRouter;
