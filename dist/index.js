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
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const baseURL = 'https://graph.facebook.com/v15.0';
app.post('/webhook', (req, res) => {
    let body = req.body;
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
    if (body.object === 'page') {
        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
        // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
    }
    else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});
app.get('/conversations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield axios_1.default.get(`${baseURL}/${config_1.default.FB_PAGE_ID}/conversations`, {
            params: {
                fields: 'participants',
                access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
            },
        });
        res.send(yield result.data);
    }
    catch (error) {
        res.send(error);
    }
}));
app.get('/conversations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield axios_1.default.get(`${baseURL}/${id}`, {
            params: {
                fields: 'messages{message}',
                access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
            },
        });
        const data = yield result.data;
        res.send(data);
    }
    catch (error) {
        res.send(error);
    }
}));
app.post('/conversations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = yield axios_1.default.post(`${baseURL}/${config_1.default.FB_PAGE_ID}/messages`, {
            params: {
                recipient: { id },
                message: { text: body.message },
                messaging_type: 'RESPONSE',
                access_token: config_1.default.FB_PAGE_ACCESS_TOKEN,
            },
        });
        const data = yield result.data;
        res.send(data);
    }
    catch (error) {
        res.send(error);
    }
}));
app.listen(config_1.default.APP_PORT, () => {
    console.log(`Listening to port ${config_1.default.APP_PORT}`);
});
