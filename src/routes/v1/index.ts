import authController from "./auth/auth.controller";
import chatController from "./chat/chat.controller";
import express, { Router } from "express";
import shopController from "./shop/shop.controller";
import userController from "./user/user.controller";

const v1: Router = express.Router();


v1.use('/auth',authController);
v1.use('/user',userController);
v1.use('/shop', shopController);
v1.use('/chat',chatController);
export default v1;