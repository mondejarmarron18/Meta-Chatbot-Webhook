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
            var _a, _b, _c, _d, _e, _f, _g;
            const psid = event.sender.id;
            if (event === null || event === void 0 ? void 0 : event.message) {
                if ((_a = event.message) === null || _a === void 0 ? void 0 : _a.quick_reply) {
                    switch ((_b = event.message.quick_reply) === null || _b === void 0 ? void 0 : _b.payload) {
                        case webhookPayload_1.default.goBack:
                            return (0, webhook_1.postGreeting)(psid);
                    }
                }
            }
            else if (event === null || event === void 0 ? void 0 : event.postback) {
                switch ((_c = event.postback) === null || _c === void 0 ? void 0 : _c.payload) {
                    case webhookPayload_1.default.getStarted:
                        return (0, webhook_1.postGreeting)(psid || ((_d = event.sender) === null || _d === void 0 ? void 0 : _d.user_ref));
                    case webhookPayload_1.default.goBack:
                        return (0, webhook_1.postGreeting)(psid);
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
                    case (_f = (_e = event.postback) === null || _e === void 0 ? void 0 : _e.payload) === null || _f === void 0 ? void 0 : _f.includes(webhookPayload_1.default.serviceInquiryConfirmed):
                        const serviceInquiryID = (_g = event.postback.payload) === null || _g === void 0 ? void 0 : _g.split(webhookPayload_1.default.serviceInquiryConfirmed).join("");
                        return serviceInquiryController_1.default.sendEmail(+serviceInquiryID);
                }
            }
        });
    });
    res.status(200).send("EVENT_RECEIVED");
}));
exports.default = webhookRouter;
