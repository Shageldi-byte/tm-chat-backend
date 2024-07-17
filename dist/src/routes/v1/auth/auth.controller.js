"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../../../validation");
const auth_service_1 = require("./auth.service");
const check_phone_dto_1 = require("./dto/check-phone.dto");
const check_username_dto_1 = require("./dto/check-username.dto");
const sign_in_dto_1 = require("./dto/sign-in.dto");
const signup_dto_1 = require("./dto/signup.dto");
const authController = express_1.default.Router();
authController.post('/sign-up', (0, validation_1.makeValidateBody)(signup_dto_1.SignupDto, false), (0, auth_service_1.checkUsername)(true), (0, auth_service_1.checkPhoneNumber)(true), auth_service_1.hashPassword, auth_service_1.signUp);
authController.post('/check-username', (0, validation_1.makeValidateBody)(check_username_dto_1.CheckUsernameDto, false), (0, auth_service_1.checkUsername)(false));
authController.post('/check-phone-number', (0, validation_1.makeValidateBody)(check_phone_dto_1.CheckPhoneDto, false), (0, auth_service_1.checkPhoneNumber)(false));
authController.post('/sign-in', (0, validation_1.makeValidateBody)(sign_in_dto_1.SignInDto, false), auth_service_1.signIn);
exports.default = authController;
