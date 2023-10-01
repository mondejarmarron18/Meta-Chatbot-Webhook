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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./utils/config"));
const cors_1 = __importDefault(require("cors"));
const webhookRouter_1 = __importDefault(require("./routes/webhookRouter"));
const ticketRouter_1 = __importDefault(require("./routes/ticketRouter"));
const services_1 = require("./utils/data/services");
const serviceInquiryRouter_1 = __importDefault(require("./routes/serviceInquiryRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
const serviceInquiryController_1 = __importDefault(require("./controllers/serviceInquiryController"));
const app = (0, express_1.default)();
app.set("views", "src/views");
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/webhook", webhookRouter_1.default);
app.use("/tickets", ticketRouter_1.default);
app.use("/serviceInquiry", serviceInquiryRouter_1.default);
//Pages
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/service-inquiry/:psid/:serviceID", (req, res) => {
    const { serviceID, psid } = req.params;
    const service = services_1.services.find((service) => {
        return service.id.toString() === serviceID;
    });
    res.render("service-inquiry", {
        psid,
        serviceInquiry: {
            serviceName: service === null || service === void 0 ? void 0 : service.title,
        },
    });
});
app.get("/service-inquiry/update/:psid/:serviceInquiryID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceInquiryID, psid } = req.params;
    try {
        const serviceInquiry = yield serviceInquiryController_1.default.getServiceInquiry(+serviceInquiryID);
        res.render("service-inquiry", {
            psid,
            serviceInquiry,
        });
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}));
app.get("/issues-maintenance/:psid", (req, res) => {
    const psid = req.params.psid;
    res.render("issues-maintenance", {
        psid,
    });
});
app.listen(config_1.default.PORT, () => {
    console.log(`Listening to port ${config_1.default.PORT}`);
});
