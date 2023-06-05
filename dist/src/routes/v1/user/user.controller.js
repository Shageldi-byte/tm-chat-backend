"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../../../validation");
const auth_service_1 = require("../auth/auth.service");
const jwt_service_1 = require("../auth/jwt.service");
const log_service_1 = require("../log/log.service");
const create_modetor_dto_1 = require("./dto/create-modetor.dto");
const user_service_1 = require("./user.service");
const userController = express_1.default.Router();
userController.patch('/update-user-avatar', jwt_service_1.authenticateToken, user_service_1.uploadAvatar.single('image'), log_service_1.addLogMiddleware, user_service_1.updateUserAvatar);
userController.get('/get-moderators-by-shop-uuid', jwt_service_1.authenticateToken, jwt_service_1.checkIsAdmin, user_service_1.getModeratorsByShop);
userController.post('/create-moderator', jwt_service_1.authenticateToken, jwt_service_1.checkIsAdmin, (0, validation_1.makeValidateBody)(create_modetor_dto_1.CreateModeratorDto, false), (0, auth_service_1.checkUsername)(true), auth_service_1.hashPassword, user_service_1.createModerator);
userController.delete('/delete-moderator/:id', jwt_service_1.authenticateToken, jwt_service_1.checkIsAdmin, user_service_1.deleteModerator);
exports.default = userController;
