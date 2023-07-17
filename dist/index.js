"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./utils/config"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Working!');
});
app.listen(config_1.default.APP_PORT, () => {
    console.log(`Listening to port ${config_1.default.APP_PORT}`);
});
