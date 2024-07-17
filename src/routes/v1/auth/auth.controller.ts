import express from "express";
import { Post } from "tsoa";
import { makeValidateBody } from "../../../validation";
import { checkPhoneNumber, checkUsername, hashPassword, signIn, signUp } from "./auth.service";
import { CheckPhoneDto } from "./dto/check-phone.dto";
import { CheckUsernameDto } from "./dto/check-username.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignupDto } from "./dto/signup.dto";

const authController = express.Router();


authController.post('/sign-up',makeValidateBody(SignupDto,false),checkUsername(true),checkPhoneNumber(true),hashPassword,signUp);
authController.post('/check-username',makeValidateBody(CheckUsernameDto,false),checkUsername(false));
authController.post('/check-phone-number',makeValidateBody(CheckPhoneDto,false),checkPhoneNumber(false));
authController.post('/sign-in',makeValidateBody(SignInDto,false),signIn);


export default authController;