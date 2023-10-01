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
const ticketController_1 = __importDefault(require("../controllers/ticketController"));
const webhook_1 = require("../utils/webhook");
const ticketRouter = (0, express_1.Router)();
ticketRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield ticketController_1.default.createTicket(req.body);
        res.send(ticket);
    }
    catch (error) {
        res.send(error);
    }
}));
ticketRouter.post("/:psid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const psid = req.params.psid;
        const ticket = yield ticketController_1.default.createTicket(req.body);
        yield (0, webhook_1.postTicket)(psid, ticket);
        res.sendStatus(200);
    }
    catch (error) {
        res.send(error);
    }
}));
ticketRouter.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield ticketController_1.default.updateTicket(req.body);
    res.send(ticket);
}));
ticketRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield ticketController_1.default.getTickets();
        res.send(tickets);
    }
    catch (error) {
        res.send(error);
    }
}));
ticketRouter.get("/:ticketID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketID = req.params.ticketID;
    if (/^[0-9]+$/.test(ticketID)) {
        const ticket = yield ticketController_1.default.getTicket(+ticketID);
        return res.send(ticket);
    }
    res.status(400).send({
        ticketID: "Must be number",
    });
}));
ticketRouter.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield ticketController_1.default.deleteTickets();
    res.send(tickets);
}));
ticketRouter.delete("/:ticketID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ticketID = req.params.ticketID;
    if (/^[0-9]+$/.test(ticketID)) {
        const ticket = yield ticketController_1.default.deleteTicket(+ticketID);
        return res.send(ticket);
    }
    res.status(400).send({
        ticketID: "Must be number",
    });
}));
exports.default = ticketRouter;
