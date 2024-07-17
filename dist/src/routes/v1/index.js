"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("./auth/auth.controller"));
const chat_controller_1 = __importDefault(require("./chat/chat.controller"));
const express_1 = __importDefault(require("express"));
const shop_controller_1 = __importDefault(require("./shop/shop.controller"));
const user_controller_1 = __importDefault(require("./user/user.controller"));
const v1 = express_1.default.Router();
v1.use('/auth', auth_controller_1.default);
v1.use('/user', user_controller_1.default);
v1.use('/shop', shop_controller_1.default);
v1.use('/chat', chat_controller_1.default);
exports.default = v1;
