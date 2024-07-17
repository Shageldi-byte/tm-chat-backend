"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_dto_1 = __importDefault(require("./dto/shop.dto"));
const express_1 = __importDefault(require("express"));
const validation_1 = require("../../../validation");
const jwt_service_1 = require("../auth/jwt.service");
const jwt_service_2 = require("../auth/jwt.service");
const log_service_1 = require("../log/log.service");
const shop_service_1 = require("./shop.service");
const shopController = express_1.default.Router();
shopController.post('/add-shop', jwt_service_1.authenticateToken, jwt_service_2.checkIsAdmin, (0, validation_1.makeValidateBody)(shop_dto_1.default), log_service_1.addLogMiddleware, shop_service_1.createShop);
shopController.get('/find-all-shops', jwt_service_1.authenticateToken, jwt_service_2.checkIsAdmin, shop_service_1.findAllShops);
shopController.delete('/delete-shop/:id', jwt_service_1.authenticateToken, jwt_service_2.checkIsAdmin, shop_service_1.deleteShop);
exports.default = shopController;
